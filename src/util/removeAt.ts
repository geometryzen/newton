/**
 * @hidden
 * Removes from an array the element at the specified index.
 * @param xs Array or array like object from which to remove value.
 * @param index The index to remove.
 * @return True if an element was removed.
 */
export default function removeAt<T>(xs: T[], index: number): boolean {
    // use generic form of splice
    // splice returns the removed items and if successful the length of that
    // will be 1
    return Array.prototype.splice.call(xs, index, 1).length === 1;
}
