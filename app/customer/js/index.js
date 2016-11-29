var host="http://123.206.100.98:16120";
(function () {
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
        result = {
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
        }
    });
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
            result = {
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
            $adStore = null;
        });

    var $adGoods = $("#adGoods");
    var getGoodsAd = $.ajax({
        type: "post",
        url: host+"/customer/product/ad",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json"
    });
    getGoodsAd.done(function (result) {
        if(result.status==200){
            var adLi = $adGoods.find(".goods-item");
            for(var i=result.data.length-1; i>=0; i--){
                var li = adLi.eq(i);
                li.data("goodsId", result.data[i].productId);
                li.find(".item-image img").attr("src", result.data[i].photoIdUrl);
                li.find(".item-name").text(result.data[i].productName);
                li.find(".item-size").text(result.data[i].size);
                li.find(".item-prices").text("HK$"+result.data[i].price);
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
                var adLi = $adGoods.find(".goods-item");
                for(var i=result.data.length-1; i>=0; i--){
                    var li = adLi.eq(i);
                    li.data("goodsId", result.data[i].productId);
                    li.find(".item-image img").attr("src", result.data[i].photoIdUrl);
                    li.find(".item-name").text(result.data[i].productName);
                    li.find(".item-size").text(result.data[i].size);
                    li.find(".item-prices").text("HK$"+result.data[i].price);
                }
            }
            $adGoods = null;
        });
})();

(function () {
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
    $headMenu = null;
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
