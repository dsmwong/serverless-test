const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(JSON.stringify(event, null, 2));

  const twiml = new Twilio.twiml.VoiceResponse();
  const dial = twiml.dial({
    action: 'https://dawong.au.ngrok.io/debug/console-output'
  });
  const application = dial.addChild('Application', {
    copyParentTo: 'true'
  });
  application.addChild('ApplicationSid').addText('APefd5fd421eda4ae361d0cf085338c41e');
  application.addChild('Parameter', {
    name: 'foo1',
    value: 'bar1'
  })
  application.addChild('Parameter', {
    name: 'foo2',
    value: 'bar2'
  })
  //const application = dial.application();


  //const client = context.getTwilioClient();

  // Start Code Here
  
  const response = twiml.toString()

  callback(null, twiml);
};