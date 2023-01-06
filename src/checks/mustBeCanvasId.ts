import mustSatisfy from './mustSatisfy';
import isInteger from './isInteger';

/**
 * @hidden
 */
function beCanvasId(): string {
    return "be a `number` which is also an integer";
}

/**
 * @hidden
 */
export default function mustBeCanvasId(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isInteger(value), beCanvasId, contextBuilder);
    return value;
}
