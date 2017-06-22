type position = {
  line : int ; [@f line]
  column : int [@f column]
}

type location = {
  file : string ; [@f file]
  start : position ; [@f start]
  stop : position [@f stop]
}

type 'a located = {
  loc : location ; [@f loc]
  value : 'a [@f value]
}

let new_position line column = { line = line ; column = column }
let new_location file start stop = { file = file ; start = start ; stop = stop }
let new_located_value loc value = { loc = loc ; value = value }

let dummy_position = { line = 0 ; column = 0 }
let dummy_location = { file = "dummy.ml" ; start = dummy_position ; stop = dummy_position }

type constant =
| Constant_integer of int [@f value]
| Constant_float of float [@f value]
| Constant_char of char [@f value]
| Constant_string of string [@f value]

type expression =
| Expression_constant of location * constant [@f loc, constant]
| Expression_ident of location * Identifier.t [@f loc, id]
| Expression_let of location * bool * pattern array * expression array * expression [@f loc, is_rec, ids, exps, expr]
| Expression_tuple of location * expression array [@f loc, components]
| Expression_array of location * expression array [@f loc, elements]
| Expression_variant of location * string * expression option [@f loc, label, value_opt]
| Expression_function of location * case array [@f loc, cases]
| Expression_apply of location * expression * expression array [@f loc, func, args]
| Expression_match of location * expression * case array [@f loc, expr, cases]
| Expression_constructor of location * Identifier.t * expression array [@f loc, ctor, args]
| Expression_record of location * binding array * expression option [@f loc, bindings, base]
| Expression_field of location * expression * string [@f loc, record, fieldname]
| Expression_setfield of location * expression * string * expression [@f loc, record, fieldname, expr]
| Expression_ifthenelse of location * expression * expression * expression option [@f loc, cond, e1, e2]
| Expression_sequence of location * expression * expression [@f loc, e1, e2]
| Expression_while of location * expression * expression [@f loc, cond, body]
| Expression_for of location * string * expression * expression * bool * expression [@f loc, id, first, last, up, body]
| Expression_try of location * expression * case array [@f loc, expr, cases]
| Expression_letmodule of location * Identifier.t * module_expression * expression [@f loc, id, modex, expr]
| Expression_pack of location * module_expression [@f loc, expr]

and pattern =
| Pattern_any of location [@f loc]
| Pattern_var of location * string [@f loc, id]
| Pattern_constant of location * constant [@f loc, constant]
| Pattern_tuple of location * pattern array [@f loc, patts]
| Pattern_array of location * pattern array [@f loc, patts]
| Pattern_variant of location * string * pattern option [@f loc, label, arg]
| Pattern_alias of location * pattern * string [@f loc, patt, alias]
| Pattern_constructor of location * Identifier.t * pattern array [@f loc, ctor, args]
| Pattern_or of location * pattern * pattern [@f loc, patt1, patt2]

and case = {
  patt : pattern ;
  guard : expression option ;
  expr : expression
}

and binding = {
  name : string ;
  expr : expression
}

and structure_item =
| Structure_eval of location * expression [@f loc, expr]
| Structure_value of location * bool * pattern array * expression array [@f loc, is_rec, ids, exps]
| Structure_type of location [@f loc]
| Structure_module of location * string * module_expression [@f loc, id, expr]
| Structure_modtype of location [@f loc]
| Structure_include of location * module_expression [@f loc, expr]
| Structure_primitive of location [@f loc]
| Structure_exception of location [@f loc]
| Structure_open of location * Identifier.t [@f loc, id]

and structure = Structure of location * structure_item array [@f loc, items]

and module_expression =
| Module_ident of location * Identifier.t [@f loc, id]
| Module_structure of location * structure [@f loc, structure]
| Module_functor of location * string * module_expression [@f loc, id, expr]
| Module_apply of location * module_expression * module_expression [@f loc, func, expr]
| Module_constraint of location * module_expression [@f loc, expr]
| Module_unpack of location * expression [@f loc, expr]
