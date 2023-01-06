/**
 * @hidden
 * @param xs 
 * @returns 
 */
export default function clone<T>(xs: T[]): T[] {
    const length = xs.length;
    const rv = new Array<T>(length);
    for (let i = 0; i < length; i++) {
        rv[i] = xs[i];
    }
    return rv;
}
