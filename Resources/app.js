// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Ti.UI.createTabGroup();
//
// create base UI tab and root window
//
var win1 = Ti.UI.createWindow({  
    title:'Mface コミック ビューワー',
    backgroundColor:'#fff'
});
var tab1 = Ti.UI.createTab({  
    //icon:'KS_nav_views.png',
    title:'Mface コミック ビューワー',
    window:win1
});

var comic_id;
var comp = false;
if (Ti.Network.online == false) {
	var alertDialog = Ti.UI.createAlertDialog({
		title: '接続エラー',
		message: 'ネットワークに接続できませんでした',
		buttonNames: ['OK'],
	});
	
	alertDialog.show();
	alertDialog.addEventListener('click',function(event){
		if(event.index == 0){
			alertDialog.hide();
		}
	});
}else{
	if (comp == false) {
		var searchBar = Ti.UI.createSearchBar({
			barColor: '#385292',
			showCancel: false
		});
		
		//新着データ
		var tableView;
		var rowData = [];
		
		// ヘッダ部
		var headerRow = Ti.UI.createTableViewRow();
		headerRow.backgroundColor = '#576996';
		headerRow.selectedBackgroundColor = '#385292';
		headerRow.height = 40;
		var clickLabel = Ti.UI.createLabel({
			text: '新着コミック一覧',
			color: '#fff',
			textAlign: 'center',
			font: {
				fontSize: 14
			},
			width: 'auto',
			height: 'auto'
		});
		headerRow.className = 'header';
		headerRow.add(clickLabel);
		rowData.push(headerRow);
		
		getNewComics();
	}
	
	
	
}

//win1.add(label1);

function getNewComics(){
	var xhr = Ti.Network.createHTTPClient();
	//xhr.setRequestHeader('User-Agent','Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3');
	xhr.open('GET','http://comic.mface.jp/getfile/getjsonnewcomics/');
	
	xhr.onload = function(){
		var json = JSON.parse(this.responseText);
		comp = true;
		var len = json.length;
		//alert(len)
		for (var i = 0; i < len; i++) {
			var row = Ti.UI.createTableViewRow();
			row.selectedBackgroundColor = '#fff';
			row.height  =80;
			row.className = 'datarow';
			row.rowNum = json[i]["id"];
					
			row.addEventListener('click', function(e){
				// 上でセットした rowNum にあたる e.source.rowNum でデータを特定する
				showcomic( e.source.rowNum )
			});
			
			//サムネイル
			var photo = Ti.UI.createView({
				backgroundImage: json[i]["icon_image"],
				top:5,
				left:10,
				width:45,
				height:70
			});
			
			photo.rowNum = json[i]["id"];
			photo.addEventListener('click', function(e){});
			
			row.add(photo);
			
			//タイトル
			var title = Ti.UI.createLabel({
				text:json[i]["title"],
				top:5,
				left:65,
				width: 200,
				height: 30,
				color: '#1FA3DF',
				font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
			});
			
			title.rowNum = json[i]["id"];
			title.addEventListener('click', function(e){});
			
			row.add(title);
			
			//作者
			var author = Ti.UI.createLabel({
				text:'作者 : ' + json[i]["uname"],
				top:25,
				left:65,
				width: 200,
				height: 30,
				color: '#1FA3DF',
			});
			
			author.rowNum = json[i]["id"];
			author.addEventListener('click', function(e){});
			
			row.add(author);
			
			rowData.push(row);
		}
		
		tableView = Ti.UI.createTableView({
		    data:    rowData,
			search: searchBar
		});
		win1.add(tableView);
		
		function showcomic(cid){
			comic_id = cid;
			var viewerWindow = Ti.UI.createWindow(
		        {
		            url: 'lib/read.js',
		            title: cid,
		            backgroundColor: '#fff'
		        }
		    );
		    Ti.UI.currentTab.open(viewerWindow);
		}
	};
	
	// エラー発生時のイベント
	xhr.onerror = function(error){
		var row = Ti.UI.createTableViewRow();
		row.selectedBackgroundColor = '#fff';
		row.height  =50;
		row.className = 'datarow';
		var err_text = Ti.UI.createLabel({
			text:'再取得'
		});
		
		err_text.rowNum = 0;
		row.add(err_text);
		err_text.addEventListener('click', function(e){
			// 上でセットした rowNum にあたる e.source.rowNum でデータを特定する
		});
		rowData.push(row)
		tableView = Ti.UI.createTableView({
		    data:    rowData
		});
		win1.add(tableView);
		
		// error にはエラー事由の文字列オブジェクトが入ってくる。
		var alertDialog = Ti.UI.createAlertDialog({
			title: '接続エラー',
			message: '新着データの取得に失敗しました',
			buttonNames: ['OK'],
		});
		
		alertDialog.show();
		alertDialog.addEventListener('click',function(event){
			if(event.index == 0){
				alertDialog.hide();
			}
		});
	};
	// リクエスト送信します。
	xhr.send();
}

//
//  add tabs
//
tabGroup.addTab(tab1);  
 
// open tab group
tabGroup.open();
