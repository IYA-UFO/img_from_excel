// ユーティリティ
const path        = require('path');
var gulp          = require('gulp');
var fs            = require('fs');
var del           = require('del');
var changed       = require('gulp-changed');
var runSequence   = require('run-sequence');

// 画像処理
const download    = require('image-downloader');
var imagemin      = require('gulp-imagemin');
var imageminJpg   = require('imagemin-jpeg-recompress');
var imageminPng   = require('imagemin-pngquant');

// エクセル読み込み
var convertExcel  = require('excel-as-json').processFile;


//基本タスク
gulp.task('default', function() {
	runSequence(
		'clean',
		'convert',
		'saveimg'
		);
});

//画像圧縮
gulp.task('imagemin', function(){
	var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
	var dstGlob = paths.dstDir;
	gulp.src( srcGlob )
	.pipe(changed( dstGlob ))
	.pipe(imagemin([
		imageminPng(),
		imageminJpg()
		]
		))
	.pipe(gulp.dest( dstGlob ));
});


//呼び出し機能============================================

//Excel⇨JSON 変換
gulp.task('convert', function(){
	var options = {
		omitEmptyFields: true
	}
	return convertExcel('./data.xlsx', './data.json',options);
});

//画像DL
gulp.task('saveimg', function(){
	setTimeout(function(){
	var data = './data.json';
	data = JSON.parse(fs.readFileSync(data, 'utf8'));
	var options = {
		url: '',
		dest: ''
	}

	for (var i = 0; i < data.length; i++) {
		if (data[i].url == null||data[i].filename == null) {
			break;
		}
		options.url = data[i].url;
		options.dest = path.join('./img/', data[i].filename);
		download.image(options)
		.then(({ filename, image }) => {
			console.log('File saved to', filename)
		}).catch((err) => {
			throw err
		})
	}
}, 2000);
});

//既存ファイル削除
gulp.task('clean', function (cb) {
	return del([
		'img/**','!img'
		], cb);
});


// 圧縮前と圧縮後のディレクトリを定義
var paths = {
	srcDir : './img',
	dstDir : './img/compressed'
}


