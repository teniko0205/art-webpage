// 初始化 AOS 動畫
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 導航欄滾動效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// 加載更多內容按鈕（如果需要）
document.querySelectorAll('.load-more').forEach(button => {
    button.addEventListener('click', function() {
        // 這裡可以添加加載更多內容的邏輯
        console.log('Loading more content...');
    });
});
