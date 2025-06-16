//to be used when adding products

//populate products list from json
window.addEventListener("DOMContentLoaded", async (event) => {
  //if a cart exists in localStorage we can populate it here
  populateCartOnDomLoad();
  //
  const response = await fetch("./products.json");
  const products = await response.json();

  const productsContainer = document.querySelector(".productsContainer");

  products.map((product) => {
    const productElement = document.createElement("div");

    productElement.classList.add("productCard");

    //We can track product ids by placing a data attribute on each add to cart button
    //Then we can access the associated product from our products.json file
    productElement.innerHTML = `<img src="${product.img}" />
    <h2>${product.name}</h2>
    <p>${product.price}</p>
    <button class="addToCartButton" type="button" data-product-id="${product.id}"> Add to cart</button>`;

    productsContainer.appendChild(productElement);
  });

  window.addEventListener("click", (event) => {
    const currentButton = event.target;

    if (currentButton.classList.contains("addToCartButton")) {
      const productId = currentButton.dataset.productId;
      addToCart(productId);
    }
  });
});

function addToCart(proudctId) {
  //We will persist some basic state management with local storage
  const existingCartData = JSON.parse(localStorage.getItem("cartData"));
  const cartData = existingCartData === null ? [] : existingCartData;
  //Check if the item with id matching productId is already in cart
  //If the item is, update the corresponding dom node by incrementing the quanity
  //Then update the cart data and reset cartData in localStorage
  //If not, add a new dom node containing the item and set the quanity to 1
  //Then add the new cart item object to existing cartData and update localStorage
}

function populateCartOnDomLoad() {
  const existingCartData = JSON.parse(localStorage.getItem("cartData"));
  if (existingCartData) {
    //populate the cart
  }
}

//implement renderCartItem function
function renderCartItem(productId) {
  const product = products.filter((p) => p.id === productId);
  if (product) {
    const cartList = document.querySelector(".cartList");
  } else {
    alert("product not found, contact site administrator");
  }
}

//implement updateCartItem function
