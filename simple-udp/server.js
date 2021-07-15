import dgram from 'dgram'

const server = dgram.createSocket('udp4')
const port = 41234

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`)
  server.close()
});

server.on('message', (msg, req) => {
  server.send(msg, req.port, req.address, () => {
    console.log(`server got: ${msg} from ${req.address}:${req.port}`)
  })
});

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
});

server.bind(port)
// Prints: server listening 0.0.0.0:41234