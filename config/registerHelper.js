const Handlebars = require("handlebars")
exports.math = function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }

exports.format_currency =  function(value, currency) {
    var symbol = "";
    if(currency === "EUR")
        symbol = '&#8364;';
    else if(currency === 'CAD')
        symbol = '$';
    return new Handlebars.SafeString(value + " " + symbol);
}

exports.log = function(something) {
  return console.log(something);
}

exports.idCond = function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

exports.ternaryIf = (condition, v1, v2) => {
    if(condition)
        return v1
    else 
    return v2
}

exports.iff = (v1, op, v2) => {
    let result
    switch(op){
        case '==':
            result = v1 == v2
            break
        case '===':
            result = (v1 === v2) 
            break
        case '!=':
            result = (v1 != v2)
            break
        case '!==':
            result = (v1 !== v2)
            break
        case '<':
            result = (v1 < v2)
            break
        case '<=':
            result = (v1 <= v2)
            break
        case '>':
            result = (v1 > v2)
            break
        case '>=':
            result = (v1 >= v2)
            break
        case '&&':
        case 'AND':
            result = (v1 && v2)
            break
        case '||':
        case 'OR':
            result = (v1 || v2) 
            break
        /* case fefault :
            return "it's false"
            break */

    }

    // console.log('%s %s %s ',v1, op, v2)    
    // console.log(result)
    return result
}

exports.get = (obj, param) => {
    console.log(obj+" - "+ param)
    return obj[param]
}

exports.objIsEmpty = (value) => {
    return Object.keys(value).length
}

exports.json = (obj) => {
    return JSON.stringify(obj);
};

const i18n = require("i18n");
exports.t = (str, ...args) => {
    // return (i18n !== undefined ? i18n.__(str,args) : str+args.toString());
    return i18n.__(str,...args)
}