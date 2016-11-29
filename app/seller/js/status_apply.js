var host="http://123.206.100.98:16120";
$.ajax({
    type: "post",
    url: host+"/shop-owner/status",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    async: false
}).done(function (result) {
    if(result.status==200) {
        location.href = "index.html";
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==500){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find(".applying").text("Sorry, your application is rejected by the administrator and you can apply again");
        })
    } else if(result.status==600){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find("#shopName").val(result.data[0].shopName);
            applyForm.find("#shopEmail").val(result.data[0].email);
            applyForm.find("#shopTel").val(result.data[0].telephone);
            applyForm.find("input").addClass("disabled").attr("disabled", true);
            applyForm.find(".applying").text("You are applying for a shop, please wait for the administrator to approve.");
        });
    }
}).fail(function () {
    alert("server error");
    location.href = "../customer";
    /*result = {
        status: 400,
        data: [{
            "shopName": "test2",
            "telephone": "62526523",
            "shopId": 1,
            "ownerId": 1,
            "email": "wk@qq.com",
            "status": 1
        }]
    };
    if(result.status==200) {
        location.href = "index.html";
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==500){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find(".applying").text("Sorry, your application is rejected by the administrator and you can apply again");
        })
    } else if(result.status==600){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find("#shopName").val(result.data[0].shopName);
            applyForm.find("#shopEmail").val(result.data[0].email);
            applyForm.find("#shopTel").val(result.data[0].telephone);
            applyForm.find("input").addClass("disabled").attr("disabled", true);
            applyForm.find(".applying").text("You are applying for a shop, please wait for the administrator to approve.");
        });
    }*/
});
