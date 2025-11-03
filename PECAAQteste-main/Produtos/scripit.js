// Define uma constante para o número de produtos por página.
const PRODUCTS_PER_PAGE = 8;
let currentPage = 1;
let products = [];
let filtered = [];
let brandsSet = new Set();
let categoriesSet = new Set();

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const brandList = document.getElementById('brandList');
    const categoryList = document.getElementById('categoryList');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const showMoreBrands = document.getElementById('showMoreBrands');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const applyPrice = document.getElementById('applyPrice');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');

    createSampleProducts();
    populateFilterSets();
    renderFilterCheckboxes();
    applyFiltersAndRender();

    sortSelect.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    document.querySelectorAll('[data-filter="opportunity"]').forEach(el => el.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); }));

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const q = e.target.value.trim().toLowerCase();
        debounceTimer = setTimeout(() => {
            renderSuggestions(q);
            currentPage = 1;
            applyFiltersAndRender();
        }, 220);
    });

    suggestions.addEventListener('click', (ev) => {
        if (ev.target.matches('li')) {
            searchInput.value = ev.target.textContent;
            suggestions.classList.add('hidden');
            currentPage = 1;
            applyFiltersAndRender();
        }
    });

    brandList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    categoryList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });

    showMoreBrands.addEventListener('click', () => {
        showMoreBrands.dataset.expanded = showMoreBrands.dataset.expanded === '1' ? '0' : '1';
        renderFilterCheckboxes();
    });

    applyPrice.addEventListener('click', () => { currentPage = 1; applyFiltersAndRender(); });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });

    nextPage.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });

    document.getElementById('whatsappBtn')?.addEventListener('click', () => {
        const url = "https://wa.me/5511999999999?text=Ol%C3%A1%20Pe%C3%A7aAq%2C%20gostaria%20de%20ajuda%20com%20uma%20pe%C3%A7a";
        window.open(url, '_blank');
    });

    let cart = [];
    function addToCart(p) {
        cart.push(p);
        cartCount.textContent = cart.length;
        alert(`Produto "${p.title}" adicionado ao carrinho!`);
    }

    async function createSampleProducts() {
    try {
        console.log('Tentando carregar produtos do banco...');
        const resp = await fetch('../Empresas/listarProdutos.php');  // Ajuste o caminho!
        if (!resp.ok) {
            throw new Error(`Erro HTTP: ${resp.status}`);
        }
        const data = await resp.json();
        console.log('Produtos carregados:', data);  // Verifique se os dados chegam
        products = data.map(p => ({
            id: p.id_produto,
            title: p.nome,
            brand: p.marca || 'Genérica',
            category: p.categoria || 'Peças',
            price: parseFloat(p.preco),
            model: p.sku_universal || 'Universal',
            image: "../Empresas/uploads/" + p.foto_principal,  // Ajuste o caminho da imagem!
            parcels: 3,
            opportunity: false,
            addedAt: new Date(p.data_cadastro).getTime() || Date.now()
        }));
        populateFilterSets();
        renderFilterCheckboxes();
        applyFiltersAndRender();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para hardcoded
        products = [
            // ... (seus produtos hardcoded originais)
        ];
        populateFilterSets();
        renderFilterCheckboxes();
        applyFiltersAndRender();
    }
}

    function renderProducts() {
        productsGrid.innerHTML = '';
        productsCount.textContent = filtered.length;
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const slice = filtered.slice(start, start + PRODUCTS_PER_PAGE);
        const tpl = document.getElementById('productCardTpl');

        if (slice.length === 0) {
            productsGrid.innerHTML = `<div style="padding:20px;background:#fff;border-radius:10px;border:1px solid #eee;text-align:center;">Nenhum produto encontrado</div>`;
            return;
        }

        slice.forEach(p => {
            const node = tpl.content.cloneNode(true);
            const article = node.querySelector('.product-card');
            article.querySelector('img').src = p.image;
            article.querySelector('img').alt = p.title;
            article.querySelector('.product-title').textContent = p.title;
            article.querySelector('.price-value').textContent = p.price.toFixed(2).replace('.', ',');
            article.querySelector('.installments').textContent = `Em até ${p.parcels}x R$ ${(p.price / p.parcels).toFixed(2).replace('.', ',')} sem juros`;

            // Clique no card inteiro leva à página de compra
            article.addEventListener('click', (ev) => {
                if (!ev.target.classList.contains('buy-btn')) {
                    window.location.href = "../Comprar/index.html";
                }
            });

            // Clique no botão comprar adiciona ao carrinho e leva à página de compra
            const buyBtn = article.querySelector('.buy-btn');
            buyBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                addToCart(p);
                window.location.href = "../Comprar/index.html"; // <-- redireciona ao clicar
            });

            productsGrid.appendChild(node);
        });
    }
});
