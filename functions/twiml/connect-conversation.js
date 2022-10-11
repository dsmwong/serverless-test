const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`event: ${JSON.stringify(event)}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  const connect = twiml.connect();
  connect.addChild('Conversation', {
    serviceInstanceSid: context.CONVERSATION_SERVICE_SID,
  })

  console.log(twiml.toString());
  callback(null, twiml);
};