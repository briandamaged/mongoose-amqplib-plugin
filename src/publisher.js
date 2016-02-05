'use strict';

function createPublisher(amqpChannel, exchange, routingKey, options) {
  exchange   = exchange   || 'model.events';
  routingKey = routingKey || '';

  return function(msg) {
    if(typeof(msg) === 'object') {
      msg = JSON.stringify(msg);
    }

    if(!(msg instanceof Buffer) ) {
      msg = new Buffer(msg);
    }
    
    amqpChannel.publish(exchange, routingKey, msg, options);
  }
}

module.exports = createPublisher;
