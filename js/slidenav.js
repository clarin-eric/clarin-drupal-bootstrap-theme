(function($, Drupal) {
  // CLARIN slidenav helper methods for the top navbar menu. The slidenav is only used on screens narrower
  // than 1200px and when activated in the theme options.
  // - When the window width is narrower than 1200px, add a click handler to dismiss (slide out) the mobile floating
  //     menu when clicking outside of it.
  // - Remove the handler if the window becomes wider.
  Drupal.behaviors.clarin_theme_slidenav = {
    attach: function attach(context) {
      let handlersAttached;
      let headerHeight;
      let lastScrollPosition;
      let body;
      let header;
      let toc;
      let collapsingNavbar;
      let adminBar;

      function handleClickOut(event) {
        if (
          !header.contains(event.target) && // do not close menu if clicking on it
          (adminBar == null ? true : !adminBar.contains(event.target)) && // do not close menu if clicking on adminBar
          collapsingNavbar.css("display") !== "none" // is closed
        ) {
          // close menu
          collapsingNavbar.collapse("hide");
        }
      }

      function handleScroll() {
        headerHeight = parseFloat(window.getComputedStyle(header).height);
        const pageScrollPosition =
          window.pageYOffset || document.documentElement.scrollTop;
        const adminBarHeight = parseFloat(body.style.paddingTop) || 0;
        const fixedAdminBarHeight =
          body.style.paddingTop && body.classList.contains("toolbar-fixed")
            ? adminBarHeight
            : 0;
        const defaultStickyTop = fixedAdminBarHeight - headerHeight;
        const observedStickyTop = header.style.top
          ? parseFloat(header.style.top)
          : 0;
        const relativeDelta =
          lastScrollPosition - pageScrollPosition + observedStickyTop;

        if (
          relativeDelta > defaultStickyTop &&
          relativeDelta < fixedAdminBarHeight
        ) {
          // in betwen stage
          header.style.top = `${relativeDelta}px`;
          if (toc)
            toc.style.top = `${relativeDelta + headerHeight + 10}px`

          if (
            pageScrollPosition >
            (fixedAdminBarHeight === 0
              ? headerHeight + adminBarHeight
              : headerHeight)
          ) {
            header.classList.add("shadow-header");
          }
        } else if (relativeDelta < defaultStickyTop) {
          // fully disappears
          header.style.top = `${defaultStickyTop}px`;
          if (toc)
            toc.style.top = `${defaultStickyTop + headerHeight + 10}px`;
          header.classList.remove("shadow-header");
        } else if (relativeDelta > fixedAdminBarHeight) {
          // fully appears
          header.style.top = `${fixedAdminBarHeight}px`;
          if (toc)
            toc.style.top = `${fixedAdminBarHeight + headerHeight + 10}px`;

          if (
            pageScrollPosition <=
            (fixedAdminBarHeight === 0 ? adminBarHeight : 0)
          ) {
            header.classList.remove("shadow-header");
          }
        }
        lastScrollPosition = pageScrollPosition;
      }

      function setHandlers(attached) {
        body = document.body;
        adminBar = document.getElementById("toolbar-administration");
        header = document.getElementById("header");
        toc = document.getElementById("toc");
        collapsingNavbar = $("#CollapsingNavbar", body);
        lastScrollPosition =
          window.pageYOffset || document.documentElement.scrollTop;
        window.setTimeout(() => {
          headerHeight = parseFloat(window.getComputedStyle(header).height); /// Track page scroll with extra XYpx "delay"
        });

        if (collapsingNavbar.css("position") === "absolute") {
          // When the viewport is narrow enough #collapsingNavbar becomes "fixed" -> attach handler to body
          if (!attached) {
            // Add listeners
            body.addEventListener("click", handleClickOut, true);
            window.addEventListener("scroll", handleScroll, true);
            // console.log("handlers attached");
          }
          return true;
        }
        // When the viewport is wide enough  -> detach handler from body
        if (attached) {
          // Remove listeners
          body.removeEventListener("click", handleClickOut, true);
          window.removeEventListener("scroll", handleScroll, true);
          // console.log("handlers dettached");
        }
        return false;
      }

      if (context === document) {
        handlersAttached = setHandlers();

        // On resize event set click handler to dismiss the mobile floating menu
        $(window, context).on("resize", function handleResize() {
          handlersAttached = setHandlers(handlersAttached);
        });
      }
    }
  };
})(jQuery, Drupal);
