/**
 * initial
 */

if (location.pathname == "/") { //profile id
    var profile_id = $('input[name=targetid]').val();
    //var profile_name = $('a.fbxWelcomeBoxName').text();
} else {
    var profile_id = $('input[name=profile_id]').val();
}

var visual_range = Number($(window).height()); //可視範圍
var content_obj_list = [];
var content_index = 0; //內容 index
var ckip_status = true; //ckip status

/**
 * scroll function
 */

function addEvent(obj, type, fn) {

  if ( obj.attachEvent ) {

    obj['e'+type+fn] = fn;

    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}

    obj.attachEvent( 'on'+type, obj[type+fn] );

  } else

    obj.addEventListener( type, fn, false );

}

/**
 * userContent
 */
function userContent() {
    var scroll_top = Number($(document).scrollTop()); //現在 scroll 位置
    var content_wrapper = $("div[data-insertion-position]").eq(content_index);
    // console.log(content_index);

    for (var i = 0; i < content_obj_list.length; i++) {

        var offset_top = Number(content_obj_list[i].offsetTop); //區塊 top 位置
        var offset_height = Number(content_obj_list[i].offsetHeight); //區塊高度

        //判斷內容是否可視
        if (offset_top + offset_height < scroll_top || offset_top + offset_height > scroll_top + visual_range ) {
            if (content_obj_list[i].isShow == true) {
                content_obj_list[i].isShow = false;

                // console.log("第" + i + "個內容 is show :" + content_obj_list[i].isShow);
                // if (content_wrapper.length == 0) {
                //     content_index ++;
                // }
                window.clearInterval(content_obj_list[i].timer_id); //停止 timer
            }
        } else {
            if (content_obj_list[i].isShow == false) {
                content_obj_list[i].isShow = true;

                // console.log("第" + i + "個內容 is show :" + content_obj_list[i].isShow);
                countSec(content_obj_list[i].timer_count, i); //重新啟動 timer
            }
        }
    }

    //須有此物件才進行判斷，因為 fb 會在可視的內容物件上面加上 data-insertion-position 的 屬性
    // console.log(content_wrapper.length);
    if (content_wrapper.length > 0) {
        //init content object
        var content_obj = {};
        var content_wrapper_offsetTop = content_wrapper.get(0).offsetTop;
        var content_wrapper_offsetHeight = content_wrapper.get(0).offsetHeight;

        if ((content_wrapper_offsetTop + content_wrapper_offsetHeight < scroll_top + visual_range)) {
            //加上新屬性
            content_obj.index = content_index; //內容 index
            content_obj.isShow = true; //內容可視狀態
            content_obj.author = ""; //作者
            content_obj.content = content_wrapper.find(".userContent._5pbx").text(); //內容
            content_obj.fellings = ""; //內容感受
            content_obj.timer_id = 0; //內容 timer id
            content_obj.timer_count = 0; //內容 timer 停留秒數
            content_obj.ckip = ""; //內容 ckip
            content_obj.ckip_status = false; //內容送出 ckip 狀態
            content_obj_list.push(content_obj);
            //timer start
            countSec(0, content_index);

            var content_profile_id = content_wrapper.find('div.clearfix._5x46 a').data('hovercard').split('=')[1]; //內容帳號 id
            var content_owner = content_wrapper.find('div.clearfix._5x46').find('span.fwb a:eq(0)').text(); //內容擁有者 name
            var content_fellings = content_wrapper.find("span.fcg:eq(0)").text().replace(content_owner, "").trim(); //內容感受
            if (profile_id == content_profile_id) {
                var profile_name = "我 : ";
            } else {
                var profile_name = content_owner + " : ";
            }
            content_obj.author = content_owner; //作者

            if (content_fellings) {
                content_obj.fellings = content_fellings; //感受
            }
            //alert inform
            alertify.set({ delay: 10000 }); // 設定彈出視窗秒數
            alertify.success(profile_name + content_obj.content);
            console.log(content_obj_list[0]);

            //get java 演算法，斷詞回饋
            // $.get("https://localhost:8443/HelloSVM/hello.do", function(data) {
            //     console.log(data.readline[0]);
            //     alertify.success(data.readline[content_index]);
            // }, "json");

            //回傳 內容 object
            $.get("https://localhost:8443/HelloSVM/getUsr",
                {
                    "gusr": JSON.stringify(content_obj)
                }, function(data) {
                    console.log(data);
                }, "json");

            //加上已讀標簽， index + 1
            content_index ++;
            content_wrapper.addClass("has_read");
        }
    } else {
        //如果沒有讀到 data-insert-position ，繼續累加 index
        // content_index ++;
    }
}

/**
 * ckip 斷詞
 */
function ckip(index) {
    $.get("http://reyes.synology.me/ckip/ckip-test-driver.php",
    {
        "text": content_obj_list[index].content
    },
    function(data) {
        console.log(data);
        var ckip_text = "";
        for (var i = 0, data_len = data.length; i < data_len; i++) {
            ckip_text += data[i].term + ":" + data[i].tag + "\n";
        }

        alertify.log(ckip_text);
        content_obj_list[index].ckip = ckip_text; //設定 ckip
    },"json");

    window.clearInterval(content_obj_list[index].timer_id); //停止目前內容的 timer

    if ($('.alertify-message').children().length == 0) {
        alertify.alert("感受調查", function() {
            for (var i = 0; i < $('[id^=radio_]').length; i++) {
                var checked_value = $('[id^=radio_]:eq(' + i + ')').find('input[name^=optionsRadios]:checked').val();
                var data_index = $('[id^=radio_]:eq(' + i + ')').data('index');

                // console.log(content_obj_list);
                alertify.log("對「" + content_obj_list[data_index].content.substr(0, 10) + "」的感受 : " + checked_value);
                content_obj_list[data_index].fellings = checked_value; //設定感受
                //countSec(content_obj_list[data_index].timer_count, data_index); //重新啟動目前內容的 timer
                countSec(0, data_index); //重新啟動目前內容的 timer
                ckip_status = true; //重新啟動 ckip
            }

            $('.alertify-message').html('');
        });
    }

    var html_content = '\
        <div id="radio_' + index + '" data-index="' + index + '">\
        <p>請問您對於「' + content_obj_list[index].content + '」的感受是?</p>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="開心" checked>\
          開心\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="難過">\
          興奮\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          中性\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          生氣\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          討厭\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          擔心\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          難過\
        </label>\
        </div>\
    ';

    $('.alertify-message').append($.parseHTML(html_content));
    ckip_status = false; //避免連續送出 request
    //alertify.success("第" + index + "內容送出 ckip");
}

/**
 * segChinese 斷詞
 */
function segChinese(index) {
    $.get("https://localhost:8443/HelloSVM/SegChinese",
    {
        "text": content_obj_list[index].content
    },
    function(seg_data) {
        console.log(seg_data);

        //hello.do
        $.get("https://localhost:8443/HelloSVM/hello.do", {
            "seg": JSON.stringify(seg_data)
        }, function(data) {
            //init readline index
            line_index = content_index % data.readline.length;
            alertify.success(data.readline[line_index]);

            var ckip_text = "";
            for (var i = 0, data_len = data.length; i < data_len; i++) {
                ckip_text += data[i].term + ":" + data[i].tag + "\n";
            }

            alertify.log(ckip_text);
            content_obj_list[index].ckip = ckip_text; //設定 ckip
        }, "json");

    },"json");

    window.clearInterval(content_obj_list[index].timer_id); //停止目前內容的 timer

    if ($('.alertify-message').children().length == 0) {
        alertify.alert("感受調查", function() {
            for (var i = 0; i < $('[id^=radio_]').length; i++) {
                var checked_value = $('[id^=radio_]:eq(' + i + ')').find('input[name^=optionsRadios]:checked').val();
                var data_index = $('[id^=radio_]:eq(' + i + ')').data('index');

                // console.log(content_obj_list);
                alertify.log("對「" + content_obj_list[data_index].content.substr(0, 10) + "」的感受 : " + checked_value);
                content_obj_list[data_index].fellings = checked_value; //設定感受
                //countSec(content_obj_list[data_index].timer_count, data_index); //重新啟動目前內容的 timer
                countSec(0, data_index); //重新啟動目前內容的 timer
                ckip_status = true; //重新啟動 ckip
            }

            $('.alertify-message').html('');
        });
    }

    var html_content = '\
        <div id="radio_' + index + '" data-index="' + index + '">\
        <p>請問您對於「' + content_obj_list[index].content + '」的感受是?</p>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="開心" checked>\
          開心\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="難過">\
          興奮\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          中性\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          生氣\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          討厭\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          擔心\
        </label>\
        <label class="radio">\
          <input type="radio" name="optionsRadios_' + index + '" value="新奇">\
          難過\
        </label>\
        </div>\
    ';

    $('.alertify-message').append($.parseHTML(html_content));
    ckip_status = false; //避免連續送出 request
    //alertify.success("第" + index + "內容送出 ckip");
}

/**
 * 計時器
 */
function countSec(init_number, index) {
    var count_number = init_number;
    var count_limit = 5; //送出 ckip 等待秒數
    var count_speed = 1000; //timer 速率
    var count_id;

    var countDown = function(index) {
        count_number ++;
        // console.log("第" + index + "次計數 : " + count_number);
        if (count_number == count_limit) {
            //呼叫 ckip / seg chinese
            if (ckip_status) {
                //如有送出過 ckip 則不再 request
                if (content_obj_list[index].ckip_status == false) {
                    content_obj_list[index].ckip_status = true;
                    segChinese(index);
                    // ckip(index);
                }
            }
        }

        content_obj_list[index].timer_count = count_number; //set timer_count
    };

    count_id = window.setInterval(function() {
        countDown(index);
    }, count_speed);

    //console.log("起始值 : " + init_number + "，index : " + index);
    content_obj_list[index].timer_id = count_id; //set timer id

}


/**
 * action 區
 */
alertify.success("facebook 語意分析開始...");

//scroll active
addEvent(window, 'scroll', function(event) {
    var content_not_read_num = $(".userContent:not([class*=has_read])").length;

    if (content_not_read_num > 0 ) {
        userContent();
    }

});