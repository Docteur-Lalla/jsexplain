open Ast_mapper
open Ast_helper
open Asttypes
open Parsetree
open Longident

let generate_mapper argv =
  { default_mapper with
    expr = fun mapper expr ->
      match expr with
      | { pexp_desc = Pexp_extension ({ txt = "result" ; loc }, pstr)} ->
        begin
          match pstr with
          | PStr [{ pstr_desc = Pstr_eval ({ pexp_loc = loc ; pexp_desc =
            Pexp_let (rf, [{ pvb_pat = { ppat_desc = Ppat_var _} as p ; pvb_expr = e}], cont)}, _)}] ->
              Exp.apply
                ~loc
                (Exp.ident (Location.mkloc (Longident.Ldot (Longident.Lident "Unsafe", "bind")) Location.none))
                [(Nolabel, mapper.expr mapper e) ; (Nolabel, Exp.fun_ Nolabel None p (mapper.expr mapper cont))]
          | _ -> raise (Location.Error (Location.error ~loc "error with let%result"))
        end
      | { pexp_desc = Pexp_extension ({ txt = "some" ; loc }, pstr)} ->
        begin
          match pstr with
          | PStr [{ pstr_desc = Pstr_eval ({ pexp_loc = loc ; pexp_desc =
            Pexp_let (rf, [{ pvb_pat = { ppat_desc = Ppat_var _} as p ; pvb_expr = e}], cont)}, _)}] ->
              Exp.apply
                ~loc
                (Exp.ident (Location.mkloc (Longident.Ldot (Longident.Lident "Option", "bind")) Location.none))
                [(Nolabel, mapper.expr mapper e) ; (Nolabel, Exp.fun_ Nolabel None p (mapper.expr mapper cont))]
          | _ -> raise (Location.Error (Location.error ~loc "error with let%some"))
        end
      | x -> default_mapper.expr mapper x }
 
 let () = register "monads" generate_mapper
