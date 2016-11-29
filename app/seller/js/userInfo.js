var host="http://123.206.100.98:16120",
    userInfo=null;
$.ajax({
    type: "post",
    url: host+"/shop-owner/status",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    async: false
}).done(function (result) {
    if(result.status==200) { //已注册
        userInfo = result.data[0];
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else {
        location.href = "apply.html";
    }
}).fail(function (result) {
    alert("server error");
    location.href = "../customer";
    /*result = {
        status: 200,
        data: [{
            "shopName": "test2",
            "telephone": "62526523",
            "shopId": 1,
            "ownerId": 1,
            "email": "wk@qq.com",
            "status": 1
        }]
    };
    if(result.status==200) { //已注册
        userInfo = result.data[0];
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else {
        location.href = "apply.html";
    }*/
});