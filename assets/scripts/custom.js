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

      // Navbar toggle add active class
      $('.navbar-toggle').click(function() {
        $(this).toggleClass('active');
      });

      // Header scroll down arrow function
      $(".paragraph--type--header-large .arrow-down").click(function(event){
        $('html, body').animate({scrollTop: '+=660px'}, 800);
      });

    }
  };

})(jQuery, Drupal);