const twilio_version = require('twilio/package.json').version;
const axios = require('axios');

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  console.log(`event: ${JSON.stringify(event)}`);

  const twiml = new Twilio.twiml.MessagingResponse();

  if(!event.WaId && !event.To.startsWith('messenger:')) {
    console.log('Not a WhatsApp message');
    
    twiml.message('This is not a WhatsApp message');
    const message = twiml.message(`Echoing: ${event.Body}`);
    if(event.MediaUrl0) {
      // send media back if exists
      message.media(event.MediaUrl0);
    }
  }
  else {
    const channel = event.To.startsWith('messenger:') ? 'Facebook Messenger' : 'WhatsApp';
    console.log(`Received message from ${channel}`);

    const commandAndBody = event.Body.match(/([a-zA-Z_]+)[\s\t\n]+(.*)/);
    console.log(`commandAndBody: ${JSON.stringify(commandAndBody, null, 2)}`);

    const command = (commandAndBody && commandAndBody[1]) ? commandAndBody[1] : event.Body;

    switch(command) {
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
      case 'content_api': {
        const templateFriendlyName = commandAndBody[2];
        const message = await sendContentAPIMessage(templateFriendlyName, context, event);
        twiml.message(message);
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

/// Fetch Content API Templates
async function getContentAPITemplates(context, event) {

  const accountSID = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;
  const contentAPIUrl = 'https://content.twilio.com/v1/Content';

  try {
    const result = await axios.get(contentAPIUrl, {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${Buffer.from(`${accountSID}:${authToken}`).toString('base64')}` 
      } 
    });
    const response = result.data;

    let map2 = {};
    response.contents.forEach(content => { 
      map2[content.friendly_name] = content.sid 
    });
    return map2
  } catch(error) { 
    logError(error);
    return {};
  }
}


/// Send Message
async function sendContentAPIMessage(contentFriendlyName, context, event) {

  const contents = await getContentAPITemplates(context, event);
  console.log(`contents: ${JSON.stringify(contents, null, 2)}`);

  if( !contents[contentFriendlyName] ) {
    console.log(`Error: Friendly name not found ${contentFriendlyName}`);
    return `Error: Friendly name not found ${contentFriendlyName}`;
  }
  
  const contentsSID = contents[contentFriendlyName];

  const accountSID = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;
  const messageCreateUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`;

  const contentVariables = {
    '1': 'Daniel',
    '2': 'Basketball'
  }

  const params = {
    'To': event.From,
    //'From': event.To,
    'From': context.MSG_SERVICE_SID,
    'ContentSid': contentsSID,
    'ContentVariables': JSON.stringify(contentVariables)
  }

  const url = require('url');
  const data = new url.URLSearchParams(params);
  try {
    const result = await axios.post(messageCreateUrl, data.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${Buffer.from(`${accountSID}:${authToken}`).toString('base64')}` } });
    const response = result.data;
    console.log('data: ' + JSON.stringify(response, null, 2));
    return '';
  }
  catch(error) {
    logError(error);
    return 'Error whilst creating message';
    //console.log(error.config);
  }  
}

/// Handle error
function logError(error) {

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
}