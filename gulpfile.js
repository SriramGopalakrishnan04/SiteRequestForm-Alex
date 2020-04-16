'use strict';

const gulp = require('gulp');

const replace = require('gulp-replace');

const solutionInfo = require('./config/package-solution.json');

const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.initialize(gulp);


// This is a custom task to increment the build version number of a SPFx solution
gulp.task('build-bump', function () {

    if (solutionInfo.solution && solutionInfo.solution.version) {
        let versionNum = solutionInfo.solution.version;

        console.log("Prev Version Num: ", versionNum);
        let splitVersion = versionNum.split('.');

        let newMinorNum = parseInt(splitVersion[3]) + 1;
        let newVersionNum = `${splitVersion[0]}.${splitVersion[1]}.${splitVersion[2]}.${newMinorNum}`;

        console.log("New Version Num: ", newVersionNum);

        return gulp.src('config/package-solution.json', {base: './'})
            .pipe(replace(`"version": "${versionNum}",`, `"version": "${newVersionNum}",`))
            .pipe(gulp.dest('./'));
    } else {
        throw new Error("Unable to find version number in config/package-solution.json");
    }
});

// This is a custom task to increment the maintenance version number of a SPFx solution
gulp.task('maintenance-bump', function () {

    if (solutionInfo.solution && solutionInfo.solution.version) {
        let versionNum = solutionInfo.solution.version;

        console.log("Prev Version Num: ", versionNum);
        let splitVersion = versionNum.split('.');

        let newMaintenanceNum = parseInt(splitVersion[2]) + 1;
        let newVersionNum = `${splitVersion[0]}.${splitVersion[1]}.${newMaintenanceNum}.0`;

        console.log("New Version Num: ", newVersionNum);

        return gulp.src('config/package-solution.json', {base: './'})
            .pipe(replace(`"version": "${versionNum}",`, `"version": "${newVersionNum}",`))
            .pipe(gulp.dest('./'));
    } else {
        throw new Error("Unable to find version number in config/package-solution.json");
    }
});