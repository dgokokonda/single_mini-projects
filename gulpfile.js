var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var concatCss = require('gulp-concat-css'); // Подключаем gulp-concat (для конкатенации файлов)
var autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов


gulp.task('less', function () {
    return gulp.src('app/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(concatCss('main.css'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync', 'less'], function () {//Расположим таск watch после всех других тасков
    gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за less файлами
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
    // Наблюдение за другими типами файлов
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['img', 'less'], function () {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);