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
            type: "post",
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

//showLoading($("#addProduct"));

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
    config = $.extend(config, def);
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

var $addProduct = $("#addProduct");
var imagesArray = [];
var loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

function createObjectURL(blob) {
    if(window.URL){
        return window.URL.createObjectURL(blob);
    } else if(window.webkitURL){
        return window.webkitURL.createObjectURL(blob);
    } else {
        return null;
    }
}

function createPreview(url){
    return $('<li class="imagesList"> ' +
        '<img src="'+url+'"> ' +
        '<i class="del"></i> ' +
        '</li>');
}

$addProduct.on("focus click", "#productImages", function(e) {
    var _this = $(this);
    if(imagesArray.length===4){
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        _this.trigger("blur");
        tipsAlert("The number of images can not exceed 4");
    }
});

$addProduct.on("change", "#productImages", function(e){
    var _this=$(this);
    var file=this.files[0];
    var url=createObjectURL(file);
    var $delegateTarget = $(e.delegateTarget);
    _this.val("");
    var type=file.type.toLowerCase();
    if (!(type==="image/jpg"||type==="image/gif"||type==="image/jpeg"||type==="image/png")){
        tipsAlert("Image format error, the image can only be JPG, GIF, JPEG, PNG format");
        return;
    }else if(file.size/1024>=5120){
        tipsAlert("File size should not be greater than 5M");
        return;
    }else if(imagesArray.length===4){
        tipsAlert("The number of images can not exceed 4");
        return;
    }
    var imgY=new Image();
    imgY.onload=function(){
        var preview = createPreview(url);
        imagesArray.push(file);
        var $imagesPreview = $delegateTarget.find(".imagesPreview");
        $imagesPreview.append(preview).height(168);
        if(imagesArray.length===1) $imagesPreview[0].scrollIntoView()
    };
    imgY.src=url;
});

$addProduct.on("click", ".imagesList .del", function () {
    var _this = $(this);
    var $imgslist = _this.parent();
    var i = $imgslist.index();
    imagesArray.splice(i, 1);
    if(imagesArray.length===0){
        $imgslist.parent().height(0);
    }
    $imgslist.remove();
});

var floatReg =  /^[0-9]+.?[0-9]*$/,
    intReg =  /^[0-9]+$/;

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

$addProduct.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $productName = _this.find(".productName"),
        $productPrice = _this.find(".productPrice"),
        $productStock = _this.find(".productStock"),
        $productImages = _this.find(".productImages");
    if (!this.productName.value) {
        addError($productName, "product name can't be empty!");
        return;
    }
    if (!floatReg.test(this.productPrice.value)) {
        addError($productPrice, "product price should be number!");
        return;
    }
    if (!intReg.test(this.productStock.value)) {
        addError($productStock, "product stock should be integer!");
        return;
    }
    var len = imagesArray.length;
    if(len===0) {
        addError($productImages, "product images can't be empty!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var formData = new FormData();
    for(var i=0; i<len; i++){
        formData.append("goodsPic[]",imagesArray[i]);
    }
    var loading = showLoading(_this);
    var $input=_this.find("input[name='detailPhotoList']");
    if($input.length==0) {
        $input = $("<input type='hidden' name='detailPhotoList'>");
        $input.appendTo(_this);
    }
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
            _this.data("fileNameList", url);
            $.ajax({
                method: "post",
                url: "/proxy/shop-owner/products/edit",
                dataType: "json",
                data: _this.serialize()
            }).done(function (result) {
                if (loading) loading.remove();
                _this.data("submit", false);
                var status = result.status;
                if(status == 200){
                    showSpinner("add product success");
                    imagesArray.length = 0;
                    _this[0].reset();
                    _this.find(".imagesPreview")
                        .html("")
                        .height(0);
                } else if(status == 300) {
                    location.href = loginUrl;
                } else if(status == 400) {
                    location.href = "apply.html";
                } else if(status == 500) {
                    addError($productName, "product name can't be the same!");
                } else {
                    tipsAlert("server error!");
                }
            }).fail(function (result) {
                /*_this[0].reset();
                _this.data("submit", false)
                    .find(".imagesPreview")
                    .html("")
                    .height(0);
                result = {
                    status: 200
                };*/
                if (loading) loading.remove();
                _this.data("submit", false);
                tipsAlert("server error");
            });
        } else if(result.status==300){
            location.href = loginUrl;
        } else {
            tipsAlert("upload file fail");
        }
    }).fail(function(result){
        if (loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("server error");
    });
});

$addProduct.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});
$addProduct.on("click", ".input-item input[type=file]", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$addProduct.on("input", ".productPrice input", function (e) {
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

$addProduct.on("input", ".productStock input", function (e) {
    var val = this.value;
    for(var i=val.length-1; i>=0; i--){
        var char = val.charAt(i);
        if(!(char>="0"&&char<="9")){
            val = val.substr(0, i)+val.substr(i+1);
        }
    }
    this.value = val;
});
