open Lexing
open Location
open Longident
open Asttypes
open Types
open Parsetree
open Typedtree
open MLSyntax

(***************************************************************************************
 * Translation from an OCaml-side AST to a JS-side one
 ***************************************************************************************)

let rec translate_ident = function
| Lident id -> Identifier.Lident id
| Ldot (path, id) -> Identifier.Ldot (translate_ident path, id)
| Lapply _ -> Lident ""

let translate_location file loc =
  let loc_start = loc.loc_start in
  let loc_stop = loc.loc_end in
  let start = {
    line = loc_start.pos_lnum ;
    column = loc_start.pos_cnum - loc_start.pos_bol } in
  let stop = {
    line = loc_stop.pos_lnum ;
    column = loc_stop.pos_cnum - loc_stop.pos_bol } in
  { file = file ; start = start ; stop = stop }

let translate_constant = function
| Const_int i -> Constant_integer i
| Const_float f -> Constant_float (float_of_string f)
| Const_char c -> Constant_char c
| Const_string (s, _) -> Constant_string s

let rec translate_expression file e =
  let loc = translate_location file e.exp_loc in
  match e.exp_desc with
  | Texp_constant pc ->
    let c = translate_constant pc in
    Expression_constant (loc, c)
  | Texp_ident (_, li, _) ->
    let id = translate_ident (li.txt) in
    Expression_ident (loc, id)
  | Texp_let (ir, binding_list, exp) ->
    let bindings = Array.of_list binding_list in
    let is_rec = (ir = Recursive) in
    let patts = Array.map (fun b -> translate_pattern file b.vb_pat) bindings in
    let val_exps = Array.map (fun b -> translate_expression file b.vb_expr) bindings in
    let expr = translate_expression file exp in
    Expression_let (loc, is_rec, patts, val_exps, expr)
  | Texp_function (_, cases, _) ->
    let map_f case = {
      patt = translate_pattern file case.c_lhs ;
      guard = Option.map (translate_expression file) case.c_guard;
      expr = translate_expression file case.c_rhs
    } in
    let case_array = Array.of_list (List.map map_f cases) in
    Expression_function (loc, case_array)
  | Texp_apply (pfunc, pargs) ->
    let func = translate_expression file pfunc in
    let opt_list = List.map
      (fun (_, pe) -> Option.bind pe (fun p -> Some (translate_expression file p)))
      pargs in
    let rec lift_option lst = match lst with
    | [] -> Some []
    | h :: t ->
      Option.bind h (fun a ->
      Option.bind (lift_option t) (fun rest ->
      Some (a :: rest))) in
    let args =
      match lift_option opt_list with
      | None -> failwith "labels not supported"
      | Some a -> a in
    Expression_apply (loc, func, Array.of_list args)
  | Texp_tuple pel ->
    let el = List.map (fun pe -> translate_expression file pe) pel in
    Expression_tuple (loc, Array.of_list el)
  | Texp_array pel ->
    let el = List.map (fun pe -> translate_expression file pe) pel in
    Expression_array (loc, Array.of_list el)
  | Texp_variant (label, eopt) ->
    let value_opt = Option.bind eopt (fun e -> Some (translate_expression file e)) in
    Expression_variant (loc, label, value_opt)
  | Texp_match (pexp, pcases, _, _) ->
    let map_f case = {
      patt = translate_pattern file case.c_lhs ;
      guard = Option.map (translate_expression file) case.c_guard;
      expr = translate_expression file case.c_rhs
    } in
    let cases = Array.of_list (List.map map_f pcases) in
    let expr = translate_expression file pexp in
    Expression_match (loc, expr, cases)
  | Texp_construct (lid, _, exprs) ->
    let ctor = lid.txt in
    let args = Array.of_list (List.map (translate_expression file) exprs) in
    Expression_constructor (loc, translate_ident ctor, args)
  | Texp_record r ->
    let conv  (lbl, rec_def) = match rec_def with
    | Overridden (_, expr) -> { name = lbl.lbl_name ; expr = translate_expression file expr }
    | Kept _ -> { name = "" ; expr = Expression_constant (loc, Constant_integer 0) } in
    let bindings =
      let mapped = Array.map conv r.fields in
      let lst = Array.to_list mapped in
      let clean_lst = List.filter (fun b -> b.name <> "") lst in
      Array.of_list clean_lst in
    let base' = Option.bind r.extended_expression (fun base -> Some (translate_expression file base)) in
    Expression_record (loc, bindings, base')
  | Texp_field (r, _, lbl) ->
    let record = translate_expression file r in
    let fieldname = lbl.lbl_name in
    Expression_field (loc, record, fieldname)
  | Texp_setfield (r, _, lbl, exp) ->
    let record = translate_expression file r in
    let fieldname = lbl.lbl_name in
    let expr = translate_expression file exp in
    Expression_setfield (loc, record, fieldname, expr)
  | Texp_ifthenelse (c, t, e) ->
    let cond = translate_expression file c in
    let e1 = translate_expression file t in
    let e2 = Option.map (fun e -> translate_expression file e) e in
    Expression_ifthenelse (loc, cond, e1, e2)
  | Texp_sequence (e1, e2) ->
    let expr1 = translate_expression file e1 in
    let expr2 = translate_expression file e2 in
    Expression_sequence (loc, expr1, expr2)
  | Texp_while (c, b) ->
    let cond = translate_expression file c in
    let body = translate_expression file b in
    Expression_while (loc, cond, body)
  | Texp_for (i, _, fst, lst, dir, bdy) ->
    let id = i.name in
    let first = translate_expression file fst in
    let last = translate_expression file lst in
    let direction = (dir = Upto) in
    let body = translate_expression file bdy in
    Expression_for (loc, id, first, last, direction, body)
  | Texp_try (e, cs) ->
    let expr = translate_expression file e in
    let map_f case = {
      patt = translate_pattern file case.c_lhs ;
      guard = Option.map (translate_expression file) case.c_guard;
      expr = translate_expression file case.c_rhs
    } in
    let cases = Array.of_list (List.map map_f cs) in
    Expression_try (loc, expr, cases)
  | Texp_letmodule (id, _, md_exp, e) ->
    let ident = Identifier.Lident id.name in
    let modex = translate_module_expression file md_exp in
    let expr = translate_expression file e in
    Expression_letmodule (loc, ident, modex, expr)
  | Texp_pack e ->
    let expr = translate_module_expression file e in
    Expression_pack (loc, expr)

and translate_pattern file p =
  let loc = translate_location file p.pat_loc in
  match p.pat_desc with
  | Tpat_any -> Pattern_any loc
  | Tpat_constant c -> Pattern_constant (loc, translate_constant c)
  | Tpat_var (_, li) ->
    let id = li.txt in
    Pattern_var (loc, id)
  | Tpat_tuple ppatts ->
    let patt_list = List.map (translate_pattern file) ppatts in
    let patts = Array.of_list patt_list in
    Pattern_tuple (loc, patts)
  | Tpat_array ppatts ->
    let patt_list = List.map (translate_pattern file) ppatts in
    let patts = Array.of_list patt_list in
    Pattern_array (loc, patts)
  | Tpat_variant (label, popt, _) ->
    let patt_opt = Option.bind popt (fun p -> Some (translate_pattern file p)) in
    Pattern_variant (loc, label, patt_opt)
  | Tpat_alias (p, _, lid) ->
    let patt = translate_pattern file p in
    let id = lid.txt in
    Pattern_alias (loc, patt, id)
  | Tpat_construct (lid, _, patts) ->
    let ctor = lid.txt in
    let args = Array.of_list (List.map (translate_pattern file) patts) in
    Pattern_constructor (loc, translate_ident ctor, args)
  | Tpat_or (p1, p2, _) ->
    let patt1 = translate_pattern file p1 in
    let patt2 = translate_pattern file p2 in
    Pattern_or (loc, patt1, patt2)

and translate_structure_item file s =
  let loc = translate_location file s.str_loc in
  match s.str_desc with
  | Tstr_eval (e, _) ->
    let expr = translate_expression file e in
    Structure_eval (loc, expr)
  | Tstr_value (rec_flag, binding_list) ->
    let bindings = Array.of_list binding_list in
    let is_rec = (rec_flag = Recursive) in
    let patts = Array.map (fun b -> translate_pattern file b.vb_pat) bindings in
    let val_exps = Array.map (fun b -> translate_expression file b.vb_expr) bindings in
    Structure_value (loc, is_rec, patts, val_exps)
  | Tstr_type (_, _) -> Structure_type loc
  | Tstr_module mb ->
    let id = mb.mb_id.name in
    let expr = translate_module_expression file mb.mb_expr in
    Structure_module (loc, id, expr)
  | Tstr_modtype _ -> Structure_modtype loc
  | Tstr_include incl_infos ->
    let t_expr = incl_infos.incl_mod in
    let expr = translate_module_expression file t_expr in
    Structure_include (loc, expr)
  | Tstr_primitive _ -> Structure_primitive loc
  | Tstr_exception _ -> Structure_exception loc
  | Tstr_open op ->
    let id = op.open_txt.txt in
    Structure_open (loc, translate_ident id)

and translate_module_expression file m =
  let loc = translate_location file m.mod_loc in
  match m.mod_desc with
  | Tmod_ident (_, i) ->
    let id = translate_ident i.txt in
    Module_ident (loc, id)
  | Tmod_structure s ->
    let str = translate_structure file s in
    Module_structure (loc, str)
  | Tmod_functor (i, _, _, e) ->
    let id = i.name in
    let expr = translate_module_expression file e in
    Module_functor (loc, id, expr)
  | Tmod_apply (f, e, _) ->
    let func = translate_module_expression file f in
    let expr = translate_module_expression file e in
    Module_apply (loc, func, expr)
  | Tmod_constraint (e, _, _, _) ->
    let expr = translate_module_expression file e in
    Module_constraint (loc, expr)
  | Tmod_unpack (e, _) ->
    let expr = translate_expression file e in
    Module_unpack (loc, expr)

and translate_structure file s =
  let items = Array.of_list (List.map (translate_structure_item file) s.str_items) in
  let loc =
    if Array.length items > 0 then
      let item_array = Array.of_list s.str_items in
      let first = Array.get item_array 0 in
      let last = Array.get item_array (Array.length items - 1) in
      translate_location file { loc_start = first.str_loc.loc_start ;
        loc_end = last.str_loc.loc_end ;
        loc_ghost = false
      }
    else
      new_location file (new_position 1 0) (new_position 1 0) in
  Structure (loc, items)

(***************************************************************************************
 * Translation from an OCaml-side AST to a JS-side one
 ***************************************************************************************)

let ctor_call ctor params = Js.Unsafe.fun_call (Js.Unsafe.js_expr ctor) params

let js_of_position pos = Js.Unsafe.obj [|
  ("line", Js.Unsafe.inject pos.line) ;
  ("column", Js.Unsafe.inject pos.column) |]

let js_of_location loc =
  let js_file = Js.Unsafe.inject (Js.string loc.file) in
  let js_start = js_of_position loc.start in
  let js_stop = js_of_position loc.stop in
  Js.Unsafe.obj [| ("file", js_file) ; ("start", js_start) ; ("end", js_stop) |]

let js_of_located translator value =
  let js_value = translator value.value in
  let js_loc = js_of_location value.loc in
  Js.Unsafe.obj [| ("loc", js_loc) ; ("value", js_value) |]

let js_of_option func opt = match opt with
| None -> ctor_call "None" [| |]
| Some v ->
  let js_v = func v in
  ctor_call "Some" [| js_v |]

let rec js_of_identifier = function
| Identifier.Lident id ->
  let js_id = Js.Unsafe.inject (Js.string id) in
  ctor_call "Identifier.Lident" [| js_id |]
| Identifier.Ldot (path, id) ->
  let js_path = js_of_identifier path in
  let js_id = Js.Unsafe.inject (Js.string id) in
  ctor_call "Identifier.Ldot" [| js_path ; js_id |]

let js_of_constant = function
| Constant_integer i -> ctor_call "MLSyntax.Constant_integer" [| Js.Unsafe.inject i |]
| Constant_float f -> ctor_call "MLSyntax.Constant_float" [| Js.Unsafe.inject f |]
| Constant_char c -> ctor_call "MLSyntax.Constant_char" [| Js.Unsafe.inject c |]
| Constant_string s -> ctor_call "MLSyntax.Constant_string" [| Js.Unsafe.inject s |]

let rec js_of_expression = function
| Expression_constant (loc, c) ->
  let js_loc = js_of_location loc in
  let js_c = js_of_constant c in
  ctor_call "MLSyntax.Expression_constant" [| js_loc ; js_c |]
| Expression_ident (loc, id) ->
  let js_loc = js_of_location loc in
  let js_ident = js_of_identifier id in
  ctor_call "MLSyntax.Expression_ident" [| js_loc ; js_ident |]
| Expression_let (loc, is_rec, patts, val_exps, expr) ->
  let js_loc = js_of_location loc in
  let js_rec = Js.Unsafe.inject is_rec in
  let js_patts = Js.Unsafe.inject (Js.array (Array.map js_of_pattern patts)) in
  let js_val_exps = Js.Unsafe.inject (Js.array (Array.map js_of_expression val_exps)) in
  let js_expr = js_of_expression expr in
  ctor_call "MLSyntax.Expression_let" [| js_loc ; js_rec ; js_patts ; js_val_exps ; js_expr |]
| Expression_variant (loc, label, value_opt) ->
  let js_loc = js_of_location loc in
  let js_label = Js.Unsafe.inject (Js.string label) in
  let js_value_opt = js_of_option js_of_expression value_opt in
  ctor_call "MLSyntax.Expression_variant" [| js_loc ; js_label ; js_value_opt |]
| Expression_function (loc, cases) ->
  let js_loc = js_of_location loc in
  let js_cases = Js.Unsafe.inject (Js.array (Array.map js_of_case cases)) in
  ctor_call "MLSyntax.Expression_function" [| js_loc ; js_cases |]
| Expression_apply (loc, func, args) ->
  let js_loc = js_of_location loc in
  let js_func = js_of_expression func in
  let js_args = Js.Unsafe.inject (Js.array (Array.map js_of_expression args)) in
  ctor_call "MLSyntax.Expression_apply" [| js_loc ; js_func ; js_args |]
| Expression_tuple (loc, el) ->
  let js_loc = js_of_location loc in
  let js_tuples = Array.map js_of_expression el in
  let js_tuple_array = Js.Unsafe.inject (Js.array js_tuples) in
  ctor_call "MLSyntax.Expression_tuple" [| js_loc ; js_tuple_array |]
| Expression_array (loc, el) ->
  let js_loc = js_of_location loc in
  let js_elements = Array.map js_of_expression el in
  let js_array = Js.Unsafe.inject (Js.array js_elements) in
  ctor_call "MLSyntax.Expression_array" [| js_loc ; js_array |]
| Expression_match (loc, expr, cases) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_expression expr in
  let js_cases = Js.Unsafe.inject (Js.array (Array.map js_of_case cases)) in
  ctor_call "MLSyntax.Expression_match" [| js_loc ; js_expr ; js_cases |]
| Expression_constructor (loc, ctor, args) ->
  let js_loc = js_of_location loc in
  let js_ctor = js_of_identifier ctor in
  let js_args = Js.Unsafe.inject (Js.array (Array.map js_of_expression args)) in
  ctor_call "MLSyntax.Expression_constructor" [| js_loc ; js_ctor ; js_args |]
| Expression_record (loc, bindings, base) ->
  let js_loc = js_of_location loc in
  let js_bindings = Js.Unsafe.inject (Js.array (Array.map js_of_binding bindings)) in
  let js_base = js_of_option js_of_expression base in
  ctor_call "MLSyntax.Expression_record" [| js_loc ; js_bindings ; js_base |]
| Expression_field (loc, record, fieldname) ->
  let js_loc = js_of_location loc in
  let js_record = js_of_expression record in
  let js_fieldname = Js.Unsafe.inject (Js.string fieldname) in
  ctor_call "MLSyntax.Expression_field" [| js_loc ; js_record ; js_fieldname |]
| Expression_setfield (loc, record, fieldname, expr) ->
  let js_loc = js_of_location loc in
  let js_record = js_of_expression record in
  let js_fieldname = Js.Unsafe.inject (Js.string fieldname) in
  let js_expr = js_of_expression expr in
  ctor_call "MLSyntax.Expression_setfield" [| js_loc ; js_record ; js_fieldname ; js_expr |]
| Expression_ifthenelse (loc, cond, e1, e2) ->
  let js_loc = js_of_location loc in
  let js_cond = js_of_expression cond in
  let js_e1 = js_of_expression e1 in
  let js_e2 = js_of_option js_of_expression e2 in
  ctor_call "MLSyntax.Expression_ifthenelse" [| js_loc ; js_cond ; js_e1 ; js_e2 |]
| Expression_sequence (loc, e1, e2) ->
  let js_loc = js_of_location loc in
  let js_e1 = js_of_expression e1 in
  let js_e2 = js_of_expression e2 in
  ctor_call "MLSyntax.Expression_sequence" [| js_loc ; js_e1 ; js_e2 |]
| Expression_while (loc, cond, body) ->
  let js_loc = js_of_location loc in
  let js_cond = js_of_expression cond in
  let js_body = js_of_expression body in
  ctor_call "MLSyntax.Expression_while" [| js_loc ; js_cond ; js_body |]
| Expression_for (loc, id, first, last, dir, body) ->
  let js_loc = js_of_location loc in
  let js_id = Js.Unsafe.inject (Js.string id) in
  let js_first = js_of_expression first in
  let js_last = js_of_expression last in
  let js_dir = Js.Unsafe.inject dir in
  let js_body = js_of_expression body in
  ctor_call "MLSyntax.Expression_for" [| js_loc ; js_id ; js_first ; js_last ; js_dir ; js_body |]
| Expression_try (loc, expr, cases) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_expression expr in
  let js_cases = Js.Unsafe.inject (Js.array (Array.map js_of_case cases)) in
  ctor_call "MLSyntax.Expression_try" [| js_loc ; js_expr ; js_cases |]
| Expression_letmodule (loc, id, modex, expr) ->
  let js_loc = js_of_location loc in
  let js_id = js_of_identifier id in
  let js_modex = js_of_module_expression modex in
  let js_expr = js_of_expression expr in
  ctor_call "MLSyntax.Expression_letmodule" [| js_loc ; js_id ; js_modex ; js_expr |]
| Expression_pack (loc, expr) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Expression_pack" [| js_loc ; js_expr |]

and js_of_pattern = function
| Pattern_any loc ->
  let js_loc = js_of_location loc in
  ctor_call "MLSyntax.Pattern_any" [| js_loc |]
| Pattern_constant (loc, c) ->
  ctor_call "MLSyntax.Pattern_constant" [| js_of_location loc ; js_of_constant c |]
| Pattern_var (loc, id) ->
  let js_loc = js_of_location loc in
  let js_id = Js.Unsafe.inject (Js.string id) in
  ctor_call "MLSyntax.Pattern_var" [| js_loc ; js_id |]
| Pattern_tuple (loc, patts) ->
  let js_loc = js_of_location loc in
  let js_patts = Js.Unsafe.inject (Js.array (Array.map js_of_pattern patts)) in
  ctor_call "MLSyntax.Pattern_tuple" [| js_loc ; js_patts |]
| Pattern_array (loc, patts) ->
  let js_loc = js_of_location loc in
  let js_patts = Js.Unsafe.inject (Js.array (Array.map js_of_pattern patts)) in
  ctor_call "MLSyntax.Pattern_array" [| js_loc ; js_patts |]
| Pattern_variant (loc, label, patt_opt) ->
  let js_loc = js_of_location loc in
  let js_label = Js.Unsafe.inject (Js.string label) in
  let js_patt_opt = js_of_option js_of_pattern patt_opt in
  ctor_call "MLSyntax.Pattern_variant" [| js_loc ; js_label ; js_patt_opt |]
| Pattern_alias (loc, patt, id) ->
  let js_loc = js_of_location loc in
  let js_patt = js_of_pattern patt in
  let js_id = Js.Unsafe.inject (Js.string id) in
  ctor_call "MLSyntax.Pattern_alias" [| js_loc ; js_patt ; js_id |]
| Pattern_constructor (loc, ctor, args) ->
  let js_loc = js_of_location loc in
  let js_ctor = js_of_identifier ctor in
  let js_args = Js.Unsafe.inject (Js.array (Array.map js_of_pattern args)) in
  ctor_call "MLSyntax.Pattern_constructor" [| js_loc ; js_ctor ; js_args |]
| Pattern_or (loc, patt1, patt2) ->
  let js_loc = js_of_location loc in
  let js_patt1 = js_of_pattern patt1 in
  let js_patt2 = js_of_pattern patt2 in
  ctor_call "MLSyntax.Pattern_or" [| js_loc ; js_patt1 ; js_patt2 |]

and js_of_case case =
  let js_patt = js_of_pattern case.patt in
  let js_guard = js_of_option js_of_expression case.guard in
  let js_expr = js_of_expression case.expr in
  Js.Unsafe.obj [| ("patt", js_patt) ; ("guard", js_guard) ; ("expr", js_expr) |]

and js_of_binding b =
  let js_name = Js.Unsafe.inject (Js.string b.name) in
  let js_expr = js_of_expression b.expr in
  Js.Unsafe.obj [| ("name", js_name) ; ("expr", js_expr) |]

and js_of_structure_item = function
| Structure_eval (loc, expr) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_expression expr in
  ctor_call "MLSyntax.Structure_eval" [| js_loc ; js_expr |]
| Structure_value (loc, is_rec, patts, val_exps) ->
  let js_loc = js_of_location loc in
  let js_rec = Js.Unsafe.inject is_rec in
  let js_patts = Js.Unsafe.inject (Js.array (Array.map js_of_pattern patts)) in
  let js_val_exps = Js.Unsafe.inject (Js.array (Array.map js_of_expression val_exps)) in
  ctor_call "MLSyntax.Structure_value" [| js_loc ; js_rec ; js_patts ; js_val_exps |]
| Structure_type loc ->
  let js_loc = js_of_location loc in
  ctor_call "MLSyntax.Structure_type" [| js_loc |]
| Structure_module (loc, id, expr) ->
  let js_loc = js_of_location loc in
  let js_id = Js.Unsafe.inject (Js.string id) in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Structure_module" [| js_loc ; js_id ; js_expr |]
| Structure_modtype loc ->
  let js_loc = js_of_location loc in
  ctor_call "MLSyntax.Structure_modtype" [| js_loc |]
| Structure_include (loc, expr) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Structure_include" [| js_loc ; js_expr |]
| Structure_primitive loc ->
  let js_loc = js_of_location loc in
  ctor_call "MLSyntax.Structure_primitive" [| js_loc |]
| Structure_exception loc ->
  let js_loc = js_of_location loc in
  ctor_call "MLSyntax.Structure_exception" [| js_loc |]
| Structure_open (loc, id) ->
  let js_loc = js_of_location loc in
  let js_id = js_of_identifier id in
  ctor_call "MLSyntax.Structure_open" [| js_loc ; js_id |]

and js_of_module_expression = function
| Module_ident (loc, id) ->
  let js_loc = js_of_location loc in
  let js_id = js_of_identifier id in
  ctor_call "MLSyntax.Module_ident" [| js_loc ; js_id |]
| Module_structure (loc, structure) ->
  let js_loc = js_of_location loc in
  let js_structure = js_of_structure structure in
  ctor_call "MLSyntax.Module_structure" [| js_loc ; js_structure |]
| Module_functor (loc, id, expr) ->
  let js_loc = js_of_location loc in
  let js_id = Js.Unsafe.inject (Js.string id) in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Module_functor" [| js_loc ; js_id ; js_expr |]
| Module_apply (loc, func, expr) ->
  let js_loc = js_of_location loc in
  let js_func = js_of_module_expression func in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Module_apply" [| js_loc ; js_func ; js_expr |]
| Module_constraint (loc, expr) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_module_expression expr in
  ctor_call "MLSyntax.Module_constraint" [| js_loc ; js_expr |]
| Module_unpack (loc, expr) ->
  let js_loc = js_of_location loc in
  let js_expr = js_of_expression expr in
  ctor_call "MLSyntax.Module_unpack" [| js_loc ; js_expr |]

and js_of_structure = function
| Structure (loc, items) ->
  let js_loc = js_of_location loc in
  let js_items = Js.Unsafe.inject (Js.array (Array.map js_of_structure_item items)) in
  ctor_call "MLSyntax.Structure" [| js_loc ; js_items |]

let () =
  Js.export "MLExplain"
  (object%js
    (** Parse an OCaml expression *)
    method parseExpr name str =
      let filename = Js.to_string name in
      let s = Js.to_string str in
      let lexbuffer = from_string s in
      let past = Parse.expression lexbuffer in
      let (env, _) = Predef.build_initial_env
        (Env.add_type ~check:true) (Env.add_extension ~check:true) Env.empty in
      let id = Ident.create "Pervasives" in
      let env' = env
        |> Primitives.add_pervasives
        |> Env.open_signature Asttypes.Fresh (Path.Pident id) (Primitives.pervasives_sign) in
      let typed_ast = Typecore.type_expression env' past in
      let ast = translate_expression filename typed_ast in
      js_of_expression ast

    (** Parse an OCaml file *)
    method parseStructure name str =
      let filename = Js.to_string name in
      let s = Js.to_string str in
      let lexbuffer = from_string s in
      let past = Parse.implementation lexbuffer in
      (* Create a location for the entire structure *)
      let structure_loc = function
      | [] -> Location.none
      | start :: [] -> start.pstr_loc
      | start :: rest ->
        match List.rev rest with
        | last :: _ -> {
            loc_start = start.pstr_loc.loc_start ;
            loc_end = last.pstr_loc.loc_end ;
            loc_ghost = false
          }
        | [] -> Location.none (* absurd *) in
      let (env, _) = Predef.build_initial_env
        (Env.add_type ~check:true) (Env.add_extension ~check:true) Env.empty in
      let id = Ident.create "Pervasives" in
      let env' = env
        |> Primitives.add_pervasives
        |> Env.open_signature Asttypes.Fresh (Path.Pident id) (Primitives.pervasives_sign) in
      let (typed_ast, _, _) = Typemod.type_structure env' past (structure_loc past) in
      let struct_ = translate_structure filename typed_ast in
      js_of_structure struct_
  end)
