import kansuji from '../lib/kansuji';

describe('kansuji', () => {
    describe('with default options', () => {
        it('converts integer into Kansuji', () => {
            expect(kansuji(123)).toBe('百二十三');
            expect(kansuji(12345)).toBe('一万二千三百四十五');
            expect(kansuji(1234567890)).toBe('十二億三千四百五十六万七千八百九十');
            expect(kansuji(0)).toBe('〇');
        });
        it('converts float into Kansuji', () => {
            expect(kansuji(12.34)).toBe('十二・三四');
            expect(kansuji(12345.6789)).toBe('一万二千三百四十五・六七八九');
            expect(kansuji(0.0)).toBe('〇');
        });
        it('converts integer string into Kansuji', () => {
            expect(kansuji('123')).toBe('百二十三');
            expect(kansuji('0123')).toBe('百二十三');
            expect(kansuji(' 123 45 ')).toBe('百二十三');
            expect(kansuji('123ABC')).toBe('百二十三');
            expect(kansuji('0')).toBe('〇');
            expect(kansuji('0000')).toBe('〇');
        });
        it('converts float string into Kansuji', () => {
            expect(kansuji('123.45')).toBe('百二十三・四五');
            expect(kansuji('0123.1230')).toBe('百二十三・一二三');
            expect(kansuji('  123.123  ')).toBe('百二十三・一二三');
            expect(kansuji('123.456.789')).toBe('百二十三・四五六');
            expect(kansuji('0.0')).toBe('〇');
            expect(kansuji('0000.0000')).toBe('〇');
        });
        it('omits ONE before 10, 100 and 1000', () => {
            expect(kansuji(11111)).toBe('一万千百十一');
            expect(kansuji(111111111)).toBe('一億千百十一万千百十一');
        });
        it('converts negative integer into Kansuji', () => {
            expect(kansuji(-123)).toBe('−百二十三');
            expect(kansuji(-12345)).toBe('−一万二千三百四十五');
            expect(kansuji(-1234567890)).toBe('−十二億三千四百五十六万七千八百九十');
        });
        it('converts negative integer string into Kansuji', () => {
            expect(kansuji('-123')).toBe('−百二十三');
            expect(kansuji('-0123')).toBe('−百二十三');
        });
        it('converts positive integer string into Kansuji', () => {
            expect(kansuji('+123')).toBe('＋百二十三');
            expect(kansuji('+0123')).toBe('＋百二十三');
        });
    });
    describe('with { unit: false }', () => {
        it('converts integer without units', () => {
            expect(kansuji(1234567890, { unit: false })).toBe('一二三四五六七八九〇');
            expect(kansuji(1001, { unit: false })).toBe('一〇〇一');
            expect(kansuji(0, { unit: false })).toBe('〇');
        });
        it('converts float without units', () => {
            expect(kansuji(1234.5678, { unit: false })).toBe('一二三四・五六七八');
        });
        it('converts integer string without units', () => {
            expect(kansuji('123', { unit: false })).toBe('一二三');
            expect(kansuji('0123', { unit: false })).toBe('〇一二三');
            expect(kansuji('0', { unit: false })).toBe('〇');
            expect(kansuji('0000', { unit: false })).toBe('〇〇〇〇');
        });
        it('converts float string without units', () => {
            expect(kansuji('123.45', { unit: false })).toBe('一二三・四五');
            expect(kansuji('0123.1230', { unit: false })).toBe('〇一二三・一二三〇');
            expect(kansuji('0000.0000', { unit: false })).toBe('〇〇〇〇・〇〇〇〇');
        });
    });
    describe('with { ichi: true }', () => {
        it('puts ONE before 10, 100 and 1000', () => {
            expect(kansuji(11111, { ichi: true })).toBe('一万一千一百一十一');
            expect(kansuji(111111111, { ichi: true })).toBe('一億一千一百一十一万一千一百一十一');
        });
    });
    describe('with { ichi: [1000, 100] }', () => {
        it('puts ONE before 10 only', () => {
            expect(kansuji(11111, { ichi: [1000, 100] })).toBe('一万一千一百十一');
            expect(kansuji(111111111, { ichi: [1000, 100] })).toBe('一億一千一百十一万一千一百十一');
        });
    });
    describe('with { daiji: true }', () => {
        it('converts integer into Daiji', () => {
            expect(kansuji(123, { daiji: true })).toBe('百弐拾参');
            expect(kansuji(12345, { daiji: true })).toBe('壱万弐千参百四拾五');
            expect(kansuji(1234567890, { daiji: true })).toBe('拾弐億参千四百五拾六万七千八百九拾');
        });
        it('converts float into Daiji', () => {
            expect(kansuji(12.34, { daiji: true })).toBe('拾弐・参四');
            expect(kansuji(12345.6789, { daiji: true })).toBe('壱万弐千参百四拾五・六七八九');
        });
        it('converts integer string into Daiji', () => {
            expect(kansuji('123', { daiji: true })).toBe('百弐拾参');
            expect(kansuji('0123', { daiji: true })).toBe('百弐拾参');
        });
        it('converts float string into Daiji', () => {
            expect(kansuji('123.45', { daiji: true })).toBe('百弐拾参・四五');
            expect(kansuji('0123.1230', { daiji: true })).toBe('百弐拾参・壱弐参');
        });
    });
    describe('with { daiji: true, unit: false }', () => {
        it('converts integer into Daiji without units', () => {
            expect(kansuji(123, { daiji: true, unit: false })).toBe('壱弐参');
            expect(kansuji(12345, { daiji: true, unit: false })).toBe('壱弐参四五');
            expect(kansuji(1234567890, { daiji: true, unit: false })).toBe('壱弐参四五六七八九〇');
        });
        it('converts float into Daiji', () => {
            expect(kansuji(12.34, { daiji: true, unit: false })).toBe('壱弐・参四');
            expect(kansuji(12345.6789, { daiji: true, unit: false })).toBe('壱弐参四五・六七八九');
        });
    });
    describe("with { daiji: 'old' }", () => {
        it('converts integer into old Daiji', () => {
            expect(kansuji(123, { daiji: 'old' })).toBe('佰弐拾参');
            expect(kansuji(12345, { daiji: 'old' })).toBe('壱萬弐阡参佰肆拾伍');
            expect(kansuji(1234567890, { daiji: 'old' })).toBe('拾弐億参阡肆佰伍拾陸萬漆阡捌佰玖拾');
        });
        it('converts float into Daiji', () => {
            expect(kansuji(12.34, { daiji: 'old' })).toBe('拾弐・参肆');
            expect(kansuji(12345.6789, { daiji: 'old' })).toBe('壱萬弐阡参佰肆拾伍・陸漆捌玖');
        });
        it('converts integer string into Daiji', () => {
            expect(kansuji('123', { daiji: 'old' })).toBe('佰弐拾参');
            expect(kansuji('0123', { daiji: 'old' })).toBe('佰弐拾参');
        });
        it('converts float string into Daiji', () => {
            expect(kansuji('123.45', { daiji: 'old' })).toBe('佰弐拾参・肆伍');
            expect(kansuji('0123.1230', { daiji: 'old' })).toBe('佰弐拾参・壱弐参');
        });
    });
    describe('with { wide: true }', () => {
        it('converts wide-number integer string into Kansuji', () => {
            expect(kansuji('１２３', { wide: true })).toBe('百二十三');
            expect(kansuji('０１２３', { wide: true })).toBe('百二十三');
            expect(kansuji('　１２３', { wide: true })).toBe('百二十三');
            expect(kansuji('１２３ＡＢＣ', { wide: true })).toBe('百二十三');
            expect(kansuji('０', { wide: true })).toBe('〇');
            expect(kansuji('０００', { wide: true })).toBe('〇');
        });
        it('converts wide-number float string into Kansuji', () => {
            expect(kansuji('１２３．４５', { wide: true })).toBe('百二十三・四五');
            expect(kansuji('０１２３．１２３０', { wide: true })).toBe('百二十三・一二三');
            expect(kansuji('　１２３．１２３　', { wide: true })).toBe('百二十三・一二三');
            expect(kansuji('１２３．４５６．７８９', { wide: true })).toBe('百二十三・四五六');
            expect(kansuji('０．０', { wide: true })).toBe('〇');
            expect(kansuji('００００．００００', { wide: true })).toBe('〇');
        });
        it('converts negative wide-number string into Kansuji', () => {
            expect(kansuji('−１２３', { wide: true })).toBe('−百二十三');
            expect(kansuji('−０１２３', { wide: true })).toBe('−百二十三');
        });
        it('converts positive wide-number string into Kansuji', () => {
            expect(kansuji('＋１２３', { wide: true })).toBe('＋百二十三');
            expect(kansuji('＋０１２３', { wide: true })).toBe('＋百二十三');
        });
    });
    describe('given Infinity', () => {
        it('throws TypeError', () => {
            expect(kansuji.bind(this, Infinity)).toThrow(TypeError);
            expect(kansuji.bind(this, -Infinity)).toThrow(TypeError);
        });
    });
    describe('given NaN', () => {
        it('throws TypeError', () => {
            expect(kansuji.bind(this, NaN)).toThrow(TypeError);
        });
    });
    describe('given non-number string', () => {
        it('throws TypeError', () => {
            expect(kansuji.bind(this, 'ABC')).toThrow(TypeError);
            expect(kansuji.bind(this, 'ABC123')).toThrow(TypeError);
            expect(kansuji.bind(this, '１２３')).toThrow(TypeError);
            expect(kansuji.bind(this, '')).toThrow(TypeError);
        });
    });
});
