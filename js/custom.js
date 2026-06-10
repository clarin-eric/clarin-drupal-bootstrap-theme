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

      function getTime() {
        const timeNow = new Date().toLocaleTimeString("en-GB");
        return timeNow;
      }

      function getTimeZone() {
        const now = new Date();

        // Format with short timezone name
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZoneName: "short"
        });

        // Break into parts
        const parts = formatter.formatToParts(now);

        // Extract just the timezone abbreviation
        const tz = parts.find(p => p.type === "timeZoneName").value;
        return tz;
      }

      // Live clock after date range (events)
      $(
        ".node--type-event.node--view-mode-full .field--name-field-date-range",
        document
      ).after(`<p class="mt-2 text-black-50">\
          <small><i class="fa-regular fa-clock">&nbsp;</i>  Please note that times above ar displayed in your local timezone: ${getTimeZone()}. Current time in ${getTimeZone()} is: <strong id="clock">${getTime()}</strong></small>\
        </p>`);

      function updateTime() {
        const clock = document.getElementById("clock");
        if (clock) {
          clock.textContent = getTime();
        }
      }
      setInterval(updateTime, 1000);

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

      // Auto reload search on number of results change with AJAX
      function registerItemsPerPageHandler() {
        $("[id^=edit-items-per-page]", document).on("change", () => {
          $("[id^=edit-submit-k-centres-search]", document).trigger("click");
          $("[id^=edit-submit-search]", document).trigger("click");
        });
      }

      registerItemsPerPageHandler();

      $(document).on("ajaxComplete", () => {
        registerItemsPerPageHandler();
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
