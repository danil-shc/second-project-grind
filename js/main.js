document.addEventListener('DOMContentLoaded', function() {
  const readMoreBtn = document.querySelector('.read-more-btn');
  
  readMoreBtn.addEventListener('click', function() {
    const seoBlock = this.closest('.seo-block');
    const isExpanded = seoBlock.classList.contains('expanded');
    
    seoBlock.classList.toggle('expanded');
    
    const textNode = this.childNodes[0];
    if (seoBlock.classList.contains('expanded')) {
      textNode.textContent = 'Свернуть ';
    } else {
      textNode.textContent = 'Читать полностью ';
    }
  });
});

const $slider = $('.portfolio_inner-block');
const $slides = $slider.children('li').slice(0,5); // у тебя уже 5
const $pager  = $('.portfolio_pager').empty();

$slides.each((i)=> $('<button type="button" class="pager-dot">').appendTo($pager));

function setActive(i){
  $slides.removeClass('is-active').eq(i).addClass('is-active');
  $pager.find('.pager-dot').removeClass('is-active').eq(i).addClass('is-active');
}
setActive(0);

$pager.on('click','.pager-dot',function(){ setActive($(this).index()); });

$(function(){
  const bp = '(max-width:750px)';
  const $inner = $('.partners_inner');
  const $items = $inner.find('.partners_inner-item');
  let pages = [], cur = 0, $pager = null;

  function buildPager(count){
    if(!$pager){ $pager = $('<div class="partners_pager"></div>').insertAfter($inner); }
    $pager.empty();
    for(let i=0;i<count;i++){
      $('<button type="button" class="partners-dot" aria-label="Страница '+(i+1)+'"></button>')
        .appendTo($pager);
    }
  }

 function setPage(i){
  cur = i;
  $inner.addClass('is-fading');           // старт затемнения
  setTimeout(() => {
    $items.hide().removeClass('is-active');
    pages[i].forEach(idx => $items.eq(idx).show().addClass('is-active'));
    if($pager) $pager.children('.partners-dot')
      .removeClass('is-active').eq(i).addClass('is-active');
    requestAnimationFrame(() => $inner.removeClass('is-fading')); // вернуть прозрачность
  }, 120); // тайминг под transition .25s
}

  function init(){
    if (window.matchMedia(bp).matches){
      const per = 3;
      const total = $items.length;
      const count = Math.ceil(total / per);
      pages = Array.from({length: count}, (_,k)=> {
        const start = k*per;
        return [start, start+1, start+2].filter(i => i < total);
      });
      buildPager(count);
      setPage(Math.min(cur, pages.length - 1) || 0);
    } else {
      // десктоп
      $items.show().removeClass('is-active');
      if($pager){ $pager.remove(); $pager = null; }
    }
  }

  $(document).on('click', '.partners_pager .partners-dot', function(){
    setPage($(this).index());
  });

  // свайпы
  let sx = null;
  $inner.on('touchstart', e => {
    if(!window.matchMedia(bp).matches) return;
    sx = e.originalEvent.touches[0].clientX;
  });
  $inner.on('touchend', e => {
    if(!window.matchMedia(bp).matches || sx == null) return;
    const dx = e.originalEvent.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 40){
      const last = pages.length - 1;
      if(dx < 0 && cur < last) setPage(cur + 1);
      if(dx > 0 && cur > 0)    setPage(cur - 1);
    }
    sx = null;
  });

  init();
  $(window).on('resize', debounce(init, 120));

  function debounce(fn, ms){ let t; return function(){ clearTimeout(t); t = setTimeout(fn, ms); }; }
});
// Инициализация слайдера для блока "Услуги типографии"
$(function () {
  const mq = window.matchMedia('(max-width:750px)');
  const $root = $('.print-services_slider');              // контейнер секции

  function init() {
    if ($root.data('ps-inited')) return;
    const $list  = $root.find('.print-services_inner');
    const $items = $list.children('.print-services_inner-card');

    // снимок исходной сетки, чтобы потом полностью восстановить
    $root.data('ps-html', $list.html());
    $root.data('ps-inited', true);

    // создаём пейджер
    let $pager = $root.find('.services_pager');
    if (!$pager.length) $pager = $('<div class="services_pager"></div>').insertAfter($list);
    $pager.empty();
    $items.each(() => $('<button type="button" class="pager-dot"></button>').appendTo($pager));

    // показать первый
    $items.hide().removeClass('is-active').eq(0).show().addClass('is-active');
    $pager.find('.pager-dot').eq(0).addClass('is-active');

    // обработчик (namespace для корректного снятия)
    $pager.off('click.ps').on('click.ps', '.pager-dot', function () {
      const i = $(this).index();
      $items.hide().removeClass('is-active').eq(i).show().addClass('is-active');
      $pager.find('.pager-dot').removeClass('is-active').eq(i).addClass('is-active');
    });
  }

  function destroy() {
    if (!$root.data('ps-inited')) return;
    const $list = $root.find('.print-services_inner');
    // полное восстановление DOM сетки
    $list.html($root.data('ps-html'));
    $root.find('.services_pager').remove();     // убрать пейджер
    $root.removeData('ps-inited').removeData('ps-html');
  }

  function apply() { mq.matches ? init() : destroy(); }

  // первый прогон и слежение за брейкпоинтом
  apply();
  (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
});

$(function () {
  var $track = $('.other_services-track');
  var $cards = $('.other_services-card');
  var $slider = $('.other_services-slider');
  var $btnPrev = $('.other_services-arrow--prev');
  var $btnNext = $('.other_services-arrow--next');

  var cardStep = 0;          // сдвиг в карточках
  var maxStep = 0;

  function recalc() {
    var cardWidth = $cards.outerWidth(true);      // ширина + gap
    var visible = Math.floor($slider.width() / cardWidth) || 1;
    maxStep = Math.max(0, $cards.length - visible);
    if (cardStep > maxStep) cardStep = maxStep;
    update();
  }

  function update() {
    var cardWidth = $cards.outerWidth(true);
    var offset = -cardStep * cardWidth;
    $track.css('transform', 'translateX(' + offset + 'px)');

    $btnPrev.prop('disabled', cardStep === 0);
    $btnNext.prop('disabled', cardStep === maxStep);
  }

  $btnPrev.on('click', function () {
    if (cardStep > 0) {
      cardStep--;
      update();
    }
  });

  $btnNext.on('click', function () {
    if (cardStep < maxStep) {
      cardStep++;
      update();
    }
  });

  // пересчёт при загрузке и ресайзе
  recalc();
  $(window).on('resize', recalc);
});

$(function () {
  // если есть элемент с классом faq-item--open — он сразу показан (CSS сам раскроет)
  $('.faq-header').on('click', function () {
    var $item = $(this).closest('.faq-item');
    var $list = $item.closest('.faq-list');

    if ($item.hasClass('faq-item--open')) {
      // закрываем текущий
      $item.removeClass('faq-item--open');
    } else {
      // закрываем остальные
      $list.find('.faq-item--open').removeClass('faq-item--open');
      // открываем текущий
      $item.addClass('faq-item--open');
    }
  });
});

$(function () {
  var $track  = $('.equipment-track');
  var $slides = $('.equipment-slide');
  var $dots   = $('.equipment-dot');
  var current = 0;
  var count   = $slides.length;

  function goTo(index) {
    if (index < 0) index = count - 1;
    if (index >= count) index = 0;
    current = index;

    var offset = -100 * index;
    $track.css('transform', 'translateX(' + offset + '%)');

    $dots.removeClass('equipment-dot--active')
         .eq(index).addClass('equipment-dot--active');
  }

  $('.equipment-arrow--prev').on('click', function () {
    goTo(current - 1);
  });

  $('.equipment-arrow--next').on('click', function () {
    goTo(current + 1);
  });

  $dots.on('click', function () {
    var idx = $(this).index();
    goTo(idx);
  });
});

$(function () {
  $('.gallery_top-menu').on('click', 'a', function (e) {
    e.preventDefault();

    $('.gallery_top-menu a')
      .removeClass('gallery_top-menu-item_active')
      .addClass('gallery_top-menu-item');

    $(this)
      .addClass('gallery_top-menu-item_active')
      .removeClass('gallery_top-menu-item');
  });
});

(function () {
  const BP_TABLET = 1280;
  const BP_MOBILE = 760;

  const responsiveImages = document.querySelectorAll(
    '[data-src-desktop][data-src-tablet][data-src-mobile]'
  );

  if (!responsiveImages.length) return;

  function updateResponsiveImages() {
    const width = window.innerWidth;

    responsiveImages.forEach(function (img) {
      let newSrc = img.dataset.srcDesktop;

      if (width <= BP_MOBILE) {
        newSrc = img.dataset.srcMobile;
      } else if (width <= BP_TABLET) {
        newSrc = img.dataset.srcTablet;
      }

      if (img.getAttribute('src') !== newSrc) {
        img.setAttribute('src', newSrc);
      }
    });
  }

  updateResponsiveImages();
  window.addEventListener('resize', updateResponsiveImages);
})();

$(function () {
  const mq = window.matchMedia('(max-width:720px)');
  const $root = $('.other_services-slider');
  if (!$root.length) return;

  let inited = false;
  let $items, $pager;

  function init() {
    if (inited) return;

    const $list = $root.find('.other_services-track');
    $items = $list.children('.other_services-card');

    $pager = $root.find('.other_services_pager');
    if (!$pager.length) {
      $pager = $('<div class="other_services_pager"></div>').insertAfter($list);
    }
    $pager.empty();

    $items.each(function () {
      $('<button type="button" class="pager-dot"></button>').appendTo($pager);
    });

    $items.hide().removeClass('is-active').eq(0).show().addClass('is-active');
    $pager.find('.pager-dot').eq(0).addClass('is-active');
    $pager.on('click.os', '.pager-dot', function () {
      const i = $(this).index();
      $items.hide().removeClass('is-active').eq(i).show().addClass('is-active');
      $pager.find('.pager-dot').removeClass('is-active').eq(i).addClass('is-active');
    });

    inited = true;
  }

  function destroy() {
    if (!inited) return;

    if ($pager) {
      $pager.off('click.os', '.pager-dot').empty();
    }

    $root.find('.other_services-card').show().removeClass('is-active');

    inited = false;
  }

  function apply() {
    if (mq.matches) {
      init();
      $('.other_services-arrows').hide();
    } else {
      destroy();
      $('.other_services-arrows').show();
    }
  }

  apply();
  if (mq.addEventListener) {
    mq.addEventListener('change', apply);
  } else {
    mq.addListener(apply);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('.header-inner_icon-hidden');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = mobileMenu.querySelector('.mobile-menu__backdrop');
  const closeBtn = mobileMenu.querySelector('.mobile-menu__close');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  if (burger) {
    burger.addEventListener('click', openMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.mobile-menu__item-header');

  accordionHeaders.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.mobile-menu__item');
      const submenu = item.querySelector('.mobile-menu__submenu');
      if (!submenu) return;

      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  });
});

