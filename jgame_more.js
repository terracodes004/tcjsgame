var move ={
    backward : function(id, steps){
        id.physics = true;
        id.speedX = -steps;
        id.speedY = -steps;
    },
    teleport : function(id, x, y){
        id.x = x
        id.y = y
    },
    setX : function(id, x){
        id.x = x;
    },
    setY : function(id, y){
        id.y = y;
    },
    stamp : function(id){
        const stamped = new Component(id.width, id.height, id.color, id.x, id.y, id.type)
        
        return stamped;
    },
    circle : function(id, speed){
        id.physics = true;
        id.changeAngle = true
        id.angle = speed * Math.PI / 180;
    },
    dot : function(id){
        var ctx = display.context
        ctx.beginPath();
        ctx.arc(id.x,id.y,0,0,2*Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();
    },
    clearStamp : function(id){
        id.update = false;
    },
    turnLeft : function(id, steps){
        id.changeAngle = true
        id.angle += steps
    },
    turnLeft : function(id, steps){
        id.changeAngle = true
        id.angle += -steps;
    },
    bound : function(id){
        if (id.x <= 0){
            id.x = 0;
        }
        if (id.x >= display.canvas.width){
            id.x = display.canvas.width;
        }
    },
    hitObject : function(id, otherid){
        id.physics = true;
        if((id.crashWith(otherid)) && (id.y <= otherid)){
            id.gravitySpeed = -(id.gravitySpeed * id.bounce);
        }
    },
    glideX : function(id,t, x){
        time = t
        dis = Math.sqrt(Math.pow(id.x-x,2))
        tim = 1000 * time
        time = time * 5
        speed = dis/time
        vc = 1
        ////console.log(speed)
        //console.log("fh")
                if (id.x > x) {
                    id.speedX = -1*speed
                } else{
                    id.speedX = 1*speed

                }
                
           setTimeout(() => {
                id.speedX = 0
                ////console.log("gfhj")
                vc = 0
           }, time);
           
           
        
        
    },
    glideY : function(id,t, y){
        time = t
        dis = Math.sqrt(Math.pow(id.y-y,2))
        tim = 1000 * time
        time = time * 5
        speed = dis/time
        vc = 1
        ////console.log(speed)
        ////console.log("fh")
                if (id.y > y) {
                    id.speedY = -1*speed
                } else{
                    id.speedY = 1*speed

                }
                
           setTimeout(() => {
                id.speedY = 0
                ////console.log("gfhj")
                vc = 0
           }, time);
           
           
        
        
    },
    glideTo: function (id,t, x,y){
        this.glideX(id,t, x )
        this.glideY(id, t, y)
    },
    project : function(id, initialVelocity, angle, gravity) {
        // Convert angle to radians
        let radianAngle = angle * Math.PI / 180;
        
        // Calculate the initial velocity components
        let velocityX = initialVelocity * Math.cos(radianAngle);
        let velocityY = initialVelocity * Math.sin(radianAngle);
        
        // Set the object's initial speed
        id.speedX = velocityX;
        id.speedY = -velocityY; // Negative because upward direction is negative in canvas
    
        // Update the object's position over time
        let updatePosition = () => {
            id.speedY += gravity; // Apply gravity to the vertical speed
            id.x += id.speedX;
            id.y += id.speedY;
    
            // Check for collision with the ground
            if (id.y >= display.canvas.height - id.height) {
                id.y = display.canvas.height - id.height;
                id.speedY = -(id.speedY * id.bounce); // Apply bounce effect
            }
    
            // Continue updating the position
            if (id.y < display.canvas.height - id.height || id.speedY !== 0) {
                requestAnimationFrame(updatePosition);
            }
        };
    
        // Start updating the position
        updatePosition();
    },
    pointTo : function(id, targetX, targetY) {
        // Calculate the difference in coordinates
        let deltaX = targetX - id.x;
        let deltaY = targetY - id.y;
    
        // Calculate the angle in radians
        let angleRadians = Math.atan2(deltaY, deltaX);
    
        // Set the component's angle
        id.angle = angleRadians;
    }
    
    

}
var state = {
    distance : function(id, otherid){
        dis = Math.sqrt((Math.pow(id.x-otherid.x,2))+(Math.pow(id.y-otherid.y,2)))
        return dis;
    },
    rect : function(id){
        return [id.x, id.y, id.width, id.height]
    },
    physics :  function(id){
        return id.physics
    },
    changeAngle :  function(id){
        return id.changeAngle
    },
    Angle :  function(id){
        return id.angle
    },
    pos :  function(id){
        return id.x+' '+id.y
    }
}
class Sprite {
    constructor(image, frameWidth, frameHeight, frameCount, frameSpeed) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    update() {
        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx, x, y) {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth,
            this.frameHeight
        );
    }
}
