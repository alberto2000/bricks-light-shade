// TARGET.JS
define(['functions', 'targetmonster', 'ball', 'physijs'], function(Functions, TargetMonster, Ball) {

	targetModule = {
		floorWidth: 10,
		floorDepth: 10,
		allIncrement: 100
	};

	targetModule.init = function(options) {

		log('Target World init');

		targetModule.all = options.all;

		$('#page').addClass('world-target');

		targetModule.createFloor();
		targetModule.createShelter();

		if (!targetModule.all) targetModule.setCamera();

		targetModule.initControls();

		targetModule.addTargetMonster({
			size: 1,
			position: {
				x: targetModule.all ? targetModule.allIncrement : 0, y: 1, z: 0
			},
			parent: targetModule
		}, 1);

		targetModule.initBallRain();

	}

	targetModule.setCamera = function() {
		THREEworld.camera.position.set(2, 7, 10);
	}

	targetModule.initControls = function() {

		$('#add-target-monster-button').click(function(event) {
			targetModule.addTargetMonster({
				size: 1,
				position: {
					x: targetModule.all ? targetModule.allIncrement : 0, y: 1, z: 0
				},
				parent: targetModule
			}, 1);
		});

		$('#add-ball-button').click(function(event) {

			var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			if (targetModule.all ? ballX += targetModule.allIncrement : ballX);

			var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

			var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			targetModule.addBall({
				size: 0.5,
				position: {
					x: ballX, y: ballY, z: ballZ
				},
				parent: targetModule
			}, 1);

		});
	}

	targetModule.createFloor = function() {

		var geometry = new THREE.BoxGeometry(targetModule.floorWidth, 0.25, targetModule.floorDepth);
		var texloader = new THREE.TextureLoader();
		var textureAsset = 'chess.jpg';

		texloader.load('elements/'+textureAsset, function(tex) {

			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.NearestFilter;

			var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: tex}), 0, 0.6);
			var floor = new Physijs.BoxMesh(geometry, material, 0);

			floor.userData.id = 'floor';

			floor.receiveShadow = false;

			floor.position.x = 0;
			floor.position.y = -0.25/2;
			floor.position.z = 0;

			if (targetModule.all) floor.position.x += targetModule.allIncrement;

			THREEworld.scene.add(floor);

			THREEworld.targetCenter = floor.position;

		});

	}

	targetModule.createShelter = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var shelter1 = new Physijs.BoxMesh(new THREE.CubeGeometry(2, 0.25, 1), material, 0);

		shelter1.userData.id = 'shelter1';

		shelter1.position.x = -3;
		shelter1.position.y = 3;
		shelter1.position.z = -3;

		if (targetModule.all) shelter1.position.x += targetModule.allIncrement;

		THREEworld.scene.add(shelter1);

		var shelter2 = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 0.25, 3), material, 0);

		shelter2.userData.id = 'shelter2';

		shelter2.position.x = 3;
		shelter2.position.y = 4;
		shelter2.position.z = 3;

		if (targetModule.all) shelter2.position.x += targetModule.allIncrement;

		THREEworld.scene.add(shelter2);

		var shelter3 = new Physijs.BoxMesh(new THREE.CubeGeometry(2, 0.25, 2), material, 0);

		shelter3.userData.id = 'shelter3';

		shelter3.position.x = 3;
		shelter3.position.y = 2;
		shelter3.position.z = -3;

		if (targetModule.all) shelter3.position.x += targetModule.allIncrement;

		THREEworld.scene.add(shelter3);

	}

	targetModule.addTargetMonster = function(options, number) {

		for (var i = 0; i < number; i++) {
			var newTargetMonster = new TargetMonster(options);
		}

	}

	targetModule.addBall = function(options, number) {

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	targetModule.monsterDied = function() {

		targetModule.addTargetMonster({
			size: 1,
			position: {
				x: targetModule.all ? targetModule.allIncrement : 0, y: 1, z: 0
			},
			parent: targetModule
		}, 1);

	}

	targetModule.ballDied = function() {

		var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
		ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

		if (targetModule.all ? ballX += targetModule.allIncrement : ballX);

		var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

		var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
		ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

		targetModule.addBall({
			size: 0.5,
			position: {
				x: ballX, y: ballY, z: ballZ
			},
			parent: targetModule
		}, 1);

	}

	targetModule.initBallRain = function() {

		var i = 0;

		targetModule.ballRainInterval = setInterval(function() {

			var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			if (targetModule.all ? ballX += targetModule.allIncrement : ballX);

			var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

			var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			targetModule.addBall({
				size: 0.5,
				position: {
					x: ballX, y: ballY, z: ballZ
				},
				parent: targetModule
			}, 1);

			i++;

			if (i >= 50) clearInterval(targetModule.ballRainInterval);

		}, 50);

	}

	return targetModule;

});