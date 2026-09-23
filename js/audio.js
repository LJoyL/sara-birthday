/* Tiny WebAudio sound box - no audio files needed. */
(function () {
  var ctx = null;
  var muted = false;

  function ensure() {
    if (muted) return null;
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime + start;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function slide(from, to, dur, type, gain) {
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(gain || 0.16, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, gain) {
    var c = ensure();
    if (!c) return;
    var frames = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, frames, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    var src = c.createBufferSource();
    var g = c.createGain();
    var filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    g.gain.value = gain || 0.14;
    src.buffer = buf;
    src.connect(filter).connect(g).connect(c.destination);
    src.start();
  }

  var sounds = {
    pop: function () {
      tone(660, 0, 0.09, "triangle", 0.16);
    },
    tap: function () {
      tone(420, 0, 0.06, "square", 0.07);
    },
    blip: function () {
      tone(880, 0, 0.05, "sine", 0.05);
    },
    catch: function () {
      tone(740, 0, 0.09, "triangle", 0.16);
      tone(988, 0.07, 0.12, "triangle", 0.14);
    },
    miss: function () {
      slide(300, 120, 0.25, "sawtooth", 0.1);
    },
    splash: function () {
      noise(0.35, 0.12);
    },
    bite: function () {
      tone(1200, 0, 0.07, "square", 0.12);
      tone(1200, 0.12, 0.07, "square", 0.12);
    },
    reel: function () {
      slide(200, 900, 0.4, "triangle", 0.12);
    },
    match: function () {
      tone(659, 0, 0.1, "sine", 0.14);
      tone(880, 0.09, 0.16, "sine", 0.13);
    },
    hurt: function () {
      slide(400, 90, 0.3, "square", 0.12);
    },
    coin: function () {
      tone(988, 0, 0.07, "square", 0.1);
      tone(1319, 0.06, 0.12, "square", 0.09);
    },
    win: function () {
      [523, 659, 784, 1047].forEach(function (f, i) {
        tone(f, i * 0.11, 0.3, "triangle", 0.15);
      });
    },
    lose: function () {
      [440, 392, 330].forEach(function (f, i) {
        tone(f, i * 0.13, 0.3, "triangle", 0.12);
      });
    },
    gift: function () {
      [523, 587, 659, 784, 880, 1047].forEach(function (f, i) {
        tone(f, i * 0.09, 0.35, "sine", 0.14);
      });
    },
    firework: function () {
      noise(0.5, 0.1);
      tone(180, 0, 0.3, "sine", 0.1);
    },
    dig: function () {
      noise(0.22, 0.1);
      tone(150, 0, 0.12, "sine", 0.1);
    },
    tick: function () {
      tone(1100, 0, 0.03, "square", 0.03);
    },
    thud: function () {
      tone(120, 0, 0.14, "sine", 0.12);
    },
  };

  /* ---------- background music ------------------------------------------- */

  // Quiet original loops. A config track plays its file instead when src is set.
  function m(step, freq, dur, type, gain) {
    return {
      step: step,
      freq: freq,
      dur: dur,
      type: type || "sine",
      gain: gain == null ? 0.04 : gain,
    };
  }

  var BUILTINS = {
    island: {
      bpm: 86,
      steps: 16,
      notes: [
        m(0, 130.81, 1.3, "sine", 0.05),
        m(8, 196.0, 1.3, "sine", 0.04),
        m(0, 329.63, 0.4, "triangle", 0.04),
        m(3, 392.0, 0.34, "triangle", 0.035),
        m(6, 440.0, 0.4, "triangle", 0.04),
        m(10, 392.0, 0.34, "triangle", 0.035),
        m(12, 523.25, 0.5, "sine", 0.032),
        m(14, 329.63, 0.4, "triangle", 0.035),
      ],
    },
    meadow: {
      bpm: 116,
      steps: 16,
      notes: [
        m(0, 196.0, 0.45, "sine", 0.04),
        m(4, 164.81, 0.45, "sine", 0.035),
        m(8, 220.0, 0.45, "sine", 0.04),
        m(12, 174.61, 0.45, "sine", 0.035),
        m(0, 523.25, 0.18, "triangle", 0.04),
        m(2, 587.33, 0.18, "triangle", 0.035),
        m(4, 659.25, 0.22, "triangle", 0.04),
        m(7, 523.25, 0.18, "triangle", 0.03),
        m(8, 587.33, 0.18, "triangle", 0.04),
        m(10, 493.88, 0.18, "triangle", 0.03),
        m(12, 659.25, 0.28, "sine", 0.04),
        m(14, 523.25, 0.22, "triangle", 0.03),
      ],
    },
    garden: {
      bpm: 96,
      steps: 16,
      notes: [
        m(0, 164.81, 1.1, "sine", 0.045),
        m(8, 146.83, 1.1, "sine", 0.04),
        m(0, 415.3, 0.5, "triangle", 0.035),
        m(4, 493.88, 0.4, "triangle", 0.032),
        m(8, 440.0, 0.5, "triangle", 0.035),
        m(12, 369.99, 0.55, "sine", 0.034),
        m(14, 493.88, 0.35, "triangle", 0.03),
      ],
    },
    river: {
      bpm: 72,
      steps: 16,
      notes: [
        m(0, 130.81, 1.6, "sine", 0.04),
        m(8, 174.61, 1.6, "sine", 0.035),
        m(0, 392.0, 0.7, "sine", 0.03),
        m(6, 349.23, 0.6, "sine", 0.028),
        m(10, 329.63, 0.8, "triangle", 0.03),
        m(14, 392.0, 0.5, "sine", 0.026),
      ],
    },
    dig: {
      bpm: 74,
      steps: 16,
      notes: [
        m(0, 110.0, 1.4, "sine", 0.05),
        m(8, 130.81, 1.4, "sine", 0.045),
        m(2, 220.0, 0.4, "triangle", 0.03),
        m(6, 261.63, 0.35, "triangle", 0.028),
        m(10, 196.0, 0.5, "sine", 0.032),
        m(14, 246.94, 0.4, "triangle", 0.028),
      ],
    },
    rain: {
      bpm: 80,
      steps: 16,
      notes: [
        m(0, 220.0, 1.4, "sine", 0.035),
        m(0, 329.63, 1.4, "sine", 0.025),
        m(8, 196.0, 1.4, "sine", 0.035),
        m(8, 293.66, 1.4, "sine", 0.024),
        m(4, 440.0, 0.3, "triangle", 0.03),
        m(12, 392.0, 0.35, "triangle", 0.028),
      ],
    },
    cafe: {
      bpm: 104,
      steps: 16,
      notes: [
        m(0, 523.25, 0.16, "sine", 0.04),
        m(2, 659.25, 0.16, "sine", 0.035),
        m(4, 587.33, 0.16, "sine", 0.035),
        m(6, 523.25, 0.2, "sine", 0.032),
        m(8, 440.0, 0.16, "sine", 0.035),
        m(10, 523.25, 0.16, "sine", 0.035),
        m(12, 659.25, 0.22, "sine", 0.04),
        m(14, 587.33, 0.2, "sine", 0.03),
        m(0, 261.63, 0.9, "triangle", 0.03),
        m(8, 196.0, 0.9, "triangle", 0.028),
      ],
    },
    // A soft pad, so the concert's own notes stay in front.
    concert: {
      bpm: 54,
      steps: 8,
      notes: [
        m(0, 196.0, 3.4, "sine", 0.028),
        m(0, 246.94, 3.4, "sine", 0.02),
        m(0, 293.66, 3.4, "triangle", 0.016),
        m(4, 174.61, 3.4, "sine", 0.024),
        m(4, 261.63, 3.4, "sine", 0.016),
      ],
    },
    reward: {
      bpm: 124,
      steps: 8,
      notes: [
        m(0, 130.81, 0.9, "sine", 0.045),
        m(0, 523.25, 0.18, "triangle", 0.045),
        m(1, 659.25, 0.18, "triangle", 0.04),
        m(2, 783.99, 0.22, "triangle", 0.045),
        m(3, 1046.5, 0.28, "sine", 0.04),
        m(4, 783.99, 0.18, "triangle", 0.035),
        m(6, 880.0, 0.3, "sine", 0.04),
      ],
    },
  };

  var TRACK_NAMES = {
    island: "Island Morning",
    meadow: "Meadow Skip",
    garden: "Herb Garden",
    river: "Quiet River",
    dig: "Buried Coins",
    rain: "Rain on the Roof",
    cafe: "Café Music Box",
    concert: "Soft Encore",
    reward: "You Did It",
  };

  var SCENE_DEFAULTS = {
    main: "island",
    reward: "reward",
    bugs: "meadow",
    orchard: "garden",
    fishing: "river",
    dig: "dig",
    rain: "rain",
    memory: "cafe",
    concert: "concert",
  };

  var musicGain = null;
  var desiredScene = "main";
  var desiredTrack = "";
  var activeTrack = "";
  var switchToken = 0;
  var musicTimer = null;
  var musicStep = 0;
  var musicNext = 0;
  var musicLive = [];
  var musicFile = null;

  function musicConfig() {
    return (window.GAME_CONFIG && window.GAME_CONFIG.music) || {};
  }

  function musicVolume() {
    var value = musicConfig().volume;
    if (value === undefined || value === null || value === "") return 0.75;
    var n = Number(value);
    if (isNaN(n)) return 0.75;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  function resolveTrack(scene) {
    var music = musicConfig();
    var value;
    if (scene === "main" || scene === "reward") value = music[scene];
    else if (music.games) value = music.games[scene];
    if (value === undefined || value === null)
      return SCENE_DEFAULTS[scene] || "";
    return value;
  }

  function trackFile(id) {
    var tracks = musicConfig().tracks || {};
    var entry = tracks[id];
    if (entry && entry.src) return entry.src;
    return "";
  }

  function trackLabel(id) {
    if (!id) return "";
    var tracks = musicConfig().tracks || {};
    if (tracks[id] && tracks[id].name) return tracks[id].name;
    return TRACK_NAMES[id] || id;
  }

  function ensureGraph() {
    var c = ensure();
    if (!c) return null;
    if (!musicGain) {
      musicGain = c.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(c.destination);
    }
    return c;
  }

  function fadeGain(to, dur) {
    var c = ensureGraph();
    if (!c || !musicGain) return;
    var now = c.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(to, now + dur);
  }

  function stopSources() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    musicLive.forEach(function (osc) {
      try {
        osc.stop();
      } catch (e) {
        /* already stopped */
      }
    });
    musicLive = [];
    if (musicFile) {
      musicFile.pause();
      musicFile.removeAttribute("src");
      musicFile.load();
      musicFile = null;
    }
    activeTrack = "";
  }

  function playAt(note, when) {
    var c = ensureGraph();
    if (!c || !musicGain) return;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = note.type;
    osc.frequency.setValueAtTime(note.freq, when);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, note.gain),
      when + 0.02,
    );
    g.gain.exponentialRampToValueAtTime(0.0001, when + note.dur);
    osc.connect(g).connect(musicGain);
    osc.start(when);
    osc.stop(when + note.dur + 0.03);
    musicLive.push(osc);
    osc.onended = function () {
      var i = musicLive.indexOf(osc);
      if (i >= 0) musicLive.splice(i, 1);
    };
  }

  function startBuiltin(id) {
    var pattern = BUILTINS[id];
    var c = ensureGraph();
    if (!pattern || !c) return;
    musicStep = 0;
    musicNext = c.currentTime + 0.06;
    musicTimer = setInterval(function () {
      var context = ensureGraph();
      if (!context || muted) return;
      var guard = 0;
      var stepDur = 60 / pattern.bpm / 2;
      while (musicNext < context.currentTime + 0.25 && guard++ < 32) {
        pattern.notes.forEach(function (note) {
          if (note.step === musicStep) playAt(note, musicNext);
        });
        musicNext += stepDur;
        musicStep = (musicStep + 1) % pattern.steps;
      }
    }, 40);
  }

  function startFile(src) {
    var audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = musicVolume();
    musicFile = audio;
    audio.addEventListener("error", function () {
      if (musicFile !== audio) return;
      audio.pause();
      musicFile = null;
      activeTrack = "";
    });
    var pending = audio.play();
    if (pending && pending.catch) pending.catch(function () {});
  }

  function switchTo(id) {
    var token = ++switchToken;
    if (!muted) fadeGain(0, 0.12);
    setTimeout(function () {
      if (token !== switchToken) return;
      stopSources();
      if (muted || !id) return;
      activeTrack = id;
      var src = trackFile(id);
      if (src) startFile(src);
      else if (BUILTINS[id]) startBuiltin(id);
      else activeTrack = "";
      fadeGain(musicVolume(), 0.28);
    }, 130);
  }

  function setScene(scene) {
    desiredScene = scene || "main";
    var id = resolveTrack(desiredScene);
    if (id === desiredTrack && (activeTrack === id || muted || !id)) return;
    desiredTrack = id;
    if (muted) {
      switchToken++;
      stopSources();
      return;
    }
    switchTo(id);
  }

  window.Sound = {
    play: function (name) {
      if (muted) return;
      var fn = sounds[name];
      if (fn) {
        try {
          fn();
        } catch (e) {
          /* audio is a nice-to-have */
        }
      }
    },
    /** A single melody note, used by the rhythm game. */
    note: function (freq, dur) {
      if (muted) return;
      try {
        tone(freq, 0, dur || 0.22, "triangle", 0.15);
        tone(freq * 2, 0, (dur || 0.22) * 0.6, "sine", 0.05);
      } catch (e) {
        /* audio is a nice-to-have */
      }
    },
    setMuted: function (value) {
      muted = !!value;
      if (muted) {
        switchToken++;
        fadeGain(0, 0.05);
        stopSources();
        return;
      }
      if (desiredTrack) switchTo(desiredTrack);
    },
    isMuted: function () {
      return muted;
    },
    unlock: function () {
      var c = ensure();
      if (c && c.state === "suspended") c.resume();
      if (!muted && desiredTrack && !activeTrack) switchTo(desiredTrack);
      if (!muted && musicFile && musicFile.paused) {
        var pending = musicFile.play();
        if (pending && pending.catch) pending.catch(function () {});
      }
    },
    /** "main", "reward", or a mini-game id. The track comes from config.music. */
    setScene: setScene,
    scene: function () {
      return desiredScene;
    },
    track: function () {
      return desiredTrack;
    },
    trackName: function () {
      return trackLabel(desiredTrack);
    },
    usingFile: function () {
      return !!(musicFile && activeTrack);
    },
  };
})();
