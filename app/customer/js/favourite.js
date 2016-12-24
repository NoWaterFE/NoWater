var host="http://123.206.100.98:16120";
var startId = 0;
var favoriteType = GetQueryString("kind");
var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);
$("#showMoreButton").click(getResult);

if(!GetQueryString("kind")) {
    location.href = "favourite.html?kind="+ encodeURIComponent("0");
}

var $favMain = $("#favMain");
$favMain.on("click", ".favTab", function () {
    var _this = $(this);
    var i =_this.index();
    location.href = "favourite.html?kind="+i;
});
$favMain.find(".favTab").eq(favoriteType).addClass("active");
if (favoriteType == 1) {
    $("#adGoods").css('width','800px');
} else {
    $("#adGoods").css('width','1200px');
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

    window.setCart = function(num){
        var cart = quickMenu.find(".my-cart .count");
        if(num > 99) {
            cart.text("99+");
        } else {
            cart.text(num);
        }
    }
})();

function getResult() {
    var $adGoods = $("#adGoods");
    var $noResult = $("#noResult");
    var count = 30;
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
            location.href = "login.html";
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
                        productId: 3,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 4,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 5,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 6,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 7,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 8,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 9,
                        shopId: 1,
                        classId: 1,
                        productName: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photoUrl: ["imgs/product02a.jpg"],
                        isDel: false
                    },
                    {
                        productId: 10,
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
                location.href = "login.html";
            }
            $adGoods = null;
        });
}

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<a class="item-detail" href="productDetail.html?id='+data.productId+'"> ' +
        '<div class="item-image"> ' +
        '<img src="'+data.photoUrl+'"> ' +
        '</div> ' +
        '<div class="item-name"> ' +
        data.productName +
        '</div> ' +
        '</a> ' +
        '<div class="item-prices"> HK$' +
        data.price +
        '</div> ' +
        '<div class="item-operate"> ' +
        '<div class="add-to-cart"> ' +
        '<i></i><span>ADD TO CART</span> ' +
        '</div> ' +
        '<div class="remove"> ' +
        '<i></i><span>REMOVE</span> ' +
        '</div> ' +
        '</div> ' +
        '</li>').data("favoriteId", data.favoriteId);
}

function createShopItem(data) {
    return $('<li class="shop-item"> ' +
        '<a class="item-detail" href="store.html?shopId='+data.shopId+'"> ' +
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
        '</a> ' +
        '<div class="removeShop"> ' +
        '<button id="removeShop">REMOVE</button> ' +
        '</div> ' +
        '</li>').data("productId", data.favoriteId);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
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
                showSpinner("Add success")
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
            // result = {
            //  status: 200,
            //  num: 1000
            //  };
            //  var status = result.status;
            //  if(status==200){
            //  setCart(result.num);
            //  showSpinner("Add success")
            //  } else if(status==300){
            //  location.href = loginUrl;
            //  } else {
            //  tipsAlert("server error!");
            //  }
        });
    };
})();

var remove = (function(){
    var loading = null;
    return function(e){
        tipsConfirm("Sure to delete?", function () {
            var _this = $(this);
            if (loading) return;
            var $goods = _this.parents(".goods-item");
            loading = showLoading($goods);
            var data = "favoriteId=" + $goods.data("favoriteId");
            $.ajax({
                method: "post",
                url: "/proxy/customer/favorite/deleting",
                data: data
            }).done(function () {
                if (loading) {
                    loading.remove();
                    loading = null;
                }
                var status = result.status;
                if (status == 200) {
                    location.reload();
                } else if (status == 300) {
                    location.href = "login.html";
                } else {
                    tipsAlert("server error!");
                }
            }).fail(function (result) {
                if (loading) {
                    loading.remove();
                    loading = null;
                }
                //tipsAlert("server error");
                result = {
                    status: 200
                };
                var status = result.status;
                if (status == 200) {
                    location.reload();
                } else if (status == 300) {
                    location.href = "login.html";
                } else {
                    tipsAlert("server error!");
                }
            });
        });
    };
})();

$("#adGoods").on("click", ".goods-item .add-to-cart", addToCart);

$("#adGoods").on("click", ".goods-item .remove", remove);

$("#adGoods").on("click", ".shop-item .removeShop", remove);

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
    var $tips = $relative.siblings(".loadingImg");
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
