var host="http://123.206.100.98:16120";
var value = "Results for ";
var startId = -1;

$("#error").hide();
$("#noResult").hide();
$("#showMoreButton").click(showMore);

$(document).ready(function() {
    setText();
    $("#showMoreButton").hide();
    getResult(GetQueryString("keyWord"));
});

// header添加事件
(function () {
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

    var $searchForm = $("#searchForm");
    $searchForm.on("submit", function(e){
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var keyWord = this.keyWord.value;
        if(keyWord!=""){
            location.href = "search.html?keyWord="+ encodeURIComponent(keyWord);
        }
    });
    $searchForm.on("click", ".searchBtn", function(e){
        $searchForm.trigger("submit");
    });
})();

function getResult(keyWord,shopId) {
    var shopId = arguments[1] ? arguments[1] : null;
    var $adGoods = $("#adGoods");
    var count = 40;
    var sendData = "keyWord=" + keyWord + "&count=" + count;
    if (shopId) {
        sendData += "&shopId=" + shopId;
    }

    $.ajax({
        type: "post",
        url: host+"/customer/product/search",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200){
            startId = result.startId;
            if (result.actualCount == 0) {
                $("#noResult").show();
                $("#adGoods").hide();
                return;
            }
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(startId != -1) {
                $("#showMoreButton").show();
            }
        }
        if(result.status==300){
            $("#error").show();
            $("#adGoods").hide();
        }
        $adGoods = null;
    })
        .fail(function(result){
            result = {
                status: 200,
                actualCount: 10,
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
                ],
                startId: 2
            };
            if(result.status==200){
                startId = result.startId;
                if (result.actualCount == 0) {
                    $("#noResult").show();
                    $("#adGoods").hide();
                    return;
                }
                for(var i=0; i<result.actualCount; i++){
                    var goodItem = createGoodsItem(result.data[i]);
                    $adGoods.append(goodItem);
                }
                if(startId != -1) {
                    $("#showMoreButton").show();
                }
            }
            if(result.status==300){
                $("#error").show();
                $("#adGoods").hide();
            }
            $adGoods = null;
        });
}

function showMore() {
    var $adGoods = $("#adGoods");
    var keyWord = GetQueryString("keyWord");
    var shopId = GetQueryString("shopId");
    var count = 20;
    var sendData = "keyWord=" + keyWord + "&count=" + count +"&startId=" + startId;
    if (shopId) {
        sendData += "&shopId=" + shopId;
    }

    $.ajax({
        type: "post",
        url: host+"/customer/product/search",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200){
            startId = result.startId;
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(startId == -1) {
                $("#showMoreButton").hide();
            }
        }
        $adGoods = null;
    })
        .fail(function(result){
            result = {
                status: 200,
                actualCount: 10,
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
                ],
                startId: 2
            };
            if(result.status==200){
                startId = result.startId;
                for(var i=0; i<result.actualCount; i++){
                    var goodItem = createGoodsItem(result.data[i]);
                    $adGoods.append(goodItem);
                }
                if(startId == -1) {
                    $("#showMoreButton").hide();
                }
            }
            $adGoods = null;
        });
}

function setText() {
    var valueFromInput = GetQueryString("keyWord");
    $("#tips").text(value+"\'"+valueFromInput+"\'");
    $("#keyWord").val(valueFromInput);
}

//get parameter from URL
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}

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