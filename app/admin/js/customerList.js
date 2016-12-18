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

function createCustomerList(info) {
    return $('<tr class="customerItem"> ' +
        '<td class="id">'+info.userId+'</td> ' +
        '<td class="name">'+info.name+'</td> ' +
        '<td class="tel">'+info.telephone+'</td> ' +
        '<td class="address">'+info.address1+' ' + info.address2+' ' + info.address3+'</td> ' +
        '<td class="postCode">'+info.postCode+'</td> ' +
        '<td class="firstName">'+info.firstName+'</td> ' +
        '<td class="lastName">'+info.lastName+'</td> ' +
        '<td class="operate"> ' +
        '<span class="blackList">add to blacklist</span> ' +
        '<span class="del">delete</span> ' +
        '</td> ' +
        '</tr>');
}

var getCustomerItem = (function(){
    var loading = null,
        startId = 0;
    return function () {
        var reqData = "count=20&startId="+startId;
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "get",
            url: "/proxy/admin/customer/list",
            dataType: "json",
            data: reqData
        }).done(function(result){

        }).fail(function(result){
            result = {
                status: 200,
                data: [
                    {
                        userId: 10,
                        name: "dhgan yoyoo",
                        telephone: "238409324",
                        address1: "HongkongIsland(HK)",
                        address2: "Chai wan",
                        address3: "wanli street No.19",
                        postCode: "729339",
                        firstName: "yalish ituode",
                        lastName: "yomi",
                        status: 0
                    }
                ]
            };
            if (loading) {
                loading.remove();
                loading = null;
            }
            var data = result.data,
                len = data.length;
            var $tbody = $customerList.find(".customerTable tbody");
            for(var i=0; i<10; i++) {
                $tbody.append(createCustomerList(data[0]));
            }
            if(startId!=-1){
                $customerList.find(".more .showMore").removeClass("hidden");
            }
        });
    }
})();

getCustomerItem();

var $customerList = $("#customerList");

$customerList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getCustomerItem();
});
