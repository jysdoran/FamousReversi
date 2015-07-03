'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Transitionable = require('famous/transitions/Transitionable');
//var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');
//var PointLight = require('famous/webgl-renderables/lights/PointLight');
//var Material = require('famous/webgl-materials/Material');
//var Camera = require('famous/components/Camera');

// Boilerplate code to make your life easier
FamousEngine.init();

// Initialize with a scene; then, add a 'node' to the scene root
var scene = FamousEngine.createScene();
var boardNode = scene.addChild();

//Global 'tweak' variables
var period = 4000;
var size = 30;
var buffer = 4;
var boardPosition = 200;
var boardSize = 8;


var currentPlayer = 'black';
var board = [[]];
generateBoard(boardSize);

function Counter(x, y, state) {
	this.node = scene.addChild();
	this.id = this.node.addComponent(this);
	this.rotationpos = new Transitionable(0);
	this.lastRotation = 0;
	this.currentRotation = 0;
	this.state = state;
	this.image = new DOMElement(this.node, { tagName: 'img' });
	this.toggle();
	this.toggle();

	this.node.setSizeMode('absolute', 'absolute', 'absolute')
		.setAbsoluteSize(size, size, size)
		.setPosition(x, y)
		.setMountPoint(0.5, 0.5, 0.5)
		.setOrigin(0.5, 0.5, 0.5);

	this.node.requestUpdate(this.id);
};

Counter.prototype.onUpdate = function onUpdate(time) {
	this.currentRotation = this.rotationpos.get();
	if (Math.floor(time) % period < 20) {
    	this.rotationpos.set(0);
    	this.rotationpos.set(6.28, { duration: period, curve: 'linear' });
	} else if (this.lastRotation % 3.14 < 1.57 && this.currentRotation % 3.14 > 1.57) {
		this.toggle();
	}
	
	this.lastRotation = this.currentRotation;
	this.node.setRotation(0, this.rotationpos.get(), 0);
	this.node.requestUpdateOnNextTick(this.id);
};

/*Counter.prototype.flip = function () {

}*/

Counter.prototype.toggle = function () {
	if (this.state == 'black') {
    	this.image.setAttribute('src', './images/famous_logo_i.png');
    	this.state = 'white';
	} else {
    	this.image.setAttribute('src', './images/famous_logo.png');
    	this.state = 'black';
	}
};

function Tile(i,j) {
	this.node = scene.addChild();
	this.domElement = new DOMElement(this.node);
	this.domElement.setAttribute('style','background-color:#CCCCCC; opacity: 0.1;');
	this.x = boardPosition + (size + 2 * buffer) * i;
	this.y = boardPosition + (size + 2 * buffer) * j;
	this.i = i;
	this.j = j;

	this.node.setSizeMode('absolute', 'absolute', 'absolute')
		.setAbsoluteSize(size + buffer, size + buffer, size + buffer)
		.setPosition(this.x, this.y)
		.setMountPoint(0.5, 0.5, 0.5)
		.setOrigin(0.5, 0.5, 0.5)

	this.node.i = i;
	this.node.j = j;

	this.node.addUIEvent('click');
	this.domElement.on('click', placeCounter);
}

function placeCounter (e) {
	var i = e.node.i;
	var j = e.node.j
	board[i][j] = new Counter(board[i][j].x, board[i][j].y, currentPlayer);
};


function generateBoard(dim) {
	board = [[]];
	for (var i = 0; i < dim; i++) {
    	board[i] = [];
	    for (var j = 0; j < dim; j++) {
    		board[i][j] = new Tile(i, j);
    	}
	}
}


/*
board[3][3] = new Counter(board[3][3].x, board[3][3].y, 'black');
board[3][4] = new Counter(board[3][4].x, board[3][4].y, 'white');
board[4][4] = new Counter(board[4][4].x, board[4][4].y, 'black');
board[4][3] = new Counter(board[4][3].x, board[4][3].y, 'white');
*/