// POOL.JS
define(['functions', 'three', 'poolmonster', 'ball', 'physijs'], function(Functions, THREE, PoolMonster, Ball) {

	module = {
		world: {},
		floorWidth: 10,
		floorDepth: 10
	};

	module.init = function(options) {

		log('Pool World init');

		module.world = options.world;

		$('#page').addClass('world-pool');

        module.createFloor();

        module.setCamera();

        module.initControls();

        module.addPoolMonster({
        	size: 1,
        	position: {
        		x: -0.7, y: 1, z: 0
        	},
        	parent: module
        }, 1);

        module.initBallRain();

	}

	module.setCamera = function() {
	       // ...
	}

	module.initControls = function() {

		$('#add-monster-button').click(function(event) {
	        module.addPoolMonster({
	        	size: 1,
	        	position: {
	        		x: -0.7, y: 1, z: 0
	        	},
	        	parent: module
	        }, 1);
		});

		$('#add-ball-button').click(function(event) {
	        module.addBall({
	        	size: 0.5,
	        	position: {
	        		x: 5, y: 6, z: 0
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

			// create walls only now
			module.createLaunchWall();
			module.createSecondaryWalls();

		});

	}

	module.createLaunchWall = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var launchWall = new Physijs.BoxMesh(new THREE.CubeGeometry(0.25, 2, 2), material, 0);

		launchWall.userData.id = 'launchWall';

		launchWall.position.x = -1.78;
		launchWall.position.y = 1;
		launchWall.position.z = 0;

		module.world.scene.add(launchWall);

	}

	module.createSecondaryWalls = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var leftWall = new Physijs.BoxMesh(new THREE.CubeGeometry(5, 1, 0.25), material, 0);

		leftWall.userData.id = 'leftWall';

		leftWall.position.x = 0.6;
		leftWall.position.y = 0.5;
		leftWall.position.z = -1 - (0.25 / 2);

		module.world.scene.add(leftWall);

		var rightWall = new Physijs.BoxMesh(new THREE.CubeGeometry(5, 1, 0.25), material, 0);

		rightWall.userData.id = 'rightWall';

		rightWall.position.x = 0.6;
		rightWall.position.y = 0.5;
		rightWall.position.z = 1 + (0.25 / 2);

		module.world.scene.add(rightWall);

	}

	module.addPoolMonster = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newPoolMonster = new PoolMonster(options);
		}

	}

	module.addBall = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	module.monsterDied = function() {

        module.addPoolMonster({
        	size: 1,
        	position: {
        		x: -0.7, y: 1, z: 0
        	},
        	parent: module
        }, 1);

	}

	module.ballDied = function() {

		var ballX = Math.floor(Math.random() * (8 - 5 + 1)) + 5;

		var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;
		ballY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

		var ballZ = Math.floor(Math.random() * 5);
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

			var ballX = Math.floor(Math.random() * (8 - 5 + 1)) + 5;

			var ballY = Math.floor(Math.random() * (25 - 20 + 1)) + 20;
			ballY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			var ballZ = Math.floor(Math.random() * 5);
			ballZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

	        module.addBall({
	        	size: 0.5,
	        	position: {
	        		x: ballX, y: ballY, z: ballZ
	        	},
	        	parent: module
	        }, 1);

	        i++;

	        if (i >= 20) clearInterval(module.ballRainInterval);

		}, 500);

	}

	return module;

});