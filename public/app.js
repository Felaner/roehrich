function search() {
    let input = document.getElementById("search");
    let filter = input.value.toUpperCase();
    let resultBlock = document.querySelector('.result-block');
    let ul = document.getElementById("result-list");
    let li = ul.getElementsByTagName("li");

    let result = []
    // Перебирайте все элементы списка и скрывайте те, которые не соответствуют поисковому запросу
    for (let i = 0; i < li.length; i++) {
        if (input.value !== '') {
            let a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                resultBlock.style.display = "block"
                li[i].style.display = "";
                result.push(i)
            } else {
                if(i >= 0) {
                    result.splice(i,1);
                }
                li[i].style.display = "none";
            }
        } else {
            resultBlock.style.display = "none"
            li[i].style.display = "none";
        }
    }
    if (!result.length) {
        resultBlock.style.display = "block"
        ul.getElementsByTagName("p")[0].style.display = "block"
    } else {
        ul.getElementsByTagName("p")[0].style.display = "none"
    }

}

document.getElementById("search").addEventListener('keyup', search);

(function() {
    let controller = new ScrollMagic.Controller()
    let scene;
    let reasons = document.querySelectorAll('.scale')
    reasons.forEach(function (el, i) {
        let height = el.clientHeight + 62;
        let rb = el.querySelector('.reason-block')
        scene = new ScrollMagic.Scene({
            triggerElement: el,
            duration: height,
            reverse: true
        })
            .setClassToggle(rb, "reason-big")
            .addTo(controller);
    })
})()

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
    const input1 = parseInt(price.parent().parent().find('input')[2].value)
    const input2 = parseInt(price.parent().parent().find('input')[3].value)
    price[0].innerText = input1 * input2
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
        let resultBlock = document.querySelector('.result-block');
        resultBlock.style.display = "none"
        $(".search-wrap, .search-wrap .form-control").toggleClass("active").focus();
    })
    $('.nav-link.dropdown-toggle').click(el => {
        const menu = $('.megamenu .dropdown-menu')
        if (!menu.hasClass('show')) {
            menu.addClass('scaleIn').removeClass('scaleOut').css({'display': 'block'})
        } else {
            menu.addClass('scaleOut').removeClass('scaleIn')
            setTimeout(function () {
                menu.css({'display': 'none'})
            }, 1000)
        }
    })

    $('body').on('click', (e) => {
        const menu = $('.megamenu .dropdown-menu')
        if (menu.hasClass('show')) {
            menu.addClass('scaleOut').removeClass('scaleIn')
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

$(document).ready( function() {
    if (document.location.pathname.indexOf('control') > -1) {
        document.querySelectorAll('.delete-size').forEach(el => {
            el.addEventListener('click', el => {
                console.log(el)
                el.target.parentNode.parentNode.parentNode.removeChild(el.target.parentNode.parentNode);
            })
        })
        document.querySelector('.add-size').addEventListener('click', el => {
            let size = '<div class="form-group add-sizes position-relative">' +
                '<div class="divider"></div>' +
                '<div class="row mb-5">' +
                    '<div class="col-4">' +
                        '<div class="form-group f-18">' +
                        '<label for="productWeight">Вес</label>' +
                        '<input name="productWeight" type="number" step="0.01" id="productWeight" class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-4">' +
                        '<div class="form-group f-18">' +
                        '<label for="productVolume">Объем</label>' +
                        '<input name="productVolume" type="number" step="0.00001" id="productVolume" class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-4">' +
                        '<div class="form-group f-18">' +
                        '<label for="productGost">Соответствие ГОСТ</label>' +
                        '<input name="productGost" type="text" id="productGost" class="form-control">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<a class="delete-size"><img src="/images/icons/close.svg" alt=""></a>' +
                '</div>';
            document.querySelector('.sizes').insertAdjacentHTML('beforeend', size)
        })
    }
    selectedSize()
    document.querySelector('#productSizes').addEventListener('change', el => {
        selectedSize()
    })
})

function selectedSize() {
    const select = document.querySelector('#productSizes');
    const option = '.' + select.value + ' input'
    document.querySelector('.product-weight').innerHTML = document.querySelectorAll(option)[0].value
    document.querySelector('.product-volume').innerHTML = document.querySelectorAll(option)[1].value
    document.querySelector('.product-gost').innerHTML = document.querySelectorAll(option)[2].value
}