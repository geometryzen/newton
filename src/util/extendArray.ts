/**
 * Returns a new array which is an expanded copy of the given array.
 * Adds `quantity` new entries at `position` location in the array.
 * Negative quantity will delete array entries.
 * @hidden
 */
export default function extendArray<T>(array: T[], quantity: number, value: T | T[]) {
    if (quantity === 0) {
        return;
    }
    if (quantity < 0) {
        throw new Error();
    }
    const startIdx = array.length;
    array.length = startIdx + quantity;
    if (Array.isArray(value)) {
        const vs = <T[]>value;
        if (vs.length !== quantity) {
            throw new Error();
        }
        for (let i = startIdx, n = array.length; i < n; i++) {
            array[i] = value[i - startIdx];
        }
    }
    else {
        for (let i = startIdx, n = array.length; i < n; i++) {
            array[i] = <T>value;
        }
    }
}
