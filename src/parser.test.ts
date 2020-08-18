import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

import { parse, parseStr } from './parser'

describe("parser", () => {
    it("it should be able to parse basic math", () => {
        expect(parseStr("3 + 3").count()).to.equal(3)
        expect(parseStr("3").count()).to.equal(1)
        expect(parseStr("a + a").count()).to.equal(3)
        expect(parseStr("a").count()).to.equal(1)
        expect(parseStr("a - a").count()).to.equal(3)
        expect(parseStr("a a").count()).to.equal(3)
        expect(parseStr("3a").count()).to.equal(3)
        // parse("x = 4 + 1")
        // parse("x_f = x_i + v_x * t + (1/2) * a * t * t")
        // parse("v_x = v_i * cos(theta)")
        // parse("3x^2")
        // parse("(3x)^2")
    })

    it("it should do basic comparison", () => {
        expect(parseStr("3 + 3").equals(parseStr("3 + 3"))).to.be.true
        expect(parseStr("1 + 3").equals(parseStr("3 + 1"))).to.be.true

        expect(parseStr("3x + 35y / 3 - 3").equals(parseStr("3x + 35y / 3 - 3"))).to.be.true
        expect(parseStr("3y + 35x / 3 - 3").equals(parseStr("3x + 35y / 3 - 3"))).to.be.false
        expect(parseStr("3x + 35y / 3 - 4").equals(parseStr("3x + 35y / 3 - 3"))).to.be.false

        expect(parseStr("3 + b").equals(parseStr("3 + a"))).to.be.false
        expect(parseStr("3 - b").equals(parseStr("3 + b"))).to.be.false
    })
})