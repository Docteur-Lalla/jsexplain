let debug = ref false

(****************************************************************)
(* MODES *)

type generate_mode = 
  | Mode_unlogged
  | Mode_line_token
  | Mode_logged

let current_mode = ref Mode_unlogged

let set_current_mode s =
  current_mode := match s with
    | "log" -> Mode_logged
    | "unlog" -> Mode_unlogged
    | "token" -> Mode_line_token
    | _ -> failwith "Invalid mode, chose log, unlog, or token"