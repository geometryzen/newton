import { Spacetime1, Unit } from "@geometryzen/multivectors";
import { checkBodyAttitudeUnit } from "../core/checkBodyAttitudeUnit";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { Kinematics } from "../core/Kinematics";
import { VarsList } from "../core/VarsList";

/**
 * @hidden
 */
export const OFFSET_POSITION_T = 0;
/**
 * @hidden
 */
export const OFFSET_POSITION_X = 1;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_A = 2;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_B = 3;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_T = 4;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_X = 5;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_B = 6;

export class KinematicsG11 implements Kinematics<Spacetime1> {
    private $speedOfLight = Spacetime1.one;
    constructor() {
        // TODO
    }
    get speedOfLight(): Spacetime1 {
        return this.$speedOfLight;
    }
    set speedOfLight(speedOfLight: Spacetime1) {
        this.$speedOfLight = speedOfLight;
    }
    /**
     * 
     * @param rateOfChangeVals the ordinary rate of change, dx / dt, as opposed to the proper rate of change, dx / dτ. 
     * @param rateOfChangeUoms 
     * @param idx 
     * @param body 
     * @param uomTime 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // We're essentially converting from momentum and rest-mass to ordinary velocity.
        // Interestingly, this requires that we know the space-time split of the momentum.
        // Here we work in coordinates, but the same thing could be done if we know e0.
        // Using a mutable scratch variable, we could do these calculations in a coordinate-free manner.
        const P = body.P;
        const M = body.M;
        const m = M.a;
        const c = this.$speedOfLight.a;
        const βm = P.x / c;
        const mass = Math.sqrt(m * m + βm * βm);
        rateOfChangeVals[idx + OFFSET_POSITION_T] = P.t / mass;
        rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / mass;
        const uom = Unit.div(P.uom, M.uom);
        rateOfChangeUoms[idx + OFFSET_POSITION_T] = uom;
        rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // TODO: Review the theory to see if this needs to be modified for relativity.
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
        rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.b * R.b);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_B] = -0.5 * (Ω.b * R.a);
        const uom = Unit.mul(Ω.uom, R.uom);
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_B] = uom;
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
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
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_T] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_T] = uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = uom;
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
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
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_B] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_B] = uom;
    }
    updateBodyFromVars(vars: number[], uoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        const X = body.X;
        const R = body.R;
        const P = body.P;
        const L = body.L;

        X.a = 0;
        X.t = vars[idx + OFFSET_POSITION_T];
        X.x = vars[idx + OFFSET_POSITION_X];
        X.b = 0;
        X.uom = uoms[idx + OFFSET_POSITION_T];

        R.a = vars[idx + OFFSET_ATTITUDE_A];
        R.t = 0;
        R.x = 0;
        R.b = vars[idx + OFFSET_ATTITUDE_B];
        checkBodyAttitudeUnit(uoms[idx + OFFSET_ATTITUDE_B], uomTime);
        R.uom = uoms[idx + OFFSET_ATTITUDE_B];

        // Keep the attitude as close to 1 as possible.
        const magR = Math.sqrt(R.a * R.a + R.b * R.b);
        R.a = R.a / magR;
        R.b = R.b / magR;

        P.a = 0;
        P.t = vars[idx + OFFSET_LINEAR_MOMENTUM_T];
        P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        P.b = 0;
        P.uom = uoms[idx + OFFSET_LINEAR_MOMENTUM_T];

        L.a = 0;
        L.t = 0;
        L.x = 0;
        L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_B];
        if (!Unit.isOne(L.uom)) {
            if (Unit.isOne(uoms[idx + OFFSET_ANGULAR_MOMENTUM_B])) {
                throw new Error("Overwriting Angular Momentum Units!");
            }
        }
        L.uom = uoms[idx + OFFSET_ANGULAR_MOMENTUM_B];

        body.updateAngularVelocity();
    }
    updateVarsFromBody(body: ForceBody<Spacetime1>, idx: number, vars: VarsList): void {
        const X = body.X;
        const R = body.R;
        const P = body.P;
        const L = body.L;

        if (!Unit.isOne(R.uom)) {
            throw new Error(`R.uom should be one, but was ${R.uom}`);
        }

        vars.setValueJump(OFFSET_POSITION_T + idx, X.t);
        vars.setUnit(OFFSET_POSITION_T + idx, X.uom);

        vars.setValueJump(OFFSET_POSITION_X + idx, X.x);
        vars.setUnit(OFFSET_POSITION_X + idx, X.uom);

        vars.setValueJump(OFFSET_ATTITUDE_A + idx, R.a);
        vars.setUnit(OFFSET_ATTITUDE_A + idx, R.uom);

        vars.setValueJump(OFFSET_ATTITUDE_B + idx, R.b);
        vars.setUnit(OFFSET_ATTITUDE_B + idx, R.uom);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_T + idx, P.t);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_T + idx, P.uom);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, P.x);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, P.uom);

        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_B + idx, L.b);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_B + idx, L.uom);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1, uomTime: Unit): void {
        const Ft = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_T];
        const Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];

        if (Ft !== 0 || Fx !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_T] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_T], force.uom);
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_T] = force.uom;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_T] = Ft + force.t;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1): void {
        // Use when applying geometric constraints.
        throw new Error("getForce method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1): void {
        // Use when applying geometric constraints.
        throw new Error("setForce method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Spacetime1, uomTime: Unit): void {
        const Tb = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_B];
        if (Tb !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_B] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_B], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_B] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_B] = Tb + torque.b;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    epilog(bodies: ForceBody<Spacetime1>[], forceLaws: ForceLaw<Spacetime1>[], potentialOffset: Spacetime1, vars: VarsList): void {
        // throw new Error("Method not implemented.");
    }
    discontinuousEnergyVars(): number[] {
        // throw new Error("Method not implemented.");
        return [];
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case OFFSET_POSITION_T: return "position t";
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_B: return "attitude b";
            case OFFSET_LINEAR_MOMENTUM_T: return "linear momentum t";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_ANGULAR_MOMENTUM_B: return "angular momentum b";
        }
        throw new Error(`getVarName(${offset})`);
    }
    getVarNames(): string[] {
        return [VarsList.TIME];
    }
    numVarsPerBody(): number {
        return 7;
    }
}
