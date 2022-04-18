interface EffectFunc extends Function {
  deps?: Set<EffectFunc>[]
}

const weakMap = new WeakMap<object>()

function track(target: Record<string, any>, property: string) {
  let map = weakMap.get(target)
  if (!map) {
    weakMap.set(target, (map = new Map<string, EffectFunc>()))
  }
  let funcSet = map.get(property)
  if (!funcSet) {
    map.set(property, (funcSet = new Set<EffectFunc>()))
  }
  funcSet.add(activeEffectFunc)
  activeEffectFunc?.deps?.push(funcSet)
}

function trigger(target: Record<string, any>, property: string) {
  const funcSet = new Set<EffectFunc>(weakMap?.get(target)?.get(property))
  funcSet?.forEach((func: EffectFunc) => func())
}

let activeEffectFunc: EffectFunc | null
export function reactive<T extends object>(obj: T) {
  return new Proxy<T>(obj, {
    get(target: Record<string, any>, property: string) {
      track(target, property)
      return target[property]
    },
    set(target: Record<string, any>, property: string, value: any) {
      if (target[property] !== value) {
        target[property] = value
        trigger(target, property)
      }

      return true
    }
  })
}

export function effect (func: EffectFunc) {
  const effectFunc: EffectFunc = (...args: any[]) => {
    for (const funcSet of (effectFunc?.deps || [])) {
      funcSet.delete(effectFunc)
    }
    activeEffectFunc = effectFunc
    func(args)
    activeEffectFunc = null
  }
  effectFunc.deps = []
  effectFunc()
}
