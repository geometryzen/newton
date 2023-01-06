import { Unit } from "@geometryzen/multivectors";
import { AbstractMatrix } from "./AbstractMatrix";

export class Matrix0 extends AbstractMatrix<Matrix0> {
    constructor(elements: Float32Array, uom?: Unit) {
        super(elements, 0, uom);
    }
}
