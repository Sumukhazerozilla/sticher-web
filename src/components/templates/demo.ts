import JSZip from "jszip";
import { IResponse } from "../types";

export const demoHtml = async (response: IResponse, zip: JSZip) => {
  // Create a modified response with updated image paths pointing to annotated images
  const modifiedResponse = {
    ...response,
    images: response.images.map((_, index) => {
      // Use the annotated images from the annotated_images folder
      return `./annotated_images/image_${index + 1}.png`;
    }),
  };

  const template = `
  <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Screen Recording Viewer</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            html,
            body {
                max-height: 100vh;
                max-width: 100vw;
                overflow: hidden;
            }
            header {
                background-color: lightgray;
                text-align: center;
                font-size: 1rem;
                padding: 10px;
            }
            img {
                width: 100%;
                height: auto;
                object-fit: cover;
            }
            aside img {
                cursor: pointer;
                border-radius: 5px;
                transition: transform 0.2s ease-in-out;
            }
            aside h2 {
                font-size: 1.2rem;
                padding: 10px;
            }
            figure img {
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
            .container {
                display: grid;
                grid-template-columns: 250px 1fr;
                gap: 10px;
                height: calc(85vh - 60px);
            }
            .aside_container {
                display: flex;
                flex-direction: column;
                gap: 5px;
                height: 85vh;
                overflow-y: auto;
                padding-bottom: 2rem;
            }
            .aside_container_section {
                display: grid;
                grid-template-columns: 120px 1fr;
                align-items: center;
                gap: 10px;
                background-color: rgb(245, 245, 245);
                cursor: pointer;
                border-radius: 5px;
                margin-bottom: 8px;
                padding: 5px;
                border-left: 3px solid transparent;
                transition: all 0.2s ease;
            }
            .aside_container_section img {
                border-radius: 3px;
                aspect-ratio: 3/2;
            }
            .aside_container_section p {
                font-size: 0.8rem;
            }
            .aside_container_section.active {
                background-color: rgb(138, 227, 241);
                color: #333;
                border-left: 3px solid #0066cc;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            /* Timeline/Tracker Styles */
            .timeline-container {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.8);
                padding: 10px 20px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                z-index: 100;
            }
            .timeline {
                width: 100%;
                height: 5px;
                background-color: #555;
                border-radius: 2px;
                position: relative;
                cursor: pointer;
                margin-bottom: 5px;
            }
            .timeline-progress {
                position: absolute;
                height: 100%;
                background-color: #ff9800;
                border-radius: 2px;
                width: 0%;
            }
            .timeline-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .timeline-left-controls,
            .timeline-right-controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .control-button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: transparent;
            }
            .control-button:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            .time-display {
                color: white;
                font-size: 0.8rem;
                margin: 0 15px;
            }
            .volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .volume-slider {
                width: 80px;
                cursor: pointer;
                accent-color: #ff9800;
            }
        </style>
    </head>
    <body>
        <main>
            <header>
                <h1>Screen Recording Viewer</h1>
            </header>

            <div class="container">
                <aside>
                    <h2>Table of content</h2>
                    <div class="aside_container"></div>
                </aside>
                <figure></figure>
            </div>

            <!-- Timeline/Tracker Container -->
            <div class="timeline-container">
                <div class="timeline">
                    <div class="timeline-progress"></div>
                </div>
                <div class="timeline-controls">
                    <div class="timeline-left-controls">
                        <button class="control-button prev-button">⏮</button>
                        <button class="control-button play-pause-button">▶</button>
                        <button class="control-button next-button">⏭</button>
                        <span class="time-display">00:00 / 05:00</span>
                    </div>
                    <div class="timeline-right-controls">
                        <div class="volume-control">
                            <button class="control-button volume-button">🔊</button>
                            <input
                                type="range"
                                class="volume-slider"
                                min="0"
                                max="100"
                                value="100"
                            />
                        </div>
                        <button class="control-button fullscreen-button">⛶</button>
                    </div>
                </div>
            </div>
        </main>

        <script>
            // Use relative paths instead of server URL
            const BASE_URL = "";

            // API Response data with paths pointing to annotated images
            const apiResponse = ${JSON.stringify(modifiedResponse)};

            // Use annotated images from API response
            const left_images = apiResponse.images;

            // Get recording metadata for accurate timeline
            const recordingData = apiResponse.metadata.lastRecording;
            const clickPoints = apiResponse.metadata.points;

            class DemoHtml {
                constructor(baseUrl, images, asideSelector, figureSelector, apiData) {
                    this.BASE_URL = baseUrl;
                    this.apiData = apiData;
                    this.recordingData = apiData.metadata.lastRecording;
                    this.clickPoints = apiData.metadata.points;

                    this.startTime = this.recordingData.startTime;
                    this.endTime = this.recordingData.endTime;
                    this.duration = this.endTime - this.startTime;

                    // Use relative paths for images directly without concatenating with BASE_URL
                    this.images = images;
                    this.activeImageIndex = 0;
                    this.$_aside = document.querySelector(asideSelector);
                    this.$_figure = document.querySelector(figureSelector);
                    this.$_figure_img = null;

                    // Timeline elements
                    this.$_playPauseButton = document.querySelector(".play-pause-button");
                    this.$_prevButton = document.querySelector(".prev-button");
                    this.$_nextButton = document.querySelector(".next-button");
                    this.$_volumeButton = document.querySelector(".volume-button");
                    this.$_volumeSlider = document.querySelector(".volume-slider");
                    this.$_timeline = document.querySelector(".timeline");
                    this.$_timelineProgress = document.querySelector(".timeline-progress");

                    // Slideshow state
                    this.isPlaying = false;
                    this.slideInterval = null;
                    this.slideShowSpeed = Math.min(
                        2000,
                        Math.floor(this.duration / this.images.length)
                    ); // Initialize with actual recording duration
                    this.volume = 100;
                    this.muted = false;

                    // Animation state
                    this.animationFrame = null;
                    this.playbackStartTime = 0;
                    this.currentPlaybackTime = 0;
                    this.totalDuration = (this.recordingData.endTime - this.recordingData.startTime) / 1000;

                    // Create a timeline based on clickpoints for smooth transitions
                    this.timelinePoints = this.clickPoints.map((point) => ({
                        time: point.relativeTime / 1000, // convert to seconds
                        imageIndex: this.clickPoints.indexOf(point),
                    }));

                    // Sort timeline points by time
                    this.timelinePoints.sort((a, b) => a.time - b.time);

                    this.init();
                }

                init() {
                    this.renderAside();
                    this.renderFigure();
                    this.addEventListeners();
                    this.initializeTimelineControls();
                }

                renderAside() {
                    this.$_aside.innerHTML = this.images
                        .map((image, index) => {
                            // Get corresponding clickpoint data
                            const clickPoint = this.clickPoints[index];
                            const timestamp = clickPoint
                                ? new Date(clickPoint.time).toLocaleTimeString()
                                : "";
                            const coords = clickPoint
                                ? \`(\${Math.round(clickPoint.x)}, \${Math.round(clickPoint.y)})\`
                                : "";

                            return \`
                            <div class="aside_container_section \${
                                index === this.activeImageIndex ? "active" : ""
                            }" data-index="\${index}">
                                <figure>
                                    <img src="\${image}" alt="Image \${index}" />
                                </figure>
                                <div>
                                    <p>Click \${index + 1}: \${coords}</p>
                                    <p><small>\${timestamp}</small></p>
                                </div>
                            </div>\`;
                        })
                        .join("");
                }

                renderFigure() {
                    this.$_figure.innerHTML = \`<img src="\${
                        this.images[this.activeImageIndex]
                    }" alt="Image \${this.activeImageIndex}" />\`;
                    this.$_figure_img = this.$_figure.querySelector("img");
                }

                addEventListeners() {
                    this.$_aside.addEventListener("click", (e) => {
                        const target = e.target.closest(".aside_container_section");
                        if (!target) return;

                        this.removeActiveClass();
                        target.classList.add("active");

                        const index = parseInt(target.dataset.index);

                        // When clicking a slide, update the timeline to that time
                        const clickPoint = this.clickPoints[index];
                        if (clickPoint) {
                            const time = clickPoint.relativeTime / 1000;

                            // If playing, update playback time
                            if (this.isPlaying) {
                                this.currentPlaybackTime = time;
                                this.playbackStartTime = Date.now();
                            }

                            // Update progress bar to match the time of this slide
                            this.updateProgressBarByTime(time);
                        }

                        this.updateFigure(index);
                    });
                }

                removeActiveClass() {
                    const active = this.$_aside.querySelector(".active");
                    if (active) {
                        active.classList.remove("active");
                    }
                }

                updateFigure(index) {
                    this.activeImageIndex = parseInt(index);
                    this.$_figure_img.src = this.images[index];
                    this.$_figure_img.alt = \`Image \${index}\`;

                    // Update timeline progress when figure changes
                    this.updateProgressBar();
                }

                initializeTimelineControls() {
                    // Play/pause button
                    this.$_playPauseButton.addEventListener("click", () =>
                        this.togglePlayPause()
                    );

                    // Previous slide button
                    this.$_prevButton.addEventListener("click", () => this.prevSlide());

                    // Next slide button
                    this.$_nextButton.addEventListener("click", () => this.nextSlide());

                    // Volume button
                    this.$_volumeButton.addEventListener("click", () =>
                        this.toggleMute()
                    );

                    // Volume slider
                    this.$_volumeSlider.addEventListener("input", (e) => {
                        this.volume = e.target.value;
                        this.updateVolumeUI();
                    });

                    // Timeline click - use time-based positioning
                    this.$_timeline.addEventListener("click", (e) => {
                        const timelineWidth = this.$_timeline.clientWidth;
                        const clickPosition = e.offsetX;
                        const percentage = clickPosition / timelineWidth;
                        const targetTime = percentage * this.totalDuration;

                        // If playing, update playback time
                        if (this.isPlaying) {
                            this.currentPlaybackTime = targetTime;
                            this.playbackStartTime = Date.now();
                        }

                        this.goToSlideByTime(targetTime);
                    });

                    // Fullscreen button
                    document
                        .querySelector(".fullscreen-button")
                        .addEventListener("click", () => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                }
                            }
                        });

                    // Initialize time display
                    this.updateProgressBar();
                }

                togglePlayPause() {
                    if (this.isPlaying) {
                        this.stopSlideshow();
                    } else {
                        this.startSlideshow();
                    }
                }

                startSlideshow() {
                    this.isPlaying = true;
                    this.$_playPauseButton.textContent = "⏸";

                    // Store the current time as reference
                    this.playbackStartTime = Date.now();
                    this.currentPlaybackTime = this.getCurrentTimeFromIndex(
                        this.activeImageIndex
                    );

                    // Use requestAnimationFrame for smooth playback
                    this.animatePlayback();
                }

                stopSlideshow() {
                    this.isPlaying = false;
                    this.$_playPauseButton.textContent = "▶";

                    // Cancel animation frame if it exists
                    if (this.animationFrame) {
                        cancelAnimationFrame(this.animationFrame);
                        this.animationFrame = null;
                    }
                }

                animatePlayback() {
                    // Calculate elapsed time since playback started
                    const elapsedTime = (Date.now() - this.playbackStartTime) / 1000;
                    const currentTime = this.currentPlaybackTime + elapsedTime;

                    // Check if we've reached the end of the recording
                    if (currentTime >= this.totalDuration) {
                        // Loop back to beginning
                        this.playbackStartTime = Date.now();
                        this.currentPlaybackTime = 0;
                        this.goToSlideByTime(0);
                    } else {
                        // Update display based on current time
                        this.goToSlideByTime(currentTime);
                    }

                    // Continue animation
                    this.animationFrame = requestAnimationFrame(() =>
                        this.animatePlayback()
                    );
                }

                // Get current playback time based on image index
                getCurrentTimeFromIndex(index) {
                    const clickPoint = this.clickPoints[index];
                    if (clickPoint) {
                        return clickPoint.relativeTime / 1000;
                    }
                    return 0;
                }

                // Find the appropriate slide for a given time
                getSlideIndexForTime(time) {
                    // Find the last point that's before or at the given time
                    for (let i = this.timelinePoints.length - 1; i >= 0; i--) {
                        if (this.timelinePoints[i].time <= time) {
                            return this.timelinePoints[i].imageIndex;
                        }
                    }
                    return 0;
                }

                // Go to slide based on time
                goToSlideByTime(time) {
                    const newIndex = this.getSlideIndexForTime(time);

                    // Only update if we're changing slide
                    if (newIndex !== this.activeImageIndex) {
                        this.goToSlide(newIndex, false); // false = don't update time
                    }

                    // Always update the progress bar for smooth movement
                    this.updateProgressBarByTime(time);
                }

                // Update progress bar based on time instead of slide index
                updateProgressBarByTime(time) {
                    // Ensure time is within valid range
                    time = Math.max(0, Math.min(time, this.totalDuration));

                    const progressPercentage = (time / this.totalDuration) * 100;
                    this.$_timelineProgress.style.width = \`\${progressPercentage}%\`;

                    // Update time display
                    const currentTime = this.formatTime(time);
                    const totalTime = this.formatTime(this.totalDuration);
                    document.querySelector(
                        ".time-display"
                    ).textContent = \`\${currentTime} / \${totalTime}\`;
                }

                // Override these methods to fix the duplicate declaration issue
                goToSlide(index, updateTime = true) {
                    // Ensure index is valid
                    index = Math.max(0, Math.min(index, this.images.length - 1));

                    // Update UI in aside
                    this.removeActiveClass();
                    const slides = this.$_aside.querySelectorAll(
                        ".aside_container_section"
                    );
                    if (slides[index]) {
                        slides[index].classList.add("active");

                        // Scroll the slide into view
                        slides[index].scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                        });
                    }

                    // Update the figure
                    this.activeImageIndex = index;
                    if (this.$_figure_img) {
                        this.$_figure_img.src = this.images[index];
                        this.$_figure_img.alt = \`Image \${index}\`;
                    }

                    // When manually changing slides, update current playback time
                    if (this.isPlaying && updateTime) {
                        this.currentPlaybackTime = this.getCurrentTimeFromIndex(index);
                        this.playbackStartTime = Date.now();
                    }

                    // Update timeline to reflect the current slide
                    const clickPoint = this.clickPoints[index];
                    if (clickPoint) {
                        this.updateProgressBarByTime(clickPoint.relativeTime / 1000);
                    }
                }

                nextSlide() {
                    let nextIndex = this.activeImageIndex + 1;
                    if (nextIndex >= this.images.length) {
                        nextIndex = 0; // Loop back to the first slide
                    }

                    this.goToSlide(nextIndex, true);
                }

                prevSlide() {
                    let prevIndex = this.activeImageIndex - 1;
                    if (prevIndex < 0) {
                        prevIndex = this.images.length - 1; // Loop to the last slide
                    }

                    this.goToSlide(prevIndex, true);
                }

                toggleMute() {
                    this.muted = !this.muted;
                    this.updateVolumeUI();
                }

                updateVolumeUI() {
                    if (this.muted) {
                        this.$_volumeButton.textContent = "🔇";
                        this.$_volumeSlider.value = 0;
                    } else {
                        this.$_volumeButton.textContent = "🔊";
                        this.$_volumeSlider.value = this.volume;
                    }
                }

                updateProgressBar() {
                    if (this.clickPoints && this.clickPoints.length > 0) {
                        const clickPoint = this.clickPoints[this.activeImageIndex];
                        if (clickPoint) {
                            this.updateProgressBarByTime(clickPoint.relativeTime / 1000);
                        }
                    } else {
                        // Fall back to the original calculation
                        const progressPercentage =
                            (this.activeImageIndex / (this.images.length - 1)) * 100;
                        this.$_timelineProgress.style.width = \`\${progressPercentage}%\`;
                        // ...existing time display code...
                    }
                }

                // Fix the time starting at 01 instead of 00
                formatTime(seconds) {
                    // Ensure we're starting from 0 seconds
                    seconds = Math.max(0, seconds);
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return \`\${mins.toString().padStart(2, "0")}:\${secs
                        .toString()
                        .padStart(2, "0")}\`;
                }
            }

            // Initialize with the modified data
            document.addEventListener("DOMContentLoaded", function() {
                new DemoHtml(
                    BASE_URL,
                    left_images,
                    "aside .aside_container",
                    "figure",
                    apiResponse
                );
            });
        </script>
    </body>
</html>`;

  zip.file("demo.html", template);
};
