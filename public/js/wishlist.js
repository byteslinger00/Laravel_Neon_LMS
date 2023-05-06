$(function () {

    var wishlistform = $('form[name="wishlist-form"]');

    wishlistform.on('submit', function (e) {
        e.preventDefault();

        console.log($(this).find('input[name="course_id"]').val());
        let data = {
            course: $(this).find('input[name="course_id"]').val(),
            price: $(this).find('input[name="price"]').val(),
            _token: $('meta[name="csrf-token"]').attr('content')
        };
        console.log(data);
        let url = $(this).attr('action');
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    showNotice('success', data.message);
                } else {
                    showNotice('error', data.message);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
