var applyListSet = $("#applyListSet");

function createApplyList(list) {
    var r = $('<li class="applyList"> ' +
        '<table> ' +
        '<tbody> ' +
        '<tr> ' +
        '<th class="big">shopName</th> ' +
        '<th>telephone</th> ' +
        '<th>shopId</th> ' +
        '<th>ownerId</th> ' +
        '<th class="big">email</th> ' +
        '<th class="approve operate">approve</th> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>'+list.shopName+'</td> ' +
        '<td>'+list.telephone+'</td>' +
        '<td>'+list.shopId+'</td> ' +
        '<td>'+list.ownerId+'</td> ' +
        '<td>'+list.email+'</td>' +
        '<td class="reject operate">reject</td> ' +
        '</tr>' +
        '</tbody> ' +
        '</table> ' +
        '</li>');
    r.data("shopId", list.shopId);
    return r;
}

$.ajax({
    method: "get",
    url: "/proxy/admin/shop/applyList",
    dataType: "json"
}).done(function(result){
    if(result.status==200){
        var list = result.data;
        for(var len = list.length, i=0; i<len; i++ ){
            applyListSet.append(createApplyList(list[i]));
        }
    } else if(result.status==300){
        location.href = "login.html";
    }
}).fail(function (result) {
    //alert("server error");
    //location.href = "login.html";
    result = {"status":200,"data":[{"shopName":"wukai-SHOP","telephone":"65204525","shopId":3,"ownerId":7,"email":"123@qq.com","status":0},{"shopName":"nolon","telephone":"96666666","shopId":5,"ownerId":16,"email":"964886469@qq.com","status":0},{"shopName":"takeashower","telephone":"96488888","shopId":6,"ownerId":18,"email":"964886469@qq.com","status":0}]};
    if(result.status==200){
        var list = result.data;
        for(var len = list.length, i=0; i<len; i++ ){
            applyListSet.append(createApplyList(list[i]));
        }
    } else if(result.status==300){
        location.href = "login.html";
    }

});

applyListSet.on("click", ".applyList .operate", function () {
    var _this = $(this);
    var behavior = -1;
    if(_this.hasClass("approve")){
        behavior = 1;
    }
    var shopId = _this.parents(".applyList").data("shopId");
    $.ajax({
        method: "post",
        url: "/proxy/admin/shop/handle",
        data: "shopId="+shopId+"&behavior="+behavior,
        dataType: "json"
    }).done(function(result){
        if(result.status==200){
            location.reload();
        } else if(result.status==300){
            location.href = "login.html";
        }
    }).fail(function (result) {
        alert("server error");
        location.href = "login.html";
        /*result = {
         status: 200
         };
         if(result.status==200){
         location.reload();
         } else if(result.status==300){
         location.href = "login.html";
         }*/
    });
});

var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/loginout"
    }).done(function(){
        delCookie("admin_token");
        location.href = "login.html";
    }).fail(function () {
        delCookie("admin_token");
        location.href = "login.html";
    });
});


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
    config = $.extend(config, def);
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