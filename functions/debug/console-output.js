const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(JSON.stringify(event, null, 2));

  const twiml = new Twilio.twiml.VoiceResponse();
  const say = twiml.say({voice:'Polly.Amy-Neural'},'You came back to the Calling Application! Well Done!');
  const hangup = twiml.hangup();
  
  callback(null, twiml);
};