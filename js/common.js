window.$loadScript = (url, async = false, defer = false) =>
  new Promise((resolve, reject) => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = async;
    script.defer = defer;
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  });

function footerMapInit() {
  ymaps.ready(function () {
    var coord = [55.81242804203617, 37.631908033779695];
    var footerMap = new ymaps.Map('footer_map', {
      center: coord,
      zoom: 16,
      controls: ["fullscreenControl"],
    });
    var placemark = new ymaps.Placemark(footerMap.getCenter(), {
      balloonContentHeader: $('.apr-logo').attr('alt'),
      balloonContentBody : $('.apr-address').html(),
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map_point.svg',
      iconImageSize: [60, 68],
      iconImageOffset: [-30, -68],
    })

    footerMap.geoObjects.add(placemark);
    footerMap.controls.add('zoomControl', {
      size: "small",
    });
    footerMap.behaviors.disable('scrollZoom');
    footerMap.behaviors.disable('drag');
  });
}

function modalInit() {
  $('[data-open-modal]').click(function () {
    var id = $(this).data('open-modal');
    $('#' + id).attr('aria-modal', 'true');
    $('html').attr('aria-modal', 'true');
  });
  $('[data-close-modal]').click(function () {
    var id = $(this).data('close-modal');
    $('#' + id).attr('aria-modal', 'false');
    $('html').attr('aria-modal', 'false');
  });
  $(document).on('keyup', function(e) {
    if (e.key === 'Escape') {
      $('[aria-modal]').attr('aria-modal', 'false');
    }
  });
  document.documentElement.style.setProperty(
    '--scroll-bar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`
  );
}

function swiperInit() {
  var swiper = new Swiper('.apr-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

document.addEventListener('DOMContentLoaded', function (event) {
  window.$loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js', true).then(function () {
    modalInit();

    window.$loadScript('https://unpkg.com/swiper@8/swiper-bundle.min.js', true).then(function () {
      swiperInit();
    });

    window.$loadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', true).then(function () {
      footerMapInit();
    });
  });
});
