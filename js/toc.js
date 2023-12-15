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
          const navSelector = "#toc";
          const scopeSelector = "#tocscope";
          Toc.init({
            $nav: $(navSelector, context),
            $scope: $(scopeSelector, context)
          });
          const body = $("body", context);
          const scrollSpy = new bootstrap.ScrollSpy(body, {
            target: navSelector
          });
          scrollSpy.refresh();
        });
      }
    }
  };
})(jQuery, Drupal);
