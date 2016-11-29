var host = "http://123.206.100.98:16120";
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
var applyForm = $("#applyForm");
applyForm.on("submit", function (e) {
    var _this = $(this);
    e = window.event || e;
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var shopName = this.shopName.value,
        shopEmail = this.shopEmail.value;
    if (!shopName) {
        _this.find(".applying").text("shop name can't be empty!");
        return;
    }
    if (!emailReg.test(shopEmail)) {
        _this.find(".applying").text("error email!");
        return;
    }
    var tips = showLoading(_this);
    $.ajax({
        type: "post",
        url: host + "/shop-owner/apply",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: _this.serialize()
    }).done(function (result) {
        if (tips) tips.remove();
        var msg = _this.find(".applying");
        if (result.status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (result.status == 500) {
            msg.text("shop name is occupied");
        } else if (result.status == 800) {
            msg.text("error email")
        } else if (result.status == 900) {
            msg.text("error telephone")
        } else if (result.status == 200) {
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Successful operation, please wait for the administrator to approve");
        }
    }).fail(function () {
        if (tips) tips.remove();
        alert("server error");
        location.href = "../customer";
        /*result = {
            status: 200
        };
        var msg = _this.find(".applying");
        if (result.status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (result.status == 500) {
            msg.text("shop name is occupied");
        } else if (result.status == 800) {
            msg.text("error email")
        } else if (result.status == 900) {
            msg.text("error telephone")
        } else if (result.status == 200) {
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Successful operation, please wait for the administrator to approve");
        }*/
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