/**
 * The module Vector enables the user to create and manipulate a dynamic-sized array (a vector).
 * Vectors are used as program state in MLExplain, it stores variable values.
 * Each value stored in the vector is accessible through its unique index.
 */
var Vector = (function() {
  /** Create an empty vector */
  var empty = function() {
    return { ary: [] };
  };

  /** Append a new value at the end of the vector and return its new index */
  var append = function(vec, v) {
    vec.ary = vec.ary.concat(v);
    return vec.ary.length - 1;
  };

  /** Get the value in the vector at the given index, can fail if idx < 0 or vec.length <= idx */
  var get = function(vec, idx) {
    return vec.ary[idx];
  }

  /** Look for the given index in the vector and get the associated value if any */
  var find = function(vec, idx) {
    if(vec.length <= idx)
      return { tag: "Error", error: "Index " + idx + "out of bounds" };

    var v = get(vec, idx);

    /* No value should be undefined */
    if(v == undefined)
      return { tag: "Error", error: "Value is undefined" };
    else
      return { tag: "Result", result: v };
  }

  /** Modify the value at given index. Used to update mutable fields or in preallocated-value definitions */
  var set = function(vec, idx, v) {
    vec.ary[idx] = v;
  }

  return {
    empty: empty,
    append: append,
    get: get,
    find: find,
    set: set};
})();
