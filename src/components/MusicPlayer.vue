<template>
	<section>
		<div class="music-player">
			<div class="actions">
				<div
					class="previous-track"
					@click="changeTrack(-1)"
				>
					<i class="fas fa-step-backward" />
				</div>
				<div
					v-if="!isPlaying"
					class="play"
					@click="playButton"
				>
					<i class="fas fa-play" />
				</div>
				<div
					v-if="isPlaying"
					class="pause"
					@click="playButton"
				>
					<i class="fas fa-pause" />
				</div>
				<div
					class="next-track"
					@click="changeTrack(1)"
				>
					<i class="fas fa-step-forward" />
				</div>
			</div>
			<div
				v-if="playlist[currentMusicTrack]"
				class="music-track-title ui-marquee"
			>
				{{ playlist[currentMusicTrack].title }}
			</div>
			<audio
				v-if="playlist[currentMusicTrack]"
				id="audio"
				ref="audio"
			>
				<source :src="playlist[currentMusicTrack].path">
			</audio>
			<div class="music-track-current-time">
				{{ currentTime }}
			</div>
			<div class="music-track-duration">
				{{ duration }}
			</div>
			<progress
				id="circleprogress"
				class="ui-circle-progress"
				max="100"
				value="0"
			/>
		</div>
	</section>
</template>

<script>
const moment = require("moment");

export default {
	data() {
		return {
			isPlaying: false,
			playlist: [],
			currentMusicTrack: null,
			currentTime: null,
			duration: null,
			stepLastTime: 0,
			stepCurrentTime: 0,
			progressBar: null,
			elementMarquee: null,
		};
	},
	mounted() {
		try {
			if (typeof tizen != "undefined") {
				// Get all music tracks from the device.
				const filter = new tizen.AttributeFilter("type", "EXACTLY", "AUDIO"); // eslint-disable-line
				const sortMode = new tizen.SortMode("title", "ASC"); // eslint-disable-line
				tizen.content.find( // eslint-disable-line
					this.setupPlaylist,
					null,
					null,
					filter,
					sortMode
				);

				// Handle media keys.
				tizen.mediakey.setMediaKeyEventListener({ // eslint-disable-line
					onpressed: (key) => {
						switch (key) {
						case "MEDIA_PLAY":
						case "MEDIA_PAUSE":
							try {
								this.playButton();
							} catch (error) {
								alert(error.message);
							}
							break;
						case "MEDIA_NEXT":
						case "MEDIA_PREVIOUS":
							try {
								this.changeTrack(key == "MEDIA_NEXT" ? 1 : -1);
							} catch (error) {
								alert(error.message);
							}
							break;
						default:
							break;
						}
					},
				});
			} else {
				// Get all music tracks from the public folder (allows testing in the browser).
				this.setupPlaylist([
					{
						title: "Sample 1",
						contentURI: "/audio/sample1.ogg",
					},
					{
						title: "Sample 2",
						contentURI: "/audio/sample2.ogg",
					},
				]);
			}

			// Handle rotary event.
			document.addEventListener("rotarydetent", this.changeTrack);

			// Handle back button event.
			document.addEventListener("tizenhwkey", this.playButton);
		} catch (error) {
			alert(error.message);
		}

		// Setup music track progress bar.
		setTimeout(() => {
			try {
				const progressBar = document.querySelector(".ui-circle-progress");
				this.progressBar = new tau.widget.CircleProgressBar(progressBar, { // eslint-disable-line
					size: "full",
				});
			} catch (error) {
				alert(error.message);
			}
		}, 1000);

		this.$watch("currentMusicTrack", function() {
			try {
				// Load audio when music track is changed.
				this.$refs.audio.load();

				// Setup marquee element.
				this.setupMarquee();
			} catch (error) {
				alert(error.message);
			}
		});
	},
	methods: {
		setupPlaylist(items) {
			try {
				// Setup playlist.
				this.playlist = [];
				items.forEach(item => {
					this.playlist.push({
						title: item.title,
						path: item.contentURI,
					});
				});

				setTimeout(() => {
					this.changeTrack(1);
				}, 1000);
			} catch (error) {
				alert(error.message);
			}
		},
		playButton() {
			try {
				if (this.playlist.length) {
					// Step.
					this.stepLastTime = moment().valueOf();
					requestAnimationFrame(this.step);

					if (!this.isPlaying) {
						// Play music track.
						this.isPlaying = true;
						this.$refs.audio.play();
					} else {
						// Pause music track.
						this.isPlaying = false;
						this.$refs.audio.pause();
					}
				}
			} catch (error) {
				alert(error.message);
			}
		},
		changeTrack(direction) {
			try {
				// Determine direction based on button push or rotary event direction.
				if (direction.detail && direction.detail.direction) {
					direction = direction.detail.direction == "CW" ? 1 : -1;
				}

				// Reset current music track progress time.
				this.currentTime = null;
				this.duration = null;
				if (this.progressBar) {
					this.progressBar.value(0);
				}

				if (this.playlist.length) {
					if (direction == -1 && this.$refs.audio.currentTime > 2) {
						// Start current music track again if more than 2 seconds have played.
						this.$refs.audio.currentTime = 0;
					} else {
						// Randomly change music track.
						this.currentMusicTrack = (Math.floor(Math.random() * (this.playlist.length)) + 1) - 1;
						if (this.isPlaying) {
							setTimeout(() => {
								// Play new music track.
								this.isPlaying = false;
								this.playButton();
							}, 0);
						}
					}
				}
			} catch (error) {
				alert(error.message);
			}
		},
		setupMarquee() {
			try {
				if (this.elementMarquee) {
					// Destroy previous marquee element.
					this.elementMarquee.destroy();
				}

				// Add marquee to element.
				const marquee = document.querySelector(".ui-marquee");
				if (marquee) {
					this.elementMarquee = new tau.widget.Marquee(marquee, { // eslint-disable-line
						delay: 1000,
						iteration: "infinite",
						marqueeStyle: "endToEnd",
					});
					this.elementMarquee.start();
				}
			} catch (error) {
				alert(error.message);
			}
		},
		step() {
			try {
				this.stepCurrentTime = moment().valueOf();
				if (this.stepCurrentTime - this.stepLastTime >= 1000) {
					this.stepLastTime = this.stepCurrentTime;

					if (this.isPlaying) {
						// Update current music track progress bar.
						const currentTime = Math.ceil(this.$refs.audio.currentTime);
						const duration = Math.ceil(this.$refs.audio.duration);
						const progress = Math.ceil(currentTime / duration * 100);
						this.progressBar.value(progress);

						// Update current music track progress time.
						if (currentTime >= 0 && duration >= 0) {
							this.currentTime = moment.utc(currentTime * 1000).format("mm:ss");
							this.duration = moment.utc(duration * 1000).format("mm:ss");
						}

						// Check if current music track has finished and start next music track if it has finished.
						if (this.$refs.audio.ended) {
							this.changeTrack(1);
						}
					}
				}

				// Step.
				requestAnimationFrame(this.step);
			} catch (error) {
				alert(error.message);
			}
		},
	},
};
</script>

<style scoped>
.music-player {
	height: 360px;
	left: 0;
	position: absolute;
	text-align: center;
	top: 0;
	width: 360px;
}
.actions {
	position: absolute;
	top: 60%;
	width: 360px;
}
.previous-track, .play, .pause, .next-track {
	display: inline;
	padding: 5px 25px;
}
.music-track-title {
	position: absolute;
	top: 75%;
	white-space: nowrap;
	width: 240px;
	margin-left: 60px;
}
.music-track-current-time, .music-track-duration {
	color: #12B4FF;
	font-size: 0.6em;
	line-height: 20px;
	margin-top: -10px;
	position: absolute;
	top: 50%;
}
.music-track-current-time {
	left: 0;
	transform: rotate(-90deg);
}
.music-track-duration {
	right: 0;
	transform: rotate(90deg);
}
</style>
