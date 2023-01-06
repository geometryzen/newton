import { KinematicsG20 } from "./KinematicsG20";

describe("KinematicsG20", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const dynamics = new KinematicsG20();
            expect(dynamics).toBeDefined();
        });
    });
});
