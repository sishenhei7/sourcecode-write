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
    map.set(property, (funcSet = new Set<Function>(funcSet || null)))
    funcSet.add(activeEffectFunc)

    activeEffectFunc.deps.push(funcSet)
  }
}

function trigger(target: any, property: string | Symbol) {
  const funcSet = weakMap?.get(target)?.get(property)
  funcSet.forEach((func: Function) => func())
}

function cleanup(effectFunc: EffectFunc) {
  for (const dep of effectFunc.deps) {
    dep.delete(effectFunc)
  }
  effectFunc.deps.length = 0
}

export function reactive(obj: object): any {
  return new Proxy(obj, {
    get(target, property) {
      track(target, property)
      return (target as any)[property]
    },
    set(target, property, value) {
      ;(target as any)[property] = value
      trigger(target, property)
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
