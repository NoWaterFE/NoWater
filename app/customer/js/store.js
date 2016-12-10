var host="http://123.206.100.98:16120";
var value = "Products about ";
var data;
var shopId = $("#shopId").text();
var searchKey;
var nextStartId;

$("#showMoreButton").click(showMore);
$(document).ready(function() {
    setText();
    $("#showMore").hide();
    $("#noResult").hide();
    if (!GetQueryString("shopId")) {
        location.href = "store.html?shopId="+ encodeURIComponent(shopId);
    }
    $.ajax({
        type: "post",
        url: host+"/customer/shop/class/list",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: shopId
    }).done(function (result) {
        if(result.status!=400){
            for (var i=0; i<result.data.length-1; i++) {
                var menuList = '<li data-pt=" ' + result.data[i].classId +' ">' + result.data[i].className + '</li>';
                $("#menuList").append(menuList);
            }
        } else {
            $("#adGoods").hide();
            $("#noResult").show();
        }
    }).fail(function(result) {
        result = {
            status: 200,
            data: [
                    {
                        classId: 1,
                        className: "iPhone"
                    },
                    {
                        productId: 2,
                        className: "iPad"
                    },
                    {
                        productId: 3,
                        className: "iPod"
                    },
                    {
                        productId: 4,
                        className: "macBook"
                    },
                    {
                        productId: 5,
                        className: "Watch"
                    }
                ]
        };
        if(result.status!=400){
            for (var i=0; i<result.data.length-1; i++) {
                var menuList = '<li data-pt=" ' + result.data[i].classId +' ">' + result.data[i].className + '</li>';
                $("#menuList").append(menuList);
            }
        } else {
            $("#adGoods").hide();
            $("#noResult").show();
        }
    });
    if (GetQueryString("classId")) {
        getClass(GetQueryString("classId"));
    } else {
        //todo ajax for all product
    }
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

    //storeMenu
    var $storeMenu = $("#menuBar");
    var navTimer;
    $storeMenu.on("mouseover", function () {
        if (navTimer) clearTimeout(navTimer);
        $(this).find(".menuList").show();
    });
    $storeMenu.on("mouseout", function () {
        var _this = $(this);
        navTimer = setTimeout(function () {
            _this.find(".menuList").hide();
        }, 400);
    });
    $storeMenu.on("click", ".menuList li", function () {
        var classId = $(this).text();
        location.href = "store.html?shopId=" + encodeURIComponent(shopId) + "&classId=" + encodeURIComponent(classId);
    });
    $storeMenu = null;

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

function enter() {
    var e= window.event;
    if (e.keyCode == 13) {
        search(GetQueryString("shopId"));
    }
}

$("#searchInStore").click(function(e){
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    search(GetQueryString("shopId"));
});

function search(shopId) {
    var shopId = arguments[0] ? arguments[0] : null;
    var keyWord = $("#keyWordInStore").val();
    if(keyWord!=""){
        if (shopId) {
            location.href = "search.html?keyWord="+ encodeURIComponent(keyWord) +"&shopId=" +encodeURIComponent(shopId);
        } else {
            location.href = "search.html?keyWord="+ encodeURIComponent(keyWord);
        }
    }
}

function setText() {
    var valueFromInput = GetQueryString("classId");
    if (valueFromInput) {
        $("#tips").text(value+"\'"+valueFromInput+"\'");
    } else {
        $("#tips").text("ALL PRODUCTS");
    }
}

//get parameter from URL
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}

function getClass(classId) {
    var $adGoods = $("#adGoods");
    var count = 40;
    var sendData = "shopId=" + shopId + "&classId=" + classId + "&count=" + count;

    $.ajax({
        type: "post",
        url: host+"/customer/shop/class/product",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200 || result.status==300 || result.status==400){
            searchKey = result.searchKey;
            nextStartId = result.nextStartId;
            setText();
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(result.status!=400) {
                $("#showMore").show();
            }
        }
        if(result.status==500){
            $("#adGoods").hide();
            $("#noResult").text("No such goods in this store,please try another.");
            $("#noResult").show();
        }
        if(result.status==600) {
            $("#adGoods").hide();
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").show();
        }
        $adGoods = null;
    }).fail(function(result){
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
            nextStartId: 2,
            searchKey: "str"
        };
        if(result.status==200 || result.status==300 || result.status==400){
            searchKey = result.searchKey;
            nextStartId = result.nextStartId;
            setText();
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(result.status!=400) {
                $("#showMore").show();
            }
        }
        if(result.status==500){
            $("#adGoods").hide();
            $("#noResult").text("No such goods in this store,please try another.");
            $("#noResult").show();
        }
        if(result.status==600) {
            $("#adGoods").hide();
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").show();
        }
        $adGoods = null;
    });
}

function showMore() {
    var $adGoods = $("#adGoods");
    var count = 40;
    var sendData = "shopId=" + shopId + "&classId=" + GetQueryString("classId") + "&count=" + count +"&searchKey=" + searchKey +"&startId" + nextStartId;

    $.ajax({
        type: "post",
        url: host+"/customer/shop/class/product",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200 || result.status==300 || result.status==400){
            searchKey = result.searchKey;
            nextStartId = result.nextStartId;
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(result.status==400) {
                $("#showMore").hide();
            }
        }
        if(result.status==500){
            $("#adGoods").hide();
            $("#noResult").text("No such goods in this store,please try another.");
            $("#noResult").show();
        }
        if(result.status==600) {
            $("#adGoods").hide();
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").show();
        }
        $adGoods = null;
    }).fail(function(result){
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
            nextStartId: 2,
            searchKey: "str"
        };
        if(result.status==200 || result.status==300 || result.status==400){
            searchKey = result.searchKey;
            nextStartId = result.nextStartId;
            for(var i=0; i<result.actualCount; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(result.status==400) {
                $("#showMore").hide();
            }
        }
        if(result.status==500){
            $("#adGoods").hide();
            $("#noResult").text("No such goods in this store,please try another.");
            $("#noResult").show();
        }
        if(result.status==600) {
            $("#adGoods").hide();
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").show();
        }
        $adGoods = null;
    });
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