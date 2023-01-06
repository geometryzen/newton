import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { ForceBody } from "./ForceBody";
import { GeometricConstraint } from "./GeometricConstraint";

/**
 * @hidden
 */
export class SurfaceConstraint<T> implements GeometricConstraint<T> {
    public readonly N: T;
    constructor(private readonly body: ForceBody<T>, private readonly radiusFn: (x: T, radius: T) => void, private readonly rotationFn: (x: T, plane: T) => void, private readonly tangentFn: (x: T, tangent: T) => void) {
        mustBeNonNullObject('body', body);
        const metric = body.metric;
        this.N = metric.scalar(0);
    }
    getBody(): ForceBody<T> {
        return this.body;
    }
    computeRadius(x: T, radius: T): void {
        this.radiusFn(x, radius);
    }
    computeRotation(x: T, plane: T): void {
        this.rotationFn(x, plane);
    }
    computeTangent(x: T, tangent: T): void {
        this.tangentFn(x, tangent);
    }
    setForce(N: T): void {
        const metric = this.body.metric;
        metric.copyVector(N, this.N);
    }
}
