var host="http://123.206.100.98:16120";
var value = "Products about ";
var data;
var shopId = GetQueryString("shopId");
var className = ["ALL", "TV & Home Theater", "Computers & Tablets", "Cell Phones",
    "Cameras & Camcorders", "Audio", "Car Electronics & GPS",
    "Video, Games, Movies & Music", "Health, Fitness & Sports", "Home & Offic"];
var startId = 0;

$("#showMoreButton").click(getResult);
if (!GetQueryString("shopId")) {
    location.href = "store.html?shopId="+ 1;
}
var sendShopId = "shopId=" + shopId;
$.ajax({
    method: "get",
    url: "/proxy/customer/shop/info",
    dataType: "json",
    data: sendShopId
}).done(function (result) {
    if(result.status==200){
        var data = result.data,
            classId = 0,
            menuList = "",
            $menuList = $("#menuList");
        $("#shopName").text(data.shopName);
        $("#detail").html("Telephone: " + data.telephone + "<br>" + "E-mail: " +data.email);
        for (var i=0; i<data.classList.length; i++) {
            classId = data.classList[i];
            menuList = '<li data-pt="' + classId +' ">' +className[classId] + '</li>';
            $menuList.append(menuList);
        }
    }
}).fail(function(result) {
    result = {
        status: 200,
        data: {
            shopId: 1,
            shopName: "Apple store",
            ownerId: 1,
            email: "apple@icloud.com",
            telephone: "123456",
            classList: [
                {
                    classId: 1,
                    className: "Video, Games, Movies & Music"
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
                },
                {
                    classId: 5,
                    className: "iPhone"
                }
            ]
        }

    };
    if(result.status==200){
        var data = result.data;
        $("#shopName").text(data.shopName);
        $("#detail").html("Telephone: " + data.telephone + "<br>" + "E-mail: " +data.email);
        for (var i=0; i<data.classList.length; i++) {
            var menuList = '<li data-pt="' + data.classList[i].classId +' ">' + data.classList[i].className + '</li>';
            $("#menuList").append(menuList);
        }
    }
});

function getResult(){
    if (!GetQueryString("keyWord")) {
        getClass();
    } else {
        search();
    }
}

getResult();

(function () {
    var $storeMenu = $("#menuBar");
    $storeMenu.on("click", ".menuList li", function () {
        var classId = $(this).data("pt");
        location.href = "store.html?shopId=" + encodeURIComponent(shopId) + "&classId=" + classId;
    });
    $storeMenu = null;
})();

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
            url: "/proxy/customer/loginout",
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
    var keyWord = $("#keyWordInStore").val();
    var e= window.event;
    if (e.keyCode == 13 && keyWord) {
        location.href = "store.html?shopId=" + encodeURIComponent(shopId) + "&keyWord=" + encodeURIComponent(keyWord);
    }
}

$("#searchInStore").click(function(e){
    var keyWord = $("#keyWordInStore").val();
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    if (keyWord) {
        location.href = "store.html?shopId=" + encodeURIComponent(shopId) + "&keyWord=" + encodeURIComponent(keyWord);
    }
});

function setText() {
    var valueFromInput = GetQueryString("classId");
    var keyWord = GetQueryString("keyWord");
    if (valueFromInput) {
        if(valueFromInput=="0"){
            $("#tips").text("ALL PRODUCTS");
        } else {
            $("#tips").text(className[valueFromInput]);
        }
    } else if (keyWord) {
        $("#tips").text(value+"\'"+keyWord+"\'");
        $("#keyWordInStore").val(keyWord);
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
    var $noResult = $("#noResult");
    var classId = GetQueryString("classId");
    if (!shopId) { shopId = 0; }
    if (!classId) { classId = 0; }
    var count = 40;
    var sendData = "shopId=" + shopId + "&classId=" + classId + "&count=" + count +"&startId=" + startId;

    $.ajax({
        method: "post",
        url: "/proxy/customer/class/product",
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
            $noResult.text("No shop found,please try another shop name.");
            $noResult.css('display','block');
            $("#storeHeader").css('display','none');
            $("#storeMenu").css('display','none');
            $("#adGoods").css('display','none');
            return;
        }
        if(result.status==600) {
            setText();
            $noResult.text("No class found,please try another class name.");
            $noResult.css('display','block');
            return;
        }
        $adGoods = null;
    })
        .fail(function(result){
            /*result = {
                status: 200,
                actualCount: 10,
                startId: 2,
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
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 4,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 5,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 6,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 7,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 8,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 9,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 10,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: 998.00,
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
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
                $noResult.text("No shop found,please try another shop name.");
                $noResult.css('display','block');
                $("#storeHeader").css('display','none');
                $("#storeMenu").css('display','none');
                $("#adGoods").css('display','none');
                return;
            }
            if(result.status==600) {
                setText();
                $noResult.text("No class found,please try another class name.");
                $noResult.css('display','block');
                return;
            }*/
            $adGoods = null;
        });
}

function search() {
    var keyWord = GetQueryString("keyWord");
    var $adGoods = $("#adGoods");
    var $noResult = $("#noResult");
    var count = 40;
    var sendData = "keyWord=" + keyWord + "&count=" + count + "&startId=" + startId + "&shopId=" + shopId;
    $.ajax({
        method: "get",
        url: "/proxy/customer/product/search",
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if (result.status == 200) {
            startId = result.startId;
            setText();
            if (result.data.length == 0) {
                $noResult.text("No product found,please try another key words.");
                $noResult.css('display','block');
                return;
            }

            for (var i = 0; i < result.data.length; i++) {
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }

            if (startId != -1) {
                $("#showMore").css('display','block');
            } else {
                $("#showMore").css('display','none');
            }
        }
        $adGoods = null;
    }).fail(function (result) {
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
        if (result.status == 200) {
            startId = result.startId;
            setText();
            if (result.actualCount == 0) {
                $noResult.text("No product found,please try another key words.");
                $noResult.css('display','block');
                return;
            }

            for (var i = 0; i < result.data.length; i++) {
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }

            if (startId != -1) {
                $("#showMore").css('display','block');
            } else {
                $("#showMore").css('display','none');
            }
        }*/
        $adGoods = null;
    });
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