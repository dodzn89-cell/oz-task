// 제품 데이터 
const product_data = [
  { category: "상의", brand: "Supreme", product: "슈프림 박스로고 후드티", price: "390,000", gender: "남" },
  { category: "하의", brand: "DIESEL", product: "디젤 트랙 팬츠", price: "188,000", gender: "남" },
  { category: "신발", brand: "Nike", product: "에어포스 1", price: "137,000", gender: "ALL" },
  { category: "패션잡화", brand: "Music&Goods", product: "빵빵이 키링", price: "29,000", gender: "여" },

  // 상품 추가
  { category: "상의", brand: "Stussy", product: "스투시 베이직 티셔츠", price: "79,000", gender: "남" },
  { category: "신발", brand: "Adidas", product: "삼바 OG", price: "129,000", gender: "여" },
  { category: "하의", brand: "Levi's", product: "리바이스 501 데님", price: "149,000", gender: "남" },
];

// DOM 
const product_data_Table = document.getElementById("product_data_Table");
const categorySelect = document.getElementById("inlineFormSelectPref");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genderSelect = document.getElementById("genderSelect");
const pagination = document.getElementById("pagination");

const clock = document.getElementById("clock");
const darkToggle = document.getElementById("darkToggle");

const openSignup = document.getElementById("openSignup");
const signupResult = document.getElementById("signupResult");

// 페이지네이션 
const PAGE_SIZE = 4;     
const MIN_PAGES = 3;     

let currentPage = 1;
let filtered = [...product_data];

// 필터 
function applyFilter() {
  const category = categorySelect.value;
  const keyword = searchInput.value.trim().toLowerCase();
  const gender = genderSelect.value;

  filtered = product_data.filter((item) => {
    const okCategory = category === "ALL" || item.category === category;
    const okKeyword = keyword === "" || item.product.toLowerCase().includes(keyword);
    const okGender = gender === "ALL" || item.gender === "ALL" || item.gender === gender;
    return okCategory && okKeyword && okGender;
  });

  currentPage = 1;
  render();
}

// 테이블 
function renderTable() {
  product_data_Table.innerHTML = "";

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  pageItems.forEach((item) => {
    const row = product_data_Table.insertRow();
    row.insertCell(0).innerText = item.category;
    row.insertCell(1).innerText = item.brand;
    row.insertCell(2).innerText = item.product;
    row.insertCell(3).innerHTML = `<div class="text-end">${item.price}</div>`;
  });

  if (pageItems.length === 0) {
    const row = product_data_Table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 4;
    cell.className = "text-center py-3 text-muted";
    cell.innerText = "검색 결과가 없습니다.";
  }
}

// 페이지네이션 
function renderPagination() {
  pagination.innerHTML = "";

  const realTotal = Math.ceil(filtered.length / PAGE_SIZE);
  const totalPages = Math.max(MIN_PAGES, realTotal || 1);

  // Previous
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<button class="page-link" type="button">Previous</button>`;
  prevLi.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  };
  pagination.appendChild(prevLi);

  // 1..totalPages
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<button class="page-link" type="button">${i}</button>`;
    li.onclick = () => {
      currentPage = i;
      render();
    };
    pagination.appendChild(li);
  }

  // Next
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `<button class="page-link" type="button">Next</button>`;
  nextLi.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  };
  pagination.appendChild(nextLi);
}

function render() {
  renderTable();
  renderPagination();
}

// ===== 이벤트 =====
searchBtn.addEventListener("click", applyFilter);
categorySelect.addEventListener("change", applyFilter);
genderSelect.addEventListener("change", applyFilter);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyFilter();
  }
});

// 날짜/시간 
function tick() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  clock.textContent = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}
setInterval(tick, 1000);
tick();

// 다크모드 
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkToggle.textContent = isDark ? "라이트모드" : "다크모드";
  darkToggle.className = isDark ? "btn btn-outline-light btn-sm" : "btn btn-outline-dark btn-sm";
});

// 새 창 회원가입 열기 
openSignup.addEventListener("click", () => {
  //  주소창 옆 팝업 허용
  window.open(
    "./signup.html",
    "signupWindow",
    "width=480,height=700,top=100,left=200"
  );
});

// 가입완료 메시지 받기 
window.addEventListener("message", (event) => {
  // 같은 서버에서 열린 창인지 기본 체크

  const data = event.data;
  if (!data || data.type !== "SIGNUP_DONE") return;

  signupResult.classList.remove("d-none");
  signupResult.textContent = `회원가입 완료 🎉  아이디: ${data.id}, 이름: ${data.name}, 성별: ${data.gender}, 이메일: ${data.email}`;
});

// 초기 렌더 
render();