# mongoose-amqplib-plugin #

Publish Mongoose models over AMQP.

## Installation ##

```shell
npm install --save mongoose-amqplib-plugin
```

## Usage ##

```javascript
var amqpPlugin = require('mongoose-amqplib-plugin');


// Create an instance of the plugin, and override all of
// the possible options.
Schema1.plugin(amqpPlugin, {
  channel:    amqpChannelInstance,

  // For more information about these options, see:
  //   http://www.squaremobius.net/amqp.node/channel_api.html#channel_publish
  exchange:   'the.exchange.name',
  routingKey: 'the.routing.key',
  options:    {persistent: true}
});


// This time, we'll just use the default values for the
// options.  These are:
//
//  exchange:   'model.events',
//  routingKey: '',
//  options:    undefined
//
Schema2.plugin(amqpPlugin, {
  channel:    amqpChannelInstance
});


// Of course, maybe you don't like those default options.
// Fine -- just change them.
amqpPlugin.defaultOptions = {
  exchange: "my.better.name",
  options:  {
    persistent: true
  }
};
```
