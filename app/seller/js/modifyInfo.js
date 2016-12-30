// header添加事件
(function () {
    function delCookie(name){
        var t = new Date();
        t.setTime(t.getTime()-1);
        document.cookie= name + "=null;path=/;expires="+t.toGMTString();
    }

    var quickMenu = $("#quickMenu");

    quickMenu.on("click", ".logout", function () {
        var _this = $(this);
        $.ajax({
            method: "post",
            url: "/proxy/customer/loginout"
        }).done(function(){
            delCookie("token");
            location.href = "../customer/index.html"
        }).fail(function () {
            delCookie("token");
            location.href = "../customer/index.html"
        });
    });
})();


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

if(userInfo) {
    var infoForm = $("#infoForm");
    infoForm[0].shopName.value = userInfo.shopName;
    infoForm[0].email.value = userInfo.email;
    infoForm[0].telephone.value = userInfo.telephone;
} else {
    tipsAlert("Server error!");
}

var $infoForm = $("#infoForm"),
    emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i,
    telReg = /^\d{8}$/,
    loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find(".tips")
        .text(msg)
        .end()
        .find("input")
        .focus()
        [0].scrollIntoView();
}

$infoForm.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$infoForm.on("submit", (function(){
    var loading = null;
    return function(e){
        e.preventDefault();
        if(loading) return;
        var _this = $(this),
            $shopEmail = _this.find(".shopEmail"),
            $shopTel = _this.find(".shopTel");
        if (!emailReg.test(this.email.value)) {
            addError($shopEmail, "error email!");
            return;
        }
        if (!telReg.test(this.telephone.value)) {
            addError($shopTel, "error telephone!");
            return;
        }
        loading = showLoading(_this);
        $.ajax({
            method: "post",
            url: "/proxy/shop-owner/info/edit",
            data: _this.serialize()
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status == 200) {
                var msg = "Successful, the changes will take effect after you verify your email";
                showSpinner(msg);
                _this.find(".applying").text(msg);
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                showSpinner("Unknown error!");
            }
        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("Server error!");
            /*result = {
                status: 200
            };
            var status = result.status;
            if(status == 200) {
                var msg = "Successful, the changes will take effect after you verify your email";
                showSpinner(msg);
                _this.find(".applying").text(msg);
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                showSpinner("Unknown error!");
            }*/
        });
    };
})());