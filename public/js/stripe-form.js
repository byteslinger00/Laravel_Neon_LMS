$(function() {
    $('form.require-validation').bind('submit', function(e) {
        var $form         = $(e.target).closest('form'),
            inputSelector = ['input[type=email]', 'input[type=password]',
                'input[type=text]', 'input[type=file]',
                'textarea'].join(', '),
            $inputs       = $form.find('.required'),
            $errorMessage = $form.find('div.error'),
            valid         = true;
            console.log($errorMessage);
        $errorMessage.addClass('d-none');
        $('.has-error').removeClass('has-error');
        $inputs.each(function(i, el) {
            var $input = $(el);
            if ($input.val() === '') {
                $input.parent().addClass('text-danger');
                $input.addClass('border-danger');
                $errorMessage.removeClass('d-none');
                e.preventDefault(); // cancel on first error
            }
        });
    });
});

$(function() {
    var $form = $("#payment-form");

    $form.on('submit', function(e) {
        if (!$form.data('cc-on-file')) {
            e.preventDefault();
            Stripe.setPublishableKey($form.data('stripe-publishable-key'));
            Stripe.createToken({
                name: $('.card-name').val(),
                number: $('.card-number').val(),
                cvc: $('.card-cvc').val(),
                exp_month: $('.card-expiry-month').val(),
                exp_year: $('.card-expiry-year').val()
            }, stripeResponseHandler);
        }
    });

    function stripeResponseHandler(status, response) {
        if (response.error) {
            $('.error')
                .removeClass('d-none')
                .find('.alert')
                .text(response.error.message);
        } else {
            // token contains id, last4, and card type
            var token = response['id'];

            // insert the token into the form so it gets submitted to the server
            $form.find('input[type=text]').empty();
            $form.append("<input type='hidden' name='reservation[stripe_token]' value='" + token + "'/>");
            $form.get(0).submit();
        }
    }
})