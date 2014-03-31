/**
 * initial
 */

if (location.pathname == "/") { //profile id
    var profile_id = $("input[name=targetid]").val();
} else {
    var profile_id = $("input[name=profile_id]").val();
}

var visual_range = $(window).height(); //可視範圍
var ckip_status = true;

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
    var scroll_top = $(document).scrollTop(); //現在 scroll 位置
    var content_wrapper_no_read = $(".userContentWrapper:not([class*=has_read])").eq(0);
    var content_no_read = $(".userContent:not([class*=has_read])").eq(0);

    var content_top = content_wrapper_no_read.parent().offset().top; //content 位置
    var content_height = content_wrapper_no_read.outerHeight(); //content 高度

    //console.log((content_top + content_height < scroll_top + visual_range));
    if ((content_top + content_height < scroll_top + visual_range)) {
        //加上已讀標簽
        content_wrapper_no_read.addClass("has_read");
        content_no_read.addClass("has_read");

        //countSec();
        //console.log(content_no_read.outerHeight(), scroll_top);
        var content_profile_id = content_no_read.prev().children("a").data("hovercard").split("=")[1];
        if (profile_id == content_profile_id) {
            var profile_name = "我 : ";
        } else {
            var profile_name = "朋友 : ";
        }


        //alert inform
        alertify.success(profile_name + content_no_read.text());

        console.log(ckip_status);
        if (ckip_status) {
            $.get("http://reyes.synology.me/ckip/ckip-test-driver.php",
            {
                "text": content_no_read.text()
            },
            function(data) {
                console.log(data);
                var ckip_text = "";
                for (var i = 0, data_len = data.length; i < data_len; i++) {
                    ckip_text += data[i].term + ":" + data[i].tag + "\n";
                }
                alertify.log(ckip_text);
            },"json");

            ckip_status = false;
            countSec();
        }
        //console.log(content_no_read.find(".userContent").text());
        //console.log($(value).find(".text_exposed_show").text());
    }
    //var user_content = $(".userContentWrapper .userContent").text(); //發文內容
    // $(".userContentWrapper:not([class*=has_read])").each(function(index, value) {
    //     //todo 取出每一塊內容的位置與高度，並與目前 scroll 位置可視範圍比較是否為當前正在觀看
    //     //console.log(scroll_top, visual_range);
    //     var content_top = $(value).parent('div').offset().top; //content 位置
    //     var content_height = $(value).parent('div').outerHeight(); //content 高度
    //     //console.log("內容高度:" + (content_top + content_height) + "scroll 高度:" + (scroll_top + visual_range));
    //     if ((content_top + content_height < scroll_top + visual_range) && !$(value).hasClass("has_read")) {
    //         $(value).addClass("has_read");
    //         console.log($(".userContentWrapper").index($(value)));
    //         console.log($(value).find(".userContent").text());
    //         //console.log($(value).find(".text_exposed_show").text());
    //     }
    //     return false;
    // });
    //console.log(scroll_top);
    //console.log(visual_range);
}

/**
 * 計時器
 */
function countSec() {
    var countdownnumber = 120;
    var countdownid;
    countDown();

    function countDown() {
        console.log(countdownnumber);
        if (countdownnumber == 0) {
            ckip_status = true;
            clearTimeout(countdownid);
        } else {
            countdownnumber --;
            if(countdownid) {
                clearTimeout(countdownid);
            }
            countdownid = setTimeout(countDown, 1000);
        }
    }
}

/**
 * action 區
 */

// $.getJSON(fburl, function(data){
//     console.log(data.id);
// });

alertify.success("facebook analysis is running...");

//console.log(profile_id);
//console.log($(".userContentWrapper").find("a:eq(1)").data("hovercard"));
//console.log(user_content);


//scroll active
addEvent(window, 'scroll', function(event) {
    var body = document.body,
    html = document.documentElement;

    //get html height
    var height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    var content_num = $(".userContent").length;
    var content_has_read_num = $(".userContent:not([class*=has_read])").length;

    if (content_has_read_num > 0 ) {
        userContent();
    }

});

//$.get("http://reyes.synology.me/ckip/ckip-test-driver.php", {"text": "我們是學生，太陽花學運"}, function(data) {console.log(data);}, "json");
//$.post("http://www.fukuball.com/ckip-client/ckip-process", {"paragraph": "哈哈哈"}, function(data) {console.log(data);});
//
// $.get("http://reyes.synology.me/ckip/ckip-test-driver.php",
//             {
//                 "text": "某人又在我面前大嗑臭臭鍋"
//             },
//             function(data) {
//                 console.log(JSON.parse(data));
//                 alertify.log(data);
//             });
//userContent();