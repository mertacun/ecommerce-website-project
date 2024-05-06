const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
let allProducts = [];

if (bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  });
}

if (close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  });
}

// Search Bar

const allowedCategories = [
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses"
];
const fetchPromises = allowedCategories.map(category => {
  return fetch(`https://dummyjson.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => {
          const products = data.products;
          allProducts = allProducts.concat(products);
      });
});

const searchTermInput = document.querySelector('.searchTerm');
searchTermInput.addEventListener('input', () => {
    const searchTerm = searchTermInput.value.trim().toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
        return product.title.toLowerCase().includes(searchTerm) ||
               product.brand.toLowerCase().includes(searchTerm);
    });
    
    displaySearchResults(filteredProducts);
});

document.body.addEventListener('click', (event) => {
    const dropdownContainer = document.querySelector('.searchDropdown');
    if (!event.target.closest('.search')) {
        dropdownContainer.style.display = 'none';
    }
});

function displaySearchResults(results) {
    const dropdownContainer = document.querySelector('.searchDropdown');
    dropdownContainer.innerHTML = '';

    if (results.length === 0) {
        dropdownContainer.innerHTML = '<p>No results found</p>';
        dropdownContainer.style.display = 'block';
        return;
    }

    const limitedResults = results.slice(0, 7);

    limitedResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('searchResult');

        const productThumbnail = document.createElement('img');
        productThumbnail.classList.add('productThumbnail');
        productThumbnail.src = result.thumbnail;
        resultItem.appendChild(productThumbnail);

        const productTitle = document.createElement('span');
        productTitle.textContent = result.title;
        resultItem.appendChild(productTitle);

        resultItem.addEventListener('click', () => {
          window.location.href = `sproduct.html?id=${result.id}`;
      });

        dropdownContainer.appendChild(resultItem);
    });

    dropdownContainer.style.display = 'block';
}


// Single Product Page

document.addEventListener('DOMContentLoaded', () => {
  const addToCartButton = document.querySelector('.single-pro-details button');
  if (addToCartButton) {
      addToCartButton.addEventListener('click', addToCart);
  }
});



function addToCart() {
  const productName = document.querySelector('.single-pro-details h4').textContent;
  const productPrice = parseFloat(document.querySelector('.single-pro-details h2').textContent.replace('$', ''));
  const selectedSize = document.querySelector('select').value;
  const selectedQuantity = parseInt(document.querySelector('input[type="number"]').value);
  const productThumbnail = document.querySelector('#prodetails > div.single-pro-image > div > div:nth-child(1) > img').src;

  if (selectedSize === 'Select Size') {
      Swal.fire({
        icon: 'error',
        iconColor: '#A63D40',
        color: '#A63D40',
        background: '#F3F0FA',
        confirmButtonColor: '#F0C32D',
        text: 'Please select a size before adding to cart!'
      });
      return;
  }

  const product = {
      name: `${productName} (${selectedSize})`,
      price: productPrice,
      quantity: selectedQuantity,
      thumbnail: productThumbnail
  };

  let cart = localStorage.getItem('cart');
  if (!cart) {
      cart = [];
  } else {
      cart = JSON.parse(cart);

      const existingProductIndex = cart.findIndex(item => item.name === product.name);
      if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += selectedQuantity;
          localStorage.setItem('cart', JSON.stringify(cart));
          Swal.fire({
            position: "top-end",
            icon: "success",
            color: '#151515',
            background: '#F3F0FA',
            html: "Product Quantity Updated in the Cart!",
            timer: 1000,
            showConfirmButton: false,
            width: 450,
            timerProgressBar: true,
          });
          return;
      }
  }

  cart.push(product);

  localStorage.setItem('cart', JSON.stringify(cart));

  Swal.fire({
    position: "top-end",
    icon: "success",
    color: '#151515',
    background: '#F3F0FA',
    html: "Product Added in the Cart!",
    timer: 1000,
    showConfirmButton: false,
    width: 450,
    timerProgressBar: true,
  });
}


// Cart Page

document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.querySelector('#cart tbody');
  if (cartTableBody) {
      cartTableBody.addEventListener('click', removeItem);
      displayCart();
  }
});

function removeItem(event) {
  if (event.target.classList.contains('fa-xmark')) {
      const productName = event.target.closest('tr').querySelector('td:nth-child(3)').textContent;
      let cart = JSON.parse(localStorage.getItem('cart'));
      cart = cart.filter(item => item.name !== productName);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
      updateCartBadge();
  }
}

function displayCart() {
  const cartTableBody = document.querySelector('#cart tbody');
  if (!cartTableBody) return;

  const subtotalElement = document.getElementById('subtotal');
  if (!subtotalElement) return;
  cartTableBody.innerHTML = '';

  let cart = localStorage.getItem('cart');
  if (!cart) {
      cartTableBody.innerHTML = '<tr><td colspan="6">Your cart is empty</td></tr>';
      subtotalElement.querySelector('td:nth-child(2)').textContent = '$0.00';
      subtotalElement.querySelector('strong').textContent = '$0.00';
      return;
  }

  cart = JSON.parse(cart);

  let cartSubtotal = 0;

  cart.forEach(product => {
      const row = document.createElement('tr');
      const productSubtotal = product.price * product.quantity;
      cartSubtotal += productSubtotal;

      row.innerHTML = `
          <td><a href="#" class="remove-item"><i class="fa-solid fa-xmark"></i></a></td>
          <td><img src="${product.thumbnail}" alt="product"></td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td><input type="number" value="${product.quantity}" min="1" class="quantity-input"></td>
          <td>$${productSubtotal.toFixed(2)}</td>
      `;
      cartTableBody.appendChild(row);

      const quantityInput = row.querySelector('.quantity-input');
      quantityInput.addEventListener('input', () => {
          const newQuantity = parseInt(quantityInput.value);
          if (newQuantity === 0) {
              cart = cart.filter(item => item.name !== product.name);
          } else {
              product.quantity = newQuantity;
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          displayCart();
          updateCartBadge();
      });
  });

  subtotalElement.querySelector('td:nth-child(2)').textContent = `$${cartSubtotal.toFixed(2)}`;
  subtotalElement.querySelector('table tr:last-child td:last-child').innerHTML = `<strong>$${cartSubtotal.toFixed(2)}</strong>`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

function updateCartBadge() {
  let cart = localStorage.getItem('cart');
  if (!cart) {
      document.getElementById('cart-badge').textContent = '0';
      return;
  }

  cart = JSON.parse(cart);
  let totalCount = 0;

  cart.forEach(product => {
      totalCount += product.quantity;
  });

  const cartBadge = document.getElementById('cart-badge');
  const currentCount = parseInt(cartBadge.textContent);

  cartBadge.textContent = totalCount.toString();
  cartBadge.style.opacity = '0';
  cartBadge.style.transition = 'opacity 0.8s';
  setTimeout(() => {
      cartBadge.style.opacity = '1';
  }, 350);
}
