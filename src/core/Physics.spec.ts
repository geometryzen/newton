import { Geometric3, Unit } from '@geometryzen/multivectors';
import { Block3 } from '../engineG30/Block3';
import { KinematicsG30 } from '../engineG30/KinematicsG30';
import { MetricG30 } from '../engineG30/MetricG30';
import { Physics } from './Physics';

describe("Physics", function () {
    describe("Ω calculation", function () {
        it("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            // Not actually using this yet, other than to test construction.
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const sim = new Physics(metric, dynamics);
            const body = new Block3(Geometric3.scalar(1), Geometric3.scalar(2), Geometric3.scalar(3));
            body.M = Geometric3.scalar(12);
            body.L.yz = 3;
            body.L.zx = 5;
            body.L.xy = 7;
            body.L.uom = Unit.KILOGRAM.mul(Unit.METER).mul(Unit.METER).div(Unit.SECOND);
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.R.direction();

            /**
             * Rotor from world coordinates to local coordinates.
             */
            const ω = Geometric3.vector(body.L.yz, body.L.zx, body.L.xy, body.L.uom);
            ω.rotate(body.R.rev());
            ω.applyMatrix(body.Iinv);
            ω.rotate(body.R.rev());
            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;

            // Just to make the sim be used.
            sim.addBody(body);

            const Ω = Geometric3.bivector(0, 0, 0, Unit.inv(Unit.SECOND)).copy(body.L).rotate(body.R.rev()).applyMatrix(body.Iinv).rotate(body.R.rev());

            expect(body.Ω.xy).toBeCloseTo(Ω.xy, 15);
            expect(body.Ω.yz).toBeCloseTo(Ω.yz, 15);
            expect(body.Ω.zx).toBeCloseTo(Ω.zx, 15);
        });
    });
});
