document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const formCliente = document.getElementById('form-cliente');
    const formEmpresa = document.getElementById('form-empresa');
  
    // Função para trocar abas/formulários
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
      
          if (tab.getAttribute('data-tab') === 'cliente') {
            formCliente.classList.add('active');
            formEmpresa.classList.remove('active');
          } else {
            formEmpresa.classList.add('active');
            formCliente.classList.remove('active');
          }
        });
      });
      
  
    // Validação simples de email para cliente
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    // Validação simples de CNPJ (formato básico)
    function validateCNPJ(cnpj) {
      // Exemplo simples, só valida tamanho e números e formatação básica
      const re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      return re.test(cnpj);
    }
  
    // Handle submit cliente
    formCliente.addEventListener('submit', async e => {
      e.preventDefault();
  
      const emailInput = document.getElementById('email-cliente');
      const senhaInput = document.getElementById('senha-cliente');
  
      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();
  
      if (!validateEmail(email)) {
        alert('Informe um e-mail válido para Cliente.');
        emailInput.focus();
        return;
      }
  
      if (!senha) {
        alert('Informe a senha para Cliente.');
        senhaInput.focus();
        return;
      }
  
      // Simula login
      alert('Login de Cliente realizado com sucesso (simulado).');
      // Aqui você pode colocar a chamada real ao backend, redirecionamento, etc.
    });
  
    // Handle submit empresa
    formEmpresa.addEventListener('submit', async e => {
      e.preventDefault();
  
      const cnpjInput = document.getElementById('cnpj');
      const senhaInput = document.getElementById('senha-empresa');
  
      const cnpj = cnpjInput.value.trim();
      const senha = senhaInput.value.trim();
  
      if (!validateCNPJ(cnpj)) {
        alert('Informe um CNPJ válido para Empresa no formato 00.000.000/0000-00.');
        cnpjInput.focus();
        return;
      }
  
      if (!senha) {
        alert('Informe a senha para Empresa.');
        senhaInput.focus();
        return;
      }
  
      // Simula login
      alert('Login de Empresa realizado com sucesso (simulado).');
      // Aqui você pode colocar a chamada real ao backend, redirecionamento, etc.
    });
  });
  