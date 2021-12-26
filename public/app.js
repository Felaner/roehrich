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
    $('.megamenu-title span').fadeOut(300)
    const megamenuBlock = $('.megamenu-block');
    megamenuBlock.each(function () {
        $(this).hover(function () {
            $(this).find('.megamenu-title span').fadeIn(300)
        }, function () {
            $(this).find('.megamenu-title span').fadeOut(300)
        })
    })

    $(".search-img").click(function(){
        $(".search-wrap, .search-wrap .form-control").toggleClass("active").focus();
    })
    let clicks = 0;
    $('.nav-link.dropdown-toggle').click(el => {
        ++clicks
        const menu = $('.megamenu .dropdown-menu')
        if (!menu.hasClass('animate__fadeInLeft')) {
            menu.removeClass('animate__fadeOutRight').css({'display': 'block'}).addClass('animate__fadeInLeft')
        } else {
            menu.removeClass('animate__fadeInLeft').addClass('animate__fadeOutRight')
            setTimeout(function () {
                menu.css({'display': 'none'})
            }, 550)
        }
    })

    let adminClicks = 0
    $('.admin-dropdown button').click(el => {
        ++clicks
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