// header添加事件
(function () {
    //获取登录信息可能不需要
    $.ajax({
        method: "post",
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
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

function　createOrderItem(data){
    var product = data.product,
        shop = product.shop;
    var orderData = '<tr class="orderData"> ' +
        '<td class="product"> ' +
        '<a href="productDetail.html?id='+product.productId+'" target="_blank" class="clearfix productLink"> ' +
        '<img src="'+product.photo[0]+'"> ' +
        '<span class="productName">'+product.productName+'</span> ' +
        '</a> ' +
        '</td> ' +
        '<td class="price">HK$'+product.price.toFixed(2)+'</td> ' +
        '<td class="amount">'+data.num+'</td> ' +
        '<td class="totalPrice">' +
        'HK$'+data.sumPrice.toFixed(2) +
        '</td>' +
        '</tr> ';
    return $('<tbody class="orderItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="orderHeader"> ' +
        '<td colspan="6"> ' +
        '<span class="shopName"> SHOP: ' +
        '<a href="store.html?shopId='+shop.shopId+'" target="_blank">'+shop.shopName+'</a> ' +
        '</span> ' +
        '</td> ' +
        '</tr> ' +
        orderData +
        '</tbody>')
}

var $orderList = $("#orderList"),
    $orderSubmit = $orderList.find(".orderSubmit"),
    orderIdList = getUrlParam("orderIdList"),
    sumPrice = 0;
(function(){
    $.ajax({
        method: "post",
        url: "/proxy/order/detail",
        data: "orderIdList="+orderIdList+"&status=-3"
    }).done(function (result) {
        var status = result.status;
        if(status==200){
            var data = result.data,
                len = data.length,
                $orderTable = $orderList.find('.orderTable');
            for(var i=0; i<len; i++){
                $orderTable.append(createOrderItem(data[i]));
                sumPrice += data[i].sumPrice;
            }
            var $orderSubmit = $orderList.find(".orderSubmit");
            $orderSubmit.show()
                .find('.price').text(sumPrice.toFixed(2));
        } else if(status==300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }
    }).fail(function (result) {
        tipsAlert("server error!");
        /*result = {
            status: 200,
            data: [
                {
                    orderId: "2662774641999118",
                    sumPrice: 999.99,
                    address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
                    num: 3,
                    product: {
                        shop: {
                            shopId: 1,
                            shopName: "MONEYBACK REWARD"
                        },
                        photo: [
                            "imgs/product03a.jpg"
                        ],
                        productId: 1,
                        productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                        price: 333.33
                    }
                },
                {
                    orderId: "2662774641999118",
                    sumPrice: 999.99,
                    address: "Dhgan, 18789427353, HongkongIsland(HK) Chai Wan Wanli",
                    num: 3,
                    product: {
                        shop: {
                            shopId: 1,
                            shopName: "MONEYBACK REWARD"
                        },
                        photo: [
                            "imgs/product03a.jpg"
                        ],
                        productId: 1,
                        productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                        price: 333.33
                    }
                }
            ]
        };
        var status = result.status;
        if(status==200){
            var data = result.data,
                len = data.length,
                $orderTable = $orderList.find('.orderTable');
            for(var i=0; i<len; i++){
                $orderTable.append(createOrderItem(data[i]));
                sumPrice += data[i].sumPrice;
            }
            var $orderSubmit = $orderList.find(".orderSubmit");
            $orderSubmit.show()
                .find('.price').text(sumPrice.toFixed(2));
        } else if(status==300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }*/
    });
}());

var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);

var submitOrder = (function(){
    var loading = null;
    return function(){
        if(loading) return;
        var addressId = $addressList.find("input[name='addressId']:checked").val();
        if(!addressId) {
            tipsAlert("Please add address", function () {
                $(window).scrollTop(0);
            });
            return;
        }
        loading = showLoading($orderSubmit.find(".orderOperate"));
        var data = "orderIdList="+orderIdList+"&addressId="+addressId;
        $.ajax({
            method: "post",
            url: "/proxy/order/confirm",
            data: data
        }).done(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                location.href = "pay.html?orderIdList=" + orderIdList + "&sumPrice=" + result.sumPrice;
            } else if(status==300) {
                location.href = loginUrl;
            } else if(status==400) {
                tipsAlert("The order has been submitted, please do not resubmit!");
            } else if(status==2400) {
                tipsAlert("There is a product off the shelf");
            } else if(status==2500) {
                tipsAlert("There is a product that has not enough stock");
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("server error!");
            /*result = {
                status: 200,
                sumPrice: 233
            };
            var status = result.status;
            if (status == 200) {
                location.href = "pay.html?orderIdList=" + orderIdList + "&sumPrice=" + result.sumPrice;
            } else if (status == 300) {
                location.href = loginUrl;
            } else if(status==400) {
                tipsAlert("The order has been submitted, please do not resubmit!");
            } else if(status==2400) {
                tipsAlert("There is a product off the shelf");
            } else if(status==2500) {
                tipsAlert("There is a product that has not enough stock");
            } else {
                tipsAlert("server error!");
            }*/
        });
    };
})();

$orderSubmit.on("click", ".confirmBtn", submitOrder);


var $addressList = $("#addressList");

function  createAddressItem (data, first){
    if(first==0) {
        first = "active";
    } else {
        first = "";
    }
    var $addressItem =  $('<li class="addressItem '+first+'"> ' +
        '<label for="addressId'+data.addressId+'"> ' +
        '<input type="radio" id="addressId'+data.addressId+'" class="addressId" value="'+data.addressId+'" name="addressId" '+(first ? "checked" : "")+'> ' +
        '<span class="text">'+data.firstName+' '+data.lastName+'; ' +
        data.telephone+'; ' +
        data.address1+' '+data.address2+' '+data.address3+'; ' +
        data.postCode +
        '</span> ' +
        '</label> ' +
        '</li>');
    if(first) {
        $orderSubmit.find('.address')
            .text($addressItem.find(".text").text());
    }
    return $addressItem;
}

function getAddress() {
    var loading = showLoading($addressList.siblings(".addAddress"));
    $.ajax({
        method: "get",
        url: "/proxy/customer/address/list",
        dataType: "json",
        cache: false
    }).done(function(result){
        if(loading) loading.remove();
        var status = result.status;
        if (status == 200) {
            var data = result.data,
                len = data.length;
            $addressList.empty();
            for(var i=0; i<len; i++){
                $addressList.append(createAddressItem(data[i], i));
            }
        } else if (status == 300) {
            location.href = loginUrl;
        }
    }).fail(function(result){
        tipsAlert("server error");
        /*if(loading) loading.remove();
        result = {
            status: 200,
            data: [
                {
                    "lastName": "jk",
                    "address3": "//",
                    "address2": "Aberdeen",
                    "address1": "HongkongIsland(HK)",
                    "telephone": "69237498",
                    "userId": 1,
                    "addressId": 1,
                    "firstName": "g",
                    "isDefault": 1,
                    "postCode": "7238947",
                    "isDel": 0
                },
                {
                    "lastName": "jk23",
                    "address3": "//",
                    "address2": "Aberdeen",
                    "address1": "HongkongIsland(HK)",
                    "telephone": "692317498",
                    "userId": 1,
                    "addressId": 2,
                    "firstName": "g",
                    "isDefault": 1,
                    "postCode": "23438947",
                    "isDel": 0
                }
            ]
        };
        var status = result.status;
        if (status == 200) {
            var data = result.data,
                len = data.length;
            $addressList.empty();
            for(var i=0; i<len; i++){
                $addressList.append(createAddressItem(data[i], i));
            }
        } else if (status == 300) {
            location.href = loginUrl;
        }*/
    });
}
getAddress();

$addressList.on("change", ".addressId", function (e) {
    var _this = $(this),
        $addressItem = _this.parents(".addressItem");
    $addressItem.addClass("active")
        .siblings()
        .removeClass("active");
    $orderSubmit.find('.address')
        .text(_this.siblings(".text").text());
});


var $modifyAddress = $("#modifyAddress");
function Dsy(){
    this.Items = {};
}
Dsy.prototype.add = function(id,iArray){
    this.Items[id] = iArray;
};
Dsy.prototype.Exists = function(id){
    if(typeof(this.Items[id]) == "undefined") return false;
    return true;
};

var dsy = new Dsy();

dsy.add("0",["HongkongIsland(HK)","NT_Island(NT)","Kowloon(KLN)"]);
dsy.add("0_0",["Aberdeen", "Admiralty", "Ap Lei Chau", "Big Wave Bay", "Causeway Bay", "Central", "Central Sheung Wan", "Central South", "Chai Wan", "Gloucester Road", "Happy Valley", "Harbour Road", "Jardine's Lookout", "Kennedy Town", "Lai Tak Tsuen", "Mid-Levels", "Mid-Levels West", "North Point", "Pok Fu Lam", "Quarry Bay", "Sai Wan", "Shau Kei Wan", "Shek O", "Sheung Wan West", "Siu Sai Wan", "So Kon Po", "Southern District", "Stanley", "Tai Hang Road", "The Peak", "Tim Mei Ave", "Tin Hau", "Wah Fu", "Wan Chai", "Wong Chuk Hang"]);
dsy.add("0_1",["Chek Lap Kok", "Chinese University", "Clear Water Bay", "Discovery Bay", "Fairview Park", "Fanling", "Fo Tan", "HKUST", "Kwai Chung", "Long Ping", "Ma On Shan", "Ma Wan", "Pat Heung", "Sai Kung (North)", "Sai Kung (South)", "Science Park", "Sha Tin", "Sheung Shui", "Siu Lek Yuen", "Tai Po", "Tai Wai", "Tin Shui Wai", "Tseung Kwan O", "Tsing Yi", "Tsuen Wan", "Tuen Mun", "Tung Chung", "Wu Kai Sha", "Yuen Long"]);
dsy.add("0_2",["Cheung Sha Wan", "Choi Wan", "Diamond Hill", "Ho Man Tin", "Hung Hom", "Jordan", "Jordan Road", "Kowloon Bay", "Kowloon City", "Kowloon Tong", "Kwun Tong", "La Salle Road", "Lai Chi Kok", "Lam Tin", "Lok Fu", "Ma Tau Wai", "Mei Foo", "Mong Kok", "Ngau Chi Wan", "Ngau Tau Kok", "Rainbow Village", "San Po Kong", "Sau Mau Ping", "Sham Shui Po", "Shek Kip Mei", "Tai Kok Tsui", "To Kwa Wan", "Tsim Sha Tsui", "Tsz Wan Shan", "Wong Tai Sin", "Yau Ma Tei", "Yau Tong"]);

var s=["area","district"];


function change(v){
    var str="0";
    for(var i=0;i<v;i++){
        str+=("_"+(document.getElementById(s[i]).selectedIndex));
    }
    var ss=document.getElementById(s[v]);
    with(ss){
        length = 0;
        if(dsy.Exists(str)){
            ar = dsy.Items[str];
            for(i=0;i<ar.length;i++){
                options[length]=new Option(ar[i],ar[i]);
            }//end for
            options[0].selected = true;
        }
        if(++v<s.length){change(v);}
    }
}

function _init_area(){
    for(var i=0;i<s.length-1;i++){
        document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
    }
    change(0);
}

_init_area();

var telReg = /^\d{8}$/;

function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

$modifyAddress.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$modifyAddress.on("click", ".cancel", function (e) {
    var $delegateTarget = $(e.delegateTarget);
    $delegateTarget[0].reset();
    $delegateTarget.find(".error")
        .removeClass("error")
        .end()
        .parent().hide();
});

$modifyAddress.on("submit", (function(){
    var loading = null;
    return function(e) {
        e.preventDefault();
        if(loading) return;
        var _this = $(this),
            $firstName = _this.find(".firstName"),
            $lastName = _this.find(".lastName"),
            $tel = _this.find(".telephone"),
            $postCode = _this.find(".postCode"),
            $address = _this.find(".address"),
            telephone = this.telephone.value,
            firstName = this.firstName.value,
            lastName = this.lastName.value,
            postCode = this.postCode.value,
            address1 = this.address1.value;	//address from input
            address2 = this.address2.value;	//address from input
            address3 = this.address3.value;	//address from input
        if(!firstName) {
            addError($firstName, "First name can't be empty!");
            return;
        }
        if(!lastName) {
            addError($lastName, "Last name can't be empty!");
            return;
        }
        if(!telephone) {
            addError($tel, "Telephone can't be empty!");
            return;
        }
        if(!telReg.test(telephone)) {
            addError($tel, "Error telephone!");
            return;
        }
        if(!postCode) {
            addError($postCode, "Post Code can't be empty!");
            return;
        }
        if(!address3) {
            addError($address, "Address can't be empty!");
            return;
        }
        var sendData = _this.serialize();
        loading = showLoading($(this));
        $.ajax({
            type: "post",
            url: "/proxy/customer/address/edit",
            dataType: "json",
            data: sendData
        }).done(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if (status == 200) {
                _this.parent().hide();
                showSpinner("Successful.");
                getAddress();
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }
        }).fail(function (result) {
            if (loading) {
                loading.remove();
                loading = null;
            }
            tipsAlert("Server error!");
            /*result = {
                status: 200
            };
            var status = result.status;
            if (status == 200) {
                _this.parent().hide();
                showSpinner("Successful.");
                getAddress();
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("Server error!");
            }*/
        });
    }
})());

var $addAddress = $(".addAddress");

$addAddress.on("click", function(){
    var $modifyPop = $(".modifyPop");
    change(1);
    $modifyPop.find(".title")
        .text("Add New Address")
        .end().show();
});