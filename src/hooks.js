
const createMessage = require('./message');

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

module.exports = {
  createCreatedHook:    createCreatedHook,
  createUpdatedHook:    createUpdatedHook,
  createDestroyedHook:  createDestroyedHook
}
