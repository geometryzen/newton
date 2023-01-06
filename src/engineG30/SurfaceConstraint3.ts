import { Geometric3 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { SurfaceConstraint } from "../core/SurfaceConstraint";

export class SurfaceConstraint3 extends SurfaceConstraint<Geometric3> {
    constructor(body: ForceBody<Geometric3>, radiusFn: (x: Geometric3, radius: Geometric3) => void, rotationFn: (x: Geometric3, plane: Geometric3) => void, tangentFn: (x: Geometric3, tangent: Geometric3) => void) {
        super(body, radiusFn, rotationFn, tangentFn);
    }
}
