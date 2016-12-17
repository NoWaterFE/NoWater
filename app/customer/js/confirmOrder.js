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

function　createOrderItem(data){
    var len = data.products.length,
        orderData = null;
    for(var i=0; i<len; i++){
        orderData += '<tr class="orderData"> ' +
            '<td class="product"> ' +
            '<a href="productDetail.html?id='+data.products[i].productId+'" target="_blank" class="clearfix productLink"> ' +
            '<img src="'+data.products[i].photoIdUrl+'"> ' +
            '<span class="productName">'+data.products[i].productName+'</span> ' +
            '</a> ' +
            '</td> ' +
            '<td class="price">'+data.products[i].price.toFixed(2)+'</td> ' +
            '<td class="amount">'+data.products[i].amount+'</td> ' +
            '<td class="totalPrice">HK$'+data.totalPrice.toFixed(2) +'</td>' +
        '</tr>';
    }
    return $('<tbody class="orderItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="orderHeader"> ' +
        '<td colspan="6"> ' +
        '<span class="shopName"> SHOP: ' +
        '<a href="store.html?shopId='+data.shopId+'" target="_blank">'+data.shopName+'</a> ' +
        '</span> ' +
        '</td> ' +
        '</tr> ' +
        orderData +
        '</tbody>')
}

var $orderList = $("#orderList");

result = {
    sumPrice: 1999,
    data: [
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopId: 2,
            shopName: "MONEYBACK REWARD",
            status: 1,
            totalPrice: 999.99,
            address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
            products: [
                {
                    photoIdUrl: "imgs/product03a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 333.33,
                    amount: 3
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 2,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product04a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 666.66,
                    amount: 2
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 3,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product04a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 666.66,
                    amount: 2
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 4,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product03a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 333.33,
                    amount: 3
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 5,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product04a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 666.66,
                    amount: 2
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 6,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product03a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 333.33,
                    amount: 3
                }
            ]
        },
        {
            time: "2016-9-05 16:30:06",
            orderId: "2662774641999118",
            shopName: "MONEYBACK REWARD",
            shopId: 2,
            status: 1,
            totalPrice: 999.99,
            products: [
                {
                    photoIdUrl: "imgs/product04a.jpg",
                    productId: 1,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 666.66,
                    amount: 2
                }
            ]
        }
    ]
};
var len = result.data.length;
for(var i=0; i<3; i++){
    $orderList.find('.orderTable').append(createOrderItem(result.data[i]));
}
var $orderSubmit = $orderList.find(".orderSubmit");
$orderSubmit.show()
    .find('.price').text(result.sumPrice.toFixed(2)).end()
    .find('.address').text(result.data[0].address);

var submitOrder = (function(){
    var loading = null;
    return function(e){
        if(loading) return;
        loading = showLoading($orderSubmit.find(".orderOperate"));
        var data = "orderId=1";
        $.ajax({
            method: "post",
            url: "/proxy/order/pay",
            data: data
        }).done(function(){

        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            result = {
                status: 200
            };
            if(result.status==200){
                location.href = "pay.html?orderId=1";
            }
        });
    };
})();

$orderSubmit.on("click", ".confirmBtn", submitOrder);