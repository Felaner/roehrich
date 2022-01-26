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
        let height = el.clientHeight + 70;
        let rb = el.querySelector('.reason-block')
        scene = new ScrollMagic.Scene({
            triggerElement: el,
            duration: height,
            offset: -50,
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

function totalPrice() {
    const count = document.querySelector('#productCount'),
        price = document.querySelector('.size-price'),
        totalPrice = document.querySelector('.productPrice');
    if (count.value === '') {
        totalPrice.innerText = 0
    } else {
        totalPrice.innerText = (parseInt(count.value) * parseFloat(price.value)).toFixed(2)
    }
}

$(function () {
    if (document.location.pathname === '/korzina') {
        const price = $('.productPrice')
        const input1 = parseInt(price.parent().parent().find('input')[2].value)
        const input2 = parseFloat(price.parent().parent().find('input')[3].value)
        price[0].innerText = (input1 * input2).toFixed(2)
    }
})

$(function () {
    if (document.location.pathname.indexOf('tovary') > -1) {
        document.querySelector('#productSizes').addEventListener('change', el => {
            setTimeout(totalPrice, 200)
        })
        setTimeout(totalPrice, 200)
    }
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
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productLength">Длина L, мм</label>' +
                            '<input name="productLength" type="number" step="0.01" id="productLength"' +
                                   ' class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productExternalDiameter">Внешний диаметр D, мм</label>' +
                            '<input name="productExternalDiameter" type="number" step="0.01" id="productExternalDiameter"' +
                                   ' class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productDiameter">Диаметр Dy, мм</label>' +
                            '<input name="productDiameter" type="number" step="0.01" id="productDiameter"' +
                                   ' class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productDiameter1">Диаметр Dy1, мм</label>' +
                            '<input name="productDiameter1" type="number" step="0.01" id="productDiameter1"' +
                                   ' class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productDiameter2">Диаметр Dy2, мм</label>' +
                            '<input name="productDiameter2" type="number" step="0.01" id="productDiameter2"' +
                                   ' class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productDepth">Толщина стенки, мм</label>' +
                            '<input name="productDepth" type="number" step="0.01" id="productDepth" class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-6">' +
                        '<div class="form-group f-18">' +
                            '<label for="productWeight">Вес</label>' +
                            '<input name="productWeight" type="number" step="0.01" id="productWeight" class="form-control">' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productCount">Мин. кол-во заказа *</label>' +
                            '<input name="productCount" type="number" id="productCount" class="form-control" required>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-lg-4 col-12">' +
                        '<div class="form-group f-18">' +
                            '<label for="productPrice">Стоимость (за единицу) *</label>' +
                            '<input name="productPrice" type="number" step="0.01" id="productPrice" class="form-control"' +
                                   ' required>' +
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
    if (document.querySelector('.product-length')) {
        document.querySelector('.product-length').innerHTML = document.querySelectorAll(option)[0].value
    }
    if (document.querySelector('.product-externalDiameter')) {
        document.querySelector('.product-externalDiameter').innerHTML = document.querySelectorAll(option)[1].value
    }
    if (document.querySelector('.product-diameter')) {
        document.querySelector('.product-diameter').innerHTML = document.querySelectorAll(option)[2].value
    }
    if (document.querySelector('.product-diameter1')) {
        document.querySelector('.product-diameter1').innerHTML = document.querySelectorAll(option)[3].value
    }
    if (document.querySelector('.product-diameter2')) {
        document.querySelector('.product-diameter2').innerHTML = document.querySelectorAll(option)[4].value
    }
    if (document.querySelector('.product-depth')) {
        document.querySelector('.product-depth').innerHTML = document.querySelectorAll(option)[5].value
    }
    if (document.querySelector('.product-weight')) {
        document.querySelector('.product-weight').innerHTML = document.querySelectorAll(option)[6].value
    }
    if (document.querySelector('#productCount')) {
        document.querySelector('#productCount').value = document.querySelectorAll(option)[7].value
        document.querySelector('#productCount').setAttribute('min', document.querySelectorAll(option)[7].value)
        document.querySelector('.min-count').innerHTML = document.querySelectorAll(option)[7].value
    }
    if (document.querySelector('.size-price')) {
        document.querySelector('.size-price').value = document.querySelectorAll(option)[8].value
    }
}