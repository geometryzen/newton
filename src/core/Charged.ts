import { ForceBody } from './ForceBody';

/**
 * @hidden
 */
export interface Charged<T> extends ForceBody<T> {
    Q: T;
}
