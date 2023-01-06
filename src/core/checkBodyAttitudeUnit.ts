import { Unit } from "@geometryzen/multivectors";

/**
 * Helper function to be called from Kinematics.updateBodyFromVars.
 * Checks the unit of measure for the attitute (R) and suggests resolutions.
 * A prominent feature is to detect a missing uom in a simulation time step and to suggest the resolution.
 * @hidden
 * @param uom The unit of measure of the attitude, R.
 * @param uomTime The optional unit of measure for the time step. This provides context for resolution suggestions.
 */
export function checkBodyAttitudeUnit(uom: Unit, uomTime: Unit): void {
    if (!Unit.isOne(uom)) {
        if (Unit.isOne(uomTime)) {
            // The time unit of measure was not defined or is dimensionless.
            if (Unit.isOne(uom.mul(Unit.SECOND))) {
                // Providing a time uom would fix the issue.
                throw new Error(`body.R.uom should be one, but was ${uom}. The unit of measure for the time step appears to be missing. Consider adding a time step unit of measure of ${Unit.SECOND}.`);
            }
            else {
                throw new Error(`body.R.uom should be one, but was ${uom}.`);
            }
        }
        else {
            throw new Error(`checkBodyAttitudeUnit(uom=${uom},uomTime=${uomTime}): body.R.uom should be one, but was ${uom}.`);
        }
    }
}
