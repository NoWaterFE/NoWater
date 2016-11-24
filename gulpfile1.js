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
    del = require("del"), //删除文件
    fs = require('fs'), //用户获取文件目录
    path = require("path"); //用户合并路径



/*原路径*/
var app = "app"

var paths = [{
    scripts: "app/admin/js/**/*.js",
    sass: "app/admin/style/**/*.scss",
    sprite: "app/admin/imgs",
    imgs: "app/admin/imgs/*",
    html: "app/admin/*.html"
}, {
    scripts: "app/customer/js/**/*.js",
    sass: "app/customer/style/**/*.scss",
    sprite: "app/customer/imgs/",
    imgs: "app/customer/imgs/*",
    html: "app/customer/*.html"
}, {
    scripts: "app/seller/js/**/*.js",
    sass: "app/seller/style/**/*.scss",
    sprite: "app/seller/imgs/",
    imgs: "app/seller/imgs/*",
    html: "app/seller/*.html"
}];

/*构建的文件夹*/
var deployed = "deployed";

/*构建的路径*/
var dest = [{
    scripts: "deployed/admin/js/",
    sass: "deployed/admin/style/",
    imgs: "deployed/admin/imgs/",
    html: "deployed/admin/"
}, {
    scripts: "deployed/customer/js/",
    sass: "deployed/customer/style/",
    imgs: "deployed/customer/imgs/",
    html: "deployed/customer/"
}, {
    scripts: "deployed/seller/js/",
    sass: "deployed/seller/style/",
    imgs: "deployed/seller/imgs/",
    html: "deployed/seller/"
}];

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

gulp.task("sass", function() {
    var sassArray = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        sassArray[i] = gulp.src(paths[i].sass)
            .pipe(plumber())
            .pipe(changed("dist"))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer())
            //.pipe(minicss())
            .pipe(gulp.dest(dest[i].sass))
            .pipe(connect.reload());
    }
    return merge(sassArray);
});

gulp.task("scripts", ["sprite"], function() {
    var scriptsArray = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        scriptsArray[i] = gulp.src(paths[i].scripts)
            .pipe(plumber())
            .pipe(changed("dist"))
            //.pipe(uglify())
            .pipe(gulp.dest(dest[i].scripts))
            .pipe(connect.reload());
    }
    return merge(scriptsArray);
});

gulp.task("imgs", function() {
    var imgsArray = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        imgsArray[i] = gulp.src([paths[i].imgs])
            .pipe(plumber())
            .pipe(changed("dist"))
            .pipe(imagemin({
                optimizationLevel: 5, //类型：Number  默认：3 取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            }))
            .pipe(gulp.dest(dest[i].imgs))
            .pipe(connect.reload());
    }
    return merge(imgsArray);
});

gulp.task("html", function() {
    var htmlArray = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        htmlArray[i] = gulp.src(paths[i].html)
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
            .pipe(gulp.dest(dest[i].html))
            .pipe(connect.reload());
    }
    return merge(htmlArray);
});

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('sprite', function() {
    var spriteArray = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        var folders = getFolders(paths[i].sprite);
        var tasks = folders.map(function(folder) {
            console.log(path.join(paths[i].sprite, folder, '/*'));
            var spriteData = gulp.src(path.join(paths[i].sprite, folder, '/*'))
                .pipe(spritesmith({
                    imgName: folder+".png",
                    cssName: "_"+folder+".scss"
                }));
            var imgStream = spriteData.img
                .pipe(gulp.dest(paths[i].sprite));

            var cssStrem = spriteData.css
                .pipe(gulp.dest(paths[i].sass));
            return merge(imgStream, cssStrem);
        });
        spriteArray.push(tasks);
    }
    return merge(spriteArray);
});


gulp.task("watch", function() {
    var scriptsPath = [],
        sassPath = [],
        imgsPath = [],
        htmlPath = [];
    for (var i = paths.length - 1; i >= 0; i--) {
        scriptsPath.push(paths[i].scripts);
        sassPath.push(paths[i].sass);
        imgsPath.push(paths[i].imgs);
        htmlPath.push(paths[i].html);
    }
    var scripts = gulp.watch(scriptsPath, ["scripts"]);
    var sass = gulp.watch(sassPath, ["sass"]);
    var imgs = gulp.watch(imgsPath, ["imgs"]);
    var html = gulp.watch(htmlPath, ["html"]);

    /*删除文件则删除对应构建的文件*/
    scripts.on("change", function(event) {
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

gulp.task("default", sequence("clean", ["sass", "scripts", "imgs", "html"], "watch", "connect"));
