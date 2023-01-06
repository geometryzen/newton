/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spacetime2, Unit } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { Kinematics } from "../core/Kinematics";
import { VarsList } from "../core/VarsList";

export class KinematicsG21 implements Kinematics<Spacetime2> {
    private $speedOfLight = Spacetime2.one;
    get speedOfLight(): Spacetime2 {
        return this.$speedOfLight;
    }
    set speedOfLight(speedOfLight: Spacetime2) {
        this.$speedOfLight = speedOfLight;
    }
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    updateBodyFromVars(stateVals: number[], stateUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    updateVarsFromBody(body: ForceBody<Spacetime2>, idx: number, vars: VarsList): void {
        throw new Error("Method not implemented.");
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Spacetime2, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    epilog(bodies: ForceBody<Spacetime2>[], forceLaws: ForceLaw<Spacetime2>[], potentialOffset: Spacetime2, vars: VarsList): void {
        throw new Error("Method not implemented.");
    }
    discontinuousEnergyVars(): number[] {
        throw new Error("Method not implemented.");
    }
    getOffsetName(offset: number): string {
        throw new Error("Method not implemented.");
    }
    getVarNames(): string[] {
        return [VarsList.TIME];
    }
    numVarsPerBody(): number {
        return 1;
    }
}
