type 'a vec = { ary : 'a array }

val empty : unit -> 'a vec

val append : 'a vec -> 'a -> int

val get : 'a vec -> int -> 'a

val find : 'a vec -> int -> ('b, 'a) Unsafe.t

val set : 'a vec -> int -> 'a -> unit
