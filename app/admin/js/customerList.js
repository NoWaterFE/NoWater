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
    config = $.extend(def, config);
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
        var callback = config.callback;
        if(callback) callback();
    }, config.timeout);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

function createCustomerList(info) {
    var status = info.status,
        operate = "";
    if(status==1){
        operate = '<span class="blackList">add to blacklist</span> ' +
            '<span class="del">delete</span> ';
    } else {
        operate = '<span class="removeBlack">remove from blacklist</span> ';
    }
    return $('<tr class="customerItem"> ' +
        '<td class="id">'+info.userId+'</td> ' +
        '<td class="name">'+info.name+'</td> ' +
        '<td class="tel">'+info.phone+'</td> ' +
        '<td class="address">'+info.address1+' ' + info.address2+' ' + info.address3+'</td> ' +
        '<td class="postCode">'+info.postCode+'</td> ' +
        '<td class="firstName">'+info.firstName+'</td> ' +
        '<td class="lastName">'+info.lastName+'</td> ' +
        '<td class="operate"> ' +
            operate +
        '</td> ' +
        '</tr>').data("userId", info.userId);
}

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var cStatus = getUrlParam("status");

if(cStatus==null) cStatus=0;
cStatus = parseInt(cStatus);
if(cStatus>1 || cStatus<0) cStatus = 0;

var $customerMain = $("#customerMain");
$customerMain.find(".customerTab")
    .eq(cStatus)
    .addClass("active");


var getCustomerItem = (function(){
    var loading = null,
        startId = 0;
    return function (cStatus, param) {
        if(loading) return ;
        var reqData = "count=20&customerType="+(1-2*cStatus);
        if(param){
            reqData +="&searchKey="+param.searchKey;
            loading = showLoading($customerForm);
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
            url: "/proxy/admin/customer/list",
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
                var $tbody = $customerList.find(".customerTable tbody");
                if(param && param.first){
                    $tbody.find(".customerItem").remove();
                    param.first = false;
                }
                for(var i=0; i<len; i++) {
                    $tbody.append(createCustomerList(data[i]));
                }
                startId = result.endId;
                if(startId!=-1){
                    $customerList.find(".more .showMore").removeClass("hidden");
                }
            } else if(status==300){
                location.href = loginUrl;
            }
        }).fail(function(result){
            tipsAlert("server error");
            if (loading) {
                loading.remove();
                loading = null;
            }
            result = {
                status: 200,
                startId: 1,
                data: [
                    {
                        userId: 10,
                        name: "dhgan yoyoo",
                        phone: "238409324",
                        address1: "HongkongIsland(HK)",
                        address2: "Chai wan",
                        address3: "wanli street No.19",
                        postCode: "729339",
                        firstName: "yalish ituode",
                        lastName: "yomi",
                        status: -1
                    }
                ]
            };
            var status = result.status;
            if(status==200){
                var data = result.data,
                    len = data.length;
                var $tbody = $customerList.find(".customerTable tbody");
                if(param && param.first){
                    $tbody.find(".customerItem").remove();
                    param.first = false;
                }
                for(var i=0; i<len; i++) {
                    $tbody.append(createCustomerList(data[i]));
                }
                startId = result.endId;
                if(startId!=-1){
                    $customerList.find(".more .showMore").removeClass("hidden");
                }
            } else if(status==300){
                location.href = loginUrl;
            }
        });
    }
})();

getCustomerItem(cStatus);

var $customerList = $("#customerList");

$customerList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getCustomerItem(cStatus);
});

$customerList.on("click", ".customerItem .blackList", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to add the customer to blacklist?", function(){
        addToBlackList(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

$customerList.on("click", ".customerItem .removeBlack", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to remove the customer from blacklist?", function(){
        removeBlack(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});

$customerList.on("click", ".customerItem .del", function(e){
    var _this = $(this);
    tipsConfirm("Are you sure want to delete the customer?", function(){
        deleteCustomer(_this);
    }, {
        "ok": "YES",
        "cancel": "NO"
    });
});


var addToBlackList = (function(){
    var loading = null;
    return function (_this) {
        var $customerItem = _this.parents(".customerItem"),
            userId = $customerItem.data("userId"),
            reqData = "userId="+userId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/customer/blacklist/adding",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $customerItem.remove();
                showSpinner("Add Success!", {
                    "callback": function () {
                        location.reload();
                    }
                });
            } else if(status==300){
                location.href = loginUrl;
            } else if(status==400){
                showSpinner("The customer has been deleted!", {
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
                showSpinner("The customer has been deleted!", {
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
        var $customerItem = _this.parents(".customerItem"),
            userId = $customerItem.data("userId"),
            reqData = "userId="+userId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/customer/blacklist/deleting",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $customerItem.remove();
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
            }*/
        });
    }
})();

var deleteCustomer = (function(){
    var loading = null;
    return function (_this) {
        var $customerItem = _this.parents(".customerItem"),
            userId = $customerItem.data("userId"),
            reqData = "userId="+userId;
        if(loading) return ;
        loading = showLoading(_this.parent());
        $.ajax({
            method: "post",
            url: "/proxy/admin/customer/delete",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                $customerItem.remove();
                showSpinner("Deleted!");
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
            /*result = {
                status: 200
            };
            var status = result.status;
            if(status==200){
                $customerItem.remove();
                showSpinner("Deleted!");
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

var $customerFilter = $("#customerFilter"),
    $customerForm = $customerFilter.find(".customerForm");

var param = null;
$customerForm.on("submit", (function(){
    return function(e){
        e.preventDefault();
        var _this = $(this),
            searchKey = _this[0].search.value;
        if(!searchKey) return;
        param = {
            searchKey: searchKey,
            first: true
        };
        getCustomerItem(cStatus, param);
    };
})());
