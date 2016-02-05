'use strict';

const hooks = require('./hooks'),
      wasNewHook          = hooks.wasNewHook,
      createCreatedHook   = hooks.createCreatedHook,
      createUpdatedHook   = hooks.createUpdatedHook,
      createDestroyedHook = hooks.createDestroyedHook;

const createPublisher = require('./publisher');

const defaultOptions = require('./options');

function plugin(schema, o) {
  o = Object.assign({}, defaultOptions, o);
  const p = createPublisher(o.channel, o.exchange, o.routingKey, o.options);

  schema.pre('save', wasNewHook);
  schema.post('save',   createCreatedHook(p));
  schema.post('save',   createUpdatedHook(p));
  schema.post('remove', createDestroyedHook(p));
}


module.exports = plugin;
