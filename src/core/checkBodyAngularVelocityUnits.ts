import { Unit } from "@geometryzen/multivectors";
import { ForceBody } from "./ForceBody";
import { Metric } from "./Metric";

/**
 * @hidden
 */
const TIME = Unit.SECOND;
/**
 * @hidden
 */
const FREQUENCY = Unit.INV_SECOND;

/**
 * @hidden
 */
export function checkBodyAngularVelocityUnits<T>(body: ForceBody<T>, metric: Metric<T>, uomTime: Unit) {
    if (Unit.isOne(uomTime)) {
        if (!Unit.isOne(metric.uom(body.Ω))) {
            throw new Error(`body.Ω.uom=${metric.uom(body.Ω)}, but uomTime=${uomTime}.`);
        }
    }
    else if (Unit.isCompatible(uomTime, TIME)) {
        if (!Unit.isCompatible(metric.uom(body.Ω), FREQUENCY)) {
            throw new Error(`body.L.uom=${metric.uom(body.L)} but body.Ω.uom=${metric.uom(body.Ω)}, and uomTime=${uomTime}.`);
        }
    }
    else {
        throw new Error();
    }
}
