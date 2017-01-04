var loginForm = $("#loginForm");
loginForm.on("submit", (function() {
    var tips = null;
    return function (e) {
        var _this = $(this);
        e.preventDefault();
        if(tips) return;

        _this.find(".login").text("");
        var name = this.name.value,
            password = this.password.value; //username & password;
        if (!name) {
            _this.find(".login").text("User name can't be empty!");
            return;
        }
        if (!password) {
            _this.find(".login").text("Password can't be empty!");
            return;
        }
        var data = "name=" + name + "&password=" + $.md5(password);

        tips = showLoading(_this);

        $.ajax({
            type: "post",
            url: "/proxy/customer/login",
            dataType: "json",
            data: data
        }).done(function (result) {
            if (tips) {
                tips.remove();
                tips = null;
            }
            if (result.status == 300) {
                _this.find(".login").text("No user or wrong password.");
            } else if (result.status == 200) {
                _this.find(".login").text("Login successfully.");
                var url = getUrlParam("redirectUrl");
                if (url) {
                    location.href = decodeURIComponent(url+"");
                } else {
                    location.href = "index.html";
                }
            }
        }).fail(function (result) {
            if (tips) {
                tips.remove();
                tips = null;
            }
            tipsAlert("Server error!");
            //  result = {
            //      status: 200
            //  };
            // if(result.status==300){
            //     _this.find(".login").text("No user or wrong password.");
            // } else if(result.status==200){
            //     _this.find(".login").text("Login successfully.");
            //     var url = getUrlParam("redirectUrl");
            //     if(url) {
            //      location.href = url;
            //     } else {
            //      location.href = "index.html";
            //     }
            // }
        });
    }
})());

function getUrlParam(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
   var r = window.location.search.substr(1).match(reg); //匹配目标参数
   if (r != null) return r[2]; return null; //返回参数值
  }
function showLoading($relative) {
    var $tips=$relative.siblings(".loadingImg");
    if($tips.length>0) $tips.remove();
    $tips= $("<div class='loadingImg'></div>");
    $tips.appendTo($relative.parent())
        .ready(function () {
            $tips.css({
                "top": $relative.offset().top+$relative.outerHeight()/2,
                "left": $relative.offset().left+$relative.outerWidth()/2,
                "margin-left": -$tips.outerWidth()/2,
                "margin-top": -$tips.outerHeight()/2,
                "visibility": "visible"
            });
        });
    return $tips;
}

function tipsAlert(msg, callback){
    var $alert = $(".tipsAlert");
    if ($alert.length > 0) $alert.remove();
    $alert = $("<div class='tipsAlert'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $("<div class='btn'>OK</div>");
    $btn.on("click", function () {
        $(this).parents(".tipsAlert").remove();
        if(callback) callback();
    });
    $content.append($msg).append($btn);
    $alert.append($shadow);
    $alert.append($content);
    $alert.appendTo($("body"));
}

$(window).on("scroll", function(){
   var header = $("header"),
       _this = $(this);
    header.css("left", -_this.scrollLeft());
});