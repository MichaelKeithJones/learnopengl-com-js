(()=> {
    //------------------------------------------------------------------
    //--| Canvas / Window
    //------------------------------------------------------------------
    const gl = document.getElementById('canvas').getContext('experimental-webgl');

    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
})();