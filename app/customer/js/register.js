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

var host="http://123.206.100.98:16120";
var registerForm = $("#registerForm");
registerForm.on("submit", function (e) {
    var _this = $(this);
    var tips = showLoading(_this);
    e = window.event || e;
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var name = this.name.value,	//userName
        password = this.password.value,
        confirm = this.confirm.value,
        telephone = this.telephone.value,
        address1 = this.area.value,	//area
        address2 = this.district.value,	//district
        address3 = this.address.value;	//address from input
    if (confirm != password) {
    	_this.find(".register").text("Please input the same password!");
    	return;
    }

    var data = "name=" + name + "&password=" + $.md5(password) +"&telephone=" + telephone 
    + "&address1=" + address1 +"&address2=" + address2 +"&address3=" + address3;
 
    $.ajax({
        type: "post",
        url: host+"/customer/register",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: data
    }).done(function(result){
        if(tips) tips.remove();
        if(result.status==200){
            _this.find(".register").text("register successful.");
            var url = getUrlParam("redirectUrl");
           if(url) {
            location.href = decodeURIComponent(url);
           } else {
            location.href = "login.html";
           }
        } else if(result.status==300){
            _this.find(".register").text("user name has been used!");
        } else if(result.status==400) {
        	_this.find(".register").text("illegal telephone number!");
        } else if (result.status==500) {
        	_this.find(".register").text("illegal address!");
        }
    }).fail(function(result) {
        if(tips) tips.remove();
       //  result = {
       //      status: 200
       //  };
       // if(result.status==200){
       //  	_this[0].reset();
       //      _this.find(".register").text("register successful.");
       //  } else if(result.status==300){
       //      _this.find(".register").text("user name has been used!");
       //  } else if(result.status==400) {
       //  	_this.find(".register").text("illegal telephone number!");
       //  } else if (result.status==500) {
       //  	_this.find(".register").text("illegal address!");
       //  }
    });

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
                "top": $relative.offset().top-$(window).scrollTop()+$relative.outerHeight()/2,
                "left": $relative.offset().left-$(window).scrollLeft()+$relative.outerWidth()/2,
                "margin-left": -$tips.outerWidth()/2,
                "margin-top": -$tips.outerHeight()/2,
                "visibility": "visible"
            });
        });
    return $tips;
}

$(window).on("scroll", function(){
   var header = $("header"),
       _this = $(this);
    header.css("left", -_this.scrollLeft());
});
