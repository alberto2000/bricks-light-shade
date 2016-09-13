// HILL.JS
define(['functions', 'hillmonster', 'ball', 'physijs'], function(Functions, HillMonster, Ball) {

	hillModule = {
		floorWidth: 20,
		floorDepth: 10,
		rampWidth: 0,
		rampHeight: 0,
		rampLength: 0,
		balls: [],
		allIncrement: 50
	};

	hillModule.init = function(options) {

		log('Hill World init');

		hillModule.all = options.all;

		$('#page').addClass('world-hill');

			hillModule.createFloor();
			hillModule.createHill();

			if (!hillModule.all) hillModule.setCamera();

			hillModule.initControls();

			hillModule.addHillMonster({
				size: 1,
				position: {
					x: hillModule.all ? -7+hillModule.allIncrement : -7, y: 0.5, z: 0
				},
				parent: hillModule
			}, 1);

			hillModule.addBall({
				size: 0.5,
				position: {
					x: hillModule.all ? 5+hillModule.allIncrement : 5, y: 6, z: 0
				},
				parent: hillModule
			}, 3);

	}

	hillModule.setCamera = function() {
		THREEworld.camera.position.set(-10, 5, 10);
	}

	hillModule.initControls = function() {

		$('#add-hill-monster-button').click(function(event) {
			hillModule.addHillMonster({
				size: 1,
				position: {
					x: hillModule.all ? -7+hillModule.allIncrement : -7, y: 0.5, z: 0
				},
				parent: hillModule
			}, 1);
		});

		$('#add-ball-button').click(function(event) {
			hillModule.addBall({
				size: 0.5,
				position: {
					x: 5, y: 6, z: 0
				},
				parent: hillModule
			}, 1);
		});
	}

	hillModule.createFloor = function() {

		var geometry = new THREE.BoxGeometry(hillModule.floorWidth, 0.25, hillModule.floorDepth);
		var texloader = new THREE.TextureLoader();
		var textureAsset = 'chess2.jpg';

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

			if (hillModule.all) floor.position.x += hillModule.allIncrement;

			THREEworld.scene.add(floor);

			THREEworld.hillCenter = floor.position;

		});

	}

	hillModule.createHill = function() {

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
			mesh.receiveShadow = false;
			mesh.castShadow = false;

			mesh.position.x = 5;
			mesh.position.y = 1.5;
			mesh.position.z = 0;

			if (hillModule.all) mesh.position.x += hillModule.allIncrement;

			var box = new THREE.Box3().setFromObject(mesh);

			hillModule.rampLength = box.size().x;
			hillModule.rampHeight = box.size().y;
			hillModule.rampWidth = box.size().z;

			THREEworld.scene.add(mesh);

			// only now create walls
			hillModule.createWalls();
			hillModule.createSecondaryWalls();

		});

	}

	hillModule.createWalls = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(hillModule.rampLength, hillModule.rampHeight + 2, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = 5;
		backWall.position.y = hillModule.rampHeight - 0.5;
		backWall.position.z = -hillModule.rampWidth/2 - 0.25/2;

		if (hillModule.all) backWall.position.x += hillModule.allIncrement;

		THREEworld.scene.add(backWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(hillModule.rampLength, hillModule.rampHeight + 2, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = 5;
		frontWall.position.y = hillModule.rampHeight - 0.5;
		frontWall.position.z = hillModule.rampWidth/2 + 0.25/2;

		if (hillModule.all) frontWall.position.x += hillModule.allIncrement;

		THREEworld.scene.add(frontWall);

	}

	hillModule.createSecondaryWalls = function() {

		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: 0x66ccff,
			reflectivity: 0,
			transparent: true,
			opacity: 0.5
		}), 0.4, 0.8);

		var backWall = new Physijs.BoxMesh(new THREE.CubeGeometry(hillModule.rampLength, 1, 0.25), material, 0);

		backWall.userData.id = 'backWall';

		backWall.position.x = -5;
		backWall.position.y = 0.5;
		backWall.position.z = -hillModule.rampWidth/2 - 0.25/2;

		if (hillModule.all) backWall.position.x += hillModule.allIncrement;

		THREEworld.scene.add(backWall);

		var frontWall = new Physijs.BoxMesh(new THREE.CubeGeometry(hillModule.rampLength, 1, 0.25), material, 0);

		frontWall.userData.id = 'frontWall';

		frontWall.position.x = -5;
		frontWall.position.y = 0.5;
		frontWall.position.z = hillModule.rampWidth/2 + 0.25/2;

		if (hillModule.all) frontWall.position.x += hillModule.allIncrement;

		THREEworld.scene.add(frontWall);

	}

	hillModule.addHillMonster = function(options, number) {

		for (var i = 0; i < number; i++) {
			var newHillMonster = new HillMonster(options);
		}

	}

	hillModule.addBall = function(options, number) {

		for (var i = 0; i < number; i++) {
			var newBall = new Ball(options);
		}

	}

	hillModule.monsterDied = function() {

		hillModule.addHillMonster({
			size: 1,
			position: {
				x: hillModule.all ? -7+hillModule.allIncrement : -7, y: 0.5, z: 0
			},
			parent: hillModule
		}, 1);

	}

	hillModule.ballDied = function() {

		hillModule.addBall({
			size: 0.5,
			position: {
				x: hillModule.all ? 5+hillModule.allIncrement : 5, y: 6, z: 0
			},
			parent: hillModule
		}, 1);

	}

	return hillModule;

});