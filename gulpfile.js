const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat-css");
const postcss = require("gulp-postcss");

const cssPath = "public/stylesheets/**/*.css";
gulp.task("css", function() {
    return gulp
        .src(cssPath)
        .pipe(sourcemaps.init())
        .pipe(concat("style.css"))
        .pipe(postcss([require("precss"), require("autoprefixer")]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("public/build/"));
});

gulp.task("watch", function() {
    return gulp.watch(cssPath, ["css"]);
});

gulp.task("default", ["css", "watch"]);
