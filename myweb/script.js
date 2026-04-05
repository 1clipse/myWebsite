// ===== 页面加载完成后执行 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人主页已加载 | 科技感设计');

    // ===== 导航菜单交互 =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // 设置初始活动链接
    setActiveNavLink();

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 获取目标部分ID
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // 滚动到目标部分
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });

                // 更新活动链接
                updateActiveNavLink(targetId);
            }
        });
    });

    // 监听滚动以更新活动导航链接
    window.addEventListener('scroll', setActiveNavLink);

    // ===== 技能标签悬停效果 =====
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== 卡片悬停效果增强 =====
    const cards = document.querySelectorAll('.profile-card, .project-card, .qr-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ===== 状态指示器动画 =====
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        setInterval(() => {
            statusIndicator.style.boxShadow = `0 0 ${10 + Math.random() * 10}px var(--neon-green)`;
        }, 2000);
    }

    // ===== 网格背景动画控制 =====
    const gridBackground = document.querySelector('.grid-background');
    if (gridBackground) {
        // 鼠标移动时轻微改变网格位置
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            gridBackground.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ===== 统计数字动画 =====
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const originalText = stat.textContent;
        if (originalText.includes('+') || originalText.includes('年') || originalText === '100%') {
            // 简单动画：数字变化
            let finalValue = originalText.replace(/\D/g, '');
            if (finalValue) {
                animateNumber(stat, parseInt(finalValue), originalText.includes('+') ? '+' : '');
            }
        }
    });

    // ===== 二维码区域提示 =====
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    if (qrPlaceholder) {
        qrPlaceholder.addEventListener('click', function() {
            alert('提示：要使用你的二维码，请执行以下操作：\n1. 将二维码图片保存为 "qrcode.png"\n2. 将其放在 "images" 文件夹中\n3. 替换当前二维码占位符');
        });
    }

    // ===== 控制台欢迎信息 =====
    console.log('%c', 'color: #00ffff; font-size: 16px; font-weight: bold;');
    console.log('%c', 'color: #9d4edd;');
    console.log('%c', 'color: #00ff9d;');
    console.log('========================================');

    // ===== 辅助函数 =====

    // 设置活动导航链接
    function setActiveNavLink() {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 150 &&
                window.scrollY < sectionTop + sectionHeight - 150) {
                currentSectionId = `#${section.id}`;
            }
        });

        updateActiveNavLink(currentSectionId);
    }

    // 更新活动导航链接
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // 数字动画
    function animateNumber(element, finalNumber, suffix = '') {
        let start = 0;
        const duration = 2000; // 动画持续时间
        const increment = finalNumber / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= finalNumber) {
                start = finalNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(start) + suffix;
        }, 16);
    }

    // ===== 键盘快捷键 =====
    document.addEventListener('keydown', function(e) {
        // 按 'H' 键返回顶部
        if (e.key === 'h' || e.key === 'H') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 按 'D' 键切换控制台调试模式
        if (e.key === 'd' || e.key === 'D') {
            if (e.ctrlKey) {
                console.log('%c🔧 调试模式:', 'color: #ff9900; font-weight: bold;');
                console.log('窗口大小:', window.innerWidth, 'x', window.innerHeight);
                console.log('活动部分:', document.querySelector('.nav-link.active')?.getAttribute('href'));
            }
        }
    });

    // ===== 页面加载动画 =====
    // 添加淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // ===== 二维码图片调试 =====
    const qrcodeImg = document.getElementById('qrcode-img');
    if (qrcodeImg) {
        // 添加加载成功事件
        qrcodeImg.addEventListener('load', function() {
            console.log('二维码图片加载成功');
            console.log('  图片尺寸:', this.naturalWidth, 'x', this.naturalHeight);
            console.log('  图片路径:', this.src);
        });

        // 添加加载失败事件
        qrcodeImg.addEventListener('error', function() {
            console.error('二维码图片加载失败');
            console.error('  尝试加载的路径:', this.src);
            console.error('  请检查文件是否存在:', 'images/qrcode.png');
            // 保持图片显示，不隐藏
        });

        // 检查当前状态
        console.log('二维码图片状态检查:');
        console.log('  图片ID:', qrcodeImg.id);
        console.log('  src属性:', qrcodeImg.src);
        console.log('  complete:', qrcodeImg.complete);
        console.log('  naturalWidth:', qrcodeImg.naturalWidth);
        console.log('  naturalHeight:', qrcodeImg.naturalHeight);

        // 如果已经完成加载但尺寸为0，说明加载失败
        if (qrcodeImg.complete && qrcodeImg.naturalHeight === 0) {
            console.warn('二维码图片可能加载失败 (complete但naturalHeight为0)');
        }
    } else {
        console.error('未找到二维码图片元素 (id="qrcode-img")');
    }

    // ===== 性能优化：图片懒加载占位符 =====
    // 如果未来添加图片，可以在这里实现懒加载
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.dataset.src;
                    if (dataSrc) {
                        img.src = dataSrc;
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// ===== 页面可见性API =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面已隐藏');
    } else {
        console.log('页面已恢复显示');
    }
});

// ===== 窗口大小调整优化 =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        console.log('窗口大小已调整:', window.innerWidth, 'x', window.innerHeight);
    }, 250);
});

// ===== 错误处理 =====
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.message);
});