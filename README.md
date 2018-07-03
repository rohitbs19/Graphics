This is a series of 10 experimental projects of WEBGL and the canvas js api.

Running instructions: clone the Repo/download the zip and open it as project in an IDE (ex: Webstorm) or text editor, and use the 
preview tool to view the index.html or the main HTML file to see the animations.

p1: just involves a 2D animation which moves with your mouse movement.

p2: involves 2D animations and implements heirarchical modeling (space ship along with its rotors).
Makes use of the canvas element.

p3: involves simple 3D animations. Makes use of TWGL js matrix library. Contains a vanilla implementation of painter's algorithm 
and heirarchical modeling.

p4-p6: makes use of webgl. Similar to p3 but makes use of WEBGL and C Lang shader code. p6 and p5 contain procedural textures.
also implement, field of view, different camera angles, etc. Uses Z buffer of the Webgl (instead of painter's).
p6 contains some json object models. 
Also involves, diffuse lighting, ambient lighting and specular highlights (mostly in GLSL lang).

p7-p10: involves different texturing and lighting techniques. image textures, bump mapping, environment mapping, multiple textures, two phase, sky-box, heirarchical modeling,
and texture correcting features such as mipmapping and etc.
varied lighting forms and models (GLSL shader code). p7 - 10 incrementally builds the same theme. p10 also involves advanced hermite curves.
