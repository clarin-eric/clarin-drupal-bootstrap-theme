(function($, Drupal) {

  'use strict';

  // For mobile view sizes:
  // - Reposition body and floating menu when user has admin toolbar enabled.
  // - Add click handler to dismiss the floating menu when clicking outside of it
  Drupal.behaviors.clarin_theme_mobile_toolbar = {
    attach: function(context, settings) {
      if (context === document) {
        // On load and resize event add click handler to dismiss the floating menu when clicking outside of it.
        $(window, context).on("load resize", function() {
          var collapsingNavbar = $('div#CollapsingNavbar', context);
          var mainwrapper = $('div#main-wrapper', context);
          if(collapsingNavbar.css("position") === "fixed") {
            // Close menu when clicking outside
            mainwrapper.unbind("click");

            mainwrapper.bind("click",function() {
              if (collapsingNavbar.css('display') !== 'none')
                $('header button.navbar-toggler', context).trigger('click');
            });
          
          } else {
              mainwrapper.unbind("click");
          }
        });

        // On resize event reposition body and floating menu when admin toolbar is visible
        if (settings.toolbar) {
          $(window, context).on("resize", function() {
            var toolbarHeight = $('nav#toolbar-bar', context).height();
            var collapsingNavbar = $('div#CollapsingNavbar', context);
            var activeTrays = $('div.toolbar-tray-horizontal.is-active', context);
            if (activeTrays.length) {
              toolbarHeight += activeTrays.height();
            }
            if (collapsingNavbar.css("position") === "fixed") {
              collapsingNavbar.css('padding-top', (toolbarHeight + 25) + 'px');
            } else {
              collapsingNavbar.css('padding-top', '');
            }
            $('body', context).css('padding-top', toolbarHeight + 'px');
          });

          // Use a mutation observer to detect visual changes in the adminbar trays and trigger resize events when they happen
          $('.toolbar-tray', context).each(function (index, trayElement) {
            var observer = new MutationObserver( function(mutations, obs){
              mutations.forEach(function(mutation) {
                if (mutation.target.className.includes("toolbar-tray")){
                  var currentValue = mutation.target.className;
                  if (currentValue.includes('is-active') !== this.previousValue.includes('is-active')) {
                    console.log("Horizontal tray visibility changed!");
                    $(window, context).trigger('resize');
                    this.previousValue = mutation.target.className;
                  }
                }
              }, obs);
            });

            observer.previousValue = trayElement.className;
            observer.observe(trayElement, { 
              attributes: true,
              attributeFilter: ['class']
            });
          });
        }
      }
    }
  }
})(jQuery, Drupal);