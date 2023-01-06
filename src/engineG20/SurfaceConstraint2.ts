import { Geometric2 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { SurfaceConstraint } from "../core/SurfaceConstraint";

export class SurfaceConstraint2 extends SurfaceConstraint<Geometric2> {
    constructor(body: ForceBody<Geometric2>, radiusFn: (x: Geometric2, radius: Geometric2) => void, rotationFn: (x: Geometric2, plane: Geometric2) => void, tangentFn: (x: Geometric2, tangent: Geometric2) => void) {
        super(body, radiusFn, rotationFn, tangentFn);
    }
}
