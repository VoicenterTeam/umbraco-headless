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

    _getDataFromMiddleware(fetch) {
      const {data} = this._axios.post(
        this._getUmbracoDataMiddlewareAPIURI,
        fetch
      )

      return data
    }

    _getFromAPI(fetch) {
        const {data} = this._axios({
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

      if (process.env.NODE_ENV === 'production') {
        return await this._getFromAPI(fetchObject)
      } else {
        return await this._getDataFromMiddleware(fetchObject)
      }
    }
}
