import JsonWorker from './umbraco'

const namespace = <%= JSON.stringify(options.namespace) %>;
const getUmbracoDataAPI = <%= JSON.stringify(options.getUmbracoDataAPI) %>;
const getUmbracoDataMiddlewareAPIURI = <%= JSON.stringify(options.getUmbracoDataMiddlewareAPIURI) %>;
const site = <%= JSON.stringify(options.site) %>;

export default (ctx, inject) => {
    const jsonWorker = new JsonWorker({namespace, getUmbracoDataAPI, getUmbracoDataMiddlewareAPIURI, site, axios: ctx.$axios});

    inject(namespace, {
        get(context, fetchObject) {
            return jsonWorker.getNodeData(fetchObject);
        }
    })
}
