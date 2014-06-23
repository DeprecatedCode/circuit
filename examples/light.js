/**
 * Circuit JS
 *
 * @author Nate Ferrero
 * @license MIT
 */
var circuit = require('../index'); // replace with require('circuit')

/**
 * Set up a circuit method on an object
 */
var lightSwitch = {
    state: 'off',
    toggle: circuit(function toggleLightSwitch (done) {
        lightSwitch.state = lightSwitch.state == 'off' ? 'on' : 'off';
        done({switch: lightSwitch});
    })
};

/**
 * Set up a lamp to respond to switch
 */
var lamp = {
    on: true,
    respond: circuit(function respondToSwitch (done, scope) {
        lamp.on = scope.switch.state === 'on';
        done({lamp: lamp});
    })
};

var wire = lightSwitch.toggle;
wire(lamp.respond);
wire(function printInformation (done, scope) {
    console.log(scope.x + ': The lamp light is ' + (scope.lamp.on ? 'on' : 'off'));
    done();
});

/**
 * Initiate toggles
 */
lightSwitch.toggle({x: 1});
lightSwitch.toggle({x: 2});
lightSwitch.toggle({x: 3});