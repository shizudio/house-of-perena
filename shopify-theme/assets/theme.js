/* Nav scroll */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* Hamburger */
let menuOpen = false;
document.getElementById('hbg').addEventListener('click', () => {
  menuOpen = !menuOpen;
  document.getElementById('hbg').classList.toggle('open', menuOpen);
  document.getElementById('drawer').classList.toggle('open', menuOpen);
});

/* ── CART ── */
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchCart();
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

function updateBadge(count) {
  const badge = document.getElementById('cart-badge');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function money(cents) {
  return '¥ ' + (cents / 100).toLocaleString('ja-JP', { minimumFractionDigits: 0 });
}

function renderCartItems(cart) {
  const container = document.getElementById('cart-items');
  const foot = document.getElementById('cart-foot');
  const totalEl = document.getElementById('cart-total');

  updateBadge(cart.item_count);

  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  totalEl.textContent = money(cart.total_price);

  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.product_title}</span>
        ${item.variant_title && item.variant_title !== 'Default Title'
          ? `<span style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;opacity:.38;display:block;margin-top:3px">${item.variant_title}</span>`
          : ''}
      </div>
      <div class="qty-control">
        <button class="qty-btn" type="button" onclick="changeQty('${item.key}', ${item.quantity - 1})">−</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" type="button" onclick="changeQty('${item.key}', ${item.quantity + 1})">+</button>
      </div>
      <span class="cart-item-price">${money(item.line_price)}</span>
    </div>
  `).join('');
}

function fetchCart() {
  fetch('/cart.js')
    .then(r => r.json())
    .then(renderCartItems)
    .catch(console.error);
}

function changeQty(key, qty) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  })
    .then(r => r.json())
    .then(renderCartItems)
    .catch(console.error);
}

document.querySelectorAll('.btn-atc').forEach(btn => {
  btn.addEventListener('click', () => {
    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    btn.textContent = '…';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
      .then(r => r.json())
      .then(() => {
        btn.textContent = 'Added ✓';
        btn.classList.add('added');
        fetchCart();
        openCart();
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.classList.remove('added');
          btn.disabled = false;
        }, 1400);
      })
      .catch(() => {
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      });
  });
});

/* Init badge on page load */
fetchCart();

/* Newsletter */
const nlBtn = document.getElementById('nl-btn');
if (nlBtn) {
  function submitNewsletter() {
    const email = document.getElementById('nl-email').value;
    if (!email.includes('@')) return;
    document.getElementById('nl-form').style.display = 'none';
    document.getElementById('nl-headline').innerHTML = "Thank you.<br><em>We'll be in touch.</em>";
    document.getElementById('nl-body').textContent = "You're on the list. Watch your inbox for something special.";
  }
  nlBtn.addEventListener('click', submitNewsletter);
  document.getElementById('nl-email').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitNewsletter();
  });
}
