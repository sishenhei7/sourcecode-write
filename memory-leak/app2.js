const fs = require('fs');
const v8 = require('v8');
const express = require('express');
const console = require('console');
const levenshtein = require('fast-levenshtein');
const HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100 = 200;
const someFakeModule = (function someFakeModule() {
  return {
    calculateStringDistance(a, b) {
      //Here's where heavy sunchronous computation happens
      return levenshtein.get(a, b, {
        useCollator: true
      })
    }
  }
})()
const app = express();
let arr = []
app.get('/', (req, res) => {
  res.send(`
    <h2>Take a look at the network tab in devtools</h2>
    <script>
        function loops(func) {
          return func().then(_ => setTimeout(loops, 20, func))
        }
        loops(_ => fetch('api/tick'))
  </script>
  `)
});
app.get('/api/tick', (req, res) => {
  Promise.resolve('asynchronous flow will make our stacktrace more realistic'.repeat(HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100))
    .then(text => {
      const randomText = Math.random().toString(32).repeat(HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100)
      arr.push(randomText)
      return someFakeModule.calculateStringDistance(text, '123')
    })
    .then(result => res.end(`result: ${result}, ${arr.length}`))
});
app.get('/api/end', () => process.exit())
app.listen(8080, () => {
  console.log(`go to http://localhost:8080/ to generate traffic`)
})

function createHeapSnapshot() {
  const snapshotStream = v8.getHeapSnapshot();
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `${Date.now()}.heapsnapshot`;
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
  console.log('creating heap snapshot', fileName);
}

createHeapSnapshot();
setInterval(createHeapSnapshot, 10 * 1000);
