 TCJSgame v2 Documentation        window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-1QT8QNR621');  body { background: #1e1e1e; color: #d4d4d4; font-family: 'Fira Mono', 'Courier New', Courier, monospace; margin: 0; } header, main { max-width: 900px; margin: auto; } header { padding: 2rem 0 1rem 0; text-align: center; } h1, h2, h3 { color: #4fc3f7; } code, pre { background: #232323; color: #fff; border-radius: 4px; padding: 2px 6px; } pre { padding: 1em; overflow-x: auto; } section { margin-bottom: 2em; } .example { background: #232323; border-radius: 6px; padding: 1em; margin: 1em 0; } .param-table { width: 100%; border-collapse: collapse; margin-bottom: 1em; } .param-table th, .param-table td { border: 1px solid #444; padding: 6px 10px; } .param-table th { background: #333; } .note { color: #ffb300; } a { color: #4fc3f7; } .live-demo { background: #181818; border-radius: 6px; padding: 1em; margin: 1em 0; } iframe { width: 100%; height: 350px; border: none; background: #111; }

![TCJSgame](/img/icon.jpg)

TCJSgame v2 Documentation
=========================

**Version:** 2.0 | **Date:** March 12, 2025

A lightweight JavaScript game engine for 2D games with canvas rendering.

[Download tcjsgamev2.js](https://tcjsgame.vercel.app/mat/tcjsgamev2.js)

*   [Home](/index.html)
*   [About](/about.html)
*   [Documentation](/doc.html)
*   [Download](/download.html)

Getting Started
---------------

Include the TCJSgame v2 library in your HTML:

<script src="https://tcjsgame.vercel.app/mat/tcjsgamev2.js"></script>

Then you can use the `Display`, `Component`, `move`, `state`, and other classes/functions in your scripts.

Display
-------

Manages the game canvas, rendering, input, and game loop.

### Constructor

new Display()

### Methods

Method

Parameters

Description

`start(width, height, parent)`

width (number, default 480)  
height (number, default 270)  
parent (HTMLElement, default document.body)

Initializes and displays the canvas, starts the game loop.

`add(component)`

component (Component)

Adds a component to the game.

`stop()`

Stops the game loop.

`backgroundColor(color)`

color (string)

Sets the canvas background color.

`borderStyle(style)`

style (string)

Sets the canvas border style.

Component
---------

Represents a game object (player, enemy, obstacle, etc).

### Constructor

new Component(width, height, color, x, y, type)

Parameter

Type

Description

width

number

Width of the component

height

number

Height of the component

color

string

Color or image source

x

number

X position

y

number

Y position

type

string

"rect", "image", or "text"

### Properties

*   `speedX`, `speedY`: Movement speed
*   `gravity`: Gravity effect
*   `bounce`: Bounce factor
*   `physics`: Enable physics
*   `angle`: Rotation angle (radians)

### Methods

*   `move()`: Updates position based on speed and gravity
*   `update(ctx)`: Draws the component
*   `crashWith(other)`: Collision detection
*   `clicked()`: Returns true if clicked/touched

move Object
-----------

Utility functions for moving and manipulating components.

Function

Parameters

Description

`move.accelerate(id, accelX, accelY, maxSpeedX, maxSpeedY)`

id (Component), accelX (number), accelY (number),  
maxSpeedX (number, optional), maxSpeedY (number, optional)

Accelerates a component, clamped to max speed.

`move.decelerate(id, decelX, decelY)`

id (Component), decelX (number), decelY (number)

Decelerates a component towards zero speed.

`move.position(id, direction, offset)`

id (Component), direction (string), offset (number, optional)

Positions a component at "top", "bottom", "left", "right", or "center".

`move.project(id, velocity, angle, gravity)`

id (Component), velocity (number), angle (degrees), gravity (number)

Projectile motion for a component.

state Object
------------

Utility functions for querying component state.

Function

Parameters

Description

`state.distance(id, otherid)`

id (Component), otherid (Component)

Returns the distance between two components.

`state.rect(id)`

id (Component)

Returns \[x, y, width, height\] of the component.

`state.physics(id)`

id (Component)

Returns true if physics is enabled.

Example: Simple Player Movement
-------------------------------

<script src="https://tcjsgame.vercel.app/mat/tcjsgamev2.js"></script>
<script>
const display = new Display();
display.start(600, 300);
const player = new Component(30, 30, "blue", 100, 100, "rect");
display.add(player);

function update() {
    if (display.keys\[37\]) move.accelerate(player, -0.5, 0, 5); // Left arrow
    else if (display.keys\[39\]) move.accelerate(player, 0.5, 0, 5); // Right arrow
    else move.decelerate(player, 0.3, 0);

    if (display.keys\[38\]) move.accelerate(player, 0, -0.5, 5); // Up arrow
    else if (display.keys\[40\]) move.accelerate(player, 0, 0.5, 5); // Down arrow
    else move.decelerate(player, 0, 0.3);
}
</script>
            

Use arrow keys to move the blue square.

Example: Flappy Bird Clone
--------------------------

<script src="https://tcjsgame.vercel.app/mat/tcjsgamev2.js"></script>
<script>
const display = new Display();
display.start(480, 320);
const bird = new Component(30, 30, "yellow", 100, 150, "rect");
bird.gravity = 0.5;
bird.bounce = 0;
bird.physics = true;
display.add(bird);

let pipes = \[\];
let score = 0;

function createPipe() {
    const gap = 90;
    const topHeight = Math.random() \* 120 + 40;
    const bottomY = topHeight + gap;
    const bottomHeight = display.canvas.height - bottomY;
    const topPipe = new Component(40, topHeight, "green", display.canvas.width, 0, "rect");
    const bottomPipe = new Component(40, bottomHeight, "green", display.canvas.width, bottomY, "rect");
    topPipe.speedX = -2;
    bottomPipe.speedX = -2;
    pipes.push(topPipe, bottomPipe);
    display.add(topPipe);
    display.add(bottomPipe);
}

function update() {
    if (display.frameNo % 90 === 1) createPipe();
    pipes.forEach(pipe => {
        if (bird.crashWith(pipe)) {
            display.stop();
            alert("Game Over! Score: " + score);
        }
    });
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    score = Math.floor(display.frameNo / 60);
}

window.addEventListener('keydown', e => {
    if (e.keyCode === 32) { // Spacebar
        bird.gravitySpeed = -8;
    }
});
</script>
            

Press Spacebar to flap. Avoid the pipes!

More
----

*   See [tcjsgame.vercel.app](https://tcjsgame.vercel.app) for more examples and downloads.
*   Inspired by [jgame-doc.vercel.app](https://jgame-doc.vercel.app).
