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

(** Evaluate a constant expression.
 * This function is trivial, constants are evaluated to their corresponding value *)
let run_constant = function
| Constant_integer i -> Value_int i
| Constant_float f -> Value_float f
| Constant_char c -> Value_char c
| Constant_string s -> Value_string (normalize_string s)

(** Get the value pointed by the given identifier. *)
let rec run_ident s ctx str = match str with
(* An id is a variable's name, supposedly accessible from the current context.
 * The id is looked up in the execution context to retrieve the corresponding index,
 * then the value corresponding to this index is retrieved from the program's state. *)
| Lident id ->
  let%result idx = ExecutionContext.find id ctx in
  let%result b = Vector.find s idx in
  value_of s ctx b
(* A dot identifier is a path to an id in a sub-module.
 * (e.g. "foo.bar" represents the id "bar" in the sub-module "foo")
 * The path is resolved recursively to get the module in which the id is supposed to be stored,
 * then the id is looked up in the the module's context to get its value. *)
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

(** Evaluate an expression and get the computed value. *)
and run_expression s ctx _term_ = match _term_ with
(* A constant expression is evaluated to its own value. *)
| Expression_constant (_, c) -> Unsafe.box (run_constant c)
(* To get the value pointed by an identifier, the entire path it describes must be resolved. *)
| Expression_ident (_, id) -> run_ident s ctx id
(* A let expression may be evaluated differently whether it is recursive or not.
 * In the case it is recursive, the variable must be pre-allocated so its identifier
 * can exist in its own expression's context. *)
| Expression_let (_, is_rec, patts, exp_ary, e2) ->
  if is_rec then
    (* In a recursive definition, the identifiers involved are pre-allocated
     * This function makes the list of identifiers to pre-allocate *)
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    (* Get the list of ids, since complex patterns are not supported in recursive definitions. *)
    let%result id_ary = MLArray.sequence_unsafe (MLArray.map prealloc patts) in
    let ids = MLList.of_array id_ary in
    (* Pre-allocate each variable. *)
    let func ctx id exp =
      let idx = Vector.append s (Prealloc (exp, ctx)) in
      let ctx' = ExecutionContext.add id idx ctx in
      Vector.set s idx (Prealloc (exp, ctx')) ; ctx' in
    (* Add the identifiers to the current context. *)
    let ctx' = MLList.foldl2 func ctx ids exps in
    (* Evaluate the expression "in" with every variables defined pre-allocated. *)
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
    (* Evaluate the expression "in" with the generated context. *)
    run_expression s ctx' e2
(* A function definition is evaluated to a function (in the interpreter world) that matches
 * each pattern of the function with the value given as argument
 * and evaluates the corresponding expression. *)
| Expression_function (_, cases) ->
  let func value = pattern_match_many s ctx value (MLList.of_array cases) in
  Unsafe.box (Value_fun func)
(* To apply a function to the given arguments, the actual function is applied to the first argument.
 * The resulting value should be a function that takes the following argument and so on until
 * there is no pending argument to consume. The resulting value is returned. *)
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
(* A tuple is the result of the evaluation of its components. *)
| Expression_tuple (_, tuple) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) tuple in
  let%result t = MLArray.sequence_unsafe value_nsfs in
  Unsafe.box (Value_tuple t)
(* An array is constructed from the evaluation of its components. *)
| Expression_array (_, ary) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) ary in
  let%result a = MLArray.sequence_unsafe value_nsfs in
  Unsafe.box (Value_array a)
(* A variant is stored as its label and its value if any. *)
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
(* Since a match ... with expression is equivalent to the application of the corresponding lambda function,
 * it is evaluated the exact same way. *)
| Expression_match (loc, expr, cases) ->
  let func = Expression_function (loc, cases) in
  let app = Expression_apply (loc, func, [| expr |]) in
  run_expression s ctx app
(* Sumtype instances are evaluated like variants except it builds a Sumtype value and
 * sumtype constructors accept several values as arguments *)
| Expression_constructor (_, ctor, args) ->
  let value_nsfs = MLArray.map (fun e -> run_expression s ctx e) args in
  let%result values =  MLArray.sequence_unsafe value_nsfs in
  let sum = Sumtype { constructor = string_of_identifier ctor ; args = values } in
  Unsafe.box (Value_custom sum)
(* A record has a field set and a base. The base is the record specified by the "with" syntax
 * (or an empty field set if no base has been specified).
 * The bindings here are the fields that are updated, they override the corresponding fields
 * in the provided base. *)
| Expression_record (_, bindings, base_opt) ->
  (* Function that adds the given binding to the map if it is valid. *)
  let add_to_map map_nsf binding =
    let%result map = map_nsf in
    let%result value = run_expression s ctx binding.expr in
    let idx = Vector.append s (Normal value) in
    Unsafe.box (Map.add binding.name idx map) in
  let string_eq s1 s2 = string_compare s1 s2 === 0 in
  let empty_map = Map.empty_map string_eq (fun r -> r) in
  (* If the value is a record, the function is applied, otherwise the default value is returned *)
  let map_from_value v = do_record_with_default v empty_map (fun r -> r) in
  (* The map of bindings of the base record. *)
  let base_map =
    Unsafe.do_with_default (Unsafe.of_option base_opt) empty_map (fun base ->
    Unsafe.do_with_default (run_expression s ctx base) empty_map (fun v ->
    map_from_value v)) in
  let%result map = MLArray.fold add_to_map (Unsafe.box base_map) bindings in
  (* Create the new record. *)
  let r = Record map in
  Unsafe.box (Value_custom r)
(* To retrieve a field from a record, the expression corresponding to the record is evaluated,
 * then the field name is looked up in the map of bindings of this record. *)
| Expression_field (_, record, fieldname) ->
  let%result value = run_expression s ctx record in
  do_record value (fun record ->
    let%result idx = Map.find fieldname record in
    let%result binding = Vector.find s idx in
    value_of s ctx binding)
(* To update a field in a record, the record expression's value is computed then the index
 * of the state where the value of the field is stored is retrieved. Finally the value at
 * this index is updated. *)
| Expression_setfield (_, record, fieldname, expr) ->
  let%result value = run_expression s ctx record in
  do_record value (fun record ->
    let%result idx = Map.find fieldname record in
    let%result v = run_expression s ctx expr in
      let ignore = Vector.set s idx (Normal v) in
      Unsafe.box nil)
(* To evaluate a conditional expression, the condition expression is evaluated and depending on
 * the resulting value the first expression or the second one is evaluated.
 * There may not be a second expression, in this case, nothing is done and
 * the conditional expression returns nil. *)
| Expression_ifthenelse (_, cond, e1, e2) ->
  let%result cond_val = run_expression s ctx cond in
    if is_sumtype_ctor "true" cond_val then
      run_expression s ctx e1
    else
      Unsafe.do_with_default (Unsafe.of_option e2) (Unsafe.box nil) (fun e -> run_expression s ctx e)
(* Evaluating a sequence of two expressions is equivalent to evaluate the first one,
 * discard the result and finally evaluate the second one. *)
| Expression_sequence (_, e1, e2) ->
  run_expression s ctx e1 ;
  run_expression s ctx e2
(* The evaluation of a while loop is recursive. First the condition is evaluated and if the result
 * is false, it returns nil. If the result is true, the body of the loop is evaluated and
 * the whole while-loop exression is re-evaluated as is.
 * The reason why it does not loop infinitely is because the state of the program may (should)
 * be modify at each iteration of the loop, making the condition expression evaluate differently *)
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
(* For loops are complex in OCaml since the iteration can go upward or downward depending on
 * the keyword used ("to" or "downto"). To solve this problem a function "step"
 * computes the value for the next iteration. Then the value the variable takes at the beginning
 * and the value it is to reach are computed. The variable is created in the state and the context.
 * Finally the body is evaluated until the variable reach its final value. *)
| Expression_for (_, id, fst, lst, dir, body) ->
  let%result first = run_expression s ctx fst in
  let%result last = run_expression s ctx lst in
  (* Create a new object in the program's state and add a reference to it in the context
   * val <id> : int = <first> (and stored in the state at index <idx>) *)
  let idx = Vector.append s (Normal first) in
  let ctx' = ExecutionContext.add id idx ctx in
  let step_value = if dir then 1 else -1 in
  let step v = match v with
  | Value_int i -> Unsafe.box (Value_int (i + step_value))
  | _ -> Unsafe.error "Expected an int" in
  let get_int v = match v with
  | Value_int i -> Unsafe.box i
  | _ -> Unsafe.error "Expected an int" in
  (* Main function of the for-loop interpretation.
   * It evaluates the body of the loop iff its variant is true. *)
  let rec iter nil =
    let%result b = Vector.find s idx in
    let%result v = value_of s ctx b in
    let%result iv = get_int v in
    let%result ilast = get_int last in
    (* Mandatory conversion to floats to use operators < and > *)
    let fv = number_of_int iv in
    let flast = number_of_int ilast in
    (* Check whether fv has reached flast depending on the direction *)
    if (dir && fv <= flast) || (not dir && fv >= flast) then
      let%result res = run_expression s ctx' body in
      let%result v' = step v in
       
      (* The body is executed in the Unsafe monad to propagate errors *)
      Vector.set s idx (Normal v') ;
      iter ()
    else
      (* A for loop returns uni *)
      Unsafe.box Value.nil in
  iter ()
(* Try expressions are meant to catch exceptions. Since exceptions are represented by
 * a constructor of the type Unsafe.t in the interpreter, the watched expression is
 * evaluated normally and the result is filtered. *)
| Expression_try (_, expr, cases) ->
  let ret = run_expression s ctx expr in
  begin
    match ret with
    | Unsafe.Exception x -> pattern_match_many s ctx x (MLList.of_array cases)
    | _ -> ret
  end
(* Let-module expressions are almost the same as simple let expressions since
 * the internal representation of first-class modules and classical modules is
 * identical. *)
| Expression_letmodule (_, id, modex, expr) ->
  let%result md = run_module_expression s ctx modex in
  let ident = string_of_identifier id in
  let idx = Vector.append s (Normal md) in
  let ctx' = ExecutionContext.add ident idx ctx in
  run_expression s ctx' expr
(* Internal representation of first-class modules is the same as classical modules.
 * There is thus nothing to do to pack a module. *)
| Expression_pack (_, expr) -> run_module_expression s ctx expr
(* Assertions throw an exception if the given expression evaluates to false.
 * The expression is therefore evaluated and the result value is checked.
 * A nil value is sent in case of success, an Assert_failure is thrown otherwise. *)
| Expression_assert (_, expr) ->
  let%result res = run_expression s ctx expr in
  let%result b = bool_of_value res in
  if b then
    Unsafe.box nil
  else
    Unsafe.except (Value_exception { constructor = "Assert_failure" ; args = [| |] })

(** Get the actual value held by the binding b *)
and value_of s ctx b = match b with
(* A normal value is already computed. *)
| Normal v -> Unsafe.box v
(* A pre-allocated value needs to be computed. *)
| Prealloc (e, ctx') -> run_expression s ctx' e

(** Match the given value with the given pattern to get a new execution context. *)
and pattern_match s ctx value patt = match patt with
(* The pattern _ matches any pattern and leave the context unchanged. *)
| Pattern_any _ -> Unsafe.box ctx
(* The variable pattern matches any pattern and bind the value to the given identifier. *)
| Pattern_var (_, id) ->
  let idx = Vector.append s (Normal value) in
  Unsafe.box (ExecutionContext.add id idx ctx)
(* The constant pattern matches its exact value only and leave the context unchanged. *)
| Pattern_constant (_, c) ->
  let v1 = run_constant c in
  if value_eq v1 value then Unsafe.box ctx else Unsafe.error "Matching failure"
(* The tuple pattern expects a tuple value and match each of its components to
 * the tuple value's components *)
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
(* An alias binds the value to another identifier in addition to the bindings
 * the matching of the pattern may have made. *)
| Pattern_alias (_, subpatt, alias) ->
  let%result ctx' = pattern_match s ctx value subpatt in
  let idx = Vector.append s (Normal value) in
  Unsafe.box (ExecutionContext.add alias idx ctx')
(* To match a constructor pattern, the value's contructor must be the same as
 * the pattern's one and the value's arguments must match the argument patterns. *)
| Pattern_constructor (_, ctor, args) ->
  do_sumtype value (fun sum ->
    if sum.constructor === string_of_identifier ctor then
      pattern_match_array s ctx sum.args args
    else
      Unsafe.error "Matching failure")
(* In a disjonctive pattern, if the value does not match the first pattern,
 * it must match the second. *)
| Pattern_or (_, patt1, patt2) ->
  Unsafe.do_with_default (pattern_match s ctx value patt1)
    (pattern_match s ctx value patt2) (* default value *)
    (fun ctx' -> Unsafe.box ctx') (* function to apply *)

(** Try many pattern one after the other until the value matches one. *)
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

(** Match each value of the array with the corresponding pattern in the pattern array. *)
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

(** Evaluate a toplevel phrase and return the computed value if any and the new context. *)
and run_structure_item s ctx _term_ = match _term_ with
(* Evaluate a core expression. *)
| Structure_eval (_, e) ->
  let%result v = run_expression s ctx e in
  Unsafe.box { value = v ; ctx = ctx }
(* Toplevel let bindings the same as core-expression-level let bindings. *)
| Structure_value (_, is_rec, patts, exp_ary) ->
  (* The data is recursive, a Prealloc binding is generated *)
  if is_rec then
    (* Prealloc only accept variable patterns *)
    let prealloc p = match p with
    | Pattern_var (_, id) -> Unsafe.box id
    | _ -> Unsafe.error "Used a pattern other than variable in recursive definition" in
    let exps = MLList.of_array exp_ary in
    let prealloc_vars = MLArray.map prealloc patts in
    let%result id_ary = MLArray.sequence_unsafe prealloc_vars in
    let ids = MLList.of_array id_ary in
    (* Auxiliary function adding a Prealloc of exp bound to id in the given context *)
    let func ctx id exp =
      let idx = Vector.append s (Prealloc (exp, ctx)) in
      let ctx' = ExecutionContext.add id idx ctx in
      Vector.set s idx (Prealloc (exp, ctx')) ; ctx' in
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
(* Type definitions are handled at type-checking pass, so there is nothing more to do
 * at this moment of the execution. *)
| Structure_type _ -> Unsafe.box { value = nil ; ctx = ctx }
(* The definition of a module requires the evaluation of the module expression
 * and then the module expression is bound to an identifier. *)
| Structure_module (_, id, expr) ->
  let%result m = run_module_expression s ctx expr in
  let idx = Vector.append s (Normal m) in
  let ctx' = ExecutionContext.add id idx ctx in
  Unsafe.box { value = m ; ctx = ctx' }
(* The definition of a module type is handled during the type checking, so
 * there is nothing more to do at this point. *)
| Structure_modtype _ -> Unsafe.box { value = nil ; ctx = ctx }
(* To include a module, its contents must be added to the current context. *)
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
(* Both primitive and exception definitions are handled during the type checking. *)
| Structure_primitive _ -> Unsafe.box { value = nil ; ctx = ctx }
| Structure_exception _ -> Unsafe.box { value = nil ; ctx = ctx }
(* Opening a module does not mean that its contents are added to the current context,
 * it means that they are made available. In this interpreter, when the context is browsed
 * via the find function, it browses the current context and if no satisfying binding
 * is found, it browses the map of each opened module.
 * Therefore, opening a module in this interpreter is adding it to the list of opened modules
 * of the current context. *)
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
| Module_unpack (_, expr) -> run_expression s ctx expr

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
