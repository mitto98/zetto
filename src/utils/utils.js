import { merge } from 'lodash';

export async function lazyPromise(promise) {
  const [res] = await Promise.all([
    promise,
    new Promise((res) => setTimeout(res, 300)),
  ]);
  return res;
}

export function mergeDeep(source, update) {
  return merge(source, update);
}
