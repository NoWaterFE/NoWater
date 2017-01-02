var loginUrl = "login.html?redirectUrl="+encodeURIComponent(location.href);
var oldData;
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

_init_area();

var $infoForm = $("#infoForm");

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

function showInfo() {
    $.ajax({
        method: "get",
        url: "/proxy/customer/info/detail",
        dataType: "json"
    }).done(function (result) {
        var status = result.status;
        if(status == 200) {
            var data = result.data;
            $infoForm[0].name.value = data.name;
            $infoForm[0].firstName.value = data.firstName;
            $infoForm[0].lastName.value = data.lastName;
            $infoForm[0].telephone.value = data.phone;
            $infoForm[0].postCode.value = data.postCode;
            $infoForm[0].address3.value = data.address3;
            $infoForm[0].address1.value = data.address1;
            change(1);
            $infoForm[0].address2.value = data.address2;
            oldData = $infoForm.serialize();
        } else if(status == 300) {
            location.href = loginUrl;
        }
    }).fail(function (result) {
        tipsAlert("Server error!", function () {
            location.href = "index.html";
        });
        /*result = {
            status: 200,
            data: {
                userId: 1,
                name: "ghs",
                phone: 1234568,
                address1: "Kowloon(KLN)",
                address2: "Jordan Road",
                address3: "Xidian",
                postCode: 710100,
                firstName: "gao",
                lastName: "haishuo",
            }
        };
        var status = result.status;
        if(status == 200) {
            var data = result.data;
            $infoForm[0].name.value = data.name;
            $infoForm[0].firstName.value = data.firstName;
            $infoForm[0].lastName.value = data.lastName;
            $infoForm[0].telephone.value = data.telephone;
            $infoForm[0].postCode.value = data.postCode;
            $infoForm[0].address3.value = data.address3;
            $infoForm[0].address1.value = data.address1;
            change(1);
            $infoForm[0].address2.value = data.address2;
            oldData = $infoForm.serialize();
        } else if(status == 300) {
            location.href = loginUrl;
        }*/
    });
}

showInfo();

var telReg = /^\d{8}$/;

function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

$infoForm.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

var save = (function(){
    var tips = null;
    return function(e) {
        e.preventDefault();
        if(tips) return;
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
        if (sendData != oldData) {
            tips = showLoading($(this));
            $.ajax({
                type: "post",
                url: "/proxy/customer/info/edit",
                dataType: "json",
                data: sendData
            }).done(function (result) {
                if (tips) {
                    tips.remove();
                    tips = null;
                }
                if (result.status == 200) {
                    showSpinner("Edit Successful.");
                } else if (result.status == 300) {
                    location.href = loginUrl;
                }
            }).fail(function (result) {
                if (tips) {
                    tips.remove();
                    tips = null;
                }
                tipsAlert("Server error!");
                /*result = {
                    status: 200
                };
                if (result.status == 200) {
                    showSpinner("Edit Successful.");
                } else if (result.status == 300) {
                    location.href = loginUrl;
                }*/
            });
        } else {
            tipsAlert("You didn't modify anything!");
        }
    }
})();


$infoForm.on("submit", save);

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
