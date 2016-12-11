var host = "http://123.206.100.98:16120";
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
            url: host+"/customer/loginout",
            xhrFields: {
                withCredentials: true
            }
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
var $applyAd = $("#applyAd");
$applyAd.on("submit", function (e) {
    var _this = $(this);
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var $amount = _this.find(".amount"),
        $adImage = _this.find(".adImage");
    if (!this.amount.value) {
        addError($amount, "bidding price can't be empty!");
        return;
    }
    if(this.adImage.files.length==0) {
        addError($adImage, "please add your ID photo!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    var formData = new FormData();
    formData.append("adImage", this.adImage.files[0]);
    $.ajax({
        method: "post",
        url: host + "/shop-owner/",
        dataType: "json",
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formData
    }).done(function(result){

    }).fail(function(result){
        if(result.status==200){
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
                _this.data("submit", false);
                if (result.status == 300) {
                    location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
                } else if (result.status == 500) {
                    addError($shopName, "shop name is occupied!");
                } else if (result.status == 800) {
                    addError($shopEmail, "error email!");
                } else if (result.status == 900) {
                    addError($shopTel, "error telephone!");
                } else if (result.status == 200) {
                    _this.find("input").addClass("disabled").attr("disabled", true);
                    _this.find(".applying").text("Successful operation, please wait for the administrator to approve.");
                }
            }).fail(function () {
                if (loading) loading.remove();
                _this.data("submit", false);
                //tipsAlert("server error");
                result = {
                    status: 500
                };
                if (result.status == 300) {
                    location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
                } else if (result.status == 500) {
                    addError($shopName, "shop name is occupied!");
                } else if (result.status == 800) {
                    addError($shopEmail, "error email!");
                } else if (result.status == 900) {
                    addError($shopTel, "error telephone!");
                } else if (result.status == 200) {
                    _this.find("input").addClass("disabled").attr("disabled", true);
                    _this.find(".applying").text("Successful operation, please wait for the administrator to approve.");
                }
            });
        }
    });
});

function createObjectURL(blob) {
    if(window.URL){
        return window.URL.createObjectURL(blob);
    } else if(window.webkitURL){
        return window.webkitURL.createObjectURL(blob);
    } else {
        return null;
    }
}

$applyAd.on("change", "#adImage", function(e){
    var _this=$(this);
    var file=this.files[0];
    var url=createObjectURL(file);
    var $delegateTarget = $(e.delegateTarget);
    var type=file.type.toLowerCase();
    if (!(type==="image/jpg"||type==="image/gif"||type==="image/jpeg"||type==="image/png")){
        tipsAlert("Image format error, the image can only be JPG, GIF, JPEG, PNG format");
        return;
    }else if(file.size/1024>=5120){
        tipsAlert("File size should not be greater than 5M");
        return;
    }
    var imgY=new Image();
    imgY.onload=function(){
        var $imagesPreview = $delegateTarget.find(".imagesPreview");
        var $img = $imagesPreview.find("img");
        $img.attr("src", url);
        $imagesPreview.height($img.height())[0].scrollIntoView();
    };
    imgY.src=url;
});

$applyAd.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$applyAd.on("click", ".input-item input[type=file]", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$applyAd.on("input", ".amount input", function (e) {
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