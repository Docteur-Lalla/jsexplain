let append = array_append
let fold = array_fold
let get = array_get
let length = array_length
let make = array_make
let map = array_map
let set = array_set

let all_true ary =
  let f cur b = cur && b in
  array_fold f true ary

(* Create a new array zipping both input arrays using the function f :
 * forall i e, res.(i) = e -> e = f a1.(i) a2.(i) *)
let zipwith f a1 a2 =
  let len_a1 = length a1 in
  let len_a2 = length a2 in
  (* min_size is the size of the shortest array of a1 and a2 *)
  let min_size = min len_a1 len_a2 in
  let res = make min_size (f (get a1 0) (get a2 0)) in
  (* For each i from 0 to min_size
   * populate the resulting array with (f a1.(i) a2.(i)) *)
  let rec for_loop i =
    if (number_of_int i) < (number_of_int min_size) then
    begin
      let res_f = f (get a1 i) (get a2 i) in
      set res i res_f ;
      for_loop (i + 1)
    end
    else
      res in
  for_loop 1

(** val lift_option : 'a option array -> 'a array option *)
let sequence_option ary =
  (* val f : 'a array option -> 'a option -> 'a array option *)
  let f ary_opt opt =
    (* Some ary = ary_opt
     * Some v = opt *)
    Option.bind ary_opt (fun ary ->
    Option.bind opt (fun v ->
    Some (append ary (make 1 v)))) in
  (* If the array contains no None value, the resulting value is Some A,
   * with A being an array containing input-array inner values *)
  fold f (Some [| |]) ary

let sequence_unsafe ary =
  let f ary_nsf nsf =
    let%result ary = ary_nsf in
    let%result v = nsf in
    Unsafe.box (append ary (make 1 v)) in
  fold f (Unsafe.box [| |]) ary
