(function($, Drupal) {

  "use strict";

  // CLARIN slidenav helper methods for the top navbar menu
  // - Add click handler to dismiss the mobile floating menu when clicking outside of it
  Drupal.behaviors.clarin_theme_slidenav = {
    attach: function(context, settings) {

      function addDismissHandler() {
        var collapsingNavbar = $("div#CollapsingNavbar", context);
        var mainwrapper = $("div#main-wrapper", context);
        if(collapsingNavbar.css("position") === "fixed") {
          // Close\slide menu when clicking outside
          mainwrapper.unbind("click");
          mainwrapper.bind("click",function() {
            if (collapsingNavbar.css("display") !== "none")
              $("header button.navbar-toggler", context).trigger("click");
          });
        } else {
            mainwrapper.unbind("click");
        }
      }

      if (context === document) {
        addDismissHandler();
        // On resize event add click handler to dismiss the mobile floating menu when clicking outside of it.
        $(window, context).on("resize", function() {
          addDismissHandler();
        });
      }
    }
  };
})(jQuery, Drupal);