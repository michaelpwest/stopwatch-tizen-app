import Vue from "vue";
import Router from "vue-router";
import Stopwatch from "./views/Stopwatch.vue";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			name: "stopwatch",
			component: Stopwatch,
		},
	],
});
