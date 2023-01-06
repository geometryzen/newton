import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { Metric } from "./Metric";

/**
 * @hidden
 */
export class LockableMeasure<T> {
    private readonly $value: T;
    private $lock: number;
    /**
     * 
     * @param metric 
     * @param initialValue A value that is copied. 
     */
    constructor(private readonly metric: Metric<T>, initialValue: T) {
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('initialValue', initialValue);
        this.$value = metric.scalar(0);
        metric.copy(initialValue, this.$value);
        this.lock();
    }
    get(): T {
        return this.$value;
    }
    /**
     * 1. Asserts that the value is defined and not null.
     * 2. Unlocks the `this` value.
     * 3. Copies the value to the `this` value.
     * 4. Locks the `this` value.
     * 
     * @param value The value to be set into `this` value.
     */
    set(value: T): void {
        mustBeNonNullObject('value', value);
        this.metric.copy(value, this.unlock());
        this.lock();
    }
    lock(): T {
        const value = this.$value;
        this.$lock = this.metric.lock(value);
        return value;
    }
    unlock(): T {
        const value = this.$value;
        this.metric.unlock(value, this.$lock);
        return value;
    }
}
