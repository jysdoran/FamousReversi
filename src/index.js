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
var period = 1000;
var size = 40;
var buffer = 4;
var boardPosition = 200;
var boardSize = 8;
var easingcurve = 'outBounce'


var currentPlayer = 'black';
var board = [[]];

function Counter(x, y, state) {
	this.node = scene.addChild();
	this.id = this.node.addComponent(this);
	this.x = x;
	this.y = y;

	this.xrotationpos = new Transitionable(0);
	this.lastXRotation = 0;
	this.currentXRotation = 0;
	this.yrotationpos = new Transitionable(0);
	this.lastYRotation = 0;
	this.currentYRotation = 0;

	this.state = state;
	this.image = new DOMElement(this.node, { tagName: 'img' });
	this.toggle();
	this.toggle();

	this.node.setSizeMode('absolute', 'absolute', 'absolute')
		.setAbsoluteSize(size, size, size)
		.setPosition(this.x, this.y)
		.setMountPoint(0.5, 0.5, 0.5)
		.setOrigin(0.5, 0.5, 0.5);

	this.node.requestUpdate(this.id);

	console.log('Counter Created! ^^^^^^^^^^^^^');
};

Counter.prototype.onUpdate = function onUpdate(time) {
	this.currentXRotation = this.xrotationpos.get()
	this.currentYRotation = this.yrotationpos.get()

	if (Math.abs(this.currentXRotation) == 6.28) {
		this.xrotationpos.set(0);
		this.currentXRotation = 0;
		this.lastXRotation = 0;
	} else if (Math.abs(this.currentXRotation) == 3.14) {
		this.lastXRotation = this.currentXRotation;
	}
	if (Math.abs(this.currentYRotation) == 6.28) {
		this.yrotationpos.set(0);
		this.currentYRotation = 0;
		this.lastYRotation = 0;
	} else if (Math.abs(this.currentYRotation) == 3.14) {
		this.lastYRotation = this.currentYRotation;
	}

	//Horrible and dirty check for flipping over the counter
	if (Math.abs(this.lastXRotation) != 3.14 &&
			((this.lastXRotation % 3.14 < 1.57 && this.currentXRotation % 3.14 > 1.57) || 
			(this.lastXRotation % 3.14 > 1.57 && this.currentXRotation % 3.14 < 1.57) ||
			(this.lastXRotation % 3.14 > -1.57 && this.currentXRotation % 3.14 < -1.57) ||
			(this.lastXRotation % 3.14 < -1.57 && this.currentXRotation % 3.14 > -1.57))) {
		this.toggle();
	} else if (Math.abs(this.lastYRotation) != 3.14 && 
			((this.lastYRotation % 3.14 < 1.57 && this.currentYRotation % 3.14 > 1.57) ||
			(this.lastYRotation % 3.14 > 1.57 && this.currentYRotation % 3.14 < 1.57) ||
			(this.lastYRotation % 3.14 > -1.57 && this.currentYRotation % 3.14 < -1.57) ||
			(this.lastYRotation % 3.14 < -1.57 && this.currentYRotation % 3.14 > -1.57))) {
		this.toggle();
	}
	
	this.lastXRotation = this.currentXRotation;
	this.lastYRotation = this.currentYRotation;
	this.node.setRotation(this.yrotationpos.get(), this.xrotationpos.get(), 0);
	this.node.requestUpdateOnNextTick(this.id);
};

Counter.prototype.flip = function (axis) {
	var xflip = 1;
	var yflip = 1;

	switch (axis) {
		case 0: //Left
			xflip = 1;
			yflip = 0;
		break;
		case 1: //Right
			xflip = -1;
			yflip = 0;
		break;
		case 2: //Up
			xflip = 0;
			yflip = 1;
		break;
		case 3: //Down
			xflip = 0;
			yflip = -1;
		break;
		case 4: //UpLeft
			xflip = 1;
			yflip = 1;
		break;
		case 5: //DownRight
			xflip = -1;
			yflip = -1;
		break;
		case 6: //UpRight
			xflip = -1;
			yflip = 1;
		break;
		case 7: //DownLeft
			xflip = 1;
			yflip = -1;
		break;
	}



	if (Math.abs(this.currentYRotation) == 3.14) {
		xflip *= -1;
	}
	if (Math.abs(this.currentXRotation) == 3.14) {
		yflip *= -1;
	}


	this.xrotationpos.set(this.currentXRotation + (xflip * 3.14), { duration: period, curve: easingcurve });
	this.yrotationpos.set(this.currentYRotation + (yflip * 3.14), { duration: period, curve: easingcurve });

	this.lastXRotation = this.currentXRotation;
	this.lastYRotation = this.currentYRotation;


	console.log('Flip!');
}

Counter.prototype.toggle = function () {
	console.log("X: "+ this.lastXRotation +", "+ this.currentXRotation);
	console.log("Y: "+ this.lastYRotation +", "+ this.currentYRotation);
	
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
	this.state = 'tile';

	this.node.setSizeMode('absolute', 'absolute', 'absolute')
		.setAbsoluteSize(size + buffer, size + buffer, size + buffer)
		.setPosition(this.x, this.y, -size)
		.setMountPoint(0.5, 0.5, 0.5)
		.setOrigin(0.5, 0.5, 0.5)

	this.node.i = i;
	this.node.j = j;

	this.node.addUIEvent('click');
	this.domElement.on('click', placeCounter);
}

function placeCounter (e) {

	var i = e.node.i;
	var j = e.node.j;
	console.log('Placing counter '+ i +', '+ j +'! vvvvvvvvvvvv');

	board[i][j] = new Counter(board[i][j].x, board[i][j].y, currentPlayer);

	var check = [[]];
	var flip = []

	for (var a = 0; a < 8; a++) {
		check[a] = [];
		flip[a] = false;
	}

	for (var a = i - 1; a >= 0; a--) { //Left
		if (board[a][j].state != 'tile') {
			if (board[a][j].state != currentPlayer) {
				check[0].push(board[a][j]);
			} else {
				a = -1;
				flip[0] = true;
			}
		} else {
			a = -1;
		}
	}

	for (var a = i + 1; a < boardSize; a++) { //Right
		if (board[a][j].state != 'tile') {
			if (board[a][j].state != currentPlayer) {
				check[1].push(board[a][j]);
			} else {
				a = boardSize;
				flip[1] = true;
			}
		} else {
			a = boardSize;
		}
	}
	
	for (var a = j - 1; a >= 0; a--) { //Up
		if (board[i][a].state != 'tile') {
			if (board[i][a].state != currentPlayer) {
				check[2].push(board[i][a]);
			} else {
				a = -1;
				flip[2] = true;
			}
		} else {
			a = -1;
		}
	}

	for (var a = j + 1; a < boardSize; a++) { //Down
		if (board[i][a].state != 'tile') {
			if (board[i][a].state != currentPlayer) {
				check[3].push(board[i][a]);
			} else {
				a = boardSize;
				flip[3] = true;
			}
		} else {
			a = boardSize;
		}
	}

	for (var a = i - 1; a >= 0; a--) { //UpLeft
		if (j - (i - a) >= 0 && board[a][j - (i - a)].state != 'tile') {
			if (board[a][j - (i - a)].state != currentPlayer) {
				check[4].push(board[a][j - (i - a)]);
			} else {
				a = -1;
				flip[4] = true;
			}
		} else {
			a = -1;
		}
	}

	for (var a = i + 1; a < boardSize; a++) { //DownRight
		if (j - (i - a) < boardSize && board[a][j - (i - a)].state != 'tile') {
			if (board[a][j - (i - a)].state != currentPlayer) {
				check[5].push(board[a][j - (i - a)]);
			} else {
				a = boardSize;
				flip[5] = true;
			} 
		} else {
			a = boardSize;
		}
	}

	for (var a = j - 1; a >= 0; a--) { //UpRight
		if (i + (j - a) < boardSize && board[i + (j - a)][a].state != 'tile') {
			if (board[i + (j - a)][a].state != currentPlayer) {
				check[6].push(board[i + (j - a)][a]);
			} else {
				a = -1;
				flip[6] = true;
			}
		} else {
			a = -1;
		}
	}

	for (var a = j + 1; a < boardSize; a++) { //DownLeft
		if (i + (j - a) >= 0 && board[i + (j - a)][a].state != 'tile') {
			if (board[i + (j - a)][a].state != currentPlayer) {
				check[7].push(board[i + (j - a)][a]);
			} else {
				a = boardSize;
				flip[7] = true;
			}
		} else {
			a = boardSize;
		}
	}

	for (var a = 0; a < 8; a++) {
		if (flip[a] == true) {
			for (var g = 0; g < check[a].length; g++) {
				check[a][g].flip(a);
			}
		}
	}

	if (currentPlayer == 'black') {
    	currentPlayer = 'white';
    } else {
    	currentPlayer = 'black';
    }
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

function getSign(num) {
	return num/Math.abs(num);
}

//Actual code
generateBoard(boardSize);

board[3][3] = new Counter(board[3][3].x, board[3][3].y, 'black');
board[3][4] = new Counter(board[3][4].x, board[3][4].y, 'white');
board[4][4] = new Counter(board[4][4].x, board[4][4].y, 'black');
board[4][3] = new Counter(board[4][3].x, board[4][3].y, 'white');
console.log('Ready! -----------------------------------------------')