const path = require('path');
const isDev = think.env === 'development';
const router = require('think-router');
const routerREST = require('think-router-rest');
const cors = require('@koa/cors');
module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: true,
      sendResponseTime: isDev
    }
  },
  {
    handle: cors
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb'
    }
  },
  {
    handle: router,
    options: {}
  },
  {handle: routerREST, options: {}},
  'logic',
  'controller'
];
