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
    quickMenu.find(".seller-center a").attr("href", "../customer/store.html?shopId="+userInfo.shopId);
})();


function showLoading($relative) {
    var $tips = $relative.find(".loadingImg");
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

var loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

var productClass = ["TV & Home Theater", "Computers & Tablets", "Cell Phones",
    "Cameras & Camcorders", "Audio", "Car Electronics & GPS",
    "Video, Games, Movies & Music", "Health, Fitness & Sports", "Home & Offic"];

function createProductList(info){
    var op = '<div class="operate"> ' +
        '<span class="del"></span>' +
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
        '<div class="date">' +
        info.updateTime +
        '</div> ' +
        '</td> ' +
        '<td> ' +
        op +
        '</td> ' +
        '</tr>').data("productId", info.productId);
}

var $productList = $("#productList");

var  postProductList = (function() {
    var loading = null;
    return function(){
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            type: "get",
            url: "/proxy/shop-owner/homepage",
            dataType: "json"
        }).done(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                var $tbody = $productList.find("tbody");
                for(var i=0; i<len; i++){
                    createProductList(data[i])
                        .appendTo($tbody);
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        }).fail(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("server error");
            /*result = {
                status: 200,
                data: [{
                    productId: 1234,
                    photo: ["imgs/1.jpg"],
                    productName: "INFRUITION CLASSIC WATER BOTTLE - GREEN",
                    classId: 6,
                    price: 99,
                    quantityStock: 798,
                    isDel: 0,
                    updateTime: "2016-12-31 10:47:48"
                }]
            };
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                var $tbody = $productList.find("tbody");
                for(var i=0; i<len; i++){
                    createProductList(data[i])
                        .appendTo($tbody);
                }
            } else if(status==300) {
                location.href = loginUrl;
            }*/
        });
    };
})();

postProductList();

$productList.on("click", ".del", (function () {
    var loading = null;
    return function(e){
        if(loading) return;
        var _this = $(this);
        tipsConfirm("Are you sure want to remove the product from homepage?", function(){
            loading = showLoading(_this.parent());
            var $productItem = _this.parents(".productItem"),
                productId = $productItem.data("productId");
            $.ajax({
                method: "post",
                url: "/proxy/shop-owner/homepage/product/deleting",
                dataType: "json",
                data: "productId="+productId
            }).done(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                var status = result.status;
                if(status == 200){
                    $productItem.remove();
                    showSpinner("Deleted")
                } else if(status == 300) {
                    location.href = loginUrl;
                } else {
                    showSpinner("Unknown error!");
                }
            }).fail(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                tipsAlert("Server error!");
                /*result = {
                    status: 200
                };
                var status = result.status;
                if(status == 200){
                    $productItem.remove();
                    showSpinner("Deleted")
                } else if(status == 300) {
                    location.href = loginUrl;
                } else {
                    showSpinner("Unknown error!");
                }*/
            });
        }, {
            "ok": "YES",
            "cancel": "NO"
        });
    }
})());