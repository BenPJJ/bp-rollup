const fs = require('fs');
const { resolve } = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const config = require('../package.json');

const exists = fs.existsSync;
const mkdir = fs.mkdirSync;
const name = config.name;
const version = config.version;
let modulePath = process.env.npm_config_bp_file;
if (typeof modulePath === 'undefined') {
  console.log('请先配置模块所在目录');
  console.log('Example: npm config set bz-mod "D:\\source"');
  throw new Error('没有配置模块路径');
} else if (!exists(modulePath)) {
  throw new Error('模块目录不存在，请检查配置的模块目录是否正确');
} else {
  modulePath = resolve(modulePath, name);
  if (!exists(modulePath)) {
    mkdir(modulePath);
  }
  
  modulePath = resolve(modulePath, version);
  if (!exists(modulePath)) {
    mkdir(modulePath);
  }
}

// 判断根目录有没有dist文件夹
if (!exists('dist')) {
  mkdir('dist');
}

const builds = {
  'dev': {
    input: 'src/index.js',
    output: resolve(modulePath, name + '-debug.js'),
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  'prod': {
    input: 'src/index.js',
    output: resolve(modulePath, name + '.js'),
    format: 'umd',
    moduleName: name,
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  'prod-es': {
    input: 'src/index.js',
    output: resolve(modulePath, name + '.es.js'),
    format: 'es',
    moduleName: name,
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  'prod-amd': {
    input: 'src/index.js',
    output: resolve(modulePath, name + '.amd.js'),
    format: 'amd',
    moduleName: name,
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
};

function getConfig(opts) {
  const config = {
    input: opts.input,
    output: {
      file: opts.output,
      format: opts.format,
      name: opts.moduleName
    },
    plugins: [
      babel({
        exclude: 'node_modules/**', // 排除node_modules 下的文件
      })
    ].concat(opts.plugins || [])
  };
  return config;
};

exports.getAllBuilds = () => Object.keys(builds).map(name => getConfig(builds[name]))