var host = "http://123.206.100.98:16120";
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i,
    telReg = /^\d{8}$/;
var $applyForm = $("#applyForm");
$applyForm.on("submit", function (e) {
    var _this = $(this);
    e = window.event || e;
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var $shopName = _this.find(".shopName"),
        $shopEmail = _this.find(".shopEmail");
        $shopTel = _this.find(".shopTel");
    if (!this.shopName.value) {
        $shopName.addClass("error")
            .find("input")
            .focus()
            .end()
            .find(".tips")
            .text("shop name can't be empty!");
        return;
    }
    if (!emailReg.test(this.email.value)) {
        $shopEmail.addClass("error")
            .find("input")
            .focus()
            .end()
            .find(".tips")
            .text("error email!");
        return;
    }
    if (!telReg.test(this.telephone.value)) {
        $shopTel.addClass("error")
            .find("input")
            .focus()
            .end()
            .find(".tips")
            .text("error telephone!");
        return;
    }
    var loading = showLoading(_this);
    $.ajax({
        type: "post",
        url: host + "/shop-owner/apply",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: _this.serialize()
    }).done(function (result) {
        if (loading) loading.remove();
        if (result.status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (result.status == 500) {
            $shopName.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("shop name is occupied!");
        } else if (result.status == 800) {
            $shopEmail.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("error email!");
        } else if (result.status == 900) {
            $shopTel.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("error telephone!");
        } else if (result.status == 200) {
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Successful operation, please wait for the administrator to approve.");
        }
    }).fail(function () {
        if (loading) loading.remove();
        tipsAlert("server error");
        result = {
            status: 500
        };
        if (result.status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (result.status == 500) {
            $shopName.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("shop name is occupied!");
        } else if (result.status == 800) {
            $shopEmail.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("error email!");
        } else if (result.status == 900) {
            $shopTel.addClass("error")
                .find("input")
                .focus()
                .end()
                .find(".tips")
                .text("error telephone!");
        } else if (result.status == 200) {
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Successful operation, please wait for the administrator to approve.");
        }
    });
});

$applyForm.on("input", ".input-item input", function () {
   var _this = $(this);
   _this.parent().removeClass('error');
});

function delCookie(name){
    var t = new Date();
    t.setTime(t.getTime()-1);
    document.cookie= name + "=null;path=/;expires="+t.toGMTString();
}

var quickMenu = $("#quickMenu");

quickMenu.on("click", ".logout", function () {
    var _this = $(this);
    $.ajax({
        type: "post",
        url: host+"/customer/loginout",
        xhrFields: {
            withCredentials: true
        }
    }).done(function(){
        delCookie("token");
        location.href = "../customer";
    }).fail(function () {
        delCookie("token");
        location.href = "../customer";
    });
});


function showLoading($relative) {
    var $tips = $relative.siblings(".loadingImg");
    if ($tips.length > 0) $tips.remove();
    $tips = $("<div class='loadingImg'></div>");
    $tips.appendTo($relative.parent())
        .ready(function () {
            $tips.css({
                "top": $relative.offset().top - $(window).scrollTop() + $relative.outerHeight() / 2,
                "left": $relative.offset().left - $(window).scrollLeft() + $relative.outerWidth() / 2,
                "margin-left": -$tips.outerWidth() / 2,
                "margin-top": -$tips.outerHeight() / 2,
                "visibility": "visible"
            });
        });
    return $tips;
}

function tipsAlert(msg, callback){
    var $alert = $(".alert");
    if ($alert.length > 0) $alert.remove();
    $alert = $("<div class='alert'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $("<div class='btn'>OK</div>");
    $btn.on("click", function () {
        $(this).parents(".alert").remove();
        if(callback) callback();
    });
    $content.append($msg).append($btn);
    $alert.append($shadow);
    $alert.append($content);
    $alert.appendTo($("body"));
}