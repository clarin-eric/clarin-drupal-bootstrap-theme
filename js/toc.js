/**
 * @file
 * Re-positions the submenu
 *
 */
(function($) {
  'use strict';

  $(document).ready(function($) {
    $(function() {
      var navSelector = '#toc';
      var scopeSelector = '#tocscope';
      Toc.init({
        $nav: $(navSelector),
        $scope: $(scopeSelector)
      });
      $('body').scrollspy({
        target: navSelector
      });
    });
    $('#toc').affix({
      offset: {
        top: 250,
        bottom: 200,
      }
    });
  });
})(jQuery);