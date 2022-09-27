const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.say('Start of Say');
  twiml.play({digits: 'www3'}, '');
  twiml.say('End of Say');
  
  callback(null, twiml);
};