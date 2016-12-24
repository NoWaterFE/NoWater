var host="http://123.206.100.98:16120";
var startId = 0;
var favoriteType = 0;
$("#showMoreButton").click(getResult);
$("#goods").click(showGoods);
$("#shop").click(showShop);

if(!GetQueryString("kind")) {
    location.href = "favourite.html?kind="+ encodeURIComponent("goods");
}

if(GetQueryString("kind") == "goods") {
    $("#goods").css("background","darkblue");
}else {
    $("#shop").css("background","darkblue");
    favoriteType = 1;
}
getResult();

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
            method: "post",
            url: "/proxy/customer/loginout"
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

function getResult() {
    var $adGoods = $("#adGoods");
    var $noResult = $("#noResult");
    var count = 40;
    var sendData = "favoriteType=" + favoriteType + "&count=" + count + "&startId=" + startId;
    $.ajax({
        method: "get",
        url: "/proxy/customer/favorite/list",
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if (result.status == 200) {
            startId = result.startId;
            if (favoriteType == 0) {
                if (result.data.length == 0) {
                    $noResult.text("You haven't collected one goods yet.")
                    $noResult.css('display', 'block');
                    return;
                }
                for (var i = 0; i < result.data.length; i++) {
                    var goodItem = createGoodsItem(result.data[i]);
                    $adGoods.append(goodItem);
                }
            } else {
                if (result.data.length == 0) {
                    $noResult.text("You haven't collected one shop yet.");
                    $noResult.css('display', 'block');
                    return;
                }
                for (var i = 0; i < result.data.length; i++) {
                    var shopItem = createShopItem(result.data[i]);
                    $adGoods.append(shopItem);
                }
            }
            if (startId != -1) {
                $("#showMore").css('display', 'block');
            } else {
                $("#showMore").css('display', 'none');
            }
        } else if (result.status == 300) {
            $noResult.html("<p>Please login first!&nbsp;<a href='login.html'>click here</a>&nbsp;to login.</p>");
            $noResult.css('display', 'block');
            return;
        }
        $adGoods = null;
    })
        .fail(function (result) {
            result = {
                status: 200,
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
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 3,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 4,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 5,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 6,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 7,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 8,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 9,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        product_id: 10,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    }
                ],
                startId: 2
            };
            if (result.status == 200) {
                startId = result.startId;
                if (favoriteType == 0) {
                    if (result.data.length == 0) {
                        $noResult.text("You haven't collected one goods yet.")
                        $noResult.css('display', 'block');
                        return;
                    }
                    for (var i = 0; i < result.data.length; i++) {
                        var goodItem = createGoodsItem(result.data[i]);
                        $adGoods.append(goodItem);
                    }
                } else {
                    result.data = [
                        {
                            shopId: 1,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 2,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 3,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 4,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 5,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 6,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 7,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 8,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 9,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        },
                        {
                            shopId: 10,
                            shopName: "Apple store",
                            ownerId: 1,
                            email: "apple@icloud.com",
                            telephone: 123456,
                            status: 1
                        }
                    ];
                    if (result.data.length == 0) {
                        $noResult.text("You haven't collected one shop yet.");
                        $noResult.css('display', 'block');
                        return;
                    }
                    for (var i = 0; i < result.data.length; i++) {
                        var shopItem = createShopItem(result.data[i]);
                        $adGoods.append(shopItem);
                    }
                }
                if (startId != -1) {
                    $("#showMore").css('display', 'block');
                } else {
                    $("#showMore").css('display', 'none');
                }
            } else if (result.status == 300) {
                $noResult.html("<p>Please login first!&nbsp;<a href='login.html'>click here</a>&nbsp;to login.</p>");
                $noResult.css('display', 'block');
                return;
            }
            $adGoods = null;
        });
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
        '</li>').data("goodId", data.productId);
}

function createShopItem(data) {
    return $('<li class="shop-item"> ' +
        '<div class="shop-name"> ' +
        data.shopName +
        '</div> ' +
        '<div class="detail"> ' +
        '<div class="email"> ' +
        'E-mail: ' +
        data.email +
        '</div> ' +
        '<div class="tel"> ' +
        'Telephone: ' +
        data.telephone +
        '</div> ' +
        '</div> ' +
        '</li>').data("shopId", data.shopId);
}

function showGoods() {
    location.href = "favourite.html?kind="+ encodeURIComponent("goods");
}

function showShop() {
    location.href = "favourite.html?kind="+ encodeURIComponent("shop");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}