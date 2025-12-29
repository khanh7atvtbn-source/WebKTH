function login(event) {
  event.preventDefault();
  const u = document.getElementById("username")?.value.trim();
  const p = document.getElementById("password")?.value.trim();
  const e = document.getElementById("error");

  if (u === "admin" && p === "123") {
    window.location.href = "admin.html";
  } else if (e) {
    e.innerText = "Sai tài khoản hoặc mật khẩu!";
  }
}

let products = [];

// LẤY DỮ LIỆU TỪ data.json (mô phỏng CSDL)
fetch("./data.json")
  .then((res) => {
    if (!res.ok) throw new Error("Không tìm thấy data.json");
    return res.json();
  })
  .then((data) => {
    products = data;
    renderProductsPage();
  })
  .catch((err) => console.error(err));

function renderProductsPage() {
  const container = document.getElementById("productContainer");
  if (!container) return;

  container.innerHTML = "";
  products.forEach((p) => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p class="price">${p.price.toLocaleString()}đ</p>
        <button onclick="addToCart('${p.name}', ${p.price})">
          Thêm vào giỏ
        </button>
      </div>
    `;
  });
}

/* ===== GIỎ HÀNG ===== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  const item = cart.find((i) => i.name === name);
  item ? item.quantity++ : cart.push({ name, price, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  showToast();
}

function loadCart() {
  const list = document.getElementById("cartList");
  const total = document.getElementById("totalPrice");
  if (!list || !total) return;

  let sum = 0;
  list.innerHTML = "";

  cart.forEach((i, idx) => {
    sum += i.price * i.quantity;
    list.innerHTML += `
      <li>
        ${i.name} x ${i.quantity}
        <button onclick="removeItem(${idx})">❌</button>
      </li>
    `;
  });

  total.innerText = sum.toLocaleString();
}

function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  if (!confirm("Bạn chắc chắn muốn xoá giỏ hàng?")) return;
  cart = [];
  localStorage.removeItem("cart");
  loadCart();
}

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

document.addEventListener("DOMContentLoaded", loadCart);
