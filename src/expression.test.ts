import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

import { Expression } from './expression';
import { astToMath } from './ast';

describe("expression", () => {
    it("it should be able to evaluate basic expressions", () => {
        let e1 = new Expression("3 + 3")
        expect(e1.eval({})).to.be.equals(6)

        let e2 = new Expression("3 - 3")
        expect(e2.eval({})).to.be.equals(0)

        let e3 = new Expression("3 * a")
        expect(e3.eval({ a: 5 })).to.be.equals(15)
    })

    it("should respect basic OOO", () => {
        let e1 = new Expression("1 + 2 * 3")
        expect(e1.eval({})).to.be.equals(7)
    })

    it("should respect implicit mul", () => {
        let e1 = new Expression("3 a b")
        expect(e1.eval({ a: 3, b: 5 })).to.be.equals(45)
    })

    it("should do partial solves", () => {
        let e1 = new Expression("4*2 + x")
        expect(astToMath(e1.simplify({}))).to.eql("8 + x")
    })
})