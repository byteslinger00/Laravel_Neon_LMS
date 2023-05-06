import './tinymce';

/* Only if email notify is enabled */
$('#notify_email').change(function() {
    var chatter_email_loader = $(this).find('.chatter_email_loader');
    chatter_email_loader.addClass('loading');
    // Call ajax post
    // Then hide loader....
    $.post('/' + $('#current_path').val() + '/email', { '_token' : $('#csrf_token_field').val(), }, function(data){
        chatter_email_loader.removeClass('loading');
        if(data){
            $('#email_notification').prop( "checked", true );
        } else {
            $('#email_notification').prop( "checked", false );
        }
    });      
});