/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @hidden
 * @param xs 
 * @param start 
 * @param opt_end 
 * @returns 
 */
function slice<T>(xs: any, start: number, opt_end?: number) {
    // passing 1 arg to slice is not the same as passing 2 where the second is
    // null or undefined (in that case the second argument is treated as 0).
    // we could use slice on the arguments object and then use apply instead of
    // testing the length
    if (arguments.length <= 2) {
        return Array.prototype.slice.call(xs, start);
    }
    else {
        return Array.prototype.slice.call(xs, start, opt_end);
    }
}

/**
 * @hidden
 * @param xs 
 * @param index 
 * @param howMany 
 * @param var_args 
 * @returns 
 */
function splice<T>(xs: T[], index: number, howMany: number, var_args: any) {
    return Array.prototype.splice.apply(xs, slice(arguments, 1) as any);
}

/**
 * @hidden
 * Inserts an object at the given index of the array.
 * @param xs The array to modify.
 * @param x The object to insert.
 * @param index The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
export default function insertAt<T>(xs: T[], x: T, index = 0): void {
    splice(xs, index, 0, x);
}

