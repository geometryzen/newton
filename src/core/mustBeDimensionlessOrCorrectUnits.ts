import { Unit } from "@geometryzen/multivectors";
import { Metric } from "./Metric";

/**
 * @hidden
 * @param name 
 * @param value 
 * @param unit 
 * @param metric 
 * @returns 
 */
export function mustBeDimensionlessOrCorrectUnits<T>(name: string, value: T, unit: Unit, metric: Metric<T>): T {
    if (!Unit.isOne(metric.uom(value)) && !Unit.isCompatible(metric.uom(value), unit)) {
        throw new Error(`${name} unit of measure, ${metric.uom(value)}, must be compatible with ${unit}`);
    }
    else {
        return value;
    }
}
