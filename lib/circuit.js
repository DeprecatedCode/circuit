/**
 * Circuit JS
 *
 * @author Nate Ferrero
 * @license MIT
 */

/**
 * Extend an object
 */
var ext = function ext (scope, val) {
    if (val && typeof val === 'object') {
        Object.keys(val).forEach(function (key) {
            scope[key] = val[key];
        });
    }
    return scope;
};

/**
 * Usage:
 * circuit(function (done, scope) {...}) ... Create a circuit node
 * circuit(circuit) ........................ Feed a circuit into another circuit
 * circuit(scope) .......................... Initialize scope object on a circuit
 */
var circuit = module.exports = function circuit (arg) {
    if (arguments.length !== 1) {
        throw new Error('Usage: circuit(function (done, scope) {...}|circuit|scope)');
    }
    var root = ext({}, arg);
    var node = {
        nodes: typeof arg === 'function' ? [arg] : []
    };
    node.fn = function nodeFunction (next, circuitDone) {
        if (typeof next === 'function') {
            node.nodes.push(next);
        }
        else {
            var stack = node.nodes.slice();
            var scope = ext(ext({}, root), next);
            var done = function done (result) {
                ext(scope, result)
                var current = stack.shift();
                if (typeof current !== 'function') {
                    if (circuitDone) {
                        circuitDone(scope); // pass control back to the callback
                    }
                    return;
                }
                if (current.isCircuit) {
                    current(scope, done); // let the child circuit take over
                }
                else {
                    current(done, ext(scope, result)); // execute the next circuit node
                }
            };
            done();
        }
        return node.fn;
    };
    node.fn.isCircuit = true;
    return node.fn;
};
