(function () {
  "use strict";

  var storageKey = "duckbot-theme";
  var root = document.documentElement;
  var savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    console.warn("Unable to read the saved theme.", error);
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }

  function getActiveTheme() {
    if (root.dataset.theme === "light" || root.dataset.theme === "dark") {
      return root.dataset.theme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function saveTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn("Unable to save the selected theme.", error);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var navigationLinks = document.querySelector(".site-nav__links");
    if (!navigationLinks) {
      return;
    }

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";

    function updateToggle() {
      var activeTheme = getActiveTheme();
      var targetTheme = activeTheme === "dark" ? "light" : "dark";
      toggle.textContent = targetTheme === "dark" ? "Dark mode" : "Light mode";
      toggle.setAttribute("aria-label", "Switch to " + targetTheme + " mode");
      toggle.setAttribute("aria-pressed", activeTheme === "dark" ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      saveTheme(getActiveTheme() === "dark" ? "light" : "dark");
      updateToggle();
    });

    navigationLinks.appendChild(toggle);
    updateToggle();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (!root.dataset.theme) {
        updateToggle();
      }
    });
  });
})();
