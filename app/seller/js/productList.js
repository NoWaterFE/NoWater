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
            type: "post",
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

function createProductList(productInfo){
    var op = productInfo.state == 0 ?
    '<div class="operate"> ' +
        '<input type="button" value="modify" class="modify"> ' +
        '<input type="button" value="off" class="delete"> ' +
    '</div> ' :
    '<div class="off"> ' +
        'under the shelf' +
    '</div>';
    return $('<tr class="productItem"> ' +
        '<td> ' +
            '<div class="productId">' +
                productInfo.productId +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="productImg"> ' +
                '<img src="'+productInfo.productImg+'" > ' +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="productName">' +
                productInfo.productName +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="class">' +
                productInfo.class +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="price">HK$' +
                productInfo.price +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="stock">' +
                productInfo.stock +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            　op +
        '</td> ' +
        '</tr>');
}

var $productList = $("#productList");

var  postProductList = (function() {
    var searchKey = null,
        loading = null;
    return function(){
        var data = "count=20";
        if(searchKey!==null) data += "&searchKey="+searchKey;
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            type: "post",
            url: host + "/shop-owner/list",
            dataType: "json",
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: data
        }).done(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
        }).fail(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            //tipsAlert("server error");
            result = {
                productId: 1234,
                productImg: "imgs/1.jpg",
                productName: "INFRUITION CLASSIC WATER BOTTLE - GREEN",
                class: "Video, Games, Movies & Music",
                classIndex: 6,
                price: "99.00",
                stock: 798,
                state: 0
            };
            var result1 = {
                productId: 4321,
                productImg: "imgs/product01a.jpg",
                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                class: "Cameras & Camcorders",
                classIndex: 4,
                price: "59.00",
                stock: 699
            };
            for(var i=0; i<10; i++){
                if(i%2) createProductList(result).data("info", result).appendTo($productList.find("tbody"));
                else createProductList(result1).data("info", result1).appendTo($productList.find("tbody"));
            }
            $productList.find(".more .showMore").removeClass("hidden");
        });
    };
})();

postProductList();

$productList.on("click", ".modify", function (e) {
    var $productItem = $(this).parents(".productItem");
    var $modifyPop = $(".modifyPop"),
        $modifyProduct = $modifyPop.find(".modifyProduct"),
        info = $productItem.data("info");
    $modifyProduct[0].productName.value = info.productName;
    $modifyProduct[0].productCategories.options[info.classIndex-1].selected = true;
    $modifyProduct[0].productPrice.value = info.price;
    $modifyProduct[0].productStock.value = info.stock;
    $modifyProduct[0].productId.value = info.productId;
    $modifyPop.show();
});

$productList.on("click", ".delete", (function () {
    var loading = null;
    return function(e){
        if(loading) return;
        var _this = $(this);
        tipsConfirm("Are you sure to removed the product from shelves?", function(){
            loading = showLoading(_this.parent());
            $.ajax({
                type: "post",
                url: host + "/shop-owner/edit",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                data: ""
            }).done(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
            }).fail(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
            });
        });
    }
})());

$productList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postProductList();
});

function showLoading($relative) {
    var $tips = $relative.siblings(".loadingImg");
    if ($tips.length > 0) $tips.remove();
    $tips = $("<div class='loadingImg'></div>");
    if($relative.css("position")=="static") $relative.css('position', "relative");
    $tips.appendTo($relative)
        .ready(function () {
            $tips.css({
                "top": $relative.innerHeight() / 2,
                "left": $relative.innerWidth() / 2,
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

//修改商品
var $modifyProduct = $("#modifyProduct");
var imagesArray = [];

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
    return $('<li class="imagesList blob"> ' +
        '<img src="'+url+'"> ' +
        '<i class="del"></i> ' +
        '</li>');
}

$modifyProduct.on("focus click", "#productImages", function(e) {
    var _this = $(this),
        $delegateTarget = $(e.delegateTarget);
    if($delegateTarget.find(".imagesPreview .imagesList").length===4){
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        _this.trigger("blur");
        tipsAlert("The number of images can not exceed 4");
    }
});

$modifyProduct.on("change", "#productImages", function(e){
    var _this=$(this);
    var file=this.files[0];
    var url=createObjectURL(file);
    var $delegateTarget = $(e.delegateTarget);
    var $imagesPreview = $delegateTarget.find(".imagesPreview");
    var len = $imagesPreview.find(".imagesList").length;
    _this.val("");
    var type=file.type.toLowerCase();
    if (!(type==="image/jpg"||type==="image/gif"||type==="image/jpeg"||type==="image/png")){
        tipsAlert("Image format error, the image can only be JPG, GIF, JPEG, PNG format");
        return;
    }else if(file.size/1024>=5120){
        tipsAlert("File size should not be greater than 5M");
        return;
    }else if(len===4){
        tipsAlert("The number of images can not exceed 4");
        return;
    }
    var imgY=new Image();
    imgY.onload=function(){
        var preview = createPreview(url);
        imagesArray.push(file);
        $imagesPreview.append(preview).height(168);
        if(len===0) $imagesPreview[0].scrollIntoView()
    };
    imgY.src=url;
});

$modifyProduct.on("click", ".imagesList .del", function (e) {
    var _this = $(this);
    var $imgslist = _this.parent();
    if($imgslist.siblings(".imagesList").length===0){
        $imgslist.parent().height(0);
    }
    if($imgslist.hasClass("blob")){
        var i = $imgslist.parent().find(".blob").index($imgslist);
        imagesArray.splice(i, 1);
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

$modifyProduct.on("submit", function (e) {
    var _this = $(this);
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var $productName = _this.find(".productName"),
        $productCategories = _this.find(".productCategories"),
        $productPrice = _this.find(".productPrice"),
        $productStock = _this.find(".productStock"),
        $productImages = _this.find(".productImages"),
        $preview = _this.find(".imagesPreview");
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
    var len = $preview.find(".imagesList").length;
    if(len===0) {
        addError($productImages, "product images can't be empty!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var formData = new FormData();
    formData.append("productName", this.productName.value);
    formData.append("productCategories", this.productCategories.value);
    formData.append("productPrice", this.productPrice.value);
    formData.append("productStock", this.productStock.value);
    for(var i=0; i<len; i++){
        formData.append("photo[]",imagesArray[i]);
    }
    var loading = showLoading(_this);
    $.ajax({
        type: "post",
        url: host + "/shop-owner/edit",
        dataType: "json",
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formData
    }).done(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
    }).fail(function () {
        if (loading) loading.remove();
        _this.data("submit", false);
        //tipsAlert("server error");
    });
});

$modifyProduct.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$modifyProduct.on("click", ".input-item input[type=file]", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$modifyProduct.on("input", ".productPrice input", function (e) {
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

$modifyProduct.on("input", ".productStock input", function (e) {
    var val = this.value;
    for(var i=val.length-1; i>=0; i--){
        var char = val.charAt(i);
        if(!(char>="0"&&char<="9")){
            val = val.substr(0, i)+val.substr(i+1);
        }
    }
    this.value = val;
});

$modifyProduct.on("click", ".cancel", function (e) {
    var $delegateTarget = $(e.delegateTarget);
    $delegateTarget[0].reset();
    $delegateTarget.find(".imagesPreview")
        .html("")
        .height(0)
        .end()
        .parent()
        .hide();
});