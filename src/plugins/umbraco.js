export default class JsonWorker {
  _namespace;
  _getUmbracoDataAPI;
  _getUmbracoDataMiddlewareAPIURI;

  constructor({namespace, getUmbracoDataAPI, getUmbracoDataMiddlewareAPIURI, site, axios}) {
    this._namespace = namespace;
    this._getUmbracoDataAPI = getUmbracoDataAPI;
    this._getUmbracoDataMiddlewareAPIURI = getUmbracoDataMiddlewareAPIURI;
    this._site = site
    this._axios = axios;
  }

  async _getFromAPI(fetch) {
    const {data} = await this._axios({
      method: 'post',
      withCredentials: false,
      url: this._getUmbracoDataAPI,
      data: {
        ...fetch,
        site: this._site
      }
    })

    return data
  }

  async getNodeData({ fetch, include, ignore }) {
    const fetchObject = {
      ...fetch,
      include,
      ignore
    }


    return await this._getFromAPI(fetchObject)
  }
}
