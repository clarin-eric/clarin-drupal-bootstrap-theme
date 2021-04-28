/*jshint esversion: 6 */
(function($, Drupal) {

  "use strict";

  // Helper methods for the administration toolbar
  // - Reposition body and floating menu when user has admin toolbar enabled.
  Drupal.behaviors.clarin_theme_adminbar_helper = {
    attach: function(context, settings) {
      // Reposition content and floating menu
      function repositionContent(mainToolbar, collapsingNavbar, pageBody, barElem, elemHeight) {
        let toolbarTotalHeight = elemHeight;
        if (barElem.id === "toolbar-bar" ) {
          // When we receive the main toolbar height, add the trays height to it
          const activeTrays = $("div.toolbar-tray-horizontal.is-active");
          if (activeTrays.length) {
            activeTrays.each((index, elem) => { 
                toolbarTotalHeight += elem.clientHeight;
            });
          }
        } else {
          // When we receive a toolbar horizontal tray height, add to the the main toolbar height
          if (elemHeight === 0) {
            if ($("div.toolbar-tray-horizontal.is-active").length) {
              // Tray became invisible but other tray is visible -> ignore as the other tray 
              // observer will do the repositioning
              return;
            }
            // All toolbar trays are invisible -> [total height] = [main toolbar height]
            toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
          } else if (barElem.classList.contains("toolbar-tray-horizontal")) {
            // Toolbar tray is visible and horizontal -> [total height] = [tray top offset] + [tray height]
            toolbarTotalHeight = Math.floor(barElem.offsetTop) + elemHeight;
          } else {
            // Toolbar tray is visible but vertical -> [total height] = [main toolbar height]
            toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
          }
        }
        
        if (collapsingNavbar.css("position") === "fixed") {
          collapsingNavbar.css("padding-top", toolbarTotalHeight + 15 + "px");
        } else {
          collapsingNavbar.css("padding-top", "");
        }
        pageBody.css("padding-top", toolbarTotalHeight + "px");
      }

      if (context === document) {
        // Admin toolbar is active
        if (settings.toolbar) {
          const mainToolbar = $("#toolbar-bar", context);
          const collapsingNavbar = $("#CollapsingNavbar", context);
          const pageBody = $("body", context);

          // Use a resize observer on the admin toolbar and each of its trays to detect changes in height
          // Reposition the content when they happen
          $("#toolbar-bar, .toolbar-tray", context).each((index, adminBarElement) => {         
            const trayResizeObserver = new ResizeObserver(entries => {
              for (let entry of entries) {
                const currentHeight = Math.floor(entry.contentRect.height);
                console.log("Admin toolbar: #" + entry.target.id + " height changed to: " + currentHeight);
                repositionContent(mainToolbar, collapsingNavbar, pageBody, entry.target, currentHeight);
              }
            });
            trayResizeObserver.observe(adminBarElement);
          });
        }
      }
    }
  };
})(jQuery, Drupal);