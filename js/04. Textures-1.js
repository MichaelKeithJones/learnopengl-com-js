(()=> {
    //------------------------------------------------------------------
    //--| Image Load / Initialization
    //------------------------------------------------------------------
    const img = new Image();
    img.crossOrigin = "";
    img.src = "/img/container.png";
    img.onload = () => { initializeWebGLStuff(); };

    function initializeWebGLStuff() {
        //------------------------------------------------------------------
        //--| Sources
        //------------------------------------------------------------------
        const vertexShaderSource = `
            attribute vec3 aPos;
            attribute vec3 aColor;
            attribute vec2 aTexCoord;
        
            varying vec4 vColor;
            varying vec2 vTexCoord;
        
            void main(void) {
                gl_Position = vec4(aPos, 1.0);
                vColor = vec4(aColor, 1.0);
                vTexCoord = aTexCoord;
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            
            varying vec4 vColor;
            varying vec2 vTexCoord;
            
            uniform sampler2D sampler;
        
            void main() {
                gl_FragColor = texture2D(sampler, vTexCoord);
                //gl_FragColor = vColor;
            }
        `;

        //------------------------------------------------------------------
        //--| Canvas / Window
        //------------------------------------------------------------------
        const canvas = document.querySelector('canvas');
        const gl = canvas.getContext('webgl');

        //------------------------------------------------------------------
        //--| Viewport ****** Look Here
        //------------------------------------------------------------------
        // canvas.width = img.width;
        // canvas.height = img.height;
        // gl.viewport(0,0, canvas.width,canvas.height);

        //------------------------------------------------------------------
        //--| Shader
        //------------------------------------------------------------------
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(program)); }

        //------------------------------------------------------------------
        //--| Geometry
        //------------------------------------------------------------------
        const points = [
             // positions      // colors        // texture coords
             0.5,  0.5, 0.0,   1.0, 0.0, 0.0,   1.0, 1.0, // top right
             0.5, -0.5, 0.0,   0.0, 1.0, 0.0,   1.0, 0.0, // bottom right
            -0.5, -0.5, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, // bottom left
            -0.5,  0.5, 0.0,   1.0, 1.0, 0.0,   0.0, 1.0  // top left
        ]; // Each 4 bytes

        let indices = new Uint16Array([
            0, 1, 3,
            1, 2, 3
        ]); // Each 2 byte

        let stride = 8 * Float32Array.BYTES_PER_ELEMENT;

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        let EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const vertexPosition = gl.getAttribLocation(program, 'aPos');
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(vertexPosition);

        let vertexColor = gl.getAttribLocation(program, "aColor");
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(vertexColor);

        const vertexTexCoord = gl.getAttribLocation(program, 'aTexCoord');
        gl.vertexAttribPointer(vertexTexCoord, 2, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(vertexTexCoord);

        //------------------------------------------------------------------
        //--| Texture
        //------------------------------------------------------------------
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(gl.getUniformLocation(program, 'sampler'), 0);

        //------------------------------------------------------------------
        //--| Render
        //------------------------------------------------------------------
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
    }
})();
