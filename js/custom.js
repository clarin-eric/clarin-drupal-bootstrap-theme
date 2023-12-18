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
      $(".paragraph--type--header-large .arrow-down", document).click(() => {
        $("html", context)
          .stop()
          .animate({ scrollTop: "+=660px" }, 800);
      });

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
      $("#searchMenuDropdown", document).on("shown.bs.dropdown", () => {
        $("#edit-keys-dropdown", $(this))
          .focus()
          .select();
      });
    }
  };
})(jQuery, Drupal);
