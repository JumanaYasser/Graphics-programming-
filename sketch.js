 /*
COMMENTARY

TASK 1 - STREAMING CAROUSEL

For Task 1, I loaded the 8 images given in the coursework and one background image I got. I used RGB and HSB thresholding to remove the backgrounds.
I used different threshold values for the images because their backgrounds were different. Pressing "C" loads the carousel, "L" processes the images and "S" 
starts the animation. While the images are processing, I show the progress on the screen, like 1/8, 2/8 and so on. The actors move from left to right and 
the background also moves from left to right. The actor names move from right to left. The actors fade in and out and also zoom in or out. The animation 
goes through all 8 actors.

TASK 2 - PANORAMA MOTION GUIDE

For Task 2, I started with the 4 pairs provided in the coursework. I made another 4 pairs in GIMP using the provided images because I wanted to 
test more directions. I then used grayscale, edge detection and thresholding before finding the centroid of each frame. I compare the two centroid 
positions to see how much the x and y values changed. From this I can find the direction of the movement. I tested all 8 directions, including the 
diagonal ones, and added an arrow to show the result. I also added a slider so I can change the threshold instead of using only one value.

PROBLEMS AND SOLUTIONS

One problem was finding threshold values that worked for all 8 images. I tried different RGB and HSB values until I got a result where the background 
was removed but the actor was still visible. I also had some difficulty with diagonal movement. I fixed this by checking both the x and y changes between
the two centroids. I also made 4 extra pairs in GIMP from the provided images so I could test more movement cases.

PROJECT PROGRESS

I completed the main requirements for both tasks and tested the image processing, carousel animation and movement detection. I also tested different 
threshold values and the extra image pairs. If I had more time, I would use a graphics or animation library to make the project more visually appealing 
and add some more advanced interactive effects.

EXTENSION

For my extension, I added more controls to the carousel animation. SPACE pauses and resumes the animation, while the + and - keys change the animation 
speed. I also added a motion trail which stores the actor's previous positions and displays fading copies behind the actor while it moves. The trail is 
cleared when the next actor starts. I added these features to make the animation more interactive and to give a visual effect showing the movement of the
actors.
*/


//Task 1 variables 

let carouselLoaded = false;
let imagesProcessed = false;
let animationStarted = false;
let animationPaused = false;
let animationSpeed = 1;

//save old actor positions for the trail effect
let motionTrail = [];
let trailSize = 3;

//array to store all 8 actor images 
let images = [];

//store the processed actor images 
let processedImages = []; 

//threshold values used for each actor
let thresholds = [];

let titles = [
    "Actor 1",
    "Actor 2",
    "Actor 3",
    "Actor 4",
    "Actor 5",
    "Actor 6",
    "Actor 7",
    "Actor 8"
];

//set the threshold values for each image (HSB)
thresholds[0] = [1, 28, 75, 0];
thresholds[1] = [1, 28, 95, 0];
thresholds[2] = [1, 35, 81, 0];
thresholds[3] = [1, 40, 90, 0];
thresholds[4] = [1, 40, 90, 0];
thresholds[5] = [1, 40, 90, 0];
thresholds[6] = [1, 29, 95, 0];
//image 8 uses RGB thresholding 
thresholds[7] = [0, 210, 210, 210];

let zoomIn = true;

let isProcessing = false;
let imageIndex = 0;

let actorAnimation = 0;

let backgroundImage;
let backgroundPosition = 0;

//controls which actor is being shown
let currentActor = 0;

//keeps track of the current task
let currentTask = 0;

//Task 2 variables
let panoramaLoaded = false;
let imagesPairLoaded = false;
let pairs = [];
let currentPairIndex = 0;

//detected direction
let detectedDirection = "";
let showArrow = false;

//movement between the two centroids
let motionX = 0;
let motionY = 0;
let centroid1 = null;
let centroid2 = null;

//store the grayscale versions of both frames
let grayscaleDone = false;
let grayFrame1;
let grayFrame2;

//store the edge filtered versions of both frames
let edgesDone = false;
let edgeFrame1;
let edgeFrame2;
let thresholdDone = false;
let thresholdFrame1;
let thresholdFrame2;

//threshold value used for edge detection
let edgeThreshold = 100;

//slider used to change the edge threshold interactively
let thresholdSlider;

//position of the actor
let actorX = -320;

let motionArrow;

function setup() {
    createCanvas(1000, 600);
    colorMode(RGB, 255);

    //create the threshold slider
    thresholdSlider = createSlider(0, 255, edgeThreshold, 1);
    thresholdSlider.size(250); 
    thresholdSlider.position(380, 485);
    //hide slider until task 2
    thresholdSlider.hide();

    motionArrow = new MotionArrow();

    loadImages();
}

async function loadImages() {

    //Task 1 Images
    for (let i = 1; i <= 8; i++) {
        let img = await loadImage("task 1 images/" + i + ".jpg");
        images.push(img);
    }
    //load background image
    backgroundImage = await loadImage("task 1 images/background.jpg");

    //Task 2 Images
    for (let i = 1; i <= 8; i++) {
        let img1 = await loadImage("task 2 images/pair" + i + "_1.png");
        let img2 = await loadImage("task 2 images/pair" + i + "_2.png");

        pairs.push({
            frame1: img1,
            frame2: img2
        });
    }
}

function draw() {
    background(30);

    //show the correct page
    if (currentTask === 0) {
        HomePage();
    }

    else if (currentTask === 1) {
        Task1();
    }

    else if (currentTask === 2) {
        Task2();
    }
}

function HomePage() {
    fill(255);
    textAlign(CENTER, CENTER);

    textSize(40);
    textStyle(NORMAL);
    text("IMAGE PROCESSING APPLICATIONS", width / 2, 200);

    textSize(22);
    textStyle(BOLD);
    text("Press [ 1 ]  STREAMING CAROUSEL", width / 2, 330);
    text("Press [ 2 ]  PANORAMA MOTION GUIDE", width / 2, 380);


    textAlign(LEFT, BASELINE);
}

function Task1() {

    //process images one by one 
    if (isProcessing) {

        if (imageIndex < images.length) {

            if (thresholds[imageIndex][0] == 0) {
                processedImages[imageIndex] =
                    processRGB(images[imageIndex], thresholds[imageIndex]);
            } else {
                processedImages[imageIndex] =
                    processHSB(images[imageIndex], thresholds[imageIndex]);
            }

            imageIndex++;

        } else {

            isProcessing = false;
            imagesProcessed = true;
        }
    }

    //draw the background twice so it can loop
    if (backgroundImage) {
        image(backgroundImage, backgroundPosition - width, 0, width, height);
        image(backgroundImage, backgroundPosition, 0, width, height);

        //transparent dark layer so background become less visible to show actors well
        fill(0, 100);
        rect(0, 0, width, height);
    }

    if (carouselLoaded && imagesProcessed) {

        //get the current actor 
        let person = processedImages[currentActor];

        //each actor has 180 frames of animation
        let phase = actorAnimation % 180;

        let alphaValue = 0;
        let imageWidth = 200;
        let imageHeight = 300;

        //fade in and zoom
        if (phase < 60) {

            let progress = phase / 60;

            alphaValue = progress * 255;

            if (zoomIn) {
                imageWidth = 200 + progress * 40;
                imageHeight = 300 + progress * 60;
            } else {
                imageWidth = 240 - progress * 40;
                imageHeight = 360 - progress * 60;
            }
        }

        //actor is fully visible
        else if (phase < 120) {

            alphaValue = 255;

            if (zoomIn) {
                imageWidth = 240;
                imageHeight = 360;
            } else {
                imageWidth = 200;
                imageHeight = 300;
            }
        }

       //fade out
        else {

            let progress = (phase - 120) / 60;

            alphaValue = (1 - progress) * 255;

            if (zoomIn) {
                imageWidth = 240;
                imageHeight = 360;
            } else {
                imageWidth = 200;
                imageHeight = 300;
            }
        }

        //move actor from left to right 
        let movementProgress = phase / 180;

        actorX = -imageWidth + movementProgress * (width + imageWidth);


        //draw trail effect 
        for(let i =0; i < motionTrail.length; i++) {

            let trail = motionTrail[i];

            tint(255, (i + 1) * 15);

            image(person, trail.x, trail.y, trail.width, trail.height);
        }

        noTint();

        image(
            person,
            actorX,
            (height - imageHeight) / 2,
            imageWidth,
            imageHeight
        );

        //save actor position for the trail
        if (animationStarted && !animationPaused) {

            motionTrail.push({
                x: actorX,
                y: (height - imageHeight) / 2,
                width: imageWidth,
                height: imageHeight
            });

            //remove old positions
            if (motionTrail.length > trailSize) {
                motionTrail.shift();
            }
        }

        //move the title from right to left
        let textProgress = phase / 180;
        let textPositionX = width - textProgress * (width + 250);

        fill(255);
        textSize(42);
        textStyle(BOLD);
        textAlign(LEFT, BASELINE);

        text(
            titles[currentActor],
            textPositionX,
            520
        );

        textStyle(NORMAL);

        //update the actor and background positions 
        if (animationStarted && !animationPaused) {

            actorAnimation += animationSpeed;

            //move to next actor
            if (actorAnimation >= 180) {

                actorAnimation = 0;

                currentActor++;

                motionTrail = [];

                //start again after actor 8
                if (currentActor >= processedImages.length) {
                    currentActor = 0;
                }

                //change between zoom in and zoom out 
                zoomIn = !zoomIn;
            }

            //move background 
            backgroundPosition += animationSpeed;

            if (backgroundPosition >= width) {
                backgroundPosition = 0;
            }
        }
    }

    //show the current loading status and next step
    fill(255);
    textSize(20);
    textAlign(LEFT, BASELINE);
    
    //check which stage of Task 1 has been reached
    if (images.length < 8) {

        text("Loading images: " + images.length + "/8", 20, 30);

    } else if (!carouselLoaded) {

        text("Press C to load carousel", 20, 80);

    } else if (isProcessing) {

        text("Processing images: " + imageIndex + "/8", 20, 80);

    } else if (!imagesProcessed) {

        text("Press L to process images", 20, 80);

    } else if (!animationStarted) {

        text("Images ready - press S to start", 20, 80);

    } else if (animationPaused) {

        text("Animation paused - press SPACE to resume", 20, 80);
        text("Speed: " + animationSpeed.toFixed(1) + "x  |  Press + / - to change speed", 20, 105);
    } else {

        text("Animation running - press SPACE to pause", 20, 80);
        text("Speed: " + animationSpeed.toFixed(1) + "x  |  Press + / - to change speed", 20, 105);  
    }
}

function Task2() {

    //show the threshold slider in Task 2
    if (thresholdSlider) {
        thresholdSlider.show();

        //get the slider value
        edgeThreshold = thresholdSlider.value();

        //update the threshold while the slider changes
        if (edgesDone) {
            updateThreshold();
        }
    }

    fill(255);
    textAlign(CENTER, CENTER);

    if (!panoramaLoaded) {

        textSize(40);
        textStyle(BOLD);
        text("Task 2", width / 2, 220);

        textSize(24);
        textStyle(NORMAL);
        text("Panorama Motion Guide", width / 2, 280);
        text("Press P to load the panorama screen", width / 2, 330);

    } else if (!imagesPairLoaded) {

        textSize(40);
        textStyle(BOLD);
        text("Panorama Motion Guide", width / 2, 100);

        textSize(22);
        textStyle(NORMAL);
        text("Panorama screen loaded", width / 2, 180);
        text("Press I to load image pairs", width / 2, 230);

    } else {

        textSize(28);
        textStyle(BOLD);

        text("Pair " + (currentPairIndex + 1), width / 2, 60);

        //show current pair after each processing step
        let currentPair = pairs[currentPairIndex];
        if (currentPair) {
            if (thresholdDone) {

            image(thresholdFrame1, 60, 110, 420, 280);
            image(thresholdFrame2, 520, 110, 420, 280);

        } else if (edgesDone) {

            image(edgeFrame1, 60, 110, 420, 280);
            image(edgeFrame2, 520, 110, 420, 280);

        } else if (grayscaleDone) {

            image(grayFrame1, 60, 110, 420, 280);

            image(grayFrame2, 520, 110, 420, 280);

        } else {

            image(currentPair.frame1, 60, 110, 420, 280);
            image(currentPair.frame2, 520, 110, 420, 280);
        }       
        textSize(18);
        textStyle(BOLD);
        text("Frame 1", 270, 410);
        text("Frame 2", 730, 410);

        textSize(16);
        textStyle(NORMAL);
        text(
            "G = Grayscale | E = Edges | T = Threshold | N = Centroid | D = Direction | X = Next Pair" ,
            width / 2,
            440
        );

        //display the current threshold value
        textSize(18);
        textStyle(BOLD);

        text(
            "Edge Threshold: " + edgeThreshold,
            width / 2,
            465
        );

        //display the calculated centroids and detected movement
        textSize(20);
        textStyle(BOLD);

        if (centroid1 && centroid2) {
            textSize(16);
            textStyle(NORMAL);

            text(
                "Centroid 1: (" + centroid1.x.toFixed(1) + ", " + centroid1.y.toFixed(1) + ")",
                width / 2 + 250,
                480
            );

            text(
                "Centroid 2: (" + centroid2.x.toFixed(1) + ", " + centroid2.y.toFixed(1) + ")",
                width / 2 + 250,
                500
            );
        }

        if(showArrow){
            text(
                "Detected Motion: " + detectedDirection,
                width / 2,
                510
            );
        }
        if (showArrow) {
            motionArrow.draw(detectedDirection);
        }

        textStyle(NORMAL);
    }
  }

    textAlign(LEFT, BASELINE);
}

function updateThreshold() {

    //only update when edge detection has been completed
    if (edgesDone) {

        //get the current slider value
        edgeThreshold = thresholdSlider.value();

        //recalculate the thresholded images
        thresholdFrame1 =
            thresholdEdges(edgeFrame1, edgeThreshold);

        thresholdFrame2 =
            thresholdEdges(edgeFrame2, edgeThreshold);

        //make sure the threshold images are displayed
        thresholdDone = true;
    }
}

function keyPressed() {

    let pressedKey = key.toLowerCase();

    //switch to Task 1
    if (pressedKey === '1') {

        currentTask = 1;

        //hide Task 2 threshold slider
        if (thresholdSlider) {
            thresholdSlider.hide();
        }

        //reset Task 1
        carouselLoaded = false;
        imagesProcessed = false;
        animationStarted = false;
        animationPaused = false;
        isProcessing = false;
        imageIndex = 0;
        actorAnimation = 0;
        currentActor = 0;
        backgroundPosition = 0;
        zoomIn = true;
        motionTrail = [];
    }

    //switch to Task 2
    else if (pressedKey === '2') {

        currentTask = 2;
    }

    //Task 1 controls
    if (currentTask === 1) {

        // C loads the carousel
        if (pressedKey === 'c') {
            carouselLoaded = true;
            animationStarted = false;
        }

        // L processes the images after the carousel is loaded
        if (pressedKey === 'l' && carouselLoaded) {
            isProcessing = true;
            imagesProcessed = false;
            imageIndex = 0;
            processedImages = [];
        }

        // S starts the animation after processing is finished
        if (pressedKey === 's' && imagesProcessed) {
            animationStarted = true;
        }

        //pause or resume the animation
        if (pressedKey === ' ') {
            animationPaused = !animationPaused;
        }
        //change the animation speed
        if (pressedKey === '+') {
            animationSpeed += 0.5;

            if(animationSpeed > 3){
                animationSpeed = 3;
            }
        }

        if (pressedKey === '-') {
            animationSpeed -= 0.5;

            if (animationSpeed < 0.5) {
                animationSpeed = 0.5;
            }
        }
    }
    //Task 2 controls
    if (currentTask === 2) {

        if (pressedKey === 'p') {
            panoramaLoaded = true;
        }
        if (pressedKey === 'i' && panoramaLoaded) {
            imagesPairLoaded = true;
            currentPairIndex = 0;
            grayscaleDone = false;
        }
        if (pressedKey === 'g' && imagesPairLoaded) {

            let currentPair = pairs[currentPairIndex];

            grayFrame1 = convertToGrayscale(currentPair.frame1);
            grayFrame2 = convertToGrayscale(currentPair.frame2);

            grayscaleDone = true;
        }
        if (pressedKey === 'e' && grayscaleDone) {
            edgeFrame1 = applyEdgeFilter(grayFrame1);
            edgeFrame2 = applyEdgeFilter(grayFrame2);

            edgesDone = true;
        }
        if (pressedKey === 't' && edgesDone) {
            // Apply thresholding to both edge images
            thresholdFrame1 = thresholdEdges(edgeFrame1, edgeThreshold);
            thresholdFrame2 = thresholdEdges(edgeFrame2, edgeThreshold);

            thresholdDone = true;
        }
        if (pressedKey === 'd' && thresholdDone) {
            detectDirection();
            showArrow = true;
        }
        // calculate the centroid of the selected pixels in both frames
        if (pressedKey === 'n' && thresholdDone) {

            centroid1 = calculateCentroid(thresholdFrame1);
            centroid2 = calculateCentroid(thresholdFrame2);

            if (centroid1 && centroid2) {
                motionX = centroid2.x - centroid1.x;
                motionY = centroid2.y - centroid1.y;
            }
        }
        // move to the next image pair
        if (pressedKey === 'x' && imagesPairLoaded) {

            currentPairIndex++;

            if (currentPairIndex >= pairs.length) {
                currentPairIndex = 0;
            }

            edgeThreshold = 100;
            thresholdSlider.value(100);

            showArrow = false;
            detectedDirection = "";

            motionX = 0;
            motionY = 0;

            centroid1 = null;
            centroid2 = null;

            grayscaleDone = false;
            grayFrame1 = null;
            grayFrame2 = null;

            edgesDone = false;
            edgeFrame1 = null;
            edgeFrame2 = null;

            thresholdDone = false;
            thresholdFrame1 = null;
            thresholdFrame2 = null;
        }
    }
}

function processRGB(img, settings) {

    let redThreshold = settings[1];
    let greenThreshold = settings[2];
    let blueThreshold = settings[3];

    //make a copy so the original image is not changed
    let result = img.get();

    result.loadPixels();

    for (let i = 0; i < result.pixels.length; i += 4) {

        let r = result.pixels[i];
        let g = result.pixels[i + 1];
        let b = result.pixels[i + 2];

        //remove pixels that are close to the background colour
        if (r > redThreshold &&
            g > greenThreshold &&
            b > blueThreshold) {

            result.pixels[i + 3] = 0;
        }
    }

    result.updatePixels();

    return result;
}

function processHSB(img, settings) {

    let saturationThreshold = settings[1];
    let brightnessThreshold = settings[2];

    let result = img.get();
    result.loadPixels();

    colorMode(RGB, 255);

    for (let i = 0; i < result.pixels.length; i += 4) {

        let r = result.pixels[i];
        let g = result.pixels[i + 1];
        let b = result.pixels[i + 2];

        let c = color(r, g, b);

        let s = saturation(c);
        let br = brightness(c);

        if (s < saturationThreshold &&
            br > brightnessThreshold) {

            result.pixels[i] = 0;
            result.pixels[i + 1] = 0;
            result.pixels[i + 2] = 0;
            result.pixels[i + 3] = 0;
        }
    }

    result.updatePixels();
    return result;
}

//convert each pixel to grayscale using the average RGB value
function convertToGrayscale(img) {

    let result = img.get();

    result.loadPixels();

    for (let i = 0; i < result.pixels.length; i += 4) {

        let r = result.pixels[i];
        let g = result.pixels[i + 1];
        let b = result.pixels[i + 2];

        let gray = (r + g + b) / 3;

        result.pixels[i] = gray;
        result.pixels[i + 1] = gray;
        result.pixels[i + 2] = gray;
    }

    result.updatePixels();

    return result;
}


//find edges by comparing each pixel with its neighbours
function applyEdgeFilter(img) {
    let result = img.get();

    result.loadPixels();

    let original = img.get();
    original.loadPixels();

    for (let y = 1; y < result.height - 1; y++) {

        for (let x = 1; x < result.width - 1; x++) {

            let index = (x + y * result.width) * 4;

            let left = ((x - 1) + y * result.width) * 4;
            let right = ((x + 1) + y * result.width) * 4;

            let top = (x + (y - 1) * result.width) * 4;
            let bottom = (x + (y + 1) * result.width) * 4;

            let horizontal =
                original.pixels[right] -
                original.pixels[left];

            let vertical =
                original.pixels[bottom] -
                original.pixels[top];

            let edge = abs(horizontal) + abs(vertical);

            edge = constrain(edge, 0, 255);

            result.pixels[index] = edge;
            result.pixels[index + 1] = edge;
            result.pixels[index + 2] = edge;
            result.pixels[index + 3] = 255;
        }
    }

    result.updatePixels();

    return result;
}

//turn the edge image into black and white using the threshold
function thresholdEdges(img, thresholdValue) {

    let result = img.get();

    result.loadPixels();

    for (let i = 0; i < result.pixels.length; i += 4) {

        let value = result.pixels[i];

        if (value > thresholdValue) {
            result.pixels[i] = 255;
            result.pixels[i + 1] = 255;
            result.pixels[i + 2] = 255;
        } else {
            result.pixels[i] = 0;
            result.pixels[i + 1] = 0;
            result.pixels[i + 2] = 0;
        }

        result.pixels[i + 3] = 255;
    }

    result.updatePixels();

    return result;
}

//find the average x and y position of all selected pixels
function calculateCentroid(img) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    img.loadPixels();

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let index = (y * img.width + x) * 4;

            if (img.pixels[index] > 0) {
                sumX += x;
                sumY += y;
                count++;
            }
        }
    }

    if (count === 0) {
        return null;
    }

    return {
        x: sumX / count,
        y: sumY / count
    };
}

//use the centroid movement to work out the direction
function detectDirection() {

    //ignore very small movements
    let movementLimit = 5;

    let horizontalMovement = abs(motionX);
    let verticalMovement = abs(motionY);

    if (horizontalMovement < movementLimit &&
        verticalMovement < movementLimit) {

        detectedDirection = "NO MOTION";
    }

    else if (horizontalMovement > movementLimit &&
             verticalMovement <= movementLimit) {

        if (motionX > 0) {
            detectedDirection = "RIGHT";
        } else {
            detectedDirection = "LEFT";
        }
    }

    else if (verticalMovement > movementLimit &&
             horizontalMovement <= movementLimit) {

        if (motionY > 0) {
            detectedDirection = "DOWN";
        } else {
            detectedDirection = "UP";
        }
    }

    else {

        if (motionX > 0 && motionY > 0) {
            detectedDirection = "DOWN-RIGHT";
        }
        else if (motionX < 0 && motionY < 0) {
            detectedDirection = "UP-LEFT";
        }
        else if (motionX > 0 && motionY < 0) {
            detectedDirection = "UP-RIGHT";
        }
        else {
            detectedDirection = "DOWN-LEFT";
        }
    }
}

class MotionArrow {

    //set starting position of the arrow
    constructor() {
        this.startX = 0;
        this.startY = 0;
    }

    draw(direction) {

        //starting position for each direction
        let positions = {
            "RIGHT": [400, 550],
            "LEFT": [600, 550],
            "DOWN-RIGHT": [400, 525],
            "UP-LEFT": [600, 590],
            "UP": [500, 606],
            "DOWN": [500, 525],
            "UP-RIGHT": [400, 590],
            "DOWN-LEFT": [600, 540]
        };

        //how arrow moves for each direction 
        let movement = {
            "RIGHT": [200, 0],
            "LEFT": [-200, 0],
            "UP": [0, -80],
            "DOWN": [0, 80],
            "UP-RIGHT": [150, -60],
            "UP-LEFT": [-150, -60],
            "DOWN-RIGHT": [150, 60],
            "DOWN-LEFT": [-150, 60]
        };

        this.startX = positions[direction][0];
        this.startY = positions[direction][1];

        let endX = this.startX + movement[direction][0];
        let endY = this.startY + movement[direction][1];

        //arrow line
        stroke(255);
        strokeWeight(8);
        line(this.startX, this.startY, endX, endY);

        //arrow tip angle
        let angle = atan2(
            endY - this.startY,
            endX - this.startX
        );

        //draw arrow tip 
        line(
            endX,
            endY,
            endX - 25 * cos(angle - PI / 6),
            endY - 25 * sin(angle - PI / 6)
        );

        line(
            endX,
            endY,
            endX - 25 * cos(angle + PI / 6),
            endY - 25 * sin(angle + PI / 6)
        );

        strokeWeight(1);
    }
}   