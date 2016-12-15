var applyListSet = $("#userMn");

function createApplyList(list) {
    var r = $('<li class="applyList"> ' +
        '<table> ' +
        '<tbody> ' +
        '<tr> ' +
        '<th --class="big">customerName</th> ' +
        '<th>telephone</th> ' +
        '<th>customerID</th> ' +
        '<th class="big">adress</th> ' +
        '<th class="big">email</th> ' +
        '<th class="approve operate">Delete</th> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>'+list.shopName+'</td> ' +
        '<td>'+list.telephone+'</td>' +
        '<td>'+list.shopId+'</td> ' +
        '<td>'+list.ownerId+'</td> ' +
        '<td>'+list.email+'</td>' +
        '<td class="reject operate">Add to blacklist</td> ' +
        '</tr>' +
        '</tbody> ' +
        '</table> ' +
        '</li>');
    r.data("shopId", list.shopId);
    return r;
}

$.ajax({
    method: "get",
    url: "/proxy/admin/shop/applyList",
    dataType: "json"
}).done(function(result){
    if(result.status==200){
        var list = result.data;
        for(var len = list.length, i=0; i<len; i++ ){
            applyListSet.append(createApplyList(list[i]));
        }
    } else if(result.status==300){
        location.href = "login.html";
    }
}).fail(function (result) {
    //alert("server error");
    //location.href = "login.html";
    result = {"status":200,"data":[{"shopName":"wukai-SHOP","telephone":"65204525","shopId":3,"ownerId":7,"email":"123@qq.com","status":0},{"shopName":"nolon","telephone":"96666666","shopId":5,"ownerId":16,"email":"964886469@qq.com","status":0},{"shopName":"takeashower","telephone":"96488888","shopId":6,"ownerId":18,"email":"964886469@qq.com","status":0}]};
    if(result.status==200){
        var list = result.data;
        for(var len = list.length, i=0; i<len; i++ ){
            applyListSet.append(createApplyList(list[i]));
        }
    } else if(result.status==300){
        location.href = "login.html";
    }

});

applyListSet.on("click", ".applyList .operate", function () {
    var _this = $(this);
    var behavior = -1;
    if(_this.hasClass("approve")){
        behavior = 1;
    }
    var shopId = _this.parents(".applyList").data("shopId");
    $.ajax({
        method: "post",
        url: "/proxy/admin/shop/handle",
        data: "shopId="+shopId+"&behavior="+behavior,
        dataType: "json"
    }).done(function(result){
        if(result.status==200){
            location.reload();
        } else if(result.status==300){
            location.href = "login.html";
        }
    }).fail(function (result) {
        alert("server error");
        location.href = "login.html";
        /*result = {
         status: 200
         };
         if(result.status==200){
         location.reload();
         } else if(result.status==300){
         location.href = "login.html";
         }*/
    });
});