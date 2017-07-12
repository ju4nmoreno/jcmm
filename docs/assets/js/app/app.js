'use strict';

var move = true;

// --------------------------------------------------------------------------
var SCENE3D = {
	scene: null,
	camera: null,
	renderer: null,
	ambientLight: null,
	effect: null,
	light: null,
	lights: null,
	sceneObj: null,
	box: null,
	geo: null,
	prevFog: false,
	vel: 0,
	disCamera: 30,
	//
	__init: function __init() {
		if (this.scene === null) {
			//
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
			this.camera.position.z = 55;
			//
			this.renderer = new THREE.WebGLRenderer({ alpha: true });
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.BasicShadowMap;
			document.querySelector('.js-main').appendChild(this.renderer.domElement);
			//
			this.ambientLight = new THREE.AmbientLight(0x000000);
			this.scene.add(this.ambientLight);
			//
			this.light = this.__pointLight({
				init: [0xff0000, 0, 0],
				set: [-100, -200, -100]
			});
			this.scene.add(this.light);
			//
			this.lights = this.__pointLight({
				init: [0xdbdbdb, 0, 50],
				set: [0, 0, 0],
				castShadow: true
			});

			this.scene.add(this.lights);
			//
			this.effect = new THREE.ParallaxBarrierEffect(this.renderer);
			this.effect.setSize(window.innerWidth, window.innerHeight);
			//
			this.sceneObj = new THREE.Object3D();
			this.scene.add(this.sceneObj);
			//
			this.geo = new this.__createGeo();
			this.scene.add(this.geo);
			//
			this.box = this.__createBox();
			//
			this.__resize();
			// --------------------------------------------------------------
			this.__render();
		}
	},
	__pointLight: function __pointLight() {
		var a = arguments,
		    pointLight;
		//
		pointLight = new THREE.PointLight(a[0].init[0], a[0].init[1], a[0].init[2]);
		pointLight.position.set(a[0].set[0], a[0].set[1], a[0].set[2]);
		pointLight.castShadow = a[0].castShadow || false;
		if (a[0].castShadow) {
			pointLight.shadow.camera.near = 1;
			pointLight.shadow.camera.far = 50;

			pointLight.shadowCameraVisible = true;
			pointLight.shadow.bias = 0.001;
		}
		return pointLight;
	},
	//
	__createGeo: function __createGeo() {
		var geometry = new THREE.DodecahedronGeometry(10, 1),
		    materialObj = new THREE.MeshPhongMaterial({
			color: 0x999999,
			wireframe: true,
			lightMap: false,
			emissive: 0x000000,
			shininess: 10,
			shading: THREE.SmoothShading
		}),
		    mesh = new THREE.Mesh(geometry, materialObj),
		    geometry_ = new THREE.BoxGeometry(2, 0.5, 0.5);

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	},
	//
	__createBox: function __createBox() {
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
		this.scene.add(meshBox);
	},
	//
	__render: function __render() {
		//console.log("nada");
		window.requestAnimationFrame(SCENE3D.__render);
		//
		var time = Date.now() * 0.001;

		if (move) {
			if (SCENE3D.vel <= 0.005) {

				SCENE3D.vel = SCENE3D.vel + 0.0001;
			}

			if (SCENE3D.disCamera >= 20) {
				SCENE3D.disCamera = SCENE3D.disCamera - 0.1;
			}

			if (SCENE3D.lights.intensity < 1) {
				SCENE3D.lights.intensity = SCENE3D.lights.intensity + 0.002;
			}

			if (SCENE3D.light.intensity < 1) {
				SCENE3D.light.intensity = SCENE3D.light.intensity + 0.003;
			}

			SCENE3D.camera.position.z = SCENE3D.disCamera;
			SCENE3D.geo.rotation.y += SCENE3D.vel;
			//geo.rotation.x += 0.005;
		}

		if (SCENE3D.prevFog !== SCENE3D.scene.fog) {

			SCENE3D.geo.material.needsUpdate = true;
			SCENE3D.prevFog = SCENE3D.scene.fog;
		}

		if (SCENE3D.geo.morphTargetInfluences) {

			SCENE3D.geo.morphTargetInfluences[0] = (1 + Math.sin(4 * time)) / 2;
		}
		SCENE3D.camera.position.z = SCENE3D.dis_camera;
		SCENE3D.renderer.render(SCENE3D.scene, SCENE3D.camera);

		SCENE3D.camera.position.z = 30;
		SCENE3D.renderer.render(SCENE3D.scene, SCENE3D.camera);
	},
	//
	__resize: function __resize() {
		var self = this;
		window.addEventListener('resize', function () {
			self.camera.aspect = window.innerWidth / window.innerHeight;
			self.camera.updateProjectionMatrix();
			self.renderer.setSize(window.innerWidth, window.innerHeight);

			self.effect.render(self.scene, self.camera);
		}, false);
	}
	// --------------------------------------------------------------------------
};var APP = {
	ctx: document.querySelector('.js-main'),
	__init: function __init() {
		var _this = this;

		if (this.ctx) {
			this.ctx.className = '';
			setTimeout(function () {
				_this.ctx.className = 'js-main main__anima';
			}, 100);
			//
			var btn__showInfo = document.querySelector('.js-btn__showInfo');
			this.__event(btn__showInfo, 'click');
		}
	},
	__event: function __event(selector, type) {
		//
		selector.addEventListener(type, function (e) {

			if (e.currentTarget.classList.contains("active")) {} else {}
			if (~document.querySelector(".js-info").className.indexOf("anima")) {
				e.currentTarget.classList.remove("active");
				document.querySelector(".js-info").classList.remove("anima");
			} else {
				e.currentTarget.classList.add("active");
				document.querySelector(".js-info").classList.add("anima");
			}
		}, false);
	}
	//docuement load
};document.addEventListener('DOMContentLoaded', function () {
	//
	APP.__init();
	//
});
//
function whichTransitionEvent() {
	var t,
	    el = document.createElement('fakeelement'),
	    transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
}
var e = document.querySelector("main"),
    tempAnima = false,
    transitionsEvent = whichTransitionEvent();
//
transitionsEvent && e.addEventListener(transitionsEvent, function () {
	//
	if (!tempAnima) {
		tempAnima = true;
		SCENE3D.__init();
	}
	//
}, false);