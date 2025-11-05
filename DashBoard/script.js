// ======= Alternar seções =======
const links = document.querySelectorAll('.sidebar nav a');
const secDashboard = document.getElementById('sec-dashboard');
const secPerfil = document.getElementById('sec-perfil');
const secAdicionar = document.getElementById('sec-adicionar');

links.forEach((link, idx) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    // Esconde todas as seções
    secDashboard.style.display = 'none';
    secPerfil.style.display = 'none';
    secAdicionar.style.display = 'none';
    // Remove active dos links
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    // Exibe a seção correspondente
    if(idx === 0) secDashboard.style.display = 'block';
    if(idx === 1) secPerfil.style.display = 'block';
    if(idx === 2) secAdicionar.style.display = 'block';
  });
});

// ======= Listar produtos =======
async function listarProdutos() {
  try {
    const resp = await fetch('listarProdutos.php');
    const produtos = await resp.json();
    const tbody = document.getElementById('lista-produtos');
    tbody.innerHTML = '';

    produtos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td><img src="uploads/${p.foto_principal}" width="50" style="border-radius:4px;"></td>
          <td>${p.nome}</td>
          <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
        </tr>
      `;
    });

    // Atualiza total de produtos
    document.getElementById('totalProdutos').textContent = produtos.length;
  } catch(err) {
    console.error('Erro ao listar produtos:', err);
  }
}

// ======= Filtro de pesquisa =======
document.getElementById('search').addEventListener('input', e => {
  const termo = e.target.value.toLowerCase();
  document.querySelectorAll('#lista-produtos tr').forEach(tr => {
    const nome = tr.children[1].textContent.toLowerCase();
    tr.style.display = nome.includes(termo) ? 'table-row' : 'none';
  });
});

// ======= Cadastro via AJAX =======
const form = document.getElementById('formProduto');
const fotoPreview = document.getElementById('fotoPreview');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  try {
    const resp = await fetch('processaProduto.php', { method: 'POST', body: formData });
    const texto = await resp.text();
    alert(texto);
    form.reset();
    fotoPreview.innerHTML = '<span>+</span>';
    listarProdutos(); // Atualiza tabela automaticamente
  } catch(err) {
    console.error('Erro ao cadastrar produto:', err);
  }
});

// ======= Preview da imagem =======
document.getElementById('foto').addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ev => fotoPreview.innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
    reader.readAsDataURL(file);
  } else {
    fotoPreview.innerHTML = '<span>+</span>';
  }
});

// ======= Gráfico de vendas =======
new Chart(document.getElementById("graficoVendas"), {
  type: 'bar',
  data: {
    labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    datasets: [
      { label: 'Vendas', data: [300,400,350,500,480,600,580,540,570,610,620,630], backgroundColor: 'limegreen' },
      { label: 'Itens', data: [200,250,240,300,280,350,340,320,330,360,370,380], backgroundColor: 'red' }
    ]
  },
  options: { responsive:true, scales:{ y:{ beginAtZero:true } } }
});

// ======= Inicializa lista de produtos ao carregar página =======
window.addEventListener('load', listarProdutos);
document.addEventListener('DOMContentLoaded', () => {
    const perfilContainer = document.getElementById('perfil-container');
    const loginLink = document.getElementById('loginLink');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuario) {
      // Mostra nome/ícone de perfil
      perfilContainer.innerHTML = `
        <div class="perfil-info">
          <img src="../Login/imgLogin/perfil.png" alt="Perfil" class="perfil-icon">
          <span>${usuario.nome}</span>
          <button id="logoutBtn">Sair</button>
        </div>
      `;

      // botão de sair
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.reload();
      });
    }
  });