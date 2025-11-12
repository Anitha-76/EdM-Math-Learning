// p5.js sketch - Basic drawing example
let x, y;
let speedX, speedY;
let colors = [];

function setup() {
    // Create canvas and attach to container
    let canvas = createCanvas(800, 600);
    canvas.parent('sketch-container');
    //set background color to black
    background(0);
    // Initialize variables
    x = width / 2;
    y = height / 2;
    speedX = random(-3, 3);
    speedY = random(-3, 3);
    
    // Create array of random colors
    colors = [
        color(255, 100, 100), // Red
        color(100, 255, 100), // Green
        color(100, 100, 255), // Blue
        color(255, 255, 100), // Yellow
        color(255, 100, 255), // Magenta
        color(100, 255, 255)  // Cyan
    ];
    
    // Set background
    background(240);
}

function draw() {
    //  Clear background with slight transparency for trail effect
    //draw a moving square based on the mouse position  with a random color
    fill(random(255), random(255), random(255));
    rect(mouseX, mouseY, 50, 50);
    background(240, 240, 240, 25);
    
    // Update position
    x += speedX;
    y += speedY;
    
    // Bounce off edges
    if (x <= 0 || x >= width) {
        speedX *= -1;
    }
    if (y <= 0 || y >= height) {
        speedY *= -1;
    }
    
    // Keep within bounds
    x = constrain(x, 0, width);
    y = constrain(y, 0, height);
    
    // Draw bouncing circle
    //fill(colors[frameCount % colors.length]);
    //noStroke();
    //ellipse(x, y, 50, 50);
    
    // Draw some static shapes
    drawStaticShapes();
    
    // Add some interactive elements
    if (mouseIsPressed) {
        drawMouseTrail();
    }
}

function drawStaticShapes() {
    // Draw some background shapes
    push();
    fill(200, 200, 200, 50);
    noStroke();
    
    // Draw some rectangles
    for (let i = 0; i < 5; i++) {
        rect(i * 150 + 50, 50, 80, 80);
    }
    
    // Draw some triangles
    for (let i = 0; i < 4; i++) {
        triangle(i * 200 + 100, 500, i * 200 + 50, 550, i * 200 + 150, 550);
    }
    
    pop();
}

function drawMouseTrail() {
    // Draw trail when mouse is pressed
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(mouseX, mouseY, 20, 20);
}

function mousePressed() {
    // Change direction when clicked
    speedX = random(-5, 5);
    speedY = random(-5, 5);
}

function keyPressed() {
    // Reset when spacebar is pressed
    if (key === ' ') {
        x = width / 2;
        y = height / 2;
        speedX = random(-3, 3);
        speedY = random(-3, 3);
        background(240);
    }
}

