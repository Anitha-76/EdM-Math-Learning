class GeometryExplorer extends Phaser.Scene {
    constructor() {
        super({ key: 'GeometryExplorer' });
        this.currentLesson = 0;
        this.lessons = [
            'intro',
            'lines',
            'angles',
            'ruler',
            'protractor',
            'parallel',
            'complementary',
            'collinear'
        ];
    }

    preload() {
        // No external assets needed - we'll draw everything
    }

    create() {
        const width = 1000;
        const height = 700;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a);

        // Title bar
        this.titleBar = this.add.rectangle(width / 2, 30, width, 60, 0x1a0f0a);
        this.titleText = this.add.text(width / 2, 30, '', {
            fontSize: '24px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instruction panel
        this.instructionPanel = this.add.rectangle(width / 2, 650, width - 40, 80, 0x1a0f0a);
        this.instructionPanel.setStrokeStyle(2, 0x8b4513, 0.6);

        this.instructionText = this.add.text(width / 2, 640, '', {
            fontSize: '16px',
            fill: '#c9b699',
            align: 'center',
            wordWrap: { width: width - 80 }
        }).setOrigin(0.5, 0);

        // Navigation buttons
        this.prevButton = this.createButton(80, 650, 'Previous', () => this.previousLesson());
        this.nextButton = this.createButton(width - 80, 650, 'Next', () => this.nextLesson());

        // Lesson progress indicator
        this.progressText = this.add.text(width / 2, 80, '', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Main content area
        this.contentArea = this.add.container(0, 0);

        // Start with intro
        this.showLesson(0);
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 120, 40, 0x2c1810);
        button.setStrokeStyle(2, 0x8b4513, 0.6);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '16px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setFillStyle(0x3a2010);
            buttonText.setColor('#ffcc80');
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x2c1810);
            buttonText.setColor('#d4a574');
        });

        button.on('pointerdown', callback);

        return { rect: button, text: buttonText };
    }

    previousLesson() {
        if (this.currentLesson > 0) {
            this.currentLesson--;
            this.showLesson(this.currentLesson);
        }
    }

    nextLesson() {
        if (this.currentLesson < this.lessons.length - 1) {
            this.currentLesson++;
            this.showLesson(this.currentLesson);
        }
    }

    showLesson(index) {
        // Clear previous content
        this.contentArea.removeAll(true);

        // Update progress
        this.progressText.setText(`Lesson ${index + 1} of ${this.lessons.length}`);

        // Update button states
        this.prevButton.rect.setAlpha(index > 0 ? 1 : 0.3);
        this.nextButton.rect.setAlpha(index < this.lessons.length - 1 ? 1 : 0.3);

        // Show appropriate lesson
        const lessonName = this.lessons[index];
        switch(lessonName) {
            case 'intro':
                this.showIntroLesson();
                break;
            case 'lines':
                this.showLinesLesson();
                break;
            case 'angles':
                this.showAnglesLesson();
                break;
            case 'ruler':
                this.showRulerLesson();
                break;
            case 'protractor':
                this.showProtractorLesson();
                break;
            case 'parallel':
                this.showParallelLinesLesson();
                break;
            case 'complementary':
                this.showComplementaryAnglesLesson();
                break;
            case 'collinear':
                this.showCollinearPointsLesson();
                break;
        }
    }

    showIntroLesson() {
        this.titleText.setText('Welcome to Geometry Explorer!');
        this.instructionText.setText('Click "Next" to begin your journey through lines, angles, and geometric concepts.');

        // Create a visual splash with geometric shapes
        const centerX = 500;
        const centerY = 350;

        // Draw various geometric elements
        const graphics = this.add.graphics();

        // Line
        graphics.lineStyle(3, 0x4CAF50);
        graphics.beginPath();
        graphics.moveTo(centerX - 200, centerY - 100);
        graphics.lineTo(centerX - 50, centerY - 100);
        graphics.strokePath();
        this.add.text(centerX - 125, centerY - 130, 'Line', {
            fontSize: '16px',
            fill: '#4CAF50'
        }).setOrigin(0.5);

        // Ray
        graphics.lineStyle(3, 0x2196F3);
        graphics.beginPath();
        graphics.moveTo(centerX + 50, centerY - 100);
        graphics.lineTo(centerX + 200, centerY - 100);
        graphics.strokePath();
        graphics.fillStyle(0x2196F3);
        graphics.fillCircle(centerX + 50, centerY - 100, 5);
        this.add.text(centerX + 125, centerY - 130, 'Ray', {
            fontSize: '16px',
            fill: '#2196F3'
        }).setOrigin(0.5);

        // Angle
        graphics.lineStyle(3, 0xFF9800);
        graphics.beginPath();
        graphics.moveTo(centerX - 200, centerY + 50);
        graphics.lineTo(centerX - 100, centerY + 50);
        graphics.lineTo(centerX - 50, centerY - 50);
        graphics.strokePath();
        graphics.lineStyle(2, 0xFF9800);
        graphics.arc(centerX - 100, centerY + 50, 30, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(315));
        graphics.strokePath();
        this.add.text(centerX - 125, centerY + 80, 'Angle', {
            fontSize: '16px',
            fill: '#FF9800'
        }).setOrigin(0.5);

        // Parallel lines
        graphics.lineStyle(3, 0x9C27B0);
        graphics.beginPath();
        graphics.moveTo(centerX + 50, centerY);
        graphics.lineTo(centerX + 200, centerY);
        graphics.moveTo(centerX + 50, centerY + 50);
        graphics.lineTo(centerX + 200, centerY + 50);
        graphics.strokePath();
        this.add.text(centerX + 125, centerY + 80, 'Parallel Lines', {
            fontSize: '16px',
            fill: '#9C27B0'
        }).setOrigin(0.5);

        this.contentArea.add(graphics);
    }

    showLinesLesson() {
        this.titleText.setText('Lines, Line Segments, and Rays');
        this.instructionText.setText('Learn the differences: Lines extend infinitely, segments have two endpoints, and rays have one endpoint.');

        const startX = 150;
        const startY = 150;
        const spacing = 150;

        // Line
        this.drawLineExample(startX, startY, 'LINE',
            'Extends infinitely in both directions',
            'line', 0x4CAF50);

        // Line Segment
        this.drawLineExample(startX + 300, startY, 'LINE SEGMENT',
            'Has two endpoints: A and B',
            'segment', 0x2196F3);

        // Ray
        this.drawLineExample(startX + 600, startY, 'RAY',
            'Starts at one point, extends infinitely',
            'ray', 0xFF9800);

        // Interactive drawing area
        const drawArea = this.add.rectangle(500, 450, 800, 200, 0x1a0f0a);
        drawArea.setStrokeStyle(2, 0x8b4513, 0.6);

        const drawText = this.add.text(500, 360, 'Click to draw your own line!', {
            fontSize: '18px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        this.contentArea.add([drawArea, drawText]);

        this.setupInteractiveDrawing(100, 400, 900, 600);
    }

    drawLineExample(x, y, title, description, type, color) {
        const graphics = this.add.graphics();

        // Title
        const titleText = this.add.text(x, y - 30, title, {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Description
        const descText = this.add.text(x, y + 100, description, {
            fontSize: '14px',
            fill: '#c9b699',
            align: 'center',
            wordWrap: { width: 200 }
        }).setOrigin(0.5, 0);

        graphics.lineStyle(4, color);

        if (type === 'line') {
            // Line with arrows on both ends
            graphics.beginPath();
            graphics.moveTo(x - 80, y + 30);
            graphics.lineTo(x + 80, y + 30);
            graphics.strokePath();

            // Arrows
            this.drawArrow(graphics, x - 80, y + 30, -1, color);
            this.drawArrow(graphics, x + 80, y + 30, 1, color);

        } else if (type === 'segment') {
            // Segment with endpoints
            graphics.beginPath();
            graphics.moveTo(x - 80, y + 30);
            graphics.lineTo(x + 80, y + 30);
            graphics.strokePath();

            // Endpoints
            graphics.fillStyle(color);
            graphics.fillCircle(x - 80, y + 30, 6);
            graphics.fillCircle(x + 80, y + 30, 6);

            // Labels
            this.add.text(x - 80, y + 50, 'A', { fontSize: '16px', fill: '#d4a574' }).setOrigin(0.5);
            this.add.text(x + 80, y + 50, 'B', { fontSize: '16px', fill: '#d4a574' }).setOrigin(0.5);

        } else if (type === 'ray') {
            // Ray with one endpoint and one arrow
            graphics.beginPath();
            graphics.moveTo(x - 80, y + 30);
            graphics.lineTo(x + 80, y + 30);
            graphics.strokePath();

            // Starting point
            graphics.fillStyle(color);
            graphics.fillCircle(x - 80, y + 30, 6);

            // Arrow
            this.drawArrow(graphics, x + 80, y + 30, 1, color);

            // Label
            this.add.text(x - 80, y + 50, 'A', { fontSize: '16px', fill: '#d4a574' }).setOrigin(0.5);
        }

        this.contentArea.add([titleText, descText, graphics]);
    }

    drawArrow(graphics, x, y, direction, color) {
        graphics.fillStyle(color);
        graphics.fillTriangle(
            x + (direction * 10), y,
            x + (direction * -5), y - 5,
            x + (direction * -5), y + 5
        );
    }

    setupInteractiveDrawing(x1, y1, x2, y2) {
        let isDrawing = false;
        let startPoint = null;
        let currentLine = null;

        const drawGraphics = this.add.graphics();
        this.contentArea.add(drawGraphics);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= x1 && pointer.x <= x2 && pointer.y >= y1 && pointer.y <= y2) {
                isDrawing = true;
                startPoint = { x: pointer.x, y: pointer.y };
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (isDrawing && startPoint) {
                drawGraphics.clear();
                drawGraphics.lineStyle(3, 0xd4a574);
                drawGraphics.beginPath();
                drawGraphics.moveTo(startPoint.x, startPoint.y);
                drawGraphics.lineTo(pointer.x, pointer.y);
                drawGraphics.strokePath();
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (isDrawing) {
                isDrawing = false;
                startPoint = null;
            }
        });
    }

    showAnglesLesson() {
        this.titleText.setText('Types of Angles');
        this.instructionText.setText('Angles are measured in degrees. Learn to identify acute, right, obtuse, and straight angles.');

        const angles = [
            { name: 'ACUTE', degrees: 45, desc: 'Less than 90°', color: 0x4CAF50 },
            { name: 'RIGHT', degrees: 90, desc: 'Exactly 90°', color: 0x2196F3 },
            { name: 'OBTUSE', degrees: 120, desc: 'Between 90° and 180°', color: 0xFF9800 },
            { name: 'STRAIGHT', degrees: 180, desc: 'Exactly 180°', color: 0x9C27B0 }
        ];

        const startX = 200;
        const startY = 200;
        const spacingX = 400;

        angles.forEach((angle, index) => {
            const x = startX + (index % 2) * spacingX;
            const y = startY + Math.floor(index / 2) * 250;

            this.drawAngleExample(x, y, angle.name, angle.degrees, angle.desc, angle.color);
        });
    }

    drawAngleExample(x, y, name, degrees, description, color) {
        const graphics = this.add.graphics();

        // Title
        const titleText = this.add.text(x, y - 40, name, {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Degree text
        const degreeText = this.add.text(x, y - 20, `${degrees}°`, {
            fontSize: '16px',
            fill: color.toString(16).padStart(6, '0')
        }).setOrigin(0.5);

        // Description
        const descText = this.add.text(x, y + 100, description, {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Draw angle
        const length = 80;
        graphics.lineStyle(4, color);

        // Horizontal line
        graphics.beginPath();
        graphics.moveTo(x - length, y + 30);
        graphics.lineTo(x, y + 30);
        graphics.strokePath();

        // Angled line
        const radians = Phaser.Math.DegToRad(degrees);
        const endX = x + length * Math.cos(Math.PI - radians);
        const endY = y + 30 - length * Math.sin(Math.PI - radians);

        graphics.beginPath();
        graphics.moveTo(x, y + 30);
        graphics.lineTo(endX, endY);
        graphics.strokePath();

        // Arc showing angle
        graphics.lineStyle(2, color, 0.7);
        graphics.beginPath();
        graphics.arc(x, y + 30, 25, -radians, 0);
        graphics.strokePath();

        // Vertex point
        graphics.fillStyle(color);
        graphics.fillCircle(x, y + 30, 5);

        // Right angle square if needed
        if (degrees === 90) {
            graphics.lineStyle(2, color);
            graphics.strokeRect(x - 15, y + 15, 15, 15);
        }

        this.contentArea.add([titleText, degreeText, descText, graphics]);
    }

    showRulerLesson() {
        this.titleText.setText('Using a Ruler');
        this.instructionText.setText('Measure line segments accurately using a ruler. Each mark represents a unit.');

        // Draw an interactive ruler
        const ruler = this.add.graphics();
        const rulerX = 150;
        const rulerY = 250;
        const rulerWidth = 700;
        const rulerHeight = 60;

        // Ruler body
        ruler.fillStyle(0xf4e4c1);
        ruler.fillRect(rulerX, rulerY, rulerWidth, rulerHeight);
        ruler.lineStyle(2, 0x8b4513);
        ruler.strokeRect(rulerX, rulerY, rulerWidth, rulerHeight);

        // Measurement marks
        const units = 14;
        const unitWidth = rulerWidth / units;

        for (let i = 0; i <= units; i++) {
            const x = rulerX + i * unitWidth;
            const markHeight = (i % 5 === 0) ? 30 : (i % 2 === 0) ? 20 : 15;

            ruler.lineStyle(2, 0x000000);
            ruler.beginPath();
            ruler.moveTo(x, rulerY);
            ruler.lineTo(x, rulerY + markHeight);
            ruler.strokePath();

            if (i % 2 === 0) {
                this.add.text(x, rulerY + rulerHeight - 20, i.toString(), {
                    fontSize: '12px',
                    fill: '#000000'
                }).setOrigin(0.5);
            }
        }

        this.add.text(500, 350, 'Unit: cm', {
            fontSize: '16px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        this.contentArea.add(ruler);

        // Sample line segments to measure
        const sampleY = 450;
        const sampleLines = [
            { length: 150, label: 'Measure me!' },
            { length: 250, label: 'How long am I?' },
            { length: 350, label: 'What\'s my length?' }
        ];

        sampleLines.forEach((line, index) => {
            const graphics = this.add.graphics();
            const y = sampleY + index * 50;

            graphics.lineStyle(3, 0x4CAF50);
            graphics.beginPath();
            graphics.moveTo(rulerX, y);
            graphics.lineTo(rulerX + line.length, y);
            graphics.strokePath();

            graphics.fillStyle(0x4CAF50);
            graphics.fillCircle(rulerX, y, 5);
            graphics.fillCircle(rulerX + line.length, y, 5);

            this.add.text(rulerX + line.length + 20, y, line.label, {
                fontSize: '14px',
                fill: '#c9b699'
            }).setOrigin(0, 0.5);

            // Answer (length in cm)
            const lengthCm = (line.length / unitWidth).toFixed(1);
            this.add.text(rulerX + line.length + 150, y, `(${lengthCm} cm)`, {
                fontSize: '12px',
                fill: '#d4a574'
            }).setOrigin(0, 0.5);

            this.contentArea.add(graphics);
        });
    }

    showProtractorLesson() {
        this.titleText.setText('Using a Protractor');
        this.instructionText.setText('Measure angles accurately using a protractor. Place the center on the vertex and align one ray with 0°.');

        // Draw a protractor
        const centerX = 500;
        const centerY = 300;
        const radius = 150;

        const protractor = this.add.graphics();

        // Protractor semicircle
        protractor.fillStyle(0xf4e4c1, 0.7);
        protractor.fillCircle(centerX, centerY, radius);
        protractor.lineStyle(2, 0x8b4513);
        protractor.strokeCircle(centerX, centerY, radius);

        // Draw degree markings
        for (let angle = 0; angle <= 180; angle += 10) {
            const radians = Phaser.Math.DegToRad(angle);
            const x1 = centerX + radius * Math.cos(radians);
            const y1 = centerY - radius * Math.sin(radians);

            const markLength = (angle % 30 === 0) ? 15 : 10;
            const x2 = centerX + (radius - markLength) * Math.cos(radians);
            const y2 = centerY - (radius - markLength) * Math.sin(radians);

            protractor.lineStyle(2, 0x000000);
            protractor.beginPath();
            protractor.moveTo(x1, y1);
            protractor.lineTo(x2, y2);
            protractor.strokePath();

            if (angle % 30 === 0) {
                const textX = centerX + (radius - 30) * Math.cos(radians);
                const textY = centerY - (radius - 30) * Math.sin(radians);

                this.add.text(textX, textY, angle.toString() + '°', {
                    fontSize: '12px',
                    fill: '#000000'
                }).setOrigin(0.5);
            }
        }

        // Center point
        protractor.fillStyle(0xFF0000);
        protractor.fillCircle(centerX, centerY, 5);

        this.add.text(centerX, centerY + 180, 'Center on vertex', {
            fontSize: '14px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        this.contentArea.add(protractor);

        // Sample angle to measure
        const sampleAngle = 60;
        const graphics = this.add.graphics();

        graphics.lineStyle(4, 0xFF9800);
        graphics.beginPath();
        graphics.moveTo(centerX + radius - 20, centerY);
        graphics.lineTo(centerX, centerY);
        graphics.strokePath();

        const radians = Phaser.Math.DegToRad(sampleAngle);
        graphics.beginPath();
        graphics.moveTo(centerX, centerY);
        graphics.lineTo(
            centerX + (radius - 20) * Math.cos(radians),
            centerY - (radius - 20) * Math.sin(radians)
        );
        graphics.strokePath();

        this.add.text(centerX, 500, `This angle measures ${sampleAngle}°`, {
            fontSize: '18px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        this.contentArea.add(graphics);
    }

    showParallelLinesLesson() {
        this.titleText.setText('Parallel and Intersecting Lines');
        this.instructionText.setText('Parallel lines never meet. Intersecting lines cross at a point.');

        // Parallel lines example
        const graphics1 = this.add.graphics();
        const x1 = 250;
        const y1 = 200;

        this.add.text(x1, y1 - 40, 'PARALLEL LINES', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        graphics1.lineStyle(4, 0x4CAF50);
        graphics1.beginPath();
        graphics1.moveTo(x1 - 100, y1);
        graphics1.lineTo(x1 + 100, y1);
        graphics1.strokePath();

        graphics1.beginPath();
        graphics1.moveTo(x1 - 100, y1 + 50);
        graphics1.lineTo(x1 + 100, y1 + 50);
        graphics1.strokePath();

        // Parallel symbol
        graphics1.lineStyle(2, 0x4CAF50);
        graphics1.beginPath();
        graphics1.moveTo(x1 - 10, y1 + 15);
        graphics1.lineTo(x1 + 10, y1 + 15);
        graphics1.moveTo(x1 - 10, y1 + 20);
        graphics1.lineTo(x1 + 10, y1 + 20);
        graphics1.strokePath();

        this.add.text(x1, y1 + 100, 'These lines will never intersect.\nThey are always the same distance apart.', {
            fontSize: '14px',
            fill: '#c9b699',
            align: 'center'
        }).setOrigin(0.5);

        // Intersecting lines example
        const graphics2 = this.add.graphics();
        const x2 = 750;
        const y2 = 200;

        this.add.text(x2, y2 - 40, 'INTERSECTING LINES', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        graphics2.lineStyle(4, 0x2196F3);
        graphics2.beginPath();
        graphics2.moveTo(x2 - 100, y2);
        graphics2.lineTo(x2 + 100, y2 + 80);
        graphics2.strokePath();

        graphics2.beginPath();
        graphics2.moveTo(x2 - 80, y2 + 80);
        graphics2.lineTo(x2 + 120, y2);
        graphics2.strokePath();

        // Intersection point
        graphics2.fillStyle(0xFF0000);
        graphics2.fillCircle(x2 + 10, y2 + 40, 6);

        this.add.text(x2 + 10, y2 + 60, 'Intersection Point', {
            fontSize: '12px',
            fill: '#FF0000'
        }).setOrigin(0.5, 0);

        this.add.text(x2, y2 + 100, 'These lines cross at one point.', {
            fontSize: '14px',
            fill: '#c9b699',
            align: 'center'
        }).setOrigin(0.5);

        // Perpendicular lines example
        const graphics3 = this.add.graphics();
        const x3 = 500;
        const y3 = 450;

        this.add.text(x3, y3 - 40, 'PERPENDICULAR LINES', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        graphics3.lineStyle(4, 0xFF9800);
        graphics3.beginPath();
        graphics3.moveTo(x3 - 100, y3);
        graphics3.lineTo(x3 + 100, y3);
        graphics3.strokePath();

        graphics3.beginPath();
        graphics3.moveTo(x3, y3 - 80);
        graphics3.lineTo(x3, y3 + 80);
        graphics3.strokePath();

        // Right angle square
        graphics3.lineStyle(2, 0xFF9800);
        graphics3.strokeRect(x3 - 15, y3 - 15, 15, 15);

        this.add.text(x3, y3 + 100, 'Perpendicular lines intersect at 90°', {
            fontSize: '14px',
            fill: '#c9b699',
            align: 'center'
        }).setOrigin(0.5);

        this.contentArea.add([graphics1, graphics2, graphics3]);
    }

    showComplementaryAnglesLesson() {
        this.titleText.setText('Complementary and Supplementary Angles');
        this.instructionText.setText('Complementary angles add up to 90°. Supplementary angles add up to 180°.');

        // Complementary angles
        const x1 = 300;
        const y1 = 250;

        this.add.text(x1, y1 - 60, 'COMPLEMENTARY ANGLES', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x1, y1 - 35, '(Add up to 90°)', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics1 = this.add.graphics();

        // First angle (60°)
        graphics1.lineStyle(4, 0x4CAF50);
        graphics1.beginPath();
        graphics1.moveTo(x1 - 100, y1);
        graphics1.lineTo(x1, y1);
        graphics1.lineTo(x1 + 50, y1 - 87);
        graphics1.strokePath();

        graphics1.lineStyle(2, 0x4CAF50, 0.7);
        graphics1.arc(x1, y1, 30, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-30));
        graphics1.strokePath();

        this.add.text(x1 + 15, y1 - 25, '60°', {
            fontSize: '16px',
            fill: '#4CAF50'
        });

        // Second angle (30°)
        graphics1.lineStyle(4, 0x2196F3);
        graphics1.beginPath();
        graphics1.moveTo(x1 + 50, y1 - 87);
        graphics1.lineTo(x1, y1);
        graphics1.lineTo(x1, y1 - 100);
        graphics1.strokePath();

        graphics1.lineStyle(2, 0x2196F3, 0.7);
        graphics1.arc(x1, y1, 40, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-60));
        graphics1.strokePath();

        this.add.text(x1 - 25, y1 - 45, '30°', {
            fontSize: '16px',
            fill: '#2196F3'
        });

        this.add.text(x1, y1 + 40, '60° + 30° = 90°', {
            fontSize: '16px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        // Supplementary angles
        const x2 = 700;
        const y2 = 250;

        this.add.text(x2, y2 - 60, 'SUPPLEMENTARY ANGLES', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x2, y2 - 35, '(Add up to 180°)', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics2 = this.add.graphics();

        // First angle (120°)
        graphics2.lineStyle(4, 0xFF9800);
        graphics2.beginPath();
        graphics2.moveTo(x2 - 100, y2);
        graphics2.lineTo(x2, y2);
        graphics2.lineTo(x2 - 50, y2 - 87);
        graphics2.strokePath();

        graphics2.lineStyle(2, 0xFF9800, 0.7);
        graphics2.arc(x2, y2, 30, Phaser.Math.DegToRad(-180), Phaser.Math.DegToRad(-60));
        graphics2.strokePath();

        this.add.text(x2 - 35, y2 - 20, '120°', {
            fontSize: '16px',
            fill: '#FF9800'
        });

        // Second angle (60°)
        graphics2.lineStyle(4, 0x9C27B0);
        graphics2.beginPath();
        graphics2.moveTo(x2 - 50, y2 - 87);
        graphics2.lineTo(x2, y2);
        graphics2.lineTo(x2 + 100, y2);
        graphics2.strokePath();

        graphics2.lineStyle(2, 0x9C27B0, 0.7);
        graphics2.arc(x2, y2, 40, Phaser.Math.DegToRad(-60), Phaser.Math.DegToRad(0));
        graphics2.strokePath();

        this.add.text(x2 + 30, y2 - 20, '60°', {
            fontSize: '16px',
            fill: '#9C27B0'
        });

        this.add.text(x2, y2 + 40, '120° + 60° = 180°', {
            fontSize: '16px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        // Practice problems
        this.add.text(500, 400, 'PRACTICE:', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const problems = [
            'If one angle is 45°, what is its complement?',
            'If one angle is 110°, what is its supplement?'
        ];

        problems.forEach((problem, index) => {
            this.add.text(500, 440 + index * 40, problem, {
                fontSize: '14px',
                fill: '#c9b699'
            }).setOrigin(0.5);

            const answer = index === 0 ? '(Answer: 45°)' : '(Answer: 70°)';
            this.add.text(500, 460 + index * 40, answer, {
                fontSize: '12px',
                fill: '#4CAF50'
            }).setOrigin(0.5);
        });

        this.contentArea.add([graphics1, graphics2]);
    }

    showCollinearPointsLesson() {
        this.titleText.setText('Collinear Points & Concurrency');
        this.instructionText.setText('Collinear points lie on the same line. Concurrent lines meet at one point.');

        // Collinear points
        const x1 = 300;
        const y1 = 200;

        this.add.text(x1, y1 - 60, 'COLLINEAR POINTS', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x1, y1 - 35, '(Points on the same line)', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics1 = this.add.graphics();

        graphics1.lineStyle(3, 0x4CAF50);
        graphics1.beginPath();
        graphics1.moveTo(x1 - 120, y1 + 50);
        graphics1.lineTo(x1 + 120, y1 - 50);
        graphics1.strokePath();

        // Points on the line
        const points = [
            { x: x1 - 80, y: y1 + 33, label: 'A' },
            { x: x1 - 40, y: y1 + 17, label: 'B' },
            { x: x1, y: y1, label: 'C' },
            { x: x1 + 40, y: y1 - 17, label: 'D' }
        ];

        points.forEach(point => {
            graphics1.fillStyle(0xFF0000);
            graphics1.fillCircle(point.x, point.y, 6);

            this.add.text(point.x, point.y + 20, point.label, {
                fontSize: '16px',
                fill: '#d4a574'
            }).setOrigin(0.5);
        });

        this.add.text(x1, y1 + 100, 'Points A, B, C, and D are collinear', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Non-collinear points
        const x2 = 700;
        const y2 = 200;

        this.add.text(x2, y2 - 60, 'NON-COLLINEAR POINTS', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x2, y2 - 35, '(Points NOT on the same line)', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics2 = this.add.graphics();

        const nonCollinearPoints = [
            { x: x2 - 60, y: y2, label: 'P' },
            { x: x2 + 60, y: y2, label: 'Q' },
            { x: x2, y: y2 + 60, label: 'R' }
        ];

        nonCollinearPoints.forEach(point => {
            graphics2.fillStyle(0xFF0000);
            graphics2.fillCircle(point.x, point.y, 6);

            this.add.text(point.x, point.y + 20, point.label, {
                fontSize: '16px',
                fill: '#d4a574'
            }).setOrigin(0.5);
        });

        // Connect with dashed lines to show triangle
        graphics2.lineStyle(2, 0x2196F3, 1, 0.5);
        graphics2.setLineDash([5, 5]);
        graphics2.strokeTriangle(x2 - 60, y2, x2 + 60, y2, x2, y2 + 60);

        this.add.text(x2, y2 + 100, 'Points P, Q, and R are NOT collinear', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Point of concurrency
        const x3 = 500;
        const y3 = 500;

        this.add.text(x3, y3 - 100, 'POINT OF CONCURRENCY', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x3, y3 - 75, '(Lines meeting at one point)', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics3 = this.add.graphics();

        // Three lines meeting at a point
        const concurrentLines = [
            { angle: 30, color: 0xFF9800 },
            { angle: 90, color: 0x9C27B0 },
            { angle: 150, color: 0x4CAF50 }
        ];

        concurrentLines.forEach(line => {
            const radians = Phaser.Math.DegToRad(line.angle);
            const length = 80;

            graphics3.lineStyle(3, line.color);
            graphics3.beginPath();
            graphics3.moveTo(x3 - length * Math.cos(radians), y3 - length * Math.sin(radians));
            graphics3.lineTo(x3 + length * Math.cos(radians), y3 + length * Math.sin(radians));
            graphics3.strokePath();
        });

        // Concurrency point
        graphics3.fillStyle(0xFF0000);
        graphics3.fillCircle(x3, y3, 8);

        this.add.text(x3 + 20, y3, 'Point of\nConcurrency', {
            fontSize: '14px',
            fill: '#FF0000',
            align: 'left'
        });

        this.contentArea.add([graphics1, graphics2, graphics3]);
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: '#0a0a0a',
    parent: 'phaser-game',
    scene: GeometryExplorer
};

// Create the game instance
const game = new Phaser.Game(config);
