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

    var operate = ""
    if(data.status==1){
        data.statusText = "Pending payment";
    } else if(data.status==2){
        data.statusText = "Already paid";
        operate = delived;
    } else if(data.status==3){
        data.statusText = "To be received";
    } else if(data.status==4){
        data.statusText = "Success order<br />(to be commented)";
    } else if(data.status==5){
        data.statusText = "Success order";
    } else if(data.status==6){
        data.statusText = "Order canceled";
    }
    var len = data.products.length,
        orderData = null;
    for(var i=0; i<len; i++){
        orderData += '<tr class="orderData"> ' +
            '<td class="product"> ' +
            '<a href="javascript:" class="clearfix productLink"> ' +
            '<img src="'+data.products[i].photoIdUrl+'"> ' +
            '<span class="productName">'+data.products[i].productName+'</span> ' +
            '</a> ' +
            '</td> ' +
            '<td class="price">'+data.products[i].price+'</td> ' +
            '<td class="amount">'+data.products[i].amount+'</td> ';
        if(i==0){
            orderData += '<td class="totalPrice">' +
                'HK$'+data.totalPrice +
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
        } else {
            orderData +='<td class="totalPrice"></td> ' +
                '<td class="status"></td> ' +
                '<td class="operate"></td>' +
                '</tr>';
        }
    }
    return $('<tbody class="orderItem"> ' +
        orderData +
        '</tbody>')
}

var postOrder = (function(){
    var loading = null;
    return function (orderId) {
        if(loading) return ;
        loading = showLoading($(".more"));
        $.ajax({
            method: "get",
            url: "",
            dataType: "json"
        }).done(function(result){

        }).fail(function(result){
            result = {
                data: [
                    {
                        time: "2016-9-05 16:30:06",
                        orderId: "2662774641999118",
                        shopName: "MONEYBACK REWARD",
                        status: 3,
                        totalPrice: "999.99",
                        products: [
                            {
                                photoIdUrl: "imgs/product01a.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "333.33",
                                amount: 1
                            },
                            {
                                photoIdUrl: "imgs/1.jpg",
                                productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                                price: "666.66",
                                amount: 2
                            }
                        ]
                    }
                ]
            };
            if(loading){
                loading.remove();
                loading = null;
            }
            var $orderList = $("#orderList"),
                $orderTable = $orderList.find(".orderTable");
            result.data[0].status = orderId;
            $orderTable.append(createOrderItem(result.data[0]));
        });
    };
})();

var orderId = getUrlParam("orderId");
if(orderId){
    postOrder(orderId);
} else {
    location.href = "index.html";
}