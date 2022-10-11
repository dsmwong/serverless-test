const twilio_version = require('twilio/package.json').version;

const debug = require('debug');
const logger_info = debug('functions:debug:info');
const logger_debug = debug('functions:debug:debug');

exports.handler = function(context, event, callback) {

  // Set .env FUNCTION_DEBUG to 'functions:*' to see this
  if( context.FUNCTION_DEBUG) { debug.enable(context.FUNCTION_DEBUG); }
  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  logger_info(`twiml: ${twiml.toString()}`);
  const client = context.getTwilioClient();
  logger_debug(`client: ${client}`);

  // Start Code Here
  
  const response = twiml.toString()
  logger_debug(`response: ${response}`);

  callback(null, response);
};