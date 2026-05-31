/* app.js - Interactive Logic for SiKasir Landing Page */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Cursor Aura Tracker (Premium Fluid Effect)
  const cursorAura = document.createElement('div');
  cursorAura.className = 'cursor-aura';
  document.body.appendChild(cursorAura);

  let mouseX = 0;
  let mouseY = 0;
  let auraX = 0;
  let auraY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateAura() {
    // Add inertia/friction to make the glow glide smoothly
    const delay = 8;
    auraX += (mouseX - auraX) / delay;
    auraY += (mouseY - auraY) / delay;

    cursorAura.style.left = `${auraX}px`;
    cursorAura.style.top = `${auraY}px`;

    requestAnimationFrame(animateAura);
  }
  animateAura();

  // 3. Scroll Reveal Effect
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 4. VISUALIZER 1: Interactive Dashboard Mockup
  const mockupTabs = document.querySelectorAll('.mockup-tab');
  const mockupPanels = document.querySelectorAll('.mockup-panel');

  mockupTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-tab');
      
      // Update active tab button
      mockupTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Fade out current panel, fade in new panel
      mockupPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${targetPanelId}-panel`) {
          setTimeout(() => {
            panel.classList.add('active');
            // Re-trigger icon updates if needed
            if (typeof lucide !== 'undefined') {
              lucide.createIcons({ attrs: { class: 'lucide-icon' } });
            }
          }, 50);
        }
      });
    });
  });

  // 5. VISUALIZER 2: Virtual Member Card Generator
  const nameInput = document.getElementById('member-name-input');
  const idInput = document.getElementById('member-id-input');
  const tierSelect = document.getElementById('member-tier-input');

  const cardName = document.getElementById('card-name-val');
  const cardId = document.getElementById('card-id-val');
  const cardTier = document.getElementById('card-tier-val');
  const virtualCard = document.getElementById('virtual-card-preview');

  function updateVirtualCard() {
    const name = nameInput.value.trim() || 'NAMA ANGGOTA';
    const idNum = idInput.value.trim() || 'NIM / NIK / NIP';
    const tier = tierSelect.value;

    cardName.textContent = name.toUpperCase();
    cardId.textContent = idNum;
    cardTier.textContent = tierSelect.options[tierSelect.selectedIndex].text;

    // Dynamically change card glow based on tier
    if (tier === 'dosen') {
      virtualCard.style.borderColor = 'var(--secondary)';
      virtualCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px hsla(174, 90%, 41%, 0.25)';
      cardTier.style.background = 'hsla(174, 90%, 41%, 0.15)';
      cardTier.style.borderColor = 'hsla(174, 90%, 41%, 0.3)';
      cardTier.style.color = 'var(--secondary)';
    } else if (tier === 'umum') {
      virtualCard.style.borderColor = 'var(--accent-pink)';
      virtualCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px hsla(320, 80%, 60%, 0.25)';
      cardTier.style.background = 'hsla(320, 80%, 60%, 0.15)';
      cardTier.style.borderColor = 'hsla(320, 80%, 60%, 0.3)';
      cardTier.style.color = 'var(--accent-pink)';
    } else { // mahasiswa (default emerald)
      virtualCard.style.borderColor = 'var(--primary)';
      virtualCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px hsla(150, 84%, 43%, 0.25)';
      cardTier.style.background = 'hsla(150, 84%, 43%, 0.15)';
      cardTier.style.borderColor = 'hsla(150, 84%, 43%, 0.3)';
      cardTier.style.color = 'var(--primary)';
    }

    // Dynamic QR generation (mock offline with a neat visual)
    const qrImage = document.querySelector('.card-qr-box img');
    if (qrImage) {
      const qrData = encodeURIComponent(`SIKASIR:${tier}:${idNum}:${name}`);
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&color=1a202c`;
    }
  }

  nameInput.addEventListener('input', updateVirtualCard);
  idInput.addEventListener('input', updateVirtualCard);
  tierSelect.addEventListener('change', updateVirtualCard);

  // 6. VISUALIZER 3: POS Cashier Cart Simulator
  const products = [
    { id: 1, name: 'Buku Novel Laskar Pelangi', category: 'Buku', price: 85000, stock: 15, icon: 'book-open' },
    { id: 2, name: 'Pulpen Ballpoint Jet', category: 'ATK', price: 3000, stock: 120, icon: 'pen' },
    { id: 3, name: 'Buku Tulis Sekolah 38lbr', category: 'ATK', price: 4500, stock: 85, icon: 'file-text' },
    { id: 4, name: 'Map Plastik Dokumen', category: 'ATK', price: 5000, stock: 200, icon: 'folder' },
    { id: 5, name: 'Merchandise Kunci SiKasir', category: 'Merchandise', price: 12000, stock: 50, icon: 'award' },
    { id: 6, name: 'Buku Novel Bumi Manusia', category: 'Buku', price: 98000, stock: 8, icon: 'book' }
  ];

  let cart = [];
  let selectedPayment = 'cash';
  const posCatalog = document.getElementById('pos-catalog-grid');
  const posCartItems = document.getElementById('pos-cart-items-container');
  const posSubtotal = document.getElementById('pos-subtotal');
  const posDiscount = document.getElementById('pos-discount');
  const posTotal = document.getElementById('pos-total');
  const paymentBtns = document.querySelectorAll('.payment-btn');
  const checkoutBtn = document.getElementById('pos-checkout-btn');
  const receiptModal = document.getElementById('receipt-modal');

  // Render POS Catalog
  function renderCatalog() {
    posCatalog.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'pos-prod-card';
      card.innerHTML = `
        <i data-lucide="${p.icon}"></i>
        <span class="pos-prod-name">${p.name}</span>
        <span class="pos-prod-price">Rp ${p.price.toLocaleString('id-ID')}</span>
        <span class="pos-prod-stock">Stok: ${p.stock}</span>
      `;
      card.addEventListener('click', () => addToCart(p));
      posCatalog.appendChild(card);
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        existing.qty++;
      } else {
        alert('Stok produk tidak mencukupi!');
      }
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
  }

  function removeFromCart(productId, decreaseOnly = false) {
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      if (decreaseOnly && cart[existingIndex].qty > 1) {
        cart[existingIndex].qty--;
      } else {
        cart.splice(existingIndex, 1);
      }
    }
    updateCart();
  }

  function updateCart() {
    if (cart.length === 0) {
      posCartItems.innerHTML = `
        <div class="pos-cart-empty">
          <i data-lucide="shopping-cart" style="width: 32px; height: 32px;"></i>
          <span>Keranjang Belanja Kosong</span>
        </div>
      `;
      posSubtotal.textContent = 'Rp 0';
      posTotal.textContent = 'Rp 0';
      checkoutBtn.disabled = true;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      return;
    }

    checkoutBtn.disabled = false;
    posCartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const rowTotal = item.price * item.qty;
      subtotal += rowTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'pos-cart-item';
      itemEl.innerHTML = `
        <div>
          <span class="cart-item-name">${item.name}</span>
          <br>
          <small class="text-muted">${item.qty} x Rp ${item.price.toLocaleString('id-ID')}</small>
        </div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn decrease-qty" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="cart-qty-btn increase-qty" data-id="${item.id}">+</button>
          <span style="font-weight: 600; margin-left: 8px;">Rp ${rowTotal.toLocaleString('id-ID')}</span>
        </div>
      `;
      posCartItems.appendChild(itemEl);
    });

    const discount = subtotal > 150000 ? Math.floor(subtotal * 0.05) : 0; // 5% dynamic promo discount over 150k
    const total = subtotal - discount;

    posSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    posDiscount.textContent = discount > 0 ? `-Rp ${discount.toLocaleString('id-ID')} (Promo 5%)` : 'Rp 0';
    posTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Reattach listeners
    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromCart(parseInt(btn.getAttribute('data-id')), true);
      });
    });
    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prod = products.find(p => p.id === parseInt(btn.getAttribute('data-id')));
        addToCart(prod);
      });
    });
  }

  // Payment Toggle
  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPayment = btn.getAttribute('data-method');
    });
  });

  // Checkout Receipt Trigger
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let subtotal = 0;
    let itemsRows = '';
    cart.forEach(item => {
      const rowTotal = item.price * item.qty;
      subtotal += rowTotal;
      itemsRows += `${item.name.padEnd(24).substring(0, 24)} x${item.qty} Rp${rowTotal.toLocaleString('id-ID')}\n`;
    });

    const discount = subtotal > 150000 ? Math.floor(subtotal * 0.05) : 0;
    const total = subtotal - discount;
    const timeNow = new Date().toLocaleString('id-ID');
    const transNumber = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentMethodName = selectedPayment.toUpperCase();
    const moneyPaid = selectedPayment === 'cash' ? Math.ceil(total / 50000) * 50000 : total;
    const change = moneyPaid - total;

    const receiptContent = `
================================
       STRUK KASIR SIKASIR      
================================
No: ${transNumber}
Tgl: ${timeNow}
Petugas: Admin Perpustakaan
--------------------------------
${itemsRows}--------------------------------
SUBTOTAL  : Rp ${subtotal.toLocaleString('id-ID')}
DISKON    : Rp ${discount.toLocaleString('id-ID')}
TOTAL     : Rp ${total.toLocaleString('id-ID')}
--------------------------------
METODE    : ${paymentMethodName}
BAYAR     : Rp ${moneyPaid.toLocaleString('id-ID')}
KEMBALI   : Rp ${change.toLocaleString('id-ID')}
================================
      TERIMA KASIH ATAS         
     KUNJUNGAN & TRANSAKSI      
================================
`;

    document.getElementById('receipt-text').textContent = receiptContent;
    receiptModal.classList.add('active');

    // Simulate stock deduction visually
    cart.forEach(item => {
      const original = products.find(p => p.id === item.id);
      if (original) {
        original.stock = Math.max(0, original.stock - item.qty);
      }
    });

    // Reset Cart
    cart = [];
    updateCart();
    renderCatalog();
  });

  // Close Struk
  document.getElementById('close-receipt-btn').addEventListener('click', () => {
    receiptModal.classList.remove('active');
  });

  // Initialize POS
  renderCatalog();
  updateCart();

  // 7. VISUALIZER 4: Business Intelligence & Analisis Penjualan
  const monthsData = {
    'mei': {
      monthName: 'Mei 2026',
      totalRevenue: 'Rp 12.660.000',
      totalTransactions: '240 Transaksi',
      posRevenue: 8420000,
      fineRevenue: 1840000,
      membershipRevenue: 2400000,
      momGrowth: '+12.4% MoM',
      growthDirection: 'up',
      // SVG path coordinates (X: days 1 to 31 normalized, Y: 0 to 100 where higher is lower value in SVG grid)
      posPath: 'M 10 160 L 50 140 L 90 150 L 130 110 L 170 130 L 210 90 L 250 80 L 290 95 L 330 60 L 370 70 L 410 40 L 450 55 L 490 30 L 530 45 L 570 10',
      finesPath: 'M 10 200 L 50 190 L 90 195 L 130 180 L 170 185 L 210 170 L 250 175 L 290 160 L 330 165 L 370 150 L 410 155 L 450 140 L 490 145 L 530 130 L 570 135',
      membershipPath: 'M 10 190 L 50 185 L 90 180 L 130 170 L 170 160 L 210 155 L 250 150 L 290 140 L 330 130 L 370 120 L 410 115 L 450 110 L 490 100 L 530 95 L 570 80',
      projectionPath: 'M 570 10 L 610 8 L 650 5 L 690 2',
      insightText: 'Pendapatan bulan Mei 2026 tumbuh pesat sebesar 12.4% MoM. Unit Point of Sale (POS) menyumbang porsi terbesar yaitu 66.5% karena lonjakan penjualan novel sastra baru. Proyeksi tren menggunakan rata-rata pergerakan sederhana (SMA-7) menunjukkan pendapatan berpotensi mencapai batas atas Rp 13.8M di akhir bulan berjalan dengan tingkat keyakinan (confidence) yang tinggi.'
    },
    'april': {
      monthName: 'April 2026',
      totalRevenue: 'Rp 11.260.000',
      totalTransactions: '215 Transaksi',
      posRevenue: 7500000,
      fineRevenue: 1620000,
      membershipRevenue: 2140000,
      momGrowth: '+4.7% MoM',
      growthDirection: 'up',
      posPath: 'M 10 180 L 50 165 L 90 170 L 130 140 L 170 150 L 210 120 L 250 110 L 290 125 L 330 90 L 370 100 L 410 70 L 450 85 L 490 60 L 530 75 L 570 40',
      finesPath: 'M 10 210 L 50 200 L 90 205 L 130 190 L 170 195 L 210 180 L 250 185 L 290 170 L 330 175 L 370 160 L 410 165 L 450 150 L 490 155 L 530 140 L 570 145',
      membershipPath: 'M 10 195 L 50 190 L 90 185 L 130 180 L 170 175 L 210 170 L 250 165 L 290 160 L 330 155 L 370 150 L 410 145 L 450 140 L 490 135 L 530 130 L 570 120',
      projectionPath: '',
      insightText: 'Stabilitas finansial tercapai di bulan April 2026. Pertumbuhan moderat ditopang oleh pendaftaran keanggotaan baru dari mahasiswa baru (iuran keanggotaan berkontribusi 19.0%). Denda keterlambatan tetap terkendali berkat sistem WhatsApp Link Reminder otomatis yang mencegah penumpukan keterlambatan.'
    },
    'maret': {
      monthName: 'Maret 2026',
      totalRevenue: 'Rp 10.750.000',
      totalTransactions: '202 Transaksi',
      posRevenue: 6900000,
      fineRevenue: 2050000,
      membershipRevenue: 1800000,
      momGrowth: '+8.1% MoM',
      growthDirection: 'up',
      posPath: 'M 10 190 L 50 180 L 90 185 L 130 160 L 170 170 L 210 140 L 250 130 L 290 145 L 330 110 L 370 120 L 410 90 L 450 105 L 490 80 L 530 95 L 570 60',
      finesPath: 'M 10 190 L 50 180 L 90 185 L 130 170 L 170 175 L 210 160 L 250 165 L 290 150 L 330 155 L 370 140 L 410 145 L 450 130 L 490 135 L 530 120 L 570 125',
      membershipPath: 'M 10 200 L 50 195 L 90 190 L 130 185 L 170 180 L 210 175 L 250 170 L 290 165 L 330 160 L 370 155 L 410 150 L 450 145 L 490 140 L 530 135 L 570 130',
      projectionPath: '',
      insightText: 'Pendapatan denda mencapai puncak triwulan di bulan Maret (Rp 2.05M) akibat periode pengembalian buku setelah Ujian Tengah Semester. Namun, seiring diterapkannya automasi denda SiKasir, pencatatan menjadi transparan dan tingkat sengketa dengan anggota berkurang sebesar 95%.'
    }
  };

  const monthsArray = ['maret', 'april', 'mei'];
  let currentMonthIndex = 2; // Default to Mei

  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const analyticsMonthLabel = document.getElementById('analytics-month-label');

  const metricTotalRevenue = document.getElementById('metric-total-rev');
  const metricTotalTrans = document.getElementById('metric-total-trans');
  const metricMoM = document.getElementById('metric-mom');
  const metricPosVal = document.getElementById('metric-pos-val');
  const metricFinesVal = document.getElementById('metric-fines-val');
  const metricMemberVal = document.getElementById('metric-member-val');

  const svgPosLine = document.getElementById('svg-pos-line');
  const svgFinesLine = document.getElementById('svg-fines-line');
  const svgMemberLine = document.getElementById('svg-member-line');
  const svgProjLine = document.getElementById('svg-proj-line');

  const insightTextContainer = document.getElementById('insight-text-val');

  function updateAnalyticsDisplay() {
    const key = monthsArray[currentMonthIndex];
    const data = monthsData[key];

    // Enable/disable navigation buttons
    prevMonthBtn.disabled = currentMonthIndex === 0;
    nextMonthBtn.disabled = currentMonthIndex === monthsArray.length - 1;

    // Transition elements text
    analyticsMonthLabel.textContent = data.monthName.toUpperCase();
    
    // KPI metrics updates with smooth numbering
    metricTotalRevenue.textContent = data.totalRevenue;
    metricTotalTrans.textContent = data.totalTransactions;
    
    metricMoM.innerHTML = `<i data-lucide="trending-up"></i> ${data.momGrowth}`;
    metricMoM.className = `trend-val ${data.growthDirection === 'up' ? 'trend-up' : 'trend-down'}`;

    metricPosVal.textContent = `Rp ${data.posRevenue.toLocaleString('id-ID')}`;
    metricFinesVal.textContent = `Rp ${data.fineRevenue.toLocaleString('id-ID')}`;
    metricMemberVal.textContent = `Rp ${data.membershipRevenue.toLocaleString('id-ID')}`;

    // SVG Chart path updates
    svgPosLine.setAttribute('d', data.posPath);
    svgFinesLine.setAttribute('d', data.finesPath);
    svgMemberLine.setAttribute('d', data.membershipPath);

    // Hide or show projection
    if (data.projectionPath) {
      svgProjLine.setAttribute('d', data.projectionPath);
      svgProjLine.style.display = 'block';
    } else {
      svgProjLine.style.display = 'none';
    }

    // SVG Stagger Stroke Animation reset
    const lines = [svgPosLine, svgFinesLine, svgMemberLine, svgProjLine];
    lines.forEach(line => {
      const length = line.getTotalLength ? line.getTotalLength() : 800;
      line.style.transition = 'none';
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      // Force repaint
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      line.style.strokeDashoffset = '0';
    });

    // Insight Typing Animation simulation
    typeInsightText(data.insightText);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  let typingTimer;
  function typeInsightText(text) {
    clearTimeout(typingTimer);
    insightTextContainer.textContent = '';
    let i = 0;
    const speed = 15; // ms per char

    function type() {
      if (i < text.length) {
        insightTextContainer.textContent += text.charAt(i);
        i++;
        typingTimer = setTimeout(type, speed);
      }
    }
    type();
  }

  prevMonthBtn.addEventListener('click', () => {
    if (currentMonthIndex > 0) {
      currentMonthIndex--;
      updateAnalyticsDisplay();
    }
  });

  nextMonthBtn.addEventListener('click', () => {
    if (currentMonthIndex < monthsArray.length - 1) {
      currentMonthIndex++;
      updateAnalyticsDisplay();
    }
  });

  // Init analytics page
  updateAnalyticsDisplay();

  // 8. ROI Pricing Cost Calculator
  const calcSlider = document.getElementById('calc-slider');
  const sliderVal = document.getElementById('slider-val');
  const calcResult = document.getElementById('calc-savings-result');

  calcSlider.addEventListener('input', () => {
    const value = parseInt(calcSlider.value);
    sliderVal.textContent = value.toLocaleString('id-ID');

    // Formula: 
    // Manual sirkulasi = 10 menit per transaksi ( loan/return/fine logging )
    // SiKasir automasi = 1 menit
    // Penghematan = 9 menit per transaksi
    // Gaji rata-rata operator per jam = Rp 25.000
    // Hemat biaya admin = hemat waktu (jam) * Rp 25.000 + penghematan denda otomatis (kebocoran kas rata-rata Rp 500.000)
    const minutesSaved = value * 9;
    const hoursSaved = minutesSaved / 60;
    const costSaved = Math.round(hoursSaved * 25000 + 450000);

    calcResult.textContent = `Rp ${costSaved.toLocaleString('id-ID')}`;
  });
});
