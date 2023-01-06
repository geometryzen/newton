import { Metric } from "./Metric";

/**
 * @hidden
 */
export interface EnergySystem<T> {
    readonly metric: Metric<T>;
    totalEnergy(): T;
}
