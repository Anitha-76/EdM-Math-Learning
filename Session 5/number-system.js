// p5.js Number System Converter - Fractions, Decimals, and Whole Numbers
let currentExample = 0;
let examples = [
    {fraction: "1/2", decimal: 0.5, whole: null, description: "Half a pizza"},
    {fraction: "3/4", decimal: 0.75, whole: null, description: "Three quarters"},
    {fraction: "2/1", decimal: 2.0, whole: 2, description: "Two whole items"},
    {fraction: "4/8", decimal: 0.5, whole: null, description: "Four out of eight slices"},
    {fraction: "18/20", decimal: 0.9, whole: null, description: "18 out of 20 students passed"},
    {fraction: "1/3", decimal: 0.333, whole: null, description: "One third (repeating)"}
];

let animationPhase = 0;
let animationSpeed = 0.02;
let showConversion = false;

function setup() {
    let canvas = createCanvas(1000, 1000); // Increased height to accommodate all sections
    canvas.parent('sketch-container');
    background(245);
    
    // Set a child-friendly font
    textFont('Comic Sans MS');
    
    // Create buttons
    createButtons();
}

function draw() {
    background(245);
    
    // Draw title
    drawTitle();
    
    // Draw lesson objective
    drawLessonObjective();
    
    // Draw current example
    drawCurrentExample();
    
    // Draw fraction bar visualization
    drawFractionBar();
    
    // Draw decimal representation
    drawDecimalRepresentation();
    
    // Draw whole number representation
    drawWholeNumberRepresentation();
    
    // Draw conversion steps
    if (showConversion) {
        drawConversionSteps();
    }
    
    // Draw controls
    drawControls();
    
    // Animate
    animationPhase += animationSpeed;
}

function drawTitle() {
    // Draw colorful background for title
    fill(240, 248, 255);
    stroke(100, 150, 200);
    strokeWeight(3);
    rect(50, 20, 900, 60);
    
    fill(50);
    textAlign(CENTER);
    textSize(24);
    textStyle(BOLD);
    text("🔢 Number System Converter", width/2, 45);
    
    textSize(16);
    textStyle(NORMAL);
    text("Learn about Fractions, Decimals, and Whole Numbers!", width/2, 65);
}

function drawLessonObjective() {
    // Draw lesson objective box
    fill(255, 248, 220);
    stroke(200, 180, 100);
    strokeWeight(2);
    rect(50, 90, 900, 60);
    
    fill(50);
    textAlign(CENTER);
    textSize(18);
    textStyle(BOLD);
    text("🎯 Learning Objective", width/2, 110);
    
    textSize(14);
    textStyle(NORMAL);
    text("Students will learn to identify and convert numbers between fractions, decimals, and whole numbers", width/2, 130);
    text("and understand how these different representations show the same value!", width/2, 150);
}

function drawCurrentExample() {
    let example = examples[currentExample];
    
    // Draw example box with background - moved down to accommodate controls
    fill(255, 255, 200);
    stroke(200, 200, 100);
    strokeWeight(2);
    rect(50, 280, 900, 70); // Moved from y=200 to y=280
    
    fill(30);
    textAlign(CENTER);
    textSize(18);
    textStyle(BOLD);
    text("📝 " + example.description, width/2, 305); // Moved from y=225 to y=305
    
    // Draw the three representations with colorful backgrounds - centered in yellow box
    // Calculate center positions for the three boxes
    let boxWidth = 150;
    let boxHeight = 25;
    let totalWidth = (boxWidth * 3) + (20 * 2); // 3 boxes + 2 gaps of 20px
    let startX = (width - totalWidth) / 2; // Center the group
    
    // Fraction
    fill(200, 220, 255);
    stroke(100, 150, 200);
    strokeWeight(2);
    rect(startX, 320, boxWidth, boxHeight); // Moved from y=240 to y=320
    
    fill(70, 130, 180);
    textAlign(CENTER);
    textSize(14);
    textStyle(BOLD);
    text("Fraction: " + example.fraction, startX + boxWidth/2, 337); // Moved from y=257 to y=337
    
    // Decimal
    fill(255, 200, 200);
    stroke(200, 100, 100);
    strokeWeight(2);
    rect(startX + boxWidth + 20, 320, boxWidth, boxHeight); // Moved from y=240 to y=320
    
    fill(220, 20, 60);
    text("Decimal: " + example.decimal, startX + boxWidth + 20 + boxWidth/2, 337); // Moved from y=257 to y=337
    
    // Whole Number
    fill(200, 255, 200);
    stroke(100, 200, 100);
    strokeWeight(2);
    rect(startX + (boxWidth + 20) * 2, 320, boxWidth, boxHeight); // Moved from y=240 to y=320
    
    fill(34, 139, 34);
    text("Whole: " + (example.whole !== null ? example.whole : "Not possible"), startX + (boxWidth + 20) * 2 + boxWidth/2, 337); // Moved from y=257 to y=337
}

function drawFractionBar() {
    let example = examples[currentExample];
    let barWidth = 500;
    let barHeight = 80;
    let barX = width/2 - barWidth/2;
    let barY = 410; // Moved further down to accommodate controls
    
    // Draw title with background
    fill(255, 240, 200);
    stroke(200, 180, 100);
    strokeWeight(2);
    rect(barX, barY - 35, barWidth, 30);
    
    fill(30);
    textAlign(CENTER);
    textSize(16);
    textStyle(BOLD);
    text("🍕 Fraction Bar - See the Parts!", width/2, barY - 15);
    
    // Draw fraction bar background
    fill(255);
    stroke(100);
    strokeWeight(3);
    rect(barX, barY, barWidth, barHeight);
    
    // Calculate fraction parts
    let parts = parseInt(example.fraction.split('/')[1]);
    let filled = parseInt(example.fraction.split('/')[0]);
    
    // Draw fraction parts with better colors
    let partWidth = barWidth / parts;
    for (let i = 0; i < parts; i++) {
        if (i < filled) {
            fill(100, 200, 255, 220);
        } else {
            fill(240, 240, 240, 150);
        }
        noStroke();
        rect(barX + i * partWidth, barY, partWidth, barHeight);
        
        // Draw dividing lines
        stroke(100);
        strokeWeight(2);
        line(barX + i * partWidth, barY, barX + i * partWidth, barY + barHeight);
        
        // Add part numbers
        fill(50);
        textAlign(CENTER);
        textSize(14);
        text(i + 1, barX + i * partWidth + partWidth/2, barY + barHeight/2 + 5);
    }
    
    // Draw fraction labels with background - moved further down
    fill(255, 255, 200);
    stroke(200, 200, 100);
    strokeWeight(2);
    rect(barX, barY + barHeight + 20, barWidth, 30);
    
    fill(50);
    textAlign(CENTER);
    textSize(16);
    textStyle(BOLD);
    text("Fraction: " + example.fraction, barX + barWidth/2, barY + barHeight + 40);
    
    // Draw explanation - moved further down
    fill(50);
    textSize(13);
    textStyle(NORMAL);
    text("💡 " + filled + " out of " + parts + " parts are colored blue!", barX + barWidth/2, barY + barHeight + 60);
    
    // Draw equivalent fractions if applicable - moved further down
    if (example.fraction === "4/8") {
        text("✨ This is the same as 1/2 (simplified)!", barX + barWidth/2, barY + barHeight + 80);
    }
}

function drawDecimalRepresentation() {
    let example = examples[currentExample];
    let startX = width/2 - 300;
    let startY = 610; // Moved further down to accommodate controls
    
    // Draw title with background
    fill(255, 200, 200);
    stroke(200, 100, 100);
    strokeWeight(2);
    rect(startX, startY - 25, 300, 25);
    
    fill(30);
    textAlign(LEFT);
    textSize(16);
    textStyle(BOLD);
    text("🔢 Decimal Place Values", startX + 10, startY - 5);
    
    // Draw place value chart with better styling
    let placeValues = ["Ones", "Tenths", "Hundredths", "Thousandths"];
    let values = example.decimal.toString().split('.');
    let wholePart = values[0];
    let decimalPart = values[1] || "0";
    
    // Pad decimal part
    while (decimalPart.length < 3) {
        decimalPart += "0";
    }
    
    let digits = wholePart + decimalPart;
    
    for (let i = 0; i < 4; i++) {
        let x = startX + i * 80;
        let y = startY + 10;
        
        // Draw place value box with better colors
        fill(255, 220, 220);
        stroke(200, 100, 100);
        strokeWeight(3);
        rect(x, y, 70, 50);
        
        // Draw digit
        fill(50);
        textAlign(CENTER);
        textSize(24);
        textStyle(BOLD);
        text(digits[i], x + 35, y + 30);
        
        // Draw place value label
        fill(100);
        textSize(12);
        textStyle(NORMAL);
        text(placeValues[i], x + 35, y + 65);
    }
    
    // Show conversion with colorful background - moved further down to avoid overlap
    fill(255, 240, 240);
    stroke(200, 150, 150);
    strokeWeight(2);
    rect(startX, startY + 100, 300, 50); // Moved from +70 to +100
    
    fill(50);
    textAlign(LEFT);
    textSize(13);
    text("💡 Conversion: " + example.fraction + " = " + example.decimal, startX + 10, startY + 120); // Moved from +90 to +120
    
    // Add step-by-step calculation
    let numerator = parseInt(example.fraction.split('/')[0]);
    let denominator = parseInt(example.fraction.split('/')[1]);
    text("📐 Step: " + numerator + " ÷ " + denominator + " = " + example.decimal, startX + 10, startY + 140); // Moved from +110 to +140
}

function drawWholeNumberRepresentation() {
    let example = examples[currentExample];
    let startX = width/2 + 50;
    let startY = 610; // Moved further down to accommodate controls
    
    // Draw title with background
    fill(200, 255, 200);
    stroke(100, 200, 100);
    strokeWeight(2);
    rect(startX, startY - 25, 250, 25);
    
    fill(30);
    textAlign(LEFT);
    textSize(16);
    textStyle(BOLD);
    text("🔢 Whole Number Check", startX + 10, startY - 5);
    
    if (example.whole !== null) {
        // Draw whole number representation with celebration
        fill(150, 255, 150);
        stroke(100, 200, 100);
        strokeWeight(3);
        rect(startX, startY + 10, 150, 70);
        
        fill(50);
        textAlign(CENTER);
        textSize(24);
        textStyle(BOLD);
        text("✅ " + example.whole, startX + 75, startY + 40);
        
        textSize(14);
        textStyle(NORMAL);
        text("whole items!", startX + 75, startY + 60);
    } else {
        // Draw not possible with clear explanation
        fill(255, 200, 200);
        stroke(200, 100, 100);
        strokeWeight(3);
        rect(startX, startY + 10, 150, 70);
        
        fill(50);
        textAlign(CENTER);
        textSize(14);
        textStyle(BOLD);
        text("❌ Not a", startX + 75, startY + 35);
        text("whole number", startX + 75, startY + 55);
    }
    
    // Show reasoning with colorful background - aligned with left side conversion box
    fill(255, 255, 200);
    stroke(200, 200, 100);
    strokeWeight(2);
    rect(startX, startY + 100, 250, 50); // Moved from +120 to +100 to align with left box
    
    fill(50);
    textAlign(LEFT);
    textSize(13);
    if (example.whole !== null) {
        text("✅ Decimal part = 0", startX + 10, startY + 120); // Moved from +140 to +120
        text("✅ Can be written as " + example.whole + "/1", startX + 10, startY + 140); // Moved from +160 to +140
    } else {
        text("❌ Decimal part ≠ 0", startX + 10, startY + 120); // Moved from +140 to +120
        text("❌ Cannot be a whole number", startX + 10, startY + 140); // Moved from +160 to +140
    }
}

function drawConversionSteps() {
    let example = examples[currentExample];
    let startX = 50;
    let startY = 810; // Moved further down to accommodate controls
    
    // Draw main background
    fill(240, 240, 255);
    stroke(150, 150, 200);
    strokeWeight(3);
    rect(startX, startY - 15, 900, 200);
    
    fill(30);
    textAlign(LEFT);
    textSize(16);
    textStyle(BOLD);
    text("📚 Step-by-Step Conversion Guide", startX + 20, startY + 5);
    
    textSize(13);
    textStyle(NORMAL);
    
    // Step 1: Fraction to Decimal
    fill(255, 240, 240);
    stroke(200, 150, 150);
    strokeWeight(2);
    rect(startX + 20, startY + 20, 400, 45);
    
    fill(50);
    text("1️⃣ Convert Fraction to Decimal:", startX + 30, startY + 35);
    let numerator = parseInt(example.fraction.split('/')[0]);
    let denominator = parseInt(example.fraction.split('/')[1]);
    text("   " + example.fraction + " = " + numerator + " ÷ " + denominator, startX + 30, startY + 50);
    text("   = " + example.decimal, startX + 30, startY + 65);
    
    // Step 2: Check for whole number
    fill(240, 255, 240);
    stroke(150, 200, 150);
    strokeWeight(2);
    rect(startX + 20, startY + 75, 400, 45);
    
    fill(50);
    text("2️⃣ Check if it's a Whole Number:", startX + 30, startY + 90);
    if (example.whole !== null) {
        text("   " + example.decimal + " has no decimal part", startX + 30, startY + 105);
        text("   ✅ It IS a whole number: " + example.whole, startX + 30, startY + 120);
    } else {
        text("   " + example.decimal + " has a decimal part", startX + 30, startY + 105);
        text("   ❌ It is NOT a whole number", startX + 30, startY + 120);
    }
    
    // Step 3: Summary
    fill(255, 255, 200);
    stroke(200, 200, 100);
    strokeWeight(2);
    rect(startX + 20, startY + 130, 400, 25);
    
    fill(50);
    text("3️⃣ Summary: " + example.fraction + " = " + example.decimal + (example.whole ? " = " + example.whole : ""), startX + 30, startY + 147);
}

function drawControls() {
    // Draw example selector with better styling - moved much further down to avoid overlap
    fill(240, 240, 240);
    stroke(100);
    strokeWeight(2);
    rect(50, 170, 200, 30); // Moved from y=110 to y=170
    
    fill(50);
    textAlign(CENTER);
    textSize(14);
    textStyle(BOLD);
    text("Example " + (currentExample + 1) + " of " + examples.length, 150, 190); // Moved from y=130 to y=190
    
    // Draw big, colorful buttons with clear labels - moved much further down
    // Previous button
    fill(255, 150, 150);
    stroke(200, 100, 100);
    strokeWeight(3);
    rect(50, 210, 70, 35); // Moved from y=150 to y=210
    
    fill(255);
    textAlign(CENTER);
    textSize(12);
    textStyle(BOLD);
    text("← BACK", 85, 230); // Moved from y=170 to y=230
    
    // Next button
    fill(150, 255, 150);
    stroke(100, 200, 100);
    strokeWeight(3);
    rect(130, 210, 70, 35); // Moved from y=150 to y=210
    
    fill(255);
    text("NEXT →", 165, 230); // Moved from y=170 to y=230
    
    // Convert button - change color when active
    if (showConversion) {
        fill(100, 100, 255); // Darker blue when active
        stroke(50, 50, 150);
    } else {
        fill(150, 150, 255); // Light blue when inactive
        stroke(100, 100, 200);
    }
    strokeWeight(3);
    rect(210, 210, 90, 35); // Moved from y=150 to y=210
    
    fill(255);
    textAlign(CENTER);
    text("SHOW STEPS", 255, 230); // Moved from y=170 to y=230
    
    // Draw clear instructions with emojis - moved much further down
    fill(30);
    textAlign(LEFT);
    textSize(14);
    textStyle(BOLD);
    text("🎯 Click buttons to explore examples • 📚 Click 'SHOW STEPS' for math • ⌨️ Use SPACEBAR", 50, 260); // Moved from y=200 to y=260
}

function createButtons() {
    // This would create actual clickable buttons if we had p5.js DOM elements
    // For now, we'll handle clicks in mousePressed()
}

function mousePressed() {
    // Debug: Print mouse position
    console.log("Mouse clicked at:", mouseX, mouseY);
    
    // Previous button (updated click area for moved buttons)
    if (mouseX >= 50 && mouseX <= 120 && mouseY >= 210 && mouseY <= 245) {
        currentExample = (currentExample - 1 + examples.length) % examples.length;
        console.log("Previous button clicked");
    }
    
    // Next button (updated click area for moved buttons)
    if (mouseX >= 130 && mouseX <= 200 && mouseY >= 210 && mouseY <= 245) {
        currentExample = (currentExample + 1) % examples.length;
        console.log("Next button clicked");
    }
    
    // Convert button (SHOW STEPS) - updated click area for moved button
    if (mouseX >= 210 && mouseX <= 300 && mouseY >= 210 && mouseY <= 245) {
        showConversion = !showConversion;
        console.log("SHOW STEPS button clicked, showConversion:", showConversion);
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        showConversion = !showConversion;
    }
    
    if (key === ' ') {
        currentExample = (currentExample + 1) % examples.length;
    }
    
    if (key === 'r' || key === 'R') {
        showConversion = false;
        currentExample = 0;
    }
}
