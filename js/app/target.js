// TARGET.JS
define(['functions', 'three', 'targetmonster', 'ball', 'physijs'], function(Functions, THREE, TargetMonster, Ball) {

	module = {
		world: {},
		floorWidth: 10,
		floorDepth: 10,
	};

	module.init = function(options) {

		log('Target World init');

		module.world = options.world;

		$('#page').addClass('world-target');

        module.createFloor();

        module.setCamera();

        module.initControls();

        module.addTargetMonster({
        	size: 1,
        	position: {
        		x: 0, y: 1, z: 0
        	},
        	parent: module
        }, 1);

        module.initBallRain();

	}

	module.setCamera = function() {
	       module.world.camera.position.set(2, 7, 10);
	}

	module.initControls = function() {

		$('#add-monster-button').click(function(event) {
	        module.addTargetMonster({
	        	size: 1,
	        	position: {
	        		x: 0, y: 1, z: 0
	        	},
	        	parent: module
	        }, 1);
		});

		$('#add-ball-button').click(function(event) {

			var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

			var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

	        module.addBall({
	        	size: 0.5,
	        	position: {
	        		x: ballX, y: ballY, z: ballZ
	        	},
	        	parent: module
	        }, 1);

		});
	}

	module.createFloor = function() {

		var geometry = new THREE.BoxGeometry(module.floorWidth, 0.25, module.floorDepth);
		var texloader = new THREE.TextureLoader();
		var textureAsset = 'chess.jpg';

		texloader.load('elements/'+textureAsset, function(tex) {

			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.NearestFilter;

			var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: tex}), 0, 0.6);
			var floor = new Physijs.BoxMesh(geometry, material, 0);

			floor.userData.id = 'floor';

			floor.receiveShadow = true;

			floor.position.x = 0;
			floor.position.y = -0.25/2;
			floor.position.z = 0;

			module.world.scene.add(floor);

			// 2nd floor
			var floor2 = new Physijs.BoxMesh(geometry, material, 0);

			floor2.userData.id = 'floor2';

			floor2.receiveShadow = true;

			floor2.position.x = 30;
			floor2.position.y = -10 + -0.25/2;
			floor2.position.z = 50;

			module.world.scene.add(floor2);

			// 3rd floor
			var floor3 = new Physijs.BoxMesh(geometry, material, 0);

			floor3.userData.id = 'floor3';

			floor3.receiveShadow = true;

			floor3.position.x = -40;
			floor3.position.y = -20 + -0.25/2;
			floor3.position.z = -20;

			module.world.scene.add(floor3);

			// 4th floor
			var floor4 = new Physijs.BoxMesh(geometry, material, 0);

			floor4.userData.id = 'floor4';

			floor4.receiveShadow = true;

			floor4.position.x = -20;
			floor4.position.y = -30 + -0.25/2;
			floor4.position.z = 10;

			module.world.scene.add(floor4);

			// 5th floor
			var floor5 = new Physijs.BoxMesh(geometry, material, 0);

			floor5.userData.id = 'floor5';

			floor5.receiveShadow = true;

			floor5.position.x = 40;
			floor5.position.y = -20 + -0.25/2;
			floor5.position.z = -30;

			module.world.scene.add(floor5);

		});

	}

	module.addTargetMonster = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newTargetMonster = new TargetMonster(options);
		}

	}

	module.addBall = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	module.monsterDied = function() {

        module.addTargetMonster({
        	size: 1,
        	position: {
        		x: 0, y: 1, z: 0
        	},
        	parent: module
        }, 1);

	}

	module.ballDied = function() {

		var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
		ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

		var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

		var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
		ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

        module.addBall({
        	size: 0.5,
        	position: {
        		x: ballX, y: ballY, z: ballZ
        	},
        	parent: module
        }, 1);

	}

	module.initBallRain = function() {

		var i = 0;

		module.ballRainInterval = setInterval(function() {

			var ballX = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;

			var ballZ = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
			ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

	        module.addBall({
	        	size: 0.5,
	        	position: {
	        		x: ballX, y: ballY, z: ballZ
	        	},
	        	parent: module
	        }, 1);

	        i++;

	        if (i >= 100) clearInterval(module.ballRainInterval);

		}, 50);

	}

	return module;

});