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