<template>
	<section>
		<Stopwatch />
		<MusicPlayer />
	</section>
</template>

<script>
import Stopwatch from "@/components/Stopwatch.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
export default {
	components: {
		Stopwatch,
		MusicPlayer,
	},
};
</script>
