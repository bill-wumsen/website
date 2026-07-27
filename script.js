/* ========================================= */
/* SECTION: VIDEO / TEXT DATEN               */
/* ========================================= */
const slides = [
  {
    video: "videos/web1_60_hires.mp4",
    left: "Regisseur",
    right: "Der Baron",
    topLeft: "Feature Film",
    topRight: "Regie · Produktion · Schnitt",
    bottomCenter: "ilmpressions Filmproduktion"
  },
  {
    video: "videos/web2_hires.mp4",
    left: "Content Creator",
    right: "studis.ilmenau",
    topLeft: "Social Media",
    topRight: "Redaktion · Interviews · Memes",
    bottomCenter: "im Auftrag der TU Ilmenau"
  },
  {
    video: "videos/web3_60_hires.mp4",
    left: "Produktionsleiter",
    right: "Medusa",
    topLeft: "Feature Film",
    topRight: "Finanzierung · Organisation · Distribution",
    bottomCenter: "ilmpressions Filmproduktion"
  },
  {
    video: "videos/web4_hires.mp4",
    left: "Organisator",
    right: "Medusa Filmpremiere",
    topLeft: "Event",
    topRight: "Finanzierung · Logistik",
    bottomCenter: "für FeM e.V."
  }
];

/* ========================================= */
/* SECTION: DOM REFERENZEN                   */
/* ========================================= */
const landing =
  document.getElementById("landing");

const videoStage =
  document.querySelector(".video-stage");

const videoOverlay =
  document.querySelector(".video-overlay");

const videoLayers = Array.from(
  document.querySelectorAll(
    ".portfolio-video-layer"
  )
);

let video =
  videoLayers[0] ||
  document.getElementById(
    "portfolioVideo"
  );

const glowVideo =
  document.getElementById(
    "portfolioVideoGlow"
  );

const textLeft =
  document.getElementById("textLeft");

const textRight =
  document.getElementById("textRight");

const textTopLeft =
  document.getElementById(
    "textTopLeft"
  );

const textTopRight =
  document.getElementById(
    "textTopRight"
  );

const textBottomCenter =
  document.getElementById(
    "textBottomCenter"
  );

const rollingTextItems = [
  {
    element: textLeft,
    key: "left",
    reverseDirection: false
  },
  {
    element: textRight,
    key: "right",
    reverseDirection: true
  },
  {
    element: textTopLeft,
    key: "topLeft",
    reverseDirection: false
  },
  {
    element: textTopRight,
    key: "topRight",
    reverseDirection: false
  },
  {
    element: textBottomCenter,
    key: "bottomCenter",
    reverseDirection: false
  }
];

const landingLines =
  document.querySelector(
    ".landing-lines"
  );

const leftLineTrack =
  document.getElementById(
    "leftLineTrack"
  );

const rightLineTrack =
  document.getElementById(
    "rightLineTrack"
  );

const firstExperienceTrigger =
  document.querySelector(
    ".experience-accordion .experience-trigger"
  );

const reducedMotionQuery =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

const pageCurtainRoot =
  document.documentElement;

const pageCurtain =
  document.getElementById(
    "pageCurtain"
  );

const pageCurtainRightPanel =
  pageCurtain?.querySelector(
    ".page-curtain-panel--right"
  ) || null;

const pageCurtainReloadLinks =
  Array.from(
    document.querySelectorAll(
      "[data-page-curtain-reload]"
    )
  );

/* ========================================= */
/* SECTION: STATUS                           */
/* ========================================= */
let currentSlideIndex = 0;

let isLandingTransitioning = false;
let activeLandingTransition = null;

let landingTransitionFallback = null;
let glowHandoffTimeout = null;

const landingGestureIdleDelay = 220;
const landingScrollThreshold = 70;
const landingExitThreshold = 220;

let isScrollGestureLocked = false;
let isScrollGestureIdle = true;
let scrollGestureIdleTimer = null;

let landingScrollAccumulator = 0;
let landingScrollDirection = 0;
let landingExitScroll = 0;
let isLandingExitUnlocked = false;

let lastLandingScrollY =
  window.scrollY;

let lastWheelDirection = 0;
let lastWheelTimestamp = 0;
let wasBelowLanding = false;
let isLandingScrollSnapping = false;

let isVideoStageVisible = true;
let isDocumentVisible =
  !document.hidden;

let glowReferenceVideo = video;

let pageCurtainState =
  pageCurtainRoot.classList.contains(
    "page-curtain-closed"
  )
    ? "closed"
    : "open";

let isPageCurtainAnimating =
  pageCurtainState !== "open";

let pageCurtainFallback = null;
let pageCurtainAnimationEndHandler = null;
let pageCurtainForceComplete = null;
let pageCurtainReloadRequested = false;

let leftLineStartOffset = 0;
let rightLineStartOffset = 0;

/* ========================================= */
/* SECTION: VIRTUELLE ZAHLENBEWEGUNG         */
/* ========================================= */
const numberPulleyDistance = 320;
const numberMotionSmoothing = 0.24;
const numberMotionStopThreshold = 0.05;

let numberMotionPosition = 0;
let numberMotionTarget = 0;
let numberMotionCycleHeight = 0;
let numberMotionScale = 0;
let numberMotionFrame = null;

let numberTracksLoopReady = false;

let lastNumberWindowScrollY =
  window.scrollY;

let numberMotionUsesVirtualInput =
  false;

/* ========================================= */
/* SECTION: LANDING WORTANPASSUNG STATUS     */
/* ========================================= */
const landingWordFitSafety = 0.92;
const landingWordFitStep = 0.005;

let landingWordFitFrame = null;
let landingWordResizeObserver = null;
let landingWordMeasureElement = null;

/* ========================================= */
/* SECTION: VIDEO LAYER INITIALISIERUNG      */
/* ========================================= */
function initializeVideoLayers() {
  videoLayers.forEach(
    (layer, index) => {
      layer.muted = true;
      layer.loop = true;
      layer.playsInline = true;

      layer.classList.toggle(
        "is-active",
        index === currentSlideIndex
      );

      layer.setAttribute(
        "aria-hidden",
        String(
          index !== currentSlideIndex
        )
      );

      if (
        index !== currentSlideIndex
      ) {
        layer.pause();
      }
    }
  );
}

initializeVideoLayers();

/* ========================================= */
/* SECTION: LANDING TIMECODE                 */
/* ========================================= */
function initializeLandingTimecode() {
  const timecode =
    document.getElementById(
      "landingTimecode"
    );

  if (!timecode) {
    return;
  }

  const framesPerSecond = 24;
  const startFrame = 0;

  const finalFrame =
    (
      99 * 60 +
      59
    ) *
      framesPerSecond +
    23;

  const startTime = performance.now();
  let lastRenderedFrame = -1;

  function renderTimecode(currentTime) {
    const elapsedFrames = Math.floor(
      (
        currentTime -
        startTime
      ) /
        1000 *
        framesPerSecond
    );

    const currentFrame =
      startFrame +
      elapsedFrames;

    if (currentFrame > finalFrame) {
      timecode.textContent =
        "(ㆆ_ㆆ)";

      return;
    }

    if (
      currentFrame !==
      lastRenderedFrame
    ) {
      const totalSeconds = Math.floor(
        currentFrame /
        framesPerSecond
      );

      const minutes = Math.floor(
        totalSeconds /
        60
      );

      const seconds =
        totalSeconds %
        60;

      const frames =
        currentFrame %
        framesPerSecond;

      timecode.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}:` +
        `${String(frames).padStart(2, "0")}`;

      lastRenderedFrame =
        currentFrame;
    }

    window.requestAnimationFrame(
      renderTimecode
    );
  }

  window.requestAnimationFrame(
    renderTimecode
  );
}

initializeLandingTimecode();

/* ========================================= */
/* SECTION: PAGE CURTAIN                     */
/* ========================================= */
function isPageCurtainInteractionBlocked() {
  return (
    isPageCurtainAnimating ||
    pageCurtainState !== "open"
  );
}

function setPageCurtainState(state) {
  const validStates = [
    "closed",
    "opening",
    "open",
    "closing"
  ];

  if (!validStates.includes(state)) {
    return;
  }

  pageCurtainRoot.classList.remove(
    "page-curtain-closed",
    "page-curtain-opening",
    "page-curtain-open",
    "page-curtain-closing"
  );

  pageCurtainRoot.classList.add(
    `page-curtain-${state}`
  );

  pageCurtainState = state;
}

function clearPageCurtainCompletion() {
  if (
    pageCurtainAnimationEndHandler &&
    pageCurtainRightPanel
  ) {
    pageCurtainRightPanel
      .removeEventListener(
        "animationend",
        pageCurtainAnimationEndHandler
      );
  }

  pageCurtainAnimationEndHandler = null;

  if (pageCurtainFallback !== null) {
    window.clearTimeout(
      pageCurtainFallback
    );

    pageCurtainFallback = null;
  }

  pageCurtainForceComplete = null;
}

function waitForPageCurtainAnimation(
  expectedAnimationName,
  onComplete
) {
  clearPageCurtainCompletion();

  let completed = false;

  const finish = (
    reason = "animationend"
  ) => {
    if (completed) {
      return;
    }

    completed = true;

    if (
      pageCurtainAnimationEndHandler &&
      pageCurtainRightPanel
    ) {
      pageCurtainRightPanel
        .removeEventListener(
          "animationend",
          pageCurtainAnimationEndHandler
        );
    }

    pageCurtainAnimationEndHandler = null;

    if (pageCurtainFallback !== null) {
      window.clearTimeout(
        pageCurtainFallback
      );

      pageCurtainFallback = null;
    }

    pageCurtainForceComplete = null;

    onComplete(reason);
  };

  pageCurtainForceComplete = finish;

  pageCurtainAnimationEndHandler =
    (event) => {
      if (
        event.target !==
          pageCurtainRightPanel ||
        event.animationName !==
          expectedAnimationName
      ) {
        return;
      }

      finish("animationend");
    };

  if (pageCurtainRightPanel) {
    pageCurtainRightPanel
      .addEventListener(
        "animationend",
        pageCurtainAnimationEndHandler
      );
  }

  const fallbackDuration =
    reducedMotionQuery.matches
      ? 250
      : 1200;

  pageCurtainFallback =
    window.setTimeout(() => {
      finish("fallback");
    }, fallbackDuration);
}

function scrollPageToTopImmediately() {
  const previousScrollBehavior =
    pageCurtainRoot.style
      .scrollBehavior;

  pageCurtainRoot.style
    .scrollBehavior = "auto";

  window.scrollTo(0, 0);

  pageCurtainRoot.style
    .scrollBehavior =
      previousScrollBehavior;

  lastLandingScrollY = 0;
  lastNumberWindowScrollY = 0;
}

function openPageCurtain() {
  if (
    !pageCurtain ||
    pageCurtainState === "open" ||
    pageCurtainState === "opening" ||
    pageCurtainReloadRequested
  ) {
    return;
  }

  isPageCurtainAnimating = true;

  waitForPageCurtainAnimation(
    "page-curtain-open-right",
    () => {
      setPageCurtainState("open");
      isPageCurtainAnimating = false;
    }
  );

  setPageCurtainState("opening");
}

function reloadPageFromClosedCurtain() {
  if (!pageCurtainReloadRequested) {
    return;
  }

  setPageCurtainState("closed");
  isPageCurtainAnimating = true;

  scrollPageToTopImmediately();

  if (history.replaceState) {
    history.replaceState(
      null,
      "",
      `${window.location.pathname}` +
        `${window.location.search}`
    );
  }

  window.location.reload();
}

function closeCurtainAndReload(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (
    !pageCurtain ||
    pageCurtainReloadRequested ||
    pageCurtainState !== "open"
  ) {
    return;
  }

  pageCurtainReloadRequested = true;
  isPageCurtainAnimating = true;

  waitForPageCurtainAnimation(
    "page-curtain-close-right",
    reloadPageFromClosedCurtain
  );

  setPageCurtainState("closing");
}

function initializePageCurtainReloadLinks() {
  pageCurtainReloadLinks.forEach(
    (link) => {
      link.addEventListener(
        "click",
        closeCurtainAndReload
      );
    }
  );
}

function initializePageCurtain() {
  if (!pageCurtain) {
    pageCurtainState = "open";
    isPageCurtainAnimating = false;
    return;
  }

  setPageCurtainState("closed");
  isPageCurtainAnimating = true;

  scrollPageToTopImmediately();

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      openPageCurtain();
    });
  });
}

initializePageCurtainReloadLinks();

/* ========================================= */
/* SECTION: LANDING NAVIGATION               */
/* ========================================= */
function initializeLandingNavigation() {
  const navigation =
    document.querySelector(
      ".landing-topbar"
    );

  if (!navigation) {
    return;
  }

  navigation.addEventListener(
    "click",
    (event) => {
      if (isPageCurtainInteractionBlocked()) {
        event.preventDefault();
        return;
      }

      const link =
        event.target.closest(
          'a[href^="#"]'
        );

      if (
        !link ||
        !navigation.contains(link)
      ) {
        return;
      }

      const targetSelector =
        link.getAttribute("href");

      const target =
        document.querySelector(
          targetSelector
        );

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior:
          reducedMotionQuery.matches
            ? "auto"
            : "smooth",
        block: "start"
      });

      if (history.pushState) {
        history.pushState(
          null,
          "",
          targetSelector
        );
      }
    }
  );
}

initializeLandingNavigation();

/* ========================================= */
/* SECTION: VIDEO BACKLIGHT                  */
/* ========================================= */
function getVideoSource(media) {
  if (!media) {
    return "";
  }

  return (
    media.getAttribute("src") ||
    media.currentSrc ||
    ""
  );
}

function canGlowPlay() {
  return Boolean(
    glowVideo &&
    glowReferenceVideo &&
    isVideoStageVisible &&
    isDocumentVisible &&
    !glowReferenceVideo.paused &&
    !glowReferenceVideo.ended
  );
}

function setGlowVisibility(
  shouldShow
) {
  if (!glowVideo) {
    return;
  }

  glowVideo.classList.toggle(
    "is-active",
    shouldShow
  );
}

function pauseVideoGlow() {
  if (!glowVideo) {
    return;
  }

  setGlowVisibility(false);
  glowVideo.pause();
}

function syncVideoGlow(
  forceSync = false
) {
  if (
    !glowVideo ||
    !glowReferenceVideo ||
    glowVideo.readyState <
      HTMLMediaElement.HAVE_METADATA ||
    glowReferenceVideo.readyState <
      HTMLMediaElement.HAVE_METADATA
  ) {
    return;
  }

  glowVideo.playbackRate =
    glowReferenceVideo.playbackRate;

  const timeDifference = Math.abs(
    glowVideo.currentTime -
    glowReferenceVideo.currentTime
  );

  if (
    forceSync ||
    timeDifference > 0.35
  ) {
    try {
      glowVideo.currentTime =
        glowReferenceVideo.currentTime;
    } catch {
      /*
       * SECTION: Quellenwechsel kann
       * currentTime kurz blockieren.
       */
    }
  }
}

function activateVideoGlow(
  forceSync = false
) {
  if (
    !glowVideo ||
    !canGlowPlay()
  ) {
    pauseVideoGlow();
    return;
  }

  if (
    glowVideo.readyState <
    HTMLMediaElement.HAVE_CURRENT_DATA
  ) {
    setGlowVisibility(false);
    return;
  }

  syncVideoGlow(forceSync);

  const playPromise =
    glowVideo.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        if (canGlowPlay()) {
          setGlowVisibility(true);
        } else {
          pauseVideoGlow();
        }
      })
      .catch(() => {
        setGlowVisibility(false);
      });

    return;
  }

  setGlowVisibility(true);
}

function setVideoGlowSource(source) {
  if (
    !glowVideo ||
    !source
  ) {
    return;
  }

  pauseVideoGlow();

  const currentGlowSource =
    glowVideo.getAttribute("src");

  if (currentGlowSource === source) {
    activateVideoGlow(true);
    return;
  }

  glowVideo.src = source;
  glowVideo.load();
}

function handoffVideoGlow(
  transition
) {
  if (
    !transition ||
    transition.completed ||
    activeLandingTransition !==
      transition
  ) {
    return;
  }

  transition.glowHandedOff = true;

  glowReferenceVideo =
    transition.incoming;

  setVideoGlowSource(
    getVideoSource(
      transition.incoming
    )
  );
}

function initializeVideoGlow() {
  if (
    !glowVideo ||
    !video ||
    !videoStage
  ) {
    return;
  }

  glowVideo.muted = true;
  glowVideo.loop = true;
  glowVideo.playbackRate =
    video.playbackRate;

  setVideoGlowSource(
    getVideoSource(video)
  );

  videoLayers.forEach(
    (layer) => {
      layer.addEventListener(
        "play",
        () => {
          if (
            layer ===
            glowReferenceVideo
          ) {
            activateVideoGlow(true);
          }
        }
      );

      layer.addEventListener(
        "pause",
        () => {
          if (
            layer ===
            glowReferenceVideo
          ) {
            pauseVideoGlow();
          }
        }
      );

      layer.addEventListener(
        "seeking",
        () => {
          if (
            layer ===
            glowReferenceVideo
          ) {
            pauseVideoGlow();
          }
        }
      );

      layer.addEventListener(
        "seeked",
        () => {
          if (
            layer ===
            glowReferenceVideo
          ) {
            activateVideoGlow(true);
          }
        }
      );

      layer.addEventListener(
        "ended",
        () => {
          if (
            layer ===
            glowReferenceVideo
          ) {
            pauseVideoGlow();
          }
        }
      );

      layer.addEventListener(
        "ratechange",
        () => {
          if (
            layer ===
              glowReferenceVideo &&
            glowVideo
          ) {
            glowVideo.playbackRate =
              layer.playbackRate;
          }
        }
      );

      layer.addEventListener(
        "timeupdate",
        () => {
          if (
            layer ===
              glowReferenceVideo &&
            canGlowPlay() &&
            glowVideo.readyState >=
              HTMLMediaElement
                .HAVE_METADATA
          ) {
            syncVideoGlow(false);
          }
        }
      );
    }
  );

  glowVideo.addEventListener(
    "loadedmetadata",
    () => {
      syncVideoGlow(true);
    }
  );

  glowVideo.addEventListener(
    "canplay",
    () => {
      activateVideoGlow(true);
    }
  );

  glowVideo.addEventListener(
    "error",
    pauseVideoGlow
  );

  if ("IntersectionObserver" in window) {
    const videoGlowObserver =
      new IntersectionObserver(
        (entries) => {
          const [entry] = entries;

          isVideoStageVisible =
            Boolean(
              entry &&
              entry.isIntersecting
            );

          if (isVideoStageVisible) {
            activateVideoGlow(true);
          } else {
            pauseVideoGlow();
          }
        },
        {
          threshold: 0.01,
          rootMargin:
            "96px 0px 96px 0px"
        }
      );

    videoGlowObserver.observe(
      videoStage
    );
  }
}

initializeVideoGlow();

/* ========================================= */
/* SECTION: TEXT SETZEN                      */
/* ========================================= */
function getCurrentTextValue(
  item
) {
  const currentValue =
    item.element?.querySelector(
      ".landing-letter-current"
    );

  return currentValue || null;
}

function getLandingWordFitElement(
  value
) {
  if (!value) {
    return null;
  }

  return value.querySelector(
    ".landing-letter-fit"
  );
}

function ensureLandingWordFitElement(
  value
) {
  if (!value) {
    return null;
  }

  const existingFit =
    getLandingWordFitElement(value);

  if (existingFit) {
    return existingFit;
  }

  const fit =
    document.createElement("span");

  fit.className =
    "landing-letter-fit";

  fit.textContent =
    value.textContent
      .replace(/\s+/g, " ")
      .trim();

  value.textContent = "";
  value.appendChild(fit);

  return fit;
}

function setLandingWordText(
  value,
  text
) {
  const fit =
    ensureLandingWordFitElement(
      value
    );

  if (!fit) {
    return;
  }

  fit.textContent = text;
  fit.style.setProperty(
    "--word-fit-scale",
    "1"
  );

  fit.style.setProperty(
    "--word-fit-size",
    "1em"
  );
}

function resetTextTrack(item) {
  const track =
    item.element?.querySelector(
      ".landing-letter-track"
    );

  if (!track) {
    return null;
  }

  track
    .querySelectorAll(
      ".landing-letter-next"
    )
    .forEach(
      (value) => value.remove()
    );

  track.classList.remove(
    "roll-up",
    "roll-down",
    "is-animating"
  );

  track.style.transform = "";

  return track;
}

function updateTexts(index) {
  const slide = slides[index];

  rollingTextItems.forEach(
    (item) => {
      if (!item.element) {
        return;
      }

      resetTextTrack(item);

      const currentValue =
        getCurrentTextValue(item);

      if (currentValue) {
        setLandingWordText(
          currentValue,
          slide[item.key]
        );
      } else {
        item.element.textContent =
          slide[item.key];
      }
    }
  );

  fitLandingWordsNow();
}

function prepareRollingTexts(
  index,
  direction
) {
  const slide = slides[index];

  const tracks =
    rollingTextItems
      .map((item) => {
        if (!item.element) {
          return null;
        }

        const track =
          resetTextTrack(item);

        if (!track) {
          return null;
        }

        const nextValue =
          document.createElement(
            "span"
          );

        nextValue.className =
          "landing-letter-value " +
          "landing-letter-next";

        setLandingWordText(
          nextValue,
          slide[item.key]
        );

        track.appendChild(nextValue);

        const shouldRollUp =
          item.reverseDirection
            ? direction < 0
            : direction > 0;

        track.classList.add(
          shouldRollUp
            ? "roll-up"
            : "roll-down"
        );

        return track;
      })
      .filter(Boolean);

  /*
   * SECTION: Eingehende und ausgehende
   * Wörter werden vor dem Animationsstart
   * im gemeinsamen sichtbaren Bereich
   * individuell eingepasst.
   */
  fitLandingWordsNow();

  return tracks;
}

function startRollingTexts(
  tracks
) {
  tracks.forEach(
    (track) => {
      track.classList.add(
        "is-animating"
      );
    }
  );
}

/* ========================================= */
/* SECTION: LANDING WORTANPASSUNG MESSUNG    */
/* ========================================= */
function ensureLandingWordMeasureElement() {
  if (landingWordMeasureElement) {
    return landingWordMeasureElement;
  }

  const measure =
    document.createElement("span");

  measure.setAttribute(
    "aria-hidden",
    "true"
  );

  Object.assign(
    measure.style,
    {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      zIndex: "-1",
      display: "inline-block",
      width: "max-content",
      maxWidth: "none",
      padding: "0",
      margin: "0",
      border: "0",
      visibility: "hidden",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      contain: "layout style"
    }
  );

  document.body.appendChild(measure);

  landingWordMeasureElement =
    measure;

  return measure;
}

function measureLandingWordText(
  reference,
  text
) {
  if (!reference) {
    return 0;
  }

  const measure =
    ensureLandingWordMeasureElement();

  const styles =
    window.getComputedStyle(reference);

  measure.style.fontFamily =
    styles.fontFamily;

  measure.style.fontSize =
    styles.fontSize;

  measure.style.fontWeight =
    styles.fontWeight;

  measure.style.fontStyle =
    styles.fontStyle;

  measure.style.fontStretch =
    styles.fontStretch;

  measure.style.letterSpacing =
    styles.letterSpacing;

  measure.style.textTransform =
    styles.textTransform;

  measure.style.fontKerning =
    styles.fontKerning;

  measure.style.fontFeatureSettings =
    styles.fontFeatureSettings;

  measure.style.fontVariationSettings =
    styles.fontVariationSettings;

  measure.textContent =
    String(text)
      .replace(/\s+/g, " ")
      .trim();

  return measure
    .getBoundingClientRect()
    .width;
}

function getLandingWordItem(
  key
) {
  return (
    rollingTextItems.find(
      (item) =>
        item.key === key
    ) ||
    null
  );
}

function getLandingWordReference(
  item
) {
  const currentValue =
    getCurrentTextValue(item);

  return ensureLandingWordFitElement(
    currentValue
  );
}

function getMaximumLandingWordWidth(
  item
) {
  const reference =
    getLandingWordReference(item);

  if (!reference) {
    return 0;
  }

  return Math.max(
    ...slides.map(
      (slide) =>
        measureLandingWordText(
          reference,
          slide[item.key]
        )
    ),
    0
  );
}

/* ========================================= */
/* SECTION: LANDING WORTANPASSUNG BEREICH    */
/* ========================================= */
function setLandingWordAreaWidth(
  element,
  width
) {
  if (
    !element ||
    !Number.isFinite(width)
  ) {
    return;
  }

  element.style.setProperty(
    "--landing-word-area-width",
    `${Math.max(width, 1)}px`
  );
}

function updateLandingWordAreaWidths() {
  if (!videoStage) {
    return;
  }

  const stageRect =
    videoStage.getBoundingClientRect();

  const viewportWidth =
    document.documentElement
      .clientWidth;

  const edgeSafety =
    Math.min(
      Math.max(
        viewportWidth * 0.03,
        10
      ),
      36
    );

  const areaGap =
    Math.min(
      Math.max(
        stageRect.width * 0.025,
        7
      ),
      18
    );

  const largeMaximum =
    Math.min(
      viewportWidth * 0.4,
      32 * 16
    );

  const leftAreaWidth =
    Math.min(
      Math.max(
        stageRect.left -
          edgeSafety -
          areaGap,
        1
      ),
      largeMaximum
    );

  const rightAreaWidth =
    Math.min(
      Math.max(
        viewportWidth -
          stageRect.right -
          edgeSafety -
          areaGap,
        1
      ),
      largeMaximum
    );

  setLandingWordAreaWidth(
    textLeft,
    leftAreaWidth
  );

  setLandingWordAreaWidth(
    textRight,
    rightAreaWidth
  );

  const topLeftItem =
    getLandingWordItem(
      "topLeft"
    );

  const topRightItem =
    getLandingWordItem(
      "topRight"
    );

  const topLeftDemand =
    topLeftItem
      ? getMaximumLandingWordWidth(
          topLeftItem
        )
      : 1;

  const topRightDemand =
    topRightItem
      ? getMaximumLandingWordWidth(
          topRightItem
        )
      : 1;

  const topTotalWidth =
    Math.max(
      stageRect.width -
        areaGap,
      1
    );

  const demandTotal =
    Math.max(
      topLeftDemand +
        topRightDemand,
      1
    );

  const proportionalShare =
    topLeftDemand /
    demandTotal;

  const topLeftShare =
    Math.min(
      Math.max(
        proportionalShare,
        0.28
      ),
      0.42
    );

  const topLeftWidth =
    topTotalWidth *
    topLeftShare;

  const topRightWidth =
    topTotalWidth -
    topLeftWidth;

  setLandingWordAreaWidth(
    textTopLeft,
    topLeftWidth
  );

  setLandingWordAreaWidth(
    textTopRight,
    topRightWidth
  );

  const bottomWidth =
    Math.min(
      Math.max(
        stageRect.width * 1.35,
        stageRect.width
      ),
      Math.max(
        viewportWidth -
          edgeSafety * 2,
        1
      )
    );

  setLandingWordAreaWidth(
    textBottomCenter,
    bottomWidth
  );
}

/* ========================================= */
/* SECTION: LANDING WORTANPASSUNG FIT        */
/* ========================================= */
function fitLandingWordsNow() {
  if (
    !videoOverlay ||
    !videoStage
  ) {
    return;
  }

  rollingTextItems.forEach(
    (item) => {
      const currentValue =
        getCurrentTextValue(item);

      ensureLandingWordFitElement(
        currentValue
      );
    }
  );

  const fitElements =
    Array.from(
      videoOverlay.querySelectorAll(
        ".landing-letter-fit"
      )
    );

  if (fitElements.length === 0) {
    videoOverlay.classList.add(
      "is-word-fit-ready"
    );

    return;
  }

  /*
   * SECTION: Zuerst alle Werte auf ihre
   * natürliche Designgröße setzen.
   * Danach werden die Bereiche bestimmt,
   * alle Maße gelesen und erst anschließend
   * gesammelt geschrieben.
   */
  fitElements.forEach(
    (fit) => {
      fit.style.setProperty(
        "--word-fit-scale",
        "1"
      );

      fit.style.setProperty(
        "--word-fit-size",
        "1em"
      );
    }
  );

  updateLandingWordAreaWidths();

  const measurements =
    fitElements.map(
      (fit) => {
        const value =
          fit.closest(
            ".landing-letter-value"
          );

        const availableWidth =
          value
            ? value.clientWidth *
              landingWordFitSafety
            : 0;

        const naturalWidth =
          measureLandingWordText(
            fit,
            fit.textContent
          );

        const baseFontSize =
          Number.parseFloat(
            window
              .getComputedStyle(fit)
              .fontSize
          ) || 16;

        let scale =
          naturalWidth > 0 &&
          availableWidth > 0
            ? Math.min(
                availableWidth /
                  naturalWidth,
                1
              )
            : 1;

        /*
         * SECTION: Leichtes Abrunden sorgt
         * für einen stabilen Sicherheitsrand
         * und verhindert Subpixel-Clipping.
         */
        scale =
          Math.floor(
            scale /
              landingWordFitStep
          ) *
          landingWordFitStep;

        const safeScale =
          Math.min(
            Math.max(scale, 0.01),
            1
          );

        return {
          fit,
          scale: safeScale,
          fontSize:
            baseFontSize *
            safeScale
        };
      }
    );

  measurements.forEach(
    ({
      fit,
      scale,
      fontSize
    }) => {
      fit.style.setProperty(
        "--word-fit-scale",
        String(scale)
      );

      fit.style.setProperty(
        "--word-fit-size",
        `${fontSize}px`
      );
    }
  );

  /*
   * SECTION: Ein kurzer Kontrollpass
   * gleicht browserabhängige Unterschiede
   * zwischen Messspan und gerendertem Wort
   * aus, ohne die Animation zu verändern.
   */
  measurements.forEach(
    (measurement) => {
      const value =
        measurement.fit.closest(
          ".landing-letter-value"
        );

      if (!value) {
        return;
      }

      const availableWidth =
        value.clientWidth *
        landingWordFitSafety;

      const renderedWidth =
        measurement.fit
          .getBoundingClientRect()
          .width;

      if (
        renderedWidth <=
          availableWidth ||
        renderedWidth <= 0 ||
        availableWidth <= 0
      ) {
        return;
      }

      const correction =
        (
          availableWidth /
          renderedWidth
        ) *
        0.99;

      const correctedScale =
        measurement.scale *
        correction;

      const correctedFontSize =
        measurement.fontSize *
        correction;

      measurement.fit.style.setProperty(
        "--word-fit-scale",
        String(correctedScale)
      );

      measurement.fit.style.setProperty(
        "--word-fit-size",
        `${correctedFontSize}px`
      );
    }
  );

  videoOverlay.classList.add(
    "is-word-fit-ready"
  );
}

function scheduleLandingWordFit() {
  if (landingWordFitFrame !== null) {
    return;
  }

  landingWordFitFrame =
    window.requestAnimationFrame(
      () => {
        landingWordFitFrame = null;
        fitLandingWordsNow();
      }
    );
}

function initializeLandingWordFit() {
  rollingTextItems.forEach(
    (item) => {
      const currentValue =
        getCurrentTextValue(item);

      ensureLandingWordFitElement(
        currentValue
      );
    }
  );

  fitLandingWordsNow();

  if (
    document.fonts &&
    document.fonts.ready
  ) {
    document.fonts.ready
      .then(() => {
        scheduleLandingWordFit();
      })
      .catch(() => {
        scheduleLandingWordFit();
      });
  } else {
    window.requestAnimationFrame(
      scheduleLandingWordFit
    );
  }

  if (
    "ResizeObserver" in window &&
    videoStage
  ) {
    landingWordResizeObserver =
      new ResizeObserver(() => {
        scheduleLandingWordFit();
      });

    landingWordResizeObserver.observe(
      videoStage
    );
  }
}

/* ========================================= */
/* SECTION: LANDING TRANSITION HILFEN        */
/* ========================================= */
function isLandingInViewport() {
  if (!landing) {
    return false;
  }

  const rect =
    landing.getBoundingClientRect();

  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight
  );
}

function getVideoLayer(index) {
  return (
    videoLayers[index] ||
    null
  );
}

function resetVideoTransitionClasses(
  layer
) {
  if (!layer) {
    return;
  }

  layer.classList.remove(
    "is-incoming",
    "is-entering-next",
    "is-entering-previous",
    "is-animating"
  );

  layer.style.clipPath = "";
  layer.style.webkitMaskSize = "";
  layer.style.maskSize = "";
}

function waitForVideoFrame(media) {
  if (
    !media ||
    media.readyState >=
      HTMLMediaElement.HAVE_CURRENT_DATA
  ) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;

      media.removeEventListener(
        "loadeddata",
        finish
      );

      media.removeEventListener(
        "canplay",
        finish
      );

      media.removeEventListener(
        "error",
        finish
      );

      window.clearTimeout(
        readinessFallback
      );

      resolve();
    };

    const readinessFallback =
      window.setTimeout(
        finish,
        1800
      );

    media.addEventListener(
      "loadeddata",
      finish
    );

    media.addEventListener(
      "canplay",
      finish
    );

    media.addEventListener(
      "error",
      finish
    );
  });
}

async function prepareIncomingVideo(
  incoming,
  outgoing
) {
  incoming.muted = true;
  incoming.loop = true;
  incoming.playsInline = true;
  incoming.playbackRate =
    outgoing.playbackRate;

  incoming.pause();

  try {
    if (
      incoming.readyState >=
      HTMLMediaElement.HAVE_METADATA
    ) {
      incoming.currentTime = 0;
    }
  } catch {
    /*
     * SECTION: Noch nicht geladene
     * Metadaten werden unten abgewartet.
     */
  }

  const preloadPromise =
    incoming.play();

  if (preloadPromise !== undefined) {
    preloadPromise.catch(() => {});
  }

  await waitForVideoFrame(incoming);

  if (
    activeLandingTransition?.incoming !==
    incoming
  ) {
    return;
  }

  try {
    incoming.currentTime = 0;
  } catch {
    /*
     * SECTION: Bei blockiertem Seeking
     * bleibt der erste verfügbare Frame.
     */
  }

  const playPromise =
    incoming.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  return Boolean(
    !incoming.error &&
    incoming.readyState >=
      HTMLMediaElement.HAVE_CURRENT_DATA
  );
}

/* ========================================= */
/* SECTION: LANDING GESTENSPERRE             */
/* ========================================= */
function normalizeWheelDelta(event) {
  if (!event) {
    return 0;
  }

  let multiplier = 1;

  if (
    event.deltaMode ===
    WheelEvent.DOM_DELTA_LINE
  ) {
    multiplier = 16;
  } else if (
    event.deltaMode ===
    WheelEvent.DOM_DELTA_PAGE
  ) {
    multiplier =
      window.innerHeight;
  }

  return event.deltaY * multiplier;
}

function getLandingScrollMetrics() {
  if (!landing) {
    return null;
  }

  const rect =
    landing.getBoundingClientRect();

  const top =
    window.scrollY +
    rect.top;

  const maxScrollable =
    Math.max(
      landing.offsetHeight -
        window.innerHeight,
      0
    );

  const step =
    slides.length > 0
      ? maxScrollable /
        slides.length
      : 0;

  return {
    top,
    maxScrollable,
    step,
    exit:
      top +
      maxScrollable
  };
}

function getLandingSlideScrollPosition(
  index
) {
  const metrics =
    getLandingScrollMetrics();

  if (!metrics) {
    return window.scrollY;
  }

  const safeIndex =
    Math.min(
      Math.max(index, 0),
      slides.length - 1
    );

  return (
    metrics.top +
    metrics.step *
      safeIndex
  );
}

function isLandingScrollControlled() {
  const metrics =
    getLandingScrollMetrics();

  if (!metrics) {
    return false;
  }

  const tolerance = 2;

  return (
    window.scrollY >=
      metrics.top -
        tolerance &&
    window.scrollY <=
      metrics.exit +
        tolerance
  );
}

function resetLandingScrollAccumulators() {
  landingScrollAccumulator = 0;
  landingScrollDirection = 0;
  landingExitScroll = 0;
}

function clearScrollGestureIdleTimer() {
  if (
    scrollGestureIdleTimer !== null
  ) {
    window.clearTimeout(
      scrollGestureIdleTimer
    );

    scrollGestureIdleTimer = null;
  }
}

function releaseScrollGestureIfReady() {
  if (
    isLandingTransitioning ||
    !isScrollGestureIdle
  ) {
    return;
  }

  isScrollGestureLocked = false;
}

function scheduleScrollGestureIdle() {
  clearScrollGestureIdleTimer();

  scrollGestureIdleTimer =
    window.setTimeout(() => {
      isScrollGestureIdle = true;

      resetLandingScrollAccumulators();
      releaseScrollGestureIfReady();

      scrollGestureIdleTimer = null;
    }, landingGestureIdleDelay);
}

function registerWheelActivity(
  normalizedDelta
) {
  const direction =
    Math.sign(normalizedDelta);

  if (direction !== 0) {
    lastWheelDirection =
      direction;

    lastWheelTimestamp =
      performance.now();
  }

  isScrollGestureIdle = false;
  scheduleScrollGestureIdle();
}

function consumeScrollGesture() {
  isScrollGestureLocked = true;

  resetLandingScrollAccumulators();
}

function snapLandingScrollTo(
  targetPosition
) {
  if (
    !Number.isFinite(
      targetPosition
    )
  ) {
    return;
  }

  const root =
    document.documentElement;

  const previousScrollBehavior =
    root.style.scrollBehavior;

  isLandingScrollSnapping = true;
  root.style.scrollBehavior = "auto";

  window.scrollTo(
    0,
    Math.round(targetPosition)
  );

  lastNumberWindowScrollY =
    window.scrollY;

  numberMotionUsesVirtualInput =
    isLandingScrollControlled();

  root.style.scrollBehavior =
    previousScrollBehavior;

  window.requestAnimationFrame(() => {
    isLandingScrollSnapping = false;

    lastNumberWindowScrollY =
      window.scrollY;

    numberMotionUsesVirtualInput =
      isLandingScrollControlled();
  });
}

function snapLandingScrollToSlide(
  index
) {
  snapLandingScrollTo(
    getLandingSlideScrollPosition(
      index
    )
  );
}

function snapLandingScrollToExit() {
  const metrics =
    getLandingScrollMetrics();

  if (!metrics) {
    return;
  }

  snapLandingScrollTo(
    metrics.exit
  );
}

function updateDirectionalAccumulator(
  direction,
  amount
) {
  if (
    direction !==
    landingScrollDirection
  ) {
    landingScrollAccumulator = 0;
    landingExitScroll = 0;

    landingScrollDirection =
      direction;
  }

  landingScrollAccumulator +=
    Math.abs(amount);
}

function handleLandingExitWheel(
  event,
  normalizedDelta
) {
  const direction =
    Math.sign(normalizedDelta);

  if (
    currentSlideIndex !==
      slides.length - 1 ||
    direction <= 0
  ) {
    return false;
  }

  if (isLandingExitUnlocked) {
    const metrics =
      getLandingScrollMetrics();

    if (
      metrics &&
      window.scrollY >=
        metrics.exit - 2
    ) {
      return false;
    }
  }

  event.preventDefault();

  if (
    landingScrollDirection !== 1
  ) {
    landingExitScroll = 0;
    landingScrollAccumulator = 0;
    landingScrollDirection = 1;
  }

  landingExitScroll +=
    Math.abs(normalizedDelta);

  if (
    landingExitScroll <
    landingExitThreshold
  ) {
    return true;
  }

  landingExitScroll = 0;
  isLandingExitUnlocked = true;

  consumeScrollGesture();
  snapLandingScrollToExit();

  return true;
}

function handleLandingWheel(event) {
  if (isPageCurtainInteractionBlocked()) {
    event.preventDefault();
    return;
  }

  const normalizedDelta =
    normalizeWheelDelta(event);

  if (normalizedDelta === 0) {
    return;
  }

  registerWheelActivity(
    normalizedDelta
  );

  const landingScrollControlled =
    isLandingScrollControlled();

  /*
   * SECTION: Innerhalb der kontrollierten
   * Landingpage ist das Eingabedelta die
   * einzige Quelle der Zahlenbewegung.
   * Dies geschieht bewusst vor allen
   * Video- und Gestensperren.
   */
  if (landingScrollControlled) {
    numberMotionUsesVirtualInput =
      true;

    lastNumberWindowScrollY =
      window.scrollY;

    addNumberMotionDelta(
      normalizedDelta
    );
  }

  if (!landingScrollControlled) {
    return;
  }

  if (
    isLandingTransitioning ||
    isScrollGestureLocked
  ) {
    event.preventDefault();
    return;
  }

  const direction =
    Math.sign(normalizedDelta);

  if (
    direction < 0
  ) {
    landingExitScroll = 0;
    isLandingExitUnlocked = false;
  }

  if (
    handleLandingExitWheel(
      event,
      normalizedDelta
    )
  ) {
    return;
  }

  if (
    currentSlideIndex === 0 &&
    direction < 0
  ) {
    event.preventDefault();
    resetLandingScrollAccumulators();
    return;
  }

  updateDirectionalAccumulator(
    direction,
    normalizedDelta
  );

  const targetIndex =
    currentSlideIndex +
    direction;

  if (
    targetIndex < 0 ||
    targetIndex >= slides.length ||
    landingScrollAccumulator <
      landingScrollThreshold
  ) {
    return;
  }

  const metrics =
    getLandingScrollMetrics();

  if (!metrics) {
    return;
  }

  const transitionBoundary =
    direction > 0
      ? metrics.top +
        metrics.step *
          targetIndex
      : metrics.top +
        metrics.step *
          currentSlideIndex;

  const predictedScrollPosition =
    window.scrollY +
    normalizedDelta;

  const reachesBoundary =
    direction > 0
      ? predictedScrollPosition >=
          transitionBoundary
      : predictedScrollPosition <=
          transitionBoundary;

  if (!reachesBoundary) {
    return;
  }

  event.preventDefault();

  requestLandingTransition(
    direction
  );
}

/* ========================================= */
/* SECTION: LANDING TRANSITION ABBRUCH       */
/* ========================================= */
function cancelLandingTransition(
  transition
) {
  if (
    !transition ||
    transition.completed ||
    activeLandingTransition !==
      transition
  ) {
    return;
  }

  transition.completed = true;

  if (
    transition.animationEndHandler
  ) {
    transition.incoming
      .removeEventListener(
        "animationend",
        transition.animationEndHandler
      );
  }

  if (
    landingTransitionFallback !==
    null
  ) {
    window.clearTimeout(
      landingTransitionFallback
    );

    landingTransitionFallback =
      null;
  }

  if (
    glowHandoffTimeout !== null
  ) {
    window.clearTimeout(
      glowHandoffTimeout
    );

    glowHandoffTimeout = null;
  }

  resetVideoTransitionClasses(
    transition.incoming
  );

  transition.incoming
    .classList.remove(
      "is-active"
    );

  transition.incoming
    .setAttribute(
      "aria-hidden",
      "true"
    );

  transition.incoming.pause();

  transition.outgoing
    .classList.add(
      "is-active"
    );

  transition.outgoing
    .setAttribute(
      "aria-hidden",
      "false"
    );

  video = transition.outgoing;
  glowReferenceVideo = video;

  updateTexts(currentSlideIndex);

  activeLandingTransition = null;
  isLandingTransitioning = false;

  resetLandingScrollAccumulators();
  snapLandingScrollToSlide(
    currentSlideIndex
  );

  activateVideoGlow(true);
  releaseScrollGestureIfReady();
}

/* ========================================= */
/* SECTION: LANDING TRANSITION ABSCHLUSS     */
/* ========================================= */
function finishLandingTransition(
  reason = "animation"
) {
  const transition =
    activeLandingTransition;

  if (
    !transition ||
    transition.completed
  ) {
    return;
  }

  if (!transition.glowHandedOff) {
    handoffVideoGlow(transition);
  }

  transition.completed = true;

  if (
    transition.animationEndHandler
  ) {
    transition.incoming
      .removeEventListener(
        "animationend",
        transition.animationEndHandler
      );
  }

  if (
    landingTransitionFallback !==
    null
  ) {
    window.clearTimeout(
      landingTransitionFallback
    );

    landingTransitionFallback =
      null;
  }

  if (
    glowHandoffTimeout !== null
  ) {
    window.clearTimeout(
      glowHandoffTimeout
    );

    glowHandoffTimeout = null;
  }

  videoLayers.forEach(
    (layer, index) => {
      resetVideoTransitionClasses(
        layer
      );

      const isNewActive =
        index ===
        transition.targetIndex;

      layer.classList.toggle(
        "is-active",
        isNewActive
      );

      layer.setAttribute(
        "aria-hidden",
        String(!isNewActive)
      );

      if (!isNewActive) {
        layer.pause();
      }
    }
  );

  transition.incoming.classList.add(
    "is-active"
  );

  video = transition.incoming;
  glowReferenceVideo = video;
  currentSlideIndex =
    transition.targetIndex;

  updateTexts(currentSlideIndex);

  const playPromise =
    video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  setVideoGlowSource(
    getVideoSource(video)
  );

  activeLandingTransition = null;
  isLandingTransitioning = false;

  isLandingExitUnlocked = false;
  resetLandingScrollAccumulators();

  snapLandingScrollToSlide(
    currentSlideIndex
  );

  releaseScrollGestureIfReady();

  /*
   * SECTION: reason dient ausschließlich
   * der eindeutigen Abschlussdiagnose.
   */
  void reason;
}

/* ========================================= */
/* SECTION: LANDING TRANSITION START         */
/* ========================================= */
function startLandingTransitionAnimation(
  transition
) {
  if (
    !transition ||
    transition.completed ||
    activeLandingTransition !==
      transition
  ) {
    return;
  }

  const expectedAnimationName =
    transition.direction > 0
      ? "landing-curtain-next"
      : "landing-curtain-previous";

  transition.animationEndHandler =
    (event) => {
      if (
        event.target !==
          transition.incoming ||
        event.animationName !==
          expectedAnimationName
      ) {
        return;
      }

      finishLandingTransition(
        "animationend"
      );
    };

  transition.incoming
    .addEventListener(
      "animationend",
      transition.animationEndHandler
    );

  const fallbackDuration =
    reducedMotionQuery.matches
      ? 250
      : 1200;

  landingTransitionFallback =
    window.setTimeout(() => {
      finishLandingTransition(
        "fallback"
      );
    }, fallbackDuration);

  const glowDelay =
    reducedMotionQuery.matches
      ? 10
      : 650;

  glowHandoffTimeout =
    window.setTimeout(() => {
      handoffVideoGlow(
        transition
      );
    }, glowDelay);

  transition.incoming.classList.add(
    "is-animating"
  );

  startRollingTexts(
    transition.textTracks
  );
}

/* ========================================= */
/* SECTION: LANDING TRANSITION ANFORDERN     */
/* ========================================= */
async function requestLandingTransition(
  direction
) {
  if (
    direction !== 1 &&
    direction !== -1
  ) {
    return false;
  }

  if (
    isPageCurtainInteractionBlocked() ||
    isLandingTransitioning ||
    isScrollGestureLocked ||
    !isLandingInViewport() ||
    !isLandingScrollControlled()
  ) {
    return false;
  }

  const targetIndex =
    currentSlideIndex +
    direction;

  if (
    targetIndex < 0 ||
    targetIndex >= slides.length
  ) {
    return false;
  }

  const outgoing =
    getVideoLayer(
      currentSlideIndex
    );

  const incoming =
    getVideoLayer(targetIndex);

  if (
    !outgoing ||
    !incoming
  ) {
    return false;
  }

  isLandingTransitioning = true;
  consumeScrollGesture();

  isLandingExitUnlocked = false;

  const transition = {
    direction,
    targetIndex,
    outgoing,
    incoming,
    textTracks: [],
    animationEndHandler: null,
    glowHandedOff: false,
    completed: false
  };

  activeLandingTransition =
    transition;

  resetVideoTransitionClasses(
    incoming
  );

  const incomingReady =
    await prepareIncomingVideo(
      incoming,
      outgoing
    );

  if (
    transition.completed ||
    activeLandingTransition !==
      transition
  ) {
    return false;
  }

  if (!incomingReady) {
    cancelLandingTransition(
      transition
    );

    return false;
  }

  incoming.classList.add(
    "is-incoming",
    direction > 0
      ? "is-entering-next"
      : "is-entering-previous"
  );

  incoming.setAttribute(
    "aria-hidden",
    "false"
  );

  transition.textTracks =
    prepareRollingTexts(
      targetIndex,
      direction
    );

  /*
   * SECTION: Ein Reflow fixiert den
   * geschlossenen Ausgangszustand.
   */
  void incoming.offsetWidth;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      startLandingTransitionAnimation(
        transition
      );
    });
  });

  return true;
}

/* ========================================= */
/* SECTION: VIDEO WECHSELN                   */
/* ========================================= */
function updateVideo(
  index,
  scrollDirection = 0
) {
  if (
    index === currentSlideIndex ||
    isLandingTransitioning ||
    isScrollGestureLocked
  ) {
    return;
  }

  const mappedDirection =
    index > currentSlideIndex
      ? 1
      : -1;

  const direction =
    scrollDirection === 0
      ? mappedDirection
      : scrollDirection;

  if (
    direction !== mappedDirection ||
    direction !==
      landingScrollDirection ||
    landingScrollAccumulator <
      landingScrollThreshold
  ) {
    return;
  }

  requestLandingTransition(
    direction
  );
}

/* ========================================= */
/* SECTION: ZAHLEN ENDLOSSCHLEIFE            */
/* ========================================= */
function initializeNumberTrackLoop(
  track
) {
  if (
    !track ||
    track.dataset.numberLoopReady ===
      "true"
  ) {
    return;
  }

  const originalNumbers =
    Array.from(track.children);

  if (originalNumbers.length === 0) {
    return;
  }

  const beforeNumbers =
    originalNumbers.map(
      (number) =>
        number.cloneNode(true)
    );

  const afterNumbers =
    originalNumbers.map(
      (number) =>
        number.cloneNode(true)
    );

  beforeNumbers[0].dataset.numberCycle =
    "before";

  originalNumbers[0].dataset.numberCycle =
    "middle";

  afterNumbers[0].dataset.numberCycle =
    "after";

  const beforeFragment =
    document.createDocumentFragment();

  const afterFragment =
    document.createDocumentFragment();

  beforeNumbers.forEach(
    (number) => {
      beforeFragment.appendChild(number);
    }
  );

  afterNumbers.forEach(
    (number) => {
      afterFragment.appendChild(number);
    }
  );

  track.prepend(beforeFragment);
  track.append(afterFragment);

  track.dataset.numberLoopReady =
    "true";
}

function initializeNumberTrackLoops() {
  if (numberTracksLoopReady) {
    return;
  }

  initializeNumberTrackLoop(
    leftLineTrack
  );

  initializeNumberTrackLoop(
    rightLineTrack
  );

  numberTracksLoopReady = true;
}

/* ========================================= */
/* SECTION: ZAHLEN STARTPOSITION             */
/* ========================================= */
function getLineStartOffset(
  track,
  startValue
) {
  if (!track) {
    return 0;
  }

  const middleStart =
    track.querySelector(
      '[data-number-cycle="middle"]'
    );

  const fallbackStart =
    Array.from(track.children).find(
      (number) =>
        number.textContent.trim() ===
        String(startValue)
    );

  const startNumber =
    middleStart ||
    fallbackStart;

  if (!startNumber) {
    return 0;
  }

  return -startNumber.offsetTop;
}

function getNumberCycleHeight(track) {
  if (!track) {
    return 0;
  }

  const middleStart =
    track.querySelector(
      '[data-number-cycle="middle"]'
    );

  const afterStart =
    track.querySelector(
      '[data-number-cycle="after"]'
    );

  if (
    !middleStart ||
    !afterStart
  ) {
    return 0;
  }

  return Math.max(
    afterStart.offsetTop -
      middleStart.offsetTop,
    0
  );
}

/* ========================================= */
/* SECTION: ZAHLEN BEWEGUNGSSKALIERUNG       */
/* ========================================= */
function updateNumberMotionScale() {
  const metrics =
    getLandingScrollMetrics();

  numberMotionScale =
    metrics &&
    metrics.maxScrollable > 0
      ? numberPulleyDistance /
        metrics.maxScrollable
      : 0;
}

function getLoopedNumberMotionPosition(
  value
) {
  if (
    !Number.isFinite(value) ||
    numberMotionCycleHeight <= 0
  ) {
    return 0;
  }

  const halfCycle =
    numberMotionCycleHeight / 2;

  return (
    (
      (
        value +
        halfCycle
      ) %
        numberMotionCycleHeight +
      numberMotionCycleHeight
    ) %
      numberMotionCycleHeight -
    halfCycle
  );
}

/* ========================================= */
/* SECTION: ZAHLEN TRANSFORM                 */
/* ========================================= */
function applyNumberMotionTransform() {
  const loopedPosition =
    getLoopedNumberMotionPosition(
      numberMotionPosition
    );

  const leftOffset =
    leftLineStartOffset +
    loopedPosition;

  const rightOffset =
    rightLineStartOffset -
    loopedPosition;

  if (leftLineTrack) {
    leftLineTrack.style.transform =
      `translate3d(-50%, ` +
      `${leftOffset}px, 0)`;
  }

  if (rightLineTrack) {
    rightLineTrack.style.transform =
      `translate3d(-50%, ` +
      `${rightOffset}px, 0)`;
  }
}

function renderNumberMotion() {
  const difference =
    numberMotionTarget -
    numberMotionPosition;

  if (
    Math.abs(difference) <=
    numberMotionStopThreshold
  ) {
    numberMotionPosition =
      numberMotionTarget;

    applyNumberMotionTransform();

    numberMotionFrame = null;
    return;
  }

  numberMotionPosition +=
    difference *
    numberMotionSmoothing;

  applyNumberMotionTransform();

  numberMotionFrame =
    window.requestAnimationFrame(
      renderNumberMotion
    );
}

function scheduleNumberMotionRender() {
  if (numberMotionFrame !== null) {
    return;
  }

  numberMotionFrame =
    window.requestAnimationFrame(
      renderNumberMotion
    );
}

function addNumberMotionDelta(delta) {
  if (
    !Number.isFinite(delta) ||
    numberMotionScale <= 0
  ) {
    return;
  }

  numberMotionTarget +=
    delta *
    numberMotionScale;

  scheduleNumberMotionRender();
}

/* ========================================= */
/* SECTION: ZAHLEN BEWEGUNGSQUELLE           */
/* ========================================= */
function updateNumberMotionFromWindowScroll(
  currentScrollY
) {
  const actualScrollDelta =
    currentScrollY -
    lastNumberWindowScrollY;

  const usesVirtualInputNow =
    isLandingScrollControlled() ||
    isLandingScrollSnapping;

  const sourceChanged =
    usesVirtualInputNow !==
    numberMotionUsesVirtualInput;

  /*
   * SECTION: Beim Wechsel zwischen
   * virtuellem Landing-Delta und realem
   * Seitenscroll wird nur die Referenz
   * neu gesetzt. Dadurch wird derselbe
   * Impuls niemals doppelt gezählt.
   */
  if (
    !usesVirtualInputNow &&
    !sourceChanged &&
    !isLandingScrollSnapping
  ) {
    addNumberMotionDelta(
      actualScrollDelta
    );
  }

  lastNumberWindowScrollY =
    currentScrollY;

  numberMotionUsesVirtualInput =
    usesVirtualInputNow;
}

/* ========================================= */
/* SECTION: ZAHLEN LAYOUTMESSUNG             */
/* ========================================= */
function updateLineStartOffsets(
  resetMotion = false
) {
  initializeNumberTrackLoops();

  const previousCycleHeight =
    numberMotionCycleHeight;

  leftLineStartOffset =
    getLineStartOffset(
      leftLineTrack,
      100
    );

  rightLineStartOffset =
    getLineStartOffset(
      rightLineTrack,
      990
    );

  const leftCycleHeight =
    getNumberCycleHeight(
      leftLineTrack
    );

  const rightCycleHeight =
    getNumberCycleHeight(
      rightLineTrack
    );

  const availableCycleHeights = [
    leftCycleHeight,
    rightCycleHeight
  ].filter(
    (height) => height > 0
  );

  numberMotionCycleHeight =
    availableCycleHeights.length > 0
      ? Math.min(
          ...availableCycleHeights
        )
      : 0;

  updateNumberMotionScale();

  if (resetMotion) {
    numberMotionPosition = 0;
    numberMotionTarget = 0;
  } else if (
    previousCycleHeight > 0 &&
    numberMotionCycleHeight > 0
  ) {
    const resizeRatio =
      numberMotionCycleHeight /
      previousCycleHeight;

    numberMotionPosition *=
      resizeRatio;

    numberMotionTarget *=
      resizeRatio;
  }

  lastNumberWindowScrollY =
    window.scrollY;

  numberMotionUsesVirtualInput =
    isLandingScrollControlled();

  applyNumberMotionTransform();

  if (landingLines) {
    landingLines.classList.add(
      "is-ready"
    );
  }
}

/* ========================================= */
/* SECTION: SCROLL -> SLIDE MAPPING          */
/* ========================================= */
function handleLandingScroll(
  scrollDirection = 0
) {
  if (!landing) {
    return;
  }

  const rect =
    landing.getBoundingClientRect();

  const landingTop =
    window.scrollY +
    rect.top;

  const landingHeight =
    landing.offsetHeight;

  const scrollInsideLanding =
    window.scrollY -
    landingTop;

  const maxScrollableInsideLanding =
    landingHeight -
    window.innerHeight;

  const isBelowLanding =
    scrollInsideLanding >
      maxScrollableInsideLanding +
        1;

  const returnedFromBelow =
    wasBelowLanding &&
    !isBelowLanding &&
    scrollDirection < 0 &&
    performance.now() -
      lastWheelTimestamp <
      500;

  wasBelowLanding =
    isBelowLanding;

  if (returnedFromBelow) {
    isLandingExitUnlocked = false;
    resetLandingScrollAccumulators();

    setLandingStateImmediately(
      slides.length - 1
    );

    isScrollGestureLocked = true;
    isScrollGestureIdle = false;

    snapLandingScrollToExit();
  }

  const progress = Math.min(
    Math.max(
      scrollInsideLanding /
      maxScrollableInsideLanding,
      0
    ),
    1
  );

  const rawIndex =
    Math.floor(
      progress *
      slides.length
    );

  const nextIndex =
    Math.min(
      rawIndex,
      slides.length - 1
    );

  if (
    rect.bottom <= 0 &&
    (
      currentSlideIndex !==
        slides.length - 1 ||
      isLandingTransitioning
    )
  ) {
    setLandingStateImmediately(
      slides.length - 1
    );
  } else if (
    scrollInsideLanding <= 0 &&
    (
      currentSlideIndex !== 0 ||
      isLandingTransitioning
    )
  ) {
    setLandingStateImmediately(0);
  } else if (
    !returnedFromBelow &&
    !isLandingScrollSnapping
  ) {
    updateVideo(
      nextIndex,
      scrollDirection
    );
  }

  if (landingLines) {
    const firstAccordionViewportEnd =
      firstExperienceTrigger
        ? firstExperienceTrigger
            .getBoundingClientRect()
            .top
        : rect.bottom;

    const visibleLineHeight =
      Math.min(
        Math.max(
          firstAccordionViewportEnd,
          0
        ),
        window.innerHeight
      );

    landingLines.style.height =
      `${visibleLineHeight}px`;
  }
}

/* ========================================= */
/* SECTION: LANDING SOFORTZUSTAND            */
/* ========================================= */
function setLandingStateImmediately(
  index
) {
  const safeIndex =
    Math.min(
      Math.max(index, 0),
      slides.length - 1
    );

  if (activeLandingTransition) {
    activeLandingTransition.completed =
      true;

    if (
      activeLandingTransition
        .animationEndHandler
    ) {
      activeLandingTransition
        .incoming
        .removeEventListener(
          "animationend",
          activeLandingTransition
            .animationEndHandler
        );
    }
  }

  if (
    landingTransitionFallback !==
    null
  ) {
    window.clearTimeout(
      landingTransitionFallback
    );

    landingTransitionFallback =
      null;
  }

  if (
    glowHandoffTimeout !== null
  ) {
    window.clearTimeout(
      glowHandoffTimeout
    );

    glowHandoffTimeout = null;
  }

  videoLayers.forEach(
    (layer, layerIndex) => {
      resetVideoTransitionClasses(
        layer
      );

      const isActive =
        layerIndex === safeIndex;

      layer.classList.toggle(
        "is-active",
        isActive
      );

      layer.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      if (!isActive) {
        layer.pause();
      }
    }
  );

  currentSlideIndex = safeIndex;
  video =
    getVideoLayer(safeIndex);

  glowReferenceVideo = video;

  updateTexts(safeIndex);

  activeLandingTransition = null;
  isLandingTransitioning = false;

  resetLandingScrollAccumulators();

  lastLandingScrollY =
    window.scrollY;

  if (video) {
    const playPromise =
      video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    setVideoGlowSource(
      getVideoSource(video)
    );
  }
}

updateLineStartOffsets(true);
initializeLandingWordFit();
initializePageCurtain();

/* ========================================= */
/* SECTION: EVENTS                           */
/* ========================================= */
if ("scrollRestoration" in history) {
  history.scrollRestoration =
    "manual";
}

window.addEventListener(
  "wheel",
  handleLandingWheel,
  {
    passive: false
  }
);


/* ========================================= */
/* SECTION: PAGE CURTAIN INTERAKTIONSSPERRE  */
/* ========================================= */
document.addEventListener(
  "keydown",
  (event) => {
    if (!isPageCurtainInteractionBlocked()) {
      return;
    }

    const blockedKeys = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " "
    ];

    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  true
);

window.addEventListener(
  "scroll",
  () => {
    const currentScrollY =
      window.scrollY;

    if (isPageCurtainInteractionBlocked()) {
      lastLandingScrollY =
        currentScrollY;

      lastNumberWindowScrollY =
        currentScrollY;

      return;
    }

    updateNumberMotionFromWindowScroll(
      currentScrollY
    );

    const scrollDirection =
      Math.sign(
        currentScrollY -
        lastLandingScrollY
      );

    lastLandingScrollY =
      currentScrollY;

    handleLandingScroll(
      scrollDirection
    );
  }
);

window.addEventListener(
  "resize",
  () => {
    updateLineStartOffsets(false);
    scheduleLandingWordFit();

    if (
      isLandingTransitioning
    ) {
      finishLandingTransition(
        "resize"
      );
    }

    if (
      isLandingScrollControlled()
    ) {
      snapLandingScrollToSlide(
        currentSlideIndex
      );
    }

    handleLandingScroll();
  }
);

window.addEventListener(
  "load",
  () => {
    window.scrollTo(0, 0);

    isScrollGestureLocked = false;
    isScrollGestureIdle = true;
    isLandingExitUnlocked = false;

    clearScrollGestureIdleTimer();
    resetLandingScrollAccumulators();

    setLandingStateImmediately(0);
    updateLineStartOffsets(true);

    const metrics =
      getLandingScrollMetrics();

    wasBelowLanding =
      Boolean(
        metrics &&
        window.scrollY >
          metrics.exit
      );

    handleLandingScroll();

    window.setTimeout(() => {
      window.scrollTo(0, 0);

      lastNumberWindowScrollY =
        window.scrollY;

      numberMotionUsesVirtualInput =
        isLandingScrollControlled();

      handleLandingScroll();
    }, 1);
  }
);

window.addEventListener(
  "pageshow",
  () => {
    window.scrollTo(0, 0);

    isScrollGestureLocked = false;
    isScrollGestureIdle = true;
    isLandingExitUnlocked = false;

    clearScrollGestureIdleTimer();
    resetLandingScrollAccumulators();

    setLandingStateImmediately(0);
    updateLineStartOffsets(true);
    handleLandingScroll();
  }
);

document.addEventListener(
  "visibilitychange",
  () => {
    isDocumentVisible =
      !document.hidden;

    if (
      isDocumentVisible &&
      pageCurtainForceComplete &&
      (
        pageCurtainState === "opening" ||
        pageCurtainState === "closing"
      )
    ) {
      pageCurtainForceComplete(
        "visibility"
      );
    }

    if (
      document.hidden &&
      isLandingTransitioning
    ) {
      finishLandingTransition(
        "visibility"
      );
    }

    clearScrollGestureIdleTimer();

    isScrollGestureIdle = true;
    isScrollGestureLocked = false;
    isLandingExitUnlocked = false;

    resetLandingScrollAccumulators();

    if (isDocumentVisible) {
      if (
        isLandingScrollControlled()
      ) {
        snapLandingScrollToSlide(
          currentSlideIndex
        );
      }

      lastNumberWindowScrollY =
        window.scrollY;

      numberMotionUsesVirtualInput =
        isLandingScrollControlled();

      activateVideoGlow(true);
    } else {
      pauseVideoGlow();
    }
  }
);

/* ========================================= */
/* SECTION: Projekte & Erfahrung             */
/* ========================================= */
const experienceAccordion =
  document.querySelector(
    "[data-experience-accordion]"
  );

if (experienceAccordion) {
  const experienceItems = Array.from(
    experienceAccordion.querySelectorAll(
      ".experience-item"
    )
  );

  const rootStyles =
    getComputedStyle(document.documentElement);

  const closeDurationValue =
    rootStyles
      .getPropertyValue(
        "--experience-duration-close"
      )
      .trim();

  function parseExperienceDuration(value) {
    if (value.endsWith("ms")) {
      return Number.parseFloat(value);
    }

    if (value.endsWith("s")) {
      return Number.parseFloat(value) * 1000;
    }

    return 260;
  }

  const experienceCloseDuration =
    parseExperienceDuration(
      closeDurationValue
    );

  let experienceSwitchTimeout = null;

  function setExperienceItemState(
    item,
    shouldOpen
  ) {
    const trigger = item.querySelector(
      ".experience-trigger"
    );

    const panel = item.querySelector(
      ".experience-panel"
    );

    if (!trigger || !panel) {
      return;
    }

    item.classList.toggle(
      "is-open",
      shouldOpen
    );

    trigger.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    panel.setAttribute(
      "aria-hidden",
      String(!shouldOpen)
    );
  }

  function getOpenExperienceItem() {
    return experienceItems.find(
      (item) =>
        item.classList.contains("is-open")
    );
  }

  experienceItems.forEach((item) => {
    const trigger = item.querySelector(
      ".experience-trigger"
    );

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", () => {
      if (experienceSwitchTimeout) {
        clearTimeout(
          experienceSwitchTimeout
        );

        experienceSwitchTimeout = null;
      }

      const currentlyOpenItem =
        getOpenExperienceItem();

      const clickedItemIsOpen =
        item.classList.contains("is-open");

      /*
       * Klick auf den bereits geöffneten Eintrag:
       * nur schließen.
       */
      if (clickedItemIsOpen) {
        setExperienceItemState(
          item,
          false
        );

        return;
      }

      /*
       * Kein anderer Eintrag ist geöffnet:
       * neuen Eintrag sofort öffnen.
       */
      if (!currentlyOpenItem) {
        setExperienceItemState(
          item,
          true
        );

        return;
      }

      /*
       * Beim Wechsel:
       * zuerst den bisherigen Eintrag sichtbar
       * schließen, anschließend den neuen öffnen.
       */
      setExperienceItemState(
        currentlyOpenItem,
        false
      );

      experienceSwitchTimeout =
        window.setTimeout(() => {
          setExperienceItemState(
            item,
            true
          );

          experienceSwitchTimeout = null;
        }, experienceCloseDuration);
    });
  });
}
