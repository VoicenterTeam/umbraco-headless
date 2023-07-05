const { proceedInclude, proceedIgnore } = require('../helper/objectWorker')
const { getByPath, getByContentType } = require('../helper/helper')

export default function ({ umbracoData, getUmbracoDataMiddlewareAPIURI }) {
  this.addServerMiddleware({
    path: getUmbracoDataMiddlewareAPIURI,
    handler: (req, res) => {
      if (req.method === 'POST') {
        const { include, ignore, type, pattern } = req.body

        let result = umbracoData

        switch (type) {
          case 'path':
            result = getByPath(result, pattern)
            break
          case 'contentType':
            result = getByContentType(result, pattern)
        }

        if (Array.isArray(include) && include.length > 0) {
          result = proceedInclude(result, include)
        }

        if (Array.isArray(ignore) && ignore.length > 0) {
          proceedIgnore(result, ignore);
        }

        res.status(200).json(result)
      } else {
        res.status(405).json({ message: 'Method Not Allowed' })
      }
    }
  })
}
