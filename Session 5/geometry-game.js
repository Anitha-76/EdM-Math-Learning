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

        // Title bar at top
        this.titleBar = this.add.rectangle(width / 2, 35, width - 20, 60, 0x1a0f0a);
        this.titleBar.setStrokeStyle(2, 0x8b4513, 0.6);

        this.titleText = this.add.text(width / 2, 35, '', {
            fontSize: '26px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Progress indicator
        this.progressText = this.add.text(width / 2, 75, '', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Main content area (larger, centered)
        this.contentArea = this.add.container(0, 0);

        // Navigation buttons at bottom
        this.prevButton = this.createButton(80, height - 40, 'Previous', () => this.previousLesson());
        this.nextButton = this.createButton(width - 80, height - 40, 'Next', () => this.nextLesson());

        // Instruction panel at bottom
        this.instructionPanel = this.add.rectangle(width / 2, height - 40, width - 200, 60, 0x1a0f0a);
        this.instructionPanel.setStrokeStyle(2, 0x8b4513, 0.6);

        this.instructionText = this.add.text(width / 2, height - 50, '', {
            fontSize: '15px',
            fill: '#c9b699',
            align: 'center',
            wordWrap: { width: width - 220 }
        }).setOrigin(0.5, 0);

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
        this.prevButton.text.setAlpha(index > 0 ? 1 : 0.3);
        this.nextButton.rect.setAlpha(index < this.lessons.length - 1 ? 1 : 0.3);
        this.nextButton.text.setAlpha(index < this.lessons.length - 1 ? 1 : 0.3);

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
        this.titleText.setText('Welcome to Geometry!');
        this.instructionText.setText('Explore lines, angles, and shapes. Click "Next" to begin.');

        const centerX = 500;
        const centerY = 350;

        // Large welcome message
        const welcome = this.add.text(centerX, 150, 'Learn Geometry Step by Step', {
            fontSize: '28px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Topics covered
        const topics = [
            '📏 Lines, Segments & Rays',
            '📐 Types of Angles',
            '📊 Using Tools (Ruler & Protractor)',
            '↔️ Parallel & Intersecting Lines',
            '🔄 Complementary & Supplementary Angles',
            '⚫ Collinear Points'
        ];

        topics.forEach((topic, index) => {
            const topicText = this.add.text(centerX, 230 + index * 50, topic, {
                fontSize: '20px',
                fill: '#c9b699'
            }).setOrigin(0.5);
            this.contentArea.add(topicText);
        });

        this.contentArea.add(welcome);
    }

    showLinesLesson() {
        this.titleText.setText('Lines, Line Segments & Rays');
        this.instructionText.setText('Learn the differences between these three fundamental concepts in geometry.');

        const startY = 150;
        const spacing = 170;

        // LINE
        const line = this.createLineDemo(500, startY,
            'LINE',
            'Extends forever in both directions →  ←',
            'line', 0x4CAF50);
        this.contentArea.add(line);

        // LINE SEGMENT
        const segment = this.createLineDemo(500, startY + spacing,
            'LINE SEGMENT',
            'Has two endpoints A and B',
            'segment', 0x2196F3);
        this.contentArea.add(segment);

        // RAY
        const ray = this.createLineDemo(500, startY + spacing * 2,
            'RAY',
            'Starts at point A, extends forever →',
            'ray', 0xFF9800);
        this.contentArea.add(ray);
    }

    createLineDemo(x, y, title, description, type, color) {
        const container = this.add.container(x, y);

        // Title
        const titleText = this.add.text(0, -40, title, {
            fontSize: '22px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Description
        const descText = this.add.text(0, 60, description, {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const graphics = this.add.graphics();
        graphics.lineStyle(4, color);

        if (type === 'line') {
            // Line with arrows
            graphics.beginPath();
            graphics.moveTo(-200, 0);
            graphics.lineTo(200, 0);
            graphics.strokePath();

            // Arrows
            graphics.fillStyle(color);
            graphics.fillTriangle(-200, 0, -185, -7, -185, 7);
            graphics.fillTriangle(200, 0, 185, -7, 185, 7);

        } else if (type === 'segment') {
            // Segment with dots
            graphics.beginPath();
            graphics.moveTo(-150, 0);
            graphics.lineTo(150, 0);
            graphics.strokePath();

            graphics.fillStyle(color);
            graphics.fillCircle(-150, 0, 8);
            graphics.fillCircle(150, 0, 8);

            const labelA = this.add.text(-150, 20, 'A', { fontSize: '18px', fill: '#d4a574' }).setOrigin(0.5);
            const labelB = this.add.text(150, 20, 'B', { fontSize: '18px', fill: '#d4a574' }).setOrigin(0.5);
            container.add([labelA, labelB]);

        } else if (type === 'ray') {
            // Ray with one dot and arrow
            graphics.beginPath();
            graphics.moveTo(-150, 0);
            graphics.lineTo(200, 0);
            graphics.strokePath();

            graphics.fillStyle(color);
            graphics.fillCircle(-150, 0, 8);
            graphics.fillTriangle(200, 0, 185, -7, 185, 7);

            const labelA = this.add.text(-150, 20, 'A', { fontSize: '18px', fill: '#d4a574' }).setOrigin(0.5);
            container.add(labelA);
        }

        container.add([titleText, descText, graphics]);
        return container;
    }

    showAnglesLesson() {
        this.titleText.setText('Types of Angles');
        this.instructionText.setText('Angles are measured in degrees (°). Learn to identify each type.');

        const angles = [
            { name: 'ACUTE', degrees: 45, desc: '< 90°', color: 0x4CAF50, x: 250, y: 200 },
            { name: 'RIGHT', degrees: 90, desc: '= 90°', color: 0x2196F3, x: 750, y: 200 },
            { name: 'OBTUSE', degrees: 135, desc: '> 90°, < 180°', color: 0xFF9800, x: 250, y: 450 },
            { name: 'STRAIGHT', degrees: 180, desc: '= 180°', color: 0x9C27B0, x: 750, y: 450 }
        ];

        angles.forEach(angle => {
            const container = this.drawAngle(angle.x, angle.y, angle.name, angle.degrees, angle.desc, angle.color);
            this.contentArea.add(container);
        });
    }

    drawAngle(x, y, name, degrees, description, color) {
        const container = this.add.container(x, y);

        // Title and degree
        const title = this.add.text(0, -80, name, {
            fontSize: '20px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const degText = this.add.text(0, -55, `${degrees}°`, {
            fontSize: '24px',
            fill: '#' + color.toString(16).padStart(6, '0')
        }).setOrigin(0.5);

        const descText = this.add.text(0, 70, description, {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Draw angle
        const graphics = this.add.graphics();
        const length = 80;

        graphics.lineStyle(4, color);

        // Base line (horizontal)
        graphics.beginPath();
        graphics.moveTo(-length, 0);
        graphics.lineTo(0, 0);
        graphics.strokePath();

        // Angled line
        const radians = Phaser.Math.DegToRad(degrees);
        const endX = length * Math.cos(Math.PI - radians);
        const endY = -length * Math.sin(Math.PI - radians);

        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(endX, endY);
        graphics.strokePath();

        // Arc
        graphics.lineStyle(2, color);
        graphics.beginPath();
        graphics.arc(0, 0, 30, -radians, 0);
        graphics.strokePath();

        // Vertex point
        graphics.fillStyle(color);
        graphics.fillCircle(0, 0, 6);

        // Right angle marker
        if (degrees === 90) {
            graphics.lineStyle(2, color);
            graphics.strokeRect(-15, -15, 15, 15);
        }

        container.add([title, degText, descText, graphics]);
        return container;
    }

    showRulerLesson() {
        this.titleText.setText('Using a Ruler');
        this.instructionText.setText('A ruler measures length. Each small mark is 1 cm.');

        // Draw ruler
        const rulerX = 150;
        const rulerY = 200;
        const rulerWidth = 700;
        const rulerHeight = 80;

        const ruler = this.add.graphics();

        // Ruler background
        ruler.fillStyle(0xEDD5A8);
        ruler.fillRect(rulerX, rulerY, rulerWidth, rulerHeight);
        ruler.lineStyle(3, 0x8b4513);
        ruler.strokeRect(rulerX, rulerY, rulerWidth, rulerHeight);

        // Marks
        const cmCount = 14;
        const cmWidth = rulerWidth / cmCount;

        for (let i = 0; i <= cmCount; i++) {
            const x = rulerX + i * cmWidth;
            const markHeight = 40;

            ruler.lineStyle(2, 0x000000);
            ruler.beginPath();
            ruler.moveTo(x, rulerY + 5);
            ruler.lineTo(x, rulerY + 5 + markHeight);
            ruler.strokePath();

            const label = this.add.text(x, rulerY + rulerHeight - 25, i.toString(), {
                fontSize: '16px',
                fill: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.contentArea.add(label);
        }

        const unitLabel = this.add.text(rulerX + rulerWidth / 2, rulerY + rulerHeight + 30, 'centimeters (cm)', {
            fontSize: '18px',
            fill: '#d4a574'
        }).setOrigin(0.5);

        // Sample measurements
        const samples = [
            { length: 200, label: 'Line AB' },
            { length: 350, label: 'Line CD' },
            { length: 500, label: 'Line EF' }
        ];

        samples.forEach((sample, i) => {
            const y = 350 + i * 60;
            const lineGraphics = this.add.graphics();

            lineGraphics.lineStyle(3, 0x4CAF50);
            lineGraphics.beginPath();
            lineGraphics.moveTo(rulerX, y);
            lineGraphics.lineTo(rulerX + sample.length, y);
            lineGraphics.strokePath();

            lineGraphics.fillStyle(0x4CAF50);
            lineGraphics.fillCircle(rulerX, y, 6);
            lineGraphics.fillCircle(rulerX + sample.length, y, 6);

            const length = (sample.length / cmWidth).toFixed(1);
            const label = this.add.text(rulerX + sample.length + 20, y, `${sample.label} = ${length} cm`, {
                fontSize: '16px',
                fill: '#c9b699'
            }).setOrigin(0, 0.5);

            this.contentArea.add([lineGraphics, label]);
        });

        this.contentArea.add([ruler, unitLabel]);
    }

    showProtractorLesson() {
        this.titleText.setText('Using a Protractor');
        this.instructionText.setText('A protractor measures angles in degrees. Place center on vertex, align with 0°.');

        const centerX = 500;
        const centerY = 300;
        const radius = 140;

        const protractor = this.add.graphics();

        // Protractor body
        protractor.fillStyle(0xEDD5A8, 0.8);
        protractor.slice(centerX, centerY, radius, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0), true);
        protractor.fillPath();

        protractor.lineStyle(3, 0x8b4513);
        protractor.strokeCircle(centerX, centerY, radius);

        // Degree markings
        for (let angle = 0; angle <= 180; angle += 10) {
            const rad = Phaser.Math.DegToRad(angle);
            const x1 = centerX + radius * Math.cos(rad);
            const y1 = centerY - radius * Math.sin(rad);

            const markLen = (angle % 30 === 0) ? 20 : 12;
            const x2 = centerX + (radius - markLen) * Math.cos(rad);
            const y2 = centerY - (radius - markLen) * Math.sin(rad);

            protractor.lineStyle(2, 0x000000);
            protractor.beginPath();
            protractor.moveTo(x1, y1);
            protractor.lineTo(x2, y2);
            protractor.strokePath();

            if (angle % 30 === 0) {
                const textX = centerX + (radius - 35) * Math.cos(rad);
                const textY = centerY - (radius - 35) * Math.sin(rad);

                const degLabel = this.add.text(textX, textY, angle + '°', {
                    fontSize: '14px',
                    fill: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                this.contentArea.add(degLabel);
            }
        }

        // Center mark
        protractor.fillStyle(0xFF0000);
        protractor.fillCircle(centerX, centerY, 6);

        // Example angle to measure
        const sampleAngle = 60;
        const sampleGraphics = this.add.graphics();

        sampleGraphics.lineStyle(5, 0xFF9800);

        // Base line
        sampleGraphics.beginPath();
        sampleGraphics.moveTo(centerX, centerY);
        sampleGraphics.lineTo(centerX + 120, centerY);
        sampleGraphics.strokePath();

        // Angled line
        const rad = Phaser.Math.DegToRad(sampleAngle);
        sampleGraphics.beginPath();
        sampleGraphics.moveTo(centerX, centerY);
        sampleGraphics.lineTo(centerX + 120 * Math.cos(rad), centerY - 120 * Math.sin(rad));
        sampleGraphics.strokePath();

        const resultText = this.add.text(centerX, 500, `This angle measures ${sampleAngle}°`, {
            fontSize: '22px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.contentArea.add([protractor, sampleGraphics, resultText]);
    }

    showParallelLinesLesson() {
        this.titleText.setText('Parallel & Intersecting Lines');
        this.instructionText.setText('Parallel lines never meet. Intersecting lines cross at a point.');

        // Left side - Parallel
        const parallel = this.add.container(250, 300);

        const parallelTitle = this.add.text(0, -120, 'PARALLEL LINES', {
            fontSize: '22px',
            fill: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const parallelGraphics = this.add.graphics();
        parallelGraphics.lineStyle(5, 0x4CAF50);

        parallelGraphics.beginPath();
        parallelGraphics.moveTo(-120, -30);
        parallelGraphics.lineTo(120, -30);
        parallelGraphics.strokePath();

        parallelGraphics.beginPath();
        parallelGraphics.moveTo(-120, 30);
        parallelGraphics.lineTo(120, 30);
        parallelGraphics.strokePath();

        // Parallel symbol
        parallelGraphics.lineStyle(3, 0x4CAF50);
        parallelGraphics.beginPath();
        parallelGraphics.moveTo(-15, -10);
        parallelGraphics.lineTo(15, -10);
        parallelGraphics.moveTo(-15, -5);
        parallelGraphics.lineTo(15, -5);
        parallelGraphics.strokePath();

        const parallelDesc = this.add.text(0, 90, 'Never intersect\nAlways same distance', {
            fontSize: '16px',
            fill: '#c9b699',
            align: 'center'
        }).setOrigin(0.5);

        parallel.add([parallelTitle, parallelGraphics, parallelDesc]);

        // Right side - Intersecting
        const intersecting = this.add.container(750, 300);

        const intersectTitle = this.add.text(0, -120, 'INTERSECTING LINES', {
            fontSize: '22px',
            fill: '#2196F3',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const intersectGraphics = this.add.graphics();
        intersectGraphics.lineStyle(5, 0x2196F3);

        intersectGraphics.beginPath();
        intersectGraphics.moveTo(-100, -50);
        intersectGraphics.lineTo(100, 50);
        intersectGraphics.strokePath();

        intersectGraphics.beginPath();
        intersectGraphics.moveTo(-100, 50);
        intersectGraphics.lineTo(100, -50);
        intersectGraphics.strokePath();

        // Intersection point
        intersectGraphics.fillStyle(0xFF0000);
        intersectGraphics.fillCircle(0, 0, 8);

        const intersectDesc = this.add.text(0, 90, 'Cross at one point', {
            fontSize: '16px',
            fill: '#c9b699',
            align: 'center'
        }).setOrigin(0.5);

        intersecting.add([intersectTitle, intersectGraphics, intersectDesc]);

        this.contentArea.add([parallel, intersecting]);
    }

    showComplementaryAnglesLesson() {
        this.titleText.setText('Complementary & Supplementary Angles');
        this.instructionText.setText('Complementary add to 90°. Supplementary add to 180°.');

        // Left - Complementary
        const compX = 280;
        const compY = 300;

        const compTitle = this.add.text(compX, 140, 'COMPLEMENTARY', {
            fontSize: '22px',
            fill: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const compSubtitle = this.add.text(compX, 170, '(Add to 90°)', {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const compGraphics = this.add.graphics();

        // 60° angle
        compGraphics.lineStyle(5, 0x4CAF50);
        compGraphics.beginPath();
        compGraphics.moveTo(compX - 100, compY);
        compGraphics.lineTo(compX, compY);
        compGraphics.strokePath();

        const rad60 = Phaser.Math.DegToRad(60);
        compGraphics.beginPath();
        compGraphics.moveTo(compX, compY);
        compGraphics.lineTo(compX + 100 * Math.cos(rad60), compY - 100 * Math.sin(rad60));
        compGraphics.strokePath();

        // 30° angle
        compGraphics.lineStyle(5, 0x2196F3);
        const rad30 = Phaser.Math.DegToRad(30);
        compGraphics.beginPath();
        compGraphics.moveTo(compX + 100 * Math.cos(rad60), compY - 100 * Math.sin(rad60));
        compGraphics.lineTo(compX, compY);
        compGraphics.lineTo(compX, compY - 100);
        compGraphics.strokePath();

        const comp60Label = this.add.text(compX - 40, compY - 25, '60°', { fontSize: '18px', fill: '#4CAF50' });
        const comp30Label = this.add.text(compX + 15, compY - 60, '30°', { fontSize: '18px', fill: '#2196F3' });

        const compFormula = this.add.text(compX, compY + 100, '60° + 30° = 90°', {
            fontSize: '20px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Right - Supplementary
        const suppX = 720;
        const suppY = 300;

        const suppTitle = this.add.text(suppX, 140, 'SUPPLEMENTARY', {
            fontSize: '22px',
            fill: '#FF9800',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const suppSubtitle = this.add.text(suppX, 170, '(Add to 180°)', {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        const suppGraphics = this.add.graphics();
        suppGraphics.lineStyle(5, 0xFF9800);

        // 120° angle
        suppGraphics.beginPath();
        suppGraphics.moveTo(suppX - 120, suppY);
        suppGraphics.lineTo(suppX, suppY);
        suppGraphics.strokePath();

        const rad120 = Phaser.Math.DegToRad(120);
        suppGraphics.beginPath();
        suppGraphics.moveTo(suppX, suppY);
        suppGraphics.lineTo(suppX + 100 * Math.cos(rad120), suppY - 100 * Math.sin(rad120));
        suppGraphics.strokePath();

        // 60° angle
        suppGraphics.lineStyle(5, 0x9C27B0);
        suppGraphics.beginPath();
        suppGraphics.moveTo(suppX + 100 * Math.cos(rad120), suppY - 100 * Math.sin(rad120));
        suppGraphics.lineTo(suppX, suppY);
        suppGraphics.lineTo(suppX + 120, suppY);
        suppGraphics.strokePath();

        const supp120Label = this.add.text(suppX - 60, suppY - 35, '120°', { fontSize: '18px', fill: '#FF9800' });
        const supp60Label = this.add.text(suppX + 40, suppY - 35, '60°', { fontSize: '18px', fill: '#9C27B0' });

        const suppFormula = this.add.text(suppX, suppY + 100, '120° + 60° = 180°', {
            fontSize: '20px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.contentArea.add([compTitle, compSubtitle, compGraphics, comp60Label, comp30Label, compFormula,
                              suppTitle, suppSubtitle, suppGraphics, supp120Label, supp60Label, suppFormula]);
    }

    showCollinearPointsLesson() {
        this.titleText.setText('Collinear Points & Concurrency');
        this.instructionText.setText('Collinear = points on same line. Concurrent = lines meeting at one point.');

        // Top - Collinear
        const collinearGraphics = this.add.graphics();
        const lineY = 220;

        const collinearTitle = this.add.text(500, 130, 'COLLINEAR POINTS', {
            fontSize: '22px',
            fill: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const collinearDesc = this.add.text(500, 165, '(All points lie on the same line)', {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Line
        collinearGraphics.lineStyle(3, 0x4CAF50);
        collinearGraphics.beginPath();
        collinearGraphics.moveTo(150, lineY);
        collinearGraphics.lineTo(850, lineY);
        collinearGraphics.strokePath();

        // Points
        const points = [
            { x: 250, label: 'A' },
            { x: 400, label: 'B' },
            { x: 550, label: 'C' },
            { x: 700, label: 'D' }
        ];

        points.forEach(point => {
            collinearGraphics.fillStyle(0xFF0000);
            collinearGraphics.fillCircle(point.x, lineY, 8);

            const label = this.add.text(point.x, lineY + 25, point.label, {
                fontSize: '20px',
                fill: '#d4a574',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.contentArea.add(label);
        });

        // Bottom - Concurrent
        const concurrentGraphics = this.add.graphics();
        const concX = 500;
        const concY = 480;

        const concurrentTitle = this.add.text(500, 350, 'CONCURRENT LINES', {
            fontSize: '22px',
            fill: '#2196F3',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const concurrentDesc = this.add.text(500, 385, '(All lines meet at one point)', {
            fontSize: '16px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Three lines meeting at center
        const lineAngles = [30, 90, 150];
        const colors = [0xFF9800, 0x9C27B0, 0x4CAF50];

        lineAngles.forEach((angle, i) => {
            const rad = Phaser.Math.DegToRad(angle);
            const length = 100;

            concurrentGraphics.lineStyle(4, colors[i]);
            concurrentGraphics.beginPath();
            concurrentGraphics.moveTo(concX - length * Math.cos(rad), concY - length * Math.sin(rad));
            concurrentGraphics.lineTo(concX + length * Math.cos(rad), concY + length * Math.sin(rad));
            concurrentGraphics.strokePath();
        });

        // Center point
        concurrentGraphics.fillStyle(0xFF0000);
        concurrentGraphics.fillCircle(concX, concY, 10);

        const pointLabel = this.add.text(concX + 30, concY, 'Point of\nConcurrency', {
            fontSize: '16px',
            fill: '#FF0000',
            fontStyle: 'bold'
        });

        this.contentArea.add([collinearTitle, collinearDesc, collinearGraphics,
                              concurrentTitle, concurrentDesc, concurrentGraphics, pointLabel]);
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
