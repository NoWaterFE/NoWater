var $adStore = $("#adStore"),
    $adGoods = $("#adGoods");
// 首页广告请求
(function () {
    var getStoreAd = $.ajax({
        method: "get",
        url: "/proxy/customer/shop/ad",
        dataType: "json"
    });
    getStoreAd.done(function (result) {
        var status = result.status;
        if (status == 200) {
            var $carousel = $adStore.find(".carousel"),
                $spot = $adStore.find(".spot"),
                data = result.data,
                len = data.length,
                shopItem = createShopItem(data);
            if(shopItem) {
                $carousel.append(shopItem)
                    .css('width', len*100+"%");
                $spot.append(createSpot(len));
            } else {
                $adStore.hide();
            }
        } else if(status == 400) {
            $adStore.hide();
        }
    }).fail(function(result){
        tipsAlert("server error!");
        /*result = {
            status: 200,
            data: [
                {
                    shopId: 1,
                    adPhotoUrl: "imgs/adshop01.jpg"
                },
                {
                    shopId: 2,
                    adPhotoUrl: "imgs/adshop02.jpg"
                },
                {
                    shopId: 3,
                    adPhotoUrl: "imgs/adshop03.jpg"
                },
                {
                    shopId: 4,
                    adPhotoUrl: "imgs/adshop04.jpg"
                },
                {
                    shopId: 5,
                    adPhotoUrl: "imgs/adshop05.jpg"
                }
            ]
        };
        if (result.status == 200) {
            var $carousel = $adStore.find(".carousel"),
                $spot = $adStore.find(".spot"),
                data = result.data,
                len = data.length,
                shopItem = createShopItem(data);
            if(shopItem) {
                $carousel.append(shopItem)
                    .css('width', len*100+"%");
                $spot.append(createSpot(len));
            } else {
                $adStore.hide();
            }
        } else if(status == 400) {
            $adStore.hide();
        }
       */
    });
    $.ajax({
        method: "get",
        url: "/proxy/customer/product/ad",
        dataType: "json"
    }).done(function (result) {
        if(result.status==200){
            var len  = result.data.length;
            for(var i=0; i<len; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
        }
    }).fail(function (result) {
        tipsAlert("Server error!");
        /*result = {
            status: 200,
            data: [
                {
                    productId: 1,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998,
                    photoIdUrl: "imgs/product01a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 2,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product02a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 3,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product03a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 4,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product04a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 5,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product05a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 6,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product01a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 7,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product02a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 8,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product03a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 9,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product04a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                },
                {
                    productId: 10,
                    productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                    price: 998.00,
                    photoIdUrl: "imgs/product05a.jpg",
                    quantityStock: 11,
                    size: "1 PC"
                }
            ]
        };
        if (result.status == 200) {
            var len = result.data.length;
            for (var i = 0; i < len; i++) {
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
        }*/
    });
})();

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<a class="item-detail" href="productDetail.html?id='+data.productId+'"> ' +
            '<div class="item-image"> ' +
                '<img src="'+data.photoIdUrl+'"> ' +
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

function createShopItem(data) {
    var len = data.length;
    if(len == 0) return ;
    var shop = '<li class="active"><a href="store.html?shopId='+data[0].shopId+'"><img src="'+data[0].adPhotoUrl+'"></a></li>';
    for(var i=1; i<len; i++){
        shop += '<li class="active"><a href="store.html?shopId='+data[i].shopId+'"><img src="'+data[i].adPhotoUrl+'"></a></li>';
    }
    return $(shop);
}

function createSpot(len) {
    var spot = '<li class="active"></li>';
    for(var i=1; i<len; i++){
        spot += '<li></li>';
    }
    return $(spot);
}


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


var adTimer = null;
function goAd(index) {
    var ul = $adStore.find(".carousel"),
        spotUl = $adStore.find(".spot"),
        aLi = ul.find("li"),
        spotLi = spotUl.find("li"),
        len = aLi.length;
    index = (len + index) % len;
    var nLi = aLi.eq(index),
        nSpotLi = spotLi.eq(index);
    nLi.siblings()
        .removeClass("active")
        .end()
        .addClass("active");
    nSpotLi.siblings()
        .removeClass("active")
        .end()
        .addClass("active");
    var width = nLi.width();
    if (ul.is(":animated")) ul.stop(true);
    ul.animate({left: -index * width}, 500);
}
function setAdInterval() {
    adTimer = setInterval(function () {
        var index = $adStore.find(".carousel .active").index();
        goAd(index + 1);
    }, 1500);
}
setAdInterval();
$adStore.on("click", ".next", function (event) {
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $adStore.find(".carousel .active").index();
    goAd(index + 1);
});
$adStore.on("click", ".prev", function (event) {
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $adStore.find(".carousel .active").index();
    goAd(index - 1);
});
$adStore.on("click", ".spot li", function (event) {
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $(this).index();
    goAd(index);
});
$adStore.on("mouseover", function () {
    if (adTimer) clearInterval(adTimer);
});
$adStore.on("mouseout", function () {
    if (adTimer) clearInterval(adTimer);
    setAdInterval();
});

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);


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
$adGoods.on("click", ".goods-item .add-to-cart", addToCart);
// 添加到收藏
$adGoods.on("click", ".goods-item .add-to-favorites", addToFavo);


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