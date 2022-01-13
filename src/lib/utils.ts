import { merge } from 'lodash';

export async function lazyPromise<T>(promise: Promise<T>): Promise<T> {
  const [res] = await Promise.all([
    promise,
    new Promise((res) => setTimeout(res, 300)),
  ]);
  return res;
}

export function mergeDeep<T>(source: T, update: Partial<T>): T {
  return merge<{}, T, Partial<T>>({}, source, update);
}

export function accessDotPath(key: string, map: any): any {
  return key.split('.').reduce((o, i) => o && o[i], map);
}
