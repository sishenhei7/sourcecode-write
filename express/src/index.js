import App from '../lib/index.js'

const app = new App()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/id/:id', function (req, res) {
  res.json(req.params)
});

app.post('/test-post', function (req, res) {
  res.json({
    success: true,
    result: req.params
  })
});

app.get('/clear-cookie', function (req, res) {
  res.clearCookie('test-cookie')
  res.send('cookie cleared')
});

app.get('/cookie', function (req, res) {
  res.cookie('test-cookie', true)
  res.send('test cookie: test-cookie')
});

app.get('/header', function (req, res) {
  res.set('x-test-headers', 'test')
  res.send('test header: x-test-headers')
});

app.get('/json', function (req, res) {
  res.json({
    success: true,
    result: null
  })
});

app.get('/download', function (req, res) {
  res.download('./src/test.js', 'filename.js');
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});
