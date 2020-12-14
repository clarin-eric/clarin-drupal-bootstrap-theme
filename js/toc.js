/**
 * @file
 * Re-positions the submenu
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.toc = {
    attach: function(context, settings) {
      if (context !== document) {
        return;
      }
      $(".node__content .field--name-body h2").each(function (i) {
          $(this).attr('id', 'heading-2-'+i);
        }
      );
      $(".node__content .field--name-body h3").each(function (i) {
          $(this).attr('id', 'heading-3-'+i);
        }
      );
      $(".node__content .field--name-body h4").each(function (i) {
          $(this).attr('id', 'heading-4-'+i);
        }
      );

      $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
      });
    }
  };

})(jQuery, Drupal);