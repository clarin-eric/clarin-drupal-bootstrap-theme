/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.clarin = {
    attach: function(context, settings) {
      if (context !== document) {
        return;
      }
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

      // Hide tags if there are more than 2
      $( ".node--view-mode-teaser-list .field--name-field-tags, .node--view-mode-teaser-big .field--name-field-tags" ).each(function( index ) {
        if ($(this).find("li").length > 2) {
          $(this).find("ul").addClass('hide-more');
          $(this).find("ul").append('<li class="show-tags">...</li>');
        }
      });

      // Show tags when clicked on show tags button
      $(".show-tags").click(function(event){
        $(this).parent().removeClass('hide-more');
      });

      // News article right sidebar fixed scroll
      var headerLimit = $('article .sidebar .toc').offset().top - 73;
      var bottomLimit = $('.footer').offset().top - 400;
      $(window).scroll(function() {
        var currentScroll = $(window).scrollTop();
        console.log(currentScroll);
        if (currentScroll >= headerLimit && currentScroll <= bottomLimit) {
          $('article .sidebar .toc').addClass('fixed-text');
          $('article .sidebar .toc').removeClass('bottom-text');
        } else if (currentScroll >= bottomLimit) {
          $('article .sidebar .toc').removeClass('fixed-text');
          $('article .sidebar .toc').addClass('bottom-text');
        } else {
          $('article .sidebar .toc').removeClass('fixed-text');
          $('article .sidebar .toc').removeClass('bottom-text');
        }
      });
    }
  };

})(jQuery, Drupal);