document.documentElement.setAttribute('data-theme', 'dark');

(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(function (element) {
      element.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(function (element) {
      observer.observe(element);
    });
  }
})();


(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (prefersReduced || !canHover) {
    return;
  }

  var glow = document.getElementById('cursorGlow');
  var currentX = window.innerWidth / 2;
  var currentY = window.innerHeight / 2;
  var targetX = currentX;
  var targetY = currentY;
  var currentSize = 120;
  var targetSize = 120;
  var raf = null;

  function applyGlowSize() {
    glow.style.width = currentSize + 'px';
    glow.style.height = currentSize + 'px';
    glow.style.marginLeft = (-currentSize / 2) + 'px';
    glow.style.marginTop = (-currentSize / 2) + 'px';
  }

  function renderGlow() {
    currentX += (targetX - currentX) * 0.10;
    currentY += (targetY - currentY) * 0.10;
    currentSize += (targetSize - currentSize) * 0.12;
    applyGlowSize();
    glow.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
    glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), rgba(103, 146, 255, 0.08) 28%, rgba(255, 255, 255, 0) 70%)';
    raf = requestAnimationFrame(renderGlow);
  }

  document.addEventListener('pointermove', function (event) {
    targetX = event.clientX;
    targetY = event.clientY;

    var targetElement = event.target && typeof event.target.closest === 'function' ? event.target : null;
    var isInsideInteractive = !!(targetElement && targetElement.closest('.tilt-card, .icon-btn, .cta-button, .btn-ghost, .btn-primary'));
    targetSize = isInsideInteractive ? 80 : 120;
    glow.style.opacity = isInsideInteractive ? '0' : '0.18';

    if (!raf) {
      raf = requestAnimationFrame(renderGlow);
    }
  });

  document.addEventListener('pointerleave', function () {
    glow.style.opacity = '0';
    document.querySelectorAll('.hero .actions a, .icon-btn').forEach(function (button) {
      button.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      button.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  var tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(function (card) {
    var cardGlow = card.querySelector('.card-glow');

    card.addEventListener('pointermove', function (event) {
      var rect = card.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotateX = ((y - cy) / cy) * -6;
      var rotateY = ((x - cx) / cx) * 7;

      card.style.transition = 'none';
      card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      card.classList.add('is-glowing');

      if (cardGlow) {
        cardGlow.style.background = 'transparent';
      }
    });

    card.addEventListener('pointerleave', function () {
      card.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.classList.remove('is-glowing');
      if (cardGlow) {
        cardGlow.style.background = 'transparent';
      }
    });
  });

  var magnets = document.querySelectorAll('.hero .actions a, .icon-btn');

  magnets.forEach(function (button) {
    var isIcon = button.classList.contains('icon-btn');
    var fx = isIcon ? 0.09 : 0.07;
    var fy = isIcon ? 0.09 : 0.07;

    button.addEventListener('pointermove', function (event) {
      var rect = button.getBoundingClientRect();
      var x = event.clientX - rect.left - rect.width / 2;
      var y = event.clientY - rect.top - rect.height / 2;
      var rotateX = y * 0.06;
      var rotateY = x * -0.08;
      var px = (event.clientX - rect.left) / rect.width * 100;
      var py = (event.clientY - rect.top) / rect.height * 100;

      button.style.setProperty('--mx', px + '%');
      button.style.setProperty('--my', py + '%');
      button.style.transition = 'none';
      button.style.transform = 'translate3d(' + (x * fx) + 'px, ' + (y * fy) + 'px, 0) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    button.addEventListener('pointerleave', function () {
      button.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      button.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
    });
  });

  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('pointermove', function (event) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      var card = heroVisual.querySelector('.portrait-card');
      if (!card) return;

      card.style.transition = 'transform 0.2s ease-out';
      card.style.transform = 'translate3d(' + (x * 12) + 'px, ' + (y * -10 - 2) + 'px, 0) rotateX(' + (y * -8) + 'deg) rotateY(' + (x * 10) + 'deg)';
    });

    heroVisual.addEventListener('pointerleave', function () {
      var card = heroVisual.querySelector('.portrait-card');
      if (!card) return;
      card.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
    });
  }
})();

