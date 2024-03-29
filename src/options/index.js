import merge from 'deepmerge';
import {existsSync} from 'fs'
import {join} from 'path'

export const defaults = {
  getUmbracoDataAPI: {
    default: null,
    required: true,
  },
  silent: {
    default: false,
    required: false
  },
  trailingSlashRedirect: {
    default: false,
    required: false
  },
  namespace: {
    default: 'Umbraco',
    required: true
  },
  dataFilename: {
    default: 'UmbracoData.json',
    required: true
  },
  generateUmbracoDataAPI: {
    default: null,
    required: true
  },
  prefix: {
    default: '',
    required: false
  },
  site: {
    default: null,
    required: true
  },
  prefetch: {
    default: [],
    required: false
  },
  redirects: {
    default: {
      enable: false,
      redirectFolderName: 'redirectFolder',
      rootChildrenUmbracoPath: 'SiteData.children',
      enableInDevelopment: false
    },
    required: false
  }
};

const NUXT_OPTIONS_TO_SYNC = ['rootDir', 'store'];

function invalidConfigParam(param) {
  return param === null || param === undefined
}

function readConfigFile(rootDir) {
  const configFilePath = join(rootDir, 'umbraco-headless.config.js')

  if (!existsSync(configFilePath)) {
    throw new Error('Please, create umbraco-headless.config.js in root directory')
  }

  return new Promise(resolve => {
    import(configFilePath)
      .then(config => {
        resolve(config.default)
      })
  })
}

function validateConfig(config) {
  const invalid = []
  const mergedConfig = {}

  Object.entries(defaults).forEach(([key, value]) => {
    mergedConfig[key] = config[key] === undefined
      ? value.default
      : config[key]

    if (defaults[key].required && invalidConfigParam(mergedConfig[key])) {
      invalid.push(key)
    }
  })

  if (invalid.length) {
    throw new Error(`Missing required config: ${invalid.join(', ')}`)
  }

  return mergedConfig
}

export default async function initOptions(moduleOptions) {
  const configFileOptions = validateConfig(await readConfigFile(this.options.rootDir))

  const options = merge.all([
    this.options.umbracoHeadless || {},
    moduleOptions || {},
    configFileOptions
  ]);

  NUXT_OPTIONS_TO_SYNC.forEach(option => options[option] = this.options[option])

  return options
}
