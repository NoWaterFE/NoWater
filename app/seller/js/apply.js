var host="http://123.206.100.98:16120";
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
    if(!shopName){
        alert("shop name can't be empty!");
        return;
    }
    if(!emailReg.test(shopEmail)){
        alert("error email!");
        return;
    }
    var tips = showLoading(_this);
    $.ajax({
        type: "post",
        url: host+"shop-owner/apply",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: _this.serialize()
    }).done(function(result){
        if(tips) tips.remove();
        if(result.status==300){
            alert("error email!");
        } else if(result.status==200){
            alert("Successful operation, please wait for the administrator to approve")
        }
    }).fail(function(result) {
        if(tips) tips.remove();
        result = {
            status: 200
        };
       if(result.status==300){
           alert("error email!");
       } else if(result.status==200){
           _this.find("input").addClass("disabled").attr("disabled", true);
           _this.find(".applying").text("You are applying for a shop, please wait for the administrator to approve.");
           alert("Successful operation, please wait for the administrator to approve");
       }
    });

});

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