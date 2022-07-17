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
  Array.from(document.querySelectorAll('[data-open-modal]')).forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = event.target.dataset.openModal;
      document.getElementById(id).setAttribute('aria-modal', 'true');
      document.documentElement.setAttribute('aria-modal', 'true');
    });
  });

  Array.from(document.querySelectorAll('[data-close-modal]')).forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = event.target.dataset.closeModal;
      document.getElementById(id).setAttribute('aria-modal', 'false');
      document.documentElement.setAttribute('aria-modal', 'false');
    });
  });

  document.addEventListener('keyup', (e) => {
    if (e?.key?.toLowerCase() === 'escape') {
      Array.from(document.querySelectorAll('[aria-modal]')).forEach((element) => {
        element.setAttribute('aria-modal', 'false');
      });
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
    $(this).toggleClass('open');
    $(this).find('.apr-second-screen__item-text').slideToggle('slow');
  });
}

function expandInit() {
  $(document).on('click', '[data-expand]', function() {
    $(this).prev().addClass('expand');
    $(this).hide();
  });
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

document.addEventListener('DOMContentLoaded', () => {
  modalInit();
  scrollToInit();
  expandInit();
  swiperInit('.apr-swiper');
  collapseInit();
  footerMapInit(document.getElementById('footer_map'));
  window.$loadScript(`${window.SITE_TEMPLATE_PATH}/assets/js/form.js`, true);
});
