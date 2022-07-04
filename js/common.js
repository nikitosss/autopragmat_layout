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
          iconImageHref: 'img/map_point.svg',
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

function scrollToInit() {
  Array.from(document.querySelectorAll('[data-scroll-to]')).forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = event.target.dataset.scrollTo;

      document.getElementById(id).scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    });
  });
}

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
    if (e.key.toLowerCase() === 'escape') {
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

function swiperInit() {
  const sliderSelector = '.apr-swiper';
  const defaultOptions = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  [].forEach.call(document.querySelectorAll(sliderSelector), (slider) => {
    const data = slider.dataset.swiper || '{}';
    const dataOptions = JSON.parse(data);
    slider.options = Object.assign({}, defaultOptions, dataOptions);
    const swiper = new Swiper(slider, slider.options);

    // stop on hover
    if (typeof slider.options.autoplay !== 'undefined' && slider.options.autoplay !== false) {
      slider.addEventListener('mouseenter', () => {
        swiper.autoplay.stop();
      });

      slider.addEventListener('mouseleave', () => {
        swiper.autoplay.start();
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  // window.$loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js', true).then(() => {
  //
  // });

  modalInit();

  scrollToInit();

  window.$loadScript('https://unpkg.com/swiper@8.2.6/swiper-bundle.min.js', true).then(() => {
    swiperInit();
  });

  footerMapInit(document.getElementById('footer_map'));
});
