(** Type mapping an identifier to its contents *)
type opened_module = {
  id : Identifier.t ;
  map : (string, int) Map.map
}

(** Type holding the current context and a list of the opened modules.
 * A context associates a name to an index in the program's state (see Vector.js) *)
type execution_ctx = {
  execution_ctx_lexical_env : (string, int) Map.map ;
  opened_modules : opened_module list
}

(** Create an empty execution context *)
let empty = {
  execution_ctx_lexical_env = Map.empty_map (fun s1 s2 -> s1 === s2) (fun s -> s) ;
  opened_modules = []
}

(** Create an execution context from a map *)
let from_map map = {
  execution_ctx_lexical_env = map ;
  opened_modules = []
}

(** Look for the identifier n in the context
 * Search in the current lexical environnement and then in the opened modules until a binding for n is found *)
let find n ctx =
  let fst = Map.find n ctx.execution_ctx_lexical_env in
  let func fst md = match fst with
  | Unsafe.Result _ -> fst
  | _ -> Map.find n md.map in
  MLList.foldl func fst ctx.opened_modules

(** Add the binding between n and v in the execution context *)
let add n v ctx = { ctx with execution_ctx_lexical_env = Map.add n v ctx.execution_ctx_lexical_env }

(** Get the current lexical environment of the execution context *)
let execution_ctx_lexical_env ctx = ctx.execution_ctx_lexical_env

(** Put the module in the list of opened module of the execution context *)
let open_module id map ctx = { ctx with opened_modules = { id = id ; map = map } :: ctx.opened_modules }
