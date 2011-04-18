/*
 * コミックを表示
 */
var win = Ti.UI.currentWindow;
cid = win.title;

//接続中のダイアログ
var dialog = Ti.UI.createAlertDialog();
dialog.setTitle('');
dialog.setMessage("データ取得中..."); 
dialog.show();
		
var xhr = Titanium.Network.createHTTPClient();
	
xhr.open('GET','http://comic.mface.jp/getfile/getjsoncomic?cid='+cid);
xhr.onload = function(){
	var json = JSON.parse(this.responseText);
	
	if(json["error"] == 0){
		win.title = json["comics"]["title"];
		var comic_images = [];
		
		for(var i=0;i<json["comics"]["file"].length;i++){
			comic_images.push(json["comics"]["file"][i]);
		}
		var imageView = Titanium.UI.createImageView({
		    images: comic_images,
		    //width:Titanium.Platform.displayCaps.platformWidth,
		    //height:Titanium.Platform.displayCaps.platformHeight,
			width:300,
			height:400,
		    top:10,
			duration: 2000, 
			repeatCount:0 
		});
		
		dialog.hide();
		win.add(imageView);
		imageView.start();
		
	}else{
		dialog.hide();
		win.title = "取得エラー"
		var alertDialog = Titanium.UI.createAlertDialog({
			title: '取得エラー',
			message: 'データの取得に失敗しました',
			buttonNames: ['OK'],
		});
		alertDialog.show();
		
		alertDialog.addEventListener('click',function(event){
			if(event.index == 0){
				alertDialog.hide();
			}
		});
	}
}

xhr.onerror = function(error){
	dialog.hide();
	var alertDialog = Titanium.UI.createAlertDialog({
		title: '接続エラー',
		message: 'ネットワーク接続に失敗しました',
		buttonNames: ['OK'],
	});
	alertDialog.show();
	
	alertDialog.addEventListener('click',function(event){
		if(event.index == 0){
			alertDialog.hide();
		}
	});
};
	
xhr.send();


/*
function getComic(){
	var dialog = Titanium.UI.createAlertDialog();
	//データ取得
	var cid = 28;
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.open('GET','http://comic.mface.jp/getfile/getjsoncomic?cid='+cid);
	
	xhr.onload = function(){
		//dialog.setMessage('データ取得中。'); 
		//dialog.show();
		var json = JSON.parse(this.responseText);
		
		if(json["error"] == 0){
			var comic_images = [];
			
			for(var i=0;i<json["comics"]["file"].length;i++){
				comic_images.push(json["comics"]["file"][i]);
			}
			var imageView = Titanium.UI.createImageView({
			    images: comic_images,
			    //width:Titanium.Platform.displayCaps.platformWidth,
			    //height:Titanium.Platform.displayCaps.platformHeight,
				width:240,
				height:320,
			    top:20,
			});
			
			imageView.addEventListener('click',function(e){
				Titanium.API.info("image clicked: "+e.index+', selected is '+view.selected);
			});
			imageView.addEventListener('change',function(e){
				Titanium.API.info("image changed: "+e.index+', selected is '+view.selected);
			});
			win.add(imageView);
			
			
		}else{
			var alertDialog = Titanium.UI.createAlertDialog({
				title: '取得エラー',
				message: 'データの取得に失敗しました',
				buttonNames: ['OK'],
			});
			alertDialog.show();
			
			alertDialog.addEventListener('click',function(event){
				if(event.index == 0){
					alertDialog.hide();
				}
			});
		}
	};

	// エラー発生時のイベント
	xhr.onerror = function(error){
		// error にはエラー事由の文字列オブジェクトが入ってくる。
		dialog.setTitle('接続エラー');
		dialog.setMessage(error); 
		dialog.show();
	};
	
	// リクエスト送信します。(引数として JSON 値を入れるとパラメータ化される)
	xhr.send();
}
*/