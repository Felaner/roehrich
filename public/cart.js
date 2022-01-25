function web_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}

function setCartData(el){
    localStorage.setItem('cart', JSON.stringify(el));
    return false;
}

function addToCart(el){
    el.disabled = true; // блокируем кнопку на время операции с корзиной
    const cartData = getCartData() || {}, // получаем данные корзины или создаём новый объект, если данных еще нет
        parentBox = el.parentNode, // родительский элемент кнопки "Добавить в корзину"
        itemId = el.getAttribute('data-id'), // ID товара
        itemImage = parentBox.querySelector('.product-buy-image').value,
        itemTitle = parentBox.querySelector('.product-buy-name').value, // название товара
        productCount = parseInt(parentBox.parentNode.querySelector('#productCount').value),
        minCount = parseInt(parentBox.parentNode.querySelector('#productCount').value),
        itemPrice = parentBox.querySelector('.product-buy-price').value, // стоимость товара
        productWeight = parentBox.parentNode.parentNode.parentNode.querySelector('.product-weight').innerText,
        productVolume = parentBox.parentNode.parentNode.parentNode.querySelector('.product-volume').innerText;
    if(cartData.hasOwnProperty(itemId)){ // если такой товар уже в корзине, то добавляем +1 к его количеству
        cartData[itemId][2] += productCount;
    } else { // если товара в корзине еще нет, то добавляем в объект
        cartData[itemId] = [itemImage, itemTitle, productCount, itemPrice, minCount, productWeight, productVolume];
    }
    if(!setCartData(cartData)){ // Обновляем данные в LocalStorage
        el.disabled = false; // разблокируем кнопку после обновления LS
    }
    return false;
}

function addToCartService(el){
    el.disabled = true; // блокируем кнопку на время операции с корзиной
    const cartData = getCartData() || {}, // получаем данные корзины или создаём новый объект, если данных еще нет
        parentBox = el.parentNode, // родительский элемент кнопки "Добавить в корзину"
        itemId = el.getAttribute('data-id'), // ID товара
        itemImage = parentBox.querySelector('.service-buy-image').value,
        itemTitle = parentBox.querySelector('.service-buy-name').value, // название товара
        itemCount = 1,
        itemPrice = parseInt(parentBox.querySelector('.productPrice').innerHTML); // стоимость товара
    if(cartData.hasOwnProperty(itemId)){ // если такой товар уже в корзине, то добавляем +1 к его количеству
        cartData[itemId][2] += itemCount;
    } else { // если товара в корзине еще нет, то добавляем в объект
        cartData[itemId] = [itemImage, itemTitle, itemCount, itemPrice];
    }
    if(!setCartData(cartData)){ // Обновляем данные в LocalStorage
        el.disabled = false; // разблокируем кнопку после обновления LS
    }
    return false;
}

function openCart() {
    const cartCont = $('#cart_content')[0]
    let cartData = getCartData(),
        totalItems = '';
    if (cartData !== null) {
        for(let items in cartData){
            const price = parseInt(cartData[items][3]) * parseInt(cartData[items][2])
            totalItems += `<tr data-id="${items}">` +
                '<td data-th="Product">' +
                    '<div class="row">' +
                        '<div class="col-md-5 text-left">' +
                            `<img src="${cartData[items][0]}" alt="" class="img-fluid d-none d-md-block rounded mb-2 shadow ">` +
                        '</div>' +
                        '<div class="col-md-7 text-left mt-sm-2">' +
                                `<h4>${cartData[items][1]}</h4>` +
                                `<p class="cart-weight">Вес: ${cartData[items][5]}</p>` +
                                `<p class="cart-volume">Объем: ${cartData[items][6]}</p>` +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td data-th="Quantity">' +
                    `<input type="number" class="form-control" min="${cartData[items][4]}" value="${cartData[items][2]}" onkeyup="itemCartPrice(this)">` +
                '</td>' +
                `<input type="hidden" value="${parseInt(cartData[items][3])}">` +
                `<td class="f-24" style="padding-top: 16px;"><span data-th="Price">${price}</span> руб.</td>` +
                '<td class="actions" data-th="">' +
                    '<div class="text-right">' +
                        `<button class="mb-2 delete-cart-item" data-id="${items}">` +
                            `<img src="/images/icons/close.svg" data-id="${items}">` +
                        '</button>' +
                    '</div>' +
                '</td>' +
            '</tr>';
        }
        cartCont.innerHTML = totalItems;
    } else {
        cartCont.innerHTML = '<h3 class="f-24 m-3" style="color: #FFFFFF">В корзине пусто!<h3>';
    }
    return false;
}

function countCart() {
    const count = localStorage.getItem('cart')
    if (count !== null) {
        $('#open-cart p')[0].innerHTML = Object.keys(JSON.parse(localStorage.getItem('cart'))).length;
    } else {
        $('#open-cart p')[0].innerHTML = '0'
    }
}

function itemCartPrice(el) {
    let parentBox = el.parentNode.parentNode,
        price = parentBox.querySelector('span[data-th="Price"]'),
        priceOne = parentBox.querySelector('input[type="hidden"]').value
    if (el.value !== '') {
        price.innerHTML = parseInt(priceOne) * parseInt(el.value)
    } else {
        price.innerHTML = '0'
    }
    cartTotalPrice()
}

function cartTotalPrice() {
    const price = $('[data-th="Price"]')
    let totalPrice = 0;
    for(let el of price) {
        totalPrice += parseInt(el.innerHTML)
    }
    $('.totalPrice')[0].innerText = totalPrice
}

function deleteCartItem(el) {
    const id = el.getAttribute("data-id");
    const cartItem = $(`tr[data-id="${id}"]`)[0]
    const cartData = getCartData()
    delete cartData[id]
    cartItem.parentNode.removeChild(cartItem);
    cartTotalPrice()
    setCartData(cartData)
    countCart()
    if (Object.keys(cartData).length === 0) {
        const cartCont = $('#cart_content')[0]
        localStorage.removeItem('cart');
        cartCont.innerHTML = '<h3 class="f-24 m-3" style="color: #FFFFFF">В корзине пусто!<h3>';
    }
}

function deleteCartItems() {
    const elem = document.querySelectorAll('tbody');
    elem.forEach(e => {
        let child = e.lastElementChild
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    })
    const cartCont = $('#cart_content')[0]
    localStorage.removeItem('cart');
    cartCont.innerHTML = '<h3 class="f-24 m-3" style="color: #FFFFFF">В корзине пусто!<h3>';
}

function fadeAddSuccess() {
    const box = $('.add-success');
    box.removeClass('animate__slideOutUp').css('display', 'block').addClass('animate__slideInDown');
    setTimeout(function () {
        box.removeClass('animate__slideInDown').addClass('animate__slideOutUp')
        setTimeout(function () {
            box.css('display', 'none')
        }, 1200)
    }, 5000)
}

function fadeAddFailed() {
    const box = $('.add-failed');
    box.removeClass('animate__slideOutUp').css('display', 'block').addClass('animate__slideInDown');
    setTimeout(function () {
        box.removeClass('animate__slideInDown').addClass('animate__slideOutUp')
        setTimeout(function () {
            box.css('display', 'none')
        }, 1200)
    }, 5000)
}

$(function () {
    if(web_storage()){
        countCart()
        $('.cartBuy').on('click', el => {
            addToCart(el.target)
            fadeAddSuccess()
            countCart()
        });

        $('.cartBuyService').on('click', el => {
            addToCartService(el.target)
            fadeAddSuccess()
            countCart()
        })

        if (document.location.pathname === '/korzina') {
            openCart()
            cartTotalPrice()

            $('#clear-cart').on('click', el => {
                deleteCartItems()
                countCart()
                cartTotalPrice()
            })

            $('.delete-cart-item').on('click', el => {
                deleteCartItem(el.target)
                cartTotalPrice()
            })
        }
    } else{
        alert('В вашем браузере нет поддержки localstorage')
    }
})