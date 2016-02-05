'use strict';

const hooks = require('./hooks'),
      createCreatedHook   = hooks.createCreatedHook,
      createUpdatedHook   = hooks.createUpdatedHook,
      createDestroyedHook = hooks.createDestroyedHook;

const createPublisher = require('./publisher');

// These are the "Global Options" that will be used when
// creating new plugin instances.  They can be overridden
// by both Factory and Plugin options.
const gOptions = {
  exchange:   'model.events',
  routingKey: ''
};


function createPlugin(fOptions) {
  fOptions = fOptions || {};

  return function(schema, pOptions) {
    const o = Object.assign({}, gOptions, fOptions, pOptions);
    const p = createPublisher(o.channel, o.exchange, o.routingKey, o.options);

    schema.pre('save',    createCreatedHook(p));
    schema.pre('save',    createUpdatedHook(p));
    schema.post('remove', createDestroyedHook(p));
  }
}



module.exports = createPlugin;

