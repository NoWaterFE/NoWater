var host="http://123.206.100.98:16120",
    userInfo=null;
$.ajax({
    type: "post",
    url: host+"/shop-owner/status",
    dataType: "json",
    async: false
}).done(function (result) {
    if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==400 || result.status==500){
        location.href="apply.html";
    } else if(result.status==200){
        userInfo = result.userInformation;
    }
}).fail(function (result) {
    console.log(result);
    result = {
        status: 200,
        userInformation: {
            name: "gdh",
            cartNum: 33
        }
    };
    if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==400 || result.status==500){
        location.href="apply.html";
    } else if(result.status==200){
        userInfo = result.userInformation;
    }
});