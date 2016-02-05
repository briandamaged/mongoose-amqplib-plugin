'use strict';

// Creates the standard template for the queue messages
function createMessage(doc, operation) {
  return {
    model: doc.constructor.modelName,
    op:    operation,
    data:  doc
  };
}

module.exports = createMessage;
