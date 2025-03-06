class Display {
    constructor() {
        // Create a canvas element and get its 2D context
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0; // Frame counter
        this.keys = []; // Array to store key states
        this.x = false; // Mouse/touch x-coordinate
        this.y = false; // Mouse/touch y-coordinate
        this.interval = null; // Interval for the game loop
    }

    start(width = 480, height = 270) {
        // Set canvas dimensions
        this.canvas.width = width;
        this.canvas.height = height;
        // Insert canvas into the document body
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        // Start the game loop
        this.interval = setInterval(() => this.updat(), 20);
        // Add event listeners for input
        this.addEventListeners();
    }

    addEventListeners() {
        // Keydown event to set key state to true
        window.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
        });
        // Keyup event to set key state to false
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });
        // Mousedown event to set mouse coordinates
        window.addEventListener('mousedown', (e) => {
            this.x = e.pageX;
            this.y = e.pageY;
        });
        // Mouseup event to reset mouse coordinates
        window.addEventListener('mouseup', () => {
            this.x = false;
            this.y = false;
        });
        // Touchstart event to set touch coordinates
        window.addEventListener('touchstart', (e) => {
            this.x = e.touches[0].pageX;
            this.y = e.touches[0].pageY;
        });
        // Touchend event to reset touch coordinates
        window.addEventListener('touchend', () => {
            this.x = false;
            this.y = false;
        });
    }

    clear() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    borderStyle(borderStyle) {
        // Set canvas border style
        this.canvas.style.borderStyle = borderStyle;
    }

    stop() {
        // Stop the game loop
        clearInterval(this.interval);
    }

    borderSize(borderSize) {
        // Set canvas border size
        this.canvas.style.borderSize = borderSize;
    }

    backgroundColor(color) {
        // Set canvas background color
        this.canvas.style.backgroundColor = color;
    }

    borderColor(color) {
        // Set canvas border color
        this.canvas.style.borderColor = color;
    }

    fontColor(color) {
        // Set canvas font color
        this.canvas.style.color = color;
    }

    scale(width, height) {
        // Scale the canvas dimensions
        this.canvas.width = width;
        this.canvas.height = height;
    }

    add(x) {
        // Add a component to the components array
        comm.push(x);
    }

    updat() {
        // Clear the canvas and update frame number
        this.clear();
        this.frameNo += 1;
        // Update and move each component
        
        try{
            update()
        }catch{
            //pass
        }
        comm.forEach(component => {
            component.move();
            component.update(this.context);
        });
    }
    
}

class Component {
    constructor(width = 0, height = 0, color = null, x = 0, y = 0, type) {
        this.width = width; // Component width
        this.height = height; // Component height
        this.color = color; // Component color or image source
        this.type = type; // Component type (e.g., "image", "text")
        this.angle = 0; // Rotation angle
        this.x = x; // X-coordinate
        this.y = y; // Y-coordinate
        this.speedX = 0; // Horizontal speed
        this.speedY = 0; // Vertical speed
        this.gravity = 0; // Gravity effect
        this.gravitySpeed = 0; // Gravity speed
        this.bounce = 0.6; // Bounce effect
        this.physics = false; // Physics enabled flag
        this.changeAngle = false; // Rotation enabled flag

        if (type === "image") {
            // Load image if type is "image"
            this.image = new Image();
            this.image.src = this.color;
        }
    }

    update(ctx = display.context) {
        if (this.type === "text") {
            // Draw text if type is "text"
            ctx.font = `${this.width} ${this.height}`;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.changeAngle) {
            // Rotate and draw component if changeAngle is true
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.angle);
            if (this.type === "image") {
                ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            }
            ctx.restore();
        } else {
            // Draw component without rotation
            if (this.type === "image") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
    moveAngle(){
        this.gravitySpeed += this.gravity
        this.x += this.speedX * Math.cos(this.angle);
        this.y += this.speedY * Math.sin(this.angle) + this.gravitySpeed;
    }
    move() {
        if (this.physics) {
            // Apply gravity and move component with physics
            this.gravitySpeed += this.gravity;
            this.x += this.speedX
            this.y += this.speedY + this.gravitySpeed;
        } else {
            // Move component without physics
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    hitBottom() {
        // Check if component hits the bottom of the canvas
        const rockbottom = display.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }

    stopMove() {
        // Stop component movement
        this.speedX = 0;
        this.speedY = 0;
    }

    clicked() {
        // Check if component is clicked
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const rotatedX = (display.x - centerX) * Math.cos(-this.angle) - (display.y - centerY) * Math.sin(-this.angle) + centerX;
        const rotatedY = (display.x - centerX) * Math.sin(-this.angle) + (display.y - centerY) * Math.cos(-this.angle) + centerY;

        const myleft = this.x;
        const myright = this.x + this.width;
        const mytop = this.y;
        const mybottom = this.y + this.height;
        let clicked = true;
        if ((mybottom < rotatedY) || (mytop > rotatedY) || (myright < rotatedX) || (myleft > rotatedX)) {
            clicked = false;
        }
        return clicked;
    }

    crashWith(otherobj) {
        // Check if component crashes with another object
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const otherCenterX = otherobj.x + otherobj.width / 2;
        const otherCenterY = otherobj.y + otherobj.height / 2;

        const rotatedX = (otherCenterX - centerX) * Math.cos(-this.angle) - (otherCenterY - centerY) * Math.sin(-this.angle) + centerX;
        const rotatedY = (otherCenterX - centerX) * Math.sin(-this.angle) + (otherCenterY - centerY) * Math.cos(-this.angle) + centerY;

        const myleft = this.x;
        const myright = this.x + this.width;
        const mytop = this.y;
        const mybottom = this.y + this.height;
        const otherleft = rotatedX - otherobj.width / 2;
        const otherright = rotatedX + otherobj.width / 2;
        const othertop = rotatedY - otherobj.height / 2;
        const otherbottom = rotatedY + otherobj.height / 2;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class Sound {
    constructor(src) {
        // Create an audio element for sound
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        // Play the sound
        this.sound.play();
    }

    stop() {
        // Stop the sound
        this.sound.pause();
    }
}
var display = new Display()
comm = []
