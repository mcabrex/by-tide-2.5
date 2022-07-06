class A11y{constructor(){this.detectTabDirection()}click(t){if("click"===t.type)return!0;if("keypress"===t.type){var e=t.charCode||t.keyCode;if(32===e&&t.preventDefault(),32===e||13===e)return!0}return!1}detectTabDirection(){this.tab_forwards=null,document.addEventListener("keydown",t=>(this.tab_forwards=!0,9===t.which&&t.shiftKey&&(this.tab_forwards=!1),!0))}getFocusableEl(e=!1){if(e){let t;"small"===theme.mqs.current_window?t=":not([data-mq='medium-large']):not([data-mq='medium']):not([data-mq='large'])":"medium"===theme.mqs.current_window?t=":not([data-mq='small']):not([data-mq='large'])":"large"===theme.mqs.current_window&&(t=":not([data-mq='small-medium']):not([data-mq='small']):not([data-mq='medium'])");var a=`
      button:not([disabled]):not([aria-hidden='true']),
      [href]${t},
      input:not([type='hidden']):not([disabled]):not([aria-hidden='true']),
      select:not([disabled]):not([data-mq='none']):not([aria-hidden='true']),
      textarea:not([disabled]),
      [tabindex]:not([tabindex='-1'])${t}
    `;return e.querySelectorAll(a)}}}theme.a11y=new A11y;