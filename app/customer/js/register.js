function Dsy(){
	this.Items = {};
}
Dsy.prototype.add = function(id,iArray){
	this.Items[id] = iArray;
}
Dsy.prototype.Exists = function(id){
	if(typeof(this.Items[id]) == "undefined") return false;
	return true;
}

function change(v){
	var str="0";
	for(i=0;i<v;i++){
		str+=("_"+(document.getElementById(s[i]).selectedIndex));
	};
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
	}//End with
}

var dsy = new Dsy();

dsy.add("0",["HongkongIsland(HK)","NT_Island(NT)","Kowloon(KLN)"]);
dsy.add("0_0",["Aberdeen", "Admiralty", "Ap Lei Chau", "Big Wave Bay", "Causeway Bay", "Central", "Central Sheung Wan", "Central South", "Chai Wan", "Gloucester Road", "Happy Valley", "Harbour Road", "Jardine's Lookout", "Kennedy Town", "Lai Tak Tsuen", "Mid-Levels", "Mid-Levels West", "North Point", "Pok Fu Lam", "Quarry Bay", "Sai Wan", "Shau Kei Wan", "Shek O", "Sheung Wan West", "Siu Sai Wan", "So Kon Po", "Southern District", "Stanley", "Tai Hang Road", "The Peak", "Tim Mei Ave", "Tin Hau", "Wah Fu", "Wan Chai", "Wong Chuk Hang"]);
dsy.add("0_1",["Chek Lap Kok", "Chinese University", "Clear Water Bay", "Discovery Bay", "Fairview Park", "Fanling", "Fo Tan", "HKUST", "Kwai Chung", "Long Ping", "Ma On Shan", "Ma Wan", "Pat Heung", "Sai Kung (North)", "Sai Kung (South)", "Science Park", "Sha Tin", "Sheung Shui", "Siu Lek Yuen", "Tai Po", "Tai Wai", "Tin Shui Wai", "Tseung Kwan O", "Tsing Yi", "Tsuen Wan", "Tuen Mun", "Tung Chung", "Wu Kai Sha", "Yuen Long"]);
dsy.add("0_2",["Cheung Sha Wan", "Choi Wan", "Diamond Hill", "Ho Man Tin", "Hung Hom", "Jordan", "Jordan Road", "Kowloon Bay", "Kowloon City", "Kowloon Tong", "Kwun Tong", "La Salle Road", "Lai Chi Kok", "Lam Tin", "Lok Fu", "Ma Tau Wai", "Mei Foo", "Mong Kok", "Ngau Chi Wan", "Ngau Tau Kok", "Rainbow Village", "San Po Kong", "Sau Mau Ping", "Sham Shui Po", "Shek Kip Mei", "Tai Kok Tsui", "To Kwa Wan", "Tsim Sha Tsui", "Tsz Wan Shan", "Wong Tai Sin", "Yau Ma Tei", "Yau Tong"]);

var s=["area","district"];

function _init_area(){  
	for(i=0;i<s.length-1;i++){
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
        .text(msg)
        .end();
}

var registerForm = $("#registerForm");
registerForm.on("submit", (function(){
    var tips = null;
    return function (e) {
        var _this = $(this);
        e.preventDefault();
        var $confirm = _this.find(".confirm"),
            $name = _this.find(".name"),
            $password = _this.find(".password"),
            $address = _this.find(".address"),
            $firstName = _this.find(".firstName"),
            $lastName = _this.find(".lastName"),
            $tel = _this.find(".telephone"),
            $postCode = _this.find(".postCode");

        var name = this.name.value,	//userName
            password = this.password.value,
            confirm = this.confirm.value,
            telephone = this.telephone.value,
            firstName = this.firstName.value,
            lastName = this.lastName.value,
            postCode = this.postCode.value,
            address1 = this.address1.value,
            address2 = this.address2.value,
            address3 = this.address3.value;	//address from input

        if (!name) {
            addError($name, "User name can't be empty!");
            return;
        }
        if (!password) {
            addError($password, "Password can't be empty!");
            return;
        }

        if (confirm != password) {
            addError($confirm, "Please input the same password!");
            return;
        }

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

        if (!telReg.test(telephone)) {
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


        var data = "name=" + name + "&password=" + $.md5(password) +"&telephone=" + telephone
            + "&address1=" + address1 +"&address2=" + address2 +"&address3=" + address3
            +"&firstName=" + firstName +"&lastName=" + lastName +"&postCode=" + postCode;

        tips = showLoading(_this);

        $.ajax({
            type: "post",
            url: "/proxy/customer/register",
            dataType: "json",
            data: data
        }).done(function(result){
            if(tips) {
                tips.remove();
                tips = null;
            }
            if(result.status==200){
                var url = getUrlParam("redirectUrl");
                showSpinner("register successful.", {
                    callback: function () {
                        if(url) {
                            location.href = decodeURIComponent(url+"");
                        } else {
                            location.href = "login.html";
                        }
                    },
                    timeout: 1000
                });
            } else if(result.status==300){
                addError($name, "User name has been used!");
            } else if(result.status==400) {
                addError($tel, "Illegal telephone number!");
            } else if (result.status==500) {
                addError($address, "Illegal address!");
            }
        }).fail(function(result) {
            if(tips) {
                tips.remove();
                tips = null;
            }
            tipsAlert("Server error!");
            /*result = {
             status: 200
            };
            if(result.status==200){
                var url = getUrlParam("redirectUrl");
                showSpinner("register successful.", {
                    callback: function () {
                        if(url) {
                            location.href = decodeURIComponent(url+"");
                        } else {
                            location.href = "login.html";
                        }
                    },
                    timeout: 1000
                });
            } else if(result.status==300){
                addError($name, "User name has been used!");
            } else if(result.status==400) {
                addError($tel, "Illegal telephone number!");
            } else if (result.status==500) {
                addError($address, "Illegal address!");
            }*/
        });
    }
})());

registerForm.on("input", ".input-item input", function () {
   var _this = $(this);
   _this.parent().removeClass('error');
});

function getUrlParam(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
   var r = window.location.search.substr(1).match(reg); //匹配目标参数
   if (r != null) return r[2]; return null; //返回参数值
  }
function showLoading($relative) {
    var $tips=$relative.siblings(".loadingImg");
    if($tips.length>0) $tips.remove();
    $tips= $("<div class='loadingImg'></div>");
    $tips.appendTo($relative.parent())
        .ready(function () {
            $tips.css({
                "top": $relative.offset().top+$relative.outerHeight()/2,
                "left": $relative.offset().left+$relative.outerWidth()/2,
                "margin-left": -190,
                "margin-top": -$tips.outerHeight()/2,
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

$(window).on("scroll", function(){
   var header = $("header"),
       _this = $(this);
    header.css("left", -_this.scrollLeft());
});
