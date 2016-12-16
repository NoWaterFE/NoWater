var host="http://123.206.100.98:16120";
var value = "Products about ";
var data;
var shopId = GetQueryString("shopId");
var shopName = new Array(100);
shopName[1] = "Apple Store";
var className = new Array(10);
var startId = 0;

$("#showMoreButton").click(getClass);
$("#showMore").css('display','none');
$("#noResult").css('display','none');
if (!GetQueryString("shopId")) {
    location.href = "store.html?shopId="+ encodeURIComponent(1);
}
$("#shopId").text(shopName[shopId]);
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
        for (var i=0; i<result.data.length; i++) {
            className[i] = result.data[i].className;
            var menuList = '<li data-pt="' + result.data[i].classId +' ">' + result.data[i].className + '</li>';
            $("#menuList").append(menuList);
        }
    } else {
        $("#adGoods").css('display','none');
        $("#noResult").css('display','block');
    }
})
    .fail(function(result) {
        result = {
            status: 200,
            data: [
                    {
                        classId: 0,
                        className: "iPhone"
                    },
                    {
                        classId: 1,
                        className: "iPad"
                    },
                    {
                        classId: 2,
                        className: "iPod"
                    },
                    {
                        classId: 3,
                        className: "macBook"
                    },
                    {
                        classId: 4,
                        className: "Watch"
                    }
                ]
        };
        if(result.status!=400){
            for (var i=0; i<result.data.length; i++) {
                className[i] = result.data[i].className;
                var menuList = '<li data-pt="' + result.data[i].classId +' ">' + result.data[i].className + '</li>';
                $("#menuList").append(menuList);
            }
        } else {
            $("#adGoods").css('display','none');
            $("#noResult").css('display','block');
        }
    });
getClass();
setText();

(function () {
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
        var classId = $(this).data("pt");
        location.href = "store.html?shopId=" + encodeURIComponent(shopId) + "&classId=" + classId;
    });
    $storeMenu = null;
})();

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
        $("#tips").text(value+"\'"+className[valueFromInput]+"\'");
    } else {
        $("#tips").text("ALL PRODUCTS");
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}

function getClass() {
    var $adGoods = $("#adGoods");
    var classId = GetQueryString("classId");
    if (!shopId) { shopId = 0; }
    if (!classId) { classId = 0; }
    var count = 40;
    var sendData = "shopId=" + shopId + "&classId=" + classId + "&count=" + count +"&startId" + startId;

    $.ajax({
        type: "post",
        url: host+"/customer/shop/class/product",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200 || result.status==300){
            startId = result.startId;
            setText();
            if(startId != -1) {
                $("#showMore").css('display','block');
            } else {
                $("#showMore").css('display','none');
            }
            for(var i=0; i<result.data.length; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
        }
        if(result.status==500){
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").css('display','block');
            $("#storeHeader").css('display','none');
            $("#storeMenu").css('display','none');
            $("#adGoods").css('display','none');
            return;
        }
        if(result.status==600) {
            setText();
            $("#noResult").text("No class found,please try another class name.");
            $("#noResult").css('display','block');
            return;
        }
        $adGoods = null;
    })
        .fail(function(result){
        result = {
            status: 600,
            actualCount: 10,
            startId: 2,
            data: [
                    {
                        productId: 1,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 2,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 3,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 4,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 5,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 6,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 7,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 8,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 9,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 10,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        isDel: false
                    }
                ]
        };
        if(result.status==200 || result.status==300){
            startId = result.startId;
            setText();
            if(startId != -1) {
                $("#showMore").css('display','block');
            } else {
                $("#showMore").css('display','none');
            }
            for(var i=0; i<result.data.length; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
        }
        if(result.status==500){
            $("#noResult").text("No shop found,please try another shop name.");
            $("#noResult").css('display','block');
            $("#storeHeader").css('display','none');
            $("#storeMenu").css('display','none');
            $("#adGoods").css('display','none');
            return;
        }
        if(result.status==600) {
            setText();
            $("#noResult").text("No class found,please try another class name.");
            $("#noResult").css('display','block');
            return;
        }
        $adGoods = null;
    })
}

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<div class="item-detail"> ' +
        '<div class="item-image"> ' +
        '<img src="'+data.photoUrl[0]+'"> ' +
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