/**
 * @file
 * Initialize TOC
 *
 */
(($, Drupal) => {
  Drupal.behaviors.clarin_theme_toc = {
    attach: function attach(context) {
      if (context === document && document.readyState === "interactive") {
        $(function initToc() {
          const navSelector = "#toc";
          const scopeSelector = "#tocscope";
          Toc.init({
            $nav: $(navSelector, context),
            $scope: $(scopeSelector, context)
          });
          const scrollElem = document.querySelector(scopeSelector);
          bootstrap.ScrollSpy.getOrCreateInstance(scrollElem).refresh();
        });
      }
    }
  };
})(jQuery, Drupal);
