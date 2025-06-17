//products will be populated with a fetch request when the dom loads
let products = [];

window.addEventListener("DOMContentLoaded", async (event) => {
  //populate products list from json
  const response = await fetch("./products.json");
  products = await response.json();

  //indivudal product cards are populated once we have fetched the products.json
  populateProductCards();

  //if a cart exists in localStorage we can populate when the page loads
  populateCartOnDomLoad();

  window.addEventListener("click", (event) => {
    const currentButton = event.target;

    if (currentButton.classList.contains("addToCartButton")) {
      const productCard = currentButton.closest(".productCard");
      const productId = Number(productCard.dataset.productId);
      addToCart(productId);
    }
    if (currentButton.classList.contains("quantity")) {
      updateQuantity(currentButton);
    }
  });
});

function addToCart(proudctId) {
  //We will persist some basic state management with local storage
  const existingCartData = JSON.parse(localStorage.getItem("cartData"));
  const cartData = existingCartData === null ? [] : existingCartData;
  let updatedCart;
  //Check if the item with id matching productId is already in cart
  const existingItem = cartData.find((item) => item.id === proudctId);

  //If the item is, update the corresponding dom node by incrementing the quanity
  if (existingItem) {
    existingItem.quantity += 1;
    updatedCart = cartData;
    updateCartItem(proudctId, existingItem.quantity, existingItem.price);
  }
  //Then update the cart data and reset cartData in localStorage
  //If not, add a new dom node containing the item and set the quanity to 1
  else {
    cartItemData = renderCartItem(proudctId);
    if (!cartItemData) return;
    console.log("Cart Item Data", cartItemData);
    cartData.push(cartItemData);
    updatedCart = cartData;
  }
  //Then add the new cart item object to existing cartData and update localStorage
  console.log("Cart Data", cartData);
  localStorage.setItem("cartData", JSON.stringify(updatedCart));
  calculateTotal();
}

function populateProductCards() {
  //place product elements into the productsContainer flexbox
  const productsContainer = document.querySelector(".productsContainer");
  products.map((product) => {
    //Needed to add this jsDoc comment for intellisense to allow me to clone the node for some reason
    /** @type {HTMLTemplateElement} */
    const template = document.querySelector("#productCardTemplate");
    const clone = template.content.cloneNode(true);

    //place a data attribute on the parent div
    const productDiv = clone.querySelector(".productCard");
    productDiv.dataset.productId = product.id;

    const productImage = clone.querySelector("img");
    productImage.src = product.img;

    const productHeading = clone.querySelector(".productTitle");
    productHeading.innerText = product.name;

    const productPrice = clone.querySelector(".productPrice");

    productPrice.innerText = product.price;

    productsContainer.appendChild(clone);
  });
}

function populateCartOnDomLoad() {
  const existingCartData = JSON.parse(localStorage.getItem("cartData"));

  if (existingCartData) {
    existingCartData.forEach((item) => renderCartItem(item.id));
    calculateTotal();
  }
}

//implement renderCartItem function
function renderCartItem(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    const existingCartData = JSON.parse(localStorage.getItem("cartData"));
    const cartData = existingCartData === null ? [] : existingCartData;

    //create a new object to be added to the cart
    //this is distinct from the product object becuase it will include quantity
    //in a real app we would want unique cart item ids, but since this is just a basic program we will use the product.id
    const newCartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
    };

    const existingCartItem = cartData.find((item) => item.id === productId);

    const cartItemData = existingCartItem ? existingCartItem : newCartItem;

    /** @type {HTMLTemplateElement} */
    const template = document.querySelector("#cartItemTemplate");
    const clone = template.content.cloneNode(true);

    const itemLiElement = clone.querySelector(".cartItem");
    itemLiElement.dataset.productId = cartItemData.id;

    const itemName = clone.querySelector(".itemName");
    itemName.innerText = cartItemData.name;

    const itemQuantity = clone.querySelector(".itemQuantity");
    itemQuantity.innerText = "x" + cartItemData.quantity;

    console.log(cartItemData.price, cartItemData.quantity);
    const itemPrice = clone.querySelector(".itemPrice");
    itemPrice.innerText = cartItemData.price * cartItemData.quantity;

    cartList = document.querySelector(".cartList");
    cartList.appendChild(clone);

    return cartItemData;
  } else {
    console.error("Error, cart item not found");
    return null;
  }
  
}

function updateQuantity(currentButton) {
  const existingCartData = JSON.parse(localStorage.getItem("cartData"));
  console.log(existingCartData);
  const cartData = existingCartData === null ? [] : existingCartData;
  let updatedCart;
  const cartItem = currentButton.closest(".cartItem");
  const productId = Number(cartItem.dataset.productId);
  const existingItem = cartData.find((item) => item.id === productId);
  const productQuantityStr = cartItem.querySelector(".itemQuantity").innerText;
  let productQuantity = Number(productQuantityStr.replace("x", ""));

  if (currentButton.classList.contains("plus")) {
    productQuantity += 1;
    existingItem.quantity += 1;
    updatedCart = cartData;
  } else if (currentButton.classList.contains("minus")) {
    productQuantity -= 1;
    console.log("ExistingItem", existingItem);
    existingItem.quantity -= 1;

    if (existingItem.quantity <= 0) {
      updatedCart = cartData.filter((item) => item.id != existingItem.id);
    } else {
      updatedCart = cartData;
    }
  }
  updateCartItem(productId, productQuantity, existingItem.price);

  localStorage.setItem("cartData", JSON.stringify(updatedCart));
  calculateTotal();
}

//implement updateCartItem function

function updateCartItem(productId, quantity, price) {
  const element = document.querySelector(`li[data-product-id="${productId}"`);
  if (quantity <= 0) {
    element.remove();
  } else {
    const itemPrice = element.querySelector(".itemPrice");
    itemPrice.innerText = quantity * price;
    const itemQuantity = element.querySelector(".itemQuantity");
    itemQuantity.innerText = "x" + quantity;
  }

}

function calculateTotal() {
  const cartItems = document.querySelectorAll(".itemPrice");
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const price = Number(item.innerText);
    totalPrice += price;
  });

  const priceTotal = document.querySelector(".priceTotal");

  priceTotal.innerText = totalPrice;
}
