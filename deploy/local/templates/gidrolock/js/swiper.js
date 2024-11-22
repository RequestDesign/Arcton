"use strict";
(self["webpackChunkwebpack_example"] = self["webpackChunkwebpack_example"] || []).push([[390],{

/***/ 217:
/***/ (function(__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) {


// UNUSED EXPORTS: A11y, Autoplay, Controller, EffectCards, EffectCoverflow, EffectCreative, EffectCube, EffectFade, EffectFlip, FreeMode, Grid, HashNavigation, History, Keyboard, Manipulation, Mousewheel, Navigation, Pagination, Parallax, Scrollbar, Thumbs, Virtual, Zoom

// EXTERNAL MODULE: ./node_modules/swiper/shared/ssr-window.esm.mjs
var ssr_window_esm = __webpack_require__(433);
// EXTERNAL MODULE: ./node_modules/swiper/shared/utils.mjs
var utils = __webpack_require__(185);
;// CONCATENATED MODULE: ./node_modules/swiper/modules/virtual.mjs



function Virtual(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  });
  let cssModeTimeout;
  const document = getDocument();
  swiper.virtual = {
    cache: {},
    from: undefined,
    to: undefined,
    slides: [],
    offset: 0,
    slidesGrid: []
  };
  const tempDOM = document.createElement('div');
  function renderSlide(slide, index) {
    const params = swiper.params.virtual;
    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }
    // eslint-disable-next-line
    let slideEl;
    if (params.renderSlide) {
      slideEl = params.renderSlide.call(swiper, slide, index);
      if (typeof slideEl === 'string') {
        tempDOM.innerHTML = slideEl;
        slideEl = tempDOM.children[0];
      }
    } else if (swiper.isElement) {
      slideEl = createElement('swiper-slide');
    } else {
      slideEl = createElement('div', swiper.params.slideClass);
    }
    slideEl.setAttribute('data-swiper-slide-index', index);
    if (!params.renderSlide) {
      slideEl.innerHTML = slide;
    }
    if (params.cache) {
      swiper.virtual.cache[index] = slideEl;
    }
    return slideEl;
  }
  function update(force, beforeInit) {
    const {
      slidesPerView,
      slidesPerGroup,
      centeredSlides,
      loop: isLoop,
      initialSlide
    } = swiper.params;
    if (beforeInit && !isLoop && initialSlide > 0) {
      return;
    }
    const {
      addSlidesBefore,
      addSlidesAfter
    } = swiper.params.virtual;
    const {
      from: previousFrom,
      to: previousTo,
      slides,
      slidesGrid: previousSlidesGrid,
      offset: previousOffset
    } = swiper.virtual;
    if (!swiper.params.cssMode) {
      swiper.updateActiveIndex();
    }
    const activeIndex = swiper.activeIndex || 0;
    let offsetProp;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
    let slidesAfter;
    let slidesBefore;
    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = (isLoop ? slidesPerView : slidesPerGroup) + addSlidesBefore;
    }
    let from = activeIndex - slidesBefore;
    let to = activeIndex + slidesAfter;
    if (!isLoop) {
      from = Math.max(from, 0);
      to = Math.min(to, slides.length - 1);
    }
    let offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    if (isLoop && activeIndex >= slidesBefore) {
      from -= slidesBefore;
      if (!centeredSlides) offset += swiper.slidesGrid[0];
    } else if (isLoop && activeIndex < slidesBefore) {
      from = -slidesBefore;
      if (centeredSlides) offset += swiper.slidesGrid[0];
    }
    Object.assign(swiper.virtual, {
      from,
      to,
      offset,
      slidesGrid: swiper.slidesGrid,
      slidesBefore,
      slidesAfter
    });
    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      emit('virtualUpdate');
    }
    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.forEach(slideEl => {
          slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
        });
      }
      swiper.updateProgress();
      emit('virtualUpdate');
      return;
    }
    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset,
        from,
        to,
        slides: function getSlides() {
          const slidesToRender = [];
          for (let i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }
          return slidesToRender;
        }()
      });
      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      } else {
        emit('virtualUpdate');
      }
      return;
    }
    const prependIndexes = [];
    const appendIndexes = [];
    const getSlideIndex = index => {
      let slideIndex = index;
      if (index < 0) {
        slideIndex = slides.length + index;
      } else if (slideIndex >= slides.length) {
        // eslint-disable-next-line
        slideIndex = slideIndex - slides.length;
      }
      return slideIndex;
    };
    if (force) {
      swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`)).forEach(slideEl => {
        slideEl.remove();
      });
    } else {
      for (let i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          const slideIndex = getSlideIndex(i);
          swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`)).forEach(slideEl => {
            slideEl.remove();
          });
        }
      }
    }
    const loopFrom = isLoop ? -slides.length : 0;
    const loopTo = isLoop ? slides.length * 2 : slides.length;
    for (let i = loopFrom; i < loopTo; i += 1) {
      if (i >= from && i <= to) {
        const slideIndex = getSlideIndex(i);
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(slideIndex);
        } else {
          if (i > previousTo) appendIndexes.push(slideIndex);
          if (i < previousFrom) prependIndexes.push(slideIndex);
        }
      }
    }
    appendIndexes.forEach(index => {
      swiper.slidesEl.append(renderSlide(slides[index], index));
    });
    if (isLoop) {
      for (let i = prependIndexes.length - 1; i >= 0; i -= 1) {
        const index = prependIndexes[i];
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      }
    } else {
      prependIndexes.sort((a, b) => b - a);
      prependIndexes.forEach(index => {
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      });
    }
    elementChildren(swiper.slidesEl, '.swiper-slide, swiper-slide').forEach(slideEl => {
      slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
    });
    onRendered();
  }
  function appendSlide(slides) {
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }
    update(true);
  }
  function prependSlide(slides) {
    const activeIndex = swiper.activeIndex;
    let newActiveIndex = activeIndex + 1;
    let numberOfNewSlides = 1;
    if (Array.isArray(slides)) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }
    if (swiper.params.virtual.cache) {
      const cache = swiper.virtual.cache;
      const newCache = {};
      Object.keys(cache).forEach(cachedIndex => {
        const cachedEl = cache[cachedIndex];
        const cachedElIndex = cachedEl.getAttribute('data-swiper-slide-index');
        if (cachedElIndex) {
          cachedEl.setAttribute('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
        }
        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cachedEl;
      });
      swiper.virtual.cache = newCache;
    }
    update(true);
    swiper.slideTo(newActiveIndex, 0);
  }
  function removeSlide(slidesIndexes) {
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    let activeIndex = swiper.activeIndex;
    if (Array.isArray(slidesIndexes)) {
      for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
          // shift cache indexes
          Object.keys(swiper.virtual.cache).forEach(key => {
            if (key > slidesIndexes) {
              swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
              swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
              delete swiper.virtual.cache[key];
            }
          });
        }
        swiper.virtual.slides.splice(slidesIndexes[i], 1);
        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
        // shift cache indexes
        Object.keys(swiper.virtual.cache).forEach(key => {
          if (key > slidesIndexes) {
            swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
            swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
            delete swiper.virtual.cache[key];
          }
        });
      }
      swiper.virtual.slides.splice(slidesIndexes, 1);
      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }
    update(true);
    swiper.slideTo(activeIndex, 0);
  }
  function removeAllSlides() {
    swiper.virtual.slides = [];
    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }
    update(true);
    swiper.slideTo(0, 0);
  }
  on('beforeInit', () => {
    if (!swiper.params.virtual.enabled) return;
    let domSlidesAssigned;
    if (typeof swiper.passedParams.virtual.slides === 'undefined') {
      const slides = [...swiper.slidesEl.children].filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`));
      if (slides && slides.length) {
        swiper.virtual.slides = [...slides];
        domSlidesAssigned = true;
        slides.forEach((slideEl, slideIndex) => {
          slideEl.setAttribute('data-swiper-slide-index', slideIndex);
          swiper.virtual.cache[slideIndex] = slideEl;
          slideEl.remove();
        });
      }
    }
    if (!domSlidesAssigned) {
      swiper.virtual.slides = swiper.params.virtual.slides;
    }
    swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
    update(false, true);
  });
  on('setTranslate', () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode && !swiper._immediateVirtual) {
      clearTimeout(cssModeTimeout);
      cssModeTimeout = setTimeout(() => {
        update();
      }, 100);
    } else {
      update();
    }
  });
  on('init update resize', () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode) {
      setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
    }
  });
  Object.assign(swiper.virtual, {
    appendSlide,
    prependSlide,
    removeSlide,
    removeAllSlides,
    update
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/keyboard.mjs



/* eslint-disable consistent-return */
function Keyboard(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document = getDocument();
  const window = getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });
  function handle(event) {
    if (!swiper.enabled) return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    const kc = e.keyCode || e.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40;
    // Directions locks
    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }
    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }
    if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }
    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false;
      // Check that swiper should be inside of visible area of window
      if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
        return undefined;
      }
      const el = swiper.el;
      const swiperWidth = el.clientWidth;
      const swiperHeight = el.clientHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const swiperOffset = elementOffset(el);
      if (rtl) swiperOffset.left -= el.scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];
        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line
          inView = true;
        }
      }
      if (!inView) return undefined;
    }
    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }
    emit('keyPress', kc);
    return undefined;
  }
  function enable() {
    if (swiper.keyboard.enabled) return;
    document.addEventListener('keydown', handle);
    swiper.keyboard.enabled = true;
  }
  function disable() {
    if (!swiper.keyboard.enabled) return;
    document.removeEventListener('keydown', handle);
    swiper.keyboard.enabled = false;
  }
  on('init', () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/mousewheel.mjs



/* eslint-disable consistent-return */
function Mousewheel(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const window = getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null,
      noMousewheelClass: 'swiper-no-mousewheel'
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];
  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0; // spinX, spinY
    let pX = 0;
    let pY = 0; // pixelX, pixelY

    // Legacy
    if ('detail' in e) {
      sY = e.detail;
    }
    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ('deltaY' in e) {
      pY = e.deltaY;
    }
    if ('deltaX' in e) {
      pX = e.deltaX;
    }
    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }
    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }
  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }
  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }
    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    }

    // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).
    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    }
    // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.
    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit('scroll', newEvent.raw);
    }
    // If you got here is because an animation has been triggered so store the current time
    lastScrollTime = new window.Date().getTime();
    // Return false as a default
    return false;
  }
  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;
    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }
    return false;
  }
  function handle(event) {
    let e = event;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;

    // Ignore event if the target or its parents have the swiper-no-mousewheel class
    if (event.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)) return;
    const params = swiper.params.mousewheel;
    if (swiper.params.cssMode) {
      e.preventDefault();
    }
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    const targetElContainsTarget = targetEl && targetEl.contains(e.target);
    if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e);
    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }
    if (delta === 0) return true;
    if (params.invert) delta = -delta;

    // Get the scroll positions
    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();

    // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.
    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();
    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      };

      // Keep the most recent events
      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent);

      // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.
      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      }

      // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.
      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:

      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;
        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }
        if (swiper.params.loop) {
          swiper.loopFix({
            direction: newEvent.direction < 0 ? 'next' : 'prev',
            byMousewheel: true
          });
        }
        if (swiper.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;
          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);
          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              if (swiper.destroyed || !swiper.params) return;
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              if (swiper.destroyed || !swiper.params) return;
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        }

        // Emit event
        if (!ignoreWheelEvents) emit('scroll', e);

        // Stop autoplay
        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop();
        // Return page scroll on edge positions
        if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
          return true;
        }
      }
    }
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  }
  function events(method) {
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    targetEl[method]('mouseenter', handleMouseEnter);
    targetEl[method]('mouseleave', handleMouseLeave);
    targetEl[method]('wheel', handle);
  }
  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }
    if (swiper.mousewheel.enabled) return false;
    events('addEventListener');
    swiper.mousewheel.enabled = true;
    return true;
  }
  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }
    if (!swiper.mousewheel.enabled) return false;
    events('removeEventListener');
    swiper.mousewheel.enabled = false;
    return true;
  }
  on('init', () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }
    if (swiper.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (swiper.params.cssMode) {
      enable();
    }
    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-element-if-not-defined.mjs


function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement('div', checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/navigation.mjs



function Navigation(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock',
      navigationDisabledClass: 'swiper-navigation-disabled'
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null
  };
  function getEl(el) {
    let res;
    if (el && typeof el === 'string' && swiper.isElement) {
      res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === 'string') res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === 'string' && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      } else if (res && res.length === 1) {
        res = res[0];
      }
    }
    if (el && !res) return el;
    // if (Array.isArray(res) && res.length === 1) res = res[0];
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      if (subEl) {
        subEl.classList[disabled ? 'add' : 'remove'](...params.disabledClass.split(' '));
        if (subEl.tagName === 'BUTTON') subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
        }
      }
    });
  }
  function update() {
    // Update Navigation Buttons
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit('navigationPrev');
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit('navigationNext');
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        el.addEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(' '));
      }
    };
    nextEl.forEach(el => initButton(el, 'next'));
    prevEl.forEach(el => initButton(el, 'prev'));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(' '));
    };
    nextEl.forEach(el => destroyButton(el, 'next'));
    prevEl.forEach(el => destroyButton(el, 'prev'));
  }
  on('init', () => {
    if (swiper.params.navigation.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      update();
    }
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (swiper.enabled) {
      update();
      return;
    }
    [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.add(swiper.params.navigation.lockClass));
  });
  on('click', (_s, e) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e.target;
    let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
    if (swiper.isElement && !targetIsButton) {
      const path = e.path || e.composedPath && e.composedPath();
      if (path) {
        targetIsButton = path.find(pathEl => nextEl.includes(pathEl) || prevEl.includes(pathEl));
      }
    }
    if (swiper.params.navigation.hideOnClick && !targetIsButton) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }
      [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(' '));
    init();
    update();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(' '));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/pagination.mjs




function Pagination(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const pfx = 'swiper-pagination';
  extendParams({
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: number => number,
      formatFractionTotal: number => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
  }
  function setSideBullets(bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    if (!bulletEl) return;
    bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function getMoveDirection(prevIndex, nextIndex, length) {
    prevIndex = prevIndex % length;
    nextIndex = nextIndex % length;
    if (nextIndex === prevIndex + 1) {
      return 'next';
    } else if (nextIndex === prevIndex - 1) {
      return 'previous';
    }
    return;
  }
  function onBulletClick(e) {
    const bulletEl = e.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
    if (!bulletEl) {
      return;
    }
    e.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index) return;
      const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
      if (moveDirection === 'next') {
        swiper.slideNext();
      } else if (moveDirection === 'previous') {
        swiper.slidePrev();
      } else {
        swiper.slideToLoop(index);
      }
    } else {
      swiper.slideTo(index);
    }
  }
  function update() {
    // Render || Update Pagination bullets/items
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    // Current/Total
    let current;
    let previousIndex;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    // Types
    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? 'width' : 'height', true);
        el.forEach(subEl => {
          subEl.style[swiper.isHorizontal() ? 'width' : 'height'] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== undefined) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach(bulletEl => {
        const classesToRemove = [...['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`)].map(s => typeof s === 'string' && s.includes(' ') ? s.split(' ') : s).flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach(bullet => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(' '));
          } else if (swiper.isElement) {
            bullet.setAttribute('part', 'bullet');
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(...`${params.bulletActiveClass}-main`.split(' '));
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, 'prev');
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, 'next');
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(' '));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute('part', bulletIndex === current ? 'bullet-active' : 'bullet');
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i = firstIndex; i <= lastIndex; i += 1) {
            if (bullets[i]) {
              bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(' '));
            }
          }
          setSideBullets(firstDisplayedBullet, 'prev');
          setSideBullets(lastDisplayedBullet, 'next');
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? 'right' : 'left';
        bullets.forEach(bullet => {
          bullet.style[swiper.isHorizontal() ? offsetProp : 'top'] = `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === 'fraction') {
        subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach(fractionEl => {
          fractionEl.textContent = params.formatFractionCurrent(current + 1);
        });
        subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach(totalEl => {
          totalEl.textContent = params.formatFractionTotal(total);
        });
      }
      if (params.type === 'progressbar') {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
        } else {
          progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === 'horizontal') {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach(progressEl => {
          progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
          progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
        });
      }
      if (params.type === 'custom' && params.renderCustom) {
        subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
        if (subElIndex === 0) emit('paginationRender', subEl);
      } else {
        if (subElIndex === 0) emit('paginationRender', subEl);
        emit('paginationUpdate', subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
      }
    });
  }
  function render() {
    // Render Container
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = '';
    if (params.type === 'bullets') {
      let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          // prettier-ignore
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ''} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach(subEl => {
      if (params.type !== 'custom') {
        subEl.innerHTML = paginationHTML || '';
      }
      if (params.type === 'bullets') {
        swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
      }
    });
    if (params.type !== 'custom') {
      emit('paginationRender', el[0]);
    }
  }
  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: 'swiper-pagination'
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let el;
    if (typeof params.el === 'string' && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === 'string') {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0) return;
    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && Array.isArray(el) && el.length > 1) {
      el = [...swiper.el.querySelectorAll(params.el)];
      // check if it belongs to another nested Swiper
      if (el.length > 1) {
        el = el.filter(subEl => {
          if (elementParents(subEl, '.swiper')[0] !== swiper.el) return false;
          return true;
        })[0];
      }
    }
    if (Array.isArray(el) && el.length === 1) el = el[0];
    Object.assign(swiper.pagination, {
      el
    });
    el = makeElementsArray(el);
    el.forEach(subEl => {
      if (params.type === 'bullets' && params.clickable) {
        subEl.classList.add(...(params.clickableClass || '').split(' '));
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      if (params.type === 'bullets' && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === 'progressbar' && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener('click', onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.clickable) {
          subEl.classList.remove(...(params.clickableClass || '').split(' '));
          subEl.removeEventListener('click', onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets) swiper.pagination.bullets.forEach(subEl => subEl.classList.remove(...params.bulletActiveClass.split(' ')));
  }
  on('changeDirection', () => {
    if (!swiper.pagination || !swiper.pagination.el) return;
    const params = swiper.params.pagination;
    let {
      el
    } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on('init', () => {
    if (swiper.params.pagination.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      render();
      update();
    }
  });
  on('activeIndexChange', () => {
    if (typeof swiper.snapIndex === 'undefined') {
      update();
    }
  });
  on('snapIndexChange', () => {
    update();
  });
  on('snapGridLengthChange', () => {
    render();
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList[swiper.enabled ? 'remove' : 'add'](swiper.params.pagination.lockClass));
    }
  });
  on('lock unlock', () => {
    update();
  });
  on('click', (_s, e) => {
    const targetEl = e.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit('paginationShow');
      } else {
        emit('paginationHide');
      }
      el.forEach(subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
    }
    init();
    render();
    update();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach(subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/scrollbar.mjs





function Scrollbar(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag',
      scrollbarDisabledClass: 'swiper-scrollbar-disabled',
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null
  };
  function setTranslate() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    const progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;
    if (rtl) {
      newPos = -newPos;
      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }
    if (swiper.isHorizontal()) {
      dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
      dragEl.style.width = `${newSize}px`;
    } else {
      dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
      dragEl.style.height = `${newSize}px`;
    }
    if (params.hide) {
      clearTimeout(timeout);
      el.style.opacity = 1;
      timeout = setTimeout(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = '400ms';
      }, 1000);
    }
  }
  function setTransition(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
  }
  function updateSize() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    dragEl.style.width = '';
    dragEl.style.height = '';
    trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }
    if (swiper.isHorizontal()) {
      dragEl.style.width = `${dragSize}px`;
    } else {
      dragEl.style.height = `${dragSize}px`;
    }
    if (divider >= 1) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
    if (swiper.params.scrollbar.hide) {
      el.style.opacity = 0;
    }
    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.el.classList[swiper.isLocked ? 'add' : 'remove'](swiper.params.scrollbar.lockClass);
    }
  }
  function getPointerPosition(e) {
    return swiper.isHorizontal() ? e.clientX : e.clientY;
  }
  function setDragPosition(e) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e) - elementOffset(el)[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);
    if (rtl) {
      positionRatio = 1 - positionRatio;
    }
    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  function onDragStart(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e.target === dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
    e.preventDefault();
    e.stopPropagation();
    wrapperEl.style.transitionDuration = '100ms';
    dragEl.style.transitionDuration = '100ms';
    setDragPosition(e);
    clearTimeout(dragTimeout);
    el.style.transitionDuration = '0ms';
    if (params.hide) {
      el.style.opacity = 1;
    }
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style['scroll-snap-type'] = 'none';
    }
    emit('scrollbarDragStart', e);
  }
  function onDragMove(e) {
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    if (!isTouched) return;
    if (e.preventDefault && e.cancelable) e.preventDefault();else e.returnValue = false;
    setDragPosition(e);
    wrapperEl.style.transitionDuration = '0ms';
    el.style.transitionDuration = '0ms';
    dragEl.style.transitionDuration = '0ms';
    emit('scrollbarDragMove', e);
  }
  function onDragEnd(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el
    } = scrollbar;
    if (!isTouched) return;
    isTouched = false;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style['scroll-snap-type'] = '';
      wrapperEl.style.transitionDuration = '';
    }
    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = '400ms';
      }, 1000);
    }
    emit('scrollbarDragEnd', e);
    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }
  function events(method) {
    const {
      scrollbar,
      params
    } = swiper;
    const el = scrollbar.el;
    if (!el) return;
    const target = el;
    const activeListener = params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;
    const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
    target[eventMethod]('pointerdown', onDragStart, activeListener);
    document[eventMethod]('pointermove', onDragMove, activeListener);
    document[eventMethod]('pointerup', onDragEnd, passiveListener);
  }
  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('on');
  }
  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('off');
  }
  function init() {
    const {
      scrollbar,
      el: swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: 'swiper-scrollbar'
    });
    const params = swiper.params.scrollbar;
    if (!params.el) return;
    let el;
    if (typeof params.el === 'string' && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === 'string') {
      el = document.querySelectorAll(params.el);
      if (!el.length) return;
    } else if (!el) {
      el = params.el;
    }
    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
      el = swiperEl.querySelector(params.el);
    }
    if (el.length > 0) el = el[0];
    el.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let dragEl;
    if (el) {
      dragEl = el.querySelector(classesToSelector(swiper.params.scrollbar.dragClass));
      if (!dragEl) {
        dragEl = createElement('div', swiper.params.scrollbar.dragClass);
        el.append(dragEl);
      }
    }
    Object.assign(scrollbar, {
      el,
      dragEl
    });
    if (params.draggable) {
      enableDraggable();
    }
    if (el) {
      el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  }
  function destroy() {
    const params = swiper.params.scrollbar;
    const el = swiper.scrollbar.el;
    if (el) {
      el.classList.remove(...classesToTokens(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass));
    }
    disableDraggable();
  }
  on('changeDirection', () => {
    if (!swiper.scrollbar || !swiper.scrollbar.el) return;
    const params = swiper.params.scrollbar;
    let {
      el
    } = swiper.scrollbar;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on('init', () => {
    if (swiper.params.scrollbar.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      updateSize();
      setTranslate();
    }
  });
  on('update resize observerUpdate lock unlock changeDirection', () => {
    updateSize();
  });
  on('setTranslate', () => {
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    setTransition(duration);
  });
  on('enable disable', () => {
    const {
      el
    } = swiper.scrollbar;
    if (el) {
      el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  });
  on('destroy', () => {
    destroy();
  });
  const enable = () => {
    swiper.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    init();
    updateSize();
    setTranslate();
  };
  const disable = () => {
    swiper.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize,
    setTranslate,
    init,
    destroy
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/parallax.mjs


function Parallax(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    parallax: {
      enabled: false
    }
  });
  const elementsSelector = '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]';
  const setTransform = (el, progress) => {
    const {
      rtl
    } = swiper;
    const rtlFactor = rtl ? -1 : 1;
    const p = el.getAttribute('data-swiper-parallax') || '0';
    let x = el.getAttribute('data-swiper-parallax-x');
    let y = el.getAttribute('data-swiper-parallax-y');
    const scale = el.getAttribute('data-swiper-parallax-scale');
    const opacity = el.getAttribute('data-swiper-parallax-opacity');
    const rotate = el.getAttribute('data-swiper-parallax-rotate');
    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }
    if (x.indexOf('%') >= 0) {
      x = `${parseInt(x, 10) * progress * rtlFactor}%`;
    } else {
      x = `${x * progress * rtlFactor}px`;
    }
    if (y.indexOf('%') >= 0) {
      y = `${parseInt(y, 10) * progress}%`;
    } else {
      y = `${y * progress}px`;
    }
    if (typeof opacity !== 'undefined' && opacity !== null) {
      const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      el.style.opacity = currentOpacity;
    }
    let transform = `translate3d(${x}, ${y}, 0px)`;
    if (typeof scale !== 'undefined' && scale !== null) {
      const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      transform += ` scale(${currentScale})`;
    }
    if (rotate && typeof rotate !== 'undefined' && rotate !== null) {
      const currentRotate = rotate * progress * -1;
      transform += ` rotate(${currentRotate}deg)`;
    }
    el.style.transform = transform;
  };
  const setTranslate = () => {
    const {
      el,
      slides,
      progress,
      snapGrid,
      isElement
    } = swiper;
    const elements = elementChildren(el, elementsSelector);
    if (swiper.isElement) {
      elements.push(...elementChildren(swiper.hostEl, elementsSelector));
    }
    elements.forEach(subEl => {
      setTransform(subEl, progress);
    });
    slides.forEach((slideEl, slideIndex) => {
      let slideProgress = slideEl.progress;
      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }
      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      slideEl.querySelectorAll(`${elementsSelector}, [data-swiper-parallax-rotate]`).forEach(subEl => {
        setTransform(subEl, slideProgress);
      });
    });
  };
  const setTransition = function (duration) {
    if (duration === void 0) {
      duration = swiper.params.speed;
    }
    const {
      el,
      hostEl
    } = swiper;
    const elements = [...el.querySelectorAll(elementsSelector)];
    if (swiper.isElement) {
      elements.push(...hostEl.querySelectorAll(elementsSelector));
    }
    elements.forEach(parallaxEl => {
      let parallaxDuration = parseInt(parallaxEl.getAttribute('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
    });
  };
  on('beforeInit', () => {
    if (!swiper.params.parallax.enabled) return;
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
  });
  on('init', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTranslate', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTransition', (_swiper, duration) => {
    if (!swiper.params.parallax.enabled) return;
    setTransition(duration);
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/zoom.mjs



function Zoom(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const window = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      limitToOriginalSize: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const evCache = [];
  const gesture = {
    originX: 0,
    originY: 0,
    slideEl: undefined,
    slideWidth: undefined,
    slideHeight: undefined,
    imageEl: undefined,
    imageWrapEl: undefined,
    maxRatio: 3
  };
  const image = {
    isTouched: undefined,
    isMoved: undefined,
    currentX: undefined,
    currentY: undefined,
    minX: undefined,
    minY: undefined,
    maxX: undefined,
    maxY: undefined,
    width: undefined,
    height: undefined,
    startX: undefined,
    startY: undefined,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: undefined,
    y: undefined,
    prevPositionX: undefined,
    prevPositionY: undefined,
    prevTime: undefined
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, 'scale', {
    get() {
      return scale;
    },
    set(value) {
      if (scale !== value) {
        const imageEl = gesture.imageEl;
        const slideEl = gesture.slideEl;
        emit('zoomChange', value, imageEl, slideEl);
      }
      scale = value;
    }
  });
  function getDistanceBetweenTouches() {
    if (evCache.length < 2) return 1;
    const x1 = evCache[0].pageX;
    const y1 = evCache[0].pageY;
    const x2 = evCache[1].pageX;
    const y2 = evCache[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  }
  function getMaxRatio() {
    const params = swiper.params.zoom;
    const maxRatio = gesture.imageWrapEl.getAttribute('data-swiper-zoom') || params.maxRatio;
    if (params.limitToOriginalSize && gesture.imageEl && gesture.imageEl.naturalWidth) {
      const imageMaxRatio = gesture.imageEl.naturalWidth / gesture.imageEl.offsetWidth;
      return Math.min(imageMaxRatio, maxRatio);
    }
    return maxRatio;
  }
  function getScaleOrigin() {
    if (evCache.length < 2) return {
      x: null,
      y: null
    };
    const box = gesture.imageEl.getBoundingClientRect();
    return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x - window.scrollX) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y - window.scrollY) / currentScale];
  }
  function getSlideSelector() {
    return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  }
  function eventWithinSlide(e) {
    const slideSelector = getSlideSelector();
    if (e.target.matches(slideSelector)) return true;
    if (swiper.slides.filter(slideEl => slideEl.contains(e.target)).length > 0) return true;
    return false;
  }
  function eventWithinZoomContainer(e) {
    const selector = `.${swiper.params.zoom.containerClass}`;
    if (e.target.matches(selector)) return true;
    if ([...swiper.hostEl.querySelectorAll(selector)].filter(containerEl => containerEl.contains(e.target)).length > 0) return true;
    return false;
  }

  // Events
  function onGestureStart(e) {
    if (e.pointerType === 'mouse') {
      evCache.splice(0, evCache.length);
    }
    if (!eventWithinSlide(e)) return;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    evCache.push(e);
    if (evCache.length < 2) {
      return;
    }
    fakeGestureTouched = true;
    gesture.scaleStart = getDistanceBetweenTouches();
    if (!gesture.slideEl) {
      gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      if (!gesture.slideEl) gesture.slideEl = swiper.slides[swiper.activeIndex];
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
      if (!gesture.imageWrapEl) {
        gesture.imageEl = undefined;
        return;
      }
      gesture.maxRatio = getMaxRatio();
    }
    if (gesture.imageEl) {
      const [originX, originY] = getScaleOrigin();
      gesture.originX = originX;
      gesture.originY = originY;
      gesture.imageEl.style.transitionDuration = '0ms';
    }
    isScaling = true;
  }
  function onGestureChange(e) {
    if (!eventWithinSlide(e)) return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
    if (pointerIndex >= 0) evCache[pointerIndex] = e;
    if (evCache.length < 2) {
      return;
    }
    fakeGestureMoved = true;
    gesture.scaleMove = getDistanceBetweenTouches();
    if (!gesture.imageEl) {
      return;
    }
    zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function onGestureEnd(e) {
    if (!eventWithinSlide(e)) return;
    if (e.pointerType === 'mouse' && e.type === 'pointerout') return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
    if (pointerIndex >= 0) evCache.splice(pointerIndex, 1);
    if (!fakeGestureTouched || !fakeGestureMoved) {
      return;
    }
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    if (!gesture.imageEl) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale > 1 && gesture.slideEl) {
      gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    } else if (zoom.scale <= 1 && gesture.slideEl) {
      gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    }
    if (zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
      gesture.slideEl = undefined;
    }
  }
  let allowTouchMoveTimeout;
  function allowTouchMove() {
    swiper.touchEventsData.preventTouchMoveFromPointerMove = false;
  }
  function preventTouchMove() {
    clearTimeout(allowTouchMoveTimeout);
    swiper.touchEventsData.preventTouchMoveFromPointerMove = true;
    allowTouchMoveTimeout = setTimeout(() => {
      if (swiper.destroyed) return;
      allowTouchMove();
    });
  }
  function onTouchStart(e) {
    const device = swiper.device;
    if (!gesture.imageEl) return;
    if (image.isTouched) return;
    if (device.android && e.cancelable) e.preventDefault();
    image.isTouched = true;
    const event = evCache.length > 0 ? evCache[0] : e;
    image.touchesStart.x = event.pageX;
    image.touchesStart.y = event.pageY;
  }
  function onTouchMove(e) {
    if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) {
      return;
    }
    const zoom = swiper.zoom;
    if (!gesture.imageEl) {
      return;
    }
    if (!image.isTouched || !gesture.slideEl) {
      return;
    }
    if (!image.isMoved) {
      image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
      image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
      image.startX = getTranslate(gesture.imageWrapEl, 'x') || 0;
      image.startY = getTranslate(gesture.imageWrapEl, 'y') || 0;
      gesture.slideWidth = gesture.slideEl.offsetWidth;
      gesture.slideHeight = gesture.slideEl.offsetHeight;
      gesture.imageWrapEl.style.transitionDuration = '0ms';
    }
    // Define if we need image drag
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e.pageX;
    image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e.pageY;
    const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
    if (touchesDiff > 5) {
      swiper.allowClick = false;
    }
    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        allowTouchMove();
        return;
      }
      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        allowTouchMove();
        return;
      }
    }
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    preventTouchMove();
    image.isMoved = true;
    const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper.params.zoom.minRatio);
    const {
      originX,
      originY
    } = gesture;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }
    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    }

    // Velocity
    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTouchEnd() {
    const zoom = swiper.zoom;
    if (!gesture.imageEl) return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY;

    // Fix duration
    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY;
    // Define if we need image drag
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTransitionEnd() {
    const zoom = swiper.zoom;
    if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
      if (gesture.imageEl) {
        gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
      }
      if (gesture.imageWrapEl) {
        gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
      }
      gesture.slideEl.classList.remove(`${swiper.params.zoom.zoomedSlideClass}`);
      zoom.scale = 1;
      currentScale = 1;
      gesture.slideEl = undefined;
      gesture.imageEl = undefined;
      gesture.imageWrapEl = undefined;
      gesture.originX = 0;
      gesture.originY = 0;
    }
  }
  function zoomIn(e) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (e && e.target) {
        gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      }
      if (!gesture.slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
        } else {
          gesture.slideEl = swiper.slides[swiper.activeIndex];
        }
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.touchAction = 'none';
    }
    gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;
    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.pageX;
      touchY = e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }
    const forceZoomRatio = typeof e === 'number' ? e : null;
    if (currentScale === 1 && forceZoomRatio) {
      touchX = undefined;
      touchY = undefined;
      image.touchesStart.x = undefined;
      image.touchesStart.y = undefined;
    }
    const maxRatio = getMaxRatio();
    zoom.scale = forceZoomRatio || maxRatio;
    currentScale = forceZoomRatio || maxRatio;
    if (e && !(currentScale === 1 && forceZoomRatio)) {
      slideWidth = gesture.slideEl.offsetWidth;
      slideHeight = gesture.slideEl.offsetHeight;
      offsetX = elementOffset(gesture.slideEl).left + window.scrollX;
      offsetY = elementOffset(gesture.slideEl).top + window.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
      imageHeight = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;
      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }
      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    if (forceZoomRatio && zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
    }
    gesture.imageWrapEl.style.transitionDuration = '300ms';
    gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
    gesture.imageEl.style.transitionDuration = '300ms';
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
      } else {
        gesture.slideEl = swiper.slides[swiper.activeIndex];
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = undefined;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = '';
      swiper.wrapperEl.style.touchAction = '';
    }
    zoom.scale = 1;
    currentScale = 1;
    image.touchesStart.x = undefined;
    image.touchesStart.y = undefined;
    gesture.imageWrapEl.style.transitionDuration = '300ms';
    gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
    gesture.imageEl.style.transitionDuration = '300ms';
    gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
    gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    gesture.slideEl = undefined;
    gesture.originX = 0;
    gesture.originY = 0;
  }

  // Toggle Zoom
  function zoomToggle(e) {
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoomOut();
    } else {
      // Zoom In
      zoomIn(e);
    }
  }
  function getListeners() {
    const passiveListener = swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = swiper.params.passiveListeners ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }

  // Attach/Detach Events
  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();

    // Scale image
    swiper.wrapperEl.addEventListener('pointerdown', onGestureStart, passiveListener);
    swiper.wrapperEl.addEventListener('pointermove', onGestureChange, activeListenerWithCapture);
    ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
      swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
    });

    // Move image
    swiper.wrapperEl.addEventListener('pointermove', onTouchMove, activeListenerWithCapture);
  }
  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled) return;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();

    // Scale image
    swiper.wrapperEl.removeEventListener('pointerdown', onGestureStart, passiveListener);
    swiper.wrapperEl.removeEventListener('pointermove', onGestureChange, activeListenerWithCapture);
    ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
      swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
    });

    // Move image
    swiper.wrapperEl.removeEventListener('pointermove', onTouchMove, activeListenerWithCapture);
  }
  on('init', () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    disable();
  });
  on('touchStart', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchStart(e);
  });
  on('touchEnd', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchEnd();
  });
  on('doubleTap', (_s, e) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e);
    }
  });
  on('transitionEnd', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on('slideChange', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/controller.mjs


/* eslint no-bitwise: ["error", { "allow": [">>"] }] */
function Controller(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'
    }
  });

  swiper.controller = {
    control: undefined
  };
  function LinearSpline(x, y) {
    const binarySearch = function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;
          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }
        return maxIndex;
      };
    }();
    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1;
    // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.
    let i1;
    let i3;
    this.interpolate = function interpolate(x2) {
      if (!x2) return 0;

      // Get the indexes of x1 and x3 (the array indexes before and after given x2):
      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1;

      // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };
    return this;
  }
  function getInterpolateFunction(c) {
    swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
  }
  function setTranslate(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper = swiper.constructor;
    function setControlledTranslate(c) {
      if (c.destroyed) return;

      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
      if (swiper.params.controller.by === 'slide') {
        getInterpolateFunction(c);
        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out
        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }
      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        if (Number.isNaN(multiplier) || !Number.isFinite(multiplier)) {
          multiplier = 1;
        }
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }
      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }
      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }
    if (Array.isArray(controlled)) {
      for (let i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }
  function setTransition(duration, byController) {
    const Swiper = swiper.constructor;
    const controlled = swiper.controller.control;
    let i;
    function setControlledTransition(c) {
      if (c.destroyed) return;
      c.setTransition(duration, swiper);
      if (duration !== 0) {
        c.transitionStart();
        if (c.params.autoHeight) {
          nextTick(() => {
            c.updateAutoHeight();
          });
        }
        elementTransitionEnd(c.wrapperEl, () => {
          if (!controlled) return;
          c.transitionEnd();
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
  function removeSpline() {
    if (!swiper.controller.control) return;
    if (swiper.controller.spline) {
      swiper.controller.spline = undefined;
      delete swiper.controller.spline;
    }
  }
  on('beforeInit', () => {
    if (typeof window !== 'undefined' && (
    // eslint-disable-line
    typeof swiper.params.controller.control === 'string' || swiper.params.controller.control instanceof HTMLElement)) {
      const controlElements = typeof swiper.params.controller.control === 'string' ? [...document.querySelectorAll(swiper.params.controller.control)] : [swiper.params.controller.control];
      controlElements.forEach(controlElement => {
        if (!swiper.controller.control) swiper.controller.control = [];
        if (controlElement && controlElement.swiper) {
          swiper.controller.control.push(controlElement.swiper);
        } else if (controlElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onControllerSwiper = e => {
            swiper.controller.control.push(e.detail[0]);
            swiper.update();
            controlElement.removeEventListener(eventName, onControllerSwiper);
          };
          controlElement.addEventListener(eventName, onControllerSwiper);
        }
      });
      return;
    }
    swiper.controller.control = swiper.params.controller.control;
  });
  on('update', () => {
    removeSpline();
  });
  on('resize', () => {
    removeSpline();
  });
  on('observerUpdate', () => {
    removeSpline();
  });
  on('setTranslate', (_s, translate, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTranslate(translate, byController);
  });
  on('setTransition', (_s, duration, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate,
    setTransition
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/a11y.mjs




function A11y(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      containerRole: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group',
      id: null,
      scrollOnFocus: true
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;
  let preventFocusHandler;
  let focusTargetSlideEl;
  let visibilityChangedTimestamp = new Date().getTime();
  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    notification.innerHTML = '';
    notification.innerHTML = message;
  }
  function getRandomNumber(size) {
    if (size === void 0) {
      size = 16;
    }
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return 'x'.repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('tabIndex', '0');
    });
  }
  function makeElNotFocusable(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('tabIndex', '-1');
    });
  }
  function addElRole(el, role) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('role', role);
    });
  }
  function addElRoleDescription(el, description) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-roledescription', description);
    });
  }
  function addElControls(el, controls) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-controls', controls);
    });
  }
  function addElLabel(el, label) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-label', label);
    });
  }
  function addElId(el, id) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('id', id);
    });
  }
  function addElLive(el, live) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-live', live);
    });
  }
  function disableEl(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-disabled', true);
    });
  }
  function enableEl(el) {
    el = makeElementsArray(el);
    el.forEach(subEl => {
      subEl.setAttribute('aria-disabled', false);
    });
  }
  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    const params = swiper.params.a11y;
    const targetEl = e.target;
    if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target))) {
      if (!e.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
    }
    if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
      const prevEls = makeElementsArray(swiper.navigation.prevEl);
      const nextEls = makeElementsArray(swiper.navigation.nextEl);
      if (nextEls.includes(targetEl)) {
        if (!(swiper.isEnd && !swiper.params.loop)) {
          swiper.slideNext();
        }
        if (swiper.isEnd) {
          notify(params.lastSlideMessage);
        } else {
          notify(params.nextSlideMessage);
        }
      }
      if (prevEls.includes(targetEl)) {
        if (!(swiper.isBeginning && !swiper.params.loop)) {
          swiper.slidePrev();
        }
        if (swiper.isBeginning) {
          notify(params.firstSlideMessage);
        } else {
          notify(params.prevSlideMessage);
        }
      }
    }
    if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) {
      targetEl.click();
    }
  }
  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (prevEl) {
      if (swiper.isBeginning) {
        disableEl(prevEl);
        makeElNotFocusable(prevEl);
      } else {
        enableEl(prevEl);
        makeElFocusable(prevEl);
      }
    }
    if (nextEl) {
      if (swiper.isEnd) {
        disableEl(nextEl);
        makeElNotFocusable(nextEl);
      } else {
        enableEl(nextEl);
        makeElFocusable(nextEl);
      }
    }
  }
  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }
  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }
  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination()) return;
    swiper.pagination.bullets.forEach(bulletEl => {
      if (swiper.params.pagination.clickable) {
        makeElFocusable(bulletEl);
        if (!swiper.params.pagination.renderBullet) {
          addElRole(bulletEl, 'button');
          addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
        }
      }
      if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) {
        bulletEl.setAttribute('aria-current', 'true');
      } else {
        bulletEl.removeAttribute('aria-current');
      }
    });
  }
  const initNavEl = (el, wrapperId, message) => {
    makeElFocusable(el);
    if (el.tagName !== 'BUTTON') {
      addElRole(el, 'button');
      el.addEventListener('keydown', onEnterOrSpaceKey);
    }
    addElLabel(el, message);
    addElControls(el, wrapperId);
  };
  const handlePointerDown = e => {
    if (focusTargetSlideEl && focusTargetSlideEl !== e.target && !focusTargetSlideEl.contains(e.target)) {
      preventFocusHandler = true;
    }
    swiper.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    preventFocusHandler = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };
  const onVisibilityChange = e => {
    visibilityChangedTimestamp = new Date().getTime();
  };
  const handleFocus = e => {
    if (swiper.a11y.clicked || !swiper.params.a11y.scrollOnFocus) return;
    if (new Date().getTime() - visibilityChangedTimestamp < 100) return;
    const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
    if (!slideEl || !swiper.slides.includes(slideEl)) return;
    focusTargetSlideEl = slideEl;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      if (preventFocusHandler) return;
      if (swiper.params.loop) {
        swiper.slideToLoop(parseInt(slideEl.getAttribute('data-swiper-slide-index')), 0);
      } else {
        swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
      }
      preventFocusHandler = false;
    });
  };
  const initSlides = () => {
    const params = swiper.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole(swiper.slides, params.slideRole);
    }
    const slidesLength = swiper.slides.length;
    if (params.slideLabelMessage) {
      swiper.slides.forEach((slideEl, index) => {
        const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel(slideEl, ariaLabelMessage);
      });
    }
  };
  const init = () => {
    const params = swiper.params.a11y;
    swiper.el.append(liveRegion);

    // Container
    const containerEl = swiper.el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel(containerEl, params.containerMessage);
    }
    if (params.containerRole) {
      addElRole(containerEl, params.containerRole);
    }

    // Wrapper
    const wrapperEl = swiper.wrapperEl;
    const wrapperId = params.id || wrapperEl.getAttribute('id') || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
    addElId(wrapperEl, wrapperId);
    addElLive(wrapperEl, live);

    // Slide
    initSlides();

    // Navigation
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach(el => initNavEl(el, wrapperId, params.nextSlideMessage));
    }
    if (prevEl) {
      prevEl.forEach(el => initNavEl(el, wrapperId, params.prevSlideMessage));
    }

    // Pagination
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach(el => {
        el.addEventListener('keydown', onEnterOrSpaceKey);
      });
    }

    // Tab focus
    const document = getDocument();
    document.addEventListener('visibilitychange', onVisibilityChange);
    swiper.el.addEventListener('focus', handleFocus, true);
    swiper.el.addEventListener('focus', handleFocus, true);
    swiper.el.addEventListener('pointerdown', handlePointerDown, true);
    swiper.el.addEventListener('pointerup', handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion) liveRegion.remove();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
    }
    if (prevEl) {
      prevEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
    }

    // Pagination
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach(el => {
        el.removeEventListener('keydown', onEnterOrSpaceKey);
      });
    }
    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    // Tab focus
    if (swiper.el && typeof swiper.el !== 'string') {
      swiper.el.removeEventListener('focus', handleFocus, true);
      swiper.el.removeEventListener('pointerdown', handlePointerDown, true);
      swiper.el.removeEventListener('pointerup', handlePointerUp, true);
    }
  }
  on('beforeInit', () => {
    liveRegion = createElement('span', swiper.params.a11y.notificationClass);
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
  });
  on('afterInit', () => {
    if (!swiper.params.a11y.enabled) return;
    init();
  });
  on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
    if (!swiper.params.a11y.enabled) return;
    initSlides();
  });
  on('fromEdge toEdge afterInit lock unlock', () => {
    if (!swiper.params.a11y.enabled) return;
    updateNavigation();
  });
  on('paginationUpdate', () => {
    if (!swiper.params.a11y.enabled) return;
    updatePagination();
  });
  on('destroy', () => {
    if (!swiper.params.a11y.enabled) return;
    destroy();
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/history.mjs


function History(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    history: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides',
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};
  const slugify = text => {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };
  const getPathValues = urlOverride => {
    const window = getWindow();
    let location;
    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }
    const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };
  const setHistory = (key, index) => {
    const window = getWindow();
    if (!initialized || !swiper.params.history.enabled) return;
    let location;
    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }
    const slide = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${index}"]`) : swiper.slides[index];
    let value = slugify(slide.getAttribute('data-history'));
    if (swiper.params.history.root.length > 0) {
      let root = swiper.params.history.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = `${root}/${key ? `${key}/` : ''}${value}`;
    } else if (!location.pathname.includes(key)) {
      value = `${key ? `${key}/` : ''}${value}`;
    }
    if (swiper.params.history.keepQuery) {
      value += location.search;
    }
    const currentState = window.history.state;
    if (currentState && currentState.value === value) {
      return;
    }
    if (swiper.params.history.replaceState) {
      window.history.replaceState({
        value
      }, null, value);
    } else {
      window.history.pushState({
        value
      }, null, value);
    }
  };
  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides[i];
        const slideHistory = slugify(slide.getAttribute('data-history'));
        if (slideHistory === value) {
          const index = swiper.getSlideIndex(slide);
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };
  const setHistoryPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };
  const init = () => {
    const window = getWindow();
    if (!swiper.params.history) return;
    if (!window.history || !window.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }
    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) {
      if (!swiper.params.history.replaceState) {
        window.addEventListener('popstate', setHistoryPopState);
      }
      return;
    }
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);
    if (!swiper.params.history.replaceState) {
      window.addEventListener('popstate', setHistoryPopState);
    }
  };
  const destroy = () => {
    const window = getWindow();
    if (!swiper.params.history.replaceState) {
      window.removeEventListener('popstate', setHistoryPopState);
    }
  };
  on('init', () => {
    if (swiper.params.history.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.history.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/hash-navigation.mjs



function HashNavigation(_ref) {
  let {
    swiper,
    extendParams,
    emit,
    on
  } = _ref;
  let initialized = false;
  const document = getDocument();
  const window = getWindow();
  extendParams({
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false,
      getSlideIndex(_s, hash) {
        if (swiper.virtual && swiper.params.virtual.enabled) {
          const slideWithHash = swiper.slides.filter(slideEl => slideEl.getAttribute('data-hash') === hash)[0];
          if (!slideWithHash) return 0;
          const index = parseInt(slideWithHash.getAttribute('data-swiper-slide-index'), 10);
          return index;
        }
        return swiper.getSlideIndex(elementChildren(swiper.slidesEl, `.${swiper.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`)[0]);
      }
    }
  });
  const onHashChange = () => {
    emit('hashChange');
    const newHash = document.location.hash.replace('#', '');
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') : '';
    if (newHash !== activeSlideHash) {
      const newIndex = swiper.params.hashNavigation.getSlideIndex(swiper, newHash);
      if (typeof newIndex === 'undefined' || Number.isNaN(newIndex)) return;
      swiper.slideTo(newIndex);
    }
  };
  const setHash = () => {
    if (!initialized || !swiper.params.hashNavigation.enabled) return;
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') || activeSlideEl.getAttribute('data-history') : '';
    if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${activeSlideHash}` || '');
      emit('hashSet');
    } else {
      document.location.hash = activeSlideHash || '';
      emit('hashSet');
    }
  };
  const init = () => {
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    initialized = true;
    const hash = document.location.hash.replace('#', '');
    if (hash) {
      const speed = 0;
      const index = swiper.params.hashNavigation.getSlideIndex(swiper, hash);
      swiper.slideTo(index || 0, speed, swiper.params.runCallbacksOnInit, true);
    }
    if (swiper.params.hashNavigation.watchState) {
      window.addEventListener('hashchange', onHashChange);
    }
  };
  const destroy = () => {
    if (swiper.params.hashNavigation.watchState) {
      window.removeEventListener('hashchange', onHashChange);
    }
  };
  on('init', () => {
    if (swiper.params.hashNavigation.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.hashNavigation.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHash();
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHash();
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/autoplay.mjs


/* eslint no-underscore-dangle: "off" */
/* eslint no-use-before-define: "off" */
function Autoplay(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit,
    params
  } = _ref;
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  let timeout;
  let raf;
  let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3000;
  let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3000;
  let autoplayTimeLeft;
  let autoplayStartTime = new Date().getTime();
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  let pausedByPointerEnter;
  function onTransitionEnd(e) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
    if (e.target !== swiper.wrapperEl) return;
    swiper.wrapperEl.removeEventListener('transitionend', onTransitionEnd);
    if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) {
      return;
    }
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - new Date().getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit('autoplayTimeLeft', timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.filter(slideEl => slideEl.classList.contains('swiper-slide-active'))[0];
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl) return undefined;
    const currentSlideDelay = parseInt(activeSlideEl.getAttribute('data-swiper-autoplay'), 10);
    return currentSlideDelay;
  };
  const run = delayForce => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay = typeof delayForce === 'undefined' ? swiper.params.autoplay.delay : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === 'undefined') {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed) return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit('autoplay');
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit('autoplay');
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = new Date().getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }

    // eslint-disable-next-line
    return delay;
  };
  const start = () => {
    autoplayStartTime = new Date().getTime();
    swiper.autoplay.running = true;
    run();
    emit('autoplayStart');
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit('autoplayStop');
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit('autoplayPause');
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener('transitionend', onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft = delay - (new Date().getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
    if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
    autoplayStartTime = new Date().getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit('autoplayResume');
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    const document = getDocument();
    if (document.visibilityState === 'hidden') {
      pausedByInteraction = true;
      pause(true);
    }
    if (document.visibilityState === 'visible') {
      resume();
    }
  };
  const onPointerEnter = e => {
    if (e.pointerType !== 'mouse') return;
    pausedByInteraction = true;
    pausedByPointerEnter = true;
    if (swiper.animating || swiper.autoplay.paused) return;
    pause(true);
  };
  const onPointerLeave = e => {
    if (e.pointerType !== 'mouse') return;
    pausedByPointerEnter = false;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener('pointerenter', onPointerEnter);
      swiper.el.addEventListener('pointerleave', onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    if (swiper.el && typeof swiper.el !== 'string') {
      swiper.el.removeEventListener('pointerenter', onPointerEnter);
      swiper.el.removeEventListener('pointerleave', onPointerLeave);
    }
  };
  const attachDocumentEvents = () => {
    const document = getDocument();
    document.addEventListener('visibilitychange', onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
  on('init', () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      start();
    }
  });
  on('destroy', () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on('_freeModeStaticRelease', () => {
    if (pausedByTouch || pausedByInteraction) {
      resume();
    }
  });
  on('_freeModeNoMomentumRelease', () => {
    if (!swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on('beforeTransitionStart', (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on('sliderFirstMove', () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on('touchEnd', () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode) resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on('slideChange', () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/thumbs.mjs



function Thumb(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-thumbs'
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', onThumbClick);
    return true;
  }
  function update(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;

    // Activate thumbs
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach(slideEl => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach(slideEl => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i]) {
          thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') === `${swiper.realIndex}`)[0];
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
      }
      if (useOffset) {
        newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    }
  }
  on('beforeInit', () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    if (typeof thumbs.swiper === 'string' || thumbs.swiper instanceof HTMLElement) {
      const document = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === 'string' ? document.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init();
          update(true);
        } else if (thumbsElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onThumbsSwiper = e => {
            thumbs.swiper = e.detail[0];
            thumbsElement.removeEventListener(eventName, onThumbsSwiper);
            init();
            update(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener(eventName, onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init();
      update(true);
    }
  });
  on('slideChange update resize observerUpdate', () => {
    update();
  });
  on('setTransition', (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on('beforeDestroy', () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/free-mode.mjs


function freeMode(_ref) {
  let {
    swiper,
    extendParams,
    emit,
    once
  } = _ref;
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart() {
    if (swiper.params.cssMode) return;
    const translate = swiper.getTranslate();
    swiper.setTranslate(translate);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }
  function onTouchMove() {
    if (swiper.params.cssMode) return;
    const {
      touchEventsData: data,
      touches
    } = swiper;
    // Velocity
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: now()
    });
  }
  function onTouchEnd(_ref2) {
    let {
      currentPos
    } = _ref2;
    if (swiper.params.cssMode) return;
    const {
      params,
      wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper;
    // Time diff
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        }
        // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1000 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once('transitionEnd', () => {
          swiper.loopFix();
        });
      }
      // Fix duration
      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
        if (params.freeMode.sticky) {
          // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        elementTransitionEnd(wrapperEl, () => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit('_freeModeNoMomentumRelease');
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      emit('_freeModeStaticRelease');
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }
  Object.assign(swiper, {
    freeMode: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-target.mjs


function effect_target_effectTarget(effectParams, slideEl) {
  const transformEl = getSlideTransformEl(slideEl);
  if (transformEl !== slideEl) {
    transformEl.style.backfaceVisibility = 'hidden';
    transformEl.style['-webkit-backface-visibility'] = 'hidden';
  }
  return transformEl;
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-virtual-transition-end.mjs


function effect_virtual_transition_end_effectVirtualTransitionEnd(_ref) {
  let {
    swiper,
    duration,
    transformElements,
    allSlides
  } = _ref;
  const {
    activeIndex
  } = swiper;
  const getSlide = el => {
    if (!el.parentElement) {
      // assume shadow root
      const slide = swiper.slides.filter(slideEl => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode)[0];
      return slide;
    }
    return el.parentElement;
  };
  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let transitionEndTarget;
    if (allSlides) {
      transitionEndTarget = transformElements;
    } else {
      transitionEndTarget = transformElements.filter(transformEl => {
        const el = transformEl.classList.contains('swiper-slide-transform') ? getSlide(transformEl) : transformEl;
        return swiper.getSlideIndex(el) === activeIndex;
      });
    }
    transitionEndTarget.forEach(el => {
      elementTransitionEnd(el, () => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const evt = new window.CustomEvent('transitionend', {
          bubbles: true,
          cancelable: true
        });
        swiper.wrapperEl.dispatchEvent(evt);
      });
    });
  }
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-fade.mjs





function EffectFade(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    fadeEffect: {
      crossFade: false
    }
  });
  const setTranslate = () => {
    const {
      slides
    } = swiper;
    const params = swiper.params.fadeEffect;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = swiper.slides[i];
      const offset = slideEl.swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.opacity = slideOpacity;
      targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: 'fade',
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cube.mjs



function EffectCube(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  });
  const createSlideShadows = (slideEl, progress, isHorizontal) => {
    let shadowBefore = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
    let shadowAfter = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
    if (!shadowBefore) {
      shadowBefore = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}`.split(' '));
      slideEl.append(shadowBefore);
    }
    if (!shadowAfter) {
      shadowAfter = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}`.split(' '));
      slideEl.append(shadowAfter);
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    // create new ones
    const isHorizontal = swiper.isHorizontal();
    swiper.slides.forEach(slideEl => {
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      createSlideShadows(slideEl, progress, isHorizontal);
    });
  };
  const setTranslate = () => {
    const {
      el,
      wrapperEl,
      slides,
      width: swiperWidth,
      height: swiperHeight,
      rtlTranslate: rtl,
      size: swiperSize,
      browser
    } = swiper;
    const r = getRotateFix(swiper);
    const params = swiper.params.cubeEffect;
    const isHorizontal = swiper.isHorizontal();
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let wrapperRotate = 0;
    let cubeShadowEl;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl = swiper.wrapperEl.querySelector('.swiper-cube-shadow');
        if (!cubeShadowEl) {
          cubeShadowEl = createElement('div', 'swiper-cube-shadow');
          swiper.wrapperEl.append(cubeShadowEl);
        }
        cubeShadowEl.style.height = `${swiperWidth}px`;
      } else {
        cubeShadowEl = el.querySelector('.swiper-cube-shadow');
        if (!cubeShadowEl) {
          cubeShadowEl = createElement('div', 'swiper-cube-shadow');
          el.append(cubeShadowEl);
        }
      }
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      let slideIndex = i;
      if (isVirtual) {
        slideIndex = parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10);
      }
      let slideAngle = slideIndex * 90;
      let round = Math.floor(slideAngle / 360);
      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      let tx = 0;
      let ty = 0;
      let tz = 0;
      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }
      if (rtl) {
        tx = -tx;
      }
      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }
      const transform = `rotateX(${r(isHorizontal ? 0 : -slideAngle)}deg) rotateY(${r(isHorizontal ? slideAngle : 0)}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }
      slideEl.style.transform = transform;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress, isHorizontal);
      }
    }
    wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
    wrapperEl.style['-webkit-transform-origin'] = `50% 50% -${swiperSize / 2}px`;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(89.99deg) rotateZ(0deg) scale(${params.shadowScale})`;
      } else {
        const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        const scale1 = params.shadowScale;
        const scale2 = params.shadowScale / multiplier;
        const offset = params.shadowOffset;
        cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-89.99deg)`;
      }
    }
    const zFactor = (browser.isSafari || browser.isWebView) && browser.needPerspectiveFix ? -swiperSize / 2 : 0;
    wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${r(swiper.isHorizontal() ? 0 : wrapperRotate)}deg) rotateY(${r(swiper.isHorizontal() ? -wrapperRotate : 0)}deg)`;
    wrapperEl.style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
  };
  const setTransition = duration => {
    const {
      el,
      slides
    } = swiper;
    slides.forEach(slideEl => {
      slideEl.style.transitionDuration = `${duration}ms`;
      slideEl.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(subEl => {
        subEl.style.transitionDuration = `${duration}ms`;
      });
    });
    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      const shadowEl = el.querySelector('.swiper-cube-shadow');
      if (shadowEl) shadowEl.style.transitionDuration = `${duration}ms`;
    }
  };
  effectInit({
    effect: 'cube',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.cubeEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      spaceBetween: 0,
      centeredSlides: false,
      virtualTranslate: true
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-shadow.mjs


function create_shadow_createShadow(suffix, slideEl, side) {
  const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}${suffix ? ` swiper-slide-shadow-${suffix}` : ''}`;
  const shadowContainer = getSlideTransformEl(slideEl);
  let shadowEl = shadowContainer.querySelector(`.${shadowClass.split(' ').join('.')}`);
  if (!shadowEl) {
    shadowEl = createElement('div', shadowClass.split(' '));
    shadowContainer.append(shadowEl);
  }
  return shadowEl;
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-flip.mjs






function EffectFlip(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    flipEffect: {
      slideShadows: true,
      limitRotation: true
    }
  });
  const createSlideShadows = (slideEl, progress) => {
    let shadowBefore = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
    let shadowAfter = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
    if (!shadowBefore) {
      shadowBefore = createShadow('flip', slideEl, swiper.isHorizontal() ? 'left' : 'top');
    }
    if (!shadowAfter) {
      shadowAfter = createShadow('flip', slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    // Set shadows
    swiper.params.flipEffect;
    swiper.slides.forEach(slideEl => {
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      createSlideShadows(slideEl, progress);
    });
  };
  const setTranslate = () => {
    const {
      slides,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.flipEffect;
    const rotateFix = getRotateFix(swiper);
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      const offset = slideEl.swiperSlideOffset;
      const rotate = -180 * progress;
      let rotateY = rotate;
      let rotateX = 0;
      let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }
      slideEl.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress);
      }
      const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateFix(rotateX)}deg) rotateY(${rotateFix(rotateY)}deg)`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: 'flip',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.flipEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-coverflow.mjs





function EffectCoverflow(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true
    }
  });
  const setTranslate = () => {
    const {
      width: swiperWidth,
      height: swiperHeight,
      slides,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.coverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    const rotate = isHorizontal ? params.rotate : -params.rotate;
    const translate = params.depth;
    const r = getRotateFix(swiper);
    // Each slide offset from center
    for (let i = 0, length = slides.length; i < length; i += 1) {
      const slideEl = slides[i];
      const slideSize = slidesSizesGrid[i];
      const slideOffset = slideEl.swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
      // var rotateZ = 0
      let translateZ = -translate * Math.abs(offsetMultiplier);
      let stretch = params.stretch;
      // Allow percentage to make a relative stretch for responsive sliders
      if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }
      let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);

      // Fix for ultra small values
      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${r(rotateX)}deg) rotateY(${r(rotateY)}deg) scale(${scale})`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = slideTransform;
      slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
      if (params.slideShadows) {
        // Set shadows
        let shadowBeforeEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
        let shadowAfterEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
        if (!shadowBeforeEl) {
          shadowBeforeEl = createShadow('coverflow', slideEl, isHorizontal ? 'left' : 'top');
        }
        if (!shadowAfterEl) {
          shadowAfterEl = createShadow('coverflow', slideEl, isHorizontal ? 'right' : 'bottom');
        }
        if (shadowBeforeEl) shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if (shadowAfterEl) shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
  };
  effectInit({
    effect: 'coverflow',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-creative.mjs






function EffectCreative(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    creativeEffect: {
      limitProgress: 1,
      shadowPerProgress: false,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      },
      next: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      }
    }
  });
  const getTranslateValue = value => {
    if (typeof value === 'string') return value;
    return `${value}px`;
  };
  const setTranslate = () => {
    const {
      slides,
      wrapperEl,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.creativeEffect;
    const {
      progressMultiplier: multiplier
    } = params;
    const isCenteredSlides = swiper.params.centeredSlides;
    const rotateFix = getRotateFix(swiper);
    if (isCenteredSlides) {
      const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
      wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideEl.progress, -params.limitProgress), params.limitProgress);
      let originalProgress = progress;
      if (!isCenteredSlides) {
        originalProgress = Math.min(Math.max(slideEl.originalProgress, -params.limitProgress), params.limitProgress);
      }
      const offset = slideEl.swiperSlideOffset;
      const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
      const r = [0, 0, 0];
      let custom = false;
      if (!swiper.isHorizontal()) {
        t[1] = t[0];
        t[0] = 0;
      }
      let data = {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: 1,
        opacity: 1
      };
      if (progress < 0) {
        data = params.next;
        custom = true;
      } else if (progress > 0) {
        data = params.prev;
        custom = true;
      }
      // set translate
      t.forEach((value, index) => {
        t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
      });
      // set rotates
      r.forEach((value, index) => {
        let val = data.rotate[index] * Math.abs(progress * multiplier);
        r[index] = val;
      });
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const translateString = t.join(', ');
      const rotateString = `rotateX(${rotateFix(r[0])}deg) rotateY(${rotateFix(r[1])}deg) rotateZ(${rotateFix(r[2])}deg)`;
      const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
      const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
      const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;

      // Set shadows
      if (custom && data.shadow || !custom) {
        let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
        if (!shadowEl && data.shadow) {
          shadowEl = createShadow('creative', slideEl);
        }
        if (shadowEl) {
          const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
          shadowEl.style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
        }
      }
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
      targetEl.style.opacity = opacityString;
      if (data.origin) {
        targetEl.style.transformOrigin = data.origin;
      }
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: 'creative',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => swiper.params.creativeEffect.perspective,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cards.mjs






function EffectCards(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 8
    }
  });
  const setTranslate = () => {
    const {
      slides,
      activeIndex,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.cardsEffect;
    const {
      startTranslate,
      isTouched
    } = swiper.touchEventsData;
    const currentTranslate = rtl ? -swiper.translate : swiper.translate;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideProgress, -4), 4);
      let offset = slideEl.swiperSlideOffset;
      if (swiper.params.centeredSlides && !swiper.params.cssMode) {
        swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
      }
      if (swiper.params.centeredSlides && swiper.params.cssMode) {
        offset -= slides[0].swiperSlideOffset;
      }
      let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let tY = 0;
      const tZ = -100 * Math.abs(progress);
      let scale = 1;
      let rotate = -params.perSlideRotate * progress;
      let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
      const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
      const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
      const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;
      if (isSwipeToNext || isSwipeToPrev) {
        const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
        rotate += -28 * progress * subProgress;
        scale += -0.5 * subProgress;
        tXAdd += 96 * subProgress;
        tY = `${-25 * subProgress * Math.abs(progress)}%`;
      }
      if (progress < 0) {
        // next
        tX = `calc(${tX}px ${rtl ? '-' : '+'} (${tXAdd * Math.abs(progress)}%))`;
      } else if (progress > 0) {
        // prev
        tX = `calc(${tX}px ${rtl ? '-' : '+'} (-${tXAdd * Math.abs(progress)}%))`;
      } else {
        tX = `${tX}px`;
      }
      if (!swiper.isHorizontal()) {
        const prevY = tY;
        tY = tX;
        tX = prevY;
      }
      const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;

      /* eslint-disable */
      const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rtl ? -rotate : rotate : 0}deg)
        scale(${scaleString})
      `;
      /* eslint-enable */

      if (params.slideShadows) {
        // Set shadows
        let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
        if (!shadowEl) {
          shadowEl = createShadow('cards', slideEl);
        }
        if (shadowEl) shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
      }
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition = duration => {
    const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
    transformElements.forEach(el => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: 'cards',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}



;// CONCATENATED MODULE: ./node_modules/swiper/modules/index.mjs
























/***/ }),

/***/ 433:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ getWindow; },
/* harmony export */   g: function() { return /* binding */ getDocument; }
/* harmony export */ });
/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
  return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
}
function extend(target, src) {
  if (target === void 0) {
    target = {};
  }
  if (src === void 0) {
    src = {};
  }
  Object.keys(src).forEach(key => {
    if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
      extend(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: {
    blur() {},
    nodeName: ''
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {}
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: ''
  }
};
function getDocument() {
  const doc = typeof document !== 'undefined' ? document : {};
  extend(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ''
  },
  location: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: ''
  },
  history: {
    replaceState() {},
    pushState() {},
    go() {},
    back() {}
  },
  CustomEvent: function CustomEvent() {
    return this;
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle() {
    return {
      getPropertyValue() {
        return '';
      }
    };
  },
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === 'undefined') {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === 'undefined') {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== 'undefined' ? window : {};
  extend(win, ssrWindow);
  return win;
}




/***/ }),

/***/ 185:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ elementParents; },
/* harmony export */   c: function() { return /* binding */ createElement; },
/* harmony export */   d: function() { return /* binding */ now; },
/* harmony export */   e: function() { return /* binding */ elementChildren; },
/* harmony export */   f: function() { return /* binding */ elementOuterSize; },
/* harmony export */   h: function() { return /* binding */ elementIndex; },
/* harmony export */   j: function() { return /* binding */ getTranslate; },
/* harmony export */   n: function() { return /* binding */ nextTick; },
/* harmony export */   p: function() { return /* binding */ elementStyle; },
/* harmony export */   q: function() { return /* binding */ elementNextAll; },
/* harmony export */   r: function() { return /* binding */ elementPrevAll; },
/* harmony export */   s: function() { return /* binding */ setCSSProperty; },
/* harmony export */   t: function() { return /* binding */ animateCSSModeScroll; },
/* harmony export */   u: function() { return /* binding */ showWarning; },
/* harmony export */   v: function() { return /* binding */ elementIsChildOf; },
/* harmony export */   w: function() { return /* binding */ extend; },
/* harmony export */   x: function() { return /* binding */ deleteProps; }
/* harmony export */ });
/* unused harmony exports b, g, i, k, l, m, o */
/* harmony import */ var _ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(433);


function classesToTokens(classes) {
  if (classes === void 0) {
    classes = '';
  }
  return classes.trim().split(' ').filter(c => !!c.trim());
}

function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {
      // no getter for object
    }
    try {
      delete object[key];
    } catch (e) {
      // something got wrong
    }
  });
}
function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle(el) {
  const window = (0,_ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__.a)();
  let style;
  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = 'x';
  }
  const window = (0,_ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__.a)();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle(el);
  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }
  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}
function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend() {
  const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];
  for (let i = 1; i < arguments.length; i += 1) {
    const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll(_ref) {
  let {
    swiper,
    targetPosition,
    side
  } = _ref;
  const window = (0,_ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__.a)();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';
  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };
  const animate = () => {
    time = new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };
  animate();
}
function getSlideTransformEl(slideEl) {
  return slideEl.querySelector('.swiper-slide-transform') || slideEl.shadowRoot && slideEl.shadowRoot.querySelector('.swiper-slide-transform') || slideEl;
}
function elementChildren(element, selector) {
  if (selector === void 0) {
    selector = '';
  }
  const children = [...element.children];
  if (element instanceof HTMLSlotElement) {
    children.push(...element.assignedElements());
  }
  if (!selector) {
    return children;
  }
  return children.filter(el => el.matches(selector));
}
function elementIsChildOf(el, parent) {
  const isChild = parent.contains(el);
  if (!isChild && parent instanceof HTMLSlotElement) {
    const children = [...parent.assignedElements()];
    return children.includes(el);
  }
  return isChild;
}
function showWarning(text) {
  try {
    console.warn(text);
    return;
  } catch (err) {
    // err
  }
}
function createElement(tag, classes) {
  if (classes === void 0) {
    classes = [];
  }
  const el = document.createElement(tag);
  el.classList.add(...(Array.isArray(classes) ? classes : classesToTokens(classes)));
  return el;
}
function elementOffset(el) {
  const window = getWindow();
  const document = getDocument();
  const box = el.getBoundingClientRect();
  const body = document.body;
  const clientTop = el.clientTop || body.clientTop || 0;
  const clientLeft = el.clientLeft || body.clientLeft || 0;
  const scrollTop = el === window ? window.scrollY : el.scrollTop;
  const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line
    if (selector) {
      if (prev.matches(selector)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line
    if (selector) {
      if (next.matches(selector)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window = (0,_ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__.a)();
  return window.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i;
  if (child) {
    i = 0;
    // eslint-disable-next-line
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }
    return i;
  }
  return undefined;
}
function elementParents(el, selector) {
  const parents = []; // eslint-disable-line
  let parent = el.parentElement; // eslint-disable-line
  while (parent) {
    if (selector) {
      if (parent.matches(selector)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e) {
    if (e.target !== el) return;
    callback.call(el, e);
    el.removeEventListener('transitionend', fireCallBack);
  }
  if (callback) {
    el.addEventListener('transitionend', fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window = (0,_ssr_window_esm_mjs__WEBPACK_IMPORTED_MODULE_0__.a)();
  if (includeMargins) {
    return el[size === 'width' ? 'offsetWidth' : 'offsetHeight'] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-right' : 'margin-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-left' : 'margin-bottom'));
  }
  return el.offsetWidth;
}
function makeElementsArray(el) {
  return (Array.isArray(el) ? el : [el]).filter(e => !!e);
}
function getRotateFix(swiper) {
  return v => {
    if (Math.abs(v) > 0 && swiper.browser && swiper.browser.need3dFix && Math.abs(v) % 90 === 0) {
      return v + 0.001;
    }
    return v;
  };
}




/***/ }),

/***/ 652:
/***/ (function(__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) {


// UNUSED EXPORTS: Swiper, default

// EXTERNAL MODULE: ./node_modules/swiper/shared/ssr-window.esm.mjs
var ssr_window_esm = __webpack_require__(433);
// EXTERNAL MODULE: ./node_modules/swiper/shared/utils.mjs
var utils = __webpack_require__(185);
;// CONCATENATED MODULE: ./node_modules/swiper/shared/swiper-core.mjs



let support;
function calcSupport() {
  const window = (0,ssr_window_esm.a)();
  const document = (0,ssr_window_esm.g)();
  return {
    smoothScroll: document.documentElement && document.documentElement.style && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}

let deviceCached;
function calcDevice(_temp) {
  let {
    userAgent
  } = _temp === void 0 ? {} : _temp;
  const support = getSupport();
  const window = (0,ssr_window_esm.a)();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel';

  // iPadOs 13 fix
  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];
  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  }

  // Android
  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  }

  // Export object
  return device;
}
function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}

let browser;
function calcBrowser() {
  const window = (0,ssr_window_esm.a)();
  const device = getDevice();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }
  if (isSafari()) {
    const ua = String(window.navigator.userAgent);
    if (ua.includes('Version/')) {
      const [major, minor] = ua.split('Version/')[1].split(' ')[0].split('.').map(num => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
  const isSafariBrowser = isSafari();
  const need3dFix = isSafariBrowser || isWebView && device.ios;
  return {
    isSafari: needPerspectiveFix || isSafariBrowser,
    needPerspectiveFix,
    need3dFix,
    isWebView
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}

function Resize(_ref) {
  let {
    swiper,
    on,
    emit
  } = _ref;
  const window = (0,ssr_window_esm.a)();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      animationFrame = window.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(_ref2 => {
          let {
            contentBoxSize,
            contentRect,
            target
          } = _ref2;
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };
  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}

function Observer(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const observers = [];
  const window = (0,ssr_window_esm.a)();
  const attach = function (target, options) {
    if (options === void 0) {
      options = {};
    }
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: swiper.isElement || (typeof options.childList === 'undefined' ? true : options).childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = (0,utils.a)(swiper.hostEl);
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    // Observe container
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren
    });

    // Observe wrapper
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}

/* eslint-disable no-underscore-dangle */

var eventsEmitter = {
  on(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },
  once(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    function onceHandler() {
      self.off(events, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit() {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};

function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }

  // Subtract paddings
  width = width - parseInt((0,utils.p)(el, 'padding-left') || 0, 10) - parseInt((0,utils.p)(el, 'padding-right') || 0, 10);
  height = height - parseInt((0,utils.p)(el, 'padding-top') || 0, 10) - parseInt((0,utils.p)(el, 'padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}

function updateSlides() {
  const swiper = this;
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = (0,utils.e)(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === 'undefined') {
    return;
  }
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween;

  // reset margins
  slides.forEach(slideEl => {
    if (rtl) {
      slideEl.style.marginLeft = '';
    } else {
      slideEl.style.marginRight = '';
    }
    slideEl.style.marginBottom = '';
    slideEl.style.marginTop = '';
  });

  // reset cssMode offsets
  if (params.centeredSlides && params.cssMode) {
    (0,utils.s)(wrapperEl, '--swiper-centered-offset-before', '');
    (0,utils.s)(wrapperEl, '--swiper-centered-offset-after', '');
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slides);
  } else if (swiper.grid) {
    swiper.grid.unsetSlides();
  }

  // Calc slides
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    let slide;
    if (slides[i]) slide = slides[i];
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slides);
    }
    if (slides[i] && (0,utils.p)(slide, 'display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[swiper.getDirectionLabel('width')] = ``;
      }
      const slideStyles = getComputedStyle(slide);
      const currentTransform = slide.style.transform;
      const currentWebKitTransform = slide.style.webkitTransform;
      if (currentTransform) {
        slide.style.transform = 'none';
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = 'none';
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? (0,utils.f)(slide, 'width', true) : (0,utils.f)(slide, 'height', true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');
        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[swiper.getDirectionLabel('width')] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[swiper.getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid);
  }

  // Remove last grid elements depending on width
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i = 0; i < groups; i += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : swiper.getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode || params.loop) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach(slideEl => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
    snapGrid = snapGrid.map(snap => {
      if (snap <= 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
    if (allSlidesSize + offsetSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    (0,utils.s)(wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    (0,utils.s)(wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  swiper.emit('slidesUpdated');
  if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}

function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  // Find slides currently in view
  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }

  // Find new height from highest slide in view
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }

  // Update Height
  if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}

function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  // eslint-disable-next-line
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}

const toggleSlideClasses$1 = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesProgress(translate) {
  if (translate === void 0) {
    translate = this && this.translate || 0;
  }
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate;
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
    }
    toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
    toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
}

function updateProgress(translate) {
  const swiper = this;
  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    // eslint-disable-next-line
    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }
  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }
  swiper.emit('progress', progress);
}

const toggleSlideClasses = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const getFilteredSlide = selector => {
    return (0,utils.e)(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  let activeSlide;
  let prevSlide;
  let nextSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    if (gridEnabled) {
      activeSlide = slides.filter(slideEl => slideEl.column === activeIndex)[0];
      nextSlide = slides.filter(slideEl => slideEl.column === activeIndex + 1)[0];
      prevSlide = slides.filter(slideEl => slideEl.column === activeIndex - 1)[0];
    } else {
      activeSlide = slides[activeIndex];
    }
  }
  if (activeSlide) {
    if (!gridEnabled) {
      // Next Slide
      nextSlide = (0,utils.q)(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }

      // Prev Slide
      prevSlide = (0,utils.r)(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
    }
  }
  slides.forEach(slideEl => {
    toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
    toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
    toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
  });
  swiper.emitSlidesClasses();
}

const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (!lazyEl && swiper.isElement) {
      if (slideEl.shadowRoot) {
        lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      } else {
        // init later
        requestAnimationFrame(() => {
          if (slideEl.shadowRoot) {
            lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (lazyEl) lazyEl.remove();
          }
        });
      }
    }
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute('loading');
};
const preload = swiper => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_, i) => {
      return activeColumn + slidesPerView + i;
    }));
    swiper.slides.forEach((slideEl, i) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
      const realIndex = (i % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
    }
  } else {
    for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
      if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
        unlazy(swiper, i);
      }
    }
  }
};

function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i = 0; i < slidesGrid.length; i += 1) {
    if (typeof slidesGrid[i + 1] !== 'undefined') {
      if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
        activeIndex = i;
      } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
        activeIndex = i + 1;
      }
    } else if (translate >= slidesGrid[i]) {
      activeIndex = i;
    }
  }
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = aIndex => {
    let realIndex = aIndex - swiper.virtual.slidesBefore;
    if (realIndex < 0) {
      realIndex = swiper.virtual.slides.length + realIndex;
    }
    if (realIndex >= swiper.virtual.slides.length) {
      realIndex -= swiper.virtual.slides.length;
    }
    return realIndex;
  };
  if (typeof activeIndex === 'undefined') {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex && !swiper.params.loop) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }
    return;
  }
  if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
    swiper.realIndex = getVirtualRealIndex(activeIndex);
    return;
  }
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;

  // Get real index
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (gridEnabled) {
    const firstSlideInColumn = swiper.slides.filter(slideEl => slideEl.column === activeIndex)[0];
    let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute('data-swiper-slide-index'), 10);
    if (Number.isNaN(activeSlideIndex)) {
      activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
    }
    realIndex = Math.floor(activeSlideIndex / params.grid.rows);
  } else if (swiper.slides[activeIndex]) {
    const slideIndex = swiper.slides[activeIndex].getAttribute('data-swiper-slide-index');
    if (slideIndex) {
      realIndex = parseInt(slideIndex, 10);
    } else {
      realIndex = activeIndex;
    }
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    if (previousRealIndex !== realIndex) {
      swiper.emit('realIndexChange');
    }
    swiper.emit('slideChange');
  }
}

function updateClickedSlide(el, path) {
  const swiper = this;
  const params = swiper.params;
  let slide = el.closest(`.${params.slideClass}, swiper-slide`);
  if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) {
    [...path.slice(path.indexOf(el) + 1, path.length)].forEach(pathEl => {
      if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
        slide = pathEl;
      }
    });
  }
  let slideFound = false;
  let slideIndex;
  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide && slideFound) {
    swiper.clickedSlide = slide;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}

var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};

function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? 'x' : 'y';
  }
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }
  if (params.cssMode) {
    return translate;
  }
  let currentTranslate = (0,utils.j)(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}

function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x -= swiper.cssOverflowAdjustment();
    } else {
      y -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }

  // Check if we need to update progress
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }
  swiper.emit('setTranslate', swiper.translate, byController);
}

function minTranslate() {
  return -this.snapGrid[0];
}

function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}

function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
  if (translate === void 0) {
    translate = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (translateBounds === void 0) {
    translateBounds = true;
  }
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate;

  // Update progress
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        (0,utils.t)({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          swiper.animating = false;
          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }
      swiper.wrapperEl.addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}

var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};

function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : '';
  }
  swiper.emit('setTransition', duration, byController);
}

function transitionEmit(_ref) {
  let {
    swiper,
    runCallbacks,
    direction,
    step
  } = _ref;
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}

function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}

function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}

var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};

function slideTo(index, speed, runCallbacks, internal, initial) {
  if (index === void 0) {
    index = 0;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === 'string') {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate = -snapGrid[snapIndex];
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  // Directions locks
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  // Update progress
  swiper.updateProgress(translate);
  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset';

  // initial virtual
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  const isInitialVirtual = isVirtual && initial;
  // Update Index
  if (!isInitialVirtual && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
    swiper.updateActiveIndex(slideIndex);
    // Update Height
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }
    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;
    if (speed === 0) {
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
        });
      } else {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        (0,utils.t)({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit('beforeTransitionStart', speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
        if (!swiper || swiper.destroyed) return;
        if (e.target !== this) return;
        swiper.wrapperEl.removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}

function slideToLoop(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === 'string') {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      // eslint-disable-next-line
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      let targetSlideIndex;
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        targetSlideIndex = swiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex)[0].column;
      } else {
        targetSlideIndex = swiper.getSlideIndexByData(newIndex);
      }
      const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
      const {
        centeredSlides
      } = swiper.params;
      let slidesPerView = swiper.params.slidesPerView;
      if (slidesPerView === 'auto') {
        slidesPerView = swiper.slidesPerViewDynamic();
      } else {
        slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
        if (centeredSlides && slidesPerView % 2 === 0) {
          slidesPerView = slidesPerView + 1;
        }
      }
      let needLoopFix = cols - targetSlideIndex < slidesPerView;
      if (centeredSlides) {
        needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
      }
      if (internal && centeredSlides && swiper.params.slidesPerView !== 'auto' && !gridEnabled) {
        needLoopFix = false;
      }
      if (needLoopFix) {
        const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? 'prev' : 'next' : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? 'next' : 'prev';
        swiper.loopFix({
          direction,
          slideTo: true,
          activeSlideIndex: direction === 'next' ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
          slideRealIndex: direction === 'next' ? swiper.realIndex : undefined
        });
      }
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        newIndex = swiper.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex)[0].column;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
  }
  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}

/* eslint no-unused-vars: "off" */
function slideNext(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'next'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
    if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
      });
      return true;
    }
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slidePrev(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'prev'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
    requestAnimationFrame(() => {
      swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    });
    return true;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideReset(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (threshold === void 0) {
    threshold = 0.5;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}

function slideToClickedSlide() {
  const swiper = this;
  if (swiper.destroyed) return;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex((0,utils.e)(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        (0,utils.n)(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex((0,utils.e)(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      (0,utils.n)(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}

var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};

function loopCreate(slideRealIndex) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  const initSlides = () => {
    const slides = (0,utils.e)(slidesEl, `.${params.slideClass}, swiper-slide`);
    slides.forEach((el, index) => {
      el.setAttribute('data-swiper-slide-index', index);
    });
  };
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
  const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
  const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
  const addBlankSlides = amountOfSlides => {
    for (let i = 0; i < amountOfSlides; i += 1) {
      const slideEl = swiper.isElement ? (0,utils.c)('swiper-slide', [params.slideBlankClass]) : (0,utils.c)('div', [params.slideClass, params.slideBlankClass]);
      swiper.slidesEl.append(slideEl);
    }
  };
  if (shouldFillGroup) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      (0,utils.u)('Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
    }
    initSlides();
  } else if (shouldFillGrid) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      (0,utils.u)('Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
    }
    initSlides();
  } else {
    initSlides();
  }
  swiper.loopFix({
    slideRealIndex,
    direction: params.centeredSlides ? undefined : 'next'
  });
}

function loopFix(_temp) {
  let {
    slideRealIndex,
    slideTo = true,
    direction,
    setTranslate,
    activeSlideIndex,
    byController,
    byMousewheel
  } = _temp === void 0 ? {} : _temp;
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit('beforeLoopFix');
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  const {
    centeredSlides
  } = params;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo) {
      if (!params.centeredSlides && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit('loopFix');
    return;
  }
  let slidesPerView = params.slidesPerView;
  if (slidesPerView === 'auto') {
    slidesPerView = swiper.slidesPerViewDynamic();
  } else {
    slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
    if (centeredSlides && slidesPerView % 2 === 0) {
      slidesPerView = slidesPerView + 1;
    }
  }
  const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
  let loopedSlides = slidesPerGroup;
  if (loopedSlides % slidesPerGroup !== 0) {
    loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
  }
  loopedSlides += params.loopAdditionalSlides;
  swiper.loopedSlides = loopedSlides;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (slides.length < slidesPerView + loopedSlides) {
    (0,utils.u)('Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters');
  } else if (gridEnabled && params.grid.fill === 'row') {
    (0,utils.u)('Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`');
  }
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  let activeIndex = swiper.activeIndex;
  if (typeof activeSlideIndex === 'undefined') {
    activeSlideIndex = swiper.getSlideIndex(slides.filter(el => el.classList.contains(params.slideActiveClass))[0]);
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === 'next' || !direction;
  const isPrev = direction === 'prev' || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
  const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
  const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === 'undefined' ? -slidesPerView / 2 + 0.5 : 0);
  // prepend last slides before start
  if (activeColIndexWithShift < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
    for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
      const index = i - Math.floor(i / cols) * cols;
      if (gridEnabled) {
        const colIndexToPrepend = cols - index - 1;
        for (let i = slides.length - 1; i >= 0; i -= 1) {
          if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
        }
        // slides.forEach((slide, slideIndex) => {
        //   if (slide.column === colIndexToPrepend) prependSlidesIndexes.push(slideIndex);
        // });
      } else {
        prependSlidesIndexes.push(cols - index - 1);
      }
    }
  } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
    slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
    for (let i = 0; i < slidesAppended; i += 1) {
      const index = i - Math.floor(i / cols) * cols;
      if (gridEnabled) {
        slides.forEach((slide, slideIndex) => {
          if (slide.column === index) appendSlidesIndexes.push(slideIndex);
        });
      } else {
        appendSlidesIndexes.push(index);
      }
    }
  }
  swiper.__preventObserver__ = true;
  requestAnimationFrame(() => {
    swiper.__preventObserver__ = false;
  });
  if (isPrev) {
    prependSlidesIndexes.forEach(index => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach(index => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === 'auto') {
    swiper.updateSlides();
  } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
    swiper.slides.forEach((slide, slideIndex) => {
      swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
    });
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
          if (setTranslate) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        if (setTranslate) {
          const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
          swiper.touchEventsData.currentTranslate = swiper.translate;
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
        swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      direction,
      setTranslate,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach(c => {
        if (!c.destroyed && c.params.loop) c.loopFix({
          ...loopParams,
          slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
        });
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix({
        ...loopParams,
        slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
      });
    }
  }
  swiper.emit('loopFix');
}

function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach(slideEl => {
    const index = typeof slideEl.swiperSlideIndex === 'undefined' ? slideEl.getAttribute('data-swiper-slide-index') * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach(slideEl => {
    slideEl.removeAttribute('data-swiper-slide-index');
  });
  newSlidesOrder.forEach(slideEl => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}

var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};

function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = 'move';
  el.style.cursor = moving ? 'grabbing' : 'grab';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};

// Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
function closestElement(selector, base) {
  if (base === void 0) {
    base = this;
  }
  function __closestFrom(el) {
    if (!el || el === (0,ssr_window_esm.g)() || el === (0,ssr_window_esm.a)()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event, startX) {
  const window = (0,ssr_window_esm.a)();
  const {
    params
  } = swiper;
  const edgeSwipeDetection = params.edgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
      return true;
    }
    return false;
  }
  return true;
}
function onTouchStart(event) {
  const swiper = this;
  const document = (0,ssr_window_esm.g)();
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  const data = swiper.touchEventsData;
  if (e.type === 'pointerdown') {
    if (data.pointerId !== null && data.pointerId !== e.pointerId) {
      return;
    }
    data.pointerId = e.pointerId;
  } else if (e.type === 'touchstart' && e.targetTouches.length === 1) {
    data.touchId = e.targetTouches[0].identifier;
  }
  if (e.type === 'touchstart') {
    // don't proceed touch event
    preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
    return;
  }
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e.pointerType === 'mouse') return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let targetEl = e.target;
  if (params.touchEventsTarget === 'wrapper') {
    if (!(0,utils.v)(targetEl, swiper.wrapperEl)) return;
  }
  if ('which' in e && e.which === 3) return;
  if ('button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return;

  // change target el for shadow root component
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';
  // eslint-disable-next-line
  const eventPath = e.composedPath ? e.composedPath() : e.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);

  // use closestElement for shadow root element to get the actual closest for nested shadow root element
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e.pageX;
  touches.currentY = e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;

  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  if (!preventEdgeSwipe(swiper, e, startX)) {
    return;
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = (0,utils.d)();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === 'SELECT') {
      data.isTouched = false;
    }
  }
  if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === 'mouse' || e.pointerType !== 'mouse' && !targetEl.matches(data.focusableElements))) {
    document.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit('touchStart', e);
}

function onTouchMove(event) {
  const document = (0,ssr_window_esm.g)();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === 'mouse') return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (e.type === 'pointermove') {
    if (data.touchId !== null) return; // return from pointer if we use touch
    const id = e.pointerId;
    if (id !== data.pointerId) return;
  }
  let targetTouch;
  if (e.type === 'touchmove') {
    targetTouch = [...e.changedTouches].filter(t => t.identifier === data.touchId)[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  } else {
    targetTouch = e;
  }
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    return;
  }
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = (0,utils.d)();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== 'mouse') {
    document.activeElement.blur();
  }
  if (document.activeElement) {
    if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }
  touches.previousX = touches.currentX;
  touches.previousY = touches.currentY;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }
  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling || e.type === 'touchmove' && data.preventTouchMoveFromPointerMove) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  swiper.touchesDirection = touchesDiff > 0 ? 'prev' : 'next';
  const isLoop = swiper.params.loop && !params.cssMode;
  const allowLoopFix = swiper.touchesDirection === 'next' && swiper.allowSlideNext || swiper.touchesDirection === 'prev' && swiper.allowSlidePrev;
  if (!data.isMoved) {
    if (isLoop && allowLoopFix) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent('transitionend', {
        bubbles: true,
        cancelable: true,
        detail: {
          bySwiperTouchMove: true
        }
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    // Grab Cursor
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit('sliderFirstMove', e);
  }
  let loopFixed;
  new Date().getTime();
  if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
    Object.assign(touches, {
      startX: pageX,
      startY: pageY,
      currentX: pageX,
      currentY: pageY,
      startTranslate: data.currentTranslate
    });
    data.loopSwapReset = true;
    data.startTranslate = data.currentTranslate;
    return;
  }
  swiper.emit('sliderMove', e);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== 'auto' && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
      swiper.loopFix({
        direction: 'prev',
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== 'auto' && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: 'next',
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }

  // Directions locks
  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }

  // Threshold
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;

  // Update active index in free mode
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  // Update progress
  swiper.updateProgress(data.currentTranslate);
  // Update translate
  swiper.setTranslate(data.currentTranslate);
}

function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let targetTouch;
  const isTouchEvent = e.type === 'touchend' || e.type === 'touchcancel';
  if (!isTouchEvent) {
    if (data.touchId !== null) return; // return from pointer if we use touch
    if (e.pointerId !== data.pointerId) return;
    targetTouch = e;
  } else {
    targetTouch = [...e.changedTouches].filter(t => t.identifier === data.touchId)[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  }
  if (['pointercancel', 'pointerout', 'pointerleave', 'contextmenu'].includes(e.type)) {
    const proceed = ['pointercancel', 'contextmenu'].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  data.pointerId = null;
  data.touchId = null;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e.pointerType === 'mouse') return;
  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  // Return Grab Cursor
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }

  // Time diff
  const touchEndTime = (0,utils.d)();
  const timeDiff = touchEndTime - data.touchStartTime;

  // Tap, doubleTap, Click
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
    swiper.emit('tap click', e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }
  data.lastClickTime = (0,utils.d)();
  (0,utils.n)(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }

  // Find current slide
  const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (swipeToLast || currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  // Find current slide size
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}

function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return;

  // Breakpoints
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }

  // Save locks
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

  // Disable locks on resize
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  // Return locks after resize
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}

function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}

function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  // eslint-disable-next-line
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit('setTranslate', swiper.translate, false);
}

function onLoad(e) {
  const swiper = this;
  processLazyPreloader(swiper, e.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== 'auto' && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}

function onDocumentTouchStart() {
  const swiper = this;
  if (swiper.documentTouchHandlerProceeded) return;
  swiper.documentTouchHandlerProceeded = true;
  if (swiper.params.touchReleaseOnEdges) {
    swiper.el.style.touchAction = 'auto';
  }
}

const events = (swiper, method) => {
  const document = (0,ssr_window_esm.g)();
  const {
    params,
    el,
    wrapperEl,
    device
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method;
  if (!el || typeof el === 'string') return;

  // Touch Events
  document[domMethod]('touchstart', swiper.onDocumentTouchStart, {
    passive: false,
    capture
  });
  el[domMethod]('touchstart', swiper.onTouchStart, {
    passive: false
  });
  el[domMethod]('pointerdown', swiper.onTouchStart, {
    passive: false
  });
  document[domMethod]('touchmove', swiper.onTouchMove, {
    passive: false,
    capture
  });
  document[domMethod]('pointermove', swiper.onTouchMove, {
    passive: false,
    capture
  });
  document[domMethod]('touchend', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerup', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointercancel', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('touchcancel', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerout', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerleave', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('contextmenu', swiper.onTouchEnd, {
    passive: true
  });

  // Prevent Links Clicks
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  }

  // Resize handler
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }

  // Images loader
  el[domMethod]('load', swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  events(swiper, 'on');
}
function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}
var events$1 = {
  attachEvents,
  detachEvents
};

const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;

  // Get breakpoint for window width and update parameters
  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasGrabCursor = swiper.params.grabCursor;
  const isGrabCursor = breakpointParams.grabCursor;
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  if (wasGrabCursor && !isGrabCursor) {
    swiper.unsetGrabCursor();
  } else if (!wasGrabCursor && isGrabCursor) {
    swiper.setGrabCursor();
  }

  // Toggle navigation, pagination, scrollbar
  ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
    if (typeof breakpointParams[prop] === 'undefined') return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  const wasLoop = params.loop;
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  (0,utils.w)(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  const hasLoop = swiper.params.loop;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);
  if (initialized) {
    if (needsReLoop) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (!wasLoop && hasLoop) {
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (wasLoop && !hasLoop) {
      swiper.loopDestroy();
    }
  }
  swiper.emit('breakpoint', breakpointParams);
}

function getBreakpoint(breakpoints, base, containerEl) {
  if (base === void 0) {
    base = 'window';
  }
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = (0,ssr_window_esm.a)();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || 'max';
}

var breakpoints = {
  setBreakpoint,
  getBreakpoint
};

function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    el,
    device
  } = swiper;
  // prettier-ignore
  const suffixes = prepareClasses(['initialized', params.direction, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }, {
    'watch-progress': params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}

function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  if (!el || typeof el === 'string') return;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}

var classes = {
  addClasses,
  removeClasses
};

function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}
var checkOverflow$1 = {
  checkOverflow
};

var defaults = {
  init: true,
  direction: 'horizontal',
  oneWayMovement: false,
  swiperElementNodeName: 'SWIPER-CONTAINER',
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  eventsPrefix: 'swiper',
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-blank',
  slideActiveClass: 'swiper-slide-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideFullyVisibleClass: 'swiper-slide-fully-visible',
  slideNextClass: 'swiper-slide-next',
  slidePrevClass: 'swiper-slide-prev',
  wrapperClass: 'swiper-wrapper',
  lazyPreloaderClass: 'swiper-lazy-preloader',
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};

function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj) {
    if (obj === void 0) {
      obj = {};
    }
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== 'object' || moduleParams === null) {
      (0,utils.w)(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (moduleParamName === 'navigation' && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
      params[moduleParamName].auto = true;
    }
    if (['pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
      params[moduleParamName].auto = true;
    }
    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      (0,utils.w)(allModulesParams, obj);
      return;
    }
    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    (0,utils.w)(allModulesParams, obj);
  };
}

/* eslint no-param-reassign: "off" */
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
const extendedDefaults = {};
class Swiper {
  constructor() {
    let el;
    let params;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = (0,utils.w)({}, params);
    if (el && !params.el) params.el = el;
    const document = (0,ssr_window_esm.g)();
    if (params.el && typeof params.el === 'string' && document.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document.querySelectorAll(params.el).forEach(containerEl => {
        const newParams = (0,utils.w)({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      // eslint-disable-next-line no-constructor-return
      return swipers;
    }

    // Swiper Instance
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });

    // Extend defaults with modules params
    const swiperParams = (0,utils.w)({}, defaults, allModulesParams);

    // Extend defaults with passed params
    swiper.params = (0,utils.w)({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = (0,utils.w)({}, swiper.params);
    swiper.passedParams = (0,utils.w)({}, params);

    // add event listeners
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }

    // Extend Swiper
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },
      isVertical() {
        return swiper.params.direction === 'vertical';
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        // Returns 0 unless `translate` is > 2**23
        // Should be subtracted from css values to prevent overflow
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        startMoving: undefined,
        pointerId: null,
        touchId: null
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper');

    // Init
    if (swiper.params.init) {
      swiper.init();
    }

    // Return app instance
    // eslint-disable-next-line no-constructor-return
    return swiper;
  }
  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    // prettier-ignore
    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = (0,utils.e)(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = (0,utils.h)(slides[0]);
    return (0,utils.h)(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === index)[0]);
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = (0,utils.e)(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit('enable');
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit('disable');
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return '';
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }
  slidesPerViewDynamic(view, exact) {
    if (view === void 0) {
      view = 'current';
    }
    if (exact === void 0) {
      exact = false;
    }
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (typeof params.slidesPerView === 'number') return params.slidesPerView;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += Math.ceil(slides[i].swiperSlideSize);
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper;
    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit('update');
  }
  changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }
    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
    swiper.rtl = direction === 'rtl';
    swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'rtl';
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'ltr';
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;

    // Find el
    let el = element || swiper.params.el;
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        // Children needs to return slot items
        return res;
      }
      return (0,utils.e)(el, getWrapperSelector())[0];
    };
    // Find Wrapper
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = (0,utils.c)('div', swiper.params.wrapperClass);
      el.append(wrapperEl);
      (0,utils.e)(el, `.${swiper.params.slideClass}`).forEach(slideEl => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || (0,utils.p)(el, 'direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || (0,utils.p)(el, 'direction') === 'rtl'),
      wrongRTL: (0,utils.p)(wrapperEl, 'display') === '-webkit-box'
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit');

    // Set breakpoint
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Add Classes
    swiper.addClasses();

    // Update size
    swiper.updateSize();

    // Update slides
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }

    // Set Grab Cursor
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    // Slide To Initial Slide
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }

    // Create loop
    if (swiper.params.loop) {
      swiper.loopCreate();
    }

    // Attach events
    swiper.attachEvents();
    const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
    if (swiper.isElement) {
      lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
    }
    lazyElements.forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener('load', e => {
          processLazyPreloader(swiper, e.target);
        });
      }
    });
    preload(swiper);

    // Init Flag
    swiper.initialized = true;
    preload(swiper);

    // Emit
    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }
  destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }
    if (cleanStyles === void 0) {
      cleanStyles = true;
    }
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }
    swiper.emit('beforeDestroy');

    // Init Flag
    swiper.initialized = false;

    // Detach events
    swiper.detachEvents();

    // Destroy loop
    if (params.loop) {
      swiper.loopDestroy();
    }

    // Cleanup styles
    if (cleanStyles) {
      swiper.removeClasses();
      if (el && typeof el !== 'string') {
        el.removeAttribute('style');
      }
      if (wrapperEl) {
        wrapperEl.removeAttribute('style');
      }
      if (slides && slides.length) {
        slides.forEach(slideEl => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute('style');
          slideEl.removeAttribute('data-swiper-slide-index');
        });
      }
    }
    swiper.emit('destroy');

    // Detach emitter events
    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      if (swiper.el && typeof swiper.el !== 'string') {
        swiper.el.swiper = null;
      }
      (0,utils.x)(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    (0,utils.w)(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);



;// CONCATENATED MODULE: ./node_modules/swiper/swiper.mjs
/**
 * Swiper 11.1.14
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2024 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: September 12, 2024
 */




/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUUrQjs7O0FDcEgrQjtBQUNBOztBQUU5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLDJDQUEyQztBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEZBQTRGO0FBQzVGLFFBQVEsNkVBQTZFO0FBQ3JGLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxNQUFNLGFBQWE7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVpQzs7O0FDMVlzQzs7QUFFdkUsU0FBUyx1REFBeUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0EscURBQXFELGdCQUFnQjtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFMEM7OztBQ3BCbUQ7QUFDaEM7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVpQzs7O0FDdk0wQztBQUNrQjtBQUMrQjs7QUFFNUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFD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QU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFNBQVM7QUFDdkMsTUFBTTtBQUNOLCtCQUErQixTQUFTO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxNQUFNLGVBQWU7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsaUJBQWlCO0FBQ3ZFLHlEQUF5RCxlQUFlLE1BQU0sZUFBZTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxvQ0FBb0M7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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OENBQThDLE9BQU87QUFDckQsNEJBQTRCLFFBQVEsSUFBSSxjQUFjO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUUrQjs7O0FDL1NpQztBQUNVOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE1BQU07QUFDTixpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHNCQUFzQjtBQUM1Qyw0RUFBNEUscUJBQXFCO0FBQ2pHO0FBQ0EsU0FBUztBQUNUO0FBQ0EsTUFBTTtBQUNOLHNCQUFzQixzQkFBc0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEhBQTRILGlCQUFpQjtBQUM3STtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLCtCQUErQiwyQkFBMkI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUU0Qjs7O0FDaE04Qzs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNB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QTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsc0RBQXNEOztBQUV6RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxNQUFNO0FBQ047QUFDQSxRQUFRLFdBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixXQUFHO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixXQUFHO0FBQzFCLEVBQUUsV0FBUTtBQUNWO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvSUFBb0k7QUFDcEk7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsb0JBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFdBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxXQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBTTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0UsYUFBYTtBQUNyRjtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxRSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy92aXJ0dWFsLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMva2V5Ym9hcmQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9tb3VzZXdoZWVsLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL25hdmlnYXRpb24ubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9wYWdpbmF0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvc2Nyb2xsYmFyLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvcGFyYWxsYXgubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy96b29tLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvY29udHJvbGxlci5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2ExMXkubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9oaXN0b3J5Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvaGFzaC1uYXZpZ2F0aW9uLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvYXV0b3BsYXkubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy90aHVtYnMubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9mcmVlLW1vZGUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWZhZGUubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvbW9kdWxlcy9lZmZlY3QtY3ViZS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1mbGlwLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL21vZHVsZXMvZWZmZWN0LWNvdmVyZmxvdy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1jcmVhdGl2ZS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2VmZmVjdC1jYXJkcy5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9tb2R1bGVzL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N3aXBlci9zaGFyZWQvdXRpbHMubWpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zd2lwZXIvc2hhcmVkL3N3aXBlci1jb3JlLm1qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3dpcGVyL3N3aXBlci5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgcyBhcyBzZXRDU1NQcm9wZXJ0eSwgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIGMgYXMgY3JlYXRlRWxlbWVudCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBWaXJ0dWFsKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgdmlydHVhbDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBzbGlkZXM6IFtdLFxuICAgICAgY2FjaGU6IHRydWUsXG4gICAgICByZW5kZXJTbGlkZTogbnVsbCxcbiAgICAgIHJlbmRlckV4dGVybmFsOiBudWxsLFxuICAgICAgcmVuZGVyRXh0ZXJuYWxVcGRhdGU6IHRydWUsXG4gICAgICBhZGRTbGlkZXNCZWZvcmU6IDAsXG4gICAgICBhZGRTbGlkZXNBZnRlcjogMFxuICAgIH1cbiAgfSk7XG4gIGxldCBjc3NNb2RlVGltZW91dDtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBzd2lwZXIudmlydHVhbCA9IHtcbiAgICBjYWNoZToge30sXG4gICAgZnJvbTogdW5kZWZpbmVkLFxuICAgIHRvOiB1bmRlZmluZWQsXG4gICAgc2xpZGVzOiBbXSxcbiAgICBvZmZzZXQ6IDAsXG4gICAgc2xpZGVzR3JpZDogW11cbiAgfTtcbiAgY29uc3QgdGVtcERPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBmdW5jdGlvbiByZW5kZXJTbGlkZShzbGlkZSwgaW5kZXgpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnZpcnR1YWw7XG4gICAgaWYgKHBhcmFtcy5jYWNoZSAmJiBzd2lwZXIudmlydHVhbC5jYWNoZVtpbmRleF0pIHtcbiAgICAgIHJldHVybiBzd2lwZXIudmlydHVhbC5jYWNoZVtpbmRleF07XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGxldCBzbGlkZUVsO1xuICAgIGlmIChwYXJhbXMucmVuZGVyU2xpZGUpIHtcbiAgICAgIHNsaWRlRWwgPSBwYXJhbXMucmVuZGVyU2xpZGUuY2FsbChzd2lwZXIsIHNsaWRlLCBpbmRleCk7XG4gICAgICBpZiAodHlwZW9mIHNsaWRlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRlbXBET00uaW5uZXJIVE1MID0gc2xpZGVFbDtcbiAgICAgICAgc2xpZGVFbCA9IHRlbXBET00uY2hpbGRyZW5bMF07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBzbGlkZUVsID0gY3JlYXRlRWxlbWVudCgnc3dpcGVyLXNsaWRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlRWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3MpO1xuICAgIH1cbiAgICBzbGlkZUVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBpbmRleCk7XG4gICAgaWYgKCFwYXJhbXMucmVuZGVyU2xpZGUpIHtcbiAgICAgIHNsaWRlRWwuaW5uZXJIVE1MID0gc2xpZGU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuY2FjaGUpIHtcbiAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XSA9IHNsaWRlRWw7XG4gICAgfVxuICAgIHJldHVybiBzbGlkZUVsO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZShmb3JjZSwgYmVmb3JlSW5pdCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlc1BlclZpZXcsXG4gICAgICBzbGlkZXNQZXJHcm91cCxcbiAgICAgIGNlbnRlcmVkU2xpZGVzLFxuICAgICAgbG9vcDogaXNMb29wLFxuICAgICAgaW5pdGlhbFNsaWRlXG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgaWYgKGJlZm9yZUluaXQgJiYgIWlzTG9vcCAmJiBpbml0aWFsU2xpZGUgPiAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHtcbiAgICAgIGFkZFNsaWRlc0JlZm9yZSxcbiAgICAgIGFkZFNsaWRlc0FmdGVyXG4gICAgfSA9IHN3aXBlci5wYXJhbXMudmlydHVhbDtcbiAgICBjb25zdCB7XG4gICAgICBmcm9tOiBwcmV2aW91c0Zyb20sXG4gICAgICB0bzogcHJldmlvdXNUbyxcbiAgICAgIHNsaWRlcyxcbiAgICAgIHNsaWRlc0dyaWQ6IHByZXZpb3VzU2xpZGVzR3JpZCxcbiAgICAgIG9mZnNldDogcHJldmlvdXNPZmZzZXRcbiAgICB9ID0gc3dpcGVyLnZpcnR1YWw7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgIH1cbiAgICBjb25zdCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleCB8fCAwO1xuICAgIGxldCBvZmZzZXRQcm9wO1xuICAgIGlmIChzd2lwZXIucnRsVHJhbnNsYXRlKSBvZmZzZXRQcm9wID0gJ3JpZ2h0JztlbHNlIG9mZnNldFByb3AgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJztcbiAgICBsZXQgc2xpZGVzQWZ0ZXI7XG4gICAgbGV0IHNsaWRlc0JlZm9yZTtcbiAgICBpZiAoY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIHNsaWRlc0FmdGVyID0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyBzbGlkZXNQZXJHcm91cCArIGFkZFNsaWRlc0FmdGVyO1xuICAgICAgc2xpZGVzQmVmb3JlID0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyBzbGlkZXNQZXJHcm91cCArIGFkZFNsaWRlc0JlZm9yZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2xpZGVzQWZ0ZXIgPSBzbGlkZXNQZXJWaWV3ICsgKHNsaWRlc1Blckdyb3VwIC0gMSkgKyBhZGRTbGlkZXNBZnRlcjtcbiAgICAgIHNsaWRlc0JlZm9yZSA9IChpc0xvb3AgPyBzbGlkZXNQZXJWaWV3IDogc2xpZGVzUGVyR3JvdXApICsgYWRkU2xpZGVzQmVmb3JlO1xuICAgIH1cbiAgICBsZXQgZnJvbSA9IGFjdGl2ZUluZGV4IC0gc2xpZGVzQmVmb3JlO1xuICAgIGxldCB0byA9IGFjdGl2ZUluZGV4ICsgc2xpZGVzQWZ0ZXI7XG4gICAgaWYgKCFpc0xvb3ApIHtcbiAgICAgIGZyb20gPSBNYXRoLm1heChmcm9tLCAwKTtcbiAgICAgIHRvID0gTWF0aC5taW4odG8sIHNsaWRlcy5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgbGV0IG9mZnNldCA9IChzd2lwZXIuc2xpZGVzR3JpZFtmcm9tXSB8fCAwKSAtIChzd2lwZXIuc2xpZGVzR3JpZFswXSB8fCAwKTtcbiAgICBpZiAoaXNMb29wICYmIGFjdGl2ZUluZGV4ID49IHNsaWRlc0JlZm9yZSkge1xuICAgICAgZnJvbSAtPSBzbGlkZXNCZWZvcmU7XG4gICAgICBpZiAoIWNlbnRlcmVkU2xpZGVzKSBvZmZzZXQgKz0gc3dpcGVyLnNsaWRlc0dyaWRbMF07XG4gICAgfSBlbHNlIGlmIChpc0xvb3AgJiYgYWN0aXZlSW5kZXggPCBzbGlkZXNCZWZvcmUpIHtcbiAgICAgIGZyb20gPSAtc2xpZGVzQmVmb3JlO1xuICAgICAgaWYgKGNlbnRlcmVkU2xpZGVzKSBvZmZzZXQgKz0gc3dpcGVyLnNsaWRlc0dyaWRbMF07XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnZpcnR1YWwsIHtcbiAgICAgIGZyb20sXG4gICAgICB0byxcbiAgICAgIG9mZnNldCxcbiAgICAgIHNsaWRlc0dyaWQ6IHN3aXBlci5zbGlkZXNHcmlkLFxuICAgICAgc2xpZGVzQmVmb3JlLFxuICAgICAgc2xpZGVzQWZ0ZXJcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBvblJlbmRlcmVkKCkge1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgICAgZW1pdCgndmlydHVhbFVwZGF0ZScpO1xuICAgIH1cbiAgICBpZiAocHJldmlvdXNGcm9tID09PSBmcm9tICYmIHByZXZpb3VzVG8gPT09IHRvICYmICFmb3JjZSkge1xuICAgICAgaWYgKHN3aXBlci5zbGlkZXNHcmlkICE9PSBwcmV2aW91c1NsaWRlc0dyaWQgJiYgb2Zmc2V0ICE9PSBwcmV2aW91c09mZnNldCkge1xuICAgICAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgICAgc2xpZGVFbC5zdHlsZVtvZmZzZXRQcm9wXSA9IGAke29mZnNldCAtIE1hdGguYWJzKHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKSl9cHhgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgZW1pdCgndmlydHVhbFVwZGF0ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLnJlbmRlckV4dGVybmFsKSB7XG4gICAgICBzd2lwZXIucGFyYW1zLnZpcnR1YWwucmVuZGVyRXh0ZXJuYWwuY2FsbChzd2lwZXIsIHtcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBmcm9tLFxuICAgICAgICB0byxcbiAgICAgICAgc2xpZGVzOiBmdW5jdGlvbiBnZXRTbGlkZXMoKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVzVG9SZW5kZXIgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8PSB0bzsgaSArPSAxKSB7XG4gICAgICAgICAgICBzbGlkZXNUb1JlbmRlci5wdXNoKHNsaWRlc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzbGlkZXNUb1JlbmRlcjtcbiAgICAgICAgfSgpXG4gICAgICB9KTtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwucmVuZGVyRXh0ZXJuYWxVcGRhdGUpIHtcbiAgICAgICAgb25SZW5kZXJlZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW1pdCgndmlydHVhbFVwZGF0ZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwcmVwZW5kSW5kZXhlcyA9IFtdO1xuICAgIGNvbnN0IGFwcGVuZEluZGV4ZXMgPSBbXTtcbiAgICBjb25zdCBnZXRTbGlkZUluZGV4ID0gaW5kZXggPT4ge1xuICAgICAgbGV0IHNsaWRlSW5kZXggPSBpbmRleDtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgc2xpZGVJbmRleCA9IHNsaWRlcy5sZW5ndGggKyBpbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoc2xpZGVJbmRleCA+PSBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBzbGlkZUluZGV4ID0gc2xpZGVJbmRleCAtIHNsaWRlcy5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpZGVJbmRleDtcbiAgICB9O1xuICAgIGlmIChmb3JjZSkge1xuICAgICAgc3dpcGVyLnNsaWRlcy5maWx0ZXIoZWwgPT4gZWwubWF0Y2hlcyhgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCkpLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgIHNsaWRlRWwucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHByZXZpb3VzRnJvbTsgaSA8PSBwcmV2aW91c1RvOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGkgPCBmcm9tIHx8IGkgPiB0bykge1xuICAgICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBnZXRTbGlkZUluZGV4KGkpO1xuICAgICAgICAgIHN3aXBlci5zbGlkZXMuZmlsdGVyKGVsID0+IGVsLm1hdGNoZXMoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlSW5kZXh9XCJdLCBzd2lwZXItc2xpZGVbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlSW5kZXh9XCJdYCkpLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgICAgICBzbGlkZUVsLnJlbW92ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxvb3BGcm9tID0gaXNMb29wID8gLXNsaWRlcy5sZW5ndGggOiAwO1xuICAgIGNvbnN0IGxvb3BUbyA9IGlzTG9vcCA/IHNsaWRlcy5sZW5ndGggKiAyIDogc2xpZGVzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gbG9vcEZyb207IGkgPCBsb29wVG87IGkgKz0gMSkge1xuICAgICAgaWYgKGkgPj0gZnJvbSAmJiBpIDw9IHRvKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBnZXRTbGlkZUluZGV4KGkpO1xuICAgICAgICBpZiAodHlwZW9mIHByZXZpb3VzVG8gPT09ICd1bmRlZmluZWQnIHx8IGZvcmNlKSB7XG4gICAgICAgICAgYXBwZW5kSW5kZXhlcy5wdXNoKHNsaWRlSW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpID4gcHJldmlvdXNUbykgYXBwZW5kSW5kZXhlcy5wdXNoKHNsaWRlSW5kZXgpO1xuICAgICAgICAgIGlmIChpIDwgcHJldmlvdXNGcm9tKSBwcmVwZW5kSW5kZXhlcy5wdXNoKHNsaWRlSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGFwcGVuZEluZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICBzd2lwZXIuc2xpZGVzRWwuYXBwZW5kKHJlbmRlclNsaWRlKHNsaWRlc1tpbmRleF0sIGluZGV4KSk7XG4gICAgfSk7XG4gICAgaWYgKGlzTG9vcCkge1xuICAgICAgZm9yIChsZXQgaSA9IHByZXBlbmRJbmRleGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcHJlcGVuZEluZGV4ZXNbaV07XG4gICAgICAgIHN3aXBlci5zbGlkZXNFbC5wcmVwZW5kKHJlbmRlclNsaWRlKHNsaWRlc1tpbmRleF0sIGluZGV4KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXBlbmRJbmRleGVzLnNvcnQoKGEsIGIpID0+IGIgLSBhKTtcbiAgICAgIHByZXBlbmRJbmRleGVzLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgICBzd2lwZXIuc2xpZGVzRWwucHJlcGVuZChyZW5kZXJTbGlkZShzbGlkZXNbaW5kZXhdLCBpbmRleCkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsZW1lbnRDaGlsZHJlbihzd2lwZXIuc2xpZGVzRWwsICcuc3dpcGVyLXNsaWRlLCBzd2lwZXItc2xpZGUnKS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgc2xpZGVFbC5zdHlsZVtvZmZzZXRQcm9wXSA9IGAke29mZnNldCAtIE1hdGguYWJzKHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKSl9cHhgO1xuICAgIH0pO1xuICAgIG9uUmVuZGVyZWQoKTtcbiAgfVxuICBmdW5jdGlvbiBhcHBlbmRTbGlkZShzbGlkZXMpIHtcbiAgICBpZiAodHlwZW9mIHNsaWRlcyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gc2xpZGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoc2xpZGVzW2ldKSBzd2lwZXIudmlydHVhbC5zbGlkZXMucHVzaChzbGlkZXNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMucHVzaChzbGlkZXMpO1xuICAgIH1cbiAgICB1cGRhdGUodHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gcHJlcGVuZFNsaWRlKHNsaWRlcykge1xuICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICAgIGxldCBuZXdBY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4ICsgMTtcbiAgICBsZXQgbnVtYmVyT2ZOZXdTbGlkZXMgPSAxO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNsaWRlcykpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0pIHN3aXBlci52aXJ0dWFsLnNsaWRlcy51bnNoaWZ0KHNsaWRlc1tpXSk7XG4gICAgICB9XG4gICAgICBuZXdBY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4ICsgc2xpZGVzLmxlbmd0aDtcbiAgICAgIG51bWJlck9mTmV3U2xpZGVzID0gc2xpZGVzLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnVuc2hpZnQoc2xpZGVzKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbC5jYWNoZSkge1xuICAgICAgY29uc3QgY2FjaGUgPSBzd2lwZXIudmlydHVhbC5jYWNoZTtcbiAgICAgIGNvbnN0IG5ld0NhY2hlID0ge307XG4gICAgICBPYmplY3Qua2V5cyhjYWNoZSkuZm9yRWFjaChjYWNoZWRJbmRleCA9PiB7XG4gICAgICAgIGNvbnN0IGNhY2hlZEVsID0gY2FjaGVbY2FjaGVkSW5kZXhdO1xuICAgICAgICBjb25zdCBjYWNoZWRFbEluZGV4ID0gY2FjaGVkRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgICAgICBpZiAoY2FjaGVkRWxJbmRleCkge1xuICAgICAgICAgIGNhY2hlZEVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBwYXJzZUludChjYWNoZWRFbEluZGV4LCAxMCkgKyBudW1iZXJPZk5ld1NsaWRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q2FjaGVbcGFyc2VJbnQoY2FjaGVkSW5kZXgsIDEwKSArIG51bWJlck9mTmV3U2xpZGVzXSA9IGNhY2hlZEVsO1xuICAgICAgfSk7XG4gICAgICBzd2lwZXIudmlydHVhbC5jYWNoZSA9IG5ld0NhY2hlO1xuICAgIH1cbiAgICB1cGRhdGUodHJ1ZSk7XG4gICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXgsIDApO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZVNsaWRlKHNsaWRlc0luZGV4ZXMpIHtcbiAgICBpZiAodHlwZW9mIHNsaWRlc0luZGV4ZXMgPT09ICd1bmRlZmluZWQnIHx8IHNsaWRlc0luZGV4ZXMgPT09IG51bGwpIHJldHVybjtcbiAgICBsZXQgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2xpZGVzSW5kZXhlcykpIHtcbiAgICAgIGZvciAobGV0IGkgPSBzbGlkZXNJbmRleGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcbiAgICAgICAgICBkZWxldGUgc3dpcGVyLnZpcnR1YWwuY2FjaGVbc2xpZGVzSW5kZXhlc1tpXV07XG4gICAgICAgICAgLy8gc2hpZnQgY2FjaGUgaW5kZXhlc1xuICAgICAgICAgIE9iamVjdC5rZXlzKHN3aXBlci52aXJ0dWFsLmNhY2hlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID4gc2xpZGVzSW5kZXhlcykge1xuICAgICAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXkgLSAxXSA9IHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleV07XG4gICAgICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleSAtIDFdLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBrZXkgLSAxKTtcbiAgICAgICAgICAgICAgZGVsZXRlIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnNwbGljZShzbGlkZXNJbmRleGVzW2ldLCAxKTtcbiAgICAgICAgaWYgKHNsaWRlc0luZGV4ZXNbaV0gPCBhY3RpdmVJbmRleCkgYWN0aXZlSW5kZXggLT0gMTtcbiAgICAgICAgYWN0aXZlSW5kZXggPSBNYXRoLm1heChhY3RpdmVJbmRleCwgMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcbiAgICAgICAgZGVsZXRlIHN3aXBlci52aXJ0dWFsLmNhY2hlW3NsaWRlc0luZGV4ZXNdO1xuICAgICAgICAvLyBzaGlmdCBjYWNoZSBpbmRleGVzXG4gICAgICAgIE9iamVjdC5rZXlzKHN3aXBlci52aXJ0dWFsLmNhY2hlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgaWYgKGtleSA+IHNsaWRlc0luZGV4ZXMpIHtcbiAgICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleSAtIDFdID0gc3dpcGVyLnZpcnR1YWwuY2FjaGVba2V5XTtcbiAgICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlW2tleSAtIDFdLnNldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBrZXkgLSAxKTtcbiAgICAgICAgICAgIGRlbGV0ZSBzd2lwZXIudmlydHVhbC5jYWNoZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMuc3BsaWNlKHNsaWRlc0luZGV4ZXMsIDEpO1xuICAgICAgaWYgKHNsaWRlc0luZGV4ZXMgPCBhY3RpdmVJbmRleCkgYWN0aXZlSW5kZXggLT0gMTtcbiAgICAgIGFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoYWN0aXZlSW5kZXgsIDApO1xuICAgIH1cbiAgICB1cGRhdGUodHJ1ZSk7XG4gICAgc3dpcGVyLnNsaWRlVG8oYWN0aXZlSW5kZXgsIDApO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZUFsbFNsaWRlcygpIHtcbiAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMgPSBbXTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XG4gICAgICBzd2lwZXIudmlydHVhbC5jYWNoZSA9IHt9O1xuICAgIH1cbiAgICB1cGRhdGUodHJ1ZSk7XG4gICAgc3dpcGVyLnNsaWRlVG8oMCwgMCk7XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGxldCBkb21TbGlkZXNBc3NpZ25lZDtcbiAgICBpZiAodHlwZW9mIHN3aXBlci5wYXNzZWRQYXJhbXMudmlydHVhbC5zbGlkZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBzbGlkZXMgPSBbLi4uc3dpcGVyLnNsaWRlc0VsLmNoaWxkcmVuXS5maWx0ZXIoZWwgPT4gZWwubWF0Y2hlcyhgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCkpO1xuICAgICAgaWYgKHNsaWRlcyAmJiBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcyA9IFsuLi5zbGlkZXNdO1xuICAgICAgICBkb21TbGlkZXNBc3NpZ25lZCA9IHRydWU7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZUVsLCBzbGlkZUluZGV4KSA9PiB7XG4gICAgICAgICAgc2xpZGVFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jywgc2xpZGVJbmRleCk7XG4gICAgICAgICAgc3dpcGVyLnZpcnR1YWwuY2FjaGVbc2xpZGVJbmRleF0gPSBzbGlkZUVsO1xuICAgICAgICAgIHNsaWRlRWwucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWRvbVNsaWRlc0Fzc2lnbmVkKSB7XG4gICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMgPSBzd2lwZXIucGFyYW1zLnZpcnR1YWwuc2xpZGVzO1xuICAgIH1cbiAgICBzd2lwZXIuY2xhc3NOYW1lcy5wdXNoKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc312aXJ0dWFsYCk7XG4gICAgc3dpcGVyLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgICBzd2lwZXIub3JpZ2luYWxQYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyA9IHRydWU7XG4gICAgdXBkYXRlKGZhbHNlLCB0cnVlKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUgJiYgIXN3aXBlci5faW1tZWRpYXRlVmlydHVhbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGNzc01vZGVUaW1lb3V0KTtcbiAgICAgIGNzc01vZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2luaXQgdXBkYXRlIHJlc2l6ZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc2V0Q1NTUHJvcGVydHkoc3dpcGVyLndyYXBwZXJFbCwgJy0tc3dpcGVyLXZpcnR1YWwtc2l6ZScsIGAke3N3aXBlci52aXJ0dWFsU2l6ZX1weGApO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnZpcnR1YWwsIHtcbiAgICBhcHBlbmRTbGlkZSxcbiAgICBwcmVwZW5kU2xpZGUsXG4gICAgcmVtb3ZlU2xpZGUsXG4gICAgcmVtb3ZlQWxsU2xpZGVzLFxuICAgIHVwZGF0ZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgVmlydHVhbCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldERvY3VtZW50LCBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgYSBhcyBlbGVtZW50UGFyZW50cywgYiBhcyBlbGVtZW50T2Zmc2V0IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5mdW5jdGlvbiBLZXlib2FyZChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBzd2lwZXIua2V5Ym9hcmQgPSB7XG4gICAgZW5hYmxlZDogZmFsc2VcbiAgfTtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBrZXlib2FyZDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBvbmx5SW5WaWV3cG9ydDogdHJ1ZSxcbiAgICAgIHBhZ2VVcERvd246IHRydWVcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBoYW5kbGUoZXZlbnQpIHtcbiAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGxldCBlID0gZXZlbnQ7XG4gICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxuICAgIGNvbnN0IGtjID0gZS5rZXlDb2RlIHx8IGUuY2hhckNvZGU7XG4gICAgY29uc3QgcGFnZVVwRG93biA9IHN3aXBlci5wYXJhbXMua2V5Ym9hcmQucGFnZVVwRG93bjtcbiAgICBjb25zdCBpc1BhZ2VVcCA9IHBhZ2VVcERvd24gJiYga2MgPT09IDMzO1xuICAgIGNvbnN0IGlzUGFnZURvd24gPSBwYWdlVXBEb3duICYmIGtjID09PSAzNDtcbiAgICBjb25zdCBpc0Fycm93TGVmdCA9IGtjID09PSAzNztcbiAgICBjb25zdCBpc0Fycm93UmlnaHQgPSBrYyA9PT0gMzk7XG4gICAgY29uc3QgaXNBcnJvd1VwID0ga2MgPT09IDM4O1xuICAgIGNvbnN0IGlzQXJyb3dEb3duID0ga2MgPT09IDQwO1xuICAgIC8vIERpcmVjdGlvbnMgbG9ja3NcbiAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlTmV4dCAmJiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIGlzQXJyb3dSaWdodCB8fCBzd2lwZXIuaXNWZXJ0aWNhbCgpICYmIGlzQXJyb3dEb3duIHx8IGlzUGFnZURvd24pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVQcmV2ICYmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgaXNBcnJvd0xlZnQgfHwgc3dpcGVyLmlzVmVydGljYWwoKSAmJiBpc0Fycm93VXAgfHwgaXNQYWdlVXApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuYWx0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUgJiYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0JyB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYScpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5rZXlib2FyZC5vbmx5SW5WaWV3cG9ydCAmJiAoaXNQYWdlVXAgfHwgaXNQYWdlRG93biB8fCBpc0Fycm93TGVmdCB8fCBpc0Fycm93UmlnaHQgfHwgaXNBcnJvd1VwIHx8IGlzQXJyb3dEb3duKSkge1xuICAgICAgbGV0IGluVmlldyA9IGZhbHNlO1xuICAgICAgLy8gQ2hlY2sgdGhhdCBzd2lwZXIgc2hvdWxkIGJlIGluc2lkZSBvZiB2aXNpYmxlIGFyZWEgb2Ygd2luZG93XG4gICAgICBpZiAoZWxlbWVudFBhcmVudHMoc3dpcGVyLmVsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCkubGVuZ3RoID4gMCAmJiBlbGVtZW50UGFyZW50cyhzd2lwZXIuZWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3N9YCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb25zdCBlbCA9IHN3aXBlci5lbDtcbiAgICAgIGNvbnN0IHN3aXBlcldpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICBjb25zdCBzd2lwZXJIZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICBjb25zdCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgY29uc3Qgc3dpcGVyT2Zmc2V0ID0gZWxlbWVudE9mZnNldChlbCk7XG4gICAgICBpZiAocnRsKSBzd2lwZXJPZmZzZXQubGVmdCAtPSBlbC5zY3JvbGxMZWZ0O1xuICAgICAgY29uc3Qgc3dpcGVyQ29vcmQgPSBbW3N3aXBlck9mZnNldC5sZWZ0LCBzd2lwZXJPZmZzZXQudG9wXSwgW3N3aXBlck9mZnNldC5sZWZ0ICsgc3dpcGVyV2lkdGgsIHN3aXBlck9mZnNldC50b3BdLCBbc3dpcGVyT2Zmc2V0LmxlZnQsIHN3aXBlck9mZnNldC50b3AgKyBzd2lwZXJIZWlnaHRdLCBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzd2lwZXJXaWR0aCwgc3dpcGVyT2Zmc2V0LnRvcCArIHN3aXBlckhlaWdodF1dO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXJDb29yZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBwb2ludCA9IHN3aXBlckNvb3JkW2ldO1xuICAgICAgICBpZiAocG9pbnRbMF0gPj0gMCAmJiBwb2ludFswXSA8PSB3aW5kb3dXaWR0aCAmJiBwb2ludFsxXSA+PSAwICYmIHBvaW50WzFdIDw9IHdpbmRvd0hlaWdodCkge1xuICAgICAgICAgIGlmIChwb2ludFswXSA9PT0gMCAmJiBwb2ludFsxXSA9PT0gMCkgY29udGludWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICBpblZpZXcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWluVmlldykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgaWYgKGlzUGFnZVVwIHx8IGlzUGFnZURvd24gfHwgaXNBcnJvd0xlZnQgfHwgaXNBcnJvd1JpZ2h0KSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKGlzUGFnZURvd24gfHwgaXNBcnJvd1JpZ2h0KSAmJiAhcnRsIHx8IChpc1BhZ2VVcCB8fCBpc0Fycm93TGVmdCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVOZXh0KCk7XG4gICAgICBpZiAoKGlzUGFnZVVwIHx8IGlzQXJyb3dMZWZ0KSAmJiAhcnRsIHx8IChpc1BhZ2VEb3duIHx8IGlzQXJyb3dSaWdodCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVQcmV2KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1BhZ2VVcCB8fCBpc1BhZ2VEb3duIHx8IGlzQXJyb3dVcCB8fCBpc0Fycm93RG93bikge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGlzUGFnZURvd24gfHwgaXNBcnJvd0Rvd24pIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgIGlmIChpc1BhZ2VVcCB8fCBpc0Fycm93VXApIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICB9XG4gICAgZW1pdCgna2V5UHJlc3MnLCBrYyk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgaWYgKHN3aXBlci5rZXlib2FyZC5lbmFibGVkKSByZXR1cm47XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZSk7XG4gICAgc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgaWYgKCFzd2lwZXIua2V5Ym9hcmQuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGUpO1xuICAgIHN3aXBlci5rZXlib2FyZC5lbmFibGVkID0gZmFsc2U7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMua2V5Ym9hcmQuZW5hYmxlZCkge1xuICAgICAgZW5hYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5rZXlib2FyZC5lbmFibGVkKSB7XG4gICAgICBkaXNhYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIua2V5Ym9hcmQsIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgS2V5Ym9hcmQgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3cgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IG4gYXMgbmV4dFRpY2ssIGQgYXMgbm93IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5mdW5jdGlvbiBNb3VzZXdoZWVsKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIG1vdXNld2hlZWw6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgcmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxuICAgICAgaW52ZXJ0OiBmYWxzZSxcbiAgICAgIGZvcmNlVG9BeGlzOiBmYWxzZSxcbiAgICAgIHNlbnNpdGl2aXR5OiAxLFxuICAgICAgZXZlbnRzVGFyZ2V0OiAnY29udGFpbmVyJyxcbiAgICAgIHRocmVzaG9sZERlbHRhOiBudWxsLFxuICAgICAgdGhyZXNob2xkVGltZTogbnVsbCxcbiAgICAgIG5vTW91c2V3aGVlbENsYXNzOiAnc3dpcGVyLW5vLW1vdXNld2hlZWwnXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLm1vdXNld2hlZWwgPSB7XG4gICAgZW5hYmxlZDogZmFsc2VcbiAgfTtcbiAgbGV0IHRpbWVvdXQ7XG4gIGxldCBsYXN0U2Nyb2xsVGltZSA9IG5vdygpO1xuICBsZXQgbGFzdEV2ZW50QmVmb3JlU25hcDtcbiAgY29uc3QgcmVjZW50V2hlZWxFdmVudHMgPSBbXTtcbiAgZnVuY3Rpb24gbm9ybWFsaXplKGUpIHtcbiAgICAvLyBSZWFzb25hYmxlIGRlZmF1bHRzXG4gICAgY29uc3QgUElYRUxfU1RFUCA9IDEwO1xuICAgIGNvbnN0IExJTkVfSEVJR0hUID0gNDA7XG4gICAgY29uc3QgUEFHRV9IRUlHSFQgPSA4MDA7XG4gICAgbGV0IHNYID0gMDtcbiAgICBsZXQgc1kgPSAwOyAvLyBzcGluWCwgc3BpbllcbiAgICBsZXQgcFggPSAwO1xuICAgIGxldCBwWSA9IDA7IC8vIHBpeGVsWCwgcGl4ZWxZXG5cbiAgICAvLyBMZWdhY3lcbiAgICBpZiAoJ2RldGFpbCcgaW4gZSkge1xuICAgICAgc1kgPSBlLmRldGFpbDtcbiAgICB9XG4gICAgaWYgKCd3aGVlbERlbHRhJyBpbiBlKSB7XG4gICAgICBzWSA9IC1lLndoZWVsRGVsdGEgLyAxMjA7XG4gICAgfVxuICAgIGlmICgnd2hlZWxEZWx0YVknIGluIGUpIHtcbiAgICAgIHNZID0gLWUud2hlZWxEZWx0YVkgLyAxMjA7XG4gICAgfVxuICAgIGlmICgnd2hlZWxEZWx0YVgnIGluIGUpIHtcbiAgICAgIHNYID0gLWUud2hlZWxEZWx0YVggLyAxMjA7XG4gICAgfVxuXG4gICAgLy8gc2lkZSBzY3JvbGxpbmcgb24gRkYgd2l0aCBET01Nb3VzZVNjcm9sbFxuICAgIGlmICgnYXhpcycgaW4gZSAmJiBlLmF4aXMgPT09IGUuSE9SSVpPTlRBTF9BWElTKSB7XG4gICAgICBzWCA9IHNZO1xuICAgICAgc1kgPSAwO1xuICAgIH1cbiAgICBwWCA9IHNYICogUElYRUxfU1RFUDtcbiAgICBwWSA9IHNZICogUElYRUxfU1RFUDtcbiAgICBpZiAoJ2RlbHRhWScgaW4gZSkge1xuICAgICAgcFkgPSBlLmRlbHRhWTtcbiAgICB9XG4gICAgaWYgKCdkZWx0YVgnIGluIGUpIHtcbiAgICAgIHBYID0gZS5kZWx0YVg7XG4gICAgfVxuICAgIGlmIChlLnNoaWZ0S2V5ICYmICFwWCkge1xuICAgICAgLy8gaWYgdXNlciBzY3JvbGxzIHdpdGggc2hpZnQgaGUgd2FudHMgaG9yaXpvbnRhbCBzY3JvbGxcbiAgICAgIHBYID0gcFk7XG4gICAgICBwWSA9IDA7XG4gICAgfVxuICAgIGlmICgocFggfHwgcFkpICYmIGUuZGVsdGFNb2RlKSB7XG4gICAgICBpZiAoZS5kZWx0YU1vZGUgPT09IDEpIHtcbiAgICAgICAgLy8gZGVsdGEgaW4gTElORSB1bml0c1xuICAgICAgICBwWCAqPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgcFkgKj0gTElORV9IRUlHSFQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWx0YSBpbiBQQUdFIHVuaXRzXG4gICAgICAgIHBYICo9IFBBR0VfSEVJR0hUO1xuICAgICAgICBwWSAqPSBQQUdFX0hFSUdIVDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGYWxsLWJhY2sgaWYgc3BpbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZFxuICAgIGlmIChwWCAmJiAhc1gpIHtcbiAgICAgIHNYID0gcFggPCAxID8gLTEgOiAxO1xuICAgIH1cbiAgICBpZiAocFkgJiYgIXNZKSB7XG4gICAgICBzWSA9IHBZIDwgMSA/IC0xIDogMTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHNwaW5YOiBzWCxcbiAgICAgIHNwaW5ZOiBzWSxcbiAgICAgIHBpeGVsWDogcFgsXG4gICAgICBwaXhlbFk6IHBZXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZUVudGVyKCkge1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIubW91c2VFbnRlcmVkID0gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZUxlYXZlKCkge1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIubW91c2VFbnRlcmVkID0gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYW5pbWF0ZVNsaWRlcihuZXdFdmVudCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkRGVsdGEgJiYgbmV3RXZlbnQuZGVsdGEgPCBzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkRGVsdGEpIHtcbiAgICAgIC8vIFByZXZlbnQgaWYgZGVsdGEgb2Ygd2hlZWwgc2Nyb2xsIGRlbHRhIGlzIGJlbG93IGNvbmZpZ3VyZWQgdGhyZXNob2xkXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkVGltZSAmJiBub3coKSAtIGxhc3RTY3JvbGxUaW1lIDwgc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLnRocmVzaG9sZFRpbWUpIHtcbiAgICAgIC8vIFByZXZlbnQgaWYgdGltZSBiZXR3ZWVuIHNjcm9sbHMgaXMgYmVsb3cgY29uZmlndXJlZCB0aHJlc2hvbGRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW92ZW1lbnQgaXMgTk9UIGJpZyBlbm91Z2ggYW5kXG4gICAgLy8gaWYgdGhlIGxhc3QgdGltZSB0aGUgdXNlciBzY3JvbGxlZCB3YXMgdG9vIGNsb3NlIHRvIHRoZSBjdXJyZW50IG9uZSAoYXZvaWQgY29udGludW91c2x5IHRyaWdnZXJpbmcgdGhlIHNsaWRlcik6XG4gICAgLy8gICBEb24ndCBnbyBhbnkgZnVydGhlciAoYXZvaWQgaW5zaWduaWZpY2FudCBzY3JvbGwgbW92ZW1lbnQpLlxuICAgIGlmIChuZXdFdmVudC5kZWx0YSA+PSA2ICYmIG5vdygpIC0gbGFzdFNjcm9sbFRpbWUgPCA2MCkge1xuICAgICAgLy8gUmV0dXJuIGZhbHNlIGFzIGEgZGVmYXVsdFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIElmIHVzZXIgaXMgc2Nyb2xsaW5nIHRvd2FyZHMgdGhlIGVuZDpcbiAgICAvLyAgIElmIHRoZSBzbGlkZXIgaGFzbid0IGhpdCB0aGUgbGF0ZXN0IHNsaWRlIG9yXG4gICAgLy8gICBpZiB0aGUgc2xpZGVyIGlzIGEgbG9vcCBhbmRcbiAgICAvLyAgIGlmIHRoZSBzbGlkZXIgaXNuJ3QgbW92aW5nIHJpZ2h0IG5vdzpcbiAgICAvLyAgICAgR28gdG8gbmV4dCBzbGlkZSBhbmRcbiAgICAvLyAgICAgZW1pdCBhIHNjcm9sbCBldmVudC5cbiAgICAvLyBFbHNlICh0aGUgdXNlciBpcyBzY3JvbGxpbmcgdG93YXJkcyB0aGUgYmVnaW5uaW5nKSBhbmRcbiAgICAvLyBpZiB0aGUgc2xpZGVyIGhhc24ndCBoaXQgdGhlIGZpcnN0IHNsaWRlIG9yXG4gICAgLy8gaWYgdGhlIHNsaWRlciBpcyBhIGxvb3AgYW5kXG4gICAgLy8gaWYgdGhlIHNsaWRlciBpc24ndCBtb3ZpbmcgcmlnaHQgbm93OlxuICAgIC8vICAgR28gdG8gcHJldiBzbGlkZSBhbmRcbiAgICAvLyAgIGVtaXQgYSBzY3JvbGwgZXZlbnQuXG4gICAgaWYgKG5ld0V2ZW50LmRpcmVjdGlvbiA8IDApIHtcbiAgICAgIGlmICgoIXN3aXBlci5pc0VuZCB8fCBzd2lwZXIucGFyYW1zLmxvb3ApICYmICFzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgICAgZW1pdCgnc2Nyb2xsJywgbmV3RXZlbnQucmF3KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCghc3dpcGVyLmlzQmVnaW5uaW5nIHx8IHN3aXBlci5wYXJhbXMubG9vcCkgJiYgIXN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgIHN3aXBlci5zbGlkZVByZXYoKTtcbiAgICAgIGVtaXQoJ3Njcm9sbCcsIG5ld0V2ZW50LnJhdyk7XG4gICAgfVxuICAgIC8vIElmIHlvdSBnb3QgaGVyZSBpcyBiZWNhdXNlIGFuIGFuaW1hdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWQgc28gc3RvcmUgdGhlIGN1cnJlbnQgdGltZVxuICAgIGxhc3RTY3JvbGxUaW1lID0gbmV3IHdpbmRvdy5EYXRlKCkuZ2V0VGltZSgpO1xuICAgIC8vIFJldHVybiBmYWxzZSBhcyBhIGRlZmF1bHRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gcmVsZWFzZVNjcm9sbChuZXdFdmVudCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbDtcbiAgICBpZiAobmV3RXZlbnQuZGlyZWN0aW9uIDwgMCkge1xuICAgICAgaWYgKHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmIHBhcmFtcy5yZWxlYXNlT25FZGdlcykge1xuICAgICAgICAvLyBSZXR1cm4gdHJ1ZSB0byBhbmltYXRlIHNjcm9sbCBvbiBlZGdlc1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmIHBhcmFtcy5yZWxlYXNlT25FZGdlcykge1xuICAgICAgLy8gUmV0dXJuIHRydWUgdG8gYW5pbWF0ZSBzY3JvbGwgb24gZWRnZXNcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlKGV2ZW50KSB7XG4gICAgbGV0IGUgPSBldmVudDtcbiAgICBsZXQgZGlzYWJsZVBhcmVudFN3aXBlciA9IHRydWU7XG4gICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgLy8gSWdub3JlIGV2ZW50IGlmIHRoZSB0YXJnZXQgb3IgaXRzIHBhcmVudHMgaGF2ZSB0aGUgc3dpcGVyLW5vLW1vdXNld2hlZWwgY2xhc3NcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoYC4ke3N3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ub01vdXNld2hlZWxDbGFzc31gKSkgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGxldCB0YXJnZXRFbCA9IHN3aXBlci5lbDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmV2ZW50c1RhcmdldCAhPT0gJ2NvbnRhaW5lcicpIHtcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZXZlbnRzVGFyZ2V0KTtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0RWxDb250YWluc1RhcmdldCA9IHRhcmdldEVsICYmIHRhcmdldEVsLmNvbnRhaW5zKGUudGFyZ2V0KTtcbiAgICBpZiAoIXN3aXBlci5tb3VzZUVudGVyZWQgJiYgIXRhcmdldEVsQ29udGFpbnNUYXJnZXQgJiYgIXBhcmFtcy5yZWxlYXNlT25FZGdlcykgcmV0dXJuIHRydWU7XG4gICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxuICAgIGxldCBkZWx0YSA9IDA7XG4gICAgY29uc3QgcnRsRmFjdG9yID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IC0xIDogMTtcbiAgICBjb25zdCBkYXRhID0gbm9ybWFsaXplKGUpO1xuICAgIGlmIChwYXJhbXMuZm9yY2VUb0F4aXMpIHtcbiAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRhdGEucGl4ZWxYKSA+IE1hdGguYWJzKGRhdGEucGl4ZWxZKSkgZGVsdGEgPSAtZGF0YS5waXhlbFggKiBydGxGYWN0b3I7ZWxzZSByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoZGF0YS5waXhlbFkpID4gTWF0aC5hYnMoZGF0YS5waXhlbFgpKSBkZWx0YSA9IC1kYXRhLnBpeGVsWTtlbHNlIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWx0YSA9IE1hdGguYWJzKGRhdGEucGl4ZWxYKSA+IE1hdGguYWJzKGRhdGEucGl4ZWxZKSA/IC1kYXRhLnBpeGVsWCAqIHJ0bEZhY3RvciA6IC1kYXRhLnBpeGVsWTtcbiAgICB9XG4gICAgaWYgKGRlbHRhID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAocGFyYW1zLmludmVydCkgZGVsdGEgPSAtZGVsdGE7XG5cbiAgICAvLyBHZXQgdGhlIHNjcm9sbCBwb3NpdGlvbnNcbiAgICBsZXQgcG9zaXRpb25zID0gc3dpcGVyLmdldFRyYW5zbGF0ZSgpICsgZGVsdGEgKiBwYXJhbXMuc2Vuc2l0aXZpdHk7XG4gICAgaWYgKHBvc2l0aW9ucyA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHBvc2l0aW9ucyA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgICBpZiAocG9zaXRpb25zIDw9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkgcG9zaXRpb25zID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuXG4gICAgLy8gV2hlbiBsb29wIGlzIHRydWU6XG4gICAgLy8gICAgIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgdHJ1ZS5cbiAgICAvLyBXaGVuIGxvb3AgaXMgZmFsc2U6XG4gICAgLy8gICAgIGlmIHRoZSBzY3JvbGwgcG9zaXRpb25zIGlzIG5vdCBvbiBlZGdlLFxuICAgIC8vICAgICB0aGVuIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgdHJ1ZS5cbiAgICAvLyAgICAgaWYgdGhlIHNjcm9sbCBvbiBlZGdlIHBvc2l0aW9ucyxcbiAgICAvLyAgICAgdGhlbiB0aGUgZGlzYWJsZVBhcmVudFN3aXBlciB3aWxsIGJlIGZhbHNlLlxuICAgIGRpc2FibGVQYXJlbnRTd2lwZXIgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyB0cnVlIDogIShwb3NpdGlvbnMgPT09IHN3aXBlci5taW5UcmFuc2xhdGUoKSB8fCBwb3NpdGlvbnMgPT09IHN3aXBlci5tYXhUcmFuc2xhdGUoKSk7XG4gICAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIgJiYgc3dpcGVyLnBhcmFtcy5uZXN0ZWQpIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmZyZWVNb2RlIHx8ICFzd2lwZXIucGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQpIHtcbiAgICAgIC8vIFJlZ2lzdGVyIHRoZSBuZXcgZXZlbnQgaW4gYSB2YXJpYWJsZSB3aGljaCBzdG9yZXMgdGhlIHJlbGV2YW50IGRhdGFcbiAgICAgIGNvbnN0IG5ld0V2ZW50ID0ge1xuICAgICAgICB0aW1lOiBub3coKSxcbiAgICAgICAgZGVsdGE6IE1hdGguYWJzKGRlbHRhKSxcbiAgICAgICAgZGlyZWN0aW9uOiBNYXRoLnNpZ24oZGVsdGEpLFxuICAgICAgICByYXc6IGV2ZW50XG4gICAgICB9O1xuXG4gICAgICAvLyBLZWVwIHRoZSBtb3N0IHJlY2VudCBldmVudHNcbiAgICAgIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zaGlmdCgpOyAvLyBvbmx5IHN0b3JlIHRoZSBsYXN0IE4gZXZlbnRzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXZFdmVudCA9IHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA/IHJlY2VudFdoZWVsRXZlbnRzW3JlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgcmVjZW50V2hlZWxFdmVudHMucHVzaChuZXdFdmVudCk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBwcmV2aW91cyByZWNvcmRlZCBldmVudDpcbiAgICAgIC8vICAgSWYgZGlyZWN0aW9uIGhhcyBjaGFuZ2VkIG9yXG4gICAgICAvLyAgIGlmIHRoZSBzY3JvbGwgaXMgcXVpY2tlciB0aGFuIHRoZSBwcmV2aW91cyBvbmU6XG4gICAgICAvLyAgICAgQW5pbWF0ZSB0aGUgc2xpZGVyLlxuICAgICAgLy8gRWxzZSAodGhpcyBpcyB0aGUgZmlyc3QgdGltZSB0aGUgd2hlZWwgaXMgbW92ZWQpOlxuICAgICAgLy8gICAgIEFuaW1hdGUgdGhlIHNsaWRlci5cbiAgICAgIGlmIChwcmV2RXZlbnQpIHtcbiAgICAgICAgaWYgKG5ld0V2ZW50LmRpcmVjdGlvbiAhPT0gcHJldkV2ZW50LmRpcmVjdGlvbiB8fCBuZXdFdmVudC5kZWx0YSA+IHByZXZFdmVudC5kZWx0YSB8fCBuZXdFdmVudC50aW1lID4gcHJldkV2ZW50LnRpbWUgKyAxNTApIHtcbiAgICAgICAgICBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5pbWF0ZVNsaWRlcihuZXdFdmVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3MgdGltZSB0byByZWxlYXNlIHRoZSBzY3JvbGw6XG4gICAgICAvLyAgIFJldHVybiBub3cgc28geW91IGRvbid0IGhpdCB0aGUgcHJldmVudERlZmF1bHQuXG4gICAgICBpZiAocmVsZWFzZVNjcm9sbChuZXdFdmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZyZWVtb2RlIG9yIHNjcm9sbENvbnRhaW5lcjpcblxuICAgICAgLy8gSWYgd2UgcmVjZW50bHkgc25hcHBlZCBhZnRlciBhIG1vbWVudHVtIHNjcm9sbCwgdGhlbiBpZ25vcmUgd2hlZWwgZXZlbnRzXG4gICAgICAvLyB0byBnaXZlIHRpbWUgZm9yIHRoZSBkZWNlbGVyYXRpb24gdG8gZmluaXNoLiBTdG9wIGlnbm9yaW5nIGFmdGVyIDUwMCBtc2Vjc1xuICAgICAgLy8gb3IgaWYgaXQncyBhIG5ldyBzY3JvbGwgKGxhcmdlciBkZWx0YSBvciBpbnZlcnNlIHNpZ24gYXMgbGFzdCBldmVudCBiZWZvcmVcbiAgICAgIC8vIGFuIGVuZC1vZi1tb21lbnR1bSBzbmFwKS5cbiAgICAgIGNvbnN0IG5ld0V2ZW50ID0ge1xuICAgICAgICB0aW1lOiBub3coKSxcbiAgICAgICAgZGVsdGE6IE1hdGguYWJzKGRlbHRhKSxcbiAgICAgICAgZGlyZWN0aW9uOiBNYXRoLnNpZ24oZGVsdGEpXG4gICAgICB9O1xuICAgICAgY29uc3QgaWdub3JlV2hlZWxFdmVudHMgPSBsYXN0RXZlbnRCZWZvcmVTbmFwICYmIG5ld0V2ZW50LnRpbWUgPCBsYXN0RXZlbnRCZWZvcmVTbmFwLnRpbWUgKyA1MDAgJiYgbmV3RXZlbnQuZGVsdGEgPD0gbGFzdEV2ZW50QmVmb3JlU25hcC5kZWx0YSAmJiBuZXdFdmVudC5kaXJlY3Rpb24gPT09IGxhc3RFdmVudEJlZm9yZVNuYXAuZGlyZWN0aW9uO1xuICAgICAgaWYgKCFpZ25vcmVXaGVlbEV2ZW50cykge1xuICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCkgKyBkZWx0YSAqIHBhcmFtcy5zZW5zaXRpdml0eTtcbiAgICAgICAgY29uc3Qgd2FzQmVnaW5uaW5nID0gc3dpcGVyLmlzQmVnaW5uaW5nO1xuICAgICAgICBjb25zdCB3YXNFbmQgPSBzd2lwZXIuaXNFbmQ7XG4gICAgICAgIGlmIChwb3NpdGlvbiA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHBvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgICBpZiAocG9zaXRpb24gPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSBwb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUocG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICAgIGlmICghd2FzQmVnaW5uaW5nICYmIHN3aXBlci5pc0JlZ2lubmluZyB8fCAhd2FzRW5kICYmIHN3aXBlci5pc0VuZCkge1xuICAgICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogbmV3RXZlbnQuZGlyZWN0aW9uIDwgMCA/ICduZXh0JyA6ICdwcmV2JyxcbiAgICAgICAgICAgIGJ5TW91c2V3aGVlbDogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgICAgIC8vIFdoZW4gd2hlZWwgc2Nyb2xsaW5nIHN0YXJ0cyB3aXRoIHN0aWNreSAoYWthIHNuYXApIGVuYWJsZWQsIHRoZW4gZGV0ZWN0XG4gICAgICAgICAgLy8gdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBieSBzdG9yaW5nIHJlY2VudCAoTj0xNT8pIHdoZWVsIGV2ZW50cy5cbiAgICAgICAgICAvLyAxLiBkbyBhbGwgTiBldmVudHMgaGF2ZSBkZWNyZWFzaW5nIG9yIHNhbWUgKGFic29sdXRlIHZhbHVlKSBkZWx0YT9cbiAgICAgICAgICAvLyAyLiBkaWQgYWxsIE4gZXZlbnRzIGFycml2ZSBpbiB0aGUgbGFzdCBNIChNPTUwMD8pIG1zZWNzP1xuICAgICAgICAgIC8vIDMuIGRvZXMgdGhlIGVhcmxpZXN0IGV2ZW50IGhhdmUgYW4gKGFic29sdXRlIHZhbHVlKSBkZWx0YSB0aGF0J3NcbiAgICAgICAgICAvLyAgICBhdCBsZWFzdCBQIChQPTE/KSBsYXJnZXIgdGhhbiB0aGUgbW9zdCByZWNlbnQgZXZlbnQncyBkZWx0YT9cbiAgICAgICAgICAvLyA0LiBkb2VzIHRoZSBsYXRlc3QgZXZlbnQgaGF2ZSBhIGRlbHRhIHRoYXQncyBzbWFsbGVyIHRoYW4gUSAoUT02PykgcGl4ZWxzP1xuICAgICAgICAgIC8vIElmIDEtNCBhcmUgXCJ5ZXNcIiB0aGVuIHdlJ3JlIG5lYXIgdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBkZWNlbGVyYXRpb24uXG4gICAgICAgICAgLy8gU25hcCBpbW1lZGlhdGVseSBhbmQgaWdub3JlIHJlbWFpbmluZyB3aGVlbCBldmVudHMgaW4gdGhpcyBzY3JvbGwuXG4gICAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgZm9yIFwicmVtYWluaW5nIHdoZWVsIGV2ZW50cyBpbiB0aGlzIHNjcm9sbFwiIGRldGVybWluYXRpb24uXG4gICAgICAgICAgLy8gSWYgMS00IGFyZW4ndCBzYXRpc2ZpZWQsIHRoZW4gd2FpdCB0byBzbmFwIHVudGlsIDUwMG1zIGFmdGVyIHRoZSBsYXN0IGV2ZW50LlxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNoaWZ0KCk7IC8vIG9ubHkgc3RvcmUgdGhlIGxhc3QgTiBldmVudHNcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBwcmV2RXZlbnQgPSByZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPyByZWNlbnRXaGVlbEV2ZW50c1tyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb25zdCBmaXJzdEV2ZW50ID0gcmVjZW50V2hlZWxFdmVudHNbMF07XG4gICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMucHVzaChuZXdFdmVudCk7XG4gICAgICAgICAgaWYgKHByZXZFdmVudCAmJiAobmV3RXZlbnQuZGVsdGEgPiBwcmV2RXZlbnQuZGVsdGEgfHwgbmV3RXZlbnQuZGlyZWN0aW9uICE9PSBwcmV2RXZlbnQuZGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gSW5jcmVhc2luZyBvciByZXZlcnNlLXNpZ24gZGVsdGEgbWVhbnMgdGhlIHVzZXIgc3RhcnRlZCBzY3JvbGxpbmcgYWdhaW4uIENsZWFyIHRoZSB3aGVlbCBldmVudCBsb2cuXG4gICAgICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zcGxpY2UoMCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPj0gMTUgJiYgbmV3RXZlbnQudGltZSAtIGZpcnN0RXZlbnQudGltZSA8IDUwMCAmJiBmaXJzdEV2ZW50LmRlbHRhIC0gbmV3RXZlbnQuZGVsdGEgPj0gMSAmJiBuZXdFdmVudC5kZWx0YSA8PSA2KSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBhdCB0aGUgZW5kIG9mIHRoZSBkZWNlbGVyYXRpb24gb2YgYSBtb21lbnR1bSBzY3JvbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAgICAgICAgICAgLy8gdG8gd2FpdCBmb3IgbW9yZSBldmVudHMuIFNuYXAgQVNBUCBvbiB0aGUgbmV4dCB0aWNrLlxuICAgICAgICAgICAgLy8gQWxzbywgYmVjYXVzZSB0aGVyZSdzIHNvbWUgcmVtYWluaW5nIG1vbWVudHVtIHdlJ2xsIGJpYXMgdGhlIHNuYXAgaW4gdGhlXG4gICAgICAgICAgICAvLyBkaXJlY3Rpb24gb2YgdGhlIG9uZ29pbmcgc2Nyb2xsIGJlY2F1c2UgaXQncyBiZXR0ZXIgVVggZm9yIHRoZSBzY3JvbGwgdG8gc25hcFxuICAgICAgICAgICAgLy8gaW4gdGhlIHNhbWUgZGlyZWN0aW9uIGFzIHRoZSBzY3JvbGwgaW5zdGVhZCBvZiByZXZlcnNpbmcgdG8gc25hcC4gIFRoZXJlZm9yZSxcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYWxyZWFkeSBzY3JvbGxlZCBtb3JlIHRoYW4gMjAlIGluIHRoZSBjdXJyZW50IGRpcmVjdGlvbiwga2VlcCBnb2luZy5cbiAgICAgICAgICAgIGNvbnN0IHNuYXBUb1RocmVzaG9sZCA9IGRlbHRhID4gMCA/IDAuOCA6IDAuMjtcbiAgICAgICAgICAgIGxhc3RFdmVudEJlZm9yZVNuYXAgPSBuZXdFdmVudDtcbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIucGFyYW1zKSByZXR1cm47XG4gICAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdChzd2lwZXIucGFyYW1zLnNwZWVkLCB0cnVlLCB1bmRlZmluZWQsIHNuYXBUb1RocmVzaG9sZCk7XG4gICAgICAgICAgICB9LCAwKTsgLy8gbm8gZGVsYXk7IG1vdmUgb24gbmV4dCB0aWNrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICAvLyBpZiB3ZSBnZXQgaGVyZSwgdGhlbiB3ZSBoYXZlbid0IGRldGVjdGVkIHRoZSBlbmQgb2YgYSBtb21lbnR1bSBzY3JvbGwsIHNvXG4gICAgICAgICAgICAvLyB3ZSdsbCBjb25zaWRlciBhIHNjcm9sbCBcImNvbXBsZXRlXCIgd2hlbiB0aGVyZSBoYXZlbid0IGJlZW4gYW55IHdoZWVsIGV2ZW50c1xuICAgICAgICAgICAgLy8gZm9yIDUwMG1zLlxuICAgICAgICAgICAgdGltZW91dCA9IG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5wYXJhbXMpIHJldHVybjtcbiAgICAgICAgICAgICAgY29uc3Qgc25hcFRvVGhyZXNob2xkID0gMC41O1xuICAgICAgICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gbmV3RXZlbnQ7XG4gICAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHVuZGVmaW5lZCwgc25hcFRvVGhyZXNob2xkKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW1pdCBldmVudFxuICAgICAgICBpZiAoIWlnbm9yZVdoZWVsRXZlbnRzKSBlbWl0KCdzY3JvbGwnLCBlKTtcblxuICAgICAgICAvLyBTdG9wIGF1dG9wbGF5XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5ICYmIHN3aXBlci5wYXJhbXMuYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbikgc3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcbiAgICAgICAgLy8gUmV0dXJuIHBhZ2Ugc2Nyb2xsIG9uIGVkZ2UgcG9zaXRpb25zXG4gICAgICAgIGlmIChwYXJhbXMucmVsZWFzZU9uRWRnZXMgJiYgKHBvc2l0aW9uID09PSBzd2lwZXIubWluVHJhbnNsYXRlKCkgfHwgcG9zaXRpb24gPT09IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBldmVudHMobWV0aG9kKSB7XG4gICAgbGV0IHRhcmdldEVsID0gc3dpcGVyLmVsO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZXZlbnRzVGFyZ2V0ICE9PSAnY29udGFpbmVyJykge1xuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQpO1xuICAgIH1cbiAgICB0YXJnZXRFbFttZXRob2RdKCdtb3VzZWVudGVyJywgaGFuZGxlTW91c2VFbnRlcik7XG4gICAgdGFyZ2V0RWxbbWV0aG9kXSgnbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xuICAgIHRhcmdldEVsW21ldGhvZF0oJ3doZWVsJywgaGFuZGxlKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIGhhbmRsZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcbiAgICBldmVudHMoJ2FkZEV2ZW50TGlzdGVuZXInKTtcbiAgICBzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcbiAgICBldmVudHMoJ3JlbW92ZUV2ZW50TGlzdGVuZXInKTtcbiAgICBzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5lbmFibGVkKSBlbmFibGUoKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIGVuYWJsZSgpO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLm1vdXNld2hlZWwuZW5hYmxlZCkgZGlzYWJsZSgpO1xuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIubW91c2V3aGVlbCwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlXG4gIH0pO1xufVxuXG5leHBvcnQgeyBNb3VzZXdoZWVsIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGUgYXMgZWxlbWVudENoaWxkcmVuLCBjIGFzIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBvcmlnaW5hbFBhcmFtcywgcGFyYW1zLCBjaGVja1Byb3BzKSB7XG4gIGlmIChzd2lwZXIucGFyYW1zLmNyZWF0ZUVsZW1lbnRzKSB7XG4gICAgT2JqZWN0LmtleXMoY2hlY2tQcm9wcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCFwYXJhbXNba2V5XSAmJiBwYXJhbXMuYXV0byA9PT0gdHJ1ZSkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRDaGlsZHJlbihzd2lwZXIuZWwsIGAuJHtjaGVja1Byb3BzW2tleV19YClbMF07XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBjaGVja1Byb3BzW2tleV0pO1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2hlY2tQcm9wc1trZXldO1xuICAgICAgICAgIHN3aXBlci5lbC5hcHBlbmQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zW2tleV0gPSBlbGVtZW50O1xuICAgICAgICBvcmlnaW5hbFBhcmFtc1trZXldID0gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIGFzIGMgfTtcbiIsImltcG9ydCB7IGMgYXMgY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZCB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtZWxlbWVudC1pZi1ub3QtZGVmaW5lZC5tanMnO1xuaW1wb3J0IHsgbSBhcyBtYWtlRWxlbWVudHNBcnJheSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBOYXZpZ2F0aW9uKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBudWxsLFxuICAgICAgcHJldkVsOiBudWxsLFxuICAgICAgaGlkZU9uQ2xpY2s6IGZhbHNlLFxuICAgICAgZGlzYWJsZWRDbGFzczogJ3N3aXBlci1idXR0b24tZGlzYWJsZWQnLFxuICAgICAgaGlkZGVuQ2xhc3M6ICdzd2lwZXItYnV0dG9uLWhpZGRlbicsXG4gICAgICBsb2NrQ2xhc3M6ICdzd2lwZXItYnV0dG9uLWxvY2snLFxuICAgICAgbmF2aWdhdGlvbkRpc2FibGVkQ2xhc3M6ICdzd2lwZXItbmF2aWdhdGlvbi1kaXNhYmxlZCdcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIubmF2aWdhdGlvbiA9IHtcbiAgICBuZXh0RWw6IG51bGwsXG4gICAgcHJldkVsOiBudWxsXG4gIH07XG4gIGZ1bmN0aW9uIGdldEVsKGVsKSB7XG4gICAgbGV0IHJlcztcbiAgICBpZiAoZWwgJiYgdHlwZW9mIGVsID09PSAnc3RyaW5nJyAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICByZXMgPSBzd2lwZXIuZWwucXVlcnlTZWxlY3RvcihlbCkgfHwgc3dpcGVyLmhvc3RFbC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICAgIGlmIChyZXMpIHJldHVybiByZXM7XG4gICAgfVxuICAgIGlmIChlbCkge1xuICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHJlcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKV07XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy51bmlxdWVOYXZFbGVtZW50cyAmJiB0eXBlb2YgZWwgPT09ICdzdHJpbmcnICYmIHJlcyAmJiByZXMubGVuZ3RoID4gMSAmJiBzd2lwZXIuZWwucXVlcnlTZWxlY3RvckFsbChlbCkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJlcyA9IHN3aXBlci5lbC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzICYmIHJlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmVzID0gcmVzWzBdO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZWwgJiYgIXJlcykgcmV0dXJuIGVsO1xuICAgIC8vIGlmIChBcnJheS5pc0FycmF5KHJlcykgJiYgcmVzLmxlbmd0aCA9PT0gMSkgcmVzID0gcmVzWzBdO1xuICAgIHJldHVybiByZXM7XG4gIH1cbiAgZnVuY3Rpb24gdG9nZ2xlRWwoZWwsIGRpc2FibGVkKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uO1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgaWYgKHN1YkVsKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdFtkaXNhYmxlZCA/ICdhZGQnIDogJ3JlbW92ZSddKC4uLnBhcmFtcy5kaXNhYmxlZENsYXNzLnNwbGl0KCcgJykpO1xuICAgICAgICBpZiAoc3ViRWwudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHN1YkVsLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgICAgICBzdWJFbC5jbGFzc0xpc3Rbc3dpcGVyLmlzTG9ja2VkID8gJ2FkZCcgOiAncmVtb3ZlJ10ocGFyYW1zLmxvY2tDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgLy8gVXBkYXRlIE5hdmlnYXRpb24gQnV0dG9uc1xuICAgIGNvbnN0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICB0b2dnbGVFbChwcmV2RWwsIGZhbHNlKTtcbiAgICAgIHRvZ2dsZUVsKG5leHRFbCwgZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2dnbGVFbChwcmV2RWwsIHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5yZXdpbmQpO1xuICAgIHRvZ2dsZUVsKG5leHRFbCwgc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLnJld2luZCk7XG4gIH1cbiAgZnVuY3Rpb24gb25QcmV2Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgIXN3aXBlci5wYXJhbXMucmV3aW5kKSByZXR1cm47XG4gICAgc3dpcGVyLnNsaWRlUHJldigpO1xuICAgIGVtaXQoJ25hdmlnYXRpb25QcmV2Jyk7XG4gIH1cbiAgZnVuY3Rpb24gb25OZXh0Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgIXN3aXBlci5wYXJhbXMucmV3aW5kKSByZXR1cm47XG4gICAgc3dpcGVyLnNsaWRlTmV4dCgpO1xuICAgIGVtaXQoJ25hdmlnYXRpb25OZXh0Jyk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb247XG4gICAgc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uID0gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIHN3aXBlci5vcmlnaW5hbFBhcmFtcy5uYXZpZ2F0aW9uLCBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24sIHtcbiAgICAgIG5leHRFbDogJ3N3aXBlci1idXR0b24tbmV4dCcsXG4gICAgICBwcmV2RWw6ICdzd2lwZXItYnV0dG9uLXByZXYnXG4gICAgfSk7XG4gICAgaWYgKCEocGFyYW1zLm5leHRFbCB8fCBwYXJhbXMucHJldkVsKSkgcmV0dXJuO1xuICAgIGxldCBuZXh0RWwgPSBnZXRFbChwYXJhbXMubmV4dEVsKTtcbiAgICBsZXQgcHJldkVsID0gZ2V0RWwocGFyYW1zLnByZXZFbCk7XG4gICAgT2JqZWN0LmFzc2lnbihzd2lwZXIubmF2aWdhdGlvbiwge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSk7XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGNvbnN0IGluaXRCdXR0b24gPSAoZWwsIGRpcikgPT4ge1xuICAgICAgaWYgKGVsKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGlyID09PSAnbmV4dCcgPyBvbk5leHRDbGljayA6IG9uUHJldkNsaWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghc3dpcGVyLmVuYWJsZWQgJiYgZWwpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCguLi5wYXJhbXMubG9ja0NsYXNzLnNwbGl0KCcgJykpO1xuICAgICAgfVxuICAgIH07XG4gICAgbmV4dEVsLmZvckVhY2goZWwgPT4gaW5pdEJ1dHRvbihlbCwgJ25leHQnKSk7XG4gICAgcHJldkVsLmZvckVhY2goZWwgPT4gaW5pdEJ1dHRvbihlbCwgJ3ByZXYnKSk7XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBsZXQge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uO1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBjb25zdCBkZXN0cm95QnV0dG9uID0gKGVsLCBkaXIpID0+IHtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGlyID09PSAnbmV4dCcgPyBvbk5leHRDbGljayA6IG9uUHJldkNsaWNrKTtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmRpc2FibGVkQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgfTtcbiAgICBuZXh0RWwuZm9yRWFjaChlbCA9PiBkZXN0cm95QnV0dG9uKGVsLCAnbmV4dCcpKTtcbiAgICBwcmV2RWwuZm9yRWFjaChlbCA9PiBkZXN0cm95QnV0dG9uKGVsLCAncHJldicpKTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdCgpO1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3RvRWRnZSBmcm9tRWRnZSBsb2NrIHVubG9jaycsICgpID0+IHtcbiAgICB1cGRhdGUoKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGRlc3Ryb3koKTtcbiAgfSk7XG4gIG9uKCdlbmFibGUgZGlzYWJsZScsICgpID0+IHtcbiAgICBsZXQge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uO1xuICAgIG5leHRFbCA9IG1ha2VFbGVtZW50c0FycmF5KG5leHRFbCk7XG4gICAgcHJldkVsID0gbWFrZUVsZW1lbnRzQXJyYXkocHJldkVsKTtcbiAgICBpZiAoc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgIHVwZGF0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBbLi4ubmV4dEVsLCAuLi5wcmV2RWxdLmZpbHRlcihlbCA9PiAhIWVsKS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmxvY2tDbGFzcykpO1xuICB9KTtcbiAgb24oJ2NsaWNrJywgKF9zLCBlKSA9PiB7XG4gICAgbGV0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgY29uc3QgdGFyZ2V0RWwgPSBlLnRhcmdldDtcbiAgICBsZXQgdGFyZ2V0SXNCdXR0b24gPSBwcmV2RWwuaW5jbHVkZXModGFyZ2V0RWwpIHx8IG5leHRFbC5pbmNsdWRlcyh0YXJnZXRFbCk7XG4gICAgaWYgKHN3aXBlci5pc0VsZW1lbnQgJiYgIXRhcmdldElzQnV0dG9uKSB7XG4gICAgICBjb25zdCBwYXRoID0gZS5wYXRoIHx8IGUuY29tcG9zZWRQYXRoICYmIGUuY29tcG9zZWRQYXRoKCk7XG4gICAgICBpZiAocGF0aCkge1xuICAgICAgICB0YXJnZXRJc0J1dHRvbiA9IHBhdGguZmluZChwYXRoRWwgPT4gbmV4dEVsLmluY2x1ZGVzKHBhdGhFbCkgfHwgcHJldkVsLmluY2x1ZGVzKHBhdGhFbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmhpZGVPbkNsaWNrICYmICF0YXJnZXRJc0J1dHRvbikge1xuICAgICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uY2xpY2thYmxlICYmIChzd2lwZXIucGFnaW5hdGlvbi5lbCA9PT0gdGFyZ2V0RWwgfHwgc3dpcGVyLnBhZ2luYXRpb24uZWwuY29udGFpbnModGFyZ2V0RWwpKSkgcmV0dXJuO1xuICAgICAgbGV0IGlzSGlkZGVuO1xuICAgICAgaWYgKG5leHRFbC5sZW5ndGgpIHtcbiAgICAgICAgaXNIaWRkZW4gPSBuZXh0RWxbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZFbC5sZW5ndGgpIHtcbiAgICAgICAgaXNIaWRkZW4gPSBwcmV2RWxbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoaXNIaWRkZW4gPT09IHRydWUpIHtcbiAgICAgICAgZW1pdCgnbmF2aWdhdGlvblNob3cnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVtaXQoJ25hdmlnYXRpb25IaWRlJyk7XG4gICAgICB9XG4gICAgICBbLi4ubmV4dEVsLCAuLi5wcmV2RWxdLmZpbHRlcihlbCA9PiAhIWVsKS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC50b2dnbGUoc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmhpZGRlbkNsYXNzKSk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW5hYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5uYXZpZ2F0aW9uRGlzYWJsZWRDbGFzcy5zcGxpdCgnICcpKTtcbiAgICBpbml0KCk7XG4gICAgdXBkYXRlKCk7XG4gIH07XG4gIGNvbnN0IGRpc2FibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoLi4uc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLm5hdmlnYXRpb25EaXNhYmxlZENsYXNzLnNwbGl0KCcgJykpO1xuICAgIGRlc3Ryb3koKTtcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIubmF2aWdhdGlvbiwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICAgIHVwZGF0ZSxcbiAgICBpbml0LFxuICAgIGRlc3Ryb3lcbiAgfSk7XG59XG5cbmV4cG9ydCB7IE5hdmlnYXRpb24gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjbGFzc2VzVG9TZWxlY3RvciB9IGZyb20gJy4uL3NoYXJlZC9jbGFzc2VzLXRvLXNlbGVjdG9yLm1qcyc7XG5pbXBvcnQgeyBjIGFzIGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLWVsZW1lbnQtaWYtbm90LWRlZmluZWQubWpzJztcbmltcG9ydCB7IG0gYXMgbWFrZUVsZW1lbnRzQXJyYXksIGYgYXMgZWxlbWVudE91dGVyU2l6ZSwgaCBhcyBlbGVtZW50SW5kZXgsIGEgYXMgZWxlbWVudFBhcmVudHMgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gUGFnaW5hdGlvbihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBwZnggPSAnc3dpcGVyLXBhZ2luYXRpb24nO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIGVsOiBudWxsLFxuICAgICAgYnVsbGV0RWxlbWVudDogJ3NwYW4nLFxuICAgICAgY2xpY2thYmxlOiBmYWxzZSxcbiAgICAgIGhpZGVPbkNsaWNrOiBmYWxzZSxcbiAgICAgIHJlbmRlckJ1bGxldDogbnVsbCxcbiAgICAgIHJlbmRlclByb2dyZXNzYmFyOiBudWxsLFxuICAgICAgcmVuZGVyRnJhY3Rpb246IG51bGwsXG4gICAgICByZW5kZXJDdXN0b206IG51bGwsXG4gICAgICBwcm9ncmVzc2Jhck9wcG9zaXRlOiBmYWxzZSxcbiAgICAgIHR5cGU6ICdidWxsZXRzJyxcbiAgICAgIC8vICdidWxsZXRzJyBvciAncHJvZ3Jlc3NiYXInIG9yICdmcmFjdGlvbicgb3IgJ2N1c3RvbSdcbiAgICAgIGR5bmFtaWNCdWxsZXRzOiBmYWxzZSxcbiAgICAgIGR5bmFtaWNNYWluQnVsbGV0czogMSxcbiAgICAgIGZvcm1hdEZyYWN0aW9uQ3VycmVudDogbnVtYmVyID0+IG51bWJlcixcbiAgICAgIGZvcm1hdEZyYWN0aW9uVG90YWw6IG51bWJlciA9PiBudW1iZXIsXG4gICAgICBidWxsZXRDbGFzczogYCR7cGZ4fS1idWxsZXRgLFxuICAgICAgYnVsbGV0QWN0aXZlQ2xhc3M6IGAke3BmeH0tYnVsbGV0LWFjdGl2ZWAsXG4gICAgICBtb2RpZmllckNsYXNzOiBgJHtwZnh9LWAsXG4gICAgICBjdXJyZW50Q2xhc3M6IGAke3BmeH0tY3VycmVudGAsXG4gICAgICB0b3RhbENsYXNzOiBgJHtwZnh9LXRvdGFsYCxcbiAgICAgIGhpZGRlbkNsYXNzOiBgJHtwZnh9LWhpZGRlbmAsXG4gICAgICBwcm9ncmVzc2JhckZpbGxDbGFzczogYCR7cGZ4fS1wcm9ncmVzc2Jhci1maWxsYCxcbiAgICAgIHByb2dyZXNzYmFyT3Bwb3NpdGVDbGFzczogYCR7cGZ4fS1wcm9ncmVzc2Jhci1vcHBvc2l0ZWAsXG4gICAgICBjbGlja2FibGVDbGFzczogYCR7cGZ4fS1jbGlja2FibGVgLFxuICAgICAgbG9ja0NsYXNzOiBgJHtwZnh9LWxvY2tgLFxuICAgICAgaG9yaXpvbnRhbENsYXNzOiBgJHtwZnh9LWhvcml6b250YWxgLFxuICAgICAgdmVydGljYWxDbGFzczogYCR7cGZ4fS12ZXJ0aWNhbGAsXG4gICAgICBwYWdpbmF0aW9uRGlzYWJsZWRDbGFzczogYCR7cGZ4fS1kaXNhYmxlZGBcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIucGFnaW5hdGlvbiA9IHtcbiAgICBlbDogbnVsbCxcbiAgICBidWxsZXRzOiBbXVxuICB9O1xuICBsZXQgYnVsbGV0U2l6ZTtcbiAgbGV0IGR5bmFtaWNCdWxsZXRJbmRleCA9IDA7XG4gIGZ1bmN0aW9uIGlzUGFnaW5hdGlvbkRpc2FibGVkKCkge1xuICAgIHJldHVybiAhc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmVsIHx8ICFzd2lwZXIucGFnaW5hdGlvbi5lbCB8fCBBcnJheS5pc0FycmF5KHN3aXBlci5wYWdpbmF0aW9uLmVsKSAmJiBzd2lwZXIucGFnaW5hdGlvbi5lbC5sZW5ndGggPT09IDA7XG4gIH1cbiAgZnVuY3Rpb24gc2V0U2lkZUJ1bGxldHMoYnVsbGV0RWwsIHBvc2l0aW9uKSB7XG4gICAgY29uc3Qge1xuICAgICAgYnVsbGV0QWN0aXZlQ2xhc3NcbiAgICB9ID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmICghYnVsbGV0RWwpIHJldHVybjtcbiAgICBidWxsZXRFbCA9IGJ1bGxldEVsW2Ake3Bvc2l0aW9uID09PSAncHJldicgPyAncHJldmlvdXMnIDogJ25leHQnfUVsZW1lbnRTaWJsaW5nYF07XG4gICAgaWYgKGJ1bGxldEVsKSB7XG4gICAgICBidWxsZXRFbC5jbGFzc0xpc3QuYWRkKGAke2J1bGxldEFjdGl2ZUNsYXNzfS0ke3Bvc2l0aW9ufWApO1xuICAgICAgYnVsbGV0RWwgPSBidWxsZXRFbFtgJHtwb3NpdGlvbiA9PT0gJ3ByZXYnID8gJ3ByZXZpb3VzJyA6ICduZXh0J31FbGVtZW50U2libGluZ2BdO1xuICAgICAgaWYgKGJ1bGxldEVsKSB7XG4gICAgICAgIGJ1bGxldEVsLmNsYXNzTGlzdC5hZGQoYCR7YnVsbGV0QWN0aXZlQ2xhc3N9LSR7cG9zaXRpb259LSR7cG9zaXRpb259YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVEaXJlY3Rpb24ocHJldkluZGV4LCBuZXh0SW5kZXgsIGxlbmd0aCkge1xuICAgIHByZXZJbmRleCA9IHByZXZJbmRleCAlIGxlbmd0aDtcbiAgICBuZXh0SW5kZXggPSBuZXh0SW5kZXggJSBsZW5ndGg7XG4gICAgaWYgKG5leHRJbmRleCA9PT0gcHJldkluZGV4ICsgMSkge1xuICAgICAgcmV0dXJuICduZXh0JztcbiAgICB9IGVsc2UgaWYgKG5leHRJbmRleCA9PT0gcHJldkluZGV4IC0gMSkge1xuICAgICAgcmV0dXJuICdwcmV2aW91cyc7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBmdW5jdGlvbiBvbkJ1bGxldENsaWNrKGUpIHtcbiAgICBjb25zdCBidWxsZXRFbCA9IGUudGFyZ2V0LmNsb3Nlc3QoY2xhc3Nlc1RvU2VsZWN0b3Ioc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldENsYXNzKSk7XG4gICAgaWYgKCFidWxsZXRFbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgaW5kZXggPSBlbGVtZW50SW5kZXgoYnVsbGV0RWwpICogc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBpZiAoc3dpcGVyLnJlYWxJbmRleCA9PT0gaW5kZXgpIHJldHVybjtcbiAgICAgIGNvbnN0IG1vdmVEaXJlY3Rpb24gPSBnZXRNb3ZlRGlyZWN0aW9uKHN3aXBlci5yZWFsSW5kZXgsIGluZGV4LCBzd2lwZXIuc2xpZGVzLmxlbmd0aCk7XG4gICAgICBpZiAobW92ZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgIH0gZWxzZSBpZiAobW92ZURpcmVjdGlvbiA9PT0gJ3ByZXZpb3VzJykge1xuICAgICAgICBzd2lwZXIuc2xpZGVQcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIuc2xpZGVUb0xvb3AoaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhpbmRleCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAvLyBSZW5kZXIgfHwgVXBkYXRlIFBhZ2luYXRpb24gYnVsbGV0cy9pdGVtc1xuICAgIGNvbnN0IHJ0bCA9IHN3aXBlci5ydGw7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgLy8gQ3VycmVudC9Ub3RhbFxuICAgIGxldCBjdXJyZW50O1xuICAgIGxldCBwcmV2aW91c0luZGV4O1xuICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICAgIGNvbnN0IHRvdGFsID0gc3dpcGVyLnBhcmFtcy5sb29wID8gTWF0aC5jZWlsKHNsaWRlc0xlbmd0aCAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBwcmV2aW91c0luZGV4ID0gc3dpcGVyLnByZXZpb3VzUmVhbEluZGV4IHx8IDA7XG4gICAgICBjdXJyZW50ID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA+IDEgPyBNYXRoLmZsb29yKHN3aXBlci5yZWFsSW5kZXggLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKSA6IHN3aXBlci5yZWFsSW5kZXg7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3dpcGVyLnNuYXBJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGN1cnJlbnQgPSBzd2lwZXIuc25hcEluZGV4O1xuICAgICAgcHJldmlvdXNJbmRleCA9IHN3aXBlci5wcmV2aW91c1NuYXBJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNJbmRleCA9IHN3aXBlci5wcmV2aW91c0luZGV4IHx8IDA7XG4gICAgICBjdXJyZW50ID0gc3dpcGVyLmFjdGl2ZUluZGV4IHx8IDA7XG4gICAgfVxuICAgIC8vIFR5cGVzXG4gICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cyAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGJ1bGxldHMgPSBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzO1xuICAgICAgbGV0IGZpcnN0SW5kZXg7XG4gICAgICBsZXQgbGFzdEluZGV4O1xuICAgICAgbGV0IG1pZEluZGV4O1xuICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICBidWxsZXRTaXplID0gZWxlbWVudE91dGVyU2l6ZShidWxsZXRzWzBdLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnd2lkdGgnIDogJ2hlaWdodCcsIHRydWUpO1xuICAgICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgICAgICBzdWJFbC5zdHlsZVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnd2lkdGgnIDogJ2hlaWdodCddID0gYCR7YnVsbGV0U2l6ZSAqIChwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzICsgNCl9cHhgO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgPiAxICYmIHByZXZpb3VzSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCArPSBjdXJyZW50IC0gKHByZXZpb3VzSW5kZXggfHwgMCk7XG4gICAgICAgICAgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA+IHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgLSAxKSB7XG4gICAgICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzIC0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpcnN0SW5kZXggPSBNYXRoLm1heChjdXJyZW50IC0gZHluYW1pY0J1bGxldEluZGV4LCAwKTtcbiAgICAgICAgbGFzdEluZGV4ID0gZmlyc3RJbmRleCArIChNYXRoLm1pbihidWxsZXRzLmxlbmd0aCwgcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cykgLSAxKTtcbiAgICAgICAgbWlkSW5kZXggPSAobGFzdEluZGV4ICsgZmlyc3RJbmRleCkgLyAyO1xuICAgICAgfVxuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldEVsID0+IHtcbiAgICAgICAgY29uc3QgY2xhc3Nlc1RvUmVtb3ZlID0gWy4uLlsnJywgJy1uZXh0JywgJy1uZXh0LW5leHQnLCAnLXByZXYnLCAnLXByZXYtcHJldicsICctbWFpbiddLm1hcChzdWZmaXggPT4gYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfSR7c3VmZml4fWApXS5tYXAocyA9PiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgJiYgcy5pbmNsdWRlcygnICcpID8gcy5zcGxpdCgnICcpIDogcykuZmxhdCgpO1xuICAgICAgICBidWxsZXRFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNUb1JlbW92ZSk7XG4gICAgICB9KTtcbiAgICAgIGlmIChlbC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1bGxldEluZGV4ID0gZWxlbWVudEluZGV4KGJ1bGxldCk7XG4gICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCguLi5wYXJhbXMuYnVsbGV0QWN0aXZlQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICAgICAgICBidWxsZXQuc2V0QXR0cmlidXRlKCdwYXJ0JywgJ2J1bGxldCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XG4gICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPj0gZmlyc3RJbmRleCAmJiBidWxsZXRJbmRleCA8PSBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoLi4uYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYC5zcGxpdCgnICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWxsZXRJbmRleCA9PT0gZmlyc3RJbmRleCkge1xuICAgICAgICAgICAgICBzZXRTaWRlQnVsbGV0cyhidWxsZXQsICdwcmV2Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPT09IGxhc3RJbmRleCkge1xuICAgICAgICAgICAgICBzZXRTaWRlQnVsbGV0cyhidWxsZXQsICduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1bGxldCA9IGJ1bGxldHNbY3VycmVudF07XG4gICAgICAgIGlmIChidWxsZXQpIHtcbiAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCguLi5wYXJhbXMuYnVsbGV0QWN0aXZlQ2xhc3Muc3BsaXQoJyAnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgICAgICBidWxsZXRzLmZvckVhY2goKGJ1bGxldEVsLCBidWxsZXRJbmRleCkgPT4ge1xuICAgICAgICAgICAgYnVsbGV0RWwuc2V0QXR0cmlidXRlKCdwYXJ0JywgYnVsbGV0SW5kZXggPT09IGN1cnJlbnQgPyAnYnVsbGV0LWFjdGl2ZScgOiAnYnVsbGV0Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICAgIGNvbnN0IGZpcnN0RGlzcGxheWVkQnVsbGV0ID0gYnVsbGV0c1tmaXJzdEluZGV4XTtcbiAgICAgICAgICBjb25zdCBsYXN0RGlzcGxheWVkQnVsbGV0ID0gYnVsbGV0c1tsYXN0SW5kZXhdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBmaXJzdEluZGV4OyBpIDw9IGxhc3RJbmRleDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoYnVsbGV0c1tpXSkge1xuICAgICAgICAgICAgICBidWxsZXRzW2ldLmNsYXNzTGlzdC5hZGQoLi4uYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYC5zcGxpdCgnICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U2lkZUJ1bGxldHMoZmlyc3REaXNwbGF5ZWRCdWxsZXQsICdwcmV2Jyk7XG4gICAgICAgICAgc2V0U2lkZUJ1bGxldHMobGFzdERpc3BsYXllZEJ1bGxldCwgJ25leHQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xuICAgICAgICBjb25zdCBkeW5hbWljQnVsbGV0c0xlbmd0aCA9IE1hdGgubWluKGJ1bGxldHMubGVuZ3RoLCBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzICsgNCk7XG4gICAgICAgIGNvbnN0IGJ1bGxldHNPZmZzZXQgPSAoYnVsbGV0U2l6ZSAqIGR5bmFtaWNCdWxsZXRzTGVuZ3RoIC0gYnVsbGV0U2l6ZSkgLyAyIC0gbWlkSW5kZXggKiBidWxsZXRTaXplO1xuICAgICAgICBjb25zdCBvZmZzZXRQcm9wID0gcnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgICAgYnVsbGV0LnN0eWxlW3N3aXBlci5pc0hvcml6b250YWwoKSA/IG9mZnNldFByb3AgOiAndG9wJ10gPSBgJHtidWxsZXRzT2Zmc2V0fXB4YDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsLmZvckVhY2goKHN1YkVsLCBzdWJFbEluZGV4KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdmcmFjdGlvbicpIHtcbiAgICAgICAgc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMuY3VycmVudENsYXNzKSkuZm9yRWFjaChmcmFjdGlvbkVsID0+IHtcbiAgICAgICAgICBmcmFjdGlvbkVsLnRleHRDb250ZW50ID0gcGFyYW1zLmZvcm1hdEZyYWN0aW9uQ3VycmVudChjdXJyZW50ICsgMSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzdWJFbC5xdWVyeVNlbGVjdG9yQWxsKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy50b3RhbENsYXNzKSkuZm9yRWFjaCh0b3RhbEVsID0+IHtcbiAgICAgICAgICB0b3RhbEVsLnRleHRDb250ZW50ID0gcGFyYW1zLmZvcm1hdEZyYWN0aW9uVG90YWwodG90YWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJykge1xuICAgICAgICBsZXQgcHJvZ3Jlc3NiYXJEaXJlY3Rpb247XG4gICAgICAgIGlmIChwYXJhbXMucHJvZ3Jlc3NiYXJPcHBvc2l0ZSkge1xuICAgICAgICAgIHByb2dyZXNzYmFyRGlyZWN0aW9uID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc2JhckRpcmVjdGlvbiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2NhbGUgPSAoY3VycmVudCArIDEpIC8gdG90YWw7XG4gICAgICAgIGxldCBzY2FsZVggPSAxO1xuICAgICAgICBsZXQgc2NhbGVZID0gMTtcbiAgICAgICAgaWYgKHByb2dyZXNzYmFyRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICBzY2FsZVggPSBzY2FsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZVkgPSBzY2FsZTtcbiAgICAgICAgfVxuICAgICAgICBzdWJFbC5xdWVyeVNlbGVjdG9yQWxsKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy5wcm9ncmVzc2JhckZpbGxDbGFzcykpLmZvckVhY2gocHJvZ3Jlc3NFbCA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3NFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlWCgke3NjYWxlWH0pIHNjYWxlWSgke3NjYWxlWX0pYDtcbiAgICAgICAgICBwcm9ncmVzc0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3N3aXBlci5wYXJhbXMuc3BlZWR9bXNgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2N1c3RvbScgJiYgcGFyYW1zLnJlbmRlckN1c3RvbSkge1xuICAgICAgICBzdWJFbC5pbm5lckhUTUwgPSBwYXJhbXMucmVuZGVyQ3VzdG9tKHN3aXBlciwgY3VycmVudCArIDEsIHRvdGFsKTtcbiAgICAgICAgaWYgKHN1YkVsSW5kZXggPT09IDApIGVtaXQoJ3BhZ2luYXRpb25SZW5kZXInLCBzdWJFbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3ViRWxJbmRleCA9PT0gMCkgZW1pdCgncGFnaW5hdGlvblJlbmRlcicsIHN1YkVsKTtcbiAgICAgICAgZW1pdCgncGFnaW5hdGlvblVwZGF0ZScsIHN1YkVsKTtcbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmVuYWJsZWQpIHtcbiAgICAgICAgc3ViRWwuY2xhc3NMaXN0W3N3aXBlci5pc0xvY2tlZCA/ICdhZGQnIDogJ3JlbW92ZSddKHBhcmFtcy5sb2NrQ2xhc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyBSZW5kZXIgQ29udGFpbmVyXG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgY29uc3Qgc2xpZGVzTGVuZ3RoID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc3dpcGVyLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxID8gc3dpcGVyLnNsaWRlcy5sZW5ndGggLyBNYXRoLmNlaWwoc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MpIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgbGV0IHBhZ2luYXRpb25IVE1MID0gJyc7XG4gICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycpIHtcbiAgICAgIGxldCBudW1iZXJPZkJ1bGxldHMgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBNYXRoLmNlaWwoc2xpZGVzTGVuZ3RoIC8gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCkgOiBzd2lwZXIuc25hcEdyaWQubGVuZ3RoO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZnJlZU1vZGUgJiYgc3dpcGVyLnBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIG51bWJlck9mQnVsbGV0cyA+IHNsaWRlc0xlbmd0aCkge1xuICAgICAgICBudW1iZXJPZkJ1bGxldHMgPSBzbGlkZXNMZW5ndGg7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mQnVsbGV0czsgaSArPSAxKSB7XG4gICAgICAgIGlmIChwYXJhbXMucmVuZGVyQnVsbGV0KSB7XG4gICAgICAgICAgcGFnaW5hdGlvbkhUTUwgKz0gcGFyYW1zLnJlbmRlckJ1bGxldC5jYWxsKHN3aXBlciwgaSwgcGFyYW1zLmJ1bGxldENsYXNzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICBwYWdpbmF0aW9uSFRNTCArPSBgPCR7cGFyYW1zLmJ1bGxldEVsZW1lbnR9ICR7c3dpcGVyLmlzRWxlbWVudCA/ICdwYXJ0PVwiYnVsbGV0XCInIDogJyd9IGNsYXNzPVwiJHtwYXJhbXMuYnVsbGV0Q2xhc3N9XCI+PC8ke3BhcmFtcy5idWxsZXRFbGVtZW50fT5gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2ZyYWN0aW9uJykge1xuICAgICAgaWYgKHBhcmFtcy5yZW5kZXJGcmFjdGlvbikge1xuICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHBhcmFtcy5yZW5kZXJGcmFjdGlvbi5jYWxsKHN3aXBlciwgcGFyYW1zLmN1cnJlbnRDbGFzcywgcGFyYW1zLnRvdGFsQ2xhc3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnaW5hdGlvbkhUTUwgPSBgPHNwYW4gY2xhc3M9XCIke3BhcmFtcy5jdXJyZW50Q2xhc3N9XCI+PC9zcGFuPmAgKyAnIC8gJyArIGA8c3BhbiBjbGFzcz1cIiR7cGFyYW1zLnRvdGFsQ2xhc3N9XCI+PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJykge1xuICAgICAgaWYgKHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhcikge1xuICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhci5jYWxsKHN3aXBlciwgcGFyYW1zLnByb2dyZXNzYmFyRmlsbENsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2luYXRpb25IVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtwYXJhbXMucHJvZ3Jlc3NiYXJGaWxsQ2xhc3N9XCI+PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMgPSBbXTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIGlmIChwYXJhbXMudHlwZSAhPT0gJ2N1c3RvbScpIHtcbiAgICAgICAgc3ViRWwuaW5uZXJIVE1MID0gcGFnaW5hdGlvbkhUTUwgfHwgJyc7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJykge1xuICAgICAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLnB1c2goLi4uc3ViRWwucXVlcnlTZWxlY3RvckFsbChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMuYnVsbGV0Q2xhc3MpKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHBhcmFtcy50eXBlICE9PSAnY3VzdG9tJykge1xuICAgICAgZW1pdCgncGFnaW5hdGlvblJlbmRlcicsIGVsWzBdKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24gPSBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkKHN3aXBlciwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLnBhZ2luYXRpb24sIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbiwge1xuICAgICAgZWw6ICdzd2lwZXItcGFnaW5hdGlvbidcbiAgICB9KTtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb247XG4gICAgaWYgKCFwYXJhbXMuZWwpIHJldHVybjtcbiAgICBsZXQgZWw7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGVsID0gc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3IocGFyYW1zLmVsKTtcbiAgICB9XG4gICAgaWYgKCFlbCAmJiB0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJykge1xuICAgICAgZWwgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpXTtcbiAgICB9XG4gICAgaWYgKCFlbCkge1xuICAgICAgZWwgPSBwYXJhbXMuZWw7XG4gICAgfVxuICAgIGlmICghZWwgfHwgZWwubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudW5pcXVlTmF2RWxlbWVudHMgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycgJiYgQXJyYXkuaXNBcnJheShlbCkgJiYgZWwubGVuZ3RoID4gMSkge1xuICAgICAgZWwgPSBbLi4uc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1zLmVsKV07XG4gICAgICAvLyBjaGVjayBpZiBpdCBiZWxvbmdzIHRvIGFub3RoZXIgbmVzdGVkIFN3aXBlclxuICAgICAgaWYgKGVsLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZWwgPSBlbC5maWx0ZXIoc3ViRWwgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50UGFyZW50cyhzdWJFbCwgJy5zd2lwZXInKVswXSAhPT0gc3dpcGVyLmVsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pWzBdO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbCkgJiYgZWwubGVuZ3RoID09PSAxKSBlbCA9IGVsWzBdO1xuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnBhZ2luYXRpb24sIHtcbiAgICAgIGVsXG4gICAgfSk7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJyAmJiBwYXJhbXMuY2xpY2thYmxlKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoLi4uKHBhcmFtcy5jbGlja2FibGVDbGFzcyB8fCAnJykuc3BsaXQoJyAnKSk7XG4gICAgICB9XG4gICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5tb2RpZmllckNsYXNzICsgcGFyYW1zLnR5cGUpO1xuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgcGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLm1vZGlmaWVyQ2xhc3N9JHtwYXJhbXMudHlwZX0tZHluYW1pY2ApO1xuICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSAwO1xuICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA8IDEpIHtcbiAgICAgICAgICBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAncHJvZ3Jlc3NiYXInICYmIHBhcmFtcy5wcm9ncmVzc2Jhck9wcG9zaXRlKSB7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5hZGQocGFyYW1zLnByb2dyZXNzYmFyT3Bwb3NpdGVDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLmNsaWNrYWJsZSkge1xuICAgICAgICBzdWJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnVsbGV0Q2xpY2spO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5sb2NrQ2xhc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XG4gICAgbGV0IGVsID0gc3dpcGVyLnBhZ2luYXRpb24uZWw7XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5oaWRkZW5DbGFzcyk7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLm1vZGlmaWVyQ2xhc3MgKyBwYXJhbXMudHlwZSk7XG4gICAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICAgICAgaWYgKHBhcmFtcy5jbGlja2FibGUpIHtcbiAgICAgICAgICBzdWJFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLihwYXJhbXMuY2xpY2thYmxlQ2xhc3MgfHwgJycpLnNwbGl0KCcgJykpO1xuICAgICAgICAgIHN1YkVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdWxsZXRDbGljayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cykgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUoLi4ucGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzLnNwbGl0KCcgJykpKTtcbiAgfVxuICBvbignY2hhbmdlRGlyZWN0aW9uJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhZ2luYXRpb24gfHwgIXN3aXBlci5wYWdpbmF0aW9uLmVsKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xuICAgIGxldCB7XG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXIucGFnaW5hdGlvbjtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmhvcml6b250YWxDbGFzcywgcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgIH0pO1xuICB9KTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBkaXNhYmxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXQoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ2FjdGl2ZUluZGV4Q2hhbmdlJywgKCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3dpcGVyLnNuYXBJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbmFwSW5kZXhDaGFuZ2UnLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignc25hcEdyaWRMZW5ndGhDaGFuZ2UnLCAoKSA9PiB7XG4gICAgcmVuZGVyKCk7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkZXN0cm95KCk7XG4gIH0pO1xuICBvbignZW5hYmxlIGRpc2FibGUnLCAoKSA9PiB7XG4gICAgbGV0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5wYWdpbmF0aW9uO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdFtzd2lwZXIuZW5hYmxlZCA/ICdyZW1vdmUnIDogJ2FkZCddKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5sb2NrQ2xhc3MpKTtcbiAgICB9XG4gIH0pO1xuICBvbignbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuICBvbignY2xpY2snLCAoX3MsIGUpID0+IHtcbiAgICBjb25zdCB0YXJnZXRFbCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoc3dpcGVyLnBhZ2luYXRpb24uZWwpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uZWwgJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGVPbkNsaWNrICYmIGVsICYmIGVsLmxlbmd0aCA+IDAgJiYgIXRhcmdldEVsLmNsYXNzTGlzdC5jb250YWlucyhzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uYnVsbGV0Q2xhc3MpKSB7XG4gICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgKHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCAmJiB0YXJnZXRFbCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsIHx8IHN3aXBlci5uYXZpZ2F0aW9uLnByZXZFbCAmJiB0YXJnZXRFbCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSBlbFswXS5jbGFzc0xpc3QuY29udGFpbnMoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGRlbkNsYXNzKTtcbiAgICAgIGlmIChpc0hpZGRlbiA9PT0gdHJ1ZSkge1xuICAgICAgICBlbWl0KCdwYWdpbmF0aW9uU2hvdycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW1pdCgncGFnaW5hdGlvbkhpZGUnKTtcbiAgICAgIH1cbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4gc3ViRWwuY2xhc3NMaXN0LnRvZ2dsZShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBlbmFibGUgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnBhZ2luYXRpb25EaXNhYmxlZENsYXNzKTtcbiAgICBsZXQge1xuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyLnBhZ2luYXRpb247XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICAgIGVsLmZvckVhY2goc3ViRWwgPT4gc3ViRWwuY2xhc3NMaXN0LnJlbW92ZShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ucGFnaW5hdGlvbkRpc2FibGVkQ2xhc3MpKTtcbiAgICB9XG4gICAgaW5pdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZSgpO1xuICB9O1xuICBjb25zdCBkaXNhYmxlID0gKCkgPT4ge1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5wYWdpbmF0aW9uRGlzYWJsZWRDbGFzcyk7XG4gICAgbGV0IHtcbiAgICAgIGVsXG4gICAgfSA9IHN3aXBlci5wYWdpbmF0aW9uO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHN1YkVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLnBhZ2luYXRpb25EaXNhYmxlZENsYXNzKSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKTtcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIucGFnaW5hdGlvbiwge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICAgIHJlbmRlcixcbiAgICB1cGRhdGUsXG4gICAgaW5pdCxcbiAgICBkZXN0cm95XG4gIH0pO1xufVxuXG5leHBvcnQgeyBQYWdpbmF0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IG0gYXMgbWFrZUVsZW1lbnRzQXJyYXksIGkgYXMgY2xhc3Nlc1RvVG9rZW5zLCBjIGFzIGNyZWF0ZUVsZW1lbnQsIG4gYXMgbmV4dFRpY2ssIGIgYXMgZWxlbWVudE9mZnNldCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkIH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1lbGVtZW50LWlmLW5vdC1kZWZpbmVkLm1qcyc7XG5pbXBvcnQgeyBjIGFzIGNsYXNzZXNUb1NlbGVjdG9yIH0gZnJvbSAnLi4vc2hhcmVkL2NsYXNzZXMtdG8tc2VsZWN0b3IubWpzJztcblxuZnVuY3Rpb24gU2Nyb2xsYmFyKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXRcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgbGV0IGlzVG91Y2hlZCA9IGZhbHNlO1xuICBsZXQgdGltZW91dCA9IG51bGw7XG4gIGxldCBkcmFnVGltZW91dCA9IG51bGw7XG4gIGxldCBkcmFnU3RhcnRQb3M7XG4gIGxldCBkcmFnU2l6ZTtcbiAgbGV0IHRyYWNrU2l6ZTtcbiAgbGV0IGRpdmlkZXI7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgc2Nyb2xsYmFyOiB7XG4gICAgICBlbDogbnVsbCxcbiAgICAgIGRyYWdTaXplOiAnYXV0bycsXG4gICAgICBoaWRlOiBmYWxzZSxcbiAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICBzbmFwT25SZWxlYXNlOiB0cnVlLFxuICAgICAgbG9ja0NsYXNzOiAnc3dpcGVyLXNjcm9sbGJhci1sb2NrJyxcbiAgICAgIGRyYWdDbGFzczogJ3N3aXBlci1zY3JvbGxiYXItZHJhZycsXG4gICAgICBzY3JvbGxiYXJEaXNhYmxlZENsYXNzOiAnc3dpcGVyLXNjcm9sbGJhci1kaXNhYmxlZCcsXG4gICAgICBob3Jpem9udGFsQ2xhc3M6IGBzd2lwZXItc2Nyb2xsYmFyLWhvcml6b250YWxgLFxuICAgICAgdmVydGljYWxDbGFzczogYHN3aXBlci1zY3JvbGxiYXItdmVydGljYWxgXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLnNjcm9sbGJhciA9IHtcbiAgICBlbDogbnVsbCxcbiAgICBkcmFnRWw6IG51bGxcbiAgfTtcbiAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKCkge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZHJhZ0VsLFxuICAgICAgZWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGNvbnN0IHByb2dyZXNzID0gc3dpcGVyLnBhcmFtcy5sb29wID8gc3dpcGVyLnByb2dyZXNzTG9vcCA6IHN3aXBlci5wcm9ncmVzcztcbiAgICBsZXQgbmV3U2l6ZSA9IGRyYWdTaXplO1xuICAgIGxldCBuZXdQb3MgPSAodHJhY2tTaXplIC0gZHJhZ1NpemUpICogcHJvZ3Jlc3M7XG4gICAgaWYgKHJ0bCkge1xuICAgICAgbmV3UG9zID0gLW5ld1BvcztcbiAgICAgIGlmIChuZXdQb3MgPiAwKSB7XG4gICAgICAgIG5ld1NpemUgPSBkcmFnU2l6ZSAtIG5ld1BvcztcbiAgICAgICAgbmV3UG9zID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoLW5ld1BvcyArIGRyYWdTaXplID4gdHJhY2tTaXplKSB7XG4gICAgICAgIG5ld1NpemUgPSB0cmFja1NpemUgKyBuZXdQb3M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXdQb3MgPCAwKSB7XG4gICAgICBuZXdTaXplID0gZHJhZ1NpemUgKyBuZXdQb3M7XG4gICAgICBuZXdQb3MgPSAwO1xuICAgIH0gZWxzZSBpZiAobmV3UG9zICsgZHJhZ1NpemUgPiB0cmFja1NpemUpIHtcbiAgICAgIG5ld1NpemUgPSB0cmFja1NpemUgLSBuZXdQb3M7XG4gICAgfVxuICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIGRyYWdFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtuZXdQb3N9cHgsIDAsIDApYDtcbiAgICAgIGRyYWdFbC5zdHlsZS53aWR0aCA9IGAke25ld1NpemV9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFnRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgJHtuZXdQb3N9cHgsIDApYDtcbiAgICAgIGRyYWdFbC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdTaXplfXB4YDtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5oaWRlKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICc0MDBtcyc7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbikge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBzd2lwZXIuc2Nyb2xsYmFyLmRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlU2l6ZSgpIHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVsIHx8ICFzd2lwZXIuc2Nyb2xsYmFyLmVsKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBkcmFnRWwsXG4gICAgICBlbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgZHJhZ0VsLnN0eWxlLndpZHRoID0gJyc7XG4gICAgZHJhZ0VsLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgIHRyYWNrU2l6ZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IGVsLm9mZnNldFdpZHRoIDogZWwub2Zmc2V0SGVpZ2h0O1xuICAgIGRpdmlkZXIgPSBzd2lwZXIuc2l6ZSAvIChzd2lwZXIudmlydHVhbFNpemUgKyBzd2lwZXIucGFyYW1zLnNsaWRlc09mZnNldEJlZm9yZSAtIChzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLnNuYXBHcmlkWzBdIDogMCkpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5kcmFnU2l6ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICBkcmFnU2l6ZSA9IHRyYWNrU2l6ZSAqIGRpdmlkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRyYWdTaXplID0gcGFyc2VJbnQoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZHJhZ1NpemUsIDEwKTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgZHJhZ0VsLnN0eWxlLndpZHRoID0gYCR7ZHJhZ1NpemV9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFnRWwuc3R5bGUuaGVpZ2h0ID0gYCR7ZHJhZ1NpemV9cHhgO1xuICAgIH1cbiAgICBpZiAoZGl2aWRlciA+PSAxKSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5oaWRlKSB7XG4gICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgc2Nyb2xsYmFyLmVsLmNsYXNzTGlzdFtzd2lwZXIuaXNMb2NrZWQgPyAnYWRkJyA6ICdyZW1vdmUnXShzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5sb2NrQ2xhc3MpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb24oZSkge1xuICAgIHJldHVybiBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBlLmNsaWVudFggOiBlLmNsaWVudFk7XG4gIH1cbiAgZnVuY3Rpb24gc2V0RHJhZ1Bvc2l0aW9uKGUpIHtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3Qge1xuICAgICAgZWxcbiAgICB9ID0gc2Nyb2xsYmFyO1xuICAgIGxldCBwb3NpdGlvblJhdGlvO1xuICAgIHBvc2l0aW9uUmF0aW8gPSAoZ2V0UG9pbnRlclBvc2l0aW9uKGUpIC0gZWxlbWVudE9mZnNldChlbClbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2xlZnQnIDogJ3RvcCddIC0gKGRyYWdTdGFydFBvcyAhPT0gbnVsbCA/IGRyYWdTdGFydFBvcyA6IGRyYWdTaXplIC8gMikpIC8gKHRyYWNrU2l6ZSAtIGRyYWdTaXplKTtcbiAgICBwb3NpdGlvblJhdGlvID0gTWF0aC5tYXgoTWF0aC5taW4ocG9zaXRpb25SYXRpbywgMSksIDApO1xuICAgIGlmIChydGwpIHtcbiAgICAgIHBvc2l0aW9uUmF0aW8gPSAxIC0gcG9zaXRpb25SYXRpbztcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCkgKyAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAqIHBvc2l0aW9uUmF0aW87XG4gICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKHBvc2l0aW9uKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHBvc2l0aW9uKTtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KGUpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxiYXIsXG4gICAgICB3cmFwcGVyRWxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgZHJhZ0VsXG4gICAgfSA9IHNjcm9sbGJhcjtcbiAgICBpc1RvdWNoZWQgPSB0cnVlO1xuICAgIGRyYWdTdGFydFBvcyA9IGUudGFyZ2V0ID09PSBkcmFnRWwgPyBnZXRQb2ludGVyUG9zaXRpb24oZSkgLSBlLnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJ10gOiBudWxsO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMTAwbXMnO1xuICAgIGRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMTAwbXMnO1xuICAgIHNldERyYWdQb3NpdGlvbihlKTtcbiAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xuICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGlmIChwYXJhbXMuaGlkZSkge1xuICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGVbJ3Njcm9sbC1zbmFwLXR5cGUnXSA9ICdub25lJztcbiAgICB9XG4gICAgZW1pdCgnc2Nyb2xsYmFyRHJhZ1N0YXJ0JywgZSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EcmFnTW92ZShlKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgd3JhcHBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIGRyYWdFbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgaWYgKCFpc1RvdWNoZWQpIHJldHVybjtcbiAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCAmJiBlLmNhbmNlbGFibGUpIGUucHJldmVudERlZmF1bHQoKTtlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICBzZXREcmFnUG9zaXRpb24oZSk7XG4gICAgd3JhcHBlckVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIGRyYWdFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMG1zJztcbiAgICBlbWl0KCdzY3JvbGxiYXJEcmFnTW92ZScsIGUpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ0VuZChlKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgd3JhcHBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCB7XG4gICAgICBlbFxuICAgIH0gPSBzY3JvbGxiYXI7XG4gICAgaWYgKCFpc1RvdWNoZWQpIHJldHVybjtcbiAgICBpc1RvdWNoZWQgPSBmYWxzZTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlWydzY3JvbGwtc25hcC10eXBlJ10gPSAnJztcbiAgICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnJztcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5oaWRlKSB7XG4gICAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xuICAgICAgZHJhZ1RpbWVvdXQgPSBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnNDAwbXMnO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICAgIGVtaXQoJ3Njcm9sbGJhckRyYWdFbmQnLCBlKTtcbiAgICBpZiAocGFyYW1zLnNuYXBPblJlbGVhc2UpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBldmVudHMobWV0aG9kKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgcGFyYW1zXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBlbCA9IHNjcm9sbGJhci5lbDtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZWw7XG4gICAgY29uc3QgYWN0aXZlTGlzdGVuZXIgPSBwYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcbiAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgY2FwdHVyZTogZmFsc2VcbiAgICB9IDogZmFsc2U7XG4gICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gcGFyYW1zLnBhc3NpdmVMaXN0ZW5lcnMgPyB7XG4gICAgICBwYXNzaXZlOiB0cnVlLFxuICAgICAgY2FwdHVyZTogZmFsc2VcbiAgICB9IDogZmFsc2U7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBldmVudE1ldGhvZCA9IG1ldGhvZCA9PT0gJ29uJyA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbiAgICB0YXJnZXRbZXZlbnRNZXRob2RdKCdwb2ludGVyZG93bicsIG9uRHJhZ1N0YXJ0LCBhY3RpdmVMaXN0ZW5lcik7XG4gICAgZG9jdW1lbnRbZXZlbnRNZXRob2RdKCdwb2ludGVybW92ZScsIG9uRHJhZ01vdmUsIGFjdGl2ZUxpc3RlbmVyKTtcbiAgICBkb2N1bWVudFtldmVudE1ldGhvZF0oJ3BvaW50ZXJ1cCcsIG9uRHJhZ0VuZCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVEcmFnZ2FibGUoKSB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCB8fCAhc3dpcGVyLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xuICAgIGV2ZW50cygnb24nKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlRHJhZ2dhYmxlKCkge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBldmVudHMoJ29mZicpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2Nyb2xsYmFyLFxuICAgICAgZWw6IHN3aXBlckVsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBzd2lwZXIucGFyYW1zLnNjcm9sbGJhciA9IGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBzd2lwZXIub3JpZ2luYWxQYXJhbXMuc2Nyb2xsYmFyLCBzd2lwZXIucGFyYW1zLnNjcm9sbGJhciwge1xuICAgICAgZWw6ICdzd2lwZXItc2Nyb2xsYmFyJ1xuICAgIH0pO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGlmICghcGFyYW1zLmVsKSByZXR1cm47XG4gICAgbGV0IGVsO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJyAmJiBzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBlbCA9IHN3aXBlci5lbC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5lbCk7XG4gICAgfVxuICAgIGlmICghZWwgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpO1xuICAgICAgaWYgKCFlbC5sZW5ndGgpIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCFlbCkge1xuICAgICAgZWwgPSBwYXJhbXMuZWw7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLnVuaXF1ZU5hdkVsZW1lbnRzICYmIHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIGVsLmxlbmd0aCA+IDEgJiYgc3dpcGVyRWwucXVlcnlTZWxlY3RvckFsbChwYXJhbXMuZWwpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZWwgPSBzd2lwZXJFbC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5lbCk7XG4gICAgfVxuICAgIGlmIChlbC5sZW5ndGggPiAwKSBlbCA9IGVsWzBdO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcbiAgICBsZXQgZHJhZ0VsO1xuICAgIGlmIChlbCkge1xuICAgICAgZHJhZ0VsID0gZWwucXVlcnlTZWxlY3RvcihjbGFzc2VzVG9TZWxlY3Rvcihzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5kcmFnQ2xhc3MpKTtcbiAgICAgIGlmICghZHJhZ0VsKSB7XG4gICAgICAgIGRyYWdFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdDbGFzcyk7XG4gICAgICAgIGVsLmFwcGVuZChkcmFnRWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKHNjcm9sbGJhciwge1xuICAgICAgZWwsXG4gICAgICBkcmFnRWxcbiAgICB9KTtcbiAgICBpZiAocGFyYW1zLmRyYWdnYWJsZSkge1xuICAgICAgZW5hYmxlRHJhZ2dhYmxlKCk7XG4gICAgfVxuICAgIGlmIChlbCkge1xuICAgICAgZWwuY2xhc3NMaXN0W3N3aXBlci5lbmFibGVkID8gJ3JlbW92ZScgOiAnYWRkJ10oLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmxvY2tDbGFzcykpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xuICAgIGNvbnN0IGVsID0gc3dpcGVyLnNjcm9sbGJhci5lbDtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5pc0hvcml6b250YWwoKSA/IHBhcmFtcy5ob3Jpem9udGFsQ2xhc3MgOiBwYXJhbXMudmVydGljYWxDbGFzcykpO1xuICAgIH1cbiAgICBkaXNhYmxlRHJhZ2dhYmxlKCk7XG4gIH1cbiAgb24oJ2NoYW5nZURpcmVjdGlvbicsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5zY3JvbGxiYXIgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcbiAgICBsZXQge1xuICAgICAgZWxcbiAgICB9ID0gc3dpcGVyLnNjcm9sbGJhcjtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmhvcml6b250YWxDbGFzcywgcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgICAgc3ViRWwuY2xhc3NMaXN0LmFkZChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBwYXJhbXMuaG9yaXpvbnRhbENsYXNzIDogcGFyYW1zLnZlcnRpY2FsQ2xhc3MpO1xuICAgIH0pO1xuICB9KTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIGRpc2FibGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdCgpO1xuICAgICAgdXBkYXRlU2l6ZSgpO1xuICAgICAgc2V0VHJhbnNsYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3VwZGF0ZSByZXNpemUgb2JzZXJ2ZXJVcGRhdGUgbG9jayB1bmxvY2sgY2hhbmdlRGlyZWN0aW9uJywgKCkgPT4ge1xuICAgIHVwZGF0ZVNpemUoKTtcbiAgfSk7XG4gIG9uKCdzZXRUcmFuc2xhdGUnLCAoKSA9PiB7XG4gICAgc2V0VHJhbnNsYXRlKCk7XG4gIH0pO1xuICBvbignc2V0VHJhbnNpdGlvbicsIChfcywgZHVyYXRpb24pID0+IHtcbiAgICBzZXRUcmFuc2l0aW9uKGR1cmF0aW9uKTtcbiAgfSk7XG4gIG9uKCdlbmFibGUgZGlzYWJsZScsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBlbFxuICAgIH0gPSBzd2lwZXIuc2Nyb2xsYmFyO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwuY2xhc3NMaXN0W3N3aXBlci5lbmFibGVkID8gJ3JlbW92ZScgOiAnYWRkJ10oLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmxvY2tDbGFzcykpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGRlc3Ryb3koKTtcbiAgfSk7XG4gIGNvbnN0IGVuYWJsZSA9ICgpID0+IHtcbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuc2Nyb2xsYmFyRGlzYWJsZWRDbGFzcykpO1xuICAgIGlmIChzd2lwZXIuc2Nyb2xsYmFyLmVsKSB7XG4gICAgICBzd2lwZXIuc2Nyb2xsYmFyLmVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLnNjcm9sbGJhckRpc2FibGVkQ2xhc3MpKTtcbiAgICB9XG4gICAgaW5pdCgpO1xuICAgIHVwZGF0ZVNpemUoKTtcbiAgICBzZXRUcmFuc2xhdGUoKTtcbiAgfTtcbiAgY29uc3QgZGlzYWJsZSA9ICgpID0+IHtcbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzVG9Ub2tlbnMoc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuc2Nyb2xsYmFyRGlzYWJsZWRDbGFzcykpO1xuICAgIGlmIChzd2lwZXIuc2Nyb2xsYmFyLmVsKSB7XG4gICAgICBzd2lwZXIuc2Nyb2xsYmFyLmVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlc1RvVG9rZW5zKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLnNjcm9sbGJhckRpc2FibGVkQ2xhc3MpKTtcbiAgICB9XG4gICAgZGVzdHJveSgpO1xuICB9O1xuICBPYmplY3QuYXNzaWduKHN3aXBlci5zY3JvbGxiYXIsIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZSxcbiAgICB1cGRhdGVTaXplLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBpbml0LFxuICAgIGRlc3Ryb3lcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFNjcm9sbGJhciBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBlIGFzIGVsZW1lbnRDaGlsZHJlbiB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBQYXJhbGxheChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBwYXJhbGxheDoge1xuICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICB9XG4gIH0pO1xuICBjb25zdCBlbGVtZW50c1NlbGVjdG9yID0gJ1tkYXRhLXN3aXBlci1wYXJhbGxheF0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC14XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXldLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgtb3BhY2l0eV0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC1zY2FsZV0nO1xuICBjb25zdCBzZXRUcmFuc2Zvcm0gPSAoZWwsIHByb2dyZXNzKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgcnRsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBydGxGYWN0b3IgPSBydGwgPyAtMSA6IDE7XG4gICAgY29uc3QgcCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgnKSB8fCAnMCc7XG4gICAgbGV0IHggPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXgnKTtcbiAgICBsZXQgeSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgteScpO1xuICAgIGNvbnN0IHNjYWxlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1wYXJhbGxheC1zY2FsZScpO1xuICAgIGNvbnN0IG9wYWNpdHkgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LW9wYWNpdHknKTtcbiAgICBjb25zdCByb3RhdGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXJvdGF0ZScpO1xuICAgIGlmICh4IHx8IHkpIHtcbiAgICAgIHggPSB4IHx8ICcwJztcbiAgICAgIHkgPSB5IHx8ICcwJztcbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgeCA9IHA7XG4gICAgICB5ID0gJzAnO1xuICAgIH0gZWxzZSB7XG4gICAgICB5ID0gcDtcbiAgICAgIHggPSAnMCc7XG4gICAgfVxuICAgIGlmICh4LmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgICB4ID0gYCR7cGFyc2VJbnQoeCwgMTApICogcHJvZ3Jlc3MgKiBydGxGYWN0b3J9JWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSBgJHt4ICogcHJvZ3Jlc3MgKiBydGxGYWN0b3J9cHhgO1xuICAgIH1cbiAgICBpZiAoeS5pbmRleE9mKCclJykgPj0gMCkge1xuICAgICAgeSA9IGAke3BhcnNlSW50KHksIDEwKSAqIHByb2dyZXNzfSVgO1xuICAgIH0gZWxzZSB7XG4gICAgICB5ID0gYCR7eSAqIHByb2dyZXNzfXB4YDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcGFjaXR5ICE9PSAndW5kZWZpbmVkJyAmJiBvcGFjaXR5ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjdXJyZW50T3BhY2l0eSA9IG9wYWNpdHkgLSAob3BhY2l0eSAtIDEpICogKDEgLSBNYXRoLmFicyhwcm9ncmVzcykpO1xuICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IGN1cnJlbnRPcGFjaXR5O1xuICAgIH1cbiAgICBsZXQgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7eH0sICR7eX0sIDBweClgO1xuICAgIGlmICh0eXBlb2Ygc2NhbGUgIT09ICd1bmRlZmluZWQnICYmIHNjYWxlICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjdXJyZW50U2NhbGUgPSBzY2FsZSAtIChzY2FsZSAtIDEpICogKDEgLSBNYXRoLmFicyhwcm9ncmVzcykpO1xuICAgICAgdHJhbnNmb3JtICs9IGAgc2NhbGUoJHtjdXJyZW50U2NhbGV9KWA7XG4gICAgfVxuICAgIGlmIChyb3RhdGUgJiYgdHlwZW9mIHJvdGF0ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcm90YXRlICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um90YXRlID0gcm90YXRlICogcHJvZ3Jlc3MgKiAtMTtcbiAgICAgIHRyYW5zZm9ybSArPSBgIHJvdGF0ZSgke2N1cnJlbnRSb3RhdGV9ZGVnKWA7XG4gICAgfVxuICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgc2xpZGVzLFxuICAgICAgcHJvZ3Jlc3MsXG4gICAgICBzbmFwR3JpZCxcbiAgICAgIGlzRWxlbWVudFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgZWxlbWVudHMgPSBlbGVtZW50Q2hpbGRyZW4oZWwsIGVsZW1lbnRzU2VsZWN0b3IpO1xuICAgIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBlbGVtZW50cy5wdXNoKC4uLmVsZW1lbnRDaGlsZHJlbihzd2lwZXIuaG9zdEVsLCBlbGVtZW50c1NlbGVjdG9yKSk7XG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc2V0VHJhbnNmb3JtKHN1YkVsLCBwcm9ncmVzcyk7XG4gICAgfSk7XG4gICAgc2xpZGVzLmZvckVhY2goKHNsaWRlRWwsIHNsaWRlSW5kZXgpID0+IHtcbiAgICAgIGxldCBzbGlkZVByb2dyZXNzID0gc2xpZGVFbC5wcm9ncmVzcztcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwID4gMSAmJiBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJykge1xuICAgICAgICBzbGlkZVByb2dyZXNzICs9IE1hdGguY2VpbChzbGlkZUluZGV4IC8gMikgLSBwcm9ncmVzcyAqIChzbmFwR3JpZC5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIHNsaWRlUHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZVByb2dyZXNzLCAtMSksIDEpO1xuICAgICAgc2xpZGVFbC5xdWVyeVNlbGVjdG9yQWxsKGAke2VsZW1lbnRzU2VsZWN0b3J9LCBbZGF0YS1zd2lwZXItcGFyYWxsYXgtcm90YXRlXWApLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgICBzZXRUcmFuc2Zvcm0oc3ViRWwsIHNsaWRlUHJvZ3Jlc3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICBpZiAoZHVyYXRpb24gPT09IHZvaWQgMCkge1xuICAgICAgZHVyYXRpb24gPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xuICAgIH1cbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIGhvc3RFbFxuICAgIH0gPSBzd2lwZXI7XG4gICAgY29uc3QgZWxlbWVudHMgPSBbLi4uZWwucXVlcnlTZWxlY3RvckFsbChlbGVtZW50c1NlbGVjdG9yKV07XG4gICAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2goLi4uaG9zdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHNTZWxlY3RvcikpO1xuICAgIH1cbiAgICBlbGVtZW50cy5mb3JFYWNoKHBhcmFsbGF4RWwgPT4ge1xuICAgICAgbGV0IHBhcmFsbGF4RHVyYXRpb24gPSBwYXJzZUludChwYXJhbGxheEVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItcGFyYWxsYXgtZHVyYXRpb24nKSwgMTApIHx8IGR1cmF0aW9uO1xuICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSBwYXJhbGxheER1cmF0aW9uID0gMDtcbiAgICAgIHBhcmFsbGF4RWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7cGFyYWxsYXhEdXJhdGlvbn1tc2A7XG4gICAgfSk7XG4gIH07XG4gIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XG4gICAgc3dpcGVyLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgICBzd2lwZXIub3JpZ2luYWxQYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyA9IHRydWU7XG4gIH0pO1xuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFyYWxsYXguZW5hYmxlZCkgcmV0dXJuO1xuICAgIHNldFRyYW5zbGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFyYWxsYXguZW5hYmxlZCkgcmV0dXJuO1xuICAgIHNldFRyYW5zbGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3N3aXBlciwgZHVyYXRpb24pID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFyYWxsYXguZW5hYmxlZCkgcmV0dXJuO1xuICAgIHNldFRyYW5zaXRpb24oZHVyYXRpb24pO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgUGFyYWxsYXggYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3cgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGUgYXMgZWxlbWVudENoaWxkcmVuLCBhIGFzIGVsZW1lbnRQYXJlbnRzLCBiIGFzIGVsZW1lbnRPZmZzZXQsIGogYXMgZ2V0VHJhbnNsYXRlIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIFpvb20oX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgem9vbToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBsaW1pdFRvT3JpZ2luYWxTaXplOiBmYWxzZSxcbiAgICAgIG1heFJhdGlvOiAzLFxuICAgICAgbWluUmF0aW86IDEsXG4gICAgICB0b2dnbGU6IHRydWUsXG4gICAgICBjb250YWluZXJDbGFzczogJ3N3aXBlci16b29tLWNvbnRhaW5lcicsXG4gICAgICB6b29tZWRTbGlkZUNsYXNzOiAnc3dpcGVyLXNsaWRlLXpvb21lZCdcbiAgICB9XG4gIH0pO1xuICBzd2lwZXIuem9vbSA9IHtcbiAgICBlbmFibGVkOiBmYWxzZVxuICB9O1xuICBsZXQgY3VycmVudFNjYWxlID0gMTtcbiAgbGV0IGlzU2NhbGluZyA9IGZhbHNlO1xuICBsZXQgZmFrZUdlc3R1cmVUb3VjaGVkO1xuICBsZXQgZmFrZUdlc3R1cmVNb3ZlZDtcbiAgY29uc3QgZXZDYWNoZSA9IFtdO1xuICBjb25zdCBnZXN0dXJlID0ge1xuICAgIG9yaWdpblg6IDAsXG4gICAgb3JpZ2luWTogMCxcbiAgICBzbGlkZUVsOiB1bmRlZmluZWQsXG4gICAgc2xpZGVXaWR0aDogdW5kZWZpbmVkLFxuICAgIHNsaWRlSGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgaW1hZ2VFbDogdW5kZWZpbmVkLFxuICAgIGltYWdlV3JhcEVsOiB1bmRlZmluZWQsXG4gICAgbWF4UmF0aW86IDNcbiAgfTtcbiAgY29uc3QgaW1hZ2UgPSB7XG4gICAgaXNUb3VjaGVkOiB1bmRlZmluZWQsXG4gICAgaXNNb3ZlZDogdW5kZWZpbmVkLFxuICAgIGN1cnJlbnRYOiB1bmRlZmluZWQsXG4gICAgY3VycmVudFk6IHVuZGVmaW5lZCxcbiAgICBtaW5YOiB1bmRlZmluZWQsXG4gICAgbWluWTogdW5kZWZpbmVkLFxuICAgIG1heFg6IHVuZGVmaW5lZCxcbiAgICBtYXhZOiB1bmRlZmluZWQsXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBzdGFydFg6IHVuZGVmaW5lZCxcbiAgICBzdGFydFk6IHVuZGVmaW5lZCxcbiAgICB0b3VjaGVzU3RhcnQ6IHt9LFxuICAgIHRvdWNoZXNDdXJyZW50OiB7fVxuICB9O1xuICBjb25zdCB2ZWxvY2l0eSA9IHtcbiAgICB4OiB1bmRlZmluZWQsXG4gICAgeTogdW5kZWZpbmVkLFxuICAgIHByZXZQb3NpdGlvblg6IHVuZGVmaW5lZCxcbiAgICBwcmV2UG9zaXRpb25ZOiB1bmRlZmluZWQsXG4gICAgcHJldlRpbWU6IHVuZGVmaW5lZFxuICB9O1xuICBsZXQgc2NhbGUgPSAxO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3dpcGVyLnpvb20sICdzY2FsZScsIHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfSxcbiAgICBzZXQodmFsdWUpIHtcbiAgICAgIGlmIChzY2FsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VFbCA9IGdlc3R1cmUuaW1hZ2VFbDtcbiAgICAgICAgY29uc3Qgc2xpZGVFbCA9IGdlc3R1cmUuc2xpZGVFbDtcbiAgICAgICAgZW1pdCgnem9vbUNoYW5nZScsIHZhbHVlLCBpbWFnZUVsLCBzbGlkZUVsKTtcbiAgICAgIH1cbiAgICAgIHNjYWxlID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcygpIHtcbiAgICBpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSByZXR1cm4gMTtcbiAgICBjb25zdCB4MSA9IGV2Q2FjaGVbMF0ucGFnZVg7XG4gICAgY29uc3QgeTEgPSBldkNhY2hlWzBdLnBhZ2VZO1xuICAgIGNvbnN0IHgyID0gZXZDYWNoZVsxXS5wYWdlWDtcbiAgICBjb25zdCB5MiA9IGV2Q2FjaGVbMV0ucGFnZVk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKHgyIC0geDEpICoqIDIgKyAoeTIgLSB5MSkgKiogMik7XG4gICAgcmV0dXJuIGRpc3RhbmNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldE1heFJhdGlvKCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcbiAgICBjb25zdCBtYXhSYXRpbyA9IGdlc3R1cmUuaW1hZ2VXcmFwRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xuICAgIGlmIChwYXJhbXMubGltaXRUb09yaWdpbmFsU2l6ZSAmJiBnZXN0dXJlLmltYWdlRWwgJiYgZ2VzdHVyZS5pbWFnZUVsLm5hdHVyYWxXaWR0aCkge1xuICAgICAgY29uc3QgaW1hZ2VNYXhSYXRpbyA9IGdlc3R1cmUuaW1hZ2VFbC5uYXR1cmFsV2lkdGggLyBnZXN0dXJlLmltYWdlRWwub2Zmc2V0V2lkdGg7XG4gICAgICByZXR1cm4gTWF0aC5taW4oaW1hZ2VNYXhSYXRpbywgbWF4UmF0aW8pO1xuICAgIH1cbiAgICByZXR1cm4gbWF4UmF0aW87XG4gIH1cbiAgZnVuY3Rpb24gZ2V0U2NhbGVPcmlnaW4oKSB7XG4gICAgaWYgKGV2Q2FjaGUubGVuZ3RoIDwgMikgcmV0dXJuIHtcbiAgICAgIHg6IG51bGwsXG4gICAgICB5OiBudWxsXG4gICAgfTtcbiAgICBjb25zdCBib3ggPSBnZXN0dXJlLmltYWdlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIFsoZXZDYWNoZVswXS5wYWdlWCArIChldkNhY2hlWzFdLnBhZ2VYIC0gZXZDYWNoZVswXS5wYWdlWCkgLyAyIC0gYm94LnggLSB3aW5kb3cuc2Nyb2xsWCkgLyBjdXJyZW50U2NhbGUsIChldkNhY2hlWzBdLnBhZ2VZICsgKGV2Q2FjaGVbMV0ucGFnZVkgLSBldkNhY2hlWzBdLnBhZ2VZKSAvIDIgLSBib3gueSAtIHdpbmRvdy5zY3JvbGxZKSAvIGN1cnJlbnRTY2FsZV07XG4gIH1cbiAgZnVuY3Rpb24gZ2V0U2xpZGVTZWxlY3RvcigpIHtcbiAgICByZXR1cm4gc3dpcGVyLmlzRWxlbWVudCA/IGBzd2lwZXItc2xpZGVgIDogYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gO1xuICB9XG4gIGZ1bmN0aW9uIGV2ZW50V2l0aGluU2xpZGUoZSkge1xuICAgIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSBnZXRTbGlkZVNlbGVjdG9yKCk7XG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoc2xpZGVTZWxlY3RvcikpIHJldHVybiB0cnVlO1xuICAgIGlmIChzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY29udGFpbnMoZS50YXJnZXQpKS5sZW5ndGggPiAwKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gZXZlbnRXaXRoaW5ab29tQ29udGFpbmVyKGUpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGAuJHtzd2lwZXIucGFyYW1zLnpvb20uY29udGFpbmVyQ2xhc3N9YDtcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcyhzZWxlY3RvcikpIHJldHVybiB0cnVlO1xuICAgIGlmIChbLi4uc3dpcGVyLmhvc3RFbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKV0uZmlsdGVyKGNvbnRhaW5lckVsID0+IGNvbnRhaW5lckVsLmNvbnRhaW5zKGUudGFyZ2V0KSkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXZlbnRzXG4gIGZ1bmN0aW9uIG9uR2VzdHVyZVN0YXJ0KGUpIHtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykge1xuICAgICAgZXZDYWNoZS5zcGxpY2UoMCwgZXZDYWNoZS5sZW5ndGgpO1xuICAgIH1cbiAgICBpZiAoIWV2ZW50V2l0aGluU2xpZGUoZSkpIHJldHVybjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gZmFsc2U7XG4gICAgZmFrZUdlc3R1cmVNb3ZlZCA9IGZhbHNlO1xuICAgIGV2Q2FjaGUucHVzaChlKTtcbiAgICBpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZha2VHZXN0dXJlVG91Y2hlZCA9IHRydWU7XG4gICAgZ2VzdHVyZS5zY2FsZVN0YXJ0ID0gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcygpO1xuICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwgPSBlLnRhcmdldC5jbG9zZXN0KGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICAgIGlmICghZ2VzdHVyZS5zbGlkZUVsKSBnZXN0dXJlLnNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICBsZXQgaW1hZ2VFbCA9IGdlc3R1cmUuc2xpZGVFbC5xdWVyeVNlbGVjdG9yKGAuJHtwYXJhbXMuY29udGFpbmVyQ2xhc3N9YCk7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBpbWFnZUVsID0gaW1hZ2VFbC5xdWVyeVNlbGVjdG9yQWxsKCdwaWN0dXJlLCBpbWcsIHN2ZywgY2FudmFzLCAuc3dpcGVyLXpvb20tdGFyZ2V0JylbMF07XG4gICAgICB9XG4gICAgICBnZXN0dXJlLmltYWdlRWwgPSBpbWFnZUVsO1xuICAgICAgaWYgKGltYWdlRWwpIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IGVsZW1lbnRQYXJlbnRzKGdlc3R1cmUuaW1hZ2VFbCwgYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZUVsID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnZXN0dXJlLm1heFJhdGlvID0gZ2V0TWF4UmF0aW8oKTtcbiAgICB9XG4gICAgaWYgKGdlc3R1cmUuaW1hZ2VFbCkge1xuICAgICAgY29uc3QgW29yaWdpblgsIG9yaWdpblldID0gZ2V0U2NhbGVPcmlnaW4oKTtcbiAgICAgIGdlc3R1cmUub3JpZ2luWCA9IG9yaWdpblg7XG4gICAgICBnZXN0dXJlLm9yaWdpblkgPSBvcmlnaW5ZO1xuICAgICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgIH1cbiAgICBpc1NjYWxpbmcgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIG9uR2VzdHVyZUNoYW5nZShlKSB7XG4gICAgaWYgKCFldmVudFdpdGhpblNsaWRlKGUpKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBjb25zdCBwb2ludGVySW5kZXggPSBldkNhY2hlLmZpbmRJbmRleChjYWNoZWRFdiA9PiBjYWNoZWRFdi5wb2ludGVySWQgPT09IGUucG9pbnRlcklkKTtcbiAgICBpZiAocG9pbnRlckluZGV4ID49IDApIGV2Q2FjaGVbcG9pbnRlckluZGV4XSA9IGU7XG4gICAgaWYgKGV2Q2FjaGUubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmYWtlR2VzdHVyZU1vdmVkID0gdHJ1ZTtcbiAgICBnZXN0dXJlLnNjYWxlTW92ZSA9IGdldERpc3RhbmNlQmV0d2VlblRvdWNoZXMoKTtcbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB6b29tLnNjYWxlID0gZ2VzdHVyZS5zY2FsZU1vdmUgLyBnZXN0dXJlLnNjYWxlU3RhcnQgKiBjdXJyZW50U2NhbGU7XG4gICAgaWYgKHpvb20uc2NhbGUgPiBnZXN0dXJlLm1heFJhdGlvKSB7XG4gICAgICB6b29tLnNjYWxlID0gZ2VzdHVyZS5tYXhSYXRpbyAtIDEgKyAoem9vbS5zY2FsZSAtIGdlc3R1cmUubWF4UmF0aW8gKyAxKSAqKiAwLjU7XG4gICAgfVxuICAgIGlmICh6b29tLnNjYWxlIDwgcGFyYW1zLm1pblJhdGlvKSB7XG4gICAgICB6b29tLnNjYWxlID0gcGFyYW1zLm1pblJhdGlvICsgMSAtIChwYXJhbXMubWluUmF0aW8gLSB6b29tLnNjYWxlICsgMSkgKiogMC41O1xuICAgIH1cbiAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgke3pvb20uc2NhbGV9KWA7XG4gIH1cbiAgZnVuY3Rpb24gb25HZXN0dXJlRW5kKGUpIHtcbiAgICBpZiAoIWV2ZW50V2l0aGluU2xpZGUoZSkpIHJldHVybjtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJyAmJiBlLnR5cGUgPT09ICdwb2ludGVyb3V0JykgcmV0dXJuO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgY29uc3QgcG9pbnRlckluZGV4ID0gZXZDYWNoZS5maW5kSW5kZXgoY2FjaGVkRXYgPT4gY2FjaGVkRXYucG9pbnRlcklkID09PSBlLnBvaW50ZXJJZCk7XG4gICAgaWYgKHBvaW50ZXJJbmRleCA+PSAwKSBldkNhY2hlLnNwbGljZShwb2ludGVySW5kZXgsIDEpO1xuICAgIGlmICghZmFrZUdlc3R1cmVUb3VjaGVkIHx8ICFmYWtlR2VzdHVyZU1vdmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZha2VHZXN0dXJlVG91Y2hlZCA9IGZhbHNlO1xuICAgIGZha2VHZXN0dXJlTW92ZWQgPSBmYWxzZTtcbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCkgcmV0dXJuO1xuICAgIHpvb20uc2NhbGUgPSBNYXRoLm1heChNYXRoLm1pbih6b29tLnNjYWxlLCBnZXN0dXJlLm1heFJhdGlvKSwgcGFyYW1zLm1pblJhdGlvKTtcbiAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7c3dpcGVyLnBhcmFtcy5zcGVlZH1tc2A7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoJHt6b29tLnNjYWxlfSlgO1xuICAgIGN1cnJlbnRTY2FsZSA9IHpvb20uc2NhbGU7XG4gICAgaXNTY2FsaW5nID0gZmFsc2U7XG4gICAgaWYgKHpvb20uc2NhbGUgPiAxICYmIGdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgZ2VzdHVyZS5zbGlkZUVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLnpvb21lZFNsaWRlQ2xhc3N9YCk7XG4gICAgfSBlbHNlIGlmICh6b29tLnNjYWxlIDw9IDEgJiYgZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShgJHtwYXJhbXMuem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICB9XG4gICAgaWYgKHpvb20uc2NhbGUgPT09IDEpIHtcbiAgICAgIGdlc3R1cmUub3JpZ2luWCA9IDA7XG4gICAgICBnZXN0dXJlLm9yaWdpblkgPSAwO1xuICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBsZXQgYWxsb3dUb3VjaE1vdmVUaW1lb3V0O1xuICBmdW5jdGlvbiBhbGxvd1RvdWNoTW92ZSgpIHtcbiAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLnByZXZlbnRUb3VjaE1vdmVGcm9tUG9pbnRlck1vdmUgPSBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBwcmV2ZW50VG91Y2hNb3ZlKCkge1xuICAgIGNsZWFyVGltZW91dChhbGxvd1RvdWNoTW92ZVRpbWVvdXQpO1xuICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEucHJldmVudFRvdWNoTW92ZUZyb21Qb2ludGVyTW92ZSA9IHRydWU7XG4gICAgYWxsb3dUb3VjaE1vdmVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgYWxsb3dUb3VjaE1vdmUoKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblRvdWNoU3RhcnQoZSkge1xuICAgIGNvbnN0IGRldmljZSA9IHN3aXBlci5kZXZpY2U7XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwpIHJldHVybjtcbiAgICBpZiAoaW1hZ2UuaXNUb3VjaGVkKSByZXR1cm47XG4gICAgaWYgKGRldmljZS5hbmRyb2lkICYmIGUuY2FuY2VsYWJsZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGltYWdlLmlzVG91Y2hlZCA9IHRydWU7XG4gICAgY29uc3QgZXZlbnQgPSBldkNhY2hlLmxlbmd0aCA+IDAgPyBldkNhY2hlWzBdIDogZTtcbiAgICBpbWFnZS50b3VjaGVzU3RhcnQueCA9IGV2ZW50LnBhZ2VYO1xuICAgIGltYWdlLnRvdWNoZXNTdGFydC55ID0gZXZlbnQucGFnZVk7XG4gIH1cbiAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoZSkge1xuICAgIGlmICghZXZlbnRXaXRoaW5TbGlkZShlKSB8fCAhZXZlbnRXaXRoaW5ab29tQ29udGFpbmVyKGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBpZiAoIWdlc3R1cmUuaW1hZ2VFbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWltYWdlLmlzVG91Y2hlZCB8fCAhZ2VzdHVyZS5zbGlkZUVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghaW1hZ2UuaXNNb3ZlZCkge1xuICAgICAgaW1hZ2Uud2lkdGggPSBnZXN0dXJlLmltYWdlRWwub2Zmc2V0V2lkdGggfHwgZ2VzdHVyZS5pbWFnZUVsLmNsaWVudFdpZHRoO1xuICAgICAgaW1hZ2UuaGVpZ2h0ID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldEhlaWdodCB8fCBnZXN0dXJlLmltYWdlRWwuY2xpZW50SGVpZ2h0O1xuICAgICAgaW1hZ2Uuc3RhcnRYID0gZ2V0VHJhbnNsYXRlKGdlc3R1cmUuaW1hZ2VXcmFwRWwsICd4JykgfHwgMDtcbiAgICAgIGltYWdlLnN0YXJ0WSA9IGdldFRyYW5zbGF0ZShnZXN0dXJlLmltYWdlV3JhcEVsLCAneScpIHx8IDA7XG4gICAgICBnZXN0dXJlLnNsaWRlV2lkdGggPSBnZXN0dXJlLnNsaWRlRWwub2Zmc2V0V2lkdGg7XG4gICAgICBnZXN0dXJlLnNsaWRlSGVpZ2h0ID0gZ2VzdHVyZS5zbGlkZUVsLm9mZnNldEhlaWdodDtcbiAgICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBtcyc7XG4gICAgfVxuICAgIC8vIERlZmluZSBpZiB3ZSBuZWVkIGltYWdlIGRyYWdcbiAgICBjb25zdCBzY2FsZWRXaWR0aCA9IGltYWdlLndpZHRoICogem9vbS5zY2FsZTtcbiAgICBjb25zdCBzY2FsZWRIZWlnaHQgPSBpbWFnZS5oZWlnaHQgKiB6b29tLnNjYWxlO1xuICAgIGltYWdlLm1pblggPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlV2lkdGggLyAyIC0gc2NhbGVkV2lkdGggLyAyLCAwKTtcbiAgICBpbWFnZS5tYXhYID0gLWltYWdlLm1pblg7XG4gICAgaW1hZ2UubWluWSA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgaW1hZ2UubWF4WSA9IC1pbWFnZS5taW5ZO1xuICAgIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPSBldkNhY2hlLmxlbmd0aCA+IDAgPyBldkNhY2hlWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICBpbWFnZS50b3VjaGVzQ3VycmVudC55ID0gZXZDYWNoZS5sZW5ndGggPiAwID8gZXZDYWNoZVswXS5wYWdlWSA6IGUucGFnZVk7XG4gICAgY29uc3QgdG91Y2hlc0RpZmYgPSBNYXRoLm1heChNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LngpLCBNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC55IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LnkpKTtcbiAgICBpZiAodG91Y2hlc0RpZmYgPiA1KSB7XG4gICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWltYWdlLmlzTW92ZWQgJiYgIWlzU2NhbGluZykge1xuICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSAmJiAoTWF0aC5mbG9vcihpbWFnZS5taW5YKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFgpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPCBpbWFnZS50b3VjaGVzU3RhcnQueCB8fCBNYXRoLmZsb29yKGltYWdlLm1heFgpID09PSBNYXRoLmZsb29yKGltYWdlLnN0YXJ0WCkgJiYgaW1hZ2UudG91Y2hlc0N1cnJlbnQueCA+IGltYWdlLnRvdWNoZXNTdGFydC54KSkge1xuICAgICAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgYWxsb3dUb3VjaE1vdmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgKE1hdGguZmxvb3IoaW1hZ2UubWluWSkgPT09IE1hdGguZmxvb3IoaW1hZ2Uuc3RhcnRZKSAmJiBpbWFnZS50b3VjaGVzQ3VycmVudC55IDwgaW1hZ2UudG91Y2hlc1N0YXJ0LnkgfHwgTWF0aC5mbG9vcihpbWFnZS5tYXhZKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFkpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnkgPiBpbWFnZS50b3VjaGVzU3RhcnQueSkpIHtcbiAgICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIGFsbG93VG91Y2hNb3ZlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHByZXZlbnRUb3VjaE1vdmUoKTtcbiAgICBpbWFnZS5pc01vdmVkID0gdHJ1ZTtcbiAgICBjb25zdCBzY2FsZVJhdGlvID0gKHpvb20uc2NhbGUgLSBjdXJyZW50U2NhbGUpIC8gKGdlc3R1cmUubWF4UmF0aW8gLSBzd2lwZXIucGFyYW1zLnpvb20ubWluUmF0aW8pO1xuICAgIGNvbnN0IHtcbiAgICAgIG9yaWdpblgsXG4gICAgICBvcmlnaW5ZXG4gICAgfSA9IGdlc3R1cmU7XG4gICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gaW1hZ2UudG91Y2hlc1N0YXJ0LnggKyBpbWFnZS5zdGFydFggKyBzY2FsZVJhdGlvICogKGltYWdlLndpZHRoIC0gb3JpZ2luWCAqIDIpO1xuICAgIGltYWdlLmN1cnJlbnRZID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIGltYWdlLnRvdWNoZXNTdGFydC55ICsgaW1hZ2Uuc3RhcnRZICsgc2NhbGVSYXRpbyAqIChpbWFnZS5oZWlnaHQgLSBvcmlnaW5ZICogMik7XG4gICAgaWYgKGltYWdlLmN1cnJlbnRYIDwgaW1hZ2UubWluWCkge1xuICAgICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS5taW5YICsgMSAtIChpbWFnZS5taW5YIC0gaW1hZ2UuY3VycmVudFggKyAxKSAqKiAwLjg7XG4gICAgfVxuICAgIGlmIChpbWFnZS5jdXJyZW50WCA+IGltYWdlLm1heFgpIHtcbiAgICAgIGltYWdlLmN1cnJlbnRYID0gaW1hZ2UubWF4WCAtIDEgKyAoaW1hZ2UuY3VycmVudFggLSBpbWFnZS5tYXhYICsgMSkgKiogMC44O1xuICAgIH1cbiAgICBpZiAoaW1hZ2UuY3VycmVudFkgPCBpbWFnZS5taW5ZKSB7XG4gICAgICBpbWFnZS5jdXJyZW50WSA9IGltYWdlLm1pblkgKyAxIC0gKGltYWdlLm1pblkgLSBpbWFnZS5jdXJyZW50WSArIDEpICoqIDAuODtcbiAgICB9XG4gICAgaWYgKGltYWdlLmN1cnJlbnRZID4gaW1hZ2UubWF4WSkge1xuICAgICAgaW1hZ2UuY3VycmVudFkgPSBpbWFnZS5tYXhZIC0gMSArIChpbWFnZS5jdXJyZW50WSAtIGltYWdlLm1heFkgKyAxKSAqKiAwLjg7XG4gICAgfVxuXG4gICAgLy8gVmVsb2NpdHlcbiAgICBpZiAoIXZlbG9jaXR5LnByZXZQb3NpdGlvblgpIHZlbG9jaXR5LnByZXZQb3NpdGlvblggPSBpbWFnZS50b3VjaGVzQ3VycmVudC54O1xuICAgIGlmICghdmVsb2NpdHkucHJldlBvc2l0aW9uWSkgdmVsb2NpdHkucHJldlBvc2l0aW9uWSA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lnk7XG4gICAgaWYgKCF2ZWxvY2l0eS5wcmV2VGltZSkgdmVsb2NpdHkucHJldlRpbWUgPSBEYXRlLm5vdygpO1xuICAgIHZlbG9jaXR5LnggPSAoaW1hZ2UudG91Y2hlc0N1cnJlbnQueCAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblgpIC8gKERhdGUubm93KCkgLSB2ZWxvY2l0eS5wcmV2VGltZSkgLyAyO1xuICAgIHZlbG9jaXR5LnkgPSAoaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblkpIC8gKERhdGUubm93KCkgLSB2ZWxvY2l0eS5wcmV2VGltZSkgLyAyO1xuICAgIGlmIChNYXRoLmFicyhpbWFnZS50b3VjaGVzQ3VycmVudC54IC0gdmVsb2NpdHkucHJldlBvc2l0aW9uWCkgPCAyKSB2ZWxvY2l0eS54ID0gMDtcbiAgICBpZiAoTWF0aC5hYnMoaW1hZ2UudG91Y2hlc0N1cnJlbnQueSAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblkpIDwgMikgdmVsb2NpdHkueSA9IDA7XG4gICAgdmVsb2NpdHkucHJldlBvc2l0aW9uWCA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lng7XG4gICAgdmVsb2NpdHkucHJldlBvc2l0aW9uWSA9IGltYWdlLnRvdWNoZXNDdXJyZW50Lnk7XG4gICAgdmVsb2NpdHkucHJldlRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7aW1hZ2UuY3VycmVudFh9cHgsICR7aW1hZ2UuY3VycmVudFl9cHgsMClgO1xuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmICghZ2VzdHVyZS5pbWFnZUVsKSByZXR1cm47XG4gICAgaWYgKCFpbWFnZS5pc1RvdWNoZWQgfHwgIWltYWdlLmlzTW92ZWQpIHtcbiAgICAgIGltYWdlLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgaW1hZ2UuaXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICBpbWFnZS5pc01vdmVkID0gZmFsc2U7XG4gICAgbGV0IG1vbWVudHVtRHVyYXRpb25YID0gMzAwO1xuICAgIGxldCBtb21lbnR1bUR1cmF0aW9uWSA9IDMwMDtcbiAgICBjb25zdCBtb21lbnR1bURpc3RhbmNlWCA9IHZlbG9jaXR5LnggKiBtb21lbnR1bUR1cmF0aW9uWDtcbiAgICBjb25zdCBuZXdQb3NpdGlvblggPSBpbWFnZS5jdXJyZW50WCArIG1vbWVudHVtRGlzdGFuY2VYO1xuICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2VZID0gdmVsb2NpdHkueSAqIG1vbWVudHVtRHVyYXRpb25ZO1xuICAgIGNvbnN0IG5ld1Bvc2l0aW9uWSA9IGltYWdlLmN1cnJlbnRZICsgbW9tZW50dW1EaXN0YW5jZVk7XG5cbiAgICAvLyBGaXggZHVyYXRpb25cbiAgICBpZiAodmVsb2NpdHkueCAhPT0gMCkgbW9tZW50dW1EdXJhdGlvblggPSBNYXRoLmFicygobmV3UG9zaXRpb25YIC0gaW1hZ2UuY3VycmVudFgpIC8gdmVsb2NpdHkueCk7XG4gICAgaWYgKHZlbG9jaXR5LnkgIT09IDApIG1vbWVudHVtRHVyYXRpb25ZID0gTWF0aC5hYnMoKG5ld1Bvc2l0aW9uWSAtIGltYWdlLmN1cnJlbnRZKSAvIHZlbG9jaXR5LnkpO1xuICAgIGNvbnN0IG1vbWVudHVtRHVyYXRpb24gPSBNYXRoLm1heChtb21lbnR1bUR1cmF0aW9uWCwgbW9tZW50dW1EdXJhdGlvblkpO1xuICAgIGltYWdlLmN1cnJlbnRYID0gbmV3UG9zaXRpb25YO1xuICAgIGltYWdlLmN1cnJlbnRZID0gbmV3UG9zaXRpb25ZO1xuICAgIC8vIERlZmluZSBpZiB3ZSBuZWVkIGltYWdlIGRyYWdcbiAgICBjb25zdCBzY2FsZWRXaWR0aCA9IGltYWdlLndpZHRoICogem9vbS5zY2FsZTtcbiAgICBjb25zdCBzY2FsZWRIZWlnaHQgPSBpbWFnZS5oZWlnaHQgKiB6b29tLnNjYWxlO1xuICAgIGltYWdlLm1pblggPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlV2lkdGggLyAyIC0gc2NhbGVkV2lkdGggLyAyLCAwKTtcbiAgICBpbWFnZS5tYXhYID0gLWltYWdlLm1pblg7XG4gICAgaW1hZ2UubWluWSA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgaW1hZ2UubWF4WSA9IC1pbWFnZS5taW5ZO1xuICAgIGltYWdlLmN1cnJlbnRYID0gTWF0aC5tYXgoTWF0aC5taW4oaW1hZ2UuY3VycmVudFgsIGltYWdlLm1heFgpLCBpbWFnZS5taW5YKTtcbiAgICBpbWFnZS5jdXJyZW50WSA9IE1hdGgubWF4KE1hdGgubWluKGltYWdlLmN1cnJlbnRZLCBpbWFnZS5tYXhZKSwgaW1hZ2UubWluWSk7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHttb21lbnR1bUR1cmF0aW9ufW1zYDtcbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke2ltYWdlLmN1cnJlbnRYfXB4LCAke2ltYWdlLmN1cnJlbnRZfXB4LDApYDtcbiAgfVxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmIChnZXN0dXJlLnNsaWRlRWwgJiYgc3dpcGVyLmFjdGl2ZUluZGV4ICE9PSBzd2lwZXIuc2xpZGVzLmluZGV4T2YoZ2VzdHVyZS5zbGlkZUVsKSkge1xuICAgICAgaWYgKGdlc3R1cmUuaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlRWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgxKSc7XG4gICAgICB9XG4gICAgICBpZiAoZ2VzdHVyZS5pbWFnZVdyYXBFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLDAsMCknO1xuICAgICAgfVxuICAgICAgZ2VzdHVyZS5zbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7c3dpcGVyLnBhcmFtcy56b29tLnpvb21lZFNsaWRlQ2xhc3N9YCk7XG4gICAgICB6b29tLnNjYWxlID0gMTtcbiAgICAgIGN1cnJlbnRTY2FsZSA9IDE7XG4gICAgICBnZXN0dXJlLnNsaWRlRWwgPSB1bmRlZmluZWQ7XG4gICAgICBnZXN0dXJlLmltYWdlRWwgPSB1bmRlZmluZWQ7XG4gICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gdW5kZWZpbmVkO1xuICAgICAgZ2VzdHVyZS5vcmlnaW5YID0gMDtcbiAgICAgIGdlc3R1cmUub3JpZ2luWSA9IDA7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHpvb21JbihlKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcbiAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgaWYgKGUgJiYgZS50YXJnZXQpIHtcbiAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZS50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgICB9XG4gICAgICBpZiAoIWdlc3R1cmUuc2xpZGVFbCkge1xuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsKSB7XG4gICAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKVswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnZXN0dXJlLnNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBpbWFnZUVsID0gZ2VzdHVyZS5zbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGltYWdlRWwgPSBpbWFnZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKVswXTtcbiAgICAgIH1cbiAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IGltYWdlRWw7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gZWxlbWVudFBhcmVudHMoZ2VzdHVyZS5pbWFnZUVsLCBgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwgfHwgIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgIH1cbiAgICBnZXN0dXJlLnNsaWRlRWwuY2xhc3NMaXN0LmFkZChgJHtwYXJhbXMuem9vbWVkU2xpZGVDbGFzc31gKTtcbiAgICBsZXQgdG91Y2hYO1xuICAgIGxldCB0b3VjaFk7XG4gICAgbGV0IG9mZnNldFg7XG4gICAgbGV0IG9mZnNldFk7XG4gICAgbGV0IGRpZmZYO1xuICAgIGxldCBkaWZmWTtcbiAgICBsZXQgdHJhbnNsYXRlWDtcbiAgICBsZXQgdHJhbnNsYXRlWTtcbiAgICBsZXQgaW1hZ2VXaWR0aDtcbiAgICBsZXQgaW1hZ2VIZWlnaHQ7XG4gICAgbGV0IHNjYWxlZFdpZHRoO1xuICAgIGxldCBzY2FsZWRIZWlnaHQ7XG4gICAgbGV0IHRyYW5zbGF0ZU1pblg7XG4gICAgbGV0IHRyYW5zbGF0ZU1pblk7XG4gICAgbGV0IHRyYW5zbGF0ZU1heFg7XG4gICAgbGV0IHRyYW5zbGF0ZU1heFk7XG4gICAgbGV0IHNsaWRlV2lkdGg7XG4gICAgbGV0IHNsaWRlSGVpZ2h0O1xuICAgIGlmICh0eXBlb2YgaW1hZ2UudG91Y2hlc1N0YXJ0LnggPT09ICd1bmRlZmluZWQnICYmIGUpIHtcbiAgICAgIHRvdWNoWCA9IGUucGFnZVg7XG4gICAgICB0b3VjaFkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3VjaFggPSBpbWFnZS50b3VjaGVzU3RhcnQueDtcbiAgICAgIHRvdWNoWSA9IGltYWdlLnRvdWNoZXNTdGFydC55O1xuICAgIH1cbiAgICBjb25zdCBmb3JjZVpvb21SYXRpbyA9IHR5cGVvZiBlID09PSAnbnVtYmVyJyA/IGUgOiBudWxsO1xuICAgIGlmIChjdXJyZW50U2NhbGUgPT09IDEgJiYgZm9yY2Vab29tUmF0aW8pIHtcbiAgICAgIHRvdWNoWCA9IHVuZGVmaW5lZDtcbiAgICAgIHRvdWNoWSA9IHVuZGVmaW5lZDtcbiAgICAgIGltYWdlLnRvdWNoZXNTdGFydC54ID0gdW5kZWZpbmVkO1xuICAgICAgaW1hZ2UudG91Y2hlc1N0YXJ0LnkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IG1heFJhdGlvID0gZ2V0TWF4UmF0aW8oKTtcbiAgICB6b29tLnNjYWxlID0gZm9yY2Vab29tUmF0aW8gfHwgbWF4UmF0aW87XG4gICAgY3VycmVudFNjYWxlID0gZm9yY2Vab29tUmF0aW8gfHwgbWF4UmF0aW87XG4gICAgaWYgKGUgJiYgIShjdXJyZW50U2NhbGUgPT09IDEgJiYgZm9yY2Vab29tUmF0aW8pKSB7XG4gICAgICBzbGlkZVdpZHRoID0gZ2VzdHVyZS5zbGlkZUVsLm9mZnNldFdpZHRoO1xuICAgICAgc2xpZGVIZWlnaHQgPSBnZXN0dXJlLnNsaWRlRWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgb2Zmc2V0WCA9IGVsZW1lbnRPZmZzZXQoZ2VzdHVyZS5zbGlkZUVsKS5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG4gICAgICBvZmZzZXRZID0gZWxlbWVudE9mZnNldChnZXN0dXJlLnNsaWRlRWwpLnRvcCArIHdpbmRvdy5zY3JvbGxZO1xuICAgICAgZGlmZlggPSBvZmZzZXRYICsgc2xpZGVXaWR0aCAvIDIgLSB0b3VjaFg7XG4gICAgICBkaWZmWSA9IG9mZnNldFkgKyBzbGlkZUhlaWdodCAvIDIgLSB0b3VjaFk7XG4gICAgICBpbWFnZVdpZHRoID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldFdpZHRoIHx8IGdlc3R1cmUuaW1hZ2VFbC5jbGllbnRXaWR0aDtcbiAgICAgIGltYWdlSGVpZ2h0ID0gZ2VzdHVyZS5pbWFnZUVsLm9mZnNldEhlaWdodCB8fCBnZXN0dXJlLmltYWdlRWwuY2xpZW50SGVpZ2h0O1xuICAgICAgc2NhbGVkV2lkdGggPSBpbWFnZVdpZHRoICogem9vbS5zY2FsZTtcbiAgICAgIHNjYWxlZEhlaWdodCA9IGltYWdlSGVpZ2h0ICogem9vbS5zY2FsZTtcbiAgICAgIHRyYW5zbGF0ZU1pblggPSBNYXRoLm1pbihzbGlkZVdpZHRoIC8gMiAtIHNjYWxlZFdpZHRoIC8gMiwgMCk7XG4gICAgICB0cmFuc2xhdGVNaW5ZID0gTWF0aC5taW4oc2xpZGVIZWlnaHQgLyAyIC0gc2NhbGVkSGVpZ2h0IC8gMiwgMCk7XG4gICAgICB0cmFuc2xhdGVNYXhYID0gLXRyYW5zbGF0ZU1pblg7XG4gICAgICB0cmFuc2xhdGVNYXhZID0gLXRyYW5zbGF0ZU1pblk7XG4gICAgICB0cmFuc2xhdGVYID0gZGlmZlggKiB6b29tLnNjYWxlO1xuICAgICAgdHJhbnNsYXRlWSA9IGRpZmZZICogem9vbS5zY2FsZTtcbiAgICAgIGlmICh0cmFuc2xhdGVYIDwgdHJhbnNsYXRlTWluWCkge1xuICAgICAgICB0cmFuc2xhdGVYID0gdHJhbnNsYXRlTWluWDtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVYID4gdHJhbnNsYXRlTWF4WCkge1xuICAgICAgICB0cmFuc2xhdGVYID0gdHJhbnNsYXRlTWF4WDtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVZIDwgdHJhbnNsYXRlTWluWSkge1xuICAgICAgICB0cmFuc2xhdGVZID0gdHJhbnNsYXRlTWluWTtcbiAgICAgIH1cbiAgICAgIGlmICh0cmFuc2xhdGVZID4gdHJhbnNsYXRlTWF4WSkge1xuICAgICAgICB0cmFuc2xhdGVZID0gdHJhbnNsYXRlTWF4WTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNsYXRlWCA9IDA7XG4gICAgICB0cmFuc2xhdGVZID0gMDtcbiAgICB9XG4gICAgaWYgKGZvcmNlWm9vbVJhdGlvICYmIHpvb20uc2NhbGUgPT09IDEpIHtcbiAgICAgIGdlc3R1cmUub3JpZ2luWCA9IDA7XG4gICAgICBnZXN0dXJlLm9yaWdpblkgPSAwO1xuICAgIH1cbiAgICBnZXN0dXJlLmltYWdlV3JhcEVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICczMDBtcyc7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgsMClgO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYDtcbiAgfVxuICBmdW5jdGlvbiB6b29tT3V0KCkge1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XG4gICAgaWYgKCFnZXN0dXJlLnNsaWRlRWwpIHtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwpIHtcbiAgICAgICAgZ2VzdHVyZS5zbGlkZUVsID0gZWxlbWVudENoaWxkcmVuKHN3aXBlci5zbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlc3R1cmUuc2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICAgIH1cbiAgICAgIGxldCBpbWFnZUVsID0gZ2VzdHVyZS5zbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcbiAgICAgIGlmIChpbWFnZUVsKSB7XG4gICAgICAgIGltYWdlRWwgPSBpbWFnZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKVswXTtcbiAgICAgIH1cbiAgICAgIGdlc3R1cmUuaW1hZ2VFbCA9IGltYWdlRWw7XG4gICAgICBpZiAoaW1hZ2VFbCkge1xuICAgICAgICBnZXN0dXJlLmltYWdlV3JhcEVsID0gZWxlbWVudFBhcmVudHMoZ2VzdHVyZS5pbWFnZUVsLCBgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VzdHVyZS5pbWFnZVdyYXBFbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnZXN0dXJlLmltYWdlRWwgfHwgIWdlc3R1cmUuaW1hZ2VXcmFwRWwpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJyc7XG4gICAgfVxuICAgIHpvb20uc2NhbGUgPSAxO1xuICAgIGN1cnJlbnRTY2FsZSA9IDE7XG4gICAgaW1hZ2UudG91Y2hlc1N0YXJ0LnggPSB1bmRlZmluZWQ7XG4gICAgaW1hZ2UudG91Y2hlc1N0YXJ0LnkgPSB1bmRlZmluZWQ7XG4gICAgZ2VzdHVyZS5pbWFnZVdyYXBFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMzAwbXMnO1xuICAgIGdlc3R1cmUuaW1hZ2VXcmFwRWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsMCwwKSc7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICczMDBtcyc7XG4gICAgZ2VzdHVyZS5pbWFnZUVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSknO1xuICAgIGdlc3R1cmUuc2xpZGVFbC5jbGFzc0xpc3QucmVtb3ZlKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xuICAgIGdlc3R1cmUuc2xpZGVFbCA9IHVuZGVmaW5lZDtcbiAgICBnZXN0dXJlLm9yaWdpblggPSAwO1xuICAgIGdlc3R1cmUub3JpZ2luWSA9IDA7XG4gIH1cblxuICAvLyBUb2dnbGUgWm9vbVxuICBmdW5jdGlvbiB6b29tVG9nZ2xlKGUpIHtcbiAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XG4gICAgaWYgKHpvb20uc2NhbGUgJiYgem9vbS5zY2FsZSAhPT0gMSkge1xuICAgICAgLy8gWm9vbSBPdXRcbiAgICAgIHpvb21PdXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gWm9vbSBJblxuICAgICAgem9vbUluKGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gc3dpcGVyLnBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xuICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgIGNhcHR1cmU6IGZhbHNlXG4gICAgfSA6IGZhbHNlO1xuICAgIGNvbnN0IGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmUgPSBzd2lwZXIucGFyYW1zLnBhc3NpdmVMaXN0ZW5lcnMgPyB7XG4gICAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICAgIGNhcHR1cmU6IHRydWVcbiAgICB9IDogdHJ1ZTtcbiAgICByZXR1cm4ge1xuICAgICAgcGFzc2l2ZUxpc3RlbmVyLFxuICAgICAgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZVxuICAgIH07XG4gIH1cblxuICAvLyBBdHRhY2gvRGV0YWNoIEV2ZW50c1xuICBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xuICAgIGlmICh6b29tLmVuYWJsZWQpIHJldHVybjtcbiAgICB6b29tLmVuYWJsZWQgPSB0cnVlO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhc3NpdmVMaXN0ZW5lcixcbiAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcbiAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XG5cbiAgICAvLyBTY2FsZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgICBbJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJywgJ3BvaW50ZXJvdXQnXS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgfSk7XG5cbiAgICAvLyBNb3ZlIGltYWdlXG4gICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uVG91Y2hNb3ZlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcbiAgICBpZiAoIXpvb20uZW5hYmxlZCkgcmV0dXJuO1xuICAgIHpvb20uZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhc3NpdmVMaXN0ZW5lcixcbiAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcbiAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XG5cbiAgICAvLyBTY2FsZSBpbWFnZVxuICAgIHN3aXBlci53cmFwcGVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcbiAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgICBbJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJywgJ3BvaW50ZXJvdXQnXS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XG4gICAgfSk7XG5cbiAgICAvLyBNb3ZlIGltYWdlXG4gICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uVG91Y2hNb3ZlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcbiAgfVxuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQpIHtcbiAgICAgIGVuYWJsZSgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGRpc2FibGUoKTtcbiAgfSk7XG4gIG9uKCd0b3VjaFN0YXJ0JywgKF9zLCBlKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuem9vbS5lbmFibGVkKSByZXR1cm47XG4gICAgb25Ub3VjaFN0YXJ0KGUpO1xuICB9KTtcbiAgb24oJ3RvdWNoRW5kJywgKF9zLCBlKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuem9vbS5lbmFibGVkKSByZXR1cm47XG4gICAgb25Ub3VjaEVuZCgpO1xuICB9KTtcbiAgb24oJ2RvdWJsZVRhcCcsIChfcywgZSkgPT4ge1xuICAgIGlmICghc3dpcGVyLmFuaW1hdGluZyAmJiBzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIuem9vbS5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuem9vbS50b2dnbGUpIHtcbiAgICAgIHpvb21Ub2dnbGUoZSk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3RyYW5zaXRpb25FbmQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy56b29tLmVuYWJsZWQpIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZCgpO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLnpvb20sIHtcbiAgICBlbmFibGUsXG4gICAgZGlzYWJsZSxcbiAgICBpbjogem9vbUluLFxuICAgIG91dDogem9vbU91dCxcbiAgICB0b2dnbGU6IHpvb21Ub2dnbGVcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFpvb20gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgbiBhcyBuZXh0VGljaywgayBhcyBlbGVtZW50VHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG4vKiBlc2xpbnQgbm8tYml0d2lzZTogW1wiZXJyb3JcIiwgeyBcImFsbG93XCI6IFtcIj4+XCJdIH1dICovXG5mdW5jdGlvbiBDb250cm9sbGVyKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgIGNvbnRyb2w6IHVuZGVmaW5lZCxcbiAgICAgIGludmVyc2U6IGZhbHNlLFxuICAgICAgYnk6ICdzbGlkZScgLy8gb3IgJ2NvbnRhaW5lcidcbiAgICB9XG4gIH0pO1xuXG4gIHN3aXBlci5jb250cm9sbGVyID0ge1xuICAgIGNvbnRyb2w6IHVuZGVmaW5lZFxuICB9O1xuICBmdW5jdGlvbiBMaW5lYXJTcGxpbmUoeCwgeSkge1xuICAgIGNvbnN0IGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgICAgIGxldCBtYXhJbmRleDtcbiAgICAgIGxldCBtaW5JbmRleDtcbiAgICAgIGxldCBndWVzcztcbiAgICAgIHJldHVybiAoYXJyYXksIHZhbCkgPT4ge1xuICAgICAgICBtaW5JbmRleCA9IC0xO1xuICAgICAgICBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKG1heEluZGV4IC0gbWluSW5kZXggPiAxKSB7XG4gICAgICAgICAgZ3Vlc3MgPSBtYXhJbmRleCArIG1pbkluZGV4ID4+IDE7XG4gICAgICAgICAgaWYgKGFycmF5W2d1ZXNzXSA8PSB2YWwpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gZ3Vlc3M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gZ3Vlc3M7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhJbmRleDtcbiAgICAgIH07XG4gICAgfSgpO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmxhc3RJbmRleCA9IHgubGVuZ3RoIC0gMTtcbiAgICAvLyBHaXZlbiBhbiB4IHZhbHVlICh4MiksIHJldHVybiB0aGUgZXhwZWN0ZWQgeTIgdmFsdWU6XG4gICAgLy8gKHgxLHkxKSBpcyB0aGUga25vd24gcG9pbnQgYmVmb3JlIGdpdmVuIHZhbHVlLFxuICAgIC8vICh4Myx5MykgaXMgdGhlIGtub3duIHBvaW50IGFmdGVyIGdpdmVuIHZhbHVlLlxuICAgIGxldCBpMTtcbiAgICBsZXQgaTM7XG4gICAgdGhpcy5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIGludGVycG9sYXRlKHgyKSB7XG4gICAgICBpZiAoIXgyKSByZXR1cm4gMDtcblxuICAgICAgLy8gR2V0IHRoZSBpbmRleGVzIG9mIHgxIGFuZCB4MyAodGhlIGFycmF5IGluZGV4ZXMgYmVmb3JlIGFuZCBhZnRlciBnaXZlbiB4Mik6XG4gICAgICBpMyA9IGJpbmFyeVNlYXJjaCh0aGlzLngsIHgyKTtcbiAgICAgIGkxID0gaTMgLSAxO1xuXG4gICAgICAvLyBXZSBoYXZlIG91ciBpbmRleGVzIGkxICYgaTMsIHNvIHdlIGNhbiBjYWxjdWxhdGUgYWxyZWFkeTpcbiAgICAgIC8vIHkyIDo9ICgoeDLiiJJ4MSkgw5cgKHkz4oiSeTEpKSDDtyAoeDPiiJJ4MSkgKyB5MVxuICAgICAgcmV0dXJuICh4MiAtIHRoaXMueFtpMV0pICogKHRoaXMueVtpM10gLSB0aGlzLnlbaTFdKSAvICh0aGlzLnhbaTNdIC0gdGhpcy54W2kxXSkgKyB0aGlzLnlbaTFdO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0SW50ZXJwb2xhdGVGdW5jdGlvbihjKSB7XG4gICAgc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lID0gc3dpcGVyLnBhcmFtcy5sb29wID8gbmV3IExpbmVhclNwbGluZShzd2lwZXIuc2xpZGVzR3JpZCwgYy5zbGlkZXNHcmlkKSA6IG5ldyBMaW5lYXJTcGxpbmUoc3dpcGVyLnNuYXBHcmlkLCBjLnNuYXBHcmlkKTtcbiAgfVxuICBmdW5jdGlvbiBzZXRUcmFuc2xhdGUoX3QsIGJ5Q29udHJvbGxlcikge1xuICAgIGNvbnN0IGNvbnRyb2xsZWQgPSBzd2lwZXIuY29udHJvbGxlci5jb250cm9sO1xuICAgIGxldCBtdWx0aXBsaWVyO1xuICAgIGxldCBjb250cm9sbGVkVHJhbnNsYXRlO1xuICAgIGNvbnN0IFN3aXBlciA9IHN3aXBlci5jb25zdHJ1Y3RvcjtcbiAgICBmdW5jdGlvbiBzZXRDb250cm9sbGVkVHJhbnNsYXRlKGMpIHtcbiAgICAgIGlmIChjLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIEludGVycG9sYXRlIGZ1bmN0aW9uIGJhc2VkIG9uIHRoZSBzbmFwR3JpZHNcbiAgICAgIC8vIHggaXMgdGhlIEdyaWQgb2YgdGhlIHNjcm9sbGVkIHNjcm9sbGVyIGFuZCB5IHdpbGwgYmUgdGhlIGNvbnRyb2xsZWQgc2Nyb2xsZXJcbiAgICAgIC8vIGl0IG1ha2VzIHNlbnNlIHRvIGNyZWF0ZSB0aGlzIG9ubHkgb25jZSBhbmQgcmVjYWxsIGl0IGZvciB0aGUgaW50ZXJwb2xhdGlvblxuICAgICAgLy8gdGhlIGZ1bmN0aW9uIGRvZXMgYSBsb3Qgb2YgdmFsdWUgY2FjaGluZyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtc3dpcGVyLnRyYW5zbGF0ZSA6IHN3aXBlci50cmFuc2xhdGU7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmJ5ID09PSAnc2xpZGUnKSB7XG4gICAgICAgIGdldEludGVycG9sYXRlRnVuY3Rpb24oYyk7XG4gICAgICAgIC8vIGkgYW0gbm90IHN1cmUgd2h5IHRoZSB2YWx1ZXMgaGF2ZSB0byBiZSBtdWx0aXBsaWNhdGVkIHRoaXMgd2F5LCB0cmllZCB0byBpbnZlcnQgdGhlIHNuYXBHcmlkXG4gICAgICAgIC8vIGJ1dCBpdCBkaWQgbm90IHdvcmsgb3V0XG4gICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAtc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lLmludGVycG9sYXRlKC10cmFuc2xhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFjb250cm9sbGVkVHJhbnNsYXRlIHx8IHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5ieSA9PT0gJ2NvbnRhaW5lcicpIHtcbiAgICAgICAgbXVsdGlwbGllciA9IChjLm1heFRyYW5zbGF0ZSgpIC0gYy5taW5UcmFuc2xhdGUoKSkgLyAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKTtcbiAgICAgICAgaWYgKE51bWJlci5pc05hTihtdWx0aXBsaWVyKSB8fCAhTnVtYmVyLmlzRmluaXRlKG11bHRpcGxpZXIpKSB7XG4gICAgICAgICAgbXVsdGlwbGllciA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgY29udHJvbGxlZFRyYW5zbGF0ZSA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpICogbXVsdGlwbGllciArIGMubWluVHJhbnNsYXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmludmVyc2UpIHtcbiAgICAgICAgY29udHJvbGxlZFRyYW5zbGF0ZSA9IGMubWF4VHJhbnNsYXRlKCkgLSBjb250cm9sbGVkVHJhbnNsYXRlO1xuICAgICAgfVxuICAgICAgYy51cGRhdGVQcm9ncmVzcyhjb250cm9sbGVkVHJhbnNsYXRlKTtcbiAgICAgIGMuc2V0VHJhbnNsYXRlKGNvbnRyb2xsZWRUcmFuc2xhdGUsIHN3aXBlcik7XG4gICAgICBjLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICBjLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbGxlZCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udHJvbGxlZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoY29udHJvbGxlZFtpXSAhPT0gYnlDb250cm9sbGVyICYmIGNvbnRyb2xsZWRbaV0gaW5zdGFuY2VvZiBTd2lwZXIpIHtcbiAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNsYXRlKGNvbnRyb2xsZWRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb250cm9sbGVkIGluc3RhbmNlb2YgU3dpcGVyICYmIGJ5Q29udHJvbGxlciAhPT0gY29udHJvbGxlZCkge1xuICAgICAgc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjb250cm9sbGVkKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XG4gICAgY29uc3QgU3dpcGVyID0gc3dpcGVyLmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IGNvbnRyb2xsZWQgPSBzd2lwZXIuY29udHJvbGxlci5jb250cm9sO1xuICAgIGxldCBpO1xuICAgIGZ1bmN0aW9uIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGMpIHtcbiAgICAgIGlmIChjLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgYy5zZXRUcmFuc2l0aW9uKGR1cmF0aW9uLCBzd2lwZXIpO1xuICAgICAgaWYgKGR1cmF0aW9uICE9PSAwKSB7XG4gICAgICAgIGMudHJhbnNpdGlvblN0YXJ0KCk7XG4gICAgICAgIGlmIChjLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgYy51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQoYy53cmFwcGVyRWwsICgpID0+IHtcbiAgICAgICAgICBpZiAoIWNvbnRyb2xsZWQpIHJldHVybjtcbiAgICAgICAgICBjLnRyYW5zaXRpb25FbmQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xsZWQpKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY29udHJvbGxlZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoY29udHJvbGxlZFtpXSAhPT0gYnlDb250cm9sbGVyICYmIGNvbnRyb2xsZWRbaV0gaW5zdGFuY2VvZiBTd2lwZXIpIHtcbiAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjb250cm9sbGVkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcbiAgICAgIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGNvbnRyb2xsZWQpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZW1vdmVTcGxpbmUoKSB7XG4gICAgaWYgKCFzd2lwZXIuY29udHJvbGxlci5jb250cm9sKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5jb250cm9sbGVyLnNwbGluZSkge1xuICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lID0gdW5kZWZpbmVkO1xuICAgICAgZGVsZXRlIHN3aXBlci5jb250cm9sbGVyLnNwbGluZTtcbiAgICB9XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgdHlwZW9mIHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sID09PSAnc3RyaW5nJyB8fCBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgY29uc3QgY29udHJvbEVsZW1lbnRzID0gdHlwZW9mIHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sID09PSAnc3RyaW5nJyA/IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sKV0gOiBbc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmNvbnRyb2xdO1xuICAgICAgY29udHJvbEVsZW1lbnRzLmZvckVhY2goY29udHJvbEVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoIXN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wpIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgPSBbXTtcbiAgICAgICAgaWYgKGNvbnRyb2xFbGVtZW50ICYmIGNvbnRyb2xFbGVtZW50LnN3aXBlcikge1xuICAgICAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wucHVzaChjb250cm9sRWxlbWVudC5zd2lwZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRyb2xFbGVtZW50KSB7XG4gICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYCR7c3dpcGVyLnBhcmFtcy5ldmVudHNQcmVmaXh9aW5pdGA7XG4gICAgICAgICAgY29uc3Qgb25Db250cm9sbGVyU3dpcGVyID0gZSA9PiB7XG4gICAgICAgICAgICBzd2lwZXIuY29udHJvbGxlci5jb250cm9sLnB1c2goZS5kZXRhaWxbMF0pO1xuICAgICAgICAgICAgc3dpcGVyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgY29udHJvbEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9uQ29udHJvbGxlclN3aXBlcik7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb250cm9sRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25Db250cm9sbGVyU3dpcGVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgPSBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuY29udHJvbDtcbiAgfSk7XG4gIG9uKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgcmVtb3ZlU3BsaW5lKCk7XG4gIH0pO1xuICBvbigncmVzaXplJywgKCkgPT4ge1xuICAgIHJlbW92ZVNwbGluZSgpO1xuICB9KTtcbiAgb24oJ29ic2VydmVyVXBkYXRlJywgKCkgPT4ge1xuICAgIHJlbW92ZVNwbGluZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zbGF0ZScsIChfcywgdHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpID0+IHtcbiAgICBpZiAoIXN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgfHwgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBzd2lwZXIuY29udHJvbGxlci5zZXRUcmFuc2xhdGUodHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpID0+IHtcbiAgICBpZiAoIXN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgfHwgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBzd2lwZXIuY29udHJvbGxlci5zZXRUcmFuc2l0aW9uKGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpO1xuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIuY29udHJvbGxlciwge1xuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uXG4gIH0pO1xufVxuXG5leHBvcnQgeyBDb250cm9sbGVyIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGMgYXMgY2xhc3Nlc1RvU2VsZWN0b3IgfSBmcm9tICcuLi9zaGFyZWQvY2xhc3Nlcy10by1zZWxlY3Rvci5tanMnO1xuaW1wb3J0IHsgYyBhcyBjcmVhdGVFbGVtZW50LCBoIGFzIGVsZW1lbnRJbmRleCwgbSBhcyBtYWtlRWxlbWVudHNBcnJheSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBBMTF5KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGExMXk6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBub3RpZmljYXRpb25DbGFzczogJ3N3aXBlci1ub3RpZmljYXRpb24nLFxuICAgICAgcHJldlNsaWRlTWVzc2FnZTogJ1ByZXZpb3VzIHNsaWRlJyxcbiAgICAgIG5leHRTbGlkZU1lc3NhZ2U6ICdOZXh0IHNsaWRlJyxcbiAgICAgIGZpcnN0U2xpZGVNZXNzYWdlOiAnVGhpcyBpcyB0aGUgZmlyc3Qgc2xpZGUnLFxuICAgICAgbGFzdFNsaWRlTWVzc2FnZTogJ1RoaXMgaXMgdGhlIGxhc3Qgc2xpZGUnLFxuICAgICAgcGFnaW5hdGlvbkJ1bGxldE1lc3NhZ2U6ICdHbyB0byBzbGlkZSB7e2luZGV4fX0nLFxuICAgICAgc2xpZGVMYWJlbE1lc3NhZ2U6ICd7e2luZGV4fX0gLyB7e3NsaWRlc0xlbmd0aH19JyxcbiAgICAgIGNvbnRhaW5lck1lc3NhZ2U6IG51bGwsXG4gICAgICBjb250YWluZXJSb2xlRGVzY3JpcHRpb25NZXNzYWdlOiBudWxsLFxuICAgICAgY29udGFpbmVyUm9sZTogbnVsbCxcbiAgICAgIGl0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlOiBudWxsLFxuICAgICAgc2xpZGVSb2xlOiAnZ3JvdXAnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBzY3JvbGxPbkZvY3VzOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgc3dpcGVyLmExMXkgPSB7XG4gICAgY2xpY2tlZDogZmFsc2VcbiAgfTtcbiAgbGV0IGxpdmVSZWdpb24gPSBudWxsO1xuICBsZXQgcHJldmVudEZvY3VzSGFuZGxlcjtcbiAgbGV0IGZvY3VzVGFyZ2V0U2xpZGVFbDtcbiAgbGV0IHZpc2liaWxpdHlDaGFuZ2VkVGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGZ1bmN0aW9uIG5vdGlmeShtZXNzYWdlKSB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gbGl2ZVJlZ2lvbjtcbiAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIG5vdGlmaWNhdGlvbi5pbm5lckhUTUwgPSAnJztcbiAgICBub3RpZmljYXRpb24uaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRSYW5kb21OdW1iZXIoc2l6ZSkge1xuICAgIGlmIChzaXplID09PSB2b2lkIDApIHtcbiAgICAgIHNpemUgPSAxNjtcbiAgICB9XG4gICAgY29uc3QgcmFuZG9tQ2hhciA9ICgpID0+IE1hdGgucm91bmQoMTYgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuICd4Jy5yZXBlYXQoc2l6ZSkucmVwbGFjZSgveC9nLCByYW5kb21DaGFyKTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlRWxGb2N1c2FibGUoZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnMCcpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VFbE5vdEZvY3VzYWJsZShlbCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsUm9sZShlbCwgcm9sZSkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgcm9sZSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxSb2xlRGVzY3JpcHRpb24oZWwsIGRlc2NyaXB0aW9uKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm9sZWRlc2NyaXB0aW9uJywgZGVzY3JpcHRpb24pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGFkZEVsQ29udHJvbHMoZWwsIGNvbnRyb2xzKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBjb250cm9scyk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYWRkRWxMYWJlbChlbCwgbGFiZWwpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbElkKGVsLCBpZCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBhZGRFbExpdmUoZWwsIGxpdmUpIHtcbiAgICBlbCA9IG1ha2VFbGVtZW50c0FycmF5KGVsKTtcbiAgICBlbC5mb3JFYWNoKHN1YkVsID0+IHtcbiAgICAgIHN1YkVsLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgbGl2ZSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUVsKGVsKSB7XG4gICAgZWwgPSBtYWtlRWxlbWVudHNBcnJheShlbCk7XG4gICAgZWwuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICBzdWJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVFbChlbCkge1xuICAgIGVsID0gbWFrZUVsZW1lbnRzQXJyYXkoZWwpO1xuICAgIGVsLmZvckVhY2goc3ViRWwgPT4ge1xuICAgICAgc3ViRWwuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRW50ZXJPclNwYWNlS2V5KGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlICE9PSAxMyAmJiBlLmtleUNvZGUgIT09IDMyKSByZXR1cm47XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5hMTF5O1xuICAgIGNvbnN0IHRhcmdldEVsID0gZS50YXJnZXQ7XG4gICAgaWYgKHN3aXBlci5wYWdpbmF0aW9uICYmIHN3aXBlci5wYWdpbmF0aW9uLmVsICYmICh0YXJnZXRFbCA9PT0gc3dpcGVyLnBhZ2luYXRpb24uZWwgfHwgc3dpcGVyLnBhZ2luYXRpb24uZWwuY29udGFpbnMoZS50YXJnZXQpKSkge1xuICAgICAgaWYgKCFlLnRhcmdldC5tYXRjaGVzKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpKSByZXR1cm47XG4gICAgfVxuICAgIGlmIChzd2lwZXIubmF2aWdhdGlvbiAmJiBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwgJiYgc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsKSB7XG4gICAgICBjb25zdCBwcmV2RWxzID0gbWFrZUVsZW1lbnRzQXJyYXkoc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsKTtcbiAgICAgIGNvbnN0IG5leHRFbHMgPSBtYWtlRWxlbWVudHNBcnJheShzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwpO1xuICAgICAgaWYgKG5leHRFbHMuaW5jbHVkZXModGFyZ2V0RWwpKSB7XG4gICAgICAgIGlmICghKHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSkge1xuICAgICAgICAgIHN3aXBlci5zbGlkZU5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3dpcGVyLmlzRW5kKSB7XG4gICAgICAgICAgbm90aWZ5KHBhcmFtcy5sYXN0U2xpZGVNZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZnkocGFyYW1zLm5leHRTbGlkZU1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJldkVscy5pbmNsdWRlcyh0YXJnZXRFbCkpIHtcbiAgICAgICAgaWYgKCEoc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmxvb3ApKSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlUHJldigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICAgICAgICBub3RpZnkocGFyYW1zLmZpcnN0U2xpZGVNZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZnkocGFyYW1zLnByZXZTbGlkZU1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFnaW5hdGlvbiAmJiB0YXJnZXRFbC5tYXRjaGVzKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpKSB7XG4gICAgICB0YXJnZXRFbC5jbGljaygpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1cGRhdGVOYXZpZ2F0aW9uKCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3AgfHwgc3dpcGVyLnBhcmFtcy5yZXdpbmQgfHwgIXN3aXBlci5uYXZpZ2F0aW9uKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uO1xuICAgIGlmIChwcmV2RWwpIHtcbiAgICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICAgICAgZGlzYWJsZUVsKHByZXZFbCk7XG4gICAgICAgIG1ha2VFbE5vdEZvY3VzYWJsZShwcmV2RWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW5hYmxlRWwocHJldkVsKTtcbiAgICAgICAgbWFrZUVsRm9jdXNhYmxlKHByZXZFbCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuZXh0RWwpIHtcbiAgICAgIGlmIChzd2lwZXIuaXNFbmQpIHtcbiAgICAgICAgZGlzYWJsZUVsKG5leHRFbCk7XG4gICAgICAgIG1ha2VFbE5vdEZvY3VzYWJsZShuZXh0RWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW5hYmxlRWwobmV4dEVsKTtcbiAgICAgICAgbWFrZUVsRm9jdXNhYmxlKG5leHRFbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGhhc1BhZ2luYXRpb24oKSB7XG4gICAgcmV0dXJuIHN3aXBlci5wYWdpbmF0aW9uICYmIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMgJiYgc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cy5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gaGFzQ2xpY2thYmxlUGFnaW5hdGlvbigpIHtcbiAgICByZXR1cm4gaGFzUGFnaW5hdGlvbigpICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5jbGlja2FibGU7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlUGFnaW5hdGlvbigpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmExMXk7XG4gICAgaWYgKCFoYXNQYWdpbmF0aW9uKCkpIHJldHVybjtcbiAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLmZvckVhY2goYnVsbGV0RWwgPT4ge1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5jbGlja2FibGUpIHtcbiAgICAgICAgbWFrZUVsRm9jdXNhYmxlKGJ1bGxldEVsKTtcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ucmVuZGVyQnVsbGV0KSB7XG4gICAgICAgICAgYWRkRWxSb2xlKGJ1bGxldEVsLCAnYnV0dG9uJyk7XG4gICAgICAgICAgYWRkRWxMYWJlbChidWxsZXRFbCwgcGFyYW1zLnBhZ2luYXRpb25CdWxsZXRNZXNzYWdlLnJlcGxhY2UoL1xce1xce2luZGV4XFx9XFx9LywgZWxlbWVudEluZGV4KGJ1bGxldEVsKSArIDEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGJ1bGxldEVsLm1hdGNoZXMoY2xhc3Nlc1RvU2VsZWN0b3Ioc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldEFjdGl2ZUNsYXNzKSkpIHtcbiAgICAgICAgYnVsbGV0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnLCAndHJ1ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVsbGV0RWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjb25zdCBpbml0TmF2RWwgPSAoZWwsIHdyYXBwZXJJZCwgbWVzc2FnZSkgPT4ge1xuICAgIG1ha2VFbEZvY3VzYWJsZShlbCk7XG4gICAgaWYgKGVsLnRhZ05hbWUgIT09ICdCVVRUT04nKSB7XG4gICAgICBhZGRFbFJvbGUoZWwsICdidXR0b24nKTtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSk7XG4gICAgfVxuICAgIGFkZEVsTGFiZWwoZWwsIG1lc3NhZ2UpO1xuICAgIGFkZEVsQ29udHJvbHMoZWwsIHdyYXBwZXJJZCk7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJEb3duID0gZSA9PiB7XG4gICAgaWYgKGZvY3VzVGFyZ2V0U2xpZGVFbCAmJiBmb2N1c1RhcmdldFNsaWRlRWwgIT09IGUudGFyZ2V0ICYmICFmb2N1c1RhcmdldFNsaWRlRWwuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICBwcmV2ZW50Rm9jdXNIYW5kbGVyID0gdHJ1ZTtcbiAgICB9XG4gICAgc3dpcGVyLmExMXkuY2xpY2tlZCA9IHRydWU7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJVcCA9ICgpID0+IHtcbiAgICBwcmV2ZW50Rm9jdXNIYW5kbGVyID0gZmFsc2U7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICghc3dpcGVyLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHN3aXBlci5hMTF5LmNsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9uVmlzaWJpbGl0eUNoYW5nZSA9IGUgPT4ge1xuICAgIHZpc2liaWxpdHlDaGFuZ2VkVGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG4gIGNvbnN0IGhhbmRsZUZvY3VzID0gZSA9PiB7XG4gICAgaWYgKHN3aXBlci5hMTF5LmNsaWNrZWQgfHwgIXN3aXBlci5wYXJhbXMuYTExeS5zY3JvbGxPbkZvY3VzKSByZXR1cm47XG4gICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdmlzaWJpbGl0eUNoYW5nZWRUaW1lc3RhbXAgPCAxMDApIHJldHVybjtcbiAgICBjb25zdCBzbGlkZUVsID0gZS50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgaWYgKCFzbGlkZUVsIHx8ICFzd2lwZXIuc2xpZGVzLmluY2x1ZGVzKHNsaWRlRWwpKSByZXR1cm47XG4gICAgZm9jdXNUYXJnZXRTbGlkZUVsID0gc2xpZGVFbDtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IHN3aXBlci5zbGlkZXMuaW5kZXhPZihzbGlkZUVsKSA9PT0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHN3aXBlci5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyAmJiBzd2lwZXIudmlzaWJsZVNsaWRlcyAmJiBzd2lwZXIudmlzaWJsZVNsaWRlcy5pbmNsdWRlcyhzbGlkZUVsKTtcbiAgICBpZiAoaXNBY3RpdmUgfHwgaXNWaXNpYmxlKSByZXR1cm47XG4gICAgaWYgKGUuc291cmNlQ2FwYWJpbGl0aWVzICYmIGUuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICBzd2lwZXIuZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5lbC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKHByZXZlbnRGb2N1c0hhbmRsZXIpIHJldHVybjtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG9Mb29wKHBhcnNlSW50KHNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpKSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmluZGV4T2Yoc2xpZGVFbCksIDApO1xuICAgICAgfVxuICAgICAgcHJldmVudEZvY3VzSGFuZGxlciA9IGZhbHNlO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBpbml0U2xpZGVzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcbiAgICBpZiAocGFyYW1zLml0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRFbFJvbGVEZXNjcmlwdGlvbihzd2lwZXIuc2xpZGVzLCBwYXJhbXMuaXRlbVJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNsaWRlUm9sZSkge1xuICAgICAgYWRkRWxSb2xlKHN3aXBlci5zbGlkZXMsIHBhcmFtcy5zbGlkZVJvbGUpO1xuICAgIH1cbiAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgICBpZiAocGFyYW1zLnNsaWRlTGFiZWxNZXNzYWdlKSB7XG4gICAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goKHNsaWRlRWwsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBwYXJzZUludChzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApIDogaW5kZXg7XG4gICAgICAgIGNvbnN0IGFyaWFMYWJlbE1lc3NhZ2UgPSBwYXJhbXMuc2xpZGVMYWJlbE1lc3NhZ2UucmVwbGFjZSgvXFx7XFx7aW5kZXhcXH1cXH0vLCBzbGlkZUluZGV4ICsgMSkucmVwbGFjZSgvXFx7XFx7c2xpZGVzTGVuZ3RoXFx9XFx9Lywgc2xpZGVzTGVuZ3RoKTtcbiAgICAgICAgYWRkRWxMYWJlbChzbGlkZUVsLCBhcmlhTGFiZWxNZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmExMXk7XG4gICAgc3dpcGVyLmVsLmFwcGVuZChsaXZlUmVnaW9uKTtcblxuICAgIC8vIENvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gc3dpcGVyLmVsO1xuICAgIGlmIChwYXJhbXMuY29udGFpbmVyUm9sZURlc2NyaXB0aW9uTWVzc2FnZSkge1xuICAgICAgYWRkRWxSb2xlRGVzY3JpcHRpb24oY29udGFpbmVyRWwsIHBhcmFtcy5jb250YWluZXJSb2xlRGVzY3JpcHRpb25NZXNzYWdlKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5jb250YWluZXJNZXNzYWdlKSB7XG4gICAgICBhZGRFbExhYmVsKGNvbnRhaW5lckVsLCBwYXJhbXMuY29udGFpbmVyTWVzc2FnZSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuY29udGFpbmVyUm9sZSkge1xuICAgICAgYWRkRWxSb2xlKGNvbnRhaW5lckVsLCBwYXJhbXMuY29udGFpbmVyUm9sZSk7XG4gICAgfVxuXG4gICAgLy8gV3JhcHBlclxuICAgIGNvbnN0IHdyYXBwZXJFbCA9IHN3aXBlci53cmFwcGVyRWw7XG4gICAgY29uc3Qgd3JhcHBlcklkID0gcGFyYW1zLmlkIHx8IHdyYXBwZXJFbC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgYHN3aXBlci13cmFwcGVyLSR7Z2V0UmFuZG9tTnVtYmVyKDE2KX1gO1xuICAgIGNvbnN0IGxpdmUgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5ICYmIHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZW5hYmxlZCA/ICdvZmYnIDogJ3BvbGl0ZSc7XG4gICAgYWRkRWxJZCh3cmFwcGVyRWwsIHdyYXBwZXJJZCk7XG4gICAgYWRkRWxMaXZlKHdyYXBwZXJFbCwgbGl2ZSk7XG5cbiAgICAvLyBTbGlkZVxuICAgIGluaXRTbGlkZXMoKTtcblxuICAgIC8vIE5hdmlnYXRpb25cbiAgICBsZXQge1xuICAgICAgbmV4dEVsLFxuICAgICAgcHJldkVsXG4gICAgfSA9IHN3aXBlci5uYXZpZ2F0aW9uID8gc3dpcGVyLm5hdmlnYXRpb24gOiB7fTtcbiAgICBuZXh0RWwgPSBtYWtlRWxlbWVudHNBcnJheShuZXh0RWwpO1xuICAgIHByZXZFbCA9IG1ha2VFbGVtZW50c0FycmF5KHByZXZFbCk7XG4gICAgaWYgKG5leHRFbCkge1xuICAgICAgbmV4dEVsLmZvckVhY2goZWwgPT4gaW5pdE5hdkVsKGVsLCB3cmFwcGVySWQsIHBhcmFtcy5uZXh0U2xpZGVNZXNzYWdlKSk7XG4gICAgfVxuICAgIGlmIChwcmV2RWwpIHtcbiAgICAgIHByZXZFbC5mb3JFYWNoKGVsID0+IGluaXROYXZFbChlbCwgd3JhcHBlcklkLCBwYXJhbXMucHJldlNsaWRlTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIC8vIFBhZ2luYXRpb25cbiAgICBpZiAoaGFzQ2xpY2thYmxlUGFnaW5hdGlvbigpKSB7XG4gICAgICBjb25zdCBwYWdpbmF0aW9uRWwgPSBtYWtlRWxlbWVudHNBcnJheShzd2lwZXIucGFnaW5hdGlvbi5lbCk7XG4gICAgICBwYWdpbmF0aW9uRWwuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUYWIgZm9jdXNcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eUNoYW5nZSk7XG4gICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMsIHRydWUpO1xuICAgIHN3aXBlci5lbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzLCB0cnVlKTtcbiAgICBzd2lwZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVQb2ludGVyRG93biwgdHJ1ZSk7XG4gICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGhhbmRsZVBvaW50ZXJVcCwgdHJ1ZSk7XG4gIH07XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKGxpdmVSZWdpb24pIGxpdmVSZWdpb24ucmVtb3ZlKCk7XG4gICAgbGV0IHtcbiAgICAgIG5leHRFbCxcbiAgICAgIHByZXZFbFxuICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbiA/IHN3aXBlci5uYXZpZ2F0aW9uIDoge307XG4gICAgbmV4dEVsID0gbWFrZUVsZW1lbnRzQXJyYXkobmV4dEVsKTtcbiAgICBwcmV2RWwgPSBtYWtlRWxlbWVudHNBcnJheShwcmV2RWwpO1xuICAgIGlmIChuZXh0RWwpIHtcbiAgICAgIG5leHRFbC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSkpO1xuICAgIH1cbiAgICBpZiAocHJldkVsKSB7XG4gICAgICBwcmV2RWwuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpKTtcbiAgICB9XG5cbiAgICAvLyBQYWdpbmF0aW9uXG4gICAgaWYgKGhhc0NsaWNrYWJsZVBhZ2luYXRpb24oKSkge1xuICAgICAgY29uc3QgcGFnaW5hdGlvbkVsID0gbWFrZUVsZW1lbnRzQXJyYXkoc3dpcGVyLnBhZ2luYXRpb24uZWwpO1xuICAgICAgcGFnaW5hdGlvbkVsLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTtcbiAgICAvLyBUYWIgZm9jdXNcbiAgICBpZiAoc3dpcGVyLmVsICYmIHR5cGVvZiBzd2lwZXIuZWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cywgdHJ1ZSk7XG4gICAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVQb2ludGVyRG93biwgdHJ1ZSk7XG4gICAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgaGFuZGxlUG9pbnRlclVwLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgbGl2ZVJlZ2lvbiA9IGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCBzd2lwZXIucGFyYW1zLmExMXkubm90aWZpY2F0aW9uQ2xhc3MpO1xuICAgIGxpdmVSZWdpb24uc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG4gICAgbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcbiAgfSk7XG4gIG9uKCdhZnRlckluaXQnLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIGluaXQoKTtcbiAgfSk7XG4gIG9uKCdzbGlkZXNMZW5ndGhDaGFuZ2Ugc25hcEdyaWRMZW5ndGhDaGFuZ2Ugc2xpZGVzR3JpZExlbmd0aENoYW5nZScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgaW5pdFNsaWRlcygpO1xuICB9KTtcbiAgb24oJ2Zyb21FZGdlIHRvRWRnZSBhZnRlckluaXQgbG9jayB1bmxvY2snLCAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHVwZGF0ZU5hdmlnYXRpb24oKTtcbiAgfSk7XG4gIG9uKCdwYWdpbmF0aW9uVXBkYXRlJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5hMTF5LmVuYWJsZWQpIHJldHVybjtcbiAgICB1cGRhdGVQYWdpbmF0aW9uKCk7XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgQTExeSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBhIGFzIGdldFdpbmRvdyB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuXG5mdW5jdGlvbiBIaXN0b3J5KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGhpc3Rvcnk6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgcm9vdDogJycsXG4gICAgICByZXBsYWNlU3RhdGU6IGZhbHNlLFxuICAgICAga2V5OiAnc2xpZGVzJyxcbiAgICAgIGtlZXBRdWVyeTogZmFsc2VcbiAgICB9XG4gIH0pO1xuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgbGV0IHBhdGhzID0ge307XG4gIGNvbnN0IHNsdWdpZnkgPSB0ZXh0ID0+IHtcbiAgICByZXR1cm4gdGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xccysvZywgJy0nKS5yZXBsYWNlKC9bXlxcdy1dKy9nLCAnJykucmVwbGFjZSgvLS0rL2csICctJykucmVwbGFjZSgvXi0rLywgJycpLnJlcGxhY2UoLy0rJC8sICcnKTtcbiAgfTtcbiAgY29uc3QgZ2V0UGF0aFZhbHVlcyA9IHVybE92ZXJyaWRlID0+IHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgICBsZXQgbG9jYXRpb247XG4gICAgaWYgKHVybE92ZXJyaWRlKSB7XG4gICAgICBsb2NhdGlvbiA9IG5ldyBVUkwodXJsT3ZlcnJpZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG4gICAgY29uc3QgcGF0aEFycmF5ID0gbG9jYXRpb24ucGF0aG5hbWUuc2xpY2UoMSkuc3BsaXQoJy8nKS5maWx0ZXIocGFydCA9PiBwYXJ0ICE9PSAnJyk7XG4gICAgY29uc3QgdG90YWwgPSBwYXRoQXJyYXkubGVuZ3RoO1xuICAgIGNvbnN0IGtleSA9IHBhdGhBcnJheVt0b3RhbCAtIDJdO1xuICAgIGNvbnN0IHZhbHVlID0gcGF0aEFycmF5W3RvdGFsIC0gMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleSxcbiAgICAgIHZhbHVlXG4gICAgfTtcbiAgfTtcbiAgY29uc3Qgc2V0SGlzdG9yeSA9IChrZXksIGluZGV4KSA9PiB7XG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gICAgaWYgKCFpbml0aWFsaXplZCB8fCAhc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQpIHJldHVybjtcbiAgICBsZXQgbG9jYXRpb247XG4gICAgaWYgKHN3aXBlci5wYXJhbXMudXJsKSB7XG4gICAgICBsb2NhdGlvbiA9IG5ldyBVUkwoc3dpcGVyLnBhcmFtcy51cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG4gICAgY29uc3Qgc2xpZGUgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci5zbGlkZXNFbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke2luZGV4fVwiXWApIDogc3dpcGVyLnNsaWRlc1tpbmRleF07XG4gICAgbGV0IHZhbHVlID0gc2x1Z2lmeShzbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGlzdG9yeScpKTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJvb3QubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHJvb3QgPSBzd2lwZXIucGFyYW1zLmhpc3Rvcnkucm9vdDtcbiAgICAgIGlmIChyb290W3Jvb3QubGVuZ3RoIC0gMV0gPT09ICcvJykgcm9vdCA9IHJvb3Quc2xpY2UoMCwgcm9vdC5sZW5ndGggLSAxKTtcbiAgICAgIHZhbHVlID0gYCR7cm9vdH0vJHtrZXkgPyBgJHtrZXl9L2AgOiAnJ30ke3ZhbHVlfWA7XG4gICAgfSBlbHNlIGlmICghbG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgdmFsdWUgPSBgJHtrZXkgPyBgJHtrZXl9L2AgOiAnJ30ke3ZhbHVlfWA7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3Rvcnkua2VlcFF1ZXJ5KSB7XG4gICAgICB2YWx1ZSArPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnN0YXRlO1xuICAgIGlmIChjdXJyZW50U3RhdGUgJiYgY3VycmVudFN0YXRlLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcbiAgICAgICAgdmFsdWVcbiAgICAgIH0sIG51bGwsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcbiAgICAgICAgdmFsdWVcbiAgICAgIH0sIG51bGwsIHZhbHVlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNjcm9sbFRvU2xpZGUgPSAoc3BlZWQsIHZhbHVlLCBydW5DYWxsYmFja3MpID0+IHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBzd2lwZXIuc2xpZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlID0gc3dpcGVyLnNsaWRlc1tpXTtcbiAgICAgICAgY29uc3Qgc2xpZGVIaXN0b3J5ID0gc2x1Z2lmeShzbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGlzdG9yeScpKTtcbiAgICAgICAgaWYgKHNsaWRlSGlzdG9yeSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4KHNsaWRlKTtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oMCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRIaXN0b3J5UG9wU3RhdGUgPSAoKSA9PiB7XG4gICAgcGF0aHMgPSBnZXRQYXRoVmFsdWVzKHN3aXBlci5wYXJhbXMudXJsKTtcbiAgICBzY3JvbGxUb1NsaWRlKHN3aXBlci5wYXJhbXMuc3BlZWQsIHBhdGhzLnZhbHVlLCBmYWxzZSk7XG4gIH07XG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmhpc3RvcnkpIHJldHVybjtcbiAgICBpZiAoIXdpbmRvdy5oaXN0b3J5IHx8ICF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgIHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkID0gZmFsc2U7XG4gICAgICBzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgcGF0aHMgPSBnZXRQYXRoVmFsdWVzKHN3aXBlci5wYXJhbXMudXJsKTtcbiAgICBpZiAoIXBhdGhzLmtleSAmJiAhcGF0aHMudmFsdWUpIHtcbiAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBzZXRIaXN0b3J5UG9wU3RhdGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzY3JvbGxUb1NsaWRlKDAsIHBhdGhzLnZhbHVlLCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCk7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBzZXRIaXN0b3J5UG9wU3RhdGUpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHNldEhpc3RvcnlQb3BTdGF0ZSk7XG4gICAgfVxuICB9O1xuICBvbignaW5pdCcsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQpIHtcbiAgICAgIGluaXQoKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQpIHtcbiAgICAgIGRlc3Ryb3koKTtcbiAgICB9XG4gIH0pO1xuICBvbigndHJhbnNpdGlvbkVuZCBfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScsICgpID0+IHtcbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHNldEhpc3Rvcnkoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmtleSwgc3dpcGVyLmFjdGl2ZUluZGV4KTtcbiAgICB9XG4gIH0pO1xuICBvbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKGluaXRpYWxpemVkICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc2V0SGlzdG9yeShzd2lwZXIucGFyYW1zLmhpc3Rvcnkua2V5LCBzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IEhpc3RvcnkgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXREb2N1bWVudCwgYSBhcyBnZXRXaW5kb3cgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcbmltcG9ydCB7IGUgYXMgZWxlbWVudENoaWxkcmVuIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEhhc2hOYXZpZ2F0aW9uKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIGVtaXQsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGhhc2hOYXZpZ2F0aW9uOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VTdGF0ZTogZmFsc2UsXG4gICAgICB3YXRjaFN0YXRlOiBmYWxzZSxcbiAgICAgIGdldFNsaWRlSW5kZXgoX3MsIGhhc2gpIHtcbiAgICAgICAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVXaXRoSGFzaCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGFzaCcpID09PSBoYXNoKVswXTtcbiAgICAgICAgICBpZiAoIXNsaWRlV2l0aEhhc2gpIHJldHVybiAwO1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc2xpZGVXaXRoSGFzaC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JyksIDEwKTtcbiAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN3aXBlci5nZXRTbGlkZUluZGV4KGVsZW1lbnRDaGlsZHJlbihzd2lwZXIuc2xpZGVzRWwsIGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9W2RhdGEtaGFzaD1cIiR7aGFzaH1cIl0sIHN3aXBlci1zbGlkZVtkYXRhLWhhc2g9XCIke2hhc2h9XCJdYClbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG9uSGFzaENoYW5nZSA9ICgpID0+IHtcbiAgICBlbWl0KCdoYXNoQ2hhbmdlJyk7XG4gICAgY29uc3QgbmV3SGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICBjb25zdCBhY3RpdmVTbGlkZUVsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIuc2xpZGVzRWwucXVlcnlTZWxlY3RvcihgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzd2lwZXIuYWN0aXZlSW5kZXh9XCJdYCkgOiBzd2lwZXIuc2xpZGVzW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgY29uc3QgYWN0aXZlU2xpZGVIYXNoID0gYWN0aXZlU2xpZGVFbCA/IGFjdGl2ZVNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLWhhc2gnKSA6ICcnO1xuICAgIGlmIChuZXdIYXNoICE9PSBhY3RpdmVTbGlkZUhhc2gpIHtcbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5nZXRTbGlkZUluZGV4KHN3aXBlciwgbmV3SGFzaCk7XG4gICAgICBpZiAodHlwZW9mIG5ld0luZGV4ID09PSAndW5kZWZpbmVkJyB8fCBOdW1iZXIuaXNOYU4obmV3SW5kZXgpKSByZXR1cm47XG4gICAgICBzd2lwZXIuc2xpZGVUbyhuZXdJbmRleCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRIYXNoID0gKCkgPT4ge1xuICAgIGlmICghaW5pdGlhbGl6ZWQgfHwgIXN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCkgcmV0dXJuO1xuICAgIGNvbnN0IGFjdGl2ZVNsaWRlRWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci5zbGlkZXNFbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3N3aXBlci5hY3RpdmVJbmRleH1cIl1gKSA6IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcbiAgICBjb25zdCBhY3RpdmVTbGlkZUhhc2ggPSBhY3RpdmVTbGlkZUVsID8gYWN0aXZlU2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGFzaCcpIHx8IGFjdGl2ZVNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLWhpc3RvcnknKSA6ICcnO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLnJlcGxhY2VTdGF0ZSAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBudWxsLCBgIyR7YWN0aXZlU2xpZGVIYXNofWAgfHwgJycpO1xuICAgICAgZW1pdCgnaGFzaFNldCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5sb2NhdGlvbi5oYXNoID0gYWN0aXZlU2xpZGVIYXNoIHx8ICcnO1xuICAgICAgZW1pdCgnaGFzaFNldCcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCB8fCBzd2lwZXIucGFyYW1zLmhpc3RvcnkgJiYgc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQpIHJldHVybjtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgY29uc3QgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICBpZiAoaGFzaCkge1xuICAgICAgY29uc3Qgc3BlZWQgPSAwO1xuICAgICAgY29uc3QgaW5kZXggPSBzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmdldFNsaWRlSW5kZXgoc3dpcGVyLCBoYXNoKTtcbiAgICAgIHN3aXBlci5zbGlkZVRvKGluZGV4IHx8IDAsIHNwZWVkLCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLndhdGNoU3RhdGUpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgb25IYXNoQ2hhbmdlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24ud2F0Y2hTdGF0ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBvbkhhc2hDaGFuZ2UpO1xuICAgIH1cbiAgfTtcbiAgb24oJ2luaXQnLCAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCkge1xuICAgICAgaW5pdCgpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQpIHtcbiAgICAgIGRlc3Ryb3koKTtcbiAgICB9XG4gIH0pO1xuICBvbigndHJhbnNpdGlvbkVuZCBfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScsICgpID0+IHtcbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHNldEhhc2goKTtcbiAgICB9XG4gIH0pO1xuICBvbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKGluaXRpYWxpemVkICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xuICAgICAgc2V0SGFzaCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IEhhc2hOYXZpZ2F0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuLi9zaGFyZWQvc3NyLXdpbmRvdy5lc20ubWpzJztcblxuLyogZXNsaW50IG5vLXVuZGVyc2NvcmUtZGFuZ2xlOiBcIm9mZlwiICovXG4vKiBlc2xpbnQgbm8tdXNlLWJlZm9yZS1kZWZpbmU6IFwib2ZmXCIgKi9cbmZ1bmN0aW9uIEF1dG9wbGF5KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uLFxuICAgIGVtaXQsXG4gICAgcGFyYW1zXG4gIH0gPSBfcmVmO1xuICBzd2lwZXIuYXV0b3BsYXkgPSB7XG4gICAgcnVubmluZzogZmFsc2UsXG4gICAgcGF1c2VkOiBmYWxzZSxcbiAgICB0aW1lTGVmdDogMFxuICB9O1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGF1dG9wbGF5OiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIGRlbGF5OiAzMDAwLFxuICAgICAgd2FpdEZvclRyYW5zaXRpb246IHRydWUsXG4gICAgICBkaXNhYmxlT25JbnRlcmFjdGlvbjogZmFsc2UsXG4gICAgICBzdG9wT25MYXN0U2xpZGU6IGZhbHNlLFxuICAgICAgcmV2ZXJzZURpcmVjdGlvbjogZmFsc2UsXG4gICAgICBwYXVzZU9uTW91c2VFbnRlcjogZmFsc2VcbiAgICB9XG4gIH0pO1xuICBsZXQgdGltZW91dDtcbiAgbGV0IHJhZjtcbiAgbGV0IGF1dG9wbGF5RGVsYXlUb3RhbCA9IHBhcmFtcyAmJiBwYXJhbXMuYXV0b3BsYXkgPyBwYXJhbXMuYXV0b3BsYXkuZGVsYXkgOiAzMDAwO1xuICBsZXQgYXV0b3BsYXlEZWxheUN1cnJlbnQgPSBwYXJhbXMgJiYgcGFyYW1zLmF1dG9wbGF5ID8gcGFyYW1zLmF1dG9wbGF5LmRlbGF5IDogMzAwMDtcbiAgbGV0IGF1dG9wbGF5VGltZUxlZnQ7XG4gIGxldCBhdXRvcGxheVN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBsZXQgd2FzUGF1c2VkO1xuICBsZXQgaXNUb3VjaGVkO1xuICBsZXQgcGF1c2VkQnlUb3VjaDtcbiAgbGV0IHRvdWNoU3RhcnRUaW1lb3V0O1xuICBsZXQgc2xpZGVDaGFuZ2VkO1xuICBsZXQgcGF1c2VkQnlJbnRlcmFjdGlvbjtcbiAgbGV0IHBhdXNlZEJ5UG9pbnRlckVudGVyO1xuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoZSkge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci53cmFwcGVyRWwpIHJldHVybjtcbiAgICBpZiAoZS50YXJnZXQgIT09IHN3aXBlci53cmFwcGVyRWwpIHJldHVybjtcbiAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBvblRyYW5zaXRpb25FbmQpO1xuICAgIGlmIChwYXVzZWRCeVBvaW50ZXJFbnRlciB8fCBlLmRldGFpbCAmJiBlLmRldGFpbC5ieVN3aXBlclRvdWNoTW92ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXN1bWUoKTtcbiAgfVxuICBjb25zdCBjYWxjVGltZUxlZnQgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgaWYgKHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHtcbiAgICAgIHdhc1BhdXNlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh3YXNQYXVzZWQpIHtcbiAgICAgIGF1dG9wbGF5RGVsYXlDdXJyZW50ID0gYXV0b3BsYXlUaW1lTGVmdDtcbiAgICAgIHdhc1BhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0aW1lTGVmdCA9IHN3aXBlci5hdXRvcGxheS5wYXVzZWQgPyBhdXRvcGxheVRpbWVMZWZ0IDogYXV0b3BsYXlTdGFydFRpbWUgKyBhdXRvcGxheURlbGF5Q3VycmVudCAtIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHN3aXBlci5hdXRvcGxheS50aW1lTGVmdCA9IHRpbWVMZWZ0O1xuICAgIGVtaXQoJ2F1dG9wbGF5VGltZUxlZnQnLCB0aW1lTGVmdCwgdGltZUxlZnQgLyBhdXRvcGxheURlbGF5VG90YWwpO1xuICAgIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBjYWxjVGltZUxlZnQoKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgZ2V0U2xpZGVEZWxheSA9ICgpID0+IHtcbiAgICBsZXQgYWN0aXZlU2xpZGVFbDtcbiAgICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICAgIGFjdGl2ZVNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzd2lwZXItc2xpZGUtYWN0aXZlJykpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3RpdmVTbGlkZUVsID0gc3dpcGVyLnNsaWRlc1tzd2lwZXIuYWN0aXZlSW5kZXhdO1xuICAgIH1cbiAgICBpZiAoIWFjdGl2ZVNsaWRlRWwpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3VycmVudFNsaWRlRGVsYXkgPSBwYXJzZUludChhY3RpdmVTbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItYXV0b3BsYXknKSwgMTApO1xuICAgIHJldHVybiBjdXJyZW50U2xpZGVEZWxheTtcbiAgfTtcbiAgY29uc3QgcnVuID0gZGVsYXlGb3JjZSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmKTtcbiAgICBjYWxjVGltZUxlZnQoKTtcbiAgICBsZXQgZGVsYXkgPSB0eXBlb2YgZGVsYXlGb3JjZSA9PT0gJ3VuZGVmaW5lZCcgPyBzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRlbGF5IDogZGVsYXlGb3JjZTtcbiAgICBhdXRvcGxheURlbGF5VG90YWwgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRlbGF5O1xuICAgIGF1dG9wbGF5RGVsYXlDdXJyZW50ID0gc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVEZWxheSA9IGdldFNsaWRlRGVsYXkoKTtcbiAgICBpZiAoIU51bWJlci5pc05hTihjdXJyZW50U2xpZGVEZWxheSkgJiYgY3VycmVudFNsaWRlRGVsYXkgPiAwICYmIHR5cGVvZiBkZWxheUZvcmNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgZGVsYXkgPSBjdXJyZW50U2xpZGVEZWxheTtcbiAgICAgIGF1dG9wbGF5RGVsYXlUb3RhbCA9IGN1cnJlbnRTbGlkZURlbGF5O1xuICAgICAgYXV0b3BsYXlEZWxheUN1cnJlbnQgPSBjdXJyZW50U2xpZGVEZWxheTtcbiAgICB9XG4gICAgYXV0b3BsYXlUaW1lTGVmdCA9IGRlbGF5O1xuICAgIGNvbnN0IHNwZWVkID0gc3dpcGVyLnBhcmFtcy5zcGVlZDtcbiAgICBjb25zdCBwcm9jZWVkID0gKCkgPT4ge1xuICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkucmV2ZXJzZURpcmVjdGlvbikge1xuICAgICAgICBpZiAoIXN3aXBlci5pc0JlZ2lubmluZyB8fCBzd2lwZXIucGFyYW1zLmxvb3AgfHwgc3dpcGVyLnBhcmFtcy5yZXdpbmQpIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVQcmV2KHNwZWVkLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xuICAgICAgICB9IGVsc2UgaWYgKCFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnN0b3BPbkxhc3RTbGlkZSkge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMSwgc3BlZWQsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghc3dpcGVyLmlzRW5kIHx8IHN3aXBlci5wYXJhbXMubG9vcCB8fCBzd2lwZXIucGFyYW1zLnJld2luZCkge1xuICAgICAgICAgIHN3aXBlci5zbGlkZU5leHQoc3BlZWQsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuc3RvcE9uTGFzdFNsaWRlKSB7XG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oMCwgc3BlZWQsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgICAgYXV0b3BsYXlTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBydW4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHByb2NlZWQoKTtcbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgcHJvY2VlZCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcmV0dXJuIGRlbGF5O1xuICB9O1xuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBhdXRvcGxheVN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nID0gdHJ1ZTtcbiAgICBydW4oKTtcbiAgICBlbWl0KCdhdXRvcGxheVN0YXJ0Jyk7XG4gIH07XG4gIGNvbnN0IHN0b3AgPSAoKSA9PiB7XG4gICAgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmKTtcbiAgICBlbWl0KCdhdXRvcGxheVN0b3AnKTtcbiAgfTtcbiAgY29uc3QgcGF1c2UgPSAoaW50ZXJuYWwsIHJlc2V0KSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGlmICghaW50ZXJuYWwpIHtcbiAgICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBwcm9jZWVkID0gKCkgPT4ge1xuICAgICAgZW1pdCgnYXV0b3BsYXlQYXVzZScpO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkud2FpdEZvclRyYW5zaXRpb24pIHtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VtZSgpO1xuICAgICAgfVxuICAgIH07XG4gICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA9IHRydWU7XG4gICAgaWYgKHJlc2V0KSB7XG4gICAgICBpZiAoc2xpZGVDaGFuZ2VkKSB7XG4gICAgICAgIGF1dG9wbGF5VGltZUxlZnQgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRlbGF5O1xuICAgICAgfVxuICAgICAgc2xpZGVDaGFuZ2VkID0gZmFsc2U7XG4gICAgICBwcm9jZWVkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRlbGF5ID0gYXV0b3BsYXlUaW1lTGVmdCB8fCBzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRlbGF5O1xuICAgIGF1dG9wbGF5VGltZUxlZnQgPSBkZWxheSAtIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGF1dG9wbGF5U3RhcnRUaW1lKTtcbiAgICBpZiAoc3dpcGVyLmlzRW5kICYmIGF1dG9wbGF5VGltZUxlZnQgPCAwICYmICFzd2lwZXIucGFyYW1zLmxvb3ApIHJldHVybjtcbiAgICBpZiAoYXV0b3BsYXlUaW1lTGVmdCA8IDApIGF1dG9wbGF5VGltZUxlZnQgPSAwO1xuICAgIHByb2NlZWQoKTtcbiAgfTtcbiAgY29uc3QgcmVzdW1lID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuaXNFbmQgJiYgYXV0b3BsYXlUaW1lTGVmdCA8IDAgJiYgIXN3aXBlci5wYXJhbXMubG9vcCB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuO1xuICAgIGF1dG9wbGF5U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHBhdXNlZEJ5SW50ZXJhY3Rpb24pIHtcbiAgICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSBmYWxzZTtcbiAgICAgIHJ1bihhdXRvcGxheVRpbWVMZWZ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcnVuKCk7XG4gICAgfVxuICAgIHN3aXBlci5hdXRvcGxheS5wYXVzZWQgPSBmYWxzZTtcbiAgICBlbWl0KCdhdXRvcGxheVJlc3VtZScpO1xuICB9O1xuICBjb25zdCBvblZpc2liaWxpdHlDaGFuZ2UgPSAoKSA9PiB7XG4gICAgaWYgKHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSByZXR1cm47XG4gICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICAgIHBhdXNlKHRydWUpO1xuICAgIH1cbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgIHJlc3VtZSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Qb2ludGVyRW50ZXIgPSBlID0+IHtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSAhPT0gJ21vdXNlJykgcmV0dXJuO1xuICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIHBhdXNlZEJ5UG9pbnRlckVudGVyID0gdHJ1ZTtcbiAgICBpZiAoc3dpcGVyLmFuaW1hdGluZyB8fCBzd2lwZXIuYXV0b3BsYXkucGF1c2VkKSByZXR1cm47XG4gICAgcGF1c2UodHJ1ZSk7XG4gIH07XG4gIGNvbnN0IG9uUG9pbnRlckxlYXZlID0gZSA9PiB7XG4gICAgaWYgKGUucG9pbnRlclR5cGUgIT09ICdtb3VzZScpIHJldHVybjtcbiAgICBwYXVzZWRCeVBvaW50ZXJFbnRlciA9IGZhbHNlO1xuICAgIGlmIChzd2lwZXIuYXV0b3BsYXkucGF1c2VkKSB7XG4gICAgICByZXN1bWUoKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGF0dGFjaE1vdXNlRXZlbnRzID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnBhdXNlT25Nb3VzZUVudGVyKSB7XG4gICAgICBzd2lwZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmVudGVyJywgb25Qb2ludGVyRW50ZXIpO1xuICAgICAgc3dpcGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsZWF2ZScsIG9uUG9pbnRlckxlYXZlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGRldGFjaE1vdXNlRXZlbnRzID0gKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZWwgJiYgdHlwZW9mIHN3aXBlci5lbCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHN3aXBlci5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZW50ZXInLCBvblBvaW50ZXJFbnRlcik7XG4gICAgICBzd2lwZXIuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgb25Qb2ludGVyTGVhdmUpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYXR0YWNoRG9jdW1lbnRFdmVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBvblZpc2liaWxpdHlDaGFuZ2UpO1xuICB9O1xuICBjb25zdCBkZXRhY2hEb2N1bWVudEV2ZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eUNoYW5nZSk7XG4gIH07XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmVuYWJsZWQpIHtcbiAgICAgIGF0dGFjaE1vdXNlRXZlbnRzKCk7XG4gICAgICBhdHRhY2hEb2N1bWVudEV2ZW50cygpO1xuICAgICAgc3RhcnQoKTtcbiAgICB9XG4gIH0pO1xuICBvbignZGVzdHJveScsICgpID0+IHtcbiAgICBkZXRhY2hNb3VzZUV2ZW50cygpO1xuICAgIGRldGFjaERvY3VtZW50RXZlbnRzKCk7XG4gICAgaWYgKHN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSB7XG4gICAgICBzdG9wKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ19mcmVlTW9kZVN0YXRpY1JlbGVhc2UnLCAoKSA9PiB7XG4gICAgaWYgKHBhdXNlZEJ5VG91Y2ggfHwgcGF1c2VkQnlJbnRlcmFjdGlvbikge1xuICAgICAgcmVzdW1lKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ19mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJywgKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kaXNhYmxlT25JbnRlcmFjdGlvbikge1xuICAgICAgcGF1c2UodHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9XG4gIH0pO1xuICBvbignYmVmb3JlVHJhbnNpdGlvblN0YXJ0JywgKF9zLCBzcGVlZCwgaW50ZXJuYWwpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBpZiAoaW50ZXJuYWwgfHwgIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHBhdXNlKHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdG9wKCk7XG4gICAgfVxuICB9KTtcbiAgb24oJ3NsaWRlckZpcnN0TW92ZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kaXNhYmxlT25JbnRlcmFjdGlvbikge1xuICAgICAgc3RvcCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpc1RvdWNoZWQgPSB0cnVlO1xuICAgIHBhdXNlZEJ5VG91Y2ggPSBmYWxzZTtcbiAgICBwYXVzZWRCeUludGVyYWN0aW9uID0gZmFsc2U7XG4gICAgdG91Y2hTdGFydFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHBhdXNlZEJ5SW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgICAgcGF1c2VkQnlUb3VjaCA9IHRydWU7XG4gICAgICBwYXVzZSh0cnVlKTtcbiAgICB9LCAyMDApO1xuICB9KTtcbiAgb24oJ3RvdWNoRW5kJywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuYXV0b3BsYXkucnVubmluZyB8fCAhaXNUb3VjaGVkKSByZXR1cm47XG4gICAgY2xlYXJUaW1lb3V0KHRvdWNoU3RhcnRUaW1lb3V0KTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHBhdXNlZEJ5VG91Y2ggPSBmYWxzZTtcbiAgICAgIGlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGF1c2VkQnlUb3VjaCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHJlc3VtZSgpO1xuICAgIHBhdXNlZEJ5VG91Y2ggPSBmYWxzZTtcbiAgICBpc1RvdWNoZWQgPSBmYWxzZTtcbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcbiAgICBzbGlkZUNoYW5nZWQgPSB0cnVlO1xuICB9KTtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIuYXV0b3BsYXksIHtcbiAgICBzdGFydCxcbiAgICBzdG9wLFxuICAgIHBhdXNlLFxuICAgIHJlc3VtZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgQXV0b3BsYXkgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXREb2N1bWVudCB9IGZyb20gJy4uL3NoYXJlZC9zc3Itd2luZG93LmVzbS5tanMnO1xuaW1wb3J0IHsgbCBhcyBpc09iamVjdCwgZSBhcyBlbGVtZW50Q2hpbGRyZW4gfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gVGh1bWIoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgdGh1bWJzOiB7XG4gICAgICBzd2lwZXI6IG51bGwsXG4gICAgICBtdWx0aXBsZUFjdGl2ZVRodW1iczogdHJ1ZSxcbiAgICAgIGF1dG9TY3JvbGxPZmZzZXQ6IDAsXG4gICAgICBzbGlkZVRodW1iQWN0aXZlQ2xhc3M6ICdzd2lwZXItc2xpZGUtdGh1bWItYWN0aXZlJyxcbiAgICAgIHRodW1ic0NvbnRhaW5lckNsYXNzOiAnc3dpcGVyLXRodW1icydcbiAgICB9XG4gIH0pO1xuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgbGV0IHN3aXBlckNyZWF0ZWQgPSBmYWxzZTtcbiAgc3dpcGVyLnRodW1icyA9IHtcbiAgICBzd2lwZXI6IG51bGxcbiAgfTtcbiAgZnVuY3Rpb24gb25UaHVtYkNsaWNrKCkge1xuICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xuICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBjb25zdCBjbGlja2VkSW5kZXggPSB0aHVtYnNTd2lwZXIuY2xpY2tlZEluZGV4O1xuICAgIGNvbnN0IGNsaWNrZWRTbGlkZSA9IHRodW1ic1N3aXBlci5jbGlja2VkU2xpZGU7XG4gICAgaWYgKGNsaWNrZWRTbGlkZSAmJiBjbGlja2VkU2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMudGh1bWJzLnNsaWRlVGh1bWJBY3RpdmVDbGFzcykpIHJldHVybjtcbiAgICBpZiAodHlwZW9mIGNsaWNrZWRJbmRleCA9PT0gJ3VuZGVmaW5lZCcgfHwgY2xpY2tlZEluZGV4ID09PSBudWxsKSByZXR1cm47XG4gICAgbGV0IHNsaWRlVG9JbmRleDtcbiAgICBpZiAodGh1bWJzU3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgICBzbGlkZVRvSW5kZXggPSBwYXJzZUludCh0aHVtYnNTd2lwZXIuY2xpY2tlZFNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZVRvSW5kZXggPSBjbGlja2VkSW5kZXg7XG4gICAgfVxuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvTG9vcChzbGlkZVRvSW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHRodW1iczogdGh1bWJzUGFyYW1zXG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgaWYgKGluaXRpYWxpemVkKSByZXR1cm4gZmFsc2U7XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIGNvbnN0IFN3aXBlckNsYXNzID0gc3dpcGVyLmNvbnN0cnVjdG9yO1xuICAgIGlmICh0aHVtYnNQYXJhbXMuc3dpcGVyIGluc3RhbmNlb2YgU3dpcGVyQ2xhc3MpIHtcbiAgICAgIHN3aXBlci50aHVtYnMuc3dpcGVyID0gdGh1bWJzUGFyYW1zLnN3aXBlcjtcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnRodW1icy5zd2lwZXIub3JpZ2luYWxQYXJhbXMsIHtcbiAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgc2xpZGVUb0NsaWNrZWRTbGlkZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIudGh1bWJzLnN3aXBlci5wYXJhbXMsIHtcbiAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgc2xpZGVUb0NsaWNrZWRTbGlkZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLnRodW1icy5zd2lwZXIudXBkYXRlKCk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh0aHVtYnNQYXJhbXMuc3dpcGVyKSkge1xuICAgICAgY29uc3QgdGh1bWJzU3dpcGVyUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGh1bWJzUGFyYW1zLnN3aXBlcik7XG4gICAgICBPYmplY3QuYXNzaWduKHRodW1ic1N3aXBlclBhcmFtcywge1xuICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBzd2lwZXIudGh1bWJzLnN3aXBlciA9IG5ldyBTd2lwZXJDbGFzcyh0aHVtYnNTd2lwZXJQYXJhbXMpO1xuICAgICAgc3dpcGVyQ3JlYXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHN3aXBlci50aHVtYnMuc3dpcGVyLmVsLmNsYXNzTGlzdC5hZGQoc3dpcGVyLnBhcmFtcy50aHVtYnMudGh1bWJzQ29udGFpbmVyQ2xhc3MpO1xuICAgIHN3aXBlci50aHVtYnMuc3dpcGVyLm9uKCd0YXAnLCBvblRodW1iQ2xpY2spO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZShpbml0aWFsKSB7XG4gICAgY29uc3QgdGh1bWJzU3dpcGVyID0gc3dpcGVyLnRodW1icy5zd2lwZXI7XG4gICAgaWYgKCF0aHVtYnNTd2lwZXIgfHwgdGh1bWJzU3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIGNvbnN0IHNsaWRlc1BlclZpZXcgPSB0aHVtYnNTd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyA/IHRodW1ic1N3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygpIDogdGh1bWJzU3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuXG4gICAgLy8gQWN0aXZhdGUgdGh1bWJzXG4gICAgbGV0IHRodW1ic1RvQWN0aXZhdGUgPSAxO1xuICAgIGNvbnN0IHRodW1iQWN0aXZlQ2xhc3MgPSBzd2lwZXIucGFyYW1zLnRodW1icy5zbGlkZVRodW1iQWN0aXZlQ2xhc3M7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEgJiYgIXN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIHRodW1ic1RvQWN0aXZhdGUgPSBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLnBhcmFtcy50aHVtYnMubXVsdGlwbGVBY3RpdmVUaHVtYnMpIHtcbiAgICAgIHRodW1ic1RvQWN0aXZhdGUgPSAxO1xuICAgIH1cbiAgICB0aHVtYnNUb0FjdGl2YXRlID0gTWF0aC5mbG9vcih0aHVtYnNUb0FjdGl2YXRlKTtcbiAgICB0aHVtYnNTd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUodGh1bWJBY3RpdmVDbGFzcykpO1xuICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3AgfHwgdGh1bWJzU3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHRodW1ic1N3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRodW1ic1RvQWN0aXZhdGU7IGkgKz0gMSkge1xuICAgICAgICBlbGVtZW50Q2hpbGRyZW4odGh1bWJzU3dpcGVyLnNsaWRlc0VsLCBgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzd2lwZXIucmVhbEluZGV4ICsgaX1cIl1gKS5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgICAgICAgIHNsaWRlRWwuY2xhc3NMaXN0LmFkZCh0aHVtYkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGh1bWJzVG9BY3RpdmF0ZTsgaSArPSAxKSB7XG4gICAgICAgIGlmICh0aHVtYnNTd2lwZXIuc2xpZGVzW3N3aXBlci5yZWFsSW5kZXggKyBpXSkge1xuICAgICAgICAgIHRodW1ic1N3aXBlci5zbGlkZXNbc3dpcGVyLnJlYWxJbmRleCArIGldLmNsYXNzTGlzdC5hZGQodGh1bWJBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYXV0b1Njcm9sbE9mZnNldCA9IHN3aXBlci5wYXJhbXMudGh1bWJzLmF1dG9TY3JvbGxPZmZzZXQ7XG4gICAgY29uc3QgdXNlT2Zmc2V0ID0gYXV0b1Njcm9sbE9mZnNldCAmJiAhdGh1bWJzU3dpcGVyLnBhcmFtcy5sb29wO1xuICAgIGlmIChzd2lwZXIucmVhbEluZGV4ICE9PSB0aHVtYnNTd2lwZXIucmVhbEluZGV4IHx8IHVzZU9mZnNldCkge1xuICAgICAgY29uc3QgY3VycmVudFRodW1ic0luZGV4ID0gdGh1bWJzU3dpcGVyLmFjdGl2ZUluZGV4O1xuICAgICAgbGV0IG5ld1RodW1ic0luZGV4O1xuICAgICAgbGV0IGRpcmVjdGlvbjtcbiAgICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgY29uc3QgbmV3VGh1bWJzU2xpZGUgPSB0aHVtYnNTd2lwZXIuc2xpZGVzLmZpbHRlcihzbGlkZUVsID0+IHNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpID09PSBgJHtzd2lwZXIucmVhbEluZGV4fWApWzBdO1xuICAgICAgICBuZXdUaHVtYnNJbmRleCA9IHRodW1ic1N3aXBlci5zbGlkZXMuaW5kZXhPZihuZXdUaHVtYnNTbGlkZSk7XG4gICAgICAgIGRpcmVjdGlvbiA9IHN3aXBlci5hY3RpdmVJbmRleCA+IHN3aXBlci5wcmV2aW91c0luZGV4ID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VGh1bWJzSW5kZXggPSBzd2lwZXIucmVhbEluZGV4O1xuICAgICAgICBkaXJlY3Rpb24gPSBuZXdUaHVtYnNJbmRleCA+IHN3aXBlci5wcmV2aW91c0luZGV4ID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgfVxuICAgICAgaWYgKHVzZU9mZnNldCkge1xuICAgICAgICBuZXdUaHVtYnNJbmRleCArPSBkaXJlY3Rpb24gPT09ICduZXh0JyA/IGF1dG9TY3JvbGxPZmZzZXQgOiAtMSAqIGF1dG9TY3JvbGxPZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAodGh1bWJzU3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzICYmIHRodW1ic1N3aXBlci52aXNpYmxlU2xpZGVzSW5kZXhlcy5pbmRleE9mKG5ld1RodW1ic0luZGV4KSA8IDApIHtcbiAgICAgICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgICBpZiAobmV3VGh1bWJzSW5kZXggPiBjdXJyZW50VGh1bWJzSW5kZXgpIHtcbiAgICAgICAgICAgIG5ld1RodW1ic0luZGV4ID0gbmV3VGh1bWJzSW5kZXggLSBNYXRoLmZsb29yKHNsaWRlc1BlclZpZXcgLyAyKSArIDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1RodW1ic0luZGV4ID0gbmV3VGh1bWJzSW5kZXggKyBNYXRoLmZsb29yKHNsaWRlc1BlclZpZXcgLyAyKSAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5ld1RodW1ic0luZGV4ID4gY3VycmVudFRodW1ic0luZGV4ICYmIHRodW1ic1N3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDEpIDtcbiAgICAgICAgdGh1bWJzU3dpcGVyLnNsaWRlVG8obmV3VGh1bWJzSW5kZXgsIGluaXRpYWwgPyAwIDogdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgdGh1bWJzXG4gICAgfSA9IHN3aXBlci5wYXJhbXM7XG4gICAgaWYgKCF0aHVtYnMgfHwgIXRodW1icy5zd2lwZXIpIHJldHVybjtcbiAgICBpZiAodHlwZW9mIHRodW1icy5zd2lwZXIgPT09ICdzdHJpbmcnIHx8IHRodW1icy5zd2lwZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICAgICAgY29uc3QgZ2V0VGh1bWJzRWxlbWVudEFuZEluaXQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRodW1ic0VsZW1lbnQgPSB0eXBlb2YgdGh1bWJzLnN3aXBlciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRodW1icy5zd2lwZXIpIDogdGh1bWJzLnN3aXBlcjtcbiAgICAgICAgaWYgKHRodW1ic0VsZW1lbnQgJiYgdGh1bWJzRWxlbWVudC5zd2lwZXIpIHtcbiAgICAgICAgICB0aHVtYnMuc3dpcGVyID0gdGh1bWJzRWxlbWVudC5zd2lwZXI7XG4gICAgICAgICAgaW5pdCgpO1xuICAgICAgICAgIHVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aHVtYnNFbGVtZW50KSB7XG4gICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYCR7c3dpcGVyLnBhcmFtcy5ldmVudHNQcmVmaXh9aW5pdGA7XG4gICAgICAgICAgY29uc3Qgb25UaHVtYnNTd2lwZXIgPSBlID0+IHtcbiAgICAgICAgICAgIHRodW1icy5zd2lwZXIgPSBlLmRldGFpbFswXTtcbiAgICAgICAgICAgIHRodW1ic0VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9uVGh1bWJzU3dpcGVyKTtcbiAgICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgICAgIHVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIHRodW1icy5zd2lwZXIudXBkYXRlKCk7XG4gICAgICAgICAgICBzd2lwZXIudXBkYXRlKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aHVtYnNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvblRodW1ic1N3aXBlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRodW1ic0VsZW1lbnQ7XG4gICAgICB9O1xuICAgICAgY29uc3Qgd2F0Y2hGb3JUaHVtYnNUb0FwcGVhciA9ICgpID0+IHtcbiAgICAgICAgaWYgKHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgY29uc3QgdGh1bWJzRWxlbWVudCA9IGdldFRodW1ic0VsZW1lbnRBbmRJbml0KCk7XG4gICAgICAgIGlmICghdGh1bWJzRWxlbWVudCkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh3YXRjaEZvclRodW1ic1RvQXBwZWFyKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh3YXRjaEZvclRodW1ic1RvQXBwZWFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdCgpO1xuICAgICAgdXBkYXRlKHRydWUpO1xuICAgIH1cbiAgfSk7XG4gIG9uKCdzbGlkZUNoYW5nZSB1cGRhdGUgcmVzaXplIG9ic2VydmVyVXBkYXRlJywgKCkgPT4ge1xuICAgIHVwZGF0ZSgpO1xuICB9KTtcbiAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uKSA9PiB7XG4gICAgY29uc3QgdGh1bWJzU3dpcGVyID0gc3dpcGVyLnRodW1icy5zd2lwZXI7XG4gICAgaWYgKCF0aHVtYnNTd2lwZXIgfHwgdGh1bWJzU3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIHRodW1ic1N3aXBlci5zZXRUcmFuc2l0aW9uKGR1cmF0aW9uKTtcbiAgfSk7XG4gIG9uKCdiZWZvcmVEZXN0cm95JywgKCkgPT4ge1xuICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xuICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBpZiAoc3dpcGVyQ3JlYXRlZCkge1xuICAgICAgdGh1bWJzU3dpcGVyLmRlc3Ryb3koKTtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuYXNzaWduKHN3aXBlci50aHVtYnMsIHtcbiAgICBpbml0LFxuICAgIHVwZGF0ZVxuICB9KTtcbn1cblxuZXhwb3J0IHsgVGh1bWIgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZCBhcyBub3csIGsgYXMgZWxlbWVudFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gZnJlZU1vZGUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgZW1pdCxcbiAgICBvbmNlXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGZyZWVNb2RlOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIG1vbWVudHVtOiB0cnVlLFxuICAgICAgbW9tZW50dW1SYXRpbzogMSxcbiAgICAgIG1vbWVudHVtQm91bmNlOiB0cnVlLFxuICAgICAgbW9tZW50dW1Cb3VuY2VSYXRpbzogMSxcbiAgICAgIG1vbWVudHVtVmVsb2NpdHlSYXRpbzogMSxcbiAgICAgIHN0aWNreTogZmFsc2UsXG4gICAgICBtaW5pbXVtVmVsb2NpdHk6IDAuMDJcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBvblRvdWNoU3RhcnQoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHN3aXBlci5nZXRUcmFuc2xhdGUoKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSk7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA9IDA7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hFbmQoe1xuICAgICAgY3VycmVudFBvczogc3dpcGVyLnJ0bCA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKCkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICB0b3VjaEV2ZW50c0RhdGE6IGRhdGEsXG4gICAgICB0b3VjaGVzXG4gICAgfSA9IHN3aXBlcjtcbiAgICAvLyBWZWxvY2l0eVxuICAgIGlmIChkYXRhLnZlbG9jaXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBkYXRhLnZlbG9jaXRpZXMucHVzaCh7XG4gICAgICAgIHBvc2l0aW9uOiB0b3VjaGVzW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdzdGFydFgnIDogJ3N0YXJ0WSddLFxuICAgICAgICB0aW1lOiBkYXRhLnRvdWNoU3RhcnRUaW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgZGF0YS52ZWxvY2l0aWVzLnB1c2goe1xuICAgICAgcG9zaXRpb246IHRvdWNoZXNbc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2N1cnJlbnRYJyA6ICdjdXJyZW50WSddLFxuICAgICAgdGltZTogbm93KClcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblRvdWNoRW5kKF9yZWYyKSB7XG4gICAgbGV0IHtcbiAgICAgIGN1cnJlbnRQb3NcbiAgICB9ID0gX3JlZjI7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcmFtcyxcbiAgICAgIHdyYXBwZXJFbCxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgICAgc25hcEdyaWQsXG4gICAgICB0b3VjaEV2ZW50c0RhdGE6IGRhdGFcbiAgICB9ID0gc3dpcGVyO1xuICAgIC8vIFRpbWUgZGlmZlxuICAgIGNvbnN0IHRvdWNoRW5kVGltZSA9IG5vdygpO1xuICAgIGNvbnN0IHRpbWVEaWZmID0gdG91Y2hFbmRUaW1lIC0gZGF0YS50b3VjaFN0YXJ0VGltZTtcbiAgICBpZiAoY3VycmVudFBvcyA8IC1zd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjdXJyZW50UG9zID4gLXN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgaWYgKHN3aXBlci5zbGlkZXMubGVuZ3RoIDwgc25hcEdyaWQubGVuZ3RoKSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHNuYXBHcmlkLmxlbmd0aCAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bSkge1xuICAgICAgaWYgKGRhdGEudmVsb2NpdGllcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGxhc3RNb3ZlRXZlbnQgPSBkYXRhLnZlbG9jaXRpZXMucG9wKCk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5RXZlbnQgPSBkYXRhLnZlbG9jaXRpZXMucG9wKCk7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gbGFzdE1vdmVFdmVudC5wb3NpdGlvbiAtIHZlbG9jaXR5RXZlbnQucG9zaXRpb247XG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXN0TW92ZUV2ZW50LnRpbWUgLSB2ZWxvY2l0eUV2ZW50LnRpbWU7XG4gICAgICAgIHN3aXBlci52ZWxvY2l0eSA9IGRpc3RhbmNlIC8gdGltZTtcbiAgICAgICAgc3dpcGVyLnZlbG9jaXR5IC89IDI7XG4gICAgICAgIGlmIChNYXRoLmFicyhzd2lwZXIudmVsb2NpdHkpIDwgcGFyYW1zLmZyZWVNb2RlLm1pbmltdW1WZWxvY2l0eSkge1xuICAgICAgICAgIHN3aXBlci52ZWxvY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcyBpbXBsaWVzIHRoYXQgdGhlIHVzZXIgc3RvcHBlZCBtb3ZpbmcgYSBmaW5nZXIgdGhlbiByZWxlYXNlZC5cbiAgICAgICAgLy8gVGhlcmUgd291bGQgYmUgbm8gZXZlbnRzIHdpdGggZGlzdGFuY2UgemVybywgc28gdGhlIGxhc3QgZXZlbnQgaXMgc3RhbGUuXG4gICAgICAgIGlmICh0aW1lID4gMTUwIHx8IG5vdygpIC0gbGFzdE1vdmVFdmVudC50aW1lID4gMzAwKSB7XG4gICAgICAgICAgc3dpcGVyLnZlbG9jaXR5ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpcGVyLnZlbG9jaXR5ID0gMDtcbiAgICAgIH1cbiAgICAgIHN3aXBlci52ZWxvY2l0eSAqPSBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1WZWxvY2l0eVJhdGlvO1xuICAgICAgZGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA9IDA7XG4gICAgICBsZXQgbW9tZW50dW1EdXJhdGlvbiA9IDEwMDAgKiBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1SYXRpbztcbiAgICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2UgPSBzd2lwZXIudmVsb2NpdHkgKiBtb21lbnR1bUR1cmF0aW9uO1xuICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gc3dpcGVyLnRyYW5zbGF0ZSArIG1vbWVudHVtRGlzdGFuY2U7XG4gICAgICBpZiAocnRsKSBuZXdQb3NpdGlvbiA9IC1uZXdQb3NpdGlvbjtcbiAgICAgIGxldCBkb0JvdW5jZSA9IGZhbHNlO1xuICAgICAgbGV0IGFmdGVyQm91bmNlUG9zaXRpb247XG4gICAgICBjb25zdCBib3VuY2VBbW91bnQgPSBNYXRoLmFicyhzd2lwZXIudmVsb2NpdHkpICogMjAgKiBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2VSYXRpbztcbiAgICAgIGxldCBuZWVkc0xvb3BGaXg7XG4gICAgICBpZiAobmV3UG9zaXRpb24gPCBzd2lwZXIubWF4VHJhbnNsYXRlKCkpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bUJvdW5jZSkge1xuICAgICAgICAgIGlmIChuZXdQb3NpdGlvbiArIHN3aXBlci5tYXhUcmFuc2xhdGUoKSA8IC1ib3VuY2VBbW91bnQpIHtcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gYm91bmNlQW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckJvdW5jZVBvc2l0aW9uID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICAgICAgICAgIGRvQm91bmNlID0gdHJ1ZTtcbiAgICAgICAgICBkYXRhLmFsbG93TW9tZW50dW1Cb3VuY2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMubG9vcCAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXMpIG5lZWRzTG9vcEZpeCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG5ld1Bvc2l0aW9uID4gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSB7XG4gICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UpIHtcbiAgICAgICAgICBpZiAobmV3UG9zaXRpb24gLSBzd2lwZXIubWluVHJhbnNsYXRlKCkgPiBib3VuY2VBbW91bnQpIHtcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpICsgYm91bmNlQW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckJvdW5jZVBvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgICAgIGRvQm91bmNlID0gdHJ1ZTtcbiAgICAgICAgICBkYXRhLmFsbG93TW9tZW50dW1Cb3VuY2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMubG9vcCAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXMpIG5lZWRzTG9vcEZpeCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtcy5mcmVlTW9kZS5zdGlja3kpIHtcbiAgICAgICAgbGV0IG5leHRTbGlkZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbmFwR3JpZC5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgIGlmIChzbmFwR3JpZFtqXSA+IC1uZXdQb3NpdGlvbikge1xuICAgICAgICAgICAgbmV4dFNsaWRlID0gajtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMoc25hcEdyaWRbbmV4dFNsaWRlXSAtIG5ld1Bvc2l0aW9uKSA8IE1hdGguYWJzKHNuYXBHcmlkW25leHRTbGlkZSAtIDFdIC0gbmV3UG9zaXRpb24pIHx8IHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgICAgbmV3UG9zaXRpb24gPSBzbmFwR3JpZFtuZXh0U2xpZGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc25hcEdyaWRbbmV4dFNsaWRlIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgbmV3UG9zaXRpb24gPSAtbmV3UG9zaXRpb247XG4gICAgICB9XG4gICAgICBpZiAobmVlZHNMb29wRml4KSB7XG4gICAgICAgIG9uY2UoJ3RyYW5zaXRpb25FbmQnLCAoKSA9PiB7XG4gICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBGaXggZHVyYXRpb25cbiAgICAgIGlmIChzd2lwZXIudmVsb2NpdHkgIT09IDApIHtcbiAgICAgICAgaWYgKHJ0bCkge1xuICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBNYXRoLmFicygoLW5ld1Bvc2l0aW9uIC0gc3dpcGVyLnRyYW5zbGF0ZSkgLyBzd2lwZXIudmVsb2NpdHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBNYXRoLmFicygobmV3UG9zaXRpb24gLSBzd2lwZXIudHJhbnNsYXRlKSAvIHN3aXBlci52ZWxvY2l0eSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5mcmVlTW9kZS5zdGlja3kpIHtcbiAgICAgICAgICAvLyBJZiBmcmVlTW9kZS5zdGlja3kgaXMgYWN0aXZlIGFuZCB0aGUgdXNlciBlbmRzIGEgc3dpcGUgd2l0aCBhIHNsb3ctdmVsb2NpdHlcbiAgICAgICAgICAvLyBldmVudCwgdGhlbiBkdXJhdGlvbnMgY2FuIGJlIDIwKyBzZWNvbmRzIHRvIHNsaWRlIG9uZSAob3IgemVybyEpIHNsaWRlcy5cbiAgICAgICAgICAvLyBJdCdzIGVhc3kgdG8gc2VlIHRoaXMgd2hlbiBzaW11bGF0aW5nIHRvdWNoIHdpdGggbW91c2UgZXZlbnRzLiBUbyBmaXggdGhpcyxcbiAgICAgICAgICAvLyBsaW1pdCBzaW5nbGUtc2xpZGUgc3dpcGVzIHRvIHRoZSBkZWZhdWx0IHNsaWRlIGR1cmF0aW9uLiBUaGlzIGFsc28gaGFzIHRoZVxuICAgICAgICAgIC8vIG5pY2Ugc2lkZSBlZmZlY3Qgb2YgbWF0Y2hpbmcgc2xpZGUgc3BlZWQgaWYgdGhlIHVzZXIgc3RvcHBlZCBtb3ZpbmcgYmVmb3JlXG4gICAgICAgICAgLy8gbGlmdGluZyBmaW5nZXIgb3IgbW91c2UgdnMuIG1vdmluZyBzbG93bHkgYmVmb3JlIGxpZnRpbmcgdGhlIGZpbmdlci9tb3VzZS5cbiAgICAgICAgICAvLyBGb3IgZmFzdGVyIHN3aXBlcywgYWxzbyBhcHBseSBsaW1pdHMgKGFsYmVpdCBoaWdoZXIgb25lcykuXG4gICAgICAgICAgY29uc3QgbW92ZURpc3RhbmNlID0gTWF0aC5hYnMoKHJ0bCA/IC1uZXdQb3NpdGlvbiA6IG5ld1Bvc2l0aW9uKSAtIHN3aXBlci50cmFuc2xhdGUpO1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZVNpemUgPSBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW3N3aXBlci5hY3RpdmVJbmRleF07XG4gICAgICAgICAgaWYgKG1vdmVEaXN0YW5jZSA8IGN1cnJlbnRTbGlkZVNpemUpIHtcbiAgICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBwYXJhbXMuc3BlZWQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChtb3ZlRGlzdGFuY2UgPCAyICogY3VycmVudFNsaWRlU2l6ZSkge1xuICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IHBhcmFtcy5zcGVlZCAqIDEuNTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IHBhcmFtcy5zcGVlZCAqIDIuNTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgICBzd2lwZXIuc2xpZGVUb0Nsb3Nlc3QoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bUJvdW5jZSAmJiBkb0JvdW5jZSkge1xuICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoYWZ0ZXJCb3VuY2VQb3NpdGlvbik7XG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKG1vbWVudHVtRHVyYXRpb24pO1xuICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25TdGFydCh0cnVlLCBzd2lwZXIuc3dpcGVEaXJlY3Rpb24pO1xuICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQod3JhcHBlckVsLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhZGF0YS5hbGxvd01vbWVudHVtQm91bmNlKSByZXR1cm47XG4gICAgICAgICAgZW1pdCgnbW9tZW50dW1Cb3VuY2UnKTtcbiAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihwYXJhbXMuc3BlZWQpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShhZnRlckJvdW5jZVBvc2l0aW9uKTtcbiAgICAgICAgICAgIGVsZW1lbnRUcmFuc2l0aW9uRW5kKHdyYXBwZXJFbCwgKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgICAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHN3aXBlci52ZWxvY2l0eSkge1xuICAgICAgICBlbWl0KCdfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScpO1xuICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MobmV3UG9zaXRpb24pO1xuICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihtb21lbnR1bUR1cmF0aW9uKTtcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdQb3NpdGlvbik7XG4gICAgICAgIHN3aXBlci50cmFuc2l0aW9uU3RhcnQodHJ1ZSwgc3dpcGVyLnN3aXBlRGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQod3JhcHBlckVsLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgICAgICBzd2lwZXIudHJhbnNpdGlvbkVuZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MobmV3UG9zaXRpb24pO1xuICAgICAgfVxuICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xuICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuZnJlZU1vZGUpIHtcbiAgICAgIGVtaXQoJ19mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJyk7XG4gICAgfVxuICAgIGlmICghcGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtIHx8IHRpbWVEaWZmID49IHBhcmFtcy5sb25nU3dpcGVzTXMpIHtcbiAgICAgIGVtaXQoJ19mcmVlTW9kZVN0YXRpY1JlbGVhc2UnKTtcbiAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIGZyZWVNb2RlOiB7XG4gICAgICBvblRvdWNoU3RhcnQsXG4gICAgICBvblRvdWNoTW92ZSxcbiAgICAgIG9uVG91Y2hFbmRcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBmcmVlTW9kZSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBnIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGVmZmVjdFRhcmdldChlZmZlY3RQYXJhbXMsIHNsaWRlRWwpIHtcbiAgY29uc3QgdHJhbnNmb3JtRWwgPSBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpO1xuICBpZiAodHJhbnNmb3JtRWwgIT09IHNsaWRlRWwpIHtcbiAgICB0cmFuc2Zvcm1FbC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB0cmFuc2Zvcm1FbC5zdHlsZVsnLXdlYmtpdC1iYWNrZmFjZS12aXNpYmlsaXR5J10gPSAnaGlkZGVuJztcbiAgfVxuICByZXR1cm4gdHJhbnNmb3JtRWw7XG59XG5cbmV4cG9ydCB7IGVmZmVjdFRhcmdldCBhcyBlIH07XG4iLCJpbXBvcnQgeyBrIGFzIGVsZW1lbnRUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGR1cmF0aW9uLFxuICAgIHRyYW5zZm9ybUVsZW1lbnRzLFxuICAgIGFsbFNsaWRlc1xuICB9ID0gX3JlZjtcbiAgY29uc3Qge1xuICAgIGFjdGl2ZUluZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGdldFNsaWRlID0gZWwgPT4ge1xuICAgIGlmICghZWwucGFyZW50RWxlbWVudCkge1xuICAgICAgLy8gYXNzdW1lIHNoYWRvdyByb290XG4gICAgICBjb25zdCBzbGlkZSA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5zaGFkb3dSb290ICYmIHNsaWRlRWwuc2hhZG93Um9vdCA9PT0gZWwucGFyZW50Tm9kZSlbMF07XG4gICAgICByZXR1cm4gc2xpZGU7XG4gICAgfVxuICAgIHJldHVybiBlbC5wYXJlbnRFbGVtZW50O1xuICB9O1xuICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlICYmIGR1cmF0aW9uICE9PSAwKSB7XG4gICAgbGV0IGV2ZW50VHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgbGV0IHRyYW5zaXRpb25FbmRUYXJnZXQ7XG4gICAgaWYgKGFsbFNsaWRlcykge1xuICAgICAgdHJhbnNpdGlvbkVuZFRhcmdldCA9IHRyYW5zZm9ybUVsZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2l0aW9uRW5kVGFyZ2V0ID0gdHJhbnNmb3JtRWxlbWVudHMuZmlsdGVyKHRyYW5zZm9ybUVsID0+IHtcbiAgICAgICAgY29uc3QgZWwgPSB0cmFuc2Zvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1zbGlkZS10cmFuc2Zvcm0nKSA/IGdldFNsaWRlKHRyYW5zZm9ybUVsKSA6IHRyYW5zZm9ybUVsO1xuICAgICAgICByZXR1cm4gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWwpID09PSBhY3RpdmVJbmRleDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0cmFuc2l0aW9uRW5kVGFyZ2V0LmZvckVhY2goZWwgPT4ge1xuICAgICAgZWxlbWVudFRyYW5zaXRpb25FbmQoZWwsICgpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50VHJpZ2dlcmVkKSByZXR1cm47XG4gICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgZXZlbnRUcmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGV2dCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ3RyYW5zaXRpb25lbmQnLCB7XG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIGFzIGUgfTtcbiIsImltcG9ydCB7IGUgYXMgZWZmZWN0SW5pdCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RUYXJnZXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXRhcmdldC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdmlydHVhbC10cmFuc2l0aW9uLWVuZC5tanMnO1xuaW1wb3J0IHsgZyBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdEZhZGUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgZmFkZUVmZmVjdDoge1xuICAgICAgY3Jvc3NGYWRlOiBmYWxzZVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuZmFkZUVmZmVjdDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHN3aXBlci5zbGlkZXNbaV07XG4gICAgICBjb25zdCBvZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgbGV0IHR4ID0gLW9mZnNldDtcbiAgICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB0eCAtPSBzd2lwZXIudHJhbnNsYXRlO1xuICAgICAgbGV0IHR5ID0gMDtcbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgIHR5ID0gdHg7XG4gICAgICAgIHR4ID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNsaWRlT3BhY2l0eSA9IHN3aXBlci5wYXJhbXMuZmFkZUVmZmVjdC5jcm9zc0ZhZGUgPyBNYXRoLm1heCgxIC0gTWF0aC5hYnMoc2xpZGVFbC5wcm9ncmVzcyksIDApIDogMSArIE1hdGgubWluKE1hdGgubWF4KHNsaWRlRWwucHJvZ3Jlc3MsIC0xKSwgMCk7XG4gICAgICBjb25zdCB0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsIHNsaWRlRWwpO1xuICAgICAgdGFyZ2V0RWwuc3R5bGUub3BhY2l0eSA9IHNsaWRlT3BhY2l0eTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpYDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgIH0pO1xuICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcbiAgICAgIHN3aXBlcixcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdHJhbnNmb3JtRWxlbWVudHMsXG4gICAgICBhbGxTbGlkZXM6IHRydWVcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnZmFkZScsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdEZhZGUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBjIGFzIGNyZWF0ZUVsZW1lbnQsIG8gYXMgZ2V0Um90YXRlRml4IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdEN1YmUoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY3ViZUVmZmVjdDoge1xuICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxuICAgICAgc2hhZG93OiB0cnVlLFxuICAgICAgc2hhZG93T2Zmc2V0OiAyMCxcbiAgICAgIHNoYWRvd1NjYWxlOiAwLjk0XG4gICAgfVxuICB9KTtcbiAgY29uc3QgY3JlYXRlU2xpZGVTaGFkb3dzID0gKHNsaWRlRWwsIHByb2dyZXNzLCBpc0hvcml6b250YWwpID0+IHtcbiAgICBsZXQgc2hhZG93QmVmb3JlID0gaXNIb3Jpem9udGFsID8gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xuICAgIGxldCBzaGFkb3dBZnRlciA9IGlzSG9yaXpvbnRhbCA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XG4gICAgaWYgKCFzaGFkb3dCZWZvcmUpIHtcbiAgICAgIHNoYWRvd0JlZm9yZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGBzd2lwZXItc2xpZGUtc2hhZG93LWN1YmUgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke2lzSG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnfWAuc3BsaXQoJyAnKSk7XG4gICAgICBzbGlkZUVsLmFwcGVuZChzaGFkb3dCZWZvcmUpO1xuICAgIH1cbiAgICBpZiAoIXNoYWRvd0FmdGVyKSB7XG4gICAgICBzaGFkb3dBZnRlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGBzd2lwZXItc2xpZGUtc2hhZG93LWN1YmUgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke2lzSG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJ31gLnNwbGl0KCcgJykpO1xuICAgICAgc2xpZGVFbC5hcHBlbmQoc2hhZG93QWZ0ZXIpO1xuICAgIH1cbiAgICBpZiAoc2hhZG93QmVmb3JlKSBzaGFkb3dCZWZvcmUuc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KC1wcm9ncmVzcywgMCk7XG4gICAgaWYgKHNoYWRvd0FmdGVyKSBzaGFkb3dBZnRlci5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xuICB9O1xuICBjb25zdCByZWNyZWF0ZVNoYWRvd3MgPSAoKSA9PiB7XG4gICAgLy8gY3JlYXRlIG5ldyBvbmVzXG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpO1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVFbC5wcm9ncmVzcywgMSksIC0xKTtcbiAgICAgIGNyZWF0ZVNsaWRlU2hhZG93cyhzbGlkZUVsLCBwcm9ncmVzcywgaXNIb3Jpem9udGFsKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVsLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgc2xpZGVzLFxuICAgICAgd2lkdGg6IHN3aXBlcldpZHRoLFxuICAgICAgaGVpZ2h0OiBzd2lwZXJIZWlnaHQsXG4gICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICAgIHNpemU6IHN3aXBlclNpemUsXG4gICAgICBicm93c2VyXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCByID0gZ2V0Um90YXRlRml4KHN3aXBlcik7XG4gICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0O1xuICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHN3aXBlci5pc0hvcml6b250YWwoKTtcbiAgICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgICBsZXQgd3JhcHBlclJvdGF0ZSA9IDA7XG4gICAgbGV0IGN1YmVTaGFkb3dFbDtcbiAgICBpZiAocGFyYW1zLnNoYWRvdykge1xuICAgICAgaWYgKGlzSG9yaXpvbnRhbCkge1xuICAgICAgICBjdWJlU2hhZG93RWwgPSBzd2lwZXIud3JhcHBlckVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgICAgaWYgKCFjdWJlU2hhZG93RWwpIHtcbiAgICAgICAgICBjdWJlU2hhZG93RWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnc3dpcGVyLWN1YmUtc2hhZG93Jyk7XG4gICAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5hcHBlbmQoY3ViZVNoYWRvd0VsKTtcbiAgICAgICAgfVxuICAgICAgICBjdWJlU2hhZG93RWwuc3R5bGUuaGVpZ2h0ID0gYCR7c3dpcGVyV2lkdGh9cHhgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3ViZVNoYWRvd0VsID0gZWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgICBpZiAoIWN1YmVTaGFkb3dFbCkge1xuICAgICAgICAgIGN1YmVTaGFkb3dFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICdzd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgICAgICBlbC5hcHBlbmQoY3ViZVNoYWRvd0VsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHNsaWRlc1tpXTtcbiAgICAgIGxldCBzbGlkZUluZGV4ID0gaTtcbiAgICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgICAgc2xpZGVJbmRleCA9IHBhcnNlSW50KHNsaWRlRWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XG4gICAgICB9XG4gICAgICBsZXQgc2xpZGVBbmdsZSA9IHNsaWRlSW5kZXggKiA5MDtcbiAgICAgIGxldCByb3VuZCA9IE1hdGguZmxvb3Ioc2xpZGVBbmdsZSAvIDM2MCk7XG4gICAgICBpZiAocnRsKSB7XG4gICAgICAgIHNsaWRlQW5nbGUgPSAtc2xpZGVBbmdsZTtcbiAgICAgICAgcm91bmQgPSBNYXRoLmZsb29yKC1zbGlkZUFuZ2xlIC8gMzYwKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVFbC5wcm9ncmVzcywgMSksIC0xKTtcbiAgICAgIGxldCB0eCA9IDA7XG4gICAgICBsZXQgdHkgPSAwO1xuICAgICAgbGV0IHR6ID0gMDtcbiAgICAgIGlmIChzbGlkZUluZGV4ICUgNCA9PT0gMCkge1xuICAgICAgICB0eCA9IC1yb3VuZCAqIDQgKiBzd2lwZXJTaXplO1xuICAgICAgICB0eiA9IDA7XG4gICAgICB9IGVsc2UgaWYgKChzbGlkZUluZGV4IC0gMSkgJSA0ID09PSAwKSB7XG4gICAgICAgIHR4ID0gMDtcbiAgICAgICAgdHogPSAtcm91bmQgKiA0ICogc3dpcGVyU2l6ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHNsaWRlSW5kZXggLSAyKSAlIDQgPT09IDApIHtcbiAgICAgICAgdHggPSBzd2lwZXJTaXplICsgcm91bmQgKiA0ICogc3dpcGVyU2l6ZTtcbiAgICAgICAgdHogPSBzd2lwZXJTaXplO1xuICAgICAgfSBlbHNlIGlmICgoc2xpZGVJbmRleCAtIDMpICUgNCA9PT0gMCkge1xuICAgICAgICB0eCA9IC1zd2lwZXJTaXplO1xuICAgICAgICB0eiA9IDMgKiBzd2lwZXJTaXplICsgc3dpcGVyU2l6ZSAqIDQgKiByb3VuZDtcbiAgICAgIH1cbiAgICAgIGlmIChydGwpIHtcbiAgICAgICAgdHggPSAtdHg7XG4gICAgICB9XG4gICAgICBpZiAoIWlzSG9yaXpvbnRhbCkge1xuICAgICAgICB0eSA9IHR4O1xuICAgICAgICB0eCA9IDA7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlWCgke3IoaXNIb3Jpem9udGFsID8gMCA6IC1zbGlkZUFuZ2xlKX1kZWcpIHJvdGF0ZVkoJHtyKGlzSG9yaXpvbnRhbCA/IHNsaWRlQW5nbGUgOiAwKX1kZWcpIHRyYW5zbGF0ZTNkKCR7dHh9cHgsICR7dHl9cHgsICR7dHp9cHgpYDtcbiAgICAgIGlmIChwcm9ncmVzcyA8PSAxICYmIHByb2dyZXNzID4gLTEpIHtcbiAgICAgICAgd3JhcHBlclJvdGF0ZSA9IHNsaWRlSW5kZXggKiA5MCArIHByb2dyZXNzICogOTA7XG4gICAgICAgIGlmIChydGwpIHdyYXBwZXJSb3RhdGUgPSAtc2xpZGVJbmRleCAqIDkwIC0gcHJvZ3Jlc3MgKiA5MDtcbiAgICAgIH1cbiAgICAgIHNsaWRlRWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzLCBpc0hvcml6b250YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gYDUwJSA1MCUgLSR7c3dpcGVyU2l6ZSAvIDJ9cHhgO1xuICAgIHdyYXBwZXJFbC5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSBgNTAlIDUwJSAtJHtzd2lwZXJTaXplIC8gMn1weGA7XG4gICAgaWYgKHBhcmFtcy5zaGFkb3cpIHtcbiAgICAgIGlmIChpc0hvcml6b250YWwpIHtcbiAgICAgICAgY3ViZVNoYWRvd0VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7c3dpcGVyV2lkdGggLyAyICsgcGFyYW1zLnNoYWRvd09mZnNldH1weCwgJHstc3dpcGVyV2lkdGggLyAyfXB4KSByb3RhdGVYKDg5Ljk5ZGVnKSByb3RhdGVaKDBkZWcpIHNjYWxlKCR7cGFyYW1zLnNoYWRvd1NjYWxlfSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2hhZG93QW5nbGUgPSBNYXRoLmFicyh3cmFwcGVyUm90YXRlKSAtIE1hdGguZmxvb3IoTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLyA5MCkgKiA5MDtcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IDEuNSAtIChNYXRoLnNpbihzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIgKyBNYXRoLmNvcyhzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIpO1xuICAgICAgICBjb25zdCBzY2FsZTEgPSBwYXJhbXMuc2hhZG93U2NhbGU7XG4gICAgICAgIGNvbnN0IHNjYWxlMiA9IHBhcmFtcy5zaGFkb3dTY2FsZSAvIG11bHRpcGxpZXI7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcmFtcy5zaGFkb3dPZmZzZXQ7XG4gICAgICAgIGN1YmVTaGFkb3dFbC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUzZCgke3NjYWxlMX0sIDEsICR7c2NhbGUyfSkgdHJhbnNsYXRlM2QoMHB4LCAke3N3aXBlckhlaWdodCAvIDIgKyBvZmZzZXR9cHgsICR7LXN3aXBlckhlaWdodCAvIDIgLyBzY2FsZTJ9cHgpIHJvdGF0ZVgoLTg5Ljk5ZGVnKWA7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHpGYWN0b3IgPSAoYnJvd3Nlci5pc1NhZmFyaSB8fCBicm93c2VyLmlzV2ViVmlldykgJiYgYnJvd3Nlci5uZWVkUGVyc3BlY3RpdmVGaXggPyAtc3dpcGVyU2l6ZSAvIDIgOiAwO1xuICAgIHdyYXBwZXJFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LDAsJHt6RmFjdG9yfXB4KSByb3RhdGVYKCR7cihzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAwIDogd3JhcHBlclJvdGF0ZSl9ZGVnKSByb3RhdGVZKCR7cihzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAtd3JhcHBlclJvdGF0ZSA6IDApfWRlZylgO1xuICAgIHdyYXBwZXJFbC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zd2lwZXItY3ViZS10cmFuc2xhdGUteicsIGAke3pGYWN0b3J9cHhgKTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBlbCxcbiAgICAgIHNsaWRlc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBzbGlkZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIHNsaWRlRWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykuZm9yRWFjaChzdWJFbCA9PiB7XG4gICAgICAgIHN1YkVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmN1YmVFZmZlY3Quc2hhZG93ICYmICFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgIGNvbnN0IHNoYWRvd0VsID0gZWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgaWYgKHNoYWRvd0VsKSBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgfVxuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdjdWJlJyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcmVjcmVhdGVTaGFkb3dzLFxuICAgIGdldEVmZmVjdFBhcmFtczogKCkgPT4gc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0LFxuICAgIHBlcnNwZWN0aXZlOiAoKSA9PiB0cnVlLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICByZXNpc3RhbmNlUmF0aW86IDAsXG4gICAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgICBjZW50ZXJlZFNsaWRlczogZmFsc2UsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiB0cnVlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdEN1YmUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsLCBjIGFzIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvdyhzdWZmaXgsIHNsaWRlRWwsIHNpZGUpIHtcbiAgY29uc3Qgc2hhZG93Q2xhc3MgPSBgc3dpcGVyLXNsaWRlLXNoYWRvdyR7c2lkZSA/IGAtJHtzaWRlfWAgOiAnJ30ke3N1ZmZpeCA/IGAgc3dpcGVyLXNsaWRlLXNoYWRvdy0ke3N1ZmZpeH1gIDogJyd9YDtcbiAgY29uc3Qgc2hhZG93Q29udGFpbmVyID0gZ2V0U2xpZGVUcmFuc2Zvcm1FbChzbGlkZUVsKTtcbiAgbGV0IHNoYWRvd0VsID0gc2hhZG93Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYC4ke3NoYWRvd0NsYXNzLnNwbGl0KCcgJykuam9pbignLicpfWApO1xuICBpZiAoIXNoYWRvd0VsKSB7XG4gICAgc2hhZG93RWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCBzaGFkb3dDbGFzcy5zcGxpdCgnICcpKTtcbiAgICBzaGFkb3dDb250YWluZXIuYXBwZW5kKHNoYWRvd0VsKTtcbiAgfVxuICByZXR1cm4gc2hhZG93RWw7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNoYWRvdyBhcyBjIH07XG4iLCJpbXBvcnQgeyBjIGFzIGNyZWF0ZVNoYWRvdyB9IGZyb20gJy4uL3NoYXJlZC9jcmVhdGUtc2hhZG93Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdEluaXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LWluaXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VGFyZ2V0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC10YXJnZXQubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXZpcnR1YWwtdHJhbnNpdGlvbi1lbmQubWpzJztcbmltcG9ydCB7IGcgYXMgZ2V0U2xpZGVUcmFuc2Zvcm1FbCwgbyBhcyBnZXRSb3RhdGVGaXggfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMubWpzJztcblxuZnVuY3Rpb24gRWZmZWN0RmxpcChfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvblxuICB9ID0gX3JlZjtcbiAgZXh0ZW5kUGFyYW1zKHtcbiAgICBmbGlwRWZmZWN0OiB7XG4gICAgICBzbGlkZVNoYWRvd3M6IHRydWUsXG4gICAgICBsaW1pdFJvdGF0aW9uOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgY29uc3QgY3JlYXRlU2xpZGVTaGFkb3dzID0gKHNsaWRlRWwsIHByb2dyZXNzKSA9PiB7XG4gICAgbGV0IHNoYWRvd0JlZm9yZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcbiAgICBsZXQgc2hhZG93QWZ0ZXIgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xuICAgIGlmICghc2hhZG93QmVmb3JlKSB7XG4gICAgICBzaGFkb3dCZWZvcmUgPSBjcmVhdGVTaGFkb3coJ2ZsaXAnLCBzbGlkZUVsLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJyk7XG4gICAgfVxuICAgIGlmICghc2hhZG93QWZ0ZXIpIHtcbiAgICAgIHNoYWRvd0FmdGVyID0gY3JlYXRlU2hhZG93KCdmbGlwJywgc2xpZGVFbCwgc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3JpZ2h0JyA6ICdib3R0b20nKTtcbiAgICB9XG4gICAgaWYgKHNoYWRvd0JlZm9yZSkgc2hhZG93QmVmb3JlLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1heCgtcHJvZ3Jlc3MsIDApO1xuICAgIGlmIChzaGFkb3dBZnRlcikgc2hhZG93QWZ0ZXIuc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KHByb2dyZXNzLCAwKTtcbiAgfTtcbiAgY29uc3QgcmVjcmVhdGVTaGFkb3dzID0gKCkgPT4ge1xuICAgIC8vIFNldCBzaGFkb3dzXG4gICAgc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0O1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIGxldCBwcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0LmxpbWl0Um90YXRpb24pIHtcbiAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbihzbGlkZUVsLnByb2dyZXNzLCAxKSwgLTEpO1xuICAgICAgfVxuICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlcyxcbiAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3Q7XG4gICAgY29uc3Qgcm90YXRlRml4ID0gZ2V0Um90YXRlRml4KHN3aXBlcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBsZXQgcHJvZ3Jlc3MgPSBzbGlkZUVsLnByb2dyZXNzO1xuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZmxpcEVmZmVjdC5saW1pdFJvdGF0aW9uKSB7XG4gICAgICAgIHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVFbC5wcm9ncmVzcywgMSksIC0xKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9mZnNldCA9IHNsaWRlRWwuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICBjb25zdCByb3RhdGUgPSAtMTgwICogcHJvZ3Jlc3M7XG4gICAgICBsZXQgcm90YXRlWSA9IHJvdGF0ZTtcbiAgICAgIGxldCByb3RhdGVYID0gMDtcbiAgICAgIGxldCB0eCA9IHN3aXBlci5wYXJhbXMuY3NzTW9kZSA/IC1vZmZzZXQgLSBzd2lwZXIudHJhbnNsYXRlIDogLW9mZnNldDtcbiAgICAgIGxldCB0eSA9IDA7XG4gICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICB0eSA9IHR4O1xuICAgICAgICB0eCA9IDA7XG4gICAgICAgIHJvdGF0ZVggPSAtcm90YXRlWTtcbiAgICAgICAgcm90YXRlWSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHJ0bCkge1xuICAgICAgICByb3RhdGVZID0gLXJvdGF0ZVk7XG4gICAgICB9XG4gICAgICBzbGlkZUVsLnN0eWxlLnpJbmRleCA9IC1NYXRoLmFicyhNYXRoLnJvdW5kKHByb2dyZXNzKSkgKyBzbGlkZXMubGVuZ3RoO1xuICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgY3JlYXRlU2xpZGVTaGFkb3dzKHNsaWRlRWwsIHByb2dyZXNzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpIHJvdGF0ZVgoJHtyb3RhdGVGaXgocm90YXRlWCl9ZGVnKSByb3RhdGVZKCR7cm90YXRlRml4KHJvdGF0ZVkpfWRlZylgO1xuICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCBzbGlkZUVsKTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgZWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykuZm9yRWFjaChzaGFkb3dFbCA9PiB7XG4gICAgICAgIHNoYWRvd0VsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcbiAgICAgIHN3aXBlcixcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdHJhbnNmb3JtRWxlbWVudHNcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnZmxpcCcsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIHJlY3JlYXRlU2hhZG93cyxcbiAgICBnZXRFZmZlY3RQYXJhbXM6ICgpID0+IHN3aXBlci5wYXJhbXMuZmxpcEVmZmVjdCxcbiAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcbiAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXG4gICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxuICAgICAgdmlydHVhbFRyYW5zbGF0ZTogIXN3aXBlci5wYXJhbXMuY3NzTW9kZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RGbGlwIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGMgYXMgY3JlYXRlU2hhZG93IH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1zaGFkb3cubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0SW5pdCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RUYXJnZXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXRhcmdldC5tanMnO1xuaW1wb3J0IHsgZyBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsLCBvIGFzIGdldFJvdGF0ZUZpeCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBFZmZlY3RDb3ZlcmZsb3coX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBleHRlbmRQYXJhbXMsXG4gICAgb25cbiAgfSA9IF9yZWY7XG4gIGV4dGVuZFBhcmFtcyh7XG4gICAgY292ZXJmbG93RWZmZWN0OiB7XG4gICAgICByb3RhdGU6IDUwLFxuICAgICAgc3RyZXRjaDogMCxcbiAgICAgIGRlcHRoOiAxMDAsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIG1vZGlmaWVyOiAxLFxuICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoOiBzd2lwZXJXaWR0aCxcbiAgICAgIGhlaWdodDogc3dpcGVySGVpZ2h0LFxuICAgICAgc2xpZGVzLFxuICAgICAgc2xpZGVzU2l6ZXNHcmlkXG4gICAgfSA9IHN3aXBlcjtcbiAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNvdmVyZmxvd0VmZmVjdDtcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICBjb25zdCBjZW50ZXIgPSBpc0hvcml6b250YWwgPyAtdHJhbnNmb3JtICsgc3dpcGVyV2lkdGggLyAyIDogLXRyYW5zZm9ybSArIHN3aXBlckhlaWdodCAvIDI7XG4gICAgY29uc3Qgcm90YXRlID0gaXNIb3Jpem9udGFsID8gcGFyYW1zLnJvdGF0ZSA6IC1wYXJhbXMucm90YXRlO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHBhcmFtcy5kZXB0aDtcbiAgICBjb25zdCByID0gZ2V0Um90YXRlRml4KHN3aXBlcik7XG4gICAgLy8gRWFjaCBzbGlkZSBvZmZzZXQgZnJvbSBjZW50ZXJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gc2xpZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc2xpZGVzW2ldO1xuICAgICAgY29uc3Qgc2xpZGVTaXplID0gc2xpZGVzU2l6ZXNHcmlkW2ldO1xuICAgICAgY29uc3Qgc2xpZGVPZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgY29uc3QgY2VudGVyT2Zmc2V0ID0gKGNlbnRlciAtIHNsaWRlT2Zmc2V0IC0gc2xpZGVTaXplIC8gMikgLyBzbGlkZVNpemU7XG4gICAgICBjb25zdCBvZmZzZXRNdWx0aXBsaWVyID0gdHlwZW9mIHBhcmFtcy5tb2RpZmllciA9PT0gJ2Z1bmN0aW9uJyA/IHBhcmFtcy5tb2RpZmllcihjZW50ZXJPZmZzZXQpIDogY2VudGVyT2Zmc2V0ICogcGFyYW1zLm1vZGlmaWVyO1xuICAgICAgbGV0IHJvdGF0ZVkgPSBpc0hvcml6b250YWwgPyByb3RhdGUgKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgIGxldCByb3RhdGVYID0gaXNIb3Jpem9udGFsID8gMCA6IHJvdGF0ZSAqIG9mZnNldE11bHRpcGxpZXI7XG4gICAgICAvLyB2YXIgcm90YXRlWiA9IDBcbiAgICAgIGxldCB0cmFuc2xhdGVaID0gLXRyYW5zbGF0ZSAqIE1hdGguYWJzKG9mZnNldE11bHRpcGxpZXIpO1xuICAgICAgbGV0IHN0cmV0Y2ggPSBwYXJhbXMuc3RyZXRjaDtcbiAgICAgIC8vIEFsbG93IHBlcmNlbnRhZ2UgdG8gbWFrZSBhIHJlbGF0aXZlIHN0cmV0Y2ggZm9yIHJlc3BvbnNpdmUgc2xpZGVyc1xuICAgICAgaWYgKHR5cGVvZiBzdHJldGNoID09PSAnc3RyaW5nJyAmJiBzdHJldGNoLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcbiAgICAgICAgc3RyZXRjaCA9IHBhcnNlRmxvYXQocGFyYW1zLnN0cmV0Y2gpIC8gMTAwICogc2xpZGVTaXplO1xuICAgICAgfVxuICAgICAgbGV0IHRyYW5zbGF0ZVkgPSBpc0hvcml6b250YWwgPyAwIDogc3RyZXRjaCAqIG9mZnNldE11bHRpcGxpZXI7XG4gICAgICBsZXQgdHJhbnNsYXRlWCA9IGlzSG9yaXpvbnRhbCA/IHN0cmV0Y2ggKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgIGxldCBzY2FsZSA9IDEgLSAoMSAtIHBhcmFtcy5zY2FsZSkgKiBNYXRoLmFicyhvZmZzZXRNdWx0aXBsaWVyKTtcblxuICAgICAgLy8gRml4IGZvciB1bHRyYSBzbWFsbCB2YWx1ZXNcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVYKSA8IDAuMDAxKSB0cmFuc2xhdGVYID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVZKSA8IDAuMDAxKSB0cmFuc2xhdGVZID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyh0cmFuc2xhdGVaKSA8IDAuMDAxKSB0cmFuc2xhdGVaID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVZKSA8IDAuMDAxKSByb3RhdGVZID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhyb3RhdGVYKSA8IDAuMDAxKSByb3RhdGVYID0gMDtcbiAgICAgIGlmIChNYXRoLmFicyhzY2FsZSkgPCAwLjAwMSkgc2NhbGUgPSAwO1xuICAgICAgY29uc3Qgc2xpZGVUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVYfXB4LCR7dHJhbnNsYXRlWX1weCwke3RyYW5zbGF0ZVp9cHgpICByb3RhdGVYKCR7cihyb3RhdGVYKX1kZWcpIHJvdGF0ZVkoJHtyKHJvdGF0ZVkpfWRlZykgc2NhbGUoJHtzY2FsZX0pYDtcbiAgICAgIGNvbnN0IHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgc2xpZGVFbCk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSBzbGlkZVRyYW5zZm9ybTtcbiAgICAgIHNsaWRlRWwuc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQob2Zmc2V0TXVsdGlwbGllcikpICsgMTtcbiAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgIC8vIFNldCBzaGFkb3dzXG4gICAgICAgIGxldCBzaGFkb3dCZWZvcmVFbCA9IGlzSG9yaXpvbnRhbCA/IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcbiAgICAgICAgbGV0IHNoYWRvd0FmdGVyRWwgPSBpc0hvcml6b250YWwgPyBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xuICAgICAgICBpZiAoIXNoYWRvd0JlZm9yZUVsKSB7XG4gICAgICAgICAgc2hhZG93QmVmb3JlRWwgPSBjcmVhdGVTaGFkb3coJ2NvdmVyZmxvdycsIHNsaWRlRWwsIGlzSG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNoYWRvd0FmdGVyRWwpIHtcbiAgICAgICAgICBzaGFkb3dBZnRlckVsID0gY3JlYXRlU2hhZG93KCdjb3ZlcmZsb3cnLCBzbGlkZUVsLCBpc0hvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFkb3dCZWZvcmVFbCkgc2hhZG93QmVmb3JlRWwuc3R5bGUub3BhY2l0eSA9IG9mZnNldE11bHRpcGxpZXIgPiAwID8gb2Zmc2V0TXVsdGlwbGllciA6IDA7XG4gICAgICAgIGlmIChzaGFkb3dBZnRlckVsKSBzaGFkb3dBZnRlckVsLnN0eWxlLm9wYWNpdHkgPSAtb2Zmc2V0TXVsdGlwbGllciA+IDAgPyAtb2Zmc2V0TXVsdGlwbGllciA6IDA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybUVsZW1lbnRzID0gc3dpcGVyLnNsaWRlcy5tYXAoc2xpZGVFbCA9PiBnZXRTbGlkZVRyYW5zZm9ybUVsKHNsaWRlRWwpKTtcbiAgICB0cmFuc2Zvcm1FbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLmZvckVhY2goc2hhZG93RWwgPT4ge1xuICAgICAgICBzaGFkb3dFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgZWZmZWN0SW5pdCh7XG4gICAgZWZmZWN0OiAnY292ZXJmbG93JyxcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgc2V0VHJhbnNsYXRlLFxuICAgIHNldFRyYW5zaXRpb24sXG4gICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXG4gICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgeyBFZmZlY3RDb3ZlcmZsb3cgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVTaGFkb3cgfSBmcm9tICcuLi9zaGFyZWQvY3JlYXRlLXNoYWRvdy5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RJbml0IH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC1pbml0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFRhcmdldCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdGFyZ2V0Lm1qcyc7XG5pbXBvcnQgeyBlIGFzIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kIH0gZnJvbSAnLi4vc2hhcmVkL2VmZmVjdC12aXJ0dWFsLXRyYW5zaXRpb24tZW5kLm1qcyc7XG5pbXBvcnQgeyBnIGFzIGdldFNsaWRlVHJhbnNmb3JtRWwsIG8gYXMgZ2V0Um90YXRlRml4IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdENyZWF0aXZlKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGNyZWF0aXZlRWZmZWN0OiB7XG4gICAgICBsaW1pdFByb2dyZXNzOiAxLFxuICAgICAgc2hhZG93UGVyUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgcHJvZ3Jlc3NNdWx0aXBsaWVyOiAxLFxuICAgICAgcGVyc3BlY3RpdmU6IHRydWUsXG4gICAgICBwcmV2OiB7XG4gICAgICAgIHRyYW5zbGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICByb3RhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgc2NhbGU6IDFcbiAgICAgIH0sXG4gICAgICBuZXh0OiB7XG4gICAgICAgIHRyYW5zbGF0ZTogWzAsIDAsIDBdLFxuICAgICAgICByb3RhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgc2NhbGU6IDFcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBjb25zdCBnZXRUcmFuc2xhdGVWYWx1ZSA9IHZhbHVlID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgcmV0dXJuIHZhbHVlO1xuICAgIHJldHVybiBgJHt2YWx1ZX1weGA7XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXMsXG4gICAgICB3cmFwcGVyRWwsXG4gICAgICBzbGlkZXNTaXplc0dyaWRcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuY3JlYXRpdmVFZmZlY3Q7XG4gICAgY29uc3Qge1xuICAgICAgcHJvZ3Jlc3NNdWx0aXBsaWVyOiBtdWx0aXBsaWVyXG4gICAgfSA9IHBhcmFtcztcbiAgICBjb25zdCBpc0NlbnRlcmVkU2xpZGVzID0gc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcztcbiAgICBjb25zdCByb3RhdGVGaXggPSBnZXRSb3RhdGVGaXgoc3dpcGVyKTtcbiAgICBpZiAoaXNDZW50ZXJlZFNsaWRlcykge1xuICAgICAgY29uc3QgbWFyZ2luID0gc2xpZGVzU2l6ZXNHcmlkWzBdIC8gMiAtIHN3aXBlci5wYXJhbXMuc2xpZGVzT2Zmc2V0QmVmb3JlIHx8IDA7XG4gICAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoY2FsYyg1MCUgLSAke21hcmdpbn1weCkpYDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNsaWRlRWwgPSBzbGlkZXNbaV07XG4gICAgICBjb25zdCBzbGlkZVByb2dyZXNzID0gc2xpZGVFbC5wcm9ncmVzcztcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVFbC5wcm9ncmVzcywgLXBhcmFtcy5saW1pdFByb2dyZXNzKSwgcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpO1xuICAgICAgbGV0IG9yaWdpbmFsUHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgIGlmICghaXNDZW50ZXJlZFNsaWRlcykge1xuICAgICAgICBvcmlnaW5hbFByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVFbC5vcmlnaW5hbFByb2dyZXNzLCAtcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpLCBwYXJhbXMubGltaXRQcm9ncmVzcyk7XG4gICAgICB9XG4gICAgICBjb25zdCBvZmZzZXQgPSBzbGlkZUVsLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgY29uc3QgdCA9IFtzd2lwZXIucGFyYW1zLmNzc01vZGUgPyAtb2Zmc2V0IC0gc3dpcGVyLnRyYW5zbGF0ZSA6IC1vZmZzZXQsIDAsIDBdO1xuICAgICAgY29uc3QgciA9IFswLCAwLCAwXTtcbiAgICAgIGxldCBjdXN0b20gPSBmYWxzZTtcbiAgICAgIGlmICghc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgIHRbMV0gPSB0WzBdO1xuICAgICAgICB0WzBdID0gMDtcbiAgICAgIH1cbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcbiAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXG4gICAgICAgIHNjYWxlOiAxLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9O1xuICAgICAgaWYgKHByb2dyZXNzIDwgMCkge1xuICAgICAgICBkYXRhID0gcGFyYW1zLm5leHQ7XG4gICAgICAgIGN1c3RvbSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHByb2dyZXNzID4gMCkge1xuICAgICAgICBkYXRhID0gcGFyYW1zLnByZXY7XG4gICAgICAgIGN1c3RvbSA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBzZXQgdHJhbnNsYXRlXG4gICAgICB0LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICB0W2luZGV4XSA9IGBjYWxjKCR7dmFsdWV9cHggKyAoJHtnZXRUcmFuc2xhdGVWYWx1ZShkYXRhLnRyYW5zbGF0ZVtpbmRleF0pfSAqICR7TWF0aC5hYnMocHJvZ3Jlc3MgKiBtdWx0aXBsaWVyKX0pKWA7XG4gICAgICB9KTtcbiAgICAgIC8vIHNldCByb3RhdGVzXG4gICAgICByLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgdmFsID0gZGF0YS5yb3RhdGVbaW5kZXhdICogTWF0aC5hYnMocHJvZ3Jlc3MgKiBtdWx0aXBsaWVyKTtcbiAgICAgICAgcltpbmRleF0gPSB2YWw7XG4gICAgICB9KTtcbiAgICAgIHNsaWRlRWwuc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQoc2xpZGVQcm9ncmVzcykpICsgc2xpZGVzLmxlbmd0aDtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVN0cmluZyA9IHQuam9pbignLCAnKTtcbiAgICAgIGNvbnN0IHJvdGF0ZVN0cmluZyA9IGByb3RhdGVYKCR7cm90YXRlRml4KHJbMF0pfWRlZykgcm90YXRlWSgke3JvdGF0ZUZpeChyWzFdKX1kZWcpIHJvdGF0ZVooJHtyb3RhdGVGaXgoclsyXSl9ZGVnKWA7XG4gICAgICBjb25zdCBzY2FsZVN0cmluZyA9IG9yaWdpbmFsUHJvZ3Jlc3MgPCAwID8gYHNjYWxlKCR7MSArICgxIC0gZGF0YS5zY2FsZSkgKiBvcmlnaW5hbFByb2dyZXNzICogbXVsdGlwbGllcn0pYCA6IGBzY2FsZSgkezEgLSAoMSAtIGRhdGEuc2NhbGUpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXJ9KWA7XG4gICAgICBjb25zdCBvcGFjaXR5U3RyaW5nID0gb3JpZ2luYWxQcm9ncmVzcyA8IDAgPyAxICsgKDEgLSBkYXRhLm9wYWNpdHkpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXIgOiAxIC0gKDEgLSBkYXRhLm9wYWNpdHkpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXI7XG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVTdHJpbmd9KSAke3JvdGF0ZVN0cmluZ30gJHtzY2FsZVN0cmluZ31gO1xuXG4gICAgICAvLyBTZXQgc2hhZG93c1xuICAgICAgaWYgKGN1c3RvbSAmJiBkYXRhLnNoYWRvdyB8fCAhY3VzdG9tKSB7XG4gICAgICAgIGxldCBzaGFkb3dFbCA9IHNsaWRlRWwucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS1zaGFkb3cnKTtcbiAgICAgICAgaWYgKCFzaGFkb3dFbCAmJiBkYXRhLnNoYWRvdykge1xuICAgICAgICAgIHNoYWRvd0VsID0gY3JlYXRlU2hhZG93KCdjcmVhdGl2ZScsIHNsaWRlRWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFkb3dFbCkge1xuICAgICAgICAgIGNvbnN0IHNoYWRvd09wYWNpdHkgPSBwYXJhbXMuc2hhZG93UGVyUHJvZ3Jlc3MgPyBwcm9ncmVzcyAqICgxIC8gcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpIDogcHJvZ3Jlc3M7XG4gICAgICAgICAgc2hhZG93RWwuc3R5bGUub3BhY2l0eSA9IE1hdGgubWluKE1hdGgubWF4KE1hdGguYWJzKHNoYWRvd09wYWNpdHkpLCAwKSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgc2xpZGVFbCk7XG4gICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgICB0YXJnZXRFbC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eVN0cmluZztcbiAgICAgIGlmIChkYXRhLm9yaWdpbikge1xuICAgICAgICB0YXJnZXRFbC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBkYXRhLm9yaWdpbjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgZWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3cnKS5mb3JFYWNoKHNoYWRvd0VsID0+IHtcbiAgICAgICAgc2hhZG93RWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQoe1xuICAgICAgc3dpcGVyLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB0cmFuc2Zvcm1FbGVtZW50cyxcbiAgICAgIGFsbFNsaWRlczogdHJ1ZVxuICAgIH0pO1xuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdjcmVhdGl2ZScsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIHBlcnNwZWN0aXZlOiAoKSA9PiBzd2lwZXIucGFyYW1zLmNyZWF0aXZlRWZmZWN0LnBlcnNwZWN0aXZlLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdENyZWF0aXZlIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IGMgYXMgY3JlYXRlU2hhZG93IH0gZnJvbSAnLi4vc2hhcmVkL2NyZWF0ZS1zaGFkb3cubWpzJztcbmltcG9ydCB7IGUgYXMgZWZmZWN0SW5pdCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtaW5pdC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RUYXJnZXQgfSBmcm9tICcuLi9zaGFyZWQvZWZmZWN0LXRhcmdldC5tanMnO1xuaW1wb3J0IHsgZSBhcyBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCB9IGZyb20gJy4uL3NoYXJlZC9lZmZlY3QtdmlydHVhbC10cmFuc2l0aW9uLWVuZC5tanMnO1xuaW1wb3J0IHsgZyBhcyBnZXRTbGlkZVRyYW5zZm9ybUVsIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIEVmZmVjdENhcmRzKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgZXh0ZW5kUGFyYW1zLFxuICAgIG9uXG4gIH0gPSBfcmVmO1xuICBleHRlbmRQYXJhbXMoe1xuICAgIGNhcmRzRWZmZWN0OiB7XG4gICAgICBzbGlkZVNoYWRvd3M6IHRydWUsXG4gICAgICByb3RhdGU6IHRydWUsXG4gICAgICBwZXJTbGlkZVJvdGF0ZTogMixcbiAgICAgIHBlclNsaWRlT2Zmc2V0OiA4XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNsaWRlcyxcbiAgICAgIGFjdGl2ZUluZGV4LFxuICAgICAgcnRsVHJhbnNsYXRlOiBydGxcbiAgICB9ID0gc3dpcGVyO1xuICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuY2FyZHNFZmZlY3Q7XG4gICAgY29uc3Qge1xuICAgICAgc3RhcnRUcmFuc2xhdGUsXG4gICAgICBpc1RvdWNoZWRcbiAgICB9ID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YTtcbiAgICBjb25zdCBjdXJyZW50VHJhbnNsYXRlID0gcnRsID8gLXN3aXBlci50cmFuc2xhdGUgOiBzd2lwZXIudHJhbnNsYXRlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzbGlkZUVsID0gc2xpZGVzW2ldO1xuICAgICAgY29uc3Qgc2xpZGVQcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlUHJvZ3Jlc3MsIC00KSwgNCk7XG4gICAgICBsZXQgb2Zmc2V0ID0gc2xpZGVFbC5zd2lwZXJTbGlkZU9mZnNldDtcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmICFzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3N3aXBlci5taW5UcmFuc2xhdGUoKX1weClgO1xuICAgICAgfVxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICAgIG9mZnNldCAtPSBzbGlkZXNbMF0uc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICB9XG4gICAgICBsZXQgdFggPSBzd2lwZXIucGFyYW1zLmNzc01vZGUgPyAtb2Zmc2V0IC0gc3dpcGVyLnRyYW5zbGF0ZSA6IC1vZmZzZXQ7XG4gICAgICBsZXQgdFkgPSAwO1xuICAgICAgY29uc3QgdFogPSAtMTAwICogTWF0aC5hYnMocHJvZ3Jlc3MpO1xuICAgICAgbGV0IHNjYWxlID0gMTtcbiAgICAgIGxldCByb3RhdGUgPSAtcGFyYW1zLnBlclNsaWRlUm90YXRlICogcHJvZ3Jlc3M7XG4gICAgICBsZXQgdFhBZGQgPSBwYXJhbXMucGVyU2xpZGVPZmZzZXQgLSBNYXRoLmFicyhwcm9ncmVzcykgKiAwLjc1O1xuICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuZnJvbSArIGkgOiBpO1xuICAgICAgY29uc3QgaXNTd2lwZVRvTmV4dCA9IChzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCB8fCBzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCAtIDEpICYmIHByb2dyZXNzID4gMCAmJiBwcm9ncmVzcyA8IDEgJiYgKGlzVG91Y2hlZCB8fCBzd2lwZXIucGFyYW1zLmNzc01vZGUpICYmIGN1cnJlbnRUcmFuc2xhdGUgPCBzdGFydFRyYW5zbGF0ZTtcbiAgICAgIGNvbnN0IGlzU3dpcGVUb1ByZXYgPSAoc2xpZGVJbmRleCA9PT0gYWN0aXZlSW5kZXggfHwgc2xpZGVJbmRleCA9PT0gYWN0aXZlSW5kZXggKyAxKSAmJiBwcm9ncmVzcyA8IDAgJiYgcHJvZ3Jlc3MgPiAtMSAmJiAoaXNUb3VjaGVkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgJiYgY3VycmVudFRyYW5zbGF0ZSA+IHN0YXJ0VHJhbnNsYXRlO1xuICAgICAgaWYgKGlzU3dpcGVUb05leHQgfHwgaXNTd2lwZVRvUHJldikge1xuICAgICAgICBjb25zdCBzdWJQcm9ncmVzcyA9ICgxIC0gTWF0aC5hYnMoKE1hdGguYWJzKHByb2dyZXNzKSAtIDAuNSkgLyAwLjUpKSAqKiAwLjU7XG4gICAgICAgIHJvdGF0ZSArPSAtMjggKiBwcm9ncmVzcyAqIHN1YlByb2dyZXNzO1xuICAgICAgICBzY2FsZSArPSAtMC41ICogc3ViUHJvZ3Jlc3M7XG4gICAgICAgIHRYQWRkICs9IDk2ICogc3ViUHJvZ3Jlc3M7XG4gICAgICAgIHRZID0gYCR7LTI1ICogc3ViUHJvZ3Jlc3MgKiBNYXRoLmFicyhwcm9ncmVzcyl9JWA7XG4gICAgICB9XG4gICAgICBpZiAocHJvZ3Jlc3MgPCAwKSB7XG4gICAgICAgIC8vIG5leHRcbiAgICAgICAgdFggPSBgY2FsYygke3RYfXB4ICR7cnRsID8gJy0nIDogJysnfSAoJHt0WEFkZCAqIE1hdGguYWJzKHByb2dyZXNzKX0lKSlgO1xuICAgICAgfSBlbHNlIGlmIChwcm9ncmVzcyA+IDApIHtcbiAgICAgICAgLy8gcHJldlxuICAgICAgICB0WCA9IGBjYWxjKCR7dFh9cHggJHtydGwgPyAnLScgOiAnKyd9ICgtJHt0WEFkZCAqIE1hdGguYWJzKHByb2dyZXNzKX0lKSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdFggPSBgJHt0WH1weGA7XG4gICAgICB9XG4gICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgICBjb25zdCBwcmV2WSA9IHRZO1xuICAgICAgICB0WSA9IHRYO1xuICAgICAgICB0WCA9IHByZXZZO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2NhbGVTdHJpbmcgPSBwcm9ncmVzcyA8IDAgPyBgJHsxICsgKDEgLSBzY2FsZSkgKiBwcm9ncmVzc31gIDogYCR7MSAtICgxIC0gc2NhbGUpICogcHJvZ3Jlc3N9YDtcblxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGBcbiAgICAgICAgdHJhbnNsYXRlM2QoJHt0WH0sICR7dFl9LCAke3RafXB4KVxuICAgICAgICByb3RhdGVaKCR7cGFyYW1zLnJvdGF0ZSA/IHJ0bCA/IC1yb3RhdGUgOiByb3RhdGUgOiAwfWRlZylcbiAgICAgICAgc2NhbGUoJHtzY2FsZVN0cmluZ30pXG4gICAgICBgO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xuXG4gICAgICBpZiAocGFyYW1zLnNsaWRlU2hhZG93cykge1xuICAgICAgICAvLyBTZXQgc2hhZG93c1xuICAgICAgICBsZXQgc2hhZG93RWwgPSBzbGlkZUVsLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2xpZGUtc2hhZG93Jyk7XG4gICAgICAgIGlmICghc2hhZG93RWwpIHtcbiAgICAgICAgICBzaGFkb3dFbCA9IGNyZWF0ZVNoYWRvdygnY2FyZHMnLCBzbGlkZUVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hhZG93RWwpIHNoYWRvd0VsLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1pbihNYXRoLm1heCgoTWF0aC5hYnMocHJvZ3Jlc3MpIC0gMC41KSAvIDAuNSwgMCksIDEpO1xuICAgICAgfVxuICAgICAgc2xpZGVFbC5zdHlsZS56SW5kZXggPSAtTWF0aC5hYnMoTWF0aC5yb3VuZChzbGlkZVByb2dyZXNzKSkgKyBzbGlkZXMubGVuZ3RoO1xuICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCBzbGlkZUVsKTtcbiAgICAgIHRhcmdldEVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFRyYW5zaXRpb24gPSBkdXJhdGlvbiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtRWxlbWVudHMgPSBzd2lwZXIuc2xpZGVzLm1hcChzbGlkZUVsID0+IGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkpO1xuICAgIHRyYW5zZm9ybUVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgZWwucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZS1zaGFkb3cnKS5mb3JFYWNoKHNoYWRvd0VsID0+IHtcbiAgICAgICAgc2hhZG93RWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZWZmZWN0VmlydHVhbFRyYW5zaXRpb25FbmQoe1xuICAgICAgc3dpcGVyLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB0cmFuc2Zvcm1FbGVtZW50c1xuICAgIH0pO1xuICB9O1xuICBlZmZlY3RJbml0KHtcbiAgICBlZmZlY3Q6ICdjYXJkcycsXG4gICAgc3dpcGVyLFxuICAgIG9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBzZXRUcmFuc2l0aW9uLFxuICAgIHBlcnNwZWN0aXZlOiAoKSA9PiB0cnVlLFxuICAgIG92ZXJ3cml0ZVBhcmFtczogKCkgPT4gKHtcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEVmZmVjdENhcmRzIGFzIGRlZmF1bHQgfTtcbiIsImV4cG9ydCB7ZGVmYXVsdCBhcyBWaXJ0dWFsfSBmcm9tICcuL3ZpcnR1YWwubWpzJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBLZXlib2FyZH0gZnJvbSAnLi9rZXlib2FyZC5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIE1vdXNld2hlZWx9IGZyb20gJy4vbW91c2V3aGVlbC5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIE5hdmlnYXRpb259IGZyb20gJy4vbmF2aWdhdGlvbi5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFBhZ2luYXRpb259IGZyb20gJy4vcGFnaW5hdGlvbi5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFNjcm9sbGJhcn0gZnJvbSAnLi9zY3JvbGxiYXIubWpzJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBQYXJhbGxheH0gZnJvbSAnLi9wYXJhbGxheC5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFpvb219IGZyb20gJy4vem9vbS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIENvbnRyb2xsZXJ9IGZyb20gJy4vY29udHJvbGxlci5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEExMXl9IGZyb20gJy4vYTExeS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEhpc3Rvcnl9IGZyb20gJy4vaGlzdG9yeS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEhhc2hOYXZpZ2F0aW9ufSBmcm9tICcuL2hhc2gtbmF2aWdhdGlvbi5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEF1dG9wbGF5fSBmcm9tICcuL2F1dG9wbGF5Lm1qcyc7XG5leHBvcnQge2RlZmF1bHQgYXMgVGh1bWJzfSBmcm9tICcuL3RodW1icy5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEZyZWVNb2RlfSBmcm9tICcuL2ZyZWUtbW9kZS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEdyaWR9IGZyb20gJy4vZ3JpZC5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIE1hbmlwdWxhdGlvbn0gZnJvbSAnLi9tYW5pcHVsYXRpb24ubWpzJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBFZmZlY3RGYWRlfSBmcm9tICcuL2VmZmVjdC1mYWRlLm1qcyc7XG5leHBvcnQge2RlZmF1bHQgYXMgRWZmZWN0Q3ViZX0gZnJvbSAnLi9lZmZlY3QtY3ViZS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEVmZmVjdEZsaXB9IGZyb20gJy4vZWZmZWN0LWZsaXAubWpzJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBFZmZlY3RDb3ZlcmZsb3d9IGZyb20gJy4vZWZmZWN0LWNvdmVyZmxvdy5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEVmZmVjdENyZWF0aXZlfSBmcm9tICcuL2VmZmVjdC1jcmVhdGl2ZS5tanMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEVmZmVjdENhcmRzfSBmcm9tICcuL2VmZmVjdC1jYXJkcy5tanMnOyIsIi8qKlxuICogU1NSIFdpbmRvdyA0LjAuMlxuICogQmV0dGVyIGhhbmRsaW5nIGZvciB3aW5kb3cgb2JqZWN0IGluIFNTUiBlbnZpcm9ubWVudFxuICogaHR0cHM6Ly9naXRodWIuY29tL25vbGltaXRzNHdlYi9zc3Itd2luZG93XG4gKlxuICogQ29weXJpZ2h0IDIwMjEsIFZsYWRpbWlyIEtoYXJsYW1waWRpXG4gKlxuICogTGljZW5zZWQgdW5kZXIgTUlUXG4gKlxuICogUmVsZWFzZWQgb246IERlY2VtYmVyIDEzLCAyMDIxXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAnY29uc3RydWN0b3InIGluIG9iaiAmJiBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbn1cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNyYykge1xuICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHtcbiAgICB0YXJnZXQgPSB7fTtcbiAgfVxuICBpZiAoc3JjID09PSB2b2lkIDApIHtcbiAgICBzcmMgPSB7fTtcbiAgfVxuICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAodHlwZW9mIHRhcmdldFtrZXldID09PSAndW5kZWZpbmVkJykgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtlbHNlIGlmIChpc09iamVjdChzcmNba2V5XSkgJiYgaXNPYmplY3QodGFyZ2V0W2tleV0pICYmIE9iamVjdC5rZXlzKHNyY1trZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICBleHRlbmQodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcbiAgICB9XG4gIH0pO1xufVxuY29uc3Qgc3NyRG9jdW1lbnQgPSB7XG4gIGJvZHk6IHt9LFxuICBhZGRFdmVudExpc3RlbmVyKCkge30sXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoKSB7fSxcbiAgYWN0aXZlRWxlbWVudDoge1xuICAgIGJsdXIoKSB7fSxcbiAgICBub2RlTmFtZTogJydcbiAgfSxcbiAgcXVlcnlTZWxlY3RvcigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgcXVlcnlTZWxlY3RvckFsbCgpIHtcbiAgICByZXR1cm4gW107XG4gIH0sXG4gIGdldEVsZW1lbnRCeUlkKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBjcmVhdGVFdmVudCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdEV2ZW50KCkge31cbiAgICB9O1xuICB9LFxuICBjcmVhdGVFbGVtZW50KCkge1xuICAgIHJldHVybiB7XG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBjaGlsZE5vZGVzOiBbXSxcbiAgICAgIHN0eWxlOiB7fSxcbiAgICAgIHNldEF0dHJpYnV0ZSgpIHt9LFxuICAgICAgZ2V0RWxlbWVudHNCeVRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBjcmVhdGVFbGVtZW50TlMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBpbXBvcnROb2RlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBsb2NhdGlvbjoge1xuICAgIGhhc2g6ICcnLFxuICAgIGhvc3Q6ICcnLFxuICAgIGhvc3RuYW1lOiAnJyxcbiAgICBocmVmOiAnJyxcbiAgICBvcmlnaW46ICcnLFxuICAgIHBhdGhuYW1lOiAnJyxcbiAgICBwcm90b2NvbDogJycsXG4gICAgc2VhcmNoOiAnJ1xuICB9XG59O1xuZnVuY3Rpb24gZ2V0RG9jdW1lbnQoKSB7XG4gIGNvbnN0IGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IHt9O1xuICBleHRlbmQoZG9jLCBzc3JEb2N1bWVudCk7XG4gIHJldHVybiBkb2M7XG59XG5jb25zdCBzc3JXaW5kb3cgPSB7XG4gIGRvY3VtZW50OiBzc3JEb2N1bWVudCxcbiAgbmF2aWdhdG9yOiB7XG4gICAgdXNlckFnZW50OiAnJ1xuICB9LFxuICBsb2NhdGlvbjoge1xuICAgIGhhc2g6ICcnLFxuICAgIGhvc3Q6ICcnLFxuICAgIGhvc3RuYW1lOiAnJyxcbiAgICBocmVmOiAnJyxcbiAgICBvcmlnaW46ICcnLFxuICAgIHBhdGhuYW1lOiAnJyxcbiAgICBwcm90b2NvbDogJycsXG4gICAgc2VhcmNoOiAnJ1xuICB9LFxuICBoaXN0b3J5OiB7XG4gICAgcmVwbGFjZVN0YXRlKCkge30sXG4gICAgcHVzaFN0YXRlKCkge30sXG4gICAgZ28oKSB7fSxcbiAgICBiYWNrKCkge31cbiAgfSxcbiAgQ3VzdG9tRXZlbnQ6IGZ1bmN0aW9uIEN1c3RvbUV2ZW50KCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVyKCkge30sXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoKSB7fSxcbiAgZ2V0Q29tcHV0ZWRTdHlsZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UHJvcGVydHlWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIEltYWdlKCkge30sXG4gIERhdGUoKSB7fSxcbiAgc2NyZWVuOiB7fSxcbiAgc2V0VGltZW91dCgpIHt9LFxuICBjbGVhclRpbWVvdXQoKSB7fSxcbiAgbWF0Y2hNZWRpYSgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuICB9LFxuICBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkge1xuICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgfVxufTtcbmZ1bmN0aW9uIGdldFdpbmRvdygpIHtcbiAgY29uc3Qgd2luID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fTtcbiAgZXh0ZW5kKHdpbiwgc3NyV2luZG93KTtcbiAgcmV0dXJuIHdpbjtcbn1cblxuZXhwb3J0IHsgZ2V0V2luZG93IGFzIGEsIGdldERvY3VtZW50IGFzIGcgfTtcbiIsImltcG9ydCB7IGEgYXMgZ2V0V2luZG93LCBnIGFzIGdldERvY3VtZW50IH0gZnJvbSAnLi9zc3Itd2luZG93LmVzbS5tanMnO1xuXG5mdW5jdGlvbiBjbGFzc2VzVG9Ub2tlbnMoY2xhc3Nlcykge1xuICBpZiAoY2xhc3NlcyA9PT0gdm9pZCAwKSB7XG4gICAgY2xhc3NlcyA9ICcnO1xuICB9XG4gIHJldHVybiBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpLmZpbHRlcihjID0+ICEhYy50cmltKCkpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVQcm9wcyhvYmopIHtcbiAgY29uc3Qgb2JqZWN0ID0gb2JqO1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goa2V5ID0+IHtcbiAgICB0cnkge1xuICAgICAgb2JqZWN0W2tleV0gPSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG5vIGdldHRlciBmb3Igb2JqZWN0XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBkZWxldGUgb2JqZWN0W2tleV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gc29tZXRoaW5nIGdvdCB3cm9uZ1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaywgZGVsYXkpIHtcbiAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcbiAgICBkZWxheSA9IDA7XG4gIH1cbiAgcmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIGRlbGF5KTtcbn1cbmZ1bmN0aW9uIG5vdygpIHtcbiAgcmV0dXJuIERhdGUubm93KCk7XG59XG5mdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBsZXQgc3R5bGU7XG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpO1xuICB9XG4gIGlmICghc3R5bGUgJiYgZWwuY3VycmVudFN0eWxlKSB7XG4gICAgc3R5bGUgPSBlbC5jdXJyZW50U3R5bGU7XG4gIH1cbiAgaWYgKCFzdHlsZSkge1xuICAgIHN0eWxlID0gZWwuc3R5bGU7XG4gIH1cbiAgcmV0dXJuIHN0eWxlO1xufVxuZnVuY3Rpb24gZ2V0VHJhbnNsYXRlKGVsLCBheGlzKSB7XG4gIGlmIChheGlzID09PSB2b2lkIDApIHtcbiAgICBheGlzID0gJ3gnO1xuICB9XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBsZXQgbWF0cml4O1xuICBsZXQgY3VyVHJhbnNmb3JtO1xuICBsZXQgdHJhbnNmb3JtTWF0cml4O1xuICBjb25zdCBjdXJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBpZiAod2luZG93LldlYktpdENTU01hdHJpeCkge1xuICAgIGN1clRyYW5zZm9ybSA9IGN1clN0eWxlLnRyYW5zZm9ybSB8fCBjdXJTdHlsZS53ZWJraXRUcmFuc2Zvcm07XG4gICAgaWYgKGN1clRyYW5zZm9ybS5zcGxpdCgnLCcpLmxlbmd0aCA+IDYpIHtcbiAgICAgIGN1clRyYW5zZm9ybSA9IGN1clRyYW5zZm9ybS5zcGxpdCgnLCAnKS5tYXAoYSA9PiBhLnJlcGxhY2UoJywnLCAnLicpKS5qb2luKCcsICcpO1xuICAgIH1cbiAgICAvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBXZWJraXQgY2hva2Ugd2hlbiAnbm9uZScgaXMgcGFzc2VkOyBwYXNzXG4gICAgLy8gZW1wdHkgc3RyaW5nIGluc3RlYWQgaW4gdGhpcyBjYXNlXG4gICAgdHJhbnNmb3JtTWF0cml4ID0gbmV3IHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgoY3VyVHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IGN1clRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgdHJhbnNmb3JtTWF0cml4ID0gY3VyU3R5bGUuTW96VHJhbnNmb3JtIHx8IGN1clN0eWxlLk9UcmFuc2Zvcm0gfHwgY3VyU3R5bGUuTXNUcmFuc2Zvcm0gfHwgY3VyU3R5bGUubXNUcmFuc2Zvcm0gfHwgY3VyU3R5bGUudHJhbnNmb3JtIHx8IGN1clN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpLnJlcGxhY2UoJ3RyYW5zbGF0ZSgnLCAnbWF0cml4KDEsIDAsIDAsIDEsJyk7XG4gICAgbWF0cml4ID0gdHJhbnNmb3JtTWF0cml4LnRvU3RyaW5nKCkuc3BsaXQoJywnKTtcbiAgfVxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgLy8gTGF0ZXN0IENocm9tZSBhbmQgd2Via2l0cyBGaXhcbiAgICBpZiAod2luZG93LldlYktpdENTU01hdHJpeCkgY3VyVHJhbnNmb3JtID0gdHJhbnNmb3JtTWF0cml4Lm00MTtcbiAgICAvLyBDcmF6eSBJRTEwIE1hdHJpeFxuICAgIGVsc2UgaWYgKG1hdHJpeC5sZW5ndGggPT09IDE2KSBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFsxMl0pO1xuICAgIC8vIE5vcm1hbCBCcm93c2Vyc1xuICAgIGVsc2UgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbNF0pO1xuICB9XG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICAvLyBMYXRlc3QgQ2hyb21lIGFuZCB3ZWJraXRzIEZpeFxuICAgIGlmICh3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KSBjdXJUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1NYXRyaXgubTQyO1xuICAgIC8vIENyYXp5IElFMTAgTWF0cml4XG4gICAgZWxzZSBpZiAobWF0cml4Lmxlbmd0aCA9PT0gMTYpIGN1clRyYW5zZm9ybSA9IHBhcnNlRmxvYXQobWF0cml4WzEzXSk7XG4gICAgLy8gTm9ybWFsIEJyb3dzZXJzXG4gICAgZWxzZSBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFs1XSk7XG4gIH1cbiAgcmV0dXJuIGN1clRyYW5zZm9ybSB8fCAwO1xufVxuZnVuY3Rpb24gaXNPYmplY3Qobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIG8gIT09IG51bGwgJiYgby5jb25zdHJ1Y3RvciAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpID09PSAnT2JqZWN0Jztcbn1cbmZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5IVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9XG4gIHJldHVybiBub2RlICYmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDExKTtcbn1cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgY29uc3QgdG8gPSBPYmplY3QoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKTtcbiAgY29uc3Qgbm9FeHRlbmQgPSBbJ19fcHJvdG9fXycsICdjb25zdHJ1Y3RvcicsICdwcm90b3R5cGUnXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBuZXh0U291cmNlID0gaSA8IDAgfHwgYXJndW1lbnRzLmxlbmd0aCA8PSBpID8gdW5kZWZpbmVkIDogYXJndW1lbnRzW2ldO1xuICAgIGlmIChuZXh0U291cmNlICE9PSB1bmRlZmluZWQgJiYgbmV4dFNvdXJjZSAhPT0gbnVsbCAmJiAhaXNOb2RlKG5leHRTb3VyY2UpKSB7XG4gICAgICBjb25zdCBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpLmZpbHRlcihrZXkgPT4gbm9FeHRlbmQuaW5kZXhPZihrZXkpIDwgMCk7XG4gICAgICBmb3IgKGxldCBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgICAgaWYgKGlzT2JqZWN0KHRvW25leHRLZXldKSAmJiBpc09iamVjdChuZXh0U291cmNlW25leHRLZXldKSkge1xuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2VbbmV4dEtleV0uX19zd2lwZXJfXykge1xuICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBleHRlbmQodG9bbmV4dEtleV0sIG5leHRTb3VyY2VbbmV4dEtleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzT2JqZWN0KHRvW25leHRLZXldKSAmJiBpc09iamVjdChuZXh0U291cmNlW25leHRLZXldKSkge1xuICAgICAgICAgICAgdG9bbmV4dEtleV0gPSB7fTtcbiAgICAgICAgICAgIGlmIChuZXh0U291cmNlW25leHRLZXldLl9fc3dpcGVyX18pIHtcbiAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXh0ZW5kKHRvW25leHRLZXldLCBuZXh0U291cmNlW25leHRLZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59XG5mdW5jdGlvbiBzZXRDU1NQcm9wZXJ0eShlbCwgdmFyTmFtZSwgdmFyVmFsdWUpIHtcbiAgZWwuc3R5bGUuc2V0UHJvcGVydHkodmFyTmFtZSwgdmFyVmFsdWUpO1xufVxuZnVuY3Rpb24gYW5pbWF0ZUNTU01vZGVTY3JvbGwoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICB0YXJnZXRQb3NpdGlvbixcbiAgICBzaWRlXG4gIH0gPSBfcmVmO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IC1zd2lwZXIudHJhbnNsYXRlO1xuICBsZXQgc3RhcnRUaW1lID0gbnVsbDtcbiAgbGV0IHRpbWU7XG4gIGNvbnN0IGR1cmF0aW9uID0gc3dpcGVyLnBhcmFtcy5zcGVlZDtcbiAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9ICdub25lJztcbiAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHN3aXBlci5jc3NNb2RlRnJhbWVJRCk7XG4gIGNvbnN0IGRpciA9IHRhcmdldFBvc2l0aW9uID4gc3RhcnRQb3NpdGlvbiA/ICduZXh0JyA6ICdwcmV2JztcbiAgY29uc3QgaXNPdXRPZkJvdW5kID0gKGN1cnJlbnQsIHRhcmdldCkgPT4ge1xuICAgIHJldHVybiBkaXIgPT09ICduZXh0JyAmJiBjdXJyZW50ID49IHRhcmdldCB8fCBkaXIgPT09ICdwcmV2JyAmJiBjdXJyZW50IDw9IHRhcmdldDtcbiAgfTtcbiAgY29uc3QgYW5pbWF0ZSA9ICgpID0+IHtcbiAgICB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHN0YXJ0VGltZSA9PT0gbnVsbCkge1xuICAgICAgc3RhcnRUaW1lID0gdGltZTtcbiAgICB9XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbigodGltZSAtIHN0YXJ0VGltZSkgLyBkdXJhdGlvbiwgMSksIDApO1xuICAgIGNvbnN0IGVhc2VQcm9ncmVzcyA9IDAuNSAtIE1hdGguY29zKHByb2dyZXNzICogTWF0aC5QSSkgLyAyO1xuICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSBzdGFydFBvc2l0aW9uICsgZWFzZVByb2dyZXNzICogKHRhcmdldFBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbik7XG4gICAgaWYgKGlzT3V0T2ZCb3VuZChjdXJyZW50UG9zaXRpb24sIHRhcmdldFBvc2l0aW9uKSkge1xuICAgICAgY3VycmVudFBvc2l0aW9uID0gdGFyZ2V0UG9zaXRpb247XG4gICAgfVxuICAgIHN3aXBlci53cmFwcGVyRWwuc2Nyb2xsVG8oe1xuICAgICAgW3NpZGVdOiBjdXJyZW50UG9zaXRpb25cbiAgICB9KTtcbiAgICBpZiAoaXNPdXRPZkJvdW5kKGN1cnJlbnRQb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb24pKSB7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJyc7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnNjcm9sbFRvKHtcbiAgICAgICAgICBbc2lkZV06IGN1cnJlbnRQb3NpdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHN3aXBlci5jc3NNb2RlRnJhbWVJRCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXBlci5jc3NNb2RlRnJhbWVJRCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gIH07XG4gIGFuaW1hdGUoKTtcbn1cbmZ1bmN0aW9uIGdldFNsaWRlVHJhbnNmb3JtRWwoc2xpZGVFbCkge1xuICByZXR1cm4gc2xpZGVFbC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNsaWRlLXRyYW5zZm9ybScpIHx8IHNsaWRlRWwuc2hhZG93Um9vdCAmJiBzbGlkZUVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLnN3aXBlci1zbGlkZS10cmFuc2Zvcm0nKSB8fCBzbGlkZUVsO1xufVxuZnVuY3Rpb24gZWxlbWVudENoaWxkcmVuKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7XG4gICAgc2VsZWN0b3IgPSAnJztcbiAgfVxuICBjb25zdCBjaGlsZHJlbiA9IFsuLi5lbGVtZW50LmNoaWxkcmVuXTtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MU2xvdEVsZW1lbnQpIHtcbiAgICBjaGlsZHJlbi5wdXNoKC4uLmVsZW1lbnQuYXNzaWduZWRFbGVtZW50cygpKTtcbiAgfVxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHJldHVybiBjaGlsZHJlbi5maWx0ZXIoZWwgPT4gZWwubWF0Y2hlcyhzZWxlY3RvcikpO1xufVxuZnVuY3Rpb24gZWxlbWVudElzQ2hpbGRPZihlbCwgcGFyZW50KSB7XG4gIGNvbnN0IGlzQ2hpbGQgPSBwYXJlbnQuY29udGFpbnMoZWwpO1xuICBpZiAoIWlzQ2hpbGQgJiYgcGFyZW50IGluc3RhbmNlb2YgSFRNTFNsb3RFbGVtZW50KSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbLi4ucGFyZW50LmFzc2lnbmVkRWxlbWVudHMoKV07XG4gICAgcmV0dXJuIGNoaWxkcmVuLmluY2x1ZGVzKGVsKTtcbiAgfVxuICByZXR1cm4gaXNDaGlsZDtcbn1cbmZ1bmN0aW9uIHNob3dXYXJuaW5nKHRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLndhcm4odGV4dCk7XG4gICAgcmV0dXJuO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBlcnJcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWcsIGNsYXNzZXMpIHtcbiAgaWYgKGNsYXNzZXMgPT09IHZvaWQgMCkge1xuICAgIGNsYXNzZXMgPSBbXTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi4oQXJyYXkuaXNBcnJheShjbGFzc2VzKSA/IGNsYXNzZXMgOiBjbGFzc2VzVG9Ub2tlbnMoY2xhc3NlcykpKTtcbiAgcmV0dXJuIGVsO1xufVxuZnVuY3Rpb24gZWxlbWVudE9mZnNldChlbCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBjb25zdCBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IGNsaWVudFRvcCA9IGVsLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xuICBjb25zdCBjbGllbnRMZWZ0ID0gZWwuY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMDtcbiAgY29uc3Qgc2Nyb2xsVG9wID0gZWwgPT09IHdpbmRvdyA/IHdpbmRvdy5zY3JvbGxZIDogZWwuc2Nyb2xsVG9wO1xuICBjb25zdCBzY3JvbGxMZWZ0ID0gZWwgPT09IHdpbmRvdyA/IHdpbmRvdy5zY3JvbGxYIDogZWwuc2Nyb2xsTGVmdDtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IGJveC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3AsXG4gICAgbGVmdDogYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxuICB9O1xufVxuZnVuY3Rpb24gZWxlbWVudFByZXZBbGwoZWwsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IHByZXZFbHMgPSBbXTtcbiAgd2hpbGUgKGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcbiAgICBjb25zdCBwcmV2ID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgaWYgKHByZXYubWF0Y2hlcyhzZWxlY3RvcikpIHByZXZFbHMucHVzaChwcmV2KTtcbiAgICB9IGVsc2UgcHJldkVscy5wdXNoKHByZXYpO1xuICAgIGVsID0gcHJldjtcbiAgfVxuICByZXR1cm4gcHJldkVscztcbn1cbmZ1bmN0aW9uIGVsZW1lbnROZXh0QWxsKGVsLCBzZWxlY3Rvcikge1xuICBjb25zdCBuZXh0RWxzID0gW107XG4gIHdoaWxlIChlbC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICBjb25zdCBuZXh0ID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICBpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkgbmV4dEVscy5wdXNoKG5leHQpO1xuICAgIH0gZWxzZSBuZXh0RWxzLnB1c2gobmV4dCk7XG4gICAgZWwgPSBuZXh0O1xuICB9XG4gIHJldHVybiBuZXh0RWxzO1xufVxuZnVuY3Rpb24gZWxlbWVudFN0eWxlKGVsLCBwcm9wKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG59XG5mdW5jdGlvbiBlbGVtZW50SW5kZXgoZWwpIHtcbiAgbGV0IGNoaWxkID0gZWw7XG4gIGxldCBpO1xuICBpZiAoY2hpbGQpIHtcbiAgICBpID0gMDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICB3aGlsZSAoKGNoaWxkID0gY2hpbGQucHJldmlvdXNTaWJsaW5nKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSBpICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBlbGVtZW50UGFyZW50cyhlbCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGxldCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIGlmIChwYXJlbnQubWF0Y2hlcyhzZWxlY3RvcikpIHBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIHBhcmVudHM7XG59XG5mdW5jdGlvbiBlbGVtZW50VHJhbnNpdGlvbkVuZChlbCwgY2FsbGJhY2spIHtcbiAgZnVuY3Rpb24gZmlyZUNhbGxCYWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGVsKSByZXR1cm47XG4gICAgY2FsbGJhY2suY2FsbChlbCwgZSk7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XG4gIH1cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XG4gIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnRPdXRlclNpemUoZWwsIHNpemUsIGluY2x1ZGVNYXJnaW5zKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBpZiAoaW5jbHVkZU1hcmdpbnMpIHtcbiAgICByZXR1cm4gZWxbc2l6ZSA9PT0gJ3dpZHRoJyA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J10gKyBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHNpemUgPT09ICd3aWR0aCcgPyAnbWFyZ2luLXJpZ2h0JyA6ICdtYXJnaW4tdG9wJykpICsgcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShzaXplID09PSAnd2lkdGgnID8gJ21hcmdpbi1sZWZ0JyA6ICdtYXJnaW4tYm90dG9tJykpO1xuICB9XG4gIHJldHVybiBlbC5vZmZzZXRXaWR0aDtcbn1cbmZ1bmN0aW9uIG1ha2VFbGVtZW50c0FycmF5KGVsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheShlbCkgPyBlbCA6IFtlbF0pLmZpbHRlcihlID0+ICEhZSk7XG59XG5mdW5jdGlvbiBnZXRSb3RhdGVGaXgoc3dpcGVyKSB7XG4gIHJldHVybiB2ID0+IHtcbiAgICBpZiAoTWF0aC5hYnModikgPiAwICYmIHN3aXBlci5icm93c2VyICYmIHN3aXBlci5icm93c2VyLm5lZWQzZEZpeCAmJiBNYXRoLmFicyh2KSAlIDkwID09PSAwKSB7XG4gICAgICByZXR1cm4gdiArIDAuMDAxO1xuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfTtcbn1cblxuZXhwb3J0IHsgZWxlbWVudFBhcmVudHMgYXMgYSwgZWxlbWVudE9mZnNldCBhcyBiLCBjcmVhdGVFbGVtZW50IGFzIGMsIG5vdyBhcyBkLCBlbGVtZW50Q2hpbGRyZW4gYXMgZSwgZWxlbWVudE91dGVyU2l6ZSBhcyBmLCBnZXRTbGlkZVRyYW5zZm9ybUVsIGFzIGcsIGVsZW1lbnRJbmRleCBhcyBoLCBjbGFzc2VzVG9Ub2tlbnMgYXMgaSwgZ2V0VHJhbnNsYXRlIGFzIGosIGVsZW1lbnRUcmFuc2l0aW9uRW5kIGFzIGssIGlzT2JqZWN0IGFzIGwsIG1ha2VFbGVtZW50c0FycmF5IGFzIG0sIG5leHRUaWNrIGFzIG4sIGdldFJvdGF0ZUZpeCBhcyBvLCBlbGVtZW50U3R5bGUgYXMgcCwgZWxlbWVudE5leHRBbGwgYXMgcSwgZWxlbWVudFByZXZBbGwgYXMgciwgc2V0Q1NTUHJvcGVydHkgYXMgcywgYW5pbWF0ZUNTU01vZGVTY3JvbGwgYXMgdCwgc2hvd1dhcm5pbmcgYXMgdSwgZWxlbWVudElzQ2hpbGRPZiBhcyB2LCBleHRlbmQgYXMgdywgZGVsZXRlUHJvcHMgYXMgeCB9O1xuIiwiaW1wb3J0IHsgYSBhcyBnZXRXaW5kb3csIGcgYXMgZ2V0RG9jdW1lbnQgfSBmcm9tICcuL3Nzci13aW5kb3cuZXNtLm1qcyc7XG5pbXBvcnQgeyBhIGFzIGVsZW1lbnRQYXJlbnRzLCBwIGFzIGVsZW1lbnRTdHlsZSwgZSBhcyBlbGVtZW50Q2hpbGRyZW4sIHMgYXMgc2V0Q1NTUHJvcGVydHksIGYgYXMgZWxlbWVudE91dGVyU2l6ZSwgcSBhcyBlbGVtZW50TmV4dEFsbCwgciBhcyBlbGVtZW50UHJldkFsbCwgaiBhcyBnZXRUcmFuc2xhdGUsIHQgYXMgYW5pbWF0ZUNTU01vZGVTY3JvbGwsIG4gYXMgbmV4dFRpY2ssIHUgYXMgc2hvd1dhcm5pbmcsIGMgYXMgY3JlYXRlRWxlbWVudCwgdiBhcyBlbGVtZW50SXNDaGlsZE9mLCBkIGFzIG5vdywgdyBhcyBleHRlbmQsIGggYXMgZWxlbWVudEluZGV4LCB4IGFzIGRlbGV0ZVByb3BzIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5sZXQgc3VwcG9ydDtcbmZ1bmN0aW9uIGNhbGNTdXBwb3J0KCkge1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICByZXR1cm4ge1xuICAgIHNtb290aFNjcm9sbDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiAnc2Nyb2xsQmVoYXZpb3InIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSxcbiAgICB0b3VjaDogISEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpXG4gIH07XG59XG5mdW5jdGlvbiBnZXRTdXBwb3J0KCkge1xuICBpZiAoIXN1cHBvcnQpIHtcbiAgICBzdXBwb3J0ID0gY2FsY1N1cHBvcnQoKTtcbiAgfVxuICByZXR1cm4gc3VwcG9ydDtcbn1cblxubGV0IGRldmljZUNhY2hlZDtcbmZ1bmN0aW9uIGNhbGNEZXZpY2UoX3RlbXApIHtcbiAgbGV0IHtcbiAgICB1c2VyQWdlbnRcbiAgfSA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wO1xuICBjb25zdCBzdXBwb3J0ID0gZ2V0U3VwcG9ydCgpO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgcGxhdGZvcm0gPSB3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtO1xuICBjb25zdCB1YSA9IHVzZXJBZ2VudCB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgY29uc3QgZGV2aWNlID0ge1xuICAgIGlvczogZmFsc2UsXG4gICAgYW5kcm9pZDogZmFsc2VcbiAgfTtcbiAgY29uc3Qgc2NyZWVuV2lkdGggPSB3aW5kb3cuc2NyZWVuLndpZHRoO1xuICBjb25zdCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodDtcbiAgY29uc3QgYW5kcm9pZCA9IHVhLm1hdGNoKC8oQW5kcm9pZCk7P1tcXHNcXC9dKyhbXFxkLl0rKT8vKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBsZXQgaXBhZCA9IHVhLm1hdGNoKC8oaVBhZCkuKk9TXFxzKFtcXGRfXSspLyk7XG4gIGNvbnN0IGlwb2QgPSB1YS5tYXRjaCgvKGlQb2QpKC4qT1NcXHMoW1xcZF9dKykpPy8pO1xuICBjb25zdCBpcGhvbmUgPSAhaXBhZCAmJiB1YS5tYXRjaCgvKGlQaG9uZVxcc09TfGlPUylcXHMoW1xcZF9dKykvKTtcbiAgY29uc3Qgd2luZG93cyA9IHBsYXRmb3JtID09PSAnV2luMzInO1xuICBsZXQgbWFjb3MgPSBwbGF0Zm9ybSA9PT0gJ01hY0ludGVsJztcblxuICAvLyBpUGFkT3MgMTMgZml4XG4gIGNvbnN0IGlQYWRTY3JlZW5zID0gWycxMDI0eDEzNjYnLCAnMTM2NngxMDI0JywgJzgzNHgxMTk0JywgJzExOTR4ODM0JywgJzgzNHgxMTEyJywgJzExMTJ4ODM0JywgJzc2OHgxMDI0JywgJzEwMjR4NzY4JywgJzgyMHgxMTgwJywgJzExODB4ODIwJywgJzgxMHgxMDgwJywgJzEwODB4ODEwJ107XG4gIGlmICghaXBhZCAmJiBtYWNvcyAmJiBzdXBwb3J0LnRvdWNoICYmIGlQYWRTY3JlZW5zLmluZGV4T2YoYCR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fWApID49IDApIHtcbiAgICBpcGFkID0gdWEubWF0Y2goLyhWZXJzaW9uKVxcLyhbXFxkLl0rKS8pO1xuICAgIGlmICghaXBhZCkgaXBhZCA9IFswLCAxLCAnMTNfMF8wJ107XG4gICAgbWFjb3MgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFuZHJvaWRcbiAgaWYgKGFuZHJvaWQgJiYgIXdpbmRvd3MpIHtcbiAgICBkZXZpY2Uub3MgPSAnYW5kcm9pZCc7XG4gICAgZGV2aWNlLmFuZHJvaWQgPSB0cnVlO1xuICB9XG4gIGlmIChpcGFkIHx8IGlwaG9uZSB8fCBpcG9kKSB7XG4gICAgZGV2aWNlLm9zID0gJ2lvcyc7XG4gICAgZGV2aWNlLmlvcyA9IHRydWU7XG4gIH1cblxuICAvLyBFeHBvcnQgb2JqZWN0XG4gIHJldHVybiBkZXZpY2U7XG59XG5mdW5jdGlvbiBnZXREZXZpY2Uob3ZlcnJpZGVzKSB7XG4gIGlmIChvdmVycmlkZXMgPT09IHZvaWQgMCkge1xuICAgIG92ZXJyaWRlcyA9IHt9O1xuICB9XG4gIGlmICghZGV2aWNlQ2FjaGVkKSB7XG4gICAgZGV2aWNlQ2FjaGVkID0gY2FsY0RldmljZShvdmVycmlkZXMpO1xuICB9XG4gIHJldHVybiBkZXZpY2VDYWNoZWQ7XG59XG5cbmxldCBicm93c2VyO1xuZnVuY3Rpb24gY2FsY0Jyb3dzZXIoKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCBkZXZpY2UgPSBnZXREZXZpY2UoKTtcbiAgbGV0IG5lZWRQZXJzcGVjdGl2ZUZpeCA9IGZhbHNlO1xuICBmdW5jdGlvbiBpc1NhZmFyaSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ3NhZmFyaScpID49IDAgJiYgdWEuaW5kZXhPZignY2hyb21lJykgPCAwICYmIHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA8IDA7XG4gIH1cbiAgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICBjb25zdCB1YSA9IFN0cmluZyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgaWYgKHVhLmluY2x1ZGVzKCdWZXJzaW9uLycpKSB7XG4gICAgICBjb25zdCBbbWFqb3IsIG1pbm9yXSA9IHVhLnNwbGl0KCdWZXJzaW9uLycpWzFdLnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKS5tYXAobnVtID0+IE51bWJlcihudW0pKTtcbiAgICAgIG5lZWRQZXJzcGVjdGl2ZUZpeCA9IG1ham9yIDwgMTYgfHwgbWFqb3IgPT09IDE2ICYmIG1pbm9yIDwgMjtcbiAgICB9XG4gIH1cbiAgY29uc3QgaXNXZWJWaWV3ID0gLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgY29uc3QgaXNTYWZhcmlCcm93c2VyID0gaXNTYWZhcmkoKTtcbiAgY29uc3QgbmVlZDNkRml4ID0gaXNTYWZhcmlCcm93c2VyIHx8IGlzV2ViVmlldyAmJiBkZXZpY2UuaW9zO1xuICByZXR1cm4ge1xuICAgIGlzU2FmYXJpOiBuZWVkUGVyc3BlY3RpdmVGaXggfHwgaXNTYWZhcmlCcm93c2VyLFxuICAgIG5lZWRQZXJzcGVjdGl2ZUZpeCxcbiAgICBuZWVkM2RGaXgsXG4gICAgaXNXZWJWaWV3XG4gIH07XG59XG5mdW5jdGlvbiBnZXRCcm93c2VyKCkge1xuICBpZiAoIWJyb3dzZXIpIHtcbiAgICBicm93c2VyID0gY2FsY0Jyb3dzZXIoKTtcbiAgfVxuICByZXR1cm4gYnJvd3Nlcjtcbn1cblxuZnVuY3Rpb24gUmVzaXplKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBzd2lwZXIsXG4gICAgb24sXG4gICAgZW1pdFxuICB9ID0gX3JlZjtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGxldCBvYnNlcnZlciA9IG51bGw7XG4gIGxldCBhbmltYXRpb25GcmFtZSA9IG51bGw7XG4gIGNvbnN0IHJlc2l6ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLmluaXRpYWxpemVkKSByZXR1cm47XG4gICAgZW1pdCgnYmVmb3JlUmVzaXplJyk7XG4gICAgZW1pdCgncmVzaXplJyk7XG4gIH07XG4gIGNvbnN0IGNyZWF0ZU9ic2VydmVyID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xuICAgIG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodFxuICAgICAgICB9ID0gc3dpcGVyO1xuICAgICAgICBsZXQgbmV3V2lkdGggPSB3aWR0aDtcbiAgICAgICAgbGV0IG5ld0hlaWdodCA9IGhlaWdodDtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKF9yZWYyID0+IHtcbiAgICAgICAgICBsZXQge1xuICAgICAgICAgICAgY29udGVudEJveFNpemUsXG4gICAgICAgICAgICBjb250ZW50UmVjdCxcbiAgICAgICAgICAgIHRhcmdldFxuICAgICAgICAgIH0gPSBfcmVmMjtcbiAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gc3dpcGVyLmVsKSByZXR1cm47XG4gICAgICAgICAgbmV3V2lkdGggPSBjb250ZW50UmVjdCA/IGNvbnRlbnRSZWN0LndpZHRoIDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5pbmxpbmVTaXplO1xuICAgICAgICAgIG5ld0hlaWdodCA9IGNvbnRlbnRSZWN0ID8gY29udGVudFJlY3QuaGVpZ2h0IDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5ibG9ja1NpemU7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobmV3V2lkdGggIT09IHdpZHRoIHx8IG5ld0hlaWdodCAhPT0gaGVpZ2h0KSB7XG4gICAgICAgICAgcmVzaXplSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHN3aXBlci5lbCk7XG4gIH07XG4gIGNvbnN0IHJlbW92ZU9ic2VydmVyID0gKCkgPT4ge1xuICAgIGlmIChhbmltYXRpb25GcmFtZSkge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkZyYW1lKTtcbiAgICB9XG4gICAgaWYgKG9ic2VydmVyICYmIG9ic2VydmVyLnVub2JzZXJ2ZSAmJiBzd2lwZXIuZWwpIHtcbiAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShzd2lwZXIuZWwpO1xuICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb3JpZW50YXRpb25DaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xuICAgIGVtaXQoJ29yaWVudGF0aW9uY2hhbmdlJyk7XG4gIH07XG4gIG9uKCdpbml0JywgKCkgPT4ge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnJlc2l6ZU9ic2VydmVyICYmIHR5cGVvZiB3aW5kb3cuUmVzaXplT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjcmVhdGVPYnNlcnZlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgb3JpZW50YXRpb25DaGFuZ2VIYW5kbGVyKTtcbiAgfSk7XG4gIG9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgIHJlbW92ZU9ic2VydmVyKCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBPYnNlcnZlcihfcmVmKSB7XG4gIGxldCB7XG4gICAgc3dpcGVyLFxuICAgIGV4dGVuZFBhcmFtcyxcbiAgICBvbixcbiAgICBlbWl0XG4gIH0gPSBfcmVmO1xuICBjb25zdCBvYnNlcnZlcnMgPSBbXTtcbiAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XG4gIGNvbnN0IGF0dGFjaCA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGNvbnN0IE9ic2VydmVyRnVuYyA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJraXRNdXRhdGlvbk9ic2VydmVyO1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE9ic2VydmVyRnVuYyhtdXRhdGlvbnMgPT4ge1xuICAgICAgLy8gVGhlIG9ic2VydmVyVXBkYXRlIGV2ZW50IHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZFxuICAgICAgLy8gb25jZSBkZXNwaXRlIHRoZSBudW1iZXIgb2YgbXV0YXRpb25zLiAgQWRkaXRpb25hbFxuICAgICAgLy8gdHJpZ2dlcnMgYXJlIHJlZHVuZGFudCBhbmQgYXJlIHZlcnkgY29zdGx5XG4gICAgICBpZiAoc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18pIHJldHVybjtcbiAgICAgIGlmIChtdXRhdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGVtaXQoJ29ic2VydmVyVXBkYXRlJywgbXV0YXRpb25zWzBdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2JzZXJ2ZXJVcGRhdGUgPSBmdW5jdGlvbiBvYnNlcnZlclVwZGF0ZSgpIHtcbiAgICAgICAgZW1pdCgnb2JzZXJ2ZXJVcGRhdGUnLCBtdXRhdGlvbnNbMF0pO1xuICAgICAgfTtcbiAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JzZXJ2ZXJVcGRhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQob2JzZXJ2ZXJVcGRhdGUsIDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0eXBlb2Ygb3B0aW9ucy5hdHRyaWJ1dGVzID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBvcHRpb25zLmF0dHJpYnV0ZXMsXG4gICAgICBjaGlsZExpc3Q6IHN3aXBlci5pc0VsZW1lbnQgfHwgKHR5cGVvZiBvcHRpb25zLmNoaWxkTGlzdCA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucykuY2hpbGRMaXN0LFxuICAgICAgY2hhcmFjdGVyRGF0YTogdHlwZW9mIG9wdGlvbnMuY2hhcmFjdGVyRGF0YSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5jaGFyYWN0ZXJEYXRhXG4gICAgfSk7XG4gICAgb2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICB9O1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5vYnNlcnZlcikgcmV0dXJuO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLm9ic2VydmVQYXJlbnRzKSB7XG4gICAgICBjb25zdCBjb250YWluZXJQYXJlbnRzID0gZWxlbWVudFBhcmVudHMoc3dpcGVyLmhvc3RFbCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lclBhcmVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXR0YWNoKGNvbnRhaW5lclBhcmVudHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPYnNlcnZlIGNvbnRhaW5lclxuICAgIGF0dGFjaChzd2lwZXIuaG9zdEVsLCB7XG4gICAgICBjaGlsZExpc3Q6IHN3aXBlci5wYXJhbXMub2JzZXJ2ZVNsaWRlQ2hpbGRyZW5cbiAgICB9KTtcblxuICAgIC8vIE9ic2VydmUgd3JhcHBlclxuICAgIGF0dGFjaChzd2lwZXIud3JhcHBlckVsLCB7XG4gICAgICBhdHRyaWJ1dGVzOiBmYWxzZVxuICAgIH0pO1xuICB9O1xuICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgIG9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICBvYnNlcnZlcnMuc3BsaWNlKDAsIG9ic2VydmVycy5sZW5ndGgpO1xuICB9O1xuICBleHRlbmRQYXJhbXMoe1xuICAgIG9ic2VydmVyOiBmYWxzZSxcbiAgICBvYnNlcnZlUGFyZW50czogZmFsc2UsXG4gICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IGZhbHNlXG4gIH0pO1xuICBvbignaW5pdCcsIGluaXQpO1xuICBvbignZGVzdHJveScsIGRlc3Ryb3kpO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuXG52YXIgZXZlbnRzRW1pdHRlciA9IHtcbiAgb24oZXZlbnRzLCBoYW5kbGVyLCBwcmlvcml0eSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHNlbGY7XG4gICAgY29uc3QgbWV0aG9kID0gcHJpb3JpdHkgPyAndW5zaGlmdCcgOiAncHVzaCc7XG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdID0gW107XG4gICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF1bbWV0aG9kXShoYW5kbGVyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfSxcbiAgb25jZShldmVudHMsIGhhbmRsZXIsIHByaW9yaXR5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gc2VsZjtcbiAgICBmdW5jdGlvbiBvbmNlSGFuZGxlcigpIHtcbiAgICAgIHNlbGYub2ZmKGV2ZW50cywgb25jZUhhbmRsZXIpO1xuICAgICAgaWYgKG9uY2VIYW5kbGVyLl9fZW1pdHRlclByb3h5KSB7XG4gICAgICAgIGRlbGV0ZSBvbmNlSGFuZGxlci5fX2VtaXR0ZXJQcm94eTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuICAgICAgaGFuZGxlci5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgb25jZUhhbmRsZXIuX19lbWl0dGVyUHJveHkgPSBoYW5kbGVyO1xuICAgIHJldHVybiBzZWxmLm9uKGV2ZW50cywgb25jZUhhbmRsZXIsIHByaW9yaXR5KTtcbiAgfSxcbiAgb25BbnkoaGFuZGxlciwgcHJpb3JpdHkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzIHx8IHNlbGYuZGVzdHJveWVkKSByZXR1cm4gc2VsZjtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHJldHVybiBzZWxmO1xuICAgIGNvbnN0IG1ldGhvZCA9IHByaW9yaXR5ID8gJ3Vuc2hpZnQnIDogJ3B1c2gnO1xuICAgIGlmIChzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xuICAgICAgc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnNbbWV0aG9kXShoYW5kbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0sXG4gIG9mZkFueShoYW5kbGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuIHNlbGY7XG4gICAgaWYgKCFzZWxmLmV2ZW50c0FueUxpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgY29uc3QgaW5kZXggPSBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZjtcbiAgfSxcbiAgb2ZmKGV2ZW50cywgaGFuZGxlcikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMpIHJldHVybiBzZWxmO1xuICAgIGV2ZW50cy5zcGxpdCgnICcpLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSB7XG4gICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5mb3JFYWNoKChldmVudEhhbmRsZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50SGFuZGxlciA9PT0gaGFuZGxlciB8fCBldmVudEhhbmRsZXIuX19lbWl0dGVyUHJveHkgJiYgZXZlbnRIYW5kbGVyLl9fZW1pdHRlclByb3h5ID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9LFxuICBlbWl0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMgfHwgc2VsZi5kZXN0cm95ZWQpIHJldHVybiBzZWxmO1xuICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnMpIHJldHVybiBzZWxmO1xuICAgIGxldCBldmVudHM7XG4gICAgbGV0IGRhdGE7XG4gICAgbGV0IGNvbnRleHQ7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xuICAgICAgZXZlbnRzID0gYXJnc1swXTtcbiAgICAgIGRhdGEgPSBhcmdzLnNsaWNlKDEsIGFyZ3MubGVuZ3RoKTtcbiAgICAgIGNvbnRleHQgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHMgPSBhcmdzWzBdLmV2ZW50cztcbiAgICAgIGRhdGEgPSBhcmdzWzBdLmRhdGE7XG4gICAgICBjb250ZXh0ID0gYXJnc1swXS5jb250ZXh0IHx8IHNlbGY7XG4gICAgfVxuICAgIGRhdGEudW5zaGlmdChjb250ZXh0KTtcbiAgICBjb25zdCBldmVudHNBcnJheSA9IEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IGV2ZW50cy5zcGxpdCgnICcpO1xuICAgIGV2ZW50c0FycmF5LmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzICYmIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVycy5mb3JFYWNoKGV2ZW50SGFuZGxlciA9PiB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyLmFwcGx5KGNvbnRleHQsIFtldmVudCwgLi4uZGF0YV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVycyAmJiBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goZXZlbnRIYW5kbGVyID0+IHtcbiAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG59O1xuXG5mdW5jdGlvbiB1cGRhdGVTaXplKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBsZXQgd2lkdGg7XG4gIGxldCBoZWlnaHQ7XG4gIGNvbnN0IGVsID0gc3dpcGVyLmVsO1xuICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMud2lkdGggIT09ICd1bmRlZmluZWQnICYmIHN3aXBlci5wYXJhbXMud2lkdGggIT09IG51bGwpIHtcbiAgICB3aWR0aCA9IHN3aXBlci5wYXJhbXMud2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgd2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgfVxuICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMuaGVpZ2h0ICE9PSAndW5kZWZpbmVkJyAmJiBzd2lwZXIucGFyYW1zLmhlaWdodCAhPT0gbnVsbCkge1xuICAgIGhlaWdodCA9IHN3aXBlci5wYXJhbXMuaGVpZ2h0O1xuICB9IGVsc2Uge1xuICAgIGhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgfVxuICBpZiAod2lkdGggPT09IDAgJiYgc3dpcGVyLmlzSG9yaXpvbnRhbCgpIHx8IGhlaWdodCA9PT0gMCAmJiBzd2lwZXIuaXNWZXJ0aWNhbCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3VidHJhY3QgcGFkZGluZ3NcbiAgd2lkdGggPSB3aWR0aCAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctbGVmdCcpIHx8IDAsIDEwKSAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctcmlnaHQnKSB8fCAwLCAxMCk7XG4gIGhlaWdodCA9IGhlaWdodCAtIHBhcnNlSW50KGVsZW1lbnRTdHlsZShlbCwgJ3BhZGRpbmctdG9wJykgfHwgMCwgMTApIC0gcGFyc2VJbnQoZWxlbWVudFN0eWxlKGVsLCAncGFkZGluZy1ib3R0b20nKSB8fCAwLCAxMCk7XG4gIGlmIChOdW1iZXIuaXNOYU4od2lkdGgpKSB3aWR0aCA9IDA7XG4gIGlmIChOdW1iZXIuaXNOYU4oaGVpZ2h0KSkgaGVpZ2h0ID0gMDtcbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgc2l6ZTogc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gd2lkdGggOiBoZWlnaHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlcygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgZnVuY3Rpb24gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShub2RlLCBsYWJlbCkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuZ2V0UHJvcGVydHlWYWx1ZShzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwobGFiZWwpKSB8fCAwKTtcbiAgfVxuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBjb25zdCB7XG4gICAgd3JhcHBlckVsLFxuICAgIHNsaWRlc0VsLFxuICAgIHNpemU6IHN3aXBlclNpemUsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgd3JvbmdSVExcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgY29uc3QgcHJldmlvdXNTbGlkZXNMZW5ndGggPSBpc1ZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gIGNvbnN0IHNsaWRlcyA9IGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICBjb25zdCBzbGlkZXNMZW5ndGggPSBpc1ZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc2xpZGVzLmxlbmd0aDtcbiAgbGV0IHNuYXBHcmlkID0gW107XG4gIGNvbnN0IHNsaWRlc0dyaWQgPSBbXTtcbiAgY29uc3Qgc2xpZGVzU2l6ZXNHcmlkID0gW107XG4gIGxldCBvZmZzZXRCZWZvcmUgPSBwYXJhbXMuc2xpZGVzT2Zmc2V0QmVmb3JlO1xuICBpZiAodHlwZW9mIG9mZnNldEJlZm9yZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9mZnNldEJlZm9yZSA9IHBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUuY2FsbChzd2lwZXIpO1xuICB9XG4gIGxldCBvZmZzZXRBZnRlciA9IHBhcmFtcy5zbGlkZXNPZmZzZXRBZnRlcjtcbiAgaWYgKHR5cGVvZiBvZmZzZXRBZnRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9mZnNldEFmdGVyID0gcGFyYW1zLnNsaWRlc09mZnNldEFmdGVyLmNhbGwoc3dpcGVyKTtcbiAgfVxuICBjb25zdCBwcmV2aW91c1NuYXBHcmlkTGVuZ3RoID0gc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcbiAgY29uc3QgcHJldmlvdXNTbGlkZXNHcmlkTGVuZ3RoID0gc3dpcGVyLnNsaWRlc0dyaWQubGVuZ3RoO1xuICBsZXQgc3BhY2VCZXR3ZWVuID0gcGFyYW1zLnNwYWNlQmV0d2VlbjtcbiAgbGV0IHNsaWRlUG9zaXRpb24gPSAtb2Zmc2V0QmVmb3JlO1xuICBsZXQgcHJldlNsaWRlU2l6ZSA9IDA7XG4gIGxldCBpbmRleCA9IDA7XG4gIGlmICh0eXBlb2Ygc3dpcGVyU2l6ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnICYmIHNwYWNlQmV0d2Vlbi5pbmRleE9mKCclJykgPj0gMCkge1xuICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuLnJlcGxhY2UoJyUnLCAnJykpIC8gMTAwICogc3dpcGVyU2l6ZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJykge1xuICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuKTtcbiAgfVxuICBzd2lwZXIudmlydHVhbFNpemUgPSAtc3BhY2VCZXR3ZWVuO1xuXG4gIC8vIHJlc2V0IG1hcmdpbnNcbiAgc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgaWYgKHJ0bCkge1xuICAgICAgc2xpZGVFbC5zdHlsZS5tYXJnaW5MZWZ0ID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlRWwuc3R5bGUubWFyZ2luUmlnaHQgPSAnJztcbiAgICB9XG4gICAgc2xpZGVFbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnJztcbiAgICBzbGlkZUVsLnN0eWxlLm1hcmdpblRvcCA9ICcnO1xuICB9KTtcblxuICAvLyByZXNldCBjc3NNb2RlIG9mZnNldHNcbiAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgIHNldENTU1Byb3BlcnR5KHdyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1iZWZvcmUnLCAnJyk7XG4gICAgc2V0Q1NTUHJvcGVydHkod3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWFmdGVyJywgJycpO1xuICB9XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDEgJiYgc3dpcGVyLmdyaWQ7XG4gIGlmIChncmlkRW5hYmxlZCkge1xuICAgIHN3aXBlci5ncmlkLmluaXRTbGlkZXMoc2xpZGVzKTtcbiAgfSBlbHNlIGlmIChzd2lwZXIuZ3JpZCkge1xuICAgIHN3aXBlci5ncmlkLnVuc2V0U2xpZGVzKCk7XG4gIH1cblxuICAvLyBDYWxjIHNsaWRlc1xuICBsZXQgc2xpZGVTaXplO1xuICBjb25zdCBzaG91bGRSZXNldFNsaWRlU2l6ZSA9IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLmJyZWFrcG9pbnRzICYmIE9iamVjdC5rZXlzKHBhcmFtcy5icmVha3BvaW50cykuZmlsdGVyKGtleSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBwYXJhbXMuYnJlYWtwb2ludHNba2V5XS5zbGlkZXNQZXJWaWV3ICE9PSAndW5kZWZpbmVkJztcbiAgfSkubGVuZ3RoID4gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNMZW5ndGg7IGkgKz0gMSkge1xuICAgIHNsaWRlU2l6ZSA9IDA7XG4gICAgbGV0IHNsaWRlO1xuICAgIGlmIChzbGlkZXNbaV0pIHNsaWRlID0gc2xpZGVzW2ldO1xuICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgc3dpcGVyLmdyaWQudXBkYXRlU2xpZGUoaSwgc2xpZGUsIHNsaWRlcyk7XG4gICAgfVxuICAgIGlmIChzbGlkZXNbaV0gJiYgZWxlbWVudFN0eWxlKHNsaWRlLCAnZGlzcGxheScpID09PSAnbm9uZScpIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICBpZiAocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZFJlc2V0U2xpZGVTaXplKSB7XG4gICAgICAgIHNsaWRlc1tpXS5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ3dpZHRoJyldID0gYGA7XG4gICAgICB9XG4gICAgICBjb25zdCBzbGlkZVN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoc2xpZGUpO1xuICAgICAgY29uc3QgY3VycmVudFRyYW5zZm9ybSA9IHNsaWRlLnN0eWxlLnRyYW5zZm9ybTtcbiAgICAgIGNvbnN0IGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0gPSBzbGlkZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm07XG4gICAgICBpZiAoY3VycmVudFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFdlYktpdFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykge1xuICAgICAgICBzbGlkZVNpemUgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBlbGVtZW50T3V0ZXJTaXplKHNsaWRlLCAnd2lkdGgnLCB0cnVlKSA6IGVsZW1lbnRPdXRlclNpemUoc2xpZGUsICdoZWlnaHQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBjb25zdCB3aWR0aCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICd3aWR0aCcpO1xuICAgICAgICBjb25zdCBwYWRkaW5nTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdwYWRkaW5nLWxlZnQnKTtcbiAgICAgICAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ3BhZGRpbmctcmlnaHQnKTtcbiAgICAgICAgY29uc3QgbWFyZ2luTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tbGVmdCcpO1xuICAgICAgICBjb25zdCBtYXJnaW5SaWdodCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tcmlnaHQnKTtcbiAgICAgICAgY29uc3QgYm94U2l6aW5nID0gc2xpZGVTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYm94LXNpemluZycpO1xuICAgICAgICBpZiAoYm94U2l6aW5nICYmIGJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICAgICAgc2xpZGVTaXplID0gd2lkdGggKyBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBvZmZzZXRXaWR0aFxuICAgICAgICAgIH0gPSBzbGlkZTtcbiAgICAgICAgICBzbGlkZVNpemUgPSB3aWR0aCArIHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0ICsgbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0ICsgKG9mZnNldFdpZHRoIC0gY2xpZW50V2lkdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFRyYW5zZm9ybSkge1xuICAgICAgICBzbGlkZS5zdHlsZS50cmFuc2Zvcm0gPSBjdXJyZW50VHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0pIHtcbiAgICAgICAgc2xpZGUuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gY3VycmVudFdlYktpdFRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVNpemUgPSBNYXRoLmZsb29yKHNsaWRlU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlU2l6ZSA9IChzd2lwZXJTaXplIC0gKHBhcmFtcy5zbGlkZXNQZXJWaWV3IC0gMSkgKiBzcGFjZUJldHdlZW4pIC8gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVTaXplID0gTWF0aC5mbG9vcihzbGlkZVNpemUpO1xuICAgICAgaWYgKHNsaWRlc1tpXSkge1xuICAgICAgICBzbGlkZXNbaV0uc3R5bGVbc3dpcGVyLmdldERpcmVjdGlvbkxhYmVsKCd3aWR0aCcpXSA9IGAke3NsaWRlU2l6ZX1weGA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzbGlkZXNbaV0pIHtcbiAgICAgIHNsaWRlc1tpXS5zd2lwZXJTbGlkZVNpemUgPSBzbGlkZVNpemU7XG4gICAgfVxuICAgIHNsaWRlc1NpemVzR3JpZC5wdXNoKHNsaWRlU2l6ZSk7XG4gICAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gKyBzbGlkZVNpemUgLyAyICsgcHJldlNsaWRlU2l6ZSAvIDIgKyBzcGFjZUJldHdlZW47XG4gICAgICBpZiAocHJldlNsaWRlU2l6ZSA9PT0gMCAmJiBpICE9PSAwKSBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiAtIHN3aXBlclNpemUgLyAyIC0gc3BhY2VCZXR3ZWVuO1xuICAgICAgaWYgKGkgPT09IDApIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uIC0gc3dpcGVyU2l6ZSAvIDIgLSBzcGFjZUJldHdlZW47XG4gICAgICBpZiAoTWF0aC5hYnMoc2xpZGVQb3NpdGlvbikgPCAxIC8gMTAwMCkgc2xpZGVQb3NpdGlvbiA9IDA7XG4gICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVQb3NpdGlvbiA9IE1hdGguZmxvb3Ioc2xpZGVQb3NpdGlvbik7XG4gICAgICBpZiAoaW5kZXggJSBwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDApIHNuYXBHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZXNHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVBvc2l0aW9uID0gTWF0aC5mbG9vcihzbGlkZVBvc2l0aW9uKTtcbiAgICAgIGlmICgoaW5kZXggLSBNYXRoLm1pbihzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgaW5kZXgpKSAlIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDApIHNuYXBHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZXNHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiArIHNsaWRlU2l6ZSArIHNwYWNlQmV0d2VlbjtcbiAgICB9XG4gICAgc3dpcGVyLnZpcnR1YWxTaXplICs9IHNsaWRlU2l6ZSArIHNwYWNlQmV0d2VlbjtcbiAgICBwcmV2U2xpZGVTaXplID0gc2xpZGVTaXplO1xuICAgIGluZGV4ICs9IDE7XG4gIH1cbiAgc3dpcGVyLnZpcnR1YWxTaXplID0gTWF0aC5tYXgoc3dpcGVyLnZpcnR1YWxTaXplLCBzd2lwZXJTaXplKSArIG9mZnNldEFmdGVyO1xuICBpZiAocnRsICYmIHdyb25nUlRMICYmIChwYXJhbXMuZWZmZWN0ID09PSAnc2xpZGUnIHx8IHBhcmFtcy5lZmZlY3QgPT09ICdjb3ZlcmZsb3cnKSkge1xuICAgIHdyYXBwZXJFbC5zdHlsZS53aWR0aCA9IGAke3N3aXBlci52aXJ0dWFsU2l6ZSArIHNwYWNlQmV0d2Vlbn1weGA7XG4gIH1cbiAgaWYgKHBhcmFtcy5zZXRXcmFwcGVyU2l6ZSkge1xuICAgIHdyYXBwZXJFbC5zdHlsZVtzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ3dpZHRoJyldID0gYCR7c3dpcGVyLnZpcnR1YWxTaXplICsgc3BhY2VCZXR3ZWVufXB4YDtcbiAgfVxuICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICBzd2lwZXIuZ3JpZC51cGRhdGVXcmFwcGVyU2l6ZShzbGlkZVNpemUsIHNuYXBHcmlkKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBsYXN0IGdyaWQgZWxlbWVudHMgZGVwZW5kaW5nIG9uIHdpZHRoXG4gIGlmICghcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgY29uc3QgbmV3U2xpZGVzR3JpZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc25hcEdyaWQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBzbGlkZXNHcmlkSXRlbSA9IHNuYXBHcmlkW2ldO1xuICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlc0dyaWRJdGVtID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkSXRlbSk7XG4gICAgICBpZiAoc25hcEdyaWRbaV0gPD0gc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSkge1xuICAgICAgICBuZXdTbGlkZXNHcmlkLnB1c2goc2xpZGVzR3JpZEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzbmFwR3JpZCA9IG5ld1NsaWRlc0dyaWQ7XG4gICAgaWYgKE1hdGguZmxvb3Ioc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSkgLSBNYXRoLmZsb29yKHNuYXBHcmlkW3NuYXBHcmlkLmxlbmd0aCAtIDFdKSA+IDEpIHtcbiAgICAgIHNuYXBHcmlkLnB1c2goc3dpcGVyLnZpcnR1YWxTaXplIC0gc3dpcGVyU2l6ZSk7XG4gICAgfVxuICB9XG4gIGlmIChpc1ZpcnR1YWwgJiYgcGFyYW1zLmxvb3ApIHtcbiAgICBjb25zdCBzaXplID0gc2xpZGVzU2l6ZXNHcmlkWzBdICsgc3BhY2VCZXR3ZWVuO1xuICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyR3JvdXAgPiAxKSB7XG4gICAgICBjb25zdCBncm91cHMgPSBNYXRoLmNlaWwoKHN3aXBlci52aXJ0dWFsLnNsaWRlc0JlZm9yZSArIHN3aXBlci52aXJ0dWFsLnNsaWRlc0FmdGVyKSAvIHBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gICAgICBjb25zdCBncm91cFNpemUgPSBzaXplICogcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHM7IGkgKz0gMSkge1xuICAgICAgICBzbmFwR3JpZC5wdXNoKHNuYXBHcmlkW3NuYXBHcmlkLmxlbmd0aCAtIDFdICsgZ3JvdXBTaXplKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmUgKyBzd2lwZXIudmlydHVhbC5zbGlkZXNBZnRlcjsgaSArPSAxKSB7XG4gICAgICBpZiAocGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxKSB7XG4gICAgICAgIHNuYXBHcmlkLnB1c2goc25hcEdyaWRbc25hcEdyaWQubGVuZ3RoIC0gMV0gKyBzaXplKTtcbiAgICAgIH1cbiAgICAgIHNsaWRlc0dyaWQucHVzaChzbGlkZXNHcmlkW3NsaWRlc0dyaWQubGVuZ3RoIC0gMV0gKyBzaXplKTtcbiAgICAgIHN3aXBlci52aXJ0dWFsU2l6ZSArPSBzaXplO1xuICAgIH1cbiAgfVxuICBpZiAoc25hcEdyaWQubGVuZ3RoID09PSAwKSBzbmFwR3JpZCA9IFswXTtcbiAgaWYgKHNwYWNlQmV0d2VlbiAhPT0gMCkge1xuICAgIGNvbnN0IGtleSA9IHN3aXBlci5pc0hvcml6b250YWwoKSAmJiBydGwgPyAnbWFyZ2luTGVmdCcgOiBzd2lwZXIuZ2V0RGlyZWN0aW9uTGFiZWwoJ21hcmdpblJpZ2h0Jyk7XG4gICAgc2xpZGVzLmZpbHRlcigoXywgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgaWYgKCFwYXJhbXMuY3NzTW9kZSB8fCBwYXJhbXMubG9vcCkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoc2xpZGVJbmRleCA9PT0gc2xpZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgIHNsaWRlRWwuc3R5bGVba2V5XSA9IGAke3NwYWNlQmV0d2Vlbn1weGA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXNCb3VuZHMpIHtcbiAgICBsZXQgYWxsU2xpZGVzU2l6ZSA9IDA7XG4gICAgc2xpZGVzU2l6ZXNHcmlkLmZvckVhY2goc2xpZGVTaXplVmFsdWUgPT4ge1xuICAgICAgYWxsU2xpZGVzU2l6ZSArPSBzbGlkZVNpemVWYWx1ZSArIChzcGFjZUJldHdlZW4gfHwgMCk7XG4gICAgfSk7XG4gICAgYWxsU2xpZGVzU2l6ZSAtPSBzcGFjZUJldHdlZW47XG4gICAgY29uc3QgbWF4U25hcCA9IGFsbFNsaWRlc1NpemUgPiBzd2lwZXJTaXplID8gYWxsU2xpZGVzU2l6ZSAtIHN3aXBlclNpemUgOiAwO1xuICAgIHNuYXBHcmlkID0gc25hcEdyaWQubWFwKHNuYXAgPT4ge1xuICAgICAgaWYgKHNuYXAgPD0gMCkgcmV0dXJuIC1vZmZzZXRCZWZvcmU7XG4gICAgICBpZiAoc25hcCA+IG1heFNuYXApIHJldHVybiBtYXhTbmFwICsgb2Zmc2V0QWZ0ZXI7XG4gICAgICByZXR1cm4gc25hcDtcbiAgICB9KTtcbiAgfVxuICBpZiAocGFyYW1zLmNlbnRlckluc3VmZmljaWVudFNsaWRlcykge1xuICAgIGxldCBhbGxTbGlkZXNTaXplID0gMDtcbiAgICBzbGlkZXNTaXplc0dyaWQuZm9yRWFjaChzbGlkZVNpemVWYWx1ZSA9PiB7XG4gICAgICBhbGxTbGlkZXNTaXplICs9IHNsaWRlU2l6ZVZhbHVlICsgKHNwYWNlQmV0d2VlbiB8fCAwKTtcbiAgICB9KTtcbiAgICBhbGxTbGlkZXNTaXplIC09IHNwYWNlQmV0d2VlbjtcbiAgICBjb25zdCBvZmZzZXRTaXplID0gKHBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUgfHwgMCkgKyAocGFyYW1zLnNsaWRlc09mZnNldEFmdGVyIHx8IDApO1xuICAgIGlmIChhbGxTbGlkZXNTaXplICsgb2Zmc2V0U2l6ZSA8IHN3aXBlclNpemUpIHtcbiAgICAgIGNvbnN0IGFsbFNsaWRlc09mZnNldCA9IChzd2lwZXJTaXplIC0gYWxsU2xpZGVzU2l6ZSAtIG9mZnNldFNpemUpIC8gMjtcbiAgICAgIHNuYXBHcmlkLmZvckVhY2goKHNuYXAsIHNuYXBJbmRleCkgPT4ge1xuICAgICAgICBzbmFwR3JpZFtzbmFwSW5kZXhdID0gc25hcCAtIGFsbFNsaWRlc09mZnNldDtcbiAgICAgIH0pO1xuICAgICAgc2xpZGVzR3JpZC5mb3JFYWNoKChzbmFwLCBzbmFwSW5kZXgpID0+IHtcbiAgICAgICAgc2xpZGVzR3JpZFtzbmFwSW5kZXhdID0gc25hcCArIGFsbFNsaWRlc09mZnNldDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIHNsaWRlcyxcbiAgICBzbmFwR3JpZCxcbiAgICBzbGlkZXNHcmlkLFxuICAgIHNsaWRlc1NpemVzR3JpZFxuICB9KTtcbiAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuY3NzTW9kZSAmJiAhcGFyYW1zLmNlbnRlcmVkU2xpZGVzQm91bmRzKSB7XG4gICAgc2V0Q1NTUHJvcGVydHkod3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWJlZm9yZScsIGAkey1zbmFwR3JpZFswXX1weGApO1xuICAgIHNldENTU1Byb3BlcnR5KHdyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1hZnRlcicsIGAke3N3aXBlci5zaXplIC8gMiAtIHNsaWRlc1NpemVzR3JpZFtzbGlkZXNTaXplc0dyaWQubGVuZ3RoIC0gMV0gLyAyfXB4YCk7XG4gICAgY29uc3QgYWRkVG9TbmFwR3JpZCA9IC1zd2lwZXIuc25hcEdyaWRbMF07XG4gICAgY29uc3QgYWRkVG9TbGlkZXNHcmlkID0gLXN3aXBlci5zbGlkZXNHcmlkWzBdO1xuICAgIHN3aXBlci5zbmFwR3JpZCA9IHN3aXBlci5zbmFwR3JpZC5tYXAodiA9PiB2ICsgYWRkVG9TbmFwR3JpZCk7XG4gICAgc3dpcGVyLnNsaWRlc0dyaWQgPSBzd2lwZXIuc2xpZGVzR3JpZC5tYXAodiA9PiB2ICsgYWRkVG9TbGlkZXNHcmlkKTtcbiAgfVxuICBpZiAoc2xpZGVzTGVuZ3RoICE9PSBwcmV2aW91c1NsaWRlc0xlbmd0aCkge1xuICAgIHN3aXBlci5lbWl0KCdzbGlkZXNMZW5ndGhDaGFuZ2UnKTtcbiAgfVxuICBpZiAoc25hcEdyaWQubGVuZ3RoICE9PSBwcmV2aW91c1NuYXBHcmlkTGVuZ3RoKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdykgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcbiAgICBzd2lwZXIuZW1pdCgnc25hcEdyaWRMZW5ndGhDaGFuZ2UnKTtcbiAgfVxuICBpZiAoc2xpZGVzR3JpZC5sZW5ndGggIT09IHByZXZpb3VzU2xpZGVzR3JpZExlbmd0aCkge1xuICAgIHN3aXBlci5lbWl0KCdzbGlkZXNHcmlkTGVuZ3RoQ2hhbmdlJyk7XG4gIH1cbiAgaWYgKHBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzKSB7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlc09mZnNldCgpO1xuICB9XG4gIHN3aXBlci5lbWl0KCdzbGlkZXNVcGRhdGVkJyk7XG4gIGlmICghaXNWaXJ0dWFsICYmICFwYXJhbXMuY3NzTW9kZSAmJiAocGFyYW1zLmVmZmVjdCA9PT0gJ3NsaWRlJyB8fCBwYXJhbXMuZWZmZWN0ID09PSAnZmFkZScpKSB7XG4gICAgY29uc3QgYmFja0ZhY2VIaWRkZW5DbGFzcyA9IGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWJhY2tmYWNlLWhpZGRlbmA7XG4gICAgY29uc3QgaGFzQ2xhc3NCYWNrZmFjZUNsYXNzQWRkZWQgPSBzd2lwZXIuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGJhY2tGYWNlSGlkZGVuQ2xhc3MpO1xuICAgIGlmIChzbGlkZXNMZW5ndGggPD0gcGFyYW1zLm1heEJhY2tmYWNlSGlkZGVuU2xpZGVzKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzQmFja2ZhY2VDbGFzc0FkZGVkKSBzd2lwZXIuZWwuY2xhc3NMaXN0LmFkZChiYWNrRmFjZUhpZGRlbkNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGhhc0NsYXNzQmFja2ZhY2VDbGFzc0FkZGVkKSB7XG4gICAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZShiYWNrRmFjZUhpZGRlbkNsYXNzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXV0b0hlaWdodChzcGVlZCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBhY3RpdmVTbGlkZXMgPSBbXTtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGxldCBuZXdIZWlnaHQgPSAwO1xuICBsZXQgaTtcbiAgaWYgKHR5cGVvZiBzcGVlZCA9PT0gJ251bWJlcicpIHtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihzcGVlZCk7XG4gIH0gZWxzZSBpZiAoc3BlZWQgPT09IHRydWUpIHtcbiAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihzd2lwZXIucGFyYW1zLnNwZWVkKTtcbiAgfVxuICBjb25zdCBnZXRTbGlkZUJ5SW5kZXggPSBpbmRleCA9PiB7XG4gICAgaWYgKGlzVmlydHVhbCkge1xuICAgICAgcmV0dXJuIHN3aXBlci5zbGlkZXNbc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEoaW5kZXgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHN3aXBlci5zbGlkZXNbaW5kZXhdO1xuICB9O1xuICAvLyBGaW5kIHNsaWRlcyBjdXJyZW50bHkgaW4gdmlld1xuICBpZiAoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ICE9PSAnYXV0bycgJiYgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSkge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAoc3dpcGVyLnZpc2libGVTbGlkZXMgfHwgW10pLmZvckVhY2goc2xpZGUgPT4ge1xuICAgICAgICBhY3RpdmVTbGlkZXMucHVzaChzbGlkZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMDsgaSA8IE1hdGguY2VpbChzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcpOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXggKyBpO1xuICAgICAgICBpZiAoaW5kZXggPiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAmJiAhaXNWaXJ0dWFsKSBicmVhaztcbiAgICAgICAgYWN0aXZlU2xpZGVzLnB1c2goZ2V0U2xpZGVCeUluZGV4KGluZGV4KSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFjdGl2ZVNsaWRlcy5wdXNoKGdldFNsaWRlQnlJbmRleChzd2lwZXIuYWN0aXZlSW5kZXgpKTtcbiAgfVxuXG4gIC8vIEZpbmQgbmV3IGhlaWdodCBmcm9tIGhpZ2hlc3Qgc2xpZGUgaW4gdmlld1xuICBmb3IgKGkgPSAwOyBpIDwgYWN0aXZlU2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHR5cGVvZiBhY3RpdmVTbGlkZXNbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBoZWlnaHQgPSBhY3RpdmVTbGlkZXNbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgbmV3SGVpZ2h0ID0gaGVpZ2h0ID4gbmV3SGVpZ2h0ID8gaGVpZ2h0IDogbmV3SGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZSBIZWlnaHRcbiAgaWYgKG5ld0hlaWdodCB8fCBuZXdIZWlnaHQgPT09IDApIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuaGVpZ2h0ID0gYCR7bmV3SGVpZ2h0fXB4YDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU2xpZGVzT2Zmc2V0KCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBzbGlkZXMgPSBzd2lwZXIuc2xpZGVzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3QgbWludXNPZmZzZXQgPSBzd2lwZXIuaXNFbGVtZW50ID8gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gc3dpcGVyLndyYXBwZXJFbC5vZmZzZXRMZWZ0IDogc3dpcGVyLndyYXBwZXJFbC5vZmZzZXRUb3AgOiAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHNsaWRlc1tpXS5zd2lwZXJTbGlkZU9mZnNldCA9IChzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBzbGlkZXNbaV0ub2Zmc2V0TGVmdCA6IHNsaWRlc1tpXS5vZmZzZXRUb3ApIC0gbWludXNPZmZzZXQgLSBzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCk7XG4gIH1cbn1cblxuY29uc3QgdG9nZ2xlU2xpZGVDbGFzc2VzJDEgPSAoc2xpZGVFbCwgY29uZGl0aW9uLCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKGNvbmRpdGlvbiAmJiAhc2xpZGVFbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgIHNsaWRlRWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICB9IGVsc2UgaWYgKCFjb25kaXRpb24gJiYgc2xpZGVFbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgIHNsaWRlRWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9XG59O1xuZnVuY3Rpb24gdXBkYXRlU2xpZGVzUHJvZ3Jlc3ModHJhbnNsYXRlKSB7XG4gIGlmICh0cmFuc2xhdGUgPT09IHZvaWQgMCkge1xuICAgIHRyYW5zbGF0ZSA9IHRoaXMgJiYgdGhpcy50cmFuc2xhdGUgfHwgMDtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBjb25zdCB7XG4gICAgc2xpZGVzLFxuICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgIHNuYXBHcmlkXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChzbGlkZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gIGlmICh0eXBlb2Ygc2xpZGVzWzBdLnN3aXBlclNsaWRlT2Zmc2V0ID09PSAndW5kZWZpbmVkJykgc3dpcGVyLnVwZGF0ZVNsaWRlc09mZnNldCgpO1xuICBsZXQgb2Zmc2V0Q2VudGVyID0gLXRyYW5zbGF0ZTtcbiAgaWYgKHJ0bCkgb2Zmc2V0Q2VudGVyID0gdHJhbnNsYXRlO1xuICBzd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMgPSBbXTtcbiAgc3dpcGVyLnZpc2libGVTbGlkZXMgPSBbXTtcbiAgbGV0IHNwYWNlQmV0d2VlbiA9IHBhcmFtcy5zcGFjZUJldHdlZW47XG4gIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJyAmJiBzcGFjZUJldHdlZW4uaW5kZXhPZignJScpID49IDApIHtcbiAgICBzcGFjZUJldHdlZW4gPSBwYXJzZUZsb2F0KHNwYWNlQmV0d2Vlbi5yZXBsYWNlKCclJywgJycpKSAvIDEwMCAqIHN3aXBlci5zaXplO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgc3BhY2VCZXR3ZWVuID0gcGFyc2VGbG9hdChzcGFjZUJldHdlZW4pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgc2xpZGUgPSBzbGlkZXNbaV07XG4gICAgbGV0IHNsaWRlT2Zmc2V0ID0gc2xpZGUuc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgaWYgKHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgc2xpZGVPZmZzZXQgLT0gc2xpZGVzWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgIH1cbiAgICBjb25zdCBzbGlkZVByb2dyZXNzID0gKG9mZnNldENlbnRlciArIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgOiAwKSAtIHNsaWRlT2Zmc2V0KSAvIChzbGlkZS5zd2lwZXJTbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pO1xuICAgIGNvbnN0IG9yaWdpbmFsU2xpZGVQcm9ncmVzcyA9IChvZmZzZXRDZW50ZXIgLSBzbmFwR3JpZFswXSArIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgOiAwKSAtIHNsaWRlT2Zmc2V0KSAvIChzbGlkZS5zd2lwZXJTbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pO1xuICAgIGNvbnN0IHNsaWRlQmVmb3JlID0gLShvZmZzZXRDZW50ZXIgLSBzbGlkZU9mZnNldCk7XG4gICAgY29uc3Qgc2xpZGVBZnRlciA9IHNsaWRlQmVmb3JlICsgc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtpXTtcbiAgICBjb25zdCBpc0Z1bGx5VmlzaWJsZSA9IHNsaWRlQmVmb3JlID49IDAgJiYgc2xpZGVCZWZvcmUgPD0gc3dpcGVyLnNpemUgLSBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW2ldO1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNsaWRlQmVmb3JlID49IDAgJiYgc2xpZGVCZWZvcmUgPCBzd2lwZXIuc2l6ZSAtIDEgfHwgc2xpZGVBZnRlciA+IDEgJiYgc2xpZGVBZnRlciA8PSBzd2lwZXIuc2l6ZSB8fCBzbGlkZUJlZm9yZSA8PSAwICYmIHNsaWRlQWZ0ZXIgPj0gc3dpcGVyLnNpemU7XG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXMucHVzaChzbGlkZSk7XG4gICAgICBzd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMucHVzaChpKTtcbiAgICB9XG4gICAgdG9nZ2xlU2xpZGVDbGFzc2VzJDEoc2xpZGUsIGlzVmlzaWJsZSwgcGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzKTtcbiAgICB0b2dnbGVTbGlkZUNsYXNzZXMkMShzbGlkZSwgaXNGdWxseVZpc2libGUsIHBhcmFtcy5zbGlkZUZ1bGx5VmlzaWJsZUNsYXNzKTtcbiAgICBzbGlkZS5wcm9ncmVzcyA9IHJ0bCA/IC1zbGlkZVByb2dyZXNzIDogc2xpZGVQcm9ncmVzcztcbiAgICBzbGlkZS5vcmlnaW5hbFByb2dyZXNzID0gcnRsID8gLW9yaWdpbmFsU2xpZGVQcm9ncmVzcyA6IG9yaWdpbmFsU2xpZGVQcm9ncmVzcztcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHR5cGVvZiB0cmFuc2xhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgbXVsdGlwbGllciA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtMSA6IDE7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgdHJhbnNsYXRlID0gc3dpcGVyICYmIHN3aXBlci50cmFuc2xhdGUgJiYgc3dpcGVyLnRyYW5zbGF0ZSAqIG11bHRpcGxpZXIgfHwgMDtcbiAgfVxuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgbGV0IHtcbiAgICBwcm9ncmVzcyxcbiAgICBpc0JlZ2lubmluZyxcbiAgICBpc0VuZCxcbiAgICBwcm9ncmVzc0xvb3BcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3Qgd2FzQmVnaW5uaW5nID0gaXNCZWdpbm5pbmc7XG4gIGNvbnN0IHdhc0VuZCA9IGlzRW5kO1xuICBpZiAodHJhbnNsYXRlc0RpZmYgPT09IDApIHtcbiAgICBwcm9ncmVzcyA9IDA7XG4gICAgaXNCZWdpbm5pbmcgPSB0cnVlO1xuICAgIGlzRW5kID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBwcm9ncmVzcyA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XG4gICAgY29uc3QgaXNCZWdpbm5pbmdSb3VuZGVkID0gTWF0aC5hYnModHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSA8IDE7XG4gICAgY29uc3QgaXNFbmRSb3VuZGVkID0gTWF0aC5hYnModHJhbnNsYXRlIC0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSA8IDE7XG4gICAgaXNCZWdpbm5pbmcgPSBpc0JlZ2lubmluZ1JvdW5kZWQgfHwgcHJvZ3Jlc3MgPD0gMDtcbiAgICBpc0VuZCA9IGlzRW5kUm91bmRlZCB8fCBwcm9ncmVzcyA+PSAxO1xuICAgIGlmIChpc0JlZ2lubmluZ1JvdW5kZWQpIHByb2dyZXNzID0gMDtcbiAgICBpZiAoaXNFbmRSb3VuZGVkKSBwcm9ncmVzcyA9IDE7XG4gIH1cbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgY29uc3QgZmlyc3RTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEoMCk7XG4gICAgY29uc3QgbGFzdFNsaWRlSW5kZXggPSBzd2lwZXIuZ2V0U2xpZGVJbmRleEJ5RGF0YShzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IGZpcnN0U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFtmaXJzdFNsaWRlSW5kZXhdO1xuICAgIGNvbnN0IGxhc3RTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2xhc3RTbGlkZUluZGV4XTtcbiAgICBjb25zdCB0cmFuc2xhdGVNYXggPSBzd2lwZXIuc2xpZGVzR3JpZFtzd2lwZXIuc2xpZGVzR3JpZC5sZW5ndGggLSAxXTtcbiAgICBjb25zdCB0cmFuc2xhdGVBYnMgPSBNYXRoLmFicyh0cmFuc2xhdGUpO1xuICAgIGlmICh0cmFuc2xhdGVBYnMgPj0gZmlyc3RTbGlkZVRyYW5zbGF0ZSkge1xuICAgICAgcHJvZ3Jlc3NMb29wID0gKHRyYW5zbGF0ZUFicyAtIGZpcnN0U2xpZGVUcmFuc2xhdGUpIC8gdHJhbnNsYXRlTWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9ncmVzc0xvb3AgPSAodHJhbnNsYXRlQWJzICsgdHJhbnNsYXRlTWF4IC0gbGFzdFNsaWRlVHJhbnNsYXRlKSAvIHRyYW5zbGF0ZU1heDtcbiAgICB9XG4gICAgaWYgKHByb2dyZXNzTG9vcCA+IDEpIHByb2dyZXNzTG9vcCAtPSAxO1xuICB9XG4gIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgcHJvZ3Jlc3MsXG4gICAgcHJvZ3Jlc3NMb29wLFxuICAgIGlzQmVnaW5uaW5nLFxuICAgIGlzRW5kXG4gIH0pO1xuICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgfHwgcGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5hdXRvSGVpZ2h0KSBzd2lwZXIudXBkYXRlU2xpZGVzUHJvZ3Jlc3ModHJhbnNsYXRlKTtcbiAgaWYgKGlzQmVnaW5uaW5nICYmICF3YXNCZWdpbm5pbmcpIHtcbiAgICBzd2lwZXIuZW1pdCgncmVhY2hCZWdpbm5pbmcgdG9FZGdlJyk7XG4gIH1cbiAgaWYgKGlzRW5kICYmICF3YXNFbmQpIHtcbiAgICBzd2lwZXIuZW1pdCgncmVhY2hFbmQgdG9FZGdlJyk7XG4gIH1cbiAgaWYgKHdhc0JlZ2lubmluZyAmJiAhaXNCZWdpbm5pbmcgfHwgd2FzRW5kICYmICFpc0VuZCkge1xuICAgIHN3aXBlci5lbWl0KCdmcm9tRWRnZScpO1xuICB9XG4gIHN3aXBlci5lbWl0KCdwcm9ncmVzcycsIHByb2dyZXNzKTtcbn1cblxuY29uc3QgdG9nZ2xlU2xpZGVDbGFzc2VzID0gKHNsaWRlRWwsIGNvbmRpdGlvbiwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmIChjb25kaXRpb24gJiYgIXNsaWRlRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICBzbGlkZUVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmICghY29uZGl0aW9uICYmIHNsaWRlRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlc0NsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXMsXG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsLFxuICAgIGFjdGl2ZUluZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGNvbnN0IGdldEZpbHRlcmVkU2xpZGUgPSBzZWxlY3RvciA9PiB7XG4gICAgcmV0dXJuIGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSR7c2VsZWN0b3J9LCBzd2lwZXItc2xpZGUke3NlbGVjdG9yfWApWzBdO1xuICB9O1xuICBsZXQgYWN0aXZlU2xpZGU7XG4gIGxldCBwcmV2U2xpZGU7XG4gIGxldCBuZXh0U2xpZGU7XG4gIGlmIChpc1ZpcnR1YWwpIHtcbiAgICBpZiAocGFyYW1zLmxvb3ApIHtcbiAgICAgIGxldCBzbGlkZUluZGV4ID0gYWN0aXZlSW5kZXggLSBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmU7XG4gICAgICBpZiAoc2xpZGVJbmRleCA8IDApIHNsaWRlSW5kZXggPSBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoICsgc2xpZGVJbmRleDtcbiAgICAgIGlmIChzbGlkZUluZGV4ID49IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGgpIHNsaWRlSW5kZXggLT0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aDtcbiAgICAgIGFjdGl2ZVNsaWRlID0gZ2V0RmlsdGVyZWRTbGlkZShgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzbGlkZUluZGV4fVwiXWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3RpdmVTbGlkZSA9IGdldEZpbHRlcmVkU2xpZGUoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7YWN0aXZlSW5kZXh9XCJdYCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5jb2x1bW4gPT09IGFjdGl2ZUluZGV4KVswXTtcbiAgICAgIG5leHRTbGlkZSA9IHNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNvbHVtbiA9PT0gYWN0aXZlSW5kZXggKyAxKVswXTtcbiAgICAgIHByZXZTbGlkZSA9IHNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNvbHVtbiA9PT0gYWN0aXZlSW5kZXggLSAxKVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXNbYWN0aXZlSW5kZXhdO1xuICAgIH1cbiAgfVxuICBpZiAoYWN0aXZlU2xpZGUpIHtcbiAgICBpZiAoIWdyaWRFbmFibGVkKSB7XG4gICAgICAvLyBOZXh0IFNsaWRlXG4gICAgICBuZXh0U2xpZGUgPSBlbGVtZW50TmV4dEFsbChhY3RpdmVTbGlkZSwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYClbMF07XG4gICAgICBpZiAocGFyYW1zLmxvb3AgJiYgIW5leHRTbGlkZSkge1xuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbMF07XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXYgU2xpZGVcbiAgICAgIHByZXZTbGlkZSA9IGVsZW1lbnRQcmV2QWxsKGFjdGl2ZVNsaWRlLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKVswXTtcbiAgICAgIGlmIChwYXJhbXMubG9vcCAmJiAhcHJldlNsaWRlID09PSAwKSB7XG4gICAgICAgIHByZXZTbGlkZSA9IHNsaWRlc1tzbGlkZXMubGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgIHRvZ2dsZVNsaWRlQ2xhc3NlcyhzbGlkZUVsLCBzbGlkZUVsID09PSBhY3RpdmVTbGlkZSwgcGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MpO1xuICAgIHRvZ2dsZVNsaWRlQ2xhc3NlcyhzbGlkZUVsLCBzbGlkZUVsID09PSBuZXh0U2xpZGUsIHBhcmFtcy5zbGlkZU5leHRDbGFzcyk7XG4gICAgdG9nZ2xlU2xpZGVDbGFzc2VzKHNsaWRlRWwsIHNsaWRlRWwgPT09IHByZXZTbGlkZSwgcGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgfSk7XG4gIHN3aXBlci5lbWl0U2xpZGVzQ2xhc3NlcygpO1xufVxuXG5jb25zdCBwcm9jZXNzTGF6eVByZWxvYWRlciA9IChzd2lwZXIsIGltYWdlRWwpID0+IHtcbiAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLnBhcmFtcykgcmV0dXJuO1xuICBjb25zdCBzbGlkZVNlbGVjdG9yID0gKCkgPT4gc3dpcGVyLmlzRWxlbWVudCA/IGBzd2lwZXItc2xpZGVgIDogYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gO1xuICBjb25zdCBzbGlkZUVsID0gaW1hZ2VFbC5jbG9zZXN0KHNsaWRlU2VsZWN0b3IoKSk7XG4gIGlmIChzbGlkZUVsKSB7XG4gICAgbGV0IGxhenlFbCA9IHNsaWRlRWwucXVlcnlTZWxlY3RvcihgLiR7c3dpcGVyLnBhcmFtcy5sYXp5UHJlbG9hZGVyQ2xhc3N9YCk7XG4gICAgaWYgKCFsYXp5RWwgJiYgc3dpcGVyLmlzRWxlbWVudCkge1xuICAgICAgaWYgKHNsaWRlRWwuc2hhZG93Um9vdCkge1xuICAgICAgICBsYXp5RWwgPSBzbGlkZUVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcihgLiR7c3dpcGVyLnBhcmFtcy5sYXp5UHJlbG9hZGVyQ2xhc3N9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpbml0IGxhdGVyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHNsaWRlRWwuc2hhZG93Um9vdCkge1xuICAgICAgICAgICAgbGF6eUVsID0gc2xpZGVFbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoYC4ke3N3aXBlci5wYXJhbXMubGF6eVByZWxvYWRlckNsYXNzfWApO1xuICAgICAgICAgICAgaWYgKGxhenlFbCkgbGF6eUVsLnJlbW92ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsYXp5RWwpIGxhenlFbC5yZW1vdmUoKTtcbiAgfVxufTtcbmNvbnN0IHVubGF6eSA9IChzd2lwZXIsIGluZGV4KSA9PiB7XG4gIGlmICghc3dpcGVyLnNsaWRlc1tpbmRleF0pIHJldHVybjtcbiAgY29uc3QgaW1hZ2VFbCA9IHN3aXBlci5zbGlkZXNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJ1tsb2FkaW5nPVwibGF6eVwiXScpO1xuICBpZiAoaW1hZ2VFbCkgaW1hZ2VFbC5yZW1vdmVBdHRyaWJ1dGUoJ2xvYWRpbmcnKTtcbn07XG5jb25zdCBwcmVsb2FkID0gc3dpcGVyID0+IHtcbiAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhc3dpcGVyLnBhcmFtcykgcmV0dXJuO1xuICBsZXQgYW1vdW50ID0gc3dpcGVyLnBhcmFtcy5sYXp5UHJlbG9hZFByZXZOZXh0O1xuICBjb25zdCBsZW4gPSBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgaWYgKCFsZW4gfHwgIWFtb3VudCB8fCBhbW91bnQgPCAwKSByZXR1cm47XG4gIGFtb3VudCA9IE1hdGgubWluKGFtb3VudCwgbGVuKTtcbiAgY29uc3Qgc2xpZGVzUGVyVmlldyA9IHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiBNYXRoLmNlaWwoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3KTtcbiAgY29uc3QgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gIGlmIChzd2lwZXIucGFyYW1zLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxKSB7XG4gICAgY29uc3QgYWN0aXZlQ29sdW1uID0gYWN0aXZlSW5kZXg7XG4gICAgY29uc3QgcHJlbG9hZENvbHVtbnMgPSBbYWN0aXZlQ29sdW1uIC0gYW1vdW50XTtcbiAgICBwcmVsb2FkQ29sdW1ucy5wdXNoKC4uLkFycmF5LmZyb20oe1xuICAgICAgbGVuZ3RoOiBhbW91bnRcbiAgICB9KS5tYXAoKF8sIGkpID0+IHtcbiAgICAgIHJldHVybiBhY3RpdmVDb2x1bW4gKyBzbGlkZXNQZXJWaWV3ICsgaTtcbiAgICB9KSk7XG4gICAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKChzbGlkZUVsLCBpKSA9PiB7XG4gICAgICBpZiAocHJlbG9hZENvbHVtbnMuaW5jbHVkZXMoc2xpZGVFbC5jb2x1bW4pKSB1bmxhenkoc3dpcGVyLCBpKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc2xpZGVJbmRleExhc3RJblZpZXcgPSBhY3RpdmVJbmRleCArIHNsaWRlc1BlclZpZXcgLSAxO1xuICBpZiAoc3dpcGVyLnBhcmFtcy5yZXdpbmQgfHwgc3dpcGVyLnBhcmFtcy5sb29wKSB7XG4gICAgZm9yIChsZXQgaSA9IGFjdGl2ZUluZGV4IC0gYW1vdW50OyBpIDw9IHNsaWRlSW5kZXhMYXN0SW5WaWV3ICsgYW1vdW50OyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHJlYWxJbmRleCA9IChpICUgbGVuICsgbGVuKSAlIGxlbjtcbiAgICAgIGlmIChyZWFsSW5kZXggPCBhY3RpdmVJbmRleCB8fCByZWFsSW5kZXggPiBzbGlkZUluZGV4TGFzdEluVmlldykgdW5sYXp5KHN3aXBlciwgcmVhbEluZGV4KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IE1hdGgubWF4KGFjdGl2ZUluZGV4IC0gYW1vdW50LCAwKTsgaSA8PSBNYXRoLm1pbihzbGlkZUluZGV4TGFzdEluVmlldyArIGFtb3VudCwgbGVuIC0gMSk7IGkgKz0gMSkge1xuICAgICAgaWYgKGkgIT09IGFjdGl2ZUluZGV4ICYmIChpID4gc2xpZGVJbmRleExhc3RJblZpZXcgfHwgaSA8IGFjdGl2ZUluZGV4KSkge1xuICAgICAgICB1bmxhenkoc3dpcGVyLCBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldEFjdGl2ZUluZGV4QnlUcmFuc2xhdGUoc3dpcGVyKSB7XG4gIGNvbnN0IHtcbiAgICBzbGlkZXNHcmlkLFxuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xuICBsZXQgYWN0aXZlSW5kZXg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzR3JpZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmICh0eXBlb2Ygc2xpZGVzR3JpZFtpICsgMV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodHJhbnNsYXRlID49IHNsaWRlc0dyaWRbaV0gJiYgdHJhbnNsYXRlIDwgc2xpZGVzR3JpZFtpICsgMV0gLSAoc2xpZGVzR3JpZFtpICsgMV0gLSBzbGlkZXNHcmlkW2ldKSAvIDIpIHtcbiAgICAgICAgYWN0aXZlSW5kZXggPSBpO1xuICAgICAgfSBlbHNlIGlmICh0cmFuc2xhdGUgPj0gc2xpZGVzR3JpZFtpXSAmJiB0cmFuc2xhdGUgPCBzbGlkZXNHcmlkW2kgKyAxXSkge1xuICAgICAgICBhY3RpdmVJbmRleCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHJhbnNsYXRlID49IHNsaWRlc0dyaWRbaV0pIHtcbiAgICAgIGFjdGl2ZUluZGV4ID0gaTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIHNsaWRlSW5kZXhcbiAgaWYgKHBhcmFtcy5ub3JtYWxpemVTbGlkZUluZGV4KSB7XG4gICAgaWYgKGFjdGl2ZUluZGV4IDwgMCB8fCB0eXBlb2YgYWN0aXZlSW5kZXggPT09ICd1bmRlZmluZWQnKSBhY3RpdmVJbmRleCA9IDA7XG4gIH1cbiAgcmV0dXJuIGFjdGl2ZUluZGV4O1xufVxuZnVuY3Rpb24gdXBkYXRlQWN0aXZlSW5kZXgobmV3QWN0aXZlSW5kZXgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgY29uc3Qge1xuICAgIHNuYXBHcmlkLFxuICAgIHBhcmFtcyxcbiAgICBhY3RpdmVJbmRleDogcHJldmlvdXNJbmRleCxcbiAgICByZWFsSW5kZXg6IHByZXZpb3VzUmVhbEluZGV4LFxuICAgIHNuYXBJbmRleDogcHJldmlvdXNTbmFwSW5kZXhcbiAgfSA9IHN3aXBlcjtcbiAgbGV0IGFjdGl2ZUluZGV4ID0gbmV3QWN0aXZlSW5kZXg7XG4gIGxldCBzbmFwSW5kZXg7XG4gIGNvbnN0IGdldFZpcnR1YWxSZWFsSW5kZXggPSBhSW5kZXggPT4ge1xuICAgIGxldCByZWFsSW5kZXggPSBhSW5kZXggLSBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmU7XG4gICAgaWYgKHJlYWxJbmRleCA8IDApIHtcbiAgICAgIHJlYWxJbmRleCA9IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggKyByZWFsSW5kZXg7XG4gICAgfVxuICAgIGlmIChyZWFsSW5kZXggPj0gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCkge1xuICAgICAgcmVhbEluZGV4IC09IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiByZWFsSW5kZXg7XG4gIH07XG4gIGlmICh0eXBlb2YgYWN0aXZlSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgYWN0aXZlSW5kZXggPSBnZXRBY3RpdmVJbmRleEJ5VHJhbnNsYXRlKHN3aXBlcik7XG4gIH1cbiAgaWYgKHNuYXBHcmlkLmluZGV4T2YodHJhbnNsYXRlKSA+PSAwKSB7XG4gICAgc25hcEluZGV4ID0gc25hcEdyaWQuaW5kZXhPZih0cmFuc2xhdGUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNraXAgPSBNYXRoLm1pbihwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwLCBhY3RpdmVJbmRleCk7XG4gICAgc25hcEluZGV4ID0gc2tpcCArIE1hdGguZmxvb3IoKGFjdGl2ZUluZGV4IC0gc2tpcCkgLyBwYXJhbXMuc2xpZGVzUGVyR3JvdXApO1xuICB9XG4gIGlmIChzbmFwSW5kZXggPj0gc25hcEdyaWQubGVuZ3RoKSBzbmFwSW5kZXggPSBzbmFwR3JpZC5sZW5ndGggLSAxO1xuICBpZiAoYWN0aXZlSW5kZXggPT09IHByZXZpb3VzSW5kZXggJiYgIXN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgIGlmIChzbmFwSW5kZXggIT09IHByZXZpb3VzU25hcEluZGV4KSB7XG4gICAgICBzd2lwZXIuc25hcEluZGV4ID0gc25hcEluZGV4O1xuICAgICAgc3dpcGVyLmVtaXQoJ3NuYXBJbmRleENoYW5nZScpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjdGl2ZUluZGV4ID09PSBwcmV2aW91c0luZGV4ICYmIHN3aXBlci5wYXJhbXMubG9vcCAmJiBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgIHN3aXBlci5yZWFsSW5kZXggPSBnZXRWaXJ0dWFsUmVhbEluZGV4KGFjdGl2ZUluZGV4KTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBzd2lwZXIuZ3JpZCAmJiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMTtcblxuICAvLyBHZXQgcmVhbCBpbmRleFxuICBsZXQgcmVhbEluZGV4O1xuICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZCAmJiBwYXJhbXMubG9vcCkge1xuICAgIHJlYWxJbmRleCA9IGdldFZpcnR1YWxSZWFsSW5kZXgoYWN0aXZlSW5kZXgpO1xuICB9IGVsc2UgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgY29uc3QgZmlyc3RTbGlkZUluQ29sdW1uID0gc3dpcGVyLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmNvbHVtbiA9PT0gYWN0aXZlSW5kZXgpWzBdO1xuICAgIGxldCBhY3RpdmVTbGlkZUluZGV4ID0gcGFyc2VJbnQoZmlyc3RTbGlkZUluQ29sdW1uLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNOYU4oYWN0aXZlU2xpZGVJbmRleCkpIHtcbiAgICAgIGFjdGl2ZVNsaWRlSW5kZXggPSBNYXRoLm1heChzd2lwZXIuc2xpZGVzLmluZGV4T2YoZmlyc3RTbGlkZUluQ29sdW1uKSwgMCk7XG4gICAgfVxuICAgIHJlYWxJbmRleCA9IE1hdGguZmxvb3IoYWN0aXZlU2xpZGVJbmRleCAvIHBhcmFtcy5ncmlkLnJvd3MpO1xuICB9IGVsc2UgaWYgKHN3aXBlci5zbGlkZXNbYWN0aXZlSW5kZXhdKSB7XG4gICAgY29uc3Qgc2xpZGVJbmRleCA9IHN3aXBlci5zbGlkZXNbYWN0aXZlSW5kZXhdLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgcmVhbEluZGV4ID0gcGFyc2VJbnQoc2xpZGVJbmRleCwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWFsSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVhbEluZGV4ID0gYWN0aXZlSW5kZXg7XG4gIH1cbiAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICBwcmV2aW91c1NuYXBJbmRleCxcbiAgICBzbmFwSW5kZXgsXG4gICAgcHJldmlvdXNSZWFsSW5kZXgsXG4gICAgcmVhbEluZGV4LFxuICAgIHByZXZpb3VzSW5kZXgsXG4gICAgYWN0aXZlSW5kZXhcbiAgfSk7XG4gIGlmIChzd2lwZXIuaW5pdGlhbGl6ZWQpIHtcbiAgICBwcmVsb2FkKHN3aXBlcik7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ2FjdGl2ZUluZGV4Q2hhbmdlJyk7XG4gIHN3aXBlci5lbWl0KCdzbmFwSW5kZXhDaGFuZ2UnKTtcbiAgaWYgKHN3aXBlci5pbml0aWFsaXplZCB8fCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCkge1xuICAgIGlmIChwcmV2aW91c1JlYWxJbmRleCAhPT0gcmVhbEluZGV4KSB7XG4gICAgICBzd2lwZXIuZW1pdCgncmVhbEluZGV4Q2hhbmdlJyk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdzbGlkZUNoYW5nZScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNsaWNrZWRTbGlkZShlbCwgcGF0aCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xuICBsZXQgc2xpZGUgPSBlbC5jbG9zZXN0KGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICBpZiAoIXNsaWRlICYmIHN3aXBlci5pc0VsZW1lbnQgJiYgcGF0aCAmJiBwYXRoLmxlbmd0aCA+IDEgJiYgcGF0aC5pbmNsdWRlcyhlbCkpIHtcbiAgICBbLi4ucGF0aC5zbGljZShwYXRoLmluZGV4T2YoZWwpICsgMSwgcGF0aC5sZW5ndGgpXS5mb3JFYWNoKHBhdGhFbCA9PiB7XG4gICAgICBpZiAoIXNsaWRlICYmIHBhdGhFbC5tYXRjaGVzICYmIHBhdGhFbC5tYXRjaGVzKGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApKSB7XG4gICAgICAgIHNsaWRlID0gcGF0aEVsO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGxldCBzbGlkZUZvdW5kID0gZmFsc2U7XG4gIGxldCBzbGlkZUluZGV4O1xuICBpZiAoc2xpZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN3aXBlci5zbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChzd2lwZXIuc2xpZGVzW2ldID09PSBzbGlkZSkge1xuICAgICAgICBzbGlkZUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoc2xpZGUgJiYgc2xpZGVGb3VuZCkge1xuICAgIHN3aXBlci5jbGlja2VkU2xpZGUgPSBzbGlkZTtcbiAgICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSBwYXJzZUludChzbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JyksIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLmNsaWNrZWRJbmRleCA9IHNsaWRlSW5kZXg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHN3aXBlci5jbGlja2VkU2xpZGUgPSB1bmRlZmluZWQ7XG4gICAgc3dpcGVyLmNsaWNrZWRJbmRleCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHBhcmFtcy5zbGlkZVRvQ2xpY2tlZFNsaWRlICYmIHN3aXBlci5jbGlja2VkSW5kZXggIT09IHVuZGVmaW5lZCAmJiBzd2lwZXIuY2xpY2tlZEluZGV4ICE9PSBzd2lwZXIuYWN0aXZlSW5kZXgpIHtcbiAgICBzd2lwZXIuc2xpZGVUb0NsaWNrZWRTbGlkZSgpO1xuICB9XG59XG5cbnZhciB1cGRhdGUgPSB7XG4gIHVwZGF0ZVNpemUsXG4gIHVwZGF0ZVNsaWRlcyxcbiAgdXBkYXRlQXV0b0hlaWdodCxcbiAgdXBkYXRlU2xpZGVzT2Zmc2V0LFxuICB1cGRhdGVTbGlkZXNQcm9ncmVzcyxcbiAgdXBkYXRlUHJvZ3Jlc3MsXG4gIHVwZGF0ZVNsaWRlc0NsYXNzZXMsXG4gIHVwZGF0ZUFjdGl2ZUluZGV4LFxuICB1cGRhdGVDbGlja2VkU2xpZGVcbn07XG5cbmZ1bmN0aW9uIGdldFN3aXBlclRyYW5zbGF0ZShheGlzKSB7XG4gIGlmIChheGlzID09PSB2b2lkIDApIHtcbiAgICBheGlzID0gdGhpcy5pc0hvcml6b250YWwoKSA/ICd4JyA6ICd5JztcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgIHRyYW5zbGF0ZSxcbiAgICB3cmFwcGVyRWxcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKHBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB7XG4gICAgcmV0dXJuIHJ0bCA/IC10cmFuc2xhdGUgOiB0cmFuc2xhdGU7XG4gIH1cbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0ZTtcbiAgfVxuICBsZXQgY3VycmVudFRyYW5zbGF0ZSA9IGdldFRyYW5zbGF0ZSh3cmFwcGVyRWwsIGF4aXMpO1xuICBjdXJyZW50VHJhbnNsYXRlICs9IHN3aXBlci5jc3NPdmVyZmxvd0FkanVzdG1lbnQoKTtcbiAgaWYgKHJ0bCkgY3VycmVudFRyYW5zbGF0ZSA9IC1jdXJyZW50VHJhbnNsYXRlO1xuICByZXR1cm4gY3VycmVudFRyYW5zbGF0ZSB8fCAwO1xufVxuXG5mdW5jdGlvbiBzZXRUcmFuc2xhdGUodHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxuICAgIHBhcmFtcyxcbiAgICB3cmFwcGVyRWwsXG4gICAgcHJvZ3Jlc3NcbiAgfSA9IHN3aXBlcjtcbiAgbGV0IHggPSAwO1xuICBsZXQgeSA9IDA7XG4gIGNvbnN0IHogPSAwO1xuICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgeCA9IHJ0bCA/IC10cmFuc2xhdGUgOiB0cmFuc2xhdGU7XG4gIH0gZWxzZSB7XG4gICAgeSA9IHRyYW5zbGF0ZTtcbiAgfVxuICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykge1xuICAgIHggPSBNYXRoLmZsb29yKHgpO1xuICAgIHkgPSBNYXRoLmZsb29yKHkpO1xuICB9XG4gIHN3aXBlci5wcmV2aW91c1RyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XG4gIHN3aXBlci50cmFuc2xhdGUgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyB4IDogeTtcbiAgaWYgKHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgd3JhcHBlckVsW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdzY3JvbGxMZWZ0JyA6ICdzY3JvbGxUb3AnXSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IC14IDogLXk7XG4gIH0gZWxzZSBpZiAoIXBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB7XG4gICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xuICAgICAgeCAtPSBzd2lwZXIuY3NzT3ZlcmZsb3dBZGp1c3RtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkgLT0gc3dpcGVyLmNzc092ZXJmbG93QWRqdXN0bWVudCgpO1xuICAgIH1cbiAgICB3cmFwcGVyRWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7eH1weCwgJHt5fXB4LCAke3p9cHgpYDtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gdXBkYXRlIHByb2dyZXNzXG4gIGxldCBuZXdQcm9ncmVzcztcbiAgY29uc3QgdHJhbnNsYXRlc0RpZmYgPSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gIGlmICh0cmFuc2xhdGVzRGlmZiA9PT0gMCkge1xuICAgIG5ld1Byb2dyZXNzID0gMDtcbiAgfSBlbHNlIHtcbiAgICBuZXdQcm9ncmVzcyA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XG4gIH1cbiAgaWYgKG5ld1Byb2dyZXNzICE9PSBwcm9ncmVzcykge1xuICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpO1xuICB9XG4gIHN3aXBlci5lbWl0KCdzZXRUcmFuc2xhdGUnLCBzd2lwZXIudHJhbnNsYXRlLCBieUNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBtaW5UcmFuc2xhdGUoKSB7XG4gIHJldHVybiAtdGhpcy5zbmFwR3JpZFswXTtcbn1cblxuZnVuY3Rpb24gbWF4VHJhbnNsYXRlKCkge1xuICByZXR1cm4gLXRoaXMuc25hcEdyaWRbdGhpcy5zbmFwR3JpZC5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlVG8odHJhbnNsYXRlLCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCB0cmFuc2xhdGVCb3VuZHMsIGludGVybmFsKSB7XG4gIGlmICh0cmFuc2xhdGUgPT09IHZvaWQgMCkge1xuICAgIHRyYW5zbGF0ZSA9IDA7XG4gIH1cbiAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcbiAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgaWYgKHRyYW5zbGF0ZUJvdW5kcyA9PT0gdm9pZCAwKSB7XG4gICAgdHJhbnNsYXRlQm91bmRzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHdyYXBwZXJFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMucHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IG1pblRyYW5zbGF0ZSA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgY29uc3QgbWF4VHJhbnNsYXRlID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICBsZXQgbmV3VHJhbnNsYXRlO1xuICBpZiAodHJhbnNsYXRlQm91bmRzICYmIHRyYW5zbGF0ZSA+IG1pblRyYW5zbGF0ZSkgbmV3VHJhbnNsYXRlID0gbWluVHJhbnNsYXRlO2Vsc2UgaWYgKHRyYW5zbGF0ZUJvdW5kcyAmJiB0cmFuc2xhdGUgPCBtYXhUcmFuc2xhdGUpIG5ld1RyYW5zbGF0ZSA9IG1heFRyYW5zbGF0ZTtlbHNlIG5ld1RyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcblxuICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKG5ld1RyYW5zbGF0ZSk7XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIGNvbnN0IGlzSCA9IHN3aXBlci5pc0hvcml6b250YWwoKTtcbiAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgIHdyYXBwZXJFbFtpc0ggPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSAtbmV3VHJhbnNsYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXN3aXBlci5zdXBwb3J0LnNtb290aFNjcm9sbCkge1xuICAgICAgICBhbmltYXRlQ1NTTW9kZVNjcm9sbCh7XG4gICAgICAgICAgc3dpcGVyLFxuICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiAtbmV3VHJhbnNsYXRlLFxuICAgICAgICAgIHNpZGU6IGlzSCA/ICdsZWZ0JyA6ICd0b3AnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHdyYXBwZXJFbC5zY3JvbGxUbyh7XG4gICAgICAgIFtpc0ggPyAnbGVmdCcgOiAndG9wJ106IC1uZXdUcmFuc2xhdGUsXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChzcGVlZCA9PT0gMCkge1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKDApO1xuICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3VHJhbnNsYXRlKTtcbiAgICBpZiAocnVuQ2FsbGJhY2tzKSB7XG4gICAgICBzd2lwZXIuZW1pdCgnYmVmb3JlVHJhbnNpdGlvblN0YXJ0Jywgc3BlZWQsIGludGVybmFsKTtcbiAgICAgIHN3aXBlci5lbWl0KCd0cmFuc2l0aW9uRW5kJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcbiAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1RyYW5zbGF0ZSk7XG4gICAgaWYgKHJ1bkNhbGxiYWNrcykge1xuICAgICAgc3dpcGVyLmVtaXQoJ2JlZm9yZVRyYW5zaXRpb25TdGFydCcsIHNwZWVkLCBpbnRlcm5hbCk7XG4gICAgICBzd2lwZXIuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG4gICAgfVxuICAgIGlmICghc3dpcGVyLmFuaW1hdGluZykge1xuICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICBpZiAoIXN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpIHtcbiAgICAgICAgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoZSkge1xuICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMpIHJldHVybjtcbiAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgICBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gbnVsbDtcbiAgICAgICAgICBkZWxldGUgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZDtcbiAgICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJ1bkNhbGxiYWNrcykge1xuICAgICAgICAgICAgc3dpcGVyLmVtaXQoJ3RyYW5zaXRpb25FbmQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzd2lwZXIud3JhcHBlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciB0cmFuc2xhdGUgPSB7XG4gIGdldFRyYW5zbGF0ZTogZ2V0U3dpcGVyVHJhbnNsYXRlLFxuICBzZXRUcmFuc2xhdGUsXG4gIG1pblRyYW5zbGF0ZSxcbiAgbWF4VHJhbnNsYXRlLFxuICB0cmFuc2xhdGVUb1xufTtcblxuZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmICghc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkdXJhdGlvbiA9PT0gMCA/IGAwbXNgIDogJyc7XG4gIH1cbiAgc3dpcGVyLmVtaXQoJ3NldFRyYW5zaXRpb24nLCBkdXJhdGlvbiwgYnlDb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkVtaXQoX3JlZikge1xuICBsZXQge1xuICAgIHN3aXBlcixcbiAgICBydW5DYWxsYmFja3MsXG4gICAgZGlyZWN0aW9uLFxuICAgIHN0ZXBcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVJbmRleCxcbiAgICBwcmV2aW91c0luZGV4XG4gIH0gPSBzd2lwZXI7XG4gIGxldCBkaXIgPSBkaXJlY3Rpb247XG4gIGlmICghZGlyKSB7XG4gICAgaWYgKGFjdGl2ZUluZGV4ID4gcHJldmlvdXNJbmRleCkgZGlyID0gJ25leHQnO2Vsc2UgaWYgKGFjdGl2ZUluZGV4IDwgcHJldmlvdXNJbmRleCkgZGlyID0gJ3ByZXYnO2Vsc2UgZGlyID0gJ3Jlc2V0JztcbiAgfVxuICBzd2lwZXIuZW1pdChgdHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgaWYgKHJ1bkNhbGxiYWNrcyAmJiBhY3RpdmVJbmRleCAhPT0gcHJldmlvdXNJbmRleCkge1xuICAgIGlmIChkaXIgPT09ICdyZXNldCcpIHtcbiAgICAgIHN3aXBlci5lbWl0KGBzbGlkZVJlc2V0VHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoYHNsaWRlQ2hhbmdlVHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICBpZiAoZGlyID09PSAnbmV4dCcpIHtcbiAgICAgIHN3aXBlci5lbWl0KGBzbGlkZU5leHRUcmFuc2l0aW9uJHtzdGVwfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXIuZW1pdChgc2xpZGVQcmV2VHJhbnNpdGlvbiR7c3RlcH1gKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKSB7XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgfVxuICB0cmFuc2l0aW9uRW1pdCh7XG4gICAgc3dpcGVyLFxuICAgIHJ1bkNhbGxiYWNrcyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc3RlcDogJ1N0YXJ0J1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChydW5DYWxsYmFja3MsIGRpcmVjdGlvbikge1xuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXNcbiAgfSA9IHN3aXBlcjtcbiAgc3dpcGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICBpZiAocGFyYW1zLmNzc01vZGUpIHJldHVybjtcbiAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gIHRyYW5zaXRpb25FbWl0KHtcbiAgICBzd2lwZXIsXG4gICAgcnVuQ2FsbGJhY2tzLFxuICAgIGRpcmVjdGlvbixcbiAgICBzdGVwOiAnRW5kJ1xuICB9KTtcbn1cblxudmFyIHRyYW5zaXRpb24gPSB7XG4gIHNldFRyYW5zaXRpb24sXG4gIHRyYW5zaXRpb25TdGFydCxcbiAgdHJhbnNpdGlvbkVuZFxufTtcblxuZnVuY3Rpb24gc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwsIGluaXRpYWwpIHtcbiAgaWYgKGluZGV4ID09PSB2b2lkIDApIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIGluZGV4ID09PSAnc3RyaW5nJykge1xuICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgsIDEwKTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBsZXQgc2xpZGVJbmRleCA9IGluZGV4O1xuICBpZiAoc2xpZGVJbmRleCA8IDApIHNsaWRlSW5kZXggPSAwO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHNuYXBHcmlkLFxuICAgIHNsaWRlc0dyaWQsXG4gICAgcHJldmlvdXNJbmRleCxcbiAgICBhY3RpdmVJbmRleCxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICB3cmFwcGVyRWwsXG4gICAgZW5hYmxlZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQgJiYgIWludGVybmFsICYmICFpbml0aWFsIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMucHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2Ygc3BlZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3BlZWQgPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xuICB9XG4gIGNvbnN0IHNraXAgPSBNYXRoLm1pbihzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCwgc2xpZGVJbmRleCk7XG4gIGxldCBzbmFwSW5kZXggPSBza2lwICsgTWF0aC5mbG9vcigoc2xpZGVJbmRleCAtIHNraXApIC8gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gIGlmIChzbmFwSW5kZXggPj0gc25hcEdyaWQubGVuZ3RoKSBzbmFwSW5kZXggPSBzbmFwR3JpZC5sZW5ndGggLSAxO1xuICBjb25zdCB0cmFuc2xhdGUgPSAtc25hcEdyaWRbc25hcEluZGV4XTtcbiAgLy8gTm9ybWFsaXplIHNsaWRlSW5kZXhcbiAgaWYgKHBhcmFtcy5ub3JtYWxpemVTbGlkZUluZGV4KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNHcmlkLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkVHJhbnNsYXRlID0gLU1hdGguZmxvb3IodHJhbnNsYXRlICogMTAwKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkW2ldICogMTAwKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkTmV4dCA9IE1hdGguZmxvb3Ioc2xpZGVzR3JpZFtpICsgMV0gKiAxMDApO1xuICAgICAgaWYgKHR5cGVvZiBzbGlkZXNHcmlkW2kgKyAxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gbm9ybWFsaXplZEdyaWQgJiYgbm9ybWFsaXplZFRyYW5zbGF0ZSA8IG5vcm1hbGl6ZWRHcmlkTmV4dCAtIChub3JtYWxpemVkR3JpZE5leHQgLSBub3JtYWxpemVkR3JpZCkgLyAyKSB7XG4gICAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9ybWFsaXplZFRyYW5zbGF0ZSA+PSBub3JtYWxpemVkR3JpZCAmJiBub3JtYWxpemVkVHJhbnNsYXRlIDwgbm9ybWFsaXplZEdyaWROZXh0KSB7XG4gICAgICAgICAgc2xpZGVJbmRleCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gbm9ybWFsaXplZEdyaWQpIHtcbiAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIERpcmVjdGlvbnMgbG9ja3NcbiAgaWYgKHN3aXBlci5pbml0aWFsaXplZCAmJiBzbGlkZUluZGV4ICE9PSBhY3RpdmVJbmRleCkge1xuICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVOZXh0ICYmIChydGwgPyB0cmFuc2xhdGUgPiBzd2lwZXIudHJhbnNsYXRlICYmIHRyYW5zbGF0ZSA+IHN3aXBlci5taW5UcmFuc2xhdGUoKSA6IHRyYW5zbGF0ZSA8IHN3aXBlci50cmFuc2xhdGUgJiYgdHJhbnNsYXRlIDwgc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiB0cmFuc2xhdGUgPiBzd2lwZXIudHJhbnNsYXRlICYmIHRyYW5zbGF0ZSA+IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgaWYgKChhY3RpdmVJbmRleCB8fCAwKSAhPT0gc2xpZGVJbmRleCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChzbGlkZUluZGV4ICE9PSAocHJldmlvdXNJbmRleCB8fCAwKSAmJiBydW5DYWxsYmFja3MpIHtcbiAgICBzd2lwZXIuZW1pdCgnYmVmb3JlU2xpZGVDaGFuZ2VTdGFydCcpO1xuICB9XG5cbiAgLy8gVXBkYXRlIHByb2dyZXNzXG4gIHN3aXBlci51cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpO1xuICBsZXQgZGlyZWN0aW9uO1xuICBpZiAoc2xpZGVJbmRleCA+IGFjdGl2ZUluZGV4KSBkaXJlY3Rpb24gPSAnbmV4dCc7ZWxzZSBpZiAoc2xpZGVJbmRleCA8IGFjdGl2ZUluZGV4KSBkaXJlY3Rpb24gPSAncHJldic7ZWxzZSBkaXJlY3Rpb24gPSAncmVzZXQnO1xuXG4gIC8vIGluaXRpYWwgdmlydHVhbFxuICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgY29uc3QgaXNJbml0aWFsVmlydHVhbCA9IGlzVmlydHVhbCAmJiBpbml0aWFsO1xuICAvLyBVcGRhdGUgSW5kZXhcbiAgaWYgKCFpc0luaXRpYWxWaXJ0dWFsICYmIChydGwgJiYgLXRyYW5zbGF0ZSA9PT0gc3dpcGVyLnRyYW5zbGF0ZSB8fCAhcnRsICYmIHRyYW5zbGF0ZSA9PT0gc3dpcGVyLnRyYW5zbGF0ZSkpIHtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoc2xpZGVJbmRleCk7XG4gICAgLy8gVXBkYXRlIEhlaWdodFxuICAgIGlmIChwYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgICB9XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICBpZiAocGFyYW1zLmVmZmVjdCAhPT0gJ3NsaWRlJykge1xuICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uICE9PSAncmVzZXQnKSB7XG4gICAgICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIGNvbnN0IGlzSCA9IHN3aXBlci5pc0hvcml6b250YWwoKTtcbiAgICBjb25zdCB0ID0gcnRsID8gdHJhbnNsYXRlIDogLXRyYW5zbGF0ZTtcbiAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9ICdub25lJztcbiAgICAgICAgc3dpcGVyLl9pbW1lZGlhdGVWaXJ0dWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ZpcnR1YWwgJiYgIXN3aXBlci5fY3NzTW9kZVZpcnR1YWxJbml0aWFsU2V0ICYmIHN3aXBlci5wYXJhbXMuaW5pdGlhbFNsaWRlID4gMCkge1xuICAgICAgICBzd2lwZXIuX2Nzc01vZGVWaXJ0dWFsSW5pdGlhbFNldCA9IHRydWU7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgd3JhcHBlckVsW2lzSCA/ICdzY3JvbGxMZWZ0JyA6ICdzY3JvbGxUb3AnXSA9IHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlckVsW2lzSCA/ICdzY3JvbGxMZWZ0JyA6ICdzY3JvbGxUb3AnXSA9IHQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9ICcnO1xuICAgICAgICAgIHN3aXBlci5faW1tZWRpYXRlVmlydHVhbCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFzd2lwZXIuc3VwcG9ydC5zbW9vdGhTY3JvbGwpIHtcbiAgICAgICAgYW5pbWF0ZUNTU01vZGVTY3JvbGwoe1xuICAgICAgICAgIHN3aXBlcixcbiAgICAgICAgICB0YXJnZXRQb3NpdGlvbjogdCxcbiAgICAgICAgICBzaWRlOiBpc0ggPyAnbGVmdCcgOiAndG9wJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB3cmFwcGVyRWwuc2Nyb2xsVG8oe1xuICAgICAgICBbaXNIID8gJ2xlZnQnIDogJ3RvcCddOiB0LFxuICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBzd2lwZXIuc2V0VHJhbnNpdGlvbihzcGVlZCk7XG4gIHN3aXBlci5zZXRUcmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KHNsaWRlSW5kZXgpO1xuICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICBzd2lwZXIuZW1pdCgnYmVmb3JlVHJhbnNpdGlvblN0YXJ0Jywgc3BlZWQsIGludGVybmFsKTtcbiAgc3dpcGVyLnRyYW5zaXRpb25TdGFydChydW5DYWxsYmFja3MsIGRpcmVjdGlvbik7XG4gIGlmIChzcGVlZCA9PT0gMCkge1xuICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcbiAgfSBlbHNlIGlmICghc3dpcGVyLmFuaW1hdGluZykge1xuICAgIHN3aXBlci5hbmltYXRpbmcgPSB0cnVlO1xuICAgIGlmICghc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKSB7XG4gICAgICBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKGUpIHtcbiAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMpIHJldHVybjtcbiAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZDtcbiAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2xpZGVUb0xvb3AoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XG4gIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgaW5kZXggPSAwO1xuICB9XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBpbmRleEFzTnVtYmVyID0gcGFyc2VJbnQoaW5kZXgsIDEwKTtcbiAgICBpbmRleCA9IGluZGV4QXNOdW1iZXI7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBzcGVlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzcGVlZCA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgY29uc3QgZ3JpZEVuYWJsZWQgPSBzd2lwZXIuZ3JpZCAmJiBzd2lwZXIucGFyYW1zLmdyaWQgJiYgc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICBsZXQgbmV3SW5kZXggPSBpbmRleDtcbiAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgIGlmIChzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBuZXdJbmRleCA9IG5ld0luZGV4ICsgc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0U2xpZGVJbmRleDtcbiAgICAgIGlmIChncmlkRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gbmV3SW5kZXggKiBzd2lwZXIucGFyYW1zLmdyaWQucm93cztcbiAgICAgICAgdGFyZ2V0U2xpZGVJbmRleCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxID09PSBzbGlkZUluZGV4KVswXS5jb2x1bW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXhCeURhdGEobmV3SW5kZXgpO1xuICAgICAgfVxuICAgICAgY29uc3QgY29scyA9IGdyaWRFbmFibGVkID8gTWF0aC5jZWlsKHN3aXBlci5zbGlkZXMubGVuZ3RoIC8gc3dpcGVyLnBhcmFtcy5ncmlkLnJvd3MpIDogc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNlbnRlcmVkU2xpZGVzXG4gICAgICB9ID0gc3dpcGVyLnBhcmFtcztcbiAgICAgIGxldCBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICAgICAgaWYgKHNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgICAgICBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXNQZXJWaWV3ID0gTWF0aC5jZWlsKHBhcnNlRmxvYXQoc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3LCAxMCkpO1xuICAgICAgICBpZiAoY2VudGVyZWRTbGlkZXMgJiYgc2xpZGVzUGVyVmlldyAlIDIgPT09IDApIHtcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3ID0gc2xpZGVzUGVyVmlldyArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBuZWVkTG9vcEZpeCA9IGNvbHMgLSB0YXJnZXRTbGlkZUluZGV4IDwgc2xpZGVzUGVyVmlldztcbiAgICAgIGlmIChjZW50ZXJlZFNsaWRlcykge1xuICAgICAgICBuZWVkTG9vcEZpeCA9IG5lZWRMb29wRml4IHx8IHRhcmdldFNsaWRlSW5kZXggPCBNYXRoLmNlaWwoc2xpZGVzUGVyVmlldyAvIDIpO1xuICAgICAgfVxuICAgICAgaWYgKGludGVybmFsICYmIGNlbnRlcmVkU2xpZGVzICYmIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nICYmICFncmlkRW5hYmxlZCkge1xuICAgICAgICBuZWVkTG9vcEZpeCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMb29wRml4KSB7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGNlbnRlcmVkU2xpZGVzID8gdGFyZ2V0U2xpZGVJbmRleCA8IHN3aXBlci5hY3RpdmVJbmRleCA/ICdwcmV2JyA6ICduZXh0JyA6IHRhcmdldFNsaWRlSW5kZXggLSBzd2lwZXIuYWN0aXZlSW5kZXggLSAxIDwgc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgICBzd2lwZXIubG9vcEZpeCh7XG4gICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgIHNsaWRlVG86IHRydWUsXG4gICAgICAgICAgYWN0aXZlU2xpZGVJbmRleDogZGlyZWN0aW9uID09PSAnbmV4dCcgPyB0YXJnZXRTbGlkZUluZGV4ICsgMSA6IHRhcmdldFNsaWRlSW5kZXggLSBjb2xzICsgMSxcbiAgICAgICAgICBzbGlkZVJlYWxJbmRleDogZGlyZWN0aW9uID09PSAnbmV4dCcgPyBzd2lwZXIucmVhbEluZGV4IDogdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBuZXdJbmRleCAqIHN3aXBlci5wYXJhbXMuZ3JpZC5yb3dzO1xuICAgICAgICBuZXdJbmRleCA9IHN3aXBlci5zbGlkZXMuZmlsdGVyKHNsaWRlRWwgPT4gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgKiAxID09PSBzbGlkZUluZGV4KVswXS5jb2x1bW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4QnlEYXRhKG5ld0luZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBzd2lwZXIuc2xpZGVUbyhuZXdJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICB9KTtcbiAgcmV0dXJuIHN3aXBlcjtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZU5leHQoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgZW5hYmxlZCxcbiAgICBwYXJhbXMsXG4gICAgYW5pbWF0aW5nXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm4gc3dpcGVyO1xuICBpZiAodHlwZW9mIHNwZWVkID09PSAndW5kZWZpbmVkJykge1xuICAgIHNwZWVkID0gc3dpcGVyLnBhcmFtcy5zcGVlZDtcbiAgfVxuICBsZXQgcGVyR3JvdXAgPSBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMSAmJiBwYXJhbXMuc2xpZGVzUGVyR3JvdXBBdXRvKSB7XG4gICAgcGVyR3JvdXAgPSBNYXRoLm1heChzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoJ2N1cnJlbnQnLCB0cnVlKSwgMSk7XG4gIH1cbiAgY29uc3QgaW5jcmVtZW50ID0gc3dpcGVyLmFjdGl2ZUluZGV4IDwgcGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCA/IDEgOiBwZXJHcm91cDtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgcGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgaWYgKGFuaW1hdGluZyAmJiAhaXNWaXJ0dWFsICYmIHBhcmFtcy5sb29wUHJldmVudHNTbGlkaW5nKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgZGlyZWN0aW9uOiAnbmV4dCdcbiAgICB9KTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBzd2lwZXIuX2NsaWVudExlZnQgPSBzd2lwZXIud3JhcHBlckVsLmNsaWVudExlZnQ7XG4gICAgaWYgKHN3aXBlci5hY3RpdmVJbmRleCA9PT0gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxICYmIHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXggKyBpbmNyZW1lbnQsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChwYXJhbXMucmV3aW5kICYmIHN3aXBlci5pc0VuZCkge1xuICAgIHJldHVybiBzd2lwZXIuc2xpZGVUbygwLCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gIH1cbiAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCArIGluY3JlbWVudCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xufVxuXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cbmZ1bmN0aW9uIHNsaWRlUHJldihzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCkge1xuICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcbiAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgc25hcEdyaWQsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBydGxUcmFuc2xhdGUsXG4gICAgZW5hYmxlZCxcbiAgICBhbmltYXRpbmdcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFlbmFibGVkIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybiBzd2lwZXI7XG4gIGlmICh0eXBlb2Ygc3BlZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3BlZWQgPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xuICB9XG4gIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG4gIGlmIChwYXJhbXMubG9vcCkge1xuICAgIGlmIChhbmltYXRpbmcgJiYgIWlzVmlydHVhbCAmJiBwYXJhbXMubG9vcFByZXZlbnRzU2xpZGluZykgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXBlci5sb29wRml4KHtcbiAgICAgIGRpcmVjdGlvbjogJ3ByZXYnXG4gICAgfSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgc3dpcGVyLl9jbGllbnRMZWZ0ID0gc3dpcGVyLndyYXBwZXJFbC5jbGllbnRMZWZ0O1xuICB9XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IHJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHZhbCkge1xuICAgIGlmICh2YWwgPCAwKSByZXR1cm4gLU1hdGguZmxvb3IoTWF0aC5hYnModmFsKSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsKTtcbiAgfVxuICBjb25zdCBub3JtYWxpemVkVHJhbnNsYXRlID0gbm9ybWFsaXplKHRyYW5zbGF0ZSk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRTbmFwR3JpZCA9IHNuYXBHcmlkLm1hcCh2YWwgPT4gbm9ybWFsaXplKHZhbCkpO1xuICBsZXQgcHJldlNuYXAgPSBzbmFwR3JpZFtub3JtYWxpemVkU25hcEdyaWQuaW5kZXhPZihub3JtYWxpemVkVHJhbnNsYXRlKSAtIDFdO1xuICBpZiAodHlwZW9mIHByZXZTbmFwID09PSAndW5kZWZpbmVkJyAmJiBwYXJhbXMuY3NzTW9kZSkge1xuICAgIGxldCBwcmV2U25hcEluZGV4O1xuICAgIHNuYXBHcmlkLmZvckVhY2goKHNuYXAsIHNuYXBJbmRleCkgPT4ge1xuICAgICAgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gc25hcCkge1xuICAgICAgICAvLyBwcmV2U25hcCA9IHNuYXA7XG4gICAgICAgIHByZXZTbmFwSW5kZXggPSBzbmFwSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBwcmV2U25hcEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcHJldlNuYXAgPSBzbmFwR3JpZFtwcmV2U25hcEluZGV4ID4gMCA/IHByZXZTbmFwSW5kZXggLSAxIDogcHJldlNuYXBJbmRleF07XG4gICAgfVxuICB9XG4gIGxldCBwcmV2SW5kZXggPSAwO1xuICBpZiAodHlwZW9mIHByZXZTbmFwICE9PSAndW5kZWZpbmVkJykge1xuICAgIHByZXZJbmRleCA9IHNsaWRlc0dyaWQuaW5kZXhPZihwcmV2U25hcCk7XG4gICAgaWYgKHByZXZJbmRleCA8IDApIHByZXZJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleCAtIDE7XG4gICAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8pIHtcbiAgICAgIHByZXZJbmRleCA9IHByZXZJbmRleCAtIHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygncHJldmlvdXMnLCB0cnVlKSArIDE7XG4gICAgICBwcmV2SW5kZXggPSBNYXRoLm1heChwcmV2SW5kZXgsIDApO1xuICAgIH1cbiAgfVxuICBpZiAocGFyYW1zLnJld2luZCAmJiBzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICBjb25zdCBsYXN0SW5kZXggPSBzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIC0gMSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gc3dpcGVyLnNsaWRlVG8obGFzdEluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLmxvb3AgJiYgc3dpcGVyLmFjdGl2ZUluZGV4ID09PSAwICYmIHBhcmFtcy5jc3NNb2RlKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHByZXZJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhwcmV2SW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbn1cblxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5mdW5jdGlvbiBzbGlkZVJlc2V0KHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XG4gIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xuICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBzcGVlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzcGVlZCA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xufVxuXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cbmZ1bmN0aW9uIHNsaWRlVG9DbG9zZXN0KHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsLCB0aHJlc2hvbGQpIHtcbiAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XG4gICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgfVxuICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHtcbiAgICB0aHJlc2hvbGQgPSAwLjU7XG4gIH1cbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBzcGVlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzcGVlZCA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XG4gIH1cbiAgbGV0IGluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xuICBjb25zdCBza2lwID0gTWF0aC5taW4oc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAsIGluZGV4KTtcbiAgY29uc3Qgc25hcEluZGV4ID0gc2tpcCArIE1hdGguZmxvb3IoKGluZGV4IC0gc2tpcCkgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcbiAgaWYgKHRyYW5zbGF0ZSA+PSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4XSkge1xuICAgIC8vIFRoZSBjdXJyZW50IHRyYW5zbGF0ZSBpcyBvbiBvciBhZnRlciB0aGUgY3VycmVudCBzbmFwIGluZGV4LCBzbyB0aGUgY2hvaWNlXG4gICAgLy8gaXMgYmV0d2VlbiB0aGUgY3VycmVudCBpbmRleCBhbmQgdGhlIG9uZSBhZnRlciBpdC5cbiAgICBjb25zdCBjdXJyZW50U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXhdO1xuICAgIGNvbnN0IG5leHRTbmFwID0gc3dpcGVyLnNuYXBHcmlkW3NuYXBJbmRleCArIDFdO1xuICAgIGlmICh0cmFuc2xhdGUgLSBjdXJyZW50U25hcCA+IChuZXh0U25hcCAtIGN1cnJlbnRTbmFwKSAqIHRocmVzaG9sZCkge1xuICAgICAgaW5kZXggKz0gc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIGN1cnJlbnQgdHJhbnNsYXRlIGlzIGJlZm9yZSB0aGUgY3VycmVudCBzbmFwIGluZGV4LCBzbyB0aGUgY2hvaWNlXG4gICAgLy8gaXMgYmV0d2VlbiB0aGUgY3VycmVudCBpbmRleCBhbmQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAgY29uc3QgcHJldlNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4IC0gMV07XG4gICAgY29uc3QgY3VycmVudFNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4XTtcbiAgICBpZiAodHJhbnNsYXRlIC0gcHJldlNuYXAgPD0gKGN1cnJlbnRTbmFwIC0gcHJldlNuYXApICogdGhyZXNob2xkKSB7XG4gICAgICBpbmRleCAtPSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgIH1cbiAgfVxuICBpbmRleCA9IE1hdGgubWF4KGluZGV4LCAwKTtcbiAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgc3dpcGVyLnNsaWRlc0dyaWQubGVuZ3RoIC0gMSk7XG4gIHJldHVybiBzd2lwZXIuc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xufVxuXG5mdW5jdGlvbiBzbGlkZVRvQ2xpY2tlZFNsaWRlKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHNsaWRlc0VsXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IHNsaWRlc1BlclZpZXcgPSBwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiBwYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgbGV0IHNsaWRlVG9JbmRleCA9IHN3aXBlci5jbGlja2VkSW5kZXg7XG4gIGxldCByZWFsSW5kZXg7XG4gIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSBzd2lwZXIuaXNFbGVtZW50ID8gYHN3aXBlci1zbGlkZWAgOiBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9YDtcbiAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgaWYgKHN3aXBlci5hbmltYXRpbmcpIHJldHVybjtcbiAgICByZWFsSW5kZXggPSBwYXJzZUludChzd2lwZXIuY2xpY2tlZFNsaWRlLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xuICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgIGlmIChzbGlkZVRvSW5kZXggPCBzd2lwZXIubG9vcGVkU2xpZGVzIC0gc2xpZGVzUGVyVmlldyAvIDIgfHwgc2xpZGVUb0luZGV4ID4gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSBzd2lwZXIubG9vcGVkU2xpZGVzICsgc2xpZGVzUGVyVmlldyAvIDIpIHtcbiAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgICAgICAgc2xpZGVUb0luZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgJHtzbGlkZVNlbGVjdG9yfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7cmVhbEluZGV4fVwiXWApWzBdKTtcbiAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNsaWRlVG9JbmRleCA+IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gc2xpZGVzUGVyVmlldykge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgICAgIHNsaWRlVG9JbmRleCA9IHN3aXBlci5nZXRTbGlkZUluZGV4KGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYCR7c2xpZGVTZWxlY3Rvcn1bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3JlYWxJbmRleH1cIl1gKVswXSk7XG4gICAgICBuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgfVxufVxuXG52YXIgc2xpZGUgPSB7XG4gIHNsaWRlVG8sXG4gIHNsaWRlVG9Mb29wLFxuICBzbGlkZU5leHQsXG4gIHNsaWRlUHJldixcbiAgc2xpZGVSZXNldCxcbiAgc2xpZGVUb0Nsb3Nlc3QsXG4gIHNsaWRlVG9DbGlja2VkU2xpZGVcbn07XG5cbmZ1bmN0aW9uIGxvb3BDcmVhdGUoc2xpZGVSZWFsSW5kZXgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIXBhcmFtcy5sb29wIHx8IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gIGNvbnN0IGluaXRTbGlkZXMgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2xpZGVzID0gZWxlbWVudENoaWxkcmVuKHNsaWRlc0VsLCBgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LCBzd2lwZXItc2xpZGVgKTtcbiAgICBzbGlkZXMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JywgaW5kZXgpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBncmlkRW5hYmxlZCA9IHN3aXBlci5ncmlkICYmIHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xuICBjb25zdCBzbGlkZXNQZXJHcm91cCA9IHBhcmFtcy5zbGlkZXNQZXJHcm91cCAqIChncmlkRW5hYmxlZCA/IHBhcmFtcy5ncmlkLnJvd3MgOiAxKTtcbiAgY29uc3Qgc2hvdWxkRmlsbEdyb3VwID0gc3dpcGVyLnNsaWRlcy5sZW5ndGggJSBzbGlkZXNQZXJHcm91cCAhPT0gMDtcbiAgY29uc3Qgc2hvdWxkRmlsbEdyaWQgPSBncmlkRW5hYmxlZCAmJiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAlIHBhcmFtcy5ncmlkLnJvd3MgIT09IDA7XG4gIGNvbnN0IGFkZEJsYW5rU2xpZGVzID0gYW1vdW50T2ZTbGlkZXMgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50T2ZTbGlkZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2xpZGVFbCA9IHN3aXBlci5pc0VsZW1lbnQgPyBjcmVhdGVFbGVtZW50KCdzd2lwZXItc2xpZGUnLCBbcGFyYW1zLnNsaWRlQmxhbmtDbGFzc10pIDogY3JlYXRlRWxlbWVudCgnZGl2JywgW3BhcmFtcy5zbGlkZUNsYXNzLCBwYXJhbXMuc2xpZGVCbGFua0NsYXNzXSk7XG4gICAgICBzd2lwZXIuc2xpZGVzRWwuYXBwZW5kKHNsaWRlRWwpO1xuICAgIH1cbiAgfTtcbiAgaWYgKHNob3VsZEZpbGxHcm91cCkge1xuICAgIGlmIChwYXJhbXMubG9vcEFkZEJsYW5rU2xpZGVzKSB7XG4gICAgICBjb25zdCBzbGlkZXNUb0FkZCA9IHNsaWRlc1Blckdyb3VwIC0gc3dpcGVyLnNsaWRlcy5sZW5ndGggJSBzbGlkZXNQZXJHcm91cDtcbiAgICAgIGFkZEJsYW5rU2xpZGVzKHNsaWRlc1RvQWRkKTtcbiAgICAgIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IFRoZSBudW1iZXIgb2Ygc2xpZGVzIGlzIG5vdCBldmVuIHRvIHNsaWRlc1Blckdyb3VwLCBsb29wIG1vZGUgbWF5IG5vdCBmdW5jdGlvbiBwcm9wZXJseS4gWW91IG5lZWQgdG8gYWRkIG1vcmUgc2xpZGVzIChvciBtYWtlIGR1cGxpY2F0ZXMsIG9yIGVtcHR5IHNsaWRlcyknKTtcbiAgICB9XG4gICAgaW5pdFNsaWRlcygpO1xuICB9IGVsc2UgaWYgKHNob3VsZEZpbGxHcmlkKSB7XG4gICAgaWYgKHBhcmFtcy5sb29wQWRkQmxhbmtTbGlkZXMpIHtcbiAgICAgIGNvbnN0IHNsaWRlc1RvQWRkID0gcGFyYW1zLmdyaWQucm93cyAtIHN3aXBlci5zbGlkZXMubGVuZ3RoICUgcGFyYW1zLmdyaWQucm93cztcbiAgICAgIGFkZEJsYW5rU2xpZGVzKHNsaWRlc1RvQWRkKTtcbiAgICAgIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IFRoZSBudW1iZXIgb2Ygc2xpZGVzIGlzIG5vdCBldmVuIHRvIGdyaWQucm93cywgbG9vcCBtb2RlIG1heSBub3QgZnVuY3Rpb24gcHJvcGVybHkuIFlvdSBuZWVkIHRvIGFkZCBtb3JlIHNsaWRlcyAob3IgbWFrZSBkdXBsaWNhdGVzLCBvciBlbXB0eSBzbGlkZXMpJyk7XG4gICAgfVxuICAgIGluaXRTbGlkZXMoKTtcbiAgfSBlbHNlIHtcbiAgICBpbml0U2xpZGVzKCk7XG4gIH1cbiAgc3dpcGVyLmxvb3BGaXgoe1xuICAgIHNsaWRlUmVhbEluZGV4LFxuICAgIGRpcmVjdGlvbjogcGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gdW5kZWZpbmVkIDogJ25leHQnXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsb29wRml4KF90ZW1wKSB7XG4gIGxldCB7XG4gICAgc2xpZGVSZWFsSW5kZXgsXG4gICAgc2xpZGVUbyA9IHRydWUsXG4gICAgZGlyZWN0aW9uLFxuICAgIHNldFRyYW5zbGF0ZSxcbiAgICBhY3RpdmVTbGlkZUluZGV4LFxuICAgIGJ5Q29udHJvbGxlcixcbiAgICBieU1vdXNld2hlZWxcbiAgfSA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wO1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoIXN3aXBlci5wYXJhbXMubG9vcCkgcmV0dXJuO1xuICBzd2lwZXIuZW1pdCgnYmVmb3JlTG9vcEZpeCcpO1xuICBjb25zdCB7XG4gICAgc2xpZGVzLFxuICAgIGFsbG93U2xpZGVQcmV2LFxuICAgIGFsbG93U2xpZGVOZXh0LFxuICAgIHNsaWRlc0VsLFxuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBjb25zdCB7XG4gICAgY2VudGVyZWRTbGlkZXNcbiAgfSA9IHBhcmFtcztcbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gdHJ1ZTtcbiAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gdHJ1ZTtcbiAgaWYgKHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcbiAgICBpZiAoc2xpZGVUbykge1xuICAgICAgaWYgKCFwYXJhbXMuY2VudGVyZWRTbGlkZXMgJiYgc3dpcGVyLnNuYXBJbmRleCA9PT0gMCkge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBzd2lwZXIuc25hcEluZGV4IDwgcGFyYW1zLnNsaWRlc1BlclZpZXcpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCArIHN3aXBlci5zbmFwSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnNuYXBJbmRleCA9PT0gc3dpcGVyLnNuYXBHcmlkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnZpcnR1YWwuc2xpZGVzQmVmb3JlLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xuICAgIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IGFsbG93U2xpZGVOZXh0O1xuICAgIHN3aXBlci5lbWl0KCdsb29wRml4Jyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBzbGlkZXNQZXJWaWV3ID0gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gIGlmIChzbGlkZXNQZXJWaWV3ID09PSAnYXV0bycpIHtcbiAgICBzbGlkZXNQZXJWaWV3ID0gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCk7XG4gIH0gZWxzZSB7XG4gICAgc2xpZGVzUGVyVmlldyA9IE1hdGguY2VpbChwYXJzZUZsb2F0KHBhcmFtcy5zbGlkZXNQZXJWaWV3LCAxMCkpO1xuICAgIGlmIChjZW50ZXJlZFNsaWRlcyAmJiBzbGlkZXNQZXJWaWV3ICUgMiA9PT0gMCkge1xuICAgICAgc2xpZGVzUGVyVmlldyA9IHNsaWRlc1BlclZpZXcgKyAxO1xuICAgIH1cbiAgfVxuICBjb25zdCBzbGlkZXNQZXJHcm91cCA9IHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8gPyBzbGlkZXNQZXJWaWV3IDogcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICBsZXQgbG9vcGVkU2xpZGVzID0gc2xpZGVzUGVyR3JvdXA7XG4gIGlmIChsb29wZWRTbGlkZXMgJSBzbGlkZXNQZXJHcm91cCAhPT0gMCkge1xuICAgIGxvb3BlZFNsaWRlcyArPSBzbGlkZXNQZXJHcm91cCAtIGxvb3BlZFNsaWRlcyAlIHNsaWRlc1Blckdyb3VwO1xuICB9XG4gIGxvb3BlZFNsaWRlcyArPSBwYXJhbXMubG9vcEFkZGl0aW9uYWxTbGlkZXM7XG4gIHN3aXBlci5sb29wZWRTbGlkZXMgPSBsb29wZWRTbGlkZXM7XG4gIGNvbnN0IGdyaWRFbmFibGVkID0gc3dpcGVyLmdyaWQgJiYgcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDE7XG4gIGlmIChzbGlkZXMubGVuZ3RoIDwgc2xpZGVzUGVyVmlldyArIGxvb3BlZFNsaWRlcykge1xuICAgIHNob3dXYXJuaW5nKCdTd2lwZXIgTG9vcCBXYXJuaW5nOiBUaGUgbnVtYmVyIG9mIHNsaWRlcyBpcyBub3QgZW5vdWdoIGZvciBsb29wIG1vZGUsIGl0IHdpbGwgYmUgZGlzYWJsZWQgYW5kIG5vdCBmdW5jdGlvbiBwcm9wZXJseS4gWW91IG5lZWQgdG8gYWRkIG1vcmUgc2xpZGVzIChvciBtYWtlIGR1cGxpY2F0ZXMpIG9yIGxvd2VyIHRoZSB2YWx1ZXMgb2Ygc2xpZGVzUGVyVmlldyBhbmQgc2xpZGVzUGVyR3JvdXAgcGFyYW1ldGVycycpO1xuICB9IGVsc2UgaWYgKGdyaWRFbmFibGVkICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdyb3cnKSB7XG4gICAgc2hvd1dhcm5pbmcoJ1N3aXBlciBMb29wIFdhcm5pbmc6IExvb3AgbW9kZSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIGdyaWQuZmlsbCA9IGByb3dgJyk7XG4gIH1cbiAgY29uc3QgcHJlcGVuZFNsaWRlc0luZGV4ZXMgPSBbXTtcbiAgY29uc3QgYXBwZW5kU2xpZGVzSW5kZXhlcyA9IFtdO1xuICBsZXQgYWN0aXZlSW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XG4gIGlmICh0eXBlb2YgYWN0aXZlU2xpZGVJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhY3RpdmVTbGlkZUluZGV4ID0gc3dpcGVyLmdldFNsaWRlSW5kZXgoc2xpZGVzLmZpbHRlcihlbCA9PiBlbC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MpKVswXSk7XG4gIH0gZWxzZSB7XG4gICAgYWN0aXZlSW5kZXggPSBhY3RpdmVTbGlkZUluZGV4O1xuICB9XG4gIGNvbnN0IGlzTmV4dCA9IGRpcmVjdGlvbiA9PT0gJ25leHQnIHx8ICFkaXJlY3Rpb247XG4gIGNvbnN0IGlzUHJldiA9IGRpcmVjdGlvbiA9PT0gJ3ByZXYnIHx8ICFkaXJlY3Rpb247XG4gIGxldCBzbGlkZXNQcmVwZW5kZWQgPSAwO1xuICBsZXQgc2xpZGVzQXBwZW5kZWQgPSAwO1xuICBjb25zdCBjb2xzID0gZ3JpZEVuYWJsZWQgPyBNYXRoLmNlaWwoc2xpZGVzLmxlbmd0aCAvIHBhcmFtcy5ncmlkLnJvd3MpIDogc2xpZGVzLmxlbmd0aDtcbiAgY29uc3QgYWN0aXZlQ29sSW5kZXggPSBncmlkRW5hYmxlZCA/IHNsaWRlc1thY3RpdmVTbGlkZUluZGV4XS5jb2x1bW4gOiBhY3RpdmVTbGlkZUluZGV4O1xuICBjb25zdCBhY3RpdmVDb2xJbmRleFdpdGhTaGlmdCA9IGFjdGl2ZUNvbEluZGV4ICsgKGNlbnRlcmVkU2xpZGVzICYmIHR5cGVvZiBzZXRUcmFuc2xhdGUgPT09ICd1bmRlZmluZWQnID8gLXNsaWRlc1BlclZpZXcgLyAyICsgMC41IDogMCk7XG4gIC8vIHByZXBlbmQgbGFzdCBzbGlkZXMgYmVmb3JlIHN0YXJ0XG4gIGlmIChhY3RpdmVDb2xJbmRleFdpdGhTaGlmdCA8IGxvb3BlZFNsaWRlcykge1xuICAgIHNsaWRlc1ByZXBlbmRlZCA9IE1hdGgubWF4KGxvb3BlZFNsaWRlcyAtIGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0LCBzbGlkZXNQZXJHcm91cCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wZWRTbGlkZXMgLSBhY3RpdmVDb2xJbmRleFdpdGhTaGlmdDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgLSBNYXRoLmZsb29yKGkgLyBjb2xzKSAqIGNvbHM7XG4gICAgICBpZiAoZ3JpZEVuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgY29sSW5kZXhUb1ByZXBlbmQgPSBjb2xzIC0gaW5kZXggLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gc2xpZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgaWYgKHNsaWRlc1tpXS5jb2x1bW4gPT09IGNvbEluZGV4VG9QcmVwZW5kKSBwcmVwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgICAvLyAgIGlmIChzbGlkZS5jb2x1bW4gPT09IGNvbEluZGV4VG9QcmVwZW5kKSBwcmVwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKHNsaWRlSW5kZXgpO1xuICAgICAgICAvLyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXBlbmRTbGlkZXNJbmRleGVzLnB1c2goY29scyAtIGluZGV4IC0gMSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0ICsgc2xpZGVzUGVyVmlldyA+IGNvbHMgLSBsb29wZWRTbGlkZXMpIHtcbiAgICBzbGlkZXNBcHBlbmRlZCA9IE1hdGgubWF4KGFjdGl2ZUNvbEluZGV4V2l0aFNoaWZ0IC0gKGNvbHMgLSBsb29wZWRTbGlkZXMgKiAyKSwgc2xpZGVzUGVyR3JvdXApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzQXBwZW5kZWQ7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpIC0gTWF0aC5mbG9vcihpIC8gY29scykgKiBjb2xzO1xuICAgICAgaWYgKGdyaWRFbmFibGVkKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgc2xpZGVJbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChzbGlkZS5jb2x1bW4gPT09IGluZGV4KSBhcHBlbmRTbGlkZXNJbmRleGVzLnB1c2goc2xpZGVJbmRleCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kU2xpZGVzSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSB0cnVlO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fID0gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNQcmV2KSB7XG4gICAgcHJlcGVuZFNsaWRlc0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gdHJ1ZTtcbiAgICAgIHNsaWRlc0VsLnByZXBlbmQoc2xpZGVzW2luZGV4XSk7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzTmV4dCkge1xuICAgIGFwcGVuZFNsaWRlc0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICBzbGlkZXNbaW5kZXhdLnN3aXBlckxvb3BNb3ZlRE9NID0gdHJ1ZTtcbiAgICAgIHNsaWRlc0VsLmFwcGVuZChzbGlkZXNbaW5kZXhdKTtcbiAgICAgIHNsaWRlc1tpbmRleF0uc3dpcGVyTG9vcE1vdmVET00gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuICBzd2lwZXIucmVjYWxjU2xpZGVzKCk7XG4gIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICB9IGVsc2UgaWYgKGdyaWRFbmFibGVkICYmIChwcmVwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggPiAwICYmIGlzUHJldiB8fCBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aCA+IDAgJiYgaXNOZXh0KSkge1xuICAgIHN3aXBlci5zbGlkZXMuZm9yRWFjaCgoc2xpZGUsIHNsaWRlSW5kZXgpID0+IHtcbiAgICAgIHN3aXBlci5ncmlkLnVwZGF0ZVNsaWRlKHNsaWRlSW5kZXgsIHNsaWRlLCBzd2lwZXIuc2xpZGVzKTtcbiAgICB9KTtcbiAgfVxuICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XG4gIH1cbiAgaWYgKHNsaWRlVG8pIHtcbiAgICBpZiAocHJlcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoID4gMCAmJiBpc1ByZXYpIHtcbiAgICAgIGlmICh0eXBlb2Ygc2xpZGVSZWFsSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4XTtcbiAgICAgICAgY29uc3QgbmV3U2xpZGVUcmFuc2xhdGUgPSBzd2lwZXIuc2xpZGVzR3JpZFthY3RpdmVJbmRleCArIHNsaWRlc1ByZXBlbmRlZF07XG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdTbGlkZVRyYW5zbGF0ZSAtIGN1cnJlbnRTbGlkZVRyYW5zbGF0ZTtcbiAgICAgICAgaWYgKGJ5TW91c2V3aGVlbCkge1xuICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUoc3dpcGVyLnRyYW5zbGF0ZSAtIGRpZmYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKGFjdGl2ZUluZGV4ICsgTWF0aC5jZWlsKHNsaWRlc1ByZXBlbmRlZCksIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICBpZiAoc2V0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLnN0YXJ0VHJhbnNsYXRlID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5zdGFydFRyYW5zbGF0ZSAtIGRpZmY7XG4gICAgICAgICAgICBzd2lwZXIudG91Y2hFdmVudHNEYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhLmN1cnJlbnRUcmFuc2xhdGUgLSBkaWZmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNldFRyYW5zbGF0ZSkge1xuICAgICAgICAgIGNvbnN0IHNoaWZ0ID0gZ3JpZEVuYWJsZWQgPyBwcmVwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggLyBwYXJhbXMuZ3JpZC5yb3dzIDogcHJlcGVuZFNsaWRlc0luZGV4ZXMubGVuZ3RoO1xuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCArIHNoaWZ0LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLnRyYW5zbGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBwZW5kU2xpZGVzSW5kZXhlcy5sZW5ndGggPiAwICYmIGlzTmV4dCkge1xuICAgICAgaWYgKHR5cGVvZiBzbGlkZVJlYWxJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFNsaWRlVHJhbnNsYXRlID0gc3dpcGVyLnNsaWRlc0dyaWRbYWN0aXZlSW5kZXhdO1xuICAgICAgICBjb25zdCBuZXdTbGlkZVRyYW5zbGF0ZSA9IHN3aXBlci5zbGlkZXNHcmlkW2FjdGl2ZUluZGV4IC0gc2xpZGVzQXBwZW5kZWRdO1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3U2xpZGVUcmFuc2xhdGUgLSBjdXJyZW50U2xpZGVUcmFuc2xhdGU7XG4gICAgICAgIGlmIChieU1vdXNld2hlZWwpIHtcbiAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKHN3aXBlci50cmFuc2xhdGUgLSBkaWZmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhhY3RpdmVJbmRleCAtIHNsaWRlc0FwcGVuZGVkLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgaWYgKHNldFRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5zdGFydFRyYW5zbGF0ZSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGEuc3RhcnRUcmFuc2xhdGUgLSBkaWZmO1xuICAgICAgICAgICAgc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YS5jdXJyZW50VHJhbnNsYXRlIC0gZGlmZjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNoaWZ0ID0gZ3JpZEVuYWJsZWQgPyBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aCAvIHBhcmFtcy5ncmlkLnJvd3MgOiBhcHBlbmRTbGlkZXNJbmRleGVzLmxlbmd0aDtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4IC0gc2hpZnQsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gYWxsb3dTbGlkZVByZXY7XG4gIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IGFsbG93U2xpZGVOZXh0O1xuICBpZiAoc3dpcGVyLmNvbnRyb2xsZXIgJiYgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCAmJiAhYnlDb250cm9sbGVyKSB7XG4gICAgY29uc3QgbG9vcFBhcmFtcyA9IHtcbiAgICAgIHNsaWRlUmVhbEluZGV4LFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgc2V0VHJhbnNsYXRlLFxuICAgICAgYWN0aXZlU2xpZGVJbmRleCxcbiAgICAgIGJ5Q29udHJvbGxlcjogdHJ1ZVxuICAgIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkpIHtcbiAgICAgIHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wuZm9yRWFjaChjID0+IHtcbiAgICAgICAgaWYgKCFjLmRlc3Ryb3llZCAmJiBjLnBhcmFtcy5sb29wKSBjLmxvb3BGaXgoe1xuICAgICAgICAgIC4uLmxvb3BQYXJhbXMsXG4gICAgICAgICAgc2xpZGVUbzogYy5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPyBzbGlkZVRvIDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2wgaW5zdGFuY2VvZiBzd2lwZXIuY29uc3RydWN0b3IgJiYgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5wYXJhbXMubG9vcCkge1xuICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5sb29wRml4KHtcbiAgICAgICAgLi4ubG9vcFBhcmFtcyxcbiAgICAgICAgc2xpZGVUbzogc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbC5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPyBzbGlkZVRvIDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBzd2lwZXIuZW1pdCgnbG9vcEZpeCcpO1xufVxuXG5mdW5jdGlvbiBsb29wRGVzdHJveSgpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtcyxcbiAgICBzbGlkZXNFbFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIXBhcmFtcy5sb29wIHx8IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XG4gIHN3aXBlci5yZWNhbGNTbGlkZXMoKTtcbiAgY29uc3QgbmV3U2xpZGVzT3JkZXIgPSBbXTtcbiAgc3dpcGVyLnNsaWRlcy5mb3JFYWNoKHNsaWRlRWwgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gdHlwZW9mIHNsaWRlRWwuc3dpcGVyU2xpZGVJbmRleCA9PT0gJ3VuZGVmaW5lZCcgPyBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgOiBzbGlkZUVsLnN3aXBlclNsaWRlSW5kZXg7XG4gICAgbmV3U2xpZGVzT3JkZXJbaW5kZXhdID0gc2xpZGVFbDtcbiAgfSk7XG4gIHN3aXBlci5zbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgfSk7XG4gIG5ld1NsaWRlc09yZGVyLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgc2xpZGVzRWwuYXBwZW5kKHNsaWRlRWwpO1xuICB9KTtcbiAgc3dpcGVyLnJlY2FsY1NsaWRlcygpO1xuICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIucmVhbEluZGV4LCAwKTtcbn1cblxudmFyIGxvb3AgPSB7XG4gIGxvb3BDcmVhdGUsXG4gIGxvb3BGaXgsXG4gIGxvb3BEZXN0cm95XG59O1xuXG5mdW5jdGlvbiBzZXRHcmFiQ3Vyc29yKG1vdmluZykge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBpZiAoIXN3aXBlci5wYXJhbXMuc2ltdWxhdGVUb3VjaCB8fCBzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmlzTG9ja2VkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xuICBjb25zdCBlbCA9IHN3aXBlci5wYXJhbXMudG91Y2hFdmVudHNUYXJnZXQgPT09ICdjb250YWluZXInID8gc3dpcGVyLmVsIDogc3dpcGVyLndyYXBwZXJFbDtcbiAgaWYgKHN3aXBlci5pc0VsZW1lbnQpIHtcbiAgICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IHRydWU7XG4gIH1cbiAgZWwuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuICBlbC5zdHlsZS5jdXJzb3IgPSBtb3ZpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICBpZiAoc3dpcGVyLmlzRWxlbWVudCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzd2lwZXIuX19wcmV2ZW50T2JzZXJ2ZXJfXyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc2V0R3JhYkN1cnNvcigpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuaXNMb2NrZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgc3dpcGVyLl9fcHJldmVudE9ic2VydmVyX18gPSB0cnVlO1xuICB9XG4gIHN3aXBlcltzd2lwZXIucGFyYW1zLnRvdWNoRXZlbnRzVGFyZ2V0ID09PSAnY29udGFpbmVyJyA/ICdlbCcgOiAnd3JhcHBlckVsJ10uc3R5bGUuY3Vyc29yID0gJyc7XG4gIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHN3aXBlci5fX3ByZXZlbnRPYnNlcnZlcl9fID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxudmFyIGdyYWJDdXJzb3IgPSB7XG4gIHNldEdyYWJDdXJzb3IsXG4gIHVuc2V0R3JhYkN1cnNvclxufTtcblxuLy8gTW9kaWZpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDUyMDU1NC9jdXN0b20tZWxlbWVudC1nZXRyb290bm9kZS1jbG9zZXN0LWZ1bmN0aW9uLWNyb3NzaW5nLW11bHRpcGxlLXBhcmVudC1zaGFkb3dkXG5mdW5jdGlvbiBjbG9zZXN0RWxlbWVudChzZWxlY3RvciwgYmFzZSkge1xuICBpZiAoYmFzZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZSA9IHRoaXM7XG4gIH1cbiAgZnVuY3Rpb24gX19jbG9zZXN0RnJvbShlbCkge1xuICAgIGlmICghZWwgfHwgZWwgPT09IGdldERvY3VtZW50KCkgfHwgZWwgPT09IGdldFdpbmRvdygpKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoZWwuYXNzaWduZWRTbG90KSBlbCA9IGVsLmFzc2lnbmVkU2xvdDtcbiAgICBjb25zdCBmb3VuZCA9IGVsLmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICghZm91bmQgJiYgIWVsLmdldFJvb3ROb2RlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kIHx8IF9fY2xvc2VzdEZyb20oZWwuZ2V0Um9vdE5vZGUoKS5ob3N0KTtcbiAgfVxuICByZXR1cm4gX19jbG9zZXN0RnJvbShiYXNlKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBldmVudCwgc3RhcnRYKSB7XG4gIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuICBjb25zdCB7XG4gICAgcGFyYW1zXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGVkZ2VTd2lwZURldGVjdGlvbiA9IHBhcmFtcy5lZGdlU3dpcGVEZXRlY3Rpb247XG4gIGNvbnN0IGVkZ2VTd2lwZVRocmVzaG9sZCA9IHBhcmFtcy5lZGdlU3dpcGVUaHJlc2hvbGQ7XG4gIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gJiYgKHN0YXJ0WCA8PSBlZGdlU3dpcGVUaHJlc2hvbGQgfHwgc3RhcnRYID49IHdpbmRvdy5pbm5lcldpZHRoIC0gZWRnZVN3aXBlVGhyZXNob2xkKSkge1xuICAgIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gPT09ICdwcmV2ZW50Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBvblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBsZXQgZSA9IGV2ZW50O1xuICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICBjb25zdCBkYXRhID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YTtcbiAgaWYgKGUudHlwZSA9PT0gJ3BvaW50ZXJkb3duJykge1xuICAgIGlmIChkYXRhLnBvaW50ZXJJZCAhPT0gbnVsbCAmJiBkYXRhLnBvaW50ZXJJZCAhPT0gZS5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5wb2ludGVySWQgPSBlLnBvaW50ZXJJZDtcbiAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgZGF0YS50b3VjaElkID0gZS50YXJnZXRUb3VjaGVzWzBdLmlkZW50aWZpZXI7XG4gIH1cbiAgaWYgKGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgLy8gZG9uJ3QgcHJvY2VlZCB0b3VjaCBldmVudFxuICAgIHByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBlLCBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHRvdWNoZXMsXG4gICAgZW5hYmxlZFxuICB9ID0gc3dpcGVyO1xuICBpZiAoIWVuYWJsZWQpIHJldHVybjtcbiAgaWYgKCFwYXJhbXMuc2ltdWxhdGVUb3VjaCAmJiBlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnKSByZXR1cm47XG4gIGlmIChzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5wcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb24pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5sb29wKSB7XG4gICAgc3dpcGVyLmxvb3BGaXgoKTtcbiAgfVxuICBsZXQgdGFyZ2V0RWwgPSBlLnRhcmdldDtcbiAgaWYgKHBhcmFtcy50b3VjaEV2ZW50c1RhcmdldCA9PT0gJ3dyYXBwZXInKSB7XG4gICAgaWYgKCFlbGVtZW50SXNDaGlsZE9mKHRhcmdldEVsLCBzd2lwZXIud3JhcHBlckVsKSkgcmV0dXJuO1xuICB9XG4gIGlmICgnd2hpY2gnIGluIGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuO1xuICBpZiAoJ2J1dHRvbicgaW4gZSAmJiBlLmJ1dHRvbiA+IDApIHJldHVybjtcbiAgaWYgKGRhdGEuaXNUb3VjaGVkICYmIGRhdGEuaXNNb3ZlZCkgcmV0dXJuO1xuXG4gIC8vIGNoYW5nZSB0YXJnZXQgZWwgZm9yIHNoYWRvdyByb290IGNvbXBvbmVudFxuICBjb25zdCBzd2lwaW5nQ2xhc3NIYXNWYWx1ZSA9ICEhcGFyYW1zLm5vU3dpcGluZ0NsYXNzICYmIHBhcmFtcy5ub1N3aXBpbmdDbGFzcyAhPT0gJyc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBjb25zdCBldmVudFBhdGggPSBlLmNvbXBvc2VkUGF0aCA/IGUuY29tcG9zZWRQYXRoKCkgOiBlLnBhdGg7XG4gIGlmIChzd2lwaW5nQ2xhc3NIYXNWYWx1ZSAmJiBlLnRhcmdldCAmJiBlLnRhcmdldC5zaGFkb3dSb290ICYmIGV2ZW50UGF0aCkge1xuICAgIHRhcmdldEVsID0gZXZlbnRQYXRoWzBdO1xuICB9XG4gIGNvbnN0IG5vU3dpcGluZ1NlbGVjdG9yID0gcGFyYW1zLm5vU3dpcGluZ1NlbGVjdG9yID8gcGFyYW1zLm5vU3dpcGluZ1NlbGVjdG9yIDogYC4ke3BhcmFtcy5ub1N3aXBpbmdDbGFzc31gO1xuICBjb25zdCBpc1RhcmdldFNoYWRvdyA9ICEhKGUudGFyZ2V0ICYmIGUudGFyZ2V0LnNoYWRvd1Jvb3QpO1xuXG4gIC8vIHVzZSBjbG9zZXN0RWxlbWVudCBmb3Igc2hhZG93IHJvb3QgZWxlbWVudCB0byBnZXQgdGhlIGFjdHVhbCBjbG9zZXN0IGZvciBuZXN0ZWQgc2hhZG93IHJvb3QgZWxlbWVudFxuICBpZiAocGFyYW1zLm5vU3dpcGluZyAmJiAoaXNUYXJnZXRTaGFkb3cgPyBjbG9zZXN0RWxlbWVudChub1N3aXBpbmdTZWxlY3RvciwgdGFyZ2V0RWwpIDogdGFyZ2V0RWwuY2xvc2VzdChub1N3aXBpbmdTZWxlY3RvcikpKSB7XG4gICAgc3dpcGVyLmFsbG93Q2xpY2sgPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLnN3aXBlSGFuZGxlcikge1xuICAgIGlmICghdGFyZ2V0RWwuY2xvc2VzdChwYXJhbXMuc3dpcGVIYW5kbGVyKSkgcmV0dXJuO1xuICB9XG4gIHRvdWNoZXMuY3VycmVudFggPSBlLnBhZ2VYO1xuICB0b3VjaGVzLmN1cnJlbnRZID0gZS5wYWdlWTtcbiAgY29uc3Qgc3RhcnRYID0gdG91Y2hlcy5jdXJyZW50WDtcbiAgY29uc3Qgc3RhcnRZID0gdG91Y2hlcy5jdXJyZW50WTtcblxuICAvLyBEbyBOT1Qgc3RhcnQgaWYgaU9TIGVkZ2Ugc3dpcGUgaXMgZGV0ZWN0ZWQuIE90aGVyd2lzZSBpT1MgYXBwIGNhbm5vdCBzd2lwZS10by1nby1iYWNrIGFueW1vcmVcblxuICBpZiAoIXByZXZlbnRFZGdlU3dpcGUoc3dpcGVyLCBlLCBzdGFydFgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIE9iamVjdC5hc3NpZ24oZGF0YSwge1xuICAgIGlzVG91Y2hlZDogdHJ1ZSxcbiAgICBpc01vdmVkOiBmYWxzZSxcbiAgICBhbGxvd1RvdWNoQ2FsbGJhY2tzOiB0cnVlLFxuICAgIGlzU2Nyb2xsaW5nOiB1bmRlZmluZWQsXG4gICAgc3RhcnRNb3Zpbmc6IHVuZGVmaW5lZFxuICB9KTtcbiAgdG91Y2hlcy5zdGFydFggPSBzdGFydFg7XG4gIHRvdWNoZXMuc3RhcnRZID0gc3RhcnRZO1xuICBkYXRhLnRvdWNoU3RhcnRUaW1lID0gbm93KCk7XG4gIHN3aXBlci5hbGxvd0NsaWNrID0gdHJ1ZTtcbiAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcbiAgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID0gdW5kZWZpbmVkO1xuICBpZiAocGFyYW1zLnRocmVzaG9sZCA+IDApIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlID0gZmFsc2U7XG4gIGxldCBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gIGlmICh0YXJnZXRFbC5tYXRjaGVzKGRhdGEuZm9jdXNhYmxlRWxlbWVudHMpKSB7XG4gICAgcHJldmVudERlZmF1bHQgPSBmYWxzZTtcbiAgICBpZiAodGFyZ2V0RWwubm9kZU5hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGFyZ2V0RWwgJiYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScgfHwgZS5wb2ludGVyVHlwZSAhPT0gJ21vdXNlJyAmJiAhdGFyZ2V0RWwubWF0Y2hlcyhkYXRhLmZvY3VzYWJsZUVsZW1lbnRzKSkpIHtcbiAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuICBjb25zdCBzaG91bGRQcmV2ZW50RGVmYXVsdCA9IHByZXZlbnREZWZhdWx0ICYmIHN3aXBlci5hbGxvd1RvdWNoTW92ZSAmJiBwYXJhbXMudG91Y2hTdGFydFByZXZlbnREZWZhdWx0O1xuICBpZiAoKHBhcmFtcy50b3VjaFN0YXJ0Rm9yY2VQcmV2ZW50RGVmYXVsdCB8fCBzaG91bGRQcmV2ZW50RGVmYXVsdCkgJiYgIXRhcmdldEVsLmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIGlmIChwYXJhbXMuZnJlZU1vZGUgJiYgcGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQgJiYgc3dpcGVyLmZyZWVNb2RlICYmIHN3aXBlci5hbmltYXRpbmcgJiYgIXBhcmFtcy5jc3NNb2RlKSB7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hTdGFydCgpO1xuICB9XG4gIHN3aXBlci5lbWl0KCd0b3VjaFN0YXJ0JywgZSk7XG59XG5cbmZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XG4gIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3QgZGF0YSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XG4gIGNvbnN0IHtcbiAgICBwYXJhbXMsXG4gICAgdG91Y2hlcyxcbiAgICBydGxUcmFuc2xhdGU6IHJ0bCxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXBhcmFtcy5zaW11bGF0ZVRvdWNoICYmIGV2ZW50LnBvaW50ZXJUeXBlID09PSAnbW91c2UnKSByZXR1cm47XG4gIGxldCBlID0gZXZlbnQ7XG4gIGlmIChlLm9yaWdpbmFsRXZlbnQpIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gIGlmIChlLnR5cGUgPT09ICdwb2ludGVybW92ZScpIHtcbiAgICBpZiAoZGF0YS50b3VjaElkICE9PSBudWxsKSByZXR1cm47IC8vIHJldHVybiBmcm9tIHBvaW50ZXIgaWYgd2UgdXNlIHRvdWNoXG4gICAgY29uc3QgaWQgPSBlLnBvaW50ZXJJZDtcbiAgICBpZiAoaWQgIT09IGRhdGEucG9pbnRlcklkKSByZXR1cm47XG4gIH1cbiAgbGV0IHRhcmdldFRvdWNoO1xuICBpZiAoZS50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgIHRhcmdldFRvdWNoID0gWy4uLmUuY2hhbmdlZFRvdWNoZXNdLmZpbHRlcih0ID0+IHQuaWRlbnRpZmllciA9PT0gZGF0YS50b3VjaElkKVswXTtcbiAgICBpZiAoIXRhcmdldFRvdWNoIHx8IHRhcmdldFRvdWNoLmlkZW50aWZpZXIgIT09IGRhdGEudG91Y2hJZCkgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldFRvdWNoID0gZTtcbiAgfVxuICBpZiAoIWRhdGEuaXNUb3VjaGVkKSB7XG4gICAgaWYgKGRhdGEuc3RhcnRNb3ZpbmcgJiYgZGF0YS5pc1Njcm9sbGluZykge1xuICAgICAgc3dpcGVyLmVtaXQoJ3RvdWNoTW92ZU9wcG9zaXRlJywgZSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwYWdlWCA9IHRhcmdldFRvdWNoLnBhZ2VYO1xuICBjb25zdCBwYWdlWSA9IHRhcmdldFRvdWNoLnBhZ2VZO1xuICBpZiAoZS5wcmV2ZW50ZWRCeU5lc3RlZFN3aXBlcikge1xuICAgIHRvdWNoZXMuc3RhcnRYID0gcGFnZVg7XG4gICAgdG91Y2hlcy5zdGFydFkgPSBwYWdlWTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFzd2lwZXIuYWxsb3dUb3VjaE1vdmUpIHtcbiAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcbiAgICAgIHN3aXBlci5hbGxvd0NsaWNrID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChkYXRhLmlzVG91Y2hlZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0b3VjaGVzLCB7XG4gICAgICAgIHN0YXJ0WDogcGFnZVgsXG4gICAgICAgIHN0YXJ0WTogcGFnZVksXG4gICAgICAgIGN1cnJlbnRYOiBwYWdlWCxcbiAgICAgICAgY3VycmVudFk6IHBhZ2VZXG4gICAgICB9KTtcbiAgICAgIGRhdGEudG91Y2hTdGFydFRpbWUgPSBub3coKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcyAmJiAhcGFyYW1zLmxvb3ApIHtcbiAgICBpZiAoc3dpcGVyLmlzVmVydGljYWwoKSkge1xuICAgICAgLy8gVmVydGljYWxcbiAgICAgIGlmIChwYWdlWSA8IHRvdWNoZXMuc3RhcnRZICYmIHN3aXBlci50cmFuc2xhdGUgPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIHx8IHBhZ2VZID4gdG91Y2hlcy5zdGFydFkgJiYgc3dpcGVyLnRyYW5zbGF0ZSA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBhZ2VYIDwgdG91Y2hlcy5zdGFydFggJiYgc3dpcGVyLnRyYW5zbGF0ZSA8PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgfHwgcGFnZVggPiB0b3VjaGVzLnN0YXJ0WCAmJiBzd2lwZXIudHJhbnNsYXRlID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZS50YXJnZXQgJiYgZS5wb2ludGVyVHlwZSAhPT0gJ21vdXNlJykge1xuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICB9XG4gIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGUudGFyZ2V0Lm1hdGNoZXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcbiAgICAgIGRhdGEuaXNNb3ZlZCA9IHRydWU7XG4gICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoZGF0YS5hbGxvd1RvdWNoQ2FsbGJhY2tzKSB7XG4gICAgc3dpcGVyLmVtaXQoJ3RvdWNoTW92ZScsIGUpO1xuICB9XG4gIHRvdWNoZXMucHJldmlvdXNYID0gdG91Y2hlcy5jdXJyZW50WDtcbiAgdG91Y2hlcy5wcmV2aW91c1kgPSB0b3VjaGVzLmN1cnJlbnRZO1xuICB0b3VjaGVzLmN1cnJlbnRYID0gcGFnZVg7XG4gIHRvdWNoZXMuY3VycmVudFkgPSBwYWdlWTtcbiAgY29uc3QgZGlmZlggPSB0b3VjaGVzLmN1cnJlbnRYIC0gdG91Y2hlcy5zdGFydFg7XG4gIGNvbnN0IGRpZmZZID0gdG91Y2hlcy5jdXJyZW50WSAtIHRvdWNoZXMuc3RhcnRZO1xuICBpZiAoc3dpcGVyLnBhcmFtcy50aHJlc2hvbGQgJiYgTWF0aC5zcXJ0KGRpZmZYICoqIDIgKyBkaWZmWSAqKiAyKSA8IHN3aXBlci5wYXJhbXMudGhyZXNob2xkKSByZXR1cm47XG4gIGlmICh0eXBlb2YgZGF0YS5pc1Njcm9sbGluZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsZXQgdG91Y2hBbmdsZTtcbiAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIHRvdWNoZXMuY3VycmVudFkgPT09IHRvdWNoZXMuc3RhcnRZIHx8IHN3aXBlci5pc1ZlcnRpY2FsKCkgJiYgdG91Y2hlcy5jdXJyZW50WCA9PT0gdG91Y2hlcy5zdGFydFgpIHtcbiAgICAgIGRhdGEuaXNTY3JvbGxpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBpZiAoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkgPj0gMjUpIHtcbiAgICAgICAgdG91Y2hBbmdsZSA9IE1hdGguYXRhbjIoTWF0aC5hYnMoZGlmZlkpLCBNYXRoLmFicyhkaWZmWCkpICogMTgwIC8gTWF0aC5QSTtcbiAgICAgICAgZGF0YS5pc1Njcm9sbGluZyA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHRvdWNoQW5nbGUgPiBwYXJhbXMudG91Y2hBbmdsZSA6IDkwIC0gdG91Y2hBbmdsZSA+IHBhcmFtcy50b3VjaEFuZ2xlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZGF0YS5pc1Njcm9sbGluZykge1xuICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmVPcHBvc2l0ZScsIGUpO1xuICB9XG4gIGlmICh0eXBlb2YgZGF0YS5zdGFydE1vdmluZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodG91Y2hlcy5jdXJyZW50WCAhPT0gdG91Y2hlcy5zdGFydFggfHwgdG91Y2hlcy5jdXJyZW50WSAhPT0gdG91Y2hlcy5zdGFydFkpIHtcbiAgICAgIGRhdGEuc3RhcnRNb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBpZiAoZGF0YS5pc1Njcm9sbGluZyB8fCBlLnR5cGUgPT09ICd0b3VjaG1vdmUnICYmIGRhdGEucHJldmVudFRvdWNoTW92ZUZyb21Qb2ludGVyTW92ZSkge1xuICAgIGRhdGEuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghZGF0YS5zdGFydE1vdmluZykge1xuICAgIHJldHVybjtcbiAgfVxuICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xuICBpZiAoIXBhcmFtcy5jc3NNb2RlICYmIGUuY2FuY2VsYWJsZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBpZiAocGFyYW1zLnRvdWNoTW92ZVN0b3BQcm9wYWdhdGlvbiAmJiAhcGFyYW1zLm5lc3RlZCkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cbiAgbGV0IGRpZmYgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBkaWZmWCA6IGRpZmZZO1xuICBsZXQgdG91Y2hlc0RpZmYgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyB0b3VjaGVzLmN1cnJlbnRYIC0gdG91Y2hlcy5wcmV2aW91c1ggOiB0b3VjaGVzLmN1cnJlbnRZIC0gdG91Y2hlcy5wcmV2aW91c1k7XG4gIGlmIChwYXJhbXMub25lV2F5TW92ZW1lbnQpIHtcbiAgICBkaWZmID0gTWF0aC5hYnMoZGlmZikgKiAocnRsID8gMSA6IC0xKTtcbiAgICB0b3VjaGVzRGlmZiA9IE1hdGguYWJzKHRvdWNoZXNEaWZmKSAqIChydGwgPyAxIDogLTEpO1xuICB9XG4gIHRvdWNoZXMuZGlmZiA9IGRpZmY7XG4gIGRpZmYgKj0gcGFyYW1zLnRvdWNoUmF0aW87XG4gIGlmIChydGwpIHtcbiAgICBkaWZmID0gLWRpZmY7XG4gICAgdG91Y2hlc0RpZmYgPSAtdG91Y2hlc0RpZmY7XG4gIH1cbiAgY29uc3QgcHJldlRvdWNoZXNEaXJlY3Rpb24gPSBzd2lwZXIudG91Y2hlc0RpcmVjdGlvbjtcbiAgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAncHJldicgOiAnbmV4dCc7XG4gIHN3aXBlci50b3VjaGVzRGlyZWN0aW9uID0gdG91Y2hlc0RpZmYgPiAwID8gJ3ByZXYnIDogJ25leHQnO1xuICBjb25zdCBpc0xvb3AgPSBzd2lwZXIucGFyYW1zLmxvb3AgJiYgIXBhcmFtcy5jc3NNb2RlO1xuICBjb25zdCBhbGxvd0xvb3BGaXggPSBzd2lwZXIudG91Y2hlc0RpcmVjdGlvbiA9PT0gJ25leHQnICYmIHN3aXBlci5hbGxvd1NsaWRlTmV4dCB8fCBzd2lwZXIudG91Y2hlc0RpcmVjdGlvbiA9PT0gJ3ByZXYnICYmIHN3aXBlci5hbGxvd1NsaWRlUHJldjtcbiAgaWYgKCFkYXRhLmlzTW92ZWQpIHtcbiAgICBpZiAoaXNMb29wICYmIGFsbG93TG9vcEZpeCkge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICBkaXJlY3Rpb246IHN3aXBlci5zd2lwZURpcmVjdGlvblxuICAgICAgfSk7XG4gICAgfVxuICAgIGRhdGEuc3RhcnRUcmFuc2xhdGUgPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCk7XG4gICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XG4gICAgaWYgKHN3aXBlci5hbmltYXRpbmcpIHtcbiAgICAgIGNvbnN0IGV2dCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ3RyYW5zaXRpb25lbmQnLCB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGJ5U3dpcGVyVG91Y2hNb3ZlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLndyYXBwZXJFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfVxuICAgIGRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSA9IGZhbHNlO1xuICAgIC8vIEdyYWIgQ3Vyc29yXG4gICAgaWYgKHBhcmFtcy5ncmFiQ3Vyc29yICYmIChzd2lwZXIuYWxsb3dTbGlkZU5leHQgPT09IHRydWUgfHwgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID09PSB0cnVlKSkge1xuICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IodHJ1ZSk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdzbGlkZXJGaXJzdE1vdmUnLCBlKTtcbiAgfVxuICBsZXQgbG9vcEZpeGVkO1xuICBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgaWYgKGRhdGEuaXNNb3ZlZCAmJiBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSAmJiBwcmV2VG91Y2hlc0RpcmVjdGlvbiAhPT0gc3dpcGVyLnRvdWNoZXNEaXJlY3Rpb24gJiYgaXNMb29wICYmIGFsbG93TG9vcEZpeCAmJiBNYXRoLmFicyhkaWZmKSA+PSAxKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0b3VjaGVzLCB7XG4gICAgICBzdGFydFg6IHBhZ2VYLFxuICAgICAgc3RhcnRZOiBwYWdlWSxcbiAgICAgIGN1cnJlbnRYOiBwYWdlWCxcbiAgICAgIGN1cnJlbnRZOiBwYWdlWSxcbiAgICAgIHN0YXJ0VHJhbnNsYXRlOiBkYXRhLmN1cnJlbnRUcmFuc2xhdGVcbiAgICB9KTtcbiAgICBkYXRhLmxvb3BTd2FwUmVzZXQgPSB0cnVlO1xuICAgIGRhdGEuc3RhcnRUcmFuc2xhdGUgPSBkYXRhLmN1cnJlbnRUcmFuc2xhdGU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN3aXBlci5lbWl0KCdzbGlkZXJNb3ZlJywgZSk7XG4gIGRhdGEuaXNNb3ZlZCA9IHRydWU7XG4gIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRpZmYgKyBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xuICBsZXQgZGlzYWJsZVBhcmVudFN3aXBlciA9IHRydWU7XG4gIGxldCByZXNpc3RhbmNlUmF0aW8gPSBwYXJhbXMucmVzaXN0YW5jZVJhdGlvO1xuICBpZiAocGFyYW1zLnRvdWNoUmVsZWFzZU9uRWRnZXMpIHtcbiAgICByZXNpc3RhbmNlUmF0aW8gPSAwO1xuICB9XG4gIGlmIChkaWZmID4gMCkge1xuICAgIGlmIChpc0xvb3AgJiYgYWxsb3dMb29wRml4ICYmICFsb29wRml4ZWQgJiYgZGF0YS5hbGxvd1RocmVzaG9sZE1vdmUgJiYgZGF0YS5jdXJyZW50VHJhbnNsYXRlID4gKHBhcmFtcy5jZW50ZXJlZFNsaWRlcyA/IHN3aXBlci5taW5UcmFuc2xhdGUoKSAtIHN3aXBlci5zbGlkZXNTaXplc0dyaWRbc3dpcGVyLmFjdGl2ZUluZGV4ICsgMV0gLSAocGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIHBhcmFtcy5zbGlkZXNQZXJWaWV3ID49IDIgPyBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW3N3aXBlci5hY3RpdmVJbmRleCArIDFdICsgc3dpcGVyLnBhcmFtcy5zcGFjZUJldHdlZW4gOiAwKSAtIHN3aXBlci5wYXJhbXMuc3BhY2VCZXR3ZWVuIDogc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSkge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICBkaXJlY3Rpb246ICdwcmV2JyxcbiAgICAgICAgc2V0VHJhbnNsYXRlOiB0cnVlLFxuICAgICAgICBhY3RpdmVTbGlkZUluZGV4OiAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGRhdGEuY3VycmVudFRyYW5zbGF0ZSA+IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgZGlzYWJsZVBhcmVudFN3aXBlciA9IGZhbHNlO1xuICAgICAgaWYgKHBhcmFtcy5yZXNpc3RhbmNlKSB7XG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci5taW5UcmFuc2xhdGUoKSAtIDEgKyAoLXN3aXBlci5taW5UcmFuc2xhdGUoKSArIGRhdGEuc3RhcnRUcmFuc2xhdGUgKyBkaWZmKSAqKiByZXNpc3RhbmNlUmF0aW87XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGRpZmYgPCAwKSB7XG4gICAgaWYgKGlzTG9vcCAmJiBhbGxvd0xvb3BGaXggJiYgIWxvb3BGaXhlZCAmJiBkYXRhLmFsbG93VGhyZXNob2xkTW92ZSAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPCAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1heFRyYW5zbGF0ZSgpICsgc3dpcGVyLnNsaWRlc1NpemVzR3JpZFtzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkLmxlbmd0aCAtIDFdICsgc3dpcGVyLnBhcmFtcy5zcGFjZUJldHdlZW4gKyAocGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIHBhcmFtcy5zbGlkZXNQZXJWaWV3ID49IDIgPyBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW3N3aXBlci5zbGlkZXNTaXplc0dyaWQubGVuZ3RoIC0gMV0gKyBzd2lwZXIucGFyYW1zLnNwYWNlQmV0d2VlbiA6IDApIDogc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSkge1xuICAgICAgc3dpcGVyLmxvb3BGaXgoe1xuICAgICAgICBkaXJlY3Rpb246ICduZXh0JyxcbiAgICAgICAgc2V0VHJhbnNsYXRlOiB0cnVlLFxuICAgICAgICBhY3RpdmVTbGlkZUluZGV4OiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nID8gc3dpcGVyLnNsaWRlc1BlclZpZXdEeW5hbWljKCkgOiBNYXRoLmNlaWwocGFyc2VGbG9hdChwYXJhbXMuc2xpZGVzUGVyVmlldywgMTApKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZGF0YS5jdXJyZW50VHJhbnNsYXRlIDwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICBkaXNhYmxlUGFyZW50U3dpcGVyID0gZmFsc2U7XG4gICAgICBpZiAocGFyYW1zLnJlc2lzdGFuY2UpIHtcbiAgICAgICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpICsgMSAtIChzd2lwZXIubWF4VHJhbnNsYXRlKCkgLSBkYXRhLnN0YXJ0VHJhbnNsYXRlIC0gZGlmZikgKiogcmVzaXN0YW5jZVJhdGlvO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZGlzYWJsZVBhcmVudFN3aXBlcikge1xuICAgIGUucHJldmVudGVkQnlOZXN0ZWRTd2lwZXIgPSB0cnVlO1xuICB9XG5cbiAgLy8gRGlyZWN0aW9ucyBsb2Nrc1xuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlTmV4dCAmJiBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0JyAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPCBkYXRhLnN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICdwcmV2JyAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPiBkYXRhLnN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiAhc3dpcGVyLmFsbG93U2xpZGVOZXh0KSB7XG4gICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcbiAgfVxuXG4gIC8vIFRocmVzaG9sZFxuICBpZiAocGFyYW1zLnRocmVzaG9sZCA+IDApIHtcbiAgICBpZiAoTWF0aC5hYnMoZGlmZikgPiBwYXJhbXMudGhyZXNob2xkIHx8IGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XG4gICAgICBpZiAoIWRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XG4gICAgICAgIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgdG91Y2hlcy5zdGFydFggPSB0b3VjaGVzLmN1cnJlbnRYO1xuICAgICAgICB0b3VjaGVzLnN0YXJ0WSA9IHRvdWNoZXMuY3VycmVudFk7XG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XG4gICAgICAgIHRvdWNoZXMuZGlmZiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHRvdWNoZXMuY3VycmVudFggLSB0b3VjaGVzLnN0YXJ0WCA6IHRvdWNoZXMuY3VycmVudFkgLSB0b3VjaGVzLnN0YXJ0WTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoIXBhcmFtcy5mb2xsb3dGaW5nZXIgfHwgcGFyYW1zLmNzc01vZGUpIHJldHVybjtcblxuICAvLyBVcGRhdGUgYWN0aXZlIGluZGV4IGluIGZyZWUgbW9kZVxuICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIHN3aXBlci5mcmVlTW9kZSB8fCBwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xuICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gIH1cbiAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiBzd2lwZXIuZnJlZU1vZGUpIHtcbiAgICBzd2lwZXIuZnJlZU1vZGUub25Ub3VjaE1vdmUoKTtcbiAgfVxuICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKGRhdGEuY3VycmVudFRyYW5zbGF0ZSk7XG4gIC8vIFVwZGF0ZSB0cmFuc2xhdGVcbiAgc3dpcGVyLnNldFRyYW5zbGF0ZShkYXRhLmN1cnJlbnRUcmFuc2xhdGUpO1xufVxuXG5mdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IGRhdGEgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhO1xuICBsZXQgZSA9IGV2ZW50O1xuICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICBsZXQgdGFyZ2V0VG91Y2g7XG4gIGNvbnN0IGlzVG91Y2hFdmVudCA9IGUudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBlLnR5cGUgPT09ICd0b3VjaGNhbmNlbCc7XG4gIGlmICghaXNUb3VjaEV2ZW50KSB7XG4gICAgaWYgKGRhdGEudG91Y2hJZCAhPT0gbnVsbCkgcmV0dXJuOyAvLyByZXR1cm4gZnJvbSBwb2ludGVyIGlmIHdlIHVzZSB0b3VjaFxuICAgIGlmIChlLnBvaW50ZXJJZCAhPT0gZGF0YS5wb2ludGVySWQpIHJldHVybjtcbiAgICB0YXJnZXRUb3VjaCA9IGU7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0VG91Y2ggPSBbLi4uZS5jaGFuZ2VkVG91Y2hlc10uZmlsdGVyKHQgPT4gdC5pZGVudGlmaWVyID09PSBkYXRhLnRvdWNoSWQpWzBdO1xuICAgIGlmICghdGFyZ2V0VG91Y2ggfHwgdGFyZ2V0VG91Y2guaWRlbnRpZmllciAhPT0gZGF0YS50b3VjaElkKSByZXR1cm47XG4gIH1cbiAgaWYgKFsncG9pbnRlcmNhbmNlbCcsICdwb2ludGVyb3V0JywgJ3BvaW50ZXJsZWF2ZScsICdjb250ZXh0bWVudSddLmluY2x1ZGVzKGUudHlwZSkpIHtcbiAgICBjb25zdCBwcm9jZWVkID0gWydwb2ludGVyY2FuY2VsJywgJ2NvbnRleHRtZW51J10uaW5jbHVkZXMoZS50eXBlKSAmJiAoc3dpcGVyLmJyb3dzZXIuaXNTYWZhcmkgfHwgc3dpcGVyLmJyb3dzZXIuaXNXZWJWaWV3KTtcbiAgICBpZiAoIXByb2NlZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgZGF0YS5wb2ludGVySWQgPSBudWxsO1xuICBkYXRhLnRvdWNoSWQgPSBudWxsO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIHRvdWNoZXMsXG4gICAgcnRsVHJhbnNsYXRlOiBydGwsXG4gICAgc2xpZGVzR3JpZCxcbiAgICBlbmFibGVkXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXBhcmFtcy5zaW11bGF0ZVRvdWNoICYmIGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHJldHVybjtcbiAgaWYgKGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcykge1xuICAgIHN3aXBlci5lbWl0KCd0b3VjaEVuZCcsIGUpO1xuICB9XG4gIGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcyA9IGZhbHNlO1xuICBpZiAoIWRhdGEuaXNUb3VjaGVkKSB7XG4gICAgaWYgKGRhdGEuaXNNb3ZlZCAmJiBwYXJhbXMuZ3JhYkN1cnNvcikge1xuICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoZmFsc2UpO1xuICAgIH1cbiAgICBkYXRhLmlzTW92ZWQgPSBmYWxzZTtcbiAgICBkYXRhLnN0YXJ0TW92aW5nID0gZmFsc2U7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmV0dXJuIEdyYWIgQ3Vyc29yXG4gIGlmIChwYXJhbXMuZ3JhYkN1cnNvciAmJiBkYXRhLmlzTW92ZWQgJiYgZGF0YS5pc1RvdWNoZWQgJiYgKHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9PT0gdHJ1ZSB8fCBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPT09IHRydWUpKSB7XG4gICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoZmFsc2UpO1xuICB9XG5cbiAgLy8gVGltZSBkaWZmXG4gIGNvbnN0IHRvdWNoRW5kVGltZSA9IG5vdygpO1xuICBjb25zdCB0aW1lRGlmZiA9IHRvdWNoRW5kVGltZSAtIGRhdGEudG91Y2hTdGFydFRpbWU7XG5cbiAgLy8gVGFwLCBkb3VibGVUYXAsIENsaWNrXG4gIGlmIChzd2lwZXIuYWxsb3dDbGljaykge1xuICAgIGNvbnN0IHBhdGhUcmVlID0gZS5wYXRoIHx8IGUuY29tcG9zZWRQYXRoICYmIGUuY29tcG9zZWRQYXRoKCk7XG4gICAgc3dpcGVyLnVwZGF0ZUNsaWNrZWRTbGlkZShwYXRoVHJlZSAmJiBwYXRoVHJlZVswXSB8fCBlLnRhcmdldCwgcGF0aFRyZWUpO1xuICAgIHN3aXBlci5lbWl0KCd0YXAgY2xpY2snLCBlKTtcbiAgICBpZiAodGltZURpZmYgPCAzMDAgJiYgdG91Y2hFbmRUaW1lIC0gZGF0YS5sYXN0Q2xpY2tUaW1lIDwgMzAwKSB7XG4gICAgICBzd2lwZXIuZW1pdCgnZG91YmxlVGFwIGRvdWJsZUNsaWNrJywgZSk7XG4gICAgfVxuICB9XG4gIGRhdGEubGFzdENsaWNrVGltZSA9IG5vdygpO1xuICBuZXh0VGljaygoKSA9PiB7XG4gICAgaWYgKCFzd2lwZXIuZGVzdHJveWVkKSBzd2lwZXIuYWxsb3dDbGljayA9IHRydWU7XG4gIH0pO1xuICBpZiAoIWRhdGEuaXNUb3VjaGVkIHx8ICFkYXRhLmlzTW92ZWQgfHwgIXN3aXBlci5zd2lwZURpcmVjdGlvbiB8fCB0b3VjaGVzLmRpZmYgPT09IDAgJiYgIWRhdGEubG9vcFN3YXBSZXNldCB8fCBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPT09IGRhdGEuc3RhcnRUcmFuc2xhdGUgJiYgIWRhdGEubG9vcFN3YXBSZXNldCkge1xuICAgIGRhdGEuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XG4gICAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xuICAgIHJldHVybjtcbiAgfVxuICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xuICBkYXRhLmlzTW92ZWQgPSBmYWxzZTtcbiAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xuICBsZXQgY3VycmVudFBvcztcbiAgaWYgKHBhcmFtcy5mb2xsb3dGaW5nZXIpIHtcbiAgICBjdXJyZW50UG9zID0gcnRsID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xuICB9IGVsc2Uge1xuICAgIGN1cnJlbnRQb3MgPSAtZGF0YS5jdXJyZW50VHJhbnNsYXRlO1xuICB9XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkKSB7XG4gICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hFbmQoe1xuICAgICAgY3VycmVudFBvc1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZpbmQgY3VycmVudCBzbGlkZVxuICBjb25zdCBzd2lwZVRvTGFzdCA9IGN1cnJlbnRQb3MgPj0gLXN3aXBlci5tYXhUcmFuc2xhdGUoKSAmJiAhc3dpcGVyLnBhcmFtcy5sb29wO1xuICBsZXQgc3RvcEluZGV4ID0gMDtcbiAgbGV0IGdyb3VwU2l6ZSA9IHN3aXBlci5zbGlkZXNTaXplc0dyaWRbMF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzR3JpZC5sZW5ndGg7IGkgKz0gaSA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgPyAxIDogcGFyYW1zLnNsaWRlc1Blckdyb3VwKSB7XG4gICAgY29uc3QgaW5jcmVtZW50ID0gaSA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgLSAxID8gMSA6IHBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICBpZiAodHlwZW9mIHNsaWRlc0dyaWRbaSArIGluY3JlbWVudF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoc3dpcGVUb0xhc3QgfHwgY3VycmVudFBvcyA+PSBzbGlkZXNHcmlkW2ldICYmIGN1cnJlbnRQb3MgPCBzbGlkZXNHcmlkW2kgKyBpbmNyZW1lbnRdKSB7XG4gICAgICAgIHN0b3BJbmRleCA9IGk7XG4gICAgICAgIGdyb3VwU2l6ZSA9IHNsaWRlc0dyaWRbaSArIGluY3JlbWVudF0gLSBzbGlkZXNHcmlkW2ldO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3dpcGVUb0xhc3QgfHwgY3VycmVudFBvcyA+PSBzbGlkZXNHcmlkW2ldKSB7XG4gICAgICBzdG9wSW5kZXggPSBpO1xuICAgICAgZ3JvdXBTaXplID0gc2xpZGVzR3JpZFtzbGlkZXNHcmlkLmxlbmd0aCAtIDFdIC0gc2xpZGVzR3JpZFtzbGlkZXNHcmlkLmxlbmd0aCAtIDJdO1xuICAgIH1cbiAgfVxuICBsZXQgcmV3aW5kRmlyc3RJbmRleCA9IG51bGw7XG4gIGxldCByZXdpbmRMYXN0SW5kZXggPSBudWxsO1xuICBpZiAocGFyYW1zLnJld2luZCkge1xuICAgIGlmIChzd2lwZXIuaXNCZWdpbm5pbmcpIHtcbiAgICAgIHJld2luZExhc3RJbmRleCA9IHBhcmFtcy52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIC0gMSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0VuZCkge1xuICAgICAgcmV3aW5kRmlyc3RJbmRleCA9IDA7XG4gICAgfVxuICB9XG4gIC8vIEZpbmQgY3VycmVudCBzbGlkZSBzaXplXG4gIGNvbnN0IHJhdGlvID0gKGN1cnJlbnRQb3MgLSBzbGlkZXNHcmlkW3N0b3BJbmRleF0pIC8gZ3JvdXBTaXplO1xuICBjb25zdCBpbmNyZW1lbnQgPSBzdG9wSW5kZXggPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwIC0gMSA/IDEgOiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XG4gIGlmICh0aW1lRGlmZiA+IHBhcmFtcy5sb25nU3dpcGVzTXMpIHtcbiAgICAvLyBMb25nIHRvdWNoZXNcbiAgICBpZiAoIXBhcmFtcy5sb25nU3dpcGVzKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgIGlmIChyYXRpbyA+PSBwYXJhbXMubG9uZ1N3aXBlc1JhdGlvKSBzd2lwZXIuc2xpZGVUbyhwYXJhbXMucmV3aW5kICYmIHN3aXBlci5pc0VuZCA/IHJld2luZEZpcnN0SW5kZXggOiBzdG9wSW5kZXggKyBpbmNyZW1lbnQpO2Vsc2Ugc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4KTtcbiAgICB9XG4gICAgaWYgKHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICBpZiAocmF0aW8gPiAxIC0gcGFyYW1zLmxvbmdTd2lwZXNSYXRpbykge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzdG9wSW5kZXggKyBpbmNyZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChyZXdpbmRMYXN0SW5kZXggIT09IG51bGwgJiYgcmF0aW8gPCAwICYmIE1hdGguYWJzKHJhdGlvKSA+IHBhcmFtcy5sb25nU3dpcGVzUmF0aW8pIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kTGFzdEluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFNob3J0IHN3aXBlc1xuICAgIGlmICghcGFyYW1zLnNob3J0U3dpcGVzKSB7XG4gICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc05hdkJ1dHRvblRhcmdldCA9IHN3aXBlci5uYXZpZ2F0aW9uICYmIChlLnRhcmdldCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsIHx8IGUudGFyZ2V0ID09PSBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwpO1xuICAgIGlmICghaXNOYXZCdXR0b25UYXJnZXQpIHtcbiAgICAgIGlmIChzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0Jykge1xuICAgICAgICBzd2lwZXIuc2xpZGVUbyhyZXdpbmRGaXJzdEluZGV4ICE9PSBudWxsID8gcmV3aW5kRmlyc3RJbmRleCA6IHN0b3BJbmRleCArIGluY3JlbWVudCk7XG4gICAgICB9XG4gICAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAncHJldicpIHtcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kTGFzdEluZGV4ICE9PSBudWxsID8gcmV3aW5kTGFzdEluZGV4IDogc3RvcEluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSBzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwpIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCArIGluY3JlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIGVsXG4gIH0gPSBzd2lwZXI7XG4gIGlmIChlbCAmJiBlbC5vZmZzZXRXaWR0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIC8vIEJyZWFrcG9pbnRzXG4gIGlmIChwYXJhbXMuYnJlYWtwb2ludHMpIHtcbiAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xuICB9XG5cbiAgLy8gU2F2ZSBsb2Nrc1xuICBjb25zdCB7XG4gICAgYWxsb3dTbGlkZU5leHQsXG4gICAgYWxsb3dTbGlkZVByZXYsXG4gICAgc25hcEdyaWRcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XG5cbiAgLy8gRGlzYWJsZSBsb2NrcyBvbiByZXNpemVcbiAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gdHJ1ZTtcbiAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gdHJ1ZTtcbiAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICBjb25zdCBpc1ZpcnR1YWxMb29wID0gaXNWaXJ0dWFsICYmIHBhcmFtcy5sb29wO1xuICBpZiAoKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgfHwgcGFyYW1zLnNsaWRlc1BlclZpZXcgPiAxKSAmJiBzd2lwZXIuaXNFbmQgJiYgIXN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiAhaXNWaXJ0dWFsTG9vcCkge1xuICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMSwgMCwgZmFsc2UsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3AgJiYgIWlzVmlydHVhbCkge1xuICAgICAgc3dpcGVyLnNsaWRlVG9Mb29wKHN3aXBlci5yZWFsSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGlmIChzd2lwZXIuYXV0b3BsYXkgJiYgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgJiYgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgIGNsZWFyVGltZW91dChzd2lwZXIuYXV0b3BsYXkucmVzaXplVGltZW91dCk7XG4gICAgc3dpcGVyLmF1dG9wbGF5LnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChzd2lwZXIuYXV0b3BsYXkgJiYgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgJiYgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xuICAgICAgICBzd2lwZXIuYXV0b3BsYXkucmVzdW1lKCk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfVxuICAvLyBSZXR1cm4gbG9ja3MgYWZ0ZXIgcmVzaXplXG4gIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xuICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSBhbGxvd1NsaWRlTmV4dDtcbiAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzbmFwR3JpZCAhPT0gc3dpcGVyLnNuYXBHcmlkKSB7XG4gICAgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkNsaWNrKGUpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgaWYgKCFzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICBpZiAoIXN3aXBlci5hbGxvd0NsaWNrKSB7XG4gICAgaWYgKHN3aXBlci5wYXJhbXMucHJldmVudENsaWNrcykgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLnByZXZlbnRDbGlja3NQcm9wYWdhdGlvbiAmJiBzd2lwZXIuYW5pbWF0aW5nKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25TY3JvbGwoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICB3cmFwcGVyRWwsXG4gICAgcnRsVHJhbnNsYXRlLFxuICAgIGVuYWJsZWRcbiAgfSA9IHN3aXBlcjtcbiAgaWYgKCFlbmFibGVkKSByZXR1cm47XG4gIHN3aXBlci5wcmV2aW91c1RyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XG4gIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcbiAgICBzd2lwZXIudHJhbnNsYXRlID0gLXdyYXBwZXJFbC5zY3JvbGxMZWZ0O1xuICB9IGVsc2Uge1xuICAgIHN3aXBlci50cmFuc2xhdGUgPSAtd3JhcHBlckVsLnNjcm9sbFRvcDtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgaWYgKHN3aXBlci50cmFuc2xhdGUgPT09IDApIHN3aXBlci50cmFuc2xhdGUgPSAwO1xuICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgbGV0IG5ld1Byb2dyZXNzO1xuICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcbiAgaWYgKHRyYW5zbGF0ZXNEaWZmID09PSAwKSB7XG4gICAgbmV3UHJvZ3Jlc3MgPSAwO1xuICB9IGVsc2Uge1xuICAgIG5ld1Byb2dyZXNzID0gKHN3aXBlci50cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XG4gIH1cbiAgaWYgKG5ld1Byb2dyZXNzICE9PSBzd2lwZXIucHJvZ3Jlc3MpIHtcbiAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MocnRsVHJhbnNsYXRlID8gLXN3aXBlci50cmFuc2xhdGUgOiBzd2lwZXIudHJhbnNsYXRlKTtcbiAgfVxuICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNsYXRlJywgc3dpcGVyLnRyYW5zbGF0ZSwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBvbkxvYWQoZSkge1xuICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICBwcm9jZXNzTGF6eVByZWxvYWRlcihzd2lwZXIsIGUudGFyZ2V0KTtcbiAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSB8fCBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiAhc3dpcGVyLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN3aXBlci51cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoU3RhcnQoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGlmIChzd2lwZXIuZG9jdW1lbnRUb3VjaEhhbmRsZXJQcm9jZWVkZWQpIHJldHVybjtcbiAgc3dpcGVyLmRvY3VtZW50VG91Y2hIYW5kbGVyUHJvY2VlZGVkID0gdHJ1ZTtcbiAgaWYgKHN3aXBlci5wYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcykge1xuICAgIHN3aXBlci5lbC5zdHlsZS50b3VjaEFjdGlvbiA9ICdhdXRvJztcbiAgfVxufVxuXG5jb25zdCBldmVudHMgPSAoc3dpcGVyLCBtZXRob2QpID0+IHtcbiAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xuICBjb25zdCB7XG4gICAgcGFyYW1zLFxuICAgIGVsLFxuICAgIHdyYXBwZXJFbCxcbiAgICBkZXZpY2VcbiAgfSA9IHN3aXBlcjtcbiAgY29uc3QgY2FwdHVyZSA9ICEhcGFyYW1zLm5lc3RlZDtcbiAgY29uc3QgZG9tTWV0aG9kID0gbWV0aG9kID09PSAnb24nID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xuICBjb25zdCBzd2lwZXJNZXRob2QgPSBtZXRob2Q7XG4gIGlmICghZWwgfHwgdHlwZW9mIGVsID09PSAnc3RyaW5nJykgcmV0dXJuO1xuXG4gIC8vIFRvdWNoIEV2ZW50c1xuICBkb2N1bWVudFtkb21NZXRob2RdKCd0b3VjaHN0YXJ0Jywgc3dpcGVyLm9uRG9jdW1lbnRUb3VjaFN0YXJ0LCB7XG4gICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgY2FwdHVyZVxuICB9KTtcbiAgZWxbZG9tTWV0aG9kXSgndG91Y2hzdGFydCcsIHN3aXBlci5vblRvdWNoU3RhcnQsIHtcbiAgICBwYXNzaXZlOiBmYWxzZVxuICB9KTtcbiAgZWxbZG9tTWV0aG9kXSgncG9pbnRlcmRvd24nLCBzd2lwZXIub25Ub3VjaFN0YXJ0LCB7XG4gICAgcGFzc2l2ZTogZmFsc2VcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3RvdWNobW92ZScsIHN3aXBlci5vblRvdWNoTW92ZSwge1xuICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgIGNhcHR1cmVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJtb3ZlJywgc3dpcGVyLm9uVG91Y2hNb3ZlLCB7XG4gICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgY2FwdHVyZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgndG91Y2hlbmQnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJ1cCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgncG9pbnRlcmNhbmNlbCcsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgndG91Y2hjYW5jZWwnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJvdXQnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGRvY3VtZW50W2RvbU1ldGhvZF0oJ3BvaW50ZXJsZWF2ZScsIHN3aXBlci5vblRvdWNoRW5kLCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnRbZG9tTWV0aG9kXSgnY29udGV4dG1lbnUnLCBzd2lwZXIub25Ub3VjaEVuZCwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG5cbiAgLy8gUHJldmVudCBMaW5rcyBDbGlja3NcbiAgaWYgKHBhcmFtcy5wcmV2ZW50Q2xpY2tzIHx8IHBhcmFtcy5wcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb24pIHtcbiAgICBlbFtkb21NZXRob2RdKCdjbGljaycsIHN3aXBlci5vbkNsaWNrLCB0cnVlKTtcbiAgfVxuICBpZiAocGFyYW1zLmNzc01vZGUpIHtcbiAgICB3cmFwcGVyRWxbZG9tTWV0aG9kXSgnc2Nyb2xsJywgc3dpcGVyLm9uU2Nyb2xsKTtcbiAgfVxuXG4gIC8vIFJlc2l6ZSBoYW5kbGVyXG4gIGlmIChwYXJhbXMudXBkYXRlT25XaW5kb3dSZXNpemUpIHtcbiAgICBzd2lwZXJbc3dpcGVyTWV0aG9kXShkZXZpY2UuaW9zIHx8IGRldmljZS5hbmRyb2lkID8gJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZSBvYnNlcnZlclVwZGF0ZScgOiAncmVzaXplIG9ic2VydmVyVXBkYXRlJywgb25SZXNpemUsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHN3aXBlcltzd2lwZXJNZXRob2RdKCdvYnNlcnZlclVwZGF0ZScsIG9uUmVzaXplLCB0cnVlKTtcbiAgfVxuXG4gIC8vIEltYWdlcyBsb2FkZXJcbiAgZWxbZG9tTWV0aG9kXSgnbG9hZCcsIHN3aXBlci5vbkxvYWQsIHtcbiAgICBjYXB0dXJlOiB0cnVlXG4gIH0pO1xufTtcbmZ1bmN0aW9uIGF0dGFjaEV2ZW50cygpIHtcbiAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgY29uc3Qge1xuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBzd2lwZXIub25Ub3VjaFN0YXJ0ID0gb25Ub3VjaFN0YXJ0LmJpbmQoc3dpcGVyKTtcbiAgc3dpcGVyLm9uVG91Y2hNb3ZlID0gb25Ub3VjaE1vdmUuYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Ub3VjaEVuZCA9IG9uVG91Y2hFbmQuYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Eb2N1bWVudFRvdWNoU3RhcnQgPSBvbkRvY3VtZW50VG91Y2hTdGFydC5iaW5kKHN3aXBlcik7XG4gIGlmIChwYXJhbXMuY3NzTW9kZSkge1xuICAgIHN3aXBlci5vblNjcm9sbCA9IG9uU2Nyb2xsLmJpbmQoc3dpcGVyKTtcbiAgfVxuICBzd2lwZXIub25DbGljayA9IG9uQ2xpY2suYmluZChzd2lwZXIpO1xuICBzd2lwZXIub25Mb2FkID0gb25Mb2FkLmJpbmQoc3dpcGVyKTtcbiAgZXZlbnRzKHN3aXBlciwgJ29uJyk7XG59XG5mdW5jdGlvbiBkZXRhY2hFdmVudHMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGV2ZW50cyhzd2lwZXIsICdvZmYnKTtcbn1cbnZhciBldmVudHMkMSA9IHtcbiAgYXR0YWNoRXZlbnRzLFxuICBkZXRhY2hFdmVudHNcbn07XG5cbmNvbnN0IGlzR3JpZEVuYWJsZWQgPSAoc3dpcGVyLCBwYXJhbXMpID0+IHtcbiAgcmV0dXJuIHN3aXBlci5ncmlkICYmIHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxO1xufTtcbmZ1bmN0aW9uIHNldEJyZWFrcG9pbnQoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICByZWFsSW5kZXgsXG4gICAgaW5pdGlhbGl6ZWQsXG4gICAgcGFyYW1zLFxuICAgIGVsXG4gIH0gPSBzd2lwZXI7XG4gIGNvbnN0IGJyZWFrcG9pbnRzID0gcGFyYW1zLmJyZWFrcG9pbnRzO1xuICBpZiAoIWJyZWFrcG9pbnRzIHx8IGJyZWFrcG9pbnRzICYmIE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAvLyBHZXQgYnJlYWtwb2ludCBmb3Igd2luZG93IHdpZHRoIGFuZCB1cGRhdGUgcGFyYW1ldGVyc1xuICBjb25zdCBicmVha3BvaW50ID0gc3dpcGVyLmdldEJyZWFrcG9pbnQoYnJlYWtwb2ludHMsIHN3aXBlci5wYXJhbXMuYnJlYWtwb2ludHNCYXNlLCBzd2lwZXIuZWwpO1xuICBpZiAoIWJyZWFrcG9pbnQgfHwgc3dpcGVyLmN1cnJlbnRCcmVha3BvaW50ID09PSBicmVha3BvaW50KSByZXR1cm47XG4gIGNvbnN0IGJyZWFrcG9pbnRPbmx5UGFyYW1zID0gYnJlYWtwb2ludCBpbiBicmVha3BvaW50cyA/IGJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdIDogdW5kZWZpbmVkO1xuICBjb25zdCBicmVha3BvaW50UGFyYW1zID0gYnJlYWtwb2ludE9ubHlQYXJhbXMgfHwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zO1xuICBjb25zdCB3YXNNdWx0aVJvdyA9IGlzR3JpZEVuYWJsZWQoc3dpcGVyLCBwYXJhbXMpO1xuICBjb25zdCBpc011bHRpUm93ID0gaXNHcmlkRW5hYmxlZChzd2lwZXIsIGJyZWFrcG9pbnRQYXJhbXMpO1xuICBjb25zdCB3YXNHcmFiQ3Vyc29yID0gc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yO1xuICBjb25zdCBpc0dyYWJDdXJzb3IgPSBicmVha3BvaW50UGFyYW1zLmdyYWJDdXJzb3I7XG4gIGNvbnN0IHdhc0VuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZDtcbiAgaWYgKHdhc011bHRpUm93ICYmICFpc011bHRpUm93KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ncmlkYCwgYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZC1jb2x1bW5gKTtcbiAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgfSBlbHNlIGlmICghd2FzTXVsdGlSb3cgJiYgaXNNdWx0aVJvdykge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGApO1xuICAgIGlmIChicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCAmJiBicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCA9PT0gJ2NvbHVtbicgfHwgIWJyZWFrcG9pbnRQYXJhbXMuZ3JpZC5maWxsICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xuICB9XG4gIGlmICh3YXNHcmFiQ3Vyc29yICYmICFpc0dyYWJDdXJzb3IpIHtcbiAgICBzd2lwZXIudW5zZXRHcmFiQ3Vyc29yKCk7XG4gIH0gZWxzZSBpZiAoIXdhc0dyYWJDdXJzb3IgJiYgaXNHcmFiQ3Vyc29yKSB7XG4gICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoKTtcbiAgfVxuXG4gIC8vIFRvZ2dsZSBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBzY3JvbGxiYXJcbiAgWyduYXZpZ2F0aW9uJywgJ3BhZ2luYXRpb24nLCAnc2Nyb2xsYmFyJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICBpZiAodHlwZW9mIGJyZWFrcG9pbnRQYXJhbXNbcHJvcF0gPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgY29uc3Qgd2FzTW9kdWxlRW5hYmxlZCA9IHBhcmFtc1twcm9wXSAmJiBwYXJhbXNbcHJvcF0uZW5hYmxlZDtcbiAgICBjb25zdCBpc01vZHVsZUVuYWJsZWQgPSBicmVha3BvaW50UGFyYW1zW3Byb3BdICYmIGJyZWFrcG9pbnRQYXJhbXNbcHJvcF0uZW5hYmxlZDtcbiAgICBpZiAod2FzTW9kdWxlRW5hYmxlZCAmJiAhaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICBzd2lwZXJbcHJvcF0uZGlzYWJsZSgpO1xuICAgIH1cbiAgICBpZiAoIXdhc01vZHVsZUVuYWJsZWQgJiYgaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICBzd2lwZXJbcHJvcF0uZW5hYmxlKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZGlyZWN0aW9uQ2hhbmdlZCA9IGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICYmIGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICE9PSBwYXJhbXMuZGlyZWN0aW9uO1xuICBjb25zdCBuZWVkc1JlTG9vcCA9IHBhcmFtcy5sb29wICYmIChicmVha3BvaW50UGFyYW1zLnNsaWRlc1BlclZpZXcgIT09IHBhcmFtcy5zbGlkZXNQZXJWaWV3IHx8IGRpcmVjdGlvbkNoYW5nZWQpO1xuICBjb25zdCB3YXNMb29wID0gcGFyYW1zLmxvb3A7XG4gIGlmIChkaXJlY3Rpb25DaGFuZ2VkICYmIGluaXRpYWxpemVkKSB7XG4gICAgc3dpcGVyLmNoYW5nZURpcmVjdGlvbigpO1xuICB9XG4gIGV4dGVuZChzd2lwZXIucGFyYW1zLCBicmVha3BvaW50UGFyYW1zKTtcbiAgY29uc3QgaXNFbmFibGVkID0gc3dpcGVyLnBhcmFtcy5lbmFibGVkO1xuICBjb25zdCBoYXNMb29wID0gc3dpcGVyLnBhcmFtcy5sb29wO1xuICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xuICAgIGFsbG93VG91Y2hNb3ZlOiBzd2lwZXIucGFyYW1zLmFsbG93VG91Y2hNb3ZlLFxuICAgIGFsbG93U2xpZGVOZXh0OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVOZXh0LFxuICAgIGFsbG93U2xpZGVQcmV2OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVQcmV2XG4gIH0pO1xuICBpZiAod2FzRW5hYmxlZCAmJiAhaXNFbmFibGVkKSB7XG4gICAgc3dpcGVyLmRpc2FibGUoKTtcbiAgfSBlbHNlIGlmICghd2FzRW5hYmxlZCAmJiBpc0VuYWJsZWQpIHtcbiAgICBzd2lwZXIuZW5hYmxlKCk7XG4gIH1cbiAgc3dpcGVyLmN1cnJlbnRCcmVha3BvaW50ID0gYnJlYWtwb2ludDtcbiAgc3dpcGVyLmVtaXQoJ19iZWZvcmVCcmVha3BvaW50JywgYnJlYWtwb2ludFBhcmFtcyk7XG4gIGlmIChpbml0aWFsaXplZCkge1xuICAgIGlmIChuZWVkc1JlTG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XG4gICAgICBzd2lwZXIubG9vcENyZWF0ZShyZWFsSW5kZXgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIH0gZWxzZSBpZiAoIXdhc0xvb3AgJiYgaGFzTG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BDcmVhdGUocmVhbEluZGV4KTtcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICB9IGVsc2UgaWYgKHdhc0xvb3AgJiYgIWhhc0xvb3ApIHtcbiAgICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xuICAgIH1cbiAgfVxuICBzd2lwZXIuZW1pdCgnYnJlYWtwb2ludCcsIGJyZWFrcG9pbnRQYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBnZXRCcmVha3BvaW50KGJyZWFrcG9pbnRzLCBiYXNlLCBjb250YWluZXJFbCkge1xuICBpZiAoYmFzZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZSA9ICd3aW5kb3cnO1xuICB9XG4gIGlmICghYnJlYWtwb2ludHMgfHwgYmFzZSA9PT0gJ2NvbnRhaW5lcicgJiYgIWNvbnRhaW5lckVsKSByZXR1cm4gdW5kZWZpbmVkO1xuICBsZXQgYnJlYWtwb2ludCA9IGZhbHNlO1xuICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcbiAgY29uc3QgY3VycmVudEhlaWdodCA9IGJhc2UgPT09ICd3aW5kb3cnID8gd2luZG93LmlubmVySGVpZ2h0IDogY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0O1xuICBjb25zdCBwb2ludHMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykubWFwKHBvaW50ID0+IHtcbiAgICBpZiAodHlwZW9mIHBvaW50ID09PSAnc3RyaW5nJyAmJiBwb2ludC5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgIGNvbnN0IG1pblJhdGlvID0gcGFyc2VGbG9hdChwb2ludC5zdWJzdHIoMSkpO1xuICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50SGVpZ2h0ICogbWluUmF0aW87XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgcG9pbnRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogcG9pbnQsXG4gICAgICBwb2ludFxuICAgIH07XG4gIH0pO1xuICBwb2ludHMuc29ydCgoYSwgYikgPT4gcGFyc2VJbnQoYS52YWx1ZSwgMTApIC0gcGFyc2VJbnQoYi52YWx1ZSwgMTApKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCB7XG4gICAgICBwb2ludCxcbiAgICAgIHZhbHVlXG4gICAgfSA9IHBvaW50c1tpXTtcbiAgICBpZiAoYmFzZSA9PT0gJ3dpbmRvdycpIHtcbiAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogJHt2YWx1ZX1weClgKS5tYXRjaGVzKSB7XG4gICAgICAgIGJyZWFrcG9pbnQgPSBwb2ludDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZhbHVlIDw9IGNvbnRhaW5lckVsLmNsaWVudFdpZHRoKSB7XG4gICAgICBicmVha3BvaW50ID0gcG9pbnQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBicmVha3BvaW50IHx8ICdtYXgnO1xufVxuXG52YXIgYnJlYWtwb2ludHMgPSB7XG4gIHNldEJyZWFrcG9pbnQsXG4gIGdldEJyZWFrcG9pbnRcbn07XG5cbmZ1bmN0aW9uIHByZXBhcmVDbGFzc2VzKGVudHJpZXMsIHByZWZpeCkge1xuICBjb25zdCByZXN1bHRDbGFzc2VzID0gW107XG4gIGVudHJpZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGNsYXNzTmFtZXMgPT4ge1xuICAgICAgICBpZiAoaXRlbVtjbGFzc05hbWVzXSkge1xuICAgICAgICAgIHJlc3VsdENsYXNzZXMucHVzaChwcmVmaXggKyBjbGFzc05hbWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlc3VsdENsYXNzZXMucHVzaChwcmVmaXggKyBpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0Q2xhc3Nlcztcbn1cbmZ1bmN0aW9uIGFkZENsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBjbGFzc05hbWVzLFxuICAgIHBhcmFtcyxcbiAgICBydGwsXG4gICAgZWwsXG4gICAgZGV2aWNlXG4gIH0gPSBzd2lwZXI7XG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICBjb25zdCBzdWZmaXhlcyA9IHByZXBhcmVDbGFzc2VzKFsnaW5pdGlhbGl6ZWQnLCBwYXJhbXMuZGlyZWN0aW9uLCB7XG4gICAgJ2ZyZWUtbW9kZSc6IHN3aXBlci5wYXJhbXMuZnJlZU1vZGUgJiYgcGFyYW1zLmZyZWVNb2RlLmVuYWJsZWRcbiAgfSwge1xuICAgICdhdXRvaGVpZ2h0JzogcGFyYW1zLmF1dG9IZWlnaHRcbiAgfSwge1xuICAgICdydGwnOiBydGxcbiAgfSwge1xuICAgICdncmlkJzogcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDFcbiAgfSwge1xuICAgICdncmlkLWNvbHVtbic6IHBhcmFtcy5ncmlkICYmIHBhcmFtcy5ncmlkLnJvd3MgPiAxICYmIHBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nXG4gIH0sIHtcbiAgICAnYW5kcm9pZCc6IGRldmljZS5hbmRyb2lkXG4gIH0sIHtcbiAgICAnaW9zJzogZGV2aWNlLmlvc1xuICB9LCB7XG4gICAgJ2Nzcy1tb2RlJzogcGFyYW1zLmNzc01vZGVcbiAgfSwge1xuICAgICdjZW50ZXJlZCc6IHBhcmFtcy5jc3NNb2RlICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlc1xuICB9LCB7XG4gICAgJ3dhdGNoLXByb2dyZXNzJzogcGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3NcbiAgfV0sIHBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzKTtcbiAgY2xhc3NOYW1lcy5wdXNoKC4uLnN1ZmZpeGVzKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc05hbWVzKTtcbiAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBlbCxcbiAgICBjbGFzc05hbWVzXG4gIH0gPSBzd2lwZXI7XG4gIGlmICghZWwgfHwgdHlwZW9mIGVsID09PSAnc3RyaW5nJykgcmV0dXJuO1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzTmFtZXMpO1xuICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbn1cblxudmFyIGNsYXNzZXMgPSB7XG4gIGFkZENsYXNzZXMsXG4gIHJlbW92ZUNsYXNzZXNcbn07XG5cbmZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3coKSB7XG4gIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gIGNvbnN0IHtcbiAgICBpc0xvY2tlZDogd2FzTG9ja2VkLFxuICAgIHBhcmFtc1xuICB9ID0gc3dpcGVyO1xuICBjb25zdCB7XG4gICAgc2xpZGVzT2Zmc2V0QmVmb3JlXG4gIH0gPSBwYXJhbXM7XG4gIGlmIChzbGlkZXNPZmZzZXRCZWZvcmUpIHtcbiAgICBjb25zdCBsYXN0U2xpZGVJbmRleCA9IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBsYXN0U2xpZGVSaWdodEVkZ2UgPSBzd2lwZXIuc2xpZGVzR3JpZFtsYXN0U2xpZGVJbmRleF0gKyBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW2xhc3RTbGlkZUluZGV4XSArIHNsaWRlc09mZnNldEJlZm9yZSAqIDI7XG4gICAgc3dpcGVyLmlzTG9ja2VkID0gc3dpcGVyLnNpemUgPiBsYXN0U2xpZGVSaWdodEVkZ2U7XG4gIH0gZWxzZSB7XG4gICAgc3dpcGVyLmlzTG9ja2VkID0gc3dpcGVyLnNuYXBHcmlkLmxlbmd0aCA9PT0gMTtcbiAgfVxuICBpZiAocGFyYW1zLmFsbG93U2xpZGVOZXh0ID09PSB0cnVlKSB7XG4gICAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gIXN3aXBlci5pc0xvY2tlZDtcbiAgfVxuICBpZiAocGFyYW1zLmFsbG93U2xpZGVQcmV2ID09PSB0cnVlKSB7XG4gICAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gIXN3aXBlci5pc0xvY2tlZDtcbiAgfVxuICBpZiAod2FzTG9ja2VkICYmIHdhc0xvY2tlZCAhPT0gc3dpcGVyLmlzTG9ja2VkKSB7XG4gICAgc3dpcGVyLmlzRW5kID0gZmFsc2U7XG4gIH1cbiAgaWYgKHdhc0xvY2tlZCAhPT0gc3dpcGVyLmlzTG9ja2VkKSB7XG4gICAgc3dpcGVyLmVtaXQoc3dpcGVyLmlzTG9ja2VkID8gJ2xvY2snIDogJ3VubG9jaycpO1xuICB9XG59XG52YXIgY2hlY2tPdmVyZmxvdyQxID0ge1xuICBjaGVja092ZXJmbG93XG59O1xuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGluaXQ6IHRydWUsXG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBvbmVXYXlNb3ZlbWVudDogZmFsc2UsXG4gIHN3aXBlckVsZW1lbnROb2RlTmFtZTogJ1NXSVBFUi1DT05UQUlORVInLFxuICB0b3VjaEV2ZW50c1RhcmdldDogJ3dyYXBwZXInLFxuICBpbml0aWFsU2xpZGU6IDAsXG4gIHNwZWVkOiAzMDAsXG4gIGNzc01vZGU6IGZhbHNlLFxuICB1cGRhdGVPbldpbmRvd1Jlc2l6ZTogdHJ1ZSxcbiAgcmVzaXplT2JzZXJ2ZXI6IHRydWUsXG4gIG5lc3RlZDogZmFsc2UsXG4gIGNyZWF0ZUVsZW1lbnRzOiBmYWxzZSxcbiAgZXZlbnRzUHJlZml4OiAnc3dpcGVyJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgZm9jdXNhYmxlRWxlbWVudHM6ICdpbnB1dCwgc2VsZWN0LCBvcHRpb24sIHRleHRhcmVhLCBidXR0b24sIHZpZGVvLCBsYWJlbCcsXG4gIC8vIE92ZXJyaWRlc1xuICB3aWR0aDogbnVsbCxcbiAgaGVpZ2h0OiBudWxsLFxuICAvL1xuICBwcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb246IGZhbHNlLFxuICAvLyBzc3JcbiAgdXNlckFnZW50OiBudWxsLFxuICB1cmw6IG51bGwsXG4gIC8vIFRvIHN1cHBvcnQgaU9TJ3Mgc3dpcGUtdG8tZ28tYmFjayBnZXN0dXJlICh3aGVuIGJlaW5nIHVzZWQgaW4tYXBwKS5cbiAgZWRnZVN3aXBlRGV0ZWN0aW9uOiBmYWxzZSxcbiAgZWRnZVN3aXBlVGhyZXNob2xkOiAyMCxcbiAgLy8gQXV0b2hlaWdodFxuICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgLy8gU2V0IHdyYXBwZXIgd2lkdGhcbiAgc2V0V3JhcHBlclNpemU6IGZhbHNlLFxuICAvLyBWaXJ0dWFsIFRyYW5zbGF0ZVxuICB2aXJ0dWFsVHJhbnNsYXRlOiBmYWxzZSxcbiAgLy8gRWZmZWN0c1xuICBlZmZlY3Q6ICdzbGlkZScsXG4gIC8vICdzbGlkZScgb3IgJ2ZhZGUnIG9yICdjdWJlJyBvciAnY292ZXJmbG93JyBvciAnZmxpcCdcblxuICAvLyBCcmVha3BvaW50c1xuICBicmVha3BvaW50czogdW5kZWZpbmVkLFxuICBicmVha3BvaW50c0Jhc2U6ICd3aW5kb3cnLFxuICAvLyBTbGlkZXMgZ3JpZFxuICBzcGFjZUJldHdlZW46IDAsXG4gIHNsaWRlc1BlclZpZXc6IDEsXG4gIHNsaWRlc1Blckdyb3VwOiAxLFxuICBzbGlkZXNQZXJHcm91cFNraXA6IDAsXG4gIHNsaWRlc1Blckdyb3VwQXV0bzogZmFsc2UsXG4gIGNlbnRlcmVkU2xpZGVzOiBmYWxzZSxcbiAgY2VudGVyZWRTbGlkZXNCb3VuZHM6IGZhbHNlLFxuICBzbGlkZXNPZmZzZXRCZWZvcmU6IDAsXG4gIC8vIGluIHB4XG4gIHNsaWRlc09mZnNldEFmdGVyOiAwLFxuICAvLyBpbiBweFxuICBub3JtYWxpemVTbGlkZUluZGV4OiB0cnVlLFxuICBjZW50ZXJJbnN1ZmZpY2llbnRTbGlkZXM6IGZhbHNlLFxuICAvLyBEaXNhYmxlIHN3aXBlciBhbmQgaGlkZSBuYXZpZ2F0aW9uIHdoZW4gY29udGFpbmVyIG5vdCBvdmVyZmxvd1xuICB3YXRjaE92ZXJmbG93OiB0cnVlLFxuICAvLyBSb3VuZCBsZW5ndGhcbiAgcm91bmRMZW5ndGhzOiBmYWxzZSxcbiAgLy8gVG91Y2hlc1xuICB0b3VjaFJhdGlvOiAxLFxuICB0b3VjaEFuZ2xlOiA0NSxcbiAgc2ltdWxhdGVUb3VjaDogdHJ1ZSxcbiAgc2hvcnRTd2lwZXM6IHRydWUsXG4gIGxvbmdTd2lwZXM6IHRydWUsXG4gIGxvbmdTd2lwZXNSYXRpbzogMC41LFxuICBsb25nU3dpcGVzTXM6IDMwMCxcbiAgZm9sbG93RmluZ2VyOiB0cnVlLFxuICBhbGxvd1RvdWNoTW92ZTogdHJ1ZSxcbiAgdGhyZXNob2xkOiA1LFxuICB0b3VjaE1vdmVTdG9wUHJvcGFnYXRpb246IGZhbHNlLFxuICB0b3VjaFN0YXJ0UHJldmVudERlZmF1bHQ6IHRydWUsXG4gIHRvdWNoU3RhcnRGb3JjZVByZXZlbnREZWZhdWx0OiBmYWxzZSxcbiAgdG91Y2hSZWxlYXNlT25FZGdlczogZmFsc2UsXG4gIC8vIFVuaXF1ZSBOYXZpZ2F0aW9uIEVsZW1lbnRzXG4gIHVuaXF1ZU5hdkVsZW1lbnRzOiB0cnVlLFxuICAvLyBSZXNpc3RhbmNlXG4gIHJlc2lzdGFuY2U6IHRydWUsXG4gIHJlc2lzdGFuY2VSYXRpbzogMC44NSxcbiAgLy8gUHJvZ3Jlc3NcbiAgd2F0Y2hTbGlkZXNQcm9ncmVzczogZmFsc2UsXG4gIC8vIEN1cnNvclxuICBncmFiQ3Vyc29yOiBmYWxzZSxcbiAgLy8gQ2xpY2tzXG4gIHByZXZlbnRDbGlja3M6IHRydWUsXG4gIHByZXZlbnRDbGlja3NQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgc2xpZGVUb0NsaWNrZWRTbGlkZTogZmFsc2UsXG4gIC8vIGxvb3BcbiAgbG9vcDogZmFsc2UsXG4gIGxvb3BBZGRCbGFua1NsaWRlczogdHJ1ZSxcbiAgbG9vcEFkZGl0aW9uYWxTbGlkZXM6IDAsXG4gIGxvb3BQcmV2ZW50c1NsaWRpbmc6IHRydWUsXG4gIC8vIHJld2luZFxuICByZXdpbmQ6IGZhbHNlLFxuICAvLyBTd2lwaW5nL25vIHN3aXBpbmdcbiAgYWxsb3dTbGlkZVByZXY6IHRydWUsXG4gIGFsbG93U2xpZGVOZXh0OiB0cnVlLFxuICBzd2lwZUhhbmRsZXI6IG51bGwsXG4gIC8vICcuc3dpcGUtaGFuZGxlcicsXG4gIG5vU3dpcGluZzogdHJ1ZSxcbiAgbm9Td2lwaW5nQ2xhc3M6ICdzd2lwZXItbm8tc3dpcGluZycsXG4gIG5vU3dpcGluZ1NlbGVjdG9yOiBudWxsLFxuICAvLyBQYXNzaXZlIExpc3RlbmVyc1xuICBwYXNzaXZlTGlzdGVuZXJzOiB0cnVlLFxuICBtYXhCYWNrZmFjZUhpZGRlblNsaWRlczogMTAsXG4gIC8vIE5TXG4gIGNvbnRhaW5lck1vZGlmaWVyQ2xhc3M6ICdzd2lwZXItJyxcbiAgLy8gTkVXXG4gIHNsaWRlQ2xhc3M6ICdzd2lwZXItc2xpZGUnLFxuICBzbGlkZUJsYW5rQ2xhc3M6ICdzd2lwZXItc2xpZGUtYmxhbmsnLFxuICBzbGlkZUFjdGl2ZUNsYXNzOiAnc3dpcGVyLXNsaWRlLWFjdGl2ZScsXG4gIHNsaWRlVmlzaWJsZUNsYXNzOiAnc3dpcGVyLXNsaWRlLXZpc2libGUnLFxuICBzbGlkZUZ1bGx5VmlzaWJsZUNsYXNzOiAnc3dpcGVyLXNsaWRlLWZ1bGx5LXZpc2libGUnLFxuICBzbGlkZU5leHRDbGFzczogJ3N3aXBlci1zbGlkZS1uZXh0JyxcbiAgc2xpZGVQcmV2Q2xhc3M6ICdzd2lwZXItc2xpZGUtcHJldicsXG4gIHdyYXBwZXJDbGFzczogJ3N3aXBlci13cmFwcGVyJyxcbiAgbGF6eVByZWxvYWRlckNsYXNzOiAnc3dpcGVyLWxhenktcHJlbG9hZGVyJyxcbiAgbGF6eVByZWxvYWRQcmV2TmV4dDogMCxcbiAgLy8gQ2FsbGJhY2tzXG4gIHJ1bkNhbGxiYWNrc09uSW5pdDogdHJ1ZSxcbiAgLy8gSW50ZXJuYWxzXG4gIF9lbWl0Q2xhc3NlczogZmFsc2Vcbn07XG5cbmZ1bmN0aW9uIG1vZHVsZUV4dGVuZFBhcmFtcyhwYXJhbXMsIGFsbE1vZHVsZXNQYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGV4dGVuZFBhcmFtcyhvYmopIHtcbiAgICBpZiAob2JqID09PSB2b2lkIDApIHtcbiAgICAgIG9iaiA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBtb2R1bGVQYXJhbU5hbWUgPSBPYmplY3Qua2V5cyhvYmopWzBdO1xuICAgIGNvbnN0IG1vZHVsZVBhcmFtcyA9IG9ialttb2R1bGVQYXJhbU5hbWVdO1xuICAgIGlmICh0eXBlb2YgbW9kdWxlUGFyYW1zICE9PSAnb2JqZWN0JyB8fCBtb2R1bGVQYXJhbXMgPT09IG51bGwpIHtcbiAgICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID0ge1xuICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobW9kdWxlUGFyYW1OYW1lID09PSAnbmF2aWdhdGlvbicgJiYgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gJiYgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uZW5hYmxlZCAmJiAhcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0ucHJldkVsICYmICFwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5uZXh0RWwpIHtcbiAgICAgIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmF1dG8gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoWydwYWdpbmF0aW9uJywgJ3Njcm9sbGJhciddLmluZGV4T2YobW9kdWxlUGFyYW1OYW1lKSA+PSAwICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVuYWJsZWQgJiYgIXBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdLmVsKSB7XG4gICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXS5hdXRvID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCEobW9kdWxlUGFyYW1OYW1lIGluIHBhcmFtcyAmJiAnZW5hYmxlZCcgaW4gbW9kdWxlUGFyYW1zKSkge1xuICAgICAgZXh0ZW5kKGFsbE1vZHVsZXNQYXJhbXMsIG9iaik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gPT09ICdvYmplY3QnICYmICEoJ2VuYWJsZWQnIGluIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdKSkge1xuICAgICAgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0pIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID0ge1xuICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICB9O1xuICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xuICB9O1xufVxuXG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IFwib2ZmXCIgKi9cbmNvbnN0IHByb3RvdHlwZXMgPSB7XG4gIGV2ZW50c0VtaXR0ZXIsXG4gIHVwZGF0ZSxcbiAgdHJhbnNsYXRlLFxuICB0cmFuc2l0aW9uLFxuICBzbGlkZSxcbiAgbG9vcCxcbiAgZ3JhYkN1cnNvcixcbiAgZXZlbnRzOiBldmVudHMkMSxcbiAgYnJlYWtwb2ludHMsXG4gIGNoZWNrT3ZlcmZsb3c6IGNoZWNrT3ZlcmZsb3ckMSxcbiAgY2xhc3Nlc1xufTtcbmNvbnN0IGV4dGVuZGVkRGVmYXVsdHMgPSB7fTtcbmNsYXNzIFN3aXBlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBlbDtcbiAgICBsZXQgcGFyYW1zO1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIGFyZ3NbMF0uY29uc3RydWN0b3IgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3NbMF0pLnNsaWNlKDgsIC0xKSA9PT0gJ09iamVjdCcpIHtcbiAgICAgIHBhcmFtcyA9IGFyZ3NbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIFtlbCwgcGFyYW1zXSA9IGFyZ3M7XG4gICAgfVxuICAgIGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcbiAgICBwYXJhbXMgPSBleHRlbmQoe30sIHBhcmFtcyk7XG4gICAgaWYgKGVsICYmICFwYXJhbXMuZWwpIHBhcmFtcy5lbCA9IGVsO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcbiAgICBpZiAocGFyYW1zLmVsICYmIHR5cGVvZiBwYXJhbXMuZWwgPT09ICdzdHJpbmcnICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1zLmVsKS5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBzd2lwZXJzID0gW107XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhcmFtcy5lbCkuZm9yRWFjaChjb250YWluZXJFbCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1zLCB7XG4gICAgICAgICAgZWw6IGNvbnRhaW5lckVsXG4gICAgICAgIH0pO1xuICAgICAgICBzd2lwZXJzLnB1c2gobmV3IFN3aXBlcihuZXdQYXJhbXMpKTtcbiAgICAgIH0pO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuICAgICAgcmV0dXJuIHN3aXBlcnM7XG4gICAgfVxuXG4gICAgLy8gU3dpcGVyIEluc3RhbmNlXG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBzd2lwZXIuX19zd2lwZXJfXyA9IHRydWU7XG4gICAgc3dpcGVyLnN1cHBvcnQgPSBnZXRTdXBwb3J0KCk7XG4gICAgc3dpcGVyLmRldmljZSA9IGdldERldmljZSh7XG4gICAgICB1c2VyQWdlbnQ6IHBhcmFtcy51c2VyQWdlbnRcbiAgICB9KTtcbiAgICBzd2lwZXIuYnJvd3NlciA9IGdldEJyb3dzZXIoKTtcbiAgICBzd2lwZXIuZXZlbnRzTGlzdGVuZXJzID0ge307XG4gICAgc3dpcGVyLmV2ZW50c0FueUxpc3RlbmVycyA9IFtdO1xuICAgIHN3aXBlci5tb2R1bGVzID0gWy4uLnN3aXBlci5fX21vZHVsZXNfX107XG4gICAgaWYgKHBhcmFtcy5tb2R1bGVzICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLm1vZHVsZXMpKSB7XG4gICAgICBzd2lwZXIubW9kdWxlcy5wdXNoKC4uLnBhcmFtcy5tb2R1bGVzKTtcbiAgICB9XG4gICAgY29uc3QgYWxsTW9kdWxlc1BhcmFtcyA9IHt9O1xuICAgIHN3aXBlci5tb2R1bGVzLmZvckVhY2gobW9kID0+IHtcbiAgICAgIG1vZCh7XG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgc3dpcGVyLFxuICAgICAgICBleHRlbmRQYXJhbXM6IG1vZHVsZUV4dGVuZFBhcmFtcyhwYXJhbXMsIGFsbE1vZHVsZXNQYXJhbXMpLFxuICAgICAgICBvbjogc3dpcGVyLm9uLmJpbmQoc3dpcGVyKSxcbiAgICAgICAgb25jZTogc3dpcGVyLm9uY2UuYmluZChzd2lwZXIpLFxuICAgICAgICBvZmY6IHN3aXBlci5vZmYuYmluZChzd2lwZXIpLFxuICAgICAgICBlbWl0OiBzd2lwZXIuZW1pdC5iaW5kKHN3aXBlcilcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gRXh0ZW5kIGRlZmF1bHRzIHdpdGggbW9kdWxlcyBwYXJhbXNcbiAgICBjb25zdCBzd2lwZXJQYXJhbXMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBhbGxNb2R1bGVzUGFyYW1zKTtcblxuICAgIC8vIEV4dGVuZCBkZWZhdWx0cyB3aXRoIHBhc3NlZCBwYXJhbXNcbiAgICBzd2lwZXIucGFyYW1zID0gZXh0ZW5kKHt9LCBzd2lwZXJQYXJhbXMsIGV4dGVuZGVkRGVmYXVsdHMsIHBhcmFtcyk7XG4gICAgc3dpcGVyLm9yaWdpbmFsUGFyYW1zID0gZXh0ZW5kKHt9LCBzd2lwZXIucGFyYW1zKTtcbiAgICBzd2lwZXIucGFzc2VkUGFyYW1zID0gZXh0ZW5kKHt9LCBwYXJhbXMpO1xuXG4gICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVyc1xuICAgIGlmIChzd2lwZXIucGFyYW1zICYmIHN3aXBlci5wYXJhbXMub24pIHtcbiAgICAgIE9iamVjdC5rZXlzKHN3aXBlci5wYXJhbXMub24pLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgc3dpcGVyLm9uKGV2ZW50TmFtZSwgc3dpcGVyLnBhcmFtcy5vbltldmVudE5hbWVdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3dpcGVyLnBhcmFtcyAmJiBzd2lwZXIucGFyYW1zLm9uQW55KSB7XG4gICAgICBzd2lwZXIub25Bbnkoc3dpcGVyLnBhcmFtcy5vbkFueSk7XG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIFN3aXBlclxuICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XG4gICAgICBlbmFibGVkOiBzd2lwZXIucGFyYW1zLmVuYWJsZWQsXG4gICAgICBlbCxcbiAgICAgIC8vIENsYXNzZXNcbiAgICAgIGNsYXNzTmFtZXM6IFtdLFxuICAgICAgLy8gU2xpZGVzXG4gICAgICBzbGlkZXM6IFtdLFxuICAgICAgc2xpZGVzR3JpZDogW10sXG4gICAgICBzbmFwR3JpZDogW10sXG4gICAgICBzbGlkZXNTaXplc0dyaWQ6IFtdLFxuICAgICAgLy8gaXNEaXJlY3Rpb25cbiAgICAgIGlzSG9yaXpvbnRhbCgpIHtcbiAgICAgICAgcmV0dXJuIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCc7XG4gICAgICB9LFxuICAgICAgaXNWZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAndmVydGljYWwnO1xuICAgICAgfSxcbiAgICAgIC8vIEluZGV4ZXNcbiAgICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgICAgcmVhbEluZGV4OiAwLFxuICAgICAgLy9cbiAgICAgIGlzQmVnaW5uaW5nOiB0cnVlLFxuICAgICAgaXNFbmQ6IGZhbHNlLFxuICAgICAgLy8gUHJvcHNcbiAgICAgIHRyYW5zbGF0ZTogMCxcbiAgICAgIHByZXZpb3VzVHJhbnNsYXRlOiAwLFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICB2ZWxvY2l0eTogMCxcbiAgICAgIGFuaW1hdGluZzogZmFsc2UsXG4gICAgICBjc3NPdmVyZmxvd0FkanVzdG1lbnQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgMCB1bmxlc3MgYHRyYW5zbGF0ZWAgaXMgPiAyKioyM1xuICAgICAgICAvLyBTaG91bGQgYmUgc3VidHJhY3RlZCBmcm9tIGNzcyB2YWx1ZXMgdG8gcHJldmVudCBvdmVyZmxvd1xuICAgICAgICByZXR1cm4gTWF0aC50cnVuYyh0aGlzLnRyYW5zbGF0ZSAvIDIgKiogMjMpICogMiAqKiAyMztcbiAgICAgIH0sXG4gICAgICAvLyBMb2Nrc1xuICAgICAgYWxsb3dTbGlkZU5leHQ6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZU5leHQsXG4gICAgICBhbGxvd1NsaWRlUHJldjogc3dpcGVyLnBhcmFtcy5hbGxvd1NsaWRlUHJldixcbiAgICAgIC8vIFRvdWNoIEV2ZW50c1xuICAgICAgdG91Y2hFdmVudHNEYXRhOiB7XG4gICAgICAgIGlzVG91Y2hlZDogdW5kZWZpbmVkLFxuICAgICAgICBpc01vdmVkOiB1bmRlZmluZWQsXG4gICAgICAgIGFsbG93VG91Y2hDYWxsYmFja3M6IHVuZGVmaW5lZCxcbiAgICAgICAgdG91Y2hTdGFydFRpbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNTY3JvbGxpbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgY3VycmVudFRyYW5zbGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBzdGFydFRyYW5zbGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBhbGxvd1RocmVzaG9sZE1vdmU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gRm9ybSBlbGVtZW50cyB0byBtYXRjaFxuICAgICAgICBmb2N1c2FibGVFbGVtZW50czogc3dpcGVyLnBhcmFtcy5mb2N1c2FibGVFbGVtZW50cyxcbiAgICAgICAgLy8gTGFzdCBjbGljayB0aW1lXG4gICAgICAgIGxhc3RDbGlja1RpbWU6IDAsXG4gICAgICAgIGNsaWNrVGltZW91dDogdW5kZWZpbmVkLFxuICAgICAgICAvLyBWZWxvY2l0aWVzXG4gICAgICAgIHZlbG9jaXRpZXM6IFtdLFxuICAgICAgICBhbGxvd01vbWVudHVtQm91bmNlOiB1bmRlZmluZWQsXG4gICAgICAgIHN0YXJ0TW92aW5nOiB1bmRlZmluZWQsXG4gICAgICAgIHBvaW50ZXJJZDogbnVsbCxcbiAgICAgICAgdG91Y2hJZDogbnVsbFxuICAgICAgfSxcbiAgICAgIC8vIENsaWNrc1xuICAgICAgYWxsb3dDbGljazogdHJ1ZSxcbiAgICAgIC8vIFRvdWNoZXNcbiAgICAgIGFsbG93VG91Y2hNb3ZlOiBzd2lwZXIucGFyYW1zLmFsbG93VG91Y2hNb3ZlLFxuICAgICAgdG91Y2hlczoge1xuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMCxcbiAgICAgICAgY3VycmVudFg6IDAsXG4gICAgICAgIGN1cnJlbnRZOiAwLFxuICAgICAgICBkaWZmOiAwXG4gICAgICB9LFxuICAgICAgLy8gSW1hZ2VzXG4gICAgICBpbWFnZXNUb0xvYWQ6IFtdLFxuICAgICAgaW1hZ2VzTG9hZGVkOiAwXG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ19zd2lwZXInKTtcblxuICAgIC8vIEluaXRcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5pbml0KSB7XG4gICAgICBzd2lwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhcHAgaW5zdGFuY2VcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RydWN0b3ItcmV0dXJuXG4gICAgcmV0dXJuIHN3aXBlcjtcbiAgfVxuICBnZXREaXJlY3Rpb25MYWJlbChwcm9wZXJ0eSkge1xuICAgIGlmICh0aGlzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiB7XG4gICAgICAnd2lkdGgnOiAnaGVpZ2h0JyxcbiAgICAgICdtYXJnaW4tdG9wJzogJ21hcmdpbi1sZWZ0JyxcbiAgICAgICdtYXJnaW4tYm90dG9tICc6ICdtYXJnaW4tcmlnaHQnLFxuICAgICAgJ21hcmdpbi1sZWZ0JzogJ21hcmdpbi10b3AnLFxuICAgICAgJ21hcmdpbi1yaWdodCc6ICdtYXJnaW4tYm90dG9tJyxcbiAgICAgICdwYWRkaW5nLWxlZnQnOiAncGFkZGluZy10b3AnLFxuICAgICAgJ3BhZGRpbmctcmlnaHQnOiAncGFkZGluZy1ib3R0b20nLFxuICAgICAgJ21hcmdpblJpZ2h0JzogJ21hcmdpbkJvdHRvbSdcbiAgICB9W3Byb3BlcnR5XTtcbiAgfVxuICBnZXRTbGlkZUluZGV4KHNsaWRlRWwpIHtcbiAgICBjb25zdCB7XG4gICAgICBzbGlkZXNFbCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNsaWRlcyA9IGVsZW1lbnRDaGlsZHJlbihzbGlkZXNFbCwgYC4ke3BhcmFtcy5zbGlkZUNsYXNzfSwgc3dpcGVyLXNsaWRlYCk7XG4gICAgY29uc3QgZmlyc3RTbGlkZUluZGV4ID0gZWxlbWVudEluZGV4KHNsaWRlc1swXSk7XG4gICAgcmV0dXJuIGVsZW1lbnRJbmRleChzbGlkZUVsKSAtIGZpcnN0U2xpZGVJbmRleDtcbiAgfVxuICBnZXRTbGlkZUluZGV4QnlEYXRhKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2xpZGVJbmRleCh0aGlzLnNsaWRlcy5maWx0ZXIoc2xpZGVFbCA9PiBzbGlkZUVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSAqIDEgPT09IGluZGV4KVswXSk7XG4gIH1cbiAgcmVjYWxjU2xpZGVzKCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgc2xpZGVzRWwsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gc3dpcGVyO1xuICAgIHN3aXBlci5zbGlkZXMgPSBlbGVtZW50Q2hpbGRyZW4oc2xpZGVzRWwsIGAuJHtwYXJhbXMuc2xpZGVDbGFzc30sIHN3aXBlci1zbGlkZWApO1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmIChzd2lwZXIuZW5hYmxlZCkgcmV0dXJuO1xuICAgIHN3aXBlci5lbmFibGVkID0gdHJ1ZTtcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yKSB7XG4gICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcigpO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdCgnZW5hYmxlJyk7XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcbiAgICBzd2lwZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLmdyYWJDdXJzb3IpIHtcbiAgICAgIHN3aXBlci51bnNldEdyYWJDdXJzb3IoKTtcbiAgICB9XG4gICAgc3dpcGVyLmVtaXQoJ2Rpc2FibGUnKTtcbiAgfVxuICBzZXRQcm9ncmVzcyhwcm9ncmVzcywgc3BlZWQpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIHByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgocHJvZ3Jlc3MsIDApLCAxKTtcbiAgICBjb25zdCBtaW4gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XG4gICAgY29uc3QgbWF4ID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSAobWF4IC0gbWluKSAqIHByb2dyZXNzICsgbWluO1xuICAgIHN3aXBlci50cmFuc2xhdGVUbyhjdXJyZW50LCB0eXBlb2Ygc3BlZWQgPT09ICd1bmRlZmluZWQnID8gMCA6IHNwZWVkKTtcbiAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICB9XG4gIGVtaXRDb250YWluZXJDbGFzc2VzKCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKCFzd2lwZXIucGFyYW1zLl9lbWl0Q2xhc3NlcyB8fCAhc3dpcGVyLmVsKSByZXR1cm47XG4gICAgY29uc3QgY2xzID0gc3dpcGVyLmVsLmNsYXNzTmFtZS5zcGxpdCgnICcpLmZpbHRlcihjbGFzc05hbWUgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5pbmRleE9mKCdzd2lwZXInKSA9PT0gMCB8fCBjbGFzc05hbWUuaW5kZXhPZihzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3MpID09PSAwO1xuICAgIH0pO1xuICAgIHN3aXBlci5lbWl0KCdfY29udGFpbmVyQ2xhc3NlcycsIGNscy5qb2luKCcgJykpO1xuICB9XG4gIGdldFNsaWRlQ2xhc3NlcyhzbGlkZUVsKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuICcnO1xuICAgIHJldHVybiBzbGlkZUVsLmNsYXNzTmFtZS5zcGxpdCgnICcpLmZpbHRlcihjbGFzc05hbWUgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5pbmRleE9mKCdzd2lwZXItc2xpZGUnKSA9PT0gMCB8fCBjbGFzc05hbWUuaW5kZXhPZihzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3MpID09PSAwO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfVxuICBlbWl0U2xpZGVzQ2xhc3NlcygpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyLnBhcmFtcy5fZW1pdENsYXNzZXMgfHwgIXN3aXBlci5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBbXTtcbiAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWVzID0gc3dpcGVyLmdldFNsaWRlQ2xhc3NlcyhzbGlkZUVsKTtcbiAgICAgIHVwZGF0ZXMucHVzaCh7XG4gICAgICAgIHNsaWRlRWwsXG4gICAgICAgIGNsYXNzTmFtZXNcbiAgICAgIH0pO1xuICAgICAgc3dpcGVyLmVtaXQoJ19zbGlkZUNsYXNzJywgc2xpZGVFbCwgY2xhc3NOYW1lcyk7XG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ19zbGlkZUNsYXNzZXMnLCB1cGRhdGVzKTtcbiAgfVxuICBzbGlkZXNQZXJWaWV3RHluYW1pYyh2aWV3LCBleGFjdCkge1xuICAgIGlmICh2aWV3ID09PSB2b2lkIDApIHtcbiAgICAgIHZpZXcgPSAnY3VycmVudCc7XG4gICAgfVxuICAgIGlmIChleGFjdCA9PT0gdm9pZCAwKSB7XG4gICAgICBleGFjdCA9IGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcmFtcyxcbiAgICAgIHNsaWRlcyxcbiAgICAgIHNsaWRlc0dyaWQsXG4gICAgICBzbGlkZXNTaXplc0dyaWQsXG4gICAgICBzaXplOiBzd2lwZXJTaXplLFxuICAgICAgYWN0aXZlSW5kZXhcbiAgICB9ID0gc3dpcGVyO1xuICAgIGxldCBzcHYgPSAxO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdudW1iZXInKSByZXR1cm4gcGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgaWYgKHBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgbGV0IHNsaWRlU2l6ZSA9IHNsaWRlc1thY3RpdmVJbmRleF0gPyBNYXRoLmNlaWwoc2xpZGVzW2FjdGl2ZUluZGV4XS5zd2lwZXJTbGlkZVNpemUpIDogMDtcbiAgICAgIGxldCBicmVha0xvb3A7XG4gICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggKyAxOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0gJiYgIWJyZWFrTG9vcCkge1xuICAgICAgICAgIHNsaWRlU2l6ZSArPSBNYXRoLmNlaWwoc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZSk7XG4gICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgaWYgKHNsaWRlU2l6ZSA+IHN3aXBlclNpemUpIGJyZWFrTG9vcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0gJiYgIWJyZWFrTG9vcCkge1xuICAgICAgICAgIHNsaWRlU2l6ZSArPSBzbGlkZXNbaV0uc3dpcGVyU2xpZGVTaXplO1xuICAgICAgICAgIHNwdiArPSAxO1xuICAgICAgICAgIGlmIChzbGlkZVNpemUgPiBzd2lwZXJTaXplKSBicmVha0xvb3AgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgaWYgKHZpZXcgPT09ICdjdXJyZW50Jykge1xuICAgICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggKyAxOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3Qgc2xpZGVJblZpZXcgPSBleGFjdCA/IHNsaWRlc0dyaWRbaV0gKyBzbGlkZXNTaXplc0dyaWRbaV0gLSBzbGlkZXNHcmlkW2FjdGl2ZUluZGV4XSA8IHN3aXBlclNpemUgOiBzbGlkZXNHcmlkW2ldIC0gc2xpZGVzR3JpZFthY3RpdmVJbmRleF0gPCBzd2lwZXJTaXplO1xuICAgICAgICAgIGlmIChzbGlkZUluVmlldykge1xuICAgICAgICAgICAgc3B2ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwcmV2aW91c1xuICAgICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgICAgIGNvbnN0IHNsaWRlSW5WaWV3ID0gc2xpZGVzR3JpZFthY3RpdmVJbmRleF0gLSBzbGlkZXNHcmlkW2ldIDwgc3dpcGVyU2l6ZTtcbiAgICAgICAgICBpZiAoc2xpZGVJblZpZXcpIHtcbiAgICAgICAgICAgIHNwdiArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3B2O1xuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBzbmFwR3JpZCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSBzd2lwZXI7XG4gICAgLy8gQnJlYWtwb2ludHNcbiAgICBpZiAocGFyYW1zLmJyZWFrcG9pbnRzKSB7XG4gICAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xuICAgIH1cbiAgICBbLi4uc3dpcGVyLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tsb2FkaW5nPVwibGF6eVwiXScpXS5mb3JFYWNoKGltYWdlRWwgPT4ge1xuICAgICAgaWYgKGltYWdlRWwuY29tcGxldGUpIHtcbiAgICAgICAgcHJvY2Vzc0xhenlQcmVsb2FkZXIoc3dpcGVyLCBpbWFnZUVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzd2lwZXIudXBkYXRlU2l6ZSgpO1xuICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcbiAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgIGZ1bmN0aW9uIHNldFRyYW5zbGF0ZSgpIHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVZhbHVlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgKiAtMSA6IHN3aXBlci50cmFuc2xhdGU7XG4gICAgICBjb25zdCBuZXdUcmFuc2xhdGUgPSBNYXRoLm1pbihNYXRoLm1heCh0cmFuc2xhdGVWYWx1ZSwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSwgc3dpcGVyLm1pblRyYW5zbGF0ZSgpKTtcbiAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUobmV3VHJhbnNsYXRlKTtcbiAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcbiAgICB9XG4gICAgbGV0IHRyYW5zbGF0ZWQ7XG4gICAgaWYgKHBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiAhcGFyYW1zLmNzc01vZGUpIHtcbiAgICAgIHNldFRyYW5zbGF0ZSgpO1xuICAgICAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgIHN3aXBlci51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyB8fCBwYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpICYmIHN3aXBlci5pc0VuZCAmJiAhcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgIGNvbnN0IHNsaWRlcyA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMgOiBzd2lwZXIuc2xpZGVzO1xuICAgICAgICB0cmFuc2xhdGVkID0gc3dpcGVyLnNsaWRlVG8oc2xpZGVzLmxlbmd0aCAtIDEsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYW5zbGF0ZWQgPSBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmICghdHJhbnNsYXRlZCkge1xuICAgICAgICBzZXRUcmFuc2xhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHNuYXBHcmlkICE9PSBzd2lwZXIuc25hcEdyaWQpIHtcbiAgICAgIHN3aXBlci5jaGVja092ZXJmbG93KCk7XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCd1cGRhdGUnKTtcbiAgfVxuICBjaGFuZ2VEaXJlY3Rpb24obmV3RGlyZWN0aW9uLCBuZWVkVXBkYXRlKSB7XG4gICAgaWYgKG5lZWRVcGRhdGUgPT09IHZvaWQgMCkge1xuICAgICAgbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgY29uc3QgY3VycmVudERpcmVjdGlvbiA9IHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uO1xuICAgIGlmICghbmV3RGlyZWN0aW9uKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIG5ld0RpcmVjdGlvbiA9IGN1cnJlbnREaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICAgIGlmIChuZXdEaXJlY3Rpb24gPT09IGN1cnJlbnREaXJlY3Rpb24gfHwgbmV3RGlyZWN0aW9uICE9PSAnaG9yaXpvbnRhbCcgJiYgbmV3RGlyZWN0aW9uICE9PSAndmVydGljYWwnKSB7XG4gICAgICByZXR1cm4gc3dpcGVyO1xuICAgIH1cbiAgICBzd2lwZXIuZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9JHtjdXJyZW50RGlyZWN0aW9ufWApO1xuICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc30ke25ld0RpcmVjdGlvbn1gKTtcbiAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcbiAgICBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9IG5ld0RpcmVjdGlvbjtcbiAgICBzd2lwZXIuc2xpZGVzLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICBpZiAobmV3RGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIHNsaWRlRWwuc3R5bGUud2lkdGggPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWRlRWwuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3dpcGVyLmVtaXQoJ2NoYW5nZURpcmVjdGlvbicpO1xuICAgIGlmIChuZWVkVXBkYXRlKSBzd2lwZXIudXBkYXRlKCk7XG4gICAgcmV0dXJuIHN3aXBlcjtcbiAgfVxuICBjaGFuZ2VMYW5ndWFnZURpcmVjdGlvbihkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGlmIChzd2lwZXIucnRsICYmIGRpcmVjdGlvbiA9PT0gJ3J0bCcgfHwgIXN3aXBlci5ydGwgJiYgZGlyZWN0aW9uID09PSAnbHRyJykgcmV0dXJuO1xuICAgIHN3aXBlci5ydGwgPSBkaXJlY3Rpb24gPT09ICdydGwnO1xuICAgIHN3aXBlci5ydGxUcmFuc2xhdGUgPSBzd2lwZXIucGFyYW1zLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIHN3aXBlci5ydGw7XG4gICAgaWYgKHN3aXBlci5ydGwpIHtcbiAgICAgIHN3aXBlci5lbC5jbGFzc0xpc3QuYWRkKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc31ydGxgKTtcbiAgICAgIHN3aXBlci5lbC5kaXIgPSAncnRsJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyLmVsLmNsYXNzTGlzdC5yZW1vdmUoYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfXJ0bGApO1xuICAgICAgc3dpcGVyLmVsLmRpciA9ICdsdHInO1xuICAgIH1cbiAgICBzd2lwZXIudXBkYXRlKCk7XG4gIH1cbiAgbW91bnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XG4gICAgaWYgKHN3aXBlci5tb3VudGVkKSByZXR1cm4gdHJ1ZTtcblxuICAgIC8vIEZpbmQgZWxcbiAgICBsZXQgZWwgPSBlbGVtZW50IHx8IHN3aXBlci5wYXJhbXMuZWw7XG4gICAgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgfVxuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZWwuc3dpcGVyID0gc3dpcGVyO1xuICAgIGlmIChlbC5wYXJlbnROb2RlICYmIGVsLnBhcmVudE5vZGUuaG9zdCAmJiBlbC5wYXJlbnROb2RlLmhvc3Qubm9kZU5hbWUgPT09IHN3aXBlci5wYXJhbXMuc3dpcGVyRWxlbWVudE5vZGVOYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHN3aXBlci5pc0VsZW1lbnQgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBnZXRXcmFwcGVyU2VsZWN0b3IgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gYC4keyhzd2lwZXIucGFyYW1zLndyYXBwZXJDbGFzcyB8fCAnJykudHJpbSgpLnNwbGl0KCcgJykuam9pbignLicpfWA7XG4gICAgfTtcbiAgICBjb25zdCBnZXRXcmFwcGVyID0gKCkgPT4ge1xuICAgICAgaWYgKGVsICYmIGVsLnNoYWRvd1Jvb3QgJiYgZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcihnZXRXcmFwcGVyU2VsZWN0b3IoKSk7XG4gICAgICAgIC8vIENoaWxkcmVuIG5lZWRzIHRvIHJldHVybiBzbG90IGl0ZW1zXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxlbWVudENoaWxkcmVuKGVsLCBnZXRXcmFwcGVyU2VsZWN0b3IoKSlbMF07XG4gICAgfTtcbiAgICAvLyBGaW5kIFdyYXBwZXJcbiAgICBsZXQgd3JhcHBlckVsID0gZ2V0V3JhcHBlcigpO1xuICAgIGlmICghd3JhcHBlckVsICYmIHN3aXBlci5wYXJhbXMuY3JlYXRlRWxlbWVudHMpIHtcbiAgICAgIHdyYXBwZXJFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHN3aXBlci5wYXJhbXMud3JhcHBlckNsYXNzKTtcbiAgICAgIGVsLmFwcGVuZCh3cmFwcGVyRWwpO1xuICAgICAgZWxlbWVudENoaWxkcmVuKGVsLCBgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWApLmZvckVhY2goc2xpZGVFbCA9PiB7XG4gICAgICAgIHdyYXBwZXJFbC5hcHBlbmQoc2xpZGVFbCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcbiAgICAgIGVsLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgc2xpZGVzRWw6IHN3aXBlci5pc0VsZW1lbnQgJiYgIWVsLnBhcmVudE5vZGUuaG9zdC5zbGlkZVNsb3RzID8gZWwucGFyZW50Tm9kZS5ob3N0IDogd3JhcHBlckVsLFxuICAgICAgaG9zdEVsOiBzd2lwZXIuaXNFbGVtZW50ID8gZWwucGFyZW50Tm9kZS5ob3N0IDogZWwsXG4gICAgICBtb3VudGVkOiB0cnVlLFxuICAgICAgLy8gUlRMXG4gICAgICBydGw6IGVsLmRpci50b0xvd2VyQ2FzZSgpID09PSAncnRsJyB8fCBlbGVtZW50U3R5bGUoZWwsICdkaXJlY3Rpb24nKSA9PT0gJ3J0bCcsXG4gICAgICBydGxUcmFuc2xhdGU6IHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgJiYgKGVsLmRpci50b0xvd2VyQ2FzZSgpID09PSAncnRsJyB8fCBlbGVtZW50U3R5bGUoZWwsICdkaXJlY3Rpb24nKSA9PT0gJ3J0bCcpLFxuICAgICAgd3JvbmdSVEw6IGVsZW1lbnRTdHlsZSh3cmFwcGVyRWwsICdkaXNwbGF5JykgPT09ICctd2Via2l0LWJveCdcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpbml0KGVsKSB7XG4gICAgY29uc3Qgc3dpcGVyID0gdGhpcztcbiAgICBpZiAoc3dpcGVyLmluaXRpYWxpemVkKSByZXR1cm4gc3dpcGVyO1xuICAgIGNvbnN0IG1vdW50ZWQgPSBzd2lwZXIubW91bnQoZWwpO1xuICAgIGlmIChtb3VudGVkID09PSBmYWxzZSkgcmV0dXJuIHN3aXBlcjtcbiAgICBzd2lwZXIuZW1pdCgnYmVmb3JlSW5pdCcpO1xuXG4gICAgLy8gU2V0IGJyZWFrcG9pbnRcbiAgICBpZiAoc3dpcGVyLnBhcmFtcy5icmVha3BvaW50cykge1xuICAgICAgc3dpcGVyLnNldEJyZWFrcG9pbnQoKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgQ2xhc3Nlc1xuICAgIHN3aXBlci5hZGRDbGFzc2VzKCk7XG5cbiAgICAvLyBVcGRhdGUgc2l6ZVxuICAgIHN3aXBlci51cGRhdGVTaXplKCk7XG5cbiAgICAvLyBVcGRhdGUgc2xpZGVzXG4gICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xuICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cpIHtcbiAgICAgIHN3aXBlci5jaGVja092ZXJmbG93KCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IEdyYWIgQ3Vyc29yXG4gICAgaWYgKHN3aXBlci5wYXJhbXMuZ3JhYkN1cnNvciAmJiBzd2lwZXIuZW5hYmxlZCkge1xuICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoKTtcbiAgICB9XG5cbiAgICAvLyBTbGlkZSBUbyBJbml0aWFsIFNsaWRlXG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCAmJiBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCkge1xuICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnBhcmFtcy5pbml0aWFsU2xpZGUgKyBzd2lwZXIudmlydHVhbC5zbGlkZXNCZWZvcmUsIDAsIHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0LCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5wYXJhbXMuaW5pdGlhbFNsaWRlLCAwLCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCwgZmFsc2UsIHRydWUpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBsb29wXG4gICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xuICAgICAgc3dpcGVyLmxvb3BDcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBBdHRhY2ggZXZlbnRzXG4gICAgc3dpcGVyLmF0dGFjaEV2ZW50cygpO1xuICAgIGNvbnN0IGxhenlFbGVtZW50cyA9IFsuLi5zd2lwZXIuZWwucXVlcnlTZWxlY3RvckFsbCgnW2xvYWRpbmc9XCJsYXp5XCJdJyldO1xuICAgIGlmIChzd2lwZXIuaXNFbGVtZW50KSB7XG4gICAgICBsYXp5RWxlbWVudHMucHVzaCguLi5zd2lwZXIuaG9zdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tsb2FkaW5nPVwibGF6eVwiXScpKTtcbiAgICB9XG4gICAgbGF6eUVsZW1lbnRzLmZvckVhY2goaW1hZ2VFbCA9PiB7XG4gICAgICBpZiAoaW1hZ2VFbC5jb21wbGV0ZSkge1xuICAgICAgICBwcm9jZXNzTGF6eVByZWxvYWRlcihzd2lwZXIsIGltYWdlRWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1hZ2VFbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZSA9PiB7XG4gICAgICAgICAgcHJvY2Vzc0xhenlQcmVsb2FkZXIoc3dpcGVyLCBlLnRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByZWxvYWQoc3dpcGVyKTtcblxuICAgIC8vIEluaXQgRmxhZ1xuICAgIHN3aXBlci5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgcHJlbG9hZChzd2lwZXIpO1xuXG4gICAgLy8gRW1pdFxuICAgIHN3aXBlci5lbWl0KCdpbml0Jyk7XG4gICAgc3dpcGVyLmVtaXQoJ2FmdGVySW5pdCcpO1xuICAgIHJldHVybiBzd2lwZXI7XG4gIH1cbiAgZGVzdHJveShkZWxldGVJbnN0YW5jZSwgY2xlYW5TdHlsZXMpIHtcbiAgICBpZiAoZGVsZXRlSW5zdGFuY2UgPT09IHZvaWQgMCkge1xuICAgICAgZGVsZXRlSW5zdGFuY2UgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoY2xlYW5TdHlsZXMgPT09IHZvaWQgMCkge1xuICAgICAgY2xlYW5TdHlsZXMgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcmFtcyxcbiAgICAgIGVsLFxuICAgICAgd3JhcHBlckVsLFxuICAgICAgc2xpZGVzXG4gICAgfSA9IHN3aXBlcjtcbiAgICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMgPT09ICd1bmRlZmluZWQnIHx8IHN3aXBlci5kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2lwZXIuZW1pdCgnYmVmb3JlRGVzdHJveScpO1xuXG4gICAgLy8gSW5pdCBGbGFnXG4gICAgc3dpcGVyLmluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAvLyBEZXRhY2ggZXZlbnRzXG4gICAgc3dpcGVyLmRldGFjaEV2ZW50cygpO1xuXG4gICAgLy8gRGVzdHJveSBsb29wXG4gICAgaWYgKHBhcmFtcy5sb29wKSB7XG4gICAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBDbGVhbnVwIHN0eWxlc1xuICAgIGlmIChjbGVhblN0eWxlcykge1xuICAgICAgc3dpcGVyLnJlbW92ZUNsYXNzZXMoKTtcbiAgICAgIGlmIChlbCAmJiB0eXBlb2YgZWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgIH1cbiAgICAgIGlmICh3cmFwcGVyRWwpIHtcbiAgICAgICAgd3JhcHBlckVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzbGlkZXMgJiYgc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZUVsID0+IHtcbiAgICAgICAgICBzbGlkZUVsLmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzLCBwYXJhbXMuc2xpZGVGdWxseVZpc2libGVDbGFzcywgcGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MsIHBhcmFtcy5zbGlkZU5leHRDbGFzcywgcGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgICAgICAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICBzbGlkZUVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN3aXBlci5lbWl0KCdkZXN0cm95Jyk7XG5cbiAgICAvLyBEZXRhY2ggZW1pdHRlciBldmVudHNcbiAgICBPYmplY3Qua2V5cyhzd2lwZXIuZXZlbnRzTGlzdGVuZXJzKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2lwZXIub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gICAgaWYgKGRlbGV0ZUluc3RhbmNlICE9PSBmYWxzZSkge1xuICAgICAgaWYgKHN3aXBlci5lbCAmJiB0eXBlb2Ygc3dpcGVyLmVsICE9PSAnc3RyaW5nJykge1xuICAgICAgICBzd2lwZXIuZWwuc3dpcGVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZVByb3BzKHN3aXBlcik7XG4gICAgfVxuICAgIHN3aXBlci5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHN0YXRpYyBleHRlbmREZWZhdWx0cyhuZXdEZWZhdWx0cykge1xuICAgIGV4dGVuZChleHRlbmRlZERlZmF1bHRzLCBuZXdEZWZhdWx0cyk7XG4gIH1cbiAgc3RhdGljIGdldCBleHRlbmRlZERlZmF1bHRzKCkge1xuICAgIHJldHVybiBleHRlbmRlZERlZmF1bHRzO1xuICB9XG4gIHN0YXRpYyBnZXQgZGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRzO1xuICB9XG4gIHN0YXRpYyBpbnN0YWxsTW9kdWxlKG1vZCkge1xuICAgIGlmICghU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXykgU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXyA9IFtdO1xuICAgIGNvbnN0IG1vZHVsZXMgPSBTd2lwZXIucHJvdG90eXBlLl9fbW9kdWxlc19fO1xuICAgIGlmICh0eXBlb2YgbW9kID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZXMuaW5kZXhPZihtb2QpIDwgMCkge1xuICAgICAgbW9kdWxlcy5wdXNoKG1vZCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyB1c2UobW9kdWxlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobW9kdWxlKSkge1xuICAgICAgbW9kdWxlLmZvckVhY2gobSA9PiBTd2lwZXIuaW5zdGFsbE1vZHVsZShtKSk7XG4gICAgICByZXR1cm4gU3dpcGVyO1xuICAgIH1cbiAgICBTd2lwZXIuaW5zdGFsbE1vZHVsZShtb2R1bGUpO1xuICAgIHJldHVybiBTd2lwZXI7XG4gIH1cbn1cbk9iamVjdC5rZXlzKHByb3RvdHlwZXMpLmZvckVhY2gocHJvdG90eXBlR3JvdXAgPT4ge1xuICBPYmplY3Qua2V5cyhwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXSkuZm9yRWFjaChwcm90b01ldGhvZCA9PiB7XG4gICAgU3dpcGVyLnByb3RvdHlwZVtwcm90b01ldGhvZF0gPSBwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXVtwcm90b01ldGhvZF07XG4gIH0pO1xufSk7XG5Td2lwZXIudXNlKFtSZXNpemUsIE9ic2VydmVyXSk7XG5cbmV4cG9ydCB7IFN3aXBlciBhcyBTLCBkZWZhdWx0cyBhcyBkIH07XG4iLCIvKipcbiAqIFN3aXBlciAxMS4xLjE0XG4gKiBNb3N0IG1vZGVybiBtb2JpbGUgdG91Y2ggc2xpZGVyIGFuZCBmcmFtZXdvcmsgd2l0aCBoYXJkd2FyZSBhY2NlbGVyYXRlZCB0cmFuc2l0aW9uc1xuICogaHR0cHM6Ly9zd2lwZXJqcy5jb21cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDI0IFZsYWRpbWlyIEtoYXJsYW1waWRpXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKlxuICogUmVsZWFzZWQgb246IFNlcHRlbWJlciAxMiwgMjAyNFxuICovXG5cbmV4cG9ydCB7IFMgYXMgU3dpcGVyLCBTIGFzIGRlZmF1bHQgfSBmcm9tICcuL3NoYXJlZC9zd2lwZXItY29yZS5tanMnO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9