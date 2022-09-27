const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`${JSON.stringify(event, null, 2)}`);
  let response = new Twilio.Response();

  switch (event.EventType) {
    case 'onMessageAdd': {
      response.setBody({body: `${event.Author}: ${event.Body}`})
      break;
    }
    default:{
      console.log('Unknown event type: ', event.EventType);
      response.setStatusCode(422);
    }
  }

  callback(null, response);
};