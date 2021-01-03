class Utils {
  static find<T>(array: T[], condition: (a: T) => boolean): { index: number, value: T } {
    const index = array.findIndex(condition);
    if (index === -1) {
      return { index: -1, value: null };
    }
    return { index, value: array[index] };
  }
}

export default Utils;
