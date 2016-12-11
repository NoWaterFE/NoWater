var host = "http://123.206.100.98:16120";
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i,
    telReg = /^\d{8}$/;

//header随浏览器滚动而滚动
$(window).on("scroll", function(){
    var header = $("header"),
        _this = $(this);
    header.css("left", -_this.scrollLeft());
});

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
var $applyForm = $("#applyForm");
$applyForm.on("submit", function (e) {
    var _this = $(this);
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var $shopName = _this.find(".shopName"),
        $shopEmail = _this.find(".shopEmail"),
        $shopTel = _this.find(".shopTel"),
        $idPhoto = _this.find(".idPhoto");
    if (!this.shopName.value) {
        addError($shopName, "shop name can't be empty!");
        return;
    }
    if (!emailReg.test(this.email.value)) {
        addError($shopEmail, "error email!");
        return;
    }
    if (!telReg.test(this.telephone.value)) {
        addError($shopTel, "error telephone!");
        return;
    }
    if(this.idPhoto.files.length==0) {
        addError($idPhoto, "please add your ID photo!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    var formData = new FormData();
    formData.append("idPhoto", this.idPhoto.files[0]);
    $.ajax({
        method: "post",
        url: host + "/shop-owner/apply",
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

$applyForm.on("change", "#idPhoto", function(e){
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
        $img.ready(function(){
            $imagesPreview.height($img.height());
        });
        $img.attr("src", url);
        imgAuto($img);
        $imagesPreview[0].scrollIntoView();
    };
    imgY.src=url;
});

function imgAuto($img) {
    var imgW=$img[0].naturalWidth;
    var imgH=$img[0].naturalHeight;
    var constW=$img.parent().width();
    if(imgH>=imgW){
        $img.css({
            "width": "auto",
            "height": constW
        });
    } else {
        $img.css({
            "width": constW,
            "height": "auto"
        });
    }
}

$applyForm.on("input", ".input-item input", function () {
   var _this = $(this);
   _this.parent().removeClass('error');
});
$applyForm.on("click", ".input-item input[type=file]", function () {
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
                "top": $relative.offset().top + $relative.outerHeight() / 2,
                "left": $relative.offset().left + $relative.outerWidth() / 2,
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