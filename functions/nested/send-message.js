const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();
  const messageResponse = []

  // Sequential call in a nested loop, so once call is complete, the next call needs to be in the then()
  client.messages.create({
    to: event.recipient,
    from: context.SENDER_NUMBER,
    body: 'This Message 1'
  }).then(message1 => {
    console.log(`1: ${message1.sid}`);
    messageResponse.push(message1);
    client.messages.create({
      to: event.recipient,
      from: context.SENDER_NUMBER,
      body: 'This Message 2'
    }).then(message2 => {
      console.log(`2: ${message2.sid}`);
      messageResponse.push(message2);
      return callback(null, {status: 'ok', responses: messageResponse});
    }).catch(err => {
      console.log(err);
      return callback(err);
    })
  }).catch(err => {
    console.log(err);
    return callback(err);
  });

};