<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	created() {
		if (typeof tizen != "undefined") {
			tizen.power.request("SCREEN", "SCREEN_NORMAL"); // eslint-disable-line
		}
	},
};
</script>

<style>
#app {
	font-size: 1.2em;
	text-align: center;
}
</style>
