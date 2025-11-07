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