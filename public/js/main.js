async function loadPlushies() {
  try {
    const response = await fetch('/api/products'); // ✅ Corrected URL
    if (!response.ok) throw new Error('Network response was not ok');

    const plushies = await response.json();

    const container = document.getElementById('products-container');
    container.innerHTML = plushies.map(plushie => `
      <article tabindex="0" class="product-card" aria-label="${plushie.name} plushie">
        <img src="${plushie.image}" alt="${plushie.name}" />
        <h3>${plushie.name}</h3>
        <p>Price: $${plushie.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-product-id="${plushie.id}">Add to Cart</button>
      </article>
    `).join('');

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.productId;
        try {
          const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId: parseInt(productId), quantity: 1 }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Failed to add to cart');
          alert('Added to cart!');
          // Optional: call a function to update the cart UI if exists
          if (typeof updateCartUI === 'function') updateCartUI();
        } catch (err) {
          console.error(err);
          alert('Failed to add to cart. Please try again.');
        }
      });
    });
  } catch (error) {
    console.error('Failed to load plushies:', error);
    const container = document.getElementById('products-container');
    container.innerHTML = `<p style="color: red; text-align: center;">Failed to load plushies. Please try again later.</p>`;
  }
}

loadPlushies();
