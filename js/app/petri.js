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