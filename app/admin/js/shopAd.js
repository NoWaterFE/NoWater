var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/logout"
    }).done(function(){
        delCookie("admin_token");
        location.href = "login.html";
    }).fail(function () {
        delCookie("admin_token");
        location.href = "login.html";
    });
});

function delCookie(name){
    var t = new Date();
    t.setTime(t.getTime()-1);
    document.cookie= name + "=null;path=/;expires="+t.toGMTString();
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

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

function　createShowItem(data){
    var pendingPay = '<div class="timeTips">' +
        (data.countdown || "") +
        '</div>' +
        '<div class="payNow">' +
        'Pay now' +
        '</div> ' +
        '<div class="cancel">' +
        'Cancel bidding' +
        '</div> ';
    var approve = '<div class="approve">APPROVE</div>';

    var operate = "";
    if(data.status==1){
        data.statusText = "Waiting for payment";
    } else if(data.status==2){
        data.statusText = "Waiting for result";
        operate = approve;
    } else if(data.status==5){
        data.statusText = "Bidding success";
    } else if(data.status==10){
        data.statusText = "Closed";
    } else if(data.status==-2){
        data.statusText = "Bidding failure";
    }
    var shop = data.shop;
    return $('<tbody class="showItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="showHeader"> ' +
        '<td colspan="6">' +
        '<span class="showTime">'+data.time+'</span> ' +
        '<span class="showId">Bid ID: '+data.orderId+'</span> ' +
        /*'<span class="shopName"> ' +
         '<a href="../customer/store.html?'+shop.shopId+'" target="_blank">'+shop.shopName+'</a> ' +
         '</span>' +*/
        '</td> ' +
        '</tr> ' +
        '<tr class="showData"> ' +
        '<td class="product"> ' +
        '<a href="'+data.photo+'" target="_blank" class="pictureLink"> ' +
        '<img src="'+data.photo+'"> ' +
        '</a> ' +
        '</td> ' +
        '<td class="shopAd">'+shop.shopId+'</td> ' +
        '<td class="price">HK$'+data.price.toFixed(2)+'</td> ' +
        '<td class="displayTime">'+data.showTime+'</td> ' +
        '<td class="status"> ' +
        '<div class="showStatus">'+data.statusText+'</div> ' +
        '</td> ' +
        '<td class="operate"> ' +
        operate +
        '</td> ' +
        '</tr> ' +
        '</tbody>').data("info", data);
}

var postShow = (function(){
    var loading = null,
        startId =0;
    return function () {
        if(loading) return ;
        loading = showLoading($(".more"));
        //var reqData = "count=10&startId="+startId;
        $.ajax({
            method: "get",
            url: "/proxy/admin/shop/ad/list",
            dataType: "json"
        }).done(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status,
                data = result.data;
            if (status == 200) {
                var len = data.length,
                    $showTable = $showList.find('.showTable');
                for (var i = 0; i < len; i++) {
                    $showTable.append(createShowItem(result.data[i]));
                }
                /*startId = result.startId;
                if(startId!=-1){
                    $showList.find(".more .showMore").removeClass("hidden");
                }*/
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
            tipsAlert("server error!");
            result = {
                status: 200,
                startId: -1,
                data: [
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        status: 1,
                        shop: {
                            shopId: 2
                        },
                        photo: "../customer/imgs/adshop01.jpg",
                        price: 333,
                        showTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        status: 2,
                        shop: {
                            shopId: 2
                        },
                        price: 333,
                        photo: "../customer/imgs/adshop01.jpg",
                        showTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        status: 5,
                        shop: {
                            shopId: 2
                        },
                        price: 333,
                        photo: "../customer/imgs/adshop01.jpg",
                        showTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        status: 10,
                        shop: {
                            shopId: 2
                        },
                        price: 333,
                        photo: "../customer/imgs/adshop01.jpg",
                        showTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        status: -2,
                        shop: {
                            shopId: 2
                        },
                        price: 333,
                        photo: "../customer/imgs/adshop01.jpg",
                        showTime: "2016-09-06"
                    }
                ]
            };
            var status = result.status,
                data = result.data;
            if (status == 200) {
                var len = data.length,
                    $showTable = $showList.find('.showTable');
                for (var i = 0; i < len; i++) {
                    $showTable.append(createShowItem(result.data[i]));
                }
                /*startId = result.startId;
                if(startId!=-1){
                    $showList.find(".more .showMore").removeClass("hidden");
                }*/
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        });
    };
})();

var approveAd = (function () {
    var loading = null;
    return function () {
        if(loading) return;
        var _this = $(this),
            $showItem = _this.parents(".showItem"),
            info = $showItem.data("info"),
            orderId = info.orderId,
            reqData = "orderId="+orderId;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/shop/ad/approve",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if (status == 200) {
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if (status == 300) {
                location.href = loginUrl;
            } else if (status == 400) {
                showSpinner("Server error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if (status == 500){
                tipsAlert("Failure, there is no ad slots left", function () {
                    location.reload();
                });
            } else if (status == 600) {
                tipsAlert("Failure, you must approve after the deadline!");
            }
        }).fail(function(result){
            tipsAlert("server error");
            if (loading) {
                loading.remove();
                loading = null;
            }
            result = {
                status: 200
            };
            var status = result.status;
            if (status == 200) {
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if (status == 300) {
                location.href = loginUrl;
            } else if (status == 400) {
                showSpinner("Server error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if (status == 500){
                tipsAlert("Failure, there is no ad slots left", function () {
                    location.reload();
                });
            } else if (status == 600) {
                tipsAlert("Failure, you must approve after the deadline!");
            }
        });
    };
})();


var $showList = $("#showList");

$showList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postShow();
});

$showList.on("click", ".showItem .approve", function () {
    var self = this;
    tipsConfirm("Are you sure want to approve the advertising applications?", function(){
        approveAd.apply(self);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

postShow();