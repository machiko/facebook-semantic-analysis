# facebook 語意分析
---
根據目前觀看的動態消息，截取內容並送出給中研院斷詞系統進行斷詞分析。

使用方式 :
---
載入 google chrome plugin ```package/facebook-semantic-analysis.crx ```

1. 開啓 google chrome 設定，然後選擇擴充功能 ![chrome 擴充功能](https://dl.dropboxusercontent.com/u/3295432/facebook-semantic-analysis/%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202014-03-31%2017.57.33.jpg)
2. 將 fb_semantic_analysis.crx 拖曳進瀏覽器 ![chrome 擴充功能安裝](https://dl.dropboxusercontent.com/u/3295432/facebook-semantic-analysis/%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202014-03-31%2018.05.24.jpg)
3. 開啓 facebook 即可使用 ![使用畫面](https://dl.dropboxusercontent.com/u/3295432/facebook-semantic-analysis/%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202014-03-31%2014.37.28.jpg)

discuss : 
---
###20140401 : todo

1. 將內容封裝成 json object
2. 內容記錄停留時間
3. 停留 2 min 進行 CKIP
4. 覺得、感受內容
5. CKIP 回應時，跳出情感選項，並記錄

###20140406 : 

1. 當已看過的內容，離開後，再次觀看。此時計時器是否繼續或是將計時器重新歸零，兩分鐘後再送出 CKIP?

###20140629 :

1. server run java, and response
