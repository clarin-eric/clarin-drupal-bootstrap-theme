/**
 * @file
 * Initialize TOC
 *
 */
(($, Drupal, once) => {
  Drupal.behaviors.clarin_theme_toc = {
    attach: function attach(context) {
      if (context === document) {
        $(function initToc() {
          const navSelector = "#toc";
          const scopeSelector = "#tocscope";
          Toc.init({
            $nav: $(once("selectorID", navSelector, context)),
            $scope: $(once("selectorID", scopeSelector, context))
          });
          const body = $(once("selectorID", "body", context));
          body.scrollspy({
            target: navSelector
          });
        });
      }
    }
  };
})(jQuery, Drupal, once);
