'use strict';

var Demo;

function Init() {
    var canvas = document.getElementById('glCanvas');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('Failed to get WebGL context');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL ');
        return;
    }

    Demo = new SceneEx(gl);
    console.log('load');
    Demo.Load();
        console.log('done with load');
    Demo.Begin();


}