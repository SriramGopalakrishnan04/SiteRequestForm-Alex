'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// build.webpack.setConfig({
//     configPath: './webpack.config.js'
// });

// build.configureWebpack.
// build.configureWebpack.mergeConfig({
//     additionalConfiguration: (generatedConfiguration) => {
//         generatedConfiguration.entry.push('./app.scss');

//         generatedConfiguration.output
//         generatedConfiguration.module.loaders.push([
//             {
//                 loader: 'sass-loader',
//                 options: {
//                     includePaths: ['./node_modules']
//                 }
//             }
//         ]);

//         return generatedConfiguration;
//     }
// });

// build.configureWebpack..additionalConfiguration.push({
//     entry: './app.scss',
//     output: {
//         // This is necessary for webpack to compile
//         // But we never use style-bundle.js
//         filename: 'style-bundle.js',
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.scss$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: 'bundle.css',
//                         },
//                     },
//                     { loader: 'extract-loader' },
//                     { loader: 'css-loader' },
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             includePaths: ['./node_modules']
//                         }
//                     },
//                 ]
//             }
//         ]
//     },
// });

// build.configureWebpack.mergeConfig({
//     additionalConfiguration: (generatedConfiguration) => {
//         generatedConfiguration.module.loaders.push([
//             {
//                 loader: 'sass-loader',
//                 options: {
//                     includePaths: ['./node_modules']
//                 }
//             }
//         ]);

//         return generatedConfiguration;
//     }
// });

build.initialize(gulp);
