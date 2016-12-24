// header添加事件
(function () {
    //获取登录信息可能不需要
    $.ajax({
        method: "get",
        url: "/proxy/customer/isLogin",
        dataType: "json"
    }).done(function (result) {
        if (result.status == 200) {
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
        if (result.status == 200) {
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
        var cart = quickMenu.find(".my-cart .count");
        if(num > 99) {
            cart.text("99+");
        } else {
            cart.text(num);
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

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

function　createOrderItem(data){
    var product = data.product,
        shop = product.shop;
    var orderData = '<tr class="orderData"> ' +
        '<td class="product"> ' +
        '<a href="productDetail.html?id='+product.productId+'" target="_blank" class="clearfix productLink"> ' +
        '<img src="'+product.photo[0]+'"> ' +
        '<span class="productName">'+product.productName+'</span> ' +
        '</a> ' +
        '</td> ' +
        '<td class="price">HK$'+product.price.toFixed(2)+'</td> ' +
        '<td class="amount">'+data.num+'</td> ' +
        '<td class="totalPrice">' +
        'HK$'+data.sumPrice.toFixed(2) +
        '</td>' +
        '</tr> ';
    return $('<tbody class="orderItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="orderHeader"> ' +
        '<td colspan="6"> ' +
        '<span class="shopName"> SHOP: ' +
        '<a href="store.html?shopId='+shop.shopId+'" target="_blank">'+shop.shopName+'</a> ' +
        '</span> ' +
        '</td> ' +
        '</tr> ' +
        orderData +
        '</tbody>')
}

var $orderList = $("#orderList"),
    $orderSubmit = $orderList.find(".orderSubmit"),
    orderIdList = getUrlParam("orderIdList"),
    sumPrice = 0;
(function(){
    $.ajax({
        method: "post",
        url: "/proxy/order/detail",
        data: "orderIdList="+orderIdList+"&status=-3"
    }).done(function (result) {
        var status = result.status;
        if(status==200){
            var data = result.data,
                len = data.length,
                $orderTable = $orderList.find('.orderTable');
            for(var i=0; i<len; i++){
                $orderTable.append(createOrderItem(data[i]));
                sumPrice += data[i].sumPrice;
            }
            var $orderSubmit = $orderList.find(".orderSubmit");
            $orderSubmit.show()
                .find('.price').text(sumPrice.toFixed(2)).end()
                .find('.address').text(data[0].address);
        } else if(status==300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }
    }).fail(function (result) {
        //tipsAlert("server error!");
        result = {
            status: 200,
            data: [
                {
                    orderId: "2662774641999118",
                    sumPrice: 999.99,
                    address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
                    num: 3,
                    product: {
                        shop: {
                            shopId: 1,
                            shopName: "MONEYBACK REWARD"
                        },
                        photo: [
                            "imgs/product03a.jpg"
                        ],
                        productId: 1,
                        productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                        price: 333.33
                    }
                },
                {
                    orderId: "2662774641999118",
                    sumPrice: 999.99,
                    address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
                    num: 3,
                    product: {
                        shop: {
                            shopId: 1,
                            shopName: "MONEYBACK REWARD"
                        },
                        photo: [
                            "imgs/product03a.jpg"
                        ],
                        productId: 1,
                        productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                        price: 333.33
                    }
                },
            ]
        };
        var status = result.status;
        if(status==200){
            var data = result.data,
                len = data.length,
                $orderTable = $orderList.find('.orderTable');
            for(var i=0; i<len; i++){
                $orderTable.append(createOrderItem(data[i]));
                sumPrice += data[i].sumPrice;
            }
            var $orderSubmit = $orderList.find(".orderSubmit");
            $orderSubmit.show()
                .find('.price').text(sumPrice.toFixed(2)).end()
                .find('.address').text(data[0].address);
        } else if(status==300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }
    });
}());

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var submitOrder = (function(){
    var loading = null;
    return function(e){
        if(loading) return;
        loading = showLoading($orderSubmit.find(".orderOperate"));
        var data = "orderIdList="+orderIdList;
        $.ajax({
            method: "post",
            url: "/proxy/order/confirm",
            data: data
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                location.href = "pay.html?orderIdList="+orderIdList+"&sumPrice="+sumPrice;
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("server error!");
            result = {
                status: 200
            };
            var status = result.status;
            if (status == 200) {
                location.href = "pay.html?orderIdList=" + orderIdList + "&sumPrice=" + sumPrice;
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        });
    };
})();

$orderSubmit.on("click", ".confirmBtn", submitOrder);