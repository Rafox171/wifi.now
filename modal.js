/* ============================================================
   Modal de contato "Comece gratis" - wi-fi.now
   Injeta o formulario e liga aos botoes "Comecar gratis".
   Acentos via entidades HTML para manter o arquivo ASCII-safe.
   ============================================================ */
(function () {
  var MODAL_HTML = [
    '<div class="form-modal" id="formModal" aria-hidden="true">',
      '<div class="form-modal-overlay" data-close></div>',
      '<div class="form-modal-card" role="dialog" aria-modal="true" aria-labelledby="formModalTitle">',
        '<button type="button" class="form-modal-close" data-close aria-label="Fechar">&times;</button>',
        '<span class="ln-eyebrow">Comece gr&aacute;tis</span>',
        '<h2 class="form-modal-title" id="formModalTitle">Fale com a gente</h2>',
        '<p class="form-modal-sub">Deixe seus dados e a gente ativa o seu acesso. Sem compromisso.</p>',
        '<form class="form-modal-form" novalidate>',
          '<div class="form-grid">',
            '<div class="form-col">',
              '<input type="text" name="nome" placeholder="Nome" required>',
              '<input type="email" name="email" placeholder="Email" required>',
              '<input type="tel" name="telefone" placeholder="Telefone">',
              '<input type="text" name="empresa" placeholder="Nome da empresa">',
            '</div>',
            '<div class="form-col">',
              '<select name="segmento" required>',
                '<option value="" disabled selected>Segmento da empresa</option>',
                '<option>Integrador / Revenda Fortinet</option>',
                '<option>Varejo</option>',
                '<option>Ind&uacute;stria</option>',
                '<option>Servi&ccedil;os</option>',
                '<option>Sa&uacute;de</option>',
                '<option>Educa&ccedil;&atilde;o</option>',
                '<option>Setor p&uacute;blico</option>',
                '<option>Outro</option>',
              '</select>',
              '<textarea name="mensagem" placeholder="Mensagem" rows="5"></textarea>',
            '</div>',
          '</div>',
          '<button type="submit" class="btn btn-primary">Enviar</button>',
        '</form>',
        '<div class="form-modal-success">',
          '<h3>Recebemos seus dados.</h3>',
          '<p>A gente retorna r&aacute;pido.</p>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  function norm(s) {
    return (s || '').trim().toLowerCase().normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    var modal = document.getElementById('formModal');
    if (!modal) return;
    var form = modal.querySelector('.form-modal-form');
    var success = modal.querySelector('.form-modal-success');

    function open(e) {
      if (e) e.preventDefault();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var first = modal.querySelector('input');
      if (first) setTimeout(function () { first.focus(); }, 50);
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Liga todos os botoes/links cujo texto seja "Comecar gratis" / "Comece gratis" ou similares
    var triggers = [
      'comecar gratis',
      'comece gratis',
      'teste gratis',
      'testar gratis',
      'indique e ganhe',
      'falar com a gente',
      'fale com a gente',
      'solicitar acesso'
    ];
    var clickables = document.querySelectorAll('a, button');
    for (var i = 0; i < clickables.length; i++) {
      var el = clickables[i];
      if (el.closest('#formModal')) continue;
      if (triggers.indexOf(norm(el.textContent)) !== -1) {
        el.addEventListener('click', open);
      }
    }

    var closers = modal.querySelectorAll('[data-close]');
    for (var j = 0; j < closers.length; j++) {
      closers[j].addEventListener('click', close);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        // TODO: enviar para o destino real (e-mail, Formspree, CRM/HubSpot).
        // Hoje apenas mostra a confirmacao local, sem envio.
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      });
    }
  });
})();
