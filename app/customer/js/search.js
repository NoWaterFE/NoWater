var value = "Results for ",
    keyWord = GetQueryString("keyWord"),
    $noResult = $("#noResult"),
    $showMore = $("#showMore");
if (!keyWord) {
    $noResult.show();
}
var startId = 0;
var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

// header添加事件
(function () {
    //获取登录信息可能不需要
    $.ajax({
        method: "get",
        url: "/proxy/customer/isLogin",
        dataType: "json"
    }).done(function (result) {
        if(result.status==200){
            var userInfo = result.userInformation[0];
            var quickMenu = $("#quickMenu");
            quickMenu.find(".accountOperate").toggleClass("active");
            quickMenu.find(".my-cart .count").text(userInfo.cartNum);
        }
    }).fail(function (result) {
        /*console.log(result.statusText);
         result = {
         status: 200,
         userInformation: [{
         name: "gdh",
         cartNum: 33
         }]
         };
         if (result.status == 200) {
         var userInfo = result.userInformation[0];
         var quickMenu = $("#quickMenu");
         quickMenu.find(".accountOperate").toggleClass("active");
         quickMenu.find(".my-cart .count").text(userInfo.cartNum);
         }*/
    });

    //headMenu添加事件
    var $headMenu = $("#headMenu");
    var navTimer;
    $headMenu.on("mouseover", function () {
        if (navTimer) clearTimeout(navTimer);
        $(this).find(".menuList").show();
    });
    $headMenu.on("mouseout", function () {
        var _this = $(this);
        navTimer = setTimeout(function () {
            _this.find(".menuList").hide();
        }, 400);
    });
    $headMenu.on("click", ".menuList li", function () {
        var pt = $(this).data("pt");
        location.href = "search.html?pt=" + pt;
    });
    $headMenu = null;

    //header随浏览器滚动而滚动
    $(window).on("scroll", function(){
        var header = $("header"),
            _this = $(this);
        header.css("left", -_this.scrollLeft());
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
            url: "/proxy/customer/loginout",
        }).done(function(){
            delCookie("token");
            location.href = "index.html";
        }).fail(function () {
            delCookie("token");
            location.href = "index.html";
        });
    });

    var $searchForm = $("#searchForm");
    $searchForm.on("submit", function(e){
        e.preventDefault();
        var keyWord = this.keyWord.value;
        if(keyWord!=""){
            location.href = "search.html?keyWord="+ encodeURIComponent(keyWord);
        }
    });
    $searchForm.on("click", ".searchBtn", function(e){
        $searchForm.trigger("submit");
    });

    window.setCart = function(num){
        var cart = quickMenu.find(".my-cart .count");
        if(num > 99) {
            cart.text("99+");
        } else {
            cart.text(num);
        }
    }

})();

var $showMoreButton = $("#showMoreButton");
$showMoreButton.click(function(){
    $(this).addClass("hidden");
    getResult();
});
var getResult = (function () {
    var loading = null;
    return function () {
        if(loading) return;
        loading = showLoading($showMore);
        var $adGoods = $("#adGoods");
        var count = 30;
        var sendData = "keyWord=" + keyWord + "&count=" + count + "&startId=" + startId;
        var classId = GetQueryString("pt");
        if (classId) {
            sendData = "classId=" + classId + "&count=" + count +"&startId=" + startId;
            $.ajax({
                method: "get",
                url: "/proxy/customer/class/product",
                dataType: "json",
                data: sendData
            }).done(function (result) {
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                if(result.status==200){
                    startId = result.startId;
                    if (result.data.length == 0) {
                        $noResult.css('display','block');
                        return;
                    }
                    for(var i=0; i<result.data.length; i++){
                        var goodItem = createGoodsItem(result.data[i]);
                        $adGoods.append(goodItem);
                    }
                    if(startId != -1) {
                        $showMoreButton.removeClass("hidden");
                    }
                }
                $adGoods = null;
            }).fail(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                tipsAlert("Server error!");
                /*result = {
                 status: 200,
                 actualCount: 10,
                 data: [
                 {
                 productId: 1,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 isDel: false
                 },
                 {
                 productId: 2,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 isDel: false
                 },
                 {
                 productId: 3,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 4,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 5,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 6,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 7,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 8,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 9,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 10,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photo: ["imgs/product02a.jpg"],
                 is_del: false
                 }
                 ],
                 startId: 2
                 };
                 if(result.status==200){
                 startId = result.startId;
                 if (result.actualCount == 0) {
                 $noResult.css('display','block');
                 return;
                 }
                 for(var i=0; i<result.data.length; i++){
                 var goodItem = createGoodsItem(result.data[i]);
                 $adGoods.append(goodItem);
                 }
                 if(startId != -1) {
                 $showMoreButton.removeClass("hidden");
                 }
                 }*/
                $adGoods = null;
            });
        } else {
            $.ajax({
                method: "post",
                url: "/proxy/customer/product/search",
                dataType: "json",
                data: sendData
            }).done(function (result) {
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                if(result.status==200){
                    startId = result.startId;
                    if (result.data.length == 0) {
                        $noResult.css('display','block');
                        return;
                    }
                    for(var i=0; i<result.data.length; i++){
                        var goodItem = createGoodsItem(result.data[i]);
                        $adGoods.append(goodItem);
                    }
                    if(startId != -1) {
                        $showMoreButton.removeClass("hidden");
                    }
                }
                $adGoods = null;
            }).fail(function(result){
                if(loading) {
                    loading.remove();
                    loading = null;
                }
                tipsAlert("Server error");
                /*result = {
                 status: 200,
                 actualCount: 10,
                 data: [
                 {
                 productId: 1,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 2,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 3,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 4,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 5,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 6,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 7,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 8,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 9,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 },
                 {
                 productId: 10,
                 shopId: 1,
                 classId: 1,
                 productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                 price: 998.00,
                 quantityStock: 11,
                 photoUrl: ["imgs/product02a.jpg"],
                 is_del: false
                 }
                 ],
                 startId: 2
                 };
                 if(result.status==200){
                 startId = result.startId;
                 if (result.actualCount == 0) {
                 $noResult.css('display','block');
                 return;
                 }
                 for(var i=0; i<result.data.length; i++){
                 var goodItem = createGoodsItem(result.data[i]);
                 $adGoods.append(goodItem);
                 }
                 if(startId != -1) {
                 $showMoreButton.removeClass("hidden");
                 }
                 }*/
                $adGoods = null;
            });
        }
    }
})();

getResult();
setText();

function setText() {
    var pt = GetQueryString("pt");
    if (pt) {
        var productClass = getProductClass(pt);
        $("#tips").text(productClass);
    } else {
        $("#tips").text(value+"\'"+keyWord+"\'");
        $("#keyWord").val(keyWord);
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}

function getProductClass(pt) {
    switch (pt) {
        case "1":
            return "TV & Home Theater";
        case "2":
            return "Computers & Tablets";
        case "3":
            return "Cell Phones";
        case "4":
            return "Cameras & Camcorders";
        case "5":
            return "Audio";
        case "6":
            return "Car Electronics & GPS";
        case "7":
            return "Video, Games, Movies & Music";
        case "8":
            return "Health, Fitness & Sports";
        case "9":
            return "Home & Office";
    }
}

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<a class="item-detail" href="productDetail.html?id='+data.productId+'"> ' +
        '<div class="item-image"> ' +
        '<img src="'+data.photoUrl[0]+'"> ' +
        '</div> ' +
        '<div class="item-name"> ' +
        data.productName +
        '</div> ' +
        '</a> ' +
        '<div class="item-prices"> HK$' +
        data.price.toFixed(2) +
        '</div> ' +
        '<div class="item-operate"> ' +
        '<div class="add-to-cart"> ' +
        '<i></i><span>ADD TO CART</span> ' +
        '</div> ' +
        '<div class="add-to-favorites"> ' +
        '<i></i><span>ADD TO FAVORITES</span> ' +
        '</div> ' +
        '</div> ' +
        '</li>').data("productId", data.productId);
}

var addToCart = (function(){
    var loading = null;
    return function(e){
        var _this = $(this);
        if(loading) return;
        var $goods = _this.parents(".goods-item");
        loading = showLoading($goods);
        var data = "productId="+$goods.data("productId")+"&addType=0";
        $.ajax({
            method: "post",
            url: "/proxy/customer/cart/adding",
            data: data
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                setCart(result.userInformation[0].cartNum);
                showSpinner("Add successful")
            } else if(status==300){
                location.href = loginUrl;
            } else if (status==600){
                tipsAlert("Sorry, the stock of the product is not enough!");
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("server error!");
            /*result = {
             status: 200,
             num: 1000
             };
             var status = result.status;
             if(status==200){
             setCart(result.num);
             showSpinner("Add successful")
             } else if(status==300){
             location.href = loginUrl;
             } else {
             tipsAlert("server error!");
             }*/
        });
    };
})();

var addToFavo = (function(){
    var loading = null;
    return function(e){
        var _this = $(this);
        if(loading) return;
        var $goods = _this.parents(".goods-item");
        loading = showLoading($goods);
        var data = "id="+$goods.data("productId")+"&type=2";
        $.ajax({
            method: "post",
            url: "/proxy/customer/favorite/adding",
            data: data
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200 || status==400){
                showSpinner("Add successful");
            } else if(status==300){
                location.href = loginUrl;
            }else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            tipsAlert("server error!");
            if(loading) {
                loading.remove();
                loading = null;
            }
            /*result = {
             status: 200
             };
             var status = result.status;
             if (status == 200 || status == 400) {
             showSpinner("Add successful");
             } else if (status == 300) {
             location.href = loginUrl;
             } else {
             tipsAlert("server error!");
             }*/
        });
    };
})();

// 添加到购物车
$("#adGoods").on("click", ".goods-item .add-to-cart", addToCart);
// 添加到收藏
$("#adGoods").on("click", ".goods-item .add-to-favorites", addToFavo);

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
