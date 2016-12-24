
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

var check = location.search,
    reqData = check.substr(1);

$.ajax({
    method: "post",
    url: "/proxy/shop-owner/email/confirming",
    dataType: "json",
    data: reqData
}).done(function (result) {
    var status = result.status,
        $result = $("#result");
    if(status==200) {
        $result.find(".resinfo").text(" success, and you will go to login page after 5s.");
        $result.append("<a href='login.html'>click here, go to login page immediately</a>")
    } else {
        $result.find(".resinfo").text(" fail, and you will go to login page after 5s.");
        $result.append("<a href='login.html'>click here, go to login page immediately</a>")
    }
    setTimeout(function(){
        location.href = "login.html";
    }, 5000);
}).fail(function(result){
    alert("server error!");
    /*result = {
        status: 200
    };
    var status = result.status,
        $result = $("#result");
    if(status==200) {
        $result.find(".resinfo").text(" success, and you will go to login page after 5s.");
        $result.append("<a href='login.html'>click here, go to login page immediately</a>")
    } else {
        $result.find(".resinfo").text(" fail, and you will go to login page after 5s.");
        $result.append("<a href='login.html'>click here, go to login page immediately</a>")
    }*/
});