import gulp from "gulp";

import { path } from "./gulp/config/path.js";

//импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";

//передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),//режим продакшн
	isDev: !process.argv.includes('--build'),//режим разработчика
	path: path,
	gulp: gulp,
	plugins: plugins
}


//импорт задач 
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { zip } from "./gulp/tasks/zip.js";
//import { ftp } from "./gulp/tasks/ftp.js";

//Наблюдатель за измениями в файлах
function watcher() {
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html);//gulp.series(html, ftp)//для выгружения всего на сервер и смотреть за изменениями
	gulp.watch(path.watch.scss, scss);//gulp.series(scss, ftp)
	gulp.watch(path.watch.js, js);//gulp.series(js, ftp)
	gulp.watch(path.watch.images, images);//gulp.series(images, ftp)
}

export { svgSprive }

//последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

//основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

//построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deploZIP = gulp.series(reset, mainTasks, zip);
//const deploFTP = gulp.series(reset, mainTasks, ftp);

//Экспорт сценариев
export { dev }
export { build }
export { deploZIP }
//export { deploFTP }

//выполнение задач
gulp.task('default', dev);