import * as THREE from "../libs/three.js/three.module.js"

let scene;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    loadMusic()
}

function loadMusic(){
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    scene.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../images/sound/oki doki boomer.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
    });
  }

  function createScene()
{   
    // Create a new Three.js scene
    scene = new THREE.Scene();
}

main() 