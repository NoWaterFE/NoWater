var userInfo=null;
$.ajax({
    type: "get",
    url: "/proxy/shop-owner/status",
    dataType: "json",
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
    location.href = "../customer/index.html";
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