// @flow

export default function filterKey<V> (O: {[key: string]: any}, key: V): V | string {
  const result = Object.keys(O).filter(k => k === key)[0];
  return result;
}
