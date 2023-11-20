/**
 * @file
 * Initialize TOC
 *
 */
(function($, Drupal, once) {
  Drupal.behaviors.clarin_theme_toc = {
    attach: function attach(context) {
      if (context === document) {
        $(function initToc() {
          var navSelector = "#toc";
          var scopeSelector = "#tocscope";
          Toc.init({
            $nav: $(once("navSelectorID", navSelector, context)),
            $scope: $(once("scopeSelectorID", scopeSelector, context))
          });
          const body = $(once("bodySelectorID", "body", context));
          body.scrollspy({
            target: navSelector
          });
        });
      }
    }
  };
})(jQuery, Drupal, once);
