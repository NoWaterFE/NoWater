var host="http://123.206.100.98:16120",
    userInfo=null;
$.ajax({
    type: "post",
    url: host+"/customer/isLogin",
    dataType: "json",
    async: false
}).done(function (result) {
    if(result.status==200){
        userInfo = result.userInformation;
    }
}).fail(function (result) {
    result = {
        status: 200,
        userInformation: {
            name: "gdh",
            cartNum: 33
        }
    };
    if(result.status==200){
        userInfo = result.userInformation;
    }
});