# What is THAUMATOGENESIS?

Thaumatogenesis is a web game that I (BlueEyedFoxUnderscore) have been developing. Currently, it has no actual gameplay. However, in the future, it is planned to have a full storyline as well as consistent gameplay.

Thaumatogenesis, being in early stages, is currently *very* unstable. As in, I have several glitches I still need to fix. I invite you to playtest and open issues, and, if you really want, steal my code. Yes. I want you, to steal my code. Just credit me if you do.

## Inspirations

Thaumatogenesis was inspired by [corru.observer](https://corru.observer), which is a web game that you have no excuse not to play if you are reading this on a sufficiently large monitor. 

Like corru.observer, this is going to be fully rendered using CSS. Unlike corru.observer, I am planning to eventually add an OpenGL *mode*, as well as shading using SSFD (surface stable fractal dithering). I'm borrowing some from that art style, but since Thaumatogenesis has open movement, I'm having to adapt some things (including having fully 3d objects instead of just 2.5d ones).

## The Way Things Work

Currently, Thaumatogenesis is powered by an (at least working) CSS camera, and a fuckton of transforms. There's also a 2d layer above it to support identity boxes and the like. Go take a look at the code if you want. I've included explanations for things in the JS files, but HTML is a different story.

## My Stance on AI

I have not, and probably will never, use AI for this project. This is because 1) it produces bad code, 2\) it is horrible for the environment, 3\) I don't like how it's trained, 4\) I'm good enough on my own, thank you, and 5\) this is art, why would I want something to do it for me?

If you do make a pull request and include AI code, I might not notice. That's why, if you do pull request, I ask you to put your name on the bugfix or patch you add in a comment, for easier tracking through commits. If you don't, I'll put your username next to it for you.

# Where You Can Support Me:

Nowhere (yet). And I wouldn't expect you to since, well, this is just a test scene.

## My Other Work

\[nothing, yet ::(\]

# TODO:

(for next micro version)
1) Bugfixes

(for next minor version)
1) Implement identboxes fully
2) Add sidebars and dialogue system
3) Add settings for keybinds and sensitivity
4) Add buttons for mobile compatibility

(for next major version)
1) Implement first scene (authbot scene)
2) Add compatibility for multiple scenes and cutscenes
3) Add console-like interface javascript/html
4) Add saving
5) Add inventory basic
6) Add hands display

(far off in the future)
1) VR compatibility (because I like VR ::\))
2) Implement Surface Stable Fractal Dithering
3) Add textures
4) Add OpenGL renderer

## Patchnotes:

- Added Oh So Many Matrices
    - Added rotation matrices (x), (y), (z)
    - Added translation matrix (x, y, z)
    - Added shear matrix (xy, xz, yx, yz, zx, zy)
    - Added scale matrix (x, y, z)
    - Added identity matrix ()
    - Added zero matrix ()
    - Added transpose function (mat)
- Fixed getTotalTransform
    - Transforms now apply in the correct order
    - Matrixes are no longer cut off at the last digit
- Fixed camera to always start at origin and not shift based on view size
    - In JavaScript, the translation of the camera is adjusted based on viewwidth
- Fixed perspective
- Fixed scene-container not being locked at zero
    - .object CSS and Less classes now have height: 0px and width: 0px instead of height: 100px and width: 100px
- Remade test-cube to be more consistent with transforms
    - The cube now uses ::after to represent the faces and the face object itself to apply transforms.
- Commented code
- Added extra matrix functions
    - Added transpose
    - Added toHomogenous, toCartesian
    - Added multiplication of a vector by a matrix and a matrix by a vector
- Set up a transform test
- Fixed fromMatrix3d messing up the last digit of the matrix