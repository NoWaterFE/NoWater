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

})();

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

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
    if (r != null) return r[2]; return null; //返回参数值
}

function　createOrderItem(data){
    var pendingPay = '<div class="timeTips">' +
            data.countdown +
        '</div>' +
        '<div class="payNow">' +
            'Pay now' +
        '</div> ' +
        '<div class="cancel">' +
            'Cancel order' +
        '</div> ';
    var confirmReceived = '<div class="timeTips">' +
            data.countdown +
        '</div>' +
        '<div class="confirmR">' +
        'Confirm received' +
        '</div> ';
    var toBeComment = '<div class="comment">' +
        'Comment' +
        '</div>';

    var operate = "";
    if(data.status==1){
        operate = pendingPay;
        data.statusText = "Waiting for payment";
    } else if(data.status==2){
        data.statusText = "Waiting for delivery";
    } else if(data.status==3){
        data.statusText = "Waiting for receiving";
        operate = confirmReceived;
    } else if(data.status==4){
        data.statusText = "Waiting for comment";
        operate = toBeComment;
    } else if(data.status==5){
        data.statusText = "Completed";
    } else if(data.status==10){
        data.statusText = "Closed";
    }
    var product = data.product,
        shop = product.shop;
    var orderData = '<tr class="orderData"> ' +
            '<td class="product"> ' +
            '<a href="productDetail.html?id='+product.productId+'" target="_blank" class="clearfix productLink"> ' +
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
                    '<a href="store.html?shopId='+data.targetId+'" target="_blank">'+shop.shopName+'</a> ' +
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
        if(param) {
            loading = showLoading($orderForm);
        } else {
            loading = showLoading($(".more"));
        }
        var reqData = "status="+orderStatus;
        $.ajax({
            method: "get",
            url: "/proxy/order/list",
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
            //tipsAlert("server error!");
            result = {
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
                var data = result.data,
                    len = data.length,
                    $orderTable = $orderList.find('.orderTable');
                if(param) {
                    $orderTable.find(".orderItem").remove();
                    data = data.concat(data);
                    len = data.length;
                }
                for(var i=0; i<len; i++){
                    if(orderStatus!=0) { data[i].status=orderStatus }
                    $orderTable.append(createOrderItem(data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        });
    };
})();

function payNow() {
    var _this = $(this),
        $orderItem = _this.parents(".orderItem"),
        info = $orderItem.data("info"),
        orderId = info.orderId,
        sumPrice = info.sumPrice,
        arr = [];
    arr.push(orderId);
    location.href = "pay.html?orderIdList="+JSON.stringify(arr)+"&sumPrice="+sumPrice;
}

var confirmR = (function(){
    var loading = null;
    return function () {
        var _this = $(this),
            $orderItem = _this.parents(".orderItem"),
            info = $orderItem.data("info"),
            orderId = info.orderId,
            reqData = "orderId="+orderId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/order/confirm/receipt",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $orderItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else {
                showSpinner("Unknown error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            }
        }).fail(function(result){
            tipsAlert("server error");
            if (loading) {
                loading.remove();
                loading = null;
            }
            /*result = {
             status: 200
             };
             var status = result.status;
             if(status==200){
             $orderItem.remove();
             showSpinner("Add Success!", {
             "callback": function () {
             location.reload();
             }
             });
             } else if(status==300){
             location.href = loginUrl;
             } else if(status==400){
             showSpinner("Unknown error!", {
             "callback": function () {
             location.reload();
             }
             });
             } else if(status==500){
             showSpinner("The order has been deleted!", {
             "callback": function () {
             location.reload();
             }
             });
             }*/
        });
    }
})();
var orderCancel = (function(){
    var loading = null;
    return function () {
        var _this = $(this),
            $orderItem = _this.parents(".orderItem"),
            info = $orderItem.data("info"),
            orderId = info.orderId,
            reqData = "orderId="+orderId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/order/cancel",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $orderItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else {
                showSpinner("Unknown error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            }
        }).fail(function(result){
            tipsAlert("server error");
            if (loading) {
                loading.remove();
                loading = null;
            }
            /*result = {
             status: 200
             };
             var status = result.status;
             if(status==200){
             $orderItem.remove();
             showSpinner("Add Success!", {
             "callback": function () {
             location.reload();
             }
             });
             } else if(status==300){
             location.href = loginUrl;
             } else if(status==400){
             showSpinner("Unknown error!", {
             "callback": function () {
             location.reload();
             }
             });
             } else if(status==500){
             showSpinner("The order has been deleted!", {
             "callback": function () {
             location.reload();
             }
             });
             }*/
        });
    }
})();

var $orderList = $("#orderList");

$orderList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postOrder(orderStatus);
});

$orderList.on("click", ".orderItem .payNow", payNow);
$orderList.on("click", ".orderItem .confirmR", confirmR);
$orderList.on("click", ".orderItem .comment", function () {
    var _this = $(this),
        $orderItem = _this.parents(".orderItem"),
        info = $orderItem.data("info"),
        $commentPop = $(".commentPop");
    $commentPop.show()
        .find(".commentForm")[0].orderId.value = info.orderId;
});
$orderList.on("click", ".orderItem .cancel", function () {
    var self = this;
    tipsConfirm("Are you sure want to cancel the order?", function(){
        orderCancel.apply(self);
    });
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

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

var $commentForm = $("#commentForm");

$commentForm.on("input", ".input-item textarea", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$commentForm.on("mousemove", ".star", function(e){
    var _this = $(this);
    if(_this.hasClass("active")) return;
    var cX = e.clientX,
        left = _this.offset().left,
        width = _this.width(),
        rate = Math.ceil((cX - left)/width*5);
    _this.find(".full")
        .width(rate*20+"%");
});

$commentForm.on("mouseout", ".star", function(e){
    var _this = $(this),
        width = _this.find(".starInput").val()*20 + "%";
    _this.find(".full")
        .width(width);
});

$commentForm.on("click", ".star", function(e){
    var _this = $(this),
        cX = e.clientX,
        left = _this.offset().left,
        width = _this.width(),
        rate = Math.ceil((cX - left + 1)/width*5);
    _this.addClass("active")
    _this.find(".full")
        .width(rate*20+"%")
        .end()
        .find(".starInput")
        .val(rate)
        .parents(".starDiv")
        .removeClass("error");
});

$commentForm.on("click", ".cancel", function (e) {
    var $delegateTarget = $(e.delegateTarget);
    $delegateTarget[0].reset();
    $delegateTarget
        .find(".full")
        .width(0)
        .end()
        .find(".star")
        .removeClass("active")
        .find(".starInput")
        .val(0)
        .end()
        .end()
        .parent()
        .hide();
});

$commentForm.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $starDiv = _this.find(".starDiv"),
        $comment = _this.find(".comment");
    if (this.star.value==0) {
        addError($starDiv, "Please choose a star-rating!");
        return;
    }
    if (!this.comment.value) {
        addError($comment, "Please input your reviews!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    $.ajax({
        method: "post",
        url: "/proxy/",
        data: _this.serialize()
    }).done(function(result){

    }).fail(function(result){
        if(loading) loading.remove();
        _this.data("submit", false);
    });

});

var $orderFilter = $("#orderFilter"),
    $orderForm = $orderFilter.find(".orderForm");
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
       $('.selectTime').datepicker({
           format: 'yyyy-mm-dd'
       }).datepicker(
           "setDate", new Date()
       ).blur(function(){
           var _this = $(this);
           _this.datepicker("setDate", _this.datepicker("getDate"));
       });
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
                    time: time,
                    searchKey: searchKey
                };
            } else {
                param = {
                    time: time,
                    searchKey: searchKey,
                    startTime: _this.find(".startTime").val(),
                    endTime: _this.find(".endTime").val()
                };
            }
        } else {
            if(searchKey==="") return;
            param = {
                searchKey: searchKey
            };
        }
        if(param) postOrder(orderStatus, param);
    };
})());