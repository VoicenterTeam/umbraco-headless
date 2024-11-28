import initOptions from './options';
import generateUmbracoFiles from './generator'
import setupRoutes from './router';
import setupStore from './store';
import setupPlugin from './plugins';
import setupTrailingMiddleware from './serverMiddlewares/trailing';
import setupRedirects from './serverMiddlewares/redirects';

export default async function (moduleOptions) {
  const options = await initOptions.call(this, moduleOptions)

  options.umbracoData = await generateUmbracoFiles.call(this, options)

  if (options?.redirects?.enable === true) {
    setupRedirects.call(this, options)
  }

  setupRoutes.call(this, options);
  setupStore.call(this, options);
  setupPlugin.call(this, options);

  if (options.trailingSlashRedirect === true) {
    setupTrailingMiddleware.call(this, options)
  }

  console.log('Initialized headless, cleaning up')
}

module.exports.meta = require('../package.json');
