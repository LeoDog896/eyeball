import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

scene.background = new THREE.Color(0xfca072);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

let eye: THREE.Mesh | null = null;

loader.load(
  "./scene.gltf",
  function (gltf) {
    console.assert(gltf.scene.children.length === 1, "Expected only one child in the gltf scene");
    eye = gltf.scene.children[0].children[0] as THREE.Mesh;

    // set the up vector to be the y axis
    eye.up.set(0, 1, 0);

    gltf.scene.scale.set(0.01, 0.01, 0.01);
    scene.add(gltf.scene);
  }
);

// add point light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

let mousePos = new THREE.Vector3(0, 0, 0.5);

function animate() {
	requestAnimationFrame(animate);

  // make the eyes follow the mouse
  eye?.lookAt(mousePos.clone().unproject(camera));
  // unfortunately the eye model is on the wrong axis, so we have to rotate it
  eye?.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI * -0.5);

	renderer.render(scene, camera);
}

window.addEventListener('mousemove', (event) => {
  // describes how much the eye should move
  const factor = 50;
  // the Z position doesn't matter as the object will be deprojected anyway,
  // and the camera is on the Z axis anyway
  mousePos.set(
    (event.clientX / window.innerWidth) * factor - factor / 2,
    -(event.clientY / window.innerHeight) * factor + factor / 2,
    0
  );
});

animate();