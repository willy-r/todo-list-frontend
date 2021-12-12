const logado = sessionStorage.getItem('logadoSessao') || localStorage.getItem('logadoLocal');

// Se estiver logado, redireciona para a página da aplicação.
// Se não, verifica se tem conta:
// Se não tiver, redireciona para a página de cadastro
// Se tiver, continua na mesma página
if (logado) {
  location.replace('./todo.html');
} else {
  const temConta = localStorage.getItem('cadastrado');

  if (!temConta) {
    location.replace('../');
  }
}

const usuarioCriouConta = sessionStorage.getItem('criouConta');

if (usuarioCriouConta) {
  const jMsg = $('#flash-msg');

  jMsg.show();
  jMsg.addClass('message--success');
  jMsg.html(`
    <p><i class="fas fa-user-check"></i> Conta criada com sucesso!</p>
  `);

  // Esconde a mensagem dps de 5 segundos.
  setTimeout(() => jMsg.hide('fast'), 5000);

  // Remove cookie.
  sessionStorage.removeItem('criouConta');
}

$('.form').first().submit((event) => {
  event.preventDefault();

  $.post({
    url: 'http://localhost:3000/api/usuario/login',
    data: JSON.stringify({
      email: $('#email').val(),
      senha: $('#password').val(),
    }),
    contentType: 'application/json',
    success: (result) => {
      if (result.erro) {
        // Nesse caso só vem uma mensagem de erro.
        const erroHTML = `<li>${result.msg}</li>`;
        
        $('#errors').html(erroHTML);

        // Mostra a div que contém as mensagens.
        $('.form__errors').show('fast').css('display', 'flex');
        // Esconde depois de 5s mostrando.
        setTimeout(() => $('.form__errors').hide('fast'), 5000);
        return;
      }

      // Verifica se o usuário marcou se quer continuar logado.
      if ($('#remember').is(':checked')) {
        sessionStorage.removeItem('logadoSessao');
        localStorage.setItem('logadoLocal', '1');
      } else {
        localStorage.removeItem('logadoLocal');
        sessionStorage.setItem('logadoSessao', '1');
      }
      
      // Seta algumas infos para serem usadas na página da aplicação.
      localStorage.setItem('idUsuario', result.info.idUsuario);
      localStorage.setItem('nomeUsuario', result.info.nome);
      
      location.replace('./todo.html');
    },
    error: () => console.log('Deu ruim na requisição, tente novamente'),
  });
});
