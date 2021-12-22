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