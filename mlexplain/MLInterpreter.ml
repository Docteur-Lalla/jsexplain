open MLSyntax
open Value
open Identifier

let min a b = if a <= b then a else b

type environment = ExecutionContext.execution_ctx

type structure_item_result = {
  value : value ;
  ctx : environment
}

type builtin_binding = {
  name: string ;
  value: value
}

let create_builtin name value = { name = name ; value = value }

let build_initial_env s ctx =
  let builtins = [
    create_builtin "raise" raise_function ;
    create_builtin "+" prim_int_plus ;
    create_builtin "-" prim_int_sub ;
    create_builtin "*" prim_int_mul ;
    create_builtin "/" prim_int_div ;

    create_builtin "+." prim_float_plus ;
    create_builtin "-." prim_float_sub ;
    create_builtin "*." prim_float_mul ;
    create_builtin "/." prim_float_div ;

    create_builtin "&&" prim_bool_and ;
    create_builtin "||" prim_bool_or
  ] in
  let func ctx builtin =
    let idx = Vector.append s (Normal builtin.value) in
    ExecutionContext.add builtin.name idx ctx in
  MLList.foldl func ctx builtins

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
  (* Result idx = ExecutionContext.find id ctx
   * Result b = Vector.find s idx *)
  Unsafe.bind (ExecutionContext.find id ctx) (fun idx ->
  Unsafe.bind (Vector.find s idx) (fun b -> value_of s ctx b))
| Ldot (path, id) ->
  Unsafe.bind (run_ident s ctx path) (fun value ->
  match value with
  | Value_struct m ->
    (* Result idx = ExecutionContext.find id ctx
     * Result b = Vector.find s idx *)
    Unsafe.bind (Map.find id m) (fun idx ->
    Unsafe.bind (Vector.find s idx) (fun b -> value_of s ctx b))
  | _ -> Unsafe.error "Try to get attribute from non-module value")


and run_expression s ctx _term_ = match _term_ with
| Expression_constant (_, c) -> Unsafe.box (run_constant c)
| Expression_ident (_, id) -> run_ident s ctx id
| Expression_let (_, is_rec, patts, exp_ary, e2) ->
  if is_rec then
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    Unsafe.bind (MLArray.lift_unsafe (MLArray.map prealloc patts)) (fun id_ary ->
    let ids = MLList.of_array id_ary in
    let func ctx id exp =
      let idx = Vector.append s (Prealloc exp) in
      ExecutionContext.add id idx ctx in
    let ctx' = MLList.foldl2 func ctx ids exps in
    run_expression s ctx' e2)
  else
    let func ctx_opt patt exp =
      (* Result ctx = ctx_opt
       * Result v = run_expression ctx exp *)
      Unsafe.bind ctx_opt (fun ctx ->
      Unsafe.bind (run_expression s ctx exp) (fun v -> pattern_match s ctx v patt)) in
    let patt_list = MLList.of_array patts in
    let exps = MLList.of_array exp_ary in
    Unsafe.bind (MLList.foldl2 func (Unsafe.box ctx) patt_list exps) (fun ctx' ->
    run_expression s ctx' e2)
| Expression_function (_, cases) ->
  let func value = pattern_match_many s ctx value (MLList.of_array cases) in
  Unsafe.box (Value_fun func)
| Expression_apply (_, fe, argse) ->
  let rec apply_fun func ctx arg args =
    (* Result v = run_expression ctx arg
     * Result res = func v *)
    Unsafe.bind (run_expression s ctx arg) (fun v ->
    Unsafe.bind (func v) (fun res -> run_apply res args))
  and run_apply func args =
    match args with
    (* No argument means a value to return *)
    | [] -> Unsafe.box func
    (* Having arguments means that we have to apply a function to them *)
    | x :: xs ->
      match func with
      | Value_fun f -> apply_fun f ctx x xs
      | _ -> Unsafe.error "Expected a function value" in

    (* Result func = run_expression ctx fe *)
    Unsafe.bind (run_expression s ctx fe) (fun func ->
      run_apply func (MLList.of_array argse))
| Expression_tuple (_, tuple) ->
  let value_opts = MLArray.map (fun e -> run_expression s ctx e) tuple in
  (* Result t = lift_option value_opts *)
  Unsafe.bind (MLArray.lift_unsafe value_opts) (fun t -> Unsafe.box (Value_tuple t))
| Expression_array (_, ary) ->
  let value_opts = MLArray.map (fun e -> run_expression s ctx e) ary in
  (* Result a = MLArray.lift_option value_opts *)
  Unsafe.bind (MLArray.lift_unsafe value_opts) (fun a -> Unsafe.box (Value_array a))
| Expression_variant (_, label, expr_opt) ->
  let value_nsf = Unsafe.bind (Unsafe.of_option expr_opt) (fun e -> run_expression s ctx e) in
  (* The value is kept only if there was an expression beforehand *)
  let value_opt = Option.bind expr_opt (fun e -> Some value_nsf) in
  let variant = { label = label ; value_opt = value_opt } in
  Unsafe.box (Value_variant variant)
| Expression_match (loc, expr, cases) ->
  let func = Expression_function (loc, cases) in
  let app = Expression_apply (loc, func, [| expr |]) in
  run_expression s ctx app
| Expression_constructor (_, ctor, args) ->
  let value_opts = MLArray.map (fun e -> run_expression s ctx e) args in
  (* Result a = MLArray.lift_option value_opts *)
  Unsafe.bind (MLArray.lift_unsafe value_opts) (fun values ->
  let sum = Sumtype { constructor = string_of_identifier ctor ; args = values } in
  Unsafe.box (Value_custom sum))
| Expression_record (_, bindings, base_opt) ->
  let func map_opt binding =
    (* Result map = map_opt
     * Result value = run_expression s ctx binding.expr *)
    Unsafe.bind map_opt (fun map ->
    Unsafe.bind (run_expression s ctx binding.expr) (fun value ->
    let idx = Vector.append s (Normal value) in
    Unsafe.box (Map.add binding.name idx map))) in
  let string_eq s1 s2 = string_compare s1 s2 === 0 in
  let empty_map = Map.empty_map string_eq (fun r -> r) in
  (* If the value is a record, the function is applied, otherwise the default value is returned *)
  let map_from_value v = do_record_with_default v empty_map (fun r -> r) in
  let base_map =
    Unsafe.do_with_default (Unsafe.of_option base_opt) empty_map (fun base ->
    Unsafe.do_with_default (run_expression s ctx base) empty_map (fun v ->
    map_from_value v)) in
  (* Result map = MLArray.fold func (Unsafe.box base_map) bindings *)
  Unsafe.bind (MLArray.fold func (Unsafe.box base_map) bindings) (fun map ->
  let r = Record map in
  Unsafe.box (Value_custom r))
| Expression_field (_, record, fieldname) ->
  (* Result value = run_expression s ctx record *)
  Unsafe.bind (run_expression s ctx record) (fun value ->
  do_record value (fun record ->
    (* Result idx = Map.find fieldname record
     * Result binding = Vector.find s idx *)
    Unsafe.bind (Map.find fieldname record) (fun idx ->
    Unsafe.bind (Vector.find s idx) (fun binding ->
    value_of s ctx binding))))
| Expression_setfield (_, record, fieldname, expr) ->
  (* Result value = run_expression s ctx record *)
  Unsafe.bind (run_expression s ctx record) (fun value ->
  do_record value (fun record ->
    (* Result idx = Map.find fieldname record
     * Result v = run_expression s ctx expr *)
    Unsafe.bind (Map.find fieldname record) (fun idx ->
    Unsafe.bind (run_expression s ctx expr) (fun v ->
      let ignore = Vector.set s idx (Normal v) in
      Unsafe.box nil))))
| Expression_ifthenelse (_, cond, e1, e2) ->
  (* Result cond_val = run_expression s ctx cond *)
  Unsafe.bind (run_expression s ctx cond) (fun cond_val ->
    if is_sumtype_ctor "true" cond_val then
      run_expression s ctx e1
    else
      Unsafe.do_with_default (Unsafe.of_option e2) (Unsafe.box nil) (fun e -> run_expression s ctx e))
| Expression_sequence (_, e1, e2) ->
  run_expression s ctx e1 ;
  run_expression s ctx e2
| Expression_while (loc, cond_expr, body) ->
  (* Alias pattern not supported by the compiler *)
  let while_expr = Expression_while (loc, cond_expr, body) in
  (* Result cond = run_expression s ctx cond_expr *)
  Unsafe.bind (run_expression s ctx cond_expr) (fun cond ->
  do_sumtype cond (fun b ->
  if b.constructor === "true" then
  begin
    run_expression s ctx body ;
    run_expression s ctx while_expr
  end
  else
    (* While loops ultimately return nil *)
    Unsafe.box nil))
| Expression_for (_, id, fst, lst, dir, body) ->
  (* Result first = run_expression s ctx fst
   * Result last = run_expression s ctx lst *)
  Unsafe.bind (run_expression s ctx fst) (fun first ->
  Unsafe.bind (run_expression s ctx lst) (fun last ->
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
    (* Result b = Vector.find s idx
     * Result v = value_of s ctx b
     * Result iv = get_int v
     * Result ilast = get_int last *)
    Unsafe.bind (Vector.find s idx) (fun b ->
    Unsafe.bind (value_of s ctx b) (fun v ->
    Unsafe.bind (get_int v) (fun iv ->
    Unsafe.bind (get_int last) (fun ilast ->
    (* Mandatory conversion to floats to use operators < and > *)
    let fv = number_of_int iv in
    let flast = number_of_int ilast in
    (* Check whether fv has reached flast depending on the direction *)
    if (dir && fv < flast) || (not dir && fv > flast) then
      (* Result res = run_expression s ctx' body
       * Result v' = step v
       
       * The body is executed in the Option monad to propagate errors *)
      Unsafe.bind (run_expression s ctx' body) (fun res ->
      Unsafe.bind (step v) (fun v' ->
      Vector.set s idx (Normal v') ;
      iter ()))
    else
      (* A for loop returns uni *)
      Unsafe.box Value.nil)))) in
  iter ()))
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
              Unsafe.bind v_nsf (fun v -> pattern_match s ctx v patt)
          end
      else
        Unsafe.error "Matching failure"
    | _ -> Unsafe.error "Matching failure"
  end
| Pattern_alias (_, patt, id) ->
  (* Result ctx' = pattern_match s ctx value patt *)
  Unsafe.bind (pattern_match s ctx value patt) (fun ctx' ->
  let idx = Vector.append s (Normal value) in
  Unsafe.box (ExecutionContext.add id idx ctx'))
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
  | Unsafe.Result ctx' -> run_expression s ctx' x.expr
  | Unsafe.Exception ex -> Unsafe.Exception ex

and pattern_match_array s ctx ary patts =
  let len = MLArray.length patts in
  let vallen = MLArray.length ary in

  let flen = number_of_int len in
  let fvallen = number_of_int vallen in
  let min_len = int_of_number (min flen fvallen) in

  (* For each i in 0 to len,
   * the value i is matched with the pattern i to populate the new environment *)
  let rec for_loop ctx_opt i =
    if i === min_len then
      (* terminal case, the resulting environment is returned *)
      ctx_opt
    else
      let some_case_func ctx =
        let vali = (MLArray.get ary i) in
        let patti = (MLArray.get patts i) in
        for_loop (pattern_match s ctx vali patti) (i + 1) in
      (* Result ctx = ctx_opt *)
      Unsafe.bind ctx_opt some_case_func in
   for_loop (Unsafe.box ctx) 0

let rec run_structure_item s ctx _term_ = match _term_ with
| Structure_eval (_, e) -> Unsafe.bind (run_expression s ctx e) (fun v -> Unsafe.box { value = v ; ctx = ctx })
| Structure_value (_, is_rec, patts, exp_ary) ->
  (* The data is recursive, a Prealloc binding is generated *)
  if is_rec then
    (* Prealloc only accept variable patterns *)
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used a pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    let prealloc_vars = MLArray.map prealloc patts in
    (* MLArray.lift_option : 'a option list -> 'a list option
     * Result id_ary = MLArray.lift_option prealloc_vars *)
    Unsafe.bind (MLArray.lift_unsafe prealloc_vars) (fun id_ary ->
    let ids = MLList.of_array id_ary in
    (* Auxiliary function adding a Prealloc of exp bound to id in the given context *)
    let func ctx id exp =
      let idx = Vector.append s (Prealloc exp) in
      ExecutionContext.add id idx ctx in
    (* Foldl of the lists simultaneously using func and the current context *)
    let ctx' = MLList.foldl2 func ctx ids exps in
    (* Return the last value bound by this toplevel phrase *)
    let id = MLArray.get id_ary (MLArray.length id_ary - 1) in
    Unsafe.bind (ExecutionContext.find id ctx') (fun idx ->
    Unsafe.bind (Vector.find s idx) (fun binding ->
    Unsafe.bind (value_of s ctx' binding) (fun v ->
    Unsafe.box { value = v ; ctx = ctx' }))))
  else
    let func ctx_opt patt exp =
      (* Result ctx = ctx_opt
       * Result v = run_expression ctx exp *)
      Unsafe.bind ctx_opt (fun ctx ->
      Unsafe.bind (run_expression s ctx exp) (fun v -> pattern_match s ctx v patt)) in
    let patt_list = MLList.of_array patts in
    let exps = MLList.of_array exp_ary in
    (* Generate a new environment binding patterns' variable to their respective value *)
    Unsafe.bind (MLList.foldl2 func (Unsafe.box ctx) patt_list exps) (fun ctx' ->
    (* Get the value to return *)
    let elems = Map.elems (ExecutionContext.execution_ctx_lexical_env ctx') in
    let rev_elems = MLList.rev elems in
    let idx_opt = match rev_elems with
    | [] -> assert false
    | h :: t -> Unsafe.box h in

    (* Result idx = idx_opt
     * Result last = Vector.find s idx
     * Result v = value_of s ctx' last *)
    Unsafe.bind idx_opt (fun idx ->
    Unsafe.bind (Vector.find s idx) (fun last ->
    Unsafe.bind (value_of s ctx' last) (fun v ->
    Unsafe.box { value = v ; ctx = ctx' }))))
| Structure_type _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_module (_, id, expr) ->
  Unsafe.bind (run_module_expression s ctx expr) (fun m ->
  let idx = Vector.append s (Normal m) in
  let ctx' = ExecutionContext.add id idx ctx in
  Unsafe.box { value = m ; ctx = ctx' })
| Structure_modtype _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_include (_, expr) ->
  Unsafe.bind (run_module_expression s ctx expr) (fun value ->
  match value with
  | Value_struct str ->
    let map = Map.union str (ExecutionContext.execution_ctx_lexical_env ctx) in
    Unsafe.box { value = nil ; ctx = ExecutionContext.from_map map }
  | _ -> Unsafe.error "Expected a module value")
| Structure_primitive _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_exception _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_open (_, id) ->
  Unsafe.bind (run_ident s ctx id) (fun v ->
  match v with
  | Value_struct md -> Unsafe.box { value = nil ; ctx = ExecutionContext.open_module md ctx }
  | _ -> Unsafe.error "Expected a module")

and run_module_expression s ctx _term_ = match _term_ with
| Module_ident (_, id) -> run_ident s ctx id
| Module_structure (_, str) ->
  Unsafe.bind (run_structure s ctx str) (fun res ->
  let map = ExecutionContext.execution_ctx_lexical_env res.ctx in
  Unsafe.box (Value_struct map))
| Module_functor (_, id, expr) ->
  let func varg =
    let idx = Vector.append s (Normal varg) in
    let ctx' = ExecutionContext.add id idx ctx in
    run_module_expression s ctx' expr in
  Unsafe.box (Value_functor func)
| Module_apply (_, f, e) ->
  Unsafe.bind (run_module_expression s ctx f) (fun func ->
  Unsafe.bind (run_module_expression s ctx e) (fun expr ->
  match func with
  | Value_functor fctor -> fctor expr
  | _ -> Unsafe.error "Expected a functor"))
| Module_constraint (_, expr) -> run_module_expression s ctx expr

and run_structure s ctx _term_ =
  let func opt _term_ =
    Unsafe.bind opt (fun res ->
    run_structure_item s res.ctx _term_) in
  (* Fake result data used as first input of the fold function below *)
  let fake_res = Unsafe.box { value = nil ; ctx = ctx } in
  match _term_ with
  | Structure (_, items) -> MLArray.fold func fake_res items
