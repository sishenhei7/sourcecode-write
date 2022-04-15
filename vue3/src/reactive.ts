interface EffectFunc extends Function {
  deps: any[]
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
  const funcSet = new Set<Function>(weakMap?.get(target)?.get(property))
  funcSet.forEach((func: Function) => func !== activeEffectFunc && func())
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
      // return target[property]
    },
    set(target: Record<string, any>, property: string, value: any, receiver: any) {
      if (target[property] !== value) {
        // target[property] = value
        trigger(target, property)
        return Reflect.set(target, property, value, receiver)
      }
      return true
    },
  })
}

export function effect(func: Function) {
  const effectFunc: EffectFunc = (...args: any[]) => {
    const lastFunc = activeEffectFunc
    activeEffectFunc = effectFunc
    func(...args)
    activeEffectFunc = lastFunc
  }
  effectFunc.deps = []
  effectFunc()
}
