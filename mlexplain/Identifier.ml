type t =
| Lident of string [@f id]
| Ldot of t * string [@f path, id]
