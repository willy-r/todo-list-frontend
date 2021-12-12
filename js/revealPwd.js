$('#reveal-pwd').click(function() {
  const jPwdInput = $('#password');

  if (this.getAttribute('data-reveal') === '0') {
    jPwdInput.attr('type', 'text');
    
    this.innerHTML = '<i class="far fa-eye"></i>';
    this.setAttribute('data-reveal', '1');
    this.setAttribute('title', 'Esconder senha');
    return;
  }

  jPwdInput.attr('type', 'password');
    
  this.innerHTML = '<i class="far fa-eye-slash"></i>';
  this.setAttribute('data-reveal', '0');
  this.setAttribute('title', 'Ver senha');
});
