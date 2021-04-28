(function($, Drupal) {

  "use strict";

  // Helper methods for the administration toolbar
  // - Reposition body and floating menu when user has admin toolbar enabled.
  Drupal.behaviors.clarin_theme_adminbar_helper = {
    attach: function(context, settings) {
      // Reposition content and floating menu
      function repositionContent(mainToolbar, collapsingNavbar, pageBody, toolbarElem) {
        let toolbarTotalHeight = toolbarElem.clientHeight;
        const toolbarElemHeight = Math.floor(toolbarTotalHeight);

        // We will try to avoid calls to mainToolbar.outerHeight(true) as toolbarElem might already contain
        // all the necessary height information to reposition the content
        if (toolbarElem.id === "toolbar-bar" ) {
          // When we receive the main toolbar height -> add the trays height to it:
          const activeTrays = $("div.toolbar-tray-horizontal.is-active");
          if (activeTrays.length) {
            activeTrays.each((index, elem) => { 
              toolbarTotalHeight += elem.clientHeight;
            });
          }
        } else {
          // When we receive a toolbar tray height -> add the main toolbar height to it
          if (toolbarElemHeight === 0) {
            // Tray became invisible:
            if ($("div.toolbar-tray-horizontal.is-active").length) {
              // Other tray is now visible (tray switch) -> ignore as the other 
              // tray observer will do the repositioning
              return;
            }
            // All toolbar trays are invisible -> [total height] = [main toolbar height]
            toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
          } else if (toolbarElem.classList.contains("toolbar-tray-horizontal")) {
            // Toolbar tray is visible and horizontal -> [total height] = [tray top offset] + [tray height]
            toolbarTotalHeight = Math.floor(toolbarElem.offsetTop) + toolbarElemHeight;
          } else {
            // Toolbar tray is visible but vertical -> [total height] = [main toolbar height]
            toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
          }
        }
        
        // Reposition content
        if (collapsingNavbar.css("position") === "fixed") {
          collapsingNavbar.css("padding-top", toolbarTotalHeight + 15 + "px");
        } else {
          collapsingNavbar.css("padding-top", "");
        }
        pageBody.css("padding-top", toolbarTotalHeight + "px");
      }

      if (context === document) {
        if (settings.toolbar) {
          // Admin toolbar is active:
          const mainToolbar = $("#toolbar-bar", context);
          const collapsingNavbar = $("#CollapsingNavbar", context);
          const pageBody = $("body", context);

          // Use a resize observer on the admin toolbar and each of its trays to detect changes in height
          // Reposition the content when they happen
          $("#toolbar-bar, .toolbar-tray", context).each((index, adminBarElement) => {         
            const trayResizeObserver = new ResizeObserver(entries => {
              for (let entry of entries) {
                console.log("Admin toolbar: #" + entry.target.id + " height changed to: " + entry.target.clientHeight);
                repositionContent(mainToolbar, collapsingNavbar, pageBody, entry.target);
              }
            });
            trayResizeObserver.observe(adminBarElement);
          });
        }
      }
    }
  };
})(jQuery, Drupal);