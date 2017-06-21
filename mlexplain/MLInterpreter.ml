open MLSyntax
open Value
open Identifier

let min a b = if a <= b then a else b

type environment = ExecutionContext.execution_ctx

type structure_item_result = {
  value : value ;
  ctx : environment
}

(** Build the Pervasives module *)
let build_initial_env s ctx =
  let func ctx builtin =
    let name = builtin_name builtin in
    let value = builtin_value builtin in
    let idx = Vector.append s (Normal value) in
    ExecutionContext.add name idx ctx in
  MLList.foldl func ctx Value.initial_env

let rec string_of_identifier = function
| Lident id -> id
| Ldot (path, id) -> strappend (strappend (string_of_identifier path) ".") id

let run_constant = function
| Constant_integer i -> Value_int i
| Constant_float f -> Value_float f
| Constant_char c -> Value_char c
| Constant_string s -> Value_string (normalize_string s)

let rec run_ident s ctx str = match str with
| Lident id ->
  let%result idx = ExecutionContext.find id ctx in
  let%result b = Vector.find s idx in
  value_of s ctx b
| Ldot (path, id) ->
  let%result value = run_ident s ctx path in
  match value with
  | Value_struct m ->
    (* The computed path should lead to a module struct
     * The id is looked up in this module's context *)
    let%result idx = Map.find id m in
    let%result b = Vector.find s idx in
    value_of s ctx b
  | _ -> Unsafe.error "Try to get attribute from non-module value"


and run_expression s ctx _term_ = match _term_ with
| Expression_constant (_, c) -> Unsafe.box (run_constant c)
| Expression_ident (_, id) -> run_ident s ctx id
| Expression_let (_, is_rec, patts, exp_ary, e2) ->
  if is_rec then
    (* In a recursive definition, the identifiers involved are pr-eallocated
     * This function makes the list of identifiers to pre-allocate *)
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    let%result id_ary = MLArray.lift_unsafe (MLArray.map prealloc patts) in
    let ids = MLList.of_array id_ary in
    let func ctx id exp =
      let idx = Vector.append s (Prealloc exp) in
      ExecutionContext.add id idx ctx in
    (* Add the identifiers to the current context *)
    let ctx' = MLList.foldl2 func ctx ids exps in
    run_expression s ctx' e2
  else
    (* The function matches the pattern with the expression and returns the generated context *)
    let func ctx_nsf patt exp =
      let%result ctx = ctx_nsf in
      let%result v = run_expression s ctx exp in
      pattern_match s ctx v patt in
    let patt_list = MLList.of_array patts in
    let exps = MLList.of_array exp_ary in
    (* Generate a context containing every definition *)
    let%result ctx' = MLList.foldl2 func (Unsafe.box ctx) patt_list exps in
    run_expression s ctx' e2
| Expression_function (_, cases) ->
  let func value = pattern_match_many s ctx value (MLList.of_array cases) in
  Unsafe.box (Value_fun func)
| Expression_apply (_, fe, argse) ->
  let rec apply_fun func ctx arg args =
    let%result v = run_expression s ctx arg in
    let%result res = func v in
    run_apply res args
  and run_apply func args =
    match args with
    (* No argument means a value to return *)
    | [] -> Unsafe.box func
    (* Having arguments means that we have to apply a function to them *)
    | x :: xs ->
      match func with
      | Value_fun f -> apply_fun f ctx x xs
      | _ -> Unsafe.error "Expected a function value" in

    let%result func = run_expression s ctx fe in
    run_apply func (MLList.of_array argse)
| Expression_tuple (_, tuple) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) tuple in
  let%result t = MLArray.lift_unsafe value_nsfs in
  Unsafe.box (Value_tuple t)
| Expression_array (_, ary) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) ary in
  let%result a = MLArray.lift_unsafe value_nsfs in
  Unsafe.box (Value_array a)
| Expression_variant (_, label, expr_opt) ->
  let value_nsf =
    let%result e = Unsafe.of_option expr_opt in
    run_expression s ctx e in
  (* The value is kept only if there was an expression beforehand *)
  let value_opt =
    let%some e = expr_opt in
    Some value_nsf in
  let variant = { label = label ; value_opt = value_opt } in
  Unsafe.box (Value_variant variant)
| Expression_match (loc, expr, cases) ->
  let func = Expression_function (loc, cases) in
  let app = Expression_apply (loc, func, [| expr |]) in
  run_expression s ctx app
| Expression_constructor (_, ctor, args) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) args in
  let%result values =  MLArray.lift_unsafe value_nsfs in
  let sum = Sumtype { constructor = string_of_identifier ctor ; args = values } in
  Unsafe.box (Value_custom sum)
| Expression_record (_, bindings, base_opt) ->
  let func map_nsf binding =
    let%result map = map_nsf in
    let%result value = run_expression s ctx binding.expr in
    let idx = Vector.append s (Normal value) in
    Unsafe.box (Map.add binding.name idx map) in
  let string_eq s1 s2 = string_compare s1 s2 === 0 in
  let empty_map = Map.empty_map string_eq (fun r -> r) in
  (* If the value is a record, the function is applied, otherwise the default value is returned *)
  let map_from_value v = do_record_with_default v empty_map (fun r -> r) in
  let base_map =
    Unsafe.do_with_default (Unsafe.of_option base_opt) empty_map (fun base ->
    Unsafe.do_with_default (run_expression s ctx base) empty_map (fun v ->
    map_from_value v)) in
  let%result map = MLArray.fold func (Unsafe.box base_map) bindings in
  let r = Record map in
  Unsafe.box (Value_custom r)
| Expression_field (_, record, fieldname) ->
  let%result value = run_expression s ctx record in
  do_record value (fun record ->
    let%result idx = Map.find fieldname record in
    let%result binding = Vector.find s idx in
    value_of s ctx binding)
| Expression_setfield (_, record, fieldname, expr) ->
  let%result value = run_expression s ctx record in
  do_record value (fun record ->
    let%result idx = Map.find fieldname record in
    let%result v = run_expression s ctx expr in
      let ignore = Vector.set s idx (Normal v) in
      Unsafe.box nil)
| Expression_ifthenelse (_, cond, e1, e2) ->
  let%result cond_val = run_expression s ctx cond in
    if is_sumtype_ctor "true" cond_val then
      run_expression s ctx e1
    else
      Unsafe.do_with_default (Unsafe.of_option e2) (Unsafe.box nil) (fun e -> run_expression s ctx e)
| Expression_sequence (_, e1, e2) ->
  run_expression s ctx e1 ;
  run_expression s ctx e2
| Expression_while (loc, cond_expr, body) ->
  (* Alias pattern not supported by the compiler *)
  let while_expr = Expression_while (loc, cond_expr, body) in
  let%result cond = run_expression s ctx cond_expr in
  do_sumtype cond (fun b ->
  if b.constructor === "true" then
  begin
    run_expression s ctx body ;
    run_expression s ctx while_expr
  end
  else
    (* While loops ultimately return nil *)
    Unsafe.box nil)
| Expression_for (_, id, fst, lst, dir, body) ->
  let%result first = run_expression s ctx fst in
  let%result last = run_expression s ctx lst in
  (* Create a new object in the program's state and add a reference to it in the context
   * val <id> : int = <first> (and stored in the state at index <idx> *)
  let idx = Vector.append s (Normal first) in
  let ctx' = ExecutionContext.add id idx ctx in
  let step_value = if dir then 1 else -1 in
  let step v = match v with
  | Value_int i -> Unsafe.box (Value_int (i + step_value))
  | _ -> Unsafe.error "Expected an int" in
  let get_int v = match v with
  | Value_int i -> Unsafe.box i
  | _ -> Unsafe.error "Expected an int" in
  let rec iter nil =
    let%result b = Vector.find s idx in
    let%result v = value_of s ctx b in
    let%result iv = get_int v in
    let%result ilast = get_int last in
    (* Mandatory conversion to floats to use operators < and > *)
    let fv = number_of_int iv in
    let flast = number_of_int ilast in
    (* Check whether fv has reached flast depending on the direction *)
    if (dir && fv < flast) || (not dir && fv > flast) then
      let%result res = run_expression s ctx' body in
      let%result v' = step v in
       
      (* The body is executed in the Unsafe monad to propagate errors *)
      Vector.set s idx (Normal v') ;
      iter ()
    else
      (* A for loop returns uni *)
      Unsafe.box Value.nil in
  iter ()
| Expression_try (_, expr, cases) ->
  let ret = run_expression s ctx expr in
  begin
    match ret with
    | Unsafe.Exception x -> pattern_match_many s ctx x (MLList.of_array cases)
    | _ -> ret
  end

(** Get the actual value held by the binding b *)
and value_of s ctx b = match b with
| Normal v -> Unsafe.box v
| Prealloc e -> run_expression s ctx e

and pattern_match s ctx value patt = match patt with
| Pattern_any _ -> Unsafe.box ctx
| Pattern_var (_, id) ->
  let idx = Vector.append s (Normal value) in
  Unsafe.box (ExecutionContext.add id idx ctx)
| Pattern_constant (_, c) ->
  let v1 = run_constant c in
  if value_eq v1 value then Unsafe.box ctx else Unsafe.error "Matching failure"
| Pattern_tuple (_, patts) ->
  begin
    match value with
    (* No need to check if the pattern has the same number of components as the value
     * since the typing prevent different-length tuple matching *)
    | Value_tuple tuples -> pattern_match_array s ctx tuples patts
    | _ -> Unsafe.error "Expected a tuple"
  end
| Pattern_array (_, patts) ->
  begin
    match value with
    | Value_array ary ->
      if MLArray.length patts === MLArray.length ary then
        pattern_match_array s ctx ary patts
      else
        Unsafe.error "Array lengths don't match"
    | _ -> Unsafe.error "Expected an array"
  end
| Pattern_variant (_, label, patt_opt) ->
  begin
    match value with
    | Value_variant variant ->
      if variant.label === label then
        match patt_opt with
        | None ->
          begin
            match variant.value_opt with
            | None -> Unsafe.box ctx
            | Some _ -> Unsafe.error "Unexpected argument for the variant"
          end
        | Some patt ->
          begin
            match variant.value_opt with
            | None -> Unsafe.error "Expected an argument for the variant"
            | Some v_nsf ->
              let%result v = v_nsf in
              pattern_match s ctx v patt
          end
      else
        Unsafe.error "Matching failure"
    | _ -> Unsafe.error "Matching failure"
  end
| Pattern_alias (_, patt, id) ->
  let%result ctx' = pattern_match s ctx value patt in
  let idx = Vector.append s (Normal value) in
  Unsafe.box (ExecutionContext.add id idx ctx')
| Pattern_constructor (_, ctor, args) ->
  do_sumtype value (fun sum ->
    if sum.constructor === string_of_identifier ctor then
      pattern_match_array s ctx sum.args args
    else
      Unsafe.error "Matching failure")
| Pattern_or (_, patt1, patt2) ->
  Unsafe.do_with_default (pattern_match s ctx value patt1)
    (pattern_match s ctx value patt2) (* default value *)
    (fun ctx' -> Unsafe.box ctx') (* function to apply *)

and pattern_match_many s ctx value cases = match cases with
| [] -> Unsafe.error "Matching failure"
| x :: xs ->
  match pattern_match s ctx value x.patt with
  | Unsafe.Error e -> pattern_match_many s ctx value xs
  | Unsafe.Result ctx' ->
    begin
      match x.guard with
      | None -> run_expression s ctx' x.expr
      | Some guard ->
        let%result res = run_expression s ctx' guard in
        let%result b = bool_of_value res in
        if b then
          run_expression s ctx' x.expr
        else
          pattern_match_many s ctx value xs
    end
  | Unsafe.Exception ex -> Unsafe.Exception ex

and pattern_match_array s ctx ary patts =
  let len = MLArray.length patts in
  let vallen = MLArray.length ary in

  let flen = number_of_int len in
  let fvallen = number_of_int vallen in
  let min_len = int_of_number (min flen fvallen) in

  (* For each i in 0 to len,
   * the value i is matched with the pattern i to populate the new environment *)
  let rec for_loop ctx_nsf i =
    if i === min_len then
      (* terminal case, the resulting environment is returned *)
      ctx_nsf
    else
      let some_case_func ctx =
        let vali = (MLArray.get ary i) in
        let patti = (MLArray.get patts i) in
        for_loop (pattern_match s ctx vali patti) (i + 1) in
      (* ctx_nsf >>= some_case_func *)
      Unsafe.bind ctx_nsf some_case_func in
   for_loop (Unsafe.box ctx) 0

let rec run_structure_item s ctx _term_ = match _term_ with
| Structure_eval (_, e) ->
  let%result v = run_expression s ctx e in
  Unsafe.box { value = v ; ctx = ctx }
| Structure_value (_, is_rec, patts, exp_ary) ->
  (* The data is recursive, a Prealloc binding is generated *)
  if is_rec then
    (* Prealloc only accept variable patterns *)
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used a pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    let prealloc_vars = MLArray.map prealloc patts in
    let%result id_ary = MLArray.lift_unsafe prealloc_vars in
    let ids = MLList.of_array id_ary in
    (* Auxiliary function adding a Prealloc of exp bound to id in the given context *)
    let func ctx id exp =
      let idx = Vector.append s (Prealloc exp) in
      ExecutionContext.add id idx ctx in
    (* Foldl of the lists simultaneously using func and the current context *)
    let ctx' = MLList.foldl2 func ctx ids exps in
    (* Return the last value bound by this toplevel phrase *)
    let id = MLArray.get id_ary (MLArray.length id_ary - 1) in
    let%result idx = ExecutionContext.find id ctx' in
    let%result binding = Vector.find s idx in
    let%result v = value_of s ctx' binding in
    Unsafe.box { value = v ; ctx = ctx' }
  else
    let func ctx_nsf patt exp =
      let%result ctx = ctx_nsf in
      let%result v = run_expression s ctx exp in
      pattern_match s ctx v patt in
    let patt_list = MLList.of_array patts in
    let exps = MLList.of_array exp_ary in
    (* Generate a new environment binding patterns' variable to their respective value *)
    let%result ctx' = MLList.foldl2 func (Unsafe.box ctx) patt_list exps in
    (* Get the value to return *)
    let elems = Map.elems (ExecutionContext.execution_ctx_lexical_env ctx') in
    let rev_elems = MLList.rev elems in
    let idx_opt = match rev_elems with
    | [] -> assert false
    | h :: t -> Unsafe.box h in

    let%result idx = idx_opt in
    let%result last = Vector.find s idx in
    let%result v = value_of s ctx' last in
    Unsafe.box { value = v ; ctx = ctx' }
| Structure_type _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_module (_, id, expr) ->
  let%result m = run_module_expression s ctx expr in
  let idx = Vector.append s (Normal m) in
  let ctx' = ExecutionContext.add id idx ctx in
  Unsafe.box { value = m ; ctx = ctx' }
| Structure_modtype _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_include (_, expr) ->
  let%result value = run_module_expression s ctx expr in
  begin
    match value with
    | Value_struct str ->
      (* Add the contents of the module to the current context *)
      let map = Map.union str (ExecutionContext.execution_ctx_lexical_env ctx) in
      Unsafe.box { value = nil ; ctx = ExecutionContext.from_map map }
    | _ -> Unsafe.error "Expected a module value"
  end
| Structure_primitive _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_exception _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_open (_, id) ->
  let%result v = run_ident s ctx id in
  match v with
  | Value_struct md -> Unsafe.box { value = nil ; ctx = ExecutionContext.open_module id md ctx }
  | _ -> Unsafe.error "Expected a module"

and run_module_expression s ctx _term_ = match _term_ with
| Module_ident (_, id) -> run_ident s ctx id
| Module_structure (_, str) ->
  (* Run the structure and put the returned context in the struct value *)
  let%result res = run_structure s ctx str in
  let map = ExecutionContext.execution_ctx_lexical_env res.ctx in
  Unsafe.box (Value_struct map)
| Module_functor (_, id, expr) ->
  let func varg =
    let idx = Vector.append s (Normal varg) in
    let ctx' = ExecutionContext.add id idx ctx in
    run_module_expression s ctx' expr in
  Unsafe.box (Value_functor func)
| Module_apply (_, f, e) ->
  let%result func = run_module_expression s ctx f in
  let%result expr = run_module_expression s ctx e in
  begin 
    match func with
    | Value_functor fctor -> fctor expr
    | _ -> Unsafe.error "Expected a functor"
  end
| Module_constraint (_, expr) -> run_module_expression s ctx expr

and run_structure s ctx _term_ =
  let func nsf _term_ =
    let%result res = nsf in
    run_structure_item s res.ctx _term_ in
  (* Fake result data used as first input of the fold function below *)
  let fake_res = Unsafe.box { value = nil ; ctx = ctx } in
  match _term_ with
  | Structure (_, items) -> MLArray.fold func fake_res items

let run s ctx _term_ =
  let%result res = run_structure s ctx _term_ in
  Unsafe.box res.ctx
