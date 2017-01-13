jQuery("#sendButton").click(function(){
    var $form = $("#contact-form"),
        url = $form.attr('action');
    if (!$form[0].checkValidity()) {
        $('<input type="submit">').hide().appendTo($form).click().remove();
    } else if (!grecaptcha.getResponse()){
        displayErrorMessage("Please complete the capthca!");
    } else {
        jQuery.ajax({
            type: "POST",
            url: url,
            data: $form.serializeArray(),
            dataType: "text json",
            success: function (data) {
                $form.trigger("reset");
                grecaptcha.reset();
                displayNotyMessage(data.msg);
            },
            error: function (data) {
                grecaptcha.reset();
                if (data.responseJSON && data.responseJSON.msg) {
                    displayErrorMessage(data.responseJSON.msg);
                } else {
                    displayErrorMessage("Mail service is currently not available!");
                }
            }
        });
    }
});

function displayNotyMessage (message) {
    displayNoty(message, 'success');
}

function displayErrorMessage (message) {
    displayNoty(message, 'error');
}

function displayNoty(message, type) {
    noty({
        text: message,
        type: type,
        dismissQueue: true,
        layout: 'bottomRight',
        timeout: 5000,
        closeWith: ['click'],
        theme: 'relax',
        maxVisible: 1,
        animation: {
            open: 'animated bounceInLeft',
            close: 'animated rollOut',
            easing: 'swing',
            speed: 1000
        }
    });
}

