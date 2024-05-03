function fetchProductDetails(productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product);
            
            const addToCartButton = document.querySelector('.single-pro-details button');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', addToCart);
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}


        function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('prodetails');
    productDetailsContainer.innerHTML = `
        <div class="single-pro-image">
            <img src="${product.thumbnail}" width="100%" id="MainImg" alt="${product.title}">
            <div class="small-img-group">
                <div class="small-img-col">
                    <img src="${product.thumbnail}" width="100%" class="small-img" alt="${product.title}" data-index="-1">
                </div>
                ${product.images.slice(0, 3).map((image, index) => `
                    <div class="small-img-col">
                        <img src="${image}" width="100%" class="small-img" alt="${product.title}" data-index="${index}">
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="single-pro-details">
            <h6>${product.category} / ${product.brand}</h6>
            <h4>${product.title}</h4>
            <h2>$${product.price.toFixed(2)}</h2>
            <select id="size-select">
                <option>Select Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>Extra Large</option>
            </select>
            <input type="number" id="quantity-input" value="1" min="1">
            <button class="normal">Add to Cart</button>
            <h4>Product Details <i class="fas fa-indent"></i></h4>
            <span>Introducing our vibrant Red Printed T-shirt, the epitome of casual
                 cool. Crafted from a comfortable cotton blend, this T-shirt boasts 
                 a striking red hue that commands attention. With its eye-catching printed 
                 design adorning the front, it adds a touch of personality to any ensemble. 
                 The regular fit and short sleeves ensure a relaxed yet stylish look, 
                 perfect for everyday wear. Complete with a classic crew neckline, this 
                 T-shirt effortlessly combines comfort and style. Pair it with your 
                 favorite jeans for a laid-back weekend look or dress it up with tailored
                  trousers for a contemporary twist. Available in a range of sizes 
                  (S, M, L, XL), it's the versatile staple your wardrobe needs. Care 
                  for it is a breeze – simply machine wash cold and tumble dry low. 
                  Upgrade your wardrobe with our Red Printed T-shirt today and make a
                   statement wherever you go.</span>
        </div>
    `;

    const smallImages = document.querySelectorAll('.small-img');
    smallImages.forEach(smallImg => {
        smallImg.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const mainImg = document.getElementById('MainImg');
            mainImg.src = this.src;
        });
    });
}

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const productId = urlParams.get('id');

        fetchProductDetails(productId);