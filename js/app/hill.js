// HILL.JS
define(['functions', 'three', 'hillmonster', 'ball', 'physijs'], function(Functions, THREE, HillMonster, Ball) {

	module = {
		world: {},
		floorWidth: 20,
		floorDepth: 10,
		rampWidth: 0,
		rampHeight: 0,
		rampLength: 0,
		balls: []
	};

	module.init = function(options) {

		log('Hill World init');

		module.world = options.world;

		$('#page').addClass('world-hill');

        module.createFloor();
        module.createHill();

        module.setCamera();

        module.initControls();

        module.addHillMonster({
        	size: 1,
        	position: {
        		x: -7, y: 0.5, z: 0
        	},
        	parent: module
        }, 1);

        module.addBall({
        	size: 0.5,
        	position: {
        		x: 5, y: 6, z: 0
        	},
        	parent: module
        }, 3);

	}

	module.setCamera = function() {
        module.world.camera.position.set(-10, 3, 10);
	}

	module.initControls = function() {

		$('#add-monster-button').click(function(event) {
	        module.addHillMonster({
	        	size: 1,
	        	position: {
	        		x: -7, y: 0.5, z: 0
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
		var textureAsset = 'chess2.jpg';

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

	module.createHill = function() {

		var mesh = null;
		var loader = new THREE.JSONLoader();

		var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
			shading: THREE.FlatShading,
			color: 0xbcbcbc,
			reflectivity: 0
		}), 1, 0);

		loader.load('elements/hill.json', function(geometry) {

			mesh = new Physijs.ConvexMesh(geometry, material, 0);

			mesh.userData.id = 'ramp';

			mesh.geometry.dynamic = true;
			mesh.receiveShadow = true;
			mesh.castShadow = true;

			mesh.position.x = 5;
			mesh.position.y = 1.5;
			mesh.position.z = 0;

			var box = new THREE.Box3().setFromObject(mesh);

			module.rampLength = box.size().x;
			module.rampHeight = box.size().y;
			module.rampWidth = box.size().z;

			module.world.scene.add(mesh);

			// only now create walls
			module.createWalls();
			module.createSecondaryWalls();

		});

	}

	module.createWalls = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.rampLength, module.rampHeight + 2, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = 5;
		backWall.position.y = module.rampHeight - 0.5;
		backWall.position.z = -module.rampWidth/2 - 0.25/2;

		module.world.scene.add(backWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.rampLength, module.rampHeight + 2, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = 5;
		frontWall.position.y = module.rampHeight - 0.5;
		frontWall.position.z = module.rampWidth/2 + 0.25/2;

		module.world.scene.add(frontWall);

	}

	module.createSecondaryWalls = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.rampLength, 1, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = -5;
		backWall.position.y = 0.5;
		backWall.position.z = -module.rampWidth/2 - 0.25/2;

		module.world.scene.add(backWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(module.rampLength, 1, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = -5;
		frontWall.position.y = 0.5;
		frontWall.position.z = module.rampWidth/2 + 0.25/2;

		module.world.scene.add(frontWall);

	}

	module.addHillMonster = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newHillMonster = new HillMonster(options);
		}

	}

	module.addBall = function(options, number) {

		options.world = module.world;

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	module.monsterDied = function() {

        module.addHillMonster({
        	size: 1,
        	position: {
        		x: -7, y: 0.5, z: 0
        	},
        	parent: module
        }, 1);

	}

	module.ballDied = function() {

        module.addBall({
        	size: 0.5,
        	position: {
        		x: 5, y: 6, z: 0
        	},
        	parent: module
        }, 1);

	}

	return module;

});