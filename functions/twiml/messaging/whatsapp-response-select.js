const twilio_version = require('twilio/package.json').version;
const axios = require('axios');

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  console.log(`event: ${JSON.stringify(event)}`);

  const twiml = new Twilio.twiml.MessagingResponse();

  if(!event.To.startsWith('whatsapp:') && !event.To.startsWith('messenger:')) {
    console.log('Not a WhatsApp of Messenger message');
    
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
        // Need to send Content API messages via Messaging API as oppose to TwiML as TwiML does not support Content SID
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

  const client = context.getTwilioClient();

  const accountSID = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;
  const contentAPIUrl = 'https://content.twilio.com/v1/Content';


  try {
    const response = await client.httpClient.request({
      method: 'GET',
      uri: contentAPIUrl,
      username: accountSID,
      password: authToken,
      headers: {}, // header is needed to avoid 401 error
    })

    let map2 = {};

    if( response.statusCode > 299 ) {
      console.log(`Fetching Content API failed with ${response.statusCode}: ${JSON.stringify(response.body)}`);
    } else {
      response.body.contents.forEach(content => { 
        map2[content.friendly_name] = content.sid 
      });
    }
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

  const client = context.getTwilioClient();
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

  // const url = require('url');
  // const data = new url.URLSearchParams(params);
  try {

    const response = await client.httpClient.request({
      method: 'POST',
      uri: messageCreateUrl,
      data: params,
      username: accountSID,
      password: authToken,
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
    })

    // const result = await axios.post(messageCreateUrl, data.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${Buffer.from(`${accountSID}:${authToken}`).toString('base64')}` } });
    // const response = result.data;

    //Guard for error case
    if( response.statusCode > 299 ) {
      console.log(`Sending Message with Content API failed with ${response.statusCode}: ${JSON.stringify(response.body)}`);
      console.log('params: ' + JSON.stringify(params, null, 2));
      return 'Error whilst sending message (Content API) - check logs';
    }
    console.log('data: ' + JSON.stringify(response.body, null, 2));
    return null;
  }
  catch(error) {
    logError(error);
    return 'Error whilst sending message (Content API) - check logs';
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