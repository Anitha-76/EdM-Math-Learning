class GeometryExplorer extends Phaser.Scene {
    constructor() {
        super({ key: 'GeometryExplorer' });
        this.currentActivity = 0;
        this.activities = [
            'intro',
            'rulerPractice',
            'drawLine',
            'protractorPractice',
            'drawAngle',
            'identifyAngles',
            'parallelChallenge',
            'finalChallenge'
        ];
        this.points = [];
        this.cmWidth = 50; // pixels per cm
    }

    preload() {
        // No external assets needed
    }

    create() {
        const width = 1000;
        const height = 700;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a);

        // Title bar
        this.titleBar = this.add.rectangle(width / 2, 35, width - 20, 60, 0x1a0f0a);
        this.titleBar.setStrokeStyle(2, 0x8b4513, 0.6);

        this.titleText = this.add.text(width / 2, 35, '', {
            fontSize: '24px',
            fill: '#d4a574',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Progress
        this.progressText = this.add.text(width / 2, 75, '', {
            fontSize: '14px',
            fill: '#c9b699'
        }).setOrigin(0.5);

        // Main content area
        this.contentArea = this.add.container(0, 0);

        // Feedback text
        this.feedbackText = this.add.text(width / 2, 620, '', {
            fontSize: '20px',
            fill: '#4CAF50',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // Navigation buttons
        this.prevButton = this.createButton(80, height - 40, 'Previous', () => this.previousActivity());
        this.nextButton = this.createButton(width - 80, height - 40, 'Next', () => this.nextActivity());

        // Instruction panel (moved higher to avoid overlap with buttons)
        this.instructionPanel = this.add.rectangle(width / 2, 605, width - 200, 50, 0x1a0f0a);
        this.instructionPanel.setStrokeStyle(2, 0x8b4513, 0.6);

        this.instructionText = this.add.text(width / 2, 590, '', {
            fontSize: '14px',
            fill: '#c9b699',
            align: 'center',
            wordWrap: { width: width - 220 }
        }).setOrigin(0.5, 0);

        // Start
        this.showActivity(0);
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

    previousActivity() {
        if (this.currentActivity > 0) {
            this.currentActivity--;
            this.showActivity(this.currentActivity);
        }
    }

    nextActivity() {
        if (this.currentActivity < this.activities.length - 1) {
            this.currentActivity++;
            this.showActivity(this.currentActivity);
        }
    }

    showActivity(index) {
        // Clear previous content
        this.contentArea.removeAll(true);
        this.feedbackText.setText('');
        this.points = [];

        // Remove any existing input listeners
        this.input.off('pointerdown');
        this.input.off('pointermove');

        // Update progress
        this.progressText.setText(`Activity ${index + 1} of ${this.activities.length}`);

        // Update buttons
        this.prevButton.rect.setAlpha(index > 0 ? 1 : 0.3);
        this.prevButton.text.setAlpha(index > 0 ? 1 : 0.3);
        this.nextButton.rect.setAlpha(index < this.activities.length - 1 ? 1 : 0.3);
        this.nextButton.text.setAlpha(index < this.activities.length - 1 ? 1 : 0.3);

        // Show activity
        const activityName = this.activities[index];
        switch(activityName) {
            case 'intro':
                this.showIntro();
                break;
            case 'rulerPractice':
                this.showRulerPractice();
                break;
            case 'drawLine':
                this.showDrawLine();
                break;
            case 'protractorPractice':
                this.showProtractorPractice();
                break;
            case 'drawAngle':
                this.showDrawAngle();
                break;
            case 'identifyAngles':
                this.showIdentifyAngles();
                break;
            case 'parallelChallenge':
                this.showParallelChallenge();
                break;
            case 'finalChallenge':
                this.showFinalChallenge();
                break;
        }
    }

    showIntro() {
        this.titleText.setText('🎓 Interactive Geometry Learning');
        this.instructionText.setText('Complete the pattern! DRAG shapes to move, DOUBLE-CLICK to rotate!');

        const welcome = this.add.text(500, 130, 'Welcome! Match each colored piece to its gray outline', {
            fontSize: '18px',
            fill: '#d4a574',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.contentArea.add(welcome);

        // Create puzzle canvas workspace
        const canvas = this.add.container(500, 350);
        const canvasBg = this.add.rectangle(0, 0, 900, 400, 0x0f0f0f, 0.5);
        canvasBg.setStrokeStyle(2, 0x8b4513, 0.6);
        canvas.add(canvasBg);

        // TARGET PATTERN: Simple 4-piece tangram (gray outlines)
        const targetPattern = this.add.graphics();
        targetPattern.lineStyle(4, 0x888888, 0.8);

        const size = 60; // Base size for all pieces

        // Triangle 1 - left triangle (right isosceles, 90° at bottom-left)
        targetPattern.beginPath();
        targetPattern.moveTo(-size, -size/2);        // top left
        targetPattern.lineTo(-size, size/2);         // bottom left
        targetPattern.lineTo(0, size/2);             // bottom right
        targetPattern.closePath();
        targetPattern.strokePath();

        // Triangle 2 - top triangle (right isosceles, 90° at top-right)
        targetPattern.beginPath();
        targetPattern.moveTo(0, -size/2);            // left
        targetPattern.lineTo(size, -size/2);         // top right
        targetPattern.lineTo(size, size/2);          // bottom right
        targetPattern.closePath();
        targetPattern.strokePath();

        // Square - bottom left
        targetPattern.strokeRect(-size, size/2, size, size);

        // Square - bottom right
        targetPattern.strokeRect(0, size/2, size, size);

        canvas.add(targetPattern);

        // LOOSE COLORED PIECES - matching the pattern exactly
        const shapes = [
            // Orange triangle - left (type1: 90° at bottom-left)
            { x: -320, y: 120, type: 'triangle1', color: 0xFF5722, targetX: -size/2, targetY: 0, targetRot: 0, startRot: 90, size: size },

            // Blue triangle - right (type2: 90° at top-right)
            { x: -180, y: 120, type: 'triangle2', color: 0x2196F3, targetX: size/2, targetY: 0, targetRot: 0, startRot: 180, size: size },

            // Green square - bottom left
            { x: 0, y: 120, type: 'square', color: 0x4CAF50, targetX: -size/2, targetY: size, targetRot: 0, startRot: 45, size: size },

            // Purple square - bottom right
            { x: 180, y: 120, type: 'square', color: 0x9C27B0, targetX: size/2, targetY: size, targetRot: 0, startRot: 180, size: size }
        ];

        this.puzzleShapes = []; // Track active shapes

        shapes.forEach(shapeData => {
            const shape = this.drawPuzzleShape(shapeData.x, shapeData.y, shapeData.type, shapeData.color, shapeData.size);
            shape.angle = shapeData.startRot;

            // Store target data first
            shape.setData('targetX', shapeData.targetX);
            shape.setData('targetY', shapeData.targetY);
            shape.setData('targetRot', shapeData.targetRot);
            shape.setData('type', shapeData.type);
            shape.setData('matched', false);

            // Add to canvas FIRST before making interactive
            canvas.add(shape);

            // Now make it interactive
            shape.setInteractive({ draggable: true, useHandCursor: true });
            this.input.setDraggable(shape);

            // Bring to top when drag starts
            shape.on('dragstart', () => {
                canvas.bringToTop(shape);
            });

            // Drag to move (constrain within canvas)
            shape.on('drag', (pointer) => {
                // Get pointer position relative to the canvas container
                const localX = pointer.x - canvas.x;
                const localY = pointer.y - canvas.y;

                // Constrain within canvas bounds
                const constrainedX = Phaser.Math.Clamp(localX, -420, 420);
                const constrainedY = Phaser.Math.Clamp(localY, -180, 180);

                shape.x = constrainedX;
                shape.y = constrainedY;
            });

            // Check on drag end
            shape.on('dragend', () => {
                this.checkRotationMatch(shape);
            });

            // Single click to rotate (simpler interaction)
            let lastClick = 0;
            shape.on('pointerup', (pointer) => {
                // Don't rotate if we just finished dragging
                if (pointer.getDistance() > 5) {
                    return;
                }

                const now = Date.now();
                if (now - lastClick < 300) { // Double click - rotate
                    // Round to nearest 90° and add 90°
                    const currentAngle = shape.angle;
                    const roundedAngle = Math.round(currentAngle / 90) * 90;
                    shape.angle = (roundedAngle + 90) % 360;
                    this.checkRotationMatch(shape);
                    lastClick = 0; // Reset to avoid triple-click issues
                } else {
                    lastClick = now;
                }
            });

            this.puzzleShapes.push(shape);
        });

        this.contentArea.add(canvas);

        const hint = this.add.text(500, 545, 'Tip: DRAG to move pieces, DOUBLE-CLICK to rotate 90°', {
            fontSize: '13px',
            fill: '#FFD700'
        }).setOrigin(0.5);
        this.contentArea.add(hint);
    }

    drawPuzzleShape(x, y, type, color, size) {
        const container = this.add.container(x, y);
        const graphics = this.add.graphics();

        graphics.fillStyle(color);
        graphics.lineStyle(2, 0x000000);

        switch(type) {
            case 'triangle1':
                // Triangle 1 - Right isosceles triangle, 90° at bottom-left
                // Matches outline: (-size, -size/2), (-size, size/2), (0, size/2)
                graphics.beginPath();
                graphics.moveTo(-size/2, -size/2);   // top left
                graphics.lineTo(-size/2, size/2);    // bottom left (90° corner)
                graphics.lineTo(size/2, size/2);     // bottom right
                graphics.closePath();
                graphics.fillPath();
                graphics.strokePath();
                container.setSize(size, size);
                break;

            case 'triangle2':
                // Triangle 2 - Right isosceles triangle, 90° at top-right
                // Matches outline: (0, -size/2), (size, -size/2), (size, size/2)
                graphics.beginPath();
                graphics.moveTo(-size/2, -size/2);   // top left
                graphics.lineTo(size/2, -size/2);    // top right (90° corner)
                graphics.lineTo(size/2, size/2);     // bottom right
                graphics.closePath();
                graphics.fillPath();
                graphics.strokePath();
                container.setSize(size, size);
                break;

            case 'square':
                // Square centered at origin
                graphics.fillRect(-size/2, -size/2, size, size);
                graphics.strokeRect(-size/2, -size/2, size, size);
                container.setSize(size, size);
                break;
        }

        container.add(graphics);

        return container;
    }

    checkRotationMatch(shape) {
        const targetX = shape.getData('targetX');
        const targetY = shape.getData('targetY');
        const targetRot = shape.getData('targetRot');
        const shapeType = shape.getData('type');

        const distanceOK = Phaser.Math.Distance.Between(shape.x, shape.y, targetX, targetY) < 40;

        // For squares, rotation doesn't matter (looks the same at 0°, 90°, 180°, 270°)
        let rotationOK = true;
        if (shapeType === 'triangle1' || shapeType === 'triangle2') {
            // For triangles, check rotation
            // Normalize angles to 0-360 range for comparison
            const normalizedAngle = ((shape.angle % 360) + 360) % 360;
            const normalizedTarget = ((targetRot % 360) + 360) % 360;
            rotationOK = Math.abs(normalizedAngle - normalizedTarget) < 5;
        }

        if (distanceOK && rotationOK && !shape.getData('matched')) {
            // Perfect match!
            shape.x = targetX;
            shape.y = targetY;
            shape.angle = targetRot;
            shape.setData('matched', true);

            // Lock the piece in place - disable dragging
            shape.disableInteractive();
            this.input.setDraggable(shape, false);

            // Visual feedback
            this.tweens.add({
                targets: shape,
                scale: { from: 1, to: 1.3 },
                yoyo: true,
                duration: 250
            });

            // Check all matched
            this.checkAllRotationMatched();
        }
    }

    checkAllRotationMatched() {
        if (!this.puzzleShapes || this.puzzleShapes.length === 0) return;

        const allMatched = this.puzzleShapes.every(shape => shape.getData('matched') === true);

        if (allMatched) {
            this.feedbackText.setText('🎉 Excellent! You solved the rotation puzzle!');
            this.feedbackText.setColor('#FFD700');
            this.tweens.add({
                targets: this.feedbackText,
                scale: { from: 1, to: 1.3 },
                yoyo: true,
                duration: 300,
                repeat: 3
            });
        }
    }

    drawRotatableShape(x, y, type, color, isOutline) {
        const container = this.add.container(x, y);
        const graphics = this.add.graphics();
        const size = 45;

        if (isOutline) {
            graphics.lineStyle(4, color, 0.7);
        } else {
            graphics.fillStyle(color);
        }

        switch(type) {
            case 'arrow':
                // Arrow pointing up (will be rotated)
                if (isOutline) {
                    graphics.beginPath();
                    graphics.moveTo(0, -size);
                    graphics.lineTo(size * 0.6, -size * 0.3);
                    graphics.lineTo(size * 0.3, -size * 0.3);
                    graphics.lineTo(size * 0.3, size);
                    graphics.lineTo(-size * 0.3, size);
                    graphics.lineTo(-size * 0.3, -size * 0.3);
                    graphics.lineTo(-size * 0.6, -size * 0.3);
                    graphics.closePath();
                    graphics.strokePath();
                } else {
                    graphics.beginPath();
                    graphics.moveTo(0, -size);
                    graphics.lineTo(size * 0.6, -size * 0.3);
                    graphics.lineTo(size * 0.3, -size * 0.3);
                    graphics.lineTo(size * 0.3, size);
                    graphics.lineTo(-size * 0.3, size);
                    graphics.lineTo(-size * 0.3, -size * 0.3);
                    graphics.lineTo(-size * 0.6, -size * 0.3);
                    graphics.closePath();
                    graphics.fillPath();
                }
                break;

            case 'lshape':
                // L-shape
                if (isOutline) {
                    graphics.beginPath();
                    graphics.moveTo(-size, -size);
                    graphics.lineTo(0, -size);
                    graphics.lineTo(0, 0);
                    graphics.lineTo(size, 0);
                    graphics.lineTo(size, size);
                    graphics.lineTo(-size, size);
                    graphics.closePath();
                    graphics.strokePath();
                } else {
                    graphics.beginPath();
                    graphics.moveTo(-size, -size);
                    graphics.lineTo(0, -size);
                    graphics.lineTo(0, 0);
                    graphics.lineTo(size, 0);
                    graphics.lineTo(size, size);
                    graphics.lineTo(-size, size);
                    graphics.closePath();
                    graphics.fillPath();
                }
                break;
        }

        container.add(graphics);
        container.setSize(size * 2.5, size * 2.5);

        return container;
    }

    showRulerPractice() {
        this.titleText.setText('📏 Ruler Practice: Learn to Measure');
        this.instructionText.setText('DRAG the ruler with your mouse. Line up the "0" mark with the LEFT dot. Read the number at the RIGHT dot to measure!');

        // Pre-drawn line to measure
        const lineStartX = 200;
        const lineY = 250;
        const lineLength = 6 * this.cmWidth; // 6 cm

        const lineGraphics = this.add.graphics();
        lineGraphics.lineStyle(5, 0x2196F3);
        lineGraphics.beginPath();
        lineGraphics.moveTo(lineStartX, lineY);
        lineGraphics.lineTo(lineStartX + lineLength, lineY);
        lineGraphics.strokePath();

        lineGraphics.fillStyle(0x2196F3);
        lineGraphics.fillCircle(lineStartX, lineY, 8);
        lineGraphics.fillCircle(lineStartX + lineLength, lineY, 8);

        this.contentArea.add(lineGraphics);

        // Create draggable ruler
        const ruler = this.createDraggableRuler(300, 400);
        this.contentArea.add(ruler.container);

        // Check measurement
        ruler.container.on('drag', () => {
            const rulerX = ruler.container.x;
            const rulerY = ruler.container.y;

            // Check if ruler is aligned with line
            const alignedX = Math.abs(rulerX - lineStartX) < 20;
            const alignedY = Math.abs(rulerY - lineY) < 30;

            if (alignedX && alignedY) {
                this.feedbackText.setText('✓ Perfect! This line is 6 cm long!');
                this.feedbackText.setColor('#4CAF50');
            } else {
                this.feedbackText.setText('Drag the ruler to align with the blue line');
                this.feedbackText.setColor('#c9b699');
            }
        });
    }

    showDrawLine() {
        this.titleText.setText('✏️ Draw a Line Challenge');
        this.instructionText.setText('STEP 1: Drag the ruler where you want. STEP 2: CLICK to place your first point. STEP 3: CLICK again 8 cm away!');

        // Ruler at top
        const ruler = this.createDraggableRuler(300, 180);
        this.contentArea.add(ruler.container);

        // Drawing area
        const graphics = this.add.graphics();
        this.contentArea.add(graphics);

        // Click to place points
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < 100 || pointer.y > 550) return; // Outside drawing area

            if (this.points.length < 2) {
                this.points.push({ x: pointer.x, y: pointer.y });

                // Draw point
                graphics.fillStyle(0xFF9800);
                graphics.fillCircle(pointer.x, pointer.y, 8);

                if (this.points.length === 1) {
                    this.feedbackText.setText('Good! Now click your second point 8 cm away');
                    this.feedbackText.setColor('#c9b699');
                }

                if (this.points.length === 2) {
                    // Draw line
                    graphics.lineStyle(4, 0xFF9800);
                    graphics.beginPath();
                    graphics.moveTo(this.points[0].x, this.points[0].y);
                    graphics.lineTo(this.points[1].x, this.points[1].y);
                    graphics.strokePath();

                    // Calculate distance
                    const dx = this.points[1].x - this.points[0].x;
                    const dy = this.points[1].y - this.points[0].y;
                    const distPixels = Math.sqrt(dx * dx + dy * dy);
                    const distCm = distPixels / this.cmWidth;

                    // Check if correct
                    if (Math.abs(distCm - 8) < 0.3) {
                        this.feedbackText.setText(`✓ Perfect! ${distCm.toFixed(1)} cm - Excellent work!`);
                        this.feedbackText.setColor('#4CAF50');
                        this.tweens.add({
                            targets: this.feedbackText,
                            scale: { from: 1, to: 1.2 },
                            yoyo: true,
                            duration: 300
                        });
                    } else {
                        this.feedbackText.setText(`${distCm.toFixed(1)} cm - Try again! (Need 8 cm)`);
                        this.feedbackText.setColor('#FF6B6B');

                        // Allow retry
                        this.time.delayedCall(2000, () => {
                            graphics.clear();
                            this.points = [];
                            this.feedbackText.setText('');
                        });
                    }
                }
            }
        });
    }

    showProtractorPractice() {
        this.titleText.setText('📐 Protractor Practice: Measure Angles');
        this.instructionText.setText('DRAG the protractor. Put the RED CENTER DOT on the purple dot. Line up the 0° with the bottom line. Read the angle!');

        // Pre-drawn angle
        const angleX = 300;
        const angleY = 300;
        const angleDeg = 60;

        const angleGraphics = this.add.graphics();
        angleGraphics.lineStyle(5, 0x9C27B0);

        // Base line
        angleGraphics.beginPath();
        angleGraphics.moveTo(angleX, angleY);
        angleGraphics.lineTo(angleX + 150, angleY);
        angleGraphics.strokePath();

        // Angled line
        const rad = Phaser.Math.DegToRad(angleDeg);
        angleGraphics.beginPath();
        angleGraphics.moveTo(angleX, angleY);
        angleGraphics.lineTo(angleX + 150 * Math.cos(rad), angleY - 150 * Math.sin(rad));
        angleGraphics.strokePath();

        angleGraphics.fillStyle(0x9C27B0);
        angleGraphics.fillCircle(angleX, angleY, 8);

        this.contentArea.add(angleGraphics);

        // Draggable protractor
        const protractor = this.createDraggableProtractor(500, 400);
        this.contentArea.add(protractor.container);

        // Check alignment
        protractor.container.on('drag', () => {
            const pX = protractor.container.x;
            const pY = protractor.container.y;

            const alignedX = Math.abs(pX - angleX) < 25;
            const alignedY = Math.abs(pY - angleY) < 25;

            if (alignedX && alignedY) {
                this.feedbackText.setText(`✓ Correct! This angle is ${angleDeg}°`);
                this.feedbackText.setColor('#4CAF50');
            } else {
                this.feedbackText.setText('Drag the protractor to align with the angle vertex');
                this.feedbackText.setColor('#c9b699');
            }
        });
    }

    showDrawAngle() {
        this.titleText.setText('🔺 Draw an Angle Challenge');
        this.instructionText.setText('CLICK 3 points: First point, then VERTEX (corner), then third point. Make a 45° angle. Use the protractor!');

        // Protractor at top
        const protractor = this.createDraggableProtractor(500, 180);
        this.contentArea.add(protractor.container);

        const graphics = this.add.graphics();
        this.contentArea.add(graphics);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < 100 || pointer.y > 550) return;

            if (this.points.length < 3) {
                this.points.push({ x: pointer.x, y: pointer.y });

                graphics.fillStyle(0x4CAF50);
                graphics.fillCircle(pointer.x, pointer.y, 8);

                if (this.points.length === 2) {
                    // Draw first line
                    graphics.lineStyle(4, 0x4CAF50);
                    graphics.beginPath();
                    graphics.moveTo(this.points[0].x, this.points[0].y);
                    graphics.lineTo(this.points[1].x, this.points[1].y);
                    graphics.strokePath();

                    this.feedbackText.setText('Click the third point to complete the angle');
                    this.feedbackText.setColor('#c9b699');
                } else if (this.points.length === 3) {
                    // Draw second line
                    graphics.lineStyle(4, 0x4CAF50);
                    graphics.beginPath();
                    graphics.moveTo(this.points[1].x, this.points[1].y);
                    graphics.lineTo(this.points[2].x, this.points[2].y);
                    graphics.strokePath();

                    // Calculate angle (vertex at points[1])
                    const dx1 = this.points[0].x - this.points[1].x;
                    const dy1 = this.points[0].y - this.points[1].y;
                    const dx2 = this.points[2].x - this.points[1].x;
                    const dy2 = this.points[2].y - this.points[1].y;

                    const angle1 = Math.atan2(dy1, dx1);
                    const angle2 = Math.atan2(dy2, dx2);
                    let angleDeg = Math.abs(Phaser.Math.RadToDeg(angle2 - angle1));

                    if (angleDeg > 180) angleDeg = 360 - angleDeg;

                    if (Math.abs(angleDeg - 45) < 5) {
                        this.feedbackText.setText(`✓ Excellent! ${angleDeg.toFixed(1)}° - Perfect 45° angle!`);
                        this.feedbackText.setColor('#4CAF50');
                    } else {
                        this.feedbackText.setText(`${angleDeg.toFixed(1)}° - Try again for 45°`);
                        this.feedbackText.setColor('#FF6B6B');

                        this.time.delayedCall(2000, () => {
                            graphics.clear();
                            this.points = [];
                            this.feedbackText.setText('');
                        });
                    }
                }
            }
        });
    }

    showIdentifyAngles() {
        this.titleText.setText('🔍 Identify Angles');
        this.instructionText.setText('CLICK on the ACUTE angle. Remember: Acute is LESS than 90° (smaller than a right angle)');

        const angles = [
            { x: 250, y: 300, deg: 45, name: 'Acute', correct: true },
            { x: 500, y: 300, deg: 90, name: 'Right', correct: false },
            { x: 750, y: 300, deg: 135, name: 'Obtuse', correct: false }
        ];

        angles.forEach(angle => {
            const graphics = this.add.graphics();

            graphics.lineStyle(5, 0xc9b699);

            // Base line
            graphics.beginPath();
            graphics.moveTo(angle.x - 80, angle.y);
            graphics.lineTo(angle.x, angle.y);
            graphics.strokePath();

            // Angled line
            const rad = Phaser.Math.DegToRad(angle.deg);
            graphics.beginPath();
            graphics.moveTo(angle.x, angle.y);
            graphics.lineTo(angle.x + 80 * Math.cos(rad), angle.y - 80 * Math.sin(rad));
            graphics.strokePath();

            graphics.fillStyle(0xc9b699);
            graphics.fillCircle(angle.x, angle.y, 6);

            // Interactive hit area
            const hitZone = this.add.circle(angle.x, angle.y, 60, 0x000000, 0);
            hitZone.setInteractive({ useHandCursor: true });

            hitZone.on('pointerdown', () => {
                if (angle.correct) {
                    graphics.lineStyle(5, 0x4CAF50);
                    graphics.clear();
                    graphics.lineStyle(5, 0x4CAF50);
                    graphics.beginPath();
                    graphics.moveTo(angle.x - 80, angle.y);
                    graphics.lineTo(angle.x, angle.y);
                    graphics.lineTo(angle.x + 80 * Math.cos(rad), angle.y - 80 * Math.sin(rad));
                    graphics.strokePath();

                    this.feedbackText.setText('✓ Correct! This is an acute angle (45°)');
                    this.feedbackText.setColor('#4CAF50');
                } else {
                    this.feedbackText.setText(`Not quite - that's a ${angle.name} angle. Try again!`);
                    this.feedbackText.setColor('#FF6B6B');
                }
            });

            this.contentArea.add([graphics, hitZone]);
        });
    }

    showParallelChallenge() {
        this.titleText.setText('↔️ Parallel Lines Challenge');
        this.instructionText.setText('CLICK on the pair of PARALLEL lines. Parallel means they NEVER touch - always same distance apart!');

        // Option 1: Parallel lines
        const parallel = this.add.graphics();
        parallel.lineStyle(5, 0xc9b699);
        parallel.beginPath();
        parallel.moveTo(150, 200);
        parallel.lineTo(350, 200);
        parallel.strokePath();
        parallel.beginPath();
        parallel.moveTo(150, 260);
        parallel.lineTo(350, 260);
        parallel.strokePath();

        const parallelHit = this.add.rectangle(250, 230, 220, 90, 0x000000, 0);
        parallelHit.setInteractive({ useHandCursor: true });

        // Option 2: Intersecting lines
        const intersect = this.add.graphics();
        intersect.lineStyle(5, 0xc9b699);
        intersect.beginPath();
        intersect.moveTo(600, 180);
        intersect.lineTo(800, 280);
        intersect.strokePath();
        intersect.beginPath();
        intersect.moveTo(600, 280);
        intersect.lineTo(800, 180);
        intersect.strokePath();

        const intersectHit = this.add.rectangle(700, 230, 220, 120, 0x000000, 0);
        intersectHit.setInteractive({ useHandCursor: true });

        // Option 3: Perpendicular lines
        const perp = this.add.graphics();
        perp.lineStyle(5, 0xc9b699);
        perp.beginPath();
        perp.moveTo(350, 400);
        perp.lineTo(550, 400);
        perp.strokePath();
        perp.beginPath();
        perp.moveTo(450, 350);
        perp.lineTo(450, 450);
        perp.strokePath();

        const perpHit = this.add.rectangle(450, 400, 220, 120, 0x000000, 0);
        perpHit.setInteractive({ useHandCursor: true });

        parallelHit.on('pointerdown', () => {
            parallel.clear();
            parallel.lineStyle(5, 0x4CAF50);
            parallel.beginPath();
            parallel.moveTo(150, 200);
            parallel.lineTo(350, 200);
            parallel.strokePath();
            parallel.beginPath();
            parallel.moveTo(150, 260);
            parallel.lineTo(350, 260);
            parallel.strokePath();

            this.feedbackText.setText('✓ Correct! These lines are parallel - they never meet!');
            this.feedbackText.setColor('#4CAF50');
        });

        intersectHit.on('pointerdown', () => {
            this.feedbackText.setText('Not parallel - these lines intersect. Try again!');
            this.feedbackText.setColor('#FF6B6B');
        });

        perpHit.on('pointerdown', () => {
            this.feedbackText.setText('Not parallel - these are perpendicular lines. Try again!');
            this.feedbackText.setColor('#FF6B6B');
        });

        this.contentArea.add([parallel, intersect, perp, parallelHit, intersectHit, perpHit]);
    }

    showFinalChallenge() {
        this.titleText.setText('🎯 Final Challenge: Master Geometry!');
        this.instructionText.setText('Draw 2 PARALLEL lines, EACH 7 cm long. CLICK 2 points for line 1, then CLICK 2 points for line 2. Use the ruler!');

        // Ruler
        const ruler = this.createDraggableRuler(200, 150);
        this.contentArea.add(ruler.container);

        const graphics = this.add.graphics();
        this.contentArea.add(graphics);

        let lines = [];

        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < 100 || pointer.y > 550) return;

            if (lines.length < 2) {
                if (this.points.length % 2 === 0) {
                    // Start new line
                    this.points.push({ x: pointer.x, y: pointer.y });
                    graphics.fillStyle(0x2196F3);
                    graphics.fillCircle(pointer.x, pointer.y, 8);
                } else {
                    // Complete line
                    this.points.push({ x: pointer.x, y: pointer.y });

                    const p1 = this.points[this.points.length - 2];
                    const p2 = this.points[this.points.length - 1];

                    graphics.lineStyle(4, 0x2196F3);
                    graphics.beginPath();
                    graphics.moveTo(p1.x, p1.y);
                    graphics.lineTo(p2.x, p2.y);
                    graphics.strokePath();

                    graphics.fillStyle(0x2196F3);
                    graphics.fillCircle(p2.x, p2.y, 8);

                    // Calculate length
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distCm = Math.sqrt(dx * dx + dy * dy) / this.cmWidth;

                    lines.push({ p1, p2, length: distCm });

                    if (lines.length === 2) {
                        // Check if both lines are 7cm and parallel
                        const length1OK = Math.abs(lines[0].length - 7) < 0.3;
                        const length2OK = Math.abs(lines[1].length - 7) < 0.3;

                        // Check parallel (similar slopes)
                        const slope1 = (lines[0].p2.y - lines[0].p1.y) / (lines[0].p2.x - lines[0].p1.x);
                        const slope2 = (lines[1].p2.y - lines[1].p1.y) / (lines[1].p2.x - lines[1].p1.x);
                        const parallel = Math.abs(slope1 - slope2) < 0.15;

                        if (length1OK && length2OK && parallel) {
                            this.feedbackText.setText('🎉 PERFECT! You mastered geometry! Both 7 cm and parallel!');
                            this.feedbackText.setColor('#FFD700');
                            this.feedbackText.setFontSize('24px');
                            this.tweens.add({
                                targets: this.feedbackText,
                                scale: { from: 1, to: 1.3 },
                                yoyo: true,
                                duration: 400,
                                repeat: 2
                            });
                        } else if (!length1OK || !length2OK) {
                            this.feedbackText.setText(`Lines: ${lines[0].length.toFixed(1)}cm, ${lines[1].length.toFixed(1)}cm - Need 7 cm each`);
                            this.feedbackText.setColor('#FF6B6B');
                            this.resetFinalChallenge(graphics);
                        } else if (!parallel) {
                            this.feedbackText.setText('Lines are correct length but not parallel. Try again!');
                            this.feedbackText.setColor('#FF6B6B');
                            this.resetFinalChallenge(graphics);
                        }
                    } else {
                        this.feedbackText.setText(`Line 1: ${distCm.toFixed(1)} cm - Draw the second line!`);
                        this.feedbackText.setColor('#c9b699');
                    }
                }
            }
        });
    }

    resetFinalChallenge(graphics) {
        this.time.delayedCall(2500, () => {
            graphics.clear();
            this.points = [];
            this.feedbackText.setText('');
        });
    }

    createDraggableRuler(x, y) {
        const container = this.add.container(x, y);
        const rulerWidth = 700;
        const rulerHeight = 60;
        const cmCount = 14;
        const cmWidth = rulerWidth / cmCount;

        // Helper function to draw ruler
        const drawRuler = (graphics, bgColor, borderWidth) => {
            graphics.clear();
            graphics.fillStyle(bgColor);
            graphics.fillRect(0, 0, rulerWidth, rulerHeight);
            graphics.lineStyle(borderWidth, 0x8b4513);
            graphics.strokeRect(0, 0, rulerWidth, rulerHeight);

            // Draw all the centimeter marks
            for (let i = 0; i <= cmCount; i++) {
                const markX = i * cmWidth;
                graphics.lineStyle(2, 0x000000);
                graphics.beginPath();
                graphics.moveTo(markX, 5);
                graphics.lineTo(markX, 35);
                graphics.strokePath();
            }
        };

        // Ruler body
        const ruler = this.add.graphics();
        drawRuler(ruler, 0xEDD5A8, 2);

        // Number labels
        for (let i = 0; i <= cmCount; i++) {
            const markX = i * cmWidth;
            const label = this.add.text(markX, rulerHeight - 15, i.toString(), {
                fontSize: '14px',
                fill: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            container.add(label);
        }

        // Add "cm" label
        const cmLabel = this.add.text(rulerWidth / 2, rulerHeight / 2, 'centimeters', {
            fontSize: '10px',
            fill: '#8b4513',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        container.add(cmLabel);

        container.add(ruler);

        // Make draggable
        container.setSize(rulerWidth, rulerHeight);
        container.setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(container);

        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });

        container.on('pointerover', () => {
            drawRuler(ruler, 0xF5E6C8, 3);
        });

        container.on('pointerout', () => {
            drawRuler(ruler, 0xEDD5A8, 2);
        });

        return { container, cmWidth };
    }

    createDraggableProtractor(x, y) {
        const container = this.add.container(x, y);
        const radius = 120;

        // Helper function to draw protractor
        const drawProtractor = (graphics, bgColor, borderWidth) => {
            graphics.clear();

            // Semi-circle
            graphics.fillStyle(bgColor, 0.9);
            graphics.slice(0, 0, radius, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0), true);
            graphics.fillPath();

            graphics.lineStyle(borderWidth, 0x8b4513);
            graphics.strokeCircle(0, 0, radius);

            // Degree markings
            for (let angle = 0; angle <= 180; angle += 10) {
                const rad = Phaser.Math.DegToRad(angle);
                const x1 = radius * Math.cos(rad);
                const y1 = -radius * Math.sin(rad);

                const markLen = (angle % 30 === 0) ? 15 : 8;
                const x2 = (radius - markLen) * Math.cos(rad);
                const y2 = -(radius - markLen) * Math.sin(rad);

                graphics.lineStyle(1.5, 0x000000);
                graphics.beginPath();
                graphics.moveTo(x1, y1);
                graphics.lineTo(x2, y2);
                graphics.strokePath();
            }

            // Center dot
            graphics.fillStyle(0xFF0000);
            graphics.fillCircle(0, 0, 5);
        };

        const protractor = this.add.graphics();
        drawProtractor(protractor, 0xEDD5A8, 2);

        // Degree labels
        for (let angle = 0; angle <= 180; angle += 30) {
            const rad = Phaser.Math.DegToRad(angle);
            const textX = (radius - 30) * Math.cos(rad);
            const textY = -(radius - 30) * Math.sin(rad);

            const label = this.add.text(textX, textY, angle + '°', {
                fontSize: '12px',
                fill: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            container.add(label);
        }

        container.add(protractor);

        // Make draggable
        container.setSize(radius * 2, radius);
        container.setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(container);

        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });

        container.on('pointerover', () => {
            drawProtractor(protractor, 0xF5E6C8, 3);
        });

        container.on('pointerout', () => {
            drawProtractor(protractor, 0xEDD5A8, 2);
        });

        return { container };
    }
}

// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: '#0a0a0a',
    parent: 'phaser-game',
    scene: GeometryExplorer,
    input: {
        mouse: {
            preventDefaultWheel: false,
            target: null
        },
        touch: {
            target: null
        }
    }
};

const game = new Phaser.Game(config);

// Disable right-click context menu on the game canvas
game.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});
