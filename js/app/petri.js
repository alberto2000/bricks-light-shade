// PETRI.JS
define(['functions', 'three', 'petrimonster', 'ball', 'physijs'], function(Functions, THREE, PetriMonster, Ball) {

	petriModule = {
		world: {},
		floorSize: 10
	};

	petriModule.init = function(options) {

		log('Petri World init');

		petriModule.world = options.world;
		petriModule.all = options.all;

		$('#page').addClass('world-petri');

			petriModule.createFloor();
			petriModule.createWalls();

			petriModule.initControls();

			petriModule.addPetriMonster({
				size: 1,
				position: {
					x: 0, y: 4, z: 0
				},
				parent: petriModule
			}, 1);

			petriModule.addBall({
				size: 0.5,
				position: {
					x: 0, y: 6, z: 0
				},
				parent: petriModule
			}, 1);

	}

	petriModule.initControls = function() {

		$('#add-petri-monster-button').click(function(event) {
			petriModule.addPetriMonster({
				size: 1,
				position: {
					x: 0, y: 4, z: 0
				},
				parent: petriModule
			}, 1);
		});

		$('#add-ball-button').click(function(event) {
			petriModule.addBall({
				size: 0.5,
				position: {
					x: 0, y: 6, z: 0
				},
				parent: petriModule
			}, 1);
		});

	}

	petriModule.addPetriMonster = function(options, number) {

		options.world = petriModule.world;

		for (var i = 0; i < number; i++) {
			var newPetriMonster = new PetriMonster(options);
		}

	}

	petriModule.addBall = function(options, number) {

		options.world = petriModule.world;

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	petriModule.createFloor = function() {

		var geometry = new THREE.CubeGeometry(petriModule.floorSize, 0.25, petriModule.floorSize);
		var texloader = new THREE.TextureLoader();
		var textureAsset = 'chess.jpg';

		texloader.load('elements/'+textureAsset, function(tex) {

			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.NearestFilter;

			var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: tex}), 0.4, 0.6);
			var floor = new Physijs.BoxMesh(geometry, material, 0);

			floor.userData.id = 'floor';

			floor.receiveShadow = false;

			floor.position.x = 0;
			floor.position.y = -0.25/2;
			floor.position.z = 0;

			petriModule.world.scene.add(floor);

			petriModule.world.petriCenter = floor.position;

		});

	}

	petriModule.createWalls = function() {

		var wallHeight = 2;
		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(petriModule.floorSize - 0.5, wallHeight, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = 0;
		backWall.position.y = wallHeight/2;
		backWall.position.z = -petriModule.floorSize/2 + 0.25/2;

		petriModule.world.scene.add(backWall);

		var rightWall = new Physijs.BoxMesh(new THREE.CubeGeometry(0.25, wallHeight, petriModule.floorSize), material, 0);

		rightWall.userData.id = 'rightWall';

		rightWall.position.x = petriModule.floorSize/2 - 0.25/2;
		rightWall.position.y = wallHeight/2;
		rightWall.position.z = 0;

		petriModule.world.scene.add(rightWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(petriModule.floorSize-0.5, wallHeight, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = 0;
		frontWall.position.y = wallHeight/2;
		frontWall.position.z = petriModule.floorSize/2 - 0.25/2;

		petriModule.world.scene.add(frontWall);

		var leftWall = new Physijs.BoxMesh(new THREE.CubeGeometry(0.25, wallHeight, petriModule.floorSize), material, 0);

		leftWall.userData.id = 'leftWall';

		leftWall.position.x = -petriModule.floorSize/2 + 0.25/2;
		leftWall.position.y = wallHeight/2;
		leftWall.position.z = 0;

		petriModule.world.scene.add(leftWall);

	}

	petriModule.monsterDied = function() {

		petriModule.addPetriMonster({
			size: 1,
			position: {
				x: 0, y: 4, z: 0
			},
			parent: petriModule
		}, 1);

	}

	petriModule.ballDied = function() {

		petriModule.addBall({
			size: 0.5,
			position: {
				x: 0, y: 6, z: 0
			},
			parent: petriModule
		}, 1);

	}

	return petriModule;

});