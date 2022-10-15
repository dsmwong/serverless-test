const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  console.log(`event: ${JSON.stringify(event)}`);

  const twiml = new Twilio.twiml.MessagingResponse();

  if(!event.WaId) {
    console.log('Not a WhatsApp message');
    twiml.message('This is not a WhatsApp message');
    const message = twiml.message(`Echoing: ${event.Body}`);
    if(event.MediaUrl0) {
      // send media back if exists
      message.media(event.MediaUrl0);
    }
  }
  else {
    switch(event.Body) {
      case 'sample_shipping_confirmation': {
        const num_business_days = 3;
        const message = twiml.message(`Your package has been shipped. It will be delivered in ${num_business_days} business days.`);
        break;
      }
      case 'sample_issue_resolution': {
        const name = 'Daniel';
        const message = twiml.message(`Hi ${name}, were we able to solve the issue that you were facing?`);
        break;
      }
      case 'format_response': {
        const message = twiml.message('I am _not_ ~pushing~ throwing away *my* ```code``` !');
        break;
      }
      case 'insert_link': {
        const message = twiml.message(`here's a link in my message: https://www.twilio.com/docs/whatsapp/api`);
        break;
      }
      default: {
        const message = twiml.message(`Echoing: ${event.Body}`);
        if(event.MediaUrl0) {
          // send media back if exists
          message.media(event.MediaUrl0);
        }
      }
    }
  }

  console.log(`Twiml Response: ` + twiml.toString());
  callback(null, twiml);
};