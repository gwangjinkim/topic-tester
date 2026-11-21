(function () {
  "use strict";

  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign"];
    var found = {};

    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value;
        try { window.localStorage.setItem("tt_" + key, value); } catch (e) {}
      } else {
        try { found[key] = window.localStorage.getItem("tt_" + key) || ""; } catch (e) { found[key] = ""; }
      }
    });

    keys.forEach(function (key) {
      var input = document.querySelector(".utm-" + key.replace("utm_", ""));
      if (input) input.value = found[key] || "";
    });
  }

  function setupCopyButton() {
    var button = document.getElementById("copy-link");
    var status = document.getElementById("copy-status");
    if (!button || !status) return;

    button.addEventListener("click", function () {
      var base = (button.getAttribute("data-base-url") || "").replace(/\/$/, "");
      var slug = button.getAttribute("data-slug") || "";
      var url = base + "/topics/" + slug + "/?utm_source=pinterest&utm_medium=organic&utm_campaign=" + encodeURIComponent(slug);

      function done() {
        status.textContent = "Copied. Paste this link into your Pin.";
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done, function () {
          status.textContent = url;
        });
      } else {
        status.textContent = url;
      }
    });
  }

  function setupForm() {
    var form = document.getElementById("signup-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1 || action.indexOf("REPLACE") !== -1) {
        event.preventDefault();
        var note = document.createElement("p");
        note.className = "fine";
        note.textContent = "Form not connected yet. Set formEndpoint in site.json, rebuild, then redeploy.";
        form.appendChild(note);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    captureUtm();
    setupCopyButton();
    setupForm();
  });
})();
