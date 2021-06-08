/**
 * @file
 * Initialize TOC
 *
 */
(function($, Drupal) {
  Drupal.behaviors.clarin_theme_toc = {
    attach: function attach(context) {
      if (context === document) {
        $(function initToc() {
          var navSelector = "#toc";
          var scopeSelector = "#tocscope";
          Toc.init({
            $nav: $(navSelector, context),
            $scope: $(scopeSelector, context)
          });
          $("body").scrollspy({
            target: navSelector
          });
        });
      }
    }
  };
})(jQuery, Drupal);
