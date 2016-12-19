$.ajax({
    method: "get",
    url: "/proxy/shop-owner/status",
    dataType: "json",
    async: false
}).done(function (result) {
    var msg = "";
    if(result.status==200) {
        location.href = "index.html";
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==500){
        msg = "You are applying for a shop, please wait for the administrator to approve.";
        fillForm(result, msg, true);
    } else if(result.status==600){
        msg = "Sorry, your application is rejected by the administrator and you can apply again.";
        fillForm(result, msg, false);
    } else if(result.status==700){
        msg = "Please go to verify your email first!";
        fillForm(result, msg, true);
    }
}).fail(function (result) {
    alert("server error");
    //location.href = "../customer";
    /*var msg = "";
    if(result.status==200) {
        location.href = "index.html";
    } else if(result.status==300){
        location.href="../customer/login.html?redirectUrl="+encodeURIComponent(location.href);
    } else if(result.status==500){
        msg = "You are applying for a shop, please wait for the administrator to approve.";
        fillForm(result, msg, true);
    } else if(result.status==600){
        msg = "Sorry, your application is rejected by the administrator and you can apply again.";
        fillForm(result, msg, false);
    } else if(result.status==700){
        msg = "Please go to verify your email first!";
        fillForm(result, msg, true);
    }*/
});
function fillForm(result, msg, disabled){
    var data = result.data[0],
        photo = result.photo[0];
    $(document).ready(function() {
        var $applyForm = $("#applyForm"),
            $imagesPreview = $applyForm.find(".imagesPreview"),
            $img = $imagesPreview.find("img");
        $img.ready(function(){
            $imagesPreview.height($img.height());
        });
        $img.attr("src", photo);
        imgAuto($img);
        tipsAlert(msg);
        $applyForm.data("fileNameList", photo)
            .data("change", "false")
            .find('#shopName').val(data.shopName).end()
            .find('#shopEmail').val(data.email).end()
            .find('#shopTel').val(data.telephone).end()
            .find('.applying').text(msg);
        if(disabled) {
            $applyForm.find('input').addClass("disabled").attr("disabled", disabled);
        }
    });
}
