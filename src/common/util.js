var SIGN_REGEXP = /([yMdHsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

 export const padLeft = (s, totalWidth, paddingChar) => {
    let len = totalWidth - (s + '').length;
    for (; len > 0; len--) {
        s = paddingChar + s;
    }
    return s;
}
export const padRight = (s, totalWidth, paddingChar)  => {
    let len = totalWidth - (s + '').length;
    for (; len > 0; len--) {
        s = s + paddingChar;
    }
    return s;
}
function getQueryStringByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
export const dateFormat = (date, pattern) => {
    pattern = pattern || DEFAULT_PATTERN;
    return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
            case 'y': return date.getFullYear();
            case 'M': return padLeft(date.getMonth() + 1, 2, '0');
            case 'd': return padLeft(date.getDate(), 2, '2');
            case 'w': return date.getDay() + 1;
            case 'h': return padLeft(date.getHours(), 2, '0');
            case 'm': return padLeft(date.getMinutes(), 2, '0');
            case 's': return padLeft(date.getSeconds(), 2, 0)
        }
    });
}
export const dataParse = (dateString, pattern) => {
    var matchs1 = pattern.match(SIGN_REGEXP);
    var matchs2 = dateString.match(/\d+/g);
    if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1);
        for (var i = 0; i < matchs1.length; i++) {
            var _int = parseInt(matchs2[i]);
            var sign = matchs1[i];
            switch (sign.charAt(0)) {
                case 'y': _date.setFullYear(_int); break;
                case 'M': _date.setMonth(_int - 1); break;
                case 'd': _date.setDate(_int); break;
                case 'h': _date.setHours(_int); break;
                case 'm': _date.setMinutes(_int); break;
                case 's': _date.setSeconds(_int); break;
            }
        }
        return _date;
    }
    return null;


}
