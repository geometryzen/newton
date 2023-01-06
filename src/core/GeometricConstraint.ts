import { ForceBody } from "./ForceBody";

/**
 *
 */
export interface GeometricConstraint<T> {
    /**
     * 
     */
    getBody(): ForceBody<T>;
    /**
     * Computes the radius of the curve.
     * @param x (input) The location at which the radius is required.
     * @param radius (output) The radius (scalar).
     */
    computeRadius(x: T, radius: T): void;
    /**
     * Computes the plane containing the rotation.
     * The orientation is ambiguous.
     * However tangent * rotation should give the direction towards the center of curvature. 
     * @param x (input) The position (vector) at which the rotation is required.
     * @param plane (output) The rotation (bivector).
     */
    computeRotation(x: T, plane: T): void;
    /**
     * Computes the tangent to the wire.
     * The orientation is ambiguous.
     * However tangent * rotation should give the direction towards the center of curvature. 
     * @param x (input) The position (vector) at which the tangent is required.
     * @param tangent (output) The tangent (vector).
     */
    computeTangent(x: T, tangent: T): void;
    /**
     * 
     * @param N 
     */
    setForce(N: T): void;
}
