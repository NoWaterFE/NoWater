var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/logout"
    }).done(function(){
        delCookie("admin_token");
        location.href = "login.html";
    }).fail(function () {
        delCookie("admin_token");
        location.href = "login.html";
    });
});

function delCookie(name){
    var t = new Date();
    t.setTime(t.getTime()-1);
    document.cookie= name + "=null;path=/;expires="+t.toGMTString();
}

function showLoading($relative) {
    var $tips = $relative.find(".loadingImg");
    if ($tips.length > 0) $tips.remove();
    $tips = $("<div class='loadingImg'></div>");
    if($relative.css("position")=="static") $relative.css('position', "relative");
    $tips.appendTo($relative)
        .ready(function () {
            $tips.css({
                "top": $relative.outerHeight() / 2,
                "left": $relative.outerWidth() / 2,
                "margin-left": -$tips.outerWidth() / 2,
                "margin-top": -$tips.outerHeight() / 2,
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

function tipsConfirm(msg, callback, config){
    var def = {
        "ok": "OK",
        "cancel": "Cancel"
    };
    $.extend(def, config);
    var $confirm = $(".tipsConfirm");
    if ($confirm.length > 0) $confirm.remove();
    $confirm = $("<div class='tipsConfirm'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $('<div class="btn2"> ' +
        '<div class="cancel">'+def.cancel+'</div> ' +
        '<div class="ok">'+def.ok+'</div> </div>');

    $btn.on("click", ".cancel", function () {
        $(this).parents(".tipsConfirm").remove();
    });
    $btn.on("click", ".ok", function () {
        $(this).parents(".tipsConfirm").remove();
        if(callback) callback();
    });
    $content.append($msg).append($btn);
    $confirm.append($shadow)
        .append($content)
        .appendTo($("body"));
}

function showSpinner(msg, config){
    var $spinner = $(".spinner");
    if($spinner) $spinner.remove();
    $spinner = $('<div class="spinner"> ' +
        '<div class="tips"> ' +
        msg +
        '</div> ' +
        '</div>');
    var def = {
        timeout: 1500
    };
    $.extend(def, config);
    $spinner.appendTo($("body"))
        .ready(function () {
            $spinner.css({
                "margin-left": -$spinner.width() / 2,
                "margin-top": -$spinner.width() / 2,
                "visibility": "visible"
            });
        });
    setTimeout(function(){
        if($spinner) $spinner.remove();
        var callback = def.callback;
        if(callback) callback();
    }, def.timeout);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

function imgAuto($img) {
    var imgW=$img[0].naturalWidth;
    var imgH=$img[0].naturalHeight;
    var constW=$img.parent().width();
    if(imgH>=imgW){
        $img.css({
            "width": "auto",
            "height": constW
        });
    } else {
        $img.css({
            "width": constW,
            "height": "auto"
        });
    }
}

function createApplyList(info) {
    var $applyList = $('<li class="applyItem clearfix"> ' +
        '<div class="photo"> ' +
            '<img src="'+info.photo[0]+'"> ' +
        '</div> ' +
        '<ul class="info"> ' +
            '<li class="infoItem">' +
                'Shop ID: '+ info.shopId +
            '</li> ' +
            '<li class="infoItem">' +
                'Shop Name: ' + info.shopName +
            '</li> ' +
            '<li class="infoItem">' +
                'Owner ID: '+ info.ownerId +
            '</li> ' +
            '<li class="infoItem">' +
                'Telephone: '+ info.telephone +
            '</li> ' +
            '<li class="infoItem">' +
                'Email: '+ info.email +
            '</li> ' +
        '</ul> ' +
        '<div class="operate"> ' +
            '<span class="approve">APPROVE</span> ' +
            '<span class="reject">REJECT</span> ' +
        '</div> ' +
        '</li>').data("shopId", info.shopId);
    var $img = $applyList.find("img");
    var img = new Image();
    img.src = info.photo[0];
    img.onload = function () {
       imgAuto($img);
    };
    return $applyList;
}

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);


var getApplyItem = (function(){
    var loading = null;
    return function () {
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "get",
            url: "/proxy/admin/shop/applyList",
            dataType: "json"
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                for(var i=0; i<len; i++) {
                    $applyList.append(createApplyList(data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        }).fail(function(result){
            tipsAlert("server error!");
            if (loading) {
                loading.remove();
                loading = null;
            }
            result = {
                status: 200,
                data: [
                    {
                        applyId: 10,
                        applyName: "dhgan yoyoo",
                        telephone: "238409324",
                        shopId: 1,
                        ownerId: 1,
                        email: "nowater@nowater.com",
                        status: 1,
                        photo: ["http://koprvhdix117-10038234.file.myqcloud.com/ebbb7295-edc0-47c8-823e-f4af70d8bdf1.jpg"]
                    }
                ]
            };
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                for(var i=0; i<len; i++) {
                    $applyList.append(createApplyList(data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        });
    }
})();

getApplyItem();

var $applyList = $("#applyList");

$applyList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getApplyItem();
});

$applyList.on("click", ".applyItem .approve", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to approve the application?", function(){
        operate(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});
$applyList.on("click", ".applyItem .reject", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to reject the application?", function(){
        operate(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

var operate = (function(){
    var loading = null;
    return function (_this) {
        if(loading) return;
        var behavior = -1,
            $applyItem = _this.parents(".applyItem");
        loading = showLoading($applyItem);
        if(_this.hasClass("approve")){
            behavior = 1;
        }
        var shopId = $applyItem.data("shopId");
        $.ajax({
            method: "post",
            url: "/proxy/admin/shop/handle",
            data: "shopId="+shopId+"&behavior="+behavior,
            dataType: "json"
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $applyItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl
            }
        }).fail(function (result) {
            tipsAlert("server error");
            if (loading) {
                loading.remove();
                loading = null;
            }
            /*result = {
                status: 200
            };
            var status = result.status;
            if(status==200){
                $applyItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl
            }*/
        });
    }
})();

function createBigImage(imgUrl, rate){
    var $bigImage = $(".imagePop");
    if($bigImage.length==0){
        $bigImage = $('<div class="imagePop">' +
            '<div class="shadow"></div> ' +
            '<div class="bigImage"> ' +
            '<img > ' +
            '<div class="close"></div> ' +
            '</div> ' +
            '</div>');
    }
    $bigImage.find('img').attr("src", imgUrl);
    $bigImage.on("click", ".close", function () {
        $bigImage.hide();
    });
    var img = new Image(),
        $img = $bigImage.find('.bigImage');
    img.src = imgUrl;
    img.onload = function () {
        var imgW=img.naturalWidth;
        var imgH=img.naturalHeight;
        if(rate) {
            $img.css({
                "width": 1200,
                "height": 400
            });
        } else {
            if(imgW/imgH >=3){
                $img.css({
                    "width": 1200,
                    "height": imgH/imgW * 1200
                });
            } else {
                $img.css({
                    "width": imgW/imgH * 400,
                    "height": 400
                });
            }
        }
        $bigImage.appendTo($("body")).show();
    };
}

$applyList.on("click", ".applyItem .photo img", function () {
    createBigImage(this.src);
});