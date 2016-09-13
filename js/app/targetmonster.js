// TARGETMONSTER.JS
define(['functions', 'physijs'], function(Functions) {

	function TargetMonster(options) {

		var self = this;

		self.size = options.size;
		self.position = options.position;
		self.parent = options.parent;

		self.meshes = {
			body: {},
			leftFrontLeg: {},
			rightFrontLeg: {},
			leftBackLeg: {},
			rightBackLeg: {}
		};

		self.constraints = {

		};

		self.moveSpeed = Math.floor(Math.random() * (355 - 100 + 1)) + 100;

		self.moveLoopTimer = {};

		self.makeBody = function() {

			var bodyWeight = 0.5;

			var geometry = new THREE.BoxGeometry(self.size, self.size * 0.25, self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var body = new Physijs.BoxMesh(geometry, material, bodyWeight);

			body.userData.id = 'body';

			body.geometry.dynamic = true;
			body.receiveShadow = true;
			body.castShadow = true;

			body.position.x = self.position.x;
			body.position.y = self.position.y + 1;
			body.position.z = self.position.z;

			self.meshes.body = body;

			THREEworld.scene.add(self.meshes.body);

		}

		self.makeLeftFrontLeg = function() {

			var legWeight = 0.1;

			var geometry = new THREE.BoxGeometry(self.size * 0.25, self.size, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var leftFrontLeg = new Physijs.BoxMesh(geometry, material, legWeight);

			leftFrontLeg.userData.id = 'leftFrontLeg';

			leftFrontLeg.geometry.dynamic = true;
			leftFrontLeg.receiveShadow = true;
			leftFrontLeg.castShadow = true;

			leftFrontLeg.position.x = self.position.x + self.size / 2 + self.size * 0.25 / 2;
			leftFrontLeg.position.y = self.position.y + self.size / 2;
			leftFrontLeg.position.z = self.position.z - self.size / 2 - self.size * 0.25 / 2;

			self.meshes.leftFrontLeg = leftFrontLeg;

			THREEworld.scene.add(self.meshes.leftFrontLeg);

		}

		self.makeRightFrontLeg = function() {

			var legWeight = 0.1;

			var geometry = new THREE.BoxGeometry(self.size * 0.25, self.size, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var rightFrontLeg = new Physijs.BoxMesh(geometry, material, legWeight);

			rightFrontLeg.userData.id = 'rightFrontLeg';

			rightFrontLeg.geometry.dynamic = true;
			rightFrontLeg.receiveShadow = true;
			rightFrontLeg.castShadow = true;

			rightFrontLeg.position.x = self.position.x + self.size / 2 + self.size * 0.25 / 2;
			rightFrontLeg.position.y = self.position.y + self.size / 2;
			rightFrontLeg.position.z = self.position.z + self.size / 2 + self.size * 0.25 / 2;

			self.meshes.rightFrontLeg = rightFrontLeg;

			THREEworld.scene.add(self.meshes.rightFrontLeg);

		}

		self.makeLeftBackLeg = function() {

			var legWeight = 0.1;

			var geometry = new THREE.BoxGeometry(self.size * 0.25, self.size, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var leftBackLeg = new Physijs.BoxMesh(geometry, material, legWeight);

			leftBackLeg.userData.id = 'leftBackLeg';

			leftBackLeg.geometry.dynamic = true;
			leftBackLeg.receiveShadow = true;
			leftBackLeg.castShadow = true;

			leftBackLeg.position.x = self.position.x - self.size / 2 - self.size * 0.25 / 2;
			leftBackLeg.position.y = self.position.y + self.size / 2;
			leftBackLeg.position.z = self.position.z - self.size / 2 - self.size * 0.25 / 2;

			self.meshes.leftBackLeg = leftBackLeg;

			THREEworld.scene.add(self.meshes.leftBackLeg);

		}

		self.makeRightBackLeg = function() {

			var legWeight = 0.1;

			var geometry = new THREE.BoxGeometry(self.size * 0.25, self.size, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var rightBackLeg = new Physijs.BoxMesh(geometry, material, legWeight);

			rightBackLeg.userData.id = 'rightBackLeg';

			rightBackLeg.geometry.dynamic = true;
			rightBackLeg.receiveShadow = true;
			rightBackLeg.castShadow = true;

			rightBackLeg.position.x = self.position.x - self.size / 2 - self.size * 0.25 / 2;
			rightBackLeg.position.y = self.position.y + self.size / 2;
			rightBackLeg.position.z = self.position.z + self.size / 2 + self.size * 0.25 / 2;

			self.meshes.rightBackLeg = rightBackLeg;

			THREEworld.scene.add(self.meshes.rightBackLeg);

		}

		self.addLeftFrontLegConstraint = function() {

			var leftFrontLegConstraint = new Physijs.SliderConstraint(
				self.meshes.body,
				self.meshes.leftFrontLeg,
				new THREE.Vector3(self.position.x + self.size / 2, 
								  self.position.y + self.size, 
								  self.position.z - self.size / 2),
				new THREE.Vector3(0, 0, Math.PI/2)
			);

			self.constraints.leftFrontLegConstraint = leftFrontLegConstraint;

			THREEworld.scene.addConstraint(self.constraints.leftFrontLegConstraint);

			self.constraints.leftFrontLegConstraint.setLimits(-0.1, 0.25, 0, 0);
			self.constraints.leftFrontLegConstraint.setRestitution(0.5, 0.5);

		}

		self.addRightFrontLegConstraint = function() {

			var rightFrontLegConstraint = new Physijs.SliderConstraint(
				self.meshes.body,
				self.meshes.rightFrontLeg,
				new THREE.Vector3(self.position.x + self.size / 2, 
								  self.position.y + self.size, 
								  self.position.z + self.size / 2),
				new THREE.Vector3(0, 0, Math.PI/2)
			);

			self.constraints.rightFrontLegConstraint = rightFrontLegConstraint;

			THREEworld.scene.addConstraint(self.constraints.rightFrontLegConstraint);

			self.constraints.rightFrontLegConstraint.setLimits(-0.1, 0.25, 0, 0);
			self.constraints.rightFrontLegConstraint.setRestitution(0.5, 0.5);

		}

		self.addLeftBackLegConstraint = function() {

			var leftBackLegConstraint = new Physijs.SliderConstraint(
				self.meshes.body,
				self.meshes.leftBackLeg,
				new THREE.Vector3(self.position.x - self.size / 2, 
								  self.position.y + self.size, 
								  self.position.z - self.size / 2),
				new THREE.Vector3(0, 0, Math.PI/2)
			);

			self.constraints.leftBackLegConstraint = leftBackLegConstraint;

			THREEworld.scene.addConstraint(self.constraints.leftBackLegConstraint);

			self.constraints.leftBackLegConstraint.setLimits(-0.1, 0.25, 0, 0);
			self.constraints.leftBackLegConstraint.setRestitution(0.5, 0.5);

		}

		self.addRightBackLegConstraint = function() {

			var rightBackLegConstraint = new Physijs.SliderConstraint(
				self.meshes.body,
				self.meshes.rightBackLeg,
				new THREE.Vector3(self.position.x - self.size / 2, 
								  self.position.y + self.size, 
								  self.position.z + self.size / 2),
				new THREE.Vector3(0, 0, Math.PI/2)
			);

			self.constraints.rightBackLegConstraint = rightBackLegConstraint;

			THREEworld.scene.addConstraint(self.constraints.rightBackLegConstraint);

			self.constraints.rightBackLegConstraint.setLimits(-0.1, 0.25, 0, 0);
			self.constraints.rightBackLegConstraint.setRestitution(0.5, 0.5);

		}

		self.move = function() {

			self.moveLoopTimer = setTimeout(function() {

				self.constraints.leftFrontLegConstraint.enableLinearMotor(-30, 100);
				self.constraints.rightFrontLegConstraint.enableLinearMotor(30, 100);

				self.moveLoopTimer = setTimeout(function() {

					self.constraints.leftBackLegConstraint.enableLinearMotor(-30, 100);
					self.constraints.rightBackLegConstraint.enableLinearMotor(30, 100);

					self.moveLoopTimer = setTimeout(function() {

						self.constraints.leftFrontLegConstraint.enableLinearMotor(30, 100);
						self.constraints.rightFrontLegConstraint.enableLinearMotor(-30, 100);

						self.moveLoopTimer = setTimeout(function() {

							self.constraints.leftBackLegConstraint.enableLinearMotor(30, 100);
							self.constraints.rightBackLegConstraint.enableLinearMotor(-30, 100);

							self.move();

						}, self.moveSpeed);

					}, self.moveSpeed);

				}, self.moveSpeed);

			}, self.moveSpeed);			

		}

		self.dieCheck = function() {

	        self.dieCheckInterval = setInterval(function() {

	        	var currentMonsterY = self.meshes.body.position.y;

	        	if (currentMonsterY < -150) {
	        		clearInterval(self.dieCheckInterval);
	        		clearInterval(self.moveLoopTimer);
	        		THREEworld.scene.remove(self.meshes.body);
	        		THREEworld.scene.remove(self.meshes.leftFrontLeg);
	        		THREEworld.scene.remove(self.meshes.rightFrontLeg);
	        		THREEworld.scene.remove(self.meshes.leftBackLeg);
	        		THREEworld.scene.remove(self.meshes.rightBackLeg);
	        		THREEworld.scene.removeConstraint(self.constraints.leftFrontLegConstraint);
	        		THREEworld.scene.removeConstraint(self.constraints.rightFrontLegConstraint);
	        		THREEworld.scene.removeConstraint(self.constraints.leftBackLegConstraint);
	        		THREEworld.scene.removeConstraint(self.constraints.rightBackLegConstraint);
	        		self.parent.monsterDied();
	        	}

	        }, 1000);

		}

		self.makeBody();

		self.makeLeftFrontLeg();
		self.makeRightFrontLeg();
		self.makeLeftBackLeg();
		self.makeRightBackLeg();

		self.addLeftFrontLegConstraint();
		self.addRightFrontLegConstraint();
		self.addLeftBackLegConstraint();
		self.addRightBackLegConstraint();

		var moveDelay = Math.floor(Math.random() * (2000 - 250 + 1)) + 250;

		setTimeout(function() {
			self.move();
			self.dieCheck();
		}, moveDelay);

		// ---

		function makeid() {
		    var text = "";
		    var possible = "ABCDE012345678901234567890123456789";

		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}

	    $('#information .testid').html('#'+makeid());

	    var gen = $('#information .generation .number').text();

	    $('#information .generation .number').html(parseInt(gen) + 1);

	}

	return TargetMonster;

});