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
var $applyAd = $("#applyAd"),
    loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

//请求广告信息
$.ajax({
    method: "get",
    url: "/proxy/shop-owner/current/apply"
}).done(function (result){
    var status = result.status,
        data = result.data[0];
    if(status==200){
        if(!data) return;
        var photo = data.photo;
        $applyAd[0].price.value=data.price.toFixed(2);
        $applyAd.data("fileUrl", photo)
            .data("change", "false")
            .find(".imagesPreview")
            .height(200)
            .find("img")
            .attr("src", photo);
        if(result.allow==0) {
            $applyAd.find("input").addClass("disabled")
                .prop("disabled", true);
        }
    }
}).fail(function (result) {
    tipsAlert("Server error!");
    result = {
        "allow": 1,
        "status": 200,
        "startId": -1,
        "data": [
            {
                "orderId": 1,
                "time": "2016-12-25 09:52:34",
                "showTime": "2016-12-26",
                "shopId": 1,
                "price": 1500,
                "photo": "../customer/imgs/adshop02.jpg",
                "status": 2
            }
        ]
    };
    var status = result.status,
        data = result.data[0];
    if(status==200){
        if(!data) return;
        var photo = data.photo;
        $applyAd[0].price.value=data.price.toFixed(2);
        $applyAd.data("fileUrl", photo)
            .data("change", "false")
            .find(".imagesPreview")
            .height(200)
            .find("img")
            .attr("src", photo);
        if(result.allow==0) {
            $applyAd.find("input").addClass("disabled")
                .prop("disabled", true);
        }
    }
});

function applyAd(_this, loading, amount) {
    $.ajax({
        method: "post",
        url: "/proxy/shop-owner/shop/ad/apply",
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
            location.href = "pay.html?type=1&sumPrice="+amount+"&orderIdList="+JSON.stringify(arr);
        } else if(status==300){
            location.href = loginUrl;
        } else if(status==600) {
            tipsAlert("Fail, it has been exceeded the specified deadline today.");
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
            location.href = "pay.html?type=1&sumPrice="+amount+"&orderIdList="+JSON.stringify(arr);
        } else if(status==300){
            location.href = loginUrl;
        } else if(status==600) {
            tipsAlert("Fail, it has been exceeded the specified deadline today.");
        } else {
            tipsAlert("Server error!");
        }
    });
}

$applyAd.on("submit", function (e) {
    var _this = $(this);
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var $amount = _this.find(".amount"),
        $adImage = _this.find(".adImage"),
        amount = this.price.value;
    if (!amount) {
        addError($amount, "Bidding price can't be empty!");
        return;
    } else if(parseFloat(amount)<500) {
        addError($amount, "Bidding price can't be less than HK$500!");
        return;
    }
    var fileUrl = _this.data("fileUrl");
    if(this.adImage.files.length==0 && fileUrl==undefined) {
        addError($adImage, "please add your ID photo!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    var $input=_this.find("input[name='filename']");
    if($input.length==0) {
        $input = $("<input type='hidden' name='filename'>");
        $input.appendTo(_this);
    }
    if(fileUrl && _this.data("change") == "false") {
        if(!$input.val()) {
            var index = fileUrl.lastIndexOf("/");
            var filename = fileUrl.substr(index+1);
            $input.val(filename);
        }
        applyAd(_this, loading, amount);
    } else {
        var formData = new FormData();
        formData.append("goodsPic[]", this.adImage.files[0]);
        $.ajax({
            method: "post",
            url: "/proxy/picture/upload",
            dataType: "json",
            processData: false,
            contentType: false,
            data: formData
        }).done(function(result){
            if(result.status==200){
                var url = result.data[0];
                $input.val(url);
                _this.data("fileUrl", url)
                    .data("change", "false");
                applyAd(_this, loading, amount);
            } else if(result.status==300){
                location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
            } else {
                tipsAlert("upload file fail");
            }
        }).fail(function(result){
            if (loading) loading.remove();
            _this.data("submit", false);
            tipsAlert("server error");
            result = {
                status: 200,
                data: ["1"]
            };
            if(result.status==200){
                var url = result.data[0];
                $input.val(url);
                _this.data("fileUrl", url)
                    .data("change", "false");
                applyAd(_this, loading, amount);
            } else if(result.status==300){
                location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
            } else {
                tipsAlert("upload file fail");
            }
        });
    }
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
    $delegateTarget.data("change", "true");
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