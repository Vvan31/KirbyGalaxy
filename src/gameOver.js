
import * as THREE from "../libs/three.js/three.module.js"

let score = localStorage.getItem('SCORE');
let highscore = localStorage.getItem('HSCORE');
let scene;

if (parseInt(score) >= parseInt(highscore)){
    localStorage.setItem('HSCORE', score);
}else if(highscore == null){
    localStorage.setItem('HSCORE', score);
}

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
    audioLoader.load( '../images/sound/Cursed.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.05 );
        sound.play();
    });
  }

  function createScene()
{   
    // Create a new Three.js scene
    scene = new THREE.Scene();
}

window.addEventListener('load' , () =>{
    document.getElementById('num_score').innerHTML = "Score: " + score
    document.getElementById('high_score').innerHTML = "HighScore: " + highscore
})

main() 