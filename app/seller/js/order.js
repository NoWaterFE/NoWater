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
    var $tips = $relative.find(".loadingImg");
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
    if (r != null) return r[2]; return null; //返回参数值
}

var loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

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
    } else if(data.status==10){
        data.statusText = "Closed";
    }
    var product = data.product,
        shop = product.shop;
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
        '<a href="orderDetail.html?orderId='+data.orderId+'&status='+data.status+'" target="_blank">' +
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
        '</tbody>').data("info", data);
}

var postOrder = (function(){
    var loading = null;
    return function (orderStatus, param) {
        if(loading) return ;
        var reqData = "status="+orderStatus;
        if(param) {
            loading = showLoading($orderForm);
            var timeFilter = param.timeFilter || 0;
            reqData += "&timeFilter=" + timeFilter + "&searchKey=" + param.searchKey;
            if (timeFilter == 5) {
                reqData += "&beginTime="+param.beginTime+"&endTime="+param.endTime;
            }
        } else {
            loading = showLoading($(".more"));
            reqData += "&timeFilter=0";
        }
        $.ajax({
            method: "get",
            url: "/proxy/shop-owner/order/list",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var len = result.data.length,
                    $orderTable = $orderList.find('.orderTable');
                if(param) {
                    $orderTable.find(".orderItem").remove();
                }
                for(var i=0; i<len; i++){
                    $orderTable.append(createOrderItem(result.data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            tipsAlert("server error!");
            /*result = {
                status: 200,
                data: [
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        status: 1,
                        countdown: "left 23 Hour",
                        product: {
                            productId: 10,
                            productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                            photo: [
                                "imgs/product01a.jpg",
                                "imgs/product02a.jpg",
                                "imgs/product03a.jpg",
                                "imgs/product04a.jpg"
                            ],
                            shop: {
                                shopName: "Tom's shop"
                            }
                        },
                        num: 1,
                        price: 333,
                        sumPrice: 333
                    }
                ]
            };
            var status = result.status;
            if(status==200){
                var len = result.data.length,
                    $orderTable = $orderList.find('.orderTable');
                if(param) {
                    $orderTable.find(".orderItem").remove();
                }
                for(var i=0; i<len; i++){
                    $orderTable.append(createOrderItem(result.data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }*/
        });
    };
})();

var $orderList = $("#orderList");

$orderList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postOrder(orderStatus);
});

$orderList.on("click", ".orderItem .alreadyDelivered", function(){
    var _this = $(this),
        $orderItem = _this.parents(".orderItem"),
        $deliverPop = $(".deliverPop"),
        $deliverForm = $("#deliverForm"),
        info = $orderItem.data("info");
    $deliverForm[0].orderId.value = info.orderId;
    $deliverPop.show();
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

var $deliverForm = $("#deliverForm");

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

function deliverProduct(_this, loading){
    $.ajax({
        method: "post",
        url: "/proxy/shop-owner/order/delivery",
        dataType: "json",
        data: _this.serialize()
    }).done(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
        var status = result.status;
        if(status == 200){
            showSpinner("Successful", {
                callback: function(){
                    location.reload();
                }
            });
        } else if(status == 300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }
    }).fail(function () {
        if (loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("server error");
    });
}

$deliverForm.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $express = _this.find(".express"),
        $expressNo = _this.find(".expressCode");
    if (!this.express.value) {
        addError($express, "Express can't be empty!");
        return;
    }
    if (!this.expressCode.value) {
        addError($expressNo, "Express No can't be empty!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    deliverProduct(_this, loading);
});

$deliverForm.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$deliverForm.on("click", ".cancel", function (e) {
    var $delegateTarget = $(e.delegateTarget);
    $delegateTarget[0].reset();
    $delegateTarget.parent()
        .hide();
});

var $orderFilter = $("#orderFilter"),
    $orderForm = $orderFilter.find(".orderForm");

$orderForm.find('.selectTime').datepicker({
    format: 'yyyy-mm-dd',
    autoPick: true
}).blur(function(){
    var _this = $(this);
    _this.datepicker("pick");
});

$orderFilter.on("click", ".moreFilter", function(){
    $(this).toggleClass("less")
        .parent()
        .siblings(".timeSub")
        .slideToggle(200);
});
$orderFilter.on("change", ".timeSelect", function () {
    var _this = $(this);
    if(_this.val()=="5"){
        _this.siblings('.detailTime').show();
    } else {
        _this.siblings('.detailTime').hide();
    }
});
$orderForm.on("submit", (function(){
    return function(e){
        e.preventDefault();
        var _this = $(this),
            isShow = _this.find(".moreFilter").hasClass("less"),
            searchKey = _this[0].search.value,
            param = null;
        if(isShow) {
            var time = _this[0].time.value;
            if(time!="5") {
                param = {
                    timeFilter: time,
                    searchKey: searchKey
                };
            } else {
                param = {
                    timeFilter: time,
                    searchKey: searchKey,
                    beginTime: _this.find(".startTime").val(),
                    endTime: _this.find(".endTime").val()
                };
            }
        } else {
            param = {
                searchKey: searchKey
            };
        }
        postOrder(orderStatus, param);
    };
})());