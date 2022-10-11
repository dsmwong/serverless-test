const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`${JSON.stringify(event, null, 2)}`);
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  try {
    switch (event.EventType) {
      case 'onMessageAdd': {
        //response = {body: `${event.Author}: ${event.Body}`}
        response.setStatusCode(200);
        response.setBody({body: `${event.Author}: ${event.Body}`});
        console.log(`onMessageAdd: ${JSON.stringify(response, null, 2)}`);
        break;
      }
      default:{
        console.log('Unknown event type: ', event.EventType);
        response.setStatusCode(422);
      }
    }

    return callback(null, response);
  } catch (err) {
    console.log('Error: ', err);
    response.setStatusCode(500);
    return callback(null, response);
  }
};