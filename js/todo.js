const logado = sessionStorage.getItem('logadoSessao') || localStorage.getItem('logadoLocal');

// Se não tiver logado, verifica se tem conta:
// Se tiver conta, redireciona para a página de login
// Se não, redireciona para a página de cadastro
if (!logado) {
  const temConta = localStorage.getItem('cadastrado');

  if (temConta) {
    location.replace('./login.html');
  } else {
    location.replace('../');
  }
}

// Pega o nome do usuário.
const nomeUsuario = localStorage.getItem('nomeUsuario');
$('#username').text(nomeUsuario);

// Trata logout do usuário.
$('#logout').click(() => {
  // Remove cookies.
  localStorage.removeItem('logadoLocal');
  sessionStorage.removeItem('logadoSessao'); // Pode ser só sessão.
  localStorage.removeItem('idUsuario');
  localStorage.removeItem('nomeUsuario');

  // Redireciona para a página de login.
  location.replace('./login.html');
});

// Trata datas mostradas na aplicação usando DayJS.
dayjs.locale('pt-br'); // Globalmente, vai ser localizado para PT-BR.
const now = dayjs();
$('#day').text(now.date());
$('#month-str').text(now.format('MMM'));
$('#year').text(now.year());
$('#week-day').text(now.format('dddd'));

// Pega o id do usuário.
const idUsuario = localStorage.getItem('idUsuario');

// Trata eventos das tarefas.

// Exibe todas as tarefas em seus devidos lugares.
$.get({
  url: `http://localhost:3000/api/tarefas/${idUsuario}`,
  success: (result) => {
    // 0 = fazer, 1 = feito, 2 = fazer depois
    const fazer = result.tarefas.filter((tarefa) => tarefa.status === 0);
    const feito = result.tarefas.filter((tarefa) => tarefa.status === 1);
    const fazerDepois = result.tarefas.filter((tarefa) => tarefa.status === 2);
    
    // Insere cada tarefa em seu lugar.
    if (fazer.length) {
      fazer.forEach(addTarefaFazer);
    }

    if (fazerDepois.length) {
      fazerDepois.forEach(addTarefaFazerDepois);
    }

    if (feito.length) {
      feito.forEach(addTarefaFeito);
    }
  },
  error: () => console.log('Deu ruim na requisição, tente novamente'),
});

// Adiciona uma tarefa no final das tarefas.
$('#form').submit((event) => {
  event.preventDefault();
  
  $.post({
    url: 'http://localhost:3000/api/tarefa',
    data: JSON.stringify({
      titulo: $('#title').val(),
      status: 0,
      id_usuario: parseInt(idUsuario), // ID do usuário logado.
    }),
    contentType: 'application/json',
    success: (result) => {
      addTarefaFazer(result.tarefaCriada);
    },
    error: () => console.log('Deu ruim na requisição, tente novamente'),
  });
});

/** 
 * Funções.
 */

function addTarefaFazer(tarefa) {
  const tarefaHTML = `
    <li id="tarefa${tarefa.id_tarefa}">
      <p>${tarefa.titulo}</p>
      <div>
        <button class="btn" type="button">
          <span class="fas fa-times"></span>
        </button>
        <button class="btn" type="button">
          <span class="fas fa-pause"></span>
        </button>
        <button class="btn" type="button">
          <span class="fas fa-check"></span>
        </button>
      </div>
    </li>
  `;
  $('#todo').append(tarefaHTML);
}

function addTarefaFazerDepois(tarefa) {
  const tarefaHTML = `
    <li id="tarefa${tarefa.id_tarefa}">
      <p>${tarefa.titulo}</p>
      <div>
        <button class="btn" type="button">
          <span class="fas fa-times"></span>
        </button>
        <button class="btn" type="button">
          <span class="fas fa-check"></span>
        </button>
      </div>
    </li>
  `;
  $('#todo-later').append(tarefaHTML);
}

function addTarefaFeito(tarefa) {
  const tarefaHTML = `
    <li id="tarefa${tarefa.id_tarefa}">
      <p><del>${tarefa.titulo}</del></p>
    </li>
  `;
  $('#done').append(tarefaHTML);
}
