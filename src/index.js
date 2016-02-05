'use strict';

// Creates the standard template for the queue messages
function createMessage(doc, operation) {
  return {
    model: doc.constructor.modelName,
    op:    operation,
    data:  doc
  };
}


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



function createCreatedHook(publisher) {
  return function(next) {
    const wasNew = this.isNew;
    next();
    if(wasNew) {
      const msg = createMessage(this, "created");
      publisher(msg);
    }
  }
}


function createUpdatedHook(publisher) {
  return function(next) {
    const wasUpdated = !this.isNew;
    const modified   = this.modifiedPaths();
    next();
    if(wasUpdated) {
      const msg = createMessage(this, "updated");
      msg.modified = modified;
      publisher(msg);
    }
  }
}


function createDestroyedHook(publisher) {
  return function() {
    const msg = createMessage(this, 'destroyed');
    publisher(msg);
  }
}


function createPlugin(amqpChannel, exchange, routingKey, options) {
  const publisher = createPublisher(amqpChannel, exchange, routingKey, options);

  const createdHook   = createCreatedHook(publisher);
  const updatedHook   = createUpdatedHook(publisher);
  const destroyedHook = createDestroyedHook(publisher);

  return function(schema) {
    schema.pre('save',    createdHook);
    schema.pre('save',    updatedHook);
    schema.post('remove', destroyedHook);
  }
}


module.exports = {
  createMessage:        createMessage,
  createPublisher:      createPublisher,
  createCreatedHook:    createCreatedHook,
  createUpdatedHook:    createUpdatedHook,
  createDestroyedHook:  createDestroyedHook,
  createPlugin:         createPlugin
}
