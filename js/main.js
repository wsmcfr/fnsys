// main.js - 蜂鸟创新工作室网站主要JavaScript文件

// === 页面加载完成后初始化 ===
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各个功能模块
    initLandingPage();
    initCarousel();
    initNavigation();
    initImageModal();
    initContactFeature();
    initScrollEffects();
});

// === 启动页功能 ===
function initLandingPage() {
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content-wrapper');
    
    if (landingPage && mainContent) {
        // 检查用户是否已经看过启动页（本次会话中）
        const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
        
        if (hasSeenLanding) {
            // 如果已经看过，直接显示主内容，隐藏启动页
            landingPage.style.display = 'none';
            mainContent.style.display = 'flex';
            document.body.style.overflow = 'auto';
            return; // 退出函数
        }
        
        // 首次访问，显示启动页
        mainContent.style.display = 'none'; // 确保主内容隐藏
        document.body.style.overflow = 'hidden'; // 防止页面滚动
        
        // 点击启动页进入主内容
        landingPage.addEventListener('click', function() {
            // 标记用户已经看过启动页
            sessionStorage.setItem('hasSeenLanding', 'true');
            
            landingPage.classList.add('hidden');
            
            // 等待动画完成后移除启动页并显示主内容
            setTimeout(() => {
                landingPage.style.display = 'none';
                mainContent.style.display = 'flex';
                document.body.style.overflow = 'auto';
            }, 1000);
        });
        
        // 3秒后自动显示提示
        setTimeout(() => {
            const enterPrompt = landingPage.querySelector('.enter-prompt');
            if (enterPrompt) {
                enterPrompt.style.opacity = '1';
            }
        }, 2000);
    }
}

// === 图片轮播功能 ===
function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const slides = document.querySelector('.carousel-slides');
    const slideItems = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!slides || slideItems.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slideItems.length;
    
    // 创建导航点
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // 更新轮播显示
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        slides.style.transform = `translateX(${translateX}%)`;
        
        // 更新导航点
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 跳转到指定幻灯片
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // 下一张
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    // 上一张
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    // 绑定按钮事件
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // 自动轮播（每5秒）
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停自动轮播
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') prevSlide();
        if (event.key === 'ArrowRight') nextSlide();
    });
}

// === 导航栏功能 ===
function initNavigation() {
    // 高亮当前页面导航
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // 移动端导航切换（如果需要）
    const header = document.querySelector('header');
    if (window.innerWidth <= 768) {
        // 可以在这里添加移动端菜单逻辑
    }
}

// === 图片模态框（灯箱）功能 ===
function initImageModal() {
    // 为所有可点击的图片添加模态框功能
    const clickableImages = document.querySelectorAll('.award-certificate, .carousel-slide img');
    
    clickableImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt || '图片');
        });
    });
}

function openImageModal(imageSrc, caption = '') {
    // 创建模态框HTML
    const modalHTML = `
        <div id="imageModal" class="modal" style="display: block;">
            <span class="close-modal">&times;</span>
            <img class="modal-content" src="${imageSrc}" alt="${caption}">
            <div id="caption">${caption}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // 关闭模态框
    function closeModal() {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) closeModal();
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeModal();
    });
    
    document.body.style.overflow = 'hidden';
}

// === 联系功能（包含QQ群复制） ===
function initContactFeature() {
    // 复制邮箱按钮
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            copyToClipboard('3540750653@qq.com', '邮箱地址已复制到剪贴板！');
        });
    }
    
    // 复制QQ按钮
    const copyQQBtn = document.getElementById('copy-qq-btn');
    if (copyQQBtn) {
        copyQQBtn.addEventListener('click', () => {
            copyToClipboard('3540750653', 'QQ号已复制到剪贴板！');
        });
    }
    
    // 复制QQ群按钮 - 新增功能
    const copyQQGroupBtn = document.getElementById('copy-qq-group-btn');
    if (copyQQGroupBtn) {
        copyQQGroupBtn.addEventListener('click', () => {
            copyToClipboard('859475376', 'QQ群号已复制到剪贴板！');
        });
    }
}

// === 滚动效果 ===
function initScrollEffects() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // 滚动到顶部按钮
    let scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTop';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #0d6efd;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            display: none;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(scrollToTopBtn);
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 显示/隐藏滚动到顶部按钮
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
}

// === 辅助函数 ===

// 通用复制函数
function copyToClipboard(text, successMessage) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showMessage(successMessage, 'success');
        }).catch(() => {
            fallbackCopy(text, successMessage);
        });
    } else {
        fallbackCopy(text, successMessage);
    }
}

// 复制到剪贴板的降级处理函数
function fallbackCopy(text, successMessage = '已复制到剪贴板！') {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showMessage(successMessage, 'success');
    } catch (err) {
        showMessage(`请手动复制：${text}`, 'info');
    }
    
    document.body.removeChild(textArea);
}

// 显示提示消息的函数
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    
    let bgColor = '#17a2b8'; // info 默认色
    if (type === 'success') bgColor = '#28a745';
    if (type === 'warning') bgColor = '#ffc107';
    if (type === 'error') bgColor = '#dc3545';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 4000;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 添加动画样式（如果还没有）
    if (!document.getElementById('message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// === 防抖函数 ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === 工具函数：检测设备类型 ===
function isMobile() {
    return window.innerWidth <= 768;
}

// === 响应式处理 ===
window.addEventListener('resize', debounce(() => {
    // 重新初始化需要响应式调整的功能
    if (isMobile()) {
        // 移动端特殊处理
    }
}, 250));

// === 错误处理 ===
window.addEventListener('error', function(event) {
    console.error('JavaScript错误:', event.error);
});

// === 页面可见性API ===
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画等
    } else {
        // 页面可见时恢复
    }
});
