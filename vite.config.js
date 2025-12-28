import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import compression from 'vite-plugin-compression';
import vueDevTools from 'vite-plugin-vue-devtools';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue({
			// 开启响应式语法糖支持
			reactivityTransform: true,
		}),
		UnoCSS(),
		vueJsx(),
		compression(),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'src/icons/svg')], // SVG 存放路径
			symbolId: 'icon-[name]',
		}),
		vueDevTools(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			imports: ['vue', 'vue-router'],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		compression({
			algorithm: 'gzip',
			ext: '.gz',
			threshold: 10240, //  默认为10KB
			deleteOriginFile: false,
			filter: /\.(js|css|json|html|ico|svg)(\?.*)?$/i,
			compressionOptions: { level: 9 }, // 指定gzip压缩级别，默认为9（最高级别）
			verbose: true,
			disable: false,
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		exclude: ['monaco-editor'],
	},
	clearScreen: false,
	base: '/',
	server: {
		host: '0.0.0.0',
		publicPath: '',
		port: 2670,
		hmr: true,
		strictPort: true,
	},
	assetsInclude: [
		'**/*.woff',
		'**/*.woff2',
		'**/*.ttf',
		'**/*.TTF',
		'**/*.otf',
	],
	build: {
		minify: 'terser',
		outDir: 'dist',
		chunkSizeWarningLimit: 10240,
		assetsInlineLimit: 0,
		terserOptions: {
			compress: {
				pure_funcs: ['console.log'],
				drop_console: false, // 保留 console，方便调试错误
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				assetFileNames: assetInfo => {
					if (
						['.woff', '.woff2', '.ttf', '.TTF', '.otf', '.eot'].some(ext =>
							assetInfo.name?.endsWith(ext),
						)
					) {
						return 'assets/fonts/[name].[hash][extname]';
					}
					return 'assets/[name].[hash][extname]';
				},

				chunkFileNames: 'js/[name].[hash].js',
				entryFileNames: 'js/[name].[hash].js',

				manualChunks(id) {
					// 只分离 node_modules
					if (id.includes('node_modules')) {
						// 提取包名
						const match = id.match(/node_modules\/(.+?)\//);
						if (match) {
							const packageName = match[1];
							// 处理 @scope/package 格式
							if (packageName.startsWith('@')) {
								const scopeMatch = id.match(/node_modules\/(@.+?)\//);
								return scopeMatch ? scopeMatch[1].replace('/', '_') : 'vendor';
							}
							return packageName;
						}
					}
				},
			},
		},
	},
});
