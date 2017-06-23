all: mlexplain

GENERATOR_DIR := ../generator

OCAMLDEP := ocamldep -one-line
OCAMLPAR := OCAMLRUNPARAM="l=200M"

LINEOF_BIN := $(GENERATOR_DIR)/lineof.byte
LINEOF     := $(OCAMLPAR) $(LINEOF_BIN)

PPX_BIN    := $(GENERATOR_DIR)/monad_ppx.byte
PPX_FLAG   := -ppx $(PPX_BIN)

MLTOJS_BIN := $(GENERATOR_DIR)/main.byte
MLTOJS 	   := $(OCAMLPAR) $(MLTOJS_BIN) $(PPX_FLAG)
# -dsource is automatically considered by main.byte

ASSEMBLY_BIN := $(GENERATOR_DIR)/assembly.byte
ASSEMBLY     := $(ASSEMBLY_BIN)

DISPLAYGEN_BIN := $(GENERATOR_DIR)/displayed_sources.byte
DISPLAYGEN     := $(OCAMLPAR) $(DISPLAYGEN_BIN)

# Warn if buildtools are missing
$(MLTOJS_BIN) $(LINEOF_BIN) $(PPX_BIN) $(ASSEMBLY_BIN) $(DISPLAYGEN_BIN):
	$(error Missing generator tools, build from project root, or set paths.)

.depends: *.ml $(PPX_BIN)
	$(OCAMLDEP) -ppx $(PPX_BIN) -I . -all !TranslateSyntax.ml > $@

STDLIB_DIR := $(GENERATOR_DIR)/stdlib_ml
STDLIB_FLAG := -I $(STDLIB_DIR) -open Stdlib
REPLACE_STDLIB := -nopervasives -nostdlib $(STDLIB_FLAG)

ASSEMBLY_JS_FILES := \
	Option.unlog.js \
	Unsafe.unlog.js \
	MLList.unlog.js \
	MLArray.unlog.js \
	Set.unlog.js \
	Map.unlog.js \
	Identifier.unlog.js \
	MLSyntax.unlog.js \
	Vector.js \
	ExecutionContext.unlog.js \
	Value.unlog.js \
	MLInterpreter.log.js

ASSEMBLY_JS := \
	$(STDLIB_DIR)/stdlib.js \
	$(ASSEMBLY_JS_FILES)

DISPLAYED := \
	./MLInterpreter.ml

ALL_DISPLAYED := $(DISPLAYED:.ml=.unlog.js) $(DISPLAYED:.ml=.pseudo.js) $(DISPLAYED)
ALL_LINEOF := $(DISPLAYED:.ml=.token.js) $(DISPLAYED:.ml=.mlloc.js) $(DISPLAYED:.ml=.ptoken.js)

Vector.cmi: Unsafe.cmi

%.cmi: %.mli
	ocamlc $(REPLACE_STDLIB) $<

%.cmi: %.ml $(MLTOJS_BIN)
	$(MLTOJS) -mode cmi -I $(STDLIB_DIR) $<

%.log.js: %.ml %.cmi $(MLTOJS_BIN)
	$(MLTOJS) -mode log -I $(STDLIB_DIR) $<

%.unlog.js: %.ml %.cmi $(MLTOJS_BIN)
	$(MLTOJS) -mode unlog -I $(STDLIB_DIR) $<

%.token.js %.mlloc.js: %.ml %.cmi $(MLTOJS_BIN) $(PPX_BIN)
	$(MLTOJS) -mode token -I $(STDLIB_DIR) $<

%.pseudo.js: %.ml %.cmi $(MLTOJS_BIN)
	$(MLTOJS) -mode pseudo -I $(STDLIB_DIR) $<

%.ptoken.js: %.ml %.cmi $(MLTOJS_BIN)
	$(MLTOJS) -mode ptoken -I $(STDLIB_DIR) $<

assembly.js: Vector.cmi $(ASSEMBLY_JS) $(ASSEMBLY_BIN)
	$(ASSEMBLY) -o $@ $(ASSEMBLY_JS)

displayed_sources.js: $(ALL_DISPLAYED) $(DISPLAYGEN_BIN)
	$(DISPLAYGEN) -o $@ $(ALL_DISPLAYED)

lineof.js: $(ALL_LINEOF) $(LINEOF_BIN)
	$(LINEOF) -o $@ $(ALL_LINEOF)

Identifier.cmo: Identifier.ml
	ocamlfind ocamlc -o $@ -c $<

MLSyntax.cmo: MLSyntax.ml
	ocamlfind ocamlc -o $@ -c $<

Option.cmo: Option.ml
	ocamlfind ocamlc -o $@ -c $<

Primitives.cmo: Primitives.ml
	ocamlfind ocamlc -I +compiler-libs -package compiler-libs.common -o $@ -c $<

TranslateSyntax.cmo: TranslateSyntax.ml Primitives.cmo Option.cmo MLSyntax.cmo Identifier.cmo
	ocamlfind ocamlc -I +compiler-libs -package compiler-libs.common -package js_of_ocaml -package js_of_ocaml.ppx -o $@ -c $<

frontend.byte: Identifier.cmo MLSyntax.cmo Option.cmo Primitives.cmo TranslateSyntax.cmo
	ocamlfind ocamlc -I +compiler-libs -package compiler-libs.common -package js_of_ocaml -package js_of_ocaml.ppx -linkpkg -o $@ $^

frontend.js: frontend.byte
	js_of_ocaml --disable genprim +weak.js +toplevel.js $<

mlexplain: assembly.js lineof.js displayed_sources.js frontend.js

clean:
	rm *.cmo || true
	rm *.cmi || true
	rm `ls *.js | grep -v Vector.js` || true
	rm *.byte || true
	rm .depends
	rm -r _build
