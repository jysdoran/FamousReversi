'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Transitionable = require('famous/transitions/Transitionable');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');
var PointLight = require('famous/webgl-renderables/lights/PointLight');
var Material = require('famous/webgl-materials/Material');
var Camera = require('famous/components/Camera');

// Boilerplate code to make your life easier
FamousEngine.init();

// Initialize with a scene; then, add a 'node' to the scene root
var logo = FamousEngine.createScene().addChild();

// Create an [image] DOM element providing the logo 'node' with the 'src' path
var image = new DOMElement(logo, { tagName: 'img' })
image.setAttribute('src', './images/famous_logo.png');
image.state = 0;

// Chainable API
logo
    // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
    .setSizeMode('absolute', 'absolute', 'absolute')
    .setAbsoluteSize(250, 250)
    // Center the 'node' to the parent (the screen, in this instance)
    .setAlign(0.5, 0.5)
    // Set the translational origin to the center of the 'node'
    .setMountPoint(0.5, 0.5)
    // Set the rotational origin to the center of the 'node'
    .setOrigin(0.5, 0.5);

// Add a spinner component to the logo 'node' that is called, every frame
var period = 4000;
var rotationpos = new Transitionable(0);
var currentRotation;
var lastRotation = 0;

var spinner = logo.addComponent({
    onUpdate: function(time) {
    	currentRotation = rotationpos.get();
    	console.log(currentRotation%3.14);
        if(Math.floor(time) % period < 20){
            rotationpos.set(0);
            rotationpos.set(6.28, {duration: period, curve: 'linear'});
        } else if (lastRotation % 3.14 < 1.57 && currentRotation % 3.14 > 1.57){
        	console.log('flip!');
        	if (image.state == 0){
            	image.setAttribute('src', './images/famous_logo_i.png');
            	image.state = 1;
        	} else {
        		image.setAttribute('src', './images/famous_logo.png');
        		image.state = 0;
        	}
        }
        lastRotation = currentRotation
        logo.setRotation(0,currentRotation, 0);
        logo.requestUpdateOnNextTick(spinner);
    }
});

// Let the magic begin...
logo.requestUpdate(spinner);
