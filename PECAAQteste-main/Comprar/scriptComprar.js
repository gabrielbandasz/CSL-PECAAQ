// ===== scriptComprar.js (ATUALIZADO) =====

// Zoom imagem produto
const produtoImg = document.querySelector(".produto-imagem img");

if (produtoImg) {
  produtoImg.addEventListener("mousemove", function (e) {
    const { left, top, width, height } = this.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    this.style.transformOrigin = `${x}% ${y}%`;
    this.style.transform = "scale(2)";
  });

  produtoImg.addEventListener("mouseleave", function () {
    this.style.transformOrigin = "center center";
    this.style.transform = "scale(1)";
  });
}

// ----------------- Modal pagamento e métodos -----------------
const modal = document.getElementById("modal-pagamento");
const fechar = document.getElementById("fechar");
const btnFinalizar = document.getElementById("btn-finalizar");
const metodos = document.querySelectorAll(".metodo");
const formCartao = document.getElementById("pagamento-cartao");
const formPix = document.getElementById("pagamento-pix");

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    modal.classList.add("show");
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
  });
}

if (fechar) {
  fechar.addEventListener("click", () => {
    modal.classList.remove("show");
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
  }
});

metodos.forEach((botao) => {
  botao.addEventListener("click", () => {
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
    if (botao.dataset.metodo === "cartao") {
      formCartao.classList.remove("hidden");
    } else {
      formPix.classList.remove("hidden");
    }
  });
});

// ----------------- Calcular frete (simulado) -----------------
const btnFrete = document.getElementById("btn-frete");
if (btnFrete) {
  btnFrete.addEventListener("click", () => {
    const cep = document.getElementById("cep").value.trim();

    if (!cep.match(/^\d{8}$/)) {
      alert("Por favor, digite um CEP válido com 8 números.");
      return;
    }

    const cepNum = parseInt(cep, 10);

    let frete = 0;
    let prazo = 0;

    if (cepNum >= 1000000 && cepNum <= 9999999) {
      frete = 15;
      prazo = 1;
    } else if (cepNum >= 10000000 && cepNum <= 19999999) {
      frete = 25;
      prazo = 2;
    } else if (cepNum >= 20000000 && cepNum <= 29999999) {
      frete = 30;
      prazo = 3;
    } else {
      frete = 50;
      prazo = 5;
    }

    const endereco = "Rua dos Trabalhadores, 123, Bairro Popular, Cidade esteio";

    alert(
      `Frete: R$ ${frete.toFixed(2)}\n` +
      `Prazo de entrega: ${prazo} dia(s)\n` +
      `Endereço: ${endereco}`
    );
  });
}

// ----------------- Carrossel -----------------
document.querySelectorAll('.carrossel').forEach(carrossel => {
  const track = carrossel.querySelector('.carrossel-track');
  const dotsContainer = carrossel.querySelector('.carrossel-dots');
  const cardWidth = 240; // largura do card + margem
  const cardsPerPage = 5;
  const totalCards = track.children.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  let currentPage = 0;

  // Cria as bolinhas
  for(let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);

    dot.addEventListener('click', () => {
      currentPage = i;
      updateCarousel();
    });
  }

  function updateCarousel() {
    const moveX = -currentPage * cardsPerPage * cardWidth;
    track.style.transform = `translateX(${moveX}px)`;
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }
});

// ----------------- Avaliações com estrelas -----------------
const MAX_ESTRELAS = 5;
const listaAvaliacoes = document.getElementById('avaliacoes-lista');
const formAvaliacao = document.getElementById('form-avaliacao');
const nomeInput = document.getElementById('nome');
const comentarioInput = document.getElementById('comentario');
const estrelaContainer = document.getElementById('estrela-container');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const formTitle = document.getElementById('form-title');

let avaliacoes = [];
let editIndex = null;

function criarEstrelasFormulario() {
  if (!estrelaContainer) return;
  estrelaContainer.innerHTML = '';
  for (let i = 1; i <= MAX_ESTRELAS; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.dataset.value = i;
    star.textContent = '⭐';
    estrelaContainer.appendChild(star);
  }
}

criarEstrelasFormulario();

let estrelaSelecionada = 0;

if (estrelaContainer) {
  estrelaContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
      estrelaSelecionada = parseInt(e.target.dataset.value);
      atualizarEstrelasSelecionadas(estrelaSelecionada);
    }
  });
}

function atualizarEstrelasSelecionadas(num) {
  if (!estrelaContainer) return;
  const stars = estrelaContainer.querySelectorAll('.star');
  stars.forEach(star => star.classList.remove('selected'));
  for (let i = 0; i < num; i++) {
    if (stars[i]) stars[i].classList.add('selected');
  }
}

function renderizarAvaliacoes() {
  if (!listaAvaliacoes) return;
  listaAvaliacoes.innerHTML = '';
  avaliacoes.forEach((avaliacao, index) => {
    const item = document.createElement('div');
    item.classList.add('avaliacao-item');
    const estrelasHTML = '⭐'.repeat(avaliacao.estrela);
    item.innerHTML = `
      <div class="nome">${avaliacao.nome}</div>
      <div class="estrelas">${estrelasHTML}</div>
      <div class="comentario">${avaliacao.comentario}</div>
      <button class="alterar-btn">Alterar</button>
    `;

    const btnAlterar = item.querySelector('.alterar-btn');
    btnAlterar.addEventListener('click', () => iniciarAlteracao(index));

    listaAvaliacoes.appendChild(item);
  });
}

function iniciarAlteracao(index) {
  const avaliacao = avaliacoes[index];
  nomeInput.value = avaliacao.nome;
  comentarioInput.value = avaliacao.comentario;
  editIndex = index;
  formTitle.textContent = 'Alterar Avaliação';
  btnSubmit.textContent = 'Salvar Alteração';
  btnCancel.style.display = 'block';

  estrelaSelecionada = avaliacao.estrela;
  atualizarEstrelasSelecionadas(estrelaSelecionada);
}

if (btnCancel) {
  btnCancel.addEventListener('click', () => {
    resetarFormulario();
  });
}

function resetarFormulario() {
  if (!formAvaliacao) return;
  formAvaliacao.reset();
  editIndex = null;
  formTitle.textContent = 'Deixe sua avaliação';
  btnSubmit.textContent = 'Enviar Avaliação';
  if (btnCancel) btnCancel.style.display = 'none';
  estrelaSelecionada = 0;
  atualizarEstrelasSelecionadas(0);
}

if (formAvaliacao) {
  formAvaliacao.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const comentario = comentarioInput.value.trim();

    if (!nome || !comentario || estrelaSelecionada === 0) {
      alert('Por favor, preencha todos os campos e selecione a nota.');
      return;
    }

    const novaAvaliacao = { nome, comentario, estrela: estrelaSelecionada };

    if (editIndex !== null) {
      avaliacoes[editIndex] = novaAvaliacao;
    } else {
      avaliacoes.push(novaAvaliacao);
    }

    renderizarAvaliacoes();
    resetarFormulario();
  });
}

renderizarAvaliacoes();

// ----------------- Pagamento e Endereço (modais) -----------------
const btnCartao = document.querySelector('#pagamento-cartao .btn-comprar');
const btnPix = document.querySelector('#pagamento-pix .btn-comprar');

const modalEndereco = document.getElementById('modal-endereco');
const fecharEndereco = document.getElementById('fechar-endereco');
const formEndereco = document.getElementById('form-endereco');

function abrirModalEndereco() {
  if (modalEndereco) modalEndereco.classList.add('show');
}

if (fecharEndereco) {
  fecharEndereco.addEventListener('click', () => {
    modalEndereco.classList.remove('show');
  });
}

if (btnCartao) {
  btnCartao.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModalEndereco();
  });
}

if (btnPix) {
  btnPix.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModalEndereco();
  });
}

if (formEndereco) {
  formEndereco.addEventListener('submit', (e) => {
    e.preventDefault();

    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const cepEndereco = document.getElementById('cep-endereco').value.trim();

    if (!rua || !numero || !bairro || !cidade || !cepEndereco) {
      alert('Por favor, preencha todos os campos do endereço.');
      return;
    }

    modalEndereco.classList.remove('show');
    if (modal) modal.classList.remove('show');

    mostrarSucesso();
  });
}

const modalSucesso = document.getElementById('modal-sucesso');
const fecharSucesso = document.getElementById('fechar-sucesso');
const btnFecharSucesso = document.getElementById('btn-fechar-sucesso');
const codigoRastreioSpan = document.getElementById('codigo-rastreio');

function gerarCodigoRastreio() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';

  function randChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  let codigo = '';
  codigo += randChar(letras);
  codigo += randChar(letras);

  for (let i = 0; i < 9; i++) {
    codigo += randChar(numeros);
  }

  codigo += randChar(letras);
  codigo += randChar(letras);

  return codigo;
}

function mostrarSucesso() {
  const codigo = gerarCodigoRastreio();
  if (codigoRastreioSpan) codigoRastreioSpan.textContent = codigo;
  if (modalSucesso) modalSucesso.classList.add('show');
}

if (fecharSucesso) {
  fecharSucesso.addEventListener('click', () => {
    modalSucesso.classList.remove('show');
  });
}
if (btnFecharSucesso) {
  btnFecharSucesso.addEventListener('click', () => {
    modalSucesso.classList.remove('show');
  });
}

// ----------------- Filtro (já existente) -----------------
const filterBtn = document.querySelector(".filter-btn");
const filterDropdown = document.querySelector(".filter-dropdown");

if (filterBtn) {
  filterBtn.addEventListener("click", () => {
    filterDropdown.style.display =
      filterDropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.style.display = "none";
    }
  });

  document.querySelector(".apply-filters").addEventListener("click", () => {
    const carro = document.getElementById("filtro-carro").value;
    const modelo = document.getElementById("filtro-modelo").value;
    const peca = document.getElementById("filtro-peca").value;

    alert(`Filtrando: ${carro} | ${modelo} | ${peca}`);
    // Aqui você pode integrar com a lógica real de filtragem
  });
}

// ======== CARRINHO (integração com backend) ======== //
const btnCarrinho = document.getElementById("btnCarrinho");
const carrinhoModal = document.getElementById("carrinhoModal");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const qtdCarrinho = document.getElementById("qtdCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const cartCountBadge = document.getElementById("cart-count"); // badge no header (opcional)

let carrinho = []; // array local p/ UI { id_anuncio, titulo, preco, quantidade }
let carrinhoCount = 0;

// Função que atualiza o UI do carrinho local
function atualizarCarrinhoUI() {
  if (!listaCarrinho) return;
  listaCarrinho.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    total += (item.preco * item.quantidade);
    const li = document.createElement("li");
    li.innerHTML = `
      <div><strong>${item.titulo}</strong></div>
      <div>Qtd: ${item.quantidade} — R$ ${item.preco.toFixed(2)}</div>
      <button class="remover-item" data-id="${item.id_anuncio}">Remover</button>
    `;
    listaCarrinho.appendChild(li);
  });

  if (qtdCarrinho) qtdCarrinho.textContent = carrinho.length;
  if (totalCarrinho) totalCarrinho.textContent = total.toFixed(2);
  if (cartCountBadge) cartCountBadge.innerText = carrinho.reduce((s,i)=>s+i.quantity||s+i.quantidade, 0) || carrinho.length;
}

// Abre o carrinho
if (btnCarrinho) {
  btnCarrinho.addEventListener("click", () => {
    if (carrinhoModal) carrinhoModal.style.display = "block";
    // ideal: aqui você poderia abrir via fetch('/carrinho/view_cart.php') e mostrar a versão do servidor
  });
}

// Fecha o carrinho
if (fecharCarrinho) {
  fecharCarrinho.addEventListener("click", () => {
    if (carrinhoModal) carrinhoModal.style.display = "none";
  });
}

// Clicar fora fecha também
window.addEventListener("click", (e) => {
  if (e.target == carrinhoModal && carrinhoModal) carrinhoModal.style.display = "none";
});

// Remove item localmente e pede ao servidor para remover (se implementado)
listaCarrinho && listaCarrinho.addEventListener('click', (e) => {
  if (e.target.classList.contains('remover-item')) {
    const id = parseInt(e.target.dataset.id,10);
    // remove da UI local
    carrinho = carrinho.filter(i => i.id_anuncio !== id);
    atualizarCarrinhoUI();

    // também remover do servidor (caso tenha endpoint remove_from_cart.php)
    fetch('/carrinho/remove_from_cart.php', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `id_anuncio=${encodeURIComponent(id)}`
    }).catch(err => console.warn('Erro remover server cart', err));
  }
});

// Função para buscar dados do anúncio no DOM (área do produto) — tenta extrair título/price se presente no HTML
function coletarDadosProdutoDaPagina() {
  const idInput = document.getElementById('id_anuncio');
  const quantidadeSelect = document.getElementById('quantidade');
  let id_anuncio = idInput ? idInput.value : null;
  let quantidade = quantidadeSelect ? parseInt(quantidadeSelect.value,10) : 1;

  // tenta achar título e preço no DOM
  const tituloEl = document.querySelector('.produto-detalhes h1');
  const precoEl = document.querySelector('.preco .preco-avista');

  let titulo = tituloEl ? tituloEl.textContent.trim() : 'Produto';
  let precoRaw = precoEl ? precoEl.textContent.trim() : null;
  let preco = 0;
  if (precoRaw) {
    // remove tudo que não é número ou vírgula e pega valor (ex: "R$ 480,00,00 à vista")
    precoRaw = precoRaw.replace(/[^\d,.-]/g,'').replace(/\.(?=\d{3})/g,''); // simplifica
    preco = parseFloat(precoRaw.replace(',', '.')) || 0;
  }

  return { id_anuncio: id_anuncio ? parseInt(id_anuncio,10) : null, quantidade, titulo, preco };
}

// Adicionar ao carrinho (botão principal)
const addToCartBtn = document.getElementById("add-to-cart");
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', (e) => {
    const dados = coletarDadosProdutoDaPagina();
    if (!dados.id_anuncio) {
      alert('ID do anúncio não encontrado. Peça para o desenvolvedor inserir <input id="id_anuncio" value="..."> no HTML.');
      return;
    }
    // Atualiza UI local imediatamente
    const existente = carrinho.find(i => i.id_anuncio === dados.id_anuncio);
    if (existente) {
      existente.quantidade += dados.quantidade;
    } else {
      carrinho.push({
        id_anuncio: dados.id_anuncio,
        titulo: dados.titulo,
        preco: dados.preco,
        quantidade: dados.quantidade
      });
    }
    atualizarCarrinhoUI();

    // Envia para o servidor (espera JSON)
    fetch('/carrinho/add_to_cart.php', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `id_anuncio=${encodeURIComponent(dados.id_anuncio)}&quantidade=${encodeURIComponent(dados.quantidade)}`
    })
    .then(r => r.json())
    .then(json => {
      if (json.status === 'ok') {
        // opcional: mostrar um toast/aviso breve
        console.log('Adicionado ao carrinho (server). Count:', json.cart_count);
      } else {
        alert('Erro ao adicionar ao carrinho: ' + (json.message || ''));
      }
    })
    .catch(err => {
      console.error('Erro add_to_cart', err);
    });
  });
}

// Finalizar compra: chama checkout.php (server) que cria pedido
const finalizarBtn = document.getElementById('btn-finalizar');
if (finalizarBtn) {
  finalizarBtn.addEventListener('click', (e) => {
    // abrir modal pagamento (já existente) + o usuário preencher endereço/pagamento
    // se quiser fazer checkout direto, chamamos o endpoint.
    // aqui vamos abrir modal, e se o usuário confirmar (no modal) chamar checkout.
    if (modal) modal.classList.add('show');

    // intercepta pagamento com cartão ou pix (botões já tem listeners que abrem modalEndereco)
    // após o usuario confirmar endereço/pagamento, você pode chamar /carrinho/checkout.php via fetch
    // para demo, adicionamos listener no btn-pagar-cartao e btn-pagar-pix que existem no modal:
  });
}

// Se quiser chamar checkout direto (sem modal), descomente e ajuste:
// fetch('/carrinho/checkout.php', { method: 'POST', headers: {'Accept':'application/json'} })
//  .then(r=>r.json()).then(j=>console.log(j)).catch(e=>console.error(e));

// Inicialização: tenta carregar contador do carrinho local (se quiser persistir, criar endpoint que retorna cart_count)
(function initLocalCart() {
  // se quiser, você pode buscar o carrinho do servidor por um endpoint e popular `carrinho`.
  // por enquanto, mantemos carrinho vazio até o usuário adicionar itens nesta sessão.
  atualizarCarrinhoUI();
})();
