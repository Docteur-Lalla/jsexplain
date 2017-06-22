type ('a, 'b) t =
| Error of string [@f error]
| Exception of 'a [@f except]
| Result of 'b [@f result]

type 'a value = ('a, 'a) t

(** Create an unsafe value from an option *)
let of_option = function
| None -> Error "Unknown error"
| Some v -> Result v

let eq feq1 feq2 a b = match a with
| Error e1 ->
  begin
    match b with
    | Error e2 -> e1 === e2
    | _ -> false
  end
| Exception e1 ->
  begin
    match b with
    | Exception e2 -> feq1 e1 e2
    | _ -> false
  end
| Result r1 ->
  begin
    match b with
    | Result r2 -> feq2 r1 r2
    | _ -> false
  end


(** Monadic >>= operator, apply f to a valid result or propagate the errors *)
let bind nsf f = match nsf with
| Error s -> Error s
| Exception x -> Exception x
| Result r -> f r

let error s = Error s
let except x = Exception x
let box v = Result v

(** Apply the given function if the unsafe value is a valid result or returns the default value *)
let do_with_default nsf dflt f = match nsf with
| Error _ -> dflt
| Exception _ -> dflt
| Result r -> f r
