const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();
  const messageResponse = []

  try {
    // Async/Await must be done in a try/catch

    // await is blocking, so it will wait until the call is completed
    const message1 = await client.messages.create({
      to: event.recipient,
      from: context.SENDER_NUMBER,
      body: 'This Message 1'
    })

    console.log(`1: ${message1.sid}`);
    messageResponse.push(message1);

    const message2 = await client.messages.create({
      to: event.recipient,
      from: context.SENDER_NUMBER,
      body: 'This Message 2'
    })

    console.log(`2: ${message2.sid}`);
    messageResponse.push(message2);

  } catch (err) {
    console.log(err);
    return callback(err);
  }

  return callback(null, {status: 'ok', responses: messageResponse});
};