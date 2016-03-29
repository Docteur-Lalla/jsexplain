
// ----------- Types ----------------

// type loc
// e.g.  {file: "foo.js", start: {line: 12, column: 9}, end: {line: 13, column: 2} };
//   Locations are generated by the translation from the parser to the AST.
//   Lines are numbered starting from "1", and columns are numbered starting from "0".

// type event_type = 'enter' | 'return' | 'case' | 'let'
//   Events are generated by the *.log.js files, themselves produced by the generator.

// type ctx = {tag: "ctx_nil"} | {tag: "ctx_cons", next: ctx, bindings: bindings};
// type bindings = [{key: string, val: any}]
//   A context is a linked list of arrays, with the top of stack located at the
//   head of the list, and where each array stores a set of bindings, with the
//   more recent binding at the tail of the array.

// type event_item = { type: event_type, loc: loc, ctx: ctx,
//                     state: JsSyntax.state, 
//                     execution_ctx: JsSyntax.execution_ctx,
//                     source_loc: loc }
//   Event items are created on every call to the "log_event" function.
//   Such calls are located in the *.log.js files.
//   Field "ctx" describes the state of the variables from the interpreter,
//   and this description is constructed by the instrumented code in "*.log.js".
//   Fields "state" and "execution_ctx" and "source_loc" fields are filled in 
//   by the function "assignExtraInfosInTrace".

// type trace = [event_item]
//   In this file, "datalog" and "tracer_items" have type trace.




// --------------- Representation for predicate evaluation ----------------

function env_to_jsobject(env) {
      // TODO implement
   throw "unimplemented env_to_jsobject"; 
};

function ctx_to_jsobject(env) {
      // TODO implement
   throw "unimplemented ctx_to_jsobject"; 
};


// --------------- Handlers ----------------

// callback functions to open and close objects displayed in the environment
// view
var handlers = [];

var parsedTree;


// --------------- Variables ----------------

// file currently displayed
var curfile = '';

// object of type loc describing the text currenctly selected
var source_loc_selected = undefined;

// current trace being displayed
  // TODO: do we need tracer_iterms in addition to datalog? 
var tracer_items = [];
var tracer_length = 0;
var tracer_pos = 0;

// Core Mirror objects
var source = null;
var interpreter = null;

// Initial source code

var source_files = [
  'var x = 2;\nx',
  ' var t = {}; for (var i = 0; i < 3; i++) { t[i] = function() { return i; } }; t[0](); ',
  '{}',
  '{} + {}',
  'var x = { a : 1, b : 2 }; ',
  'x = 1;\nx = 2;\nx = 3',
  'var x = { a : 1 };\n x.b = 2;\nx',
  'var x = { a : { c: 1 } };\n x.a.b = 2;\nx',
  '(function (x) {return 1;})()',
  '(function (x) {\nreturn 1;\n})({a:{b:2}})',
];

source_files.reduce((select, file_content) => {
  let option = document.createElement('option');
  option.textContent = file_content;
  option.value = file_content;
  select.append(option);
  return select;
}, $('#select_source_code'));

function setSourceCode(text) {
  $("#source_code").val(text);
  if (source !== null) {
    source.setValue(text);
  }
}

$('#select_source_code').change(e => { setSourceCode(e.target.value)});
$('#select_file').change(e => {
  let fr = new FileReader();
  fr.onload = function (e) { setSourceCode(e.target.result) };
  fr.readAsText(e.target.files[0]);
});

// --------------- Initialization ----------------

// WARNING: do not move this initialization further down in the file
// source code displayed initially

setSourceCode(source_files[source_files.length - 1]);


// --------------- Predicate search ----------------

// Take a predicate in form of a JavaScript code (string) and returns either true or an error message (string).
function goToPred(pred) {

 function check(i){
   var item = tracer_items[i];
   var state = item.state;
   // the goal here is to take the environment and make it available to the
   // user
   var obj = env_to_jsobject(state, item.env);
   // the goal here is to take the local variable of the interpreter and make
   // them available to the user
   var objX = {};
   if (item.ctx !== undefined){
     objX = ctx_to_jsobject(state, item.ctx);
   }
   // TODO bind loc
   objX.line = item.loc.start.line;
   objX.type = item.type;
   // TODO bind other fields of the state
   objX.heap = state.object_heap;
   obj.X = objX; // If we want to change the “X” identifier, just change this line.
   try {
     if (check_pred(pred, obj)){
       stepTo(i);
       return true;
     }
   } catch(e){
     error++;
   }

   return false;
 }

 var error = 0;

 if (tracer_items.length === 0)
   return false;

 for (var i = (tracer_pos + 1) % tracer_items.length, current = tracer_pos;
      i !== current;
      i++, i %= tracer_items.length)
   if (check(i))
     return true;

 if (check(tracer_pos))
   return true;

 if (error === tracer_items.length)
   return "There was an execution error at every execution of your condition: are you sure that this is a valid JavaScript code?";

 return "Not found";
}


// --------------- Trace navigation buttons ----------------


function button_reach_handler() {
 var pred = $("#text_condition").val();
 var res = goToPred(pred);
 if (res !== true){
   $("#action_output").html(res);
   var timeoutID =
         window.setTimeout(function() {
           $("#action_output").html(""); }, 3000);
 }
};

$('#text_condition').keypress(function(e){
  var keycode = (e.keyCode ? e.keyCode : e.which);
  if (keycode == '13') {
     button_reach_handler();
  }
});

$("#button_reach").click(button_reach_handler);


$("#navigation_step").change(function(e) {
 var n = + $("#navigation_step").val();
 n = Math.max(0, Math.min(tracer_length - 1, n));
 stepTo(n);
});

$("#button_run").click(function() {
  var message = readSourceParseAndRun();
  $("#action_output").html(message);
  var timeoutID = window.setTimeout(function() { $("#action_output").html(""); }, 1000);
});

$("#button_reset").click(function() { reset(); }); 
  // stepTo(0);
$("#button_backward").click(function() { backward(); }); 
  // stepTo(Math.max(0, tracer_pos-1));
$("#button_forward").click(function() { forward() }); 
  // stepTo(Math.min(tracer_length-1, tracer_pos+1));

$("#button_previous").click(function() { previous() }); 
$("#button_next").click(function() { next() }); 
$("#button_finish").click(function() { finish() }); 

$("#button_cursor").click(function() { cursor() }); 



// --------------- Trace navigation methods ----------------


// Assumes tracer_files to be an array of objects with two field:
// - file, containing the name of the file,
// - contents, a string containing its source code

function tracer_valid_pos(i) {
 return (i >= 0 && i < tracer_length);
}

function stepTo(i) {
 if (! tracer_valid_pos(i))
   return; 
 tracer_pos = i;
 updateSelection();
}


// dir is -1 or +1
function shared_step(dir) {
 var i = tracer_pos;
 i += dir;
 if (! tracer_valid_pos(i))
   return; // not found, we don’t update the tracer position.
 stepTo(i);
}

// dir is -1 or +1,
// target (= target depth) is 0 for (next/prev) or -1 (finish)
function shared_next(dir, target) {
 var i = tracer_pos;
 var depth = 0;
 var ty = tracer_items[i].type;
 // TODO check if this works
 if (dir === +1 && ty === 'return') {
   depth = 1;
 } else if (dir === -1 && ty === 'enter') {
   depth = -1;
 }
 while (true) {
   if (! tracer_valid_pos(i)) {
     stepTo(i - dir); // just before out of range
     return; // not found
   }
   if (i !== tracer_pos && depth === target) {
     stepTo(i);
     return;
   }
   var ty = tracer_items[i].type;
   if (ty === 'enter') {
     depth++;
   } else if (ty === 'return') {
     depth--;
   }
   i += dir;
 }
}


function reset() { tracer_pos = 0; updateSelection(); }
function forward() { shared_step(+1); }
function backward() { shared_step(-1); }

function previous() { shared_next(-1, 0); }
function next() { shared_next(+1, 0); }
function finish() { shared_next(+1, -1); }

function cursor() {
  // jump to the last event that contains the source location
  var pos = source.getCursor();
  var line = pos.line + 1; // adding 1 because Codemirror counts from 0
  var column = pos.ch;
  // for (var i = 0; i < tracer_length; i++) {
  for (var i = tracer_length-1; i >= 0; i--) {
    var loc = tracer_items[i].source_loc;
    if (loc === undefined) continue;
    if (loc.start.line <= line && 
        loc.start.column <= column &&
        loc.end.line >= line &&
        loc.end.column >= column) {
      stepTo(i);
      return;
    }
  }
  $("#action_output").html("Event covering cursor not found");
  var timeoutID = window.setTimeout(function() { $("#action_output").html(""); }, 1000);
};



// --------------- File Display ----------------

function get_file_extension(filename) {
  var re = /(?:\.([^.]+))?$/;
  return re.exec(filename)[1];
}

// load files in CodeMirror view
var docs = {};
for (var i = 0; i < tracer_files.length; i++) {
  var file = tracer_files[i].file;
  var ext = get_file_extension(file);
  var txt = tracer_files[i].contents;
  docs[file] = CodeMirror.Doc(txt, ext);
}

function viewFile(file) {
 if (curfile !== file) {
   curfile = file;
   if (docs[curfile] == undefined) {
     console.log("Cannot view file " + curfile);
     return;
   }
   interpreter.swapDoc(docs[curfile]);
   interpreter.focus();
   updateFileList();
   updateSelection();
 }
}

function updateFileList() {
 var s = '';
 for (var i = 0; i < tracer_files.length; i++) {
   var file = tracer_files[i].file;
   s += "<span class=\"file_item" + ((curfile == file) ? '_current' : '') + "\" onclick=\"viewFile('" + file + "')\">" + file + "</span> ";
 }
 $('#file_list').html(s);
}



// --------------- Tools for Views ----------------

// fresh name generated used for handlers of interactively-explorable values
var next_fresh_id = 0;
function fresh_id() {
 return "fresh_id_" + (next_fresh_id++);
}

function encoded_list_to_array(list) {
  var r = [];
  while (list.tag == "::") {
    r.push(list.head);
    list = list.tail;
  }
  return r;
}

  /* for reversed lists
  var i = LibList.length(list) - 1;
  while (i >= 0) {
    if (list.tag != "::") throw "encoded_list_to_array: bug";
    r[i] = list.head;
    list = list.tail;
    i--;
  }
  */

function html_escape(stringToEncode) {
   var entityMap = {
      "&": "&amp;", 
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;' };
   return String(stringToEncode).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s]; });
}

function string_of_any(v) {
  return "<pre style='margin:0; padding: 0; margin-left:1em'>" + JSON.stringify(v, null, 2) + "</pre>";
}

// --------------- Views for JS state/context ----------------

function array_of_heap(heap) {
  var items_list = Heap.to_list(LibString.string_comparable, heap);
  return encoded_list_to_array(items_list);
} 

function string_of_prealloc(prealloc) {
    return (prealloc.tag).slice("Coq_prealloc_".length);
  //TODO:
  // Coq_prealloc_mathop  [@f mathop] of mathop
  // Coq_prealloc_native_error  [@f error] of native_error
  // Coq_prealloc_native_error_proto  [@f error] of native_error
}

function string_of_loc(loc) {
  switch (loc.tag) {
  case "Coq_object_loc_normal":
    return loc.address;
  case "Coq_object_loc_prealloc":
    return string_of_prealloc(loc.prealloc);
  default:
    throw "unrecognized tag in string_of_loc";
  }
}

function string_of_prim(v) {
  switch (v.tag) {
  case "Coq_prim_undef":
    return "undefined";
  case "Coq_prim_null":
    return "null";
  case "Coq_prim_bool":
    return (v.value) ? "true" : "false";
  case "Coq_prim_number":
    return "" + v.value;
  case "Coq_prim_string":
    return "\"" + html_escape(v.value) + "\"";
  default:
    throw "unrecognized tag in string_of_prim";
  }
}

function string_of_option(string_of_elem, opt_elem) {
  switch (opt_elem.tag) {
  case "None":
    return "None";
  case "Some":
    return "Some (" + string_of_elem(opt_elem.value) + ")";
  default:
    throw "unrecognized tag in string_of_option";
  }
}

function string_of_mutability(mutability) {
  return (mutability.tag).slice("Coq_mutability_".length);
}


  /*
  type coq_object = { object_proto_ : value;
                    object_class_ : class_name;
                    object_extensible_ : bool;
                    object_prim_value_ : value option;
                    object_properties_ : object_properties_type;
                    object_get_ : builtin_get;
                    object_get_own_prop_ : builtin_get_own_prop;
                    object_get_prop_ : builtin_get_prop;
                    object_put_ : builtin_put;
                    object_can_put_ : builtin_can_put;
                    object_has_prop_ : builtin_has_prop;
                    object_delete_ : builtin_delete;
                    object_default_value_ : builtin_default_value;
                    object_define_own_prop_ : builtin_define_own_prop;
                    object_construct_ : construct option;
                    object_call_ : call option;
                    object_has_instance_ : builtin_has_instance option;
                    object_scope_ : lexical_env option;
                    object_formal_parameters_ : string list option;
                    object_code_ : funcbody option;
                    object_target_function_ : object_loc option;
                    object_bound_this_ : value option;
                    object_bound_args_ : value list option;
                    object_parameter_map_ : object_loc option }
                    */
   // TODO  for object_prim_value_, use string_of_option(show_elem, opt_elem)
/*
    type attributes =
    | Coq_attributes_data_of [@f value] of attributes_data
    | Coq_attributes_accessor_of [@f value] of attributes_accessor


    type attributes_data = { attributes_data_value : value;
                             attributes_data_writable : bool;
                             attributes_data_enumerable : bool;
                             attributes_data_configurable : bool }

    type attributes_accessor = { attributes_accessor_get : value;
                                 attributes_accessor_set : value;
                                 attributes_accessor_enumerable : bool;
                                 attributes_accessor_configurable : bool }
*/

function show_object(state, loc, target, depth) {
   var t = $("#" + target);
   if (depth < 0) {
     t.append("&lt;hidden&gt;");
     return;
   }
   var obj_opt = JsCommonAux.object_binds_pickable_option(state, loc);
   if (obj_opt.tag != "Some") throw "show_object: unbound object";
   var obj = obj_opt.value;
   var props = obj.object_properties_;
   var key_value_pair_array = array_of_heap(props);
   for (var i = 0; i < key_value_pair_array.length; i++) {
      var prop_name = key_value_pair_array[i][0];
      var attribute = key_value_pair_array[i][1];

      var targetsub = fresh_id();
      t.append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
      $("#" + targetsub).html("&ndash; " + html_escape(prop_name) + ": ");

      switch (attribute.tag) {
        case "Coq_attributes_data_of":
          var attr = attribute.value;
          var prop_value = attr.attributes_data_value;
          show_value(state, prop_value, targetsub, depth-1);

          break;
        case "Coq_attributes_accessor_of": 
          var attr = attribute.value;
          $("#" + targetsub).append(" &lt;accessor&gt; ");
          // TODO: complete

          break;
        default: 
          throw "invalid attribute.tag";
      }
   }

   // special display for empty objects
   if (key_value_pair_array.length === 0) {
     t.append("(empty object)");
   }
}

function show_value(state, v, target, depth) {
  var t = $("#" + target);
  switch (v.tag) {
  case "Coq_value_prim":
    var s = string_of_prim(v.value);
    t.append(s);
    return;
  case "Coq_value_object":
     var loc = v.value;
     var obj_target = fresh_id();
     t.append("<span class='heap_link'><a onclick=\"handlers['" + obj_target + "']()\" >&lt;Object&gt;(" + string_of_loc(loc) + ")</a><span id='" + obj_target + "'></span></span>"); 
     function handler_close() {
       handlers[obj_target] = handler_open;
       $("#" + obj_target).html("");
       interpreter.focus();
     }
     function handler_open() {
       handlers[obj_target] = handler_close;
       show_object(state, loc, obj_target, 1);
       interpreter.focus();
     };
     // initial opening of the object
     if (depth > 0) {
       handlers[obj_target] = handler_close;
       show_object(state, loc, obj_target, depth);
     } else {
       handler_close();
     }
     return;
  default:
    throw "unrecognized tag in show_value";
  }
}

function show_decl_env_record(state, env_record_decl, target) {
   // env_record_decl : (string, mutability * value) Heap.heap
   var t = $("#" + target);
   var items_array = array_of_heap(env_record_decl);
   for (var i = 0; i < items_array.length; i++) {
      var var_name = items_array[i][0];
      var mutability = items_array[i][1][0];
      var value = items_array[i][1][1];
      var value_target = fresh_id();
      t.append("<div id='" + value_target + "'>	&rarr; " + html_escape(var_name) + " (" + string_of_mutability(mutability) + "):</div>");
      show_value(state, value, value_target, 0);
   }
}

function show_lexical_env(state, lexical_env, target) {
   var t = $("#" + target);
   // var env_record_heap = state.state_env_record_heap;
   var env_loc_array = encoded_list_to_array(lexical_env);
   for (var i = 0; i < env_loc_array.length; i++) {
      var env_loc = env_loc_array[i];
      var env_record_opt = JsCommonAux.env_record_binds_pickable_option(state, env_loc);
      if (env_record_opt.tag != "Some") throw "show_object: unbound object";
      var env_record = env_record_opt.value;

      switch (env_record.tag) {
        case "Coq_env_record_decl":
          var env_record_decl = env_record.value;
          var items_target = fresh_id();
          t.append("<div><b>&bull; environment-record-declaration</b>: <div style='margin-left: 1em' id='" + items_target + "'></div></div>");
          show_decl_env_record(state, env_record_decl, items_target)
          break;
        case "Coq_env_record_object":   
          var object_loc = env_record.value;
          var obj_value = { tag: "Coq_value_object", value: object_loc };
          var provide_this = env_record.provide_this;
          var obj_target = fresh_id();
          t.append("<div id='" + obj_target + "'><b>&bull; environment-record-object</b> (" + ((provide_this) ? "" : "not ") + "providing 'this'): </div>");
          show_value(state, obj_value, obj_target, 0);
          // show_object(state, object_loc, obj_target, 1);
          break;
        default: 
          throw "invalid env_record.tag";
      }
   }
}


function show_execution_ctx(state, execution_ctx, target) {
  var t = $("#" + target);

  // strictness
  t.append("<div><b>strictness</b>: " + execution_ctx.execution_ctx_strict + " </div>");

  // this object
  var this_target = fresh_id();
  t.append("<div id='" + this_target + "'><b>this:</b> </div>");
  //TODO 
  show_value(state, execution_ctx.execution_ctx_this_binding, this_target, 0);

  // lexical env
  var lexical_env_target = fresh_id();
  t.append("<div><b>lexical-env:</b> <div style='margin-left: 1em' id='" + lexical_env_target + "'></div></div>");
  show_lexical_env(state, execution_ctx.execution_ctx_lexical_env, lexical_env_target);
  
  // variable env -- TODO, like above
  var variable_env_target = fresh_id();
  t.append("<div><b>variable-env:</b> <div style='margin-left: 1em' id='" + variable_env_target + "'></div></div>");
  show_lexical_env(state, execution_ctx.execution_ctx_variable_env, variable_env_target);
}




// --------------- Views for interpreter context ----------------

/*
function updateContext(targetid, state, env) {
 $(targetid).html("");
 if (env === undefined)
   return;
 if (state === undefined)
   return;
 array_of_env(env).map(function(env){
   var target = fresh_id();
   $(targetid).append("<div id='" + target + "'></div>");
   $("#" + target).html(env.name + ": ");
   var depth = 1;
   show_value(state, env.val, target, depth);
 });
}
*/

function has_tag_in_set(value, array_tags) {
  return (value.tag !== undefined &&
          array_tags.indexOf(value.tag) != -1);
}

function interp_val_is_base_value(val) {
  var t = typeof(val);
  return t == "string" || 
         t == "number" ||
         t == "boolean" ||
         t == "undefined" ||
         t == "null";
}

function interp_val_is_js_prim(v) {
  return has_tag_in_set(v, [ "Coq_prim_undef", "Coq_prim_null", "Coq_prim_bool", "Coq_prim_number", "Coq_prim_string" ]);
}

function interp_val_is_js_value(v) {
  return has_tag_in_set(v, [ "Coq_value_prim", "Coq_value_object" ]);
}

function interp_val_is_loc(v) {
  return has_tag_in_set(v, [ "Coq_object_loc_normal", "Coq_object_loc_prealloc" ]);
}

function interp_val_is_list(v) {
  return has_tag_in_set(v, [ "::", "[]" ]);
}
  
function interp_val_is_syntax(v) {
  return has_tag_in_set(v, [ "Coq_expr_this", "Coq_expr_identifier", "Coq_expr_literal", "Coq_expr_object", "Coq_expr_array", "Coq_expr_function", "Coq_expr_access", "Coq_expr_member", "Coq_expr_new", "Coq_expr_call", "Coq_expr_unary_op", "Coq_expr_binary_op", "Coq_expr_conditional", "Coq_expr_assign", "Coq_propbody_val", "Coq_propbody_get", "Coq_propbody_set", "Coq_funcbody_intro", "Coq_stat_expr", "Coq_stat_label", "Coq_stat_block", "Coq_stat_var_decl", "Coq_stat_if", "Coq_stat_do_while", "Coq_stat_while", "Coq_stat_with", "Coq_stat_throw", "Coq_stat_return", "Coq_stat_break", "Coq_stat_continue", "Coq_stat_try", "Coq_stat_for", "Coq_stat_for_var", "Coq_stat_for_in", "Coq_stat_for_in_var", "Coq_stat_debugger", "Coq_stat_switch", "Coq_switchbody_nodefault", "Coq_switchbody_withdefault", "Coq_switchclause_intro", "Coq_prog_intro", "Coq_element_stat", "Coq_element_func_decl" ]);
}

function interp_val_is_state(v) {
  // Assume "has a state_object_heap" field iff "is a state"
  return v.state_object_heap !== undefined;
}

function interp_val_is_execution_ctx(v) {
  // Assume "has a execution_ctx_lexical_env" field iff "is a state"
  return v.execution_ctx_lexical_env !== undefined;
}


function show_interp_val(state, v, target, depth) {
  if (depth == 0) {
    t.append("&lt; ... &gt;"); 
  }
  var t = $("#" + target);
  if (interp_val_is_base_value(v)) {
    t.append(html_escape("" + v));
  } else if (interp_val_is_js_value(v)) {
    show_value(state, v, target, 1);
  } else if (interp_val_is_loc(v)) {
    show_object(state, v, target, 1);
  } else if (interp_val_is_js_prim(v)) {
    t.append(string_of_prim(v));
  } else if (interp_val_is_state(v)) {
    t.append("&lt; state-object &gt;"); 
  } else if (interp_val_is_execution_ctx(v)) {
    t.append("&lt; execution-ctx-object &gt;"); 
  } else if (interp_val_is_syntax(v)) {
    t.append("&lt; syntax-object &gt;"); 
  } else if (interp_val_is_list(v)) {
      var items = encoded_list_to_array(v)
      t.append("List:");
      for (var i = 0; i < items.length; i++) {
        var vi = items[i];
        var targetsub = fresh_id();
        t.append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
        $("#" + targetsub).html("&bull; "); 
        show_interp_val(state, vi, targetsub, depth-1);
      }
  } else if (v.tag !== undefined) { // data constructor
      var constr = html_escape(v.tag); // TODO: rename constructor prefix
      var hasArgs = (function() {
                        for (var key in v) {
                          if (key !== "tag") {
                            return true;
                          }
                        }
                        return false;
                      })();
      t.append(constr + ((hasArgs) ? " with:" : ""));
      for (var key in v) {
        if (key !== "tag") {
          var targetsub = fresh_id();
          t.append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
          $("#" + targetsub).html(html_escape(key) + ": ");
          show_interp_val(state, v[key], targetsub, depth-1);
        }
      }
  } else { // record
      var items_target = fresh_id();
      t.append("Struct with:");
      for (var key in v) {
         var targetsub = fresh_id();
         t.append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
         $("#" + targetsub).html(html_escape(key) + ": ");
         show_interp_val(state, v[key], targetsub, depth-1);
      }
  }
  // t.append(string_of_any(v));
}

function show_interp_ctx(state, ctx, target) {
  var depth = 1000;
  var t = $("#" + target);
  var a = ctx_to_array(ctx);
  for (var i = 0; i < a.length; i++) {
    var key = a[i].key;
    var val = a[i].val;
    var targetsub = fresh_id();
    t.append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
    $("#" + targetsub).html(html_escape(key) + ": ");
    show_interp_val(state, val, targetsub, depth);
  }
}


// --------------- Debugging view ----------------

function htmlDiv(s) {
  return "<div>" + s + "</div>";
}

function ctxToHtml(ctx) {
  var s = '';
  var a = ctx_to_array(ctx);
  for (var i = 0; i < a.length; i++) {
    var key = a[i].key;
    var val = a[i].val;
    // Uncomment next line for debug:
    // s += "<div style='white-space: nowrap;'><b>" + b.key + "</b>: " + JSON.stringify(b.val) + "</div>";
    if (key == "#RETURN_VALUE#" && 
        val.value !== undefined &&
        val.value.out !== undefined &&
        val.value.out.res !== undefined) {
      var res = val.value.out.res;
      // Coq_result_some  [@f value] of 't 
      // Coq_specret_out  [@f value] of out
      // Coq_out_ter  [@f state, res] of state * res
      s += "<div style='white-space: nowrap;'><b>#RES#</b>: " + JSON.stringify(res) + "</div>";
      if (res.res_value !== undefined && 
          res.res_value.value !== undefined) {
        var value = res.res_value.value;
        s += "<div style='white-space: nowrap;'><b>#RESVALUE#: " + JSON.stringify(value) + "</b></div>";
      }
    } 
  }
  return s;
}

function itemToHtml(item) {
  var s = '';
  s += htmlDiv("token: " + item.token + JSON.stringify(item.locByExt));
  s += htmlDiv("type: " + item.type);
  s += ctxToHtml(item.ctx);
  s += htmlDiv("execution_ctx: " + item.type);
  // For debug, use:
  //    s += JSON.stringify(item.execution_ctx);

  // s += htmlDiv("state: " + item.type);
  // s += JSON.stringify(item.state);
  return s;
}

// --------------- Selection view ----------------

function updateSelectionInCodeMirror(codeMirrorObj, loc) {
  if (loc === undefined) {
     return; 
  }
  // Substracting 1 because Esprima counts from 1, and Codemirror from 0
  var anchor = {line: loc.start.line-1 , ch: loc.start.column };
  var head = {line: loc.end.line-1, ch: loc.end.column };
  codeMirrorObj.setSelection(anchor, head);
}

function updateSelectionInCodeMirrorAccordingToExt(codeMirrorObj, locByExt) {
  if (locByExt === undefined) {
   return; 
  }
  var ext = get_file_extension(curfile);
  var loc = locByExt[ext];
  if (loc === undefined) {
    console.log("Error: missing loc for " + curfile + " in:");
    console.log(locByExt);
    return;
  }
  updateSelectionInCodeMirror(codeMirrorObj, loc);
}

function clearFeedback() {
   $("#disp_infos").html("");
   $("#disp_env").html("");
   $("#disp_ctx").html("");
}

function updateSelection() {
  clearFeedback();
  var item = tracer_items[tracer_pos];
  source.setSelection({line: 0, ch:0}, {line: 0, ch:0}); // TODO: introduce a fct reset

 if (item !== undefined) {
   // console.log(item);
   $("#disp_infos").html(itemToHtml(item));
   if (item.source_loc === undefined) {
     console.log("Error: missing line in log event");

   } else {

     // source panel
     source_loc_selected = item.source_loc;
     updateSelectionInCodeMirror(source, source_loc_selected);
     // console.log(source_loc_selected);

     // source heap/env panel
     if (item.state === undefined || item.execution_ctx === undefined) {
       $("#disp_env").html("<undefined state or context>");
     } else {
       show_execution_ctx(item.state, item.execution_ctx, "disp_env");
     }

     // interpreter ctx panel
     show_interp_ctx(item.state, item.ctx, "disp_ctx");

     // interpreter code panel
     // TEMPORARILY DISABLED BECAUSE ONLY SINGLE FILE TO TRACE
     // viewFile(item.loc.file);

     var color = '#F3F781';
        // possible to use different colors depending on event type
        // var color = (item.type === 'enter') ? '#F3F781' : '#CCCCCC';
     $('.CodeMirror-selected').css({ background: color });
     $('.CodeMirror-focused .CodeMirror-selected').css({ background: color });
     updateSelectionInCodeMirrorAccordingToExt(interpreter, item.locByExt);
   }

   // navig panel
   $("#navigation_step").val(tracer_pos);
 }
 updateFileList();
 interpreter.focus();
}

// --------------- CodeMirror ----------------

source = CodeMirror.fromTextArea(document.getElementById('source_code'), {
 mode: 'js',
 lineNumbers: true,
 lineWrapping: true
});
source.setSize(500, 150);

interpreter = CodeMirror.fromTextArea(document.getElementById('interpreter_code'), {
 mode: 'js',
 lineNumbers: true,
 lineWrapping: true,
 readOnly: true,
 extraKeys: {
   'R': function(cm) { reset();  },
   'F': function(cm) { forward();},
   '6': function(cm) { forward();},
   'B': function(cm) { backward(); },
   '4': function(cm) { backward(); },
   'P': function(cm) { previous(); },
   '8': function(cm) { previous(); },
   'N': function(cm) { next(); },
   '2': function(cm) { next(); },
   'H': function(cm) { finish(); },
   '3': function(cm) { finish(); }
 },
});
interpreter.setSize(800,400);


/* ==> try in new version of codemirror*/
try {
 $(interpreter.getWrapperElement()).resizable({
   resize: function() {
     interpreter.setSize($(this).width(), $(this).height());
   }
 });
} catch(e) { }
// TODO: factorize code below with the above
try {
 $(source.getWrapperElement()).resizable({
   resize: function() {
     source.setSize($(this).width(), $(this).height());
   }
 });
} catch(e) { }
try {
 $("disp_env_pane").resizable({
   resize: function() {
     disp_env_pane.setSize($(this).width(), $(this).height());
   }
 });
} catch(e) { }





interpreter.on('dblclick', function() {
 var line = interpreter.getCursor().line;
 var txt = interpreter.getLine(line);
 var prefix = "#sec-";
 var pos_start = txt.indexOf(prefix);
 if (pos_start === -1)
   return;
 var pos_end = txt.indexOf("*", pos_start);
 if (pos_end === -1)
   return;
 var sec = txt.substring(pos_start, pos_end);
 var url = "http://www.ecma-international.org/ecma-262/5.1/" + sec;
 window.open(url, '_blank');
});

interpreter.focus();

// --------------- Main run method ----------------

// Functions run_prog, run_expr and run_stat have a last argument
// called "_term_"; we try to find items in the trace that correspond
// to the binding of this argument in the context, so as to extract
// the corresponding location from the piece of AST that corresponds.
// These locations are used for source highlighting.
function assignExtraInfosInTrace() {
 var last_loc = parsedTree.loc;
 var last_state = undefined;
 var last_execution_ctx = undefined;
   // { start: { line: 1, column: 0}, end: { line: 1, column: 1 } };
 for (var k = 0; k < tracer_items.length; k++) {
   var item = tracer_items[k];
   if (item.ctx !== undefined && item.ctx.bindings !== undefined) {
     var bindings = item.ctx.bindings;
     for (var i = 0; i < bindings.length; i++) {
       var binding = bindings[i];
       if (binding.val === undefined) {
         continue; // might happen on run with errors
       }
       if (binding.key === "_term_") {
         var t = binding.val;
         if (t.loc != undefined) {
           last_loc = t.loc;
         }
       } else if (interp_val_is_state(binding.val)) {
         // assuming: 'is an state object' iff 'has a state_object_heap field'
         last_state = binding.val;
       } else if (interp_val_is_execution_ctx(binding.val)) {
         // assuming: 'is an execution_ctx' iff 'has a execution_ctx_lexical_env field'
         last_execution_ctx = binding.val;
       }
     }
   }
   item.source_loc = last_loc;
   item.state = last_state;
   item.execution_ctx = last_execution_ctx;
 }
}



function runDebug() {
  reset_datalog();
  JsInterpreter.run_javascript(program);
}

function run() {
 reset_datalog();
 var success = true;
 try {
    JsInterpreter.run_javascript(program);
 } catch (e) {
   success = false;
   // alert("Error during the run");
   console.log(e);
   console.log("execute runDebug() to get the trace.");
   // throw e;
   // LATER: return "Error during the run.";
 }

 tracer_items = datalog;
 tracer_length = tracer_items.length;
 assignExtraInfosInTrace();
 $("#navigation_total").html(tracer_length - 1);
 stepTo(tracer_length-1);
 return (success) ? "Run successful!" : "Error during the run!";
}

function readSourceParseAndRun() {
   var message = "";
   var code = source.getValue();
   //console.log(code);
   // TODO handle parsing error
   try {
     parsedTree = esprima.parse(code, {loc:true});
   } catch (e) {
     return "Parse error";
   }
   // console.log(parsedTree);
 
   // TODO handle out of scope errors
   program = esprimaToAST(parsedTree);
   // console.log(program);
   return run();
}


// --------------- Initialization, continuted ----------------


// interpreter file displayed initially
// -- viewFile(tracer_files[0].file);
viewFile("JsInterpreter.ml");

//$timeout(function() {codeMirror.refresh();});



// -------------- Testing ----------------

// usage: testParse("var x = 3");
function testParse(s) {
  var p = esprima.parse(s,{loc: true, range: true});
  console.log(p);
  console.log(esprimaToAST(p, s));
}

// usage: testLineof("Datatypes.js", 9);
function testLineof(filename, token) {
  console.log(lineof(filename, token));
}

// for easy debugging, launch at startup:
readSourceParseAndRun();
stepTo(1700);


function showCurrent() {
  console.log(tracer_items[tracer_pos]);
};


function findToken(token) {
  for (var i = 0; i < tracer_items.length; i++) {
    if (tracer_items[i].token == token) {
      return i;
    }
  }
  return -1;
};
