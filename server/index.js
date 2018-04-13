const matchers = require('../matchers');
const logger = require('../helpers/logger');
const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  logger.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg) => {
  msg.toString('utf8').split('\n').forEach(line => matchers(line));
});

server.on('listening', () => {
  const address = server.address();
  logger.info(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
