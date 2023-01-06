/**
 * Returns an array consisting of the given `value` repeated `N` times.
 * @hidden
 */
export function repeat<T>(value: T, N: number): T[] {
    const xs: T[] = [];
    for (let i = 0; i < N; i++) {
        xs[i] = value;
    }
    return xs;
}
