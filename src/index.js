/*---------------------------------------------------------------------------------------------
 *  Copyright (c) wodax Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// ref:
// - https://umijs.org/plugin/develop.html
// - https://umijs.org/zh/plugin/develop.html
const { defaultPluginCore } = require('./default');

var fs = require('fs');
var path = require('path')
// var program = require('commander');
const join = path.join
const fse = require('fs-extra')
const util = require('util');
const flagSign = path.sep;
const execa = require('execa');

const chalk = require('chalk');





const getPath = (path) => join(__dirname, path);
const mkdirSync = util.promisify(fs.mkdir);
const accessSync = util.promisify(fs.access);
const rootWorkDir = path.normalize(path.join(__dirname, '../../'));

/** 获取当前时间
 * @example 2019-7-11 17:11:54
 * @returns {string}
 */
function getNowDate() {
  return (new Date()).toLocaleString();
}

const traceStartCommand = (command) => {
  try {
    console.log(`${chalk.gray('>>>[命令开始]')} ${command}  --- ${getNowDate()}`);
  } catch (e) {
  }
};
const traceEndCommand = (command) => {
  try {
    console.log(`${chalk.gray('<<<[命令结束]')} ${command}  --- ${getNowDate()}`);
  } catch (e) {
  }
};
const traceRunError = (e) => {
  let errInfo = ``;
  try {
    errInfo = util.inspect(e, {depth: 5, color: true, compact:false});
  } catch (e) {
    console.error(e);
  }
  console.error(`${chalk.red('检测到错误:')} ${errInfo}  --- ${getNowDate()}`);
};
const traceOutContent = (prefix, content) => {
  try {
    console.log(`${chalk.gray(prefix)} ${content}`);
  } catch (e) {
  }
};
const traceProcessInfo = (prefix, process) => {
  try {
    const { command, exitCode, exitCodeName, stdout, stderr, failed, timedOut, isCanceled, killed } = process;
    const info = [
      `command: ${command}`,
      `exitCode: ${exitCode}`,
      `exitCodeName: ${exitCodeName}`,
      `failed: ${failed}`,
      `timedOut: ${timedOut}`,
      `isCanceled: ${isCanceled}`,
      `killed: ${killed}`,
    ];
    console.log(`${chalk.gray(prefix)}`);
    console.log(`${chalk.yellow(info.join('\n'))}`);

    // stdout
    if (stdout) {
      console.log(`${chalk.green(stdout)}`);
    }
    // stderr
    if (stderr) {
      console.log(`${chalk.red(stderr)}`);
    }
  } catch (e) {
  }
};




/** 同步运行命令
 * @param {string} command 字符串命令
 * @param {object} options 运行选项参数，参照`execa`的说明
 * @param {boolean} strict 是否严格处理，碰到错误，直接错误
 */
function syncRunCommand(command, options, strict) {
  let subProcess = null;
  try {
    traceStartCommand(command);
    subProcess = execa.commandSync(command, {
      ...options,
      timeout: 1000 * 60 * 60, /// 单位毫秒
    });
    traceProcessInfo(`>>>`, subProcess);
    traceEndCommand(command);
  } catch (e) {
    traceRunError(e);
    if (strict) {
      process.exit(1);
    }
  }
}




var adds = async function (src, routerUrl,branch="master") {
  const dst = getPath('../../src/pages');
  const routerConfig = getPath('../../src/spec_routes/block.js')
  if (src.indexOf('http') === 0) {
    const dirForCloneResource = `${rootWorkDir}clone`;
    console.log(`dirForCloneResource = ${dirForCloneResource}`);
    fse.remove(dirForCloneResource).then(() => { // 删除本地的clone文件夹
      mkdirSync(dirForCloneResource, { recursive: true }).then(() => { // 创建本地的clone文件夹
        syncRunCommand(`git clone -b ${branch}  ${src} `, {
          cwd: `${dirForCloneResource}`
        }, false) // 执行cmd命令 去执行git clone 地址

        let arr = src.split('/');
        let title = arr[arr.length - 1]; //  拿到block 文件夹 默认为路由的第一级
        let paths = fs.readdirSync(rootWorkDir + 'clone' + flagSign + title); //同步读取当前目录
        fse.remove(dst + flagSign + 'block').then(() => { // 删除本地的block文件夹
          fse.mkdir(dst + flagSign + 'block').then(() => { // 创建本地的block文件夹
            let str = "import React from 'react'\n"
            str = str + "import Loadable from 'react-loadable'\n"
            str = str + "import { lazyLoad as LazyLoadComponent } from 'web-react-base-component';\n"
            str = str + "export default[\n"
            paths.forEach(function (item) {
              if(item!=='.git'){
              // fs.access(rootWorkDir+'clone'+flagSign+title+flagSign + item+ flagSign+ 'src', (err) => {
              //   //需要判断block块里面是否有src目录 如果不存在这个目录 默认是不进行这个文件夹的导入的也就是和这个block的导入的
              //   if (!err) {
              //     fs.mkdirSync(dst + '/block/' + item)
              //     fse.copySync(rootWorkDir+'clone'+flagSign+title+flagSign + item+ flagSign+ 'src', dst + '/block/' + item) //copy
              //                       str += `    {
              //   path: '/${routerUrl ? routerUrl : 'block'}/${item}',
              //   component: Loadable({
              //     loader: () => import('@/pages/block/${item}'),
              //     loading: LazyLoadComponent,
              //   }),
              // },\n`
              //   }
              // });
              try {
                var stat = fs.statSync(rootWorkDir+'clone'+flagSign+title+flagSign + item+ flagSign+ 'src');
                if (stat.isDirectory()) {
                                    fs.mkdirSync(dst + '/block/' + item)
                  fse.copySync(rootWorkDir+'clone'+flagSign+title+flagSign + item+ flagSign+ 'src', dst + '/block/' + item) //copy
                                    str += `    {
                path: '/${routerUrl ? routerUrl : 'block'}/${item}',
                component: Loadable({
                  loader: () => import('@/pages/block/${item}'),
                  loading: LazyLoadComponent,
                }),
              },\n`
                }
              } catch (e) {}
            }
            });
            str += "\n];"
            console.log(str)
            fs.writeFile(routerConfig, str, function (err) {
              fse.remove(rootWorkDir + 'clone').then((e)=>{
                console.log(e)
              })
            })
          }).catch(e => {
          })
        }).catch(e => {
        })
      }).catch(e=>{
      })
    }).catch(e=>{
    })
  } else {
    let paths = fs.readdirSync(src); //同步读取当前目录
    fse.remove(dst + flagSign + 'block').then(() => { // 删除本地的block文件夹
      fse.mkdir(dst + flagSign + 'block').then(() => { // 创建本地的block文件夹
        let str = "import React from 'react'\n"
        str = str + "import Loadable from 'react-loadable'\n"
        str = str + "import { lazyLoad as LazyLoadComponent } from 'web-react-base-component';\n"
        str = str + "export default[\n"
        paths.forEach(function (item) {
          fs.access(src + '/' + item + '/src', (err) => {
            //需要判断block块里面是否有src目录 如果不存在这个目录 默认是不进行这个文件夹的导入的也就是和这个block的导入的
            if (!err) {
              mkdirSync(dst + '/block/' + item).then(() => {
                fse.copy(src + '/' + item + '/src', dst + '/block/' + item, function (err) {}) //copy
              })
            }
          });
          try {
            var stat = fs.statSync(src + '/' + item + '/src');
            if (stat.isDirectory()) {
              str += `    {
          path: '/${routerUrl ? routerUrl : 'block'}/${item}',
          component: Loadable({
            loader: () => import('@/pages/block/${item}'),
            loading: LazyLoadComponent,
          }),
        },\n`
              }
            } catch (e) {}
        })
        str += "\n]"
        fs.writeFileSync(routerConfig, str, function (err) {
        })
      }).catch(e => {
      })
    }).catch(e => {
    })
  }
}



export default (in_api, in_opts = {}) => {
  let { api, opts } = defaultPluginCore(in_api, in_opts);
  if(opts.cloneUrl){
    adds(opts.cloneUrl,opts.routerUrl,opts.branch)
  }
};
