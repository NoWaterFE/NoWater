var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/loginout"
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
    var $tips = $relative.siblings(".loadingImg");
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

function tipsConfirm(msg, callback){
    var $confirm = $(".tipsConfirm");
    if ($confirm.length > 0) $confirm.remove();
    $confirm = $("<div class='tipsConfirm'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $('<div class="btn2"> ' +
        '<div class="cancel">Cancel</div> ' +
        '<div class="ok">Ok</div> </div>');

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
    config = $.extend(config, def);
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
        var callback = config.callback;
        if(callback) callback();
    }, config.timeout);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

function createCustomerList(info) {
    return $('<tr class="shopItem"> ' +
        '<td class="id">'+info.shopId+'</td> ' +
        '<td class="name">'+info.shopName+'</td> ' +
        '<td class="ownerId">'+info.ownerId+'</td> ' +
        '<td class="tel">'+info.telephone+'</td> ' +
        '<td class="email">'+info.email+'</td> ' +
        '<td class="operate"> ' +
        '<span class="blackList">add to blacklist</span> ' +
        '<span class="del">delete</span> ' +
        '</td> ' +
        '</tr>');
}

var cStatus = getUrlParam("status");

if(cStatus==null) cStatus=0;
cStatus = parseInt(cStatus);
if(cStatus>1 || cStatus<0) cStatus = 0;

var $shopMain = $("#shopMain");
$shopMain.find(".shopTab")
    .eq(cStatus)
    .addClass("active");


var getCustomerItem = (function(){
    var loading = null,
        startId = 0;
    return function (cStatus) {
        var reqData = "count=20&startId="+startId;
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "get",
            url: "/proxy/admin/shop/list",
            dataType: "json",
            data: reqData
        }).done(function(result){

        }).fail(function(result){
            result = {
                status: 200,
                data: [
                    {
                        shopId: 10,
                        shopName: "dhgan yoyoo",
                        telephone: "238409324",
                        ownerId: 1,
                        email: "nowater@nowater.com",
                        status: 1
                    }
                ]
            };
            if (loading) {
                loading.remove();
                loading = null;
            }
            var data = result.data,
                len = data.length;
            var $tbody = $shopList.find(".shopTable tbody");
            for(var i=0; i<10; i++) {
                $tbody.append(createCustomerList(data[0]));
            }
            if(startId!=-1){
                $shopList.find(".more .showMore").removeClass("hidden");
            }
        });
    }
})();

getCustomerItem(cStatus);

var $shopList = $("#shopList");

$shopList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getCustomerItem(cStatus);
});
