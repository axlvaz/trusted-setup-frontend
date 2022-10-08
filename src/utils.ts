import ROUTES from './routes'
import { ErrorRes } from './types'
import bls from '@noble/bls12-381'

// check if user agent is mobile device
export function isMobile(): boolean {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

  const isAndroid = Boolean(userAgent.match(/Android/i))
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = Boolean(userAgent.match(/Opera Mini/i))
  const isWindows = Boolean(userAgent.match(/IEMobile/i))

  return Boolean(isAndroid || isIos || isOpera || isWindows)
}

export function isBgRoute(route: string): boolean {
  return [
    ROUTES.CONTRIBUTING,
    ROUTES.SIGNIN,
    ROUTES.DOUBLE_SIGN,
    ROUTES.ENTROPY_INPUT,
    ROUTES.LOBBY,
    ROUTES.LOBBY_FULL
  ].includes(route)
}

export function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

export function toParams(query: string) {
  const q = query.replace(/^\??\//, '')

  return q.split('&').reduce<{ [key: string]: string }>((values, param) => {
    const [key, value] = param.split('=')

    values[key] = value

    return values
  }, {})
}

export function toQuery(params: { [key: string]: string }, delimiter = '&') {
  const keys = Object.keys(params)
  return keys.reduce((str, key, index) => {
    if (typeof params[key] === 'undefined' || params[key] === null) return ''
    let query = `${str}${key}=${params[key]}`
    if (index < keys.length - 1) {
      query += delimiter
    }
    return query
  }, '')
}

export function isSuccessRes<T extends Object>(res: T | ErrorRes): res is T {
  return !res.hasOwnProperty('error')
}

export function parseErrorMessage(res: ErrorRes): string {
  let text = res.error || res.message || ''
  let message = text.replaceAll('+', ' ')
  return message
}

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/* 
  Secret should be a hex string representing a G2 point. It will be
  used as the private key signing the message. 
  ID is expected to be in the specified form
  i.e. eth|0xb1ab1af00.... for ethereum signin,
  or git|123456|@handle for github signin.
*/
export async function blsSignId(secret: string, id: string): Promise<string> {
  // TODO validation of inputs
  //const publicKey = bls.getPublicKey(secret);
  const sig = await bls.sign(id, secret);
  return Buffer.from(sig).toString('hex');
}

export async function githubHandleToIdentity(handle: string): Promise<string> {
  // get github id
  const res = await fetch(`https://api.github.com/users/${handle}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const ghId = (await res.json())?.id;

  return `git|${ghId}|${handle}`;
}

export function ethAddressToIdentity(address: string): string {
  return `eth|${address}`;
}