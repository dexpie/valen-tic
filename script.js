/* ============================================================
   EX.JS - Interactive Slide Deck Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       1. NAVIGATION SYSTEM
       ============================================= */
    let currentSection = 0;
    const isTransitioning = false;

    const sections = [
        document.getElementById('section1'),
        document.getElementById('section2'),
        document.getElementById('section3'),
        document.getElementById('section4')
    ];

    const btns = [
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3')
    ];

    // Music Control References
    const bgm = document.getElementById('bgm');
    const sfx = document.getElementById('sfx');
    const musicControl = document.getElementById('musicControl');
    const musicDisc = document.getElementById('musicDisc');
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');

    const gateScreen = document.getElementById('gateScreen');
    const gateActions = document.getElementById('gateActions');
    const gateYesBtn = document.getElementById('gateYesBtn');
    const gateNoBtn = document.getElementById('gateNoBtn');
    const gateSubtitle = document.getElementById('gateSubtitle');
    const gateStickers = document.getElementById('gateStickers');
    const cuteToasts = document.getElementById('cuteToasts');
    const gateDayStep = document.getElementById('gateDayStep');
    const gateSpecialStep = document.getElementById('gateSpecialStep');
    const gateDayBtns = document.querySelectorAll('.gate-day-btn');
    const gateOpenBtn = document.getElementById('gateOpenBtn');

    let isMusicPlaying = false;
    let noMoves = 0;
    let gateStickerTimer = null;

    const noLabels = ['Ngga', 'Yakin?', 'Eh salah', 'Coba lagi', 'Ga jadi', 'Hehe nope'];
    const noSubtitles = [
        'Ih kok itu mau dipencet sih!',
        'Yang bener dong, pilih yang kiri aja yaa.',
        'Tombolnya pemalu, dia lari dulu~',
        'Ups kepeleset, pindah tempat dulu!',
        'Ngga bukan opsi hari ini hihi.'
    ];
    const dayToasts = [
        'That is what I wanted to hear.',
        'Good, keep that smile ready.',
        'Perfect answer, honestly.'
    ];
    const specialToasts = [
        'Tiny surprise loading...',
        'Okay, this part is cute.',
        'Ready for the special thing?'
    ];
    const yesToasts = ['YAYYY 💖', 'Aaaaa lucuuu!', 'Hati aku: stonks 📈💘'];
    const nextToasts = [
        'Lanjut ya cantik ✨',
        'Uwu mode: ON',
        'Hati kecilku senyum-senyum',
        'Kamu tuh gemes banget'
    ];

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function showCuteToast(text) {
        if (!cuteToasts) return;
        const toast = document.createElement('div');
        toast.className = 'cute-toast';
        toast.textContent = text;
        cuteToasts.appendChild(toast);
        setTimeout(() => toast.remove(), 2100);
    }

    function spawnGateSticker() {
        if (!gateStickers || gateScreen.classList.contains('hidden')) return;
        const emotes = ['💖', '✨', '🌸', '🥺', '💞', '🐣'];
        const sticker = document.createElement('span');
        sticker.className = 'gate-sticker';
        sticker.textContent = randomFrom(emotes);
        sticker.style.left = Math.floor(Math.random() * 96) + '%';
        gateStickers.appendChild(sticker);
        setTimeout(() => sticker.remove(), 1800);
    }

    function startGateStickers() {
        if (gateStickerTimer) return;
        gateStickerTimer = setInterval(spawnGateSticker, 420);
    }

    function stopGateStickers() {
        if (!gateStickerTimer) return;
        clearInterval(gateStickerTimer);
        gateStickerTimer = null;
    }

    function celebrateYesChoice() {
        const celebrationTarget = gateStickers || gateActions;
        if (!celebrationTarget) return;
        for (let i = 0; i < 14; i++) {
            const conf = document.createElement('span');
            conf.className = 'gate-sticker';
            conf.textContent = i % 2 === 0 ? '💖' : '✨';
            conf.style.left = Math.floor(Math.random() * 96) + '%';
            conf.style.bottom = '-6px';
            conf.style.animationDuration = '1s';
            celebrationTarget.appendChild(conf);
            setTimeout(() => conf.remove(), 1000);
        }
    }

    function moveNoButton() {
        if (!gateActions || !gateNoBtn || !gateYesBtn) return;

        const areaWidth = gateActions.clientWidth;
        const areaHeight = gateActions.clientHeight;
        const btnWidth = gateNoBtn.offsetWidth;
        const btnHeight = gateNoBtn.offsetHeight;

        if (areaWidth <= btnWidth || areaHeight <= btnHeight) return;

        const yesRect = gateYesBtn.getBoundingClientRect();
        const areaRect = gateActions.getBoundingClientRect();
        const yesCenterX = yesRect.left - areaRect.left + yesRect.width / 2;
        const yesCenterY = yesRect.top - areaRect.top + yesRect.height / 2;

        let nextX = 0;
        let nextY = 0;

        for (let i = 0; i < 20; i++) {
            nextX = Math.floor(Math.random() * (areaWidth - btnWidth));
            nextY = Math.floor(Math.random() * (areaHeight - btnHeight));

            const noCenterX = nextX + btnWidth / 2;
            const noCenterY = nextY + btnHeight / 2;
            const distance = Math.hypot(noCenterX - yesCenterX, noCenterY - yesCenterY);

            if (distance > 95) break;
        }

        gateNoBtn.style.left = nextX + 'px';
        gateNoBtn.style.top = nextY + 'px';
        noMoves += 1;
        gateNoBtn.textContent = randomFrom(noLabels);
        if (gateSubtitle) {
            gateSubtitle.textContent = randomFrom(noSubtitles);
        }
        if (noMoves % 2 === 0) {
            showCuteToast('Hehe ketangkep dong kalo bisa 😜');
        }
    }

    if (gateNoBtn) {
        gateNoBtn.addEventListener('mouseenter', moveNoButton);
        gateNoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            moveNoButton();
        });
        gateNoBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNoButton();
        }, { passive: false });
    }

    if (gateYesBtn && gateScreen) {
        gateYesBtn.addEventListener('click', () => {
            celebrateYesChoice();
            showCuteToast(randomFrom(yesToasts));
            stopGateStickers();
            gateScreen.classList.add('hidden');
        });
    }

    gateDayBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (gateSubtitle && btn.dataset.dayAnswer) {
                gateSubtitle.textContent = `${btn.dataset.dayAnswer} sounds lovely.`;
            }
            celebrateYesChoice();
            showCuteToast(randomFrom(dayToasts));
            setTimeout(() => {
                if (gateDayStep) gateDayStep.classList.add('gate-step-hidden');
                if (gateSpecialStep) gateSpecialStep.classList.remove('gate-step-hidden');
                showCuteToast(randomFrom(specialToasts));
            }, 500);
        });
    });

    if (gateOpenBtn && gateScreen) {
        gateOpenBtn.addEventListener('click', () => {
            celebrateYesChoice();
            stopGateStickers();
            gateScreen.classList.add('hidden');
        });
    }

    startGateStickers();

    function goToSection(index) {
        if (index < 0 || index >= sections.length || isTransitioning) return;

        const oldSection = sections[currentSection];
        const newSection = sections[index];

        // Handle music UI visibility (hidden on slide 1, visible from slide 2 onwards)
        if (index === 0) {
            musicControl.classList.remove('visible');
        } else {
            musicControl.classList.add('visible');
        }

        // Transition out current section
        oldSection.classList.remove('active');
        oldSection.classList.add('leaving');

        setTimeout(() => {
            oldSection.classList.remove('leaving');
        }, 900);

        // Activate new section after short delay
        setTimeout(() => {
            newSection.classList.add('active');
            currentSection = index;
            if (index > 0) {
                showCuteToast(randomFrom(nextToasts));
            }

            // Trigger section-specific logic
            if (index === 1) {
                // Slide 2: Start typewriter, start BGM, start particles
                startTypewriter();
                startBGM();
                startParticles();
            }

            if (index === 0) {
                // Slide 1: Stop particles (flowers have their own animation)
                stopParticles();
                stopBGM();
            }

            if (index === 2) {
                // Slide 3: Play SFX, start particles
                playSFX();
                startParticles();
            }

            if (index === 3) {
                // Slide 4: Stop particles, start sparkle animation
                stopParticles();
                startSparkles();
            }
        }, 200);
    }

    // Attach click events to all navigation buttons
    btns.forEach((btn, i) => {
        if (btn) {
            btn.addEventListener('click', () => {
                goToSection(i + 1);
            });
        }
    });

    /* =============================================
       2. AUDIO SYSTEM
       ============================================= */

    // BGM Functions
    function startBGM() {
        if (!bgm.src && !bgm.querySelector('source')) return;

        const playPromise = bgm.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Browser blocked autoplay - unlock audio context
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                gain.gain.value = 0.001;
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
                ctx.close();

                // Retry play after short delay
                setTimeout(() => {
                    bgm.play().catch(() => {});
                }, 200);
            });
        }

        isMusicPlaying = true;
        updateMusicUI();
    }

    function stopBGM() {
        bgm.pause();
        // Note: We don't reset isMusicPlaying here, keeps state for when user returns
    }

    function toggleMusic() {
        if (!bgm.src && !bgm.querySelector('source')) return;

        if (isMusicPlaying) {
            bgm.pause();
            isMusicPlaying = false;
        } else {
            bgm.play().catch(() => {});
            isMusicPlaying = true;
        }

        updateMusicUI();
    }

    function updateMusicUI() {
        if (isMusicPlaying) {
            musicDisc.classList.add('playing');
            musicIcon.className = 'fa-solid fa-pause';
        } else {
            musicDisc.classList.remove('playing');
            musicIcon.className = 'fa-solid fa-play';
        }
    }

    // SFX Function
    function playSFX() {
        if (!sfx.src && !sfx.querySelector('source')) return;
        sfx.currentTime = 0;
        sfx.play().catch(() => {});
    }

    // Music control button click
    musicBtn.addEventListener('click', toggleMusic);

    /* =============================================
       3. TYPEWRITER EFFECT (SECTION 2)
       ============================================= */
const letterText = "Thank you for being such a strong and amazing person. I'm really proud of you. You've done so well until this very moment, chasing your dreams and fighting your own battles with grace. You always keep trying to stay on your own path and pursue what matters most. You never give up, even when deep down you're actually so tired.\n\nI truly believe that one day, you'll look back at all of this and smile proudly because you made it through every hard moment and every part of the process.\n\nNever forget to be grateful for how far you've come, and keep moving forward with a happy heart. May your days be filled with beautiful blessings and endless joy. Keep shining, beautiful souls....✨";
    let typewriterStarted = false;
    const typeEl = document.getElementById('typewriterText');
    const nextBtn2 = document.getElementById('btn2');

    function startTypewriter() {
        if (typewriterStarted) return;
        typewriterStarted = true;

        // Reset typewriter
        typeEl.innerHTML = '<span class="cursor-blink">|</span>';
        nextBtn2.classList.remove('visible');

        let i = 0;
        const speed = 35; // typing speed in ms

        function type() {
            if (i < letterText.length) {
                const char = letterText.charAt(i);

                // Handle newline for paragraph breaks
                if (char === '\n') {
                    typeEl.innerHTML = typeEl.innerHTML.replace(
                        '<span class="cursor-blink">|</span>',
                        ''
                    ) + '<br><span class="cursor-blink">|</span>';
                } else {
                    typeEl.innerHTML = typeEl.innerHTML.replace(
                        '<span class="cursor-blink">|</span>',
                        ''
                    ) + char + '<span class="cursor-blink">|</span>';
                }

                i++;

                // Auto-scroll the card when text is long
                const card = typeEl.closest('.letter-card');
                if (card) card.scrollTop = card.scrollHeight;

                setTimeout(type, speed);
            } else {
                // Typing finished - remove cursor and show button
                setTimeout(() => {
                    typeEl.innerHTML = typeEl.innerHTML.replace(
                        '<span class="cursor-blink">|</span>',
                        ''
                    );
                    nextBtn2.classList.add('visible');
                }, 400);
            }
        }

        // Start typing after card animation
        setTimeout(type, 600);
    }

 /* =========================================================
   LIGHTBOX
========================================================= */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose = document.getElementById('lightboxClose');

/* OPEN */
document.querySelectorAll('.photo-frame').forEach(frame => {

    frame.addEventListener('click', () => {

        const img = frame.querySelector('img');

        if (!img) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        lightbox.classList.add('active');

        document.body.style.overflow = 'hidden';
    });

});

/* CLOSE */
function closeLightbox(){

    lightbox.classList.remove('active');

    document.body.style.overflow = '';
}

/* EVENTS */
if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', (e) => {

    if(e.key === 'Escape'){
        closeLightbox();
    }

});

    /* =============================================
       5. BUTTERFLY & HEART PARTICLES
       ============================================= */
    const particlesContainer = document.getElementById('particlesContainer');
    let butterflyInterval = null;
    let heartInterval = null;

    function createButterfly() {
        const b = document.createElement('div');
        b.classList.add('butterfly');

        const lw = document.createElement('div');
        lw.classList.add('wing', 'left');
        const rw = document.createElement('div');
        rw.classList.add('wing', 'right');

        b.appendChild(lw);
        b.appendChild(rw);

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.6);
        b.style.left = startX + 'px';
        b.style.top = startY + 'px';

        const colors = ['#ff9ff3', '#48dbfb', '#ff6b81', '#feca57'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        lw.style.background = 'linear-gradient(135deg, ' + color + ' 0%, transparent 100%)';
        rw.style.background = 'linear-gradient(135deg, ' + color + ' 0%, transparent 100%)';

        particlesContainer.appendChild(b);
        setTimeout(() => b.remove(), 15000);
    }

    function createHeart() {
        const h = document.createElement('div');
        h.classList.add('heart-particle');
        h.style.left = Math.random() * window.innerWidth + 'px';
        h.style.bottom = '0px';

        const size = Math.random() * 10 + 5;
        h.style.width = size + 'px';
        h.style.height = size + 'px';

        const dur = Math.random() * 3 + 3;
        h.style.animation = 'floatUp ' + dur + 's linear forwards';
        particlesContainer.appendChild(h);
        setTimeout(() => h.remove(), dur * 1000);
    }

    function startParticles() {
        if (butterflyInterval) return;

        createButterfly();
        butterflyInterval = setInterval(createButterfly, 3000);
        heartInterval = setInterval(createHeart, 500);
    }

    function stopParticles() {
        if (butterflyInterval) {
            clearInterval(butterflyInterval);
            butterflyInterval = null;
        }

        if (heartInterval) {
            clearInterval(heartInterval);
            heartInterval = null;
        }

        particlesContainer.innerHTML = '';
    }

    /* =============================================
       6. SPARKLE ANIMATION (SECTION 4)
       ============================================= */
    const sparkleContainer = document.getElementById('sparkleContainer');
    let sparkleInterval = null;

    function createSparkle() {
        if (!sparkleContainer) return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        const x = Math.random() * 100; // percentage
        const y = 60 + Math.random() * 40; // start from middle-bottom area
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;

        sparkle.style.left = x + '%';
        sparkle.style.top = y + '%';
        sparkle.style.animationDelay = delay + 's';
        sparkle.style.animationDuration = duration + 's';

        sparkleContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), (delay + duration) * 1000);
    }

    function startSparkles() {
        if (sparkleInterval || !sparkleContainer) return;

        // Create initial batch of sparkles
        for (let i = 0; i < 15; i++) {
            setTimeout(createSparkle, i * 200);
        }

        // Continue creating sparkles periodically
        sparkleInterval = setInterval(createSparkle, 400);
    }

    function stopSparkles() {
        if (sparkleInterval) {
            clearInterval(sparkleInterval);
            sparkleInterval = null;
        }

        if (sparkleContainer) {
            sparkleContainer.innerHTML = '';
        }
    }

    /* =============================================
       7. INITIALIZATION
       ============================================= */

    // Note: Music Control UI is hidden by default (slide 1)
    // It becomes visible when entering slide 2 and onwards
    // via the goToSection function logic above

    console.log('Interactive Slide Deck initialized successfully!');

    /* =============================================
       USAGE NOTES:
       =============================================
       To use audio files, uncomment and update these lines in ex.html:

       1. Background Music (loops throughout slides 2-4):
          <audio id="bgm" loop preload="auto">
              <source src="your-music.mp3" type="audio/mpeg">
          </audio>

       2. Sound Effect (plays once when entering slide 3):
          <audio id="sfx" preload="auto">
              <source src="your-sfx.mp3" type="audio/mpeg">
          </audio>
    */

});

if (typeof window.mojs === 'undefined') {
  console.warn('mojs is not loaded; section 4 animation is disabled.');
} else {
const qs = document.querySelector.bind(document);
const easingHeart = mojs.easing.path('M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0');

const el = {
  container: qs('.mo-container'),

  i: qs('.lttr--I'),
  l: qs('.lttr--L'),
  o: qs('.lttr--O'),
  v: qs('.lttr--V'),
  e: qs('.lttr--E'),
  y: qs('.lttr--Y'),
  o2: qs('.lttr--O2'),
  u: qs('.lttr--U'),

  lineLeft: qs('.line--left'),
  lineRight: qs('.line--rght'),

  colTxt: "#763c8c",
  colHeart: "#fa4843",

  blup: qs('.blup'),
  blop: qs('.blop'),
  sound: qs('.sound') };


class Heart extends mojs.CustomShape {
  getShape() {
    return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>';
  }
  getLength() {return 200;}}

mojs.addShape('heart', Heart);

const crtBoom = (delay = 0, x = 0, rd = 46) => {
  parent = el.container;
  const crcl = new mojs.Shape({
    shape: 'circle',
    fill: 'none',
    stroke: el.colTxt,
    strokeWidth: { 5: 0 },
    radius: { [rd]: [rd + 20] },
    easing: 'quint.out',
    duration: 500 / 3,
    parent,
    delay,
    x });


  const brst = new mojs.Burst({
    radius: { [rd + 15]: 110 },
    angle: 'rand(60, 180)',
    count: 3,
    timeline: { delay },
    parent,
    x,
    children: {
      radius: [5, 3, 7],
      fill: el.colTxt,
      scale: { 1: 0, easing: 'quad.in' },
      pathScale: [.8, null],
      degreeShift: ['rand(13, 60)', null],
      duration: 1000 / 3,
      easing: 'quint.out' } });



  return [crcl, brst];
};

const crtLoveTl = () => {
  const move = 1000;
  const boom = 200;
  const easing = 'sin.inOut';
  const easingBoom = 'sin.in';
  const easingOut = 'sin.out';
  const opts = { duration: move, easing, opacity: 1 };
  const delta = 150;

  return new mojs.Timeline().add([
  new mojs.Tween({
    duration: move,
    onStart: () => {
      [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(el => {
        el.style.opacity = 1;
        el.style = 'transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;';
      });
    },
    onComplete: () => {
      [el.l, el.o, el.v, el.e].forEach(el => el.style.opacity = 0);
      el.blop.play();
    } }),


  new mojs.Tween({
    duration: move * 2 + boom,
    onComplete: () => {
      [el.y, el.o2].forEach(el => el.style.opacity = 0);
      el.blop.play();
    } }),


  new mojs.Tween({
    duration: move * 3 + boom * 2 - delta,
    onComplete: () => {
      el.i.style.opacity = 0;
      el.blop.play();
    } }),


  new mojs.Tween({
    duration: move * 3 + boom * 2,
    onComplete: () => {
      el.u.style.opacity = 0;
      el.blup.play();
    } }),


  new mojs.Tween({
    duration: 50,
    delay: 4050,
    onUpdate: progress => {
      [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(el => {
        el.style = `transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: ${1 * progress};`;
      });
    },
    onComplete: () => {
      [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(el => {
        el.style.opacity = 1;
        el.style = 'transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;';
      });
    } }),


  new mojs.Html({
    ...opts,
    el: el.lineLeft,
    x: { 0: 52 } }).
  then({
    duration: boom + move,
    easing,
    x: { to: 52 + 54 } }).
  then({
    duration: boom + move,
    easing,
    x: { to: 52 + 54 + 60 } }).
  then({
    duration: 150, // 3550
    easing,
    x: { to: 52 + 54 + 60 + 10 } }).
  then({
    duration: 300 }).
  then({
    duration: 350,
    x: { to: 0 },
    easing: easingOut }),


  new mojs.Html({
    ...opts,
    el: el.lineRight,
    x: { 0: -52 } }).
  then({
    duration: boom + move,
    easing,
    x: { to: -52 - 54 } }).
  then({
    duration: boom + move,
    easing,
    x: { to: -52 - 54 - 60 } }).
  then({
    duration: 150,
    easing,
    x: { to: -52 - 54 - 60 - 10 } }).
  then({
    duration: 300 }).
  then({
    duration: 350,
    x: { to: 0 },
    easing: easingOut }),


  new mojs.Html({ // [I] LOVE YOU
    ...opts,
    el: el.i,
    x: { 0: 34 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: 34 + 19 } }).
  then({
    duration: move,
    easing,
    x: { to: 34 + 19 + 40 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: 34 + 19 + 40 + 30 } }).
  then({
    duration: move,
    easing,
    x: { to: 34 + 19 + 40 + 30 + 30 } }),


  new mojs.Html({ // I [L]OVE YOU
    ...opts,
    el: el.l,
    x: { 0: 15 } }),


  new mojs.Html({ // I L[O]VE YOU
    ...opts,
    el: el.o,
    x: { 0: 11 } }),


  new mojs.Html({ // I LO[V]E YOU
    ...opts,
    el: el.v,
    x: { 0: 3 } }),


  new mojs.Html({ // I LOV[E] YOU
    ...opts,
    el: el.e,
    x: { 0: -3 } }),


  new mojs.Html({ // I LOVE [Y]OU
    ...opts,
    el: el.y,
    x: { 0: -20 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: -20 - 33 } }).
  then({
    duration: move,
    easing,
    x: { to: -20 - 33 - 24 } }),


  new mojs.Html({ // I LOVE Y[O]U
    ...opts,
    el: el.o2,
    x: { 0: -27 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: -27 - 27 } }).
  then({
    duration: move,
    easing,
    x: { to: -27 - 27 - 30 } }),


  new mojs.Html({ // I LOVE YO[U]
    ...opts,
    el: el.u,
    x: { 0: -32 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: -32 - 21 } }).
  then({
    duration: move,
    easing,
    x: { to: -32 - 21 - 36 } }).
  then({
    duration: boom,
    easing: easingBoom,
    x: { to: -32 - 21 - 36 - 31 } }).
  then({
    duration: move,
    easing,
    x: { to: -32 - 21 - 36 - 31 - 27 } }),


  new mojs.Shape({
    parent: el.container,
    shape: 'heart',
    delay: move,
    fill: el.colHeart,
    x: -64,
    scale: { 0: 0.95, easing: easingHeart },
    duration: 500 }).
  then({
    x: { to: -62, easing },
    scale: { to: 0.65, easing },
    duration: boom + move - 500 }).
  then({
    duration: boom - 50,
    x: { to: -62 + 48 },
    scale: { to: 0.90 },
    easing: easingBoom }).
  then({
    duration: 125,
    scale: { to: 0.8 },
    easing: easingOut }).
  then({
    duration: 125,
    scale: { to: 0.85 },
    easing: easingOut }).
  then({
    duration: move - 200,
    scale: { to: 0.45 },
    easing }).
  then({
    delay: -75,
    duration: 150,
    x: { to: 0 },
    scale: { to: 0.90 },
    easing: easingBoom }).
  then({
    duration: 125,
    scale: { to: 0.8 },
    easing: easingOut }).
  then({
    duration: 125, // 3725
    scale: { to: 0.85 },
    easing: easingOut }).
  then({
    duration: 125 // 3850
  }).then({
    duration: 350,
    scale: { to: 0 },
    easing: easingOut }),


  ...crtBoom(move, -64, 46),
  ...crtBoom(move * 2 + boom, 18, 34),
  ...crtBoom(move * 3 + boom * 2 - delta, -64, 34),
  ...crtBoom(move * 3 + boom * 2, 45, 34)]);

};

const loveTl = crtLoveTl().play();
setInterval(() => {loveTl.replay();}, 4300);

const volume = 0.2;
el.blup.volume = volume;
el.blop.volume = volume;

const toggleSound = () => {
  let on = true;
  return () => {
    if (on) {
      el.blup.volume = 0.0;
      el.blop.volume = 0.0;
      el.sound.classList.add('sound--off');
    } else
    {
      el.blup.volume = volume;
      el.blop.volume = volume;
      el.sound.classList.remove('sound--off');
    }
    on = !on;
  };
};
el.sound.addEventListener('click', toggleSound());
}
