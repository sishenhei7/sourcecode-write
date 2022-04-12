const weakMap = new WeakMap<object, any>();
let activeEffectFunc: Function;

function track(target: any, property: string | Symbol) {
  if (activeEffectFunc) {
    let map = weakMap.get(target);
    if (!map) {
      weakMap.set(target, (map = new Map<string | Symbol, any>()));
    }
    let funcSet = map.get(property);
    if (!funcSet) {
      map.set(property, (funcSet = new Set<Function>()));
    }
    funcSet.add(activeEffectFunc);
  }
}

function trigger(target: any, property: string | Symbol) {
  const funcList = weakMap?.get(target)?.get(property);
  if (funcList?.size > 0) {
    funcList.forEach((func: Function) => func());
  }
}

export function reactive(obj: object): any {
  return new Proxy(obj, {
    get(target, property) {
      track(target, property);
      return (target as any)[property];
    },
    set(target, property, value) {
      (target as any)[property] = value;
      trigger(target, property);
      return true;
    },
  });
}

export function effect(func: Function) {
  return () => {
    const lastFunc = activeEffectFunc;
    activeEffectFunc = func;
    func();
    activeEffectFunc = lastFunc;
  }
}

