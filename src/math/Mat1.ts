import { Unit } from '@geometryzen/multivectors';
import { MatrixLike } from './MatrixLike';

/**
 * @hidden
 */
export class Mat1 implements MatrixLike {
    private value: number;
    constructor(value: number) {
        this.value = value;
    }
    get dimensions(): number {
        return 1;
    }
    uom: Unit;
    getElement(row: number, column: number): number {
        if (row === 0 && column === 0) {
            return this.value;
        }
        else {
            throw new Error('row and column must both be zero.');
        }
    }
}
