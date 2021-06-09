(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $author$project$Main$UrlRequested = function (a) {
	return {$: 'UrlRequested', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$decoder = A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string);
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Main$NotFound = {$: 'NotFound'};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$Game = {$: 'Game'};
var $author$project$Main$HowTo = {$: 'HowTo'};
var $author$project$Main$MainMenu = {$: 'MainMenu'};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Main$routeParser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Main$MainMenu, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$HowTo,
			$elm$url$Url$Parser$s('howto')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$Game,
			$elm$url$Url$Parser$s('game'))
		]));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$toRoute = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Main$NotFound,
		A2($elm$url$Url$Parser$parse, $author$project$Main$routeParser, url));
};
var $author$project$Main$init = F3(
	function (flags, url, key) {
		return _Utils_Tuple2(
			{
				gameState: $elm$core$Maybe$Nothing,
				key: key,
				route: $author$project$Main$toRoute(url),
				storageTry: function () {
					var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$decoder, flags);
					if (_v0.$ === 'Ok') {
						var str = _v0.a;
						return str;
					} else {
						return 'Nope';
					}
				}(),
				url: url
			},
			A2($elm$browser$Browser$Navigation$pushUrl, key, '/'));
	});
var $author$project$Main$GameMsg = function (a) {
	return {$: 'GameMsg', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Game$InvalidKey = {$: 'InvalidKey'};
var $author$project$Game$KeyboardMsg = function (a) {
	return {$: 'KeyboardMsg', a: a};
};
var $author$project$Game$RotateLeft = {$: 'RotateLeft'};
var $author$project$Game$RotateRight = {$: 'RotateRight'};
var $author$project$Game$ShiftDown = {$: 'ShiftDown'};
var $author$project$Game$toKey = function (keyValue) {
	var _v0 = $elm$core$String$uncons(keyValue);
	_v0$3:
	while (true) {
		if (_v0.$ === 'Just') {
			switch (_v0.a.b) {
				case '':
					switch (_v0.a.a.valueOf()) {
						case 'd':
							var _v1 = _v0.a;
							return $author$project$Game$KeyboardMsg($author$project$Game$RotateRight);
						case 'a':
							var _v2 = _v0.a;
							return $author$project$Game$KeyboardMsg($author$project$Game$RotateLeft);
						default:
							break _v0$3;
					}
				case 'hift':
					if ('S' === _v0.a.a.valueOf()) {
						var _v3 = _v0.a;
						return $author$project$Game$KeyboardMsg($author$project$Game$ShiftDown);
					} else {
						break _v0$3;
					}
				default:
					break _v0$3;
			}
		} else {
			break _v0$3;
		}
	}
	return $author$project$Game$KeyboardMsg($author$project$Game$InvalidKey);
};
var $author$project$Game$keyDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Game$toKey,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $author$project$Game$InvalidUpKey = {$: 'InvalidUpKey'};
var $author$project$Game$KeyboardUpMsg = function (a) {
	return {$: 'KeyboardUpMsg', a: a};
};
var $author$project$Game$ShiftUp = {$: 'ShiftUp'};
var $author$project$Game$toUpKey = function (keyValue) {
	if (keyValue === 'Shift') {
		return $author$project$Game$KeyboardUpMsg($author$project$Game$ShiftUp);
	} else {
		return $author$project$Game$KeyboardUpMsg($author$project$Game$InvalidUpKey);
	}
};
var $author$project$Game$keyUpDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Game$toUpKey,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $author$project$Game$MousePosition = F2(
	function (a, b) {
		return {$: 'MousePosition', a: a, b: b};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Game$mouseDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Game$MousePosition,
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$int));
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$browser$Browser$Events$onMouseMove = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'mousemove');
var $author$project$Game$subscriptions = function (model) {
	return (((!_Utils_eq(model.hoveredTile, $elm$core$Maybe$Nothing)) || (!_Utils_eq(model.hoveredPiece, $elm$core$Maybe$Nothing))) && model.showTileTooltip) ? $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Game$keyDecoder),
				$elm$browser$Browser$Events$onKeyUp($author$project$Game$keyUpDecoder),
				$elm$browser$Browser$Events$onMouseMove($author$project$Game$mouseDecoder)
			])) : $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Game$keyDecoder),
				$elm$browser$Browser$Events$onKeyUp($author$project$Game$keyUpDecoder)
			]));
};
var $author$project$Main$subscriptions = function (model) {
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Platform$Sub$none,
		A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Game$subscriptions,
				$elm$core$Platform$Sub$map($author$project$Main$GameMsg)),
			model.gameState));
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$encode = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string('Encode this'))
			]));
};
var $author$project$Items$None = {$: 'None'};
var $author$project$Items$Green = {$: 'Green'};
var $author$project$Items$Orange = {$: 'Orange'};
var $author$project$Items$Purple = {$: 'Purple'};
var $author$project$Items$Yellow = {$: 'Yellow'};
var $author$project$Crafting$demoOrbs = _List_fromArray(
	[
		_Utils_Tuple2($author$project$Items$Purple, 5),
		_Utils_Tuple2($author$project$Items$Green, 5),
		_Utils_Tuple2($author$project$Items$Yellow, 5),
		_Utils_Tuple2($author$project$Items$Orange, 5)
	]);
var $author$project$Items$Alteration = {$: 'Alteration'};
var $author$project$Items$Augmentation = {$: 'Augmentation'};
var $author$project$Items$Distillation = {$: 'Distillation'};
var $author$project$Items$Modification = {$: 'Modification'};
var $author$project$Crafting$demoScrolls = _List_fromArray(
	[
		_Utils_Tuple2($author$project$Items$Modification, 5),
		_Utils_Tuple2($author$project$Items$Augmentation, 5),
		_Utils_Tuple2($author$project$Items$Alteration, 5),
		_Utils_Tuple2($author$project$Items$Distillation, 5)
	]);
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Crafting$init = {
	orbs: $author$project$Crafting$demoOrbs,
	scrollInfo: A2($elm$html$Html$div, _List_Nil, _List_Nil),
	scrolls: $author$project$Crafting$demoScrolls,
	selectedEssence: $elm$core$Maybe$Nothing,
	selectedOrbs: _List_Nil,
	selectedScroll: $elm$core$Maybe$Nothing,
	tile: $elm$core$Maybe$Nothing
};
var $author$project$ProcGen$init = {level: 1, nextEssenceId: 0, nextPieceId: 0, nextTileId: 0};
var $author$project$Game$noBoard = {colReqs: $elm$core$Dict$empty, highlight: _List_Nil, pieces: _List_Nil, rowReqs: $elm$core$Dict$empty, tiles: $elm$core$Array$empty};
var $author$project$Game$initModel = {
	allReqMet: false,
	board: $author$project$Game$noBoard,
	craftingTable: $author$project$Crafting$init,
	dragedItem: $author$project$Items$None,
	essences: _List_Nil,
	hoveredPiece: $elm$core$Maybe$Nothing,
	hoveredTile: $elm$core$Maybe$Nothing,
	mousePos: _Utils_Tuple2(0, 0),
	pieces: _List_Nil,
	procGenState: $author$project$ProcGen$init,
	rewards: $elm$core$Maybe$Nothing,
	selectedReward: $elm$core$Maybe$Nothing,
	showTileTooltip: false,
	tiles: _List_Nil
};
var $author$project$Game$NewBoard = function (a) {
	return {$: 'NewBoard', a: a};
};
var $author$project$Game$NewPieceList = function (a) {
	return {$: 'NewPieceList', a: a};
};
var $author$project$Game$NewTileList = function (a) {
	return {$: 'NewTileList', a: a};
};
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $author$project$Board$NonTile = function (a) {
	return {$: 'NonTile', a: a};
};
var $author$project$Board$Wall = function (a) {
	return {$: 'Wall', a: a};
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0.a;
		var genB = _v1.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v2 = genA(seed0);
				var a = _v2.a;
				var seed1 = _v2.b;
				var _v3 = genB(seed1);
				var b = _v3.a;
				var seed2 = _v3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Board$set = F3(
	function (_v0, field, board) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		var mRow = A2(
			$elm$core$Maybe$map,
			A2($elm$core$Array$set, xIndex, field),
			A2($elm$core$Array$get, yIndex, board.tiles));
		if (mRow.$ === 'Nothing') {
			return board;
		} else {
			var row = mRow.a;
			return _Utils_update(
				board,
				{
					tiles: A3($elm$core$Array$set, yIndex, row, board.tiles)
				});
		}
	});
var $elm$random$Random$maxInt = 2147483647;
var $elm$random$Random$minInt = -2147483648;
var $elm_community$random_extra$Random$List$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0.a;
		var genB = _v1.a;
		var genC = _v2.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v3 = genA(seed0);
				var a = _v3.a;
				var seed1 = _v3.b;
				var _v4 = genB(seed1);
				var b = _v4.a;
				var seed2 = _v4.b;
				var _v5 = genC(seed2);
				var c = _v5.a;
				var seed3 = _v5.b;
				return _Utils_Tuple2(
					A3(func, a, b, c),
					seed3);
			});
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = $elm$random$Random$Generator(
	function (seed0) {
		var makeIndependentSeed = F3(
			function (state, b, c) {
				return $elm$random$Random$next(
					A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
			});
		var gen = A2($elm$random$Random$int, 0, 4294967295);
		return A2(
			$elm$random$Random$step,
			A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
			seed0);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$List$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$List$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						list).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$ProcGen$addWalls = F2(
	function (level, board) {
		var ys = $elm_community$random_extra$Random$List$shuffle(
			_List_fromArray(
				[0, 1, 2, 3]));
		var xs = $elm_community$random_extra$Random$List$shuffle(
			_List_fromArray(
				[0, 1, 2, 3]));
		var threeWalls = A2(
			$elm$random$Random$map,
			$elm$core$Basics$le(level - 3),
			A2($elm$random$Random$int, 1, 10));
		var cords = A3(
			$elm$random$Random$map2,
			$elm$core$List$map2($elm$core$Tuple$pair),
			xs,
			ys);
		var wallPos = A3(
			$elm$random$Random$map2,
			F2(
				function (cord, threeW) {
					return threeW ? A2($elm$core$List$take, 2, cord) : A2($elm$core$List$take, 3, cord);
				}),
			cords,
			threeWalls);
		return A2(
			$elm$random$Random$map,
			function (positions) {
				return A3(
					$elm$core$List$foldr,
					F2(
						function (ind, brdf) {
							return A3(
								$author$project$Board$set,
								ind,
								$author$project$Board$Wall(false),
								brdf);
						}),
					board,
					positions);
			},
			wallPos);
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				var _v1 = genA(seed);
				var result = _v1.a;
				var newSeed = _v1.b;
				var _v2 = callback(result);
				var genB = _v2.a;
				return genB(newSeed);
			});
	});
var $elm$random$Random$constant = function (value) {
	return $elm$random$Random$Generator(
		function (seed) {
			return _Utils_Tuple2(value, seed);
		});
};
var $author$project$Items$emptyScore = _List_fromArray(
	[
		_Utils_Tuple2($author$project$Items$Purple, 0),
		_Utils_Tuple2($author$project$Items$Green, 0),
		_Utils_Tuple2($author$project$Items$Yellow, 0),
		_Utils_Tuple2($author$project$Items$Orange, 0)
	]);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$random$Random$addOne = function (value) {
	return _Utils_Tuple2(1, value);
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var seed1 = $elm$random$Random$next(seed0);
				var range = $elm$core$Basics$abs(b - a);
				var n1 = $elm$random$Random$peel(seed1);
				var n0 = $elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					$elm$random$Random$next(seed1));
			});
	});
var $elm$random$Random$getByWeight = F3(
	function (_v0, others, countdown) {
		getByWeight:
		while (true) {
			var weight = _v0.a;
			var value = _v0.b;
			if (!others.b) {
				return value;
			} else {
				var second = others.a;
				var otherOthers = others.b;
				if (_Utils_cmp(
					countdown,
					$elm$core$Basics$abs(weight)) < 1) {
					return value;
				} else {
					var $temp$_v0 = second,
						$temp$others = otherOthers,
						$temp$countdown = countdown - $elm$core$Basics$abs(weight);
					_v0 = $temp$_v0;
					others = $temp$others;
					countdown = $temp$countdown;
					continue getByWeight;
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$random$Random$weighted = F2(
	function (first, others) {
		var normalize = function (_v0) {
			var weight = _v0.a;
			return $elm$core$Basics$abs(weight);
		};
		var total = normalize(first) + $elm$core$List$sum(
			A2($elm$core$List$map, normalize, others));
		return A2(
			$elm$random$Random$map,
			A2($elm$random$Random$getByWeight, first, others),
			A2($elm$random$Random$float, 0, total));
	});
var $elm$random$Random$uniform = F2(
	function (value, valueList) {
		return A2(
			$elm$random$Random$weighted,
			$elm$random$Random$addOne(value),
			A2($elm$core$List$map, $elm$random$Random$addOne, valueList));
	});
var $author$project$ProcGen$generateColor = function (blocked) {
	var go = function (colors) {
		go:
		while (true) {
			if (colors.b) {
				var col = colors.a;
				var rest = colors.b;
				if (A2($elm$core$List$member, col, blocked)) {
					var $temp$colors = rest;
					colors = $temp$colors;
					continue go;
				} else {
					return A2(
						$elm$random$Random$uniform,
						col,
						A2(
							$elm$core$List$filter,
							function (c) {
								return !A2(
									$elm$core$List$member,
									c,
									A2($elm$core$List$cons, col, blocked));
							},
							_List_fromArray(
								[$author$project$Items$Purple, $author$project$Items$Green, $author$project$Items$Yellow, $author$project$Items$Orange])));
				}
			} else {
				return $elm$random$Random$constant($author$project$Items$Purple);
			}
		}
	};
	return go(
		_List_fromArray(
			[$author$project$Items$Purple, $author$project$Items$Green, $author$project$Items$Yellow, $author$project$Items$Orange]));
};
var $elm_community$list_extra$List$Extra$remove = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($elm_community$list_extra$List$Extra$remove, x, ys));
		}
	});
var $author$project$ProcGen$generateSecondColor = function (firstColor) {
	return _Utils_eq(firstColor, $author$project$Items$Purple) ? A2(
		$elm$random$Random$weighted,
		_Utils_Tuple2(0.3, $author$project$Items$Purple),
		A2(
			$elm$core$List$map,
			$elm$core$Tuple$pair(3 / 12),
			_List_fromArray(
				[$author$project$Items$Green, $author$project$Items$Yellow, $author$project$Items$Orange]))) : A2(
		$elm$random$Random$weighted,
		_Utils_Tuple2(0.3, firstColor),
		A2(
			$elm$core$List$map,
			$elm$core$Tuple$pair(3 / 12),
			A2(
				$elm_community$list_extra$List$Extra$remove,
				firstColor,
				_List_fromArray(
					[$author$project$Items$Purple, $author$project$Items$Green, $author$project$Items$Yellow, $author$project$Items$Orange]))));
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm_community$list_extra$List$Extra$updateIf = F3(
	function (predicate, update, list) {
		return A2(
			$elm$core$List$map,
			function (item) {
				return predicate(item) ? update(item) : item;
			},
			list);
	});
var $elm_community$list_extra$List$Extra$setIf = F3(
	function (predicate, replacement, list) {
		return A3(
			$elm_community$list_extra$List$Extra$updateIf,
			predicate,
			$elm$core$Basics$always(replacement),
			list);
	});
var $author$project$ProcGen$generateSingleColorReq = function (sum) {
	return A2(
		$elm$random$Random$map,
		function (color) {
			return A3(
				$elm_community$list_extra$List$Extra$setIf,
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Basics$eq(color),
					$elm$core$Tuple$first),
				_Utils_Tuple2(color, sum),
				$author$project$Items$emptyScore);
		},
		$author$project$ProcGen$generateColor(_List_Nil));
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$ProcGen$splitTo2 = function (num) {
	var head = A2(
		$elm$random$Random$int,
		$elm$core$Basics$ceiling(num / 3),
		$elm$core$Basics$floor((num * 2) / 3));
	return A2(
		$elm$random$Random$map,
		function (x) {
			return _List_fromArray(
				[x, num - x]);
		},
		head);
};
var $author$project$ProcGen$generateReq = function (sum) {
	if (sum <= 3) {
		return $author$project$ProcGen$generateSingleColorReq(sum);
	} else {
		var values = $author$project$ProcGen$splitTo2(sum);
		var toScore = F3(
			function (vals, fstCol, sndCol) {
				if ((vals.b && vals.b.b) && (!vals.b.b.b)) {
					var fstVal = vals.a;
					var _v1 = vals.b;
					var sndVal = _v1.a;
					return A3(
						$elm_community$list_extra$List$Extra$updateIf,
						A2(
							$elm$core$Basics$composeL,
							$elm$core$Basics$eq(fstCol),
							$elm$core$Tuple$first),
						$elm$core$Tuple$mapSecond(
							$elm$core$Basics$add(fstVal)),
						A3(
							$elm_community$list_extra$List$Extra$setIf,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$eq(sndCol),
								$elm$core$Tuple$first),
							_Utils_Tuple2(sndCol, sndVal),
							$author$project$Items$emptyScore));
				} else {
					return $author$project$Items$emptyScore;
				}
			});
		var fstColor = $author$project$ProcGen$generateColor(_List_Nil);
		var sndColor = A2($elm$random$Random$andThen, $author$project$ProcGen$generateSecondColor, fstColor);
		return A4($elm$random$Random$map3, toScore, values, fstColor, sndColor);
	}
};
var $author$project$ProcGen$splitTo3 = function (num) {
	var head = A2(
		$elm$random$Random$int,
		$elm$core$Basics$ceiling(num / 6),
		$elm$core$Basics$floor(num / 2));
	var tail = A3(
		$elm$random$Random$map2,
		$elm$core$Basics$sub,
		$elm$random$Random$constant(num),
		head);
	return A3(
		$elm$random$Random$map2,
		$elm$core$List$cons,
		head,
		A2($elm$random$Random$andThen, $author$project$ProcGen$splitTo2, tail));
};
var $elm_community$random_extra$Random$Extra$sequence = A2(
	$elm$core$List$foldr,
	$elm$random$Random$map2($elm$core$List$cons),
	$elm$random$Random$constant(_List_Nil));
var $elm_community$random_extra$Random$Extra$traverse = function (f) {
	return A2(
		$elm$core$Basics$composeL,
		$elm_community$random_extra$Random$Extra$sequence,
		$elm$core$List$map(f));
};
var $elm_community$list_extra$List$Extra$zip = $elm$core$List$map2($elm$core$Tuple$pair);
var $author$project$ProcGen$generateRowReqs = function (level) {
	var toScoreDict = F2(
		function (scoreList, indexList) {
			return $elm$core$Dict$fromList(
				A2(
					$elm_community$list_extra$List$Extra$zip,
					indexList,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(x, $author$project$Items$emptyScore);
						},
						scoreList)));
		});
	var sum = (level * 2) + 1;
	var sums = (sum < 5) ? $elm$random$Random$constant(
		_List_fromArray(
			[sum])) : ((sum < 9) ? $author$project$ProcGen$splitTo2(sum) : $author$project$ProcGen$splitTo3(sum));
	var reqs = A2(
		$elm$random$Random$andThen,
		$elm_community$random_extra$Random$Extra$traverse($author$project$ProcGen$generateReq),
		sums);
	return A3(
		$elm$random$Random$map2,
		toScoreDict,
		reqs,
		$elm_community$random_extra$Random$List$shuffle(
			_List_fromArray(
				[0, 1, 2, 3])));
};
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $author$project$ProcGen$generateBoard = function (level) {
	return A3(
		$elm$random$Random$map2,
		F2(
			function (colReqs, model) {
				return _Utils_update(
					model,
					{colReqs: colReqs});
			}),
		$author$project$ProcGen$generateRowReqs(level),
		A3(
			$elm$random$Random$map2,
			F2(
				function (rowReqs, model) {
					return _Utils_update(
						model,
						{rowReqs: rowReqs});
				}),
			$author$project$ProcGen$generateRowReqs(level),
			A2(
				$elm$random$Random$andThen,
				$author$project$ProcGen$addWalls(level),
				$elm$random$Random$constant(
					{
						colReqs: $elm$core$Dict$empty,
						highlight: _List_Nil,
						pieces: _List_Nil,
						rowReqs: $elm$core$Dict$empty,
						tiles: A2(
							$elm$core$Array$repeat,
							4,
							A2(
								$elm$core$Array$repeat,
								4,
								$author$project$Board$NonTile(false)))
					}))));
};
var $author$project$Items$Twoi = function (a) {
	return {$: 'Twoi', a: a};
};
var $author$project$ProcGen$pRound = function (_float) {
	var prob = _float - $elm$core$Basics$floor(_float);
	return A2(
		$elm$random$Random$map,
		$elm$core$Basics$add(
			$elm$core$Basics$floor(_float)),
		A2(
			$elm$random$Random$weighted,
			_Utils_Tuple2(prob, 1),
			_List_fromArray(
				[
					_Utils_Tuple2(1 - prob, 0)
				])));
};
var $author$project$Items$twoiStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(0, 1)
	]);
var $author$project$ProcGen$generate2Piece = function (level) {
	var reqNum = $author$project$ProcGen$pRound(((level * 2) + 2) / 6);
	return A2(
		$elm$random$Random$map,
		function (req) {
			return {
				borderTransform: {
					rotate: 0,
					translate: _Utils_Tuple2(0, 0)
				},
				drawPosition: $elm$core$Maybe$Nothing,
				id: 0,
				positions: _List_Nil,
				req: req,
				score: $author$project$Items$emptyScore,
				shape: $author$project$Items$Twoi($author$project$Items$twoiStartIndex)
			};
		},
		A2($elm$random$Random$andThen, $author$project$ProcGen$generateSingleColorReq, reqNum));
};
var $author$project$Items$Threei = function (a) {
	return {$: 'Threei', a: a};
};
var $author$project$Items$Threel = function (a) {
	return {$: 'Threel', a: a};
};
var $author$project$Items$threeiStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(0, -1)
	]);
var $author$project$Items$threelStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(1, 0)
	]);
var $author$project$ProcGen$generate3Piece = function (level) {
	var reqNum = $author$project$ProcGen$pRound(((level * 2) + 2) / 4);
	return A3(
		$elm$random$Random$map2,
		F2(
			function (shape, req) {
				return {
					borderTransform: {
						rotate: 0,
						translate: _Utils_Tuple2(0, 0)
					},
					drawPosition: $elm$core$Maybe$Nothing,
					id: 0,
					positions: _List_Nil,
					req: req,
					score: $author$project$Items$emptyScore,
					shape: shape
				};
			}),
		A2(
			$elm$random$Random$uniform,
			$author$project$Items$Threei($author$project$Items$threeiStartIndex),
			_List_fromArray(
				[
					$author$project$Items$Threel($author$project$Items$threelStartIndex)
				])),
		A2($elm$random$Random$andThen, $author$project$ProcGen$generateReq, reqNum));
};
var $author$project$Items$Fourl = function (a) {
	return {$: 'Fourl', a: a};
};
var $author$project$Items$Fouro = function (a) {
	return {$: 'Fouro', a: a};
};
var $author$project$Items$Fourr = function (a) {
	return {$: 'Fourr', a: a};
};
var $author$project$Items$Fours = function (a) {
	return {$: 'Fours', a: a};
};
var $author$project$Items$Fourt = function (a) {
	return {$: 'Fourt', a: a};
};
var $author$project$Items$Fourz = function (a) {
	return {$: 'Fourz', a: a};
};
var $author$project$Items$fourlStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(1, 1)
	]);
var $author$project$Items$fouroStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(1, 1)
	]);
var $author$project$Items$fourrStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(1, -1)
	]);
var $author$project$Items$foursStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(-1, 1)
	]);
var $author$project$Items$fourtStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(0, 1)
	]);
var $author$project$Items$fourzStartIndex = _List_fromArray(
	[
		_Utils_Tuple2(0, 0),
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(0, 1),
		_Utils_Tuple2(1, 1)
	]);
var $author$project$ProcGen$generate4Piece = function (level) {
	var reqNum = $author$project$ProcGen$pRound(((level * 2) + 2) / 3);
	return A3(
		$elm$random$Random$map2,
		F2(
			function (shape, req) {
				return {
					borderTransform: {
						rotate: 0,
						translate: _Utils_Tuple2(0, 0)
					},
					drawPosition: $elm$core$Maybe$Nothing,
					id: 0,
					positions: _List_Nil,
					req: req,
					score: $author$project$Items$emptyScore,
					shape: shape
				};
			}),
		A2(
			$elm$random$Random$uniform,
			$author$project$Items$Fouro($author$project$Items$fouroStartIndex),
			_List_fromArray(
				[
					$author$project$Items$Fourt($author$project$Items$fourtStartIndex),
					$author$project$Items$Fours($author$project$Items$foursStartIndex),
					$author$project$Items$Fourz($author$project$Items$fourzStartIndex),
					$author$project$Items$Fourl($author$project$Items$fourlStartIndex),
					$author$project$Items$Fourr($author$project$Items$fourrStartIndex)
				])),
		A2($elm$random$Random$andThen, $author$project$ProcGen$generateReq, reqNum));
};
var $author$project$ProcGen$generatePiece = F2(
	function (size, state) {
		var next = function () {
			switch (size) {
				case 2:
					return $author$project$ProcGen$generate2Piece(state.level);
				case 3:
					return $author$project$ProcGen$generate3Piece(state.level);
				default:
					return $author$project$ProcGen$generate4Piece(state.level);
			}
		}();
		return A2(
			$elm$random$Random$map,
			function (piece) {
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{nextPieceId: state.nextPieceId + 1}),
					_Utils_update(
						piece,
						{id: state.nextPieceId}));
			},
			next);
	});
var $author$project$ProcGen$generatePieceList = function (state) {
	var go = F2(
		function (sumLeft, rStateList) {
			var next = function (randInt) {
				return A2(
					$elm$random$Random$andThen,
					function (_v1) {
						var nextState = _v1.a;
						var nextPiece = _v1.b;
						return A2(
							go,
							sumLeft - randInt,
							A2(
								$elm$random$Random$map,
								function (_v2) {
									var ls = _v2.b;
									return _Utils_Tuple2(
										nextState,
										A2($elm$core$List$cons, nextPiece, ls));
								},
								rStateList));
					},
					A2(
						$elm$random$Random$andThen,
						A2(
							$elm$core$Basics$composeL,
							$author$project$ProcGen$generatePiece(randInt),
							$elm$core$Tuple$first),
						rStateList));
			};
			switch (sumLeft) {
				case 0:
					return rStateList;
				case 2:
					return A2(
						$elm$random$Random$andThen,
						next,
						$elm$random$Random$constant(2));
				case 3:
					return A2(
						$elm$random$Random$andThen,
						next,
						$elm$random$Random$constant(3));
				case 4:
					return A2(
						$elm$random$Random$andThen,
						next,
						A2(
							$elm$random$Random$weighted,
							_Utils_Tuple2(2, 2),
							_List_fromArray(
								[
									_Utils_Tuple2(5, 4)
								])));
				case 5:
					return A2(
						$elm$random$Random$andThen,
						next,
						A2(
							$elm$random$Random$weighted,
							_Utils_Tuple2(2, 2),
							_List_fromArray(
								[
									_Utils_Tuple2(3, 3)
								])));
				default:
					return A2(
						$elm$random$Random$andThen,
						next,
						A2(
							$elm$random$Random$weighted,
							_Utils_Tuple2(2, 2),
							_List_fromArray(
								[
									_Utils_Tuple2(3, 3),
									_Utils_Tuple2(5, 4)
								])));
			}
		});
	var fieldSum = 10 + (state.level * 2);
	return A2(
		go,
		fieldSum,
		$elm$random$Random$constant(
			_Utils_Tuple2(state, _List_Nil)));
};
var $author$project$ProcGen$defaultTile = $elm$random$Random$constant(
	{addBonus: 0, baseValue: 1, color: $author$project$Items$Green, currentValue: 1, drawPosition: $elm$core$Maybe$Nothing, id: 0, prodBonus: 0, properties: _List_Nil});
var $author$project$ProcGen$calculateBaseValueChances = function (level) {
	var threeTile = (level * 0.015) + 0.05;
	var twoTile = (1 - threeTile) * (0.025 + 0.15);
	var oneTile = (1 - threeTile) - twoTile;
	return _List_fromArray(
		[
			_Utils_Tuple2(threeTile, 3),
			_Utils_Tuple2(twoTile, 2),
			_Utils_Tuple2(oneTile, 1)
		]);
};
var $author$project$ProcGen$generateBase = F3(
	function (level, blockedColors, tile) {
		var _v0 = $author$project$ProcGen$calculateBaseValueChances(level);
		if (_v0.b) {
			var x = _v0.a;
			var xs = _v0.b;
			return A3(
				$elm$random$Random$map2,
				F2(
					function (value, color) {
						return _Utils_update(
							tile,
							{baseValue: value, color: color});
					}),
				A2($elm$random$Random$weighted, x, xs),
				$author$project$ProcGen$generateColor(blockedColors));
		} else {
			return $elm$random$Random$constant(tile);
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$ProcGen$calculatePropertyNumberChances = function (level) {
	var twoPropChance = function (numGoodRolls) {
		return A2($elm$core$Basics$min, 1, numGoodRolls / 100);
	}(
		$elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (a) {
					return A2($elm$core$Basics$min, 10, (level + 2) - a);
				},
				A2(
					$elm$core$List$range,
					1,
					A2($elm$core$Basics$min, 10, level + 1)))));
	var onePropChance = (1 - twoPropChance) * A2($elm$core$Basics$min, 1, (level + 2) / 10);
	var zeroPropChance = (1 - twoPropChance) - onePropChance;
	return _List_fromArray(
		[
			_Utils_Tuple2(twoPropChance, 2),
			_Utils_Tuple2(onePropChance, 1),
			_Utils_Tuple2(zeroPropChance, 0)
		]);
};
var $author$project$ProcGen$avgRowReq = function (level) {
	return ((level * 2) + 2) / 3;
};
var $author$project$Items$prop2Corn1 = _List_fromArray(
	[
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(1, -1)
	]);
var $author$project$Items$prop2Corn2 = _List_fromArray(
	[
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(1, -1)
	]);
var $author$project$Items$prop2OpCorn = _List_fromArray(
	[
		_Utils_Tuple2(1, -1),
		_Utils_Tuple2(-1, 1)
	]);
var $author$project$Items$prop2OpEdge = _List_fromArray(
	[
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(0, 1)
	]);
var $author$project$ProcGen$generate2Region = F2(
	function (level, property) {
		var update = F3(
			function (requ, regi, prop) {
				return _Utils_update(
					prop,
					{
						region: regi,
						reqValue: A2($elm$core$Basics$max, requ, 1)
					});
			});
		var req = $author$project$ProcGen$pRound(
			$author$project$ProcGen$avgRowReq(level) / 2);
		var region = A2(
			$elm$random$Random$uniform,
			$author$project$Items$prop2OpEdge,
			_List_fromArray(
				[$author$project$Items$prop2OpCorn, $author$project$Items$prop2Corn1, $author$project$Items$prop2Corn2]));
		return A4(
			$elm$random$Random$map3,
			update,
			req,
			region,
			$elm$random$Random$constant(property));
	});
var $author$project$Items$prop3Corn = _List_fromArray(
	[
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(1, -1),
		_Utils_Tuple2(1, 0)
	]);
var $author$project$Items$prop3Edge = _List_fromArray(
	[
		_Utils_Tuple2(1, -1),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(1, 1)
	]);
var $author$project$ProcGen$generate3Region = F2(
	function (level, property) {
		var update = F3(
			function (requ, regi, prop) {
				return _Utils_update(
					prop,
					{
						region: regi,
						reqValue: A2($elm$core$Basics$max, requ, 1)
					});
			});
		var req = $author$project$ProcGen$pRound(
			(3 * $author$project$ProcGen$avgRowReq(level)) / 4);
		var region = A2(
			$elm$random$Random$uniform,
			$author$project$Items$prop3Corn,
			_List_fromArray(
				[$author$project$Items$prop3Edge]));
		return A4(
			$elm$random$Random$map3,
			update,
			req,
			region,
			$elm$random$Random$constant(property));
	});
var $author$project$Items$prop4Corn = _List_fromArray(
	[
		_Utils_Tuple2(-1, -1),
		_Utils_Tuple2(1, -1),
		_Utils_Tuple2(1, 1),
		_Utils_Tuple2(-1, 1)
	]);
var $author$project$Items$prop4Double1 = _List_fromArray(
	[
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(-1, 1),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(1, -1)
	]);
var $author$project$Items$prop4Double2 = _List_fromArray(
	[
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(-1, -1),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(1, 1)
	]);
var $author$project$Items$prop4Edge = _List_fromArray(
	[
		_Utils_Tuple2(-1, 0),
		_Utils_Tuple2(0, -1),
		_Utils_Tuple2(1, 0),
		_Utils_Tuple2(0, 1)
	]);
var $author$project$ProcGen$generate4Region = F2(
	function (level, property) {
		var update = F3(
			function (requ, regi, prop) {
				return _Utils_update(
					prop,
					{
						region: regi,
						reqValue: A2($elm$core$Basics$max, requ, 1)
					});
			});
		var req = $author$project$ProcGen$pRound(
			$author$project$ProcGen$avgRowReq(level));
		var region = A2(
			$elm$random$Random$uniform,
			$author$project$Items$prop4Edge,
			_List_fromArray(
				[$author$project$Items$prop4Corn, $author$project$Items$prop4Double1, $author$project$Items$prop4Double2]));
		return A4(
			$elm$random$Random$map3,
			update,
			req,
			region,
			$elm$random$Random$constant(property));
	});
var $author$project$ProcGen$addBonusChances = _List_fromArray(
	[
		_Utils_Tuple2(0.001, 0),
		_Utils_Tuple2(0.002, 0),
		_Utils_Tuple2(0.004, 0),
		_Utils_Tuple2(0.008, 0.02),
		_Utils_Tuple2(0.016, 0.05),
		_Utils_Tuple2(0.024, 0.1),
		_Utils_Tuple2(0.032, 0.1)
	]);
var $author$project$ProcGen$generateAddBonus = function (level) {
	var go = function (chanceValPairs) {
		if (chanceValPairs.b) {
			var _v1 = chanceValPairs.a;
			var chance = _v1.a;
			var val = _v1.b;
			var cs = chanceValPairs.b;
			return A2(
				$elm$random$Random$andThen,
				function (roll) {
					return (_Utils_cmp(roll, chance) < 0) ? $elm$random$Random$constant(val) : go(cs);
				},
				A2($elm$random$Random$float, 0, 1));
		} else {
			return $elm$random$Random$constant(0);
		}
	};
	var chances = A2(
		$elm_community$list_extra$List$Extra$zip,
		A2(
			$elm$core$List$map,
			function (_v2) {
				var scale = _v2.a;
				var base = _v2.b;
				return (level * scale) + base;
			},
			$author$project$ProcGen$addBonusChances),
		_List_fromArray(
			[4, 3.5, 3, 2.5, 2, 1.5, 1]));
	return go(chances);
};
var $author$project$ProcGen$prodBonusChances = _List_fromArray(
	[
		_Utils_Tuple2(0.008, 0),
		_Utils_Tuple2(0.016, 0.1),
		_Utils_Tuple2(0.032, 0.1)
	]);
var $author$project$ProcGen$generateProdBonus = function (level) {
	var go = function (chanceValPairs) {
		if (chanceValPairs.b) {
			var _v1 = chanceValPairs.a;
			var chance = _v1.a;
			var val = _v1.b;
			var cs = chanceValPairs.b;
			return A2(
				$elm$random$Random$andThen,
				function (roll) {
					return (_Utils_cmp(roll, chance) < 0) ? $elm$random$Random$constant(val) : go(cs);
				},
				A2($elm$random$Random$float, 0, 1));
		} else {
			return $elm$random$Random$constant(0);
		}
	};
	var chances = A2(
		$elm_community$list_extra$List$Extra$zip,
		A2(
			$elm$core$List$map,
			function (_v2) {
				var scale = _v2.a;
				var base = _v2.b;
				return (level * scale) + base;
			},
			$author$project$ProcGen$prodBonusChances),
		_List_fromArray(
			[1.5, 1, 0.5]));
	return go(chances);
};
var $author$project$ProcGen$generateProperty = F2(
	function (level, blockedColors) {
		var bonus = A3(
			$elm$random$Random$map2,
			F2(
				function (add, prod) {
					return ((!add) && (!prod)) ? _Utils_Tuple2(1, 0) : _Utils_Tuple2(add, prod);
				}),
			$author$project$ProcGen$generateAddBonus(level),
			$author$project$ProcGen$generateProdBonus(level));
		var baseProp = A3(
			$elm$random$Random$map2,
			F2(
				function (color, _v1) {
					var add = _v1.a;
					var prod = _v1.b;
					return {addBonus: add, isMet: false, prodBonus: prod, region: _List_Nil, reqColor: color, reqValue: 0};
				}),
			$author$project$ProcGen$generateColor(blockedColors),
			bonus);
		var addRegion = F2(
			function (prop, size) {
				switch (size) {
					case 2:
						return A2(
							$elm$random$Random$andThen,
							$author$project$ProcGen$generate2Region(level),
							prop);
					case 3:
						return A2(
							$elm$random$Random$andThen,
							$author$project$ProcGen$generate3Region(level),
							prop);
					default:
						return A2(
							$elm$random$Random$andThen,
							$author$project$ProcGen$generate4Region(level),
							prop);
				}
			});
		return A2(
			$elm$random$Random$andThen,
			addRegion(baseProp),
			A2(
				$elm$random$Random$weighted,
				_Utils_Tuple2(4, 2),
				_List_fromArray(
					[
						_Utils_Tuple2(2, 3),
						_Utils_Tuple2(4, 4)
					])));
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $author$project$ProcGen$generateProperties = F2(
	function (level, blockedColors) {
		var _v0 = $author$project$ProcGen$calculatePropertyNumberChances(level);
		if (_v0.b) {
			var x = _v0.a;
			var xs = _v0.b;
			return A2(
				$elm$random$Random$andThen,
				function (propNum) {
					return A2(
						$elm$random$Random$list,
						propNum,
						A2($author$project$ProcGen$generateProperty, level, blockedColors));
				},
				A2($elm$random$Random$weighted, x, xs));
		} else {
			return $elm$random$Random$constant(_List_Nil);
		}
	});
var $author$project$ProcGen$generateTile = function (state) {
	var baseTile = A2(
		$elm$random$Random$andThen,
		A2($author$project$ProcGen$generateBase, state.level, _List_Nil),
		$author$project$ProcGen$defaultTile);
	return A3(
		$elm$random$Random$map2,
		F2(
			function (tile, props) {
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{nextTileId: state.nextTileId + 1}),
					_Utils_update(
						tile,
						{id: state.nextTileId, properties: props}));
			}),
		baseTile,
		A2($author$project$ProcGen$generateProperties, state.level, _List_Nil));
};
var $author$project$ProcGen$generateTileList = F2(
	function (length, state) {
		var go = F2(
			function (remLength, rStateList) {
				return (!remLength) ? rStateList : A2(
					go,
					remLength - 1,
					A3(
						$elm$random$Random$map2,
						F2(
							function (_v0, _v1) {
								var list = _v0.b;
								var nextState = _v1.a;
								var nextTile = _v1.b;
								return _Utils_Tuple2(
									nextState,
									A2($elm$core$List$cons, nextTile, list));
							}),
						rStateList,
						A2(
							$elm$random$Random$andThen,
							A2($elm$core$Basics$composeL, $author$project$ProcGen$generateTile, $elm$core$Tuple$first),
							rStateList)));
			});
		return A2(
			go,
			length,
			$elm$random$Random$constant(
				_Utils_Tuple2(state, _List_Nil)));
	});
var $author$project$Game$initMsg = $elm$core$Platform$Cmd$batch(
	_List_fromArray(
		[
			A2(
			$elm$random$Random$generate,
			$author$project$Game$NewBoard,
			$author$project$ProcGen$generateBoard($author$project$ProcGen$init.level)),
			A2(
			$elm$random$Random$generate,
			$author$project$Game$NewPieceList,
			$author$project$ProcGen$generatePieceList($author$project$ProcGen$init)),
			A2(
			$elm$random$Random$generate,
			$author$project$Game$NewTileList,
			A2($author$project$ProcGen$generateTileList, 12, $author$project$ProcGen$init))
		]));
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$setStorage = _Platform_outgoingPort('setStorage', $elm$core$Basics$identity);
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Game$CraftingMsg = function (a) {
	return {$: 'CraftingMsg', a: a};
};
var $author$project$Game$RewardsGenerated = function (a) {
	return {$: 'RewardsGenerated', a: a};
};
var $author$project$Items$addScores = F2(
	function (sc1, sc2) {
		return A3(
			$elm$core$List$map2,
			F2(
				function (_v0, _v1) {
					var c1 = _v0.a;
					var v1 = _v0.b;
					var v2 = _v1.b;
					return _Utils_Tuple2(c1, v1 + v2);
				}),
			sc1,
			sc2);
	});
var $author$project$Crafting$addCraftingMats = F3(
	function (state, scrolls, orbs) {
		return _Utils_update(
			state,
			{
				orbs: A2($author$project$Items$addScores, orbs, state.orbs),
				scrolls: A3(
					$elm$core$List$foldr,
					F2(
						function (_v0, hand) {
							var scrl = _v0.a;
							var quant = _v0.b;
							return A3(
								$elm_community$list_extra$List$Extra$updateIf,
								A2(
									$elm$core$Basics$composeL,
									$elm$core$Basics$eq(scrl),
									$elm$core$Tuple$first),
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$add(quant)),
								hand);
						}),
					state.scrolls,
					scrolls)
			});
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Board$countTotalReq = function (board) {
	return A3(
		$elm$core$List$foldr,
		$author$project$Items$addScores,
		$author$project$Items$emptyScore,
		_Utils_ap(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				$elm$core$Dict$values(board.colReqs)),
			_Utils_ap(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$first,
					$elm$core$Dict$values(board.rowReqs)),
				$elm$core$List$map(
					function ($) {
						return $.req;
					})(board.pieces))));
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$Board$toList = function (array) {
	return $elm$core$Array$toList(
		A2($elm$core$Array$map, $elm$core$Array$toList, array));
};
var $author$project$Board$gatherAllTiles = function (board) {
	return A2(
		$elm$core$List$filterMap,
		function (field) {
			if (field.$ === 'Filled') {
				var tile = field.b;
				return $elm$core$Maybe$Just(tile);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		$elm$core$List$concat(
			$author$project$Board$toList(board.tiles)));
};
var $author$project$ProcGen$generateEssence = F2(
	function (color, state) {
		return A2(
			$elm$random$Random$map,
			function (pr) {
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{nextEssenceId: state.nextEssenceId + 1}),
					{id: state.nextEssenceId, property: pr});
			},
			A2(
				$author$project$ProcGen$generateProperty,
				state.level,
				A2(
					$elm$core$List$filter,
					$elm$core$Basics$neq(color),
					_List_fromArray(
						[$author$project$Items$Purple, $author$project$Items$Green, $author$project$Items$Yellow, $author$project$Items$Orange]))));
	});
var $author$project$ProcGen$generateEssenceReward = F2(
	function (score, state) {
		var generateEssenceP = F3(
			function (col, weight, st) {
				return A3(
					$elm$random$Random$map2,
					F2(
						function (isGenerated, _v4) {
							var newState = _v4.a;
							var essence = _v4.b;
							return isGenerated ? _Utils_Tuple2(
								newState,
								_List_fromArray(
									[essence])) : _Utils_Tuple2(st, _List_Nil);
						}),
					A2(
						$elm$random$Random$weighted,
						_Utils_Tuple2(weight, true),
						_List_fromArray(
							[
								_Utils_Tuple2(100 - weight, false)
							])),
					A2($author$project$ProcGen$generateEssence, col, st));
			});
		var go = F2(
			function (remScore, rStateList) {
				if (!remScore.b) {
					return rStateList;
				} else {
					var _v1 = remScore.a;
					var nextCol = _v1.a;
					var nextVal = _v1.b;
					var cs = remScore.b;
					return A2(
						go,
						cs,
						A3(
							$elm$random$Random$map2,
							F2(
								function (_v2, _v3) {
									var list = _v2.b;
									var nextState = _v3.a;
									var nextEssence = _v3.b;
									return _Utils_Tuple2(
										nextState,
										_Utils_ap(nextEssence, list));
								}),
							rStateList,
							A2(
								$elm$random$Random$andThen,
								A2(
									$elm$core$Basics$composeL,
									A2(generateEssenceP, nextCol, nextVal),
									$elm$core$Tuple$first),
								rStateList)));
				}
			});
		return A2(
			go,
			score,
			$elm$random$Random$constant(
				_Utils_Tuple2(state, _List_Nil)));
	});
var $author$project$ProcGen$generateOrbRewards = $elm_community$random_extra$Random$Extra$traverse(
	function (_v0) {
		var color = _v0.a;
		var value = _v0.b;
		return A2(
			$elm$random$Random$map,
			$elm$core$Tuple$pair(color),
			A2(
				$elm$random$Random$weighted,
				_Utils_Tuple2(value, 1),
				_List_fromArray(
					[
						_Utils_Tuple2(100 - value, 0)
					])));
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm_community$list_extra$List$Extra$gatherWith = F2(
	function (testFn, list) {
		var helper = F2(
			function (scattered, gathered) {
				if (!scattered.b) {
					return $elm$core$List$reverse(gathered);
				} else {
					var toGather = scattered.a;
					var population = scattered.b;
					var _v1 = A2(
						$elm$core$List$partition,
						testFn(toGather),
						population);
					var gathering = _v1.a;
					var remaining = _v1.b;
					return A2(
						helper,
						remaining,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(toGather, gathering),
							gathered));
				}
			});
		return A2(helper, list, _List_Nil);
	});
var $elm_community$list_extra$List$Extra$gatherEquals = function (list) {
	return A2($elm_community$list_extra$List$Extra$gatherWith, $elm$core$Basics$eq, list);
};
var $author$project$ProcGen$generateScrollRewards = function (score) {
	var scrollNumRaw = 0.1 * A3(
		$elm$core$List$foldr,
		A2($elm$core$Basics$composeL, $elm$core$Basics$add, $elm$core$Tuple$second),
		0,
		score);
	var scrollNum = A2(
		$elm$random$Random$map,
		$elm$core$Basics$add(
			$elm$core$Basics$floor(scrollNumRaw)),
		$author$project$ProcGen$pRound(
			scrollNumRaw - A2($elm$core$Basics$composeL, $elm$core$Basics$toFloat, $elm$core$Basics$floor)(scrollNumRaw)));
	var gatherWeight = function (weights) {
		return $elm$core$List$sum(
			A3(
				$elm$core$List$map2,
				F2(
					function (w, _v0) {
						var c = _v0.a;
						var v = _v0.b;
						return w * v;
					}),
				weights,
				score));
	};
	var generateScroll = A2(
		$elm$random$Random$weighted,
		_Utils_Tuple2(
			gatherWeight(
				_List_fromArray(
					[4, 3, 2, 1])),
			$author$project$Items$Modification),
		_List_fromArray(
			[
				_Utils_Tuple2(
				gatherWeight(
					_List_fromArray(
						[1, 4, 3, 2])),
				$author$project$Items$Augmentation),
				_Utils_Tuple2(
				gatherWeight(
					_List_fromArray(
						[2, 1, 4, 3])),
				$author$project$Items$Alteration),
				_Utils_Tuple2(
				gatherWeight(
					_List_fromArray(
						[3, 2, 1, 4])),
				$author$project$Items$Distillation)
			]));
	return A2(
		$elm$random$Random$andThen,
		function (num) {
			return A2(
				$elm$random$Random$map,
				A2(
					$elm$core$Basics$composeL,
					$elm$core$List$map(
						$elm$core$Tuple$mapSecond(
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$add(1),
								$elm$core$List$length))),
					$elm_community$list_extra$List$Extra$gatherEquals),
				A2($elm$random$Random$list, num, generateScroll));
		},
		scrollNum);
};
var $author$project$ProcGen$generateReward = F2(
	function (score, state) {
		var baseReward = A3(
			$elm$random$Random$map2,
			F2(
				function (scrolls, orbs) {
					return {essences: _List_Nil, orbs: orbs, scrolls: scrolls, tiles: _List_Nil};
				}),
			$author$project$ProcGen$generateScrollRewards(score),
			$author$project$ProcGen$generateOrbRewards(score));
		return A2(
			$elm$random$Random$andThen,
			function (_v0) {
				var upState = _v0.a;
				var essences = _v0.b;
				return A3(
					$elm$random$Random$map2,
					F2(
						function (_v1, reward) {
							var finalState = _v1.a;
							var tiles = _v1.b;
							return _Utils_Tuple2(
								finalState,
								_Utils_update(
									reward,
									{essences: essences, tiles: tiles}));
						}),
					A2($author$project$ProcGen$generateTileList, 3, upState),
					baseReward);
			},
			A2($author$project$ProcGen$generateEssenceReward, score, state));
	});
var $author$project$Items$DragPiece = function (a) {
	return {$: 'DragPiece', a: a};
};
var $author$project$Items$DragTile = function (a) {
	return {$: 'DragTile', a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Board$isReqMet = function (_v0) {
	var req = _v0.a;
	var score = _v0.b;
	return A2(
		$elm$core$List$all,
		$elm$core$Basics$identity,
		A3(
			$elm$core$List$map2,
			$elm$core$Basics$ge,
			A2($elm$core$List$map, $elm$core$Tuple$second, score),
			A2($elm$core$List$map, $elm$core$Tuple$second, req)));
};
var $author$project$Board$allReqMet = function (board) {
	var rowsMet = A2(
		$elm$core$List$all,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$map,
			$author$project$Board$isReqMet,
			$elm$core$Dict$values(board.rowReqs)));
	var piecesMet = A2(
		$elm$core$List$all,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$map,
			function (piece) {
				return $author$project$Board$isReqMet(
					_Utils_Tuple2(piece.req, piece.score));
			},
			board.pieces));
	var colsMet = A2(
		$elm$core$List$all,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$map,
			$author$project$Board$isReqMet,
			$elm$core$Dict$values(board.colReqs)));
	return rowsMet && (colsMet && piecesMet);
};
var $author$project$Board$Empty = F2(
	function (a, b) {
		return {$: 'Empty', a: a, b: b};
	});
var $author$project$Board$Filled = F3(
	function (a, b, c) {
		return {$: 'Filled', a: a, b: b, c: c};
	});
var $author$project$Board$setHighlight = F2(
	function (highlight, field) {
		switch (field.$) {
			case 'NonTile':
				return $author$project$Board$NonTile(highlight);
			case 'Empty':
				var pieceId = field.a;
				return A2($author$project$Board$Empty, pieceId, highlight);
			case 'Filled':
				var pieceId = field.a;
				var tile = field.b;
				return A3($author$project$Board$Filled, pieceId, tile, highlight);
			default:
				return $author$project$Board$Wall(highlight);
		}
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Board$get = F2(
	function (_v0, board) {
		var col = _v0.a;
		var row = _v0.b;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Array$get(col),
			A2($elm$core$Array$get, row, board.tiles));
	});
var $author$project$Board$update = F3(
	function (f, board, index) {
		var _v0 = A2($author$project$Board$get, index, board);
		if (_v0.$ === 'Just') {
			var field = _v0.a;
			return A3(
				$author$project$Board$set,
				index,
				f(field),
				board);
		} else {
			return board;
		}
	});
var $author$project$Board$removeHighlight = function (board) {
	var highlightedTiles = A3(
		$elm$core$List$foldr,
		F2(
			function (index, brd) {
				return A3(
					$author$project$Board$update,
					$author$project$Board$setHighlight(false),
					brd,
					index);
			}),
		board,
		board.highlight);
	return _Utils_update(
		highlightedTiles,
		{highlight: _List_Nil});
};
var $author$project$Game$dragEnd = F2(
	function (success, model) {
		var addedToHand = function () {
			if (!success) {
				var _v0 = model.dragedItem;
				switch (_v0.$) {
					case 'DragTile':
						var tile = _v0.a;
						return _Utils_update(
							model,
							{
								tiles: A2($elm$core$List$cons, tile, model.tiles)
							});
					case 'DragPiece':
						var piece = _v0.a;
						return _Utils_update(
							model,
							{
								pieces: A2(
									$elm$core$List$cons,
									_Utils_update(
										piece,
										{drawPosition: $elm$core$Maybe$Nothing, positions: _List_Nil}),
									model.pieces)
							});
					case 'DragEssence':
						var essence = _v0.a;
						return _Utils_update(
							model,
							{
								essences: A2($elm$core$List$cons, essence, model.essences)
							});
					default:
						return model;
				}
			} else {
				return model;
			}
		}();
		return _Utils_Tuple2(
			_Utils_update(
				addedToHand,
				{
					board: $author$project$Board$removeHighlight(model.board),
					dragedItem: $author$project$Items$None
				}),
			$elm$core$Platform$Cmd$none);
	});
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Items$DragEssence = function (a) {
	return {$: 'DragEssence', a: a};
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Items$shapeToIndexes = function (shape) {
	switch (shape.$) {
		case 'Twoi':
			var indexes = shape.a;
			return indexes;
		case 'Threel':
			var indexes = shape.a;
			return indexes;
		case 'Threei':
			var indexes = shape.a;
			return indexes;
		case 'Fouro':
			var indexes = shape.a;
			return indexes;
		case 'Fourt':
			var indexes = shape.a;
			return indexes;
		case 'Fours':
			var indexes = shape.a;
			return indexes;
		case 'Fourz':
			var indexes = shape.a;
			return indexes;
		case 'Fourl':
			var indexes = shape.a;
			return indexes;
		default:
			var indexes = shape.a;
			return indexes;
	}
};
var $author$project$Items$newDrawPosition = F2(
	function (mIndex, piece) {
		if (mIndex.$ === 'Just') {
			var _v1 = mIndex.a;
			var x = _v1.a;
			var y = _v1.b;
			var positions = A2(
				$elm$core$List$map,
				A2(
					$elm$core$Tuple$mapBoth,
					$elm$core$Basics$add(x),
					$elm$core$Basics$add(y)),
				$author$project$Items$shapeToIndexes(piece.shape));
			return _Utils_update(
				piece,
				{drawPosition: mIndex, positions: positions});
		} else {
			return _Utils_update(
				piece,
				{drawPosition: mIndex, positions: _List_Nil});
		}
	});
var $author$project$Items$indexDrag = F2(
	function (index, drag) {
		switch (drag.$) {
			case 'DragPiece':
				var piece = drag.a;
				return $author$project$Items$DragPiece(
					A2($author$project$Items$newDrawPosition, index, piece));
			case 'DragTile':
				var tile = drag.a;
				return $author$project$Items$DragTile(
					_Utils_update(
						tile,
						{drawPosition: index}));
			case 'DragEssence':
				var essence = drag.a;
				return $author$project$Items$DragEssence(essence);
			default:
				return $author$project$Items$None;
		}
	});
var $author$project$Board$CannotInsertNonTileOrPiece = {$: 'CannotInsertNonTileOrPiece'};
var $author$project$Board$CannotAddPieceFieldIsOccupied = {$: 'CannotAddPieceFieldIsOccupied'};
var $author$project$Board$CannotInsertPieceDrawPositionNothing = {$: 'CannotInsertPieceDrawPositionNothing'};
var $author$project$Board$insertPiece = F2(
	function (piece, board) {
		var canAdd = A2(
			$elm$core$List$all,
			function (index) {
				var _v0 = A2($author$project$Board$get, index, board);
				if ((_v0.$ === 'Just') && (_v0.a.$ === 'NonTile')) {
					return true;
				} else {
					return false;
				}
			},
			piece.positions);
		return canAdd ? (_Utils_eq(piece.drawPosition, $elm$core$Maybe$Nothing) ? $elm$core$Result$Err($author$project$Board$CannotInsertPieceDrawPositionNothing) : $elm$core$Result$Ok(
			A3(
				$elm$core$List$foldr,
				F2(
					function (ind, brd) {
						return _Utils_update(
							brd,
							{
								tiles: A3(
									$author$project$Board$set,
									ind,
									A2($author$project$Board$Empty, piece.id, false),
									brd).tiles
							});
					}),
				_Utils_update(
					board,
					{
						pieces: A2($elm$core$List$cons, piece, board.pieces)
					}),
				piece.positions))) : $elm$core$Result$Err($author$project$Board$CannotAddPieceFieldIsOccupied);
	});
var $author$project$Board$CannotAddTileFieldNotEmpty = function (a) {
	return {$: 'CannotAddTileFieldNotEmpty', a: a};
};
var $author$project$Board$CannotInsertTileDrawPositionNothing = {$: 'CannotInsertTileDrawPositionNothing'};
var $author$project$Board$neighbourIndexes = function (_v0) {
	var xIndex = _v0.a;
	var yIndex = _v0.b;
	var difs = _List_fromArray(
		[
			_Utils_Tuple2(-1, 1),
			_Utils_Tuple2(0, 1),
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(-1, 0),
			_Utils_Tuple2(1, 0),
			_Utils_Tuple2(-1, -1),
			_Utils_Tuple2(0, -1),
			_Utils_Tuple2(1, -1)
		]);
	return A2(
		$elm$core$List$filter,
		function (_v1) {
			var a = _v1.a;
			var b = _v1.b;
			return (a >= 0) && ((a <= 3) && ((b >= 0) && (b <= 3)));
		},
		A2(
			$elm$core$List$map,
			function (_v2) {
				var a = _v2.a;
				var b = _v2.b;
				return _Utils_Tuple2(a + xIndex, b + yIndex);
			},
			difs));
};
var $author$project$Board$checkProperty = F3(
	function (_v0, property, board) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		return _Utils_cmp(
			property.reqValue,
			$elm$core$List$sum(
				A2(
					$elm$core$List$map,
					function (_v1) {
						var x = _v1.a;
						var y = _v1.b;
						var _v2 = A2(
							$author$project$Board$get,
							_Utils_Tuple2(xIndex + x, yIndex + y),
							board);
						if ((_v2.$ === 'Just') && (_v2.a.$ === 'Filled')) {
							var _v3 = _v2.a;
							var tile = _v3.b;
							return _Utils_eq(tile.color, property.reqColor) ? tile.currentValue : 0;
						} else {
							return 0;
						}
					},
					property.region))) < 1;
	});
var $author$project$Board$updateTile = F3(
	function (tile, index, board) {
		var checkedProps = A2(
			$elm$core$List$map,
			function (prop) {
				return A3($author$project$Board$checkProperty, index, prop, board) ? _Utils_update(
					prop,
					{isMet: true}) : _Utils_update(
					prop,
					{isMet: false});
			},
			tile.properties);
		var prodBonus = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.prodBonus;
				},
				A2(
					$elm$core$List$filter,
					function ($) {
						return $.isMet;
					},
					checkedProps)));
		var addBonus = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.addBonus;
				},
				A2(
					$elm$core$List$filter,
					function ($) {
						return $.isMet;
					},
					checkedProps)));
		return _Utils_update(
			tile,
			{
				addBonus: addBonus,
				currentValue: $elm$core$Basics$floor((tile.baseValue * (prodBonus + 1)) + addBonus),
				prodBonus: prodBonus,
				properties: checkedProps
			});
	});
var $author$project$Board$checkAroundTile = F2(
	function (tileIndex, board) {
		return A2(
			$elm$core$List$filterMap,
			function (index) {
				var _v0 = A2($author$project$Board$get, index, board);
				if ((_v0.$ === 'Just') && (_v0.a.$ === 'Filled')) {
					var _v1 = _v0.a;
					var pieceId = _v1.a;
					var tile = _v1.b;
					var highlight = _v1.c;
					var updatedTile = A3($author$project$Board$updateTile, tile, index, board);
					return _Utils_eq(tile.currentValue, updatedTile.currentValue) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A3($author$project$Board$Filled, pieceId, updatedTile, highlight),
							index));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			$author$project$Board$neighbourIndexes(tileIndex));
	});
var $author$project$Board$addScoresInRegion = F2(
	function (board, region) {
		var folding = F2(
			function (index, score) {
				var _v0 = A2($author$project$Board$get, index, board);
				if ((_v0.$ === 'Just') && (_v0.a.$ === 'Filled')) {
					var _v1 = _v0.a;
					var tile = _v1.b;
					return A3(
						$elm_community$list_extra$List$Extra$updateIf,
						A2(
							$elm$core$Basics$composeL,
							$elm$core$Basics$eq(tile.color),
							$elm$core$Tuple$first),
						$elm$core$Tuple$mapSecond(
							$elm$core$Basics$add(tile.currentValue)),
						score);
				} else {
					return score;
				}
			});
		return A3($elm$core$List$foldr, folding, $author$project$Items$emptyScore, region);
	});
var $author$project$Board$calculateColScore = F2(
	function (board, index) {
		return _Utils_update(
			board,
			{
				colReqs: A3(
					$elm$core$Dict$update,
					index,
					$elm$core$Maybe$map(
						function (_v0) {
							var req = _v0.a;
							var score = _v0.b;
							return _Utils_Tuple2(
								req,
								A2(
									$author$project$Board$addScoresInRegion,
									board,
									A2(
										$elm$core$List$map,
										function (y) {
											return _Utils_Tuple2(index, y);
										},
										_List_fromArray(
											[0, 1, 2, 3]))));
						}),
					board.colReqs)
			});
	});
var $author$project$Board$calculatePieceScore = F2(
	function (board, piece) {
		return _Utils_update(
			piece,
			{
				score: A2($author$project$Board$addScoresInRegion, board, piece.positions)
			});
	});
var $author$project$Board$calculateRowScore = F2(
	function (board, index) {
		return _Utils_update(
			board,
			{
				rowReqs: A3(
					$elm$core$Dict$update,
					index,
					$elm$core$Maybe$map(
						function (_v0) {
							var req = _v0.a;
							var score = _v0.b;
							return _Utils_Tuple2(
								req,
								A2(
									$author$project$Board$addScoresInRegion,
									board,
									A2(
										$elm$core$List$map,
										function (x) {
											return _Utils_Tuple2(x, index);
										},
										_List_fromArray(
											[0, 1, 2, 3]))));
						}),
					board.rowReqs)
			});
	});
var $author$project$Board$updateScoreOnTileChange = F2(
	function (board, _v0) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		var rowsAndCols = A2(
			$author$project$Board$calculateColScore,
			A2($author$project$Board$calculateRowScore, board, yIndex),
			xIndex);
		var updateBoard = function (id) {
			return _Utils_update(
				rowsAndCols,
				{
					pieces: A3(
						$elm_community$list_extra$List$Extra$updateIf,
						A2(
							$elm$core$Basics$composeL,
							$elm$core$Basics$eq(id),
							function ($) {
								return $.id;
							}),
						$author$project$Board$calculatePieceScore(board),
						board.pieces)
				});
		};
		var pieceId = function () {
			var _v1 = A2(
				$author$project$Board$get,
				_Utils_Tuple2(xIndex, yIndex),
				board);
			_v1$2:
			while (true) {
				if (_v1.$ === 'Just') {
					switch (_v1.a.$) {
						case 'Empty':
							var _v2 = _v1.a;
							var id = _v2.a;
							return $elm$core$Maybe$Just(id);
						case 'Filled':
							var _v3 = _v1.a;
							var id = _v3.a;
							return $elm$core$Maybe$Just(id);
						default:
							break _v1$2;
					}
				} else {
					break _v1$2;
				}
			}
			return $elm$core$Maybe$Nothing;
		}();
		return A2(
			$elm$core$Maybe$withDefault,
			rowsAndCols,
			A2($elm$core$Maybe$map, updateBoard, pieceId));
	});
var $author$project$Board$updateAroundTile = F2(
	function (index, board) {
		var updatables = A2($author$project$Board$checkAroundTile, index, board);
		var updatedBoard = A3(
			$elm$core$List$foldr,
			F2(
				function (_v0, brd) {
					var field = _v0.a;
					var ind = _v0.b;
					return A2(
						$author$project$Board$updateScoreOnTileChange,
						A3($author$project$Board$set, ind, field, brd),
						ind);
				}),
			board,
			updatables);
		return A3(
			$elm$core$List$foldr,
			$author$project$Board$updateAroundTile,
			updatedBoard,
			A2($elm$core$List$map, $elm$core$Tuple$second, updatables));
	});
var $author$project$Board$insertTile = F2(
	function (tile, board) {
		var _v0 = tile.drawPosition;
		if (_v0.$ === 'Just') {
			var index = _v0.a;
			var _v1 = A2($author$project$Board$get, index, board);
			if ((_v1.$ === 'Just') && (_v1.a.$ === 'Empty')) {
				var _v2 = _v1.a;
				var pieceId = _v2.a;
				var highlight = _v2.b;
				var inserted = A2(
					$author$project$Board$updateAroundTile,
					index,
					A3(
						$author$project$Board$set,
						index,
						A3(
							$author$project$Board$Filled,
							pieceId,
							A3($author$project$Board$updateTile, tile, index, board),
							highlight),
						board));
				return $elm$core$Result$Ok(
					A2($author$project$Board$updateScoreOnTileChange, inserted, index));
			} else {
				return $elm$core$Result$Err(
					$author$project$Board$CannotAddTileFieldNotEmpty(index));
			}
		} else {
			return $elm$core$Result$Err($author$project$Board$CannotInsertTileDrawPositionNothing);
		}
	});
var $author$project$Board$insertDrag = F2(
	function (board, drag) {
		switch (drag.$) {
			case 'DragPiece':
				var piece = drag.a;
				return A2($author$project$Board$insertPiece, piece, board);
			case 'DragTile':
				var tile = drag.a;
				return A2($author$project$Board$insertTile, tile, board);
			default:
				return $elm$core$Result$Err($author$project$Board$CannotInsertNonTileOrPiece);
		}
	});
var $author$project$Items$getDragId = function (drag) {
	switch (drag.$) {
		case 'DragPiece':
			var piece = drag.a;
			return piece.id;
		case 'DragTile':
			var tile = drag.a;
			return tile.id;
		case 'DragEssence':
			var essence = drag.a;
			return essence.id;
		default:
			return -1;
	}
};
var $author$project$Game$removeDragFromHand = F2(
	function (drag, model) {
		switch (drag.$) {
			case 'DragTile':
				var tile = drag.a;
				return _Utils_update(
					model,
					{
						tiles: A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$neq(
									$author$project$Items$getDragId(drag)),
								function ($) {
									return $.id;
								}),
							model.tiles)
					});
			case 'DragPiece':
				var piece = drag.a;
				return _Utils_update(
					model,
					{
						pieces: A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$neq(
									$author$project$Items$getDragId(drag)),
								function ($) {
									return $.id;
								}),
							model.pieces)
					});
			case 'DragEssence':
				var essence = drag.a;
				return _Utils_update(
					model,
					{
						essences: A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$neq(
									$author$project$Items$getDragId(drag)),
								function ($) {
									return $.id;
								}),
							model.essences)
					});
			default:
				return model;
		}
	});
var $author$project$Board$NoPieceOnBoardWithId = function (a) {
	return {$: 'NoPieceOnBoardWithId', a: a};
};
var $author$project$Board$PieceToRemoveIsNotEmpty = function (a) {
	return {$: 'PieceToRemoveIsNotEmpty', a: a};
};
var $author$project$Board$checkIfPieceEmpty = F2(
	function (piece, board) {
		return A2(
			$elm$core$List$all,
			function (ind) {
				var _v0 = A2($author$project$Board$get, ind, board);
				if ((_v0.$ === 'Just') && (_v0.a.$ === 'Empty')) {
					var _v1 = _v0.a;
					return true;
				} else {
					return false;
				}
			},
			piece.positions);
	});
var $author$project$Board$removePiece = F2(
	function (board, id) {
		var _v0 = A2(
			$elm_community$list_extra$List$Extra$find,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Basics$eq(id),
				function ($) {
					return $.id;
				}),
			board.pieces);
		if (_v0.$ === 'Just') {
			var piece = _v0.a;
			if (A2($author$project$Board$checkIfPieceEmpty, piece, board)) {
				var updatedPieces = A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Basics$neq(id),
						function ($) {
							return $.id;
						}),
					board.pieces);
				return $elm$core$Result$Ok(
					_Utils_Tuple2(
						A3(
							$elm$core$List$foldr,
							F2(
								function (index, brd) {
									return A3(
										$author$project$Board$set,
										index,
										$author$project$Board$NonTile(false),
										brd);
								}),
							_Utils_update(
								board,
								{pieces: updatedPieces}),
							piece.positions),
						piece));
			} else {
				return $elm$core$Result$Err(
					$author$project$Board$PieceToRemoveIsNotEmpty(id));
			}
		} else {
			return $elm$core$Result$Err(
				$author$project$Board$NoPieceOnBoardWithId(id));
		}
	});
var $author$project$Board$removeTile = F2(
	function (index, board) {
		var _v0 = A2($author$project$Board$get, index, board);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Filled')) {
			var _v1 = _v0.a;
			var pieceId = _v1.a;
			var highlight = _v1.c;
			var removed = A2(
				$author$project$Board$updateAroundTile,
				index,
				A3(
					$author$project$Board$set,
					index,
					A2($author$project$Board$Empty, pieceId, highlight),
					board));
			return A2($author$project$Board$updateScoreOnTileChange, removed, index);
		} else {
			return board;
		}
	});
var $author$project$Items$mapTranslate = F2(
	function (f, trans) {
		return _Utils_update(
			trans,
			{
				translate: f(trans.translate)
			});
	});
var $author$project$Items$newShape = F2(
	function (shape, piece) {
		var _v0 = piece.drawPosition;
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var posx = _v1.a;
			var posy = _v1.b;
			var positions = A2(
				$elm$core$List$map,
				A2(
					$elm$core$Tuple$mapBoth,
					$elm$core$Basics$add(posx),
					$elm$core$Basics$add(posy)),
				$author$project$Items$shapeToIndexes(shape));
			return _Utils_update(
				piece,
				{positions: positions, shape: shape});
		} else {
			return _Utils_update(
				piece,
				{shape: shape});
		}
	});
var $author$project$Items$shapeMap = F2(
	function (f, shape) {
		switch (shape.$) {
			case 'Twoi':
				var indexes = shape.a;
				return $author$project$Items$Twoi(
					f(indexes));
			case 'Threel':
				var indexes = shape.a;
				return $author$project$Items$Threel(
					f(indexes));
			case 'Threei':
				var indexes = shape.a;
				return $author$project$Items$Threei(
					f(indexes));
			case 'Fouro':
				var indexes = shape.a;
				return $author$project$Items$Fouro(
					f(indexes));
			case 'Fourt':
				var indexes = shape.a;
				return $author$project$Items$Fourt(
					f(indexes));
			case 'Fours':
				var indexes = shape.a;
				return $author$project$Items$Fours(
					f(indexes));
			case 'Fourz':
				var indexes = shape.a;
				return $author$project$Items$Fourz(
					f(indexes));
			case 'Fourl':
				var indexes = shape.a;
				return $author$project$Items$Fourl(
					f(indexes));
			default:
				var indexes = shape.a;
				return $author$project$Items$Fourr(
					f(indexes));
		}
	});
var $author$project$Items$translatePiece = F2(
	function (_v0, piece) {
		var indx = _v0.a;
		var indy = _v0.b;
		var _v1 = piece.drawPosition;
		if (_v1.$ === 'Just') {
			var _v2 = _v1.a;
			var dpx = _v2.a;
			var dpy = _v2.b;
			var _v3 = _Utils_Tuple2(dpx - indx, dpy - indy);
			var transx = _v3.a;
			var transy = _v3.b;
			var newTransform = A2(
				$author$project$Items$mapTranslate,
				function (_v4) {
					var trx = _v4.a;
					var _try = _v4.b;
					return _Utils_Tuple2(trx + (52 * transx), _try + (52 * transy));
				},
				piece.borderTransform);
			return A2(
				$author$project$Items$newShape,
				A2(
					$author$project$Items$shapeMap,
					$elm$core$List$map(
						A2(
							$elm$core$Tuple$mapBoth,
							$elm$core$Basics$add(transx),
							$elm$core$Basics$add(transy))),
					piece.shape),
				_Utils_update(
					piece,
					{borderTransform: newTransform}));
		} else {
			return piece;
		}
	});
var $author$project$Board$highlightPiece = F2(
	function (board, piece) {
		var highlightedTiles = A3(
			$elm$core$List$foldr,
			F2(
				function (index, brd) {
					return A3(
						$author$project$Board$update,
						$author$project$Board$setHighlight(true),
						brd,
						index);
				}),
			board,
			piece.positions);
		return _Utils_update(
			highlightedTiles,
			{highlight: piece.positions});
	});
var $author$project$Board$highlightBoard = F2(
	function (board, drag) {
		if (drag.$ === 'DragPiece') {
			var piece = drag.a;
			return A2($author$project$Board$highlightPiece, board, piece);
		} else {
			return board;
		}
	});
var $author$project$Game$updateDrag = F2(
	function (drag, model) {
		return _Utils_update(
			model,
			{
				board: A2($author$project$Board$highlightBoard, model.board, drag),
				dragedItem: drag
			});
	});
var $author$project$Game$updateHover = function (model) {
	var _v0 = model.dragedItem;
	switch (_v0.$) {
		case 'DragPiece':
			var piece = _v0.a;
			return _Utils_update(
				model,
				{
					hoveredPiece: $elm$core$Maybe$Just(piece)
				});
		case 'DragTile':
			var tile = _v0.a;
			return _Utils_update(
				model,
				{
					hoveredTile: $elm$core$Maybe$Just(tile)
				});
		default:
			return model;
	}
};
var $author$project$Game$handleDragMsg = F2(
	function (dragMsg, model) {
		switch (dragMsg.$) {
			case 'DragFromHandStart':
				var drag = dragMsg.a;
				return _Utils_Tuple2(
					A2(
						$author$project$Game$removeDragFromHand,
						drag,
						_Utils_update(
							model,
							{dragedItem: drag})),
					$elm$core$Platform$Cmd$none);
			case 'DragFromBoardStart':
				var index = dragMsg.a;
				var _v1 = A2($author$project$Board$get, index, model.board);
				_v1$2:
				while (true) {
					if (_v1.$ === 'Just') {
						switch (_v1.a.$) {
							case 'Empty':
								var _v2 = _v1.a;
								var pieceId = _v2.a;
								var _v3 = A2($author$project$Board$removePiece, model.board, pieceId);
								if (_v3.$ === 'Ok') {
									var _v4 = _v3.a;
									var board = _v4.a;
									var piece = _v4.b;
									return _Utils_Tuple2(
										A2(
											$author$project$Game$updateDrag,
											$author$project$Items$DragPiece(
												A2(
													$author$project$Items$newDrawPosition,
													$elm$core$Maybe$Just(index),
													A2($author$project$Items$translatePiece, index, piece))),
											_Utils_update(
												model,
												{
													allReqMet: $author$project$Board$allReqMet(board),
													board: board,
													hoveredPiece: $elm$core$Maybe$Nothing
												})),
										$elm$core$Platform$Cmd$none);
								} else {
									var err = _v3.a;
									return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
								}
							case 'Filled':
								var _v5 = _v1.a;
								var tile = _v5.b;
								var newBoard = A2($author$project$Board$removeTile, index, model.board);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											allReqMet: $author$project$Board$allReqMet(newBoard),
											board: newBoard,
											dragedItem: $author$project$Items$DragTile(tile),
											hoveredTile: $elm$core$Maybe$Nothing
										}),
									$elm$core$Platform$Cmd$none);
							default:
								break _v1$2;
						}
					} else {
						break _v1$2;
					}
				}
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'DragFromBenchStart':
				var drag = dragMsg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'DragOverField':
				var index = dragMsg.a;
				var indexedDrag = A2(
					$author$project$Items$indexDrag,
					$elm$core$Maybe$Just(index),
					model.dragedItem);
				var _v6 = A2($author$project$Board$get, index, model.board);
				_v6$2:
				while (true) {
					if (_v6.$ === 'Just') {
						switch (_v6.a.$) {
							case 'Filled':
								var _v7 = _v6.a;
								var pieceId = _v7.a;
								var tile = _v7.b;
								return _Utils_Tuple2(
									A2(
										$author$project$Game$updateDrag,
										indexedDrag,
										_Utils_update(
											model,
											{
												hoveredPiece: A2(
													$elm_community$list_extra$List$Extra$find,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Basics$eq(pieceId),
														function ($) {
															return $.id;
														}),
													model.board.pieces),
												hoveredTile: $elm$core$Maybe$Just(tile)
											})),
									$elm$core$Platform$Cmd$none);
							case 'Empty':
								var _v8 = _v6.a;
								var pieceId = _v8.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Game$updateDrag,
										indexedDrag,
										_Utils_update(
											model,
											{
												hoveredPiece: A2(
													$elm_community$list_extra$List$Extra$find,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Basics$eq(pieceId),
														function ($) {
															return $.id;
														}),
													model.board.pieces)
											})),
									$elm$core$Platform$Cmd$none);
							default:
								break _v6$2;
						}
					} else {
						break _v6$2;
					}
				}
				return _Utils_Tuple2(
					A2($author$project$Game$updateDrag, indexedDrag, model),
					$elm$core$Platform$Cmd$none);
			case 'DragLeave':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							board: $author$project$Board$removeHighlight(model.board),
							dragedItem: A2($author$project$Items$indexDrag, $elm$core$Maybe$Nothing, model.dragedItem),
							hoveredPiece: $elm$core$Maybe$Nothing,
							hoveredTile: $elm$core$Maybe$Nothing
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var _v9 = A2($author$project$Board$insertDrag, model.board, model.dragedItem);
				if (_v9.$ === 'Ok') {
					var board = _v9.a;
					return A2(
						$author$project$Game$dragEnd,
						true,
						$author$project$Game$updateHover(
							_Utils_update(
								model,
								{
									allReqMet: $author$project$Board$allReqMet(board),
									board: board
								})));
				} else {
					return A2($author$project$Game$dragEnd, false, model);
				}
		}
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Items$rotatePropertyLeft = function (property) {
	var rotate = function (_v0) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		return _Utils_Tuple2(yIndex, (-1) * xIndex);
	};
	return _Utils_update(
		property,
		{
			region: A2($elm$core$List$map, rotate, property.region)
		});
};
var $author$project$Items$rotateEssenceLeft = function (essence) {
	return _Utils_update(
		essence,
		{
			property: $author$project$Items$rotatePropertyLeft(essence.property)
		});
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Items$rotatePieceLeft = function (piece) {
	var transform = piece.borderTransform;
	var rotate = function (_v1) {
		var xIndex = _v1.a;
		var yIndex = _v1.b;
		return _Utils_Tuple2(yIndex, (-1) * xIndex);
	};
	var newTransform = A2(
		$author$project$Items$mapTranslate,
		function (_v0) {
			var transx = _v0.a;
			var transy = _v0.b;
			return _Utils_Tuple2(transy, (-1) * transx);
		},
		_Utils_update(
			transform,
			{
				rotate: A2($elm$core$Basics$modBy, 360, transform.rotate - 90)
			}));
	return A2(
		$author$project$Items$newShape,
		A2(
			$author$project$Items$shapeMap,
			$elm$core$List$map(rotate),
			piece.shape),
		_Utils_update(
			piece,
			{borderTransform: newTransform}));
};
var $author$project$Items$rotateTileLeft = function (tile) {
	return _Utils_update(
		tile,
		{
			properties: A2($elm$core$List$map, $author$project$Items$rotatePropertyLeft, tile.properties)
		});
};
var $author$project$Items$rotateDragLeft = function (drag) {
	switch (drag.$) {
		case 'DragPiece':
			var piece = drag.a;
			return $author$project$Items$DragPiece(
				$author$project$Items$rotatePieceLeft(piece));
		case 'DragTile':
			var tile = drag.a;
			return $author$project$Items$DragTile(
				$author$project$Items$rotateTileLeft(tile));
		case 'DragEssence':
			var essence = drag.a;
			return $author$project$Items$DragEssence(
				$author$project$Items$rotateEssenceLeft(essence));
		default:
			return $author$project$Items$None;
	}
};
var $author$project$Items$rotatePropertyRight = function (property) {
	var rotate = function (_v0) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		return _Utils_Tuple2((-1) * yIndex, xIndex);
	};
	return _Utils_update(
		property,
		{
			region: A2($elm$core$List$map, rotate, property.region)
		});
};
var $author$project$Items$rotateEssenceRight = function (essence) {
	return _Utils_update(
		essence,
		{
			property: $author$project$Items$rotatePropertyRight(essence.property)
		});
};
var $author$project$Items$rotatePieceRight = function (piece) {
	var transform = piece.borderTransform;
	var rotate = function (_v1) {
		var xIndex = _v1.a;
		var yIndex = _v1.b;
		return _Utils_Tuple2((-1) * yIndex, xIndex);
	};
	var newTransform = A2(
		$author$project$Items$mapTranslate,
		function (_v0) {
			var transx = _v0.a;
			var transy = _v0.b;
			return _Utils_Tuple2((-1) * transy, transx);
		},
		_Utils_update(
			transform,
			{
				rotate: A2($elm$core$Basics$modBy, 360, transform.rotate + 90)
			}));
	return A2(
		$author$project$Items$newShape,
		A2(
			$author$project$Items$shapeMap,
			$elm$core$List$map(rotate),
			piece.shape),
		_Utils_update(
			piece,
			{borderTransform: newTransform}));
};
var $author$project$Items$rotateTileRight = function (tile) {
	return _Utils_update(
		tile,
		{
			properties: A2($elm$core$List$map, $author$project$Items$rotatePropertyRight, tile.properties)
		});
};
var $author$project$Items$rotateDragRight = function (drag) {
	switch (drag.$) {
		case 'DragPiece':
			var piece = drag.a;
			return $author$project$Items$DragPiece(
				$author$project$Items$rotatePieceRight(piece));
		case 'DragTile':
			var tile = drag.a;
			return $author$project$Items$DragTile(
				$author$project$Items$rotateTileRight(tile));
		case 'DragEssence':
			var essence = drag.a;
			return $author$project$Items$DragEssence(
				$author$project$Items$rotateEssenceRight(essence));
		default:
			return $author$project$Items$None;
	}
};
var $author$project$Crafting$EssenceDistilled = function (a) {
	return {$: 'EssenceDistilled', a: a};
};
var $author$project$Crafting$TileGenerated = function (a) {
	return {$: 'TileGenerated', a: a};
};
var $author$project$ProcGen$addProperty = F3(
	function (level, blockedColors, tile) {
		return A2(
			$elm$random$Random$map,
			function (prop) {
				return _Utils_update(
					tile,
					{
						properties: A2($elm$core$List$cons, prop, tile.properties)
					});
			},
			A2($author$project$ProcGen$generateProperty, level, blockedColors));
	});
var $author$project$Crafting$basicReqMet = F2(
	function (scroll, state) {
		var hasScroll = A2(
			$elm$core$List$member,
			scroll,
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Basics$lt(0),
						$elm$core$Tuple$second),
					state.scrolls)));
		var hasOrbs = A2(
			$elm$core$List$all,
			function (orb) {
				return A2(
					$elm$core$List$member,
					orb,
					A2(
						$elm$core$List$map,
						$elm$core$Tuple$first,
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$lt(0),
								$elm$core$Tuple$second),
							state.orbs)));
			},
			state.selectedOrbs);
		var _v0 = state.tile;
		if (_v0.$ === 'Nothing') {
			return $elm$core$Result$Err(_Utils_Tuple0);
		} else {
			var tile = _v0.a;
			return (hasScroll && hasOrbs) ? $elm$core$Result$Ok(tile) : $elm$core$Result$Err(_Utils_Tuple0);
		}
	});
var $author$project$ProcGen$distillEssence = F3(
	function (state, blockedColors, tile) {
		var _v0 = tile.properties;
		_v0$2:
		while (true) {
			if (_v0.b) {
				if (!_v0.b.b) {
					var prop1 = _v0.a;
					return $elm$core$Maybe$Just(
						$elm$random$Random$constant(
							_Utils_Tuple3(
								_Utils_update(
									state,
									{nextEssenceId: state.nextEssenceId + 1}),
								_Utils_update(
									tile,
									{properties: _List_Nil}),
								{id: state.nextEssenceId, property: prop1})));
				} else {
					if (!_v0.b.b.b) {
						var prop1 = _v0.a;
						var _v1 = _v0.b;
						var prop2 = _v1.a;
						return $elm$core$Maybe$Just(
							function () {
								var prop2Chance = A2($elm$core$List$member, prop1.reqColor, blockedColors) ? 75 : 50;
								var prop1Chance = A2($elm$core$List$member, prop2.reqColor, blockedColors) ? 75 : 50;
								var distill = function (prop) {
									return _Utils_Tuple3(
										_Utils_update(
											state,
											{nextEssenceId: state.nextEssenceId + 1}),
										_Utils_update(
											tile,
											{properties: _List_Nil}),
										{id: state.nextEssenceId, property: prop});
								};
								return A2(
									$elm$random$Random$map,
									distill,
									A2(
										$elm$random$Random$weighted,
										_Utils_Tuple2(prop1Chance, prop1),
										_List_fromArray(
											[
												_Utils_Tuple2(prop2Chance, prop2)
											])));
							}());
					} else {
						break _v0$2;
					}
				}
			} else {
				break _v0$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Crafting$removeDragFromBench = F2(
	function (state, drag) {
		switch (drag.$) {
			case 'DragTile':
				return _Utils_update(
					state,
					{tile: $elm$core$Maybe$Nothing});
			case 'DragEssence':
				return _Utils_update(
					state,
					{selectedEssence: $elm$core$Maybe$Nothing});
			default:
				return state;
		}
	});
var $author$project$Crafting$removeMats = F2(
	function (scroll, state) {
		return _Utils_update(
			state,
			{
				orbs: A3(
					$elm_community$list_extra$List$Extra$updateIf,
					A2(
						$elm$core$Basics$composeL,
						function (orb) {
							return A2($elm$core$List$member, orb, state.selectedOrbs);
						},
						$elm$core$Tuple$first),
					$elm$core$Tuple$mapSecond(
						$elm$core$Basics$add(-1)),
					state.orbs),
				scrolls: A3(
					$elm_community$list_extra$List$Extra$updateIf,
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Basics$eq(scroll),
						$elm$core$Tuple$first),
					$elm$core$Tuple$mapSecond(
						$elm$core$Basics$add(-1)),
					state.scrolls)
			});
	});
var $author$project$ProcGen$rerollProperties = F3(
	function (level, blockedColors, tile) {
		return A2(
			$elm$random$Random$map,
			function (props) {
				return _Utils_update(
					tile,
					{properties: props});
			},
			A2($author$project$ProcGen$generateProperties, level, blockedColors));
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Crafting$showPercent = function (_float) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$floor(_float * 100)) + '%';
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Crafting$updateInfo = F2(
	function (state, level) {
		var showValueInfo = function (_v6) {
			var chance = _v6.a;
			var value = _v6.b;
			return A2(
				$elm$html$Html$li,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(value) + (' base: ' + $author$project$Crafting$showPercent(chance)))
					]));
		};
		var showPropNumInfo = function (_v5) {
			var chance = _v5.a;
			var value = _v5.b;
			var propString = (value === 1) ? ' property: ' : ' properties: ';
			return A2(
				$elm$html$Html$li,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						_Utils_ap(
							$elm$core$String$fromInt(value),
							_Utils_ap(
								propString,
								$author$project$Crafting$showPercent(chance))))
					]));
		};
		var newScrollInfo = function () {
			var _v0 = state.selectedScroll;
			if (_v0.$ === 'Just') {
				switch (_v0.a.$) {
					case 'Modification':
						var _v1 = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '50%')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Scroll info')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Rerolls the base value and the color of a tile. Colors corresponding to the selected orbs can not be rolled. Chances for the different base values are:')
										])),
									A2(
									$elm$html$Html$ul,
									_List_Nil,
									A2(
										$elm$core$List$map,
										showValueInfo,
										$author$project$ProcGen$calculateBaseValueChances(level)))
								]));
					case 'Augmentation':
						var _v2 = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '50%')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Scroll info')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Augments a tile that has less then two properties with a new property. Properties with requirement color corresponding to a selected orb can not be rolled.')
										]))
								]));
					case 'Alteration':
						var _v3 = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '50%')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Scroll info')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Rerolls the properties of a tile. Properties with requirement color corresponding to a selected orb can not be rolled. Chances for the different number of properties are:')
										])),
									A2(
									$elm$html$Html$ul,
									_List_Nil,
									A2(
										$elm$core$List$map,
										showPropNumInfo,
										$author$project$ProcGen$calculatePropertyNumberChances(level)))
								]));
					default:
						var _v4 = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '50%')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Scroll info')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Removes all properties from a tile with at least one property, and keeps one of them as an essence. If exactly one of the properties has requirement color corresponding to a selected orb, that property has a lower chance (40% instead of 50%) of beeing kept as an essence.')
										]))
								]));
				}
			} else {
				return A2($elm$html$Html$div, _List_Nil, _List_Nil);
			}
		}();
		return _Utils_update(
			state,
			{scrollInfo: newScrollInfo});
	});
var $author$project$Crafting$updateModel = F2(
	function (model, state) {
		return _Utils_update(
			model,
			{craftingTable: state});
	});
var $author$project$Crafting$update = F2(
	function (msg, model) {
		var craftingTable = model.craftingTable;
		switch (msg.$) {
			case 'ApplyScroll':
				var _v1 = model.craftingTable.selectedScroll;
				if (_v1.$ === 'Just') {
					switch (_v1.a.$) {
						case 'Modification':
							var _v2 = _v1.a;
							var _v3 = A2($author$project$Crafting$basicReqMet, $author$project$Items$Modification, model.craftingTable);
							if (_v3.$ === 'Ok') {
								var tile = _v3.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Crafting$updateModel,
										model,
										A2($author$project$Crafting$removeMats, $author$project$Items$Modification, model.craftingTable)),
									A2(
										$elm$random$Random$generate,
										$author$project$Crafting$TileGenerated,
										A3($author$project$ProcGen$generateBase, model.procGenState.level, model.craftingTable.selectedOrbs, tile)));
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						case 'Augmentation':
							var _v4 = _v1.a;
							var _v5 = A2($author$project$Crafting$basicReqMet, $author$project$Items$Augmentation, model.craftingTable);
							if (_v5.$ === 'Ok') {
								var tile = _v5.a;
								return ($elm$core$List$length(tile.properties) <= 1) ? _Utils_Tuple2(
									A2(
										$author$project$Crafting$updateModel,
										model,
										A2($author$project$Crafting$removeMats, $author$project$Items$Augmentation, model.craftingTable)),
									A2(
										$elm$random$Random$generate,
										$author$project$Crafting$TileGenerated,
										A3($author$project$ProcGen$addProperty, model.procGenState.level, model.craftingTable.selectedOrbs, tile))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						case 'Alteration':
							var _v6 = _v1.a;
							var _v7 = A2($author$project$Crafting$basicReqMet, $author$project$Items$Alteration, model.craftingTable);
							if (_v7.$ === 'Ok') {
								var tile = _v7.a;
								return _Utils_Tuple2(
									A2(
										$author$project$Crafting$updateModel,
										model,
										A2($author$project$Crafting$removeMats, $author$project$Items$Alteration, model.craftingTable)),
									A2(
										$elm$random$Random$generate,
										$author$project$Crafting$TileGenerated,
										A3($author$project$ProcGen$rerollProperties, model.procGenState.level, model.craftingTable.selectedOrbs, tile)));
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						default:
							var _v8 = _v1.a;
							var _v9 = A2($author$project$Crafting$basicReqMet, $author$project$Items$Distillation, model.craftingTable);
							if (_v9.$ === 'Ok') {
								var tile = _v9.a;
								return ($elm$core$List$length(tile.properties) > 0) ? _Utils_Tuple2(
									A2(
										$author$project$Crafting$updateModel,
										model,
										A2($author$project$Crafting$removeMats, $author$project$Items$Distillation, model.craftingTable)),
									A2(
										$elm$core$Maybe$withDefault,
										$elm$core$Platform$Cmd$none,
										A2(
											$elm$core$Maybe$map,
											$elm$random$Random$generate($author$project$Crafting$EssenceDistilled),
											A3($author$project$ProcGen$distillEssence, model.procGenState, model.craftingTable.selectedOrbs, tile)))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ApplyEssence':
				var _v10 = craftingTable.tile;
				if (_v10.$ === 'Just') {
					var tile = _v10.a;
					var _v11 = craftingTable.selectedEssence;
					if (_v11.$ === 'Just') {
						var essence = _v11.a;
						if (!$elm$core$List$length(tile.properties)) {
							var newTile = _Utils_update(
								tile,
								{
									properties: _List_fromArray(
										[essence.property])
								});
							return _Utils_Tuple2(
								A2(
									$author$project$Crafting$updateModel,
									model,
									_Utils_update(
										craftingTable,
										{
											selectedEssence: $elm$core$Maybe$Nothing,
											tile: $elm$core$Maybe$Just(newTile)
										})),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'TileGenerated':
				var tile = msg.a;
				return _Utils_Tuple2(
					A2(
						$author$project$Crafting$updateModel,
						model,
						_Utils_update(
							craftingTable,
							{
								tile: $elm$core$Maybe$Just(tile)
							})),
					$elm$core$Platform$Cmd$none);
			case 'EssenceDistilled':
				var _v12 = msg.a;
				var newRandState = _v12.a;
				var newTile = _v12.b;
				var newEssence = _v12.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							craftingTable: _Utils_update(
								craftingTable,
								{
									selectedEssence: $elm$core$Maybe$Just(newEssence),
									tile: $elm$core$Maybe$Just(newTile)
								}),
							procGenState: newRandState
						}),
					$elm$core$Platform$Cmd$none);
			case 'ScrollSelected':
				var scroll = msg.a;
				return _Utils_eq(
					$elm$core$Maybe$Just(scroll),
					model.craftingTable.selectedScroll) ? _Utils_Tuple2(
					A2(
						$author$project$Crafting$updateModel,
						model,
						A2(
							$author$project$Crafting$updateInfo,
							_Utils_update(
								craftingTable,
								{selectedScroll: $elm$core$Maybe$Nothing}),
							model.procGenState.level)),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					A2(
						$author$project$Crafting$updateModel,
						model,
						A2(
							$author$project$Crafting$updateInfo,
							_Utils_update(
								craftingTable,
								{
									selectedScroll: $elm$core$Maybe$Just(scroll)
								}),
							model.procGenState.level)),
					$elm$core$Platform$Cmd$none);
			case 'OrbSelected':
				var orb = msg.a;
				return A2($elm$core$List$member, orb, model.craftingTable.selectedOrbs) ? _Utils_Tuple2(
					A2(
						$author$project$Crafting$updateModel,
						model,
						A2(
							$author$project$Crafting$updateInfo,
							_Utils_update(
								craftingTable,
								{
									selectedOrbs: A2($elm_community$list_extra$List$Extra$remove, orb, model.craftingTable.selectedOrbs)
								}),
							model.procGenState.level)),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					A2(
						$author$project$Crafting$updateModel,
						model,
						A2(
							$author$project$Crafting$updateInfo,
							_Utils_update(
								craftingTable,
								{
									selectedOrbs: A2(
										$elm$core$List$take,
										2,
										A2($elm$core$List$cons, orb, model.craftingTable.selectedOrbs))
								}),
							model.procGenState.level)),
					$elm$core$Platform$Cmd$none);
			default:
				var dragMsg = msg.a;
				switch (dragMsg.$) {
					case 'DragFromBenchStart':
						var drag = dragMsg.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									craftingTable: A2($author$project$Crafting$removeDragFromBench, craftingTable, drag),
									dragedItem: drag
								}),
							$elm$core$Platform$Cmd$none);
					case 'DragDrop':
						var _v14 = model.dragedItem;
						switch (_v14.$) {
							case 'DragPiece':
								var piece = _v14.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											dragedItem: $author$project$Items$None,
											pieces: A2($elm$core$List$cons, piece, model.pieces)
										}),
									$elm$core$Platform$Cmd$none);
							case 'DragTile':
								var tile = _v14.a;
								if (_Utils_eq(craftingTable.tile, $elm$core$Maybe$Nothing)) {
									var droppedTile = _Utils_update(
										craftingTable,
										{
											tile: $elm$core$Maybe$Just(tile)
										});
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{craftingTable: droppedTile, dragedItem: $author$project$Items$None}),
										$elm$core$Platform$Cmd$none);
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												dragedItem: $author$project$Items$None,
												tiles: A2($elm$core$List$cons, tile, model.tiles)
											}),
										$elm$core$Platform$Cmd$none);
								}
							case 'DragEssence':
								var essence = _v14.a;
								if (_Utils_eq(craftingTable.selectedEssence, $elm$core$Maybe$Nothing)) {
									var droppedEssence = _Utils_update(
										craftingTable,
										{
											selectedEssence: $elm$core$Maybe$Just(essence)
										});
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{craftingTable: droppedEssence, dragedItem: $author$project$Items$None}),
										$elm$core$Platform$Cmd$none);
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												dragedItem: $author$project$Items$None,
												essences: A2($elm$core$List$cons, essence, model.essences)
											}),
										$elm$core$Platform$Cmd$none);
								}
							default:
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Game$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'DragMsg':
				var dragMsg = msg.a;
				return A2($author$project$Game$handleDragMsg, dragMsg, model);
			case 'KeyboardMsg':
				var key = msg.a;
				switch (key.$) {
					case 'RotateRight':
						var rotatedDrag = $author$project$Items$rotateDragRight(model.dragedItem);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									board: A2(
										$author$project$Board$highlightBoard,
										$author$project$Board$removeHighlight(model.board),
										rotatedDrag),
									dragedItem: rotatedDrag
								}),
							$elm$core$Platform$Cmd$none);
					case 'RotateLeft':
						var rotatedDrag = $author$project$Items$rotateDragLeft(model.dragedItem);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									board: A2(
										$author$project$Board$highlightBoard,
										$author$project$Board$removeHighlight(model.board),
										rotatedDrag),
									dragedItem: rotatedDrag
								}),
							$elm$core$Platform$Cmd$none);
					case 'ShiftDown':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showTileTooltip: true}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'KeyboardUpMsg':
				var key = msg.a;
				if (key.$ === 'ShiftUp') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{showTileTooltip: false}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'MousePosition':
				var x = msg.a;
				var y = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							mousePos: _Utils_Tuple2(x, y)
						}),
					$elm$core$Platform$Cmd$none);
			case 'NewBoard':
				var board = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{board: board}),
					$elm$core$Platform$Cmd$none);
			case 'NewPieceList':
				var _v3 = msg.a;
				var newState = _v3.a;
				var pieceList = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pieces: pieceList, procGenState: newState}),
					$elm$core$Platform$Cmd$none);
			case 'NewTileList':
				var _v4 = msg.a;
				var newState = _v4.a;
				var tileList = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{procGenState: newState, tiles: tileList}),
					$elm$core$Platform$Cmd$none);
			case 'CraftingMsg':
				var craftingMsg = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Game$CraftingMsg),
					A2($author$project$Crafting$update, craftingMsg, model));
			case 'NextLevel':
				return model.allReqMet ? _Utils_Tuple2(
					model,
					A2(
						$elm$random$Random$generate,
						$author$project$Game$RewardsGenerated,
						A2(
							$author$project$ProcGen$generateReward,
							$author$project$Board$countTotalReq(model.board),
							model.procGenState))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'RewardsGenerated':
				var _v5 = msg.a;
				var newState = _v5.a;
				var reward = _v5.b;
				var newProcGenState = _Utils_update(
					newState,
					{level: newState.level + 1});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							allReqMet: false,
							procGenState: newProcGenState,
							rewards: $elm$core$Maybe$Just(reward),
							tiles: _Utils_ap(
								$author$project$Board$gatherAllTiles(model.board),
								model.tiles)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								$elm$random$Random$generate,
								$author$project$Game$NewBoard,
								$author$project$ProcGen$generateBoard(newProcGenState.level)),
								A2(
								$elm$random$Random$generate,
								$author$project$Game$NewPieceList,
								$author$project$ProcGen$generatePieceList(newProcGenState))
							])));
			case 'RewardSelected':
				var tile = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							selectedReward: $elm$core$Maybe$Just(tile)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A3(
						$elm$core$Maybe$map2,
						F2(
							function (reward, tile) {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											craftingTable: A3($author$project$Crafting$addCraftingMats, model.craftingTable, reward.scrolls, reward.orbs),
											essences: _Utils_ap(reward.essences, model.essences),
											rewards: $elm$core$Maybe$Nothing,
											selectedReward: $elm$core$Maybe$Nothing,
											tiles: A2($elm$core$List$cons, tile, model.tiles)
										}),
									$elm$core$Platform$Cmd$none);
							}),
						model.rewards,
						model.selectedReward));
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GameMsg':
				var gameMsg = msg.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					$author$project$Game$update(gameMsg),
					model.gameState);
				if (_v1.$ === 'Just') {
					var _v2 = _v1.a;
					var newGameState = _v2.a;
					var cmdMsg = _v2.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								gameState: $elm$core$Maybe$Just(newGameState)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$GameMsg, cmdMsg));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'NewGame':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							gameState: $elm$core$Maybe$Just($author$project$Game$initModel)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($elm$core$Platform$Cmd$map, $author$project$Main$GameMsg, $author$project$Game$initMsg),
								A2($elm$browser$Browser$Navigation$pushUrl, model.key, 'game'),
								$author$project$Main$setStorage(
								$author$project$Main$encode(model))
							])));
			case 'Continue':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'UrlChanged':
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							route: $author$project$Main$toRoute(url),
							url: url
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var urlRequest = msg.a;
				if (urlRequest.$ === 'Internal') {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$elm$url$Url$toString(url)));
				} else {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Items$DragDrop = {$: 'DragDrop'};
var $author$project$Game$DragMsg = function (a) {
	return {$: 'DragMsg', a: a};
};
var $author$project$Game$NextLevel = {$: 'NextLevel'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Game$drawHeadline = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'height', '5vh'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Level: ' + $elm$core$String$fromInt(model.procGenState.level))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						model.allReqMet ? 'You can progress to the next level' : 'Some requeriments are not yet met')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Game$NextLevel)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Next Level')
					]))
			]));
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $author$project$Items$colorToString = function (color) {
	switch (color.$) {
		case 'Purple':
			return '#5f0f4f';
		case 'Green':
			return '#008148';
		case 'Yellow':
			return '#fed766';
		default:
			return '#f4743b';
	}
};
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Items$drawColorCircle = function (color) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 30 30'),
				$elm$svg$Svg$Attributes$style('height: 1.2em')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('15'),
						$elm$svg$Svg$Attributes$cy('15'),
						$elm$svg$Svg$Attributes$r('14'),
						$elm$svg$Svg$Attributes$fill(
						$author$project$Items$colorToString(color))
					]),
				_List_Nil)
			]));
};
var $author$project$Items$drawReq = F2(
	function (_v0, _v1) {
		var pointC = _v0.a;
		var pointI = _v0.b;
		var reqC = _v1.a;
		var reqI = _v1.b;
		return (!reqI) ? _List_Nil : _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(reqI) + ('/' + $elm$core$String$fromInt(pointI))),
						$author$project$Items$drawColorCircle(pointC)
					]))
			]);
	});
var $author$project$Items$drawPieceReq = function (piece) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				$elm$core$List$concat(
					A3($elm$core$List$map2, $author$project$Items$drawReq, piece.score, piece.req)))
			]));
};
var $author$project$Items$drawPieceTooltip = function (piece) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', 'yellow'),
				A2($elm$html$Html$Attributes$style, 'font-size', '1.4rem'),
				A2($elm$html$Html$Attributes$style, 'width', 'max-content')
			]),
		_List_fromArray(
			[
				$author$project$Items$drawPieceReq(piece)
			]));
};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Items$drawRegion = F2(
	function (region, color) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('0 0 30 30'),
					$elm$svg$Svg$Attributes$style('height: 1.2em')
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x('0'),
								$elm$svg$Svg$Attributes$y('0'),
								$elm$svg$Svg$Attributes$width('30'),
								$elm$svg$Svg$Attributes$height('30'),
								$elm$svg$Svg$Attributes$fill('grey')
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$rect,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x('10'),
								$elm$svg$Svg$Attributes$y('10'),
								$elm$svg$Svg$Attributes$width('10'),
								$elm$svg$Svg$Attributes$height('10'),
								$elm$svg$Svg$Attributes$fill('black')
							]),
						_List_Nil)
					]),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var x = _v0.a;
						var y = _v0.b;
						return A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromInt((10 * x) + 10)),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromInt((10 * y) + 10)),
									$elm$svg$Svg$Attributes$width('10'),
									$elm$svg$Svg$Attributes$height('10'),
									$elm$svg$Svg$Attributes$fill(
									$author$project$Items$colorToString(color))
								]),
							_List_Nil);
					},
					region)));
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Items$drawReqMet = function (isMet) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 30 30'),
				$elm$svg$Svg$Attributes$style('height: 0.8em')
			]),
		isMet ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M 6 19 L 14 24 L 26 4'),
						$elm$svg$Svg$Attributes$strokeWidth('8'),
						$elm$svg$Svg$Attributes$stroke('green'),
						$elm$svg$Svg$Attributes$fill('none')
					]),
				_List_Nil)
			]) : _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M 4 4 L 26 26 M 4 26 L 26 4'),
						$elm$svg$Svg$Attributes$strokeWidth('8'),
						$elm$svg$Svg$Attributes$stroke('red')
					]),
				_List_Nil)
			]));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Items$drawProperty = F2(
	function (showReqMet, pr) {
		return A2(
			$elm$html$Html$p,
			_List_Nil,
			_Utils_ap(
				(!showReqMet) ? _List_Nil : _List_fromArray(
					[
						$author$project$Items$drawReqMet(pr.isMet)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(pr.reqValue) + ' '),
						A2($author$project$Items$drawRegion, pr.region, pr.reqColor),
						$elm$html$Html$text(
						' ' + ($elm$core$String$fromFloat(pr.prodBonus) + ('x + ' + $elm$core$String$fromFloat(pr.addBonus))))
					])));
	});
var $author$project$Items$drawTileTooltip = function (tile) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', 'yellow'),
				A2($elm$html$Html$Attributes$style, 'font-size', '1.4rem'),
				A2($elm$html$Html$Attributes$style, 'width', 'max-content')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Base value: ' + $elm$core$String$fromInt(tile.baseValue))
						]))
				]),
			A2(
				$elm$core$List$map,
				function (pr) {
					return A2(
						$author$project$Items$drawProperty,
						!_Utils_eq(tile.drawPosition, $elm$core$Maybe$Nothing),
						pr);
				},
				tile.properties)));
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Game$drawTooltip = function (model) {
	return model.showTileTooltip ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'block'),
				A2(
				$elm$html$Html$Attributes$style,
				'left',
				$elm$core$String$fromInt(model.mousePos.a + 10) + 'px'),
				A2(
				$elm$html$Html$Attributes$style,
				'top',
				$elm$core$String$fromInt(model.mousePos.b + 10) + 'px'),
				A2($elm$html$Html$Attributes$style, 'position', 'absolute')
			]),
		_Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, $elm$core$List$singleton, $author$project$Items$drawTileTooltip),
					model.hoveredTile)),
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, $elm$core$List$singleton, $author$project$Items$drawPieceTooltip),
					model.hoveredPiece)))) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
};
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Items$DragFromHandStart = function (a) {
	return {$: 'DragFromHandStart', a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Items$drawEssenceIcon = function (essence) {
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('0 0 50 50'),
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$width('50'),
					$elm$svg$Svg$Attributes$height('50')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('black'),
							$elm$svg$Svg$Attributes$x('25'),
							$elm$svg$Svg$Attributes$y('25'),
							$elm$svg$Svg$Attributes$textAnchor('middle'),
							$elm$svg$Svg$Attributes$dominantBaseline('central'),
							$elm$svg$Svg$Attributes$style('font-size: 1.5em'),
							$elm$svg$Svg$Attributes$class('noselect'),
							$elm$svg$Svg$Attributes$fill(
							$author$project$Items$colorToString(essence.property.reqColor))
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text('E')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'yellow'),
					A2($elm$html$Html$Attributes$style, 'font-size', '1.4rem'),
					A2($elm$html$Html$Attributes$style, 'width', 'max-content'),
					$elm$html$Html$Attributes$class('tooltip')
				]),
			_List_fromArray(
				[
					A2($author$project$Items$drawProperty, false, essence.property)
				]))
		]);
};
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Items$drawEssence = F2(
	function (dragMsg, essence) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('tile'),
					$elm$html$Html$Events$onMouseDown(
					dragMsg(
						$author$project$Items$DragEssence(essence)))
				]),
			$author$project$Items$drawEssenceIcon(essence));
	});
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Items$drawPieceBorder = function (piece) {
	var rotate = piece.borderTransform.rotate;
	var _v0 = piece.borderTransform.translate;
	var transx = _v0.a;
	var transy = _v0.b;
	var drawPath = F2(
		function (_v3, path) {
			var startingX = _v3.a;
			var startingY = _v3.b;
			return A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M ' + ($elm$core$String$fromInt((startingX * 52) + 1) + (' ' + ($elm$core$String$fromInt((startingY * 52) + 1) + path)))),
						$elm$svg$Svg$Attributes$strokeWidth('2'),
						$elm$svg$Svg$Attributes$stroke('black'),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$transform(
						'translate(' + ($elm$core$String$fromInt(transx) + (', ' + ($elm$core$String$fromInt(transy) + (')' + ('rotate(' + ($elm$core$String$fromInt(rotate) + (',' + ($elm$core$String$fromInt((startingX * 52) + 27) + (',' + ($elm$core$String$fromInt((startingY * 52) + 27) + ')')))))))))))
					]),
				_List_Nil);
		});
	var draw = function (cord) {
		var _v2 = piece.shape;
		switch (_v2.$) {
			case 'Twoi':
				return A2(drawPath, cord, ' h 52 v 104 h -52 v -105');
			case 'Threel':
				return A2(drawPath, cord, ' v 52 h 104 v -52 h -52 v -52 h -52 v 52');
			case 'Threei':
				return A2(drawPath, cord, ' v 104 h 52 v -156 h -52 v 52');
			case 'Fouro':
				return A2(drawPath, cord, ' h 104 v 104 h -104 v -105');
			case 'Fourt':
				return A2(drawPath, cord, ' h 104 v 52 h -52 v 52 h -52 v -52 h -52 v -52 h 52');
			case 'Fours':
				return A2(drawPath, cord, ' h 104 v 52 h -52 v 52 h -104 v -52 h 52 v -53');
			case 'Fourz':
				return A2(drawPath, cord, ' h 52 v 52 h 52 v 52 h -104 v -52 h -52 v -52 h 52');
			case 'Fourl':
				return A2(drawPath, cord, ' v 104 h 104 v -52 h -52 v -104 h -52 v 52');
			default:
				return A2(drawPath, cord, ' v 104 h 52 v -104 h 52 v -52 h -104 v 52');
		}
	};
	var _v1 = piece.drawPosition;
	if (_v1.$ === 'Just') {
		var pos = _v1.a;
		return draw(pos);
	} else {
		return draw(
			_Utils_Tuple2(0, 0));
	}
};
var $author$project$Items$drawRect = F2(
	function (x, y) {
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromInt((52 * x) + 2)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromInt((52 * y) + 2)),
					$elm$svg$Svg$Attributes$width('50'),
					$elm$svg$Svg$Attributes$height('50'),
					$elm$svg$Svg$Attributes$fill('#ddb892')
				]),
			_List_Nil);
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Items$drawPieceIcon = F2(
	function (showTooltip, piece) {
		var vbtopy = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$second,
					$author$project$Items$shapeToIndexes(piece.shape))));
		var vbtopx = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$first,
					$author$project$Items$shapeToIndexes(piece.shape))));
		var vbwidth = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$first,
					$author$project$Items$shapeToIndexes(piece.shape)))) - vbtopx;
		var vbheight = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$second,
					$author$project$Items$shapeToIndexes(piece.shape)))) - vbtopy;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					$elm$html$Html$Attributes$class(
					showTooltip ? 'tile' : ''),
					$elm$html$Html$Events$onMouseDown(
					$author$project$Items$DragFromHandStart(
						$author$project$Items$DragPiece(piece)))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox(
							$elm$core$String$fromInt(52 * vbtopx) + (' ' + ($elm$core$String$fromInt(52 * vbtopy) + (' ' + ($elm$core$String$fromInt((52 * vbwidth) + 54) + (' ' + $elm$core$String$fromInt((52 * vbheight) + 54))))))),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt((vbwidth * 2) + 2) + 'em'),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromInt((vbheight * 2) + 2) + 'em'),
							$elm$svg$Svg$Attributes$style('margin-bottom: -4px')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								$author$project$Items$drawPieceBorder(piece)
							]),
						A2(
							$elm$core$List$map,
							function (_v0) {
								var x = _v0.a;
								var y = _v0.b;
								return A2($author$project$Items$drawRect, x, y);
							},
							$author$project$Items$shapeToIndexes(piece.shape)))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tooltip')
						]),
					_List_fromArray(
						[
							$author$project$Items$drawPieceTooltip(piece)
						]))
				]));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Items$drawTileIconSvg = function (tile) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 50 50'),
				$elm$svg$Svg$Attributes$x('0'),
				$elm$svg$Svg$Attributes$y('0'),
				$elm$svg$Svg$Attributes$width('50'),
				$elm$svg$Svg$Attributes$height('50'),
				A2($elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('0'),
						$elm$svg$Svg$Attributes$y('0'),
						$elm$svg$Svg$Attributes$width('50'),
						$elm$svg$Svg$Attributes$height('50'),
						$elm$svg$Svg$Attributes$fill(
						$author$project$Items$colorToString(tile.color))
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('black'),
						$elm$svg$Svg$Attributes$x('25'),
						$elm$svg$Svg$Attributes$y('25'),
						$elm$svg$Svg$Attributes$textAnchor('middle'),
						$elm$svg$Svg$Attributes$dominantBaseline('central'),
						$elm$svg$Svg$Attributes$style('font-size: 1.5em'),
						$elm$svg$Svg$Attributes$class('noselect')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						$elm$core$String$fromInt(tile.baseValue))
					]))
			]));
};
var $author$project$Items$drawTileIcon = F2(
	function (showTooltip, tile) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					$elm$html$Html$Attributes$class(
					showTooltip ? 'tile' : ''),
					$elm$html$Html$Events$onMouseDown(
					$author$project$Items$DragFromHandStart(
						$author$project$Items$DragTile(tile)))
				]),
			_List_fromArray(
				[
					$author$project$Items$drawTileIconSvg(tile),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tooltip')
						]),
					_List_fromArray(
						[
							$author$project$Items$drawTileTooltip(tile)
						]))
				]));
	});
var $author$project$Crafting$ApplyEssence = {$: 'ApplyEssence'};
var $author$project$Crafting$ApplyScroll = {$: 'ApplyScroll'};
var $author$project$Crafting$OrbSelected = function (a) {
	return {$: 'OrbSelected', a: a};
};
var $author$project$Crafting$viewOrbs = F2(
	function (orbs, selected) {
		var highlight = function (orb) {
			return A2($elm$core$List$member, orb, selected) ? A2($elm$html$Html$Attributes$style, 'border', '3px solid black') : A2($elm$html$Html$Attributes$style, 'border', 'none');
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var orb = _v0.a;
					var quant = _v0.b;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								highlight(orb),
								$elm$html$Html$Events$onClick(
								$author$project$Crafting$OrbSelected(orb))
							]),
						_List_fromArray(
							[
								$author$project$Items$drawColorCircle(orb),
								$elm$html$Html$text(
								': ' + $elm$core$String$fromInt(quant))
							]));
				},
				orbs));
	});
var $author$project$Crafting$ScrollSelected = function (a) {
	return {$: 'ScrollSelected', a: a};
};
var $author$project$Crafting$scrollToText = function (scroll) {
	switch (scroll.$) {
		case 'Modification':
			return 'Modification';
		case 'Augmentation':
			return 'Augmentation';
		case 'Alteration':
			return 'Alteration';
		default:
			return 'Distillation';
	}
};
var $author$project$Crafting$viewScrolls = F2(
	function (scrolls, selected) {
		var highlight = function (scrl) {
			return _Utils_eq(
				$elm$core$Maybe$Just(scrl),
				selected) ? A2($elm$html$Html$Attributes$style, 'border', '3px solid black') : A2($elm$html$Html$Attributes$style, 'border', 'none');
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var scrl = _v0.a;
					var quant = _v0.b;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								highlight(scrl),
								$elm$html$Html$Events$onClick(
								$author$project$Crafting$ScrollSelected(scrl))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Crafting$scrollToText(scrl) + (': ' + $elm$core$String$fromInt(quant)))
							]));
				},
				scrolls));
	});
var $author$project$Crafting$DragMsg = function (a) {
	return {$: 'DragMsg', a: a};
};
var $author$project$Items$DragFromBenchStart = function (a) {
	return {$: 'DragFromBenchStart', a: a};
};
var $author$project$Crafting$drawEssenceIcon = function (mEssence) {
	if (mEssence.$ === 'Just') {
		var essence = mEssence.a;
		return A2(
			$elm$html$Html$map,
			$author$project$Crafting$DragMsg,
			A2($author$project$Items$drawEssence, $author$project$Items$DragFromBenchStart, essence));
	} else {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $author$project$Crafting$drawTileIcon = function (mTile) {
	if (mTile.$ === 'Just') {
		var tile = mTile.a;
		return A2(
			$elm$html$Html$map,
			$author$project$Crafting$DragMsg,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Events$onMouseDown(
						$author$project$Items$DragFromBenchStart(
							$author$project$Items$DragTile(tile))),
						$elm$html$Html$Attributes$class('tile')
					]),
				_List_fromArray(
					[
						$author$project$Items$drawTileIconSvg(tile),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tooltip')
							]),
						_List_fromArray(
							[
								$author$project$Items$drawTileTooltip(tile)
							]))
					])));
	} else {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $author$project$Crafting$viewTileBench = F2(
	function (tile, essence) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
					A2($elm$html$Html$Attributes$style, 'width', '5vw'),
					A2($elm$html$Html$Attributes$style, 'min-width', 'max-content'),
					A2($elm$html$Html$Attributes$style, 'height', '8vw'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2(
					$elm$html$Html$Events$stopPropagationOn,
					'mouseup',
					$elm$json$Json$Decode$succeed(
						_Utils_Tuple2(
							$author$project$Crafting$DragMsg($author$project$Items$DragDrop),
							true)))
				]),
			_List_fromArray(
				[
					$author$project$Crafting$drawTileIcon(tile),
					$author$project$Crafting$drawEssenceIcon(essence)
				]));
	});
var $author$project$Crafting$viewCraftingTable = function (state) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Crafting$ApplyScroll)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Apply Scroll')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Crafting$ApplyEssence)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Apply Essence')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'gap', '5px')
					]),
				_List_fromArray(
					[
						A2($author$project$Crafting$viewTileBench, state.tile, state.selectedEssence),
						A2($author$project$Crafting$viewScrolls, state.scrolls, state.selectedScroll),
						A2($author$project$Crafting$viewOrbs, state.orbs, state.selectedOrbs),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
								A2($elm$html$Html$Attributes$style, 'width', '60%')
							]),
						_List_fromArray(
							[state.scrollInfo]))
					]))
			]));
};
var $author$project$Game$viewLeftPane = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'border', '0.8em double black'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
				A2($elm$html$Html$Attributes$style, 'width', '45vw'),
				A2($elm$html$Html$Attributes$style, 'margin', '1vw')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', '6.5em'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'gap', '5px')
					]),
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$elm$html$Html$map($author$project$Game$DragMsg),
						$author$project$Items$drawPieceIcon(
							_Utils_eq(model.dragedItem, $author$project$Items$None))),
					model.pieces)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'gap', '5px'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
					]),
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$elm$html$Html$map($author$project$Game$DragMsg),
						$author$project$Items$drawTileIcon(
							_Utils_eq(model.dragedItem, $author$project$Items$None))),
					model.tiles)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'gap', '5px'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
					]),
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$elm$html$Html$map($author$project$Game$DragMsg),
						$author$project$Items$drawEssence($author$project$Items$DragFromHandStart)),
					model.essences)),
				A2(
				$elm$html$Html$map,
				$author$project$Game$CraftingMsg,
				$author$project$Crafting$viewCraftingTable(model.craftingTable))
			]));
};
var $author$project$Game$RewardConfirmed = {$: 'RewardConfirmed'};
var $author$project$Game$RewardSelected = function (a) {
	return {$: 'RewardSelected', a: a};
};
var $author$project$Game$drawTileIconReward = F2(
	function (selectedTile, tile) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					$elm$html$Html$Attributes$class('tile'),
					$elm$html$Html$Events$onClick(
					$author$project$Game$RewardSelected(tile)),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					_Utils_eq(
						$elm$core$Maybe$Just(tile),
						selectedTile) ? '2px solid black' : 'none')
				]),
			_List_fromArray(
				[
					$author$project$Items$drawTileIconSvg(tile),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tooltip')
						]),
					_List_fromArray(
						[
							$author$project$Items$drawTileTooltip(tile)
						]))
				]));
	});
var $author$project$Game$viewRewards = function (model) {
	var _v0 = model.rewards;
	if (_v0.$ === 'Just') {
		var rewards = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '50%'),
					A2($elm$html$Html$Attributes$style, 'left', '50%'),
					A2($elm$html$Html$Attributes$style, 'z-index', '10'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'grey'),
					A2($elm$html$Html$Attributes$style, 'transform', 'translate(-50%, -50%)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$map,
						$author$project$Game$drawTileIconReward(model.selectedReward),
						rewards.tiles)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex')
						]),
					A2(
						$elm$core$List$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Items$drawEssenceIcon,
							$elm$html$Html$div(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('tile')
									]))),
						rewards.essences)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex')
						]),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var scrl = _v1.a;
							var quant = _v1.b;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Crafting$scrollToText(scrl) + (': ' + $elm$core$String$fromInt(quant)))
									]));
						},
						rewards.scrolls)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex')
						]),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var orb = _v2.a;
							var quant = _v2.b;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Items$drawColorCircle(orb),
										$elm$html$Html$text(
										': ' + $elm$core$String$fromInt(quant))
									]));
						},
						rewards.orbs)),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Game$RewardConfirmed)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Confirm')
						]))
				]));
	} else {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $author$project$Items$DragFromBoardStart = function (a) {
	return {$: 'DragFromBoardStart', a: a};
};
var $author$project$Items$DragLeave = {$: 'DragLeave'};
var $author$project$Items$DragOverField = function (a) {
	return {$: 'DragOverField', a: a};
};
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $author$project$Board$drawHighlight = function (highlight) {
	return highlight ? _List_fromArray(
		[
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$width('50'),
					$elm$svg$Svg$Attributes$height('50'),
					$elm$svg$Svg$Attributes$fill('blue'),
					$elm$svg$Svg$Attributes$opacity('0.2')
				]),
			_List_Nil)
		]) : _List_Nil;
};
var $author$project$Board$drawFieldRect = F4(
	function (_v0, highlight, rectAtr, groupAtr) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$viewBox('0 0 50 50'),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromInt((xIndex * 52) + 2)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromInt((yIndex * 52) + 2)),
						$elm$svg$Svg$Attributes$width('50'),
						$elm$svg$Svg$Attributes$height('50')
					]),
				groupAtr),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('0'),
									$elm$svg$Svg$Attributes$y('0'),
									$elm$svg$Svg$Attributes$width('50'),
									$elm$svg$Svg$Attributes$height('50')
								]),
							rectAtr),
						_List_Nil)
					]),
				$author$project$Board$drawHighlight(highlight)));
	});
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Board$drawTile = F4(
	function (_v0, pieceId, tile, highlight) {
		var xIndex = _v0.a;
		var yIndex = _v0.b;
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('0 0 50 50'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromInt((xIndex * 52) + 2)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromInt((yIndex * 52) + 2)),
					$elm$svg$Svg$Attributes$width('50'),
					$elm$svg$Svg$Attributes$height('50'),
					$elm$html$Html$Events$onMouseEnter(
					$author$project$Items$DragOverField(
						_Utils_Tuple2(xIndex, yIndex))),
					$elm$html$Html$Events$onMouseLeave($author$project$Items$DragLeave),
					$elm$html$Html$Events$onMouseDown(
					$author$project$Items$DragFromBoardStart(
						_Utils_Tuple2(xIndex, yIndex)))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x('0'),
								$elm$svg$Svg$Attributes$y('0'),
								$elm$svg$Svg$Attributes$width('50'),
								$elm$svg$Svg$Attributes$height('50'),
								$elm$svg$Svg$Attributes$fill(
								$author$project$Items$colorToString(tile.color))
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$fill('black'),
								$elm$svg$Svg$Attributes$x('25'),
								$elm$svg$Svg$Attributes$y('25'),
								$elm$svg$Svg$Attributes$textAnchor('middle'),
								$elm$svg$Svg$Attributes$dominantBaseline('central'),
								$elm$svg$Svg$Attributes$style('font-size: 1.5em'),
								$elm$svg$Svg$Attributes$class('noselect')
							]),
						_List_fromArray(
							[
								$elm$svg$Svg$text(
								$elm$core$String$fromInt(tile.currentValue))
							]))
					]),
				$author$project$Board$drawHighlight(highlight)));
	});
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Board$drawField = F2(
	function (index, field) {
		switch (field.$) {
			case 'NonTile':
				var highlight = field.a;
				return A4(
					$author$project$Board$drawFieldRect,
					index,
					highlight,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('#e5e5e5')
						]),
					_List_fromArray(
						[
							$elm$html$Html$Events$onMouseOver(
							$author$project$Items$DragOverField(index)),
							$elm$html$Html$Events$onMouseLeave($author$project$Items$DragLeave)
						]));
			case 'Empty':
				var pieceId = field.a;
				var highlight = field.b;
				return A4(
					$author$project$Board$drawFieldRect,
					index,
					highlight,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('#ddb892')
						]),
					_List_fromArray(
						[
							$elm$html$Html$Events$onMouseOver(
							$author$project$Items$DragOverField(index)),
							$elm$html$Html$Events$onMouseLeave($author$project$Items$DragLeave),
							$elm$html$Html$Events$onMouseDown(
							$author$project$Items$DragFromBoardStart(index))
						]));
			case 'Wall':
				var highlight = field.a;
				return A4(
					$author$project$Board$drawFieldRect,
					index,
					highlight,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('grey')
						]),
					_List_Nil);
			default:
				var pieceId = field.a;
				var tile = field.b;
				var highlight = field.c;
				return A4($author$project$Board$drawTile, index, pieceId, tile, highlight);
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2($elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Board$indexedMap = F2(
	function (f, board) {
		return A2(
			$elm$core$Array$indexedMap,
			function (col) {
				return $elm$core$Array$indexedMap(
					function (row) {
						return f(
							_Utils_Tuple2(row, col));
					});
			},
			board);
	});
var $author$project$Board$drawBoard = function (board) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 210 210')
			]),
		_Utils_ap(
			A2($elm$core$List$map, $author$project$Items$drawPieceBorder, board.pieces),
			A2($elm$core$Basics$composeL, $elm$core$List$concat, $author$project$Board$toList)(
				A2($author$project$Board$indexedMap, $author$project$Board$drawField, board.tiles))));
};
var $author$project$Board$drawColReq = F2(
	function (board, index) {
		var _v0 = A2($elm$core$Dict$get, index, board.colReqs);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var reqs = _v1.a;
			var scores = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'grid-column',
						$elm$core$String$fromInt(index + 2)),
						A2($elm$html$Html$Attributes$style, 'grid-row', '1'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'font-size', '1.8vw'),
						$elm$html$Html$Attributes$class('noselect')
					]),
				$elm$core$List$concat(
					A3($elm$core$List$map2, $author$project$Items$drawReq, scores, reqs)));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'grid-column',
						$elm$core$String$fromInt(index + 2)),
						A2($elm$html$Html$Attributes$style, 'grid-row', '1')
					]),
				_List_Nil);
		}
	});
var $author$project$Board$drawRowReq = F2(
	function (board, index) {
		var _v0 = A2($elm$core$Dict$get, index, board.rowReqs);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var reqs = _v1.a;
			var scores = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'grid-column', '1'),
						A2(
						$elm$html$Html$Attributes$style,
						'grid-row',
						$elm$core$String$fromInt(index + 2)),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'font-size', '1.8vw'),
						$elm$html$Html$Attributes$class('noselect')
					]),
				$elm$core$List$concat(
					A3($elm$core$List$map2, $author$project$Items$drawReq, scores, reqs)));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'grid-column', '1'),
						A2(
						$elm$html$Html$Attributes$style,
						'grid-row',
						$elm$core$String$fromInt(index + 2))
					]),
				_List_Nil);
		}
	});
var $author$project$Game$viewRightPane = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'justify-self', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-self', 'center'),
				A2($elm$html$Html$Attributes$style, 'display', 'grid'),
				A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 2fr 2fr 2fr 2fr'),
				A2($elm$html$Html$Attributes$style, 'grid-template-rows', '2fr 2fr 2fr 2fr 2fr'),
				A2($elm$html$Html$Attributes$style, 'grid-gap', '0.38vw'),
				A2($elm$html$Html$Attributes$style, 'justify-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'width', '45vw'),
				A2($elm$html$Html$Attributes$style, 'height', '50vw')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '40vw'),
							A2($elm$html$Html$Attributes$style, 'grid-row', '2 / 6'),
							A2($elm$html$Html$Attributes$style, 'grid-column', '2 / 6')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$map,
							$author$project$Game$DragMsg,
							$author$project$Board$drawBoard(model.board))
						]))
				]),
			_Utils_ap(
				A2(
					$elm$core$List$map,
					$author$project$Board$drawRowReq(model.board),
					_List_fromArray(
						[0, 1, 2, 3])),
				A2(
					$elm$core$List$map,
					$author$project$Board$drawColReq(model.board),
					_List_fromArray(
						[0, 1, 2, 3])))));
};
var $author$project$Game$viewGame = function (model) {
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'height', '100vh'),
					A2($elm$html$Html$Attributes$style, 'width', '100vw'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
					A2($elm$html$Html$Attributes$style, 'position', 'relative')
				]),
			_Utils_eq(model.dragedItem, $author$project$Items$None) ? _List_Nil : _List_fromArray(
				[
					$elm$html$Html$Events$onMouseUp(
					$author$project$Game$DragMsg($author$project$Items$DragDrop))
				])),
		_List_fromArray(
			[
				$author$project$Game$viewRewards(model),
				$author$project$Game$drawHeadline(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'grid'),
						A2($elm$html$Html$Attributes$style, 'grid-template-columns', '3fr 4fr'),
						A2($elm$html$Html$Attributes$style, 'grid-gap', '10px'),
						A2($elm$html$Html$Attributes$style, 'align-content', 'center')
					]),
				_List_fromArray(
					[
						$author$project$Game$viewLeftPane(model),
						$author$project$Game$viewRightPane(model)
					])),
				$author$project$Game$drawTooltip(model)
			]));
};
var $author$project$Main$viewHowTo = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('How to page coming soon!')
			]));
};
var $author$project$Main$Continue = {$: 'Continue'};
var $author$project$Main$NewGame = {$: 'NewGame'};
var $author$project$Main$viewMainMenu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Main menu')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$NewGame)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('New Game')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$Continue)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Continoue Previous Game')
					]))
			]));
};
var $author$project$Main$viewNotFound = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('Page not found')
			]));
};
var $author$project$Main$view = function (model) {
	return {
		body: function () {
			var _v0 = model.route;
			switch (_v0.$) {
				case 'Game':
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$map,
							$author$project$Main$GameMsg,
							$author$project$Game$viewGame(
								A2($elm$core$Maybe$withDefault, $author$project$Game$initModel, model.gameState)))
						]);
				case 'HowTo':
					return _List_fromArray(
						[
							$author$project$Main$viewHowTo(model)
						]);
				case 'MainMenu':
					return _List_fromArray(
						[
							$author$project$Main$viewMainMenu(model)
						]);
				default:
					return _List_fromArray(
						[
							$author$project$Main$viewNotFound(model)
						]);
			}
		}(),
		title: 'Greg Puzzle'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$UrlRequested, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));