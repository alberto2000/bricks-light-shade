// BALL.JS
define(['functions', 'three', 'physijs'], function(Functions, THREE) {

	function Ball(options) {

		var self = this;

		self.world = options.world;
		self.size = options.size;
		self.position = options.position;
		self.parent = options.parent;

		self.meshes = {
			ball: {}
		};

		self.makeBall = function() {

			var size = self.size;
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0x00ff00,
				reflectivity: 0
			}), 0.4, 0.8);
			var ball = new Physijs.BoxMesh(new THREE.CubeGeometry(size, size, size), material, 0.1);

			ball.userData.id = 'ball';

			ball.geometry.dynamic = true;
			ball.receiveShadow = true;
			ball.castShadow = true;

			ball.position.x = self.position.x;
			ball.position.y = self.position.y;
			ball.position.z = self.position.z;

			self.meshes.ball = ball;

			self.world.scene.add(ball);

		}

		self.dieCheck = function() {

	        self.dieCheckInterval = setInterval(function() {

	        	var currentBallY = self.meshes.ball.position.y;

	        	if (currentBallY < -150) {
	        		clearInterval(self.dieCheckInterval);
	        		self.world.scene.remove(self.meshes.ball);
	        		self.parent.ballDied();
	        	}

	        }, 1000);

		}

		self.makeBall();
		self.dieCheck();

	}

	return Ball;

});