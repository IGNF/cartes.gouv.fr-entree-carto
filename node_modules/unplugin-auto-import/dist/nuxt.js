import { unplugin_default } from "./src-DOo-nqzQ.js";
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";

//#region src/nuxt.ts
var nuxt_default = defineNuxtModule({ setup(options) {
	options.exclude = options.exclude || [
		/[\\/]node_modules[\\/]/,
		/[\\/]\.git[\\/]/,
		/[\\/]\.nuxt[\\/]/
	];
	addWebpackPlugin(unplugin_default.webpack(options));
	addVitePlugin(unplugin_default.vite(options));
} });

//#endregion
export { nuxt_default as default };