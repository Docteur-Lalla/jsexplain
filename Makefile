# all: generator mlparser mljsref jsjsref mlexplain
all: generator mlexplain

# Init stages
init:
	opam switch 4.04.0
	eval `opam config env`
	opam pin -yn add jsjsref .
	opam pin -yn add JS_Parser "https://github.com/resource-reasoning/JS_Parser.git#v0.1.0"
	opam install -y jsjsref --deps-only
	opam install -y "js_of_ocaml=2.8.4"
	@echo
	@echo 'You now need to execute: eval `opam config env`'

# Build Stages
generator:
	$(MAKE) -C generator

#mlparser: generator
#	$(MAKE) -C jsref/mlparser

#jsjsref: generator mlparser
#	$(MAKE) -C jsref jsjsref

#mljsref: generator # (requires the ppx)
#	$(MAKE) -C jsref mljsref

mlexplain: generator
	$(MAKE) -C mlexplain

# Test Stages
test_init:
	git submodule update --init test/data/test262
	npm install

test: jsjsref
	node_modules/.bin/mocha

# Documentation
doc: doc/mlexplain

doc/jsref: generator
	$(MAKE) -C mlexplain doc
	mv mlexplain/doc_build doc/mlexplain

# Publication Stages
PUB_FILES=driver.html libraries jquery-ui-1.11.4.custom jquery_scroll \
	  mlexplain/displayed_sources.js tools.js node_modules/esprima/esprima.js \
	  esprima-to-ast.js mlexplain/lineof.js navig-driver.js \
	  mlexplain/assembly.js

dist: mlexplain $(PUB_FILES)
	mkdir -p $@
	rsync -Rrv $(PUB_FILES) $@

publish: dist
	# /./ syntax tells rsync where to start relative paths from
	rsync -azR --no-p --rsh=ssh -O $^/./ gf:/home/groups/ajacs/htdocs/jsexplain/

publish-github: dist
	tools/upload-github-pages.sh dist

# Clean stages
clean:
	$(MAKE) -C generator clean
	$(MAKE) -C jsref/mlparser clean
	$(MAKE) -C jsref clean
	$(MAKE) -C mlexplain clean
	rm -Rf doc/jsref || true
	rm -Rf dist || true

.PHONY: mlexplain generator generator-stdlib publish publish-github clean
