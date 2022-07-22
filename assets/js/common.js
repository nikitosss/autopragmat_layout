window.$loadScript = (url, async = false, defer = false) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = async;
    script.defer = defer;
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  });

function modalInit() {
  $(document).on('click', '[data-open-modal]', function() {
    const id = $(this).data('open-modal');
    document.getElementById(id).setAttribute('aria-modal', 'true');
    document.documentElement.setAttribute('aria-modal', 'true');
  });

  $(document).on('click', '[data-close-modal]', function() {
    const id = $(this).data('close-modal');
    document.getElementById(id).setAttribute('aria-modal', 'false');
    document.documentElement.setAttribute('aria-modal', 'false');
  });

  $(document).on('keyup', function(e) {
    if (e?.key?.toLowerCase() === 'escape') {
      $('[aria-modal]').attr('aria-modal', 'false');
    }
  });

  document.documentElement.style.setProperty(
    '--scroll-bar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`
  );
}

function scrollToInit() {
  $(document).on('click', '[data-scroll-to]', function() {
    document.getElementById($(this).data('scroll-to')).scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  });
}

function collapseInit() {
  $(document).on('click', '[data-collapse-item]', function() {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      $(this).toggleClass('open');
      $(this).find('.apr-second-screen__item-text').slideToggle('slow');
    }
  });
}

function expandInit() {
  $('[data-clamp]').each(function () {
    $clamp($(this).get(0), { clamp: $(this).data('clamp') });
  });
  $(document).on('click', '[data-expand]', function() {
    $(this).prev().addClass('expand');
    $(this).hide();
  });
}

function stickyInit(className) {
  const $el = $(`.${className}`);
  const hideClassName = `${className}--hide`;
  const toggleClass = () => {
    if (oldScroll < this.scrollY && this.scrollY > $el.height()) $el.addClass(hideClassName);
    else $el.removeClass(hideClassName);
    oldScroll = this.scrollY;
  };
  let oldScroll = 0;

  $(window).on('scroll', $.throttle( 300, toggleClass ));
}

function swiperInit(selector) {
  $(selector).each(function () {
    const $container = $(this);
    const $swiper = $container.find('.swiper');
    const $next = $container.find('.swiper-button-next');
    const $prev = $container.find('.swiper-button-prev');
    const $pagination = $container.find('.swiper-pagination');
    const dataOptions = $swiper.data('swiper') || {};

    const swiper = new Swiper($swiper.get(0), {
      loop: true,
      navigation: {
        nextEl: $next.get(0),
        prevEl: $prev.get(0),
      },
      pagination: {
        el: $pagination.get(0),
        clickable: true
      },
      breakpoints: {
        1024: {
          allowTouchMove: false,
        },
      },
      ...dataOptions,
    });

    // stop on hover
    if (typeof dataOptions?.autoplay !== 'undefined' && dataOptions?.autoplay !== false) {
      $container.on('mouseenter', () => {
        swiper.autoplay.stop();
      });
      $container.on('mouseleave', () => {
        swiper.autoplay.start();
      });
    }
  });

  $('.swiper-button-next, .swiper-button-prev').html(`
     <svg>
      <use xlink:href="${window.SITE_TEMPLATE_PATH}/assets/img/rarr.svg#rarr"></use>
     </svg>
  `);
}

function footerMapInit($container) {
  if ($container) {
    let isRender = false;

    function init() {
      ymaps.ready(() => {
        const coord = [55.81242804203617, 37.631908033779695];
        const footerMap = new ymaps.Map($container, {
          center: coord,
          zoom: 16,
          controls: ['fullscreenControl'],
        });
        const placemark = new ymaps.Placemark(footerMap.getCenter(), {
          balloonContentHeader: document.querySelector('.apr-logo').getAttribute('alt'),
          balloonContentBody: document.querySelector('.apr-address').innerHTML,
        }, {
          iconLayout: 'default#image',
          iconImageHref: `${window.SITE_TEMPLATE_PATH}/assets/img/map_point.svg`,
          iconImageSize: [60, 68],
          iconImageOffset: [-30, -68],
        })

        footerMap.geoObjects.add(placemark);
        footerMap.controls.add('zoomControl', {
          size: 'small',
        });
        footerMap.behaviors.disable('scrollZoom');
        footerMap.behaviors.disable('drag');

        isRender = true;
      });
    }

    const footerMapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isRender) {
          if (typeof ymaps !== 'undefined') {
            init();
          } else {
            window.$loadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', true).then(init);
          }
        }
      });
    }, {
      threshold: 0.1
    });

    footerMapObserver.observe($container);
  }
}

$(async () => {
  await window.$loadScript(`${window.SITE_TEMPLATE_PATH}/assets/js/jquery.ba-throttle-debounce.min.js`, true);
  modalInit();
  scrollToInit();
  stickyInit('apr-sticky');
  collapseInit();
  swiperInit('.apr-swiper');
  footerMapInit(document.getElementById('footer_map'));
  await window.$loadScript(`${window.SITE_TEMPLATE_PATH}/assets/js/clamp.min.js`, true);
  expandInit();
  await window.$loadScript(`${window.SITE_TEMPLATE_PATH}/assets/js/form.js`, true);
});
