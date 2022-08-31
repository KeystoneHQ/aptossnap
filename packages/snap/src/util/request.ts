import { defaultConfiguration } from '../configuration/predefined'

export interface RequestConfig {
  host: string
  base?: string
  version?: string
  withCredentials?: boolean
  credentials?: 'include' | 'omit' | 'same-origin'
  token?: string
  username?: string
  password?: string
  headers?: {
    [propName: string]: string
  }
}

export interface RequestOptions extends Request {
  url: string
  path: {
    [propName: string]: string
  }
}

export const baseConfig: RequestConfig = {
  host: defaultConfiguration.rpc.node,
  base: '/v1',
  version: '1.0.1',
  withCredentials: false,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
}

export default class Req {
  config: RequestConfig
  constructor (config: RequestConfig) {
    this.config = Object.assign({}, baseConfig, config)
  }

  request (options: RequestOptions) {
    (options.headers as any) = Object.assign({}, baseConfig.headers, options.headers)
    if (options.path) {
      Object.keys(options.path).forEach(k => {
        options.url = options.url.replace(`{${k}}`, options.path[k])
      })
      delete options.path
    }
    options.url = `${this.config.host}${this.config.base}${options.url}`
    const q = global.fetch(options.url, options)
    return q.then(res => res.json())
  }
}
