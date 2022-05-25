function resize()
{
    const canvas = document.getElementById("alloptions");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    resize(); 
};

window.addEventListener('resize', resize, false);