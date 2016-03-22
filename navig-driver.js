
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
//                     state: JsSyntax.state, env: JsSyntax.env,
//                     source_loc: loc }
//   Event items are created on every call to the "log_event" function.
//   Such calls are located in the *.log.js files.
//   Fields "state" and "env" are snapshots of the state at the time of the event.
//   Field "ctx" describes the state of the variables from the interpreter,
//   and this description is constructed by the instrumented code in "*.log.js".
//   The "source_loc" fields are filled in by function "assignSourceLocInTrace".

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
var source = "";
var interpreter = null;


// --------------- Initialization ----------------

// WARNING: do not move this initialization further down in the file
// source code displayed initially
$("#source_code").val(source_file);


// --------------- Methods ----------------

function stepTo(step) {
 tracer_pos = step;
 updateSelection();
}

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
 // TODO: revive the try-catch
 // try {
 readSourceParseAndRun();
 //  $("#action_output").html("Run successful!");
 // } catch(e){
 //   $("#action_output").html("Error during the run.");
 //   throw(e);   
 // };
  var timeoutID = window.setTimeout(function() { $("#run_output").html(""); }, 1000);
});

$("#button_reset").click(function() {
 stepTo(0);
});

$("#button_prev").click(function() {
 stepTo(Math.max(0, tracer_pos-1));
});

$("#button_next").click(function() {
 stepTo(Math.min(tracer_length-1, tracer_pos+1));
});


// Assumes tracer_files to be an array of objects with two field:
// - file, containing the name of the file,
// - contents, a string containing its source code

function tracer_valid_pos(i) {
 return (i >= 0 && i < tracer_length);
}

// dir is -1 or +1
function shared_step(dir) {
 var i = tracer_pos;
 i += dir;
 if (! tracer_valid_pos(i))
   return; // not found, we don’t update the tracer position.
 tracer_pos = i;
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
     tracer_pos = i - dir; // just before out of range
     return; // not found
   }
   if (i !== tracer_pos && depth === target) {
     tracer_pos = i;
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

function restart() { tracer_pos = 0; }
function step() { shared_step(+1); }
function backstep() { shared_step(-1); }
function next() { shared_next(+1, 0); }
function previous() { shared_next(-1, 0); }
function finish() { shared_next(+1, -1); }


// --------------- Methods ----------------

// load files in CodeMirror view
var docs = {};
for (var i = 0; i < tracer_files.length; i++) {
  var file = tracer_files[i].file;
  var txt = tracer_files[i].contents;
  docs[file] = CodeMirror.Doc(txt, 'js');
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

// TODO adapt to values from JsSyntax
function text_of_cst(c) {
 switch (c.tag) {
 case "cst_bool":
   return c.bool + "";
 case "cst_number":
   return c.number + "";
 default:
   return "unrecognized cst";
 }
}

// fresh name generated used for handlers of interactively-explorable values
var next_fresh_id = 0;
function fresh_id() {
 return "fresh_id_" + (next_fresh_id++);
}

// TODO deal with the heap here
function show_value(heap, v, target, depth) {
 var contents_init = $("#" + target).html();
 var s = "";
 switch (v.tag) {
 case "val_cst":
   s = text_of_cst(v.cst);
   break;
 case "val_loc":
   var contents_rest = "<span class='heap_link'><a onclick=\"handlers['" + target + "']()\">&lt;Object&gt;(" + v.loc + ")</a></span>";
   var contents_default = contents_init + contents_rest;
   function handler_close() {
     handlers[target] = handler_open;
     $("#" + target).html(contents_default);
     interpreter.focus();
   }
   function handler_open() {
     handlers[target] = handler_close;
     var obj = heap.get(v.loc).asReadOnlyArray(); // type object
     var count = 0;
     for (var x in obj) {
       if (obj[x] === undefined) continue; // LATER remove!
       count++;
       var targetsub = fresh_id();
       $("#" + target).append("<div style='margin-left:1em' id='" + targetsub + "'></div>");
       $("#" + targetsub).html(x + ": ");
       show_value(heap, obj[x], targetsub, depth-1);
     }
     if (count === 0)
       $("#" + target).append("<div style='margin-left:1em'>(empty object)</div>");
     interpreter.focus();
   };
   handlers[target] = handler_open;
   $("#" + target).html(contents_default);
   if (depth > 0)
     handler_open();
   return;
 case "val_abs":
   s = "&lt;Closure&gt;";
   break;
 default:
   s = "<pre style='margin:0; padding: 0; margin-left:1em'>" + JSON.stringify(v, null, 2) + "</pre>";
   break;
 }
 $("#" + target).append(s);
}

function updateContext(targetid, heap, env) {
 $(targetid).html("");
 if (env === undefined)
   return;
 if (heap === undefined)
   return;
 array_of_env(env).map(function(env){
   var target = fresh_id();
   $(targetid).append("<div id='" + target + "'></div>");
   $("#" + target).html(env.name + ": ");
   var depth = 1;
   show_value(heap, env.val, target, depth);
 });
}

// --------------- Debuggin view ----------------

function htmlDiv(s) {
  return "<div>" + s + "</div>";
}

function ctxToHtml(ctx) {
  var s = '';
  var a = ctx_to_array(ctx);
  for (var i = 0; i < a.length; i++) {
    var b = a[i];
    s += "<div style='white-space: nowrap;'><b>" + b.key + "</b>: " + JSON.stringify(b.val) + "</div>";
  }
  return s;
}


function itemToHtml(item) {
  var s = '';
  s += htmlDiv("type: " + item.type);
  s += ctxToHtml(item.ctx);
  return s;
}

// --------------- Selection view ----------------

function updateSelectionInCodeMirror(codeMirrorObj, loc) {
 if (loc === undefined) {
   return; 
 }
 var anchor = {line: loc.start.line-1 , ch: loc.start.column };
 var head = {line: loc.end.line-1, ch: loc.end.column };
 codeMirrorObj.setSelection(anchor, head);
}

function updateSelection() {
 var item = tracer_items[tracer_pos];
 source.setSelection({line: 0, ch:0}, {line: 0, ch:0}); // TODO: introduce a fct reset

 if (item !== undefined) {
   // console.log(item);
   $("#disp_infos").html("");
   $("#disp_infos").html(itemToHtml(item));
   if (item.source_loc === undefined) {
     console.log("Error: missing line in log event");

   } else {

     // source panel
     source_loc_selected = item.source_loc;
     updateSelectionInCodeMirror(source, source_loc_selected);
     // console.log(source_loc_selected);

     // source heap/env panel
     updateContext("#disp_env", item.heap, item.env);

     // interpreter ctx panel
     updateContext("#disp_ctx", item.heap, item.ctx);

     // interpreter code panel
     viewFile(item.loc.file);
     //console.log("pos: " + tracer_pos);

     var color = '#F3F781';
        // possible to use different colors depending on event type
        // var color = (item.type === 'enter') ? '#F3F781' : '#CCCCCC';
     $('.CodeMirror-selected').css({ background: color });
     $('.CodeMirror-focused .CodeMirror-selected').css({ background: color });
     updateSelectionInCodeMirror(interpreter, item.loc);
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
source.setSize(300, 150);

interpreter = CodeMirror.fromTextArea(document.getElementById('interpreter_code'), {
 mode: 'js',
 lineNumbers: true,
 lineWrapping: true,
 readOnly: true,
 extraKeys: {
   'R': function(cm) { restart(); updateSelection(); },
   'S': function(cm) { step(); updateSelection(); },
   'B': function(cm) { backstep(); updateSelection(); },
   'N': function(cm) { next(); updateSelection(); },
   'P': function(cm) { previous(); updateSelection(); },
   'F': function(cm) { finish(); updateSelection(); }
 },
});
interpreter.setSize(600,400);

/* ==> try in new version of codemirror*/
try {
 $(interpreter.getWrapperElement()).resizable({
   resize: function() {
     interpreter.setSize($(this).width(), $(this).height());
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
function assignSourceLocInTrace() {
 var last = parsedTree.loc;
   // { start: { line: 1, column: 0}, end: { line: 1, column: 1 } };
 for (var k = 0; k < tracer_items.length; k++) {
   var item = tracer_items[k];
   if (item.ctx !== undefined && item.ctx.bindings !== undefined) {
     var bindings = item.ctx.bindings;
     var binding = bindings[bindings.length-1];
     if (binding !== undefined && binding.key === "_term_") {
       var t = binding.val;
       if (t.loc != undefined) {
         last = t.loc;
       }
     }
   }
   item.source_loc = last;
 }
}

function run() {
 reset_datalog();
 JsInterpreter.run_javascript(JsInterpreter.runs, program);
 tracer_items = datalog;
 tracer_length = tracer_items.length;
 assignSourceLocInTrace();
 $("#navigation_total").html(tracer_length - 1);
 stepTo(0); // calls updateSelection(); 
}

function readSourceParseAndRun() {
   var code = source.getValue();
   //console.log(code);
   // TODO handle parsing error
   parsedTree = esprima.parse(code, {loc:true});
   // console.log(parsedTree);
   // TODO write the parser
   program = esprimaToAST(parsedTree);
   // console.log(program);
   run();
}


// --------------- Initialization, continuted ----------------


// interpreter file displayed initially
viewFile(tracer_files[0].file);

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