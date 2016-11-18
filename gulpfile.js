var gulp = require("gulp");

var sass = require('gulp-sass'), //sass->css
    htmlmin = require("gulp-htmlmin"), //html压缩
    uglify = require("gulp-uglify"), //js压缩
    minicss = require("gulp-minify-css"), //css压缩
    changed = require("gulp-changed"), //用于只编译改变的文件
    imagemin = require("gulp-imagemin"), //图片压缩
    spritesmith = require("gulp.spritesmith"), //雪碧图
    plumber = require("gulp-plumber"), //用户捕获错误，防止任务中断
    sequence = require("gulp-sequence"), //顺序执行任务
    concat = require("gulp-concat"), //合并文件
    autoprefixer = require("gulp-autoprefixer"), //自动给css加前缀（兼容性）
    connect = require("gulp-connect"), //本地服务器自动刷新
    merge = require('merge-stream'), //合并流
    del = require("del"); //删除文件



/*原路径*/
var app = "app"

var paths = {
    js: "app/js/**/*.js",
    sass: "app/style/**/*.scss",
    imgs: "app/imgs/**/*",
    html: "app/html/**/*.html"
};

/*构建的文件夹*/
var deployed = "deployed";

/*构建的路径*/
var dest = {
    js: deployed + "/js",
    css: deployed + "/style",
    imgs: deployed + "/imgs",
    html: deployed + "/html"
};

/*删除构建的文件*/
gulp.task("clean", function() {
    return del([deployed]);
});


gulp.task("connect", function() {
    connect.server({
        root: deployed,
        port: 8000,
        livereload: true
    });

    //connect.serverClose();
});

gulp.task("sass", ["sprite"], function() {
    return gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        //.pipe(minicss())
        .pipe(gulp.dest(dest.css))
        .pipe(connect.reload());
});

gulp.task("js", function() {
    return gulp.src(paths.js)
        .pipe(plumber())
        .pipe(changed("dist"))
        //.pipe(uglify())
        .pipe(gulp.dest(dest.js))
        .pipe(connect.reload());
});

gulp.task("imgs", function() {
    return gulp.src([paths.imgs, "!app/imgs/emoji/**"])
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3 取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(dest.imgs))
        .pipe(connect.reload());
});

gulp.task("html", function() {
    return gulp.src(paths.html)
        .pipe(plumber())
        .pipe(changed("dist"))
        /*.pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))*/
        .pipe(gulp.dest(dest.html))
        .pipe(connect.reload());
});

gulp.task('sprite', function(){
    var spriteData =  gulp.src("app/imgs/emoji/*.png")
        .pipe(spritesmith({
            imgName: "sprite.png",
            cssName: "_sprite.scss"
        }));
    var imgStream = spriteData.img
        .pipe(gulp.dest("app/imgs/"));

    var cssStrem =  spriteData.css
        .pipe(gulp.dest("app/style/"));

    return merge(imgStream, cssStrem);
});


gulp.task("watch", function() {
    var js = gulp.watch(paths.js, ["js"]);
    var sass = gulp.watch(paths.sass, ["sass"]);
    var imgs = gulp.watch(paths.imgs, ["imgs", "sprite"]);
    var html = gulp.watch(paths.html, ["html"]);

    /*删除文件则删除对应构建的文件*/
    js.on("change", function(event) {
        if (event.type === "deleted") {
            var p = event.path.replace(app, deployed);
            del([p]);
        }
    });

    sass.on("change", function(event) {
        if (event.type === "deleted") {
            var p = event.path.replace(app, deployed);
            p = p.replace(".scss", ".css");
            del([p]);
        }
    });

    imgs.on("change", function(event) {
        if (event.type === "deleted") {
            var p = event.path.replace(app, deployed);
            del([p]);
        }
    });

    html.on("change", function(event) {
        if (event.type === "deleted") {
            var p = event.path.replace(app, deployed);
            del([p]);
        }
    });
});

gulp.task("default", sequence("clean", ["sass", "js", "imgs", "html"], "watch", "connect"));
