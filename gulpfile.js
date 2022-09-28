import path from 'path';
import { fileURLToPath } from 'url';
import { deleteAsync } from "del";
import fs from 'fs';
import gulp from "gulp";
import bs from "browser-sync";
import file_include from "gulp-file-include";
import gulpSass from "gulp-sass";
import sass from "sass";
import autoprefixer from "gulp-autoprefixer";
import group_media from "gulp-group-css-media-queries";
import clean_css from "gulp-clean-css";
import rename from "gulp-rename";
import concat from "gulp-concat";
import gulpUglifyEs  from "gulp-uglify-es";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import webphtml from "gulp-webp-html";
import webpcss from "gulp-webp-css";
import svg_sprite from "gulp-svg-sprite";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import fonter from "gulp-fonter";

const { src, dest } = gulp;
const browser_sync = bs.create();
const scss = gulpSass(sass);
const uglify = gulpUglifyEs.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clean = () => {
    return deleteAsync(['dist'])
}

let sourceFolder = "#src";
let projectFolder = path.basename(__dirname);

let pathes = {
    build:{
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        images: projectFolder + "/images/",
        fonts: projectFolder + "/fonts/",
        webFonts: projectFolder + "/webfonts/"
    },
    src:{
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: [sourceFolder + "/scss/style.scss", "!" + sourceFolder + "/scss/{light,dark}.scss"],
        cssThemes: sourceFolder + "/scss/{light,dark}.scss",
        cssLib: sourceFolder + "/scss/lib/**/*.css",
        js: sourceFolder + "/js/*.js",
        jsLib: sourceFolder + "/js/lib/**/*.js",
        images: sourceFolder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
        webFonts: sourceFolder + "/webfonts/*.ttf"
    },
    watch:{
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.{scss,css}",
        js: sourceFolder + "/js/**/*.js",
        images: sourceFolder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + projectFolder + "/"
}


function browserSync(params){
    browser_sync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        browser: ["chrome.exe"],
        port: 3000,
        notify: false
    })
}

function html(){
    return src(pathes.src.html)
        .pipe(file_include())
        .pipe(webphtml())
        .pipe(dest(pathes.build.html))
        .pipe(browser_sync.stream())
}

function css(){
    return src(pathes.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp'
        }))
        .pipe(dest(pathes.build.css))
        .pipe(clean_css())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(dest(pathes.build.css))
        .pipe(browser_sync.stream())
}

function cssLib(){
    return src(pathes.src.cssLib)
        .pipe(concat("all.css"))
        .pipe(rename({
            extname: ".min.css",
        }))
        .pipe(dest(pathes.build.css))
        .pipe(browser_sync.stream())
}

function cssThemes(){
    return src(pathes.src.cssThemes)
    .pipe(scss({
        outputStyle: "expanded"
    }))
    .pipe(group_media())
    .pipe(autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
    }))
    .pipe(webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
    }))
    .pipe(dest(pathes.build.css))
    .pipe(clean_css())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(dest(pathes.build.css))
    .pipe(browser_sync.stream())
}


function js(){
    return src(pathes.src.js)
        .pipe(file_include())
        .pipe(dest(pathes.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(pathes.build.js))
        .pipe(browser_sync.stream())
}

function jsLib(){
    return src(pathes.src.jsLib)
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(pathes.build.js))
        .pipe(browser_sync.stream())
}


function images(){
    return src(pathes.src.images)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(pathes.build.images))
        .pipe(src(pathes.src.images))
        .pipe(imagemin({
            progressive: true,
            svgPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(pathes.build.images))
        .pipe(browser_sync.stream())
}

function fonts(){
    src(pathes.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(pathes.build.fonts));
    return src(pathes.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(pathes.build.fonts));
}

function webFonts(){
    src(pathes.src.webFonts)
        .pipe(ttf2woff())
        .pipe(dest(pathes.build.webFonts));
    return src(pathes.src.webFonts)
        .pipe(ttf2woff2())
        .pipe(dest(pathes.build.webFonts));
}

gulp.task('otf2ttf', function(dir) {
    return src([sourceFolder + `/${dir}/*.otf`])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(sourceFolder + `/${dir}/`))
});

gulp.task('svg_sprite', function() {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svg_sprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",
                }
            }
        }))
        .pipe(dest(pathes.build.images))
});


gulp.task("swiperCss", function(){
    return gulp.src(["node_modules/swiper/swiper-bundle.min.css"])
    .pipe(gulp.dest(sourceFolder + '/scss/lib'));
    });

gulp.task("swiperJs", function(){
    return gulp.src(["node_modules/swiper/swiper-bundle.min.js"])
    .pipe(gulp.dest(sourceFolder + '/js/lib'));
    });

gulp.task("swiper", gulp.parallel("swiperCss", "swiperJs"));

gulp.task("simpleBarCss", function(){
    return gulp.src(["node_modules/simplebar/dist/simplebar.min.css"])
    .pipe(gulp.dest(sourceFolder + '/scss/lib'));
    });

gulp.task("simpleBarJs", function(){
    return gulp.src(["node_modules/simplebar/dist/simplebar.min.js"])
    .pipe(gulp.dest(sourceFolder + '/js/lib'));
    });

gulp.task("simplebar", gulp.parallel("simpleBarCss", "simpleBarJs"));

gulp.task("fontawesomeFonts", function(){
    return gulp.src(["node_modules/@fortawesome/fontawesome-free/webfonts/*"])
    .pipe(gulp.dest(sourceFolder + '/webfonts'));
    });
gulp.task("fontawesomeCss", function(){
    return gulp.src(["node_modules/@fortawesome/fontawesome-free/css/all.min.css"])
    .pipe(gulp.dest(sourceFolder + '/scss/lib'));
    });
    
gulp.task("fontawesomeJs", function(){
    return gulp.src(["node_modules/@fortawesome/fontawesome-free/js/all.min.js"])
    .pipe(gulp.dest(sourceFolder + '/js/lib'));
    });

gulp.task("fontawesome-free", gulp.parallel("fontawesomeFonts", "fontawesomeCss", "fontawesomeJs"));


function fontsStyle(){
    let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(pathes.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (let i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb(){
}

function watchFiles(){
    gulp.watch([pathes.watch.html], html);
    gulp.watch([pathes.watch.css], gulp.parallel(css, cssThemes));
    gulp.watch([pathes.watch.js], js);
    gulp.watch([pathes.watch.images], images);
}


let build = gulp.series(clean, gulp.parallel(js, jsLib, css, cssThemes, cssLib, html, images, fonts, webFonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

export {
    fontsStyle,
    fonts,
    webFonts,
    images,
    js,
    jsLib,
    css,
    cssThemes,
    cssLib,
    html,
    build,
    watch,
}
export default watch;