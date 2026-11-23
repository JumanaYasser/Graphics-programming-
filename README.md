# Graphics-programming-
# Image Processing Applications – p5.js

## Project Overview

This project focuses on developing two image processing applications using JavaScript and the p5.js library. It was completed as part of my Computer Science coursework.

The project consists of two main tasks: a Streaming Carousel and a Panorama Motion Guide. Both tasks use image processing techniques to manipulate images, detect movement, and display visual results.

## Task 1: Streaming Carousel

The first task involves creating an animated carousel that displays eight actors against a moving background.

### Features
- Loads eight actor images and one background image.
- Uses RGB and HSB thresholding to remove image backgrounds.
- Applies different threshold values depending on each image.
- Displays image processing progress on the screen.
- Animates actors moving from left to right.
- Moves the background and actor names in opposite directions.
- Uses fading and zooming effects to make the animation smoother.
- Includes a motion trail effect that displays fading copies of previous actor positions.

### Controls

| Key | Function |
|---|---|
| `1` | Open Task 1 |
| `C` | Load the carousel |
| `L` | Process the images |
| `S` | Start the animation |
| `SPACE` | Pause or resume the animation |
| `+` | Increase animation speed |
| `-` | Decrease animation speed |

## Task 2: Panorama Motion Guide

The second task focuses on detecting the direction of movement between two images.

I used the four image pairs provided in the coursework and created another four pairs using GIMP to test additional movement directions.

### Image Processing Techniques
- **Grayscale Conversion:** Converts images into grayscale using RGB values.
- **Edge Detection:** Detects edges by comparing neighbouring pixels.
- **Thresholding:** Converts edge images into black and white using a selected threshold.
- **Centroid Calculation:** Calculates the average position of the selected pixels in each image.
- **Motion Detection:** Compares the two centroid positions to determine the direction of movement.

### Features
- Processes eight pairs of images.
- Detects eight movement directions, including diagonal directions.
- Displays an arrow to represent the detected movement.
- Shows the calculated centroid coordinates.
- Includes an interactive slider to adjust the edge detection threshold.

### Controls

| Key | Function |
|---|---|
| `2` | Open Task 2 |
| `P` | Load the panorama screen |
| `I` | Load the image pairs |
| `G` | Convert images to grayscale |
| `E` | Apply edge detection |
| `T` | Apply thresholding |
| `N` | Calculate centroids |
| `D` | Detect movement direction |
| `X` | Move to the next image pair |

## Extension

As an extension to Task 1, I added additional animation controls to make the carousel more interactive.

- **Pause and Resume:** Allows the animation to be paused and continued using the SPACE key.
- **Animation Speed:** Allows the user to increase or decrease the animation speed using the + and - keys.
- **Motion Trail:** Stores previous actor positions and displays fading copies behind the moving actor. The trail is cleared when the next actor starts.

## Problems and Solutions

One of the main challenges in Task 1 was finding suitable threshold values for all eight actor images. Since the backgrounds were different, I experimented with RGB and HSB threshold values to remove the backgrounds while keeping the actors visible.

In Task 2, detecting diagonal movement was another challenge. I solved this by comparing both the horizontal and vertical changes between the two centroids. This allowed the application to identify diagonal directions as well as simple horizontal and vertical movement.

I also created four additional image pairs using GIMP to test more movement cases.

## Testing and Project Progress

I tested both tasks using different images and threshold values.

For Task 1, I tested the image processing, carousel animation, fading, zooming, motion trail, and animation controls.

For Task 2, I tested grayscale conversion, edge detection, thresholding, centroid calculation, and all eight movement directions using the eight image pairs.

I completed the main requirements for both tasks and implemented additional interactive features for the carousel.

## Technologies Used

- JavaScript
- p5.js
- Image Processing
- RGB and HSB Colour Models
- GIMP

## Project Structure

- `sketch.js` – Contains the main application code, image processing functions, animation, and movement detection.
- `task 1 images/` – Contains the eight actor images and background image.
- `task
