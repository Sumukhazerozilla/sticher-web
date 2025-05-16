import JSZip from "jszip";
import { IResponse } from "../types";

export const testHtml = async (response: IResponse, zip: JSZip) => {
  // Create a modified response with updated image paths pointing to resource images (without tooltips)
  const modifiedResponse = {
    ...response,
    images: response.images.map((imagePath) => {
      // Use the original images from the resources folder
      const filename = imagePath.split("/").pop() || "image.png";
      return `./resources/${filename}`;
    }),
    // Point to the local audio file in the zip
    audio: response.audio ? "./audio.mp3" : null,
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
            /* Figure container needs position relative */
            figure {
                position: relative;
                overflow: hidden;
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
            /* Playback speed control */
            .speed-control {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-right: 10px;
            }
            .speed-label {
                color: white;
                font-size: 0.8rem;
            }
            .speed-selector {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 2px 5px;
                font-size: 0.8rem;
            }
            /* Feedback tooltip styles */
            .feedback-tooltip {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                pointer-events: none;
                z-index: 100;
                transition: opacity 0.3s ease;
                opacity: 0;
            }
            
            .feedback-tooltip.correct {
                background-color: rgba(22, 163, 74, 0.8);
            }
            
            .feedback-tooltip.wrong {
                background-color: rgba(220, 38, 38, 0.8);
            }
            
            .feedback-tooltip.visible {
                opacity: 1;
            }
            
            figure.clickable {
                cursor: crosshair;
            }
        </style>
    </head>
    <body>
        <main>
            <header>
                <h1>Screen Recording Viewer (Interactive)</h1>
            </header>

            <div class="container">
                <aside>
                    <h2>Table of content</h2>
                    <div class="aside_container"></div>
                </aside>
                <figure class="clickable">
                    <!-- No cursor element here -->
                    <div class="feedback-tooltip"></div>
                </figure>
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
                        <div class="speed-control">
                            <span class="speed-label">Speed:</span>
                            <select class="speed-selector">
                                <option value="0.5">0.5x</option>
                                <option value="1" selected>1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                            </select>
                        </div>
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
            <!-- Hidden audio element for the recording -->
            <audio id="recording-audio" preload="auto" style="display:none;">
                <source src="./audio.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </main>

        <script>
            // Use relative paths instead of server URL
            const BASE_URL = "";

            // API Response data with paths pointing to resource images (without tooltips)
            const apiResponse = ${JSON.stringify(modifiedResponse)};

            // Use resource images from API response
            const left_images = apiResponse.images;

            // Get recording metadata for accurate timeline
            const recordingData = apiResponse.metadata.lastRecording;
            
            // Debug audio path from response
            console.log("Audio path from response:", "${
              response.audio || "No audio available"
            }");
            
            // Combine click points and keyboard events but give priority to clicks for interactions
            const allEvents = [
                ...apiResponse.metadata.points.map(point => ({
                    ...point,
                    type: 'click',
                    relativeTime: point.time - recordingData.startTime
                })),
                ...apiResponse.metadata.keyboardEvents.map(event => ({
                    ...event,
                    relativeTime: event.time - recordingData.startTime
                }))
            ];
            
            // Sort events by time
            allEvents.sort((a, b) => a.relativeTime - b.relativeTime);
            
            // Use only click points for interactive testing
            const clickPoints = apiResponse.metadata.points;

            class TestHtml {
                constructor(baseUrl, images, asideSelector, figureSelector, apiData) {
                    this.BASE_URL = baseUrl;
                    this.apiData = apiData;
                    this.recordingData = apiData.metadata.lastRecording;
                    
                    // Audio setup with better error handling
                    this.audioPath = "${response.audio || ""}";
                    this.$_audio = document.getElementById('recording-audio');
                    this.hasAudio = !!this.$_audio;
                    console.log("Audio available:", this.hasAudio, "Path:", this.audioPath);
                    
                    if (this.hasAudio && this.$_audio) {
                        try {
                            this.$_audio = new Audio(this.audioPath);
                            this.$_audio.preload = "auto";
                            
                            // Add event listeners for debugging
                            this.$_audio.addEventListener('canplay', () => {
                                console.log("Audio can play now");
                            });
                            
                            this.$_audio.addEventListener('error', (e) => {
                                console.error("Audio error:", e);
                                console.error("Audio error code:", this.$_audio.error ? this.$_audio.error.code : "unknown");
                                this.hasAudio = false; // Disable audio functionality if error
                            });
                            
                            console.log("Audio element created");
                        } catch (err) {
                            console.error("Error creating audio element:", err);
                            this.hasAudio = false;
                        }
                    }
                    
                    // Use combined and sorted events list
                    this.allEvents = allEvents;
                    
                    // Use only click points for interaction
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
                    this.$_speedSelector = document.querySelector(".speed-selector");
                    this.$_timeline = document.querySelector(".timeline");
                    this.$_timelineProgress = document.querySelector(".timeline-progress");

                    // Slideshow state
                    this.isPlaying = false;
                    this.slideInterval = null;
                    this.slideShowSpeed = Math.min(
                        2000,
                        Math.floor(this.duration / this.images.length)
                    );
                    this.volume = 100;
                    this.muted = false;
                    this.playbackSpeed = 1;

                    // Animation state
                    this.animationFrame = null;
                    this.playbackStartTime = 0;
                    this.currentPlaybackTime = 0;
                    
                    // Calculate total duration from the actual recording duration
                    this.totalDuration = (this.recordingData.endTime - this.recordingData.startTime) / 1000;
                    
                    // Create a timeline based on all events for smooth transitions
                    this.timelinePoints = this.allEvents
                        .filter(event => event.screenshot || event.type === 'click') // Only include events with screenshots or clicks
                        .map((event, index) => ({
                            time: event.relativeTime / 1000, // Convert to seconds
                            imageIndex: index,
                            eventType: event.type || (event.key ? 'keyboard' : 'click'),
                            originalEvent: event
                        }));

                    // Sort timeline points by time
                    this.timelinePoints.sort((a, b) => a.time - b.time);

                    // Feedback tooltip element
                    this.$_feedbackTooltip = null;
                    
                    // Define tolerance for clicks (in pixels)
                    this.clickTolerance = 30;

                    this.init();
                }

                init() {
                    this.renderAside();
                    this.renderFigure();
                    this.addEventListeners();
                    this.initializeTimelineControls();
                    this.addClickInteractions();
                }

                renderAside() {
                    // Filter to include only items with screenshots or click points
                    const renderItems = this.allEvents.filter(event => event.screenshot || event.type === 'click');
                    
                    this.$_aside.innerHTML = renderItems
                        .map((event, index) => {
                            const timestamp = event.time
                                ? new Date(event.time).toLocaleTimeString()
                                : "";
                            
                            let title = '';
                            let coords = '';
                            
                            if (event.type === 'click' || event.button) {
                                title = \`Click \${index + 1}\`;
                                coords = \`(\${Math.round(event.x)}, \${Math.round(event.y)})\`;
                            } else if (event.key) {
                                title = \`Key: \${event.key}\`;
                                coords = '';
                            }

                            return \`
                            <div class="aside_container_section \${
                                index === this.activeImageIndex ? "active" : ""
                            }" data-index="\${index}">
                                <figure>
                                    <img src="\${this.images[index] || this.images[0]}" alt="Image \${index}" />
                                </figure>
                                <div>
                                    <p>\${title}: \${coords}</p>
                                    <p><small>\${timestamp}</small></p>
                                </div>
                            </div>\`;
                        })
                        .join("");
                }

                renderFigure() {
                    // Create the figure content with image and feedback tooltip
                    this.$_figure.innerHTML = \`
                        <img src="\${this.images[this.activeImageIndex]}" alt="Image \${this.activeImageIndex}" />
                        <div class="feedback-tooltip"></div>
                    \`;
                    this.$_figure_img = this.$_figure.querySelector("img");
                    this.$_feedbackTooltip = this.$_figure.querySelector('.feedback-tooltip');
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
                                
                                // Update audio position if available
                                if (this.hasAudio && this.$_audio) {
                                    this.$_audio.currentTime = time;
                                }
                            } else {
                                // Even if not playing, update the audio position
                                if (this.hasAudio && this.$_audio) {
                                    this.$_audio.currentTime = time;
                                    this.currentPlaybackTime = time;
                                }
                            }

                            // Update progress bar to match the time of this slide
                            this.updateProgressBarByTime(time);
                        }

                        this.updateFigure(index);
                    });
                    
                    // Add speed selector change event listener
                    this.$_speedSelector.addEventListener("change", (e) => {
                        this.playbackSpeed = parseFloat(e.target.value);
                        
                        // If currently playing, adjust the playback timing
                        if (this.isPlaying) {
                            // Save current time
                            const currentTime = this.currentPlaybackTime + 
                                ((Date.now() - this.playbackStartTime) / 1000) * this.playbackSpeed;
                                
                            // Reset playback start time with new speed
                            this.currentPlaybackTime = currentTime;
                            this.playbackStartTime = Date.now();
                            
                            // Update audio playback rate if available
                            if (this.hasAudio && this.$_audio) {
                                this.$_audio.playbackRate = this.playbackSpeed;
                            }
                        } else {
                            // Even if not playing, update the playback rate
                            if (this.hasAudio && this.$_audio) {
                                this.$_audio.playbackRate = this.playbackSpeed;
                            }
                        }
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

                    // Hide feedback tooltip when changing slides
                    if (this.$_feedbackTooltip) {
                        this.$_feedbackTooltip.classList.remove('visible');
                    }

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
                        
                        // Update audio volume if available
                        if (this.hasAudio && this.$_audio) {
                            try {
                                this.$_audio.volume = this.muted ? 0 : this.volume / 100;
                                console.log("Volume set to:", this.$_audio.volume);
                            } catch (err) {
                                console.error("Error setting audio volume:", err);
                            }
                        }
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
                            
                            // Update audio position if available
                            if (this.hasAudio && this.$_audio) {
                                this.$_audio.currentTime = targetTime;
                            }
                        } else {
                            // Even if not playing, update the audio position
                            if (this.hasAudio && this.$_audio) {
                                this.$_audio.currentTime = targetTime;
                                this.currentPlaybackTime = targetTime;
                            }
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
                    
                    // If we're at the end, restart from beginning
                    if (this.currentPlaybackTime >= this.totalDuration) {
                        this.currentPlaybackTime = 0;
                        this.goToSlideByTime(0);
                    }
                    
                    // Play audio if available
                    if (this.hasAudio && this.$_audio) {
                        console.log("Attempting to play audio from position:", this.currentPlaybackTime);
                        
                        try {
                            // Set the current time for the audio
                            this.$_audio.currentTime = this.currentPlaybackTime;
                            
                            // Set playback rate
                            this.$_audio.playbackRate = this.playbackSpeed;
                            
                            // Set volume based on UI state
                            this.$_audio.volume = this.muted ? 0 : this.volume / 100;
                            
                            // Play audio with user interaction context (should work since this is called from a click handler)
                            const playPromise = this.$_audio.play();
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log("Audio started playing successfully");
                                }).catch(err => {
                                    console.error("Audio playback failed:", err);
                                    // Try to handle autoplay restrictions
                                    if (err.name === 'NotAllowedError') {
                                        console.warn("Audio autoplay blocked by browser. User interaction required.");
                                    }
                                });
                            }
                        } catch (err) {
                            console.error("Error playing audio:", err);
                        }
                    }

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
                    
                    // Pause audio if available
                    if (this.hasAudio && this.$_audio) {
                        try {
                            console.log("Pausing audio at:", this.$_audio.currentTime);
                            this.$_audio.pause();
                            // Save current playback time
                            this.currentPlaybackTime = this.$_audio.currentTime;
                        } catch (err) {
                            console.error("Error pausing audio:", err);
                        }
                    }
                }

                animatePlayback() {
                    // Calculate elapsed time since playback started, adjusted for playback speed
                    const elapsedTime = (Date.now() - this.playbackStartTime) / 1000 * this.playbackSpeed;
                    const currentTime = this.currentPlaybackTime + elapsedTime;

                    // Check if we've reached the end of the recording
                    if (currentTime >= this.totalDuration) {
                        // Loop back to beginning
                        this.playbackStartTime = Date.now();
                        this.currentPlaybackTime = 0;
                        this.goToSlideByTime(0);
                        
                        // Reset audio if available
                        if (this.hasAudio && this.$_audio) {
                            this.$_audio.currentTime = 0;
                        }
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
                    const event = this.timelinePoints[index]?.originalEvent;
                    if (event) {
                        return event.relativeTime / 1000;
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

                    // Update time display, apply offset correction
                    const currentTime = this.formatTime(time);
                    const totalTime = this.formatTime(this.totalDuration);
                    document.querySelector(
                        ".time-display"
                    ).textContent = \`\${currentTime} / \${totalTime}\`;
                }

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
                    
                    // Update audio mute state
                    if (this.hasAudio && this.$_audio) {
                        try {
                            this.$_audio.volume = this.muted ? 0 : this.volume / 100;
                            console.log("Audio " + (this.muted ? "muted" : "unmuted"));
                        } catch (err) {
                            console.error("Error toggling audio mute:", err);
                        }
                    }
                }

                updateVolumeUI() {
                    if (this.muted) {
                        this.$_volumeButton.textContent = "🔇";
                        this.$_volumeSlider.value = 0;
                    } else {
                        this.$_volumeButton.textContent = "🔊";
                        this.$_volumeSlider.value = this.volume;
                    }
                    
                    // Update audio volume if available
                    if (this.hasAudio && this.$_audio) {
                        this.$_audio.volume = this.muted ? 0 : this.volume / 100;
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
                    }
                }

                // Format time for display
                formatTime(seconds) {
                    // Ensure we're starting from 0 seconds
                    seconds = Math.max(0, seconds);
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return \`\${mins.toString().padStart(2, "0")}:\${secs
                        .toString()
                        .padStart(2, "0")}\`;
                }

                addClickInteractions() {
                    // Add click event listener to the figure element
                    this.$_figure.addEventListener('click', (e) => this.handleImageClick(e));
                    
                    // Initialize feedback tooltip
                    this.$_feedbackTooltip = this.$_figure.querySelector('.feedback-tooltip');
                }
                
                handleImageClick(e) {
                    // Get click coordinates relative to the image
                    const imgElement = this.$_figure.querySelector('img');
                    if (!imgElement) return;
                    
                    const rect = imgElement.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate percentage coordinates relative to image size
                    const xPercent = x / rect.width;
                    const yPercent = y / rect.height;
                    
                    // Convert to screen coordinates
                    const screenX = xPercent * this.recordingData.screenSize.width;
                    const screenY = yPercent * this.recordingData.screenSize.height;
                    
                    // Get the expected click point for the current image
                    // Since we're using a combined timeline, we need to find the actual click point
                    let expectedPoint = null;
                    
                    // Try to find corresponding click point in the original clickPoints array
                    const timelinePoint = this.timelinePoints[this.activeImageIndex];
                    if (timelinePoint && timelinePoint.eventType === 'click') {
                        expectedPoint = timelinePoint.originalEvent;
                    } else {
                        // If it's not a click event, use the nearest click point
                        const activeImage = this.images[this.activeImageIndex];
                        const imageNum = activeImage.match(/\\d+/);
                        if (imageNum && this.clickPoints[parseInt(imageNum[0]) - 1]) {
                            expectedPoint = this.clickPoints[parseInt(imageNum[0]) - 1];
                        }
                    }
                    
                    // Check if click is within tolerance
                    const isCorrect = expectedPoint ? 
                        this.isClickCorrect(screenX, screenY, expectedPoint) : 
                        false;
                    
                    // Show feedback tooltip
                    this.showFeedback(isCorrect, x, y);
                    
                    // Move to next slide after a delay, regardless of right/wrong
                    setTimeout(() => {
                        this.nextSlide();
                    }, 1000);
                }
                
                isClickCorrect(clickX, clickY, expectedPoint) {
                    if (!expectedPoint) return false;
                    
                    // Calculate distance between clicked point and expected point
                    const distance = Math.sqrt(
                        Math.pow(clickX - expectedPoint.x, 2) + 
                        Math.pow(clickY - expectedPoint.y, 2)
                    );
                    
                    // Return true if within tolerance
                    return distance <= this.clickTolerance;
                }
                
                showFeedback(isCorrect, x, y) {
                    if (!this.$_feedbackTooltip) return;
                    
                    // Set tooltip text and class
                    this.$_feedbackTooltip.textContent = isCorrect ? 'Correct!' : 'Wrong!';
                    this.$_feedbackTooltip.className = 'feedback-tooltip ' + (isCorrect ? 'correct' : 'wrong');
                    
                    // Position tooltip near click position
                    this.$_feedbackTooltip.style.left = \`\${x}px\`;
                    this.$_feedbackTooltip.style.top = \`\${y - 40}px\`; // Position above cursor
                    
                    // Show tooltip
                    this.$_feedbackTooltip.classList.add('visible');
                    
                    // Hide tooltip after delay
                    setTimeout(() => {
                        this.$_feedbackTooltip.classList.remove('visible');
                    }, 900); // Slightly shorter than next slide delay
                }
            }

            // Initialize with the modified data
            document.addEventListener("DOMContentLoaded", function() {
                new TestHtml(
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

  zip.file("test.html", template);
};
