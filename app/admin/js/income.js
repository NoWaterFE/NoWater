var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/logout",
        cache: false
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
    config = $.extend(def, config);
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

var $orderFilter = $("#orderFilter"),
    $orderForm = $orderFilter.find(".orderForm"),
    loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

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
            url: "/proxy/admin/income",
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

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

var $commissionDiv = $("#commissionDiv");
function getCommission() {
    $.ajax({
        method: "get",
        url: "/proxy/admin/commission/show",
        cache: false
    }).done(function (result) {
        var status = result.status;
        if(status == 200) {
            var commission = result.commission;
            $commissionDiv.data("commission", commission).show()
                .find(".rate").text(commission*100+"%");
        } else if(status == 300) {
            location.href = loginUrl;
        } else {
            tipsAlert("Server error!");
        }
    }).fail(function (result) {
        tipsAlert("Server error!");
        result = {
            "commission": "0.02",
            "status": 200
        };
        var status = result.status;
        if(status == 200) {
            var commission = result.commission;
            $commissionDiv.data("commission", commission).show()
                .find(".rate").text(commission*100+"%");
        } else if(status == 300) {
            location.href = loginUrl;
        } else {
            tipsAlert("Server error!");
        }
    })
}
getCommission();

$commissionDiv.on("click", ".edit", function () {
    var $commissionPop = $(".commissionPop"),
        commission = $commissionDiv.data("commission");
    if($commissionPop.length==0) {
        createEdit(commission).appendTo($("body"));
    } else {
        $commissionPop.show().find("#commission").val(commission);
    }
});
function createEdit(commission) {
    var $commissionPop = $('<div class="commissionPop">' +
        '<div class="shadow"></div>' +
        '<form class="commissionForm" id="commissionForm" novalidate>' +
        '<i class="cancel close"></i>' +
        '<h2 class="title">Modify Commission Rate</h2>' +
        '<div class="input-item commission">' +
        '<label for="commission" class="redStar">Commission Rate: </label>' +
        '<input type="text" name="commission" value="'+(commission * 100)+'" id="commission" placeholder="2" maxlength="5"> ' +
        '<span style="font-size: 24px; color: #666; vertical-align: middle">%</span>' +
        '<span class="tips"></span>' +
        '</div>' +
        '<div class="submit">' +
        '<input type="submit" value="CONFIRM">' +
        '<input type="button" value="CANCEL" class="cancel">' +
        '</div>' +
        '</form>' +
        '</div>');

    var $commissionForm = $commissionPop.find("#commissionForm");

    $commissionForm.on("input", ".input-item input", function () {
        var _this = $(this);
        _this.parent().removeClass('error');
    });

    $commissionForm.on("input", ".commission input", function (e) {
        var val = this.value;
        for(var i=val.length-1; i>=0; i--){
            var char = val.charAt(i);
            if(!(char>="0"&&char<="9"||char==".")){
                val = val.substr(0, i)+val.substr(i+1);
            }
        }
        var si = val.indexOf("."),
            ei = val.lastIndexOf(".");
        if(ei!==si){
            val = val.substr(0, ei);
        }
        if(si!==-1) this.value = val.substr(0, si+3);
        else this.value = val;
    });

    $commissionForm.on("click", ".cancel", function (e) {
        var $delegateTarget = $(e.delegateTarget);
        $delegateTarget[0].reset();
        $delegateTarget.parent()
            .hide();
    });

    $commissionForm.on("submit", function (e) {
        var _this = $(this);
        e.preventDefault();
        if(_this.data("submit")) return;
        var $commission = _this.find(".commission"),
            commission = this.commission.value;
        if (!commission) {
            addError($commission, "Commission rate can't be empty!");
            return;
        }
        commission = parseFloat(commission);
        if(commission > 100) {
            addError($commission, "Commission rate can't more than 100%!");
            return;
        }
        var loading = showLoading(_this);
        _this.data("submit", true);
        $.ajax({
            method: "post",
            url: "/proxy/admin/commission/changing",
            dataType: "json",
            data: "commission="+(commission/100)
        }).done(function (result) {
            if (loading) loading.remove();
            _this.data("submit", false);
            var status = result.status;
            if(status==200) {
                $commissionPop.hide();
                $commissionDiv.find(".rate").text(commission+"%");
                showSpinner("Edit Successful");
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }
        }).fail(function (result) {
            if (loading) loading.remove();
            _this.data("submit", false);
            tipsAlert("Server error!");
            /*result = {
                status: 200
            };
            var status = result.status;
            if(status==200) {
                $commissionPop.hide();
                $commissionDiv.find(".rate").text(commission+"%");
                showSpinner("Edit Successful");
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }*/
        });

    });

    return $commissionPop;
}