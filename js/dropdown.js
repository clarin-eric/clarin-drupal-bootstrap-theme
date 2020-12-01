/**
 * @file
 * Re-positions the submenu
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.dropdown = {
    attach: function(context, settings) {
      if (context !== document) {
        return;
      }
      var width = $( document ).width();

      if (width > 1024) {
        var navbarOffset = $('.region-navigation').offset().left;
        $( "li.dropdown-menu" ).mouseover(function() {
          var posLeft = $(this).offset().left;
          var subWidth = $(this).find('.we-mega-menu-submenu').outerWidth();
          if (subWidth >= 800 && subWidth < 1100) {
            var newPos = posLeft - ((subWidth / 2) - 50);
            $(this).find('.we-mega-menu-submenu').offset({left: newPos});
          } else if (subWidth >= 1100) {
            $(this).find('.we-mega-menu-submenu').offset({left: navbarOffset});
          }
        });
      }
    }
  };

})(jQuery, Drupal);