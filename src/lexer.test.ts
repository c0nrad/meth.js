import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

import { isSymbol, isNumeric, parseTokens } from './lexer'

describe("parser_utilites", () => {
    it("should check if alpha", () => {
        expect(isSymbol("a")).to.be.true
        expect(isSymbol("1")).to.be.false
        expect(isSymbol("A")).to.be.true
    })

    it("should check if numeric", () => {
        expect(isNumeric(".")).to.be.true
        expect(isNumeric("e")).to.be.false // maybe fix this later
        expect(isNumeric("1")).to.be.true
    })

    it('should be able to parse basic expressions', () => {
        expect(parseTokens("15 + x = y").length).to.be.equals(5)
        parseTokens("15 * z = x_f")
        // expect(f.evaluate({ x: 2 })).to.be.equals(17)
    })
})
