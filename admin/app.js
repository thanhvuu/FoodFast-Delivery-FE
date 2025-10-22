const state = {
  orders: [
    {
      id: 'DH-1024',
      customer: 'Nguyễn Văn A',
      status: 'delivering',
      payment: 'cash',
      amount: 320000,
      createdAt: '2024-05-14 10:25',
    },
    {
      id: 'DH-1025',
      customer: 'Trần Thị B',
      status: 'delivered',
      payment: 'card',
      amount: 215000,
      createdAt: '2024-05-14 10:40',
    },
    {
      id: 'DH-1026',
      customer: 'Phạm Minh C',
      status: 'delivered',
      payment: 'cash',
      amount: 540000,
      createdAt: '2024-05-14 11:10',
    },
    {
      id: 'DH-1027',
      customer: 'Lê Hoàng D',
      status: 'delivering',
      payment: 'card',
      amount: 189000,
      createdAt: '2024-05-14 11:22',
    },
  ],
  dishes: [
    {
      id: crypto.randomUUID(),
      name: 'Cơm gà xối mỡ',
      category: 'Món chính',
      price: 55000,
      status: 'available',
    },
    {
      id: crypto.randomUUID(),
      name: 'Bún bò Huế',
      category: 'Món nước',
      price: 65000,
      status: 'available',
    },
    {
      id: crypto.randomUUID(),
      name: 'Trà đào cam sả',
      category: 'Đồ uống',
      price: 39000,
      status: 'available',
    },
  ],
  accounts: [
    {
      id: crypto.randomUUID(),
      username: 'admin',
      fullName: 'Quản trị viên',
      role: 'admin',
      status: 'active',
    },
    {
      id: crypto.randomUUID(),
      username: 'staff01',
      fullName: 'Phan Mỹ Linh',
      role: 'staff',
      status: 'active',
    },
    {
      id: crypto.randomUUID(),
      username: 'staff02',
      fullName: 'Nguyễn Thành Long',
      role: 'staff',
      status: 'locked',
    },
  ],
  editingDishId: null,
};

const ordersTable = document.getElementById('ordersTable');
const menuTable = document.getElementById('menuTable');
const accountsTable = document.getElementById('accountsTable');
const menuCount = document.getElementById('menuCount');

const filterStatus = document.getElementById('filterStatus');
const filterPayment = document.getElementById('filterPayment');
const globalSearch = document.getElementById('globalSearch');

const dishForm = document.getElementById('dishForm');
const dishNameInput = document.getElementById('dishName');
const dishCategoryInput = document.getElementById('dishCategory');
const dishPriceInput = document.getElementById('dishPrice');
const dishStatusInput = document.getElementById('dishStatus');
const resetFormBtn = document.getElementById('resetFormBtn');
const addDishBtn = document.getElementById('addDishBtn');

const accountDialog = document.getElementById('accountDialog');
const accountForm = document.getElementById('accountForm');
const addAccountBtn = document.getElementById('addAccountBtn');
const confirmDialog = document.getElementById('confirmDialog');
const confirmMessage = document.getElementById('confirmMessage');
const darkModeToggle = document.getElementById('darkModeToggle');

const navButtons = document.querySelectorAll('.nav__item');
const panels = document.querySelectorAll('.panel');

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const createStatusPill = (value) => {
  const span = document.createElement('span');
  span.className = `status-pill ${value}`;
  span.textContent =
    {
      delivering: 'Đang giao',
      delivered: 'Đã giao',
      cash: 'Tiền mặt',
      card: 'Thẻ',
      available: 'Đang bán',
      out_of_stock: 'Hết hàng',
      active: 'Hoạt động',
      locked: 'Đã khóa',
    }[value] || value;
  return span;
};

function renderOrders() {
  const statusFilter = filterStatus.value;
  const paymentFilter = filterPayment.value;
  const keyword = globalSearch.value.trim().toLowerCase();

  const filteredOrders = state.orders.filter((order) => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || order.payment === paymentFilter;
    const matchKeyword =
      !keyword ||
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);
    return matchStatus && matchPayment && matchKeyword;
  });

  ordersTable.replaceChildren(
    ...filteredOrders.map((order) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td></td>
        <td></td>
        <td>${formatCurrency(order.amount)}</td>
        <td>${order.createdAt}</td>
      `;

      row.children[2].appendChild(createStatusPill(order.status));
      row.children[3].appendChild(createStatusPill(order.payment));
      return row;
    }),
  );
}

function renderDishes() {
  menuCount.textContent = `${state.dishes.length} món`;

  menuTable.replaceChildren(
    ...state.dishes.map((dish) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.category}</td>
        <td>${formatCurrency(dish.price)}</td>
        <td></td>
        <td class="col-actions">
          <div class="table-actions">
            <button type="button" data-action="edit" data-id="${dish.id}">Sửa</button>
            <button type="button" class="delete" data-action="delete" data-id="${dish.id}">Xóa</button>
          </div>
        </td>
      `;
      row.children[3].appendChild(createStatusPill(dish.status));
      return row;
    }),
  );
}

function renderAccounts() {
  accountsTable.replaceChildren(
    ...state.accounts.map((account) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${account.username}</td>
        <td>${account.fullName}</td>
        <td>${account.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</td>
        <td></td>
        <td class="col-actions">
          <div class="table-actions">
            <button type="button" data-action="toggle" data-id="${account.id}">
              ${account.status === 'active' ? 'Khóa' : 'Mở khóa'}
            </button>
            <button type="button" class="delete" data-action="delete" data-id="${account.id}">
              Xóa
            </button>
          </div>
        </td>
      `;
      row.children[3].appendChild(createStatusPill(account.status));
      return row;
    }),
  );
}

function switchPanel(targetId) {
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => switchPanel(button.dataset.target));
});

filterStatus.addEventListener('change', renderOrders);
filterPayment.addEventListener('change', renderOrders);
globalSearch.addEventListener('input', () => {
  renderOrders();
  renderDishes();
  renderAccounts();
});

function resetDishForm() {
  dishForm.reset();
  state.editingDishId = null;
  dishForm.querySelector('button[type="submit"]').textContent = 'Lưu món';
}

addDishBtn.addEventListener('click', () => {
  resetDishForm();
  dishForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  dishForm.querySelector('input').focus();
});

resetFormBtn.addEventListener('click', resetDishForm);

dishForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(dishForm);
  const dish = Object.fromEntries(formData.entries());
  dish.price = Number(dish.price);

  if (!dish.name.trim()) {
    dishNameInput.focus();
    return;
  }

  if (state.editingDishId) {
    const index = state.dishes.findIndex((item) => item.id === state.editingDishId);
    if (index !== -1) {
      state.dishes[index] = { ...state.dishes[index], ...dish };
    }
  } else {
    state.dishes.unshift({ id: crypto.randomUUID(), ...dish });
  }

  resetDishForm();
  renderDishes();
});

menuTable.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;
  const dish = state.dishes.find((item) => item.id === id);

  if (action === 'edit' && dish) {
    state.editingDishId = id;
    dishNameInput.value = dish.name;
    dishCategoryInput.value = dish.category;
    dishPriceInput.value = dish.price;
    dishStatusInput.value = dish.status;
    dishForm.querySelector('button[type="submit"]').textContent = 'Cập nhật món';
    dishForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (action === 'delete' && dish) {
    openConfirm(`Xóa món "${dish.name}"?`, () => {
      state.dishes = state.dishes.filter((item) => item.id !== id);
      renderDishes();
    });
  }
});

accountsTable.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;
  const account = state.accounts.find((item) => item.id === id);

  if (action === 'toggle' && account) {
    const nextStatus = account.status === 'active' ? 'locked' : 'active';
    account.status = nextStatus;
    renderAccounts();
  }

  if (action === 'delete' && account) {
    openConfirm(`Xóa tài khoản "${account.username}"?`, () => {
      state.accounts = state.accounts.filter((item) => item.id !== id);
      renderAccounts();
    });
  }
});

addAccountBtn.addEventListener('click', () => {
  accountForm.reset();
  accountDialog.showModal();
  accountForm.accountUsername.focus();
});

accountDialog.addEventListener('close', () => {
  if (accountDialog.returnValue !== 'confirm') return;

  const formData = new FormData(accountForm);
  const account = Object.fromEntries(formData.entries());
  const username = account.username.trim();

  if (!username) return;

  if (state.accounts.some((item) => item.username === username)) {
    alert('Tên đăng nhập đã tồn tại.');
    return;
  }

  state.accounts.unshift({ id: crypto.randomUUID(), ...account });
  renderAccounts();
});

function openConfirm(message, onConfirm) {
  confirmMessage.textContent = message;
  confirmDialog.showModal();
  confirmDialog.onclose = () => {
    if (confirmDialog.returnValue === 'confirm') {
      onConfirm();
    }
  };
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const setTheme = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('ff-admin-theme', dark ? 'dark' : 'light');
};

setTheme(localStorage.getItem('ff-admin-theme') === 'dark' || prefersDark.matches);

darkModeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('ff-admin-theme', isDark ? 'dark' : 'light');
});

prefersDark.addEventListener('change', (event) => {
  const stored = localStorage.getItem('ff-admin-theme');
  if (!stored) {
    setTheme(event.matches);
  }
});

renderOrders();
renderDishes();
renderAccounts();
