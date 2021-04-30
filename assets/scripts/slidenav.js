(function($, Drupal) {

  "use strict";

  // CLARIN slidenav helper methods for the top navbar menu
  // - Add click handler to dismiss (slide out) the mobile floating menu when clicking outside of it
  Drupal.behaviors.clarin_theme_slidenav = {
    attach: function(context, settings) {
      function setDismissHandler(body, isAttached) {
        var collapsingNavbar = $("div#CollapsingNavbar", body);
        //console.log(collapsingNavbar.css("position"));
        if(collapsingNavbar.css("position") === "fixed") {
          // When the viewport is narrow enough #collapsingNavbar becomes "fixed" -> attach handler to body
          if (!isAttached) {
            body.on("click",function(event) {
              if (!event.target.classList.contains("navbar-toggler") && //avoid event recursion since the toggler is part of body
                  !collapsingNavbar[0].contains(event.target) &&  // do not close menu if clicking on it
                  collapsingNavbar.css("display") !== "none") {  // is closed
                //send click event to toggler
                $("header button.navbar-toggler", context).trigger("click");
              }
            });
            //console.log("handler attached");
          }
          return true;
        } else {
          // When the viewport is wide enough  -> detach handler from body
          if (isAttached) {
            body.off("click");
            //console.log("handler dettached");
          }
          return false;
        }
      }

      if (context === document) {
        var body = $("body", context);
        var isAttached = setDismissHandler(body);
        // On resize event set click handler to dismiss the mobile floating menu when clicking outside of it
        $(window, context).on("resize", function() {
          isAttached = setDismissHandler(body, isAttached);
        });
      }
    }
  };
})(jQuery, Drupal);