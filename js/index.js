const logado = sessionStorage.getItem('logadoSessao') || localStorage.getItem('logadoLocal');

// Se estiver logado, redireciona para a página da aplicação.
// Se não, verifica se tem conta:
// Se tiver, redireciona para a página de login
// Se não, continua na mesma página
if (logado) {
  location.replace('./pages/todo.html');
} else {
  const temConta = localStorage.getItem('cadastrado');

  if (temConta) {
    location.replace('./pages/login.html');
  }
}

$('.form').first().submit((event) => {
  event.preventDefault();

  $.post({
    url: 'http://localhost:3000/api/usuario',
    data: JSON.stringify({
      nome: $('#name').val(),
      email: $('#email').val(),
      senha: $('#password').val(),
    }),
    contentType: 'application/json',
    success: (result) => {
      if (result.erro) {
        // Pode vir mais de um erro, e se vir, é separado por "/".
        const errosHTML = result.msg.split('/').reduce((prev, msg) => {
          const erroHTML = `<li>${msg}</li>`;
          return prev += erroHTML;
        }, '');

        // Substitui as mensagens se já tiver mensagens de erros anteriores.
        $('#errors').html(errosHTML);

        // Mostra a div que contém as mensagens.
        $('.form__errors').show('fast').css('display', 'flex');
        // Esconde depois de 8s mostrando.
        setTimeout(() => $('.form__errors').hide('fast'), 8000);
        return;
      }
      
      // Adiciona cookie para quando o usuário criar a conta.
      sessionStorage.setItem('criouConta', '1');
      // Adiciona cookie quando usuário tem conta (um usuário só pode ter 1 conta).
      localStorage.setItem('cadastrado', '1');

      location.replace('./pages/login.html');
    },
    error: () => console.log('Deu ruim na requisição, tente novamente'),
  });
});
