'use strict';

const hooks = require('./hooks'),
      wasNewHook          = hooks.wasNewHook,
      createCreatedHook   = hooks.createCreatedHook,
      createUpdatedHook   = hooks.createUpdatedHook,
      createDestroyedHook = hooks.createDestroyedHook;

const createPublisher = require('./publisher');

function plugin(schema, o) {
  o = Object.assign({}, plugin.defaultOptions, o);
  const p = createPublisher(o.channel, o.exchange, o.routingKey, o.options);

  schema.pre('save', wasNewHook);
  schema.post('save',   createCreatedHook(p));
  schema.post('save',   createUpdatedHook(p));
  schema.post('remove', createDestroyedHook(p));
}


plugin.defaultOptions = {
  exchange:   'model.events',
  routingKey: ''
};

module.exports = plugin;
