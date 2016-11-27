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
    } else if(result.status==400){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find("input").addClass("disabled").attr("disabled", true);
            applyForm.find(".applying").text("You are applying for a shop, please wait for the administrator to approve.");
        });
    } else if(result.status==500){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find(".applying").text("Sorry, your application is rejected by the administrator and you can apply again");
        })
    }
}).fail(function (result) {
    console.log(result);
    result = {
        status: 200
    };
    if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==400){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find("input").addClass("disabled").attr("disabled", true);
            applyForm.find(".applying").text("You are applying for a shop, please wait for the administrator to approve.");
        });
    } else if(result.status==500){
        $(document).ready(function(){
            var applyForm = $("#applyForm");
            applyForm.find(".applying").text("Sorry, your application is rejected by the administrator and you can apply again");
        })
    }
});
