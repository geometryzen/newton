import { ForceBody } from './ForceBody';
/**
 * A ForceBody with a mass property, M.
 */
export interface Massive<T> extends ForceBody<T> {
    M: T;
}
