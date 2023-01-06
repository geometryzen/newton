import { Unit } from "@geometryzen/multivectors";
import { ForceBody } from "./ForceBody";
import { ForceLaw } from "./ForceLaw";
import { VarsList } from "./VarsList";

//
// Indices which MUST be common to all implementations.
//
/**
 * @hidden
 */
export const INDEX_TIME = 0;
/**
 * @hidden
 */
export const INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
/**
 * @hidden
 */
export const INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
/**
 * @hidden
 */
export const INDEX_POTENTIAL_ENERGY = 3;
/**
 * @hidden
 */
export const INDEX_TOTAL_ENERGY = 4;
/**
 * @hidden
 */
export const INDEX_RESERVED_LAST = 4;

/**
 * A handle-body pattern abstraction of the conversion of the multivector to the system state vector.
 * An implementation of this interface provides the mapping from a specific multivector implementation to a vector of state variables.
 * Each state variable is a pair consisting of (number, Unit). This decomposition allows the solvers (integrators) to treat the whole
 * system as a single particle in a large vector space.
 */
export interface Kinematics<T> {
    /**
     * 
     */
    speedOfLight: T;
    /**
     * The rate of change of position is the velocity (non-relativistic).
     * dX/dt = V = P / M
     * In the relativistic case,
     * dX/dt = P / sqrt(M * M + P * P), where P is the spatial part of the energy-momentum spacetime vector, M is the rest mass.
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * Let Ω(t) be the (bivector) angular velocity.
     * Let R(t) be the (spinor) attitude of the rigid body. 
     * The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
     * requiring the geometric product of Ω and R.
     * Ω and R are auxiliary and primary variables that have already been computed.
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input) 
     */
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param stateVals (input)
     * @param stateUoms (input)
     * @param idx (input)
     * @param body (output)
     * @param uomTime (input)
     */
    updateBodyFromVars(stateVals: number[], stateUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param body (input)
     * @param idx (input)
     * @param vars (output)
     */
    updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;
    /**
     * Adds the specified force to the rateOfChange variables for Linear Momentum.
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param idx (input)
     * @param force (input)
     * @param uomTime (input)
     */
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T, uomTime: Unit): void;
    /**
     * Use when applying geometric constraints.
     * @param rateOfChangeVals (input)
     * @param rateOfChangeUoms (input)
     * @param idx (input)
     * @param force (output)
     */
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T): void;
    /**
     * Used when applying geometric constraints.
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param force (input)
     */
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T): void;
    /**
     * Adds the specified torque to the rateOfChange variables for AngularMomentum.
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param idx (input)
     * @param torque (input)
     * @param uomTime (input)
     */
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: T, uomTime: Unit): void;
    /**
     * Called by the Physics Engine during the epilog.
     * @param bodies (input) Provides intrinsic kinetic energy.
     * @param forceLaws (input) Provides potential energy.
     * @param potentialOffset  (input) Provides a an offset in the potential energy.
     * @param vars (output) The list of variables containing the summary variables to be updated.
     */
    epilog(bodies: ForceBody<T>[], forceLaws: ForceLaw<T>[], potentialOffset: T, vars: VarsList): void;
    /**
     * Called by the Physics Engine to determine the indices of all the variables that are affected by a
     * discontinuous change to the energy of the system. i.e., an "intervention" where the bodies in the
     * system are changed independently of the differential equations that are implemented by the Physics Engine.
     * @returns The indices into the variables list.
     */
    discontinuousEnergyVars(): number[];
    /**
     * Used by the Physics engine when adding a body to the system.
     * Returns the name of the kinematic variable at the specified index which
     * ranges over [0, numVarsPerBody - 1].
     * 
     * The name must be valid (isValidName) after having being munged (toName).
     */
    getOffsetName(offset: number): string;
    /**
     * Used by the Physics class constructor to create a list of variables.
     * One of the names returned must be the (case-sensitive) "TIME" variable.
     */
    getVarNames(): string[];
    /**
     * Use by the Physics engine to add the correct number of variables for each body added.
     * The number of variables must be at least one.
     */
    numVarsPerBody(): number;
}
