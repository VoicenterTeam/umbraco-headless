const {proceedInclude, proceedIgnore} = require('../helper/objectWorker')
const {getByPath, getByContentType} = require('../helper/helper')

function parseBody(req) {
  return new Promise(resolve => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', () => {
      resolve(JSON.parse(body))
    })
  })
}

export default function ({umbracoData, getUmbracoDataMiddlewareAPIURI}) {
  this.addServerMiddleware({
    path: getUmbracoDataMiddlewareAPIURI,
    handler: async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Content-Type', 'application/json');

      console.log('request to middleware!')
      if (req.method === 'POST') {
        let body = await parseBody(req);

        console.log('body', body)
        // Now you can use parsedBody as the data sent in the request.
        // ... Your existing code ...

        const {include, ignore, type, pattern} = body

        console.log('umbracoData', Object.keys(umbracoData).join(', '))

        let result = umbracoData

        console.log('will switch by type', type)

        switch (type) {
          case 'path':
            console.log('type is path')
            result = getByPath(result, pattern)
            break
          case 'contentType':
            console.log('type is contentType')
            result = getByContentType(result, pattern)
        }

        if (Array.isArray(include) && include.length > 0) {
          console.log('will filter by include')
          result = proceedInclude(result, include)
        }

        if (Array.isArray(ignore) && ignore.length > 0) {
          console.log('will filter by ignore')
          proceedIgnore(result, ignore);
        }

        console.log('result is:', Object.keys(result))

        res.statusCode = 200;
        res.end(JSON.stringify(result));
      } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ message: 'Method Not Allowed' }));
      }
    }
  })
}
