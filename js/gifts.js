/* The gift shop counter and the unwrapping ceremony. */
(function () {
  var cfg = window.GAME_CONFIG;

  function giftById(id) {
    for (var i = 0; i < cfg.gifts.length; i++) {
      if (cfg.gifts[i].id === id) return cfg.gifts[i];
    }
    return null;
  }

  /**
   * Render the shop grid.
   * handlers: { onRedeem(giftId), onView(giftId) }
   */
  function renderShop(grid, state, handlers) {
    var t = window.UI.t;
    var esc = window.UI.esc;
    grid.innerHTML = "";

    cfg.gifts.forEach(function (gift) {
      var text = window.UI.giftText(gift.id);
      var claimed = !!state.gifts[gift.id];
      var affordable = state.bells >= gift.price;

      var card = document.createElement("div");
      card.className = "gift-card" + (claimed ? " claimed" : "");
      card.innerHTML =
        '<div class="gift-emoji">' +
        (claimed ? gift.icon : "🎁") +
        "</div>" +
        "<h3>" +
        esc(claimed ? text.name : "???") +
        "</h3>" +
        '<div class="gift-price">' +
        (claimed
          ? '<span class="gift-tag">' + esc(t("shop_claimed")) + "</span>"
          : "🔔 " + gift.price) +
        "</div>";

      var btn = document.createElement("button");
      btn.className = "btn btn-small" + (claimed ? " btn-ghost" : "");
      if (claimed) {
        btn.textContent = t("shop_view");
        btn.addEventListener("click", function () {
          handlers.onView(gift.id);
        });
      } else {
        btn.textContent = affordable ? t("shop_redeem") : t("shop_need_more");
        btn.disabled = !affordable;
        btn.addEventListener("click", function () {
          handlers.onRedeem(gift.id);
        });
      }
      card.appendChild(btn);
      grid.appendChild(card);
    });
  }

  /** Full unwrap ceremony. onDone runs when the modal closes. */
  function unwrap(giftId, onDone) {
    var gift = giftById(giftId);
    if (!gift) return;
    var t = window.UI.t;
    var esc = window.UI.esc;
    var text = window.UI.giftText(giftId);

    window.UI.openModal({
      html:
        "<h2>" +
        esc(t("gift_tap_to_open")) +
        "</h2>" +
        '<div class="present" id="present" style="--ca:' +
        gift.colorA +
        ";--cb:" +
        gift.colorB +
        '">' +
        '<div class="present-box"></div>' +
        '<div class="present-ribbon"></div>' +
        '<div class="present-lid"></div>' +
        '<div class="present-bow">🎀</div>' +
        "</div>",
      onMount: function (card) {
        var present = card.querySelector("#present");
        var taps = 0;
        present.addEventListener("click", function () {
          taps++;
          window.Sound.play("pop");
          if (taps < 3) {
            present.classList.remove("shake");
            void present.offsetWidth;
            present.classList.add("shake");
            return;
          }
          present.classList.add("opened");
          window.Sound.play("gift");
          window.UI.confetti(120);
          var rect = present.getBoundingClientRect();
          window.UI.burst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            60,
            [gift.colorA, gift.colorB, "#fff1a8"],
          );
          setTimeout(function () {
            showGift(gift, text, onDone);
          }, 620);
        });
      },
    });
  }

  function showGift(gift, text, onDone) {
    var t = window.UI.t;
    var esc = window.UI.esc;
    window.UI.openModal({
      html:
        '<div class="gift-reveal-emoji">' +
        gift.icon +
        "</div>" +
        "<h2>" +
        esc(text.name) +
        "</h2>" +
        "<p>" +
        esc(text.tagline) +
        "</p>" +
        '<div class="gift-note">' +
        esc(text.note) +
        "</div>",
      buttons: [
        {
          label: t("close"),
          onClick: function () {
            if (onDone) onDone();
          },
        },
      ],
    });
  }

  function view(giftId) {
    var gift = giftById(giftId);
    if (!gift) return;
    window.Sound.play("gift");
    showGift(gift, window.UI.giftText(giftId), null);
  }

  window.Gifts = {
    renderShop: renderShop,
    unwrap: unwrap,
    view: view,
    byId: giftById,
  };
})();
