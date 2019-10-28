// @flow
/**
 * Class Component Types
 */

 declare module 'tObject' {
   /** Collection Comparator */
  declare export type compare1<T> =
    & ((...[T]) => (...[T]) => number)
  declare export type compare2<T> =
    & ((T, T) => number)
 }