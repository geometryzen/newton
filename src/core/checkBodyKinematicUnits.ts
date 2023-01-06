import { Unit } from "@geometryzen/multivectors";
import { ForceBody } from "./ForceBody";
import { Metric } from "./Metric";

/**
 * @hidden
 */
const ONE = Unit.ONE;
/**
 * @hidden
 */
const MASS = Unit.KILOGRAM;
/**
 * @hidden
 */
const LENGTH = Unit.METER;
/**
 * @hidden
 */
const TIME = Unit.SECOND;
/**
 * @hidden
 */
const FREQUENCY = Unit.INV_SECOND;
/**
 * @hidden
 */
const LINEAR_MOMENTUM = Unit.KILOGRAM_METER_PER_SECOND;
/**
 * @hidden
 */
const ANGULAR_MOMENTUM = Unit.JOULE_SECOND;

/**
 * @hidden
 * @param measure 
 * @param name 
 * @param metric 
 */
function checkDimensionless<T>(measure: T, name: 'M' | 'X' | 'R' | 'P' | 'L' | 'Ω', metric: Metric<T>): void {
    if (!Unit.isOne(metric.uom(measure))) {
        throw new Error(`${name}.uom should be ${ONE}, but was ${metric.uom(measure)}`);
    }
}

/**
 * @hidden
 * @param measure 
 * @param name 
 * @param metric 
 */
function checkUnit<T>(measure: T, name: 'M' | 'X' | 'R' | 'P' | 'L' | 'Ω', metric: Metric<T>, expectUom: Unit): void {
    if (!Unit.isCompatible(metric.uom(measure), expectUom)) {
        throw new Error(`${name}.uom should be ${expectUom}, but was ${metric.uom(measure)}`);
    }
}

/**
 * @hidden
 */
export function checkBodyKinematicUnits<T>(body: ForceBody<T>, metric: Metric<T>, uomTime: Unit): void {
    const M = body.M;
    const X = body.X;
    const R = body.R;
    const P = body.P;
    const L = body.L;
    const Ω = body.Ω;
    if (Unit.isOne(uomTime)) {
        checkDimensionless(M, 'M', metric);
        checkDimensionless(X, 'X', metric);
        checkDimensionless(R, 'R', metric);
        checkDimensionless(P, 'P', metric);
        checkDimensionless(L, 'L', metric);
        checkDimensionless(Ω, 'Ω', metric);
    }
    else if (Unit.isCompatible(uomTime, TIME)) {
        checkUnit(M, 'M', metric, MASS);
        checkUnit(X, 'X', metric, LENGTH);
        checkUnit(R, 'R', metric, ONE);
        checkUnit(P, 'P', metric, LINEAR_MOMENTUM);
        checkUnit(L, 'L', metric, ANGULAR_MOMENTUM);
        checkUnit(Ω, 'Ω', metric, FREQUENCY);
    }
}
