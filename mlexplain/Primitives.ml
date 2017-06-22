open Asttypes
open Btype
open Predef
open Types

let bin_op_type t =
  let f2_type = newgenty (Tarrow (Nolabel, t, t, Cok)) in (* t -> t *)
  newgenty (Tarrow (Nolabel, t, f2_type, Cok)) (* t -> t -> t *)

(** Comparison operator type : 'a -> 'a -> bool *)
let cmp_op_type =
  let var_t = newgenty (Tvar (Some "a")) in
  let f2_type = newgenty (Tarrow (Nolabel, var_t, type_bool, Cok)) in
  newgenty (Tarrow (Nolabel, var_t, f2_type, Cok))

let bin_op_value t = {
  val_type = bin_op_type t ;
  val_kind = Val_reg ;
  val_loc = Location.none ;
  val_attributes = []
}

(** type int -> int -> int *)
let int_bin_op = bin_op_value type_int
(** type float -> float -> float *)
let float_bin_op = bin_op_value type_float
(** type bool -> bool -> bool *)
let bool_bin_op = bin_op_value type_bool

(** type 'a -> 'a -> bool *)
let cmp_bin_op = {
  val_type = cmp_op_type ;
  val_kind = Val_reg ;
  val_loc = Location.none ;
  val_attributes = []
}

(** type float -> float *)
let float_float_function_type = {
  val_type = newgenty (Tarrow (Nolabel, type_float, type_float, Cok)) ;
  val_kind = Val_reg ;
  val_loc = Location.none ;
  val_attributes = []
}

(** float -> float functions in Pervasives *)
let float_float_function_list = ["sqrt" ; "exp" ; "log" ; "log10" ; "expm1" ; "log1p" ;
  "cos" ; "sin" ; "tan" ; "acos" ; "asin" ; "atan" ; "cosh" ; "sinh" ; "tanh" ; "ceil" ; "floor"]

(** type of raise (exn -> 'a) *)
let raise_value =
  let raise_type =
    let ret_type = newgenty (Tvar (Some "a")) in
    let desc = Types.Tarrow (Nolabel, type_exn, ret_type, Cok) in
    newgenty desc in
  {
    val_type = raise_type ;
    val_kind = Val_reg ;
    val_loc = Location.none ;
    val_attributes = []
  }

(** Signature of the module Pervasives *)
let pervasives_sign =
  Sig_value (Ident.create "raise", raise_value) :: List.concat [
    List.map (fun id -> Sig_value (Ident.create id, int_bin_op)) ["+" ; "-" ; "*" ; "/"] ;
    List.map (fun id -> Sig_value (Ident.create id, float_bin_op)) ["+." ; "-." ; "*." ; "/."] ;
    List.map (fun id -> Sig_value (Ident.create id, bool_bin_op)) ["&&" ; "||"] ;
    List.map (fun id -> Sig_value (Ident.create id, cmp_bin_op)) ["=" ; "<" ; ">" ; "<=" ; "=<" ; "<>"] ;
    List.map (fun id -> Sig_value (Ident.create id, float_float_function_type)) float_float_function_list
  ]

(** Add the module Pervasives to the environment *)
let add_pervasives env =
  let mty = Mty_signature pervasives_sign in
  Env.add_module (Ident.create "Pervasives") mty env
