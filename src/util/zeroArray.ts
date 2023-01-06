/**
 * @hidden
 */
export function zeroArray(xs: number[]): void {
    const N = xs.length;
    for (let i = 0; i < N; i++) {
        xs[i] = 0;
    }
}
