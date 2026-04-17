import { join } from 'node:path';
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  hash: true,
  publicPath: '/',
  routes,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  fastRefresh: true,

  // 插件配置
  model: {},
  initialState: {},
  title: '企业设备管理系统',
  layout: {
    locale: false,
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  locale: false,
  antd: {
    appConfig: {},
    configProvider: {
      theme: {
        cssVar: true,
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
        },
      },
    },
  },
  request: {},
  access: {},
  headScripts: [{ src: join('/', 'scripts/loading.js'), async: true }],
  presets: ['umi-presets-pro'],
  mock: {
    include: ['mock/**/*', 'src/pages/**/_mock.ts'],
  },
  mako: {},
  esbuildMinifyIIFE: true,
});
