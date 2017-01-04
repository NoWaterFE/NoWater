var userInfo=null;
$.ajax({
    method: "post",
    url: "/proxy/customer/isLogin",
    dataType: "json",
    async: false
}).done(function (result) {
    if(result.status==200){
        userInfo = result.userInformation;
    }
}).fail(function (result) {
    /*result = {
        status: 200,
        userInformation: {
            name: "gdh",
            cartNum: 33
        }
    };
    if(result.status==200){
        userInfo = result.userInformation;
    }*/
});