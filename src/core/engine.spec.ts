import { Geometric1, Geometric2, Geometric3, Unit } from '@geometryzen/multivectors';
import { Block1 } from '../engineG10/Block1';
import { Engine1 } from '../engineG10/Engine1';
import { Force1 } from '../engineG10/Force1';
import { Particle1 } from '../engineG10/Particle1';
import { Block2 } from '../engineG20/Block2';
import { Disc2 } from '../engineG20/Disc2';
import { Engine2 } from '../engineG20/Engine2';
import { Euclidean2 } from '../engineG20/Euclidean2';
import { Force2 } from '../engineG20/Force2';
import { KinematicsG20 } from '../engineG20/KinematicsG20';
import { Particle2 } from '../engineG20/Particle2';
import { Polygon2 } from '../engineG20/Polygon2';
import { SurfaceConstraint2 } from '../engineG20/SurfaceConstraint2';
import { Block3 } from '../engineG30/Block3';
import { KinematicsG30 } from '../engineG30/KinematicsG30';
import { MetricG30 } from '../engineG30/MetricG30';
import { Particle3 } from '../engineG30/Particle3';
import { SurfaceConstraint3 } from '../engineG30/SurfaceConstraint3';
import { ConstantForceLaw } from './ConstantForceLaw';
import { ConstantTorqueLaw } from './ConstantTorqueLaw';
import { Engine } from './Engine';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { LinearDamper } from './LinearDamper';
import { Spring } from './Spring';

/**
 * @hidden
 */
class MyForceLaw1 implements ForceLaw<Geometric1> {
    expireTime: number;
    private readonly force: Force1;
    private readonly $forces: [Force1];
    constructor(private readonly body: Particle1) {
        this.force = new Force1(body);
        this.$forces = [this.force];
    }
    get forces(): Force<Geometric1>[] {
        return this.$forces;
    }
    updateForces(): Force<Geometric1>[] {
        const Θ = this.body.X.x;
        const cosΘ = Math.cos(Θ);
        this.force.F.zero().addVector({ x: cosΘ }).neg();
        return this.$forces;
    }
    disconnect(): void {
        // Do nothing.
    }
    potentialEnergy(): Geometric1 {
        return new Geometric1();
    }
}

/**
 * @hidden
 */
class MyForceLaw2 implements ForceLaw<Geometric2> {
    expireTime: number;
    private readonly force: Force2;
    private readonly $forces: [Force2];
    constructor(private readonly body: Particle2) {
        this.force = new Force2(body);
        // console.lg(this.force.locationCoordType);
        // console.lg(this.force.vectorCoordType);
        this.$forces = [this.force];
    }
    get forces(): Force<Geometric2>[] {
        return this.$forces;
    }
    updateForces(): Force<Geometric2>[] {
        // console.lg(`BEFORE F=>${this.force.F}`);
        const Θ = this.body.X.x;
        const cosΘ = Math.cos(Θ);
        this.force.vector.zero().addVector({ x: cosΘ, y: 0 }).neg();
        this.force.location.copyVector(this.body.X);
        // console.lg(`AFTER F=>${this.force.F}`);
        return this.$forces;
    }
    disconnect(): void {
        // Do nothing.
    }
    potentialEnergy(): Geometric2 {
        return new Geometric2();
    }
}

describe("engine", function () {
    describe("static", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.kilogram;
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;
            block.updateAngularVelocity();

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.y).toBe(0);
            expect(block.Ω.b).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);

            engine.addBody(block);

            engine.advance(1, Unit.SECOND);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));

            engine.addBody(block);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
        });
    });
    describe("constant velocity", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.kilogram;
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.x = 1;
            block.P.y = 2;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);

            engine.addBody(block);

            engine.advance(1, Unit.SECOND);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(1);
            expect(block.X.y).toBe(2);
            expect(block.X.b).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.kilogram;
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.x = 1;
            block.P.y = 2;
            block.P.z = 3;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            engine.addBody(block);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(1);
            expect(block.X.y).toBe(2);
            expect(block.X.z).toBe(3);
        });
    });
    describe("constant force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            // The linear momentum uom should bootstrap from the integration of the force over time. 
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric2.vector(1, 0, Unit.NEWTON));

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.x).toBe(0);
            expect(block.R.y).toBe(0);
            expect(block.R.b).toBe(0);
            expect(block.R.uom).toBe(Unit.ONE);

            expect(block.P.a).toBe(0);
            expect(block.P.x).toBe(0);
            expect(block.P.y).toBe(0);
            expect(block.P.b).toBe(0);
            // expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            expect(block.L.a).toBe(0);
            expect(block.L.x).toBe(0);
            expect(block.L.y).toBe(0);
            expect(block.L.b).toBe(0);
            expect(block.L.uom).toBe(Unit.JOULE_SECOND);

            engine.addBody(block);
            engine.addForceLaw(F);

            engine.advance(1, Unit.SECOND);

            expect(block.M.a).toBe(1);
            expect(block.M.x).toBe(0);
            expect(block.M.y).toBe(0);
            expect(block.M.b).toBe(0);
            expect(block.M.uom).toBe(Unit.KILOGRAM);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.x).toBe(0);
            expect(block.R.y).toBe(0);
            expect(block.R.b).toBe(0);
            expect(block.R.uom).toBe(Unit.ONE);

            expect(block.P.a).toBe(0);
            expect(block.P.x).toBe(1);
            expect(block.P.y).toBe(0);
            expect(block.P.b).toBe(0);
            expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            expect(block.L.a).toBe(0);
            expect(block.L.x).toBe(0);
            expect(block.L.y).toBe(0);
            expect(block.L.b).toBe(0);
            expect(block.L.uom).toBe(Unit.JOULE_SECOND);

            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.y).toBe(0);
            expect(block.Ω.b).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);

        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            // The linear momentum uom should bootstrap from the integration of the force over time. 
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);
        });
    });
    describe("constant torque", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;
            block.updateAngularVelocity();

            const T = new ConstantTorqueLaw(block, Geometric2.bivector(1, Unit.mul(Unit.NEWTON, Unit.METER)), 0);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);

            engine.addBody(block);
            engine.addTorqueLaw(T);

            engine.advance(1, Unit.SECOND);
        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
            // Unit is undefined while value is zero.
            // expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.xy).toBe(0);
            expect(block.R.yz).toBe(0);
            expect(block.R.zx).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.xy).toBe(0);
            expect(block.R.yz).toBe(0);
            expect(block.R.zx).toBe(0);

            expect(block.P.x).toBe(1);
            expect(block.P.y).toBe(0);
            expect(block.P.z).toBe(0);
            expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            // expect(block.L.a).toBe(1);
            expect(block.L.xy).toBe(0);
            expect(block.L.yz).toBe(0);
            expect(block.L.zx).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

        });
    });
    describe("spring force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const block1 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block1.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block1.X = Geometric2.vector(-1, 0, Unit.METER);
            block1.R.uom = Unit.ONE;
            block1.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block1.L.uom = Unit.JOULE_SECOND;

            const block2 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block2.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block2.X = Geometric2.vector(1, 0, Unit.METER);
            block2.R.uom = Unit.ONE;
            block2.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block2.L.uom = Unit.JOULE_SECOND;

            const spring = new Spring(block1, block2);
            spring.k = Geometric2.scalar(1, Unit.STIFFNESS);
            spring.restLength = Geometric2.scalar(1, Unit.METER);

            expect(block1.X.x).toBe(-1);
            expect(block1.X.y).toBe(0);

            expect(block2.X.x).toBe(1);
            expect(block2.X.y).toBe(0);

            engine.addBody(block1);
            engine.addBody(block2);
            engine.addForceLaw(spring);

            engine.advance(1, Unit.SECOND);

            expect(block1.X.x).toBe(-0.5833333333333333);
            expect(block1.X.y).toBe(0);

            // engine.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(1);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(4.5);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(8);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(12.5);
            // expect(block1.X.y).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
        });
    });
    describe("constraints", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new KinematicsG20();
            const engine = new Engine(metric, dynamics);

            const dimensionless = true;
            const kg = dimensionless ? Unit.ONE : Unit.KILOGRAM;
            const m = dimensionless ? Unit.ONE : Unit.METER;
            const s = dimensionless ? Unit.ONE : Unit.SECOND;
            const C = dimensionless ? Unit.ONE : Unit.COULOMB;
            const N = dimensionless ? Unit.ONE : Unit.NEWTON;
            const KILOGRAM_METER_PER_SECOND = dimensionless ? Unit.ONE : Unit.KILOGRAM_METER_PER_SECOND;
            const JOULE_SECOND = dimensionless ? Unit.ONE : Unit.JOULE_SECOND;

            const bead = new Particle2(Geometric2.scalar(1, kg), Geometric2.scalar(0, C));
            const F = new ConstantForceLaw(bead, Geometric2.vector(0, -1, N));

            bead.X = Geometric2.vector(1, 1).direction().mulByScalar(1, m);
            bead.R.uom = Unit.ONE;
            bead.P.uom = KILOGRAM_METER_PER_SECOND;
            bead.L.uom = JOULE_SECOND;

            const radiusFn = function (x: Geometric2, radius: Geometric2): void {
                radius.copyScalar(1, m);
            };

            const rotationFn = function (x: Geometric2, plane: Geometric2): void {
                plane.copyVector(Geometric2.e1).mulByVector(Geometric2.e2).direction();
            };

            const tangentFn = function (x: Geometric2, tangent: Geometric2): void {
                tangent.copyVector(x).mulByVector(Geometric2.e1).mulByVector(Geometric2.e2).direction();
            };
            const S = new SurfaceConstraint2(bead, radiusFn, rotationFn, tangentFn);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);

            for (let i = 0; i < 10; i++) {
                engine.advance(0.001, s);
            }
            expect(true).toBe(true);
        });
        it("Euclidean3D", function () {
            const metric = new MetricG30();
            const dynamics = new KinematicsG30();
            const engine = new Engine(metric, dynamics);

            const dimensionless = true;
            const kg = dimensionless ? Unit.ONE : Unit.KILOGRAM;
            const m = dimensionless ? Unit.ONE : Unit.METER;
            const s = dimensionless ? Unit.ONE : Unit.SECOND;
            const C = dimensionless ? Unit.ONE : Unit.COULOMB;
            const N = dimensionless ? Unit.ONE : Unit.NEWTON;
            const KILOGRAM_METER_PER_SECOND = dimensionless ? Unit.ONE : Unit.KILOGRAM_METER_PER_SECOND;
            const JOULE_SECOND = dimensionless ? Unit.ONE : Unit.JOULE_SECOND;

            const bead = new Particle3(Geometric3.scalar(1, kg), Geometric3.scalar(0, C));
            const F = new ConstantForceLaw(bead, Geometric3.vector(0, -1, 0, N));

            bead.X = Geometric3.vector(1, 1, 0).direction().mulByScalar(1, m);
            bead.R.uom = Unit.ONE;
            bead.P.uom = KILOGRAM_METER_PER_SECOND;
            bead.L.uom = JOULE_SECOND;

            const radiusFn = function (x: Geometric3, radius: Geometric3): void {
                radius.copyScalar(1, m);
            };

            const rotationFn = function (x: Geometric3, plane: Geometric3): void {
                plane.copyVector(Geometric3.e1).mulByVector(Geometric3.e2).direction();
            };

            const tangentFn = function (x: Geometric3, tangent: Geometric3): void {
                tangent.copyVector(x).mulByVector(Geometric3.e1).mulByVector(Geometric3.e2).direction();
            };

            const S = new SurfaceConstraint3(bead, radiusFn, rotationFn, tangentFn);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);
            // engine.removeConstraint(S);

            for (let i = 0; i < 100; i++) {
                engine.advance(0.01, s);
                // console.lg(`X=>${bead.X}`);
                // console.lg(`|X|=>${bead.X.magnitude(false)}`);
            }
            expect(true).toBe(true);
        });
    });
    describe("examples", function () {
        it("Physics Engine Collisions", function () {
            const e1 = Geometric2.e1;
            const kg = Geometric2.kilogram;
            const m = Geometric2.meter;
            const s = Geometric2.second;

            const sim = new Engine2();
            const Δt = s.mulByNumber(0.01);

            const bodies: Block2[] = [];
            const width = m;
            const height = m;
            const blockA = new Block2(width, height);
            bodies.push(blockA);
            const blockB = new Block2(width.mulByNumber(2), height.mulByNumber(2));
            bodies.push(blockB);
            const wallL = new Block2(width.mulByNumber(0.5), height.mulByNumber(8));
            bodies.push(wallL);
            const wallR = new Block2(width.mulByNumber(0.5), height.mulByNumber(8));
            bodies.push(wallR);

            // blockA.M = kg;
            // blockA.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            blockA.X = m.mulByNumber(-3).mulByVector(e1);
            blockA.P = e1.mulByNumber(10).mul(kg).mul(m).div(s);
            // blockA.L.uom = Unit.JOULE_SECOND;
            blockA.updateAngularVelocity();

            blockB.M = kg.mulByNumber(4);
            blockB.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            blockB.X = m.mulByNumber(0).mulByVector(e1);
            blockB.X = m.mulByNumber(0); // The direction is not important when the value is zero but the units are.
            blockB.L.uom = Unit.JOULE_SECOND;
            blockB.updateAngularVelocity();

            wallL.M = kg.mulByNumber(100000000);
            wallL.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            wallL.X = m.mulByNumber(-5.25).mulByVector(e1);
            wallL.L.uom = Unit.JOULE_SECOND;
            wallL.updateAngularVelocity();

            wallR.M = kg.mulByNumber(100000000);
            wallR.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            wallR.X = m.mulByNumber(5.25).mulByVector(e1);
            wallR.L.uom = Unit.JOULE_SECOND;
            wallR.updateAngularVelocity();

            sim.addBody(blockA);
            sim.addBody(blockB);
            sim.addBody(wallL);
            sim.addBody(wallR);

            sim.advance(Δt.a, Δt.uom);

            expect(true).toBe(true);
        });
        it("Physics Engine Rotating Bodies", function () {
            const one = Geometric2.one;
            const e1 = Geometric2.e1;
            const e2 = Geometric2.e2;
            const kg = Geometric2.kilogram;
            const m = Geometric2.meter;
            const s = Geometric2.second;
            const N = Geometric2.newton;

            const sim = new Engine2();
            const Δt = s.mulByNumber(0.01);

            const width = m.mulByNumber(6);
            const height = m;
            const block = new Block2(width, height);

            block.M = kg.mulByNumber(0.1);
            block.X = m.mulByNumber(0).mulByVector(e1);
            block.R = one;
            // Ω is initialized to zero with an undefined unit of measure (equivalent to 1).
            // The dependencies are M, L, h, and w.
            // block.L.uom = Unit.JOULE_SECOND;
            block.updateAngularVelocity();

            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.y).toBe(0);
            expect(block.Ω.b).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);

            const f1 = new ConstantForceLaw(block, N.mulByNumber(1.0).mulByVector(e2), 1);
            const f2 = new ConstantForceLaw(block, N.mulByNumber(-0.7).mulByVector(e2), 1);
            const f3 = new ConstantForceLaw(block, N.mulByNumber(-0.3).mulByVector(e2), 1);

            f2.location = m.mulByNumber(-2).mulByVector(e1);
            f3.location = m.mulByNumber(2).mulByVector(e1);

            sim.addBody(block);
            sim.addForceLaw(f1);
            sim.addForceLaw(f2);
            sim.addForceLaw(f3);

            sim.advance(Δt.a, Δt.uom);

            expect(true).toBe(true);
        });
        it("Ball Hanging from a Spring", function () {
            // const zero = Geometric2.zero
            // const one = Geometric2.one;
            const e1 = Geometric2.e1;
            const e2 = Geometric2.e2;
            const kg = Geometric2.kilogram;
            const m = Geometric2.meter;
            const s = Geometric2.second;
            const N = Geometric2.newton;

            const gram = kg.mulByNumber(0.001);
            const cm = m.mulByNumber(0.01);
            const g = N.mulByNumber(-9.81).div(kg).mul(e2);

            const BALL_MASS = gram.mulByNumber(500);
            const ROPE_FORCE = N.mulByNumber(3).mulByVector(e1);
            const SPRING_K = N.mulByNumber(1000).div(m);
            const SPRING_L = cm.mulByNumber(20);

            const sim = new Engine2();
            const Δt = s.mulByNumber(0.01);

            const hangPoint = cm.mulByNumber(100).mulByVector(e2);

            const ball = new Disc2(cm.mulByNumber(2));
            const support = new Block2(cm.mulByNumber(40), cm.mulByNumber(10));
            support.I.uom = Unit.mul(Unit.JOULE_SECOND, Unit.SECOND);
            support.X = cm.mulByNumber(78).mulByVector(e2);
            // support.R.uom = Unit.ONE
            // support.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            // support.L.uom = Unit.JOULE_SECOND;
            support.updateAngularVelocity();

            ball.M = BALL_MASS;
            // ball.I.uom = Unit.mul(Unit.JOULE_SECOND, Unit.SECOND);
            ball.X = cm.mulByNumber(78).mulByVector(e2);
            // ball.R.uom = Unit.ONE;
            // ball.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            // ball.L.uom = Unit.JOULE_SECOND;
            ball.updateAngularVelocity();

            support.M = kg.mulByNumber(100000000); // TODO: Try working with infinity
            support.X = e2.mul(support.height).divByNumber(2).add(hangPoint);

            const spring = new Spring(support, ball);
            spring.restLength = SPRING_L;
            spring.stiffness = SPRING_K;
            spring.attach1 = e2.mul(support.height).divByNumber(2).neg();

            const damper = new LinearDamper(support, ball);
            damper.b = N.mulByNumber(1).mul(s).div(m);

            const ropeForce = new ConstantForceLaw(ball, ROPE_FORCE);
            const gravForce = new ConstantForceLaw(ball, g.mul(ball.M));

            sim.addBody(ball);
            sim.addBody(support);
            sim.addForceLaw(spring);
            // sim.addForceLaw(damper)
            sim.addForceLaw(ropeForce);
            sim.addForceLaw(gravForce);

            sim.advance(Δt.a, Δt.uom);

            expect(true).toBe(true);
        });
        it("Polygon Rigid Body", function () {
            const e1 = Geometric2.e1;
            const e2 = Geometric2.e2;

            const sim = new Engine2();

            const points: Geometric2[] = [];

            points.push(Geometric2.vector(0, 0, Unit.METER));
            points.push(Geometric2.vector(2, 0, Unit.METER));
            points.push(Geometric2.vector(2, 1, Unit.METER));
            points.push(Geometric2.vector(1, 1, Unit.METER));
            points.push(Geometric2.vector(1, 3, Unit.METER));
            points.push(Geometric2.vector(0, 3, Unit.METER));

            const body = new Polygon2(points);

            expect(body.X.uom).toBe(Unit.METER);

            body.X = Geometric2.vector(1, 0, Unit.METER);
            body.R = Geometric2.rotorFromDirections(e1, e1.add(e2));
            body.P = Geometric2.vector(1, 0, Unit.KILOGRAM_METER_PER_SECOND);
            // body.L = Geometric2.bivector(1);

            sim.addBody(body);
            sim.advance(0.1, Unit.SECOND);
            expect(true).toBe(true);
        });
        it("Physics Engine 1D", function () {
            const e1 = Geometric1.e1;
            const kg = Geometric1.kilogram;
            const m = Geometric1.meter;
            const s = Geometric1.second;

            const sim = new Engine1();
            const Δt = s.mulByNumber(0.01);

            const width = m;
            const blockA = new Block1(width);

            blockA.M = kg.mulByNumber(1);
            blockA.X = m.mulByNumber(-3).mul(e1);
            blockA.P = e1.mulByNumber(10).mul(kg).mul(m).div(s);

            sim.addBody(blockA);
            sim.advance(Δt.a, Δt.uom);
            expect(true).toBe(true);
        });
        it("Motion on a Circle (Engine1)", function () {
            const sim = new Engine1();
            const Δt = 0.001;

            const bead = new Particle1(Geometric1.scalar(1), new Geometric1([0, 0]));

            const forceLaw = new MyForceLaw1(bead);

            sim.addBody(bead);
            sim.addForceLaw(forceLaw);

            for (let i = 0; i < 10; i++) {
                sim.advance(Δt);
            }

            expect(true).toBe(true);
        });
        it("Motion on a Circle (Engine2)", function () {
            const sim = new Engine2();
            const Δt = 0.001;

            const bead = new Particle2(Geometric2.scalar(1), new Geometric2([0, 0, 0, 0]));

            const forceLaw = new MyForceLaw2(bead);

            sim.addBody(bead);
            sim.addForceLaw(forceLaw);

            for (let i = 0; i < 10; i++) {
                sim.advance(Δt);
            }

            expect(true).toBe(true);
        });
    });
});
