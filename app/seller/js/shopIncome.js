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

var $orderFilter = $("#orderFilter"),
    $orderForm = $orderFilter.find(".orderForm"),
    loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

$orderForm.find('.selectTime').datepicker({
    format: 'yyyy-mm-dd',
    autoPick: true
}).blur(function(){
    var _this = $(this);
    _this.datepicker("pick");
});
$orderFilter.on("change", ".timeSelect", function () {
    var _this = $(this);
    if(_this.val()=="5"){
        _this.siblings('.detailTime').show();
    } else {
        _this.siblings('.detailTime').hide();
    }
});
$orderForm.on("submit", (function(){
    return function(e){
        e.preventDefault();
        var _this = $(this),
            param = null;
        var time = _this[0].time.value;
        if(time!="5") {
            param = {
                timeFilter: time
            };
        } else {
            param = {
                timeFilter: time,
                beginTime: _this.find(".startTime").val(),
                endTime: _this.find(".endTime").val()
            };
        }
        postIncome(param);
    };
})());

var postIncome = (function(){
    var loading = null;
    return function (param) {
        if(loading) return;
        var reqData = "";
        if(param) {
            reqData += "timeFilter="+param.timeFilter+"&beginTime="+param.beginTime+
            "&endTime="+param.endTime;
        } else {
            reqData += "timeFilter=1";
        }
        loading = showLoading($orderForm);
        $.ajax({
            method: "post",
            url: "/proxy/shop-owner/income",
            data: reqData
        }).done(function (result) {
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200) {
                $orderFilter.find(".income .num").text(result.income);
            } else if(status==300){
                location.href = loginUrl;
            }
        }).fail(function (result) {
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("Server error!");
            /*result = {
                "status":200,
                "income":243.999994546175
            };
            var status = result.status;
            if(status==200) {
                $orderFilter.find(".income .num").text(result.income);
            } else if(status==300){
                location.href = loginUrl;
            }*/
        });
    };
})();

postIncome();