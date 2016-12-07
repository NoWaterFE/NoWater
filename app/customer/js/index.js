var host="http://123.206.100.98:16120";
// 首页广告请求
(function () {
    var $adStore = $("#adStore");
    var getStoreAd = $.ajax({
        type: "post",
        url: host+"/customer/shop/ad",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json"
    });
    getStoreAd.done(function (result) {
        if(result.status==200){
            var adLi = $adStore.find(".carousel li");
            for(var i=result.data.length-1; i>=0; i--){
                adLi.eq(i).data("shopId", result.data[i].shopId);
                adLi.eq(i).find("img").attr({src: result.data[i].adPhotoUrl});
            }
        }
        $adStore = null;
    })
        .fail(function(result){
            console.log(result.statusText);
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
            if(result.status==200){
                var adLi = $adStore.find(".carousel li");
                for(var i=result.data.length-1; i>=0; i--){
                    adLi.eq(i).data("shopId", result.data[i].shopId);
                    adLi.eq(i).find("img").attr({src: result.data[i].adPhotoUrl});
                }
            }
            $adStore = null;*/
        });

    var $adGoods = $("#adGoods");
    $.ajax({
        type: "post",
        url: host+"/customer/product/ad",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json"
    }).done(function (result) {
        if(result.status==200){
            for(var i=result.data.length-1; i>=0; i--){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
        }
        $adGoods = null;
    })
        .fail(function(result){
            result = {
                status: 200,
                data: [
                    {
                        productId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product01a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 2,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product02a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 3,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product03a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 4,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product04a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 5,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product05a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 6,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product01a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 7,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product02a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 8,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product03a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 9,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product04a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    },
                    {
                        productId: 10,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        photoIdUrl: "imgs/product05a.jpg",
                        quantityStock: 11,
                        size: "1 PC"
                    }
                ]
            };
            if(result.status==200){
                for(var i=result.data.length-1; i>=0; i--){
                    var goodItem = createGoodsItem(result.data[i]);
                    $adGoods.append(goodItem);
                }
            }
            $adGoods = null;
        });
})();

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<div class="item-detail"> ' +
            '<div class="item-image"> ' +
                '<img src="'+data.photoIdUrl+'"> ' +
            '</div> ' +
            '<div class="item-name"> ' +
                data.productName +
            '</div> ' +
        '</div> ' +
        '<div class="item-prices"> HK$' +
            data.price +
        '</div> ' +
        '<div class="item-operate"> ' +
            '<div class="add-to-cart"> ' +
                '<i></i><span>ADD TO CART</span> ' +
            '</div> ' +
            '<div class="add-to-favorites"> ' +
            '<i></i><span>ADD TO FAVORITES</span> ' +
            '</div> ' +
        '</div> ' +
        '</li>').data("goodId", data.productId);
}


// header添加事件
(function () {
    //获取登录信息
    $.ajax({
        type: "post",
        url: host+"/customer/isLogin",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json"
    }).done(function (result) {
        if(result.status==200){
            var userInfo = result.userInformation[0];
            var quickMenu = $("#quickMenu");
            quickMenu.find(".accountOperate").toggleClass("active");
            quickMenu.find(".my-cart .count").text(userInfo.cartNum);
        }
    }).fail(function (result) {
        console.log(result.statusText);
        /*result = {
         status: 200,
         userInformation: [{
         name: "gdh",
         cartNum: 33
         }]
         };
         if(result.status==200){
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
            type: "post",
            url: host+"/customer/loginout",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(){
            delCookie("token");
            location.reload();
        }).fail(function () {
            delCookie("token");
            location.reload();
        });
    });
})();


var $adStore = $("#adStore"),
    adTimer = null;
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
    event = window.event || event;
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $adStore.find(".carousel .active").index();
    goAd(index + 1);
});
$adStore.on("click", ".prev", function (event) {
    event = window.event || event;
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $adStore.find(".carousel .active").index();
    goAd(index - 1);
});
$adStore.on("click", ".spot li", function (event) {
    event = window.event || event;
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var index = $(this).index();
    goAd(index);
});
$adStore.on("click", ".carousel li", function (event) {
    event = window.event || event;
    if(event && event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    var id = $(this).data("shopId");
    location.href="store.html?shopId="+id;
});
$adStore.on("mouseover", function () {
    if (adTimer) clearInterval(adTimer);
});
$adStore.on("mouseout", function () {
    if (adTimer) clearInterval(adTimer);
    setAdInterval();
});

var $adGoods = $("#adGoods");
$adGoods.on("click", ".goods-item .item-detail", function(event){
    location.href="goodsDetail.html?goodsId="+$(this).parent().data("goodsId");
});
// 添加到购物车
$adGoods.on("click", ".goods-item .add-to-cart", function (event) {

});
// 添加到收藏
$adGoods.on("click", ".goods-item .add-to-favorites", function (event) {

});


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