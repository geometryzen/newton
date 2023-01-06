# @geometryzen/newton
A Physics Engine for research and education using Geometric Algebra, and Units of Measure (optional).

The following metrics are supported:

<table>
    <tr>
        <th>Description</th><th>Algebra</th><th>class</th>
    </tr>
    <tr>
        <td>Euclidean 1D</td><td>G(1,0)</td><td>Engine1</td>
    </tr>
    <tr>
        <td>Euclidean 2D</td><td>G(2,0)</td><td>Engine2</td>
    </tr>
    <tr>
        <td>Euclidean 3D</td><td>G(3,0)</td><td>Engine3</td>
    </tr>
    <tr>
        <td>Spacetime 1D</td><td>G(1,1)</td><td>EngineG11</td>
    </tr>
    <tr>
        <td>Spacetime 2D</td><td>G(2,1)</td><td>EngineG21</td>
    </tr>
</table>

# Getting Started

The following code illustrates the basic flow. For working examples see [STEMCstudio](https://www.stemcstudio.com/examples).

## Constructing the core simulation using the `Engine3` Euclidean 3D or G(3,0) Physics engine.

This example incorporates units of measure.

```typescript
import {
    Block3,
    Engine3,
    Geometric3,
    Spring
} from '@geometryzen/newton'

//
// Constants
//
const e1 = Geometric3.e1
const e2 = Geometric3.e2
const e3 = Geometric3.e3
const kg = Geometric3.kilogram
const m = Geometric3.meter
const s = Geometric3.second

//
// Initialization
//
const sim = new Engine3()
const Δt = 0.01 * s

//
// Add objects
//
const width = 0.5 * m
const height = 0.1 * m
const depth = 0.5 * m
const block1 = new Block3(width, height, depth)
const block2 = new Block3(width, height, depth)

block1.M = 1 * kg
block2.M = 1 * kg

block1.X = -1.0 * e1 * m
block2.X = +1.0 * e1 * m

sim.addBody(block1)
sim.addBody(block2)

//
// Add forces
//
const spring = new Spring(block1, block2)
spring.restLength = 1 * m
spring.stiffness = 1 * kg / (s * s)
sim.addForceLaw(spring)
spring.attach1 = (block1.width * e1 + 0 * block1.height * e2 + block1.depth * e3) / 2

// Inside animation "loop"
sim.advance(Δt.a, Δt.uom)
```
