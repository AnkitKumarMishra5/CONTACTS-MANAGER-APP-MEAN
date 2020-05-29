$(document).ready(function () {
    if( $("#delete_phone").parent().css('display') == 'none') {
        $('#add_phone').show()
    }
    if( $("#delete_email").parent().css('display') == 'none') {
        $('#add_email').show()
    }

    $("#delete_phone").on("click","span",function(event){
        $("#delete_phone").parent().fadeOut(500,function(){
            $("#num2").val("");
            $(this).hide();
            $("#add_phone").show();
        });
        event.stopPropagation();
    });

    $("#add_phone").on("click","span",function(event){
        $("#delete_phone").parent().fadeIn(500,function(){
            $("#delete_phone").show();
            $("#add_phone").hide();
        });
        event.stopPropagation();
    });

    $("#delete_email").on("click","span",function(event){
        $("#delete_email").parent().fadeOut(500,function(){
            $("#em2").val("");
            $(this).hide();
            $("#add_email").show();
        });
        event.stopPropagation();
    });

    $("#add_email").on("click","span",function(event){
        $("#delete_email").parent().fadeIn(500,function(){
            $("#delete_email").show();
            $("#add_email").hide();
        });
        event.stopPropagation();
    });
});