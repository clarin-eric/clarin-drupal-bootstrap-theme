/**
 * @file
 * Global utilities.
 *
 */
(($, Drupal) => {
  Drupal.behaviors.clarin_theme_custom = {
    attach: function attach(context) {
      if (context !== document || document.readyState !== "interactive") {
        return;
      }

      // Form field label as placeholder
      $(
        ".mailchimp-signup-subscribe-form .form-type-email, .path-search .search-form .form-type-search",
        document
      ).each(() => {
        const label = $(this)
          .find("label")
          .text();
        $(this)
          .find(".form-control")
          .attr("placeholder", label);
      });

      // Header scroll down arrow function
      const scrollDownBtn = $(
        ".paragraph--type--header-large .arrow-down",
        document
      );
      if (scrollDownBtn.length > 0) {
        scrollDownBtn.click(() => {
          // scroll to the first paragraph after header image
          $(".paragraph", context)[1].scrollIntoView();
        });
      }
      // Hide tags if there are more than 2
      $(
        ".node--view-mode-teaser-list .field--name-field-tags, .node--view-mode-teaser-big .field--name-field-tags",
        document
      ).each(() => {
        if ($(this).find("li").length > 2) {
          $(this)
            .find("ul")
            .addClass("hide-more");
          $(this)
            .find("ul")
            .append('<li class="show-tags">...</li>');
        }
      });

      // Show tags when clicked on show tags button
      $(".show-tags", document).click(() => {
        $(this)
          .parent()
          .removeClass("hide-more");
      });

      // Auto select input search box
      $("#search-menu-dropdown", document).on("shown.bs.dropdown", () => {
        $("#edit-keys-dropdown", document)
          .focus()
          .select();
      });

      // Auto expand secondary menu active item
      const activeDropdownTgg = $(
        ".sidebar_second .navbar .menu-item--expanded .dropdown-toggle.is-active",
        document
      );
      const body = $("body", document);

      if (activeDropdownTgg.length) {
        body.addClass("position-fixed");
        bootstrap.Dropdown.getOrCreateInstance(activeDropdownTgg).show();
        activeDropdownTgg.blur();
        body.removeClass("position-fixed");
      }
    }
  };
})(jQuery, Drupal);
