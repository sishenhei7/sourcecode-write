interface EffectFunc extends Function {
  deps: any[]
  options?: EffectOptions
}

interface EffectOptions {
  scheduler?: Function
  lazy?: boolean
}

interface WatchOptions {
  immediate?: boolean
  flush?: 'pre' | 'post'
}

export const weakMap = new WeakMap<object, any>()
let activeEffectFunc: EffectFunc

function track(target: any, property: string | Symbol) {
  if (activeEffectFunc) {
    let map = weakMap.get(target)
    if (!map) {
      weakMap.set(target, (map = new Map<string | Symbol, any>()))
    }
    let funcSet = map.get(property)
    if (!funcSet) {
      map.set(property, (funcSet = new Set<Function>()))
    }
    funcSet.add(activeEffectFunc)

    activeEffectFunc.deps.push(funcSet)
  }
}

function trigger(target: any, property: string | Symbol) {
  const funcSet = new Set<EffectFunc>(weakMap?.get(target)?.get(property))
  for (const func of funcSet) {
    if (func !== activeEffectFunc) {
      if (func?.options?.scheduler) {
        func.options.scheduler(func)
      } else {
        func()
      }
    }
  }
}

function cleanup(effectFunc: EffectFunc) {
  for (const dep of effectFunc.deps) {
    dep.delete(effectFunc)
  }
  effectFunc.deps.length = 0
}

export function reactive<T extends object>(obj: T) {
  return new Proxy<T>(obj, {
    get(target: Record<string, any>, property: string, receiver: any) {
      track(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target: Record<string, any>, property: string, value: any, receiver: any) {
      if (target[property] !== value) {
        const res = Reflect.set(target, property, value, receiver)
        trigger(target, property)
        return res
      }
      return true
    },
  })
}

export function effect(func: Function, options?: EffectOptions) {
  const effectFunc: EffectFunc = (...args: any[]) => {
    cleanup(effectFunc)

    const lastFunc = activeEffectFunc
    activeEffectFunc = effectFunc
    const res = func(...args)
    activeEffectFunc = lastFunc

    return res
  }
  effectFunc.deps = []
  effectFunc.options = options
  return options?.lazy ? effectFunc : effectFunc()
}

export function computed(func: Function) {
  let value: any
  let isDirty = true
  const obj = {
    get value() {
      if (isDirty) {
        const effectFunc = effect(func, {
          scheduler() {
            isDirty = true
            trigger(obj, 'value')
          }
        })
        value = effectFunc()
        track(obj, 'value')
        isDirty = false
      }
      return value
    }
  }
  return obj
}

function traverse(value: any, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}

export function watch(obj: object | Function, cb: Function, options?: WatchOptions) {
  let newVal: any, oldVal: any, cleanup: Function
  const func = () => typeof obj === 'object' ? traverse(obj) : obj()
  const onValidate = (fn: Function) => cleanup = fn
  const job = () => {
    if (cleanup) {
      cleanup()
    }

    newVal = effectFunc()
    cb(newVal, oldVal, onValidate)
    oldVal = newVal
  }
  const effectFunc = effect(func, {
    lazy: true,
    scheduler() {
      if (options?.flush === 'post') {
        Promise.resolve().then(job)
      } else {
        job()
      }
    }
  })

  if (options?.immediate) {
    job()
  } else {
    oldVal = effectFunc()
  }
}

export function setRefMark(obj: any) {
  Object.defineProperty(obj, '__is_ref', {
    get value() {
      return true
    }
  })
}

export function ref<T extends number | string | boolean>(value: T) {
  const ret = {
    value
  }
  setRefMark(ret)
  return reactive(ret)
}

export function toRef<T extends object>(obj: T, key: keyof T) {
  const ret = {
    value: obj[key]
  }
  setRefMark(ret)
  return reactive(ret)
}

export function toRefs<T extends object>(obj: T) {
  const ret = {} as any
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  setRefMark(ret)
  return ret
}

export function proxyRef(obj: any) {
  return new Proxy(obj, {
    get(target: any, property: string, receiver: any) {
      const ret = Reflect.get(target, property, receiver)
      return target.__is_ref ? ret.value : ret
    },
    set(target: any, property: string, value: any, receiver: any) {
      const ret = target[property]

      if (ret.__is_ref) {
        ret.value = value
        return true
      }

      return Reflect.set(target, property, value, receiver)
    }
  })
}
