(function($, Drupal) {
  // Helper methods for the administration toolbar
  // - Reposition body and floating menu when user has admin toolbar enabled.
  Drupal.behaviors.clarin_theme_adminbar_helper = {
    attach: function attach(context, settings) {
      let timer = null;
      let prevEffectiveStickyTop = 0;

      function repositionContent(mainToolbar, header, body, toc, toolbarElem) {
        let toolbarTotalHeight = toolbarElem.clientHeight;

        // We will try to avoid calls to mainToolbar.outerHeight(true) as toolbarElem might already contain
        //   all the necessary height information to reposition the content

        // - When we receive the main toolbar height -> add the trays height to it
        // - When we receive a toolbar tray height -> add the main toolbar height to it
        if (toolbarElem.id === "toolbar-bar") {
          const activeTrays = $("div.toolbar-tray-horizontal.is-active", body);
          if (activeTrays.length) {
            activeTrays.each((index, elem) => {
              toolbarTotalHeight += elem.clientHeight;
            });
          }
        } else if (toolbarElem.clientHeight === 0) {
          // Tray became invisible:
          if ($("div.toolbar-tray-horizontal.is-active", body).length) {
            // Other tray is now visible (tray switch) -> ignore as the other
            // tray observer will do the repositioning
            return;
          }
          // All toolbar trays are invisible -> [total height] = [main toolbar height]
          toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
        } else if (toolbarElem.classList.contains("toolbar-tray-horizontal")) {
          // Toolbar tray is visible and horizontal -> [total height] = [tray top offset] + [tray height]
          toolbarTotalHeight = Math.floor(
            toolbarElem.offsetTop + toolbarElem.clientHeight
          );
        } else {
          // Toolbar tray is visible but vertical -> [total height] = [main toolbar height]
          toolbarTotalHeight = Math.floor(mainToolbar.outerHeight(true));
        }

        // When the toolbar position is "fixed", the sticky menu "top" also needs to be repositioned.
        //   We do it in the next frame (via requestAnimationFrame()) since when this handler runs, the
        //   admin toolbar has not yet updated the classes of the body

        // Check difference between default "top" in the previous state (prevEffectiveStickyTop) and current observed "top"
        //  - > apply the same offset
        const headerHeight = Math.floor(header.outerHeight(true));
        const headerFixedStickyTop = toolbarTotalHeight - headerHeight; // the `top` property of the sticky header when the admin toolbar is fixed
        const headerObservedStickyTop = Math.floor(
          parseFloat(header.css("top"))
        );
        const topOffset = Math.abs(
          headerObservedStickyTop - prevEffectiveStickyTop
        );

        window.cancelAnimationFrame(timer);
        timer = window.requestAnimationFrame(() => {
          // The original core/modules/toolbar/js/views/ToolbarVisualView.js tries to position the body
          //   taking into account the admin toolbar height. This does not work for certain window widths
          //   when the flex container of the same bar (or tray) expands to two lines.
          // - > Reset the padding-top set by core/modules/toolbar/js/views/ToolbarVisualView.js and
          //   reposition content ourselves

          // Reposition body
          body.css("padding-top", `${toolbarTotalHeight}px`);
          if (toc) toc.css("top", `${toolbarTotalHeight + 10}px`);

          if (header.css("position") === "sticky") {
            if (body.hasClass("toolbar-fixed")) {
              // Tablet screen widths (480px < width < 1200px) the admin toolbar becomes `position: fixed`
              // shift our menu header down by the toolbar height
              const top = headerFixedStickyTop + topOffset;
              header.css("top", `${top}px`);
              prevEffectiveStickyTop = headerFixedStickyTop;
            } else {
              // Phone screen widths (width < 480px) the admin toolbar becomes `position: absolute`
              const top = topOffset - headerHeight;
              header.css("top", `${top}px`);
              prevEffectiveStickyTop = 0 - headerHeight;
            }
          } else {
            // Reset when menu is not in use anymore
            header.css("top", "");
            prevEffectiveStickyTop = 0;
          }
        });
      }

      if (context === document) {
        if (settings.toolbar) {
          // Admin toolbar is active:
          const body = $("body", context);
          const mainToolbar = $("#toolbar-bar", body);
          const header = $("#header", body);
          const toc = $("#toc", body);

          // Use a resize observer on the admin toolbar and each of its trays to detect changes in height
          // Reposition the content when they happen
          $("#toolbar-bar, .toolbar-tray", body).each(
            (index, adminBarElement) => {
              const trayResizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                  repositionContent(
                    mainToolbar,
                    header,
                    body,
                    toc,
                    entry.target
                  );
                });
              });
              trayResizeObserver.observe(adminBarElement);
            }
          );
        }
      }
    }
  };
})(jQuery, Drupal);
