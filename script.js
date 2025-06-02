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

// 收藏功能
document.addEventListener('DOMContentLoaded', function() {
    // 從 localStorage 獲取已收藏的項目
    let favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    // 更新所有收藏按鈕的初始狀態
    updateAllFavoriteButtons();

    // 為所有收藏按鈕添加點擊事件
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = this.dataset.type;
            const title = this.dataset.title;

            // 切換收藏狀態
            toggleFavorite(id, type, title, this);

            // 顯示提示訊息
            showNotification(favorites[id] ? '已加入收藏！' : '已取消收藏');
        });
    });    // 更新所有收藏按鈕的狀態
    function updateAllFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const id = btn.dataset.id;
            if (favorites[id]) {
                btn.classList.remove('text-gray-400');
                btn.classList.add('text-yellow-500');
            } else {
                btn.classList.add('text-gray-400');
                btn.classList.remove('text-yellow-500');
            }
        });

        // 如果在首頁，更新收藏預覽
        const previewContainer = document.getElementById('favorites-preview-container');
        const noFavoritesPreview = document.getElementById('no-favorites-preview');
        if (previewContainer && noFavoritesPreview) {
            updateFavoritesPreview(previewContainer, noFavoritesPreview);
        }
    }

    // 更新收藏預覽區域
    function updateFavoritesPreview(container, noFavoritesElement) {
        const items = Object.entries(favorites);
        
        if (items.length === 0) {
            container.classList.add('hidden');
            noFavoritesElement.classList.remove('hidden');
            return;
        }

        container.classList.remove('hidden');
        noFavoritesElement.classList.add('hidden');
        container.innerHTML = '';

        // 只顯示最新的3個收藏
        items
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .slice(0, 3)
            .forEach(([id, item]) => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow';
                card.setAttribute('data-aos', 'fade-up');

                const icons = {
                    course: 'fas fa-book',
                    tool: 'fas fa-tools',
                    video: 'fas fa-video',
                    history: 'fas fa-landmark'
                };

                const typeLabels = {
                    course: '課程',
                    tool: '工具',
                    video: '影片',
                    history: '藝術史'
                };

                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <i class="${icons[item.type] || 'fas fa-star'} text-2xl text-purple-600 mr-3"></i>
                            <div>
                                <h3 class="font-bold">${item.title}</h3>
                                <span class="text-sm text-gray-500">${typeLabels[item.type] || '其他'}</span>
                            </div>
                        </div>
                        <button class="favorite-btn text-yellow-500 hover:text-gray-400 transition-colors" 
                                data-id="${id}" 
                                data-type="${item.type}" 
                                data-title="${item.title}">
                            <i class="fas fa-star text-xl"></i>
                        </button>
                    </div>
                    <p class="text-gray-600 text-sm">
                        收藏於 ${new Date(item.timestamp).toLocaleDateString('zh-TW')}
                    </p>
                `;

                container.appendChild(card);
            });

        // 為新添加的收藏按鈕添加事件監聽器
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                delete favorites[id];
                localStorage.setItem('favorites', JSON.stringify(favorites));
                updateFavoritesPreview(container, noFavoritesElement);
                updateAllFavoriteButtons();
                showNotification('已取消收藏');
            });
        });
    }

    // 切換收藏狀態
    function toggleFavorite(id, type, title, button) {
        if (favorites[id]) {
            delete favorites[id];
            button.classList.add('text-gray-400');
            button.classList.remove('text-yellow-500');
        } else {
            favorites[id] = { type, title, timestamp: Date.now() };
            button.classList.remove('text-gray-400');
            button.classList.add('text-yellow-500');
        }
        
        // 保存到 localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // 處理收藏頁面的顯示
    if (window.location.pathname.includes('favorites.html')) {
        const container = document.getElementById('favorites-container');
        const noFavorites = document.getElementById('no-favorites');
        const categoryButtons = document.querySelectorAll('.category-btn');

        // 顯示收藏項目
        function displayFavorites(category = 'all') {
            container.innerHTML = '';
            const items = Object.entries(favorites);

            // 如果沒有收藏項目
            if (items.length === 0) {
                container.classList.add('hidden');
                noFavorites.classList.remove('hidden');
                return;
            }

            // 有收藏項目
            container.classList.remove('hidden');
            noFavorites.classList.add('hidden');

            // 過濾並排序項目
            items
                .filter(([_, item]) => category === 'all' || item.type === category)
                .sort((a, b) => b[1].timestamp - a[1].timestamp)
                .forEach(([id, item]) => {
                    const card = createFavoriteCard(id, item);
                    container.appendChild(card);
                });

            // 如果過濾後沒有項目
            if (container.children.length === 0) {
                noFavorites.classList.remove('hidden');
            }
        }

        // 創建收藏卡片
        function createFavoriteCard(id, item) {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow';
            card.setAttribute('data-aos', 'fade-up');

            // 根據類型選擇圖標
            const icons = {
                course: 'fas fa-book',
                tool: 'fas fa-tools',
                video: 'fas fa-video',
                history: 'fas fa-landmark'
            };

            const typeLabels = {
                course: '課程',
                tool: '工具',
                video: '影片',
                history: '藝術史'
            };

            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <i class="${icons[item.type] || 'fas fa-star'} text-2xl text-purple-600 mr-3"></i>
                        <div>
                            <h3 class="font-bold">${item.title}</h3>
                            <span class="text-sm text-gray-500">${typeLabels[item.type] || '其他'}</span>
                        </div>
                    </div>
                    <button class="favorite-btn text-yellow-500 hover:text-gray-400 transition-colors" 
                            data-id="${id}" 
                            data-type="${item.type}" 
                            data-title="${item.title}">
                        <i class="fas fa-star text-xl"></i>
                    </button>
                </div>
                <p class="text-gray-600 text-sm">
                    收藏於 ${new Date(item.timestamp).toLocaleDateString('zh-TW')}
                </p>
            `;

            // 添加取消收藏功能
            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', function() {
                delete favorites[id];
                localStorage.setItem('favorites', JSON.stringify(favorites));
                card.remove();
                showNotification('已取消收藏');
                
                // 檢查是否需要顯示空狀態
                if (Object.keys(favorites).length === 0) {
                    container.classList.add('hidden');
                    noFavorites.classList.remove('hidden');
                }
            });

            return card;
        }

        // 分類按鈕點擊事件
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-purple-600', 'text-white');
                    btn.classList.add('bg-gray-200');
                });
                this.classList.remove('bg-gray-200');
                this.classList.add('bg-purple-600', 'text-white');
                displayFavorites(this.dataset.category);
            });
        });

        // 初始顯示所有收藏
        displayFavorites();
    }

    // 顯示提示訊息
    function showNotification(message) {
        // 檢查是否已存在通知元素
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300';
            document.body.appendChild(notification);
        }

        // 更新訊息
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';

        // 3秒後隱藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }
});
