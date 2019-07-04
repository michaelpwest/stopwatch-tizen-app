<template>
	<section>
		<div class="stopwatch">
			<div
				v-if="!isRunning && time == 0"
				class="start"
				@click="start"
			>
				START
			</div>
			<div
				v-if="!isRunning && time > 0"
				class="resume"
				@click="start"
			>
				RESUME
			</div>
			<div
				v-if="isRunning"
				class="stop"
				@click="stop"
			>
				STOP
			</div>
			<div class="time">
				{{ time | time }}
			</div>
			<div
				v-if="!isRunning && time > 0"
				class="reset"
				@click="reset"
			>
				RESET
			</div>
			<div
				v-if="isRunning"
				class="clock"
			>
				{{ clock }}
			</div>
		</div>
	</section>
</template>

<script>
const moment = require("moment");

export default {
	filters: {
		time: (currentTime) => {
			try {
				const duration = moment.duration(currentTime);
				const minutes = duration.minutes().toFixed(0).padStart(2, "0");
				const seconds = duration.seconds().toFixed(0).padStart(2, "0");
				return `${minutes}:${seconds}`;
			} catch (error) {
				alert(error.message);
			}
		},
	},
	data() {
		return {
			isRunning: false,
			time: 0,
			stepLastTime: 0,
			stepCurrentTime: 0,
			clock: null,
		};
	},
	methods: {
		start() {
			try {
				if (!this.isRunning) {
					// Start timer.
					this.isRunning = true;

					// Update clock.
					this.updateClock();

					// Step.
					this.stepLastTime = moment().valueOf();
					requestAnimationFrame(this.step);
				}
			} catch (error) {
				alert(error.message);
			}
		},
		stop() {
			try {
				// Stop timer.
				this.isRunning = false;
			} catch (error) {
				alert(error.message);
			}
		},
		reset() {
			try {
				// Reset timer.
				this.isRunning = false;
				this.time = 0;
			} catch (error) {
				alert(error.message);
			}
		},
		step() {
			try {
				if (!this.isRunning) {
					return;
				}

				this.stepCurrentTime = moment().valueOf();
				if (this.stepCurrentTime - this.stepLastTime >= 1000) {
					this.stepLastTime = this.stepCurrentTime;

					// Add second.
					this.time += 1000;

					// Update clock.
					this.updateClock();
				}

				// Step.
				requestAnimationFrame(this.step);
			} catch (error) {
				alert(error.message);
			}
		},
		updateClock() {
			try {
				// Update clock.
				this.clock = moment().format("h:mm A");
			} catch (error) {
				alert(error.message);
			}
		},
	},
};
</script>

<style scoped>
.stopwatch {
	height: 360px;
	left: 0;
	position: absolute;
	text-align: center;
	top: 0;
	width: 360px;
}
.start, .resume, .stop, .time, .clock, .reset {
	position: absolute;
	top: 30%;
	width: 360px;
}
.start, .resume, .stop, .clock, .reset {
	line-height: 100px;
	z-index: 999;
}
.start, .resume, .stop {
	margin-top: -100px;
}
.time {
	line-height: 60px;
	margin-top: -30px;
}
.clock, .reset {
	margin-top: 0;
}
.start, .resume {
	color: #00CA7E;
}
.stop {
	color: #F3081B;
}
.clock, .reset {
	color: #12B4FF;
}
</style>
