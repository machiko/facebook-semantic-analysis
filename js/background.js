console.log('background.js running...');
/**************************************************
* Chrome browserAction.onClicked Listener
**************************************************/
// chrome.browserAction.onClicked.addListener(function(tab)
// {

// 	console.log('InsertCSS browserAction click');
// 	chrome.tabs.insertCSS(tab.id, {file: 'css.css', "allFrames": true}, function() {
// 		console.log('css file has inserted.');
// 	});
// });

chrome.browserAction.onClicked.addListener(function(tab) {
    // chrome.tabs.insertCSS(tab.id, {file: 'css/alertify.default.css', "allFrames": true});
    // chrome.tabs.insertCSS(tab.id, {file: 'css/alertify.core.css', "allFrames": true});
    // chrome.tabs.executeScript(tab.id, {file: 'js/jquery-1.11.0.min.js'});
    // chrome.tabs.executeScript(tab.id, {file: 'js/alertify.min.js'});
    // chrome.tabs.executeScript(tab.id, {file: 'js/contentscript.js'});
    //chrome.tabs.executeScript(tab.id, {file: 'js/app.js'});
});