"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import {addMouseHandler} from "../libs/sceneHandlers.js"
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';
import { OBJLoader  } from '../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/loaders/MTLLoader.js';


let renderer = null, scene = null, camera = null
let controls = null;
const duration = 5000; // ms
let currentTime = Date.now();
let squares = [];
let cube;
let cube2;
//Ejemplos clase
let SHADOW_MAP_WIDTH = 1024, SHADOW_MAP_HEIGHT = 1024;

let kirbylUrl = {obj:'../models/obj/Kirbysentado.obj', mtl:'../models/obj/Kirbysentado.mtl'};
let objectList = []

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    //Fondo 
    createSquare();

    //objeto
    const loader = new OBJLoader();

    loader.load( '../models/obj/Kirby.obj', function ( glb ) {

        scene.add( glb.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    update();
}
function createSquare(){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    cube = new THREE.Mesh(geometry, material);
    squares.push(cube);
    scene.add(cube);
}
function createSquare2(){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    cube2 = new THREE.Mesh(geometry, material);
    squares.push(cube2);
    scene.add(cube2);
}
function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

/* async function loadJson(url, objectList)
{
    try 
    {
        const object = await new THREE.ObjectLoader().loadAsync(url, onProgress, onError);

        object.castShadow = true;
        object.receiveShadow = false;

        object.position.y = -1;
        object.position.x = 1.5;

        object.name = "jsonObject";

        objectList.push(object);
        scene.add(object);
    }
    catch (err) 
    {
        return onError(err);
    }
} */

async function loadObj(objModelUrl, objectList)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);

        let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log(object);
        
        // object.traverse(function (child) 
        // {
            for(const child of object.children)
            {
                //     if (child.isMesh)
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        // });

        object.scale.set(10, 10, 10);
        object.position.z = -1;
        object.position.x = -1.5;
        object.rotation.y = -3;
        object.rotation.x = 3.1416;
        object.name = "objObject";
        
        objectList.push(object);
        scene.add(object);
    }
    catch (err) 
    {
        onError(err);
    }
}

async function loadObjMtl(objModelUrl, objectList)
{
    try
    {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();
        
        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);

        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);
    
        object.traverse(function (child) {
            if (child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        console.log(object);

        object.position.y += -5;
        object.scale.set(1.15, 1.15, 1.15);
        object.rotation.y = 600;
        object.rotation.x = -75;

        objectList.push(object);
        scene.add(object);
    }
    catch (err)
    {
        onError(err);
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
    for(const cube of squares)
        if(cube.position.z > 30)
            createSquare2();
        if(cube.position.z > 60)
            cube.position.z = 10;
        cube.position.z += 7*angle;
        console.log(cube.position.z);
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
    

    //Obj kirbo
    //loadObjMtl(kirbylUrl, objectList);

 
    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, solarSystemGroup);
}

main();