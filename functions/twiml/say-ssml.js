const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(JSON.stringify(event, null, 2));


  const twiml = new Twilio.twiml.VoiceResponse();

  if( event.SpeechResult ) {
    twiml.say({voice:'Polly.Russell'}, `You last said ${event.SpeechResult}`);
  }

  const gatherElem = twiml.gather({
    language:'en-AU',
    
    input: 'speech',
    
    hints: 'yes, no, pass',
  });

  const sayElem = gatherElem.say({voice:'Polly.Amy-Neural'},'');

  // const sayElem = twiml.say({voice:'Polly.Amy-Neural'},'');

  sayElem.addText('How Do you spell Twilio');
  sayElem.prosody({
    rate: '75%',
  }, '').addChild('say-as', {
    'interpret-as': 'spell-out'
  }).addText('twilio');

  // const gatherElem = twiml.gather({
  //   language:'pt-BR',
  //   input: 'speech',
  //   hints: 'sim, nao, congonhas, recife',
  //   action: 'https://webhooks.twilio.com/v1/Accounts/AC359ef7f86a079810ec282cb28e363fa7/Flows/FW04692370ffba5b0ac0197421b04d5a68?FlowEvent=return'
  // });

  // const sayElem = gatherElem.say({voice:'Polly.Camila-Neural'},'');

  // sayElem.addText('How Do you spell Twilio');
  // sayElem.prosody({
  //   rate: '75%',
  // }, '').addChild('say-as', {
  //   'interpret-as': 'spell-out'
  // }).addText('twilio');

  twiml.redirect();
  
  callback(null, twiml);
};


/*

<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy-Neural">
    <amazon:domain name="conversational">
    <prosody rate="slow">Thank You for calling. We are currently experiencing technical difficulties. Please try your call again later.  Investigations are on-going.
      </prosody>
      Please say 
    <prosody rate="75%"><say-as interpret-as="spell-out">ABC123</say-as></prosody>
      <!-- <audio src="cowbell.mp3">cow bell</audio> -->
    </amazon:domain>
    <amazon:effect name="whispered">There is a mouse in the house! Residents reported numerous sightings.</amazon:effect>
  </Say>
</Response>

*/