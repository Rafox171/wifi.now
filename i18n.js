class I18n {
  constructor() {
    this.translations = {};
    this.currentLang = localStorage.getItem('lang') || 'pt';
    this.supportedLangs = ['pt', 'es', 'en'];
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/translations.json');
      this.translations = await response.json();
      this.applyLanguage(this.currentLang);
      this.setupLanguageSelector();
      document.documentElement.lang = this.currentLang;
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
    }
  }

  applyLanguage(lang) {
    if (!this.supportedLangs.includes(lang)) lang = 'pt';
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Substitui elementos com data-i18n (textContent)
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translations[key]?.[lang];
      if (translation) {
        element.textContent = translation;
      }
    });

    // Substitui elementos com data-i18n-html (innerHTML — preserva tags internas)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.translations[key]?.[lang];
      if (translation) {
        element.innerHTML = translation;
      }
    });

    // Substitui placeholders e atributos
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.translations[key]?.[lang];
      if (translation) {
        element.placeholder = translation;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.translations[key]?.[lang];
      if (translation) {
        element.title = translation;
      }
    });

    // Atualiza o seletor de idioma
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = lang;
    }
  }

  setupLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
      this.applyLanguage(e.target.value);
    });
  }

  t(key, lang = this.currentLang) {
    return this.translations[key]?.[lang] || key;
  }
}

// Inicia i18n quando o DOM está pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
  });
} else {
  window.i18n = new I18n();
}
