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

  async _getDataFromMiddleware(fetch) {
    console.log('_getDataFromMiddleware!')
    const {data} = await this._axios({
      method: 'post',
      withCredentials: false,
      url: this._getUmbracoDataMiddlewareAPIURI,
      data: fetch
    })

    console.log('_getDataFromMiddleware, result of getting the data:', Object.keys(data))

    return data
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
    console.log('getNodeData', fetchObject)
    console.log('process.client', process.client)
    if (process.client) {
      console.log('getNodeData -> _getFromAPI')
      return await this._getFromAPI(fetchObject)
    } else {
      console.log('getNodeData -> _getDataFromMiddleware')
      return await this._getDataFromMiddleware(fetchObject)
    }
  }
}
