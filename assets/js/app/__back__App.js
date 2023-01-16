'use strict';

var move = true;

function init3D() {

	var scene = new THREE.Scene(),
	    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50),
	    pointLight;
	camera.position.z = 55;

	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.querySelector('.js-main').appendChild(renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0x000000);
	//scene.add( ambientLight );

	var lights = [];
	lights[0] = new THREE.PointLight(0xffffff, 1, 0);
	lights[1] = new THREE.PointLight(0xff0000, 0.1, 0);
	lights[2] = new THREE.PointLight(0x999999, 0.5, 0);

	//lights[0].position.set( 0, 200, 0 );
	//lights[1].position.set( 100, 200, 100 );
	lights[2].position.set(-100, -200, -100);

	//scene.add( lights[0] );
	//scene.add( lights[1] );
	scene.add(lights[2]);

	function createLight(color) {
		var pointLight = new THREE.PointLight(color, 1, 40);
		pointLight.castShadow = true;
		pointLight.shadow.camera.near = 1;
		pointLight.shadow.camera.far = 50;
		pointLight.shadowCameraVisible = true;
		pointLight.shadow.bias = 0.001;
		//
		var geometry = new THREE.SphereGeometry(0.3, 12, 6);
		var material = new THREE.MeshBasicMaterial({ color: color });
		var sphere = new THREE.Mesh(geometry, material);
		//pointLight.add( sphere );
		return pointLight;
	}
	pointLight = createLight(0x999999);
	pointLight.position.set(0, 0, 0);
	scene.add(pointLight);

	// guiScene( gui, scene, camera );

	//var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );

	var ambient = new THREE.AmbientLight(0xffffff);
	//scene.add( ambient );

	var effect = new THREE.ParallaxBarrierEffect(renderer);

	var width = window.innerWidth || 2;
	var height = window.innerHeight || 2;

	effect.setSize(width, height);

	// geometry -------------------------------------------------------------
	//// geo phong ----------------------------------------------------------
	var geometry = new THREE.DodecahedronGeometry(10, 1),
	    materialObj = new THREE.MeshPhongMaterial({
		color: 0x999999,
		wireframe: true,
		lightMap: false,
		emissive: 0x000000,
		shininess: 10, shading: THREE.SmoothShading
	}),
	    mesh = new THREE.Mesh(geometry, materialObj),
	    geometry_ = new THREE.BoxGeometry(2, 0.5, 0.5),
	    sceneObj = new THREE.Object3D();

	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(sceneObj);

	//// box ----------------------------------------------------------------
	var geometryBox = new THREE.BoxGeometry(200, 60, 40),
	    materialBox = new THREE.MeshPhongMaterial({
		color: 0xa0adaf,
		shininess: 10,
		specular: 0x111111,
		side: THREE.BackSide
	}),
	    meshBox = new THREE.Mesh(geometryBox, materialBox);

	meshBox.position.y = 20;
	meshBox.position.z = 1;
	meshBox.receiveShadow = true;
	scene.add(meshBox);

	//sceneObj.rotation.y = 90;
	//sceneObj.position.y = -10;

	//camera.position.z = 5;

	//scene.add( mesh );

	var prevFog = false,
	    vel = 0,
	    dis_camera = 30;

	var render = function render() {

		//requestAnimationFrame( render );

		console.log("pues q venga");

		var time = Date.now() * 0.001;

		if (!move) {
			if (vel <= 0.005) {

				vel = vel + 0.0001;
			}

			if (dis_camera >= 20) {
				dis_camera = dis_camera - 0.1;
			}

			console.log(dis_camera);

			camera.position.z = dis_camera;
			mesh.rotation.y += vel;
			//mesh.rotation.x += 0.005;
		}

		if (prevFog !== scene.fog) {

			mesh.material.needsUpdate = true;
			prevFog = scene.fog;
			console.log(scene.fog);
		}

		if (mesh.morphTargetInfluences) {

			mesh.morphTargetInfluences[0] = (1 + Math.sin(4 * time)) / 2;
		}
		camera.position.z = dis_camera;
		renderer.render(scene, camera);
	};

	window.addEventListener('resize', function () {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);

		effect.render(scene, camera);
	}, false);

	return render();
}

//docuement load
document.addEventListener('DOMContentLoaded', function () {

	document.querySelector('.js-main').classList.remove('main__anima');
	document.querySelector('.js-main').classList.add('main__anima');

	setTimeout(function () {
		init3D();
	}, 1300);

	document.querySelector(".js-btn__showInfo").addEventListener("click", function (e) {

		if (~document.querySelector(".js-info").className.indexOf("anima")) {
			document.querySelector(".js-info").classList.remove("anima");

			e.target.classList.remove("active");
		} else {
			document.querySelector(".js-info").classList.add("anima");
			e.target.classList.add("active");
		}
	});
});