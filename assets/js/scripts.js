jQuery(function($) {
  /* ============================================================ */
  /* Responsive Videos */
  /* ============================================================ */

  $(".post-content").fitVids();

  /* ============================================================ */
  /* Scroll To Top */
  /* ============================================================ */

  $(".js-jump-top").on("click", function(e) {
    e.preventDefault();

    $("html, body").animate({ scrollTop: 0 });
  });

  /* ============================================================ */
  /* Ajax Loading */
  /* ============================================================ */

  var History = window.History;
  var loading = false;
  var $ajaxContainer = $("#ajax-container");
  var $latestPost = $("#latest-post");

  // Check if history is enabled for the browser
  if (!History.enabled) {
    return false;
  }

  History.Adapter.bind(window, "statechange", function() {
    var State = History.getState();

    // Get the requested url and replace the current content
    // with the loaded content
    $.get(State.url, function(result) {
      var $html = $(result);
      // replace content with shortcodes before inserting into dom
      shortcodes($("#ajax-container", $html));
      var $newContent = $("#ajax-container", $html).contents();

      // Set the title to the requested urls document title
      document.title = $html.filter("title").text();

      $("html, body").animate({ scrollTop: 0 });

      $ajaxContainer.fadeOut(500, function() {
        $latestPost = $newContent.filter("#latest-post");

        // Re run fitvid.js
        $newContent.fitVids();

        $ajaxContainer.html($newContent);
        $ajaxContainer.fadeIn(500);

        NProgress.done();

        loading = false;
      });
    }).fail(function() {
      // Request fail
      NProgress.done();
      location.reload();
    });
  });

  $("body").on(
    "click",
    ".js-ajax-link, .pagination a, .post-tags a, .post-header a",
    function(e) {
      e.preventDefault();

      // clear search
      $("#search-field").val("");

      if (loading === false) {
        var currentState = History.getState();
        var url = $(this).attr("href");
        var title = $(this).attr("title") || null;

        //if url starts with http:// and currentState.url starts with
        // https://, replace the protocol in url
        if (url.indexOf("http://", 0) === 0) {
          var urlNoProt = url.replace(/.*?:\/\//g, "");
          var curProt = currentState.url.split("/")[0];
          url = curProt + "//" + urlNoProt;
        }

        // If the requested url is not the current states url push
        // the new state and make the ajax call.
        if (url !== currentState.url) {
          loading = true;
          NProgress.start();
          History.pushState({}, title, url);
        } else {
          $("html, body").animate({ scrollTop: 0 });

          NProgress.start();

          $("#results").fadeOut(300, function() {
            $(".main").fadeIn(300);
          });

          NProgress.done();
        }
      }
    }
  );

  // ghosthunter stuff
  $("#results").hide();
  $("#search-field").ghostHunter({
    includebodysearch: true,
    info_template: "<p class='gh-info'>posts found: {{amount}}</p>",
    onKeyUp: true,
    onComplete: function() {
      if ($("#search-field").prop("value")) {
        $("html, body").animate({ scrollTop: 0 });
        NProgress.start();
        $(".main").fadeOut(300, function() {
          $("#results").fadeIn(300);
        });
        NProgress.done();
      } else {
        $("html, body").animate({ scrollTop: 0 });
        NProgress.start();
        $("#results").fadeOut(300, function() {
          $(".main").fadeIn(300);
        });
        NProgress.done();
      }
    },
    results: "#results",
    result_template:
      "<li class='post-stub gh-search-item' id='gh-{{ref}}'><a class='js-ajax-link' title='{{title}}' href='{{link}}'><h4 class='post-stub-title'>{{title}}</h4>&nbsp;<time class='post-stub-date'>Published {{pubDate}}</time></a></li>"
  });

  // add shortcodes here
  var aliases = {
    //wf
    wagner: "fire_dragon",

    //dl
    dj: "dragonyule_jeanne",
    jeannedarc: "jeanned_arc",
    jeanne: "jeanned_arc",
    psiren: "pop_star_siren",
    sakuya: "konohana_sakuya"
  };

  // cdn prefix
  var cdn = "https://notte.is.seriously.moe/";

  function nicknames(name) {
    if (name.startsWith("g_")) {
      return name.replace("g_", "gala_");
    }
    if (name.startsWith("d_")) {
      return name.replace("d_", "dragonyule_");
    }
    if (name.startsWith("h_")) {
      return name.replace("h_", "halloween_");
    }
    if (name.startsWith("v_")) {
      return name.replace("v_", "valentines_");
    }
    return aliases[name] ? aliases[name] : name;
  }

  function shortcodes(hook) {
    hook.shortcode({
      wf: function() {
        return this.options.special
          ? "<img src='" +
              cdn +
              "img/pixelart_special/" +
              nicknames(this.options.special) +
              ".gif'>"
          : "<img class='wf-px-smol' src='" +
              cdn +
              "img/pixelart_front/" +
              nicknames(this.options.name) +
              ".gif'>";
      },
      dl: function() {
        // this is garbage lol
        if (this.options.adv) {
          return (
            "<img class='dl-px-smol' src='" +
            cdn +
            "img/a/" +
            nicknames(this.options.adv) +
            ".png'>"
          );
        }
        if (this.options.d) {
          return (
            "<img class='dl-px-smol' src='" +
            cdn +
            "img/d/" +
            nicknames(this.options.d) +
            ".png'>"
          );
        }
        if (this.options.wp) {
          return (
            "<img class='dl-px-smol' src='" +
            cdn +
            "img/wp/" +
            nicknames(this.options.wp) +
            ".png'>"
          );
        }
        if (this.options.w) {
          return (
            "<img class='dl-px-smol' src='" +
            cdn +
            "img/w/" +
            nicknames(this.options.w) +
            ".png'>"
          );
        }
        if (this.options.e) {
          return (
            "<img class='dl-px-smol' src='" +
            cdn +
            "img/e/" +
            nicknames(this.options.e) +
            ".png'>"
          );
        }
      }
    });
  }

  // shortcode on page load
  shortcodes($ajaxContainer);

  // form handler
  $("#thanks").hide();
  $("#contact-submit").on("click", function() {
    var url = new URL(window.location.href);
    var title = url ? url.pathname.replace(/\//g, "") : undefined;
    var name = document.getElementById("contact-name").value;
    var msg = document.getElementById("contact-msg").value;
    var ret = document.getElementById("contact-response").value;

    NProgress.start();

    // HOOK_URL provided by discord and should be in the Code Injection tab
    // const HOOK_URL = "discord_hook_url"
    fetch(HOOK_URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        embeds: [
          {
            title: title ? title : "notte.moe",
            fields: [
              {
                name: "name",
                value: name ? name : "anonymous"
              },
              {
                name: "message",
                value: msg
              }
            ],
            footer: {
              text: ret ? "from: " + ret : "no return details provided"
            }
          }
        ]
      })
    });

    $("#contact-form").fadeOut(300, function() {
      $("#thanks").fadeIn(300);
    });

    NProgress.done();
  });
});
