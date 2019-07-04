<template>
	<section>
		<div class="music-player">
			<div class="actions">
				<div class="previous-track">
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
				<div class="next-track">
					<i class="fas fa-step-forward" />
				</div>
			</div>
			<div
				v-if="playlist[currentMusicTrack]"
				class="music-track-title"
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
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			isPlaying: false,
			playlist: [],
			currentMusicTrack: null,
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
		} catch (error) {
			alert(error.message);
		}

		this.$watch("currentMusicTrack", function() {
			try {
				// Load audio when music track is changed.
				this.$refs.audio.load();
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
				this.currentMusicTrack = 0;
			} catch (error) {
				alert(error.message);
			}
		},
		playButton() {
			try {
				if (this.playlist.length) {
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
	width: 360px;
}
</style>
