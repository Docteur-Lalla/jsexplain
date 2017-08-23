
/* --------------------- ../generator/stdlib_ml/stdlib.js --------------------- */

// JS implementations for OCaml's Pervasives library
// See stdlib.mli for documentation

// Infix operators are converted to equivalent JS in
//   js_of_ast.ml#js_of_path_longident

//----------------------------------------------------------------------------
// Js_of_ocaml bis Generator Requirements

// type option 'a = None | Some of 'a
var None = function() {
   return { /*type: "option",*/ tag: "None" };
};

var Some = function(value) {
   return { /*type: "option",*/ tag: "Some", value: value };
};

// type list 'a = [] | :: of 'a * list 'a
var mk_nil = function() {
   return { /*type: "list",*/ tag: "[]" };
};

var mk_cons = function(head, tail) {
   return { /*type: "list",*/ tag: "::", head: head, tail: tail };
};

//----------------------------------------------------------------------------
// Exceptions

// val raise : exn -> 'a
var raise = function(x) { throw "Not_found"; };

//----------------------------------------------------------------------------
// Boolean operations

// val not : bool -> bool
var not = function(x) { return !x; };

// val ( && ) : bool -> bool -> bool
// val ( || ) : bool -> bool -> bool
// Operators mapped directly to JS equivalent

//----------------------------------------------------------------------------
// Deugging

// val __LOC__ : string
var __LOC__ = "___LOC___"

//----------------------------------------------------------------------------
// Integer Arithmetic

// val ( + ) : int -> int -> int
// val ( - ) : int -> int -> int
// val ( * ) : int -> int -> int
// val ( / ) : int -> int -> int
// Operators mapped directly to JS equivalent

var min = function(a, b) {
  if(a < b)
    return a;
  else
    return b;
}

var sqrt = Math.sqrt;
var exp = Math.exp;
var log = Math.log;
var log10 = Math.log10;
var expm1 = Math.expm1;
var log1p = Math.log1p;
var cos = Math.cos;
var sin = Math.sin;
var tan = Math.tan;
var acos = Math.acos;
var asin = Math.asin;
var atan = Math.atan;
var cosh = Math.cosh;
var sinh = Math.sinh;
var tanh = Math.tanh;
var ceil = Math.ceil;
var floor = Math.floor;

//----------------------------------------------------------------------------
// Floating-point Arithmetic

// val ( +. ) : float -> float -> float
// val ( -. ) : float -> float -> float
// val ( *. ) : float -> float -> float
// val ( /. ) : float -> float -> float
// Operators mapped to JS equivalent by removing .

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

// Pervasives-incompatible functions

// Infix operators are converted to equivalent JS in
//   js_of_ast.ml#js_of_path_longident

//----------------------------------------------------------------------------
// Comparisons

// val ( = ) : float -> float -> bool
// Mapped to ==

// val ( < ) : float -> float -> bool
// val ( > ) : float -> float -> bool
// val ( <= ) : float -> float -> bool
// val ( >= ) : float -> float -> bool
// Operators mapped directly to JS equivalent

/*
// val compare : 'a -> 'a -> int
// val min : float -> float -> float
// val max : float -> float -> float
*/

// val ( === ) : 'a -> 'a -> bool

/*
// val float_compare : float -> float -> int
*/

// val int_eq : int -> int -> bool
var int_eq = function(x, y) { return x === y; };

// val int_lt : int -> int -> bool
var int_lt = function(x, y) { return x < y; };

// val int_gt : int -> int -> bool
var int_gt = function(x, y) { return x > y; };

// val int_le : int -> int -> bool
var int_le = function(x, y) { return x <= y; };

// val int_ge : int -> int -> bool
var int_ge = function(x, y) { return x >= y; };

// val int_compare : int -> int -> int
var int_compare = function(x, y) { return x - y; };

// val bool_eq : bool -> bool -> bool
var bool_eq = function(x, y) { return x === y; };

// val nat_eq : int -> int -> bool (* nat_eq x y = int_eq x y  *)
var nat_eq = function(x, y) { return x === y; };

// val string_eq : string -> string -> bool (* === *)
var string_eq = function(x, y) {
  if (typeof(x) != "string" || typeof(y) != "string")
    throw "string_eq invalid arguments";
  return x === y;
};

// val string_lt : string -> string -> bool
var string_lt = function(x, y) {
  if (typeof(x) != "string" || typeof(y) != "string")
    throw "string_lt invalid arguments";
  return x < y;
};

// val string_compare : string -> string -> int
var string_compare = function(x, y) {
  return x.localeCompare(y);
};

//----------------------------------------------------------------------------
// Floating-point arithmetic

/* Functions renamed:
// val fmod : float -> float -> float (*  mod_float, implemented as % operator in JS *)
// val float_neg : float -> float          (* ~-. *)
// val float_exp : float -> float -> float (* exp *)
*/

// Alan: Ideally we would add these to the spec, but for the moment conversion
// to a string is doing a foo+"", and conversion to an int is doing +foo
// val int_of_number : float -> int (* will be removed, since only used by substring *)
var int_of_number = function(x) { return x; };

// val number_of_int : int -> float  (* = fun x -> float_of_int x *)
var number_of_int = function(x) { return x; };

//----------------------------------------------------------------------------
// String operations

// val string_concat : string -> string -> string (* + *)

// val strappend : string -> string -> string
var strappend = function(x, y) {
  if (typeof(x) != "string" || typeof(y) != "string")
    throw "strappend invalid arguments";
  return x + y;
};

// val strlength : string -> int
var strlength = function(x) {
  if (typeof(x) != "string")
    throw "strlength invalid arguments";
  return x.length;
};

// val substring : int -> int -> string -> string
var substring = function(n, m, s) {
  if (typeof(s) != "string")
    throw "strlength invalid arguments";
  return s.slice(n, n+m);
};

var normalize_string = function(s) {
  return s.toString();
}

var array_append = function(a, b) {
  if (typeof(a) != "object" || typeof(b) != "object")
    throw "array_length invalid arguments";
  return a.concat(b);
}

var array_fold = function(f, acc, ary) {
  if (typeof(f) != "function" || typeof(ary) != "object")
    throw "array_fold invalid arguments";

  var a = acc;
  for(var i = 0; i < ary.length; i++)
    a = f(a, ary[i]);
  return a;
}

var array_get = function(ary, i) {
  if (typeof(ary) != "object" || typeof(i) != "number")
    throw "array_get invalid arguments";
  return ary[i];
}

var array_length = function(ary) {
  if (typeof(ary) != "object")
    throw "array_length invalid arguments";
  return ary.length;
}

var array_make = function(i, v) {
  if (typeof(i) != "number")
    throw "array_length invalid arguments";
  var ary = [];
  for(var x = 0; x < i; x++)
    ary = ary.concat([v]);
  return ary;
}

var array_map = function(f, ary) {
  if (typeof(f) != "function" || typeof(ary) != "object")
    throw "array_map invalid arguments";
  var n_ary = ary.slice();
  for(var i = 0; i < ary.length; i++)
    n_ary[i] = f(ary[i]);
  return n_ary;
}

var array_set = function(ary, i, v) {
  if (typeof(ary) != "object" || typeof(i) != "number")
    throw "array_get invalid arguments";
  ary[i] = v;
}

/* --------------------- Option.unlog.js --------------------- */

var Option = (function() {

var bind = function (opt, f) {
  switch (opt.tag) {
    case "Some":
      var v = opt.value;
      return (f(v));
    case "None":
      return (None());
  }
  
};

var map = function (f, opt) {
  switch (opt.tag) {
    case "Some":
      var v = opt.value;
      return (Some(f(v)));
    case "None":
      return (None());
  }
  
};

var eq = function (func, o1, o2) {
  switch (o1.tag) {
    case "None":
      switch (o2.tag) {
        case "None":
          return (true);
        case "Some":
          return (false);
      }
      
    case "Some":
      var v1 = o1.value;
      switch (o2.tag) {
        case "None":
          return (false);
        case "Some":
          var v2 = o2.value;
          return (func(v1, v2));
      }
      
  }
  
};

return {
  bind: bind, 
  map: map, 
  eq: eq};
})();

/* --------------------- Unsafe.unlog.js --------------------- */

var Unsafe = (function() {

function Error(error) { return {tag: "Error", error: error}; }

function Exception(except) { return {tag: "Exception", except: except}; }

function Result(result) { return {tag: "Result", result: result}; }



var of_option = function (_fun_arg_) {
  switch (_fun_arg_.tag) {
    case "None":
      return (Error("Unknown error"));
    case "Some":
      var v = _fun_arg_.value;
      return (Result(v));
  }
  
};

var eq = function (feq1, feq2, a, b) {
  switch (a.tag) {
    case "Error":
      var e1 = a.error;
      switch (b.tag) {
        case "Error":
          var e2 = b.error;
          return ((e1 === e2));
        default:
          return (false);
      }
      
    case "Exception":
      var e1 = a.except;
      switch (b.tag) {
        case "Exception":
          var e2 = b.except;
          return (feq1(e1, e2));
        default:
          return (false);
      }
      
    case "Result":
      var r1 = a.result;
      switch (b.tag) {
        case "Result":
          var r2 = b.result;
          return (feq2(r1, r2));
        default:
          return (false);
      }
      
  }
  
};

var bind = function (nsf, f) {
  switch (nsf.tag) {
    case "Error":
      var s = nsf.error;
      return (Error(s));
    case "Exception":
      var x = nsf.except;
      return (Exception(x));
    case "Result":
      var r = nsf.result;
      return (f(r));
  }
  
};

var error = function (s) {
  return (Error(s));
};

var except = function (x) {
  return (Exception(x));
};

var box = function (v) {
  return (Result(v));
};

var do_with_default = function (nsf, dflt, f) {
  switch (nsf.tag) {
    case "Error":
      return (dflt);
    case "Exception":
      return (dflt);
    case "Result":
      var r = nsf.result;
      return (f(r));
  }
  
};

return {
  Error: Error, 
  Exception: Exception, 
  Result: Result, 
  of_option: of_option, 
  eq: eq, 
  bind: bind, 
  error: error, 
  except: except, 
  box: box, 
  do_with_default: do_with_default};
})();

/* --------------------- MLList.unlog.js --------------------- */

var MLList = (function() {

var rev = function (lst) {
  var aux = function (acc, lst) {
    switch (lst.tag) {
      case "[]":
        return (acc);
      case "::":
        var h = lst.head, t = lst.tail;
        return (aux(mk_cons(h, acc), t));
    }
    
  };
  return (aux(mk_nil(), lst));
};

var of_array = function (ary) {
  var len = array_length(ary);
  var for_loop = function (acc, i) {
    if ((i === -1)) {
      return (acc);
    } else {
      return (for_loop(mk_cons(array_get(ary, i), acc), (i - 1)));
    }
  };
  return (for_loop(mk_nil(), (len - 1)));
};

var map = function (f, lst) {
  var aux = function (acc, lst) {
    switch (lst.tag) {
      case "[]":
        return (rev(acc));
      case "::":
        var h = lst.head, t = lst.tail;
        return (aux(mk_cons(f(h), acc), t));
    }
    
  };
  return (aux(mk_nil(), lst));
};

var foldl = function (f, first, rest) {
  switch (rest.tag) {
    case "[]":
      return (first);
    case "::":
      var h = rest.head, t = rest.tail;
      return (foldl(f, f(first, h), t));
  }
  
};

var foldr = function (f, first, rest) {
  switch (rest.tag) {
    case "[]":
      return (first);
    case "::":
      var h = rest.head, t = rest.tail;
      return (f(h, foldr(f, first, t)));
  }
  
};

var foldl2 = function (f, first, rest1, rest2) {
  switch (rest1.tag) {
    case "[]":
      return (first);
    case "::":
      var h1 = rest1.head, t1 = rest1.tail;
      switch (rest2.tag) {
        case "[]":
          return (first);
        case "::":
          var h2 = rest2.head, t2 = rest2.tail;
          return (foldl2(f, f(first, h1, h2), t1, t2));
      }
      
  }
  
};

var for_all = function (pred, lst) {
  return (foldl(function (b, e) { return ((b && pred(e)));}, true, lst));
};

var length = function (lst) {
  var aux = function (acc, lst) {
    switch (lst.tag) {
      case "[]":
        return (acc);
      case "::":
        var h = lst.head, t = lst.tail;
        return (aux((acc + 1), t));
    }
    
  };
  return (aux(0, lst));
};

var zipwith = function (f, l1, l2) {
  switch (l1.tag) {
    case "[]":
      return (mk_nil());
    case "::":
      var h1 = l1.head, t1 = l1.tail;
      switch (l2.tag) {
        case "[]":
          return (mk_nil());
        case "::":
          var h2 = l2.head, t2 = l2.tail;
          return (mk_cons(f(h1, h2), zipwith(f, t1, t2)));
      }
      
  }
  
};

var all_true = function (lst) {
  switch (lst.tag) {
    case "[]":
      return (true);
    case "::":
      var h = lst.head, t = lst.tail;
      return ((h && all_true(t)));
  }
  
};

var any = function (pred, v, lst) {
  switch (lst.tag) {
    case "[]":
      return (false);
    case "::":
      var h = lst.head, t = lst.tail;
      return ((pred(h, v) || any(pred, v, t)));
  }
  
};

var concat = function (l1, l2) {
  var rl1 = rev(l1);
  var func = function (lst, a) {
    return (mk_cons(a, lst));
  };
  return (foldl(func, l2, rl1));
};

return {
  rev: rev, 
  of_array: of_array, 
  map: map, 
  foldl: foldl, 
  foldr: foldr, 
  foldl2: foldl2, 
  for_all: for_all, 
  length: length, 
  zipwith: zipwith, 
  all_true: all_true, 
  any: any, 
  concat: concat};
})();

/* --------------------- MLArray.unlog.js --------------------- */

var MLArray = (function() {

var append = array_append;

var fold = array_fold;

var get = array_get;

var length = array_length;

var make = array_make;

var map = array_map;

var set = array_set;

var all_true = function (ary) {
  var f = function (cur, b) {
    return ((cur && b));
  };
  return (array_fold(f, true, ary));
};

var zipwith = function (f, a1, a2) {
  var len_a1 = length(a1);
  var len_a2 = length(a2);
  var min_size = min(len_a1, len_a2);
  var res = make(min_size, f(get(a1, 0), get(a2, 0)));
  var for_loop = function (i) {
    if ((number_of_int(i) < number_of_int(min_size))) {
      var res_f = f(get(a1, i), get(a2, i));
      set(res, i, res_f);
      return (for_loop((i + 1)));
    } else {
      return (res);
    }
  };
  return (for_loop(1));
};

var sequence_option = function (ary) {
  var f = function (ary_opt, opt) {
    return (
      Option.bind(ary_opt, function (ary) {
          return (
            Option.bind(opt, function (v) {
                return (Some(append(ary, make(1, v))));}));}));
  };
  return (fold(f, Some([]), ary));
};

var sequence_unsafe = function (ary) {
  var f = function (ary_nsf, nsf) {
    return (
      Unsafe.bind(ary_nsf, function (ary) {
          return (
            Unsafe.bind(nsf, function (v) {
                return (Unsafe.box(append(ary, make(1, v))));}));}));
  };
  return (fold(f, Unsafe.box([]), ary));
};

return {
  append: append, 
  fold: fold, 
  get: get, 
  length: length, 
  make: make, 
  map: map, 
  set: set, 
  all_true: all_true, 
  zipwith: zipwith, 
  sequence_option: sequence_option, 
  sequence_unsafe: sequence_unsafe};
})();

/* --------------------- Set.unlog.js --------------------- */

var Set = (function() {

var empty_set = function (eq) {
  return ({ eq: eq,
            values: mk_nil()});
};

var mem = function (value, set) {
  var _switch_arg_1 = set.values;
  switch (_switch_arg_1.tag) {
    case "[]":
      return (false);
    case "::":
      var h = _switch_arg_1.head, t = _switch_arg_1.tail;
      var set$ = Object.assign({}, set, { values: t});
      return ((set.eq(h, value) || mem(value, set$)));
  }
  
};

var add = function (value, set) {
  if (mem(value, set)) {
    return (set);
  } else {
    return (Object.assign({}, set, { values: mk_cons(value, set.values)}));
  }
};

var union = function (set1, set2) {
  var _switch_arg_2 = set1.values;
  switch (_switch_arg_2.tag) {
    case "[]":
      return (set2);
    case "::":
      var h = _switch_arg_2.head, t = _switch_arg_2.tail;
      var set1$ = Object.assign({}, set1, { values: t});
      var set2$ = add(h, set2);
      return (union(set1$, set2$));
  }
  
};

var sub = function (set1, set2) {
  var sub_elem = function (set, e) {
    var _switch_arg_3 = set.values;
    switch (_switch_arg_3.tag) {
      case "[]":
        return (set);
      case "::":
        var h = _switch_arg_3.head, t = _switch_arg_3.tail;
        if (set.eq(h, e)) {
          return (Object.assign({}, set, { values: t}));
        } else {
          var set$ = sub_elem(Object.assign({}, set, { values: t}), e);
          return (
            Object.assign({}, set$, { values: mk_cons(h, set$.values)}));
        }
    }
    
  };
  var _switch_arg_4 = set2.values;
  switch (_switch_arg_4.tag) {
    case "[]":
      return (set1);
    case "::":
      var h = _switch_arg_4.head, t = _switch_arg_4.tail;
      var set1$ = sub_elem(set1, h);
      return (sub(set1$, Object.assign({}, set2, { values: t})));
  }
  
};

var from_list = function (eq, lst) {
  return (
    MLList.foldl(function (set, v) { return (add(v, set));}, empty_set(eq),
      lst));
};

var elems = function (set) {
  return (set.values);
};

return {
  empty_set: empty_set, 
  mem: mem, 
  add: add, 
  union: union, 
  sub: sub, 
  from_list: from_list, 
  elems: elems};
})();

/* --------------------- Map.unlog.js --------------------- */

var Map = (function() {

var empty_map = function (eq, show) {
  return ({ eq: eq,
            show: show,
            bindings: mk_nil()});
};

var key_from_binding = function (b) {
  return (b.key);
};

var value_from_binding = function (b) {
  return (b.value);
};

var find = function (key, m) {
  var _switch_arg_1 = m.bindings;
  switch (_switch_arg_1.tag) {
    case "[]":
      var err_msg = strappend("Could not find key '",
                      strappend(m.show(key), "' in map"));
      return (Unsafe.error(err_msg));
    case "::":
      var h = _switch_arg_1.head, t = _switch_arg_1.tail;
      if (m.eq(h.key, key)) {
        return (Unsafe.box(h.value));
      } else {
        return (find(key, Object.assign({}, m, { bindings: t})));
      }
  }
  
};

var mem = function (key, m) {
  var _switch_arg_2 = m.bindings;
  switch (_switch_arg_2.tag) {
    case "[]":
      return (false);
    case "::":
      var h = _switch_arg_2.head, t = _switch_arg_2.tail;
      return (
        (m.eq(key, h.key) || mem(key, Object.assign({}, m, { bindings: t}))));
  }
  
};

var add = function (key, value, m) {
  var replace = function (key, value, m) {
    var _switch_arg_3 = m.bindings;
    switch (_switch_arg_3.tag) {
      case "[]":
        return (m);
      case "::":
        var h = _switch_arg_3.head, t = _switch_arg_3.tail;
        if (m.eq(h.key, key)) {
          var pair = {
            key: key,
            value: value
          };
          return (Object.assign({}, m, { bindings: mk_cons(pair, t)}));
        } else {
          var m$ = replace(key, value, Object.assign({}, m, { bindings: t}));
          return (
            Object.assign({}, m$, { bindings: mk_cons(h, m$.bindings)}));
        }
    }
    
  };
  if (mem(key, m)) {
    return (replace(key, value, m));
  } else {
    return (
      Object.assign({}, m, {
          bindings: mk_cons({ key: key,
                              value: value}, m.bindings)}));
  }
};

var union = function (m1, m2) {
  var _switch_arg_4 = m1.bindings;
  switch (_switch_arg_4.tag) {
    case "[]":
      return (m2);
    case "::":
      var h = _switch_arg_4.head, t = _switch_arg_4.tail;
      var m1$ = Object.assign({}, m1, { bindings: t});
      var m2$ = add(h.key, h.value, m2);
      return (union(m1$, m2$));
  }
  
};

var map = function (f, m) {
  var _switch_arg_5 = m.bindings;
  switch (_switch_arg_5.tag) {
    case "[]":
      return (empty_map(m.eq, m.show));
    case "::":
      var h = _switch_arg_5.head, t = _switch_arg_5.tail;
      var h$ = {
        key: h.key,
        value: f(h.value)
      };
      var m$ = map(f, Object.assign({}, m, { bindings: t}));
      return (Object.assign({}, m$, { bindings: mk_cons(h$, m$.bindings)}));
  }
  
};

var remove = function (key, m) {
  var _switch_arg_6 = m.bindings;
  switch (_switch_arg_6.tag) {
    case "[]":
      return (m);
    case "::":
      var h = _switch_arg_6.head, t = _switch_arg_6.tail;
      var m$ = Object.assign({}, m, { bindings: t});
      if (m.eq(h.key, key)) {
        return (m$);
      } else {
        var mres = remove(key, m$);
        return (
          Object.assign({}, mres, { bindings: mk_cons(h, mres.bindings)}));
      }
  }
  
};

var elems = function (m) {
  var _switch_arg_7 = m.bindings;
  switch (_switch_arg_7.tag) {
    case "[]":
      return (mk_nil());
    case "::":
      var h = _switch_arg_7.head, t = _switch_arg_7.tail;
      return (mk_cons(h.value, elems(Object.assign({}, m, { bindings: t}))));
  }
  
};

return {
  empty_map: empty_map, 
  key_from_binding: key_from_binding, 
  value_from_binding: value_from_binding, 
  find: find, 
  mem: mem, 
  add: add, 
  union: union, 
  map: map, 
  remove: remove, 
  elems: elems};
})();

/* --------------------- Identifier.unlog.js --------------------- */

var Identifier = (function() {

function Lident(id) { return {tag: "Lident", id: id}; }

function Ldot(path, id) { return {tag: "Ldot", path: path, id: id}; }

return {
  Lident: Lident, 
  Ldot: Ldot};
})();

/* --------------------- MLSyntax.unlog.js --------------------- */

var MLSyntax = (function() {

var new_position = function (line, column) {
  return ({ line: line,
            column: column});
};

var new_location = function (file, start, stop) {
  return ({ file: file,
            start: start,
            stop: stop});
};

var new_located_value = function (loc, value) {
  return ({ loc: loc,
            value: value});
};

var dummy_position = {
  line: 0,
  column: 0
};

var dummy_location = {
  file: "dummy.ml",
  start: dummy_position,
  stop: dummy_position
};

function Constant_integer(value) { return {tag: "Constant_integer", value: value}; }

function Constant_float(value) { return {tag: "Constant_float", value: value}; }

function Constant_char(value) { return {tag: "Constant_char", value: value}; }

function Constant_string(value) { return {tag: "Constant_string", value: value}; }

function Expression_constant(loc, constant) { return {tag: "Expression_constant", loc: loc, constant: constant}; }

function Expression_ident(loc, id) { return {tag: "Expression_ident", loc: loc, id: id}; }

function Expression_let(loc, is_rec, ids, exps, expr) { return {tag: "Expression_let", loc: loc, is_rec: is_rec, ids: ids, exps: exps, expr: expr}; }

function Expression_tuple(loc, components) { return {tag: "Expression_tuple", loc: loc, components: components}; }

function Expression_array(loc, elements) { return {tag: "Expression_array", loc: loc, elements: elements}; }

function Expression_variant(loc, label, value_opt) { return {tag: "Expression_variant", loc: loc, label: label, value_opt: value_opt}; }

function Expression_function(loc, cases) { return {tag: "Expression_function", loc: loc, cases: cases}; }

function Expression_apply(loc, func, args) { return {tag: "Expression_apply", loc: loc, func: func, args: args}; }

function Expression_match(loc, expr, cases) { return {tag: "Expression_match", loc: loc, expr: expr, cases: cases}; }

function Expression_constructor(loc, ctor, args) { return {tag: "Expression_constructor", loc: loc, ctor: ctor, args: args}; }

function Expression_record(loc, bindings, base) { return {tag: "Expression_record", loc: loc, bindings: bindings, base: base}; }

function Expression_field(loc, record, fieldname) { return {tag: "Expression_field", loc: loc, record: record, fieldname: fieldname}; }

function Expression_setfield(loc, record, fieldname, expr) { return {
tag: "Expression_setfield", loc: loc, record: record, fieldname: fieldname, expr: expr}; }

function Expression_ifthenelse(loc, cond, e1, e2) { return {tag: "Expression_ifthenelse", loc: loc, cond: cond, e1: e1, e2: e2}; }

function Expression_sequence(loc, e1, e2) { return {tag: "Expression_sequence", loc: loc, e1: e1, e2: e2}; }

function Expression_while(loc, cond, body) { return {tag: "Expression_while", loc: loc, cond: cond, body: body}; }

function Expression_for(loc, id, first, last, up, body) { return {tag: "Expression_for", loc: loc, id: id, first: first, last: last, up: up, body: body}; }

function Expression_try(loc, expr, cases) { return {tag: "Expression_try", loc: loc, expr: expr, cases: cases}; }

function Expression_letmodule(loc, id, modex, expr) { return {tag: "Expression_letmodule", loc: loc, id: id, modex: modex, expr: expr}; }

function Expression_pack(loc, expr) { return {tag: "Expression_pack", loc: loc, expr: expr}; }

function Expression_assert(loc, expr) { return {tag: "Expression_assert", loc: loc, expr: expr}; }

function Pattern_any(loc) { return {tag: "Pattern_any", loc: loc}; }

function Pattern_var(loc, id) { return {tag: "Pattern_var", loc: loc, id: id}; }

function Pattern_constant(loc, constant) { return {tag: "Pattern_constant", loc: loc, constant: constant}; }

function Pattern_tuple(loc, patts) { return {tag: "Pattern_tuple", loc: loc, patts: patts}; }

function Pattern_array(loc, patts) { return {tag: "Pattern_array", loc: loc, patts: patts}; }

function Pattern_variant(loc, label, arg) { return {tag: "Pattern_variant", loc: loc, label: label, arg: arg}; }

function Pattern_alias(loc, patt, alias) { return {tag: "Pattern_alias", loc: loc, patt: patt, alias: alias}; }

function Pattern_constructor(loc, ctor, args) { return {tag: "Pattern_constructor", loc: loc, ctor: ctor, args: args}; }

function Pattern_or(loc, patt1, patt2) { return {tag: "Pattern_or", loc: loc, patt1: patt1, patt2: patt2}; }





function Structure_eval(loc, expr) { return {tag: "Structure_eval", loc: loc, expr: expr}; }

function Structure_value(loc, is_rec, ids, exps) { return {tag: "Structure_value", loc: loc, is_rec: is_rec, ids: ids, exps: exps}; }

function Structure_type(loc) { return {tag: "Structure_type", loc: loc}; }

function Structure_module(loc, id, expr) { return {tag: "Structure_module", loc: loc, id: id, expr: expr}; }

function Structure_modtype(loc) { return {tag: "Structure_modtype", loc: loc}; }

function Structure_include(loc, expr) { return {tag: "Structure_include", loc: loc, expr: expr}; }

function Structure_primitive(loc) { return {tag: "Structure_primitive", loc: loc}; }

function Structure_exception(loc) { return {tag: "Structure_exception", loc: loc}; }

function Structure_open(loc, id) { return {tag: "Structure_open", loc: loc, id: id}; }

function Structure(loc, items) { return {tag: "Structure", loc: loc, items: items}; }

function Module_ident(loc, id) { return {tag: "Module_ident", loc: loc, id: id}; }

function Module_structure(loc, structure) { return {tag: "Module_structure", loc: loc, structure: structure}; }

function Module_functor(loc, id, expr) { return {tag: "Module_functor", loc: loc, id: id, expr: expr}; }

function Module_apply(loc, func, expr) { return {tag: "Module_apply", loc: loc, func: func, expr: expr}; }

function Module_constraint(loc, expr) { return {tag: "Module_constraint", loc: loc, expr: expr}; }

function Module_unpack(loc, expr) { return {tag: "Module_unpack", loc: loc, expr: expr}; }

return {
  new_position: new_position, 
  new_location: new_location, 
  new_located_value: new_located_value, 
  dummy_position: dummy_position, 
  dummy_location: dummy_location, 
  Constant_integer: Constant_integer, 
  Constant_float: Constant_float, 
  Constant_char: Constant_char, 
  Constant_string: Constant_string, 
  Expression_constant: Expression_constant, 
  Expression_ident: Expression_ident, 
  Expression_let: Expression_let, 
  Expression_tuple: Expression_tuple, 
  Expression_array: Expression_array, 
  Expression_variant: Expression_variant, 
  Expression_function: Expression_function, 
  Expression_apply: Expression_apply, 
  Expression_match: Expression_match, 
  Expression_constructor: Expression_constructor, 
  Expression_record: Expression_record, 
  Expression_field: Expression_field, 
  Expression_setfield: Expression_setfield, 
  Expression_ifthenelse: Expression_ifthenelse, 
  Expression_sequence: Expression_sequence, 
  Expression_while: Expression_while, 
  Expression_for: Expression_for, 
  Expression_try: Expression_try, 
  Expression_letmodule: Expression_letmodule, 
  Expression_pack: Expression_pack, 
  Expression_assert: Expression_assert, 
  Pattern_any: Pattern_any, 
  Pattern_var: Pattern_var, 
  Pattern_constant: Pattern_constant, 
  Pattern_tuple: Pattern_tuple, 
  Pattern_array: Pattern_array, 
  Pattern_variant: Pattern_variant, 
  Pattern_alias: Pattern_alias, 
  Pattern_constructor: Pattern_constructor, 
  Pattern_or: Pattern_or, 
  Structure_eval: Structure_eval, 
  Structure_value: Structure_value, 
  Structure_type: Structure_type, 
  Structure_module: Structure_module, 
  Structure_modtype: Structure_modtype, 
  Structure_include: Structure_include, 
  Structure_primitive: Structure_primitive, 
  Structure_exception: Structure_exception, 
  Structure_open: Structure_open, 
  Structure: Structure, 
  Module_ident: Module_ident, 
  Module_structure: Module_structure, 
  Module_functor: Module_functor, 
  Module_apply: Module_apply, 
  Module_constraint: Module_constraint, 
  Module_unpack: Module_unpack};
})();

/* --------------------- Vector.js --------------------- */

/**
 * The module Vector enables the user to create and manipulate a dynamic-sized array (a vector).
 * Vectors are used as program state in MLExplain, it stores variable values.
 * Each value stored in the vector is accessible through its unique index.
 */
var Vector = (function() {
  /** Create an empty vector */
  var empty = function() {
    return { ary: [] };
  };

  /** Append a new value at the end of the vector and return its new index */
  var append = function(vec, v) {
    vec.ary = vec.ary.concat(v);
    return vec.ary.length - 1;
  };

  /** Get the value in the vector at the given index, can fail if idx < 0 or vec.length <= idx */
  var get = function(vec, idx) {
    return vec.ary[idx];
  }

  /** Look for the given index in the vector and get the associated value if any */
  var find = function(vec, idx) {
    if(vec.length <= idx)
      return { tag: "Error", error: "Index " + idx + "out of bounds" };

    var v = get(vec, idx);

    /* No value should be undefined */
    if(v == undefined)
      return { tag: "Error", error: "Value is undefined" };
    else
      return { tag: "Result", result: v };
  }

  /** Modify the value at given index. Used to update mutable fields or in preallocated-value definitions */
  var set = function(vec, idx, v) {
    vec.ary[idx] = v;
  }

  return {
    empty: empty,
    append: append,
    get: get,
    find: find,
    set: set};
})();

/* --------------------- ExecutionContext.unlog.js --------------------- */

var ExecutionContext = (function() {

var empty = {
  execution_ctx_lexical_env: Map.empty_map(function (s1, s2) {
                                 return ((s1 === s2));}, function (s) {
                                 return (s);}),
  opened_modules: mk_nil()
};

var from_map = function (map) {
  return ({ execution_ctx_lexical_env: map,
            opened_modules: mk_nil()});
};

var find = function (n, ctx) {
  var fst = Map.find(n, ctx.execution_ctx_lexical_env);
  var func = function (fst, md) {
    switch (fst.tag) {
      case "Result":
        return (fst);
      default:
        return (Map.find(n, md.map));
    }
    
  };
  return (MLList.foldl(func, fst, ctx.opened_modules));
};

var add = function (n, v, ctx) {
  return (
    Object.assign({}, ctx, {
        execution_ctx_lexical_env: Map.add(n, v,
                                     ctx.execution_ctx_lexical_env)}));
};

var execution_ctx_lexical_env = function (ctx) {
  return (ctx.execution_ctx_lexical_env);
};

var open_module = function (id, map, ctx) {
  return (
    Object.assign({}, ctx, {
        opened_modules: mk_cons({ id: id,
                                  map: map}, ctx.opened_modules)}));
};

return {
  empty: empty, 
  from_map: from_map, 
  find: find, 
  add: add, 
  execution_ctx_lexical_env: execution_ctx_lexical_env, 
  open_module: open_module};
})();

/* --------------------- Value.unlog.js --------------------- */

var Value = (function() {

function Value_int(value) { return {tag: "Value_int", value: value}; }

function Value_float(value) { return {tag: "Value_float", value: value}; }

function Value_char(value) { return {tag: "Value_char", value: value}; }

function Value_string(value) { return {tag: "Value_string", value: value}; }

function Value_tuple(value) { return {tag: "Value_tuple", value: value}; }

function Value_array(value) { return {tag: "Value_array", value: value}; }

function Value_fun(value) { return {tag: "Value_fun", value: value}; }

function Value_variant(value) { return {tag: "Value_variant", value: value}; }

function Value_struct(value) { return {tag: "Value_struct", value: value}; }

function Value_functor(value) { return {tag: "Value_functor", value: value}; }

function Value_custom(value) { return {tag: "Value_custom", value: value}; }

function Value_exception(value) { return {tag: "Value_exception", value: value}; }



function Sumtype(sumtype) { return {tag: "Sumtype", sumtype: sumtype}; }

function Record(record) { return {tag: "Record", record: record}; }





function Normal(normal_alloc) { return {tag: "Normal", normal_alloc: normal_alloc}; }

function Prealloc(prealloc, ctx) { return {tag: "Prealloc", prealloc: prealloc, ctx: ctx}; }

var do_sumtype = function (value, func) {
  switch (value.tag) {
    case "Value_custom":
      var custom = value.value;
      switch (custom.tag) {
        case "Sumtype":
          var s = custom.sumtype;
          return (func(s));
        default:
          return (Unsafe.error("Not a sumtype"));
      }
      
    default:
      return (Unsafe.error("Not a sumtype"));
  }
  
};

var bool_of_value = function (x) {
  return (
    do_sumtype(x, function (s) {
        var _switch_arg_1 = s.constructor;
        switch (_switch_arg_1) {
          case "true":
            return (Unsafe.box(true));
          case "false":
            return (Unsafe.box(false));
          default:
            return (Unsafe.error("Not a boolean"));
        }
        }));
};

var value_of_bool = function (b) {
  var res = function (ctor) {
    return (Value_custom(Sumtype({ constructor: ctor,
                                   args: []})));
  };
  switch (b) {
    case true:
      return (res("true"));
    case false:
      return (res("false"));
  }
  
};

var value_eq = function (v1, v2) {
  switch (v1.tag) {
    case "Value_int":
      var i1 = v1.value;
      switch (v2.tag) {
        case "Value_int":
          var i2 = v2.value;
          return (int_eq(i1, i2));
        default:
          return (false);
      }
      
    case "Value_float":
      var f1 = v1.value;
      switch (v2.tag) {
        case "Value_float":
          var f2 = v2.value;
          return ((f1 == f2));
        default:
          return (false);
      }
      
    case "Value_char":
      var c1 = v1.value;
      switch (v2.tag) {
        case "Value_char":
          var c2 = v2.value;
          return (_compare_char(c1, c2));
        default:
          return (false);
      }
      
    case "Value_string":
      var s1 = v1.value;
      switch (v2.tag) {
        case "Value_string":
          var s2 = v2.value;
          return (string_eq(s1, s2));
        default:
          return (false);
      }
      
    case "Value_tuple":
      var t1 = v1.value;
      switch (v2.tag) {
        case "Value_tuple":
          var t2 = v2.value;
          var blist = MLArray.zipwith(value_eq, t1, t2);
          return (MLArray.all_true(blist));
        default:
          return (false);
      }
      
    case "Value_array":
      var a1 = v1.value;
      switch (v2.tag) {
        case "Value_array":
          var a2 = v2.value;
          var blist = MLArray.zipwith(value_eq, a1, a2);
          return (MLArray.all_true(blist));
        default:
          return (false);
      }
      
    case "Value_fun":
      return (false);
    case "Value_variant":
      var vr1 = v1.value;
      switch (v2.tag) {
        case "Value_variant":
          var vr2 = v2.value;
          var cmp = function (v1, v2) {
            return (Unsafe.eq(value_eq, value_eq, v1, v2));
          };
          var val_eq = Option.eq(cmp, vr1.value_opt, vr2.value_opt);
          return (((vr1.label === vr2.label) && val_eq));
        default:
          return (false);
      }
      
    case "Value_custom":
      var c1 = v1.value;
      switch (v2.tag) {
        case "Value_custom":
          var c2 = v2.value;
          return (custom_eq(c1, c2));
        default:
          return (false);
      }
      
    default:
      return (false);
  }
  
};

var custom_eq = function (c1, c2) {
  switch (c1.tag) {
    case "Sumtype":
      var s1 = c1.sumtype;
      switch (c2.tag) {
        case "Sumtype":
          var s2 = c2.sumtype;
          return (sumtype_eq(s1, s2));
        default:
          return (false);
      }
      
    default:
      return (false);
  }
  
};

var sumtype_eq = function (s1, s2) {
  var t1 = Value_tuple(s1.args);
  var t2 = Value_tuple(s2.args);
  if ((MLArray.length(s1.args) === MLArray.length(s2.args))) {
    if ((MLArray.length(s1.args) === 0)) {
      return ((s1.constructor === s2.constructor));
    } else {
      return (((s1.constructor === s2.constructor) && value_eq(t1, t2)));
    }
  } else {
    return (false);
  }
};

var value_inf = function (v1, v2) {
  switch (v1.tag) {
    case "Value_int":
      var i1 = v1.value;
      switch (v2.tag) {
        case "Value_int":
          var i2 = v2.value;
          var num1 = number_of_int(i1);
          var num2 = number_of_int(i2);
          return (Unsafe.box(value_of_bool((num1 < num2))));
        default:
          return (Unsafe.error("Expected an integer"));
      }
      
    case "Value_float":
      var f1 = v1.value;
      switch (v2.tag) {
        case "Value_float":
          var f2 = v2.value;
          return (Unsafe.box(value_of_bool((f1 < f2))));
        default:
          return (Unsafe.error("Expected a float"));
      }
      
    case "Value_char":
      var c1 = v1.value;
      switch (v2.tag) {
        case "Value_char":
          var c2 = v2.value;
          var num1 = number_of_int(int_of_char(c1));
          var num2 = number_of_int(int_of_char(c2));
          return (Unsafe.box(value_of_bool((num1 < num2))));
        default:
          return (Unsafe.error("Expected a character"));
      }
      
    case "Value_string":
      var s1 = v1.value;
      switch (v2.tag) {
        case "Value_string":
          var s2 = v2.value;
          var b = (string_compare(s1, s2) === -1);
          return (Unsafe.box(value_of_bool(b)));
        default:
          return (Unsafe.error("Expected a string"));
      }
      
    default:
      return (
        Unsafe.except(
          Value_custom(Sumtype({ constructor: "Invalid_argument",
                                 args: []}))));
  }
  
};

var nil = Value_custom(Sumtype({ constructor: "()",
                                 args: []}));

var is_sumtype_ctor = function (ctor, v) {
  switch (v.tag) {
    case "Value_custom":
      var c = v.value;
      switch (c.tag) {
        case "Sumtype":
          var s = c.sumtype;
          return ((ctor === s.constructor));
        default:
          return (false);
      }
      
    default:
      return (false);
  }
  
};

var do_record = function (value, func) {
  switch (value.tag) {
    case "Value_custom":
      var custom = value.value;
      switch (custom.tag) {
        case "Record":
          var r = custom.record;
          return (func(r));
        default:
          return (Unsafe.error("Not a record"));
      }
      
    default:
      return (Unsafe.error("Not a record"));
  }
  
};

var do_record_with_default = function (value, dflt, func) {
  switch (value.tag) {
    case "Value_custom":
      var custom = value.value;
      switch (custom.tag) {
        case "Record":
          var r = custom.record;
          return (func(r));
        default:
          return (dflt);
      }
      
    default:
      return (dflt);
  }
  
};

var get_function = function (_fun_arg_) {
  switch (_fun_arg_.tag) {
    case "Value_fun":
      var f = _fun_arg_.value;
      return (Unsafe.box(f));
    default:
      return (Unsafe.error("Not a function"));
  }
  
};

var int_bin_op = function (op) {
  var func = function (_fun_arg_) {
    switch (_fun_arg_.tag) {
      case "Value_int":
        var a = _fun_arg_.value;
        var curry = function (_fun_arg_) {
          switch (_fun_arg_.tag) {
            case "Value_int":
              var b = _fun_arg_.value;
              return (Unsafe.box(Value_int(op(a, b))));
            default:
              return (Unsafe.error("Expected an int"));
          }
          
        };
        return (Unsafe.box(Value_fun(curry)));
      default:
        return (Unsafe.error("Expected an int"));
    }
    
  };
  return (Value_fun(func));
};

var float_bin_op = function (op) {
  var func = function (_fun_arg_) {
    switch (_fun_arg_.tag) {
      case "Value_float":
        var a = _fun_arg_.value;
        var curry = function (_fun_arg_) {
          switch (_fun_arg_.tag) {
            case "Value_float":
              var b = _fun_arg_.value;
              return (Unsafe.box(Value_float(op(a, b))));
            default:
              return (Unsafe.error("Expected a float"));
          }
          
        };
        return (Unsafe.box(Value_fun(curry)));
      default:
        return (Unsafe.error("Expected a float"));
    }
    
  };
  return (Value_fun(func));
};

var bool_bin_op = function (op) {
  var func = function (a) {
    return (
      Unsafe.bind(bool_of_value(a), function (b1) {
          var curry = function (b) {
            return (
              Unsafe.bind(bool_of_value(b), function (b2) {
                  return (Unsafe.box(value_of_bool(op(b1, b2))));}));
          };
          return (Unsafe.box(Value_fun(curry)));}));
  };
  return (Value_fun(func));
};

var cmp_bin_op = function (op) {
  var func = function (a) {
    var curry = function (b) {
      return (Unsafe.box(value_of_bool(op(a, b))));
    };
    return (Unsafe.box(Value_fun(curry)));
  };
  return (Value_fun(func));
};

var raise_function = Value_fun(function (v) { return (Unsafe.except(v));});

var prim_int_plus = int_bin_op(function (a, b) { return ((a + b));});

var prim_int_sub = int_bin_op(function (a, b) { return ((a - b));});

var prim_int_mul = int_bin_op(function (a, b) { return ((a * b));});

var prim_int_div = int_bin_op(function (a, b) { return ((a / b));});

var prim_float_plus = float_bin_op(function (a, b) { return ((a + b));});

var prim_float_sub = float_bin_op(function (a, b) { return ((a - b));});

var prim_float_mul = float_bin_op(function (a, b) { return ((a * b));});

var prim_float_div = float_bin_op(function (a, b) { return ((a / b));});

var prim_bool_and = bool_bin_op(function (a, b) { return ((a && b));});

var prim_bool_or = bool_bin_op(function (a, b) { return ((a || b));});

var prim_eq = cmp_bin_op(value_eq);

var prim_neq = (function () {
  var func = function (a, b) {
    return (!(value_eq(a, b)));
  };
  return (cmp_bin_op(func));
}())
;

var prim_lt = Value_fun(function (a) {
                  return (
                    Unsafe.box(
                      Value_fun(function (b) { return (value_inf(a, b));})));
                });

var prim_le = (function () {
  var func = function (a, b) {
    return (
      Unsafe.bind(value_inf(a, b), function (iv) {
          return (
            Unsafe.bind(bool_of_value(iv), function (ib) {
                var eqb = value_eq(a, b);
                return (Unsafe.box(value_of_bool((ib || eqb))));}));}));
  };
  return (
    Value_fun(function (a) {
        return (Unsafe.box(Value_fun(function (b) { return (func(a, b));})));
      }));
}())
;

var prim_gt = Value_fun(function (a) {
                  return (
                    Unsafe.box(
                      Value_fun(function (b) { return (value_inf(b, a));})));
                });

var prim_ge = (function () {
  var func = function (a, b) {
    return (
      Unsafe.bind(value_inf(a, b), function (iv) {
          return (
            Unsafe.bind(bool_of_value(iv), function (ib) {
                var eqb = value_eq(a, b);
                return (Unsafe.box(value_of_bool((ib || eqb))));}));}));
  };
  return (
    Value_fun(function (a) {
        return (Unsafe.box(Value_fun(function (b) { return (func(b, a));})));
      }));
}())
;

var prim_float_float = function (op) {
  var func = function (v) {
    switch (v.tag) {
      case "Value_float":
        var f = v.value;
        return (Unsafe.box(Value_float(op(f))));
      default:
        return (Unsafe.error("Expected a float"));
    }
    
  };
  return (Value_fun(func));
};

var prim_sqrt = prim_float_float(sqrt);

var prim_exp = prim_float_float(exp);

var prim_log = prim_float_float(log);

var prim_log10 = prim_float_float(log10);

var prim_expm1 = prim_float_float(expm1);

var prim_log1p = prim_float_float(log1p);

var prim_cos = prim_float_float(cos);

var prim_sin = prim_float_float(sin);

var prim_tan = prim_float_float(tan);

var prim_acos = prim_float_float(acos);

var prim_asin = prim_float_float(asin);

var prim_atan = prim_float_float(atan);

var prim_cosh = prim_float_float(cosh);

var prim_sinh = prim_float_float(sinh);

var prim_tanh = prim_float_float(tanh);

var prim_ceil = prim_float_float(ceil);

var prim_floor = prim_float_float(floor);



var builtin_name = function (b) {
  return (b.name);
};

var builtin_value = function (b) {
  return (b.value);
};

var create_builtin = function (name, value) {
  return ({ name: name,
            value: value});
};

var initial_env = (function () {
  var float_float_builtins = mk_cons(create_builtin("sqrt", prim_sqrt),
                               mk_cons(create_builtin("exp", prim_exp),
                                 mk_cons(create_builtin("log", prim_log),
                                   mk_cons(
                                     create_builtin("log10", prim_log10),
                                     mk_cons(
                                       create_builtin("expm1", prim_expm1),
                                       mk_cons(
                                         create_builtin("log1p", prim_log1p),
                                         mk_cons(
                                           create_builtin("cos", prim_cos),
                                           mk_cons(
                                             create_builtin("sin", prim_sin),
                                             mk_cons(
                                               create_builtin("tan",
                                                 prim_tan),
                                               mk_cons(
                                                 create_builtin("acos",
                                                   prim_acos),
                                                 mk_cons(
                                                   create_builtin("asin",
                                                     prim_asin),
                                                   mk_cons(
                                                     create_builtin("atan",
                                                       prim_atan),
                                                     mk_cons(
                                                       create_builtin("cosh",
                                                         prim_cosh),
                                                       mk_cons(
                                                         create_builtin(
                                                           "sinh", prim_sinh),
                                                         mk_cons(
                                                           create_builtin(
                                                             "tanh",
                                                             prim_tanh),
                                                           mk_cons(
                                                             create_builtin(
                                                               "ceil",
                                                               prim_ceil),
                                                             mk_cons(
                                                               create_builtin(
                                                                 "floor",
                                                                 prim_floor),
                                                               mk_nil())))))))))))))))));
  return (
    MLList.concat(float_float_builtins,
      mk_cons(create_builtin("raise", raise_function),
        mk_cons(create_builtin("+", prim_int_plus),
          mk_cons(create_builtin("-", prim_int_sub),
            mk_cons(create_builtin("*", prim_int_mul),
              mk_cons(create_builtin("/", prim_int_div),
                mk_cons(create_builtin("+.", prim_float_plus),
                  mk_cons(create_builtin("-.", prim_float_sub),
                    mk_cons(create_builtin("*.", prim_float_mul),
                      mk_cons(create_builtin("/.", prim_float_div),
                        mk_cons(create_builtin("&&", prim_bool_and),
                          mk_cons(create_builtin("||", prim_bool_or),
                            mk_cons(create_builtin("=", prim_eq),
                              mk_cons(create_builtin("<>", prim_neq),
                                mk_cons(create_builtin("<", prim_lt),
                                  mk_cons(create_builtin(">", prim_gt),
                                    mk_cons(create_builtin("<=", prim_le),
                                      mk_cons(create_builtin(">=", prim_ge),
                                        mk_nil())))))))))))))))))));
}())
;

return {
  Value_int: Value_int, 
  Value_float: Value_float, 
  Value_char: Value_char, 
  Value_string: Value_string, 
  Value_tuple: Value_tuple, 
  Value_array: Value_array, 
  Value_fun: Value_fun, 
  Value_variant: Value_variant, 
  Value_struct: Value_struct, 
  Value_functor: Value_functor, 
  Value_custom: Value_custom, 
  Value_exception: Value_exception, 
  Sumtype: Sumtype, 
  Record: Record, 
  Normal: Normal, 
  Prealloc: Prealloc, 
  do_sumtype: do_sumtype, 
  bool_of_value: bool_of_value, 
  value_of_bool: value_of_bool, 
  value_eq: value_eq, 
  custom_eq: custom_eq, 
  sumtype_eq: sumtype_eq, 
  value_inf: value_inf, 
  nil: nil, 
  is_sumtype_ctor: is_sumtype_ctor, 
  do_record: do_record, 
  do_record_with_default: do_record_with_default, 
  get_function: get_function, 
  int_bin_op: int_bin_op, 
  float_bin_op: float_bin_op, 
  bool_bin_op: bool_bin_op, 
  cmp_bin_op: cmp_bin_op, 
  raise_function: raise_function, 
  prim_int_plus: prim_int_plus, 
  prim_int_sub: prim_int_sub, 
  prim_int_mul: prim_int_mul, 
  prim_int_div: prim_int_div, 
  prim_float_plus: prim_float_plus, 
  prim_float_sub: prim_float_sub, 
  prim_float_mul: prim_float_mul, 
  prim_float_div: prim_float_div, 
  prim_bool_and: prim_bool_and, 
  prim_bool_or: prim_bool_or, 
  prim_eq: prim_eq, 
  prim_neq: prim_neq, 
  prim_lt: prim_lt, 
  prim_le: prim_le, 
  prim_gt: prim_gt, 
  prim_ge: prim_ge, 
  prim_float_float: prim_float_float, 
  prim_sqrt: prim_sqrt, 
  prim_exp: prim_exp, 
  prim_log: prim_log, 
  prim_log10: prim_log10, 
  prim_expm1: prim_expm1, 
  prim_log1p: prim_log1p, 
  prim_cos: prim_cos, 
  prim_sin: prim_sin, 
  prim_tan: prim_tan, 
  prim_acos: prim_acos, 
  prim_asin: prim_asin, 
  prim_atan: prim_atan, 
  prim_cosh: prim_cosh, 
  prim_sinh: prim_sinh, 
  prim_tanh: prim_tanh, 
  prim_ceil: prim_ceil, 
  prim_floor: prim_floor, 
  builtin_name: builtin_name, 
  builtin_value: builtin_value, 
  create_builtin: create_builtin, 
  initial_env: initial_env};
})();

/* --------------------- MLInterpreter.log.js --------------------- */

var MLInterpreter = (function() {
with (MLSyntax) {
with (Value) {
with (Identifier) {

var min = function (a, b) {
  var ctx_1 = ctx_push(ctx_empty, [{key: "a", val: a}, {key: "b", val: b}]);
  log_event("MLInterpreter.js", 6, ctx_1, "enter");
  var _if_arg_1 = (function () {
    log_event("MLInterpreter.js", 2, ctx_1, "call");
    var _return_2 = (a <= b);
    log_event("MLInterpreter.js", 1, ctx_push(ctx_1, [{key: "#RETURN_VALUE#", val: _return_2}]), "return");
    return (_return_2); 
  }())
  ;
  log_event("MLInterpreter.js", 5, ctx_1, "if");
  if (_if_arg_1) {
    var _return_4 = a;
    log_event("MLInterpreter.js", 4, ctx_push(ctx_1, [{key: "#RETURN_VALUE#", val: _return_4}]), "return");
    return (_return_4); 
  } else {
    var _return_3 = b;
    log_event("MLInterpreter.js", 3, ctx_push(ctx_1, [{key: "#RETURN_VALUE#", val: _return_3}]), "return");
    return (_return_3); 
  }
};





var build_initial_env = function (s, ctx) {
  var ctx_2 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}]);
  log_event("MLInterpreter.js", 24, ctx_2, "enter");
  var func = function (ctx, builtin) {
    var ctx_3 = ctx_push(ctx_2, [{key: "ctx", val: ctx}, {key: "builtin", val: builtin}]);
    log_event("MLInterpreter.js", 19, ctx_3, "enter");
    var name = (function () {
      log_event("MLInterpreter.js", 8, ctx_3, "call");
      var _return_5 = builtin_name(builtin);
      log_event("MLInterpreter.js", 7, ctx_push(ctx_3, [{key: "#RETURN_VALUE#", val: _return_5}]), "return");
      return (_return_5); 
    }())
    ;
    var ctx_4 = ctx_push(ctx_3, [{key: "name", val: name}]);
    log_event("MLInterpreter.js", 18, ctx_4, "let");
    var value = (function () {
      log_event("MLInterpreter.js", 10, ctx_4, "call");
      var _return_6 = builtin_value(builtin);
      log_event("MLInterpreter.js", 9, ctx_push(ctx_4, [{key: "#RETURN_VALUE#", val: _return_6}]), "return");
      return (_return_6); 
    }())
    ;
    var ctx_5 = ctx_push(ctx_4, [{key: "value", val: value}]);
    log_event("MLInterpreter.js", 17, ctx_5, "let");
    var idx = (function () {
      log_event("MLInterpreter.js", 12, ctx_5, "call");
      var _return_7 = Vector.append(s, Normal(value));
      log_event("MLInterpreter.js", 11, ctx_push(ctx_5, [{key: "#RETURN_VALUE#", val: _return_7}]), "return");
      return (_return_7); 
    }())
    ;
    var ctx_6 = ctx_push(ctx_5, [{key: "idx", val: idx}]);
    log_event("MLInterpreter.js", 16, ctx_6, "let");
    var _return_9 = (function () {
      log_event("MLInterpreter.js", 14, ctx_6, "call");
      var _return_8 = ExecutionContext.add(name, idx, ctx);
      log_event("MLInterpreter.js", 13, ctx_push(ctx_6, [{key: "#RETURN_VALUE#", val: _return_8}]), "return");
      return (_return_8); 
    }())
    ;
    log_event("MLInterpreter.js", 15, ctx_push(ctx_6, [{key: "#RETURN_VALUE#", val: _return_9}]), "return");
    return (_return_9); 
    
    
    
  };
  var ctx_7 = ctx_push(ctx_2, [{key: "func", val: func}]);
  log_event("MLInterpreter.js", 23, ctx_7, "let");
  var _return_11 = (function () {
    log_event("MLInterpreter.js", 21, ctx_7, "call");
    var _return_10 = MLList.foldl(func, ctx, Value.initial_env);
    log_event("MLInterpreter.js", 20, ctx_push(ctx_7, [{key: "#RETURN_VALUE#", val: _return_10}]), "return");
    return (_return_10); 
  }())
  ;
  log_event("MLInterpreter.js", 22, ctx_push(ctx_7, [{key: "#RETURN_VALUE#", val: _return_11}]), "return");
  return (_return_11); 
  
};

var string_of_identifier = function (_fun_arg_) {
  var ctx_8 = ctx_push(ctx_empty, [{key: "_fun_arg_", val: _fun_arg_}]);
  log_event("MLInterpreter.js", 36, ctx_8, "enter");
  log_event("MLInterpreter.js", 35, ctx_8, "switch");
  switch (_fun_arg_.tag) {
    case "Lident":
      var id = _fun_arg_.id;var ctx_9 = ctx_push(ctx_8, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 26, ctx_9, "case");
    
      var _return_12 = id;
      log_event("MLInterpreter.js", 25, ctx_push(ctx_9, [{key: "#RETURN_VALUE#", val: _return_12}]), "return");
      return (_return_12); 
    case "Ldot":
      var path = _fun_arg_.path, id = _fun_arg_.id;var ctx_10 = ctx_push(ctx_8, [{key: "path", val: path}, {key: "id", val: id}]);
    log_event("MLInterpreter.js", 34, ctx_10, "case");
    
      var _return_16 = (function () {
        log_event("MLInterpreter.js", 32, ctx_10, "call");
        var _return_15 = strappend((function () {
                             log_event("MLInterpreter.js", 30, ctx_10, "call");
                             var _return_14 = strappend((function () {
                                                  log_event("MLInterpreter.js", 28, ctx_10, "call");
                                                  var _return_13 = string_of_identifier(
                                                                    path);
                                                  log_event("MLInterpreter.js", 27, ctx_push(ctx_10, [{key: "#RETURN_VALUE#", val: _return_13}]), "return");
                                                  return (_return_13); }()),
                                                ".");
                             log_event("MLInterpreter.js", 29, ctx_push(ctx_10, [{key: "#RETURN_VALUE#", val: _return_14}]), "return");
                             return (_return_14); }()), id);
        log_event("MLInterpreter.js", 31, ctx_push(ctx_10, [{key: "#RETURN_VALUE#", val: _return_15}]), "return");
        return (_return_15); 
      }())
      ;
      log_event("MLInterpreter.js", 33, ctx_push(ctx_10, [{key: "#RETURN_VALUE#", val: _return_16}]), "return");
      return (_return_16); 
  }
  
};

var run_constant = function (_fun_arg_) {
  var ctx_11 = ctx_push(ctx_empty, [{key: "_fun_arg_", val: _fun_arg_}]);
  log_event("MLInterpreter.js", 48, ctx_11, "enter");
  log_event("MLInterpreter.js", 47, ctx_11, "switch");
  switch (_fun_arg_.tag) {
    case "Constant_integer":
      var i = _fun_arg_.value;var ctx_12 = ctx_push(ctx_11, [{key: "i", val: i}]);
    log_event("MLInterpreter.js", 38, ctx_12, "case");
    
      var _return_17 = Value_int(i);
      log_event("MLInterpreter.js", 37, ctx_push(ctx_12, [{key: "#RETURN_VALUE#", val: _return_17}]), "return");
      return (_return_17); 
    case "Constant_float":
      var f = _fun_arg_.value;var ctx_13 = ctx_push(ctx_11, [{key: "f", val: f}]);
    log_event("MLInterpreter.js", 40, ctx_13, "case");
    
      var _return_18 = Value_float(f);
      log_event("MLInterpreter.js", 39, ctx_push(ctx_13, [{key: "#RETURN_VALUE#", val: _return_18}]), "return");
      return (_return_18); 
    case "Constant_char":
      var c = _fun_arg_.value;var ctx_14 = ctx_push(ctx_11, [{key: "c", val: c}]);
    log_event("MLInterpreter.js", 42, ctx_14, "case");
    
      var _return_19 = Value_char(c);
      log_event("MLInterpreter.js", 41, ctx_push(ctx_14, [{key: "#RETURN_VALUE#", val: _return_19}]), "return");
      return (_return_19); 
    case "Constant_string":
      var s = _fun_arg_.value;var ctx_15 = ctx_push(ctx_11, [{key: "s", val: s}]);
    log_event("MLInterpreter.js", 46, ctx_15, "case");
    
      var _return_21 = Value_string((function () {
                           log_event("MLInterpreter.js", 44, ctx_15, "call");
                           var _return_20 = normalize_string(s);
                           log_event("MLInterpreter.js", 43, ctx_push(ctx_15, [{key: "#RETURN_VALUE#", val: _return_20}]), "return");
                           return (_return_20); }()));
      log_event("MLInterpreter.js", 45, ctx_push(ctx_15, [{key: "#RETURN_VALUE#", val: _return_21}]), "return");
      return (_return_21); 
  }
  
};

var run_ident = function (s, ctx, str) {
  var ctx_16 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "str", val: str}]);
  log_event("MLInterpreter.js", 94, ctx_16, "enter");
  log_event("MLInterpreter.js", 93, ctx_16, "switch");
  switch (str.tag) {
    case "Lident":
      var id = str.id;var ctx_17 = ctx_push(ctx_16, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 64, ctx_17, "case");
    
      var _return_29 = (function () {
        log_event("MLInterpreter.js", 62, ctx_17, "call");
        var _return_28 = Unsafe.bind((function () {
                             log_event("MLInterpreter.js", 50, ctx_17, "call");
                             var _return_22 = ExecutionContext.find(id, ctx);
                             log_event("MLInterpreter.js", 49, ctx_push(ctx_17, [{key: "#RETURN_VALUE#", val: _return_22}]), "return");
                             return (_return_22); }()), function (idx) {
                             var ctx_18 = ctx_push(ctx_17, [{key: "idx", val: idx}]);
                             log_event("MLInterpreter.js", 60, ctx_18, "enter");
                             var _return_27 = (function () {
                               log_event("MLInterpreter.js", 58, ctx_18, "call");
                               var _return_26 = Unsafe.bind((function () {
                                                    log_event("MLInterpreter.js", 52, ctx_18, "call");
                                                    var _return_23 = 
                                                    Vector.find(s, idx);
                                                    log_event("MLInterpreter.js", 51, ctx_push(ctx_18, [{key: "#RETURN_VALUE#", val: _return_23}]), "return");
                                                    return (_return_23); }())
                                                  , function (b) {
                                                    var ctx_19 = ctx_push(ctx_18, [{key: "b", val: b}]);
                                                    log_event("MLInterpreter.js", 56, ctx_19, "enter");
                                                    var _return_25 = (function () {
                                                      log_event("MLInterpreter.js", 54, ctx_19, "call");
                                                      var _return_24 = 
                                                      value_of(s, ctx, b);
                                                      log_event("MLInterpreter.js", 53, ctx_push(ctx_19, [{key: "#RETURN_VALUE#", val: _return_24}]), "return");
                                                      return (_return_24); 
                                                    }())
                                                    ;
                                                    log_event("MLInterpreter.js", 55, ctx_push(ctx_19, [{key: "#RETURN_VALUE#", val: _return_25}]), "return");
                                                    return (_return_25); });
                               log_event("MLInterpreter.js", 57, ctx_push(ctx_18, [{key: "#RETURN_VALUE#", val: _return_26}]), "return");
                               return (_return_26); 
                             }())
                             ;
                             log_event("MLInterpreter.js", 59, ctx_push(ctx_18, [{key: "#RETURN_VALUE#", val: _return_27}]), "return");
                             return (_return_27); });
        log_event("MLInterpreter.js", 61, ctx_push(ctx_17, [{key: "#RETURN_VALUE#", val: _return_28}]), "return");
        return (_return_28); 
      }())
      ;
      log_event("MLInterpreter.js", 63, ctx_push(ctx_17, [{key: "#RETURN_VALUE#", val: _return_29}]), "return");
      return (_return_29); 
    case "Ldot":
      var path = str.path, id = str.id;var ctx_20 = ctx_push(ctx_16, [{key: "path", val: path}, {key: "id", val: id}]);
    log_event("MLInterpreter.js", 92, ctx_20, "case");
    
      var _return_42 = (function () {
        log_event("MLInterpreter.js", 90, ctx_20, "call");
        var _return_41 = Unsafe.bind((function () {
                             log_event("MLInterpreter.js", 66, ctx_20, "call");
                             var _return_30 = run_ident(s, ctx, path);
                             log_event("MLInterpreter.js", 65, ctx_push(ctx_20, [{key: "#RETURN_VALUE#", val: _return_30}]), "return");
                             return (_return_30); }()), function (value) {
                             var ctx_21 = ctx_push(ctx_20, [{key: "value", val: value}]);
                             log_event("MLInterpreter.js", 88, ctx_21, "enter");
                             log_event("MLInterpreter.js", 87, ctx_21, "switch");
                             switch (value.tag) {
                               case "Value_struct":
                                 var m = value.value;var ctx_22 = ctx_push(ctx_21, [{key: "m", val: m}]);
                               log_event("MLInterpreter.js", 82, ctx_22, "case");
                               
                                 var _return_38 = (function () {
                                   log_event("MLInterpreter.js", 80, ctx_22, "call");
                                   var _return_37 = Unsafe.bind(
                                                      (function () {
                                                        log_event("MLInterpreter.js", 68, ctx_22, "call");
                                                        var _return_31 = 
                                                        Map.find(id, m);
                                                        log_event("MLInterpreter.js", 67, ctx_push(ctx_22, [{key: "#RETURN_VALUE#", val: _return_31}]), "return");
                                                        return (_return_31); 
                                                      }()), function (idx) {
                                                        var ctx_23 = ctx_push(ctx_22, [{key: "idx", val: idx}]);
                                                        log_event("MLInterpreter.js", 78, ctx_23, "enter");
                                                        var _return_36 = (function () {
                                                          log_event("MLInterpreter.js", 76, ctx_23, "call");
                                                          var _return_35 = 
                                                          Unsafe.bind(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 70, ctx_23, "call");
                                                              var _return_32 = 
                                                              Vector.find(s,
                                                                idx);
                                                              log_event("MLInterpreter.js", 69, ctx_push(ctx_23, [{key: "#RETURN_VALUE#", val: _return_32}]), "return");
                                                              return (_return_32); 
                                                            }()),
                                                            function (b) {
                                                              var ctx_24 = ctx_push(ctx_23, [{key: "b", val: b}]);
                                                              log_event("MLInterpreter.js", 74, ctx_24, "enter");
                                                              var _return_34 = (function () {
                                                                log_event("MLInterpreter.js", 72, ctx_24, "call");
                                                                var _return_33 = 
                                                                value_of(s,
                                                                  ctx, b);
                                                                log_event("MLInterpreter.js", 71, ctx_push(ctx_24, [{key: "#RETURN_VALUE#", val: _return_33}]), "return");
                                                                return (_return_33); 
                                                              }())
                                                              ;
                                                              log_event("MLInterpreter.js", 73, ctx_push(ctx_24, [{key: "#RETURN_VALUE#", val: _return_34}]), "return");
                                                              return (_return_34); 
                                                            });
                                                          log_event("MLInterpreter.js", 75, ctx_push(ctx_23, [{key: "#RETURN_VALUE#", val: _return_35}]), "return");
                                                          return (_return_35); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 77, ctx_push(ctx_23, [{key: "#RETURN_VALUE#", val: _return_36}]), "return");
                                                        return (_return_36); 
                                                      });
                                   log_event("MLInterpreter.js", 79, ctx_push(ctx_22, [{key: "#RETURN_VALUE#", val: _return_37}]), "return");
                                   return (_return_37); 
                                 }())
                                 ;
                                 log_event("MLInterpreter.js", 81, ctx_push(ctx_22, [{key: "#RETURN_VALUE#", val: _return_38}]), "return");
                                 return (_return_38); 
                               default:log_event("MLInterpreter.js", 86, ctx_21, "case");
                               
                                 var _return_40 = (function () {
                                   log_event("MLInterpreter.js", 84, ctx_21, "call");
                                   var _return_39 = Unsafe.error(
                                                      "Try to get attribute from non-module value");
                                   log_event("MLInterpreter.js", 83, ctx_push(ctx_21, [{key: "#RETURN_VALUE#", val: _return_39}]), "return");
                                   return (_return_39); 
                                 }())
                                 ;
                                 log_event("MLInterpreter.js", 85, ctx_push(ctx_21, [{key: "#RETURN_VALUE#", val: _return_40}]), "return");
                                 return (_return_40); 
                             }
                             });
        log_event("MLInterpreter.js", 89, ctx_push(ctx_20, [{key: "#RETURN_VALUE#", val: _return_41}]), "return");
        return (_return_41); 
      }())
      ;
      log_event("MLInterpreter.js", 91, ctx_push(ctx_20, [{key: "#RETURN_VALUE#", val: _return_42}]), "return");
      return (_return_42); 
  }
  
};

var run_expression = function (s, ctx, _term_) {
  var ctx_25 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "_term_", val: _term_}]);
  log_event("MLInterpreter.js", 657, ctx_25, "enter");
  log_event("MLInterpreter.js", 656, ctx_25, "switch");
  switch (_term_.tag) {
    case "Expression_constant":
      var c = _term_.constant;var ctx_26 = ctx_push(ctx_25, [{key: "c", val: c}]);
    log_event("MLInterpreter.js", 100, ctx_26, "case");
    
      var _return_45 = (function () {
        log_event("MLInterpreter.js", 98, ctx_26, "call");
        var _return_44 = Unsafe.box((function () {
                             log_event("MLInterpreter.js", 96, ctx_26, "call");
                             var _return_43 = run_constant(c);
                             log_event("MLInterpreter.js", 95, ctx_push(ctx_26, [{key: "#RETURN_VALUE#", val: _return_43}]), "return");
                             return (_return_43); }()));
        log_event("MLInterpreter.js", 97, ctx_push(ctx_26, [{key: "#RETURN_VALUE#", val: _return_44}]), "return");
        return (_return_44); 
      }())
      ;
      log_event("MLInterpreter.js", 99, ctx_push(ctx_26, [{key: "#RETURN_VALUE#", val: _return_45}]), "return");
      return (_return_45); 
    case "Expression_ident":
      var id = _term_.id;var ctx_27 = ctx_push(ctx_25, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 104, ctx_27, "case");
    
      var _return_47 = (function () {
        log_event("MLInterpreter.js", 102, ctx_27, "call");
        var _return_46 = run_ident(s, ctx, id);
        log_event("MLInterpreter.js", 101, ctx_push(ctx_27, [{key: "#RETURN_VALUE#", val: _return_46}]), "return");
        return (_return_46); 
      }())
      ;
      log_event("MLInterpreter.js", 103, ctx_push(ctx_27, [{key: "#RETURN_VALUE#", val: _return_47}]), "return");
      return (_return_47); 
    case "Expression_let":
      var is_rec = _term_.is_rec, patts = _term_.ids, exp_ary = _term_.exps,
        e2 = _term_.expr;var ctx_28 = ctx_push(ctx_25, [{key: "is_rec", val: is_rec}, {key: "patts", val: patts}, {key: "exp_ary", val: exp_ary}, {key: "e2", val: e2}]);
    log_event("MLInterpreter.js", 180, ctx_28, "case");
    
      log_event("MLInterpreter.js", 179, ctx_28, "if");
      if (is_rec) {
        var prealloc = function (p) {
          var ctx_36 = ctx_push(ctx_28, [{key: "p", val: p}]);
          log_event("MLInterpreter.js", 146, ctx_36, "enter");
          log_event("MLInterpreter.js", 145, ctx_36, "switch");
          switch (p.tag) {
            case "Pattern_var":
              var id = p.id;var ctx_37 = ctx_push(ctx_36, [{key: "id", val: id}]);
            log_event("MLInterpreter.js", 140, ctx_37, "case");
            
              var _return_64 = (function () {
                log_event("MLInterpreter.js", 138, ctx_37, "call");
                var _return_63 = Unsafe.box(id);
                log_event("MLInterpreter.js", 137, ctx_push(ctx_37, [{key: "#RETURN_VALUE#", val: _return_63}]), "return");
                return (_return_63); 
              }())
              ;
              log_event("MLInterpreter.js", 139, ctx_push(ctx_37, [{key: "#RETURN_VALUE#", val: _return_64}]), "return");
              return (_return_64); 
            default:log_event("MLInterpreter.js", 144, ctx_36, "case");
            
              var _return_66 = (function () {
                log_event("MLInterpreter.js", 142, ctx_36, "call");
                var _return_65 = Unsafe.error(
                                   "Used pattern other than variable in recursive definition");
                log_event("MLInterpreter.js", 141, ctx_push(ctx_36, [{key: "#RETURN_VALUE#", val: _return_65}]), "return");
                return (_return_65); 
              }())
              ;
              log_event("MLInterpreter.js", 143, ctx_push(ctx_36, [{key: "#RETURN_VALUE#", val: _return_66}]), "return");
              return (_return_66); 
          }
          
        };
        var ctx_38 = ctx_push(ctx_28, [{key: "prealloc", val: prealloc}]);
        log_event("MLInterpreter.js", 178, ctx_38, "let");
        var exps = (function () {
          log_event("MLInterpreter.js", 148, ctx_38, "call");
          var _return_67 = MLList.of_array(exp_ary);
          log_event("MLInterpreter.js", 147, ctx_push(ctx_38, [{key: "#RETURN_VALUE#", val: _return_67}]), "return");
          return (_return_67); 
        }())
        ;
        var ctx_39 = ctx_push(ctx_38, [{key: "exps", val: exps}]);
        log_event("MLInterpreter.js", 177, ctx_39, "let");
        var _return_79 = (function () {
          log_event("MLInterpreter.js", 175, ctx_39, "call");
          var _return_78 = Unsafe.bind((function () {
                               log_event("MLInterpreter.js", 152, ctx_39, "call");
                               var _return_69 = MLArray.sequence_unsafe(
                                                  (function () {
                                                    log_event("MLInterpreter.js", 150, ctx_39, "call");
                                                    var _return_68 = 
                                                    MLArray.map(prealloc,
                                                      patts);
                                                    log_event("MLInterpreter.js", 149, ctx_push(ctx_39, [{key: "#RETURN_VALUE#", val: _return_68}]), "return");
                                                    return (_return_68); }())
                                                  );
                               log_event("MLInterpreter.js", 151, ctx_push(ctx_39, [{key: "#RETURN_VALUE#", val: _return_69}]), "return");
                               return (_return_69); }()), function (id_ary) {
                               var ctx_40 = ctx_push(ctx_39, [{key: "id_ary", val: id_ary}]);
                               log_event("MLInterpreter.js", 173, ctx_40, "enter");
                               var ids = (function () {
                                 log_event("MLInterpreter.js", 154, ctx_40, "call");
                                 var _return_70 = MLList.of_array(id_ary);
                                 log_event("MLInterpreter.js", 153, ctx_push(ctx_40, [{key: "#RETURN_VALUE#", val: _return_70}]), "return");
                                 return (_return_70); 
                               }())
                               ;
                               var ctx_41 = ctx_push(ctx_40, [{key: "ids", val: ids}]);
                               log_event("MLInterpreter.js", 172, ctx_41, "let");
                               var func = function (ctx, id, exp) {
                                 var ctx_42 = ctx_push(ctx_41, [{key: "ctx", val: ctx}, {key: "id", val: id}, {key: "exp", val: exp}]);
                                 log_event("MLInterpreter.js", 164, ctx_42, "enter");
                                 var idx = (function () {
                                   log_event("MLInterpreter.js", 156, ctx_42, "call");
                                   var _return_71 = Vector.append(s,
                                                      Prealloc(exp, ctx));
                                   log_event("MLInterpreter.js", 155, ctx_push(ctx_42, [{key: "#RETURN_VALUE#", val: _return_71}]), "return");
                                   return (_return_71); 
                                 }())
                                 ;
                                 var ctx_43 = ctx_push(ctx_42, [{key: "idx", val: idx}]);
                                 log_event("MLInterpreter.js", 163, ctx_43, "let");
                                 var ctx$ = (function () {
                                   log_event("MLInterpreter.js", 158, ctx_43, "call");
                                   var _return_72 = ExecutionContext.add(id,
                                                      idx, ctx);
                                   log_event("MLInterpreter.js", 157, ctx_push(ctx_43, [{key: "#RETURN_VALUE#", val: _return_72}]), "return");
                                   return (_return_72); 
                                 }())
                                 ;
                                 var ctx_44 = ctx_push(ctx_43, [{key: "ctx$", val: ctx$}]);
                                 log_event("MLInterpreter.js", 162, ctx_44, "let");
                                 (function () {
                                   log_event("MLInterpreter.js", 161, ctx_44, "call");
                                   var _return_74 = Vector.set(s, idx,
                                                      Prealloc(exp, ctx$));
                                   log_event("MLInterpreter.js", 160, ctx_push(ctx_44, [{key: "#RETURN_VALUE#", val: _return_74}]), "return");
                                   return (_return_74); 
                                 }())
                                 ;
                                 var _return_73 = ctx$;
                                 log_event("MLInterpreter.js", 159, ctx_push(ctx_44, [{key: "#RETURN_VALUE#", val: _return_73}]), "return");
                                 return (_return_73); 
                                 
                                 
                               };
                               var ctx_45 = ctx_push(ctx_41, [{key: "func", val: func}]);
                               log_event("MLInterpreter.js", 171, ctx_45, "let");
                               var ctx$ = (function () {
                                 log_event("MLInterpreter.js", 166, ctx_45, "call");
                                 var _return_75 = MLList.foldl2(func, ctx,
                                                    ids, exps);
                                 log_event("MLInterpreter.js", 165, ctx_push(ctx_45, [{key: "#RETURN_VALUE#", val: _return_75}]), "return");
                                 return (_return_75); 
                               }())
                               ;
                               var ctx_46 = ctx_push(ctx_45, [{key: "ctx$", val: ctx$}]);
                               log_event("MLInterpreter.js", 170, ctx_46, "let");
                               var _return_77 = (function () {
                                 log_event("MLInterpreter.js", 168, ctx_46, "call");
                                 var _return_76 = run_expression(s, ctx$, e2);
                                 log_event("MLInterpreter.js", 167, ctx_push(ctx_46, [{key: "#RETURN_VALUE#", val: _return_76}]), "return");
                                 return (_return_76); 
                               }())
                               ;
                               log_event("MLInterpreter.js", 169, ctx_push(ctx_46, [{key: "#RETURN_VALUE#", val: _return_77}]), "return");
                               return (_return_77); 
                               
                               
                               });
          log_event("MLInterpreter.js", 174, ctx_push(ctx_39, [{key: "#RETURN_VALUE#", val: _return_78}]), "return");
          return (_return_78); 
        }())
        ;
        log_event("MLInterpreter.js", 176, ctx_push(ctx_39, [{key: "#RETURN_VALUE#", val: _return_79}]), "return");
        return (_return_79); 
        
        
      } else {
        var func = function (ctx_nsf, patt, exp) {
          var ctx_29 = ctx_push(ctx_28, [{key: "ctx_nsf", val: ctx_nsf}, {key: "patt", val: patt}, {key: "exp", val: exp}]);
          log_event("MLInterpreter.js", 118, ctx_29, "enter");
          var _return_54 = (function () {
            log_event("MLInterpreter.js", 116, ctx_29, "call");
            var _return_53 = Unsafe.bind(ctx_nsf, function (ctx) {
                                 var ctx_30 = ctx_push(ctx_29, [{key: "ctx", val: ctx}]);
                                 log_event("MLInterpreter.js", 114, ctx_30, "enter");
                                 var _return_52 = (function () {
                                   log_event("MLInterpreter.js", 112, ctx_30, "call");
                                   var _return_51 = Unsafe.bind(
                                                      (function () {
                                                        log_event("MLInterpreter.js", 106, ctx_30, "call");
                                                        var _return_48 = 
                                                        run_expression(s,
                                                          ctx, exp);
                                                        log_event("MLInterpreter.js", 105, ctx_push(ctx_30, [{key: "#RETURN_VALUE#", val: _return_48}]), "return");
                                                        return (_return_48); 
                                                      }()), function (v) {
                                                        var ctx_31 = ctx_push(ctx_30, [{key: "v", val: v}]);
                                                        log_event("MLInterpreter.js", 110, ctx_31, "enter");
                                                        var _return_50 = (function () {
                                                          log_event("MLInterpreter.js", 108, ctx_31, "call");
                                                          var _return_49 = 
                                                          pattern_match(s,
                                                            ctx, v, patt);
                                                          log_event("MLInterpreter.js", 107, ctx_push(ctx_31, [{key: "#RETURN_VALUE#", val: _return_49}]), "return");
                                                          return (_return_49); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 109, ctx_push(ctx_31, [{key: "#RETURN_VALUE#", val: _return_50}]), "return");
                                                        return (_return_50); 
                                                      });
                                   log_event("MLInterpreter.js", 111, ctx_push(ctx_30, [{key: "#RETURN_VALUE#", val: _return_51}]), "return");
                                   return (_return_51); 
                                 }())
                                 ;
                                 log_event("MLInterpreter.js", 113, ctx_push(ctx_30, [{key: "#RETURN_VALUE#", val: _return_52}]), "return");
                                 return (_return_52); });
            log_event("MLInterpreter.js", 115, ctx_push(ctx_29, [{key: "#RETURN_VALUE#", val: _return_53}]), "return");
            return (_return_53); 
          }())
          ;
          log_event("MLInterpreter.js", 117, ctx_push(ctx_29, [{key: "#RETURN_VALUE#", val: _return_54}]), "return");
          return (_return_54); 
        };
        var ctx_32 = ctx_push(ctx_28, [{key: "func", val: func}]);
        log_event("MLInterpreter.js", 136, ctx_32, "let");
        var patt_list = (function () {
          log_event("MLInterpreter.js", 120, ctx_32, "call");
          var _return_55 = MLList.of_array(patts);
          log_event("MLInterpreter.js", 119, ctx_push(ctx_32, [{key: "#RETURN_VALUE#", val: _return_55}]), "return");
          return (_return_55); 
        }())
        ;
        var ctx_33 = ctx_push(ctx_32, [{key: "patt_list", val: patt_list}]);
        log_event("MLInterpreter.js", 135, ctx_33, "let");
        var exps = (function () {
          log_event("MLInterpreter.js", 122, ctx_33, "call");
          var _return_56 = MLList.of_array(exp_ary);
          log_event("MLInterpreter.js", 121, ctx_push(ctx_33, [{key: "#RETURN_VALUE#", val: _return_56}]), "return");
          return (_return_56); 
        }())
        ;
        var ctx_34 = ctx_push(ctx_33, [{key: "exps", val: exps}]);
        log_event("MLInterpreter.js", 134, ctx_34, "let");
        var _return_62 = (function () {
          log_event("MLInterpreter.js", 132, ctx_34, "call");
          var _return_61 = Unsafe.bind((function () {
                               log_event("MLInterpreter.js", 126, ctx_34, "call");
                               var _return_58 = MLList.foldl2(func,
                                                  (function () {
                                                    log_event("MLInterpreter.js", 124, ctx_34, "call");
                                                    var _return_57 = 
                                                    Unsafe.box(ctx);
                                                    log_event("MLInterpreter.js", 123, ctx_push(ctx_34, [{key: "#RETURN_VALUE#", val: _return_57}]), "return");
                                                    return (_return_57); }())
                                                  , patt_list, exps);
                               log_event("MLInterpreter.js", 125, ctx_push(ctx_34, [{key: "#RETURN_VALUE#", val: _return_58}]), "return");
                               return (_return_58); }()), function (ctx$) {
                               var ctx_35 = ctx_push(ctx_34, [{key: "ctx$", val: ctx$}]);
                               log_event("MLInterpreter.js", 130, ctx_35, "enter");
                               var _return_60 = (function () {
                                 log_event("MLInterpreter.js", 128, ctx_35, "call");
                                 var _return_59 = run_expression(s, ctx$, e2);
                                 log_event("MLInterpreter.js", 127, ctx_push(ctx_35, [{key: "#RETURN_VALUE#", val: _return_59}]), "return");
                                 return (_return_59); 
                               }())
                               ;
                               log_event("MLInterpreter.js", 129, ctx_push(ctx_35, [{key: "#RETURN_VALUE#", val: _return_60}]), "return");
                               return (_return_60); });
          log_event("MLInterpreter.js", 131, ctx_push(ctx_34, [{key: "#RETURN_VALUE#", val: _return_61}]), "return");
          return (_return_61); 
        }())
        ;
        log_event("MLInterpreter.js", 133, ctx_push(ctx_34, [{key: "#RETURN_VALUE#", val: _return_62}]), "return");
        return (_return_62); 
        
        
        
      }
    case "Expression_function":
      var cases = _term_.cases;var ctx_47 = ctx_push(ctx_25, [{key: "cases", val: cases}]);
    log_event("MLInterpreter.js", 191, ctx_47, "case");
    
      var func = function (value) {
        var ctx_48 = ctx_push(ctx_47, [{key: "value", val: value}]);
        log_event("MLInterpreter.js", 186, ctx_48, "enter");
        var _return_82 = (function () {
          log_event("MLInterpreter.js", 184, ctx_48, "call");
          var _return_81 = pattern_match_many(s, ctx, value, (function () {
                               log_event("MLInterpreter.js", 182, ctx_48, "call");
                               var _return_80 = MLList.of_array(cases);
                               log_event("MLInterpreter.js", 181, ctx_push(ctx_48, [{key: "#RETURN_VALUE#", val: _return_80}]), "return");
                               return (_return_80); }()));
          log_event("MLInterpreter.js", 183, ctx_push(ctx_48, [{key: "#RETURN_VALUE#", val: _return_81}]), "return");
          return (_return_81); 
        }())
        ;
        log_event("MLInterpreter.js", 185, ctx_push(ctx_48, [{key: "#RETURN_VALUE#", val: _return_82}]), "return");
        return (_return_82); 
      };
      var ctx_49 = ctx_push(ctx_47, [{key: "func", val: func}]);
      log_event("MLInterpreter.js", 190, ctx_49, "let");
      var _return_84 = (function () {
        log_event("MLInterpreter.js", 188, ctx_49, "call");
        var _return_83 = Unsafe.box(Value_fun(func));
        log_event("MLInterpreter.js", 187, ctx_push(ctx_49, [{key: "#RETURN_VALUE#", val: _return_83}]), "return");
        return (_return_83); 
      }())
      ;
      log_event("MLInterpreter.js", 189, ctx_push(ctx_49, [{key: "#RETURN_VALUE#", val: _return_84}]), "return");
      return (_return_84); 
      
    case "Expression_apply":
      var fe = _term_.func, argse = _term_.args;var ctx_50 = ctx_push(ctx_25, [{key: "fe", val: fe}, {key: "argse", val: argse}]);
    log_event("MLInterpreter.js", 236, ctx_50, "case");
    
      var apply_fun = function (func, ctx, arg, args) {
        var ctx_51 = ctx_push(ctx_50, [{key: "func", val: func}, {key: "ctx", val: ctx}, {key: "arg", val: arg}, {key: "args", val: args}]);
        log_event("MLInterpreter.js", 207, ctx_51, "enter");
        var _return_92 = (function () {
          log_event("MLInterpreter.js", 205, ctx_51, "call");
          var _return_91 = Unsafe.bind((function () {
                               log_event("MLInterpreter.js", 193, ctx_51, "call");
                               var _return_85 = run_expression(s, ctx, arg);
                               log_event("MLInterpreter.js", 192, ctx_push(ctx_51, [{key: "#RETURN_VALUE#", val: _return_85}]), "return");
                               return (_return_85); }()), function (v) {
                               var ctx_52 = ctx_push(ctx_51, [{key: "v", val: v}]);
                               log_event("MLInterpreter.js", 203, ctx_52, "enter");
                               var _return_90 = (function () {
                                 log_event("MLInterpreter.js", 201, ctx_52, "call");
                                 var _return_89 = Unsafe.bind((function () {
                                                      log_event("MLInterpreter.js", 195, ctx_52, "call");
                                                      var _return_86 = 
                                                      func(v);
                                                      log_event("MLInterpreter.js", 194, ctx_push(ctx_52, [{key: "#RETURN_VALUE#", val: _return_86}]), "return");
                                                      return (_return_86); 
                                                    }()), function (res) {
                                                      var ctx_53 = ctx_push(ctx_52, [{key: "res", val: res}]);
                                                      log_event("MLInterpreter.js", 199, ctx_53, "enter");
                                                      var _return_88 = (function () {
                                                        log_event("MLInterpreter.js", 197, ctx_53, "call");
                                                        var _return_87 = 
                                                        run_apply(res, args);
                                                        log_event("MLInterpreter.js", 196, ctx_push(ctx_53, [{key: "#RETURN_VALUE#", val: _return_87}]), "return");
                                                        return (_return_87); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 198, ctx_push(ctx_53, [{key: "#RETURN_VALUE#", val: _return_88}]), "return");
                                                      return (_return_88); });
                                 log_event("MLInterpreter.js", 200, ctx_push(ctx_52, [{key: "#RETURN_VALUE#", val: _return_89}]), "return");
                                 return (_return_89); 
                               }())
                               ;
                               log_event("MLInterpreter.js", 202, ctx_push(ctx_52, [{key: "#RETURN_VALUE#", val: _return_90}]), "return");
                               return (_return_90); });
          log_event("MLInterpreter.js", 204, ctx_push(ctx_51, [{key: "#RETURN_VALUE#", val: _return_91}]), "return");
          return (_return_91); 
        }())
        ;
        log_event("MLInterpreter.js", 206, ctx_push(ctx_51, [{key: "#RETURN_VALUE#", val: _return_92}]), "return");
        return (_return_92); 
      };
var run_apply = function (func, args) {
        var ctx_54 = ctx_push(ctx_50, [{key: "func", val: func}, {key: "args", val: args}]);
        log_event("MLInterpreter.js", 223, ctx_54, "enter");
        log_event("MLInterpreter.js", 222, ctx_54, "switch");
        switch (args.tag) {
          case "[]":log_event("MLInterpreter.js", 211, ctx_54, "case");
          
            var _return_94 = (function () {
              log_event("MLInterpreter.js", 209, ctx_54, "call");
              var _return_93 = Unsafe.box(func);
              log_event("MLInterpreter.js", 208, ctx_push(ctx_54, [{key: "#RETURN_VALUE#", val: _return_93}]), "return");
              return (_return_93); 
            }())
            ;
            log_event("MLInterpreter.js", 210, ctx_push(ctx_54, [{key: "#RETURN_VALUE#", val: _return_94}]), "return");
            return (_return_94); 
          case "::":
            var x = args.head, xs = args.tail;var ctx_55 = ctx_push(ctx_54, [{key: "x", val: x}, {key: "xs", val: xs}]);
          log_event("MLInterpreter.js", 221, ctx_55, "case");
          
            log_event("MLInterpreter.js", 220, ctx_55, "switch");
            switch (func.tag) {
              case "Value_fun":
                var f = func.value;var ctx_56 = ctx_push(ctx_55, [{key: "f", val: f}]);
              log_event("MLInterpreter.js", 215, ctx_56, "case");
              
                var _return_96 = (function () {
                  log_event("MLInterpreter.js", 213, ctx_56, "call");
                  var _return_95 = apply_fun(f, ctx, x, xs);
                  log_event("MLInterpreter.js", 212, ctx_push(ctx_56, [{key: "#RETURN_VALUE#", val: _return_95}]), "return");
                  return (_return_95); 
                }())
                ;
                log_event("MLInterpreter.js", 214, ctx_push(ctx_56, [{key: "#RETURN_VALUE#", val: _return_96}]), "return");
                return (_return_96); 
              default:log_event("MLInterpreter.js", 219, ctx_55, "case");
              
                var _return_98 = (function () {
                  log_event("MLInterpreter.js", 217, ctx_55, "call");
                  var _return_97 = Unsafe.error("Expected a function value");
                  log_event("MLInterpreter.js", 216, ctx_push(ctx_55, [{key: "#RETURN_VALUE#", val: _return_97}]), "return");
                  return (_return_97); 
                }())
                ;
                log_event("MLInterpreter.js", 218, ctx_push(ctx_55, [{key: "#RETURN_VALUE#", val: _return_98}]), "return");
                return (_return_98); 
            }
            
        }
        
      };
      var ctx_57 = ctx_push(ctx_50, [{key: "apply_fun", val: apply_fun}, {key: "run_apply", val: run_apply}]);
      log_event("MLInterpreter.js", 235, ctx_57, "let");
      var _return_104 = (function () {
        log_event("MLInterpreter.js", 233, ctx_57, "call");
        var _return_103 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 225, ctx_57, "call");
                              var _return_99 = run_expression(s, ctx, fe);
                              log_event("MLInterpreter.js", 224, ctx_push(ctx_57, [{key: "#RETURN_VALUE#", val: _return_99}]), "return");
                              return (_return_99); }()), function (func) {
                              var ctx_58 = ctx_push(ctx_57, [{key: "func", val: func}]);
                              log_event("MLInterpreter.js", 231, ctx_58, "enter");
                              var _return_102 = (function () {
                                log_event("MLInterpreter.js", 229, ctx_58, "call");
                                var _return_101 = run_apply(func,
                                                    (function () {
                                                      log_event("MLInterpreter.js", 227, ctx_58, "call");
                                                      var _return_100 = 
                                                      MLList.of_array(argse);
                                                      log_event("MLInterpreter.js", 226, ctx_push(ctx_58, [{key: "#RETURN_VALUE#", val: _return_100}]), "return");
                                                      return (_return_100); 
                                                    }()));
                                log_event("MLInterpreter.js", 228, ctx_push(ctx_58, [{key: "#RETURN_VALUE#", val: _return_101}]), "return");
                                return (_return_101); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 230, ctx_push(ctx_58, [{key: "#RETURN_VALUE#", val: _return_102}]), "return");
                              return (_return_102); });
        log_event("MLInterpreter.js", 232, ctx_push(ctx_57, [{key: "#RETURN_VALUE#", val: _return_103}]), "return");
        return (_return_103); 
      }())
      ;
      log_event("MLInterpreter.js", 234, ctx_push(ctx_57, [{key: "#RETURN_VALUE#", val: _return_104}]), "return");
      return (_return_104); 
      
    case "Expression_tuple":
      var tuple = _term_.components;var ctx_59 = ctx_push(ctx_25, [{key: "tuple", val: tuple}]);
    log_event("MLInterpreter.js", 253, ctx_59, "case");
    
      var value_nsfs = (function () {
        log_event("MLInterpreter.js", 242, ctx_59, "call");
        var _return_107 = MLArray.map(function (e) {
                              var ctx_60 = ctx_push(ctx_59, [{key: "e", val: e}]);
                              log_event("MLInterpreter.js", 240, ctx_60, "enter");
                              var _return_106 = (function () {
                                log_event("MLInterpreter.js", 238, ctx_60, "call");
                                var _return_105 = run_expression(s, ctx, e);
                                log_event("MLInterpreter.js", 237, ctx_push(ctx_60, [{key: "#RETURN_VALUE#", val: _return_105}]), "return");
                                return (_return_105); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 239, ctx_push(ctx_60, [{key: "#RETURN_VALUE#", val: _return_106}]), "return");
                              return (_return_106); }, tuple);
        log_event("MLInterpreter.js", 241, ctx_push(ctx_59, [{key: "#RETURN_VALUE#", val: _return_107}]), "return");
        return (_return_107); 
      }())
      ;
      var ctx_61 = ctx_push(ctx_59, [{key: "value_nsfs", val: value_nsfs}]);
      log_event("MLInterpreter.js", 252, ctx_61, "let");
      var _return_112 = (function () {
        log_event("MLInterpreter.js", 250, ctx_61, "call");
        var _return_111 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 244, ctx_61, "call");
                              var _return_108 = MLArray.sequence_unsafe(
                                                  value_nsfs);
                              log_event("MLInterpreter.js", 243, ctx_push(ctx_61, [{key: "#RETURN_VALUE#", val: _return_108}]), "return");
                              return (_return_108); }()), function (t) {
                              var ctx_62 = ctx_push(ctx_61, [{key: "t", val: t}]);
                              log_event("MLInterpreter.js", 248, ctx_62, "enter");
                              var _return_110 = (function () {
                                log_event("MLInterpreter.js", 246, ctx_62, "call");
                                var _return_109 = Unsafe.box(Value_tuple(t));
                                log_event("MLInterpreter.js", 245, ctx_push(ctx_62, [{key: "#RETURN_VALUE#", val: _return_109}]), "return");
                                return (_return_109); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 247, ctx_push(ctx_62, [{key: "#RETURN_VALUE#", val: _return_110}]), "return");
                              return (_return_110); });
        log_event("MLInterpreter.js", 249, ctx_push(ctx_61, [{key: "#RETURN_VALUE#", val: _return_111}]), "return");
        return (_return_111); 
      }())
      ;
      log_event("MLInterpreter.js", 251, ctx_push(ctx_61, [{key: "#RETURN_VALUE#", val: _return_112}]), "return");
      return (_return_112); 
      
    case "Expression_array":
      var ary = _term_.elements;var ctx_63 = ctx_push(ctx_25, [{key: "ary", val: ary}]);
    log_event("MLInterpreter.js", 270, ctx_63, "case");
    
      var value_nsfs = (function () {
        log_event("MLInterpreter.js", 259, ctx_63, "call");
        var _return_115 = MLArray.map(function (e) {
                              var ctx_64 = ctx_push(ctx_63, [{key: "e", val: e}]);
                              log_event("MLInterpreter.js", 257, ctx_64, "enter");
                              var _return_114 = (function () {
                                log_event("MLInterpreter.js", 255, ctx_64, "call");
                                var _return_113 = run_expression(s, ctx, e);
                                log_event("MLInterpreter.js", 254, ctx_push(ctx_64, [{key: "#RETURN_VALUE#", val: _return_113}]), "return");
                                return (_return_113); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 256, ctx_push(ctx_64, [{key: "#RETURN_VALUE#", val: _return_114}]), "return");
                              return (_return_114); }, ary);
        log_event("MLInterpreter.js", 258, ctx_push(ctx_63, [{key: "#RETURN_VALUE#", val: _return_115}]), "return");
        return (_return_115); 
      }())
      ;
      var ctx_65 = ctx_push(ctx_63, [{key: "value_nsfs", val: value_nsfs}]);
      log_event("MLInterpreter.js", 269, ctx_65, "let");
      var _return_120 = (function () {
        log_event("MLInterpreter.js", 267, ctx_65, "call");
        var _return_119 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 261, ctx_65, "call");
                              var _return_116 = MLArray.sequence_unsafe(
                                                  value_nsfs);
                              log_event("MLInterpreter.js", 260, ctx_push(ctx_65, [{key: "#RETURN_VALUE#", val: _return_116}]), "return");
                              return (_return_116); }()), function (a) {
                              var ctx_66 = ctx_push(ctx_65, [{key: "a", val: a}]);
                              log_event("MLInterpreter.js", 265, ctx_66, "enter");
                              var _return_118 = (function () {
                                log_event("MLInterpreter.js", 263, ctx_66, "call");
                                var _return_117 = Unsafe.box(Value_array(a));
                                log_event("MLInterpreter.js", 262, ctx_push(ctx_66, [{key: "#RETURN_VALUE#", val: _return_117}]), "return");
                                return (_return_117); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 264, ctx_push(ctx_66, [{key: "#RETURN_VALUE#", val: _return_118}]), "return");
                              return (_return_118); });
        log_event("MLInterpreter.js", 266, ctx_push(ctx_65, [{key: "#RETURN_VALUE#", val: _return_119}]), "return");
        return (_return_119); 
      }())
      ;
      log_event("MLInterpreter.js", 268, ctx_push(ctx_65, [{key: "#RETURN_VALUE#", val: _return_120}]), "return");
      return (_return_120); 
      
    case "Expression_variant":
      var label = _term_.label, expr_opt = _term_.value_opt;var ctx_67 = ctx_push(ctx_25, [{key: "label", val: label}, {key: "expr_opt", val: expr_opt}]);
    log_event("MLInterpreter.js", 289, ctx_67, "case");
    
      var value_nsf = (function () {
        log_event("MLInterpreter.js", 278, ctx_67, "call");
        var _return_124 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 272, ctx_67, "call");
                              var _return_121 = Unsafe.of_option(expr_opt);
                              log_event("MLInterpreter.js", 271, ctx_push(ctx_67, [{key: "#RETURN_VALUE#", val: _return_121}]), "return");
                              return (_return_121); }()), function (e) {
                              var ctx_68 = ctx_push(ctx_67, [{key: "e", val: e}]);
                              log_event("MLInterpreter.js", 276, ctx_68, "enter");
                              var _return_123 = (function () {
                                log_event("MLInterpreter.js", 274, ctx_68, "call");
                                var _return_122 = run_expression(s, ctx, e);
                                log_event("MLInterpreter.js", 273, ctx_push(ctx_68, [{key: "#RETURN_VALUE#", val: _return_122}]), "return");
                                return (_return_122); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 275, ctx_push(ctx_68, [{key: "#RETURN_VALUE#", val: _return_123}]), "return");
                              return (_return_123); });
        log_event("MLInterpreter.js", 277, ctx_push(ctx_67, [{key: "#RETURN_VALUE#", val: _return_124}]), "return");
        return (_return_124); 
      }())
      ;
      var ctx_69 = ctx_push(ctx_67, [{key: "value_nsf", val: value_nsf}]);
      log_event("MLInterpreter.js", 288, ctx_69, "let");
      var value_opt = (function () {
        log_event("MLInterpreter.js", 282, ctx_69, "call");
        var _return_126 = Option.bind(expr_opt, function (e) {
                              var ctx_70 = ctx_push(ctx_69, [{key: "e", val: e}]);
                              log_event("MLInterpreter.js", 280, ctx_70, "enter");
                              var _return_125 = Some(value_nsf);
                              log_event("MLInterpreter.js", 279, ctx_push(ctx_70, [{key: "#RETURN_VALUE#", val: _return_125}]), "return");
                              return (_return_125); });
        log_event("MLInterpreter.js", 281, ctx_push(ctx_69, [{key: "#RETURN_VALUE#", val: _return_126}]), "return");
        return (_return_126); 
      }())
      ;
      var ctx_71 = ctx_push(ctx_69, [{key: "value_opt", val: value_opt}]);
      log_event("MLInterpreter.js", 287, ctx_71, "let");
      var variant = {
        label: label,
        value_opt: value_opt
      };
      var ctx_72 = ctx_push(ctx_71, [{key: "variant", val: variant}]);
      log_event("MLInterpreter.js", 286, ctx_72, "let");
      var _return_128 = (function () {
        log_event("MLInterpreter.js", 284, ctx_72, "call");
        var _return_127 = Unsafe.box(Value_variant(variant));
        log_event("MLInterpreter.js", 283, ctx_push(ctx_72, [{key: "#RETURN_VALUE#", val: _return_127}]), "return");
        return (_return_127); 
      }())
      ;
      log_event("MLInterpreter.js", 285, ctx_push(ctx_72, [{key: "#RETURN_VALUE#", val: _return_128}]), "return");
      return (_return_128); 
      
      
      
    case "Expression_match":
      var loc = _term_.loc, expr = _term_.expr, cases = _term_.cases;var ctx_73 = ctx_push(ctx_25, [{key: "loc", val: loc}, {key: "expr", val: expr}, {key: "cases", val: cases}]);
    log_event("MLInterpreter.js", 295, ctx_73, "case");
    
      var func = Expression_function(loc, cases);
      var ctx_74 = ctx_push(ctx_73, [{key: "func", val: func}]);
      log_event("MLInterpreter.js", 294, ctx_74, "let");
      var app = Expression_apply(loc, func, [expr]);
      var ctx_75 = ctx_push(ctx_74, [{key: "app", val: app}]);
      log_event("MLInterpreter.js", 293, ctx_75, "let");
      var _return_130 = (function () {
        log_event("MLInterpreter.js", 291, ctx_75, "call");
        var _return_129 = run_expression(s, ctx, app);
        log_event("MLInterpreter.js", 290, ctx_push(ctx_75, [{key: "#RETURN_VALUE#", val: _return_129}]), "return");
        return (_return_129); 
      }())
      ;
      log_event("MLInterpreter.js", 292, ctx_push(ctx_75, [{key: "#RETURN_VALUE#", val: _return_130}]), "return");
      return (_return_130); 
      
      
    case "Expression_constructor":
      var ctor = _term_.ctor, args = _term_.args;var ctx_76 = ctx_push(ctx_25, [{key: "ctor", val: ctor}, {key: "args", val: args}]);
    log_event("MLInterpreter.js", 315, ctx_76, "case");
    
      var value_nsfs = (function () {
        log_event("MLInterpreter.js", 301, ctx_76, "call");
        var _return_133 = MLArray.map(function (e) {
                              var ctx_77 = ctx_push(ctx_76, [{key: "e", val: e}]);
                              log_event("MLInterpreter.js", 299, ctx_77, "enter");
                              var _return_132 = (function () {
                                log_event("MLInterpreter.js", 297, ctx_77, "call");
                                var _return_131 = run_expression(s, ctx, e);
                                log_event("MLInterpreter.js", 296, ctx_push(ctx_77, [{key: "#RETURN_VALUE#", val: _return_131}]), "return");
                                return (_return_131); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 298, ctx_push(ctx_77, [{key: "#RETURN_VALUE#", val: _return_132}]), "return");
                              return (_return_132); }, args);
        log_event("MLInterpreter.js", 300, ctx_push(ctx_76, [{key: "#RETURN_VALUE#", val: _return_133}]), "return");
        return (_return_133); 
      }())
      ;
      var ctx_78 = ctx_push(ctx_76, [{key: "value_nsfs", val: value_nsfs}]);
      log_event("MLInterpreter.js", 314, ctx_78, "let");
      var _return_139 = (function () {
        log_event("MLInterpreter.js", 312, ctx_78, "call");
        var _return_138 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 303, ctx_78, "call");
                              var _return_134 = MLArray.sequence_unsafe(
                                                  value_nsfs);
                              log_event("MLInterpreter.js", 302, ctx_push(ctx_78, [{key: "#RETURN_VALUE#", val: _return_134}]), "return");
                              return (_return_134); }()), function (values) {
                              var ctx_79 = ctx_push(ctx_78, [{key: "values", val: values}]);
                              log_event("MLInterpreter.js", 310, ctx_79, "enter");
                              var sum = Sumtype({
                                            constructor: (function () {
                                              log_event("MLInterpreter.js", 305, ctx_79, "call");
                                              var _return_135 = string_of_identifier(
                                                                  ctor);
                                              log_event("MLInterpreter.js", 304, ctx_push(ctx_79, [{key: "#RETURN_VALUE#", val: _return_135}]), "return");
                                              return (_return_135); 
                                            }())
                                            ,
                                            args: values});
                              var ctx_80 = ctx_push(ctx_79, [{key: "sum", val: sum}]);
                              log_event("MLInterpreter.js", 309, ctx_80, "let");
                              var _return_137 = (function () {
                                log_event("MLInterpreter.js", 307, ctx_80, "call");
                                var _return_136 = Unsafe.box(
                                                    Value_custom(sum));
                                log_event("MLInterpreter.js", 306, ctx_push(ctx_80, [{key: "#RETURN_VALUE#", val: _return_136}]), "return");
                                return (_return_136); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 308, ctx_push(ctx_80, [{key: "#RETURN_VALUE#", val: _return_137}]), "return");
                              return (_return_137); 
                              });
        log_event("MLInterpreter.js", 311, ctx_push(ctx_78, [{key: "#RETURN_VALUE#", val: _return_138}]), "return");
        return (_return_138); 
      }())
      ;
      log_event("MLInterpreter.js", 313, ctx_push(ctx_78, [{key: "#RETURN_VALUE#", val: _return_139}]), "return");
      return (_return_139); 
      
    case "Expression_record":
      var bindings = _term_.bindings, base_opt = _term_.base;var ctx_81 = ctx_push(ctx_25, [{key: "bindings", val: bindings}, {key: "base_opt", val: base_opt}]);
    log_event("MLInterpreter.js", 382, ctx_81, "case");
    
      var add_to_map = function (map_nsf, binding) {
        var ctx_82 = ctx_push(ctx_81, [{key: "map_nsf", val: map_nsf}, {key: "binding", val: binding}]);
        log_event("MLInterpreter.js", 334, ctx_82, "enter");
        var _return_148 = (function () {
          log_event("MLInterpreter.js", 332, ctx_82, "call");
          var _return_147 = Unsafe.bind(map_nsf, function (map) {
                                var ctx_83 = ctx_push(ctx_82, [{key: "map", val: map}]);
                                log_event("MLInterpreter.js", 330, ctx_83, "enter");
                                var _return_146 = (function () {
                                  log_event("MLInterpreter.js", 328, ctx_83, "call");
                                  var _return_145 = Unsafe.bind(
                                                      (function () {
                                                        log_event("MLInterpreter.js", 317, ctx_83, "call");
                                                        var _return_140 = 
                                                        run_expression(s,
                                                          ctx, binding.expr);
                                                        log_event("MLInterpreter.js", 316, ctx_push(ctx_83, [{key: "#RETURN_VALUE#", val: _return_140}]), "return");
                                                        return (_return_140); 
                                                      }()),
                                                      function (value) {
                                                        var ctx_84 = ctx_push(ctx_83, [{key: "value", val: value}]);
                                                        log_event("MLInterpreter.js", 326, ctx_84, "enter");
                                                        var idx = (function () {
                                                          log_event("MLInterpreter.js", 319, ctx_84, "call");
                                                          var _return_141 = 
                                                          Vector.append(s,
                                                            Normal(value));
                                                          log_event("MLInterpreter.js", 318, ctx_push(ctx_84, [{key: "#RETURN_VALUE#", val: _return_141}]), "return");
                                                          return (_return_141); 
                                                        }())
                                                        ;
                                                        var ctx_85 = ctx_push(ctx_84, [{key: "idx", val: idx}]);
                                                        log_event("MLInterpreter.js", 325, ctx_85, "let");
                                                        var _return_144 = (function () {
                                                          log_event("MLInterpreter.js", 323, ctx_85, "call");
                                                          var _return_143 = 
                                                          Unsafe.box(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 321, ctx_85, "call");
                                                              var _return_142 = 
                                                              Map.add(
                                                                binding.name,
                                                                idx, map);
                                                              log_event("MLInterpreter.js", 320, ctx_push(ctx_85, [{key: "#RETURN_VALUE#", val: _return_142}]), "return");
                                                              return (_return_142); 
                                                            }()));
                                                          log_event("MLInterpreter.js", 322, ctx_push(ctx_85, [{key: "#RETURN_VALUE#", val: _return_143}]), "return");
                                                          return (_return_143); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 324, ctx_push(ctx_85, [{key: "#RETURN_VALUE#", val: _return_144}]), "return");
                                                        return (_return_144); 
                                                        });
                                  log_event("MLInterpreter.js", 327, ctx_push(ctx_83, [{key: "#RETURN_VALUE#", val: _return_145}]), "return");
                                  return (_return_145); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 329, ctx_push(ctx_83, [{key: "#RETURN_VALUE#", val: _return_146}]), "return");
                                return (_return_146); });
          log_event("MLInterpreter.js", 331, ctx_push(ctx_82, [{key: "#RETURN_VALUE#", val: _return_147}]), "return");
          return (_return_147); 
        }())
        ;
        log_event("MLInterpreter.js", 333, ctx_push(ctx_82, [{key: "#RETURN_VALUE#", val: _return_148}]), "return");
        return (_return_148); 
      };
      var ctx_86 = ctx_push(ctx_81, [{key: "add_to_map", val: add_to_map}]);
      log_event("MLInterpreter.js", 381, ctx_86, "let");
      var string_eq = function (s1, s2) {
        var ctx_87 = ctx_push(ctx_86, [{key: "s1", val: s1}, {key: "s2", val: s2}]);
        log_event("MLInterpreter.js", 340, ctx_87, "enter");
        var _return_151 = (function () {
          log_event("MLInterpreter.js", 338, ctx_87, "call");
          var _return_150 = ((function () {
                              log_event("MLInterpreter.js", 336, ctx_87, "call");
                              var _return_149 = string_compare(s1, s2);
                              log_event("MLInterpreter.js", 335, ctx_push(ctx_87, [{key: "#RETURN_VALUE#", val: _return_149}]), "return");
                              return (_return_149); }()) === 0);
          log_event("MLInterpreter.js", 337, ctx_push(ctx_87, [{key: "#RETURN_VALUE#", val: _return_150}]), "return");
          return (_return_150); 
        }())
        ;
        log_event("MLInterpreter.js", 339, ctx_push(ctx_87, [{key: "#RETURN_VALUE#", val: _return_151}]), "return");
        return (_return_151); 
      };
      var ctx_88 = ctx_push(ctx_86, [{key: "string_eq", val: string_eq}]);
      log_event("MLInterpreter.js", 380, ctx_88, "let");
      var empty_map = (function () {
        log_event("MLInterpreter.js", 344, ctx_88, "call");
        var _return_153 = Map.empty_map(string_eq, function (r) {
                              var ctx_89 = ctx_push(ctx_88, [{key: "r", val: r}]);
                              log_event("MLInterpreter.js", 342, ctx_89, "enter");
                              var _return_152 = r;
                              log_event("MLInterpreter.js", 341, ctx_push(ctx_89, [{key: "#RETURN_VALUE#", val: _return_152}]), "return");
                              return (_return_152); });
        log_event("MLInterpreter.js", 343, ctx_push(ctx_88, [{key: "#RETURN_VALUE#", val: _return_153}]), "return");
        return (_return_153); 
      }())
      ;
      var ctx_90 = ctx_push(ctx_88, [{key: "empty_map", val: empty_map}]);
      log_event("MLInterpreter.js", 379, ctx_90, "let");
      var map_from_value = function (v) {
        var ctx_91 = ctx_push(ctx_90, [{key: "v", val: v}]);
        log_event("MLInterpreter.js", 350, ctx_91, "enter");
        var _return_156 = (function () {
          log_event("MLInterpreter.js", 348, ctx_91, "call");
          var _return_155 = do_record_with_default(v, empty_map,
                              function (r) {
                                var ctx_92 = ctx_push(ctx_91, [{key: "r", val: r}]);
                                log_event("MLInterpreter.js", 346, ctx_92, "enter");
                                var _return_154 = r;
                                log_event("MLInterpreter.js", 345, ctx_push(ctx_92, [{key: "#RETURN_VALUE#", val: _return_154}]), "return");
                                return (_return_154); });
          log_event("MLInterpreter.js", 347, ctx_push(ctx_91, [{key: "#RETURN_VALUE#", val: _return_155}]), "return");
          return (_return_155); 
        }())
        ;
        log_event("MLInterpreter.js", 349, ctx_push(ctx_91, [{key: "#RETURN_VALUE#", val: _return_156}]), "return");
        return (_return_156); 
      };
      var ctx_93 = ctx_push(ctx_90, [{key: "map_from_value", val: map_from_value}]);
      log_event("MLInterpreter.js", 378, ctx_93, "let");
      var base_map = (function () {
        log_event("MLInterpreter.js", 364, ctx_93, "call");
        var _return_163 = Unsafe.do_with_default((function () {
                              log_event("MLInterpreter.js", 352, ctx_93, "call");
                              var _return_157 = Unsafe.of_option(base_opt);
                              log_event("MLInterpreter.js", 351, ctx_push(ctx_93, [{key: "#RETURN_VALUE#", val: _return_157}]), "return");
                              return (_return_157); }()), empty_map,
                            function (base) {
                              var ctx_94 = ctx_push(ctx_93, [{key: "base", val: base}]);
                              log_event("MLInterpreter.js", 362, ctx_94, "enter");
                              var _return_162 = (function () {
                                log_event("MLInterpreter.js", 360, ctx_94, "call");
                                var _return_161 = Unsafe.do_with_default(
                                                    (function () {
                                                      log_event("MLInterpreter.js", 354, ctx_94, "call");
                                                      var _return_158 = 
                                                      run_expression(s, ctx,
                                                        base);
                                                      log_event("MLInterpreter.js", 353, ctx_push(ctx_94, [{key: "#RETURN_VALUE#", val: _return_158}]), "return");
                                                      return (_return_158); 
                                                    }()), empty_map,
                                                    function (v) {
                                                      var ctx_95 = ctx_push(ctx_94, [{key: "v", val: v}]);
                                                      log_event("MLInterpreter.js", 358, ctx_95, "enter");
                                                      var _return_160 = (function () {
                                                        log_event("MLInterpreter.js", 356, ctx_95, "call");
                                                        var _return_159 = 
                                                        map_from_value(v);
                                                        log_event("MLInterpreter.js", 355, ctx_push(ctx_95, [{key: "#RETURN_VALUE#", val: _return_159}]), "return");
                                                        return (_return_159); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 357, ctx_push(ctx_95, [{key: "#RETURN_VALUE#", val: _return_160}]), "return");
                                                      return (_return_160); 
                                                    });
                                log_event("MLInterpreter.js", 359, ctx_push(ctx_94, [{key: "#RETURN_VALUE#", val: _return_161}]), "return");
                                return (_return_161); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 361, ctx_push(ctx_94, [{key: "#RETURN_VALUE#", val: _return_162}]), "return");
                              return (_return_162); });
        log_event("MLInterpreter.js", 363, ctx_push(ctx_93, [{key: "#RETURN_VALUE#", val: _return_163}]), "return");
        return (_return_163); 
      }())
      ;
      var ctx_96 = ctx_push(ctx_93, [{key: "base_map", val: base_map}]);
      log_event("MLInterpreter.js", 377, ctx_96, "let");
      var _return_169 = (function () {
        log_event("MLInterpreter.js", 375, ctx_96, "call");
        var _return_168 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 368, ctx_96, "call");
                              var _return_165 = MLArray.fold(add_to_map,
                                                  (function () {
                                                    log_event("MLInterpreter.js", 366, ctx_96, "call");
                                                    var _return_164 = 
                                                    Unsafe.box(base_map);
                                                    log_event("MLInterpreter.js", 365, ctx_push(ctx_96, [{key: "#RETURN_VALUE#", val: _return_164}]), "return");
                                                    return (_return_164); 
                                                  }()), bindings);
                              log_event("MLInterpreter.js", 367, ctx_push(ctx_96, [{key: "#RETURN_VALUE#", val: _return_165}]), "return");
                              return (_return_165); }()), function (map) {
                              var ctx_97 = ctx_push(ctx_96, [{key: "map", val: map}]);
                              log_event("MLInterpreter.js", 373, ctx_97, "enter");
                              var r = Record(map);
                              var ctx_98 = ctx_push(ctx_97, [{key: "r", val: r}]);
                              log_event("MLInterpreter.js", 372, ctx_98, "let");
                              var _return_167 = (function () {
                                log_event("MLInterpreter.js", 370, ctx_98, "call");
                                var _return_166 = Unsafe.box(Value_custom(r));
                                log_event("MLInterpreter.js", 369, ctx_push(ctx_98, [{key: "#RETURN_VALUE#", val: _return_166}]), "return");
                                return (_return_166); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 371, ctx_push(ctx_98, [{key: "#RETURN_VALUE#", val: _return_167}]), "return");
                              return (_return_167); 
                              });
        log_event("MLInterpreter.js", 374, ctx_push(ctx_96, [{key: "#RETURN_VALUE#", val: _return_168}]), "return");
        return (_return_168); 
      }())
      ;
      log_event("MLInterpreter.js", 376, ctx_push(ctx_96, [{key: "#RETURN_VALUE#", val: _return_169}]), "return");
      return (_return_169); 
      
      
      
      
      
    case "Expression_field":
      var record = _term_.record, fieldname = _term_.fieldname;var ctx_99 = ctx_push(ctx_25, [{key: "record", val: record}, {key: "fieldname", val: fieldname}]);
    log_event("MLInterpreter.js", 408, ctx_99, "case");
    
      var _return_182 = (function () {
        log_event("MLInterpreter.js", 406, ctx_99, "call");
        var _return_181 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 384, ctx_99, "call");
                              var _return_170 = run_expression(s, ctx,
                                                  record);
                              log_event("MLInterpreter.js", 383, ctx_push(ctx_99, [{key: "#RETURN_VALUE#", val: _return_170}]), "return");
                              return (_return_170); }()), function (value) {
                              var ctx_100 = ctx_push(ctx_99, [{key: "value", val: value}]);
                              log_event("MLInterpreter.js", 404, ctx_100, "enter");
                              var _return_180 = (function () {
                                log_event("MLInterpreter.js", 402, ctx_100, "call");
                                var _return_179 = do_record(value,
                                                    function (record) {
                                                      var ctx_101 = ctx_push(ctx_100, [{key: "record", val: record}]);
                                                      log_event("MLInterpreter.js", 400, ctx_101, "enter");
                                                      var _return_178 = (function () {
                                                        log_event("MLInterpreter.js", 398, ctx_101, "call");
                                                        var _return_177 = 
                                                        Unsafe.bind(
                                                          (function () {
                                                            log_event("MLInterpreter.js", 386, ctx_101, "call");
                                                            var _return_171 = 
                                                            Map.find(
                                                              fieldname,
                                                              record);
                                                            log_event("MLInterpreter.js", 385, ctx_push(ctx_101, [{key: "#RETURN_VALUE#", val: _return_171}]), "return");
                                                            return (_return_171); 
                                                          }()),
                                                          function (idx) {
                                                            var ctx_102 = ctx_push(ctx_101, [{key: "idx", val: idx}]);
                                                            log_event("MLInterpreter.js", 396, ctx_102, "enter");
                                                            var _return_176 = (function () {
                                                              log_event("MLInterpreter.js", 394, ctx_102, "call");
                                                              var _return_175 = 
                                                              Unsafe.bind(
                                                                (function () {
                                                                  log_event("MLInterpreter.js", 388, ctx_102, "call");
                                                                  var _return_172 = 
                                                                  Vector.find(
                                                                    s, idx);
                                                                  log_event("MLInterpreter.js", 387, ctx_push(ctx_102, [{key: "#RETURN_VALUE#", val: _return_172}]), "return");
                                                                  return (_return_172); 
                                                                }()),
                                                                function (binding) {
                                                                  var ctx_103 = ctx_push(ctx_102, [{key: "binding", val: binding}]);
                                                                  log_event("MLInterpreter.js", 392, ctx_103, "enter");
                                                                  var _return_174 = (function () {
                                                                    log_event("MLInterpreter.js", 390, ctx_103, "call");
                                                                    var _return_173 = 
                                                                    value_of(
                                                                    s, ctx,
                                                                    binding);
                                                                    log_event("MLInterpreter.js", 389, ctx_push(ctx_103, [{key: "#RETURN_VALUE#", val: _return_173}]), "return");
                                                                    return (_return_173); 
                                                                  }())
                                                                  ;
                                                                  log_event("MLInterpreter.js", 391, ctx_push(ctx_103, [{key: "#RETURN_VALUE#", val: _return_174}]), "return");
                                                                  return (_return_174); 
                                                                });
                                                              log_event("MLInterpreter.js", 393, ctx_push(ctx_102, [{key: "#RETURN_VALUE#", val: _return_175}]), "return");
                                                              return (_return_175); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 395, ctx_push(ctx_102, [{key: "#RETURN_VALUE#", val: _return_176}]), "return");
                                                            return (_return_176); 
                                                          });
                                                        log_event("MLInterpreter.js", 397, ctx_push(ctx_101, [{key: "#RETURN_VALUE#", val: _return_177}]), "return");
                                                        return (_return_177); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 399, ctx_push(ctx_101, [{key: "#RETURN_VALUE#", val: _return_178}]), "return");
                                                      return (_return_178); 
                                                    });
                                log_event("MLInterpreter.js", 401, ctx_push(ctx_100, [{key: "#RETURN_VALUE#", val: _return_179}]), "return");
                                return (_return_179); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 403, ctx_push(ctx_100, [{key: "#RETURN_VALUE#", val: _return_180}]), "return");
                              return (_return_180); });
        log_event("MLInterpreter.js", 405, ctx_push(ctx_99, [{key: "#RETURN_VALUE#", val: _return_181}]), "return");
        return (_return_181); 
      }())
      ;
      log_event("MLInterpreter.js", 407, ctx_push(ctx_99, [{key: "#RETURN_VALUE#", val: _return_182}]), "return");
      return (_return_182); 
    case "Expression_setfield":
      var record = _term_.record, fieldname = _term_.fieldname,
        expr = _term_.expr;var ctx_104 = ctx_push(ctx_25, [{key: "record", val: record}, {key: "fieldname", val: fieldname}, {key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 437, ctx_104, "case");
    
      var _return_196 = (function () {
        log_event("MLInterpreter.js", 435, ctx_104, "call");
        var _return_195 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 410, ctx_104, "call");
                              var _return_183 = run_expression(s, ctx,
                                                  record);
                              log_event("MLInterpreter.js", 409, ctx_push(ctx_104, [{key: "#RETURN_VALUE#", val: _return_183}]), "return");
                              return (_return_183); }()), function (value) {
                              var ctx_105 = ctx_push(ctx_104, [{key: "value", val: value}]);
                              log_event("MLInterpreter.js", 433, ctx_105, "enter");
                              var _return_194 = (function () {
                                log_event("MLInterpreter.js", 431, ctx_105, "call");
                                var _return_193 = do_record(value,
                                                    function (record) {
                                                      var ctx_106 = ctx_push(ctx_105, [{key: "record", val: record}]);
                                                      log_event("MLInterpreter.js", 429, ctx_106, "enter");
                                                      var _return_192 = (function () {
                                                        log_event("MLInterpreter.js", 427, ctx_106, "call");
                                                        var _return_191 = 
                                                        Unsafe.bind(
                                                          (function () {
                                                            log_event("MLInterpreter.js", 412, ctx_106, "call");
                                                            var _return_184 = 
                                                            Map.find(
                                                              fieldname,
                                                              record);
                                                            log_event("MLInterpreter.js", 411, ctx_push(ctx_106, [{key: "#RETURN_VALUE#", val: _return_184}]), "return");
                                                            return (_return_184); 
                                                          }()),
                                                          function (idx) {
                                                            var ctx_107 = ctx_push(ctx_106, [{key: "idx", val: idx}]);
                                                            log_event("MLInterpreter.js", 425, ctx_107, "enter");
                                                            var _return_190 = (function () {
                                                              log_event("MLInterpreter.js", 423, ctx_107, "call");
                                                              var _return_189 = 
                                                              Unsafe.bind(
                                                                (function () {
                                                                  log_event("MLInterpreter.js", 414, ctx_107, "call");
                                                                  var _return_185 = 
                                                                  run_expression(
                                                                    s, ctx,
                                                                    expr);
                                                                  log_event("MLInterpreter.js", 413, ctx_push(ctx_107, [{key: "#RETURN_VALUE#", val: _return_185}]), "return");
                                                                  return (_return_185); 
                                                                }()),
                                                                function (v) {
                                                                  var ctx_108 = ctx_push(ctx_107, [{key: "v", val: v}]);
                                                                  log_event("MLInterpreter.js", 421, ctx_108, "enter");
                                                                  var ignore = (function () {
                                                                    log_event("MLInterpreter.js", 416, ctx_108, "call");
                                                                    var _return_186 = 
                                                                    Vector.set(
                                                                    s, idx,
                                                                    Normal(v));
                                                                    log_event("MLInterpreter.js", 415, ctx_push(ctx_108, [{key: "#RETURN_VALUE#", val: _return_186}]), "return");
                                                                    return (_return_186); 
                                                                  }())
                                                                  ;
                                                                  var ctx_109 = ctx_push(ctx_108, [{key: "ignore", val: ignore}]);
                                                                  log_event("MLInterpreter.js", 420, ctx_109, "let");
                                                                  var _return_188 = (function () {
                                                                    log_event("MLInterpreter.js", 418, ctx_109, "call");
                                                                    var _return_187 = 
                                                                    Unsafe.box(
                                                                    nil);
                                                                    log_event("MLInterpreter.js", 417, ctx_push(ctx_109, [{key: "#RETURN_VALUE#", val: _return_187}]), "return");
                                                                    return (_return_187); 
                                                                  }())
                                                                  ;
                                                                  log_event("MLInterpreter.js", 419, ctx_push(ctx_109, [{key: "#RETURN_VALUE#", val: _return_188}]), "return");
                                                                  return (_return_188); 
                                                                  });
                                                              log_event("MLInterpreter.js", 422, ctx_push(ctx_107, [{key: "#RETURN_VALUE#", val: _return_189}]), "return");
                                                              return (_return_189); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 424, ctx_push(ctx_107, [{key: "#RETURN_VALUE#", val: _return_190}]), "return");
                                                            return (_return_190); 
                                                          });
                                                        log_event("MLInterpreter.js", 426, ctx_push(ctx_106, [{key: "#RETURN_VALUE#", val: _return_191}]), "return");
                                                        return (_return_191); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 428, ctx_push(ctx_106, [{key: "#RETURN_VALUE#", val: _return_192}]), "return");
                                                      return (_return_192); 
                                                    });
                                log_event("MLInterpreter.js", 430, ctx_push(ctx_105, [{key: "#RETURN_VALUE#", val: _return_193}]), "return");
                                return (_return_193); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 432, ctx_push(ctx_105, [{key: "#RETURN_VALUE#", val: _return_194}]), "return");
                              return (_return_194); });
        log_event("MLInterpreter.js", 434, ctx_push(ctx_104, [{key: "#RETURN_VALUE#", val: _return_195}]), "return");
        return (_return_195); 
      }())
      ;
      log_event("MLInterpreter.js", 436, ctx_push(ctx_104, [{key: "#RETURN_VALUE#", val: _return_196}]), "return");
      return (_return_196); 
    case "Expression_ifthenelse":
      var cond = _term_.cond, e1 = _term_.e1, e2 = _term_.e2;var ctx_110 = ctx_push(ctx_25, [{key: "cond", val: cond}, {key: "e1", val: e1}, {key: "e2", val: e2}]);
    log_event("MLInterpreter.js", 461, ctx_110, "case");
    
      var _return_209 = (function () {
        log_event("MLInterpreter.js", 459, ctx_110, "call");
        var _return_208 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 439, ctx_110, "call");
                              var _return_197 = run_expression(s, ctx, cond);
                              log_event("MLInterpreter.js", 438, ctx_push(ctx_110, [{key: "#RETURN_VALUE#", val: _return_197}]), "return");
                              return (_return_197); }()),
                            function (cond_val) {
                              var ctx_111 = ctx_push(ctx_110, [{key: "cond_val", val: cond_val}]);
                              log_event("MLInterpreter.js", 457, ctx_111, "enter");
                              var _if_arg_198 = (function () {
                                log_event("MLInterpreter.js", 441, ctx_111, "call");
                                var _return_199 = is_sumtype_ctor("true",
                                                    cond_val);
                                log_event("MLInterpreter.js", 440, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_199}]), "return");
                                return (_return_199); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 456, ctx_111, "if");
                              if (_if_arg_198) {
                                var _return_207 = (function () {
                                  log_event("MLInterpreter.js", 454, ctx_111, "call");
                                  var _return_206 = run_expression(s, ctx,
                                                      e1);
                                  log_event("MLInterpreter.js", 453, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_206}]), "return");
                                  return (_return_206); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 455, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_207}]), "return");
                                return (_return_207); 
                              } else {
                                var _return_205 = (function () {
                                  log_event("MLInterpreter.js", 451, ctx_111, "call");
                                  var _return_204 = Unsafe.do_with_default(
                                                      (function () {
                                                        log_event("MLInterpreter.js", 443, ctx_111, "call");
                                                        var _return_200 = 
                                                        Unsafe.of_option(e2);
                                                        log_event("MLInterpreter.js", 442, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_200}]), "return");
                                                        return (_return_200); 
                                                      }()), (function () {
                                                        log_event("MLInterpreter.js", 445, ctx_111, "call");
                                                        var _return_201 = 
                                                        Unsafe.box(nil);
                                                        log_event("MLInterpreter.js", 444, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_201}]), "return");
                                                        return (_return_201); 
                                                      }()), function (e) {
                                                        var ctx_112 = ctx_push(ctx_111, [{key: "e", val: e}]);
                                                        log_event("MLInterpreter.js", 449, ctx_112, "enter");
                                                        var _return_203 = (function () {
                                                          log_event("MLInterpreter.js", 447, ctx_112, "call");
                                                          var _return_202 = 
                                                          run_expression(s,
                                                            ctx, e);
                                                          log_event("MLInterpreter.js", 446, ctx_push(ctx_112, [{key: "#RETURN_VALUE#", val: _return_202}]), "return");
                                                          return (_return_202); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 448, ctx_push(ctx_112, [{key: "#RETURN_VALUE#", val: _return_203}]), "return");
                                                        return (_return_203); 
                                                      });
                                  log_event("MLInterpreter.js", 450, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_204}]), "return");
                                  return (_return_204); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 452, ctx_push(ctx_111, [{key: "#RETURN_VALUE#", val: _return_205}]), "return");
                                return (_return_205); 
                              }});
        log_event("MLInterpreter.js", 458, ctx_push(ctx_110, [{key: "#RETURN_VALUE#", val: _return_208}]), "return");
        return (_return_208); 
      }())
      ;
      log_event("MLInterpreter.js", 460, ctx_push(ctx_110, [{key: "#RETURN_VALUE#", val: _return_209}]), "return");
      return (_return_209); 
    case "Expression_sequence":
      var e1 = _term_.e1, e2 = _term_.e2;var ctx_113 = ctx_push(ctx_25, [{key: "e1", val: e1}, {key: "e2", val: e2}]);
    log_event("MLInterpreter.js", 467, ctx_113, "case");
    
      (function () {
        log_event("MLInterpreter.js", 466, ctx_113, "call");
        var _return_212 = run_expression(s, ctx, e1);
        log_event("MLInterpreter.js", 465, ctx_push(ctx_113, [{key: "#RETURN_VALUE#", val: _return_212}]), "return");
        return (_return_212); 
      }())
      ;
      var _return_211 = (function () {
        log_event("MLInterpreter.js", 463, ctx_113, "call");
        var _return_210 = run_expression(s, ctx, e2);
        log_event("MLInterpreter.js", 462, ctx_push(ctx_113, [{key: "#RETURN_VALUE#", val: _return_210}]), "return");
        return (_return_210); 
      }())
      ;
      log_event("MLInterpreter.js", 464, ctx_push(ctx_113, [{key: "#RETURN_VALUE#", val: _return_211}]), "return");
      return (_return_211); 
    case "Expression_while":
      var loc = _term_.loc, cond_expr = _term_.cond, body = _term_.body;var ctx_114 = ctx_push(ctx_25, [{key: "loc", val: loc}, {key: "cond_expr", val: cond_expr}, {key: "body", val: body}]);
    log_event("MLInterpreter.js", 490, ctx_114, "case");
    
      var while_expr = Expression_while(loc, cond_expr, body);
      var ctx_115 = ctx_push(ctx_114, [{key: "while_expr", val: while_expr}]);
      log_event("MLInterpreter.js", 489, ctx_115, "let");
      var _return_224 = (function () {
        log_event("MLInterpreter.js", 487, ctx_115, "call");
        var _return_223 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 469, ctx_115, "call");
                              var _return_213 = run_expression(s, ctx,
                                                  cond_expr);
                              log_event("MLInterpreter.js", 468, ctx_push(ctx_115, [{key: "#RETURN_VALUE#", val: _return_213}]), "return");
                              return (_return_213); }()), function (cond) {
                              var ctx_116 = ctx_push(ctx_115, [{key: "cond", val: cond}]);
                              log_event("MLInterpreter.js", 485, ctx_116, "enter");
                              var _return_222 = (function () {
                                log_event("MLInterpreter.js", 483, ctx_116, "call");
                                var _return_221 = do_sumtype(cond,
                                                    function (b) {
                                                      var ctx_117 = ctx_push(ctx_116, [{key: "b", val: b}]);
                                                      log_event("MLInterpreter.js", 481, ctx_117, "enter");
                                                      var _if_arg_214 = (function () {
                                                        log_event("MLInterpreter.js", 471, ctx_117, "call");
                                                        var _return_215 = 
                                                        (b.constructor
                                                        === "true");
                                                        log_event("MLInterpreter.js", 470, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_215}]), "return");
                                                        return (_return_215); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 480, ctx_117, "if");
                                                      if (_if_arg_214) {
                                                        (function () {
                                                          log_event("MLInterpreter.js", 479, ctx_117, "call");
                                                          var _return_220 = 
                                                          run_expression(s,
                                                            ctx, body);
                                                          log_event("MLInterpreter.js", 478, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_220}]), "return");
                                                          return (_return_220); 
                                                        }())
                                                        ;
                                                        var _return_219 = (function () {
                                                          log_event("MLInterpreter.js", 476, ctx_117, "call");
                                                          var _return_218 = 
                                                          run_expression(s,
                                                            ctx, while_expr);
                                                          log_event("MLInterpreter.js", 475, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_218}]), "return");
                                                          return (_return_218); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 477, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_219}]), "return");
                                                        return (_return_219); 
                                                      } else {
                                                        var _return_217 = (function () {
                                                          log_event("MLInterpreter.js", 473, ctx_117, "call");
                                                          var _return_216 = 
                                                          Unsafe.box(nil);
                                                          log_event("MLInterpreter.js", 472, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_216}]), "return");
                                                          return (_return_216); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 474, ctx_push(ctx_117, [{key: "#RETURN_VALUE#", val: _return_217}]), "return");
                                                        return (_return_217); 
                                                      }});
                                log_event("MLInterpreter.js", 482, ctx_push(ctx_116, [{key: "#RETURN_VALUE#", val: _return_221}]), "return");
                                return (_return_221); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 484, ctx_push(ctx_116, [{key: "#RETURN_VALUE#", val: _return_222}]), "return");
                              return (_return_222); });
        log_event("MLInterpreter.js", 486, ctx_push(ctx_115, [{key: "#RETURN_VALUE#", val: _return_223}]), "return");
        return (_return_223); 
      }())
      ;
      log_event("MLInterpreter.js", 488, ctx_push(ctx_115, [{key: "#RETURN_VALUE#", val: _return_224}]), "return");
      return (_return_224); 
      
    case "Expression_for":
      var id = _term_.id, fst = _term_.first, lst = _term_.last,
        dir = _term_.up, body = _term_.body;var ctx_118 = ctx_push(ctx_25, [{key: "id", val: id}, {key: "fst", val: fst}, {key: "lst", val: lst}, {key: "dir", val: dir}, {key: "body", val: body}]);
    log_event("MLInterpreter.js", 599, ctx_118, "case");
    
      var _return_273 = (function () {
        log_event("MLInterpreter.js", 597, ctx_118, "call");
        var _return_272 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 492, ctx_118, "call");
                              var _return_225 = run_expression(s, ctx, fst);
                              log_event("MLInterpreter.js", 491, ctx_push(ctx_118, [{key: "#RETURN_VALUE#", val: _return_225}]), "return");
                              return (_return_225); }()), function (first) {
                              var ctx_119 = ctx_push(ctx_118, [{key: "first", val: first}]);
                              log_event("MLInterpreter.js", 595, ctx_119, "enter");
                              var _return_271 = (function () {
                                log_event("MLInterpreter.js", 593, ctx_119, "call");
                                var _return_270 = Unsafe.bind((function () {
                                                      log_event("MLInterpreter.js", 494, ctx_119, "call");
                                                      var _return_226 = 
                                                      run_expression(s, ctx,
                                                        lst);
                                                      log_event("MLInterpreter.js", 493, ctx_push(ctx_119, [{key: "#RETURN_VALUE#", val: _return_226}]), "return");
                                                      return (_return_226); 
                                                    }()), function (last) {
                                                      var ctx_120 = ctx_push(ctx_119, [{key: "last", val: last}]);
                                                      log_event("MLInterpreter.js", 591, ctx_120, "enter");
                                                      var idx = (function () {
                                                        log_event("MLInterpreter.js", 496, ctx_120, "call");
                                                        var _return_227 = 
                                                        Vector.append(s,
                                                          Normal(first));
                                                        log_event("MLInterpreter.js", 495, ctx_push(ctx_120, [{key: "#RETURN_VALUE#", val: _return_227}]), "return");
                                                        return (_return_227); 
                                                      }())
                                                      ;
                                                      var ctx_121 = ctx_push(ctx_120, [{key: "idx", val: idx}]);
                                                      log_event("MLInterpreter.js", 590, ctx_121, "let");
                                                      var ctx$ = (function () {
                                                        log_event("MLInterpreter.js", 498, ctx_121, "call");
                                                        var _return_228 = 
                                                        ExecutionContext.add(
                                                          id, idx, ctx);
                                                        log_event("MLInterpreter.js", 497, ctx_push(ctx_121, [{key: "#RETURN_VALUE#", val: _return_228}]), "return");
                                                        return (_return_228); 
                                                      }())
                                                      ;
                                                      var ctx_122 = ctx_push(ctx_121, [{key: "ctx$", val: ctx$}]);
                                                      log_event("MLInterpreter.js", 589, ctx_122, "let");
                                                      log_event("MLInterpreter.js", 499, ctx_122, "if");
                                                      if (dir) {
                                                        var step_value = 1;
                                                      } else {
                                                        var step_value = -1;
                                                      }
                                                      var ctx_123 = ctx_push(ctx_122, [{key: "step_value", val: step_value}]);
                                                      log_event("MLInterpreter.js", 588, ctx_123, "let");
                                                      var step = function (v) {
                                                        var ctx_124 = ctx_push(ctx_123, [{key: "v", val: v}]);
                                                        log_event("MLInterpreter.js", 511, ctx_124, "enter");
                                                        log_event("MLInterpreter.js", 510, ctx_124, "switch");
                                                        switch (v.tag) {
                                                          case "Value_int":
                                                            var i = v.value;var ctx_125 = ctx_push(ctx_124, [{key: "i", val: i}]);
                                                          log_event("MLInterpreter.js", 505, ctx_125, "case");
                                                          
                                                            var _return_231 = (function () {
                                                              log_event("MLInterpreter.js", 503, ctx_125, "call");
                                                              var _return_230 = 
                                                              Unsafe.box(
                                                                Value_int(
                                                                  (function () {
                                                                    log_event("MLInterpreter.js", 501, ctx_125, "call");
                                                                    var _return_229 = 
                                                                    (i
                                                                    + step_value);
                                                                    log_event("MLInterpreter.js", 500, ctx_push(ctx_125, [{key: "#RETURN_VALUE#", val: _return_229}]), "return");
                                                                    return (_return_229); 
                                                                  }())));
                                                              log_event("MLInterpreter.js", 502, ctx_push(ctx_125, [{key: "#RETURN_VALUE#", val: _return_230}]), "return");
                                                              return (_return_230); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 504, ctx_push(ctx_125, [{key: "#RETURN_VALUE#", val: _return_231}]), "return");
                                                            return (_return_231); 
                                                          default:log_event("MLInterpreter.js", 509, ctx_124, "case");
                                                          
                                                            var _return_233 = (function () {
                                                              log_event("MLInterpreter.js", 507, ctx_124, "call");
                                                              var _return_232 = 
                                                              Unsafe.error(
                                                                "Expected an int");
                                                              log_event("MLInterpreter.js", 506, ctx_push(ctx_124, [{key: "#RETURN_VALUE#", val: _return_232}]), "return");
                                                              return (_return_232); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 508, ctx_push(ctx_124, [{key: "#RETURN_VALUE#", val: _return_233}]), "return");
                                                            return (_return_233); 
                                                        }
                                                        
                                                      };
                                                      var ctx_126 = ctx_push(ctx_123, [{key: "step", val: step}]);
                                                      log_event("MLInterpreter.js", 587, ctx_126, "let");
                                                      var get_int = function (v) {
                                                        var ctx_127 = ctx_push(ctx_126, [{key: "v", val: v}]);
                                                        log_event("MLInterpreter.js", 521, ctx_127, "enter");
                                                        log_event("MLInterpreter.js", 520, ctx_127, "switch");
                                                        switch (v.tag) {
                                                          case "Value_int":
                                                            var i = v.value;var ctx_128 = ctx_push(ctx_127, [{key: "i", val: i}]);
                                                          log_event("MLInterpreter.js", 515, ctx_128, "case");
                                                          
                                                            var _return_235 = (function () {
                                                              log_event("MLInterpreter.js", 513, ctx_128, "call");
                                                              var _return_234 = 
                                                              Unsafe.box(i);
                                                              log_event("MLInterpreter.js", 512, ctx_push(ctx_128, [{key: "#RETURN_VALUE#", val: _return_234}]), "return");
                                                              return (_return_234); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 514, ctx_push(ctx_128, [{key: "#RETURN_VALUE#", val: _return_235}]), "return");
                                                            return (_return_235); 
                                                          default:log_event("MLInterpreter.js", 519, ctx_127, "case");
                                                          
                                                            var _return_237 = (function () {
                                                              log_event("MLInterpreter.js", 517, ctx_127, "call");
                                                              var _return_236 = 
                                                              Unsafe.error(
                                                                "Expected an int");
                                                              log_event("MLInterpreter.js", 516, ctx_push(ctx_127, [{key: "#RETURN_VALUE#", val: _return_236}]), "return");
                                                              return (_return_236); 
                                                            }())
                                                            ;
                                                            log_event("MLInterpreter.js", 518, ctx_push(ctx_127, [{key: "#RETURN_VALUE#", val: _return_237}]), "return");
                                                            return (_return_237); 
                                                        }
                                                        
                                                      };
                                                      var ctx_129 = ctx_push(ctx_126, [{key: "get_int", val: get_int}]);
                                                      log_event("MLInterpreter.js", 586, ctx_129, "let");
                                                      var iter = function (nil) {
                                                        var ctx_130 = ctx_push(ctx_129, [{key: "nil", val: nil}]);
                                                        log_event("MLInterpreter.js", 581, ctx_130, "enter");
                                                        var _return_267 = (function () {
                                                          log_event("MLInterpreter.js", 579, ctx_130, "call");
                                                          var _return_266 = 
                                                          Unsafe.bind(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 523, ctx_130, "call");
                                                              var _return_238 = 
                                                              Vector.find(s,
                                                                idx);
                                                              log_event("MLInterpreter.js", 522, ctx_push(ctx_130, [{key: "#RETURN_VALUE#", val: _return_238}]), "return");
                                                              return (_return_238); 
                                                            }()),
                                                            function (b) {
                                                              var ctx_131 = ctx_push(ctx_130, [{key: "b", val: b}]);
                                                              log_event("MLInterpreter.js", 577, ctx_131, "enter");
                                                              var _return_265 = (function () {
                                                                log_event("MLInterpreter.js", 575, ctx_131, "call");
                                                                var _return_264 = 
                                                                Unsafe.bind(
                                                                  (function () {
                                                                    log_event("MLInterpreter.js", 525, ctx_131, "call");
                                                                    var _return_239 = 
                                                                    value_of(
                                                                    s, ctx,
                                                                    b);
                                                                    log_event("MLInterpreter.js", 524, ctx_push(ctx_131, [{key: "#RETURN_VALUE#", val: _return_239}]), "return");
                                                                    return (_return_239); 
                                                                  }()),
                                                                  function (v) {
                                                                    var ctx_132 = ctx_push(ctx_131, [{key: "v", val: v}]);
                                                                    log_event("MLInterpreter.js", 573, ctx_132, "enter");
                                                                    var _return_263 = (function () {
                                                                    log_event("MLInterpreter.js", 571, ctx_132, "call");
                                                                    var _return_262 = 
                                                                    Unsafe.bind(
                                                                    (function () {
                                                                    log_event("MLInterpreter.js", 527, ctx_132, "call");
                                                                    var _return_240 = 
                                                                    get_int(
                                                                    v);
                                                                    log_event("MLInterpreter.js", 526, ctx_push(ctx_132, [{key: "#RETURN_VALUE#", val: _return_240}]), "return");
                                                                    return (_return_240); 
                                                                    }()),
                                                                    function (iv) {
                                                                    var ctx_133 = ctx_push(ctx_132, [{key: "iv", val: iv}]);
                                                                    log_event("MLInterpreter.js", 569, ctx_133, "enter");
                                                                    var _return_261 = (function () {
                                                                    log_event("MLInterpreter.js", 567, ctx_133, "call");
                                                                    var _return_260 = 
                                                                    Unsafe.bind(
                                                                    (function () {
                                                                    log_event("MLInterpreter.js", 529, ctx_133, "call");
                                                                    var _return_241 = 
                                                                    get_int(
                                                                    last);
                                                                    log_event("MLInterpreter.js", 528, ctx_push(ctx_133, [{key: "#RETURN_VALUE#", val: _return_241}]), "return");
                                                                    return (_return_241); 
                                                                    }()),
                                                                    function (ilast) {
                                                                    var ctx_134 = ctx_push(ctx_133, [{key: "ilast", val: ilast}]);
                                                                    log_event("MLInterpreter.js", 565, ctx_134, "enter");
                                                                    var fv = 
                                                                    number_of_int(
                                                                    iv);
                                                                    var ctx_135 = ctx_push(ctx_134, [{key: "fv", val: fv}]);
                                                                    log_event("MLInterpreter.js", 564, ctx_135, "let");
                                                                    var flast = 
                                                                    number_of_int(
                                                                    ilast);
                                                                    var ctx_136 = ctx_push(ctx_135, [{key: "flast", val: flast}]);
                                                                    log_event("MLInterpreter.js", 563, ctx_136, "let");
                                                                    var _if_arg_242 = (function () {
                                                                    log_event("MLInterpreter.js", 541, ctx_136, "call");
                                                                    var _return_248 = 
                                                                    ((function () {
                                                                    log_event("MLInterpreter.js", 533, ctx_136, "call");
                                                                    var _return_244 = 
                                                                    (dir
                                                                    && (function () {
                                                                    log_event("MLInterpreter.js", 531, ctx_136, "call");
                                                                    var _return_243 = 
                                                                    (fv
                                                                    <= flast);
                                                                    log_event("MLInterpreter.js", 530, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_243}]), "return");
                                                                    return (_return_243); 
                                                                    }()));
                                                                    log_event("MLInterpreter.js", 532, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_244}]), "return");
                                                                    return (_return_244); 
                                                                    }())
                                                                    || (function () {
                                                                    log_event("MLInterpreter.js", 539, ctx_136, "call");
                                                                    var _return_247 = 
                                                                    ((function () {
                                                                    log_event("MLInterpreter.js", 535, ctx_136, "call");
                                                                    var _return_245 = 
                                                                    !(dir);
                                                                    log_event("MLInterpreter.js", 534, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_245}]), "return");
                                                                    return (_return_245); 
                                                                    }())
                                                                    && (function () {
                                                                    log_event("MLInterpreter.js", 537, ctx_136, "call");
                                                                    var _return_246 = 
                                                                    (fv
                                                                    >= flast);
                                                                    log_event("MLInterpreter.js", 536, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_246}]), "return");
                                                                    return (_return_246); 
                                                                    }()));
                                                                    log_event("MLInterpreter.js", 538, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_247}]), "return");
                                                                    return (_return_247); 
                                                                    }()));
                                                                    log_event("MLInterpreter.js", 540, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_248}]), "return");
                                                                    return (_return_248); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 562, ctx_136, "if");
                                                                    if (_if_arg_242) {
                                                                    var _return_259 = (function () {
                                                                    log_event("MLInterpreter.js", 560, ctx_136, "call");
                                                                    var _return_258 = 
                                                                    Unsafe.bind(
                                                                    (function () {
                                                                    log_event("MLInterpreter.js", 546, ctx_136, "call");
                                                                    var _return_251 = 
                                                                    run_expression(
                                                                    s, ctx$,
                                                                    body);
                                                                    log_event("MLInterpreter.js", 545, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_251}]), "return");
                                                                    return (_return_251); 
                                                                    }()),
                                                                    function (res) {
                                                                    var ctx_137 = ctx_push(ctx_136, [{key: "res", val: res}]);
                                                                    log_event("MLInterpreter.js", 558, ctx_137, "enter");
                                                                    var _return_257 = (function () {
                                                                    log_event("MLInterpreter.js", 556, ctx_137, "call");
                                                                    var _return_256 = 
                                                                    Unsafe.bind(
                                                                    (function () {
                                                                    log_event("MLInterpreter.js", 548, ctx_137, "call");
                                                                    var _return_252 = 
                                                                    step(v);
                                                                    log_event("MLInterpreter.js", 547, ctx_push(ctx_137, [{key: "#RETURN_VALUE#", val: _return_252}]), "return");
                                                                    return (_return_252); 
                                                                    }()),
                                                                    function (v$) {
                                                                    var ctx_138 = ctx_push(ctx_137, [{key: "v$", val: v$}]);
                                                                    log_event("MLInterpreter.js", 554, ctx_138, "enter");
                                                                    (function () {
                                                                    log_event("MLInterpreter.js", 553, ctx_138, "call");
                                                                    var _return_255 = 
                                                                    Vector.set(
                                                                    s, idx,
                                                                    Normal(
                                                                    v$));
                                                                    log_event("MLInterpreter.js", 552, ctx_push(ctx_138, [{key: "#RETURN_VALUE#", val: _return_255}]), "return");
                                                                    return (_return_255); 
                                                                    }())
                                                                    ;
                                                                    var _return_254 = (function () {
                                                                    log_event("MLInterpreter.js", 550, ctx_138, "call");
                                                                    var _return_253 = 
                                                                    iter({});
                                                                    log_event("MLInterpreter.js", 549, ctx_push(ctx_138, [{key: "#RETURN_VALUE#", val: _return_253}]), "return");
                                                                    return (_return_253); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 551, ctx_push(ctx_138, [{key: "#RETURN_VALUE#", val: _return_254}]), "return");
                                                                    return (_return_254); 
                                                                    });
                                                                    log_event("MLInterpreter.js", 555, ctx_push(ctx_137, [{key: "#RETURN_VALUE#", val: _return_256}]), "return");
                                                                    return (_return_256); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 557, ctx_push(ctx_137, [{key: "#RETURN_VALUE#", val: _return_257}]), "return");
                                                                    return (_return_257); 
                                                                    });
                                                                    log_event("MLInterpreter.js", 559, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_258}]), "return");
                                                                    return (_return_258); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 561, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_259}]), "return");
                                                                    return (_return_259); 
                                                                    } else {
                                                                    var _return_250 = (function () {
                                                                    log_event("MLInterpreter.js", 543, ctx_136, "call");
                                                                    var _return_249 = 
                                                                    Unsafe.box(
                                                                    Value.nil);
                                                                    log_event("MLInterpreter.js", 542, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_249}]), "return");
                                                                    return (_return_249); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 544, ctx_push(ctx_136, [{key: "#RETURN_VALUE#", val: _return_250}]), "return");
                                                                    return (_return_250); 
                                                                    }
                                                                    
                                                                    });
                                                                    log_event("MLInterpreter.js", 566, ctx_push(ctx_133, [{key: "#RETURN_VALUE#", val: _return_260}]), "return");
                                                                    return (_return_260); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 568, ctx_push(ctx_133, [{key: "#RETURN_VALUE#", val: _return_261}]), "return");
                                                                    return (_return_261); 
                                                                    });
                                                                    log_event("MLInterpreter.js", 570, ctx_push(ctx_132, [{key: "#RETURN_VALUE#", val: _return_262}]), "return");
                                                                    return (_return_262); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 572, ctx_push(ctx_132, [{key: "#RETURN_VALUE#", val: _return_263}]), "return");
                                                                    return (_return_263); 
                                                                  });
                                                                log_event("MLInterpreter.js", 574, ctx_push(ctx_131, [{key: "#RETURN_VALUE#", val: _return_264}]), "return");
                                                                return (_return_264); 
                                                              }())
                                                              ;
                                                              log_event("MLInterpreter.js", 576, ctx_push(ctx_131, [{key: "#RETURN_VALUE#", val: _return_265}]), "return");
                                                              return (_return_265); 
                                                            });
                                                          log_event("MLInterpreter.js", 578, ctx_push(ctx_130, [{key: "#RETURN_VALUE#", val: _return_266}]), "return");
                                                          return (_return_266); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 580, ctx_push(ctx_130, [{key: "#RETURN_VALUE#", val: _return_267}]), "return");
                                                        return (_return_267); 
                                                      };
                                                      var ctx_139 = ctx_push(ctx_129, [{key: "iter", val: iter}]);
                                                      log_event("MLInterpreter.js", 585, ctx_139, "let");
                                                      var _return_269 = (function () {
                                                        log_event("MLInterpreter.js", 583, ctx_139, "call");
                                                        var _return_268 = 
                                                        iter({});
                                                        log_event("MLInterpreter.js", 582, ctx_push(ctx_139, [{key: "#RETURN_VALUE#", val: _return_268}]), "return");
                                                        return (_return_268); 
                                                      }())
                                                      ;
                                                      log_event("MLInterpreter.js", 584, ctx_push(ctx_139, [{key: "#RETURN_VALUE#", val: _return_269}]), "return");
                                                      return (_return_269); 
                                                      
                                                      
                                                      
                                                      
                                                      
                                                      });
                                log_event("MLInterpreter.js", 592, ctx_push(ctx_119, [{key: "#RETURN_VALUE#", val: _return_270}]), "return");
                                return (_return_270); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 594, ctx_push(ctx_119, [{key: "#RETURN_VALUE#", val: _return_271}]), "return");
                              return (_return_271); });
        log_event("MLInterpreter.js", 596, ctx_push(ctx_118, [{key: "#RETURN_VALUE#", val: _return_272}]), "return");
        return (_return_272); 
      }())
      ;
      log_event("MLInterpreter.js", 598, ctx_push(ctx_118, [{key: "#RETURN_VALUE#", val: _return_273}]), "return");
      return (_return_273); 
    case "Expression_try":
      var expr = _term_.expr, cases = _term_.cases;var ctx_140 = ctx_push(ctx_25, [{key: "expr", val: expr}, {key: "cases", val: cases}]);
    log_event("MLInterpreter.js", 612, ctx_140, "case");
    
      var ret = (function () {
        log_event("MLInterpreter.js", 601, ctx_140, "call");
        var _return_274 = run_expression(s, ctx, expr);
        log_event("MLInterpreter.js", 600, ctx_push(ctx_140, [{key: "#RETURN_VALUE#", val: _return_274}]), "return");
        return (_return_274); 
      }())
      ;
      var ctx_141 = ctx_push(ctx_140, [{key: "ret", val: ret}]);
      log_event("MLInterpreter.js", 611, ctx_141, "let");
      log_event("MLInterpreter.js", 610, ctx_141, "switch");
      switch (ret.tag) {
        case "Exception":
          var x = ret.except;var ctx_142 = ctx_push(ctx_141, [{key: "x", val: x}]);
        log_event("MLInterpreter.js", 607, ctx_142, "case");
        
          var _return_277 = (function () {
            log_event("MLInterpreter.js", 605, ctx_142, "call");
            var _return_276 = pattern_match_many(s, ctx, x, (function () {
                                  log_event("MLInterpreter.js", 603, ctx_142, "call");
                                  var _return_275 = MLList.of_array(cases);
                                  log_event("MLInterpreter.js", 602, ctx_push(ctx_142, [{key: "#RETURN_VALUE#", val: _return_275}]), "return");
                                  return (_return_275); }()));
            log_event("MLInterpreter.js", 604, ctx_push(ctx_142, [{key: "#RETURN_VALUE#", val: _return_276}]), "return");
            return (_return_276); 
          }())
          ;
          log_event("MLInterpreter.js", 606, ctx_push(ctx_142, [{key: "#RETURN_VALUE#", val: _return_277}]), "return");
          return (_return_277); 
        default:log_event("MLInterpreter.js", 609, ctx_141, "case");
        
          var _return_278 = ret;
          log_event("MLInterpreter.js", 608, ctx_push(ctx_141, [{key: "#RETURN_VALUE#", val: _return_278}]), "return");
          return (_return_278); 
      }
      
      
    case "Expression_letmodule":
      var id = _term_.id, modex = _term_.modex, expr = _term_.expr;var ctx_143 = ctx_push(ctx_25, [{key: "id", val: id}, {key: "modex", val: modex}, {key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 631, ctx_143, "case");
    
      var _return_286 = (function () {
        log_event("MLInterpreter.js", 629, ctx_143, "call");
        var _return_285 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 614, ctx_143, "call");
                              var _return_279 = run_module_expression(s, ctx,
                                                  modex);
                              log_event("MLInterpreter.js", 613, ctx_push(ctx_143, [{key: "#RETURN_VALUE#", val: _return_279}]), "return");
                              return (_return_279); }()), function (md) {
                              var ctx_144 = ctx_push(ctx_143, [{key: "md", val: md}]);
                              log_event("MLInterpreter.js", 627, ctx_144, "enter");
                              var ident = (function () {
                                log_event("MLInterpreter.js", 616, ctx_144, "call");
                                var _return_280 = string_of_identifier(id);
                                log_event("MLInterpreter.js", 615, ctx_push(ctx_144, [{key: "#RETURN_VALUE#", val: _return_280}]), "return");
                                return (_return_280); 
                              }())
                              ;
                              var ctx_145 = ctx_push(ctx_144, [{key: "ident", val: ident}]);
                              log_event("MLInterpreter.js", 626, ctx_145, "let");
                              var idx = (function () {
                                log_event("MLInterpreter.js", 618, ctx_145, "call");
                                var _return_281 = Vector.append(s,
                                                    Normal(md));
                                log_event("MLInterpreter.js", 617, ctx_push(ctx_145, [{key: "#RETURN_VALUE#", val: _return_281}]), "return");
                                return (_return_281); 
                              }())
                              ;
                              var ctx_146 = ctx_push(ctx_145, [{key: "idx", val: idx}]);
                              log_event("MLInterpreter.js", 625, ctx_146, "let");
                              var ctx$ = (function () {
                                log_event("MLInterpreter.js", 620, ctx_146, "call");
                                var _return_282 = ExecutionContext.add(ident,
                                                    idx, ctx);
                                log_event("MLInterpreter.js", 619, ctx_push(ctx_146, [{key: "#RETURN_VALUE#", val: _return_282}]), "return");
                                return (_return_282); 
                              }())
                              ;
                              var ctx_147 = ctx_push(ctx_146, [{key: "ctx$", val: ctx$}]);
                              log_event("MLInterpreter.js", 624, ctx_147, "let");
                              var _return_284 = (function () {
                                log_event("MLInterpreter.js", 622, ctx_147, "call");
                                var _return_283 = run_expression(s, ctx$,
                                                    expr);
                                log_event("MLInterpreter.js", 621, ctx_push(ctx_147, [{key: "#RETURN_VALUE#", val: _return_283}]), "return");
                                return (_return_283); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 623, ctx_push(ctx_147, [{key: "#RETURN_VALUE#", val: _return_284}]), "return");
                              return (_return_284); 
                              
                              
                              });
        log_event("MLInterpreter.js", 628, ctx_push(ctx_143, [{key: "#RETURN_VALUE#", val: _return_285}]), "return");
        return (_return_285); 
      }())
      ;
      log_event("MLInterpreter.js", 630, ctx_push(ctx_143, [{key: "#RETURN_VALUE#", val: _return_286}]), "return");
      return (_return_286); 
    case "Expression_pack":
      var expr = _term_.expr;var ctx_148 = ctx_push(ctx_25, [{key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 635, ctx_148, "case");
    
      var _return_288 = (function () {
        log_event("MLInterpreter.js", 633, ctx_148, "call");
        var _return_287 = run_module_expression(s, ctx, expr);
        log_event("MLInterpreter.js", 632, ctx_push(ctx_148, [{key: "#RETURN_VALUE#", val: _return_287}]), "return");
        return (_return_287); 
      }())
      ;
      log_event("MLInterpreter.js", 634, ctx_push(ctx_148, [{key: "#RETURN_VALUE#", val: _return_288}]), "return");
      return (_return_288); 
    case "Expression_assert":
      var expr = _term_.expr;var ctx_149 = ctx_push(ctx_25, [{key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 655, ctx_149, "case");
    
      var _return_298 = (function () {
        log_event("MLInterpreter.js", 653, ctx_149, "call");
        var _return_297 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 637, ctx_149, "call");
                              var _return_289 = run_expression(s, ctx, expr);
                              log_event("MLInterpreter.js", 636, ctx_push(ctx_149, [{key: "#RETURN_VALUE#", val: _return_289}]), "return");
                              return (_return_289); }()), function (res) {
                              var ctx_150 = ctx_push(ctx_149, [{key: "res", val: res}]);
                              log_event("MLInterpreter.js", 651, ctx_150, "enter");
                              var _return_296 = (function () {
                                log_event("MLInterpreter.js", 649, ctx_150, "call");
                                var _return_295 = Unsafe.bind((function () {
                                                      log_event("MLInterpreter.js", 639, ctx_150, "call");
                                                      var _return_290 = 
                                                      bool_of_value(res);
                                                      log_event("MLInterpreter.js", 638, ctx_push(ctx_150, [{key: "#RETURN_VALUE#", val: _return_290}]), "return");
                                                      return (_return_290); 
                                                    }()), function (b) {
                                                      var ctx_151 = ctx_push(ctx_150, [{key: "b", val: b}]);
                                                      log_event("MLInterpreter.js", 647, ctx_151, "enter");
                                                      log_event("MLInterpreter.js", 646, ctx_151, "if");
                                                      if (b) {
                                                        var _return_294 = (function () {
                                                          log_event("MLInterpreter.js", 644, ctx_151, "call");
                                                          var _return_293 = 
                                                          Unsafe.box(nil);
                                                          log_event("MLInterpreter.js", 643, ctx_push(ctx_151, [{key: "#RETURN_VALUE#", val: _return_293}]), "return");
                                                          return (_return_293); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 645, ctx_push(ctx_151, [{key: "#RETURN_VALUE#", val: _return_294}]), "return");
                                                        return (_return_294); 
                                                      } else {
                                                        var _return_292 = (function () {
                                                          log_event("MLInterpreter.js", 641, ctx_151, "call");
                                                          var _return_291 = 
                                                          Unsafe.except(
                                                            Value_exception({
                                                                constructor: "Assert_failure",
                                                                args: []}));
                                                          log_event("MLInterpreter.js", 640, ctx_push(ctx_151, [{key: "#RETURN_VALUE#", val: _return_291}]), "return");
                                                          return (_return_291); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 642, ctx_push(ctx_151, [{key: "#RETURN_VALUE#", val: _return_292}]), "return");
                                                        return (_return_292); 
                                                      }});
                                log_event("MLInterpreter.js", 648, ctx_push(ctx_150, [{key: "#RETURN_VALUE#", val: _return_295}]), "return");
                                return (_return_295); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 650, ctx_push(ctx_150, [{key: "#RETURN_VALUE#", val: _return_296}]), "return");
                              return (_return_296); });
        log_event("MLInterpreter.js", 652, ctx_push(ctx_149, [{key: "#RETURN_VALUE#", val: _return_297}]), "return");
        return (_return_297); 
      }())
      ;
      log_event("MLInterpreter.js", 654, ctx_push(ctx_149, [{key: "#RETURN_VALUE#", val: _return_298}]), "return");
      return (_return_298); 
  }
  
};

var value_of = function (s, ctx, b) {
  var ctx_152 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "b", val: b}]);
  log_event("MLInterpreter.js", 667, ctx_152, "enter");
  log_event("MLInterpreter.js", 666, ctx_152, "switch");
  switch (b.tag) {
    case "Normal":
      var v = b.normal_alloc;var ctx_153 = ctx_push(ctx_152, [{key: "v", val: v}]);
    log_event("MLInterpreter.js", 661, ctx_153, "case");
    
      var _return_300 = (function () {
        log_event("MLInterpreter.js", 659, ctx_153, "call");
        var _return_299 = Unsafe.box(v);
        log_event("MLInterpreter.js", 658, ctx_push(ctx_153, [{key: "#RETURN_VALUE#", val: _return_299}]), "return");
        return (_return_299); 
      }())
      ;
      log_event("MLInterpreter.js", 660, ctx_push(ctx_153, [{key: "#RETURN_VALUE#", val: _return_300}]), "return");
      return (_return_300); 
    case "Prealloc":
      var e = b.prealloc, ctx$ = b.ctx;var ctx_154 = ctx_push(ctx_152, [{key: "e", val: e}, {key: "ctx$", val: ctx$}]);
    log_event("MLInterpreter.js", 665, ctx_154, "case");
    
      var _return_302 = (function () {
        log_event("MLInterpreter.js", 663, ctx_154, "call");
        var _return_301 = run_expression(s, ctx$, e);
        log_event("MLInterpreter.js", 662, ctx_push(ctx_154, [{key: "#RETURN_VALUE#", val: _return_301}]), "return");
        return (_return_301); 
      }())
      ;
      log_event("MLInterpreter.js", 664, ctx_push(ctx_154, [{key: "#RETURN_VALUE#", val: _return_302}]), "return");
      return (_return_302); 
  }
  
};

var pattern_match = function (s, ctx, value, patt) {
  var ctx_155 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "value", val: value}, {key: "patt", val: patt}]);
  log_event("MLInterpreter.js", 806, ctx_155, "enter");
  log_event("MLInterpreter.js", 805, ctx_155, "switch");
  switch (patt.tag) {
    case "Pattern_any":log_event("MLInterpreter.js", 671, ctx_155, "case");
    
      var _return_304 = (function () {
        log_event("MLInterpreter.js", 669, ctx_155, "call");
        var _return_303 = Unsafe.box(ctx);
        log_event("MLInterpreter.js", 668, ctx_push(ctx_155, [{key: "#RETURN_VALUE#", val: _return_303}]), "return");
        return (_return_303); 
      }())
      ;
      log_event("MLInterpreter.js", 670, ctx_push(ctx_155, [{key: "#RETURN_VALUE#", val: _return_304}]), "return");
      return (_return_304); 
    case "Pattern_var":
      var id = patt.id;var ctx_156 = ctx_push(ctx_155, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 680, ctx_156, "case");
    
      var idx = (function () {
        log_event("MLInterpreter.js", 673, ctx_156, "call");
        var _return_305 = Vector.append(s, Normal(value));
        log_event("MLInterpreter.js", 672, ctx_push(ctx_156, [{key: "#RETURN_VALUE#", val: _return_305}]), "return");
        return (_return_305); 
      }())
      ;
      var ctx_157 = ctx_push(ctx_156, [{key: "idx", val: idx}]);
      log_event("MLInterpreter.js", 679, ctx_157, "let");
      var _return_308 = (function () {
        log_event("MLInterpreter.js", 677, ctx_157, "call");
        var _return_307 = Unsafe.box((function () {
                              log_event("MLInterpreter.js", 675, ctx_157, "call");
                              var _return_306 = ExecutionContext.add(id, idx,
                                                  ctx);
                              log_event("MLInterpreter.js", 674, ctx_push(ctx_157, [{key: "#RETURN_VALUE#", val: _return_306}]), "return");
                              return (_return_306); }()));
        log_event("MLInterpreter.js", 676, ctx_push(ctx_157, [{key: "#RETURN_VALUE#", val: _return_307}]), "return");
        return (_return_307); 
      }())
      ;
      log_event("MLInterpreter.js", 678, ctx_push(ctx_157, [{key: "#RETURN_VALUE#", val: _return_308}]), "return");
      return (_return_308); 
      
    case "Pattern_constant":
      var c = patt.constant;var ctx_158 = ctx_push(ctx_155, [{key: "c", val: c}]);
    log_event("MLInterpreter.js", 693, ctx_158, "case");
    
      var v1 = (function () {
        log_event("MLInterpreter.js", 682, ctx_158, "call");
        var _return_309 = run_constant(c);
        log_event("MLInterpreter.js", 681, ctx_push(ctx_158, [{key: "#RETURN_VALUE#", val: _return_309}]), "return");
        return (_return_309); 
      }())
      ;
      var ctx_159 = ctx_push(ctx_158, [{key: "v1", val: v1}]);
      log_event("MLInterpreter.js", 692, ctx_159, "let");
      var _if_arg_310 = (function () {
        log_event("MLInterpreter.js", 684, ctx_159, "call");
        var _return_311 = value_eq(v1, value);
        log_event("MLInterpreter.js", 683, ctx_push(ctx_159, [{key: "#RETURN_VALUE#", val: _return_311}]), "return");
        return (_return_311); 
      }())
      ;
      log_event("MLInterpreter.js", 691, ctx_159, "if");
      if (_if_arg_310) {
        var _return_315 = (function () {
          log_event("MLInterpreter.js", 689, ctx_159, "call");
          var _return_314 = Unsafe.box(ctx);
          log_event("MLInterpreter.js", 688, ctx_push(ctx_159, [{key: "#RETURN_VALUE#", val: _return_314}]), "return");
          return (_return_314); 
        }())
        ;
        log_event("MLInterpreter.js", 690, ctx_push(ctx_159, [{key: "#RETURN_VALUE#", val: _return_315}]), "return");
        return (_return_315); 
      } else {
        var _return_313 = (function () {
          log_event("MLInterpreter.js", 686, ctx_159, "call");
          var _return_312 = Unsafe.error("Matching failure");
          log_event("MLInterpreter.js", 685, ctx_push(ctx_159, [{key: "#RETURN_VALUE#", val: _return_312}]), "return");
          return (_return_312); 
        }())
        ;
        log_event("MLInterpreter.js", 687, ctx_push(ctx_159, [{key: "#RETURN_VALUE#", val: _return_313}]), "return");
        return (_return_313); 
      }
      
    case "Pattern_tuple":
      var patts = patt.patts;var ctx_160 = ctx_push(ctx_155, [{key: "patts", val: patts}]);
    log_event("MLInterpreter.js", 703, ctx_160, "case");
    
      log_event("MLInterpreter.js", 702, ctx_160, "switch");
      switch (value.tag) {
        case "Value_tuple":
          var tuples = value.value;var ctx_161 = ctx_push(ctx_160, [{key: "tuples", val: tuples}]);
        log_event("MLInterpreter.js", 697, ctx_161, "case");
        
          var _return_317 = (function () {
            log_event("MLInterpreter.js", 695, ctx_161, "call");
            var _return_316 = pattern_match_array(s, ctx, tuples, patts);
            log_event("MLInterpreter.js", 694, ctx_push(ctx_161, [{key: "#RETURN_VALUE#", val: _return_316}]), "return");
            return (_return_316); 
          }())
          ;
          log_event("MLInterpreter.js", 696, ctx_push(ctx_161, [{key: "#RETURN_VALUE#", val: _return_317}]), "return");
          return (_return_317); 
        default:log_event("MLInterpreter.js", 701, ctx_160, "case");
        
          var _return_319 = (function () {
            log_event("MLInterpreter.js", 699, ctx_160, "call");
            var _return_318 = Unsafe.error("Expected a tuple");
            log_event("MLInterpreter.js", 698, ctx_push(ctx_160, [{key: "#RETURN_VALUE#", val: _return_318}]), "return");
            return (_return_318); 
          }())
          ;
          log_event("MLInterpreter.js", 700, ctx_push(ctx_160, [{key: "#RETURN_VALUE#", val: _return_319}]), "return");
          return (_return_319); 
      }
      
    case "Pattern_array":
      var patts = patt.patts;var ctx_162 = ctx_push(ctx_155, [{key: "patts", val: patts}]);
    log_event("MLInterpreter.js", 723, ctx_162, "case");
    
      log_event("MLInterpreter.js", 722, ctx_162, "switch");
      switch (value.tag) {
        case "Value_array":
          var ary = value.value;var ctx_163 = ctx_push(ctx_162, [{key: "ary", val: ary}]);
        log_event("MLInterpreter.js", 717, ctx_163, "case");
        
          var _if_arg_320 = (function () {
            log_event("MLInterpreter.js", 709, ctx_163, "call");
            var _return_323 = ((function () {
                                log_event("MLInterpreter.js", 705, ctx_163, "call");
                                var _return_321 = MLArray.length(patts);
                                log_event("MLInterpreter.js", 704, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_321}]), "return");
                                return (_return_321); }()) === (function () {
                                log_event("MLInterpreter.js", 707, ctx_163, "call");
                                var _return_322 = MLArray.length(ary);
                                log_event("MLInterpreter.js", 706, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_322}]), "return");
                                return (_return_322); }()));
            log_event("MLInterpreter.js", 708, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_323}]), "return");
            return (_return_323); 
          }())
          ;
          log_event("MLInterpreter.js", 716, ctx_163, "if");
          if (_if_arg_320) {
            var _return_327 = (function () {
              log_event("MLInterpreter.js", 714, ctx_163, "call");
              var _return_326 = pattern_match_array(s, ctx, ary, patts);
              log_event("MLInterpreter.js", 713, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_326}]), "return");
              return (_return_326); 
            }())
            ;
            log_event("MLInterpreter.js", 715, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_327}]), "return");
            return (_return_327); 
          } else {
            var _return_325 = (function () {
              log_event("MLInterpreter.js", 711, ctx_163, "call");
              var _return_324 = Unsafe.error("Array lengths don't match");
              log_event("MLInterpreter.js", 710, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_324}]), "return");
              return (_return_324); 
            }())
            ;
            log_event("MLInterpreter.js", 712, ctx_push(ctx_163, [{key: "#RETURN_VALUE#", val: _return_325}]), "return");
            return (_return_325); 
          }
        default:log_event("MLInterpreter.js", 721, ctx_162, "case");
        
          var _return_329 = (function () {
            log_event("MLInterpreter.js", 719, ctx_162, "call");
            var _return_328 = Unsafe.error("Expected an array");
            log_event("MLInterpreter.js", 718, ctx_push(ctx_162, [{key: "#RETURN_VALUE#", val: _return_328}]), "return");
            return (_return_328); 
          }())
          ;
          log_event("MLInterpreter.js", 720, ctx_push(ctx_162, [{key: "#RETURN_VALUE#", val: _return_329}]), "return");
          return (_return_329); 
      }
      
    case "Pattern_variant":
      var label = patt.label, patt_opt = patt.arg;var ctx_164 = ctx_push(ctx_155, [{key: "label", val: label}, {key: "patt_opt", val: patt_opt}]);
    log_event("MLInterpreter.js", 761, ctx_164, "case");
    
      log_event("MLInterpreter.js", 760, ctx_164, "switch");
      switch (value.tag) {
        case "Value_variant":
          var variant = value.value;var ctx_165 = ctx_push(ctx_164, [{key: "variant", val: variant}]);
        log_event("MLInterpreter.js", 755, ctx_165, "case");
        
          var _if_arg_330 = (function () {
            log_event("MLInterpreter.js", 725, ctx_165, "call");
            var _return_331 = (variant.label === label);
            log_event("MLInterpreter.js", 724, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_331}]), "return");
            return (_return_331); 
          }())
          ;
          log_event("MLInterpreter.js", 754, ctx_165, "if");
          if (_if_arg_330) {
            log_event("MLInterpreter.js", 753, ctx_165, "switch");
            switch (patt_opt.tag) {
              case "None":log_event("MLInterpreter.js", 738, ctx_165, "case");
              
                var _switch_arg_334 = variant.value_opt;
                log_event("MLInterpreter.js", 737, ctx_165, "switch");
                switch (_switch_arg_334.tag) {
                  case "None":log_event("MLInterpreter.js", 732, ctx_165, "case");
                  
                    var _return_336 = (function () {
                      log_event("MLInterpreter.js", 730, ctx_165, "call");
                      var _return_335 = Unsafe.box(ctx);
                      log_event("MLInterpreter.js", 729, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_335}]), "return");
                      return (_return_335); 
                    }())
                    ;
                    log_event("MLInterpreter.js", 731, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_336}]), "return");
                    return (_return_336); 
                  case "Some":log_event("MLInterpreter.js", 736, ctx_165, "case");
                  
                    var _return_338 = (function () {
                      log_event("MLInterpreter.js", 734, ctx_165, "call");
                      var _return_337 = Unsafe.error(
                                          "Unexpected argument for the variant");
                      log_event("MLInterpreter.js", 733, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_337}]), "return");
                      return (_return_337); 
                    }())
                    ;
                    log_event("MLInterpreter.js", 735, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_338}]), "return");
                    return (_return_338); 
                }
                
              case "Some":
                var patt = patt_opt.value;var ctx_166 = ctx_push(ctx_165, [{key: "patt", val: patt}]);
              log_event("MLInterpreter.js", 752, ctx_166, "case");
              
                var _switch_arg_339 = variant.value_opt;
                log_event("MLInterpreter.js", 751, ctx_166, "switch");
                switch (_switch_arg_339.tag) {
                  case "None":log_event("MLInterpreter.js", 742, ctx_166, "case");
                  
                    var _return_341 = (function () {
                      log_event("MLInterpreter.js", 740, ctx_166, "call");
                      var _return_340 = Unsafe.error(
                                          "Expected an argument for the variant");
                      log_event("MLInterpreter.js", 739, ctx_push(ctx_166, [{key: "#RETURN_VALUE#", val: _return_340}]), "return");
                      return (_return_340); 
                    }())
                    ;
                    log_event("MLInterpreter.js", 741, ctx_push(ctx_166, [{key: "#RETURN_VALUE#", val: _return_341}]), "return");
                    return (_return_341); 
                  case "Some":
                    var v_nsf = _switch_arg_339.value;var ctx_167 = ctx_push(ctx_166, [{key: "v_nsf", val: v_nsf}]);
                  log_event("MLInterpreter.js", 750, ctx_167, "case");
                  
                    var _return_345 = (function () {
                      log_event("MLInterpreter.js", 748, ctx_167, "call");
                      var _return_344 = Unsafe.bind(v_nsf, function (v) {
                                            var ctx_168 = ctx_push(ctx_167, [{key: "v", val: v}]);
                                            log_event("MLInterpreter.js", 746, ctx_168, "enter");
                                            var _return_343 = (function () {
                                              log_event("MLInterpreter.js", 744, ctx_168, "call");
                                              var _return_342 = pattern_match(
                                                                  s, ctx, v,
                                                                  patt);
                                              log_event("MLInterpreter.js", 743, ctx_push(ctx_168, [{key: "#RETURN_VALUE#", val: _return_342}]), "return");
                                              return (_return_342); 
                                            }())
                                            ;
                                            log_event("MLInterpreter.js", 745, ctx_push(ctx_168, [{key: "#RETURN_VALUE#", val: _return_343}]), "return");
                                            return (_return_343); });
                      log_event("MLInterpreter.js", 747, ctx_push(ctx_167, [{key: "#RETURN_VALUE#", val: _return_344}]), "return");
                      return (_return_344); 
                    }())
                    ;
                    log_event("MLInterpreter.js", 749, ctx_push(ctx_167, [{key: "#RETURN_VALUE#", val: _return_345}]), "return");
                    return (_return_345); 
                }
                
            }
            
          } else {
            var _return_333 = (function () {
              log_event("MLInterpreter.js", 727, ctx_165, "call");
              var _return_332 = Unsafe.error("Matching failure");
              log_event("MLInterpreter.js", 726, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_332}]), "return");
              return (_return_332); 
            }())
            ;
            log_event("MLInterpreter.js", 728, ctx_push(ctx_165, [{key: "#RETURN_VALUE#", val: _return_333}]), "return");
            return (_return_333); 
          }
        default:log_event("MLInterpreter.js", 759, ctx_164, "case");
        
          var _return_347 = (function () {
            log_event("MLInterpreter.js", 757, ctx_164, "call");
            var _return_346 = Unsafe.error("Matching failure");
            log_event("MLInterpreter.js", 756, ctx_push(ctx_164, [{key: "#RETURN_VALUE#", val: _return_346}]), "return");
            return (_return_346); 
          }())
          ;
          log_event("MLInterpreter.js", 758, ctx_push(ctx_164, [{key: "#RETURN_VALUE#", val: _return_347}]), "return");
          return (_return_347); 
      }
      
    case "Pattern_alias":
      var subpatt = patt.patt, alias = patt.alias;var ctx_169 = ctx_push(ctx_155, [{key: "subpatt", val: subpatt}, {key: "alias", val: alias}]);
    log_event("MLInterpreter.js", 776, ctx_169, "case");
    
      var _return_354 = (function () {
        log_event("MLInterpreter.js", 774, ctx_169, "call");
        var _return_353 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 763, ctx_169, "call");
                              var _return_348 = pattern_match(s, ctx, value,
                                                  subpatt);
                              log_event("MLInterpreter.js", 762, ctx_push(ctx_169, [{key: "#RETURN_VALUE#", val: _return_348}]), "return");
                              return (_return_348); }()), function (ctx$) {
                              var ctx_170 = ctx_push(ctx_169, [{key: "ctx$", val: ctx$}]);
                              log_event("MLInterpreter.js", 772, ctx_170, "enter");
                              var idx = (function () {
                                log_event("MLInterpreter.js", 765, ctx_170, "call");
                                var _return_349 = Vector.append(s,
                                                    Normal(value));
                                log_event("MLInterpreter.js", 764, ctx_push(ctx_170, [{key: "#RETURN_VALUE#", val: _return_349}]), "return");
                                return (_return_349); 
                              }())
                              ;
                              var ctx_171 = ctx_push(ctx_170, [{key: "idx", val: idx}]);
                              log_event("MLInterpreter.js", 771, ctx_171, "let");
                              var _return_352 = (function () {
                                log_event("MLInterpreter.js", 769, ctx_171, "call");
                                var _return_351 = Unsafe.box((function () {
                                                      log_event("MLInterpreter.js", 767, ctx_171, "call");
                                                      var _return_350 = 
                                                      ExecutionContext.add(
                                                        alias, idx, ctx$);
                                                      log_event("MLInterpreter.js", 766, ctx_push(ctx_171, [{key: "#RETURN_VALUE#", val: _return_350}]), "return");
                                                      return (_return_350); 
                                                    }()));
                                log_event("MLInterpreter.js", 768, ctx_push(ctx_171, [{key: "#RETURN_VALUE#", val: _return_351}]), "return");
                                return (_return_351); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 770, ctx_push(ctx_171, [{key: "#RETURN_VALUE#", val: _return_352}]), "return");
                              return (_return_352); 
                              });
        log_event("MLInterpreter.js", 773, ctx_push(ctx_169, [{key: "#RETURN_VALUE#", val: _return_353}]), "return");
        return (_return_353); 
      }())
      ;
      log_event("MLInterpreter.js", 775, ctx_push(ctx_169, [{key: "#RETURN_VALUE#", val: _return_354}]), "return");
      return (_return_354); 
    case "Pattern_constructor":
      var ctor = patt.ctor, args = patt.args;var ctx_172 = ctx_push(ctx_155, [{key: "ctor", val: ctor}, {key: "args", val: args}]);
    log_event("MLInterpreter.js", 792, ctx_172, "case");
    
      var _return_363 = (function () {
        log_event("MLInterpreter.js", 790, ctx_172, "call");
        var _return_362 = do_sumtype(value, function (sum) {
                              var ctx_173 = ctx_push(ctx_172, [{key: "sum", val: sum}]);
                              log_event("MLInterpreter.js", 788, ctx_173, "enter");
                              var _if_arg_355 = (function () {
                                log_event("MLInterpreter.js", 780, ctx_173, "call");
                                var _return_357 = (sum.constructor
                                                  === (function () {
                                                    log_event("MLInterpreter.js", 778, ctx_173, "call");
                                                    var _return_356 = 
                                                    string_of_identifier(
                                                      ctor);
                                                    log_event("MLInterpreter.js", 777, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_356}]), "return");
                                                    return (_return_356); 
                                                  }()));
                                log_event("MLInterpreter.js", 779, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_357}]), "return");
                                return (_return_357); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 787, ctx_173, "if");
                              if (_if_arg_355) {
                                var _return_361 = (function () {
                                  log_event("MLInterpreter.js", 785, ctx_173, "call");
                                  var _return_360 = pattern_match_array(s,
                                                      ctx, sum.args, args);
                                  log_event("MLInterpreter.js", 784, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_360}]), "return");
                                  return (_return_360); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 786, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_361}]), "return");
                                return (_return_361); 
                              } else {
                                var _return_359 = (function () {
                                  log_event("MLInterpreter.js", 782, ctx_173, "call");
                                  var _return_358 = Unsafe.error(
                                                      "Matching failure");
                                  log_event("MLInterpreter.js", 781, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_358}]), "return");
                                  return (_return_358); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 783, ctx_push(ctx_173, [{key: "#RETURN_VALUE#", val: _return_359}]), "return");
                                return (_return_359); 
                              }});
        log_event("MLInterpreter.js", 789, ctx_push(ctx_172, [{key: "#RETURN_VALUE#", val: _return_362}]), "return");
        return (_return_362); 
      }())
      ;
      log_event("MLInterpreter.js", 791, ctx_push(ctx_172, [{key: "#RETURN_VALUE#", val: _return_363}]), "return");
      return (_return_363); 
    case "Pattern_or":
      var patt1 = patt.patt1, patt2 = patt.patt2;var ctx_174 = ctx_push(ctx_155, [{key: "patt1", val: patt1}, {key: "patt2", val: patt2}]);
    log_event("MLInterpreter.js", 804, ctx_174, "case");
    
      var _return_369 = (function () {
        log_event("MLInterpreter.js", 802, ctx_174, "call");
        var _return_368 = Unsafe.do_with_default((function () {
                              log_event("MLInterpreter.js", 794, ctx_174, "call");
                              var _return_364 = pattern_match(s, ctx, value,
                                                  patt1);
                              log_event("MLInterpreter.js", 793, ctx_push(ctx_174, [{key: "#RETURN_VALUE#", val: _return_364}]), "return");
                              return (_return_364); }()), (function () {
                              log_event("MLInterpreter.js", 796, ctx_174, "call");
                              var _return_365 = pattern_match(s, ctx, value,
                                                  patt2);
                              log_event("MLInterpreter.js", 795, ctx_push(ctx_174, [{key: "#RETURN_VALUE#", val: _return_365}]), "return");
                              return (_return_365); }()), function (ctx$) {
                              var ctx_175 = ctx_push(ctx_174, [{key: "ctx$", val: ctx$}]);
                              log_event("MLInterpreter.js", 800, ctx_175, "enter");
                              var _return_367 = (function () {
                                log_event("MLInterpreter.js", 798, ctx_175, "call");
                                var _return_366 = Unsafe.box(ctx$);
                                log_event("MLInterpreter.js", 797, ctx_push(ctx_175, [{key: "#RETURN_VALUE#", val: _return_366}]), "return");
                                return (_return_366); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 799, ctx_push(ctx_175, [{key: "#RETURN_VALUE#", val: _return_367}]), "return");
                              return (_return_367); });
        log_event("MLInterpreter.js", 801, ctx_push(ctx_174, [{key: "#RETURN_VALUE#", val: _return_368}]), "return");
        return (_return_368); 
      }())
      ;
      log_event("MLInterpreter.js", 803, ctx_push(ctx_174, [{key: "#RETURN_VALUE#", val: _return_369}]), "return");
      return (_return_369); 
  }
  
};

var pattern_match_many = function (s, ctx, value, cases) {
  var ctx_176 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "value", val: value}, {key: "cases", val: cases}]);
  log_event("MLInterpreter.js", 848, ctx_176, "enter");
  log_event("MLInterpreter.js", 847, ctx_176, "switch");
  switch (cases.tag) {
    case "[]":log_event("MLInterpreter.js", 810, ctx_176, "case");
    
      var _return_371 = (function () {
        log_event("MLInterpreter.js", 808, ctx_176, "call");
        var _return_370 = Unsafe.error("Matching failure");
        log_event("MLInterpreter.js", 807, ctx_push(ctx_176, [{key: "#RETURN_VALUE#", val: _return_370}]), "return");
        return (_return_370); 
      }())
      ;
      log_event("MLInterpreter.js", 809, ctx_push(ctx_176, [{key: "#RETURN_VALUE#", val: _return_371}]), "return");
      return (_return_371); 
    case "::":
      var x = cases.head, xs = cases.tail;var ctx_177 = ctx_push(ctx_176, [{key: "x", val: x}, {key: "xs", val: xs}]);
    log_event("MLInterpreter.js", 846, ctx_177, "case");
    
      var _switch_arg_372 = (function () {
        log_event("MLInterpreter.js", 812, ctx_177, "call");
        var _return_373 = pattern_match(s, ctx, value, x.patt);
        log_event("MLInterpreter.js", 811, ctx_push(ctx_177, [{key: "#RETURN_VALUE#", val: _return_373}]), "return");
        return (_return_373); 
      }())
      ;
      log_event("MLInterpreter.js", 845, ctx_177, "switch");
      switch (_switch_arg_372.tag) {
        case "Error":
          var e = _switch_arg_372.error;var ctx_178 = ctx_push(ctx_177, [{key: "e", val: e}]);
        log_event("MLInterpreter.js", 816, ctx_178, "case");
        
          var _return_375 = (function () {
            log_event("MLInterpreter.js", 814, ctx_178, "call");
            var _return_374 = pattern_match_many(s, ctx, value, xs);
            log_event("MLInterpreter.js", 813, ctx_push(ctx_178, [{key: "#RETURN_VALUE#", val: _return_374}]), "return");
            return (_return_374); 
          }())
          ;
          log_event("MLInterpreter.js", 815, ctx_push(ctx_178, [{key: "#RETURN_VALUE#", val: _return_375}]), "return");
          return (_return_375); 
        case "Result":
          var ctx$ = _switch_arg_372.result;var ctx_179 = ctx_push(ctx_177, [{key: "ctx$", val: ctx$}]);
        log_event("MLInterpreter.js", 842, ctx_179, "case");
        
          var _switch_arg_376 = x.guard;
          log_event("MLInterpreter.js", 841, ctx_179, "switch");
          switch (_switch_arg_376.tag) {
            case "None":log_event("MLInterpreter.js", 820, ctx_179, "case");
            
              var _return_378 = (function () {
                log_event("MLInterpreter.js", 818, ctx_179, "call");
                var _return_377 = run_expression(s, ctx$, x.expr);
                log_event("MLInterpreter.js", 817, ctx_push(ctx_179, [{key: "#RETURN_VALUE#", val: _return_377}]), "return");
                return (_return_377); 
              }())
              ;
              log_event("MLInterpreter.js", 819, ctx_push(ctx_179, [{key: "#RETURN_VALUE#", val: _return_378}]), "return");
              return (_return_378); 
            case "Some":
              var guard = _switch_arg_376.value;var ctx_180 = ctx_push(ctx_179, [{key: "guard", val: guard}]);
            log_event("MLInterpreter.js", 840, ctx_180, "case");
            
              var _return_388 = (function () {
                log_event("MLInterpreter.js", 838, ctx_180, "call");
                var _return_387 = Unsafe.bind((function () {
                                      log_event("MLInterpreter.js", 822, ctx_180, "call");
                                      var _return_379 = run_expression(s,
                                                          ctx$, guard);
                                      log_event("MLInterpreter.js", 821, ctx_push(ctx_180, [{key: "#RETURN_VALUE#", val: _return_379}]), "return");
                                      return (_return_379); }()),
                                    function (res) {
                                      var ctx_181 = ctx_push(ctx_180, [{key: "res", val: res}]);
                                      log_event("MLInterpreter.js", 836, ctx_181, "enter");
                                      var _return_386 = (function () {
                                        log_event("MLInterpreter.js", 834, ctx_181, "call");
                                        var _return_385 = Unsafe.bind(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 824, ctx_181, "call");
                                                              var _return_380 = 
                                                              bool_of_value(
                                                                res);
                                                              log_event("MLInterpreter.js", 823, ctx_push(ctx_181, [{key: "#RETURN_VALUE#", val: _return_380}]), "return");
                                                              return (_return_380); 
                                                            }()),
                                                            function (b) {
                                                              var ctx_182 = ctx_push(ctx_181, [{key: "b", val: b}]);
                                                              log_event("MLInterpreter.js", 832, ctx_182, "enter");
                                                              log_event("MLInterpreter.js", 831, ctx_182, "if");
                                                              if (b) {
                                                                var _return_384 = (function () {
                                                                  log_event("MLInterpreter.js", 829, ctx_182, "call");
                                                                  var _return_383 = 
                                                                  run_expression(
                                                                    s, ctx$,
                                                                    x.expr);
                                                                  log_event("MLInterpreter.js", 828, ctx_push(ctx_182, [{key: "#RETURN_VALUE#", val: _return_383}]), "return");
                                                                  return (_return_383); 
                                                                }())
                                                                ;
                                                                log_event("MLInterpreter.js", 830, ctx_push(ctx_182, [{key: "#RETURN_VALUE#", val: _return_384}]), "return");
                                                                return (_return_384); 
                                                              } else {
                                                                var _return_382 = (function () {
                                                                  log_event("MLInterpreter.js", 826, ctx_182, "call");
                                                                  var _return_381 = 
                                                                  pattern_match_many(
                                                                    s, ctx,
                                                                    value,
                                                                    xs);
                                                                  log_event("MLInterpreter.js", 825, ctx_push(ctx_182, [{key: "#RETURN_VALUE#", val: _return_381}]), "return");
                                                                  return (_return_381); 
                                                                }())
                                                                ;
                                                                log_event("MLInterpreter.js", 827, ctx_push(ctx_182, [{key: "#RETURN_VALUE#", val: _return_382}]), "return");
                                                                return (_return_382); 
                                                              }});
                                        log_event("MLInterpreter.js", 833, ctx_push(ctx_181, [{key: "#RETURN_VALUE#", val: _return_385}]), "return");
                                        return (_return_385); 
                                      }())
                                      ;
                                      log_event("MLInterpreter.js", 835, ctx_push(ctx_181, [{key: "#RETURN_VALUE#", val: _return_386}]), "return");
                                      return (_return_386); });
                log_event("MLInterpreter.js", 837, ctx_push(ctx_180, [{key: "#RETURN_VALUE#", val: _return_387}]), "return");
                return (_return_387); 
              }())
              ;
              log_event("MLInterpreter.js", 839, ctx_push(ctx_180, [{key: "#RETURN_VALUE#", val: _return_388}]), "return");
              return (_return_388); 
          }
          
        case "Exception":
          var ex = _switch_arg_372.except;var ctx_183 = ctx_push(ctx_177, [{key: "ex", val: ex}]);
        log_event("MLInterpreter.js", 844, ctx_183, "case");
        
          var _return_389 = Unsafe.Exception(ex);
          log_event("MLInterpreter.js", 843, ctx_push(ctx_183, [{key: "#RETURN_VALUE#", val: _return_389}]), "return");
          return (_return_389); 
      }
      
  }
  
};

var pattern_match_array = function (s, ctx, ary, patts) {
  var ctx_184 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "ary", val: ary}, {key: "patts", val: patts}]);
  log_event("MLInterpreter.js", 891, ctx_184, "enter");
  var len = (function () {
    log_event("MLInterpreter.js", 850, ctx_184, "call");
    var _return_390 = MLArray.length(patts);
    log_event("MLInterpreter.js", 849, ctx_push(ctx_184, [{key: "#RETURN_VALUE#", val: _return_390}]), "return");
    return (_return_390); 
  }())
  ;
  var ctx_185 = ctx_push(ctx_184, [{key: "len", val: len}]);
  log_event("MLInterpreter.js", 890, ctx_185, "let");
  var vallen = (function () {
    log_event("MLInterpreter.js", 852, ctx_185, "call");
    var _return_391 = MLArray.length(ary);
    log_event("MLInterpreter.js", 851, ctx_push(ctx_185, [{key: "#RETURN_VALUE#", val: _return_391}]), "return");
    return (_return_391); 
  }())
  ;
  var ctx_186 = ctx_push(ctx_185, [{key: "vallen", val: vallen}]);
  log_event("MLInterpreter.js", 889, ctx_186, "let");
  var flen = number_of_int(len);
  var ctx_187 = ctx_push(ctx_186, [{key: "flen", val: flen}]);
  log_event("MLInterpreter.js", 888, ctx_187, "let");
  var fvallen = number_of_int(vallen);
  var ctx_188 = ctx_push(ctx_187, [{key: "fvallen", val: fvallen}]);
  log_event("MLInterpreter.js", 887, ctx_188, "let");
  var min_len = (function () {
    log_event("MLInterpreter.js", 856, ctx_188, "call");
    var _return_393 = int_of_number((function () {
                          log_event("MLInterpreter.js", 854, ctx_188, "call");
                          var _return_392 = min(flen, fvallen);
                          log_event("MLInterpreter.js", 853, ctx_push(ctx_188, [{key: "#RETURN_VALUE#", val: _return_392}]), "return");
                          return (_return_392); }()));
    log_event("MLInterpreter.js", 855, ctx_push(ctx_188, [{key: "#RETURN_VALUE#", val: _return_393}]), "return");
    return (_return_393); 
  }())
  ;
  var ctx_189 = ctx_push(ctx_188, [{key: "min_len", val: min_len}]);
  log_event("MLInterpreter.js", 886, ctx_189, "let");
  var for_loop = function (ctx_nsf, i) {
    var ctx_190 = ctx_push(ctx_189, [{key: "ctx_nsf", val: ctx_nsf}, {key: "i", val: i}]);
    log_event("MLInterpreter.js", 879, ctx_190, "enter");
    var _if_arg_394 = (function () {
      log_event("MLInterpreter.js", 858, ctx_190, "call");
      var _return_395 = (i === min_len);
      log_event("MLInterpreter.js", 857, ctx_push(ctx_190, [{key: "#RETURN_VALUE#", val: _return_395}]), "return");
      return (_return_395); 
    }())
    ;
    log_event("MLInterpreter.js", 878, ctx_190, "if");
    if (_if_arg_394) {
      var _return_404 = ctx_nsf;
      log_event("MLInterpreter.js", 877, ctx_push(ctx_190, [{key: "#RETURN_VALUE#", val: _return_404}]), "return");
      return (_return_404); 
    } else {
      var some_case_func = function (ctx) {
        var ctx_191 = ctx_push(ctx_190, [{key: "ctx", val: ctx}]);
        log_event("MLInterpreter.js", 872, ctx_191, "enter");
        var vali = (function () {
          log_event("MLInterpreter.js", 860, ctx_191, "call");
          var _return_396 = MLArray.get(ary, i);
          log_event("MLInterpreter.js", 859, ctx_push(ctx_191, [{key: "#RETURN_VALUE#", val: _return_396}]), "return");
          return (_return_396); 
        }())
        ;
        var ctx_192 = ctx_push(ctx_191, [{key: "vali", val: vali}]);
        log_event("MLInterpreter.js", 871, ctx_192, "let");
        var patti = (function () {
          log_event("MLInterpreter.js", 862, ctx_192, "call");
          var _return_397 = MLArray.get(patts, i);
          log_event("MLInterpreter.js", 861, ctx_push(ctx_192, [{key: "#RETURN_VALUE#", val: _return_397}]), "return");
          return (_return_397); 
        }())
        ;
        var ctx_193 = ctx_push(ctx_192, [{key: "patti", val: patti}]);
        log_event("MLInterpreter.js", 870, ctx_193, "let");
        var _return_401 = (function () {
          log_event("MLInterpreter.js", 868, ctx_193, "call");
          var _return_400 = for_loop((function () {
                                log_event("MLInterpreter.js", 864, ctx_193, "call");
                                var _return_398 = pattern_match(s, ctx, vali,
                                                    patti);
                                log_event("MLInterpreter.js", 863, ctx_push(ctx_193, [{key: "#RETURN_VALUE#", val: _return_398}]), "return");
                                return (_return_398); }()), (function () {
                                log_event("MLInterpreter.js", 866, ctx_193, "call");
                                var _return_399 = (i + 1);
                                log_event("MLInterpreter.js", 865, ctx_push(ctx_193, [{key: "#RETURN_VALUE#", val: _return_399}]), "return");
                                return (_return_399); }()));
          log_event("MLInterpreter.js", 867, ctx_push(ctx_193, [{key: "#RETURN_VALUE#", val: _return_400}]), "return");
          return (_return_400); 
        }())
        ;
        log_event("MLInterpreter.js", 869, ctx_push(ctx_193, [{key: "#RETURN_VALUE#", val: _return_401}]), "return");
        return (_return_401); 
        
        
      };
      var ctx_194 = ctx_push(ctx_190, [{key: "some_case_func", val: some_case_func}]);
      log_event("MLInterpreter.js", 876, ctx_194, "let");
      var _return_403 = (function () {
        log_event("MLInterpreter.js", 874, ctx_194, "call");
        var _return_402 = Unsafe.bind(ctx_nsf, some_case_func);
        log_event("MLInterpreter.js", 873, ctx_push(ctx_194, [{key: "#RETURN_VALUE#", val: _return_402}]), "return");
        return (_return_402); 
      }())
      ;
      log_event("MLInterpreter.js", 875, ctx_push(ctx_194, [{key: "#RETURN_VALUE#", val: _return_403}]), "return");
      return (_return_403); 
      
    }
  };
  var ctx_195 = ctx_push(ctx_189, [{key: "for_loop", val: for_loop}]);
  log_event("MLInterpreter.js", 885, ctx_195, "let");
  var _return_407 = (function () {
    log_event("MLInterpreter.js", 883, ctx_195, "call");
    var _return_406 = for_loop((function () {
                          log_event("MLInterpreter.js", 881, ctx_195, "call");
                          var _return_405 = Unsafe.box(ctx);
                          log_event("MLInterpreter.js", 880, ctx_push(ctx_195, [{key: "#RETURN_VALUE#", val: _return_405}]), "return");
                          return (_return_405); }()), 0);
    log_event("MLInterpreter.js", 882, ctx_push(ctx_195, [{key: "#RETURN_VALUE#", val: _return_406}]), "return");
    return (_return_406); 
  }())
  ;
  log_event("MLInterpreter.js", 884, ctx_push(ctx_195, [{key: "#RETURN_VALUE#", val: _return_407}]), "return");
  return (_return_407); 
  
  
  
  
  
  
};

var run_structure_item = function (s, ctx, _term_) {
  var ctx_196 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "_term_", val: _term_}]);
  log_event("MLInterpreter.js", 1108, ctx_196, "enter");
  log_event("MLInterpreter.js", 1107, ctx_196, "switch");
  switch (_term_.tag) {
    case "Structure_eval":
      var e = _term_.expr;var ctx_197 = ctx_push(ctx_196, [{key: "e", val: e}]);
    log_event("MLInterpreter.js", 901, ctx_197, "case");
    
      var _return_412 = (function () {
        log_event("MLInterpreter.js", 899, ctx_197, "call");
        var _return_411 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 893, ctx_197, "call");
                              var _return_408 = run_expression(s, ctx, e);
                              log_event("MLInterpreter.js", 892, ctx_push(ctx_197, [{key: "#RETURN_VALUE#", val: _return_408}]), "return");
                              return (_return_408); }()), function (v) {
                              var ctx_198 = ctx_push(ctx_197, [{key: "v", val: v}]);
                              log_event("MLInterpreter.js", 897, ctx_198, "enter");
                              var _return_410 = (function () {
                                log_event("MLInterpreter.js", 895, ctx_198, "call");
                                var _return_409 = Unsafe.box({
                                                      value: v,
                                                      ctx: ctx});
                                log_event("MLInterpreter.js", 894, ctx_push(ctx_198, [{key: "#RETURN_VALUE#", val: _return_409}]), "return");
                                return (_return_409); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 896, ctx_push(ctx_198, [{key: "#RETURN_VALUE#", val: _return_410}]), "return");
                              return (_return_410); });
        log_event("MLInterpreter.js", 898, ctx_push(ctx_197, [{key: "#RETURN_VALUE#", val: _return_411}]), "return");
        return (_return_411); 
      }())
      ;
      log_event("MLInterpreter.js", 900, ctx_push(ctx_197, [{key: "#RETURN_VALUE#", val: _return_412}]), "return");
      return (_return_412); 
    case "Structure_value":
      var is_rec = _term_.is_rec, patts = _term_.ids, exp_ary = _term_.exps;var ctx_199 = ctx_push(ctx_196, [{key: "is_rec", val: is_rec}, {key: "patts", val: patts}, {key: "exp_ary", val: exp_ary}]);
    log_event("MLInterpreter.js", 1033, ctx_199, "case");
    
      log_event("MLInterpreter.js", 1032, ctx_199, "if");
      if (is_rec) {
        var prealloc = function (p) {
          var ctx_214 = ctx_push(ctx_199, [{key: "p", val: p}]);
          log_event("MLInterpreter.js", 973, ctx_214, "enter");
          log_event("MLInterpreter.js", 972, ctx_214, "switch");
          switch (p.tag) {
            case "Pattern_var":
              var id = p.id;var ctx_215 = ctx_push(ctx_214, [{key: "id", val: id}]);
            log_event("MLInterpreter.js", 967, ctx_215, "case");
            
              var _return_441 = (function () {
                log_event("MLInterpreter.js", 965, ctx_215, "call");
                var _return_440 = Unsafe.box(id);
                log_event("MLInterpreter.js", 964, ctx_push(ctx_215, [{key: "#RETURN_VALUE#", val: _return_440}]), "return");
                return (_return_440); 
              }())
              ;
              log_event("MLInterpreter.js", 966, ctx_push(ctx_215, [{key: "#RETURN_VALUE#", val: _return_441}]), "return");
              return (_return_441); 
            default:log_event("MLInterpreter.js", 971, ctx_214, "case");
            
              var _return_443 = (function () {
                log_event("MLInterpreter.js", 969, ctx_214, "call");
                var _return_442 = Unsafe.error(
                                    "Used a pattern other than variable in recursive definition");
                log_event("MLInterpreter.js", 968, ctx_push(ctx_214, [{key: "#RETURN_VALUE#", val: _return_442}]), "return");
                return (_return_442); 
              }())
              ;
              log_event("MLInterpreter.js", 970, ctx_push(ctx_214, [{key: "#RETURN_VALUE#", val: _return_443}]), "return");
              return (_return_443); 
          }
          
        };
        var ctx_216 = ctx_push(ctx_199, [{key: "prealloc", val: prealloc}]);
        log_event("MLInterpreter.js", 1031, ctx_216, "let");
        var exps = (function () {
          log_event("MLInterpreter.js", 975, ctx_216, "call");
          var _return_444 = MLList.of_array(exp_ary);
          log_event("MLInterpreter.js", 974, ctx_push(ctx_216, [{key: "#RETURN_VALUE#", val: _return_444}]), "return");
          return (_return_444); 
        }())
        ;
        var ctx_217 = ctx_push(ctx_216, [{key: "exps", val: exps}]);
        log_event("MLInterpreter.js", 1030, ctx_217, "let");
        var prealloc_vars = (function () {
          log_event("MLInterpreter.js", 977, ctx_217, "call");
          var _return_445 = MLArray.map(prealloc, patts);
          log_event("MLInterpreter.js", 976, ctx_push(ctx_217, [{key: "#RETURN_VALUE#", val: _return_445}]), "return");
          return (_return_445); 
        }())
        ;
        var ctx_218 = ctx_push(ctx_217, [{key: "prealloc_vars", val: prealloc_vars}]);
        log_event("MLInterpreter.js", 1029, ctx_218, "let");
        var _return_468 = (function () {
          log_event("MLInterpreter.js", 1027, ctx_218, "call");
          var _return_467 = Unsafe.bind((function () {
                                log_event("MLInterpreter.js", 979, ctx_218, "call");
                                var _return_446 = MLArray.sequence_unsafe(
                                                    prealloc_vars);
                                log_event("MLInterpreter.js", 978, ctx_push(ctx_218, [{key: "#RETURN_VALUE#", val: _return_446}]), "return");
                                return (_return_446); }()),
                              function (id_ary) {
                                var ctx_219 = ctx_push(ctx_218, [{key: "id_ary", val: id_ary}]);
                                log_event("MLInterpreter.js", 1025, ctx_219, "enter");
                                var ids = (function () {
                                  log_event("MLInterpreter.js", 981, ctx_219, "call");
                                  var _return_447 = MLList.of_array(id_ary);
                                  log_event("MLInterpreter.js", 980, ctx_push(ctx_219, [{key: "#RETURN_VALUE#", val: _return_447}]), "return");
                                  return (_return_447); 
                                }())
                                ;
                                var ctx_220 = ctx_push(ctx_219, [{key: "ids", val: ids}]);
                                log_event("MLInterpreter.js", 1024, ctx_220, "let");
                                var func = function (ctx, id, exp) {
                                  var ctx_221 = ctx_push(ctx_220, [{key: "ctx", val: ctx}, {key: "id", val: id}, {key: "exp", val: exp}]);
                                  log_event("MLInterpreter.js", 991, ctx_221, "enter");
                                  var idx = (function () {
                                    log_event("MLInterpreter.js", 983, ctx_221, "call");
                                    var _return_448 = Vector.append(s,
                                                        Prealloc(exp, ctx));
                                    log_event("MLInterpreter.js", 982, ctx_push(ctx_221, [{key: "#RETURN_VALUE#", val: _return_448}]), "return");
                                    return (_return_448); 
                                  }())
                                  ;
                                  var ctx_222 = ctx_push(ctx_221, [{key: "idx", val: idx}]);
                                  log_event("MLInterpreter.js", 990, ctx_222, "let");
                                  var ctx$ = (function () {
                                    log_event("MLInterpreter.js", 985, ctx_222, "call");
                                    var _return_449 = ExecutionContext.add(
                                                        id, idx, ctx);
                                    log_event("MLInterpreter.js", 984, ctx_push(ctx_222, [{key: "#RETURN_VALUE#", val: _return_449}]), "return");
                                    return (_return_449); 
                                  }())
                                  ;
                                  var ctx_223 = ctx_push(ctx_222, [{key: "ctx$", val: ctx$}]);
                                  log_event("MLInterpreter.js", 989, ctx_223, "let");
                                  (function () {
                                    log_event("MLInterpreter.js", 988, ctx_223, "call");
                                    var _return_451 = Vector.set(s, idx,
                                                        Prealloc(exp, ctx$));
                                    log_event("MLInterpreter.js", 987, ctx_push(ctx_223, [{key: "#RETURN_VALUE#", val: _return_451}]), "return");
                                    return (_return_451); 
                                  }())
                                  ;
                                  var _return_450 = ctx$;
                                  log_event("MLInterpreter.js", 986, ctx_push(ctx_223, [{key: "#RETURN_VALUE#", val: _return_450}]), "return");
                                  return (_return_450); 
                                  
                                  
                                };
                                var ctx_224 = ctx_push(ctx_220, [{key: "func", val: func}]);
                                log_event("MLInterpreter.js", 1023, ctx_224, "let");
                                var ctx$ = (function () {
                                  log_event("MLInterpreter.js", 993, ctx_224, "call");
                                  var _return_452 = MLList.foldl2(func, ctx,
                                                      ids, exps);
                                  log_event("MLInterpreter.js", 992, ctx_push(ctx_224, [{key: "#RETURN_VALUE#", val: _return_452}]), "return");
                                  return (_return_452); 
                                }())
                                ;
                                var ctx_225 = ctx_push(ctx_224, [{key: "ctx$", val: ctx$}]);
                                log_event("MLInterpreter.js", 1022, ctx_225, "let");
                                var id = (function () {
                                  log_event("MLInterpreter.js", 999, ctx_225, "call");
                                  var _return_455 = MLArray.get(id_ary,
                                                      (function () {
                                                        log_event("MLInterpreter.js", 997, ctx_225, "call");
                                                        var _return_454 = 
                                                        ((function () {
                                                          log_event("MLInterpreter.js", 995, ctx_225, "call");
                                                          var _return_453 = 
                                                          MLArray.length(
                                                            id_ary);
                                                          log_event("MLInterpreter.js", 994, ctx_push(ctx_225, [{key: "#RETURN_VALUE#", val: _return_453}]), "return");
                                                          return (_return_453); 
                                                        }()) - 1);
                                                        log_event("MLInterpreter.js", 996, ctx_push(ctx_225, [{key: "#RETURN_VALUE#", val: _return_454}]), "return");
                                                        return (_return_454); 
                                                      }()));
                                  log_event("MLInterpreter.js", 998, ctx_push(ctx_225, [{key: "#RETURN_VALUE#", val: _return_455}]), "return");
                                  return (_return_455); 
                                }())
                                ;
                                var ctx_226 = ctx_push(ctx_225, [{key: "id", val: id}]);
                                log_event("MLInterpreter.js", 1021, ctx_226, "let");
                                var _return_466 = (function () {
                                  log_event("MLInterpreter.js", 1019, ctx_226, "call");
                                  var _return_465 = Unsafe.bind(
                                                      (function () {
                                                        log_event("MLInterpreter.js", 1001, ctx_226, "call");
                                                        var _return_456 = 
                                                        ExecutionContext.find(
                                                          id, ctx$);
                                                        log_event("MLInterpreter.js", 1000, ctx_push(ctx_226, [{key: "#RETURN_VALUE#", val: _return_456}]), "return");
                                                        return (_return_456); 
                                                      }()), function (idx) {
                                                        var ctx_227 = ctx_push(ctx_226, [{key: "idx", val: idx}]);
                                                        log_event("MLInterpreter.js", 1017, ctx_227, "enter");
                                                        var _return_464 = (function () {
                                                          log_event("MLInterpreter.js", 1015, ctx_227, "call");
                                                          var _return_463 = 
                                                          Unsafe.bind(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 1003, ctx_227, "call");
                                                              var _return_457 = 
                                                              Vector.find(s,
                                                                idx);
                                                              log_event("MLInterpreter.js", 1002, ctx_push(ctx_227, [{key: "#RETURN_VALUE#", val: _return_457}]), "return");
                                                              return (_return_457); 
                                                            }()),
                                                            function (binding) {
                                                              var ctx_228 = ctx_push(ctx_227, [{key: "binding", val: binding}]);
                                                              log_event("MLInterpreter.js", 1013, ctx_228, "enter");
                                                              var _return_462 = (function () {
                                                                log_event("MLInterpreter.js", 1011, ctx_228, "call");
                                                                var _return_461 = 
                                                                Unsafe.bind(
                                                                  (function () {
                                                                    log_event("MLInterpreter.js", 1005, ctx_228, "call");
                                                                    var _return_458 = 
                                                                    value_of(
                                                                    s, ctx$,
                                                                    binding);
                                                                    log_event("MLInterpreter.js", 1004, ctx_push(ctx_228, [{key: "#RETURN_VALUE#", val: _return_458}]), "return");
                                                                    return (_return_458); 
                                                                  }()),
                                                                  function (v) {
                                                                    var ctx_229 = ctx_push(ctx_228, [{key: "v", val: v}]);
                                                                    log_event("MLInterpreter.js", 1009, ctx_229, "enter");
                                                                    var _return_460 = (function () {
                                                                    log_event("MLInterpreter.js", 1007, ctx_229, "call");
                                                                    var _return_459 = 
                                                                    Unsafe.box(
                                                                    {
                                                                    value: v,
                                                                    ctx: ctx$
                                                                    });
                                                                    log_event("MLInterpreter.js", 1006, ctx_push(ctx_229, [{key: "#RETURN_VALUE#", val: _return_459}]), "return");
                                                                    return (_return_459); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 1008, ctx_push(ctx_229, [{key: "#RETURN_VALUE#", val: _return_460}]), "return");
                                                                    return (_return_460); 
                                                                  });
                                                                log_event("MLInterpreter.js", 1010, ctx_push(ctx_228, [{key: "#RETURN_VALUE#", val: _return_461}]), "return");
                                                                return (_return_461); 
                                                              }())
                                                              ;
                                                              log_event("MLInterpreter.js", 1012, ctx_push(ctx_228, [{key: "#RETURN_VALUE#", val: _return_462}]), "return");
                                                              return (_return_462); 
                                                            });
                                                          log_event("MLInterpreter.js", 1014, ctx_push(ctx_227, [{key: "#RETURN_VALUE#", val: _return_463}]), "return");
                                                          return (_return_463); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 1016, ctx_push(ctx_227, [{key: "#RETURN_VALUE#", val: _return_464}]), "return");
                                                        return (_return_464); 
                                                      });
                                  log_event("MLInterpreter.js", 1018, ctx_push(ctx_226, [{key: "#RETURN_VALUE#", val: _return_465}]), "return");
                                  return (_return_465); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 1020, ctx_push(ctx_226, [{key: "#RETURN_VALUE#", val: _return_466}]), "return");
                                return (_return_466); 
                                
                                
                                
                                });
          log_event("MLInterpreter.js", 1026, ctx_push(ctx_218, [{key: "#RETURN_VALUE#", val: _return_467}]), "return");
          return (_return_467); 
        }())
        ;
        log_event("MLInterpreter.js", 1028, ctx_push(ctx_218, [{key: "#RETURN_VALUE#", val: _return_468}]), "return");
        return (_return_468); 
        
        
        
      } else {
        var func = function (ctx_nsf, patt, exp) {
          var ctx_200 = ctx_push(ctx_199, [{key: "ctx_nsf", val: ctx_nsf}, {key: "patt", val: patt}, {key: "exp", val: exp}]);
          log_event("MLInterpreter.js", 915, ctx_200, "enter");
          var _return_419 = (function () {
            log_event("MLInterpreter.js", 913, ctx_200, "call");
            var _return_418 = Unsafe.bind(ctx_nsf, function (ctx) {
                                  var ctx_201 = ctx_push(ctx_200, [{key: "ctx", val: ctx}]);
                                  log_event("MLInterpreter.js", 911, ctx_201, "enter");
                                  var _return_417 = (function () {
                                    log_event("MLInterpreter.js", 909, ctx_201, "call");
                                    var _return_416 = Unsafe.bind(
                                                        (function () {
                                                          log_event("MLInterpreter.js", 903, ctx_201, "call");
                                                          var _return_413 = 
                                                          run_expression(s,
                                                            ctx, exp);
                                                          log_event("MLInterpreter.js", 902, ctx_push(ctx_201, [{key: "#RETURN_VALUE#", val: _return_413}]), "return");
                                                          return (_return_413); 
                                                        }()), function (v) {
                                                          var ctx_202 = ctx_push(ctx_201, [{key: "v", val: v}]);
                                                          log_event("MLInterpreter.js", 907, ctx_202, "enter");
                                                          var _return_415 = (function () {
                                                            log_event("MLInterpreter.js", 905, ctx_202, "call");
                                                            var _return_414 = 
                                                            pattern_match(s,
                                                              ctx, v, patt);
                                                            log_event("MLInterpreter.js", 904, ctx_push(ctx_202, [{key: "#RETURN_VALUE#", val: _return_414}]), "return");
                                                            return (_return_414); 
                                                          }())
                                                          ;
                                                          log_event("MLInterpreter.js", 906, ctx_push(ctx_202, [{key: "#RETURN_VALUE#", val: _return_415}]), "return");
                                                          return (_return_415); 
                                                        });
                                    log_event("MLInterpreter.js", 908, ctx_push(ctx_201, [{key: "#RETURN_VALUE#", val: _return_416}]), "return");
                                    return (_return_416); 
                                  }())
                                  ;
                                  log_event("MLInterpreter.js", 910, ctx_push(ctx_201, [{key: "#RETURN_VALUE#", val: _return_417}]), "return");
                                  return (_return_417); });
            log_event("MLInterpreter.js", 912, ctx_push(ctx_200, [{key: "#RETURN_VALUE#", val: _return_418}]), "return");
            return (_return_418); 
          }())
          ;
          log_event("MLInterpreter.js", 914, ctx_push(ctx_200, [{key: "#RETURN_VALUE#", val: _return_419}]), "return");
          return (_return_419); 
        };
        var ctx_203 = ctx_push(ctx_199, [{key: "func", val: func}]);
        log_event("MLInterpreter.js", 963, ctx_203, "let");
        var patt_list = (function () {
          log_event("MLInterpreter.js", 917, ctx_203, "call");
          var _return_420 = MLList.of_array(patts);
          log_event("MLInterpreter.js", 916, ctx_push(ctx_203, [{key: "#RETURN_VALUE#", val: _return_420}]), "return");
          return (_return_420); 
        }())
        ;
        var ctx_204 = ctx_push(ctx_203, [{key: "patt_list", val: patt_list}]);
        log_event("MLInterpreter.js", 962, ctx_204, "let");
        var exps = (function () {
          log_event("MLInterpreter.js", 919, ctx_204, "call");
          var _return_421 = MLList.of_array(exp_ary);
          log_event("MLInterpreter.js", 918, ctx_push(ctx_204, [{key: "#RETURN_VALUE#", val: _return_421}]), "return");
          return (_return_421); 
        }())
        ;
        var ctx_205 = ctx_push(ctx_204, [{key: "exps", val: exps}]);
        log_event("MLInterpreter.js", 961, ctx_205, "let");
        var _return_439 = (function () {
          log_event("MLInterpreter.js", 959, ctx_205, "call");
          var _return_438 = Unsafe.bind((function () {
                                log_event("MLInterpreter.js", 923, ctx_205, "call");
                                var _return_423 = MLList.foldl2(func,
                                                    (function () {
                                                      log_event("MLInterpreter.js", 921, ctx_205, "call");
                                                      var _return_422 = 
                                                      Unsafe.box(ctx);
                                                      log_event("MLInterpreter.js", 920, ctx_push(ctx_205, [{key: "#RETURN_VALUE#", val: _return_422}]), "return");
                                                      return (_return_422); 
                                                    }()), patt_list, exps);
                                log_event("MLInterpreter.js", 922, ctx_push(ctx_205, [{key: "#RETURN_VALUE#", val: _return_423}]), "return");
                                return (_return_423); }()), function (ctx$) {
                                var ctx_206 = ctx_push(ctx_205, [{key: "ctx$", val: ctx$}]);
                                log_event("MLInterpreter.js", 957, ctx_206, "enter");
                                var elems = (function () {
                                  log_event("MLInterpreter.js", 927, ctx_206, "call");
                                  var _return_425 = Map.elems((function () {
                                                        log_event("MLInterpreter.js", 925, ctx_206, "call");
                                                        var _return_424 = 
                                                        ExecutionContext.execution_ctx_lexical_env(
                                                          ctx$);
                                                        log_event("MLInterpreter.js", 924, ctx_push(ctx_206, [{key: "#RETURN_VALUE#", val: _return_424}]), "return");
                                                        return (_return_424); 
                                                      }()));
                                  log_event("MLInterpreter.js", 926, ctx_push(ctx_206, [{key: "#RETURN_VALUE#", val: _return_425}]), "return");
                                  return (_return_425); 
                                }())
                                ;
                                var ctx_207 = ctx_push(ctx_206, [{key: "elems", val: elems}]);
                                log_event("MLInterpreter.js", 956, ctx_207, "let");
                                var rev_elems = (function () {
                                  log_event("MLInterpreter.js", 929, ctx_207, "call");
                                  var _return_426 = MLList.rev(elems);
                                  log_event("MLInterpreter.js", 928, ctx_push(ctx_207, [{key: "#RETURN_VALUE#", val: _return_426}]), "return");
                                  return (_return_426); 
                                }())
                                ;
                                var ctx_208 = ctx_push(ctx_207, [{key: "rev_elems", val: rev_elems}]);
                                log_event("MLInterpreter.js", 955, ctx_208, "let");
                                log_event("MLInterpreter.js", 934, ctx_208, "switch");
                                switch (rev_elems.tag) {
                                  case "[]":log_event("MLInterpreter.js", 930, ctx_208, "case");
                                  
                                    throw false;
                                    break;
                                  case "::":
                                    var h = rev_elems.head,
                                      t = rev_elems.tail;var ctx_209 = ctx_push(ctx_208, [{key: "h", val: h}, {key: "t", val: t}]);
                                  log_event("MLInterpreter.js", 933, ctx_209, "case");
                                  
                                    var idx_opt = (function () {
                                      log_event("MLInterpreter.js", 932, ctx_209, "call");
                                      var _return_427 = Unsafe.box(h);
                                      log_event("MLInterpreter.js", 931, ctx_push(ctx_209, [{key: "#RETURN_VALUE#", val: _return_427}]), "return");
                                      return (_return_427); 
                                    }())
                                    ;
                                    break;
                                }
                                
                                var ctx_210 = ctx_push(ctx_208, [{key: "idx_opt", val: idx_opt}]);
                                log_event("MLInterpreter.js", 954, ctx_210, "let");
                                var _return_437 = (function () {
                                  log_event("MLInterpreter.js", 952, ctx_210, "call");
                                  var _return_436 = Unsafe.bind(idx_opt,
                                                      function (idx) {
                                                        var ctx_211 = ctx_push(ctx_210, [{key: "idx", val: idx}]);
                                                        log_event("MLInterpreter.js", 950, ctx_211, "enter");
                                                        var _return_435 = (function () {
                                                          log_event("MLInterpreter.js", 948, ctx_211, "call");
                                                          var _return_434 = 
                                                          Unsafe.bind(
                                                            (function () {
                                                              log_event("MLInterpreter.js", 936, ctx_211, "call");
                                                              var _return_428 = 
                                                              Vector.find(s,
                                                                idx);
                                                              log_event("MLInterpreter.js", 935, ctx_push(ctx_211, [{key: "#RETURN_VALUE#", val: _return_428}]), "return");
                                                              return (_return_428); 
                                                            }()),
                                                            function (last) {
                                                              var ctx_212 = ctx_push(ctx_211, [{key: "last", val: last}]);
                                                              log_event("MLInterpreter.js", 946, ctx_212, "enter");
                                                              var _return_433 = (function () {
                                                                log_event("MLInterpreter.js", 944, ctx_212, "call");
                                                                var _return_432 = 
                                                                Unsafe.bind(
                                                                  (function () {
                                                                    log_event("MLInterpreter.js", 938, ctx_212, "call");
                                                                    var _return_429 = 
                                                                    value_of(
                                                                    s, ctx$,
                                                                    last);
                                                                    log_event("MLInterpreter.js", 937, ctx_push(ctx_212, [{key: "#RETURN_VALUE#", val: _return_429}]), "return");
                                                                    return (_return_429); 
                                                                  }()),
                                                                  function (v) {
                                                                    var ctx_213 = ctx_push(ctx_212, [{key: "v", val: v}]);
                                                                    log_event("MLInterpreter.js", 942, ctx_213, "enter");
                                                                    var _return_431 = (function () {
                                                                    log_event("MLInterpreter.js", 940, ctx_213, "call");
                                                                    var _return_430 = 
                                                                    Unsafe.box(
                                                                    {
                                                                    value: v,
                                                                    ctx: ctx$
                                                                    });
                                                                    log_event("MLInterpreter.js", 939, ctx_push(ctx_213, [{key: "#RETURN_VALUE#", val: _return_430}]), "return");
                                                                    return (_return_430); 
                                                                    }())
                                                                    ;
                                                                    log_event("MLInterpreter.js", 941, ctx_push(ctx_213, [{key: "#RETURN_VALUE#", val: _return_431}]), "return");
                                                                    return (_return_431); 
                                                                  });
                                                                log_event("MLInterpreter.js", 943, ctx_push(ctx_212, [{key: "#RETURN_VALUE#", val: _return_432}]), "return");
                                                                return (_return_432); 
                                                              }())
                                                              ;
                                                              log_event("MLInterpreter.js", 945, ctx_push(ctx_212, [{key: "#RETURN_VALUE#", val: _return_433}]), "return");
                                                              return (_return_433); 
                                                            });
                                                          log_event("MLInterpreter.js", 947, ctx_push(ctx_211, [{key: "#RETURN_VALUE#", val: _return_434}]), "return");
                                                          return (_return_434); 
                                                        }())
                                                        ;
                                                        log_event("MLInterpreter.js", 949, ctx_push(ctx_211, [{key: "#RETURN_VALUE#", val: _return_435}]), "return");
                                                        return (_return_435); 
                                                      });
                                  log_event("MLInterpreter.js", 951, ctx_push(ctx_210, [{key: "#RETURN_VALUE#", val: _return_436}]), "return");
                                  return (_return_436); 
                                }())
                                ;
                                log_event("MLInterpreter.js", 953, ctx_push(ctx_210, [{key: "#RETURN_VALUE#", val: _return_437}]), "return");
                                return (_return_437); 
                                
                                
                                });
          log_event("MLInterpreter.js", 958, ctx_push(ctx_205, [{key: "#RETURN_VALUE#", val: _return_438}]), "return");
          return (_return_438); 
        }())
        ;
        log_event("MLInterpreter.js", 960, ctx_push(ctx_205, [{key: "#RETURN_VALUE#", val: _return_439}]), "return");
        return (_return_439); 
        
        
        
      }
    case "Structure_type":log_event("MLInterpreter.js", 1037, ctx_196, "case");
    
      var _return_470 = (function () {
        log_event("MLInterpreter.js", 1035, ctx_196, "call");
        var _return_469 = Unsafe.box({ value: nil,
                                       ctx: ctx});
        log_event("MLInterpreter.js", 1034, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_469}]), "return");
        return (_return_469); 
      }())
      ;
      log_event("MLInterpreter.js", 1036, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_470}]), "return");
      return (_return_470); 
    case "Structure_module":
      var id = _term_.id, expr = _term_.expr;var ctx_230 = ctx_push(ctx_196, [{key: "id", val: id}, {key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 1053, ctx_230, "case");
    
      var _return_477 = (function () {
        log_event("MLInterpreter.js", 1051, ctx_230, "call");
        var _return_476 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 1039, ctx_230, "call");
                              var _return_471 = run_module_expression(s, ctx,
                                                  expr);
                              log_event("MLInterpreter.js", 1038, ctx_push(ctx_230, [{key: "#RETURN_VALUE#", val: _return_471}]), "return");
                              return (_return_471); }()), function (m) {
                              var ctx_231 = ctx_push(ctx_230, [{key: "m", val: m}]);
                              log_event("MLInterpreter.js", 1049, ctx_231, "enter");
                              var idx = (function () {
                                log_event("MLInterpreter.js", 1041, ctx_231, "call");
                                var _return_472 = Vector.append(s, Normal(m));
                                log_event("MLInterpreter.js", 1040, ctx_push(ctx_231, [{key: "#RETURN_VALUE#", val: _return_472}]), "return");
                                return (_return_472); 
                              }())
                              ;
                              var ctx_232 = ctx_push(ctx_231, [{key: "idx", val: idx}]);
                              log_event("MLInterpreter.js", 1048, ctx_232, "let");
                              var ctx$ = (function () {
                                log_event("MLInterpreter.js", 1043, ctx_232, "call");
                                var _return_473 = ExecutionContext.add(id,
                                                    idx, ctx);
                                log_event("MLInterpreter.js", 1042, ctx_push(ctx_232, [{key: "#RETURN_VALUE#", val: _return_473}]), "return");
                                return (_return_473); 
                              }())
                              ;
                              var ctx_233 = ctx_push(ctx_232, [{key: "ctx$", val: ctx$}]);
                              log_event("MLInterpreter.js", 1047, ctx_233, "let");
                              var _return_475 = (function () {
                                log_event("MLInterpreter.js", 1045, ctx_233, "call");
                                var _return_474 = Unsafe.box({
                                                      value: m,
                                                      ctx: ctx$});
                                log_event("MLInterpreter.js", 1044, ctx_push(ctx_233, [{key: "#RETURN_VALUE#", val: _return_474}]), "return");
                                return (_return_474); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 1046, ctx_push(ctx_233, [{key: "#RETURN_VALUE#", val: _return_475}]), "return");
                              return (_return_475); 
                              
                              });
        log_event("MLInterpreter.js", 1050, ctx_push(ctx_230, [{key: "#RETURN_VALUE#", val: _return_476}]), "return");
        return (_return_476); 
      }())
      ;
      log_event("MLInterpreter.js", 1052, ctx_push(ctx_230, [{key: "#RETURN_VALUE#", val: _return_477}]), "return");
      return (_return_477); 
    case "Structure_modtype":log_event("MLInterpreter.js", 1057, ctx_196, "case");
    
      var _return_479 = (function () {
        log_event("MLInterpreter.js", 1055, ctx_196, "call");
        var _return_478 = Unsafe.box({ value: nil,
                                       ctx: ctx});
        log_event("MLInterpreter.js", 1054, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_478}]), "return");
        return (_return_478); 
      }())
      ;
      log_event("MLInterpreter.js", 1056, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_479}]), "return");
      return (_return_479); 
    case "Structure_include":
      var expr = _term_.expr;var ctx_234 = ctx_push(ctx_196, [{key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 1080, ctx_234, "case");
    
      var _return_489 = (function () {
        log_event("MLInterpreter.js", 1078, ctx_234, "call");
        var _return_488 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 1059, ctx_234, "call");
                              var _return_480 = run_module_expression(s, ctx,
                                                  expr);
                              log_event("MLInterpreter.js", 1058, ctx_push(ctx_234, [{key: "#RETURN_VALUE#", val: _return_480}]), "return");
                              return (_return_480); }()), function (value) {
                              var ctx_235 = ctx_push(ctx_234, [{key: "value", val: value}]);
                              log_event("MLInterpreter.js", 1076, ctx_235, "enter");
                              log_event("MLInterpreter.js", 1075, ctx_235, "switch");
                              switch (value.tag) {
                                case "Value_struct":
                                  var str = value.value;var ctx_236 = ctx_push(ctx_235, [{key: "str", val: str}]);
                                log_event("MLInterpreter.js", 1070, ctx_236, "case");
                                
                                  var map = (function () {
                                    log_event("MLInterpreter.js", 1063, ctx_236, "call");
                                    var _return_482 = Map.union(str,
                                                        (function () {
                                                          log_event("MLInterpreter.js", 1061, ctx_236, "call");
                                                          var _return_481 = 
                                                          ExecutionContext.execution_ctx_lexical_env(
                                                            ctx);
                                                          log_event("MLInterpreter.js", 1060, ctx_push(ctx_236, [{key: "#RETURN_VALUE#", val: _return_481}]), "return");
                                                          return (_return_481); 
                                                        }()));
                                    log_event("MLInterpreter.js", 1062, ctx_push(ctx_236, [{key: "#RETURN_VALUE#", val: _return_482}]), "return");
                                    return (_return_482); 
                                  }())
                                  ;
                                  var ctx_237 = ctx_push(ctx_236, [{key: "map", val: map}]);
                                  log_event("MLInterpreter.js", 1069, ctx_237, "let");
                                  var _return_485 = (function () {
                                    log_event("MLInterpreter.js", 1067, ctx_237, "call");
                                    var _return_484 = Unsafe.box({
                                                          value: nil,
                                                          ctx: (function () {
                                                            log_event("MLInterpreter.js", 1065, ctx_237, "call");
                                                            var _return_483 = 
                                                            ExecutionContext.from_map(
                                                              map);
                                                            log_event("MLInterpreter.js", 1064, ctx_push(ctx_237, [{key: "#RETURN_VALUE#", val: _return_483}]), "return");
                                                            return (_return_483); 
                                                          }())
                                                          });
                                    log_event("MLInterpreter.js", 1066, ctx_push(ctx_237, [{key: "#RETURN_VALUE#", val: _return_484}]), "return");
                                    return (_return_484); 
                                  }())
                                  ;
                                  log_event("MLInterpreter.js", 1068, ctx_push(ctx_237, [{key: "#RETURN_VALUE#", val: _return_485}]), "return");
                                  return (_return_485); 
                                  
                                default:log_event("MLInterpreter.js", 1074, ctx_235, "case");
                                
                                  var _return_487 = (function () {
                                    log_event("MLInterpreter.js", 1072, ctx_235, "call");
                                    var _return_486 = Unsafe.error(
                                                        "Expected a module value");
                                    log_event("MLInterpreter.js", 1071, ctx_push(ctx_235, [{key: "#RETURN_VALUE#", val: _return_486}]), "return");
                                    return (_return_486); 
                                  }())
                                  ;
                                  log_event("MLInterpreter.js", 1073, ctx_push(ctx_235, [{key: "#RETURN_VALUE#", val: _return_487}]), "return");
                                  return (_return_487); 
                              }
                              });
        log_event("MLInterpreter.js", 1077, ctx_push(ctx_234, [{key: "#RETURN_VALUE#", val: _return_488}]), "return");
        return (_return_488); 
      }())
      ;
      log_event("MLInterpreter.js", 1079, ctx_push(ctx_234, [{key: "#RETURN_VALUE#", val: _return_489}]), "return");
      return (_return_489); 
    case "Structure_primitive":log_event("MLInterpreter.js", 1084, ctx_196, "case");
    
      var _return_491 = (function () {
        log_event("MLInterpreter.js", 1082, ctx_196, "call");
        var _return_490 = Unsafe.box({ value: nil,
                                       ctx: ctx});
        log_event("MLInterpreter.js", 1081, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_490}]), "return");
        return (_return_490); 
      }())
      ;
      log_event("MLInterpreter.js", 1083, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_491}]), "return");
      return (_return_491); 
    case "Structure_exception":log_event("MLInterpreter.js", 1088, ctx_196, "case");
    
      var _return_493 = (function () {
        log_event("MLInterpreter.js", 1086, ctx_196, "call");
        var _return_492 = Unsafe.box({ value: nil,
                                       ctx: ctx});
        log_event("MLInterpreter.js", 1085, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_492}]), "return");
        return (_return_492); 
      }())
      ;
      log_event("MLInterpreter.js", 1087, ctx_push(ctx_196, [{key: "#RETURN_VALUE#", val: _return_493}]), "return");
      return (_return_493); 
    case "Structure_open":
      var id = _term_.id;var ctx_238 = ctx_push(ctx_196, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 1106, ctx_238, "case");
    
      var _return_501 = (function () {
        log_event("MLInterpreter.js", 1104, ctx_238, "call");
        var _return_500 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 1090, ctx_238, "call");
                              var _return_494 = run_ident(s, ctx, id);
                              log_event("MLInterpreter.js", 1089, ctx_push(ctx_238, [{key: "#RETURN_VALUE#", val: _return_494}]), "return");
                              return (_return_494); }()), function (v) {
                              var ctx_239 = ctx_push(ctx_238, [{key: "v", val: v}]);
                              log_event("MLInterpreter.js", 1102, ctx_239, "enter");
                              log_event("MLInterpreter.js", 1101, ctx_239, "switch");
                              switch (v.tag) {
                                case "Value_struct":
                                  var md = v.value;var ctx_240 = ctx_push(ctx_239, [{key: "md", val: md}]);
                                log_event("MLInterpreter.js", 1096, ctx_240, "case");
                                
                                  var _return_497 = (function () {
                                    log_event("MLInterpreter.js", 1094, ctx_240, "call");
                                    var _return_496 = Unsafe.box({
                                                          value: nil,
                                                          ctx: (function () {
                                                            log_event("MLInterpreter.js", 1092, ctx_240, "call");
                                                            var _return_495 = 
                                                            ExecutionContext.open_module(
                                                              id, md, ctx);
                                                            log_event("MLInterpreter.js", 1091, ctx_push(ctx_240, [{key: "#RETURN_VALUE#", val: _return_495}]), "return");
                                                            return (_return_495); 
                                                          }())
                                                          });
                                    log_event("MLInterpreter.js", 1093, ctx_push(ctx_240, [{key: "#RETURN_VALUE#", val: _return_496}]), "return");
                                    return (_return_496); 
                                  }())
                                  ;
                                  log_event("MLInterpreter.js", 1095, ctx_push(ctx_240, [{key: "#RETURN_VALUE#", val: _return_497}]), "return");
                                  return (_return_497); 
                                default:log_event("MLInterpreter.js", 1100, ctx_239, "case");
                                
                                  var _return_499 = (function () {
                                    log_event("MLInterpreter.js", 1098, ctx_239, "call");
                                    var _return_498 = Unsafe.error(
                                                        "Expected a module");
                                    log_event("MLInterpreter.js", 1097, ctx_push(ctx_239, [{key: "#RETURN_VALUE#", val: _return_498}]), "return");
                                    return (_return_498); 
                                  }())
                                  ;
                                  log_event("MLInterpreter.js", 1099, ctx_push(ctx_239, [{key: "#RETURN_VALUE#", val: _return_499}]), "return");
                                  return (_return_499); 
                              }
                              });
        log_event("MLInterpreter.js", 1103, ctx_push(ctx_238, [{key: "#RETURN_VALUE#", val: _return_500}]), "return");
        return (_return_500); 
      }())
      ;
      log_event("MLInterpreter.js", 1105, ctx_push(ctx_238, [{key: "#RETURN_VALUE#", val: _return_501}]), "return");
      return (_return_501); 
  }
  
};

var run_module_expression = function (s, ctx, _term_) {
  var ctx_241 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "_term_", val: _term_}]);
  log_event("MLInterpreter.js", 1172, ctx_241, "enter");
  log_event("MLInterpreter.js", 1171, ctx_241, "switch");
  switch (_term_.tag) {
    case "Module_ident":
      var id = _term_.id;var ctx_242 = ctx_push(ctx_241, [{key: "id", val: id}]);
    log_event("MLInterpreter.js", 1112, ctx_242, "case");
    
      var _return_503 = (function () {
        log_event("MLInterpreter.js", 1110, ctx_242, "call");
        var _return_502 = run_ident(s, ctx, id);
        log_event("MLInterpreter.js", 1109, ctx_push(ctx_242, [{key: "#RETURN_VALUE#", val: _return_502}]), "return");
        return (_return_502); 
      }())
      ;
      log_event("MLInterpreter.js", 1111, ctx_push(ctx_242, [{key: "#RETURN_VALUE#", val: _return_503}]), "return");
      return (_return_503); 
    case "Module_structure":
      var str = _term_.structure;var ctx_243 = ctx_push(ctx_241, [{key: "str", val: str}]);
    log_event("MLInterpreter.js", 1125, ctx_243, "case");
    
      var _return_509 = (function () {
        log_event("MLInterpreter.js", 1123, ctx_243, "call");
        var _return_508 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 1114, ctx_243, "call");
                              var _return_504 = run_structure(s, ctx, str);
                              log_event("MLInterpreter.js", 1113, ctx_push(ctx_243, [{key: "#RETURN_VALUE#", val: _return_504}]), "return");
                              return (_return_504); }()), function (res) {
                              var ctx_244 = ctx_push(ctx_243, [{key: "res", val: res}]);
                              log_event("MLInterpreter.js", 1121, ctx_244, "enter");
                              var map = (function () {
                                log_event("MLInterpreter.js", 1116, ctx_244, "call");
                                var _return_505 = ExecutionContext.execution_ctx_lexical_env(
                                                    res.ctx);
                                log_event("MLInterpreter.js", 1115, ctx_push(ctx_244, [{key: "#RETURN_VALUE#", val: _return_505}]), "return");
                                return (_return_505); 
                              }())
                              ;
                              var ctx_245 = ctx_push(ctx_244, [{key: "map", val: map}]);
                              log_event("MLInterpreter.js", 1120, ctx_245, "let");
                              var _return_507 = (function () {
                                log_event("MLInterpreter.js", 1118, ctx_245, "call");
                                var _return_506 = Unsafe.box(
                                                    Value_struct(map));
                                log_event("MLInterpreter.js", 1117, ctx_push(ctx_245, [{key: "#RETURN_VALUE#", val: _return_506}]), "return");
                                return (_return_506); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 1119, ctx_push(ctx_245, [{key: "#RETURN_VALUE#", val: _return_507}]), "return");
                              return (_return_507); 
                              });
        log_event("MLInterpreter.js", 1122, ctx_push(ctx_243, [{key: "#RETURN_VALUE#", val: _return_508}]), "return");
        return (_return_508); 
      }())
      ;
      log_event("MLInterpreter.js", 1124, ctx_push(ctx_243, [{key: "#RETURN_VALUE#", val: _return_509}]), "return");
      return (_return_509); 
    case "Module_functor":
      var id = _term_.id, expr = _term_.expr;var ctx_246 = ctx_push(ctx_241, [{key: "id", val: id}, {key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 1140, ctx_246, "case");
    
      var func = function (varg) {
        var ctx_247 = ctx_push(ctx_246, [{key: "varg", val: varg}]);
        log_event("MLInterpreter.js", 1135, ctx_247, "enter");
        var idx = (function () {
          log_event("MLInterpreter.js", 1127, ctx_247, "call");
          var _return_510 = Vector.append(s, Normal(varg));
          log_event("MLInterpreter.js", 1126, ctx_push(ctx_247, [{key: "#RETURN_VALUE#", val: _return_510}]), "return");
          return (_return_510); 
        }())
        ;
        var ctx_248 = ctx_push(ctx_247, [{key: "idx", val: idx}]);
        log_event("MLInterpreter.js", 1134, ctx_248, "let");
        var ctx$ = (function () {
          log_event("MLInterpreter.js", 1129, ctx_248, "call");
          var _return_511 = ExecutionContext.add(id, idx, ctx);
          log_event("MLInterpreter.js", 1128, ctx_push(ctx_248, [{key: "#RETURN_VALUE#", val: _return_511}]), "return");
          return (_return_511); 
        }())
        ;
        var ctx_249 = ctx_push(ctx_248, [{key: "ctx$", val: ctx$}]);
        log_event("MLInterpreter.js", 1133, ctx_249, "let");
        var _return_513 = (function () {
          log_event("MLInterpreter.js", 1131, ctx_249, "call");
          var _return_512 = run_module_expression(s, ctx$, expr);
          log_event("MLInterpreter.js", 1130, ctx_push(ctx_249, [{key: "#RETURN_VALUE#", val: _return_512}]), "return");
          return (_return_512); 
        }())
        ;
        log_event("MLInterpreter.js", 1132, ctx_push(ctx_249, [{key: "#RETURN_VALUE#", val: _return_513}]), "return");
        return (_return_513); 
        
        
      };
      var ctx_250 = ctx_push(ctx_246, [{key: "func", val: func}]);
      log_event("MLInterpreter.js", 1139, ctx_250, "let");
      var _return_515 = (function () {
        log_event("MLInterpreter.js", 1137, ctx_250, "call");
        var _return_514 = Unsafe.box(Value_functor(func));
        log_event("MLInterpreter.js", 1136, ctx_push(ctx_250, [{key: "#RETURN_VALUE#", val: _return_514}]), "return");
        return (_return_514); 
      }())
      ;
      log_event("MLInterpreter.js", 1138, ctx_push(ctx_250, [{key: "#RETURN_VALUE#", val: _return_515}]), "return");
      return (_return_515); 
      
    case "Module_apply":
      var f = _term_.func, e = _term_.expr;var ctx_251 = ctx_push(ctx_241, [{key: "f", val: f}, {key: "e", val: e}]);
    log_event("MLInterpreter.js", 1162, ctx_251, "case");
    
      var _return_525 = (function () {
        log_event("MLInterpreter.js", 1160, ctx_251, "call");
        var _return_524 = Unsafe.bind((function () {
                              log_event("MLInterpreter.js", 1142, ctx_251, "call");
                              var _return_516 = run_module_expression(s, ctx,
                                                  f);
                              log_event("MLInterpreter.js", 1141, ctx_push(ctx_251, [{key: "#RETURN_VALUE#", val: _return_516}]), "return");
                              return (_return_516); }()), function (func) {
                              var ctx_252 = ctx_push(ctx_251, [{key: "func", val: func}]);
                              log_event("MLInterpreter.js", 1158, ctx_252, "enter");
                              var _return_523 = (function () {
                                log_event("MLInterpreter.js", 1156, ctx_252, "call");
                                var _return_522 = Unsafe.bind((function () {
                                                      log_event("MLInterpreter.js", 1144, ctx_252, "call");
                                                      var _return_517 = 
                                                      run_module_expression(
                                                        s, ctx, e);
                                                      log_event("MLInterpreter.js", 1143, ctx_push(ctx_252, [{key: "#RETURN_VALUE#", val: _return_517}]), "return");
                                                      return (_return_517); 
                                                    }()), function (expr) {
                                                      var ctx_253 = ctx_push(ctx_252, [{key: "expr", val: expr}]);
                                                      log_event("MLInterpreter.js", 1154, ctx_253, "enter");
                                                      log_event("MLInterpreter.js", 1153, ctx_253, "switch");
                                                      switch (func.tag) {
                                                        case "Value_functor":
                                                          var fctor = func.value;var ctx_254 = ctx_push(ctx_253, [{key: "fctor", val: fctor}]);
                                                        log_event("MLInterpreter.js", 1148, ctx_254, "case");
                                                        
                                                          var _return_519 = (function () {
                                                            log_event("MLInterpreter.js", 1146, ctx_254, "call");
                                                            var _return_518 = 
                                                            fctor(expr);
                                                            log_event("MLInterpreter.js", 1145, ctx_push(ctx_254, [{key: "#RETURN_VALUE#", val: _return_518}]), "return");
                                                            return (_return_518); 
                                                          }())
                                                          ;
                                                          log_event("MLInterpreter.js", 1147, ctx_push(ctx_254, [{key: "#RETURN_VALUE#", val: _return_519}]), "return");
                                                          return (_return_519); 
                                                        default:log_event("MLInterpreter.js", 1152, ctx_253, "case");
                                                        
                                                          var _return_521 = (function () {
                                                            log_event("MLInterpreter.js", 1150, ctx_253, "call");
                                                            var _return_520 = 
                                                            Unsafe.error(
                                                              "Expected a functor");
                                                            log_event("MLInterpreter.js", 1149, ctx_push(ctx_253, [{key: "#RETURN_VALUE#", val: _return_520}]), "return");
                                                            return (_return_520); 
                                                          }())
                                                          ;
                                                          log_event("MLInterpreter.js", 1151, ctx_push(ctx_253, [{key: "#RETURN_VALUE#", val: _return_521}]), "return");
                                                          return (_return_521); 
                                                      }
                                                      });
                                log_event("MLInterpreter.js", 1155, ctx_push(ctx_252, [{key: "#RETURN_VALUE#", val: _return_522}]), "return");
                                return (_return_522); 
                              }())
                              ;
                              log_event("MLInterpreter.js", 1157, ctx_push(ctx_252, [{key: "#RETURN_VALUE#", val: _return_523}]), "return");
                              return (_return_523); });
        log_event("MLInterpreter.js", 1159, ctx_push(ctx_251, [{key: "#RETURN_VALUE#", val: _return_524}]), "return");
        return (_return_524); 
      }())
      ;
      log_event("MLInterpreter.js", 1161, ctx_push(ctx_251, [{key: "#RETURN_VALUE#", val: _return_525}]), "return");
      return (_return_525); 
    case "Module_constraint":
      var expr = _term_.expr;var ctx_255 = ctx_push(ctx_241, [{key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 1166, ctx_255, "case");
    
      var _return_527 = (function () {
        log_event("MLInterpreter.js", 1164, ctx_255, "call");
        var _return_526 = run_module_expression(s, ctx, expr);
        log_event("MLInterpreter.js", 1163, ctx_push(ctx_255, [{key: "#RETURN_VALUE#", val: _return_526}]), "return");
        return (_return_526); 
      }())
      ;
      log_event("MLInterpreter.js", 1165, ctx_push(ctx_255, [{key: "#RETURN_VALUE#", val: _return_527}]), "return");
      return (_return_527); 
    case "Module_unpack":
      var expr = _term_.expr;var ctx_256 = ctx_push(ctx_241, [{key: "expr", val: expr}]);
    log_event("MLInterpreter.js", 1170, ctx_256, "case");
    
      var _return_529 = (function () {
        log_event("MLInterpreter.js", 1168, ctx_256, "call");
        var _return_528 = run_expression(s, ctx, expr);
        log_event("MLInterpreter.js", 1167, ctx_push(ctx_256, [{key: "#RETURN_VALUE#", val: _return_528}]), "return");
        return (_return_528); 
      }())
      ;
      log_event("MLInterpreter.js", 1169, ctx_push(ctx_256, [{key: "#RETURN_VALUE#", val: _return_529}]), "return");
      return (_return_529); 
  }
  
};

var run_structure = function (s, ctx, _term_) {
  var ctx_257 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "_term_", val: _term_}]);
  log_event("MLInterpreter.js", 1190, ctx_257, "enter");
  var func = function (nsf, _term_) {
    var ctx_258 = ctx_push(ctx_257, [{key: "nsf", val: nsf}, {key: "_term_", val: _term_}]);
    log_event("MLInterpreter.js", 1180, ctx_258, "enter");
    var _return_533 = (function () {
      log_event("MLInterpreter.js", 1178, ctx_258, "call");
      var _return_532 = Unsafe.bind(nsf, function (res) {
                            var ctx_259 = ctx_push(ctx_258, [{key: "res", val: res}]);
                            log_event("MLInterpreter.js", 1176, ctx_259, "enter");
                            var _return_531 = (function () {
                              log_event("MLInterpreter.js", 1174, ctx_259, "call");
                              var _return_530 = run_structure_item(s,
                                                  res.ctx, _term_);
                              log_event("MLInterpreter.js", 1173, ctx_push(ctx_259, [{key: "#RETURN_VALUE#", val: _return_530}]), "return");
                              return (_return_530); 
                            }())
                            ;
                            log_event("MLInterpreter.js", 1175, ctx_push(ctx_259, [{key: "#RETURN_VALUE#", val: _return_531}]), "return");
                            return (_return_531); });
      log_event("MLInterpreter.js", 1177, ctx_push(ctx_258, [{key: "#RETURN_VALUE#", val: _return_532}]), "return");
      return (_return_532); 
    }())
    ;
    log_event("MLInterpreter.js", 1179, ctx_push(ctx_258, [{key: "#RETURN_VALUE#", val: _return_533}]), "return");
    return (_return_533); 
  };
  var ctx_260 = ctx_push(ctx_257, [{key: "func", val: func}]);
  log_event("MLInterpreter.js", 1189, ctx_260, "let");
  var fake_res = (function () {
    log_event("MLInterpreter.js", 1182, ctx_260, "call");
    var _return_534 = Unsafe.box({ value: nil,
                                   ctx: ctx});
    log_event("MLInterpreter.js", 1181, ctx_push(ctx_260, [{key: "#RETURN_VALUE#", val: _return_534}]), "return");
    return (_return_534); 
  }())
  ;
  var ctx_261 = ctx_push(ctx_260, [{key: "fake_res", val: fake_res}]);
  log_event("MLInterpreter.js", 1188, ctx_261, "let");
  log_event("MLInterpreter.js", 1187, ctx_261, "switch");
  switch (_term_.tag) {
    case "Structure":
      var items = _term_.items;var ctx_262 = ctx_push(ctx_261, [{key: "items", val: items}]);
    log_event("MLInterpreter.js", 1186, ctx_262, "case");
    
      var _return_536 = (function () {
        log_event("MLInterpreter.js", 1184, ctx_262, "call");
        var _return_535 = MLArray.fold(func, fake_res, items);
        log_event("MLInterpreter.js", 1183, ctx_push(ctx_262, [{key: "#RETURN_VALUE#", val: _return_535}]), "return");
        return (_return_535); 
      }())
      ;
      log_event("MLInterpreter.js", 1185, ctx_push(ctx_262, [{key: "#RETURN_VALUE#", val: _return_536}]), "return");
      return (_return_536); 
  }
  
  
  
};

var run = function (s, ctx, _term_) {
  var ctx_263 = ctx_push(ctx_empty, [{key: "s", val: s}, {key: "ctx", val: ctx}, {key: "_term_", val: _term_}]);
  log_event("MLInterpreter.js", 1200, ctx_263, "enter");
  var _return_541 = (function () {
    log_event("MLInterpreter.js", 1198, ctx_263, "call");
    var _return_540 = Unsafe.bind((function () {
                          log_event("MLInterpreter.js", 1192, ctx_263, "call");
                          var _return_537 = run_structure(s, ctx, _term_);
                          log_event("MLInterpreter.js", 1191, ctx_push(ctx_263, [{key: "#RETURN_VALUE#", val: _return_537}]), "return");
                          return (_return_537); }()), function (res) {
                          var ctx_264 = ctx_push(ctx_263, [{key: "res", val: res}]);
                          log_event("MLInterpreter.js", 1196, ctx_264, "enter");
                          var _return_539 = (function () {
                            log_event("MLInterpreter.js", 1194, ctx_264, "call");
                            var _return_538 = Unsafe.box(res.ctx);
                            log_event("MLInterpreter.js", 1193, ctx_push(ctx_264, [{key: "#RETURN_VALUE#", val: _return_538}]), "return");
                            return (_return_538); 
                          }())
                          ;
                          log_event("MLInterpreter.js", 1195, ctx_push(ctx_264, [{key: "#RETURN_VALUE#", val: _return_539}]), "return");
                          return (_return_539); });
    log_event("MLInterpreter.js", 1197, ctx_push(ctx_263, [{key: "#RETURN_VALUE#", val: _return_540}]), "return");
    return (_return_540); 
  }())
  ;
  log_event("MLInterpreter.js", 1199, ctx_push(ctx_263, [{key: "#RETURN_VALUE#", val: _return_541}]), "return");
  return (_return_541); 
};
}// end of with MLSyntax
}// end of with Value
}// end of with Identifier

return {
  min: min, 
  build_initial_env: build_initial_env, 
  string_of_identifier: string_of_identifier, 
  run_constant: run_constant, 
  run_ident: run_ident, 
  run_expression: run_expression, 
  value_of: value_of, 
  pattern_match: pattern_match, 
  pattern_match_many: pattern_match_many, 
  pattern_match_array: pattern_match_array, 
  run_structure_item: run_structure_item, 
  run_module_expression: run_module_expression, 
  run_structure: run_structure, 
  run: run};
})();
