import Watcher from './watcher'

Watcher.prototype.mutations = {
  setData(states, data) {
    states.data = data
  }
}

Watcher.prototype.commit = function(name, ...args) {
  const { mutations } = this
  if (mutations[name]) {
    mutations[name].apply(this, [this.states, ...args])
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}

export function mapStates(mapper) {
  const res = {}
  Object.keys(mapper).forEach((key) => {
    const value = mapper[key]
    let fn
    if (typeof value === 'string') {
      fn = function() {
        return this.store.states[value]
      }
    } else if (typeof value === 'function') {
      fn = function() {
        return value.call(this, this.store.states)
      }
    } else {
      console.error('invalid value type')
    }
    if (fn) {
      res[key] = fn
    }
  })
  return res
}

export default Watcher
