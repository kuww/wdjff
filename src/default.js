/*---------------------------------------------------------------------------------------------
 *  Copyright (c) wodax Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// ref:
// - https://umijs.org/plugin/develop.html
// - https://umijs.org/zh/plugin/develop.html

/**
 * APIHelper
 *
 * @summary 用来验证及查验有哪些API
 */
class APIHelper {
  /**
   * 获取更多API的接口说明，请参照：https://umijs.org/zh/plugin/develop.htm
   */
  constructor(api, opts, debug = true) {
    this.api = api;
    this.opts = opts;
    this.debug = debug;
  }

  log(label, api, description, ...args) {
    !!this.debug &&
      console.log(
        `---> ${label} - ${api} - ${description} - ${Date()
          .toString()
          .padEnd(20)}`,
        ...args
      );
  }

  bindAllAPI() {
    const t$ = this;
    //#region 环境变量
    /**
     * process.env.NODE_ENV，区分 development 和 production
     */
    //#endregion

    //#region 系统级变量
    //#endregion

    //#region 系统级 API
    [
      {
        key: `registerPlugin`,
        description: `加载插件，用于插件集等需要在一个插件中加载其它插件的场景`,
      },
      { key: `registerMethod`, description: `注册插件方法，用于给插件添加新的方法给其它插件使用` },
      { key: `applyPlugins`, description: `在插件用，应用通过 registerMethod 注册的某个方法` },
      {
        key: `restart`,
        description: `重新执行 umi dev，比如在 bigfish 中修改了 appType，需要重新挂载插件的时候可以调用该方法`,
      },
      {
        key: `rebuildTmpFiles`,
        description: `重新生成 bootstrap file（entryFile）等临时文件，这个是最常用的方法，国际化，dva 等插件的配置变化都会用到`,
      },
      { key: `refreshBrowser`, description: `刷新浏览器` },
      { key: `rebuildHTML`, description: `触发 HTML 重新构建` },
    ].forEach(function(item) {
      t$.log(`系统级 API 介绍:`, `${item.key}`, `${item.description}`);
    });
    //#endregion

    //#region 工具类 API
    [
      { key: `log.success`, description: `日志函数 api.log.success` },
      { key: `log.error`, description: `日志函数 api.log.error` },
      { key: `log.debug`, description: `日志函数 api.log.debug` },
      { key: `log.pending`, description: `日志函数 api.log.pending` },
      { key: `log.watch`, description: `日志函数 api.log.watch` },
      {
        key: `log.winPath`,
        description: `将文件路径转换为兼容 window 的路径，用于在代码中添加 require('/xxx/xxx.js') 之类的代码`,
      },
      { key: `debug`, description: `调试信息 api.debug('msg');` },
      { key: `findJS`, description: `findJS 查找js文件，xxx -> xxx.js xxx.ts xxx.jsx xxx.tsx` },
      {
        key: `findCSS`,
        description: `findCSS 查找js文件，xxx -> xxx.css xxx.less xxx.scss xxx.sass`,
      },
      { key: `compatDirname`, description: `先找用户项目目录，再找插件依赖` },
    ].forEach(function(item) {
      t$.log(`工具类 API 介绍:`, `${item.key}`, `${item.description}`);
    });
    //#endregion

    //#region 系统级 API
    //#endregion

    //#region 事件类 API
    [
      { key: `beforeDevServer`, description: `dev server 启动之前` },
      { key: `afterDevServer`, description: `dev server 启动之后` },
      { key: `onStart`, description: `umi dev 或者 umi build 开始时触发` },
      { key: `onDevCompileDone`, description: `umi dev 编译完成后触发` },
      { key: `onOptionChange`, description: `插件的配置改变的时候触发` },
      { key: `onBuildSuccess`, description: `在 umi build 成功时候。主要做一些构建产物的处理` },
      { key: `onBuildSuccessAsync`, description: `onBuildSuccess 的异步版` },
      { key: `onBuildFail`, description: `在 umi build 失败的时候` },
      { key: `onHTMLRebuild`, description: `当 HTML 重新构建时被触发` },
      { key: `onGenerateFiles`, description: `路由文件，入口文件生成时被触发` },
      {
        key: `onPatchRoute`,
        description: `获取单个路由的配置时触发，可以在这里修改路由配置 route`,
      },
    ].forEach(function(item) {
      const func = t$.api[item.key];
      func(() => {
        console.log(`\n`);
        t$.log(`调用事件类 API:`, `${item.key}`, `${item.description}`);
      });
    });

    //#endregion

    //#region 应用类 API
    [
      { key: `modifyDefaultConfig`, description: `修改 umi 的默认配置` },
      { key: `addPageWatcher`, description: `添加 watch 的文件` },
      { key: `addHTMLMeta`, description: `在 HTML 中添加 meta 标签` },
      { key: `addHTMLLink`, description: `在 HTML 中添加 Link 标签` },
      { key: `addHTMLStyle`, description: `在 HTML 中添加 Style 标签` },
      { key: `addHTMLScript`, description: `在 HTML 尾部添加脚本` },
      { key: `addHTMLHeadScript`, description: `在 HTML 头部添加脚本` },
      { key: `modifyHTMLChunks`, description: `修改 chunks，默认值是 ['umi']` },
      { key: `modifyHTMLWithAST`, description: `修改 HTML，基于 cheerio ` },
      { key: `modifyHTMLContext`, description: `修改 html ejs 渲染时的环境参数` },
      { key: `modifyRoutes`, description: `修改路由配置` },
      { key: `addEntryImportAhead`, description: `在入口文件在最上面 import 模块` },
      {
        key: `addEntryPolyfillImports`,
        description: `同 addEntryImportAhead，但作为 polyfill，所以添加在最前面`,
      },
      { key: `addEntryImport`, description: `在入口文件中 import 模块` },
      { key: `addEntryCodeAhead`, description: `在 render 之前添加代码` },
      { key: `addEntryCode`, description: `在 render 之后添加代码` },
      { key: `addRouterImport`, description: `在路由文件中添加模块引入` },
      { key: `addRouterImportAhead`, description: `在路由文件头部添加模块引入` },
      { key: `addRendererWrapperWithComponent`, description: `在外面包一层组件` },
      { key: `addRendererWrapperWithModule`, description: `在挂载 前执行一个 Module，支持异步` },
      { key: `modifyEntryRender`, description: `修改入口文件中的Render` },
      { key: `modifyEntryHistory`, description: `修改入口文件中的History` },
      { key: `modifyRouteComponent`, description: `修改路由组件` },
      { key: `modifyRouterRootComponent`, description: `修改路由根组件` },
      { key: `modifyWebpackConfig`, description: `修改 webpack 配置` },
      { key: `modifyAFWebpackOpts`, description: `修改 af-webpack 配置` },
      { key: `addMiddleware`, description: `往开发服务器后面添加中间件` },
      { key: `addMiddlewareAhead`, description: `往开发服务器前面添加中间件` },
      { key: `addMiddlewareBeforeMock`, description: `在 mock 前添加中间件` },
      { key: `addMiddlewareAfterMock`, description: `在 mock 后添加中间件` },
      { key: `addVersionInfo`, description: `添加版本信息，在 umi -v 或 umi version 时显示` },
      { key: `addRuntimePlugin`, description: `添加运行时插件，参数为文件的绝对路径` },
      { key: `addRuntimePluginKey`, description: `添加运行时可配置项` },
    ].forEach(function(item) {
      t$.log(`应用类 API 介绍:`, `${item.key}`, `${item.description}`);
    });
    //#endregion

    /**
     * 用于获取umi暴露了哪些api
     */
    t$.log(`umi.api`, `this.api`, `获取umi暴露了哪些api`, this.api);
  }
}

/**
 * 默认插件内核部分，暴露给开发者，简化开发
 * @param api
 * @param defaultOpts
 * @return {{opts, api: *}}
 */
const defaultPluginCore = (api, defaultOpts = {}) => {
  const apiHelper = new APIHelper(api, defaultOpts, false);
  apiHelper.bindAllAPI();
  return { api: api, opts: defaultOpts };
};

module.exports = { defaultPluginCore };
