import { Unit } from '@geometryzen/multivectors';

/**
 * @hidden
 */
export interface MatrixLike {
    readonly dimensions: number;
    /**
     * The unit of measure (shared by each element of the matrix).
     */
    uom?: Unit;
    getElement(row: number, column: number): number;
}
