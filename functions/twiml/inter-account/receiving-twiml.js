const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  
  console.log(JSON.stringify(event, null, 2));
  
  const twiml = new Twilio.twiml.VoiceResponse();
  const say = twiml.say({voice:'Polly.Amy-Neural'},'You have reached the Receiving Application! Well Done!');
  const hangup = twiml.hangup();
  hangup.addChild('Parameter', {
    name: 'return-foo1',
    value: 'return-bar1'
  })
  hangup.addChild('Parameter', {
    name: 'return-foo2',
    value: 'return-bar2'
  })
  //const application = dial.application();


  //const client = context.getTwilioClient();

  // Start Code Here
  
  const response = twiml.toString()

  callback(null, twiml);
};