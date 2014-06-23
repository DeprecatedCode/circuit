/**
 * Circuit JS
 *
 * @author Nate Ferrero
 * @license MIT
 */
var circuit = require('../index'); // replace with require('circuit')

/**
 * Do something multiple times
 */
var count = function (times, what) {
    for(var i=0; i<times; i++) { what(); }
};

/**
 * Render the current row of the pyramid
 */
var render = function (done, scope) {
    console.log(scope.fill + scope.top);
    done();
};

/**
 * Set the top brick of the pyramid
 */
var resetTop = function (done, scope) {
    done({top: scope.defaultTop});
};

/**
 * Start a circuit for the pyramid
 */
var pyramid = circuit(function (done, scope) {
    done({fill: ''});
})(resetTop)(render);

/**
 * Make the pyramid taller
 */
var up = circuit(function (done, scope) {
    done({fill: scope.fill + scope.brick});
})(render);

/**
 * Put a cap on the pyramid
 */
var cap = circuit(function (done, scope) {
    done({top: scope.cap});
})(render)(resetTop)(render);

/**
 * Make the pyramid shorter
 */
var down = circuit(function (done, scope) {
    done({fill: scope.fill.slice(0, -2)});
})(render);

/**
 * Setup the pyramid chain
 */
count(4, function () {
    pyramid(up);
});

pyramid(cap);

count(4, function () {
    pyramid(down);
});

/**
 * Execute the pyramid circuit
 */
pyramid({brick: '#-', defaultTop: '{>', cap: '[]=#=[]>'});

/**
 * Space
 */
console.log();

/**
 * Let's create another pyramid
 */
pyramid({brick: '<}', defaultTop: '@', cap: '<}@[==]'});
