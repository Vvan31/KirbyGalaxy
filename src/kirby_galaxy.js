"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import {addMouseHandler} from "../libs/sceneHandlers.js"
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';
import { OBJLoader  } from '../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/loaders/MTLLoader.js';
import { GLTFLoader } from '../libs/three.js/loaders/GLTFLoader.js';
//import {DragControls} from '../libs/three.js/controls/DragControls.js';

let renderer = null, scene = null, camera = null
let controls = null;
const duration = 5000; // ms
let currentTime = Date.now();
let squares = [];
let cube;
let cube2;
let cube3;
let snow;
let box;
//Ejemplos clase
let SHADOW_MAP_WIDTH = 1024, SHADOW_MAP_HEIGHT = 1024;

let kirbylUrl = {obj:'../models/obj/Kirby/source/Kirby1.obj', mtl:'../models/obj/Kirby/source/Kirby1.mtl'};
let objectList = []

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    //Fondo 
    createRing1();
    createIceCream()
    createCone()
    
    //objeto
    /*const loader = new OBJLoader();

    loader.load( '../models/obj/Kirby/source/Kirby1.obj', function ( glb ) {

        scene.add( glb );

    }, undefined, function ( error ) {

        console.error( error );

    } );*/

    update();
}
async function loadGLTF(gltfModelUrl)
{
    try
    {
        const gltfLoader = new GLTFLoader();

        const result = await gltfLoader.loadAsync(gltfModelUrl);

        const object = result.scene || result.scenes[0];

        object.position.y = -1;
        //object.rotation.y = Math.PI;
        object.rotation.x = Math.PI;
        object.scale.set(0.1, 0.1, 0.1);
        object.position.z = 50;
        object.rotation.z = Math.PI;
        scene.add(object); 
        console.log(object);
        
        document.onkeydown =function (e){
            if(e.keyCode == 37){
                object.position.x -= 1;
            }else if(e.keyCode == 39){
                object.position.x += 1;
            }
            else if(e.keyCode == 38){
                object.position.y += 1;
            }
            else if(e.keyCode == 40){
                object.position.y -= 1;
            }
        }
             
    }
    catch(err)
    {
        console.error(err);
    }
}
function createRing1(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0xd10fd1});
    cube = new THREE.Mesh(geometry, material);
    squares.push(cube);
    scene.add(cube);
}
function createRing2(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0x33aa99});
    cube2 = new THREE.Mesh(geometry, material);
    squares.push(cube2);
    scene.add(cube2);
}
function createRing3(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0xe8f05d});
    cube3 = new THREE.Mesh(geometry, material);
    squares.push(cube3);
    scene.add(cube3);
}
function createIceCream(){ //sphere with ice cream texture, it's the power up
    const textureUrl = "../images/lemon.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    let Material = new THREE.MeshPhongMaterial({map: texture});
    let geometry = new THREE.SphereGeometry(0.3,32,32);
    snow = new THREE.Mesh(geometry, Material);
    snow.position.z = 30;
    snow.position.x = -4;
    snow.position.y = 4;
    const light = new THREE.PointLight( 0xd4fffe, 1, 100 );
    light.position.set( 30, -2, -1 );
    scene.add( light );
    scene.add(snow);
}

function createCone(){ //Cone with crital texture, similar to a bullet, this is the obstacle
    const geometry = new THREE.ConeGeometry(1, 8, 9);
    const textureUrl = "../images/cristal.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({map: texture});
    box = new THREE.Mesh(geometry, material);
    box.rotation.x = Math.PI/1.89; 
    box.position.z = 30;
    box.position.x = 4;
    box.position.y= 4;
    scene.add(box);
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
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

    if(cube.position.z > 20 && squares.length<3)
        createRing2();
    if(cube.position.z > 40 && squares.length<4)
        createRing3();
    for(const ring of squares)
        if(ring.position.z > 60)
            ring.position.z = -10;
        else
            ring.position.z += 26*angle;
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
    //controls.update();
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
    const loader = new THREE.TextureLoader();
    loader.load('../images/nightskygalaxy.jpg' , function(texture)
            {
             scene.background = texture;  
            });

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 60;
    
    scene.add(camera);
    // Orbit controls 
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 3);
    scene.add(ambientLight);
    loadGLTF('../models/obj/Kirby.glb');

    //Obj kirbo
    //loadObjMtl(kirbylUrl, objectList);

 
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);