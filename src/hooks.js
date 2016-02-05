
const createMessage = require('./message');


// TODO: Extract this into a separate plugin.
function wasNewHook(next) {
  this.__previously = {
    wasNew:         this.isNew,
    modifiedPaths: this.modifiedPaths()
  }

  next();
}


function createCreatedHook(publisher) {
  return function(doc) {
    if(doc.__previously.wasNew) {
      const msg = createMessage(doc, "created");
      publisher(msg);
    }
  }
}


function createUpdatedHook(publisher) {
  return function(doc) {
    if(!doc.__previously.wasNew) {
      const msg = createMessage(this, "updated");
      msg.modifiedPaths = doc.__previously.modifiedPaths;
      publisher(msg);
    }
  }
}


function createDestroyedHook(publisher) {
  return function(doc) {
    const msg = createMessage(doc, 'destroyed');
    publisher(msg);
  }
}

module.exports = {
  wasNewHook:           wasNewHook,
  createCreatedHook:    createCreatedHook,
  createUpdatedHook:    createUpdatedHook,
  createDestroyedHook:  createDestroyedHook
}
