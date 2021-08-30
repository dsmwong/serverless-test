const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();
  const messageResponse = []
  
  // Promise is done non-blocking asynchronously.
  const message1Promise = client.messages.create({
    to: event.recipient,
    from: context.SENDER_NUMBER,
    body: 'This Message 1'
  });

  const message2Promise = client.messages.create({
    to: event.recipient,
    from: context.SENDER_NUMBER,
    body: 'This Message 2'
  });

  // Promise.all() waits for all the above promises to be resolved. 
  Promise.all([message1Promise, message2Promise]).then(messages => {
    messages.forEach((message, index) => {
      console.log(`${index+1}: ${message.sid}`);
      messageResponse.push(message)
    })
    return callback(null, {status: 'ok', responses: messageResponse});
  }).catch(err => {
    console.log(err);
    return callback(err);
  });

};