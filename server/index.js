// NOTE: This file remains only as an example, not used now

const serverless = require('serverless-http');
const app = require('./src').default;

// Explicitly export the handler
const handler = serverless(app);
module.exports = { handler }; // CommonJS named export
