if(userInfo) {
    var infoForm = $("#infoForm");
    infoForm[0].shopName.value = userInfo.shopName;
    infoForm[0].email.value = userInfo.email;
    infoForm[0].telephone.value = userInfo.telephone;
}