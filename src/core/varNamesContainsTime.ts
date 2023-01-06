/**
 * @hidden
 * @param varNames 
 * @returns 
 */
export function varNamesContainsTime(varNames: string[]): boolean {
    if (Array.isArray(varNames)) {
        return (varNames.indexOf('TIME') >= 0);
    }
    else {
        throw new Error("varNames must be an array.");
    }
}
