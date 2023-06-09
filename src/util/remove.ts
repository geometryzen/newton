import removeAt from './removeAt.js';

/**
 * @hidden
 * Removes the first occurrence of a particular value from an array.
 * @param xs Array from which to remove value.
 * @param x Object to remove.
 * @return True if an element was removed.
 */
export function remove<T>(xs: T[], x: T): boolean {
    const i = xs.indexOf(x);
    let rv: boolean;
    if ((rv = i >= 0)) {
        removeAt(xs, i);
    }
    return rv;
}
