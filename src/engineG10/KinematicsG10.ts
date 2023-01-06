import { Geometric1, Unit } from "@geometryzen/multivectors";
import { checkBodyAttitudeUnit } from '../core/checkBodyAttitudeUnit';
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { INDEX_POTENTIAL_ENERGY, INDEX_RESERVED_LAST, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY, Kinematics } from '../core/Kinematics';
import { VarsList } from "../core/VarsList";

/**
 * @hidden
 */
export const INDEX_TOTAL_LINEAR_MOMENTUM_X = INDEX_RESERVED_LAST + 1;
/**
 * @hidden
 */
export const INDEX_TOTAL_ANGULAR_MOMENTUM = INDEX_RESERVED_LAST + 2;
/**
 * @hidden
 */
export const OFFSET_POSITION_X = 0;
/**
 * @hidden
 * The attitude is always one, but we carry through the units.
 */
export const OFFSET_ATTITUDE_A = 1;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_X = 2;
/**
 * @hidden
 * The angular momentum is always zero, but we carry through the units.
 */
export const OFFSET_ANGULAR_MOMENTUM = 3;

/**
 * @hidden
 */
const varNames = [
    VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total angular momentum"
];

/**
 * @hidden
 */
const DISCONTINUOUS_ENERGY_VARIABLES = [
    INDEX_TRANSLATIONAL_KINETIC_ENERGY,
    INDEX_ROTATIONAL_KINETIC_ENERGY,
    INDEX_POTENTIAL_ENERGY,
    INDEX_TOTAL_ENERGY,
    INDEX_TOTAL_LINEAR_MOMENTUM_X,
    INDEX_TOTAL_ANGULAR_MOMENTUM
];

/**
 * @hidden
 */
export class KinematicsG10 implements Kinematics<Geometric1> {
    private $speedOfLight = Geometric1.one;
    get speedOfLight(): Geometric1 {
        return this.$speedOfLight;
    }
    set speedOfLight(speedOfLight: Geometric1) {
        this.$speedOfLight = speedOfLight;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        const P = body.P;
        const M = body.M;
        const m = M.a;
        rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / m;
        const uom = Unit.div(P.uom, M.uom);
        rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        const L = body.L;
        rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = 0;
        const uom = Unit.mul(Ω.uom, R.uom);
        if (Unit.isOne(uomTime)) {
            if (!Unit.isOne(uom)) {
                throw new Error(`Ω.uom=${Ω.uom}, R.uom=${R.uom}, uomTime=${uomTime}`);
            }
        }
        else {
            if (!Unit.isCompatible(uom, Unit.INV_SECOND)) {
                throw new Error(`Ω unit of measure should be ${Unit.div(Unit.ONE, uomTime)}. L.uom=${L.uom}, Ω.uom=${Ω.uom}, R.uom=${R.uom}, uomTime=${uomTime}`);
            }
        }
        // Fix it up for now...
        if (Unit.isOne(uomTime)) {
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = Unit.ONE;
        }
        else if (Unit.isCompatible(uomTime, Unit.SECOND)) {
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = Unit.INV_SECOND;
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = Unit.div(Unit.ONE, uomTime);
        }
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        const P = body.P;
        const M = body.M;
        if (!Unit.isOne(P.uom)) {
            if (!Unit.isCompatible(P.uom, Unit.KILOGRAM_METER_PER_SECOND)) {
                throw new Error(`P.uom should be ${Unit.KILOGRAM_METER_PER_SECOND}, but was ${P.uom}`);
            }
        }
        if (!Unit.isOne(M.uom)) {
            if (!Unit.isCompatible(M.uom, Unit.KILOGRAM)) {
                throw new Error(`M.uom should be ${Unit.KILOGRAM}, but was ${M.uom}`);
            }
        }
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        const uom = Unit.div(P.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = uom;
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        const L = body.L;
        const R = body.R;
        const Ω = body.Ω;
        if (!Unit.isOne(R.uom)) {
            throw new Error(`R.uom should be one, but was ${R.uom}`);
        }
        if (!Unit.isOne(Ω.uom)) {
            if (!Unit.isCompatible(Ω.uom, Unit.INV_SECOND)) {
                throw new Error(`Ω.uom should be ${Unit.INV_SECOND}, but was ${Ω.uom}`);
            }
        }
        const uom = Unit.div(L.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM] = uom;
    }
    updateBodyFromVars(vars: number[], units: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        body.X.a = 0;
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.uom = units[idx + OFFSET_POSITION_X];

        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.x = 0;
        checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_A], uomTime);
        body.R.uom = units[idx + OFFSET_ATTITUDE_A];

        // Keep the attitude as close to 1 as possible.
        const R = body.R;
        const magR = Math.sqrt(R.a * R.a);
        body.R.a = body.R.a / magR;

        body.P.a = 0;
        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X];

        body.L.a = 0;
        body.L.x = 0;
        if (!Unit.isOne(body.L.uom)) {
            if (Unit.isOne(units[idx + OFFSET_ANGULAR_MOMENTUM])) {
                throw new Error("Overwriting Angular Momentum Units!");
            }
        }

        body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM];
        if (Unit.isOne(uomTime)) {
            body.L.uom = Unit.ONE;
        }
        else if (Unit.isCompatible(uomTime, Unit.SECOND)) {
            body.L.uom = Unit.JOULE_SECOND;
        }
        else {
            throw new Error();
        }

        body.updateAngularVelocity();
    }
    updateVarsFromBody(body: ForceBody<Geometric1>, idx: number, vars: VarsList): void {
        const X = body.X;
        const R = body.R;

        if (!Unit.isOne(R.uom)) {
            throw new Error(`R.uom should be one, but was ${R.uom}`);
        }

        vars.setValueJump(OFFSET_POSITION_X + idx, X.x);
        vars.setUnit(OFFSET_POSITION_X + idx, X.uom);

        vars.setValueJump(OFFSET_ATTITUDE_A + idx, R.a);
        vars.setUnit(OFFSET_ATTITUDE_A + idx, R.uom);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.uom);

        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM + idx, 0);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM + idx, body.L.uom);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1, uomTime: Unit): void {
        const Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];

        if (Fx !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1): void {
        force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X];
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1): void {
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Geometric1, uomTime: Unit): void {
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM] = torque.uom;
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM] = 0;
    }
    epilog(bodies: ForceBody<Geometric1>[], forceLaws: ForceLaw<Geometric1>[], potentialOffset: Geometric1, vars: VarsList): void {
        if (potentialOffset instanceof Geometric1) {
            // TODO: Check that it is a scalar and either dimensionless or energy units.
        }
        else {
            throw new Error("potentialOffset must be defined in epilog(bodies, forceLaws, potentialOffset, vars).");
        }

        // update the variables that track energy
        let pe = potentialOffset.a;
        let re = 0;
        let te = 0;
        // update the variable that track linear momentum (vector)
        let Px = 0;

        const bs = bodies;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const b = bs[i];
            if (isFinite(b.M.a)) {
                re += b.rotationalEnergy().a;
                te += b.translationalEnergy().a;
                // linear momentum
                Px += b.P.x;
            }
        }

        const fs = forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }

        vars.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
        vars.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
        vars.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
        vars.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
        vars.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
        vars.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM, 0);
    }
    discontinuousEnergyVars(): number[] {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_ANGULAR_MOMENTUM: return "angular momentum";
        }
        throw new Error(`getVarName(${offset})`);
    }
    getVarNames(): string[] {
        return varNames;
    }
    numVarsPerBody(): number {
        // Each body is described by 4 kinematic components.
        // 1 position
        // 1 attitude (though normalized should be only 1)
        // 1 linear momentum
        // 1 angular momentum (always zero, but we carry through units).
        return 4;
    }
}
