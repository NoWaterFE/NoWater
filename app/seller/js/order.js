// header添加事件
(function () {
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
            location.href = "../customer/index.html"
        }).fail(function () {
            delCookie("token");
            location.href = "../customer/index.html"
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
    var delived = '<div class="alreadyDelivered">' +
        'Already delivered ' +
        '</div>';

    var operate = "";
    if(data.status==1){
        data.statusText = "Waiting for payment";
    } else if(data.status==2){
        data.statusText = "Waiting for delivery";
        operate = delived;
    } else if(data.status==3){
        data.statusText = "Waiting for receiving";
    } else if(data.status==4){
        data.statusText = "Waiting for comment";
    } else if(data.status==5){
        data.statusText = "Completed";
    } else if(data.status==-1){
        data.statusText = "Closed";
    }
    var product = data.product,
        shop = data.shop;
    var orderData = '<tr class="orderData"> ' +
        '<td class="product"> ' +
        '<a href="../customer/productDetail.html?id='+product.productId+'" target="_blank" class="clearfix productLink"> ' +
        '<img src="'+product.photo[0]+'"> ' +
        '<span class="productName">'+product.productName+'</span> ' +
        '</a> ' +
        '</td> ' +
        '<td class="price">HK$'+data.price.toFixed(2)+'</td> ' +
        '<td class="amount">'+data.num+'</td> ' +
        '<td class="totalPrice">' +
        'HK$'+data.sumPrice.toFixed(2) +
        '</td>' +
        '<td class="status"> ' +
        '<div class="orderStatus">' +
        data.statusText +
        '</div> ' +
        '<div class="orderDetail"> ' +
        '<a href="orderDetail.html?orderId='+data.orderId+'" target="_blank">' +
        'Order details ' +
        '</a> ' +
        '</div> ' +
        '</td> ' +
        '<td class="operate">' +
        operate +
        '</td> ' +
        '</tr> ';
    return $('<tbody class="orderItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="orderHeader"> ' +
        '<td colspan="6"> ' +
        '<span class="orderTime">'+data.time+'</span> ' +
        '<span class="orderId">Order ID: '+data.orderId+'</span> ' +
        '<span class="shopName"> ' +
        '<a href="../customer/store.html?shopId='+data.targetId+'" target="_blank">'+shop.shopName+'</a> ' +
        '</span> ' +
        '</td> ' +
        '</tr> ' +
        orderData +
        '</tbody>');
}

var postOrder = (function(){
    var loading = null,
        startId = 0;
    return function (orderStatus) {
        if(loading) return ;
        loading = showLoading($(".more"));
        var reqData = "status="+orderStatus+"&startId="+startId+
            "&count=15";
        $.ajax({
            method: "get",
            url: "/proxy/order/list",
            dataType: "json",
            data: reqData
        }).done(function(result){

        }).fail(function(result){
            result = {
                status: 200,
                data: [
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: 1,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: 2,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: 3,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: 4,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: 5,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        shop: {
                            shopName: "Tom's shop"
                        },
                        status: -1,
                        totalPrice: "999.99",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ]
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    }
                ]
            };
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var len = result.data.length,
                    $orderTable = $orderList.find('.orderTable');
                for(var i=0; i<len; i++){
                    if(orderStatus!=0) { result.data[i].status=orderStatus }
                    $orderTable.append(createOrderItem(result.data[i]));
                }
                $orderList.find(".more .showMore")
                    .removeClass("hidden");
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
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
    .addClass("active");

postOrder(orderStatus);