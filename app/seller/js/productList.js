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
            method: "get",
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

var loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

var productClass = ["TV & Home Theater", "Computers & Tablets", "Cell Phones",
    "Cameras & Camcorders", "Audio", "Car Electronics & GPS",
    "Video, Games, Movies & Music", "Health, Fitness & Sports", "Home & Offic"];

function createProductList(info){
    var op = info.isDel == 0 ?
    '<div class="operate"> ' +
        '<input type="button" value="Bidding ad" class="bid"> ' +
        '<input type="button" value="Modify" class="modify"> ' +
        '<input type="button" value="Off" class="delete"> ' +
    '</div> ' :
    '<div class="off"> ' +
        'off the shelf' +
    '</div>';
    return $('<tr class="productItem"> ' +
        '<td> ' +
            '<div class="productId">' +
                info.productId +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="productImg"> ' +
                '<img src="'+info.photo[0]+'" > ' +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="productName">' +
                info.productName +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="class">' +
                productClass[info.classId-1] +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="price">' +
                info.price.toFixed(2) +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            '<div class="stock">' +
                info.quantityStock +
            '</div> ' +
        '</td> ' +
        '<td> ' +
            　op +
        '</td> ' +
        '</tr>').data("info", info);
}

var $productList = $("#productList");

var  postProductList = (function() {
    var loading = null,
        startId = null;
    return function(){
        var reqData = "count=10";
        if(startId) reqData +="&startId="+startId;
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            type: "get",
            url: "/proxy/shop-owner/products/list",
            dataType: "json",
            data: reqData
        }).done(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                startId = result.endId;
                var $tbody = $productList.find("tbody");
                for(var i=0; i<len; i++){
                    createProductList(data[i])
                        .appendTo($tbody);
                }
                if(startId!=-1){
                    $productList.find(".more .showMore").removeClass("hidden");
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        }).fail(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            //tipsAlert("server error");
            result = {
                productId: 1234,
                photo: ["imgs/1.jpg"],
                productName: "INFRUITION CLASSIC WATER BOTTLE - GREEN",
                class: "Video, Games, Movies & Music",
                classId: 6,
                price: 99,
                quantityStock: 798,
                isDel: 0
            };
            for(var i=0; i<10; i++){
                createProductList(result).data("info", result).appendTo($productList.find("tbody"));
            }
            $productList.find(".more .showMore").removeClass("hidden");
        });
    };
})();

postProductList();

function createBid(productId) {
    var $bid = $('<div class="bidPop">' +
        '<div class="shadow"></div>' +
            '<form class="bidForm" id="bidForm" novalidate>' +
            '<input type="hidden" name="productId" class="productId" value="'+productId+'">' +
            '<i class="cancel close"></i>' +
            '<h2 class="title">Bidding for tomorrow\'s product ad slot</h2>' +
            '<div class="input-item price">' +
                '<label for="price" class="redStar">Bid Price(HK$): </label>' +
                '<input type="text" name="price" id="price"  placeholder="At least 1000" maxlength="10">' +
                '<span class="tips"></span>' +
                '</div>' +
            '<div class="submit">' +
                '<input type="submit" value="CONFIRM">' +
                '<input type="button" value="CANCEL" class="cancel">' +
            '</div>' +
        '</form>' +
        '</div>');

    var $bidForm = $bid.find(".bidForm");

    $bidForm.on("input", ".input-item input", function () {
        var _this = $(this);
        _this.parent().removeClass('error');
    });

    $bidForm.on("input", ".price input", function (e) {
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

    $bidForm.on("click", ".cancel", function (e) {
        var $delegateTarget = $(e.delegateTarget);
        $delegateTarget[0].reset();
        $delegateTarget.parent()
            .hide();
    });

    $bidForm.on("submit", function (e) {
        var _this = $(this);
        e.preventDefault();
        var $price = _this.find(".price"),
            price = this.price.value;
        if (!price) {
            addError($price, "Bidding price can't be empty!");
            return;
        } else if (parseFloat(price) < 500) {
            addError($price, "Bidding price can't be less than HK$500!");
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
                location.href = "pay.html?type=2&sumPrice="+price+"&orderIdList="+JSON.stringify(arr);
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==600) {
                tipsAlert("Fail, it has been exceeded the specified deadline today.");
            } else {
                tipsAlert("Server error!");
            }
        });

    });

    return $bid;
}

$productList.on("click", ".modify", function (e) {
    var $productItem = $(this).parents(".productItem");
    var $modifyPop = $(".modifyPop"),
        $modifyProduct = $modifyPop.find(".modifyProduct"),
        info = $productItem.data("info");
    $modifyProduct[0].productName.value = info.productName;
    $modifyProduct[0].classId.options[info.classId-1].selected = true;
    $modifyProduct[0].price.value = info.price;
    $modifyProduct[0].quantityStock.value = info.quantityStock;
    $modifyProduct[0].productId.value = info.productId;
    var len = info.photo.length,
        $imagesPreview = $modifyProduct.find(".imagesPreview");
    for(var i=0; i<len; i++){
        $imagesPreview.append(createPreview(info.photo[i], false));
    }
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
                method: "post",
                url: "/proxy/shop-owner/products/edit",
                dataType: "json",
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

$productList.on("click", ".bid", function (e) {
    var $productItem = $(this).parents(".productItem"),
        info = $productItem.data("info"),
        productId = info.productId,
        $bidPop = $(".bidPop");
    if($bidPop.length==0) {
        createBid(productId).appendTo($("body"));
    } else {
        $bidPop.show()
            .find(".productId").val(productId);
    }
});

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

function createPreview(url, blob){
    var fileName = null;
    if(!blob) {
        var index = url.lastIndexOf("/");
        fileName = url.substr(index+1);
    }
    var cl = blob ? "blob" : "url";
    return $('<li class="imagesList"> ' +
        '<img src="'+url+'"> ' +
        '<i class="del"></i> ' +
        '</li>').addClass(cl).data("fileName", fileName);
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
        var preview = createPreview(url, true);
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

function modifyProduct(_this, loading){
    var $productName = _this.find(".productName");
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
            showSpinner("modify success", {
                callback: function(){
                    location.reload();
                }
            });
        } else if(status == 300) {
            location.href = loginUrl;
        } else if(status == 400) {
            location.href = "apply.html";
        } else if(status == 500) {
            addError($productName, "product name can't be the same!");
        } else {
            tipsAlert("server error!");
        }
    }).fail(function () {
        if (loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("server error");
    });
}

function getDetailPhotoList(_this) {
    var $imagesList = _this.find(".imagesList.url"),
        arr = [],
        len = $imagesList.length;
    for(var i=0; i<len; i++){
        arr.push($imagesList.eq(i).data("fileName"));
    }
    return arr;
}

$modifyProduct.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $productName = _this.find(".productName"),
        $productPrice = _this.find(".productPrice"),
        $productStock = _this.find(".productStock"),
        $productImages = _this.find(".productImages"),
        $preview = _this.find(".imagesPreview");
    if (!this.productName.value) {
        addError($productName, "product name can't be empty!");
        return;
    }
    if (!floatReg.test(this.price.value)) {
        addError($productPrice, "product price should be number!");
        return;
    }
    if (!intReg.test(this.quantityStock.value)) {
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
    var loading = showLoading(_this);
    if(imagesArray.length==0){
        _this[0].detailPhotoList.value = JSON.stringify(getDetailPhotoList(_this));
        modifyProduct(_this, loading);
    } else {
        var formData = new FormData();
        for(var i=0; i<len; i++){
            formData.append("goodsPic[]",imagesArray[i]);
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
                var detailPhotoList = getDetailPhotoList(_this);
                detailPhotoList = detailPhotoList.concat(result.data);
                _this[0].detailPhotoList.value = JSON.stringify(detailPhotoList);
                modifyProduct(_this, loading);
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
    }
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
        .end()
        .parent()
        .hide();
});