document.addEventListener('DOMContentLoaded', function() {

    // ==================== MODO CLARO/ESCURO ====================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const body = document.body;

    const savedTheme = localStorage.getItem('y2kbite_theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeText) themeText.textContent = 'Modo Escuro';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            if (isLight) {
                if (themeIcon) themeIcon.className = 'fas fa-sun';
                if (themeText) themeText.textContent = 'Modo Escuro';
                localStorage.setItem('y2kbite_theme', 'light');
            } else {
                if (themeIcon) themeIcon.className = 'fas fa-moon';
                if (themeText) themeText.textContent = 'Modo Claro';
                localStorage.setItem('y2kbite_theme', 'dark');
            }
        });
    }

    // ==================== DADOS DO CARDÁPIO ====================
    const menuData = [
        { id: 1, name: "Hambúrguer Bacon Cheddar", category: "burger", price: 24.99, desc: "Pão brioche, blend 180g, bacon crocante, cheddar derretido.", emoji: "🍔", badge: "Mais Pedido", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
        { id: 2, name: "Batata Frita Média", category: "porcao", price: 15.00, desc: "Batatas crocantes com sal e tempero especial.", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400" },
        { id: 3, name: "Coca-Cola 1L", category: "bebida", price: 9.99, desc: "Refrigerante gelado.", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
        { id: 4, name: "Combo Y2K", category: "combo", price: 34.99, desc: "Hambúrguer + Batata + Coca-Cola.", emoji: "🍔", badge: "Combo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
        { id: 5, name: "Pudim", category: "sobremesa", price: 14.99, desc: "Pudim de leite condensado com calda de caramelo.", emoji: "🍮", img: "https://images.pexels.com/photos/34520971/pexels-photo-34520971.jpeg" },
        { id: 6, name: "Pizza de Pepperoni", category: "pizza", price: 29.99, desc: "Massa artesanal, mussarela e pepperoni.", emoji: "", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
        { id: 7, name: "Cheeseburger Clássico", category: "burger", price: 19.99, desc: "Pão, blend 150g, queijo cheddar.", emoji: "🍔", img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400" },
        { id: 8, name: "Batata Frita Grande", category: "porcao", price: 22.00, desc: "Porção grande com cheddar e bacon.", emoji: "🍟", img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400" },
        { id: 9, name: "Milk Shake", category: "bebida", price: 16.99, desc: "Chocolate, morango ou baunilha.", emoji: "🥤", badge: "Novo", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400" },
        { id: 10, name: "Pizza Margherita", category: "pizza", price: 26.99, desc: "Mussarela de búfala e manjericão.", emoji: "", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
        { id: 11, name: "Brownie com Sorvete", category: "sobremesa", price: 18.99, desc: "Brownie quente com sorvete.", emoji: "🍫", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400" },
        { id: 12, name: "Combo Duplo", category: "combo", price: 44.99, desc: "2 Burgers + 2 Batatas + 2 Refris.", emoji: "🍔", badge: "Promo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
        { id: 13, name: "Onion Rings", category: "porcao", price: 18.99, desc: "Anéis de cebola crocantes.", emoji: "🧅", img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400" },
        { id: 14, name: "Suco Natural", category: "bebida", price: 11.99, desc: "Laranja, abacaxi ou maracujá.", emoji: "", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400" },
        { id: 15, name: "X-Burger Especial", category: "burger", price: 27.99, desc: "Blend 200g, queijo, presunto, ovo.", emoji: "🍔", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400" },
        { id: 16, name: "Açaí 500ml", category: "sobremesa", price: 16.99, desc: "Açaí cremoso com granola, morango, kiwi e chocoballs.", emoji: "🍧", badge: "Popular", img: "https://images.pexels.com/photos/11094181/pexels-photo-11094181.jpeg" }
    ];

    let cart = [];
    let mapInstance = null;

    function salvarCarrinho() { localStorage.setItem('y2kbite_carrinho', JSON.stringify(cart)); }
    function carregarCarrinho() {
        const salvo = localStorage.getItem('y2kbite_carrinho');
        if (salvo) { cart = JSON.parse(salvo); updateCartUI(); }
    }
    carregarCarrinho();

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ==================== NAVEGAÇÃO ====================
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (pageId === 'entregas' && localStorage.getItem('y2kbite_token')) {
                carregarMeusPedidos();
            }
        }
        const targetLink = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (targetLink) targetLink.classList.add('active');
        if (sidebar) sidebar.classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.getAttribute('data-page'));
        });
    });

    document.querySelectorAll('.btn-hero[data-page]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.getAttribute('data-page'));
        });
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ==================== CARDÁPIO ====================
    const menuGrid = document.getElementById('menuGrid');
    const searchInput = document.getElementById('searchInput');
    const catBtns = document.querySelectorAll('.cat-btn');

    function renderMenu(items) {
        if (!menuGrid) return;
        menuGrid.innerHTML = items.map(item => `
            <div class="menu-item" data-category="${item.category}">
                ${item.badge ? `<div class="menu-badge">${item.badge}</div>` : ''}
                <div class="menu-img">
                    <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'food-emoji\\'>${item.emoji}</span>';">
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p class="menu-desc">${item.desc}</p>
                    <div class="menu-footer">
                        <span class="menu-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                        <button class="btn-add" data-name="${item.name}" data-price="${item.price}"><i class="fas fa-plus"></i> Adicionar</button>
                    </div>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', function() { addToCart(this.getAttribute('data-name'), parseFloat(this.getAttribute('data-price'))); });
        });
    }
    renderMenu(menuData);

    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterMenu();
        });
    });
    if (searchInput) searchInput.addEventListener('input', filterMenu);

    function filterMenu() {
        const activeBtn = document.querySelector('.cat-btn.active');
        const cat = activeBtn ? activeBtn.getAttribute('data-cat') : 'all';
        const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const filtered = menuData.filter(item => {
            const matchCat = cat === 'all' || item.category === cat;
            const matchSearch = !search || item.name.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search);
            return matchCat && matchSearch;
        });
        renderMenu(filtered);
    }

    // ==================== CARRINHO ====================
    function addToCart(name, price) {
        const existing = cart.find(item => item.name === name);
        if (existing) existing.qty++; else cart.push({ name, price, qty: 1 });
        salvarCarrinho(); updateCartUI(); showToast(`🛒 ${name} adicionado!`);
    }
    function removeFromCart(name) {
        const item = cart.find(i => i.name === name);
        if (item) { item.qty--; if (item.qty <= 0) cart = cart.filter(i => i.name !== name); }
        salvarCarrinho(); updateCartUI();
    }
    function increaseQty(name) {
        const item = cart.find(i => i.name === name);
        if (item) item.qty++;
        salvarCarrinho(); updateCartUI();
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const sidebarCount = document.getElementById('cartSidebarCount');
        const sidebarTotal = document.getElementById('cartSidebarTotal');
        const mobileBadge = document.getElementById('mobileCartBadge');
        if (sidebarCount) sidebarCount.textContent = totalItems;
        if (sidebarTotal) sidebarTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        if (mobileBadge) mobileBadge.textContent = totalItems;

        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const totalValue = document.getElementById('totalValue');
        const btnCheckout = document.getElementById('btnCheckout');
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            if (cartTotal) cartTotal.style.display = 'none';
            if (btnCheckout) btnCheckout.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info"><h4>${item.name}</h4><span>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span></div>
                    <div class="cart-item-controls">
                        <button onclick="window.removeFromCart('${item.name}')">−</button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button onclick="window.increaseQty('${item.name}')">+</button>
                    </div>
                </div>
            `).join('');
            if (totalValue) totalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            if (cartTotal) cartTotal.style.display = 'flex';
            if (btnCheckout) btnCheckout.style.display = 'flex';
        }
    }
    window.addToCart = addToCart; window.removeFromCart = removeFromCart; window.increaseQty = increaseQty;

    const cartModal = document.getElementById('cartModal');
    const cartModalClose = document.getElementById('cartModalClose');
    const cartSidebarBtn = document.getElementById('cartSidebarBtn');
    const mobileCartBtn = document.getElementById('mobileCartBtn');
    const btnCheckoutGlobal = document.getElementById('btnCheckout');

    function openCart() { if (cartModal) cartModal.classList.add('active'); }
    function closeCart() { if (cartModal) cartModal.classList.remove('active'); }

    if (cartSidebarBtn) cartSidebarBtn.addEventListener('click', openCart);
    if (mobileCartBtn) mobileCartBtn.addEventListener('click', openCart);
    if (cartModalClose) cartModalClose.addEventListener('click', closeCart);
    if (cartModal) { cartModal.addEventListener('click', (e) => { if (e.target === cartModal) closeCart(); }); }

    // ==================== FINALIZAR PEDIDO (VALIDAÇÃO DE CARRINHO) ====================
    if (btnCheckoutGlobal) {
        btnCheckoutGlobal.addEventListener('click', async function() {
            // 1. VALIDAÇÃO: CARRINHO VAZIO
            if (cart.length === 0) {
                showToast('🛒 Seu carrinho está vazio! Adicione itens antes de finalizar.');
                return;
            }

            const token = localStorage.getItem('y2kbite_token');
            if (!token) {
                showToast('🔒 Faça login para finalizar o pedido');
                showPage('login');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            
            try {
                showToast('⏳ Processando seu pedido...');
                const res = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
                    body: JSON.stringify({ itens: cart, total: total, forma_pagamento: 'cartao', endereco_entrega: '' })
                });
                const data = await res.json();
                if (res.ok) {
                    cart = []; salvarCarrinho(); updateCartUI(); closeCart();
                    showToast('✅ Pedido realizado! Acompanhe na página de Entregas.');
                    showPage('entregas');
                } else { showToast(`❌ ${data.error}`); }
            } catch (err) { console.error(err); showToast('❌ Erro de conexão com o servidor.'); }
        });
    }

    // ==================== CEP INTELIGENTE (VALIDAÇÃO DE CARRINHO) ====================
    const btnCep = document.getElementById('btnCep');
    const cepInput = document.getElementById('cepInput');
    const cepResult = document.getElementById('cepResult');
    const cepStatus = document.getElementById('cepStatus');

    if (btnCep && cepInput) {
        btnCep.addEventListener('click', async function() {
            const cep = cepInput.value.replace(/\D/g, '');
            const token = localStorage.getItem('y2kbite_token');

            // 1. VALIDAÇÃO: CEP INVÁLIDO
            if (cep.length < 8) {
                cepResult.style.display = 'block';
                cepStatus.className = 'cep-status error';
                cepStatus.textContent = '❌ CEP inválido. Digite 8 dígitos.';
                return;
            }

            // 2. VALIDAÇÃO: CARRINHO VAZIO (Regra solicitada)
            if (cart.length === 0) {
                cepResult.style.display = 'block';
                cepStatus.className = 'cep-status error';
                cepStatus.textContent = '🛒 Adicione itens ao carrinho antes de rastrear!';
                return;
            }

            // 3. VALIDAÇÃO: NÃO LOGADO
            if (!token) {
                cepResult.style.display = 'block';
                cepStatus.className = 'cep-status error';
                cepStatus.textContent = '🔒 Faça login para rastrear seu pedido.';
                return;
            }

            // 4. BUSCAR PEDIDOS NO BANCO
            try {
                const res = await fetch('http://localhost:3000/api/pedidos/meus', { headers: { 'Authorization': token } });
                if (res.ok) {
                    const pedidos = await res.json();
                    const pedidoAtivo = pedidos.find(p => p.status !== 'entregue');

                    cepResult.style.display = 'block';
                    if (pedidoAtivo) {
                        cepStatus.className = 'cep-status success';
                        const statusTexto = pedidoAtivo.status.replace(/_/g, ' ');
                        cepStatus.textContent = `✅ Pedido #${String(pedidoAtivo.id).padStart(4, '0')} encontrado! Status: ${statusTexto.toUpperCase()}`;
                        iniciarAcompanhamentoReal(pedidoAtivo.id);
                    } else {
                        cepStatus.className = 'cep-status error';
                        cepStatus.textContent = ' Nenhum pedido em andamento. Finalize uma compra primeiro!';
                    }
                }
            } catch (err) {
                cepResult.style.display = 'block';
                cepStatus.className = 'cep-status error';
                cepStatus.textContent = '❌ Erro ao buscar pedidos.';
            }
        });

        cepInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
            e.target.value = v;
        });
        cepInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') btnCep.click(); });
    }

    // ==================== FORMULÁRIO DE CONTATOS (PROTEGIDO POR LOGIN) ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const token = localStorage.getItem('y2kbite_token');
            if (!token) {
                showToast('🔒 Faça login para enviar mensagens.');
                setTimeout(() => showPage('login'), 800);
                return;
            }

            showToast('✅ Mensagem enviada! Retornaremos em breve.');
            this.reset();
        });
    }

    // Animação de scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.feature-card, .value-card, .payment-card, .contact-card').forEach(el => {
        el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    console.log('%c Y2KBite carregado! ', 'background: #c9a84c; color: #0d0805; font-size: 14px; font-weight: bold; padding: 5px;');

    // ==================== MODAL DE DETALHES DO PRODUTO ====================
    const productModal = document.getElementById('productModal');
    const productModalClose = document.getElementById('productModalClose');
    const productModalImg = document.getElementById('productModalImg');
    const productModalName = document.getElementById('productModalName');
    const productModalDesc = document.getElementById('productModalDesc');
    const productModalPrice = document.getElementById('productModalPrice');
    const productModalAdd = document.getElementById('productModalAdd');

    if (menuGrid) {
        menuGrid.addEventListener('click', function(e) {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem || e.target.closest('.btn-add')) return;
            const name = menuItem.querySelector('h3').textContent;
            const product = menuData.find(p => p.name === name);
            if (product && productModalImg && productModalName) {
                productModalImg.src = product.img; productModalName.textContent = product.name;
                productModalDesc.textContent = product.desc;
                productModalPrice.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
                productModalAdd.onclick = () => { addToCart(product.name, product.price); productModal.classList.remove('active'); };
                productModal.classList.add('active');
            }
        });
    }
    function closeProductModal() { if (productModal) productModal.classList.remove('active'); }
    if (productModalClose) productModalClose.addEventListener('click', closeProductModal);
    if (productModal) productModal.addEventListener('click', function(e) { if (e.target === productModal) closeProductModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeProductModal(); closeCart(); fecharAcompanhamento(); } });

    // ==================== LÓGICA DE AUTENTICAÇÃO ====================
    const navLogin = document.getElementById('navLogin');
    const navPerfil = document.getElementById('navPerfil');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const perfilForm = document.getElementById('perfilForm');
    const btnLogout = document.getElementById('btnLogout');
    const goToRegister = document.getElementById('goToRegister');
    const goToLogin = document.getElementById('goToLogin');

    function checkAuthState() {
        const token = localStorage.getItem('y2kbite_token');
        const user = JSON.parse(localStorage.getItem('y2kbite_user') || '{}');
        if (token && user.nome) {
            if (navLogin) navLogin.style.display = 'none';
            if (navPerfil) navPerfil.style.display = 'flex';
            updateProfileUI(user);
            carregarMeusPedidos();
        } else {
            if (navLogin) navLogin.style.display = 'flex';
            if (navPerfil) navPerfil.style.display = 'none';
            const section = document.getElementById('meusPedidosSection');
            if (section) section.style.display = 'none';
        }
    }

    function updateProfileUI(user) {
        const nomeDisplay = document.getElementById('perfilNomeDisplay');
        const emailDisplay = document.getElementById('perfilEmailDisplay');
        const nomeInput = document.getElementById('perfilNome');
        const telefoneInput = document.getElementById('perfilTelefone');
        const enderecoInput = document.getElementById('perfilEndereco');
        if (nomeDisplay) nomeDisplay.textContent = user.nome || 'Usuário';
        if (emailDisplay) emailDisplay.textContent = user.email || '...';
        if (nomeInput) nomeInput.value = user.nome || '';
        if (telefoneInput) telefoneInput.value = user.telefone || '';
        if (enderecoInput) enderecoInput.value = user.endereco || '';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;
            try {
                const res = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }) });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('y2kbite_token', data.token);
                    localStorage.setItem('y2kbite_user', JSON.stringify(data.user));
                    showToast('✅ Login realizado com sucesso!');
                    checkAuthState(); showPage('home'); loginForm.reset();
                } else showToast(`❌ ${data.error}`);
            } catch (err) { showToast('❌ Erro de conexão com o servidor.'); }
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('regNome').value;
            const email = document.getElementById('regEmail').value;
            const senha = document.getElementById('regSenha').value;
            const telefone = document.getElementById('regTelefone').value;
            const endereco = document.getElementById('regEndereco').value;
            try {
                const res = await fetch('http://localhost:3000/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, senha, telefone, endereco }) });
                const data = await res.json();
                if (res.ok) { showToast('✅ Conta criada! Faça login agora.'); showPage('login'); registerForm.reset(); }
                else showToast(`❌ ${data.error}`);
            } catch (err) { showToast('❌ Erro de conexão com o servidor.'); }
        });
    }
    if (perfilForm) {
        perfilForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('y2kbite_token');
            if (!token) return;
            const nome = document.getElementById('perfilNome').value;
            const telefone = document.getElementById('perfilTelefone').value;
            const endereco = document.getElementById('perfilEndereco').value;
            try {
                const res = await fetch('http://localhost:3000/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': token }, body: JSON.stringify({ nome, telefone, endereco }) });
                const data = await res.json();
                if (res.ok) {
                    const user = JSON.parse(localStorage.getItem('y2kbite_user'));
                    user.nome = nome; user.telefone = telefone; user.endereco = endereco;
                    localStorage.setItem('y2kbite_user', JSON.stringify(user));
                    updateProfileUI(user); showToast('✅ Perfil atualizado com sucesso!');
                } else showToast(`❌ ${data.error}`);
            } catch (err) { showToast('❌ Erro ao atualizar perfil.'); }
        });
    }
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('y2kbite_token'); localStorage.removeItem('y2kbite_user');
            showToast(' Você saiu da conta.'); checkAuthState(); showPage('home');
        });
    }
    if (goToRegister) goToRegister.addEventListener('click', (e) => { e.preventDefault(); showPage('cadastro'); });
    if (goToLogin) goToLogin.addEventListener('click', (e) => { e.preventDefault(); showPage('login'); });
    checkAuthState();

    // ==================== MODAIS DE PAGAMENTO (SIMULAÇÃO VISUAL) ====================
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const token = localStorage.getItem('y2kbite_token');
            if (!token) { showToast('🔒 Faça login para continuar o pagamento'); setTimeout(() => showPage('login'), 800); return; }
            if (type === 'cartao') document.getElementById('modalPagamentoCartao').classList.add('active');
            else if (type === 'pix') document.getElementById('modalPagamentoPix').classList.add('active');
            else if (type === 'dinheiro') document.getElementById('modalPagamentoDinheiro').classList.add('active');
        });
    });

    window.fecharModalPagamento = function(modalId) { const modal = document.getElementById(modalId); if (modal) modal.classList.remove('active'); };
    document.querySelectorAll('.modal-overlay').forEach(overlay => { overlay.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }); });

    const formCartao = document.getElementById('formCartao');
    if (formCartao) {
        formCartao.addEventListener('submit', function(e) {
            e.preventDefault(); fecharModalPagamento('modalPagamentoCartao');
            showToast('✅ Pagamento processado com sucesso! (Simulação)'); formCartao.reset();
        });
    }

    const btnCopyModalPix = document.getElementById('btnCopyModalPix');
    if (btnCopyModalPix) {
        btnCopyModalPix.addEventListener('click', () => {
            const pixKeyInput = document.getElementById('modalPixKey');
            pixKeyInput.select(); navigator.clipboard.writeText(pixKeyInput.value).then(() => { showToast(' Chave PIX copiada! (Fictícia)'); });
        });
    }

    // ==================== SISTEMA REAL DE MEUS PEDIDOS ====================
    async function carregarMeusPedidos() {
        const token = localStorage.getItem('y2kbite_token');
        const section = document.getElementById('meusPedidosSection');
        const list = document.getElementById('pedidosList');
        if (!token || !section || !list) return;

        try {
            const res = await fetch('http://localhost:3000/api/pedidos/meus', { headers: { 'Authorization': token } });
            if (res.ok) {
                const pedidos = await res.json();
                if (pedidos.length > 0) {
                    section.style.display = 'block';
                    list.innerHTML = pedidos.map(p => {
                        const data = new Date(p.data_pedido).toLocaleString('pt-BR');
                        const statusClass = `status-${p.status}`;
                        const statusText = p.status.replace(/_/g, ' ');
                        return `
                            <div class="pedido-item" onclick="iniciarAcompanhamentoReal(${p.id})">
                                <div class="pedido-info">
                                    <h4>Pedido #${String(p.id).padStart(4, '0')}</h4>
                                    <p>${data} • R$ ${parseFloat(p.total).toFixed(2).replace('.', ',')}</p>
                                </div>
                                <span class="pedido-status-badge ${statusClass}">${statusText}</span>
                            </div>
                        `;
                    }).join('');
                } else { section.style.display = 'none'; }
            }
        } catch (err) { console.error('Erro ao carregar pedidos:', err); }
    }

    // ==================== ACOMPANHAMENTO COM MAPA LEAFLET ====================
    window.fecharAcompanhamento = function() {
        const modal = document.getElementById('modalAcompanhamento');
        if (modal) modal.classList.remove('active');
        if (window.acompanhamentoInterval) clearInterval(window.acompanhamentoInterval);
    };

    function iniciarAcompanhamentoReal(pedidoId) {
        const modal = document.getElementById('modalAcompanhamento');
        const progressBar = document.getElementById('progressBar');
        const pedidoNumero = document.getElementById('pedidoNumero');
        const mapaDiv = document.getElementById('mapaEntrega');
        
        if (!modal || !progressBar || !pedidoNumero || !mapaDiv) return;

        pedidoNumero.textContent = `#Y2K-${String(pedidoId).padStart(4, '0')}`;
        modal.classList.add('active');
        
        if (mapInstance) { mapInstance.remove(); }
        
        setTimeout(() => {
            mapInstance = L.map('mapaEntrega').setView([-23.5505, -46.6333], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance);

            const motoIcon = L.divIcon({
                html: '<div style="background: var(--accent-gold); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="fas fa-motorcycle" style="color: #0d0805; font-size: 14px;"></i></div>',
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            L.marker([-23.5505, -46.6333], { icon: motoIcon }).addTo(mapInstance)
                .bindPopup(`<b>Y2KBite Delivery</b><br>Status: Em movimento`).openPopup();
        }, 300);
        
        function atualizarStatusVisual(status) {
            for (let i = 1; i <= 4; i++) {
                const etapa = document.getElementById(`etapa${i}`);
                if (etapa) etapa.classList.remove('active');
            }

            if (status === 'confirmado') {
                document.getElementById('etapa1').classList.add('active');
                progressBar.style.width = '25%';
            } else if (status === 'preparando') {
                document.getElementById('etapa1').classList.add('active');
                document.getElementById('etapa2').classList.add('active');
                progressBar.style.width = '50%';
            } else if (status === 'saiu_para_entrega') {
                document.getElementById('etapa1').classList.add('active');
                document.getElementById('etapa2').classList.add('active');
                document.getElementById('etapa3').classList.add('active');
                progressBar.style.width = '75%';
            } else if (status === 'entregue') {
                for (let i = 1; i <= 4; i++) document.getElementById(`etapa${i}`).classList.add('active');
                progressBar.style.width = '100%';
            }
        }

        window.acompanhamentoInterval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/status`);
                if (res.ok) {
                    const data = await res.json();
                    atualizarStatusVisual(data.status);
                    if (data.status === 'entregue') clearInterval(window.acompanhamentoInterval);
                }
            } catch (err) { console.error('Erro ao atualizar status:', err); }
        }, 3000);
        
        atualizarStatusVisual('confirmado');
    }

}); // Fim do DOMContentLoaded