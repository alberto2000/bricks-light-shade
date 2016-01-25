// PETRI.JS
define(['functions', 'three', 'petrimonster', 'ball', 'physijs'], function(Functions, THREE, PetriMonster, Ball) {

	module = {
		world: {},
		floorSize: 10
	};

	module.init = function(options) {

		log('Petri World init');

		module.world = options.world;

		$('#page').addClass('world-petri');

        module.createFloor();
        module.createWalls();

        module.initControls();

        module.addPetriMonster({
        	size: 1,
        	position: {
        		x: 0, y: 4, z: 0
        	},
        	parent: module
        }, 3);

        module.addBall({
        	size: 0.5,
        	position: {
        		x: 0, y: 6, z: 0
        	},
        	parent: module
        }, 3);

	}

	module.initControls = function() {

		$('#add-monster-button').click(function(event) {
	        module.addPetriMonster({
	        	size: 1,
	        	position: {
	        		x: 0, y: 4, z: 0
	        	},
	        	parent: module
	        }, 1);
		});

		$('#add-ball-button').click(function(event) {
	        module.addBall({
	        	size: 0.5,
	        	position: {
	        		x: 0, y: 6, z: 0
	        	},
	        	parent: module
	        }, 1);
		});

	}

	module.addPetriMonster = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newPetriMonster = new PetriMonster(options);
		}

	}

	module.addBall = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	module.createFloor = function() {

		var geometry = new THREE.CubeGeometry(module.floorSize, 0.25, module.floorSize);
		var texloader = new THREE.TextureLoader();
		var textureAsset = 'chess.jpg';

		texloader.load('elements/'+textureAsset, function(tex) {

			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.NearestFilter;

			var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: tex}), 0.4, 0.6);
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

	module.createWalls = function() {

		var wallHeight = 2;
		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.floorSize - 0.5, wallHeight, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = 0;
		backWall.position.y = wallHeight/2;
		backWall.position.z = -module.floorSize/2 + 0.25/2;

		module.world.scene.add(backWall);

		var rightWall = new Physijs.BoxMesh(new THREE.CubeGeometry(0.25, wallHeight, module.floorSize), material, 0);

		rightWall.userData.id = 'rightWall';

		rightWall.position.x = module.floorSize/2 - 0.25/2;
		rightWall.position.y = wallHeight/2;
		rightWall.position.z = 0;

		module.world.scene.add(rightWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.floorSize-0.5, wallHeight, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = 0;
		frontWall.position.y = wallHeight/2;
		frontWall.position.z = module.floorSize/2 - 0.25/2;

		module.world.scene.add(frontWall);

		var leftWall = new Physijs.BoxMesh(new THREE.CubeGeometry(0.25, wallHeight, module.floorSize), material, 0);

		leftWall.userData.id = 'leftWall';

		leftWall.position.x = -module.floorSize/2 + 0.25/2;
		leftWall.position.y = wallHeight/2;
		leftWall.position.z = 0;

		module.world.scene.add(leftWall);

	}

	module.monsterDied = function() {

        module.addPetriMonster({
        	size: 1,
        	position: {
        		x: 0, y: 4, z: 0
        	},
        	parent: module
        }, 1);

	}

	module.ballDied = function() {

        module.addBall({
        	size: 0.5,
        	position: {
        		x: 0, y: 6, z: 0
        	},
        	parent: module
        }, 1);

	}

	return module;

});