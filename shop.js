const pageSize = 20;
let currentPage = 1;

function fetchProductsForPage(pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedProducts.slice(startIndex, endIndex);
}

function updatePaginationLinks(totalProducts) {
    const totalPages = Math.ceil(totalProducts / pageSize);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => {
            currentPage = i;
            displayProducts(fetchProductsForPage(currentPage));
            updatePaginationLinks(totalProducts);
        });
        paginationContainer.appendChild(pageLink);
    }
}


Promise.all(fetchPromises)
    .then(() => {
        sortedProducts = allProducts.slice();
        displayProducts(fetchProductsForPage(currentPage));
        updatePaginationLinks(allProducts.length);
    })
    .catch(error => console.error('Error fetching products:', error));


    function displayProducts(products) {
        const productContainer = document.getElementById('product1');
        productContainer.innerHTML = '';
    
        const proContainer = document.createElement('div');
        proContainer.classList.add('pro-container');
    
        productContainer.appendChild(proContainer);
    
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('pro');
    
            const productLink = document.createElement('a');
            productLink.href = `sproduct.html?id=${product.id}`;
    
            const productImg = document.createElement('img');
            productImg.src = product.thumbnail;
            productImg.alt = '';
    
            const productDes = document.createElement('div');
            productDes.classList.add('des');
    
            const productBrand = document.createElement('span');
            productBrand.textContent = product.brand;
    
            const productTitle = document.createElement('h5');
            productTitle.textContent = product.title;
    
            const starDiv = document.createElement('div');
            starDiv.classList.add('star');
            for (let i = 0; i < 5; i++) {
                const starIcon = document.createElement('i');
                starIcon.classList.add('fas', 'fa-star');
                starDiv.appendChild(starIcon);
            }
    
            const productPrice = document.createElement('h4');
            productPrice.textContent = `$${product.price}`;
    
            const cartLink = document.createElement('a');
            cartLink.href = '#';
            const cartIcon = document.createElement('i');
            cartIcon.classList.add('fa-solid', 'fa-cart-plus', 'cart');
    
            productDes.appendChild(productBrand);
            productDes.appendChild(productTitle);
            productDes.appendChild(starDiv);
            productDes.appendChild(productPrice);
    
            cartLink.appendChild(cartIcon);
    
            productLink.appendChild(productImg);
            productLink.appendChild(productDes);
            productLink.appendChild(cartLink);
    
            productDiv.appendChild(productLink);
    
            proContainer.appendChild(productDiv);
        });
    }
    
    
// Sorting

function sortByPriceLowToHigh() {
    sortedProducts = allProducts.slice().sort((a, b) => a.price - b.price);
}

function sortByPriceHighToLow() {
    sortedProducts = allProducts.slice().sort((a, b) => b.price - a.price);
}

function sortByTitleAZ() {
    sortedProducts = allProducts.slice().sort((a, b) => a.title.localeCompare(b.title));
}

function sortByTitleZA() {
    sortedProducts = allProducts.slice().sort((a, b) => b.title.localeCompare(a.title));
}

const sortingDropdown = document.getElementById('sort-select');
sortingDropdown.addEventListener('change', () => {
    const selectedSorting = sortingDropdown.value;
    switch (selectedSorting) {
        case 'price_low_to_high':
            sortByPriceLowToHigh();
            break;
        case 'price_high_to_low':
            sortByPriceHighToLow();
            break;
        case 'name_az':
            sortByTitleAZ();
            break;
        case 'name_za':
            sortByTitleZA();
            break;
        default:
            sortedProducts = allProducts.slice();
            break;
    }
    currentPage = 1;
    
    const productContainer = document.querySelector('.pro-container');
    productContainer.style.opacity = 0;
    
    setTimeout(() => {
        displayProducts(fetchProductsForPage(currentPage));
        updatePaginationLinks(sortedProducts.length);
        productContainer.style.opacity = 1;
    }, 300);
});
