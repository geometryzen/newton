import { Unit } from '@geometryzen/multivectors';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
// import { DiffEqSolver } from './DiffEqSolver';
import { Kinematics } from './Kinematics';
import { Metric } from './Metric';
import { Physics } from './Physics';
import { SimList } from './SimList';
import { TorqueLaw } from './TorqueLaw';
import { VarsList } from './VarsList';

/**
 * @hidden
 */
const contextBuilderAdvance = () => "Engine.advance(Δt: number, uomTime?: Unit): void";

/**
 * 
 */
export interface EngineOptions {
    method?: 'rk4';
}

/**
 * A generic Physics Engine that may be specialized to a metric.
 */
export class Engine<T> {
    private readonly physics: Physics<T>;
    private readonly strategy: AdvanceStrategy;
    /**
     * 
     * @param metric 
     * @param kinematics 
     * @param options 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(metric: Metric<T>, private readonly kinematics: Kinematics<T>, options?: Partial<EngineOptions>) {
        this.physics = new Physics(metric, kinematics);
        const rk4 = new RungeKutta(this.physics);
        this.strategy = new DefaultAdvanceStrategy(this.physics, rk4);
    }
    /**
     * The speed of light.
     * For dimensionless simulations this will default to 1.
     * For S.I. Units, the speed of light may be set.
     */
    get speedOfLight(): T {
        return this.kinematics.speedOfLight;
    }
    set speedOfLight(speedOfLight: T) {
        this.kinematics.speedOfLight = speedOfLight;
    }

    get bodies(): ForceBody<T>[] {
        return this.physics.bodies;
    }

    /**
     * Returns the state variables of the system.
     */
    get varsList(): VarsList {
        return this.physics.varsList;
    }

    get simList(): SimList {
        return this.physics.simList;
    }

    /**
     * Adds a body to the system.
     * The state variables of the body will become part of the state vector of the system.
     * The state variables of the body will be updated each time the system is advanced in time.
     * @param body The body to be added to the system
     */
    addBody(body: ForceBody<T>): void {
        const contextBuilder = () => "Engine.addBody(body: ForceBody): void";
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.addBody(body);
    }

    /**
     * Removes a body from the system.
     * @param body The body to be removed from the system.
     */
    removeBody(body: ForceBody<T>): void {
        const contextBuilder = () => "Engine.removeBody(body: ForceBody): void";
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.removeBody(body);
    }

    /**
     * Adds a force law to the system.
     * @param forceLaw The force law to be added to the system.
     */
    addForceLaw(forceLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.addForceLaw(forceLaw: ForceLaw): void";
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.addForceLaw(forceLaw);
    }

    /**
     * Removes a force law from the system.
     * @param forceLaw The force law to be removed.
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.removeForceLaw(forceLaw: ForceLaw): void";
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.removeForceLaw(forceLaw);
    }

    /**
     * Adds a torque law to the system.
     * @param torqueLaw The torque law to be added to the system.
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        const contextBuilder = () => "Engine.addTorqueLaw(torqueLaw: TorqueLaw): void";
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.addTorqueLaw(torqueLaw);
    }
    /**
     * Removes a torque law from the system.
     * @param torqueLaw The torque law to be removed from the system.
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        const contextBuilder = () => "Engine.removeTorqueLaw(torqueLaw: TorqueLaw): void";
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.removeTorqueLaw(torqueLaw);
    }

    /**
     * Adds a geometric constraint to the system.
     * Geometric constraints are applied after the force and torques have been computed and before drift forces and torques.
     * @param geometry The geometric constraint to be added to the system.
     */
    addConstraint(geometry: GeometricConstraint<T>): void {
        const contextBuilder = () => "Engine.addGeometricConstraint(geometry: GeometricConstraint): void";
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.addConstraint(geometry);
    }

    /**
     * Removes a geometric constraint from the system.
     * @param geometry The geometric constraint to be removed from the system.
     */
    removeConstraint(geometry: GeometricConstraint<T>): void {
        const contextBuilder = () => "Engine.removeGeometricConstraint(geometry: GeometricConstraint): void";
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.removeConstraint(geometry);
    }

    /**
     * Adds a force law that is designed to compensate for numerical drift in the system.
     * A drift law is usually small and may take the form of a spring and/or damping force.
     * The drift laws are applied after any geometric constraints have been applied. 
     * @param driftLaw The drift force law to be applied.
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.addDriftLaw(driftLaw: ForceLaw): void";
        mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
        this.physics.addDriftLaw(driftLaw);
    }

    /**
     * Removes a force law that is designed to compensate for numerical drift in the system.
     * @param driftLaw The drift force law to be removed.
     */
    removeDriftLaw(driftLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.removeDriftLaw(driftLaw: ForceLaw): void";
        mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
        this.physics.removeDriftLaw(driftLaw);
    }

    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.   
     * @param Δt The time interval. 
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void {
        mustBeNumber('Δt', Δt, contextBuilderAdvance);
        this.strategy.advance(Δt, uomTime);
    }

    /**
     * Updates the state vector of the simulation from the states of the bodies in the system.
     * It is necessary to call this method after an intervention which changes the state of
     * a body in the system.
     */
    updateFromBodies(): void {
        this.physics.updateFromBodies();
    }

    /**
     * 
     * @returns The total energy (kinetic and potential) of the system.
     */
    totalEnergy(): T {
        return this.physics.totalEnergy();
    }

    get showForces(): boolean {
        return this.physics.showForces;
    }
    set showForces(showForces: boolean) {
        this.physics.showForces = showForces;
    }

    get showTorques(): boolean {
        return this.physics.showTorques;
    }
    set showTorques(showTorques: boolean) {
        this.physics.showTorques = showTorques;
    }
}
