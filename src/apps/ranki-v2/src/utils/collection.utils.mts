export class CollectionUtils {
  /**
   * This method is created because `NodeListOf` type doesn't support `indexOf` array method;
   */
  static indexOf<T extends Node>(
    list: T[] | NodeListOf<T>,
    searched: T,
  ): number {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === searched) {
        index = i;
        break;
      }
    }
    return index;
  }
}
