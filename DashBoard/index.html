<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard da Empresa - PeçaAq</title>

  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

</head>

<body>

  <!-- Sidebar -->
  <div class="sidebar">
    <div class="logo">
      <img src="img/LogoPecaAq4.png" alt="Logo PeçaAq">
      <h2>PEÇAAQ</h2>
    </div>

    <nav>
      <a href="#" class="active"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
      <a href="#"><i class="fa-regular fa-user"></i> Perfil</a>
      <a href="#"><i class="fa-solid fa-plus"></i> Adicionar</a>
    </nav>

    <div class="sidebar-footer">
<button id="btnVoltar" class="btn-voltar">
  <i class="fa-solid fa-arrow-left"></i> Voltar
</button>
<button id="btnSidebarSair"><i class="fa-solid fa-right-from-bracket"></i> Sair</button>
    </div>
  </div>

  <!-- Conteúdo Principal -->
  <main class="main-content">

    <header>
      <h1>DASHBOARD</h1>

      <div class="header-right">

        <span class="empresa-nome" id="headerEmpresaNome">Carregando...</span>
        <i class="fa-regular fa-circle-user"></i>
      </div>
    </header>

    <!-- SEÇÃO: DASHBOARD -->
    <section id="sec-dashboard">
      <div class="cards">
        <div class="card">
          <h3>Total de Produtos</h3>
          <p class="valor" id="cardTotalProdutos">0</p>
        </div>

      


        <div class="card">
          <h3>Produtos em estoque</h3>
          <p class="valor" id="totalProdutos">0</p>
        </div>
      </div>

      <div class="content">

        <!-- Tabela -->
<div class="tabela-produtos">
  <h3>Produtos</h3>
  <input type="text" id="search" placeholder="🔍 Pesquise...">

  <table id="tabelaProdutos">
    <thead>
      <tr>
        <th>Imagem</th>
        <th>Nome</th>
        <th>Preço</th>
        <th>Ações</th>
      </tr>
    </thead>

    <tbody id="lista-produtos">
      <!-- preenchido pelo JS -->
    </tbody>
  </table>
</div>

<!-- MODAL DE EDIÇÃO IGUAL AO DO PERFIL -->
<div id="modalEditar" class="modal" style="display:none;">
  <div class="modal-content">
      <span class="close" id="fecharModal">&times;</span>
      <h2>Editar Produto</h2>

      <input type="hidden" id="edit_id">

      <label>Nome:</label>
      <input type="text" id="edit_nome">

      <label>SKU:</label>
      <input type="text" id="edit_sku">

      <label>Marca:</label>
      <input type="text" id="edit_marca">

      <label>Preço:</label>
      <input type="text" id="edit_preco">

      <label>Descrição Técnica:</label>
      <textarea id="edit_descricao"></textarea>


  </div>
</div>


</div>


     

      </div>
    </section>
<!-- SEÇÃO: PERFIL -->
<section id="sec-perfil" style="display:none;" class="perfil">
  <div class="perfil-card">

    <!-- TOPO: Nome da empresa e CNPJ -->
    <div class="perfil-top">
      <h2 id="perfilNomeEmpresa">Carregando...</h2>
      <p id="perfilCNPJ">CNPJ: ---</p>
    </div>

    <div class="perfil-info-clean">
      <h3>Informações da Conta</h3>

      <div class="linha-info">
        <span class="label">Email:</span>
        <p id="perfilEmail" class="valor-info">---</p>
      </div>

      <div class="linha-info">
        <span class="label">Telefone:</span>
        <p id="perfilTelefone" class="valor-info">---</p>
      </div>
    </div>

   <div class="perfil-actions">
      <button id="btnEditarPerfil">Editar Perfil</button>
      <button class="btn-sair" id="btnSair">Sair da Empresa</button>
   </div>
<!-- Modal de Edição de Perfil -->
<div id="modalEditarPerfil" style="display:none;" class="modal">
  <div class="modal-content">
    <h3>Editar Perfil</h3>
    <form id="formEditarPerfil">
      <label for="editarEmail">Email:</label>
      <input type="email" name="email" id="editarEmail" required>

      <label for="editarTelefone">Telefone:</label>
      <input type="text" name="telefone" id="editarTelefone" required>

      <div class="modal-buttons">
        <button type="submit" class="btn-salvar">Salvar</button>
        <button type="button" id="btnFecharEditarPerfil" class="btn-cancelar">Cancelar</button>
      </div>
    </form>
    <div id="msgEditarPerfil"></div>
  </div>
</div>

</section>



    <!-- SEÇÃO: ADICIONAR PRODUTO -->
    <section id="sec-adicionar" style="display:none;">
      <h3>Adicionar Produto</h3>

      <form id="formProduto" enctype="multipart/form-data">

        <label>Nome do Produto:</label>
        <input type="text" id="nome" name="nome" required>

        <label>SKU Universal:</label>
        <input type="text" id="sku" name="sku">

        <label>Marca:</label>
        <input type="text" id="marca" name="marca">

        <label>Descrição Técnica:</label>
        <textarea id="descricao" name="descricao" rows="4"></textarea>

        <label>Preço (R$):</label>
        <input type="text" id="preco" name="preco" required>

        <label>Foto do Produto:</label>
        <input type="file" id="foto" name="foto" accept="image/*" required>

        <div id="fotoPreview"
          style="margin-top:10px; width:200px; height:150px; border:1px dashed #ccc; display:flex; align-items:center; justify-content:center;">
          <span>+</span>
        </div>

        <button type="submit">Cadastrar Produto</button>
      </form>

    </section>

  </main>

  <!-- ✅ SCRIPT COMPLETO DO DASHBOARD -->
<script>
document.addEventListener("DOMContentLoaded", () => {

    /* ============================
          TROCAR ENTRE SEÇÕES
    ============================= */
    const links = document.querySelectorAll(".sidebar nav a");
    const secDashboard = document.getElementById("sec-dashboard");
    const secPerfil = document.getElementById("sec-perfil");
    const secAdicionar = document.getElementById("sec-adicionar");

    links.forEach((link, index) => {
        link.addEventListener("click", event => {
            event.preventDefault();

            secDashboard.style.display = "none";
            secPerfil.style.display = "none";
            secAdicionar.style.display = "none";

            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            if (index === 0) secDashboard.style.display = "block";
            if (index === 1) secPerfil.style.display = "block";
            if (index === 2) secAdicionar.style.display = "block";
        });
    });

    /* ============================
              LISTAR PRODUTOS
    ============================= */
    async function listarProdutos() {
        try {
            const resp = await fetch("listarProdutos.php");
            const json = await resp.json();

            if (json.status !== "ok") return;

            const lista = document.getElementById("lista-produtos");
            lista.innerHTML = "";

            json.produtos.forEach(produto => {
                lista.innerHTML += `
                    <tr>
                        <td><img src="${produto.foto_principal}" width="60" style="border-radius:6px; object-fit: cover;"></td>
                        <td>${produto.nome}</td>
                        <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>

                        <td>
                            <button class="btn-excluir-prod" onclick="excluirProduto(${produto.id_produto})">🗑️ Excluir</button>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("totalProdutos").textContent = json.produtos.length;

        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);
        }
    }

    /* ============================
              CADASTRAR PRODUTO
    ============================= */
    const form = document.getElementById("formProduto");
    const fotoPreview = document.getElementById("fotoPreview");

    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(form);

            try {
                const resp = await fetch("../DashBoard/processaProduto.php", {
                    method: "POST",
                    body: formData
                });

                const json = await resp.json();

                if (json.status === "ok") {
                    alert("Produto cadastrado!");
                    form.reset();
                    fotoPreview.innerHTML = "<span>+</span>";
                    listarProdutos();
                } else {
                    alert("Erro ao cadastrar produto");
                }

            } catch (erro) {
                console.error("Erro:", erro);
            }
        });
    }

    /* ============================
                PREVIEW FOTO
    ============================= */
    const inputFoto = document.getElementById("foto");

    if (inputFoto && fotoPreview) {
        inputFoto.addEventListener("change", e => {
            const file = e.target.files[0];
            if (!file) {
                fotoPreview.innerHTML = "<span>+</span>";
                return;
            }

            const reader = new FileReader();
            reader.onload = ev => {
                fotoPreview.innerHTML =
                    `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
            };
            reader.readAsDataURL(file);
        });
    }

    /* ============================
              PESQUISA
    ============================= */
    const search = document.getElementById("search");

    if (search) {
        search.addEventListener("input", event => {
            const termo = event.target.value.toLowerCase();

            document.querySelectorAll("#lista-produtos tr").forEach(tr => {
                const nome = tr.children[1].textContent.toLowerCase();
                tr.style.display = nome.includes(termo) ? "" : "none";
            });
        });
    }

    /* ============================
              GRÁFICO
    ============================= */
    const graficoVendas = document.getElementById("graficoVendas");

    if (graficoVendas) {
        new Chart(graficoVendas, {
            type: "bar",
            data: {
                labels: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
                datasets: [
                    { label: "Vendas", data: [300,400,350,500,480,600,580,540,570,610,620,630], backgroundColor: "limegreen" },
                    { label: "Itens", data: [200,250,240,300,280,350,340,320,330,360,370,380], backgroundColor: "red" }
                ]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    /* ============================
              PERFIL
    ============================= */
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
        const setText = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t };
        setText("headerEmpresaNome", usuario.nome_empresa);
        setText("perfilNomeEmpresa", usuario.nome_empresa);
        setText("perfilCNPJ", "CNPJ: " + (usuario.cnpj || "---"));
        setText("perfilEmail", usuario.email || "---");
        setText("perfilTelefone", usuario.telefone || "---");
    }

    /* ============================
                LOGOUT
    ============================= */
    const URL_LOGIN = "http://localhost/CSL-Scrum-main/Login/indexLogin.html";

    function sair() {
        localStorage.removeItem("usuarioLogado");
        window.location.href = URL_LOGIN;
    }

    document.getElementById("btnSair")?.addEventListener("click", sair);
    document.getElementById("btnSidebarSair")?.addEventListener("click", sair);

    /* ============================
                DASHBOARD
    ============================= */
    async function carregarDashboard() {
        try {
            const resp = await fetch("dadosDashboard.php");
            const json = await resp.json();

            if (json.status === "ok") {
                document.getElementById("cardTotalProdutos").textContent = json.produtos;
                document.getElementById("cardTotalAnuncios").textContent = json.anuncios;
            }
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    listarProdutos();
    carregarDashboard();
});

/* ============================
      BOTÃO EDITAR (Modal)
============================ */
async function abrirModalEditar(id) {
    const resp = await fetch("buscarProduto.php?id=" + id);
    const data = await resp.json();

    if (!data.ok) return alert("Erro ao buscar produto!");

    const p = data.produto;

    document.getElementById("edit_id").value = p.id_produto;
    document.getElementById("edit_nome").value = p.nome;
    document.getElementById("edit_sku").value = p.sku;
    document.getElementById("edit_marca").value = p.marca;
    document.getElementById("edit_preco").value = p.preco;
    document.getElementById("edit_descricao").value = p.descricao;

    document.getElementById("modalEditar").style.display = "block";
}

/* ============================
      FECHAR MODAL
============================ */
document.getElementById("fecharModal")?.addEventListener("click", () => {
    document.getElementById("modalEditar").style.display = "none";
});

/* ============================
      SALVAR EDIÇÃO
============================ */
document.getElementById("salvarEdicao")?.addEventListener("click", async () => {
    const fd = new FormData();

    fd.append("id", document.getElementById("edit_id").value);
    fd.append("nome", document.getElementById("edit_nome").value);
    fd.append("sku", document.getElementById("edit_sku").value);
    fd.append("marca", document.getElementById("edit_marca").value);
    fd.append("preco", document.getElementById("edit_preco").value);
    fd.append("descricao", document.getElementById("edit_descricao").value);

    const resp = await fetch("editarProduto.php", {
        method: "POST",
        body: fd
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Produto atualizado!");
        document.getElementById("modalEditar").style.display = "none";
        location.reload();
    } else {
        alert("Erro ao salvar!");
    }
});

/* ============================
      EXCLUIR PRODUTO
============================ */
async function excluirProduto(id) {
    if (!confirm("Deseja excluir este produto?")) return;

    const fd = new FormData();
    fd.append("id_produto", id);

    const resp = await fetch("excluirProduto.php", {
        method: "POST",
        body: fd
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Produto excluído!");
        location.reload();
    } else {
        alert("Erro ao excluir!");
    }
}



const btnVoltar = document.getElementById("btnVoltar");
if (btnVoltar) {
  btnVoltar.addEventListener("click", () => {
    // Mantém o usuário logado
    window.location.href = "../LaningPage/indexLandingPage.html";
  });
}
</script>

<script src="script.js"></script>
</body>

 <style>
    /* Estilo do botão de excluir */
    .btn-excluir-prod {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .btn-excluir-prod:hover {
        background-color: #c0392b;
        transform: scale(1.05);
    }

    .btn-excluir-prod:active {
        transform: scale(0.98);
    }
    /* Botão Voltar estilizado */
.btn-voltar {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-voltar:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.btn-voltar:active {
  transform: scale(0.98);
}
  </style>
</html>