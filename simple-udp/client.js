import dgram from 'dgram'
import { Buffer } from 'buffer'

const client = dgram.createSocket('udp4')
const data = Buffer.from('test')
const port = 41234

client.on('message', function (msg, info) {
  console.log('Data received from server : ' + msg.toString())
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port)
})

client.send(data, port, 'localhost', function (error) {
  if (error) {
    client.close()
  } else {
    console.log('Data sent !!!')
  }
})

const data1 = Buffer.from('hello')
const data2 = Buffer.from('world')

client.send([data1, data2], port, 'localhost', function (error) {
  if (error) {
    client.close();
  } else {
    console.log('Data sent !!!');
  }
});