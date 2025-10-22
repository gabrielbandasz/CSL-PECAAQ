document.addEventListener('DOMContentLoaded', () => {
  // === Elementos principais ===
  const abas = document.querySelectorAll('.tab');
  const containerAbas = document.querySelector('.tab-selector');

  const formLoginCliente = document.getElementById('form-cliente');
  const formLoginEmpresa = document.getElementById('form-empresa');

  const cadastroCliente = document.getElementById('cadastroForm');
  // const cadastroEmpresa = document.getElementById('cadastroForm-empresa'); // se existir

  const linksCadastro = document.querySelectorAll('.link-to-cadastro');
  const linkLoginRodape = document.querySelector('#link-login');

  const cadastroTipo = document.getElementById('cadastroTipo');
  const cadastroCpfCnpjField = document.getElementById('cadastroCpfCnpjField');
  const cadastroCpfCnpjInput = document.getElementById('cadastroCpfCnpj');

  // Ajuste conforme seu ambiente (mantive o que você forneceu)
  const redirectURL = 'http://127.0.0.1:5500/Produtos/index.html#Produtos/index.html';

  // === Estado inicial: mostrar Cliente por padrão ===
  if (abas.length) {
    abas.forEach(a => a.classList.remove('active'));
    abas[0].classList.add('active');
  }
  if (formLoginCliente) formLoginCliente.style.display = 'block';
  if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
  if (cadastroCliente) cadastroCliente.style.display = 'none';

  // === Funções auxiliares ===
  function esconderAbas() {
    if (containerAbas) containerAbas.style.display = 'none';
    if (abas.length) abas.forEach(a => a.classList.remove('active'));
  }

  function mostrarAbas() {
    if (containerAbas) containerAbas.style.display = '';
    if (abas.length) {
      abas.forEach(a => a.classList.remove('active'));
      abas[0].classList.add('active');
    }
  }

  function atualizarCampoCpfCnpj() {
    if (!cadastroTipo || !cadastroCpfCnpjField || !cadastroCpfCnpjInput) return;
    const tipo = cadastroTipo.value;
    const labelEl = cadastroCpfCnpjField.querySelector('label');
    if (tipo === 'cliente') {
      if (labelEl) labelEl.textContent = 'CPF';
      cadastroCpfCnpjInput.placeholder = 'Somente números (ex: 12345678901)';
      cadastroCpfCnpjInput.maxLength = 11;
    } else {
      if (labelEl) labelEl.textContent = 'CNPJ';
      cadastroCpfCnpjInput.placeholder = '00.000.000/0000-00';
      cadastroCpfCnpjInput.maxLength = 18;
    }
  }

  // Atualiza campo ao mudar tipo (cliente/empresa)
  if (cadastroTipo) {
    cadastroTipo.addEventListener('change', atualizarCampoCpfCnpj);
    atualizarCampoCpfCnpj();
  }

  // === Navegação entre abas (Cliente/Empresa) ===
  if (abas.length) {
    abas.forEach(tab => {
      tab.addEventListener('click', () => {
        abas.forEach(a => a.classList.remove('active'));
        tab.classList.add('active');

        const label = tab.textContent.trim().toLowerCase();

        if (label.includes('cliente')) {
          if (formLoginCliente) formLoginCliente.style.display = 'block';
          if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
          if (cadastroCliente) cadastroCliente.style.display = 'none';
        } else if (label.includes('empresa')) {
          if (formLoginEmpresa) formLoginEmpresa.style.display = 'block';
          if (formLoginCliente) formLoginCliente.style.display = 'none';
          if (cadastroCliente) cadastroCliente.style.display = 'none';
        }
      });
    });
  }

  // === Abrir cadastro (links de cadastro) ===
  if (linksCadastro.length) {
    linksCadastro.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        esconderAbas();
        if (formLoginCliente) formLoginCliente.style.display = 'none';
        if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
        if (cadastroCliente) cadastroCliente.style.display = 'block';
      });
    });
  }

  // === Voltar ao login pelo rodapé ===
  if (linkLoginRodape) {
    linkLoginRodape.addEventListener('click', e => {
      e.preventDefault();
      mostrarAbas();
      if (formLoginCliente) formLoginCliente.style.display = 'block';
      if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
      if (cadastroCliente) cadastroCliente.style.display = 'none';
    });
  }

  // === Validações ===
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateCNPJ(cnpj) {
    // aceita formatado como 00.000.000/0000-00
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  }

  function validateCPF(cpf) {
    // exige 11 dígitos sem máscara (you can adjust if you want masked cpf)
    return /^\d{11}$/.test(cpf);
  }

  function validateSenha(senha, senhaConfirm) {
    if (!senha || senha.length < 6) return false;
    if (senhaConfirm !== undefined) return senha === senhaConfirm;
    return true;
  }

  // === Submit login cliente ===
  if (formLoginCliente) {
    formLoginCliente.addEventListener('submit', e => {
      e.preventDefault();

      const emailEl = document.getElementById('email-cliente');
      const senhaEl = document.getElementById('senha-cliente');
      const email = emailEl ? emailEl.value.trim() : '';
      const senha = senhaEl ? senhaEl.value.trim() : '';

      if (!validateEmail(email)) {
        alert('Informe um e-mail válido para Cliente.');
        return;
      }
      if (!senha) {
        alert('Informe a senha para Cliente.');
        return;
      }

      // Se quiser redirecionar, use a URL; aqui apenas simulo
      // window.location.href = redirectURL;
      alert('Login de Cliente realizado com sucesso (simulado).');
    });
  }

  // === Submit login empresa ===
  if (formLoginEmpresa) {
    formLoginEmpresa.addEventListener('submit', e => {
      e.preventDefault();

      const cnpjEl = document.getElementById('cnpj');
      const senhaEl = document.getElementById('senha-empresa');
      const cnpj = cnpjEl ? cnpjEl.value.trim() : '';
      const senha = senhaEl ? senhaEl.value.trim() : '';

      if (!validateCNPJ(cnpj)) {
        alert('Informe um CNPJ válido no formato 00.000.000/0000-00.');
        return;
      }
      if (!senha) {
        alert('Informe a senha para Empresa.');
        return;
      }

      // window.location.href = redirectURL;
      alert('Login de Empresa realizado com sucesso (simulado).');
    });
  }

  // === Submit cadastro (cliente/empresa) ===
  if (cadastroCliente) {
    cadastroCliente.addEventListener('submit', e => {
      e.preventDefault();

      const tipoVal = cadastroTipo ? cadastroTipo.value : 'cliente';
      const nomeEl = document.getElementById('cadastroNome');
      const emailEl = document.getElementById('cadastroEmail');
      const senhaEl = document.getElementById('cadastroSenha');
      const senha2El = document.getElementById('cadastroSenha2');

      const nome = nomeEl ? nomeEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const senha = senhaEl ? senhaEl.value.trim() : '';
      const senha2 = senha2El ? senha2El.value.trim() : '';
      const cpfCnpj = cadastroCpfCnpjInput ? cadastroCpfCnpjInput.value.trim() : '';

      if (!nome) { alert('Informe o nome ou razão social.'); return; }
      if (!validateEmail(email)) { alert('Informe um e-mail válido.'); return; }
      if (!validateSenha(senha, senha2)) { alert('Senhas inválidas ou não conferem (mínimo 6 caracteres).'); return; }

      if (tipoVal === 'cliente') {
        // aceita apenas 11 números (sem pontos/traços)
        const numericCpf = cpfCnpj.replace(/\D/g, '');
        if (!validateCPF(numericCpf)) { alert('Informe um CPF válido (11 números).'); return; }
      } else if (tipoVal === 'empresa') {
        if (!validateCNPJ(cpfCnpj)) { alert('Informe um CNPJ válido no formato 00.000.000/0000-00.'); return; }
      }

      alert('Cadastro realizado com sucesso (simulado).');
      cadastroCliente.reset();
      // após cadastro, volta à tela de login
      mostrarAbas();
      if (formLoginCliente) formLoginCliente.style.display = 'block';
      if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
      if (cadastroCliente) cadastroCliente.style.display = 'none';
      atualizarCampoCpfCnpj();
    });
  }
});
