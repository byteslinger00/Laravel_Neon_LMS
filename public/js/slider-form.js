$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).on('click', '#btn-submit', function (e) {
    e.preventDefault();

    if (validateForm($(this))) {


        $('.alert.alert-danger').addClass('d-none');
        var dataJson = {};
        var hero_text = $('input[name="hero_text"]').val()
        var sub_text = $('input[name="sub_text"]').val()

        dataJson.hero_text =  hero_text;
        dataJson.sub_text=  sub_text;

        if($('select[name="widget"]').val() == 2){
            var  timer = $('#timer').val();
            dataJson.widget = {type:2,timer:timer}
        }else if($('select[name="widget"]').val() == 1){
            dataJson.widget = {type:1};
        }


        if($('.button-wrapper').length > 0){
            var buttons=[];
            $('.button-container .button-wrapper').each(function (key, value) {
               var label = $(value).find('input[name="button_label"]').val();
               var link =  $(value).find('input[name="button_link"]').val();
                buttons.push({label:label,link:link});
            })
            dataJson.buttons = buttons;
        }

        //Created json object of content for slide
        dataJson = JSON.stringify(dataJson);

        $('<input>').attr('type','hidden').attr('name','dataJson').val(dataJson).appendTo($('#slider-create')[0]);
        $('#slider-create')[0].submit();

    } else {
        $('.alert.alert-danger').removeClass('d-none')
    }
})

function validateForm(form) {
    var success = true
    $('.error-list').empty();

    if ($('input[name="name"]').val() == "") {
        $('.error-list').append('<p class="mb-0">The name field is required</p>')
        success = false;
    }

    if ($('input[name="image"]').val() == "") {
        if($('input[name="old_image"]').length == 0){
            $('.error-list').append('<p class="mb-0">The BG Image field is required</p>')
            success = false;
        }

    }
    if ($('select[name="widget"]').val() == 2 && ($('input[name="timer"]').val() == "____/__/__ __:__" || $('input[name="timer"]').val() == "")) {
        $('.error-list').append('<p class="mb-0">The Countdown timer setup field is required</p>')
        success = false;
    }

   if ($('.button-wrapper').length != 0 && (($('.button-wrapper').length  < 4) || ($('.button-wrapper').length  > 1))) {
        var empty = false;
        $('.button-wrapper').find('input[type="text"]').each(function (key, value) {
            console.log()
            if ($(value).val() == "") {
                empty = true;
            }
        })
        if (empty) {
            success = false;
            $('.error-list').append('<p class="mb-0">Button label and link fields are required</p>')
        }
    }

    return success
}

