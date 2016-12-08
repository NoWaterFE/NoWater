var host="http://123.206.100.98:16120";


// header添加事件
(function () {
    //获取登录信息可能不需要
    /*$.ajax({
     method: "post",
     url: host+"/customer/isLogin",
     xhrFields: {
     withCredentials: true
     },
     dataType: "json"
     }).done(function (result) {
     if(result.status==200){
     var userInfo = result.userInformation[0];
     var quickMenu = $("#quickMenu");
     quickMenu.find(".accountOperate").toggleClass("active");
     quickMenu.find(".my-cart .count").text(userInfo.cartNum);
     }
     }).fail(function (result) {
     console.log(result.statusText);
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
     }
     });*/

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

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

function　createOrderItem(data){
    var pendingPay = '<div class="payNow">' +
            'Pay now ' +
        '</div> ' +
        '<div class="cancel">' +
            'Cancel order ' +
        '</div> ';
    var confirmReceived = '<div class="confirmR">' +
        'Confirm received ' +
        '</div> ';
    var toBeComment = '<div class="comment">' +
        'Comment ' +
        '</div>';

    var operate = ""
    if(data.status==1){
        operate = pendingPay;
        data.statusText = "Pending payment";
    } else if(data.status==2){
        data.statusText = "To be delivered";
    } else if(data.status==3){
        data.statusText = "To be received";
        operate = confirmReceived;
    } else if(data.status==4){
        data.statusText = "Success order";
        operate = toBeComment;
    } else if(data.status==5){
        data.statusText = "Success order";
    } else if(data.status==6){
        data.statusText = "Order canceled";
    }
    var len = data.products.length,
        orderData = null;
    for(var i=0; i<len; i++){
        orderData += '<tr class="orderData"> ' +
            '<td class="product"> ' +
            '<a href="javascript:" class="clearfix productLink"> ' +
            '<img src="'+data.products[i].photoIdUrl+'"> ' +
            '<span class="productName">'+data.products[i].productName+'</span> ' +
            '</a> ' +
            '</td> ' +
            '<td class="price">'+data.products[i].price+'</td> ' +
            '<td class="amount">'+data.products[i].amount+'</td> ';
        if(i==0){
            orderData += '<td class="totalPrice">' +
                'HK$'+data.totalPrice +
                '</td>' +
                '<td class="status"> ' +
                    '<div class="orderStatus">' +
                        data.statusText +
                    '</div> ' +
                    '<div class="orderDetail"> ' +
                        '<a href="javascrpt:">' +
                        'Order details ' +
                        '</a> ' +
                    '</div> ' +
                '</td> ' +
                '<td class="operate">' +
                    operate +
                '</td> ' +
            '</tr> ';
        } else {
            orderData +='<td class="totalPrice"></td> ' +
                '<td class="status"></td> ' +
                '<td class="operate"></td>' +
                '</tr>';
        }
    }
    return $('<tbody class="orderItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="orderHeader"> ' +
            '<td colspan="6"> ' +
                '<span class="orderTime">'+data.time+'</span> ' +
                '<span class="orderId">Order ID: '+data.orderId+'</span> ' +
                '<span class="shopName"> ' +
                    '<a href="javascript:">'+data.shopName+'</a> ' +
                '</span> ' +
            '</td> ' +
        '</tr> ' +
        orderData +
        '</tbody>')
}

var postOrder = (function(){
    var loading = null;
    return function (orderStatus) {
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "post",
            url: host+"",
            xhrFields: {
                withCredentials: true
            },
            dataType: "json"
        }).done(function(result){

        }).fail(function(result){
            result = {
                data: [
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 1,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 2,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 3,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 4,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 5,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 6,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    },
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 1,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product03a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/product04a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    }
                ]
            };
            if(loading){
                loading.remove();
                loading = null;
            }
            var len = result.data.length;
            for(var i=0; i<len; i++){
                if(orderStatus!=0) { result.data[i].status=orderStatus};
                $orderList.find('.orderTable').append(createOrderItem(result.data[i]));
            }
            $orderList.find(".more .showMore")
                .removeClass("hidden");
        });
    };
})();

var $orderList = $("#orderList");

$orderList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postOrder(orderStatus);
});

var $orderMain = $("#orderMain");
$orderMain.on("click", ".orderTab", function () {
    var _this = $(this);
   var i =_this.index();
   location.href = "order.html?status="+i;
});

var orderStatus = getUrlParam("status");

if(!!orderStatus){
    orderStatus = parseInt(orderStatus);
    if(!orderStatus || orderStatus<=-1||orderStatus>=5) orderStatus = 0;
} else {
    orderStatus = 0;
}
$orderMain.find(".orderTab")
    .eq(orderStatus)
    .addClass("active")
    .siblings()
    .removeClass("active");
postOrder(orderStatus);