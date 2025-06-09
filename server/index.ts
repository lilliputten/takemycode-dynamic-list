// NOTE: This file remains only as an example, not used now

import serverless from 'serverless-http';

import app from './src';

// Export as CommonJS for Vercel compatibility
module.exports = serverless(app);
