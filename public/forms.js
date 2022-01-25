let checkCaptch = false

function onloadCallback() {
    $('.g-recaptcha').each(function(index, el) {
        const widgetId = grecaptcha.render(el, {'sitekey' : '6Le1XSkeAAAAALSe-93I7BO9V35wtopU_a5cWuad', 'callback': verifyCallback});
        $(this).attr('data-widget-id', widgetId);
    });
};

function verifyCallback(response) {
    if (response === "") {
        checkCaptch = false;
    }
    else {
        checkCaptch = true;
    }
}

$(function() {
    $('input.required').on('input focus blur', function () {
        validateInputs($(this))
    })
    $(".home-form").submit(function (e) {
        event.preventDefault();
        let result = true
        $("input.required").each(function (){
            if ($(this).val() === '') {
                $(this).focus().addClass('error-input');
                return result = false;
            }
            if ($(this).val() !== '') {
                $(this).removeClass('error-input');
            }
        });
        if (result === false) {
            return false
        } else {
            if (checkCaptch && grecaptcha.getResponse(0) !== "") {
                checkCaptch = false;
                let $form = $(this)
                $.ajax({
                    type: $form.attr('method'),
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    error: function (jqXHR, textStatus, err) {
                        grecaptcha.reset(0);
                        console.log('error: ' + err)
                    },
                    beforeSend: function () {
                        console.log('loading')
                    },
                    success: function (result) {
                        grecaptcha.reset(0);
                        $('.home-form')[0].reset();
                        fadeAddSuccess()
                    }
                })
                e.preventDefault();
                return false;
            } else {
                fadeAddFailed()
            }
        }
    })
    $(".cart-form").submit(function (e) {
        event.preventDefault();
        let result = true
        $("input.required").each(function (){
            if ($(this).attr('type') === 'email') {
                let regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if ($(this).val() === '' || regEmail.test($(this).val()) === false) {
                    $(this).focus().addClass('error-input');
                    return result = false;
                } else {
                    $(this).removeClass('error-input');
                }
            } else if ($(this).attr('name') === 'phone') {
                let regPhone = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                if ($(this).val() === '' || regPhone.test($(this).val()) === false) {
                    $(this).focus().addClass('error-input');
                    return result = false;
                } else {
                    $(this).removeClass('error-input');
                }
            } else {
                if ($(this).val() === '') {
                    $(this).focus().addClass('error-input');
                    return result = false;
                }
                if ($(this).val() !== '') {
                    $(this).removeClass('error-input');
                }
            }
        });
        if (result === false) {
            return false
        } else {
            if (checkCaptch && grecaptcha.getResponse(0) !== "") {
                let $form = $(this)
                checkCaptch = false;
                let contacts = {
                    name: document.querySelector('#cartInputName').value,
                    phone: document.querySelector('#cartInputPhone').value,
                    email: document.querySelector('#cartInputEmail').value
                }
                let products = {}
                products['customer'] = contacts
                products['g-recaptcha-response'] = grecaptcha.getResponse(0)
                document.querySelectorAll('tbody tr').forEach((el, i) => {
                    let name = el.querySelector('h4').innerText
                    let count = el.querySelector('input').value
                    let price = el.querySelector('span[data-th="Price"]').innerText
                    let weight = el.querySelector('.cart-weight').innerText
                    let volume = el.querySelector('.cart-volume').innerText
                    products[i] = [name, count, price, weight, volume]
                })
                $.ajax({
                    type: $form.attr('method'),
                    url: $form.attr('action'),
                    data: products,
                    error: function(jqXHR, textStatus, err) {
                        grecaptcha.reset(0);
                        console.log('error: ' + err)
                    },
                    beforeSend: function() {
                        console.log('loading')
                    },
                    success: function(data) {
                        grecaptcha.reset(0);
                        clearForm()
                        deleteCartItems()
                        cartTotalPrice()
                        countCart()
                        fadeAddSuccess()
                    }
                })
                e.preventDefault();
                return false;
            } else {
                fadeAddFailed()
            }
        }
    })
});

function clearForm() {
    document.querySelectorAll('.modal-body input').forEach(el => {
        el.value = ''
    })
    document.querySelector('button[aria-label="Close"]').click()
}

function validateInputs(el) {
    if ($(el).attr('type') === 'email') {
        let regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if ($(el).val() === '' || regEmail.test($(el).val()) === false) {
            $(el).addClass('error-input');
        } else {
            $(el).removeClass('error-input');
        }
    } else if ($(el).attr('name') === 'phone') {
        let regPhone = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if ($(el).val() === '' || regPhone.test($(el).val()) === false) {
            $(el).addClass('error-input');
        } else {
            $(el).removeClass('error-input');
        }
    } else {
        if ($(el).val() === '') {
            $(el).addClass('error-input');
        }
        if ($(el).val() !== '') {
            $(el).removeClass('error-input');
        }
    }
}