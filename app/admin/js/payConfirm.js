var $logoutBtn = $("#logoutBtn");

$logoutBtn.click(function () {
    $.ajax({
        method: "get",
        url: "/proxy/admin/loginout",
        cache: false
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

function createPayItem(info){
    return $('<tr class="payItem"> ' +
        '<td class="time">'+info.time+'</td> ' +
        '<td class="payNo">'+info.payId+'</td> ' +
        '<td class="nick">'+info.nick+'</td> ' +
        '<td class="price">'+info.sumPrice.toFixed(2)+'</td> ' +
        '<td class="operate"> ' +
            '<span class="confirmP">Confirm payment</span> ' +
        '</td> ' +
        '</tr>').data("payId", info.payId);
}

var getPayItem = (function(){
    var loading = null,
        startId = 0;
    return function () {
        var reqData = "count=10&startId="+startId;
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "get",
            url: "/proxy/",
            dataType: "json",
            data: reqData,
            cache: false
        }).done(function(result){

        }).fail(function(result){
            result = {
                status: 200,
                data: [
                    {
                        time: "2016.11.11 14:20:34",
                        payId: 2333,
                        sumPrice: 99999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.12 11:20:32",
                        payId: 2334,
                        sumPrice: 66999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.13 14:20:11",
                        payId: 2335,
                        sumPrice: 234999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.14 14:20:23",
                        payId: 2336,
                        sumPrice: 237966,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.11 14:20:34",
                        payId: 2333,
                        sumPrice: 99999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.12 11:20:32",
                        payId: 2334,
                        sumPrice: 66999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.13 14:20:11",
                        payId: 2335,
                        sumPrice: 234999,
                        nick: 'hello kitty'
                    },
                    {
                        time: "2016.11.14 14:20:23",
                        payId: 2336,
                        sumPrice: 237966,
                        nick: 'hello kitty'
                    }
                ]
            };
            if (loading) {
                loading.remove();
                loading = null;
            }
            var data = result.data,
                len = data.length,
                $tbody = $payList.find(".payTable tbody");
            for(var i=0; i<len; i++) {
                $tbody.append(createPayItem(data[i]));
            }
            if(startId!=-1){
                $payList.find(".more .showMore").removeClass("hidden");
            }
        });
    }
})();

getPayItem();

var $payList = $("#payList");

$payList.on("click", ".more .showMore", function(){
    var _this = $(this);
    _this.addClass("hidden");
    getPayItem();
});

$payList.on("click", ".payItem .confirmP", function(e){
   alert($(this).parents(".payItem").data("payId"));
});

