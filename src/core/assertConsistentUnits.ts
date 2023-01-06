import { Unit } from "@geometryzen/multivectors";
import { Metric } from "./Metric";

/**
 * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
 * If either measure is zero, the unit of dimensions are meaningless and can be ignored.
 * @hidden
 */
export function assertConsistentUnits<T>(aName: string, A: T, bName: string, B: T, metric: Metric<T>): void {
    if (!metric.isZero(A) && !metric.isZero(B)) {
        if (Unit.isOne(metric.uom(A))) {
            if (!Unit.isOne(metric.uom(B))) {
                throw new Error(`${aName} => ${A} must have dimensions if ${bName} => ${B} has dimensions.`);
            }
        }
        else {
            if (Unit.isOne(metric.uom(B))) {
                throw new Error(`${bName} => ${B} must have dimensions if ${aName} => ${A} has dimensions.`);
            }
        }
    }
}
