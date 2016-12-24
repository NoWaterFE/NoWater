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
            setCart(userInfo.cartNum);
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
            method: "post",
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

    window.setCart = function(num){
        var cart = quickMenu.find(".my-cart .count"),
            $count = $(".cartMain").find(".count");
        if(num > 99) {
            cart.text("99+");
            $count.text("99+");
        } else {
            cart.text(num);
            $count.text(num);

        }
    }

})();


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

var $cartList = $("#cartList");
var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var postCart = (function(){
    var loading = null,
        startId = 0;
    return function () {
        if(loading) return ;
        loading = showLoading($(".more"));
        var reqData = "count=10&startId="+startId;
        $.ajax({
            method: "get",
            url: "/proxy/customer/cart/list",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if (status == 200) {
                var data = result.data,
                    len = data.length,
                    $cartTable = $cartList.find('.cartTable');
                startId = result.startId;
                for (var i = 0; i < len; i++) {
                    $cartTable.append(createCartItem(data[i]));
                }
                if (startId != -1) {
                    $cartList.find(".showMore").removeClass("hidden");
                }
                setTimeout(function(){
                    $(window).trigger("scroll");
                });
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            //tipsAlert("server error!");
            result = {
                status: 200,
                startId: -1,
                data: [
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 0,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 2,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 90,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    },
                    {
                        cartId: 11,
                        targetId: 12,
                        num: 4,
                        startId: 2,
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            quantityStock: 22,
                            price: 333,
                            shop: {
                                shopId: 1,
                                shopName: "Tom's shop"
                            }
                        }
                    }
                ]
            };
            var status = result.status;
            if (status == 200) {
                var data = result.data,
                    len = data.length,
                    $cartTable = $cartList.find('.cartTable');
                startId = result.startId;
                for (var i = 0; i < len; i++) {
                    $cartTable.append(createCartItem(data[i]));
                }
                if (startId != -1) {
                    $cartList.find(".showMore").removeClass("hidden");
                }
                setTimeout(function(){
                    $(window).trigger("scroll");
                });
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        });
    };
})();

function　createCartItem(data){
    var product = data.product,
        shop = product.shop,
        stock = product.quantityStock,
        num = data.num,
        price = product.price,
        sumPrice = num * price;
    var cartData = '<tr class="cartData"> ' +
        '<td class="select"><input type="checkbox"></td> ' +
        '<td class="product"> ' +
        '<a href="productDetail.html?id='+product.productId+'" target="_blank" class="clearfix productLink"> ' +
        '<img src="'+product.photo[0]+'"> ' +
        '<span class="productName">'+product.productName+'</span> ' +
        '</a> ' +
        '</td> ' +
        '<td class="price">HK$'+price.toFixed(2)+'</td> ' +
        '<td class="amount">' +
        '<div class="quantityOp clearfix"> ' +
        '<span class="minus"></span> ' +
        '<input type="text" name="num" value="'+num+'" class="num"> ' +
        '<span class="plus"></span> <br>' +
        '<span class="stockText">Pieces <span class="stockSpan">'+stock+'</span> available</span> ' +
        '<input type="hidden" name="stock" class="stock" value="'+stock+'"> ' +
        '</div>' +
        '</td> ' +
        '<td class="totalPrice">' +
        'HK$'+sumPrice.toFixed(2) +
        '</td>' +
        '<td class="operate">' +
        '<span class="del"></span>' +
        '</td> ' +
        '</tr> ';
    var $cartItem = $('<tbody class="cartItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="cartHeader"> ' +
        '<td colspan="6"> ' +
        '<span class="shopName"> SHOP: ' +
        '<a href="store.html?shopId='+data.targetId+'" target="_blank">'+shop.shopName+'</a> ' +
        '</span> ' +
        '</td> ' +
        '</tr> ' +
        cartData +
        '</tbody>').data("info", data);
    var $num = $cartItem.find(".num");
    checkState($num, true);
    return $cartItem;
}

$cartList.on("input", ".cartItem .quantityOp .num", function (e) {
    var val = this.value;
    var _this = $(this);
    for(var i=val.length-1; i>=0; i--){
        var char = val.charAt(i);
        if(!(char>="0"&&char<="9")){
            val = val.substr(0, i)+val.substr(i+1);
        }
    }
    val = val.replace(/^0$/, function () {
        return "1";
    });
    this.value = val;
    checkState(_this);
});

function checkState($num, first){
    var $cartItem = $num.parents(".cartItem"),
        $minus = $num.siblings(".minus"),
        num = parseInt($num.val()),
        $plus = $num.siblings(".plus"),
        $stock = $num.siblings(".stock"),
        stock = parseInt($stock.val()),
        oldVal = $num.data("oldVal"),
        val = $num.data("val"),
        info = $cartItem.data("info"),
        product = info.product,
        price = parseInt(product.price);
    if(stock==0) {
        $cartItem.find("input").attr("disabled", true).end()
            .find(".minus").addClass("disabled").end()
            .find(".plus").addClass("disabled");
        return ;
    }
    if(!oldVal) oldVal = num;
    if(!val) {
        val = num;
        $num.data("val", val);
    }
    oldVal = parseInt(oldVal);
    if(isNaN(num)) return;
    if(num>=stock){
        $plus.addClass("disabled");
        if(!first) {
            if(oldVal > stock && num > oldVal) {
                $num.val(oldVal);
            } else if(oldVal <= stock) {
                $num.val(stock);
            }
        }
    } else {
        $plus.removeClass("disabled");
    }
    num = parseInt($num.val());
    if(num>=2){
        $minus.removeClass("disabled");
    } else {
        $minus.addClass("disabled");
    }
    var $select = $cartItem.find(".select input");
    if(num > stock) {
        $select.attr("disabled", true);
    } else {
        $select.attr("disabled", false);
    }
    if(oldVal != num || first) {
        var totalPrice = num*price;
        $cartItem.find(".totalPrice").text("HK$"+totalPrice.toFixed(2)).end()
            .data("totalPrice", totalPrice);
        $num.data("oldVal", num);
        calculateSum();
        if(first) return ;
        var timer = $num.data("timer"),
            productId = product.productId;
        if(timer) clearTimeout(timer);
        timer = setTimeout(function(){
            changeCart($num, productId, num, val);
        }, 800);
        $num.data("timer", timer);
    }
}

function changeCart($num, productId, num, val) {
    var reqData = "productId="+productId+"&num="+num+"&addType=1";
    $.ajax({
        method: "post",
        url: "/proxy/customer/cart/adding",
        data: reqData
    }).done(function(result){
        var status = result.status;
        if(status==200){
            $num.data("val", num);
        } else if(status==300){
            location.href = loginUrl;
        } else {
            tipsAlert("Server error!");
            $num.val(val);
            checkState($num);
        }
    }).fail(function (result) {
        //tipsAlert("Server error!");
        $num.val(val);
        checkState($num);
        result = {
            status: 200,
            num: 8
        };
        var status = result.status;
        if(status==200){
            $num.data("val", num);
            setCart(result.num);
        } else if(status==300){
            location.href = loginUrl;
        } else {
            tipsAlert("Server error!");
            $num.val(val);
            checkState($num);
        }
    });
}

function calculateSum(way){
    var sum = 0,
        $cartItem = $cartList.find(".cartItem"),
        len = $cartItem.length,
        j=0;
    for(var i=0; i<len; i++){
        var $select = $cartItem.eq(i).find(".select input");
        if($select.prop("disabled")) continue;
        if(way==1) {
            sum += $cartItem.eq(i).data("totalPrice");
            $select.prop("checked", true);
            j++;
        } else if(way==2) {
            $select.prop("checked", false);
        } else {
            if($cartItem.eq(i).find(".select input").prop("checked")) {
                sum += $cartItem.eq(i).data("totalPrice");
                j++;
            } else {
                $cartList.find(".allCart").prop("checked", false);
            }
        }
    }
    var $checkout = $cartList.find(".checkout");
    $checkout.find(".num").text(j).end()
        .find(".total").text("HK$"+sum.toFixed(2));
    var $check = $checkout.find(".check");
    if(j>0) {
        $check.removeClass("disabled");
    } else {
        $check.addClass("disabled");
    }

}

$cartList.on("blur", ".cartItem .quantityOp .num", function (e) {
    var val = this.value;
    if(val==="") {
        this.value = "1";
    }
});

$cartList.on("click", ".cartItem .quantityOp .minus", function (e) {
    var _this = $(this);
    var $num = _this.siblings(".num");
    if(!_this.hasClass("disabled")){
        $num.val($num.val()-1);
    }
    checkState($num);
});

$cartList.on("click", ".cartItem .quantityOp .plus", function (e) {
    var _this = $(this);
    var $num = _this.siblings(".num");
    if(!_this.hasClass("disabled")){
        $num.val(parseInt($num.val())+1);
    }
    checkState($num);
});

$cartList.on("click", ".cartItem .del", function (e) {
    var _this = $(this),
        $cartItem = _this.parents(".cartItem");
    tipsConfirm("Are you sure want to delete it from cart?", function () {
        deleteCart($cartItem);
    });
});

$cartList.on("change", ".select input", calculateSum);

$cartList.on("click", ".allCart", function(){
    var _this = $(this),
        $allCart = $cartList.find(".allCart");
    if(_this.prop("checked")){
        calculateSum(1)
        $allCart.prop("checked", true);
    } else {
        calculateSum(2)
        $allCart.prop("checked", false);
    }
});

$cartList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postCart();
});

var buy = (function(){
    var loading = null;
    return function(){
        var _this = $(this);
        if(_this.hasClass("disabled")) return;
        if(loading) return;
        loading = showLoading(_this.parents(".optionBox"));
        var $cartItem = $cartList.find(".cartItem"),
            len = $cartItem.length,
            $item = null,
            info = null,
            cartId = null,
            arr = [];
        for(var i=0; i<len; i++) {
            $item  = $cartItem.eq(i);
            if($item.find(".select input").prop("checked")){
                info = $item.data("info");
                cartId = info.cartId;
                arr.push(cartId);
            }
        }
        var reqData = "orderType=3&cartIdList="+ JSON.stringify(arr);
        $.ajax({
            method: "post",
            url: "/proxy/order/prepare",
            data: reqData
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                location.href = "confirmOrder.html?orderIdList="+decodeURIComponent(JSON.stringify(result.orderIdList));
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            tipsAlert("server error!");
            if(loading) {
                loading.remove();
                loading = null;
            }
            /*result = {
                status: 200,
                orderIdList: [1]
            };
            var status = result.status;
            if(status==200){
                location.href = "confirmOrder.html?orderIdList="+decodeURIComponent(JSON.stringify(result.orderIdList));
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }*/
        });
    };
})();

$cartList.on("click", ".optionBox .check", buy);

var deleteCart = (function () {
    var loading = null;
    return function($cartItem){
        if(loading) return ;
        var info = $cartItem.data("info"),
            reqData = "cartId="+info.cartId;
        loading = showLoading($cartItem.find(".operate"));
        $.ajax({
            method: "post",
            url: "/proxy/customer/cart/deleting",
            data: reqData
        }).done(function(result){
            var status = result.status;
            if(status==200){
                $cartItem.remove();
                showSpinner("Success", {
                    callback: function(){
                        location.reload();
                    }
                })
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }
        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            //tipsAlert("Server error!");
            result = {
                status: 200
            };
            var status = result.status;
            if(status==200){
                $cartItem.remove();
                showSpinner("Success", {
                    callback: function(){
                        location.reload();
                    }
                })
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }
        });
    };
})();

postCart();

var $window = $(window);
$window.on("scroll resize", function(){
    var $optionBox = $cartList.find(".optionBox"),
        $checkoutBox = $cartList.find(".checkoutBox");
    if($checkoutBox.height()+$checkoutBox.offset().top >$window.scrollTop()+$window.height()){
        $optionBox.addClass("fixed");
    } else {
        $optionBox.removeClass("fixed");
    }
    $optionBox.css("left", $cartList.offset().left - $window.scrollLeft());
});