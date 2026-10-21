// Catalogo: los filtros y las tarjetas se generan a partir de estos datos.
const products = [
  {
    id: "rosa-eterea",
    name: "Rosa etérea",
    category: "minimalista",
    label: "MÁS ELEGIDO",
    price: 7500,
    description: "Rosa translúcido con un brillo delicado.",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80",
    alt: "Manicura en tonos pastel con destellos",
  },
  {
    id: "french-nube",
    name: "French nube",
    category: "frances",
    label: "CLÁSICO",
    price: 8500,
    description: "La francesa de siempre, con un toque suave.",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=80",
    alt: "Uñas con diseño claro y elegante",
  },
  {
    id: "cereza-gloss",
    name: "Cereza gloss",
    category: "glam",
    label: "NUEVO",
    price: 9000,
    description: "Rojo cereza intenso y acabado espejo.",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
    alt: "Diseño de uñas rojo con pequeños detalles",
  },
  {
    id: "perla-minimal",
    name: "Perla minimal",
    category: "minimalista",
    label: "PARA TODOS LOS DÍAS",
    price: 6500,
    description: "Tonos nude con un detalle perlado.",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=80",
    alt: "Diseño de uñas en tonos nude",
  },
  {
    id: "french-rosada",
    name: "French rosada",
    category: "frances",
    label: "FAVORITO",
    price: 8000,
    description: "Puntas rosadas para una francesa distinta.",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80&sat=-15",
    alt: "Diseño de uñas rosadas",
  },
  {
    id: "noche-de-brillo",
    name: "Noche de brillo",
    category: "glam",
    label: "UN POCO DE GLAM",
    price: 10000,
    description: "Destellos para que tus manos sean protagonistas.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    alt: "Manicura de noche con brillo",
  },
];

// Elementos de la pagina que se actualizan desde JavaScript.
const productGrid = document.querySelector("#product-grid");
const cartCount = document.querySelector("#cart-count");
const drawerCount = document.querySelector("#drawer-count");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const subtotal = document.querySelector("#cart-subtotal");
const drawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const customizeDialog = document.querySelector("#customize-dialog");
const toast = document.querySelector("#toast");

let cart = [];
let selectedProduct = null;
let activeFilter = "todos";
let toastTimer;

// Formato y renderizado del catalogo y el carrito.
function formatPrice(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderProducts() {
  const visibleProducts =
    activeFilter === "todos"
      ? products
      : products.filter((product) => product.category === activeFilter);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        <span class="product-tag">${product.label}</span>
      </div>
      <div class="product-details">
        <div class="product-meta">
          <h3>${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <button class="product-order" type="button" data-product-id="${product.id}">
          <span>Personalizar diseño</span><span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  `,
    )
    .join("");
}

// Apertura y cierre del panel lateral.
function openCart() {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("visible"));
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("visible");
  document.body.classList.remove("cart-open");
  window.setTimeout(() => {
    if (!drawer.classList.contains("open")) overlay.hidden = true;
  }, 250);
  document.querySelector("#open-cart").focus();
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  cartCount.textContent = itemCount;
  drawerCount.textContent = `(${itemCount})`;
  cartEmpty.hidden = cart.length > 0;
  cartSummary.hidden = cart.length === 0;
  cartItems.innerHTML = cart
    .map(
      (item) => `
    <article class="cart-item">
      <img src="${item.product.image}" alt="" />
      <div>
        <h3>${item.product.name}</h3>
        <p>${item.shape} · Talla ${item.size}${item.note ? `<br />${escapeHtml(item.note)}` : ""}</p>
        <div class="quantity-control" aria-label="Cantidad de ${item.product.name}">
          <button type="button" data-action="decrease" data-key="${item.key}" aria-label="Quitar una unidad">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-key="${item.key}" aria-label="Añadir una unidad">+</button>
        </div>
        <button class="remove-item" type="button" data-action="remove" data-key="${item.key}">Quitar</button>
      </div>
      <strong class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</strong>
    </article>
  `,
    )
    .join("");
  subtotal.textContent = formatPrice(cartTotal);

  const orderLines = cart.map(
    (item) =>
      `• ${item.product.name} x${item.quantity} — ${item.shape}, talla ${item.size}${item.note ? `; detalle: ${item.note}` : ""} (${formatPrice(item.product.price * item.quantity)})`,
  );
  const subject = encodeURIComponent("Pedido personalizado — IVORA Nails");
  const body = encodeURIComponent(
    `¡Hola! Quiero solicitar este pedido:\n\n${orderLines.join("\n")}\n\nSubtotal: ${formatPrice(cartTotal)}\n\nMis datos de contacto:\n`,
  );
  document.querySelector("#checkout-link").href =
    `mailto:ivalverde2026@alu.uct.cl?subject=${subject}&body=${body}`;
}

// Evita interpretar como HTML el texto opcional escrito por el usuario.
function escapeHtml(value) {
  const safeValue = String(value ?? "");
  return safeValue.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

// Eventos de filtros, personalizacion y controles del carrito.
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelector(".filter-button.active")?.classList.remove("active");
    button.classList.add("active");
    renderProducts();
  });
});

if (productGrid) {
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-id]");
    if (!button) return;
    selectedProduct = products.find(
      (product) => product.id === button.dataset.productId,
    );
    if (!selectedProduct) return;
    const selectedDesign = document.querySelector("#selected-design");
    const nailNote = document.querySelector("#nail-note");
    if (selectedDesign) {
      selectedDesign.textContent =
        `${selectedProduct.name} · ${formatPrice(selectedProduct.price)}`;
    }
    if (nailNote) nailNote.value = "";
    if (customizeDialog) customizeDialog.showModal();
  });
}

const customizeForm = document.querySelector("#customize-form");
if (customizeForm) {
  customizeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedProduct) return;
    const shape = document.querySelector("#nail-shape")?.value ?? "Almendra";
    const size = document.querySelector("#nail-size")?.value ?? "M";
    const note = document.querySelector("#nail-note")?.value.trim() ?? "";
    const key = `${selectedProduct.id}|${shape}|${size}|${note}`;
    const existingItem = cart.find((item) => item.key === key);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        key,
        product: selectedProduct,
        shape,
        size,
        note,
        quantity: 1,
      });
    }
    renderCart();
    if (customizeDialog) customizeDialog.close();
    showToast(`${selectedProduct.name} se añadió a tu carrito`);
  });
}

const closeDialogButton = document.querySelector("#close-dialog");
if (closeDialogButton) {
  closeDialogButton.addEventListener("click", () => customizeDialog?.close());
}
if (customizeDialog) {
  customizeDialog.addEventListener("click", (event) => {
    if (event.target === customizeDialog) customizeDialog.close();
  });
}
document.querySelector("#open-cart")?.addEventListener("click", openCart);
document.querySelector("#close-cart")?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);
document.querySelector("#shop-from-cart")?.addEventListener("click", () => {
  closeCart();
  document.querySelector("#coleccion")?.scrollIntoView({ behavior: "smooth" });
});
if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const item = cart.find((cartItem) => cartItem.key === button.dataset.key);
    if (!item) return;
    if (button.dataset.action === "increase") item.quantity += 1;
    if (button.dataset.action === "decrease") item.quantity -= 1;
    if (button.dataset.action === "remove" || item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.key !== item.key);
    }
    renderCart();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer?.classList.contains("open")) closeCart();
});

// Primer renderizado al cargar la pagina.
renderProducts();
renderCart();
