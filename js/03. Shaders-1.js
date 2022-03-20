(()=> {
    //------------------------------------------------------------------
    //--| Sources
    //------------------------------------------------------------------
    const vertCode = `
            attribute vec3 aPos;

            varying vec4 vertexColor;

            void main() {
                gl_Position = vec4(aPos, 1.0);
                vertexColor = vec4(0.5, 0.0, 0.0, 1.0);
            }
        `;

    const fragCode =`
            precision mediump float;

             varying vec4 vertexColor;

            void main() {
                gl_FragColor = vertexColor;
            }
        `;

    //------------------------------------------------------------------
    //--| Canvas / Window
    //------------------------------------------------------------------
    const gl = document.getElementById('canvas').getContext('experimental-webgl');

    //------------------------------------------------------------------
    //--| Viewport
    //------------------------------------------------------------------
    gl.viewport(0,0,canvas.width,canvas.height);

    //------------------------------------------------------------------
    //--| Shader
    //------------------------------------------------------------------
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    //------------------------------------------------------------------
    //--| Geometry
    //------------------------------------------------------------------
    let vertices = [
        -0.5, -0.5, 0.0, // left
        0.5, -0.5, 0.0, // right
        0.0,  0.5, 0.0  // top
    ];

    let indices = [0,1,2];

    let VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    let attributeLocation = gl.getAttribLocation(shaderProgram, "aPos");
    gl.vertexAttribPointer(attributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //------------------------------------------------------------------
    //--| Main
    //------------------------------------------------------------------

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
})();