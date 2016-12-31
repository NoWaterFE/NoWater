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

function imgAuto($img) {
    var imgW=$img[0].naturalWidth;
    var imgH=$img[0].naturalHeight;
    var constW=$img.parent().width();
    if(imgH>=imgW){
        $img.css({
            "width": "auto",
            "height": constW
        });
    } else {
        $img.css({
            "width": constW,
            "height": "auto"
        });
    }
}

function createShopList(info) {
    var status = info.status,
        operate = "";
    if(status==1){
        operate = '<span class="blackList">add to blacklist</span> ' +
            '<span class="del">delete</span> ';
    } else {
        operate = '<span class="removeBlack">remove from blacklist</span> ';
    }
    var $shopList = $('<li class="shopItem clearfix"> ' +
        '<div class="photo"> ' +
        '<img src="'+(info.photo && info.photo[0])+'"> ' +
        '</div> ' +
        '<ul class="info"> ' +
        '<li class="infoItem">' +
        'Shop ID: '+ info.shopId +
        '</li> ' +
        '<li class="infoItem">' +
        'Shop Name: ' + info.shopName +
        '</li> ' +
        '<li class="infoItem">' +
        'Owner ID: '+ info.ownerId +
        '</li> ' +
        '<li class="infoItem">' +
        'Telephone: '+ info.telephone +
        '</li> ' +
        '<li class="infoItem">' +
        'Email: '+ info.email +
        '</li> ' +
        '</ul> ' +
        '<div class="operate"> ' +
        operate +
        '</div> ' +
        '</li>').data("shopId", info.shopId);
    var $img = $shopList.find("img");
    var img = new Image();
    img.src = info.photo && info.photo[0];
    img.onload = function () {
        imgAuto($img);
    };
    return $shopList;
}

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var cStatus = getUrlParam("status");

if(cStatus==null) cStatus=0;
cStatus = parseInt(cStatus);
if(cStatus>1 || cStatus<0) cStatus = 0;

var $shopMain = $("#shopMain");
$shopMain.find(".shopTab")
    .eq(cStatus)
    .addClass("active");

var $shopList = $("#shopList");

var getShopItem = (function(){
    var loading = null,
        startId = 0;
    return function (cStatus, param) {
        if(loading) return ;
        var reqData = "count=20&shopType="+(1-2*cStatus);
        if(param){
            reqData +="&searchKey="+param.searchKey;
            loading = showLoading($shopForm);
            if(!param.first) {
                reqData += "&startId="+startId;
            } else {
                reqData += "&startId=0";
            }
        } else {
            reqData += "&startId=" + startId;
            loading = showLoading($(".more"));
        }
        $.ajax({
            method: "get",
            url: "/proxy/admin/shop/list",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                if(param && param.first){
                    $shopList.empty();
                    param.first = false;
                }
                for(var i=0; i<len; i++) {
                    $shopList.append(createShopList(data[i]));
                }
                startId = result.endId;
                if(startId!=-1){
                    $shopList.siblings(".more .showMore").removeClass("hidden");
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        }).fail(function(result){
            tipsAlert("server error!");
            if (loading) {
                loading.remove();
                loading = null;
            }
            result = {
                status: 200,
                data: [
                    {
                        shopId: 10,
                        shopName: "dhgan yoyoo",
                        telephone: "238409324",
                        ownerId: 1,
                        email: "nowater@nowater.com",
                        status: 1,
                        photo: ["http://koprvhdix117-10038234.file.myqcloud.com/ebbb7295-edc0-47c8-823e-f4af70d8bdf1.jpg"]
                    }
                ]
            };
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                if(param && param.first){
                    $shopList.empty();
                    param.first = false;
                }
                for(var i=0; i<len; i++) {
                    $shopList.append(createShopList(data[i]));
                }
                startId = result.endId;
                if(startId!=-1){
                    $shopList.siblings(".more .showMore").removeClass("hidden");
                }
            } else if(status==300) {
                location.href = loginUrl;
            }
        });
    }
})();

getShopItem(cStatus);

$shopList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getShopItem(cStatus, param);
});

$shopList.on("click", ".shopItem .blackList", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to add the shop to blacklist?", function(){
        addToBlackList(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

$shopList.on("click", ".shopItem .removeBlack", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to remove the shop from blacklist?", function(){
        removeBlack(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

$shopList.on("click", ".shopItem .del", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to delete the shop?", function(){
        deleteCustomer(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});


var addToBlackList = (function(){
    var loading = null;
    return function (_this) {
        var $shopItem = _this.parents(".shopItem"),
            shopId = $shopItem.data("shopId"),
            reqData = "shopId="+shopId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/shop/blacklist/adding",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $shopItem.remove();
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
                showSpinner("The shop has been deleted!", {
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
                $shopItem.remove();
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
                showSpinner("The shop has been deleted!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            }*/
        });
    }
})();

var removeBlack = (function(){
    var loading = null;
    return function (_this) {
        var $shopItem = _this.parents(".shopItem"),
            shopId = $shopItem.data("shopId"),
            reqData = "shopId="+shopId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/shop/blacklist/deleting",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $shopItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==400){
                showSpinner("unknown error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==500){
                showSpinner("The shop has been deleted!", {
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
                $shopItem.remove();
                showSpinner("Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==400){
                showSpinner("unknown error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==500){
                showSpinner("The shop has been deleted!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            }*/
        });
    }
})();

var deleteCustomer = (function(){
    var loading = null;
    return function (_this) {
        var $shopItem = _this.parents(".shopItem"),
            shopId = $shopItem.data("shopId"),
            reqData = "shopId="+shopId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/shop/delete",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $shopItem.remove();
                showSpinner("Delete Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==400){
                showSpinner("unknown error!", {
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
           /* result = {
                status: 200
            };
            var status = result.status;
            if(status==200){
                $shopItem.remove();
                showSpinner("Delete Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==400){
                showSpinner("unknown error!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            }*/
        });
    }
})();

var $shopFilter = $("#shopFilter"),
    $shopForm = $shopFilter.find(".shopForm");

var param = null;
$shopForm.on("submit", (function(){
    return function(e){
        e.preventDefault();
        var _this = $(this),
            searchKey = _this[0].search.value;
        if(!searchKey) return;
        param = {
            searchKey: searchKey,
            first: true
        };
        getShopItem(cStatus, param);
    };
})());