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
    e.preventDefault();
    var $shopName = _this.find(".shopName"),
        $shopEmail = _this.find(".shopEmail"),
        $shopTel = _this.find(".shopTel"),
        //$alipay = _this.find(".alipay"),
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
    /*if (!this.alipay.value) {
        addError($alipay, "alipay can't be empty!");
        return;
    }*/

    var fileUrl = _this.data("fileNameList");
    if(this.idPhoto.files.length==0 && fileUrl==undefined) {
        addError($idPhoto, "please add your ID photo!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    var $input=_this.find("input[name='fileNameList']");
    if($input.length==0) {
        $input = $("<input type='hidden' name='fileNameList'>");
        $input.appendTo(_this);
    }
    if(fileUrl && _this.data("change") == "false"){
        if(!$input.val()) {
            var index = fileUrl.lastIndexOf("/");
            var fileNameList = fileUrl.substr(index+1);
            var arr = [];
            arr.push(fileNameList);
            $input.val(JSON.stringify(arr));
        }
        applyForShop(_this, loading);
    } else {
        var formData = new FormData();
        formData.append("goodsPic[]", this.idPhoto.files[0]);
        $.ajax({
            method: "post",
            url: "/proxy/picture/upload",
            dataType: "json",
            processData: false,
            contentType: false,
            data: formData
        }).done(function(result){
            if(result.status==200){
                var url = JSON.stringify(result.data);
                $input.val(url);
                _this.data("fileNameList", url)
                    .data("change", "false");
                applyForShop(_this, loading);
            } else if(result.status==300){
                location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
            } else {
                tipsAlert("upload file fail");
            }
        }).fail(function(result){
            if (loading) loading.remove();
            _this.data("submit", false);
            //tipsAlert("server error");
            result = {
                status: 200
            };
            if(result.status==200){
                $input.val(JSON.stringify(result.data));
                applyForShop(_this, loading);
            } else if(result.status==300){
                location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
            } else {
                tipsAlert("upload file fail");
            }
        });
    }
});

function applyForShop(_this, loading) {
    var $shopName = _this.find(".shopName"),
        $shopEmail = _this.find(".shopEmail"),
        $shopTel = _this.find(".shopTel");
    $.ajax({
        method: "post",
        url: "/proxy/shop-owner/apply",
        dataType: "json",
        data: _this.serialize()
    }).done(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
        var status = result.status;
        if (status == 200) {
            showSpinner("Successful, please go to verify your email first", {timeout: 3000});
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Please go to verify your email first.");
        } if (status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (status == 400) {
            addError($shopEmail, "error email!");
        } else if (status == 500) {
            addError($shopName, "shop name is occupied!");
        } else if (status == 900) {
            addError($shopTel, "error telephone!");
        } else if(status == 1000 || status == 1010 || status == 1020 || status == 1030 || status ==1040) {
            tipsAlert("server error");
        }
    }).fail(function () {
        if (loading) loading.remove();
        _this.data("submit", false);
        //tipsAlert("server error");
        /*result = {
            status: 200
        };
        var status = result.status;
        if (status == 200) {
            showSpinner("Successful, please go to verify your email first", {timeout: 3000});
            _this.find("input").addClass("disabled").attr("disabled", true);
            _this.find(".applying").text("Please go to verify your email first.");
        } if (status == 300) {
            location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
        } else if (status == 400) {
            addError($shopEmail, "error email!");
        } else if (status == 500) {
            addError($shopName, "shop name is occupied!");
        } else if (status == 900) {
            addError($shopTel, "error telephone!");
        } else if(status == 1000 || status == 1010 || status == 1020 || status == 1030 || status ==1040) {
            tipsAlert("server error");
        }*/
    });
}

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
        method: "post",
        url: "/proxy/customer/loginout"
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