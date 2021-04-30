(function($, Drupal) {

  "use strict";

  // CLARIN slidenav helper methods for the top navbar menu
  // - Add click handler to dismiss (slide out) the mobile floating menu when clicking outside of it
  Drupal.behaviors.clarin_theme_slidenav = {
    attach: function(context, settings) {
      function setDismissHandler(body, collapsingNavbar, isAttached) {
        //console.log(collapsingNavbar.css("position"));
        if(collapsingNavbar.css("position") === "fixed") {
          // When the viewport is narrow enough #collapsingNavbar becomes "fixed" -> attach handler to body
          if (!isAttached) {
            body.on("click",function(event) {
              if (!collapsingNavbar[0].contains(event.target) &&  // do not close menu if clicking on it
                  collapsingNavbar.css("display") !== "none") {  // is closed
                //collapse navbar
                collapsingNavbar.collapse("hide");
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
        var collapsingNavbar = $("#CollapsingNavbar", body);
        var isAttached = setDismissHandler(body, collapsingNavbar);
        // On resize event set click handler to dismiss the mobile floating menu when clicking outside of it
        $(window, context).on("resize", function() {
          isAttached = setDismissHandler(body, collapsingNavbar, isAttached);
        });
      }
    }
  };
})(jQuery, Drupal);