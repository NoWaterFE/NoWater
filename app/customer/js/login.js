var host="http://123.206.100.98:16120";
var loginForm = $("#loginForm");
loginForm.on("submit", function (e) {
    var _this = $(this); 
    e = window.event || e;
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }

    _this.find(".login").text("");
    var name = this.name.value, 
        password = this.password.value; //username & password;
    if(!name){
        _this.find(".login").text("User name can't be empty!");
        return;
    }
    if(!password){
        _this.find(".login").text("Password can't be empty!");
        return;
    }
    var data = "name=" + name + "&password=" + $.md5(password);

    var tips = showLoading(_this);

    $.ajax({
        type: "post",
        url: host+"/customer/login",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: data     //序列化
    }).done(function(result){
        if(tips) tips.remove();
        if(result.status==300){
           _this.find(".login").text("No user or wrong password.");
       } else if(result.status==200){
           _this.find(".login").text("Login successfully.");
           var url = getUrlParam("redirectUrl");
           if(url) {
            location.href = decodeURIComponent(url);
           } else {
            location.href = "index.html";
           }
       }
    }).fail(function(result) {
        if(tips) tips.remove();
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

});

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
                "top": $relative.offset().top-$(window).scrollTop()+$relative.outerHeight()/2,
                "left": $relative.offset().left-$(window).scrollLeft()+$relative.outerWidth()/2,
                "margin-left": -$tips.outerWidth()/2,
                "margin-top": -$tips.outerHeight()/2,
                "visibility": "visible"
            });
        });
    return $tips;
}

$(window).on("scroll", function(){
   var header = $("header"),
       _this = $(this);
    header.css("left", -_this.scrollLeft());
});