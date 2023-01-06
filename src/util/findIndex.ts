/**
 * Search an array for the first element that satisfies a given condition and
 * return its index. Returns the index of the first array element that passes the test,
 * or -1 if no element is found.
 * @hidden
 */
export default function findIndex<T>(xs: T[], test: (x: T, index: number) => boolean): number {
    const N = xs.length;
    for (let i = 0; i < N; i++) {
        const x = xs[i];
        if (test(x, i)) {
            return i;
        }
    }
    return -1;
}
