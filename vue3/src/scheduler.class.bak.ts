const p = Promise.resolve()
class Job {
  isFlushing = false
  tasks = new Set<Function>()
  constructor() { }
  flush() {
    if (this.isFlushing) return
    this.isFlushing = true
    p.then(() => {
      this.tasks.forEach(task => task())
    })
    this.tasks.clear()
  }
  addTask(task: Function) {
    this.tasks.add(task)
  }
}
export default new Job()