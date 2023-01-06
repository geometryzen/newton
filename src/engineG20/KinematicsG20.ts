import { Geometric2, Unit } from "@geometryzen/multivectors";
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
export const INDEX_TOTAL_LINEAR_MOMENTUM_Y = INDEX_RESERVED_LAST + 2;
/**
 * @hidden
 */
export const INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 3;
/**
 * @hidden
 */
export const OFFSET_POSITION_X = 0;
/**
 * @hidden
 */
export const OFFSET_POSITION_Y = 1;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_A = 2;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_XY = 3;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_X = 4;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_Y = 5;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_XY = 6;

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
    "total linear momentum - y",
    "total angular momentum - xy"
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
    INDEX_TOTAL_LINEAR_MOMENTUM_Y,
    INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];

/**
 * @hidden
 */
export class KinematicsG20 implements Kinematics<Geometric2> {
    private $speedOfLight = Geometric2.one;
    get speedOfLight(): Geometric2 {
        return this.$speedOfLight;
    }
    set speedOfLight(speedOfLight: Geometric2) {
        this.$speedOfLight = speedOfLight;
    }
    numVarsPerBody(): number {
        // Each body is described by 7 kinematic components.
        // 2 position
        // 2 attitude (though normalized should be only 1)
        // 2 linear momentum
        // 1 angular momentum
        return 7;
    }
    getVarNames(): string[] {
        return varNames;
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_POSITION_Y: return "position y";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_XY: return "attitude xy";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error(`getVarName(${offset})`);
    }
    discontinuousEnergyVars(): number[] {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    }
    epilog(bodies: ForceBody<Geometric2>[], forceLaws: ForceLaw<Geometric2>[], potentialOffset: Geometric2, varsList: VarsList): void {

        // update the variables that track energy
        let pe = potentialOffset.a;
        let re = 0;
        let te = 0;
        // update the variable that track linear momentum (vector)
        let Px = 0;
        let Py = 0;
        // update the variable that track angular momentum (bivector)
        let Lxy = 0;

        const bs = bodies;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const b = bs[i];
            if (isFinite(b.M.a)) {
                re += b.rotationalEnergy().a;
                te += b.translationalEnergy().a;
                // linear momentum
                Px += b.P.x;
                Py += b.P.y;
                // orbital angular momentum
                Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                // intrinsic angular momentum
                Lxy += b.L.xy;
            }
        }

        const fs = forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }

        varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
        varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
        varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
        varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy);
    }
    updateBodyFromVars(vars: number[], uoms: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void {
        body.X.a = 0;
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.y = vars[idx + OFFSET_POSITION_Y];
        body.X.b = 0;
        body.X.uom = uoms[idx + OFFSET_POSITION_X];

        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.x = 0;
        body.R.y = 0;
        body.R.b = vars[idx + OFFSET_ATTITUDE_XY];
        checkBodyAttitudeUnit(uoms[idx + OFFSET_ATTITUDE_XY], uomTime);
        body.R.uom = uoms[idx + OFFSET_ATTITUDE_XY];

        // Keep the attitude as close to 1 as possible.
        const R = body.R;
        const magR = Math.sqrt(R.a * R.a + R.b * R.b);
        body.R.a = body.R.a / magR;
        body.R.b = body.R.b / magR;

        body.P.a = 0;
        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
        body.P.b = 0;
        body.P.uom = uoms[idx + OFFSET_LINEAR_MOMENTUM_X];

        body.L.a = 0;
        body.L.x = 0;
        body.L.y = 0;
        body.L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        if (!Unit.isOne(body.L.uom)) {
            if (Unit.isOne(uoms[idx + OFFSET_ANGULAR_MOMENTUM_XY])) {
                throw new Error("Overwriting Angular Momentum Units!");
            }
        }
        body.L.uom = uoms[idx + OFFSET_ANGULAR_MOMENTUM_XY];

        body.updateAngularVelocity();
    }
    updateVarsFromBody(body: ForceBody<Geometric2>, idx: number, vars: VarsList): void {
        const X = body.X;
        const R = body.R;
        const P = body.P;
        const L = body.L;

        if (!Unit.isOne(R.uom)) {
            throw new Error(`R.uom should be one, but was ${R.uom}`);
        }

        vars.setValueJump(OFFSET_POSITION_X + idx, X.x);
        vars.setUnit(OFFSET_POSITION_X + idx, X.uom);

        vars.setValueJump(OFFSET_POSITION_Y + idx, X.y);
        vars.setUnit(OFFSET_POSITION_Y + idx, X.uom);

        vars.setValueJump(OFFSET_ATTITUDE_A + idx, R.a);
        vars.setUnit(OFFSET_ATTITUDE_A + idx, R.uom);

        vars.setValueJump(OFFSET_ATTITUDE_XY + idx, R.b);
        vars.setUnit(OFFSET_ATTITUDE_XY + idx, R.uom);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, P.x);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, P.uom);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y + idx, P.y);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_Y + idx, P.uom);

        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY + idx, L.b);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_XY + idx, L.uom);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2, uomTime: Unit): void {
        const Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        const Fy = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];

        if (Fx !== 0 || Fy !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = Fy + force.y;
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2): void {
        force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        force.y = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
        force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X];
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2): void {
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;

        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.y;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Geometric2, uomTime: Unit): void {
        const Tb = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        if (Tb !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Tb + torque.b;
    }
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>) {
        const P = body.P;
        const M = body.M;
        const m = M.a;
        rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / m;
        rateOfChangeVals[idx + OFFSET_POSITION_Y] = P.y / m;
        const uom = Unit.div(P.uom, M.uom);
        rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
        rateOfChangeUoms[idx + OFFSET_POSITION_Y] = uom;
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>): void {
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
        rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
        const uom = Unit.mul(Ω.uom, R.uom);
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_XY] = uom;
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void {
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
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = uom;
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void {
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
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = uom;
    }
}
