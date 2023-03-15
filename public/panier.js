if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
var tab= new Array ()

function ready() {
var removeCartItemButtons = document.getElementsByClassName('btn-danger')
for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem) 
}

var quantityInputs = document.getElementsByClassName('cart-quantity-input')
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i]
    input.addEventListener('change', quantityChanged)
}

var addToCartButtons = document.getElementsByClassName('shop-item-button')
for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
}
}

function removeCartItem (event) {      
var buttonClicked = event.target
      buttonClicked.parentElement.parentElement.remove ()
      updateCartTotal()
    }

    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <=0) {
            input.value = 1
        }
    updateCartTotal()
    }

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('produit')[0].src
    var id = shopItem.getElementsByClassName('id')[0].innerText
    tab [id] = new Array (id)
        console.log(title, price, imageSrc,)
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.innerText = title
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = document.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Oups ! Il semble que cet article est déja dans le panier.')
            return
        }
}   
 var cartRowContents = ` 
    <div class="cart-item cart-column">
    <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
    <span class="cart-item-title">${title}</span>
    <p class="id">${id}</p>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <img class="btn btn-danger" src="poubelle.png">
</div>` 
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

    function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i] 
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('€', ''))
        var quantity = quantityElement.value
        var id = cartRow.getElementsByClassName('id')
        tab [i] = new Array (document.getElementsByClassName('id')[0].innerText, quantity)
        total = total + (price * quantity)
            console.log (tab[i][0], tab[i][1])
    }
       //cartRow.getElementsByClassName('cart-item-title')[0].innerText
    total = Math.round(total * 100) /100 
    tab [cartRows.length] = new Array ('total', total)
    console.log('total', total)
    document.getElementsByClassName('cart-total-price')[0].innerText = total + '€'}
    
  var id = document.getElementsByClassName('id')
const button = document.getElementById('PAYER')
button.addEventListener("click", () => {
   fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      
         items:[     
            {id:8, quantity: tab[0][1]}, 
       
         ]
      }),
    })
   .then(res => {
     if (res.ok) return res.json()
     return res.json().then(json => Promise.reject(json))
   })
   .then(({ url }) => {
    window.location = url
   })
   .catch(e => {
    console.error(e.error)
   })
})

