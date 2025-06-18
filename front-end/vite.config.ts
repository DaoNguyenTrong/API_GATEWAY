import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    base: process.env.VITE_BASE_URL,
    server: {
      port: 8000,
    },
    resolve: {
      alias: {
        "@/": `${pathSrc}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
      },
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: "src/typings/auto-imports.d.ts",
        imports: ["vue", "vue-router", "pinia"],
      }),
      Components({
        dts: "src/typings/components.d.ts",
        types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
        resolvers: [ElementPlusResolver()],
      }),
      tailwindcss(),

      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]",
        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        customDomId: "__svg__icons__dom__",
      }),
    ],
  };
});
