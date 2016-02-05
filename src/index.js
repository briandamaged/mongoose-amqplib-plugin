'use strict';

const hooks = require('./hooks'),
      createCreatedHook   = hooks.createCreatedHook,
      createUpdatedHook   = hooks.createUpdatedHook,
      createDestroyedHook = hooks.createDestroyedHook;

const createPublisher = require('./publisher');

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
  createPublisher:      createPublisher,
  createPlugin:         createPlugin
}
