interface KansujiOptions {
    unit?: string | boolean,
    ichi?: number[] | boolean,
    daiji?: string | boolean,
    wide?: string | boolean
}

function buildIchiDict(ichi: number[] | false | boolean) {
    if (ichi instanceof Array) {
        return [
            false,
            (ichi.indexOf(10) !== -1),
            (ichi.indexOf(100) !== -1),
            (ichi.indexOf(1000) !== -1),
        ];
    }
    return [false, !!ichi, !!ichi, !!ichi];
}

export default function kansuji(n: number | string, options?: KansujiOptions) {
    if (typeof n === 'number' && Number.isNaN(n)) throw new TypeError("NaN can't be converted");
    if (n === Infinity) throw new TypeError("Infinity can't be converted");
    if (n === -Infinity) throw new TypeError("-Infinity can't be converted");

    const unit = options?.unit === undefined ? true : options.unit;
    const ichi = options?.ichi === undefined ? false : options.ichi;
    const daiji = options?.daiji === undefined ? false : options.daiji;
    const wide = options?.wide === undefined ? false : options.wide;

    const ichiDict = buildIchiDict(ichi);
    let kanjiDigits: string[];
    let kanjiUnits: string[];
    if (daiji === 'old') {
        kanjiDigits = kansuji.OLD_DAIJI_DIGITS;
        kanjiUnits = kansuji.OLD_DAIJI_UNITS;
    } else if (daiji) {
        kanjiDigits = kansuji.DAIJI_DIGITS;
        kanjiUnits = kansuji.DAIJI_UNITS;
    } else {
        kanjiDigits = kansuji.KANJI_DIGITS;
        kanjiUnits = kansuji.KANJI_UNITS;
    }

    function convert(str: string, isDecimal: boolean) {
        const out = []; let
            keta = 0;
        for (let i = str.length - 1; i >= 0; i -= 1) {
            let code = str.charCodeAt(i);

            if (code >= 0xFF10 && code <= 0xFF19) {
                // Wide number to ASCII
                code -= (0xFF10 - 0x30);
            }

            if (code === 0x30) {
                // "0"
                if (!unit || (isDecimal && out.length !== 0)) {
                    out.unshift(kanjiDigits[0]);
                }
                keta += 1;
            } else {
                // "1" - "9"
                if (unit && !isDecimal) {
                    const r = keta % 4;
                    if (r === 1 || r === 2 || r === 3) { // 10, 100, 1000
                        out.unshift(kanjiUnits[r - 1]);
                        if (code === /* "1" */0x31 && !ichiDict[r]) {
                            keta += 1;
                            continue;
                        }
                    } else if (r === 0 && keta !== 0) { // 10000, 100000000, ...
                        out.unshift(kanjiUnits[(keta / 4) + 2] || '');
                    }
                }
                out.unshift(kanjiDigits[code - 0x30]);
                keta += 1;
            }
        }

        if (out.length === 0 && !isDecimal) {
            out.push(kanjiDigits[0]);
        }

        return out.join('');
    }

    const matched = n.toString().match(wide ? kansuji.WIDE_REGEXP : kansuji.REGEXP);
    if (!matched) {
        throw new TypeError("Non-number string can't be converted");
    }

    let converted = convert(matched[2], false);
    if (typeof matched[3] !== 'undefined') {
        const decConverted = convert(matched[3], true);
        if (decConverted !== '') converted += kansuji.DOT + decConverted;
    }
    if (matched[1] === '+' || matched[1] === '＋') converted = kansuji.PLUS + converted;
    if (matched[1] === '-' || matched[1] === '−') converted = kansuji.MINUS + converted;
    return converted;
}

kansuji.KANJI_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
kansuji.KANJI_UNITS = ['十', '百', '千', '万', '億', '兆', '京', '垓', '禾予', '穣', '溝', '澗', '正', '載'];
kansuji.DAIJI_DIGITS = ['〇', '壱', '弐', '参', '四', '五', '六', '七', '八', '九'];
kansuji.DAIJI_UNITS = ['拾'].concat(kansuji.KANJI_UNITS.slice(1));
kansuji.OLD_DAIJI_DIGITS = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'];
kansuji.OLD_DAIJI_UNITS = ['拾', '佰', '阡', '萬'].concat(kansuji.KANJI_UNITS.slice(4));
kansuji.DOT = '・';
kansuji.PLUS = '＋';
kansuji.MINUS = '−';
kansuji.REGEXP = /^\s*([-+])?([0-9]+)(?:\.([0-9]+))?/;
kansuji.WIDE_REGEXP = /^[\s　]*([-+−＋])?([0-9０１２３４５６７８９]+)(?:[\.．]([0-9０１２３４５６７８９]+))?/;
