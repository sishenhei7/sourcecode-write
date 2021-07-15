import net from 'net'

const client = new net.Socket()
const serverPort = 1337
const serverHost = 'localhost'

client.connect(serverPort, serverHost, () => {
  console.log('Connected')
  client.write('Hello, server! Love, Client.')
})

client.on('data', (data) => {
  console.log('Received: ' + data);
  client.destroy(); // kill client after server's response
})

client.on('close', () => {
  console.log('Connection closed')
})

