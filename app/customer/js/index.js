(function () {
    var $adStore = $("#adStore");
    var getStoreAd = $.ajax({
        type: "post",
        url: "",
        dataType: "json"
    });
    getStoreAd.done(function (data) {
        data = {
            ad: ["imgs/adshop01.jpg", "imgs/adshop02.jpg", "imgs/adshop03.jpg", "imgs/adshop04.jpg", "imgs/adshop05.jpg"]
        };
        var adImg = $adStore.find(".carousel li img");
        for(var i=adImg.length-1; i>=0; i--){
            adImg.eq(i).attr({src: data["ad"][i]});
        }
        $adStore = null;
    })
        .fail(function(data){
            console.log(data);
            setTimeout(function(){
                data = {
                    ad: ["imgs/adshop01.jpg", "imgs/adshop02.jpg", "imgs/adshop03.jpg", "imgs/adshop04.jpg", "imgs/adshop05.jpg"]
                };
                var adImg = $adStore.find(".carousel li img");
                for(var i=adImg.length-1; i>=0; i--){
                    adImg.eq(i).attr({src: data["ad"][i]});
                }
                $adStore = null;
            });
        });
    var $adGoods = $("#adGoods");
    var getGoodsAd = $.ajax({
        type: "post",
        url: "",
        dataType: "json"
    });
    getGoodsAd.done(function (data) {
        data = {
            ad: ["imgs/product01a.jpg", "imgs/product02a.jpg", "imgs/product03a.jpg", "imgs/product04a.jpg", "imgs/product05a.jpg",
                "imgs/product01a.jpg", "imgs/product02a.jpg", "imgs/product03a.jpg", "imgs/product04a.jpg", "imgs/product05a.jpg"]
        };
        var adImg = $adGoods.find(".item-image img");
        for(var i=adImg.length-1; i>=0; i--){
            adImg.eq(i).attr({src: data["ad"][i]});
        }
        $adGoods = null;
    })
        .fail(function(data){
            console.log(data);
            setTimeout(function(){
                data = {
                    ad: ["imgs/product01a.jpg", "imgs/product02a.jpg", "imgs/product03a.jpg", "imgs/product04a.jpg", "imgs/product05a.jpg",
                        "imgs/product01a.jpg", "imgs/product02a.jpg", "imgs/product03a.jpg", "imgs/product04a.jpg", "imgs/product05a.jpg"]
                };
                var adImg = $adGoods.find(".item-image img");
                for(var i=adImg.length-1; i>=0; i--){
                    adImg.eq(i).attr({src: data["ad"][i]});
                }
                $adGoods = null;
            });
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
$adStore.on("click", ".next", function () {
    var index = $adStore.find(".carousel .active").index();
    goAd(index + 1);
});
$adStore.on("click", ".prev", function () {
    var index = $adStore.find(".carousel .active").index();
    goAd(index - 1);
});
$adStore.on("click", ".spot li", function () {
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
