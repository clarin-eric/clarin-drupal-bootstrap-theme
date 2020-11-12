/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.clarin = {
    attach: function(context, settings) {

      // landingpage header image to background
      $( ".field--name-field-content-blocks" ).each(function( index ) {
        var image = $(this).find('.paragraph--type--header-large img, .paragraph--type--cta img').attr('src');
        $(this).find('.paragraph--type--header-large, .paragraph--type--cta').css("background-image", "url('"+image+"')");
      });

    }
  };

})(jQuery, Drupal);