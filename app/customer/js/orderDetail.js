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
            location.href = "index.html";
        }).fail(function () {
            delCookie("token");
            location.href = "index.html";
        });
    });

    var $searchForm = $("#searchForm");
    $searchForm.on("submit", function(e){
        e.preventDefault();
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

function tipsConfirm(msg, callback, config){
    var def = {
        "ok": "OK",
        "cancel": "Cancel"
    };
    $.extend(def, config);
    var $confirm = $(".tipsConfirm");
    if ($confirm.length > 0) $confirm.remove();
    $confirm = $("<div class='tipsConfirm'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $('<div class="btn2"> ' +
        '<div class="cancel">'+def.cancel+'</div> ' +
        '<div class="ok">'+def.ok+'</div> </div>');

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
    var confirmReceived = '<div class="confirmR">' +
        data.countdown +
        'Confirm received' +
        '</div> ';
    var toBeComment = '<div class="timeTips">' +
        '</div>' +
        '<div class="comment">' +
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
    var product = data.product;
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
        '</td> ' +
        '<td class="operate">' +
        operate +
        '</td> ' +
        '</tr> ';
    return $('<tbody class="orderItem"> ' +
        orderData +
        '</tbody>').data('info', data);
}

function setOrderInfo(data) {
    var $info = $("#info");
    var shop = data.product.shop;
    $info.find(".receiver .value").text(data.address).end()
        .find(".orderTime .value").text(data.time).end()
        .find(".orderId .value").text(data.orderId).end()
        .find(".shopName .value").text(shop.shopName).end()
        .find(".shopTel .value").text(shop.telephone).end()
        .find(".shopEmail .value").text(shop.email).end()
        .find(".express .value").text(data.express).end()
        .find(".expressNo .value").text(data.expressCode);
}

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var postOrder = (function(){
    var loading = null;
    return function (orderId, orderStatus) {
        if(loading) return ;
        loading = showLoading($(".more"));
        var arr = [];
        arr.push(orderId);
        var reqData = "orderIdList="+JSON.stringify(arr);
        $.ajax({
            method: "get",
            url: "/proxy/order/detail",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var $orderList = $("#orderList"),
                    $orderTable = $orderList.find(".orderTable"),
                    data = result.data[0];
                setOrderInfo(data);
                $orderTable.append(createOrderItem(data));
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("unknown error!", function () {
                    location.href = "modifyInfo.html";
                });
            }
        }).fail(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            tipsAlert("server error!");
            result = {
                status: 200,
                data: [
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        countdown: "left 23 Hour",
                        status: 4,
                        address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
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
                                shopName: "Tom's shop",
                                telephone: 62937498,
                                email: "nowater@nowater.com"
                            },
                        },
                        express: "SF",
                        expressCode: "7978978",
                        num: 1,
                        price: 333.3,
                        sumPrice: 333
                    }
                ]
            };
            var status = result.status;
            if(status==200){
                var $orderList = $("#orderList"),
                    $orderTable = $orderList.find(".orderTable"),
                    data = result.data[0];
                setOrderInfo(data);
                $orderTable.append(createOrderItem(data));
            } else if(status==300){
                location.href = loginUrl;
            } else {
                tipsAlert("unknown error!", function () {
                    location.href = "modifyInfo.html";
                });
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
var $orderList = $("#orderList");

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
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    },
                    "timeout": 800
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
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

var orderId = getUrlParam("orderId"),
    status = getUrlParam("status");
if(orderId&&status){
    postOrder(orderId, status);
} else {
    location.href = "modifyInfo.html";
}

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
        url: "/proxy/order/comment",
        data: _this.serialize()
    }).done(function(result){
        if(loading) loading.remove();
        _this.data("submit", false);
        var status = result.status;
        if(status==200){
            showSpinner("Commented", {
                callback: function () {
                    location.reload()
                }
            })
        } else {
            tipsAlert("Server error!");
        }
    }).fail(function(result){
        if(loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("Server error!");
        /*result = {
         status: 200
         };
         var status = result.status;
         if(status==200){
         showSpinner("Commented", {
         callback: function () {
         location.reload()
         }
         })
         } else {
         tipsAlert("Server error!");
         }*/
    });

});