"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import {addMouseHandler} from "./sceneHandlers.js"
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';

let renderer = null, scene = null, camera = null
let controls = null;
const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );
    //solarSystemGroup.rotation.y = 5;
    controls.update();
    // Spin the cube for next frame
    animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 60;
    
    scene.add(camera);
    // Orbit controls 
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.8);
    scene.add(ambientLight);
    
    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, solarSystemGroup);
}

main();