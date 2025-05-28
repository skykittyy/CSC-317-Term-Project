async function fetchCart() {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load cart');
      const data = await res.json();
      console.log('Fetched cart data:', data); // Debug log
      return data;
    } catch (err) {
      console.error('Error fetching cart:', err);
      return [];
    }
  }
  
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }
  
  function renderCart(cartItems) {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
  
    if (cartItems.length === 0) {
      cartItemsDiv.textContent = 'Your cart is empty.';
      cartTotalDiv.textContent = 'Total: $0';
      return;
    }
  
    cartItemsDiv.innerHTML = ''; // clear existing
  
    let total = 0;
  
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.style.display = 'flex';
      productDiv.style.alignItems = 'center';
      productDiv.style.marginBottom = '10px';
  
      // Image element
      const img = document.createElement('img');
      img.src = item.image; // expects item.image URL
      img.alt = item.name;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'contain';
      img.style.marginRight = '10px';
  
      // Text container
      const textDiv = document.createElement('div');
      textDiv.style.flexGrow = '1';
      textDiv.innerHTML = `<strong>${item.name}</strong> (x${item.quantity})`;
  
      // Price element
      const priceSpan = document.createElement('span');
      priceSpan.textContent = formatPrice(itemTotal);
  
      productDiv.appendChild(img);
      productDiv.appendChild(textDiv);
      productDiv.appendChild(priceSpan);
  
      cartItemsDiv.appendChild(productDiv);
    });
  
    cartTotalDiv.textContent = `Total: ${formatPrice(total)}`;
  }
  
  async function initCart() {
    const cartItems = await fetchCart();
    renderCart(cartItems);
  }
  
  window.addEventListener('DOMContentLoaded', initCart);
  