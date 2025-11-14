// ================= scriptComprar.js (AJUSTADO: API_BASE automático + chamadas seguras) =================

const LOCAL_CART_KEY = 'localCart';
let currentProduct = null;
let carrinho = [];

// Detecta automaticamente a base (pasta) onde o HTML está sendo servido.
// Exemplo: http://localhost/branch-teste-main/Comprar/indexComprar.html?id=21
const ORIGIN = window.location.origin;
const PATH = window.location.pathname;
const DIR = PATH.replace(/\/[^\/]*$/, '/'); // remove filename
const API_BASE = ORIGIN + DIR; // ex: http://localhost/branch-teste-main/Comprar/
console.log('API_BASE detectado:', API_BASE);

// elementos cache
const listaCarrinhoEl = document.getElementById("listaCarrinho");
const qtdCarrinhoEl = document.getElementById("qtdCarrinho");
const totalCarrinhoEl = document.getElementById("totalCarrinho");
const cartCountBadge = document.getElementById("cart-count") || document.getElementById("cartCount");

// ---------- Helpers ----------
function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }
function safeParseJSON(s, fallback = null) { try { return JSON.parse(s); } catch (e) { return fallback; } }
function persistCart() { try { localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(carrinho)); } catch(e){ console.warn(e); } }
function loadCartFromStorage() {
  const raw = localStorage.getItem(LOCAL_CART_KEY);
  const parsed = safeParseJSON(raw, []);
  if (Array.isArray(parsed)) carrinho = parsed;
  else carrinho = [];
}
function gerarCodigoRastreio() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numeros = '0123456789';
  const rand = s => s.charAt(Math.floor(Math.random()*s.length));
  let code = rand(letras)+rand(letras);
  for (let i=0;i<9;i++) code += rand(numeros);
  code += rand(letras)+rand(letras);
  return code;
}

// Helper para fetch que devolve JSON com checagem.
// Recebe URLs absolutas (ou já construídas com API_BASE).
async function safeFetchJSON(url, options = {}) {
  try {
    const resp = await fetch(url, options);
    const text = await resp.text();
    try {
      const json = JSON.parse(text);
      if (!resp.ok) throw new Error(json.message || `HTTP ${resp.status}`);
      return json;
    } catch (parseErr) {
      throw new Error(`Resposta inválida (esperado JSON). HTTP ${resp.status}. Conteúdo: ${text.slice(0,400)}`);
    }
  } catch (err) {
    throw err;
  }
}

// ---------- UI / Modais (abre/fecha) ----------
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('show');
  modalEl.style.display = 'flex';
  document.body.classList.add('modal-open');
  const mc = modalEl.querySelector('.modal-content');
  if (mc) { try { mc.setAttribute('tabindex','-1'); mc.focus(); mc.style.pointerEvents = 'auto'; } catch(e){} }
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('show');
  modalEl.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// ---------- Preencher UI produto / zoom ----------
// ---------- Preencher UI produto (corrigido handling imagem relativa) ----------
function preencherDOMComProduto(p) {
  if (!p) return;
  const imgEl = document.querySelector('.produto-imagem img');
  if (imgEl && p.image) {
    // se p.image começa com protocolo (http/https) -> usa direto
    // se começa com '/' ou './' ou '../' -> usa direto (já é um caminho relativo correto)
    // só prefixa API_BASE quando for um nome simples (ex: 'arquivo.png' ou 'uploads/arquivo.png' sem ../)
    const isHttp = typeof p.image === 'string' && !!p.image.match(/^https?:\/\//i);
    const startsWithSlash = typeof p.image === 'string' && (p.image.startsWith('/') || p.image.startsWith('./') || p.image.startsWith('../'));
    if (!isHttp && !startsWithSlash) {
      imgEl.src = API_BASE + p.image;
    } else {
      imgEl.src = p.image;
    }
    imgEl.alt = p.title || p.titulo || 'Produto';
  }

  const idInput = document.getElementById('id_anuncio'); if (idInput) idInput.value = p.id ?? p.id_anuncio ?? '';
  const tituloEl = document.querySelector('.produto-detalhes h1'); if (tituloEl) tituloEl.textContent = p.title || p.titulo || '';
  const spans = document.querySelectorAll('.produto-detalhes .marca span');
  if (spans.length) {
    if (spans[0]) spans[0].textContent = p.brand || p.marca || '';
    if (spans[1]) spans[1].textContent = p.model || p.sku || p.sku_universal || '';
  }
  const precoEl = document.querySelector('.preco .preco-avista');
  if (precoEl) precoEl.textContent = 'R$ ' + (Number(p.price || p.preco || 0).toFixed(2).replace('.', ',') + ' à vista');
  const parcelaEl = document.querySelector('.preco .parcelamento');
  if (parcelaEl) {
    const parcelas = p.parcels || p.parcelas || 3;
    parcelaEl.textContent = `Em até ${parcelas}x R$ ${(Number(p.price || p.preco || 0)/parcelas).toFixed(2).replace('.', ',')} sem juros`;
  }
  const descEl = document.getElementById('productDesc') || document.querySelector('.produto-detalhes p#productDesc');
  if (descEl && (p.description || p.descricao || p.descricao_tecnica)) descEl.textContent = p.description || p.descricao || p.descricao_tecnica;
  aplicarZoomImagem();
}

function mostrarErroProdutoNaoEncontrado() {
  const container = document.querySelector('.checkout-container') || document.body;
  container.innerHTML = '<p style="padding:20px;">Produto não encontrado. Volte ao catálogo.</p>';
}
function aplicarZoomImagem() {
  const produtoImg = document.querySelector(".produto-imagem img");
  if (!produtoImg) return;
  produtoImg.onmousemove = null; produtoImg.onmouseleave = null;
  produtoImg.addEventListener("mousemove", function (e) {
    const { left, top, width, height } = this.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    this.style.transformOrigin = `${x}% ${y}%`; this.style.transform = "scale(2)";
  });
  produtoImg.addEventListener("mouseleave", function () {
    this.style.transformOrigin = "center center"; this.style.transform = "scale(1)";
  });
}

// ---------- Fetch / Load product ----------
// ---------- Fetch / Load product (corrigido para imagem) ----------
async function fetchProductById(id) {
  try {
    const url = API_BASE + 'get_product.php?id=' + encodeURIComponent(id);
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) throw new Error('Produto não encontrado no servidor');
    const p = await resp.json();
    return {
      id: p.id_produto ?? p.id ?? id,
      title: p.nome ?? p.title,
      price: parseFloat(p.preco ?? p.price ?? 0) || 0,
      // Mantemos compatibilidade com seu backend: se foto_principal for apenas o nome do arquivo,
      // montamos ../DashBoard/uploads/<arquivo> (igual à versão que funcionava).
      image: (p.foto_principal && p.foto_principal.trim() !== '') 
                ? ('../DashBoard/uploads/' + p.foto_principal) 
                : (p.image || '../DashBoard/uploads/placeholder.png'),
      description: p.descricao_tecnica ?? p.descricao ?? ''
    };
  } catch (err) {
    // fallback para localStorage (igual antes)
    const raw = localStorage.getItem('selectedProduct');
    if (raw) {
      try {
        const p = JSON.parse(raw);
        return {
          id: p.id ?? p.id_anuncio ?? id,
          title: p.title ?? p.titulo,
          price: p.price ?? p.preco ?? 0,
          image: p.image ?? p.foto ?? '',
          description: p.description ?? p.descricao ?? ''
        };
      } catch(e){}
    }
    throw err;
  }
}

async function loadProduct() {
  const id = getQueryParam('id');
  if (!id) return mostrarErroProdutoNaoEncontrado();
  try {
    const p = await fetchProductById(id);
    currentProduct = p;
    try { localStorage.setItem('selectedProduct', JSON.stringify(p)); } catch(e){}
    preencherDOMComProduto(currentProduct);
  } catch (err) {
    console.warn('Erro ao carregar produto:', err);
    mostrarErroProdutoNaoEncontrado();
  }
}

// ---------- Carrinho UI ----------
function atualizarCarrinhoUI() {
  const badgeCount = carrinho.reduce((s,i)=>s + (i.quantidade||1), 0);
  if (cartCountBadge) cartCountBadge.textContent = badgeCount || 0;
  if (!listaCarrinhoEl) return;
  listaCarrinhoEl.innerHTML = '';
  let total = 0;
  carrinho.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'carrinho-item';
    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div style="flex:1;">
          <strong>${item.titulo}</strong><br/>
          Qtd: ${item.quantidade} — R$ ${Number(item.preco).toFixed(2)}
        </div>
        <div>
          <button class="remover-item" data-index="${idx}" aria-label="Remover item">Remover</button>
        </div>
      </div>
    `;
    listaCarrinhoEl.appendChild(li);
    total += (item.preco * item.quantidade);
  });
  if (qtdCarrinhoEl) qtdCarrinhoEl.textContent = carrinho.length;
  if (totalCarrinhoEl) totalCarrinhoEl.textContent = total.toFixed(2);
}

function adicionarProdutoAtualAoCarrinho() {
  if (!currentProduct || !currentProduct.id) {
    console.warn('Produto não carregado corretamente.', currentProduct);
    alert('Produto não carregado. Atualize a página.');
    return;
  }

  const quantidadeSelect = document.getElementById('quantidade');
  const quantidade = quantidadeSelect ? parseInt(quantidadeSelect.value,10) || 1 : 1;

  // atualiza carrinho local (UI)
  const existente = carrinho.find(i => i.id === currentProduct.id);
  if (existente) existente.quantidade += quantidade;
  else {
    carrinho.push({
      id: currentProduct.id,
      titulo: currentProduct.title || currentProduct.titulo || 'Produto',
      preco: Number(currentProduct.price || 0),
      quantidade
    });
  }
  persistCart();
  atualizarCarrinhoUI();

  // ==== DEBUG: log antes de enviar ====
 const form = new URLSearchParams();
form.append('id_produto', String(currentProduct.id));
form.append('quantidade', String(quantidade));

  console.log('Enviando add_to_cart:', form.toString(), 'currentProduct=', currentProduct);

  // enviar para add_to_cart.php (usa API_BASE)
  safeFetchJSON(API_BASE + 'add_to_cart.php', {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: form.toString(),
    credentials: 'same-origin'
  }).then(j => {
    if (j && j.status === 'ok') {
      const badge = document.getElementById('cart-count') || document.getElementById('cartCount');
      if (badge) badge.textContent = j.cart_count ?? badge.textContent;
      const totalEl = document.getElementById('totalCarrinho');
      if (totalEl) totalEl.textContent = (j.cart_total ?? totalEl.textContent);
      console.log('add_to_cart OK:', j);
      alert('Produto adicionado ao carrinho');
    } else {
      console.warn('add_to_cart retornou erro:', j);
      alert('Erro ao adicionar ao carrinho: ' + (j.message || JSON.stringify(j)));
    }
  }).catch(err => {
    console.error('Erro ao chamar add_to_cart.php:', err);
    alert('Erro ao adicionar ao carrinho (ver console).');
  });
}

// ---------- Fluxo de checkout ao servidor ----------
async function callCheckoutOnServer() {
  try {
    const json = await safeFetchJSON(API_BASE + 'checkout.php', {
      method: 'POST',
      credentials: 'same-origin'
    });
    return json;
  } catch (err) {
    throw err;
  }
}

// Função pública para finalizar (usar em botão)
async function finalizarCompraNoServidor() {
  try {
    const resp = await callCheckoutOnServer();
    if (resp && resp.status === 'ok') {
      alert('Pedido criado: ' + (resp.id_pedido ?? '—'));
      const rast = resp.id_pedido ? ('PE' + String(resp.id_pedido).padStart(8,'0')) : gerarCodigoRastreio();
      mostrarSucessoPedido(rast);
      carrinho = [];
      persistCart();
      atualizarCarrinhoUI();
    } else {
      alert('Erro no checkout: ' + (resp.message || JSON.stringify(resp)));
    }
  } catch (err) {
    console.error('Erro no checkout:', err);
    alert('Erro no checkout: ' + err.message);
  }
}

// ---------- Merge cart on login (chamar quando o usuário fizer login) ----------
async function mergeCartOnLogin(payloadArray) {
  try {
    const json = await safeFetchJSON(API_BASE + 'merge_cart_on_login.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payloadArray || [])
    });
    return json;
  } catch (err) {
    throw err;
  }
}

// ---------- Fluxo simplificado para compras locais (sem enviar ao servidor) ----------
async function processarCompraSemPagamento(cartOverride) {
  try {
    const localCart = Array.isArray(cartOverride) ? cartOverride : (carrinho || safeParseJSON(localStorage.getItem(LOCAL_CART_KEY), []));
    if (!localCart || localCart.length === 0) { alert('Seu carrinho está vazio.'); return; }
    if (!Array.isArray(cartOverride)) { carrinho = []; persistCart(); atualizarCarrinhoUI(); }
    const rast = 'PE' + String(Date.now()).slice(-8);
    mostrarSucessoPedido(rast);
  } catch (err) {
    console.error('Erro ao finalizar compra (sem pagamento):', err);
    alert('Erro ao finalizar compra: ' + (err.message || err));
  }
}

function mostrarSucessoPedido(codigo) {
  const modalSucesso = document.getElementById('modal-sucesso');
  const span = document.getElementById('codigo-rastreio');
  if (span) span.textContent = codigo || gerarCodigoRastreio();
  const mp = document.getElementById('modal-pagamento'); if (mp) closeModal(mp);
  const me = document.getElementById('modal-endereco'); if (me) closeModal(me);
  if (modalSucesso) openModal(modalSucesso);
  else alert('Compra bem sucedida! Código: ' + (codigo || gerarCodigoRastreio()));
}

// ---------- Inicialização ----------
document.addEventListener('DOMContentLoaded', () => {
  loadProduct().catch(e => console.warn(e));
  loadCartFromStorage();
  atualizarCarrinhoUI();

  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adicionarProdutoAtualAoCarrinho();
  });

  // comprar direto usando produto atual (não usa DB)
  const btnFinalizar = document.getElementById('btn-finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentProduct || !currentProduct.id) { alert('Produto não carregado. Atualize a página e tente novamente.'); return; }
      const quantidadeSelect = document.getElementById('quantidade');
      const quantidade = quantidadeSelect ? parseInt(quantidadeSelect.value,10) || 1 : 1;
      if (quantidade <= 0) { alert('Quantidade inválida'); return; }
      const cartTemp = [{ id: currentProduct.id, titulo: currentProduct.title || currentProduct.titulo || 'Produto', preco: Number(currentProduct.price || 0), quantidade }];
// Novo fluxo: adicionar item na sessão e em seguida chamar checkout.php
(async () => {
  try {
    // 1) adiciona item na sessão via add_to_cart.php
    const form = new URLSearchParams();
    form.append('id_produto', String(currentProduct.id));
    form.append('quantidade', String(quantidade));

    console.log('Comprar agora -> adicionando sessão:', form.toString());
    const addRes = await safeFetchJSON(API_BASE + 'add_to_cart.php', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: form.toString(),
      credentials: 'same-origin'
    });

    if (!addRes || addRes.status !== 'ok') {
      alert('Falha ao preparar pedido: ' + (addRes?.message || JSON.stringify(addRes)));
      return;
    }

    // 2) chama checkout.php para criar pedido no banco
    // (finalizarCompraNoServidor já faz isso e trata resposta)
    await finalizarCompraNoServidor();

  } catch (err) {
    // se o servidor responder que é necessário login, tratar
    const msg = err?.message || String(err);
    console.error('Erro no fluxo Comprar Agora:', err);
    if (msg.toLowerCase().includes('faça login') || msg.includes('401')) {
      alert('Você precisa estar logado para finalizar a compra. Faça login e tente novamente.');
      // opcional: redirecionar para login
      // window.location.href = '../Login/indexLogin.html';
    } else {
      alert('Erro ao finalizar compra: ' + msg + '. Veja console para detalhes.');
    }
  }
})();
    });
  }

  // modal-sucesso fechar
  const fecharSucessoBtn = document.getElementById('fechar-sucesso');
  if (fecharSucessoBtn) fecharSucessoBtn.addEventListener('click', (e)=>{ e.preventDefault(); const m = document.getElementById('modal-sucesso'); if (m) closeModal(m); });

  // carrinho modal helpers (mantidos)
  const btnCarrinho = document.getElementById('btnCarrinho');
  const carrinhoModal = document.getElementById('carrinhoModal');
  const fecharCarrinho = document.getElementById('fecharCarrinho');

  function openCartModal(){ if (!carrinhoModal) return console.warn('carrinhoModal não encontrado'); atualizarCarrinhoUI(); openModal(carrinhoModal); }
  function closeCartModal(){ if (carrinhoModal) closeModal(carrinhoModal); }

  if (btnCarrinho) btnCarrinho.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
  if (fecharCarrinho) fecharCarrinho.addEventListener('click', (e) => { e.preventDefault(); closeCartModal(); });
  if (carrinhoModal) {
    carrinhoModal.addEventListener('click', (e) => { if (e.target === carrinhoModal) closeCartModal(); });
    const mc = carrinhoModal.querySelector('.modal-content');
    if (mc) mc.addEventListener('click', e => e.stopPropagation());
  }

  // finalizar compra dentro do modal do carrinho chama o servidor se desejar:
  const btnFinalizarCompra = document.getElementById('btn-checkout');
  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', async (e) => {
      e.preventDefault();
      if (carrinho.length === 0) { alert('Seu carrinho está vazio.'); return; }
      if (carrinhoModal) closeModal(carrinhoModal);
      await finalizarCompraNoServidor();
    });
  }

  // remover item delegação
  if (listaCarrinhoEl) {
    listaCarrinhoEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.remover-item');
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      if (!Number.isNaN(idx)) {
        carrinho.splice(idx, 1);
        persistCart();
        atualizarCarrinhoUI();
      }
    });
  }

  // opcional: mesclar localCart com sessão no backend se houver itens locais
  try {
    const payload = (localStorage.getItem('localCart') ? JSON.parse(localStorage.getItem('localCart')) : []);
    if (Array.isArray(payload) && payload.length > 0) {
      const normalized = payload.map(it => ({ id: it.id || it.id_anuncio || it.id_produto, quantidade: it.quantidade || it.qty || 1 }));
      mergeCartOnLogin(normalized).then(res => {
        console.log('Resultado da mesclagem de carrinho:', res);
      }).catch(err => console.warn('Erro ao mesclar carrinho no login:', err));
    } else {
      console.log('Nenhum item local para mesclar no login.');
    }
  } catch (e) {
    console.warn('Erro ao tentar mesclar localCart:', e);
  }
});

// expõe funções (compatibilidade)
window.adicionarProdutoAtualAoCarrinho = adicionarProdutoAtualAoCarrinho;
window.atualizarCarrinhoUI = atualizarCarrinhoUI;
window.carrinhoLocal = () => carrinho;
window.finalizarCompraNoServidor = finalizarCompraNoServidor;
window.mergeCartOnLogin = mergeCartOnLogin;
