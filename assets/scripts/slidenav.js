(function($, Drupal) {

  "use strict";

  // CLARIN slidenav helper methods for the top navbar menu
  // - Add click handler to dismiss (slide out) the mobile floating menu when clicking outside of it
  Drupal.behaviors.clarin_theme_slidenav = {
    attach: function(context, settings) {

      function setDismissHandler(body, isBond) {
        var collapsingNavbar = $("div#CollapsingNavbar", body);
        //console.log(collapsingNavbar.css("position"));
        if(collapsingNavbar.css("position") === "fixed") {
          // When the viewport is narrow enough #collapsingNavbar becomes "fixed" -> bind handler to body
          if (!isBond) {
            body.on("click",function(event) {
              if (!event.target.classList.contains("navbar-toggler") && //avoid event recursion since the toggler is part of body
                  !collapsingNavbar[0].contains(event.target) &&  // do not close menu if clicking on it
                  collapsingNavbar.css("display") !== "none") {  // is closed
                //send click event to toggler
                $("header button.navbar-toggler", context).trigger("click");
              }
            });
            //console.log("handler bond");
          }
          return true;
        } else {
          // When the viewport is wide enough  -> unbind handler from body
          if (isBond) {
            body.off("click");
            //console.log("handler unbond");
          }
          return false;
        }
      }

      if (context === document) {
        var body = $("body", context);
        var isBond = setDismissHandler(body);
        // On resize event set click handler to dismiss the mobile floating menu when clicking outside of it
        $(window, context).on("resize", function() {
          isBond = setDismissHandler(body, isBond);
        });
      }
    }
  };
})(jQuery, Drupal);