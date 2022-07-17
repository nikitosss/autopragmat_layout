function youtubeDataInit($container) {
  const API_URL = 'https://www.googleapis.com/youtube/v3/';
  const CHANNEL_ID = 'UCr2EXJtFMunvG0CmYE3Tj8A';
  const API_KEY = 'AIzaSyCxPo7wC1t6Krzsozz_8XPf-Zpp-7eHIqU';
  let isRender = false;

  async function init() {
    let subscriberCount = sessionStorage.getItem('youtube_subscriberCount');
    let thumbnail = sessionStorage.getItem('youtube_thumbnail');
    let videos = sessionStorage.getItem('youtube_videos');

    try {
      if (!subscriberCount) {
        const data = await fetch(`${API_URL}channels?` + new URLSearchParams({
          part: 'statistics',
          id: CHANNEL_ID,
          key: API_KEY,
        })).then(response => response.json());

        subscriberCount = data?.items[0]?.statistics?.subscriberCount.toString();
        sessionStorage.setItem('youtube_subscriberCount', subscriberCount);
      }
    } finally {
      subscriberCount = Number(subscriberCount || '');
    }

    try {
      if (!thumbnail) {
        const data = await fetch(`${API_URL}channels?` + new URLSearchParams({
          part: 'snippet',
          id: CHANNEL_ID,
          key: API_KEY,
        })).then(response => response.json());

        thumbnail = JSON.stringify(data?.items[0]?.snippet?.thumbnails?.default);
        sessionStorage.setItem('youtube_thumbnail', thumbnail);
      }
    } finally {
      thumbnail = JSON.parse(thumbnail || '{}');
    }

    try {
      if (!videos) {
        const data = await fetch(`${API_URL}search?` + new URLSearchParams({
          part: 'snippet',
          maxResults: '3',
          order: 'date',
          type: 'video',
          channelId: CHANNEL_ID,
          key: API_KEY,
        })).then(response => response.json());

        videos = JSON.stringify(data?.items);
        sessionStorage.setItem('youtube_videos', videos);
      }
    } finally {
      videos = JSON.parse(videos || '[]');
    }

    const Ysnippet = document.getElementById('y_snippet');

    Ysnippet.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="y_subscribe">
        <strong>${subscriberCount / 1_000_000} млн подписчиков</strong>
        <div>www.youtube.com/AsafievStas</div>
      </div>
    `
    );

    if (thumbnail.url) {
      Ysnippet.insertAdjacentHTML(
        'afterbegin',
        `<div class="y_thumbnail" style="background-image: url('${thumbnail.url}')" />`
      );
    }

    if (videos.length) {
      const arr = videos.map((item) => {
        const href = `https://youtu.be/${item.id.videoId}`;
        const title = item.snippet.title;
        const src = item.snippet.thumbnails.medium.url;

        return `
        <a class="apr-fourteenth-screen__item" href="${href}" title="${title}" target="_blank">
          <picture class="apr-pic">
              <img class="apr-img apr-img--cover" src="${src}" alt="${title}" width="230" height="130" loading="lazy"/>
          </picture>
        </a>
      `;
      });

      document.getElementById('y_videos').insertAdjacentHTML('afterbegin', arr.join(''));
    }

    isRender = true;
  }

  const YdataObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRender) {
        init();
      }
    });
  }, {
    threshold: 0.1,
  });

  if ($container) {
    YdataObserver.observe($container);
  }
}

function casesSwiperInit(selector) {
  const $container = $(selector);
  const $swiper = $container.find('.swiper');
  const $next = $container.find('.swiper-button-next');
  const $prev = $container.find('.swiper-button-prev');
  const $pagination = $container.find('.swiper-pagination');

  const swiper = new Swiper($swiper.get(0), {
    loop: true,
    navigation: {
      nextEl: $next.get(0),
      prevEl: $prev.get(0),
    },
    pagination: {
      el: $pagination.get(0),
      clickable: true,
    },
  });
}

function teamSwiperInit(selector) {
  const $container = $(selector);
  const $swiper = $container.find('.swiper');
  const $next = $container.find('.swiper-button-next');
  const $prev = $container.find('.swiper-button-prev');

  const swiper = new Swiper($swiper.get(0), {
    loop: false,
    navigation: {
      nextEl: $next.get(0),
      prevEl: $prev.get(0),
    },
    slidesPerView: 3,
    spaceBetween: 40,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1281: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  });
}

function checkingSwiperInit(selector) {
  const $container = $(selector);
  const $swiper = $container.find('.swiper');
  const $next = $container.find('.swiper-button-next');
  const $prev = $container.find('.swiper-button-prev');
  const $pagination = $container.find('#checking_swiper_pagination');
  const $slides = $container.find('.swiper-slide');

  const swiper = new Swiper($swiper.get(0), {
    loop: true,
    navigation: {
      nextEl: $next.get(0),
      prevEl: $prev.get(0),
    },
    slidesPerView: 1,
    pagination: {
      el: $pagination.get(0),
      clickable: true,
      renderBullet(index, className) {
        const el = $slides.get(index);
        const [x, y] = el.dataset.cords.split(':');
        // return `<circle class="${className}" cx="${x}" cy="${y}" r="16" />`;
        return `<g class="${className}"><use x="${x}" y="${y}" xlink:href="${window.SITE_TEMPLATE_PATH}/assets/img/note_info.svg#info"></use></g>`;
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  youtubeDataInit(document.getElementById('y_data'));
  casesSwiperInit('.cases-swiper');
  teamSwiperInit('.team-swiper');
  checkingSwiperInit('.checking-swiper');
});
