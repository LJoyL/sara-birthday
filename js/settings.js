/* Reads tuning values out of js/config.js, falling back to each
   mini-game's built-in defaults when a line has been removed. */
(function () {
  var cfg = window.GAME_CONFIG || {};

  var OPTION_DEFAULTS = {
    soundOn: true,
    petals: true,
    showResetButton: true,
    requireAllGamesBeforeGifts: true,
    startingBells: 0,
    spots: ["bugs", "orchard", "fishing", "dig", "rain", "memory", "concert"],
  };

  function merge(defaults, overrides) {
    var out = {};
    var key;
    for (key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key))
        out[key] = defaults[key];
    }
    if (!overrides) return out;
    for (key in overrides) {
      if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
      var value = overrides[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value) && !value.length) continue; // an empty list is a mistake, not a choice
      out[key] = value;
    }
    return out;
  }

  window.Settings = {
    /** Settings for one mini-game: config values on top of its defaults. */
    forGame: function (id, defaults) {
      return merge(defaults, (cfg.games || {})[id]);
    },

    /** A general option from config.options. */
    option: function (key) {
      var options = cfg.options || {};
      var value = options[key];
      if (value === undefined || value === null) return OPTION_DEFAULTS[key];
      if (Array.isArray(value) && !value.length) return OPTION_DEFAULTS[key];
      return value;
    },
  };
})();
