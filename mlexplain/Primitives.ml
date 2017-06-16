open Asttypes
open Btype
open Predef
open Types

let bin_op_type t =
  let f2_type = newgenty (Tarrow (Nolabel, t, t, Cok)) in (* t -> t *)
  newgenty (Tarrow (Nolabel, t, f2_type, Cok)) (* t -> t -> t *)

let bin_op_value t = {
  val_type = bin_op_type t ;
  val_kind = Val_reg ;
  val_loc = Location.none ;
  val_attributes = []
}

let int_bin_op = bin_op_value type_int
let float_bin_op = bin_op_value type_float
let bool_bin_op = bin_op_value type_bool

let add_bin_ops ops t env =
  let add_value env id = Env.add_value id t env in
  let ids = List.map Ident.create ops in
  List.fold_left add_value env ids

let add_int_bin_ops = add_bin_ops ["+" ; "-" ; "*" ; "/"] int_bin_op
let add_float_bin_ops = add_bin_ops ["+." ; "-." ; "*." ; "/."] float_bin_op
let add_bool_bin_ops = add_bin_ops ["&&" ; "||"] bool_bin_op

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

let pervasives_sign =
  Sig_value (Ident.create "raise", raise_value) ::
  List.map (fun id -> Sig_value (Ident.create id, int_bin_op)) ["+" ; "-" ; "*" ; "/"] @
  List.map (fun id -> Sig_value (Ident.create id, float_bin_op)) ["+." ; "-." ; "*." ; "/."] @
  List.map (fun id -> Sig_value (Ident.create id, bool_bin_op)) ["&&" ; "||"]

let add_pervasives env =
  let mty = Mty_signature pervasives_sign in
  Env.add_module (Ident.create "Pervasives") mty env
