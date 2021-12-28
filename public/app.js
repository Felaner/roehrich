$(document).ready( function() {
    $(".file-upload input[type=file]").change(function(){
        let filename = $(this).val().replace(/.*\\/, "");
        $("#filename").val(filename);
    });
});

function selectedImg(el, index) {
    const img = $('img' + '[alt="' + el.alt + '"]')
    img.parent().parent().parent()
        .find('#product' + index)[0].src = img.attr('src')
}

function totalPrice(total, el, price) {
    if (!el.value) {
        total.innerText = 0
    } else {
        total.innerText = parseInt(el.value) * parseInt(price)
    }
}

$(function () {
    const price = $('.productPrice')
    const input1 = parseInt(price.parent().parent().find('input')[0].value)
    const input2 = parseInt(price.parent().parent().find('input')[1].value)
    price[0].innerText = input1  * input2
})

$(function () {
    $('.megamenu-title span').fadeOut(300)
    const megamenuBlock = $('.megamenu-block');
    megamenuBlock.each(function () {
        $(this).hover(function () {
            const srcImage = $(this).find('input').val()
            $('.megamenu-image').animate({'opacity': '0'},300,function (){
                $(this).css({'background': `center center url('/${srcImage}') no-repeat`, 'background-size': 'cover'})
                $(this).animate({'opacity': '1'}, 300)
            })

            $(this).find('.megamenu-title span').fadeIn(300)
        }, function () {
            $(this).find('.megamenu-title span').fadeOut(300)
        })
    })

    $(".search-img").click(function(){
        $(".search-wrap, .search-wrap .form-control").toggleClass("active").focus();
    })
    $('.nav-link.dropdown-toggle').click(el => {
        const menu = $('.megamenu .dropdown-menu')
        if (!menu.hasClass('animate__fadeInLeft')) {
            menu.removeClass('animate__fadeOutRight').css({'display': 'block'}).addClass('animate__fadeInLeft')
        } else {
            menu.removeClass('animate__fadeInLeft').addClass('animate__fadeOutRight')
            setTimeout(function () {
                menu.css({'display': 'none'})
            }, 1000)
        }
    })

    $('.admin-dropdown button').click(el => {
        const menu = $('.admin-dropdown .dropdown-menu')
        if (!menu.hasClass('animate__fadeInLeft')) {
            menu.removeClass('animate__fadeOutRight').css({'display': 'block'}).addClass('animate__fadeInLeft')
        } else {
            menu.removeClass('animate__fadeInLeft').addClass('animate__fadeOutRight')
            setTimeout(function () {
                menu.css({'display': 'none'})
            }, 550)
        }
    })
})