import { merge } from 'lodash';

export async function lazyPromise<T>(promise: Promise<T>): Promise<T> {
  const [res] = await Promise.all([
    promise,
    new Promise((res) => setTimeout(res, 300)),
  ]);
  return res;
}

export function mergeDeep(source: any, update: any): any {
  return merge({}, source, update);
}

export function accessDotPath(key: string, map: any): any {
  return key.split('.').reduce((o, i) => o && o[i], map);
}
