/**
 * @file
 * Initialize TOC
 *
 */
(($, Drupal) => {
  Drupal.behaviors.clarin_theme_toc = {
    attach: function attach(context) {
      if (context === document && document.readyState !== "loading") {
        $(function initToc() {
          let timer = null;
          const navSelector = "#toc";
          const scopeSelector = "#tocscope";
          window.cancelAnimationFrame(timer);
          timer = window.requestAnimationFrame(() => {
            Toc.init({
              $nav: $(navSelector, context),
              $scope: $(scopeSelector, context)
            });
          });
        });
      }
    }
  };
})(jQuery, Drupal);
