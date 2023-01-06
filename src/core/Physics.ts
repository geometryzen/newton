import { Unit } from '@geometryzen/multivectors';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import { remove } from '../util/remove';
import { toName } from '../util/toName';
import { isValidName } from '../util/validName';
import { checkBodyAngularVelocityUnits } from './checkBodyAngularVelocityUnits';
import { checkBodyKinematicUnits } from './checkBodyKinematicUnits';
import { EnergySystem } from './EnergySystem';
import { Force } from './Force';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Kinematics } from './Kinematics';
import { Metric } from './Metric';
import { SimList } from './SimList';
import { Simulation } from './Simulation';
import { Torque } from './Torque';
import { TorqueLaw } from './TorqueLaw';
import { varNamesContainsTime } from './varNamesContainsTime';
import { VarsList } from './VarsList';


/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * @hidden
 */
export class Physics<T> extends AbstractSubject implements Simulation, EnergySystem<T> {
    /**
     * 
     */
    private readonly $simList = new SimList();
    /**
     * The list of variables represents the current state of the simulation.
     */
    private readonly $varsList: VarsList;
    /**
     * The RigidBody(s) in this simulation.
     */
    private readonly $bodies: ForceBody<T>[] = [];
    /**
     * 
     */
    private readonly $forceLaws: ForceLaw<T>[] = [];
    /**
     * 
     */
    private readonly $torqueLaws: TorqueLaw<T>[] = [];
    /**
     *
     */
    private readonly $constraints: GeometricConstraint<T>[] = [];
    /**
     * 
     */
    private readonly $driftLaws: ForceLaw<T>[] = [];
    /**
     * 
     */
    private $showForces = false;
    /**
     * 
     */
    private $showTorques = false;
    /**
     * Scratch variavle for computing a potential energy offset.
     */
    private readonly $potentialOffset: T;
    /**
     * Scratch variable for computing force.
     */
    private readonly $force: T;
    /**
     * Scratch variable for computing torque.
     */
    private readonly $torque: T;
    /**
     * Scratch variable for computing total energy.
     */
    private readonly $totalEnergy: T;
    private $totalEnergyLock: number;

    /**
     * We should be able to calculate this from the dimensionality?
     */
    private readonly $numVariablesPerBody: number;

    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(public readonly metric: Metric<T>, private readonly kinematics: Kinematics<T>) {
        super();
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('kinematics', kinematics);
        const varNames = kinematics.getVarNames();
        if (!varNamesContainsTime(varNames)) {
            throw new Error("kinematics.getVarNames() must contain a time variable.");
        }
        this.$varsList = new VarsList(varNames);
        this.$potentialOffset = metric.scalar(0);
        // Probe to make sure that the multivector we have been given is mutable.
        metric.setUom(this.$potentialOffset, void 0);
        this.$force = metric.scalar(0);
        this.$torque = metric.scalar(0);
        this.$totalEnergy = metric.scalar(0);
        this.$totalEnergyLock = metric.lock(this.$totalEnergy);
        this.$numVariablesPerBody = kinematics.numVarsPerBody();
        if (this.$numVariablesPerBody <= 0) {
            throw new Error("kinematics.numVarsPerBody() must define at least one variable per body.");
        }
    }
    getVariableName(idx: number): string {
        return this.varsList.getVariable(idx).name;
    }

    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    get showForces(): boolean {
        return this.$showForces;
    }
    set showForces(showForces: boolean) {
        mustBeBoolean('showForces', showForces);
        this.$showForces = showForces;
    }

    /**
     * Determines whether calculated torques will be added to the simulation list.
     */
    get showTorques(): boolean {
        return this.$showTorques;
    }
    set showTorques(showTorques: boolean) {
        mustBeBoolean('showTorques', showTorques);
        this.$showTorques = showTorques;
    }

    /**
     * 
     */
    addBody(body: ForceBody<T>): void {
        mustBeNonNullObject('body', body);
        if (!contains(this.$bodies, body)) {
            const kinematics = this.kinematics;
            // create variables in vars array for this body
            const names = [];
            for (let k = 0; k < this.$numVariablesPerBody; k++) {
                const name = kinematics.getOffsetName(k);
                if (isValidName(toName(name))) {
                    names.push(name);
                }
                else {
                    throw new Error(`Body kinematic variable name, '${name}', returned by kinematics.getOffsetName(${k}) is not a valid name.`);
                }
            }
            body.varsIndex = this.$varsList.addVariables(names);
            // add body to end of list of bodies
            this.$bodies.push(body);
            this.$simList.add(body);
        }
        this.updateVarsFromBody(body);
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    removeBody(body: ForceBody<T>): void {
        mustBeNonNullObject('body', body);
        if (contains(this.$bodies, body)) {
            this.$varsList.deleteVariables(body.varsIndex, this.$numVariablesPerBody);
            remove(this.$bodies, body);
            body.varsIndex = -1;
        }
        this.$simList.remove(body);
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    addForceLaw(forceLaw: ForceLaw<T>): void {
        mustBeNonNullObject('forceLaw', forceLaw);
        if (!contains(this.$forceLaws, forceLaw)) {
            this.$forceLaws.push(forceLaw);
        }
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void {
        mustBeNonNullObject('forceLaw', forceLaw);
        forceLaw.disconnect();
        this.discontinuousChangeToEnergy();
        remove(this.$forceLaws, forceLaw);
    }

    /**
     * 
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        mustBeNonNullObject('torqueLaw', torqueLaw);
        if (!contains(this.$torqueLaws, torqueLaw)) {
            this.$torqueLaws.push(torqueLaw);
        }
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        mustBeNonNullObject('torqueLaw', torqueLaw);
        torqueLaw.disconnect();
        this.discontinuousChangeToEnergy();
        remove(this.$torqueLaws, torqueLaw);
    }

    /**
     *
     */
    addConstraint(geometry: GeometricConstraint<T>): void {
        mustBeNonNullObject('geometry', geometry);
        if (!contains(this.$constraints, geometry)) {
            this.$constraints.push(geometry);
        }
    }

    /**
     * 
     * @param geometry 
     */
    removeConstraint(geometry: GeometricConstraint<T>): void {
        mustBeNonNullObject('geometry', geometry);
        remove(this.$constraints, geometry);
    }

    /**
     * 
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void {
        mustBeNonNullObject('driftLaw', driftLaw);
        if (!contains(this.$driftLaws, driftLaw)) {
            this.$driftLaws.push(driftLaw);
        }
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    removeDriftLaw(driftLaw: ForceLaw<T>): void {
        mustBeNonNullObject('driftLaw', driftLaw);
        driftLaw.disconnect();
        this.discontinuousChangeToEnergy();
        remove(this.$driftLaws, driftLaw);
    }


    private discontinuousChangeToEnergy(): void {
        const dynamics = this.kinematics;
        this.$varsList.incrSequence(...dynamics.discontinuousEnergyVars());
    }

    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private updateBodiesFromStateVariables(vars: number[], units: Unit[], uomTime: Unit): void {
        const dynamics = this.kinematics;
        const bodies = this.$bodies;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            const body = bodies[i];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            // Delegate the updating of the body from the state variables because
            // we do not know how to access the properties of the bodies in the
            // various dimensions.
            dynamics.updateBodyFromVars(vars, units, idx, body, uomTime);
            checkBodyAngularVelocityUnits(body, this.metric, uomTime);
        }
    }

    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     * @hidden
     */
    prolog(): void {
        this.simList.removeTemporary(this.varsList.getTime());
    }

    /**
     * Gets the state vector, Y(t).
     * The returned array is a copy of the state vector variable values.
     * However, for performance, the array is maintained between invocations.
     * @hidden
     */
    getState(): number[] {
        return this.$varsList.getValues();
    }

    /**
     * Sets the state vector, Y(t).
     * @hidden
     */
    setState(state: number[]): void {
        this.varsList.setValuesContinuous(state);
    }

    getUnits(): Unit[] {
        return this.$varsList.getUnits();
    }

    setUnits(units: Unit[]): void {
        this.varsList.setUnits(units);
    }

    /**
     * The time value is not being used because the DiffEqSolver has updated the vars?
     * This will move the objects and forces will be recalculated.u
     * @hidden
     */
    evaluate(state: number[], stateUnits: Unit[], rateOfChangeVals: number[], rateOfChangeUoms: Unit[], Δt: number, uomTime?: Unit): void {
        const metric = this.metric;
        const dynamics = this.kinematics;
        // Move objects so that rigid body objects know their current state.
        this.updateBodiesFromStateVariables(state, stateUnits, uomTime);
        const bodies = this.$bodies;
        const Nb = bodies.length;
        for (let bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
            const body = bodies[bodyIndex];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            const mass = metric.a(body.M);
            if (mass === Number.POSITIVE_INFINITY) {
                for (let k = 0; k < this.$numVariablesPerBody; k++) {
                    rateOfChangeVals[idx + k] = 0;  // infinite mass objects don't move
                }
            }
            else {
                checkBodyKinematicUnits(body, metric, uomTime);
                dynamics.setPositionRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                dynamics.setAttitudeRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                dynamics.zeroLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                dynamics.zeroAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
            }
        }
        this.applyForceLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyTorqueLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyConstraints(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyDriftLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        rateOfChangeVals[this.$varsList.timeIndex()] = 1;
    }

    /**
     * 
     * @param rateOfChange (output)
     * @param rateOfChangeUnits (output)
     * @param Δt 
     * @param uomTime 
     */
    private applyForceLaws(rateOfChange: number[], rateOfChangeUnits: Unit[], Δt: number, uomTime?: Unit): void {
        const forceLaws = this.$forceLaws;
        const N = forceLaws.length;
        for (let i = 0; i < N; i++) {
            const forceLaw = forceLaws[i];
            const forces = forceLaw.updateForces();
            const Nforces = forces.length;
            for (let forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
            }
        }
    }

    private applyDriftLaws(rateOfChange: number[], rateOfChangeUnits: Unit[], Δt: number, uomTime?: Unit): void {
        const driftLaws = this.$driftLaws;
        const N = driftLaws.length;
        for (let i = 0; i < N; i++) {
            const driftLaw = driftLaws[i];
            const forces = driftLaw.updateForces();
            const Nforces = forces.length;
            for (let forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
            }
        }
    }

    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    private applyForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], forceApp: Force<T>, Δt: number, uomTime?: Unit): void {
        const body = forceApp.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        const metric = this.metric;
        const dynamics = this.kinematics;

        // The rate of change of momentum is force.
        // dP/dt = F
        forceApp.computeForce(this.$force);
        const F = this.$force;
        // TODO: We may not need to bootstrap when units are correctly handled?
        // Bootstrap the linear momentum unit of measure for the body.
        if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
            const uom = Unit.mul(metric.uom(F), uomTime);
            // console.lg(`Bootstrap P.uom to ${uom}`);
            metric.setUom(body.P, uom);
        }
        // TODO: Here we could apply geometric constraints on the forces.
        dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, F, uomTime);

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.$torque);
        const T = this.$torque;
        // TODO: We may not need to bootstrap when units are correctly handled?
        // Bootstrap the angular momentum unit of measure for the body.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            const uom = Unit.mul(metric.uom(T), uomTime);
            // console.lg(`Bootstrap L.uom to ${uom}`);
            metric.setUom(body.L, uom);
        }
        // TODO: Could we add geometric constraints for torques here?
        // TODO: we don't know how to handle the indices, so dynamics must check units compatibility.
        dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);

        if (this.$showForces) {
            forceApp.expireTime = this.$varsList.getTime();
            this.$simList.add(forceApp);
        }
    }

    private applyTorqueLaws(rateOfChange: number[], units: Unit[], Δt: number, uomTime?: Unit): void {
        const torqueLaws = this.$torqueLaws;
        const Ni = torqueLaws.length;
        for (let i = 0; i < Ni; i++) {
            const torqueLaw = torqueLaws[i];
            const torques = torqueLaw.updateTorques();
            const Nj = torques.length;
            for (let j = 0; j < Nj; j++) {
                this.applyTorque(rateOfChange, units, torques[j], Δt, uomTime);
            }
        }
    }

    /**
     * 
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param torqueApp 
     * @param Δt 
     * @param uomTime 
     * @returns 
     */
    private applyTorque(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], torqueApp: Torque<T>, Δt: number, uomTime?: Unit): void {
        const body = torqueApp.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        const metric = this.metric;
        const dynamics = this.kinematics;

        // The rate of change of angular momentum is torque.
        // dL/dt = T
        torqueApp.computeTorque(this.$torque);
        const T = this.$torque;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            const uom = Unit.mul(metric.uom(T), uomTime);
            // console.lg(`Bootstrap L.uom to ${uom}`);
            metric.setUom(body.L, uom);
        }
        dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);

        // TODO: When the torque is applied away from the center of mass, do we add linear momentum?
        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        /*
        torqueApp.computeTorque(this.$torque);
        const T = this.$torque;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
        }
        // TODO: Could we add geometric constraints for torques here?
        dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChange, idx, T);
        */

        if (this.$showTorques) {
            torqueApp.expireTime = this.$varsList.getTime();
            this.$simList.add(torqueApp);
        }
    }

    private applyConstraints(rateOfChange: number[], rateOfChangeUoms: Unit[], Δt: number, uomTime?: Unit): void {
        const constraints = this.$constraints;
        const Nconstraints = constraints.length;
        for (let i = 0; i < Nconstraints; i++) {
            const constraint = constraints[i];
            this.applyConstraint(rateOfChange, rateOfChangeUoms, constraint, Δt, uomTime);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private applyConstraint(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], constraint: GeometricConstraint<T>, Δt: number, uomTime?: Unit): void {
        const body = constraint.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        const metric = this.metric;
        const dynamics = this.kinematics;

        // TODO: This could be a scratch variable.
        const F = metric.scalar(0);
        const r = metric.scalar(0);
        const B = metric.scalar(0);
        const eΘ = metric.scalar(0);
        const Fnew = metric.scalar(0);
        const FnewR = metric.scalar(0);
        const FnewΘ = metric.scalar(0);
        const N = metric.scalar(0);

        dynamics.getForce(rateOfChangeVals, rateOfChangeUoms, idx, F);
        const X = body.X;
        const P = body.P;
        const M = body.M;

        constraint.computeRadius(X, r);
        constraint.computeRotation(X, B);
        constraint.computeTangent(X, eΘ);

        metric.copyVector(eΘ, FnewR);                           // FnewR = eΘ
        metric.mul(FnewR, B);                                   // FnewR = eΘ * B = -er
        metric.neg(FnewR);                                      // FnewR = er
        metric.direction(FnewR);                                // FnewR = er 
        metric.mulByVector(FnewR, P);                           // FnewR = er * P
        metric.mulByVector(FnewR, P);                           // FnewR = er * P * P = (P * P) er
        metric.divByScalar(FnewR, metric.a(M), metric.uom(M));  // FnewR = ((P * P) / m) er
        metric.divByScalar(FnewR, metric.a(r), metric.uom(r));  // FnewR = ((P * P) / (m * r)) er
        metric.neg(FnewR);                                      // FnewR = - ((P * P) / (m * r)) er

        metric.copyVector(F, FnewΘ);                            // FnewΘ = F
        metric.scp(FnewΘ, eΘ);                                  // FnewΘ = F | eΘ
        metric.mulByVector(FnewΘ, eΘ);                          // FnewΘ = (F | eΘ) eΘ

        metric.copyVector(FnewR, Fnew);                         // Fnew = FnewR
        metric.addVector(Fnew, FnewΘ);                          // Fnew = FnewR + FnewΘ

        metric.copyVector(Fnew, N);                             // N = Fnew
        metric.subVector(N, F);                                 // N = Fnew - F or Fnew = F + N 

        // Update the rateOfChange of Linear Momentum (force); 
        dynamics.setForce(rateOfChangeVals, rateOfChangeUoms, idx, Fnew);

        // The constraint holds the computed force so that it can be visualized.
        constraint.setForce(N);
    }

    /**
     * 
     */
    get time(): number {
        return this.$varsList.getTime();
    }

    /**
     * 
     */
    updateFromBodies(): void {
        const bodies = this.$bodies;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            this.updateVarsFromBody(bodies[i]);
        }
        this.discontinuousChangeToEnergy();
    }

    /**
     * 
     */
    private updateVarsFromBody(body: ForceBody<T>): void {
        const idx = body.varsIndex;
        if (idx > -1) {
            this.kinematics.updateVarsFromBody(body, idx, this.$varsList);
        }
    }

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * @hidden
     */
    epilog(stepSize: number, uomTime?: Unit): void {
        const varsList = this.$varsList;
        const vars = varsList.getValues();
        const units = varsList.getUnits();
        this.updateBodiesFromStateVariables(vars, units, uomTime);
        const dynamics = this.kinematics;
        dynamics.epilog(this.$bodies, this.$forceLaws, this.$potentialOffset, varsList);
    }

    /**
     * Provides a reference to the bodies in the simulation.
     */
    get bodies(): ForceBody<T>[] {
        return this.$bodies;
    }

    /**
     * @hidden
     */
    get simList(): SimList {
        return this.$simList;
    }

    /**
     * @hidden
     */
    get varsList(): VarsList {
        return this.$varsList;
    }

    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    totalEnergy(): T {
        const metric = this.metric;

        metric.unlock(this.$totalEnergy, this.$totalEnergyLock);

        // TODO: Could be more efficient...
        metric.write(metric.scalar(0), this.$totalEnergy);

        metric.add(this.$totalEnergy, this.$potentialOffset);

        const bs = this.$bodies;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const body = bs[i];
            if (isFinite(metric.a(body.M))) {
                metric.add(this.$totalEnergy, body.rotationalEnergy());
                metric.add(this.$totalEnergy, body.translationalEnergy());
            }
        }

        const fs = this.$forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            metric.add(this.$totalEnergy, fs[i].potentialEnergy());
        }

        this.$totalEnergyLock = metric.lock(this.$totalEnergy);

        return this.$totalEnergy;
    }
}
