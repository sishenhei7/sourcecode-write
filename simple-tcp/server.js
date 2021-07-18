import net from 'net'

const port = 1337
const host = 'localhost'
const server = net.createServer()

server.on('connection', (socket) => {
  console.log('Buffer size : ' + socket.writableLength);

  console.log('---------server details -----------------');

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);

  var lport = socket.localPort;
  var laddr = socket.localAddress;
  console.log('Server is listening at LOCAL port' + lport);
  console.log('Server LOCAL ip :' + laddr);

  console.log('------------remote client info --------------');

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  console.log('REMOTE Socket is listening at port' + rport);
  console.log('REMOTE Socket ip :' + raddr);
  console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);

  console.log('--------------------------------------------')
  //var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections(function (error, count) {
    console.log('Number of concurrent connections to the server : ' + count);
  });
  socket.setEncoding('utf8');
  socket.setTimeout(800000, function () {
    // called after timeout -> same as socket.on('timeout')
    // it just tells that soket timed out => its ur job to end or destroy the socket.
    // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
    // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
    console.log('Socket timed out');
  });
  socket.on('data', function (data) {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    console.log('Bytes read : ' + bread);
    console.log('Bytes written : ' + bwrite);
    console.log('Data sent to server : ' + data);

    //echo data
    var is_kernel_buffer_full = socket.write('Data ::' + data);
    if (is_kernel_buffer_full) {
      console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
    } else {
      socket.pause();
    }
  });
  socket.on('drain', function () {
    console.log('write buffer is empty now .. u can resume the writable stream');
    socket.resume();
  });

  socket.on('error', function (error) {
    console.log('Error : ' + error);
  });

  socket.on('timeout', function () {
    console.log('Socket timed out !');
    socket.end('Timed out!');
    // can call socket.destroy() here too.
  });

  socket.on('end', function (data) {
    console.log('Socket ended from other end!');
    console.log('End data : ' + data);
  })
  socket.on('close', function (error) {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    console.log('Bytes read : ' + bread);
    console.log('Bytes written : ' + bwrite);
    console.log('Socket closed!');
    if (error) {
      console.log('Socket was closed coz of transmission error');
    }
  });

  setTimeout(function () {
    var isdestroyed = socket.destroyed;
    console.log('Socket destroyed:' + isdestroyed);
    socket.destroy();
  }, 1200000);
})

server.on('error', (err) => {
  throw err
})

server.maxConnections = 10;
server.listen(port, host)

server.on('listening', () => {
  console.log(`server listening ${host}:${port}`)
})
