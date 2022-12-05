const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  console.time('last-interaction-exec-time');

  const to = event.To;
  const from = event.From;
  const searchPeriod = event.SearchPeriodInSec || 30;
  const type = event.Type || 'calls';

  const startTimeKey = event.Type === 'calls' ? 'startTimeAfter' : 'dateSentAfter';

  const now = new Date();
  const searchStart = new Date(now.getTime() - searchPeriod * 1000);

  const client = context.getTwilioClient();
  const parameters = {to: to, from: from, [startTimeKey]: searchStart};
  console.log(`Searching for ${type} with parameters ${JSON.stringify(parameters)}`);

  const interactions = await client[type].list({to: to, from: from, [startTimeKey]: searchStart});

  console.log(`Found ${interactions.length} interactions of type ${type}`);
  if( interactions.length > 0 ) {
    console.log(`Last intraction was ${interactions[0].sid}`);
  }

  console.timeEnd('last-interaction-exec-time');
  callback(null, interactions[0]);
};