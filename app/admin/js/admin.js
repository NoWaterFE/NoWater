$(function () {
    $(window).on("scroll", function(){
       var header = $("header"), _this = $(this);
       header.css("left", -_this.scrollLeft());
    });


	var host = "http://123.206.100.98:16120";
    var login = $("#login");

	login.on("submit", function (e) {
	    var _this = $(this);
	    var tips = showLoading(_this);
	    e = window.event || e;
	    if (e && e.preventDefault) {
	        e.preventDefault();
	    } else {
	        e.returnValue = false;
	    };
	 
	    var warnInfo=_this.find("span").eq(0);
	    var name = $('#idmName').val();
	    var pwd = $("#idmPsd").val();
        
        warnInfo.text('');
	    if(name == '' ){	
	        warnInfo.text('warning:username error!');	 
	  	}else if(pwd == ''){
            warnInfo.text('warning:password error!');
	    }else{
	  	    $.ajax({
	  	    	xhrFields: {
                            withCredentials: true
                },
		        type: "post",
		        url: host+"/admin/login",
		        data: "name="+name+"&password="+$.md5(pwd),
		        dataType: "json"
	    }).done(function (result) {
	    	if(tips) tips.remove();
		    if(result.status == 200){
		   	    var url = getUrlParam("redirectUrl");
		   	    if(url){
		   	   	    location.href = decodeURIComponent(url);
		   	    }else{
		   	   	    location.href = "./index.html";
		   	    }
		    }else if(result.status == 300){
			    warnInfo.text('username or password error!');
		    };
	    }).fail(function (result) {
	    	if(tips) tips.remove();
	    	warnInfo.text('Server or anothers error!');
	    });
	  }
	});                      
	function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对�?
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数�?
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
});