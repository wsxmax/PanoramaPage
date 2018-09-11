# PanoramaPage
a Html Page to show a Pnorama Picture with drag controls and gyroscope support

this is a simple html page let you look around a panorama picture like in a skybox,
page requires a 2x3 matrix of textures of each suface of a cube formed in one single png.
and render a cube in webgl context and set the camera in center of the whole world space.

the form of the texture is described in "TextureForm.pdf" under the resources directory alone with a sample.

have to make clear, that I didnt write all the code myself of course,


THE glMatrix LIBRARY IS FROM http://glmatrix.net/


if you do better math, you may want to simplify the handle of gyroscope and drag event, where I did a bad job with 2 other matrices in vertex shader, but...

I dont recommend you changeing the rotation order of any of the matrices, since the DeviceOrientationEvent returns a form of Euler Angle data that may in some situation cause gimbal lock problem. please kindly tell me if you have better solution.

also 

don't laugh me at my code ordering, I'm not even a programmer orz.....
