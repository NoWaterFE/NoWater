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

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var $commissionForm = $("#commissionForm");

var postCommission = (function(){
    var loading = null;
    return function () {
        if(loading) return;
        loading = showLoading($commissionForm);
        $.ajax({
            method: "post",
            url: "/proxy/admin/commission/show"
        }).done(function (result) {
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if (status == 200) {
                $commissionForm[0].commission.value = result.commission;
            } else if (status == 300) {
                location.href = loginUrl;
            }
        }).fail(function (result) {
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("Server error!");
            result = {
                "status": 200,
                "commission": 243.999994546175
            };
            var status = result.status;
            if (status == 200) {
                $commissionForm[0].commission.value = result.commission;
            } else if (status == 300) {
                location.href = loginUrl;
            }
        });
    };
})();

postCommission();

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

$commissionForm.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $price = _this.find(".price"),
        price = this.price.value;
    if (!price) {
        addError($price, "Bidding price can't be empty!");
        return;
    } else if (parseFloat(price) < 1000) {
        addError($price, "Bidding price can't be less than HK$1000!");
        return;
    }
    if(_this.data("submit")) return;
    var loading = showLoading(_this);
    _this.data("submit", true);
    $.ajax({
        method: "post",
        url: "/proxy/shop-owner/product/ad/apply",
        dataType: "json",
        data: _this.serialize()
    }).done(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
        var status = result.status;
        if(status==200) {
            var orderId = result.orderId,
                arr = [];
            arr.push(orderId);
            location.href = "pay.html?type=2&sumPrice="+price+"&orderIdList="+JSON.stringify(arr);
        } else if(status==300){
            location.href = loginUrl;
        } else if(status==600) {
            tipsAlert("Failure, it has been exceeded the specified deadline today.");
        } else if(status==700) {
            tipsAlert("Failure, this product are biding for ad.");
        } else {
            tipsAlert("Server error!");
        }
    }).fail(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("Server error!");
        result = {
            status: 200,
            orderId: 23
        };
        var status = result.status;
        if(status==200) {
            var orderId = result.orderId,
                arr = [];
            arr.push(orderId);
            location.href = "pay.html?type=2&sumPrice="+price+"&orderIdList="+JSON.stringify(arr);
        } else if(status==300){
            location.href = loginUrl;
        } else if(status==600) {
            tipsAlert("Failure, it has been exceeded the specified deadline today.");
        } else if(status==700) {
            tipsAlert("Failure, this product are biding for ad.");
        } else {
            tipsAlert("Server error!");
        }
    });

});