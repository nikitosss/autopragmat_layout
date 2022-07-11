// window.captcha_key = '6Lcam9UbAAAAAI3O-q8IIw-BgHnrVVjg0EHQiZU-';
window.captcha_key = '6LctjcggAAAAAMjDO81zSSFDOAnwVpM6S3EX5CWU';

$(async () => {
  await window.$loadScript('js/jquery.inputmask.bundle.js', true);
  await window.$loadScript('js/jquery.validate.min.js', true);
  await window.$loadScript('js/additional-methods.min.js', true);
  await window.$loadScript('js/select2.min.js', true);
  await window.$loadScript(`https://www.google.com/recaptcha/api.js?render=${window.captcha_key}`, true);

  const decimalPattern = '^[1-9]\\d*((,|\\.)\\d{2})?$';

  $.validator.addMethod(
    'regex',
    function (value, element, regexp) {
      if (regexp.constructor !== RegExp) {
        regexp = new RegExp(regexp);
      } else if (regexp.global) {
        regexp.lastIndex = 0;
      }
      return this.optional(element) || regexp.test(value);
    },
    'Please check your input.'
  );

  $.validator.addClassRules('tel', {
    regex: /^\+?[7-8]\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/,
  });

  $.validator.addClassRules('decimal', {
    pattern: new RegExp(decimalPattern),
  });

  $(':input[inputmode="decimal"]').inputmask('Regex', {
    regex: decimalPattern,
  });

  $(':input[inputmode="numeric"]').inputmask({
    rightAlign: false,
    autoGroup: false,
    groupSeparator: ' ',
    allowMinus: false,
    alias: 'integer',
    mask: 'N9{10}',
    definitions: {
      'N': {
        validator: '[1-9]'
      },
    }
  });

  $(':input[inputmode="tel"]').inputmask({
    mask: '(E 999 999 99 99)|(+S 999 999 99 99)',
    showMaskOnHover: false,
    showMaskOnFocus: false,
    // removeMaskOnSubmit: true,
    placeholder: '‐',
    definitions: {
      'S': {
        validator: '[7]'
      },
      'E': {
        validator: '[8]'
      },
    },
    onBeforePaste(pastedValue) {
      return pastedValue.substring(pastedValue.length - 11);
    },
  });

  $(':input[autocomplete="name"]').inputmask('Regex', {
    regex: '^[a-zA-Zа-яА-ЯёЁ\-\\s]+',
  });

  $('.apr-select:not([multiple])').select2({
    minimumResultsForSearch: Infinity,
  });

  $('.apr-select[multiple]').select2({
    minimumResultsForSearch: Infinity,
    closeOnSelect: false
  }).on('change', function () {
    const $select2 = $(this).next();
    const $search = $select2.find('.select2-search');
    $select2.find('.select2-selection__rendered li:not(.select2-search--inline)').hide();
    $select2.find('.counter').remove();
    $search.show();
    const counter = $select2.find('.select2-selection__choice').length;
    if (counter) {
      $search.hide();
      $select2.find('.select2-selection__rendered').after(`<div class="counter">Выбрано ${counter}</div>`);
    }
  });

  $('textarea').on('input', (e) => {
    e.target.style.height = '1px';
    e.target.style.height = e.target.scrollHeight + 'px';
  });

  $('label[data-icon]').each(function () {
    const icon = $(this).data('icon');
    $(this).append(`
      <svg class="apr-icon" viewBox="0 0 22 22" width="22" height="22">
          <use xlink:href="img/sprite.svg#symbol-${icon}"></use>
      </svg>
    `);
  });

  $('[data-services="select"]').on('change', function () {
    const $select = $(this);
    const $form = $select.closest('form');
    $form .find('[data-service]').addClass('hide');
    $form .find(`[data-service="${$select.val()}"]`).removeClass('hide');
  });

  $('[data-ajax-form="oplata"]').each(function () {
    $(this).validate({
      errorPlacement() {
        return true;
      },
      submitHandler(form) {
        const $button = $(form).find('[type=submit]');

        $button.prop('disabled', true);

        grecaptcha.ready(() => {
          grecaptcha.execute(window.captcha_key, {
            action: 'oplata'
          }).then((token) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'g-recaptcha-response';
            input.value = token.toString();
            form.appendChild(input);
            $button.prop('disabled', false);
            form.submit();
          });
        });
      }
    });
  });

  $('[data-ajax-form="zayavka"]').each(function () {
    $(this).validate({
      errorPlacement() {
        return true;
      },
      submitHandler(form) {
        const $form = $(form);
        const $button = $form.find('[type=submit]');

        $button.prop('disabled', true);

        grecaptcha.ready(() => {
          grecaptcha.execute(window.captcha_key, {
            action: 'zayavka'
          }).then((token) => {
            const data = new FormData(form);
            data.append('g-recaptcha-response', token.toString());

            $.ajax({
              data,
              url: '/ajax/zayavka.php',
              type: 'post',
              dataType: 'json',
              cache: false,
              contentType: false,
              processData: false,
              success() {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event': "gtm.usluga",
                  'usluga': data.get('USLUGA')
                });
              },
              error(e) {
                console.error(e);
              },
              complete() {
                $button.prop('disabled', false);
              },
            });
          });
        });
      }
    });
  });
});
