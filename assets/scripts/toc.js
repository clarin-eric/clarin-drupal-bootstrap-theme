/**
 * @file
 * Initialize TOC
 *
 */
(function($) {
  "use strict";

  $(document).ready(function($) {
    $(function() {
      var navSelector = "#toc";
      var scopeSelector = "#tocscope";
      Toc.init({
        $nav: $(navSelector),
        $scope: $(scopeSelector)
      });
      $("body").scrollspy({
        target: navSelector
      });
    });
  });
})(jQuery);