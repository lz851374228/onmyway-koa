const Router = require('koa-router')
const requireDirectory = require("require-directory");

function initRoutes(app){
  const modules = requireDirectory(module, "./modules", {
    visit: whenLoadModule,
  });
  function whenLoadModule(obj) {
    if (obj instanceof Router) {
      app.use(obj.routes(), obj.allowedMethods());
    }
  }
}

module.exports = initRoutes;
