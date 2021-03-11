// Title: Motion Catalog
// Author: FAL
// Date: 3. Oct. 2017
// Made with p5.js v0.5.14 (plugin: p5.sound.js v0.3.5)

// (It's my first time coding with p5.js!!)


var soundEnabled = true;
var myOscillator;
var playingSound;
var previousSoundTimeStamp;

var myElementSet;

var frameCountPerCicle = 60;
var currentCicleFrameCount;
var
  currentCicleProgressRatio,
  currentCicleQuadEaseInRatio,
  currentCicleQuadEaseOutRatio,
  currentCicleQuartEaseInRatio,
  currentCicleQuartEaseOutRatio;

var backgroundColor;

function setup() {
  createCanvas(640, 640);
  backgroundColor = color(240);

  myOscillator = new p5.Oscillator();
  myOscillator.setType('sine');
  myOscillator.freq(880);
  myOscillator.amp(0);
  myOscillator.start();

  ellipseMode(CENTER);
  rectMode(CENTER);

  myElementSet = new ElementSet(4, 40);

  myElementSet.push(drawShrinkingCircle);
  myElementSet.push(drawExpandingRipple);
  myElementSet.push(drawPulsingQuadrangle);
  myElementSet.push(drawTransformingEllipse);

//   myElementSet.push(drawFadingAwayCircle);
//   myElementSet.push(drawHittingLine);
//   myElementSet.push(drawBouncingCircle);
//   myElementSet.push(drawJitteringCircle);

//   myElementSet.push(drawRotatingCross);
//   myElementSet.push(drawRotatingCircles);
//   myElementSet.push(drawOrbit);
//   myElementSet.push(drawPulsingSomething);

//   myElementSet.push(drawPoppingCircles);
//   myElementSet.push(drawExplodingSquare);
//   myElementSet.push(drawSpectrum);
//   myElementSet.push(drawString);
}

function draw() {
  background(backgroundColor);
  updateCurrentCicleProgress();

  myElementSet.display();

  if (soundEnabled) {
    if (frameCount % frameCountPerCicle == 0) playSound();
    if (playingSound && millis() - previousSoundTimeStamp > 20) {
      myOscillator.amp(0, 0.1);
      playingSound = false;
    }
  }
}

function updateCurrentCicleProgress() {
  currentCicleFrameCount = frameCount % frameCountPerCicle;
  currentCicleProgressRatio = currentCicleFrameCount / frameCountPerCicle;
  currentCicleQuadEaseInRatio = currentCicleProgressRatio * currentCicleProgressRatio;
  currentCicleQuadEaseOutRatio = -sq(currentCicleProgressRatio - 1) + 1;
  currentCicleQuartEaseInRatio = pow(currentCicleProgressRatio, 4);
  currentCicleQuartEaseOutRatio = -pow(currentCicleProgressRatio - 1, 4) + 1;
}

function mouseClicked() {
  if (soundEnabled) myOscillator.stop();
  else myOscillator.start();
  soundEnabled = !soundEnabled;
}

function playSound() {
  myOscillator.amp(1, 0.02);
  // myOscillator.amp(0, 0.1, 0.02);  // Did not work in OpenProcessing, therefore used millis() as an alternative
  previousSoundTimeStamp = millis();
  playingSound = true;
}



var ElementSet = function(elementXCount, elementDisplaySize) {
  var elementArray = [];
  var positionInterval = width / (elementXCount + 1);
  var xIndex = 0;
  var yIndex = 0;

  this.push = function(displayFunction) {
    elementArray.push(new Element(
      (xIndex + 1) * positionInterval,
      (yIndex + 1) * positionInterval,
      displayFunction
    ));
    xIndex++;
    if (xIndex >= elementXCount) {
      xIndex = 0;
      yIndex++;
    }
  };

  this.display = function() {
    for (var elementIndex = 0, elementNumber = elementArray.length; elementIndex < elementNumber; elementIndex++) {
      elementArray[elementIndex].display(elementDisplaySize);
    }
  };
};

var Element = function(x, y, displayFunction) {
  this.xPosition = x;
  this.yPosition = y;
  this.display = displayFunction;
};



function drawShrinkingCircle(size) {
  var diameter = size * (1.5 - currentCicleQuartEaseOutRatio);
  noStroke();
  fill(0);
  ellipse(this.xPosition, this.yPosition, diameter, diameter);
}

function drawExpandingRipple(size) {
  var diameter = size * 1.5 * currentCicleQuartEaseOutRatio;
  stroke(0);
  strokeWeight(size * 0.2 * (1 - currentCicleQuartEaseOutRatio));
  noFill();
  ellipse(this.xPosition, this.yPosition, diameter, diameter);
}

function drawHittingLine(size) {
  var offsetYPosition = -size * 0.25 + size * 0.5 * (1 - currentCicleQuartEaseOutRatio);
  noStroke();
  fill(0);
  rect(this.xPosition, this.yPosition + offsetYPosition, size * 0.1, size);
}

function drawPulsingQuadrangle(size) {
  var radius = size * 0.5;
  if (currentCicleProgressRatio < 0.1) {
    radius += radius * currentCicleProgressRatio * 10;
  } else if (currentCicleProgressRatio < 0.2) {
    radius += radius * (1 - (currentCicleProgressRatio - 0.1) * 10);
  }
  stroke(0);
  strokeWeight(1);
  noFill();
  quad(
    this.xPosition + radius, this.yPosition,
    this.xPosition, this.yPosition + radius,
    this.xPosition - radius, this.yPosition,
    this.xPosition, this.yPosition - radius
  );
}

function drawRotatingCross(size) {
  var rotationAngle = PI * currentCicleQuartEaseOutRatio;
  noStroke();
  fill(0);
  push();
  translate(this.xPosition, this.yPosition);
  rotate(rotationAngle);
  rect(0, 0, size, size * 0.15);
  rect(0, 0, size * 0.15, size);
  pop();
}

function drawRotatingCircles(size) {
  var rotationAngle = PI * currentCicleQuartEaseOutRatio;
  var diameter = size * 0.2;
  noStroke();
  fill(0);
  push();
  translate(this.xPosition, this.yPosition);
  rotate(rotationAngle);
  ellipse(0, -size * 0.5, diameter, diameter);
  ellipse(0, +size * 0.5, diameter, diameter);
  pop();
}

function drawFadingAwayCircle(size) {
  var alpha = 255 * (1 - currentCicleQuartEaseOutRatio);
  var offsetYPosition = size * 1.2 * (0.5 - currentCicleQuartEaseOutRatio);
  var diameter = size * 0.5;
  noStroke();
  fill(0, alpha);
  ellipse(this.xPosition, this.yPosition + offsetYPosition, diameter, diameter);
}

function drawBouncingCircle(size) {
  var offsetYPosition = size * 0.5 - size * 5 * currentCicleProgressRatio + size * 5 * currentCicleQuadEaseInRatio;
  var diameter = size * 0.3;
  noStroke();
  fill(0);
  ellipse(this.xPosition, this.yPosition + offsetYPosition, diameter, diameter);
}

function drawTransformingEllipse(size) {
  var xAxis = size * 0.6 * (2 - currentCicleQuartEaseOutRatio);
  var yAxis = size * 0.6 * (1 + currentCicleQuartEaseOutRatio);
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(this.xPosition, this.yPosition, xAxis, yAxis);
}

function drawOrbit(size) {
  var angle = -HALF_PI + TWO_PI * currentCicleQuartEaseOutRatio;
  var particleSize = size * 0.2;
  var radius = size * 0.5;
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(this.xPosition, this.yPosition, size, size);
  noStroke();
  fill(0);
  ellipse(this.xPosition + radius * cos(angle), this.yPosition + radius * sin(angle), particleSize, particleSize);
}

function drawPoppingCircles(size) {
  var diameter = size * 0.3 * (1 - currentCicleProgressRatio);
  var distance = size * 0.7 * (currentCicleQuartEaseOutRatio);
  stroke(0);
  strokeWeight(1);
  noFill();
  for (var i = 0; i < 5; i++) {
    var rotationAngle = -HALF_PI + i * TWO_PI / 5;
    push();
    translate(this.xPosition, this.yPosition);
    rotate(rotationAngle);
    ellipse(distance, 0, diameter, diameter);
    pop();
  }
}

function drawExplodingSquare(size) {
  var sideLength = size * 0.7;
  var alpha = 255 * currentCicleQuadEaseInRatio;
  var rotationAngle = TWO_PI * currentCicleQuartEaseOutRatio;
  var particleSize = size * 0.2;
  var particleBaseDistance = size * currentCicleQuadEaseOutRatio;
  var particleRotationAngle = TWO_PI * currentCicleProgressRatio;
  var particleAlpha = 255 * (1 - currentCicleQuartEaseOutRatio);

  stroke(0, alpha);
  strokeWeight(1);
  noFill();
  push();
  translate(this.xPosition, this.yPosition);
  rotate(rotationAngle);
  rect(0, 0, sideLength, sideLength);
  pop();

  stroke(0, particleAlpha);
  for (var i = 0; i < 16; i++) {
    var directionAngle = i * TWO_PI / 16;
    var distanceFactor = 1 + 0.5 * sin(i * 10);
    push();
    translate(
      this.xPosition + particleBaseDistance * distanceFactor * cos(directionAngle),
      this.yPosition + particleBaseDistance * distanceFactor * sin(directionAngle)
    );
    rotate(particleRotationAngle);
    rect(0, 0, particleSize, particleSize);
    pop();
  }
}

function drawPulsingSomething(size) {
  var angle = TWO_PI * currentCicleQuartEaseOutRatio;
  var particleSize = size * 0.2;
  var halfSize = size * 0.5;
  stroke(0);
  strokeWeight(1);
  line(this.xPosition - halfSize, this.yPosition, this.xPosition + halfSize, this.yPosition);
  noStroke();
  fill(0);
  ellipse(
    this.xPosition - halfSize + size * currentCicleProgressRatio,
    this.yPosition - halfSize * sin(angle),
    particleSize,
    particleSize
  );
}

function drawJitteringCircle(size) {
  var maxDisplacement = size * 0.5 * (1 - currentCicleQuadEaseOutRatio);
  var diameter = size * 0.3;
  noStroke();
  fill(0);
  ellipse(
    this.xPosition + random(-maxDisplacement, maxDisplacement),
    this.yPosition + random(-maxDisplacement, maxDisplacement),
    diameter,
    diameter
  );
}

function drawSpectrum(size) {
  var amplitude = size * (0.2 + 0.8 * (1 - currentCicleQuadEaseOutRatio));
  var barWidth = size * 0.1;
  var barInterval = size * 0.2;
  var halfSize = size * 0.5;
  var offsetXPosition = -halfSize + barWidth * 0.5;
  push();
  rectMode(CORNER);
  noStroke();
  fill(0);
  for (var i = 0; i < 6; i++) {
    var barLength = amplitude * random(1);
    rect(
      this.xPosition + offsetXPosition + i * barInterval,
      this.yPosition + halfSize - barLength,
      barWidth,
      barLength
    );
  }
  pop();
}

function drawString(size) {
  var diameter = size * 0.15;
  var amplitude = size * 0.5 * (1 - currentCicleProgressRatio);
  var halfLength = size * 0.7;
  var yDisplacement = amplitude;
  if (currentCicleFrameCount % 2 == 0) {
    yDisplacement = -yDisplacement;
  }

  stroke(0);
  strokeWeight(1);
  noFill();
  for (var i = 0; i < 3; i++) {
    if (i >= 1) {
      yDisplacement = amplitude * random(-1, 1);
    }
    bezier(
      this.xPosition - halfLength, this.yPosition,
      this.xPosition, this.yPosition + yDisplacement,
      this.xPosition, this.yPosition + yDisplacement,
      this.xPosition + halfLength, this.yPosition
    );
  }
  noStroke();
  fill(0);
  ellipse(this.xPosition - halfLength, this.yPosition, diameter, diameter);
  ellipse(this.xPosition + halfLength, this.yPosition, diameter, diameter);
}
