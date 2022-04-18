interface EffectFunc extends Function {
  deps: any[]
  options?: EffectOptions
}

interface EffectOptions {
  scheduler: Function
}

const weakMap = new WeakMap<object, any>()
let activeEffectFunc: EffectFunc

function track(target: any, property: string | Symbol) {
  if (activeEffectFunc) {
    cleanup(activeEffectFunc)

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
    const lastFunc = activeEffectFunc
    activeEffectFunc = effectFunc
    const res = func(...args)
    activeEffectFunc = lastFunc
    return res
  }
  effectFunc.deps = []
  effectFunc.options = options
  return effectFunc()
}

export function computed(func: Function) {
  let value: any
  let isDirty = true
  return {
    get value() {
      if (isDirty) {
        value = effect(func, {
          scheduler() {
            isDirty = true
          }
        })
        isDirty = false
      }
      return value
    }
  }
}
