const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`event: ${JSON.stringify(event)}`);

  const twiml = new Twilio.twiml.MessagingResponse();

  const message = twiml.message(`Echoing: ${event.Body}`);
  if(event.MediaUrl0) {
    // send media back if exists
    message.media(event.MediaUrl0);
  }
  // Start Code Here
  
  console.log(`Twiml Response: ` + twiml.toString());

  callback(null, twiml);
};