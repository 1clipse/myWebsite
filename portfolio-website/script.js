// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有组件
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initProjectInteractions();
    initContactForm();
    initMobileMenu();
    initSmoothScroll();
    initScrollToTop();
    
    // 为项目卡片、技能类别等添加fade-in类
    const projectCards = document.querySelectorAll('.project-card');
    const skillCategories = document.querySelectorAll('.skill-category');
    const aboutParagraphs = document.querySelectorAll('.about-paragraph');
    const contactItems = document.querySelectorAll('.contact-item');

    projectCards.forEach(card => card.classList.add('fade-in'));
    skillCategories.forEach(category => category.classList.add('fade-in'));
    aboutParagraphs.forEach(para => para.classList.add('fade-in'));
    contactItems.forEach(item => item.classList.add('fade-in'));
});

// 回到顶部按钮
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 导航栏滚动效果
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 更新活动导航链接
        updateActiveNavLink(navLinks);
    });

    // 初始更新
    updateActiveNavLink(navLinks);
}

// 更新活动导航链接
function updateActiveNavLink(links) {
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(href);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // 移动端关闭菜单
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // 如果是技能条元素，触发技能条动画
                if (entry.target.classList.contains('skill-item')) {
                    const skillBar = entry.target.querySelector('.skill-progress');
                    const level = entry.target.getAttribute('data-level');
                    if (skillBar && level) {
                        setTimeout(() => {
                            skillBar.style.width = `${level}%`;
                            skillBar.classList.add('animated');
                        }, 300);
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// 技能条初始化
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.classList.add('fade-in');
    });
}

// 项目交互
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    const projectLinks = document.querySelectorAll('.project-link');

    // 卡片悬停效果
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });

    // 项目链接点击
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const viewType = this.getAttribute('data-view');
            const projectCard = this.closest('.project-card');
            const projectId = projectCard.getAttribute('data-project');

            if (viewType === 'preview') {
                showProjectPreview(projectId);
            } else if (viewType === 'details') {
                showProjectDetails(projectId);
            }
        });
    });
}

// 显示项目预览
function showProjectPreview(projectId) {
    const projects = {
        myweb: {
            title: 'MyWeb 个人主页',
            description: '响应式个人作品集网站，采用现代CSS技术与JavaScript交互效果。',
            tech: ['HTML5', 'CSS3', 'JavaScript', '响应式设计'],
            image: null, // 可以添加图片路径
            liveUrl: '#' // 可以添加在线预览链接
        },
        uniapp: {
            title: 'UniApp 多端应用',
            description: '基于Vue.js的跨平台小程序解决方案，实现一套代码多端运行。',
            tech: ['Vue.js', 'UniApp', '小程序', '跨平台'],
            image: null,
            liveUrl: '#'
        },
        attendance: {
            title: '智能考勤管理系统',
            description: '企业级员工考勤管理解决方案，支持人脸识别与报表生成。',
            tech: ['Java', 'Spring Boot', 'MySQL', '人脸识别'],
            image: null,
            liveUrl: '#'
        },
        dressing: {
            title: '虚拟试衣换装系统',
            description: '基于WebGL的3D虚拟试衣间，实现实时服装更换与体型适配。',
            tech: ['Three.js', 'WebGL', 'React', '3D建模'],
            image: null,
            liveUrl: '#'
        }
    };

    const project = projects[projectId];
    if (!project) return;

    // 创建预览模态框
    const modal = createModal('preview');
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${project.title} - 预览</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="preview-content">
                ${project.image ?
                    `<div class="preview-image">
                        <img src="${project.image}" alt="${project.title}">
                    </div>` :
                    `<div class="preview-placeholder">
                        <i class="fas fa-laptop-code"></i>
                        <p>项目预览</p>
                    </div>`
                }
                <div class="preview-info">
                    <h4>项目描述</h4>
                    <p>${project.description}</p>
                    <h4>技术栈</h4>
                    <div class="preview-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    ${project.liveUrl ?
                        `<a href="${project.liveUrl}" class="btn btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            在线预览
                        </a>` :
                        `<button class="btn btn-secondary" disabled>
                            <i class="fas fa-wrench"></i>
                            开发中
                        </button>`
                    }
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

// 显示项目详情
function showProjectDetails(projectId) {
    const projectDetails = {
        myweb: {
            title: 'MyWeb 个人主页',
            sections: [
                {
                    title: '项目概述',
                    content: '这是一个完全响应式的个人作品集网站，旨在展示个人技能、项目经验和技术专长。网站采用现代Web技术构建，注重用户体验和视觉设计。'
                },
                {
                    title: '技术实现',
                    content: '使用原生HTML5、CSS3和JavaScript开发，不依赖任何前端框架。实现了响应式布局、平滑滚动、动态导航和交互式元素。'
                },
                {
                    title: '功能特性',
                    content: '• 响应式设计，适配所有设备<br>• 平滑滚动与导航高亮<br>• 动态技能进度条<br>• 项目卡片交互效果<br>• 联系表单验证'
                }
            ]
        },
        uniapp: {
            title: 'UniApp 多端应用',
            sections: [
                {
                    title: '项目概述',
                    content: '基于Vue.js和UniApp框架开发的多端小程序应用，实现一套代码同时运行在微信小程序、支付宝小程序和H5平台。'
                },
                {
                    title: '技术架构',
                    content: '采用MVVM架构，使用Vue.js作为核心框架，UniApp提供跨平台能力。包含产品展示、案例分享、新闻动态和用户反馈等模块。'
                },
                {
                    title: '跨平台优势',
                    content: '• 一次开发，多端部署<br>• 统一的代码维护<br>• 原生体验的性能<br>• 丰富的插件生态'
                }
            ]
        },
        attendance: {
            title: '智能考勤管理系统',
            sections: [
                {
                    title: '项目概述',
                    content: '企业级员工考勤管理解决方案，集成了人脸识别技术，提供完整的考勤统计、报表生成和权限管理功能。'
                },
                {
                    title: '技术栈',
                    content: '后端采用Spring Boot框架，MySQL数据库，前端使用Vue.js。集成OpenCV进行人脸识别，支持多种考勤方式（刷脸、打卡、定位）。'
                },
                {
                    title: '核心功能',
                    content: '• 人脸识别考勤<br>• 考勤数据统计分析<br>• 多维度报表生成<br>• 多级权限管理<br>• 移动端支持'
                }
            ]
        },
        dressing: {
            title: '虚拟试衣换装系统',
            sections: [
                {
                    title: '项目概述',
                    content: '基于WebGL技术的3D虚拟试衣间，用户可以在线试穿不同款式的服装，实时查看穿着效果，支持材质调整和体型适配。'
                },
                {
                    title: '技术实现',
                    content: '使用Three.js构建3D场景，Blender进行服装建模，React作为前端框架。实现了实时渲染、物理模拟和用户交互。'
                },
                {
                    title: '创新特点',
                    content: '• 真实的3D试衣体验<br>• 实时服装更换与调整<br>• 个性化体型适配<br>• 材质与灯光效果<br>• 跨平台Web访问'
                }
            ]
        }
    };

    const details = projectDetails[projectId];
    if (!details) return;

    const modal = createModal('details');
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${details.title} - 项目详情</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="details-content">
                ${details.sections.map(section => `
                    <div class="detail-section">
                        <h4>${section.title}</h4>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showModal(modal);
}

// 创建模态框
function createModal(type) {
    const modal = document.createElement('div');
    modal.className = `modal modal-${type}`;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);

    return modalContent;
}

// 显示模态框
function showModal(modalContent) {
    const modal = modalContent.parentElement;
    document.body.appendChild(modal);

    // 添加关闭事件
    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => hideModal(modal));
    }

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            hideModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    });

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

// 隐藏模态框
function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        if (modal.parentElement) {
            modal.parentElement.removeChild(modal);
        }
    }, 300);
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // 简单验证
        if (!name || !email || !message) {
            showFormMessage('请填写所有必填字段', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('请输入有效的电子邮件地址', 'error');
            return;
        }

        // 模拟表单提交
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        submitBtn.disabled = true;

        // 模拟网络请求
        setTimeout(() => {
            // 这里可以替换为实际的API调用
            showFormMessage('消息发送成功！我会尽快回复您。', 'success');
            contactForm.reset();

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示表单消息
function showFormMessage(message, type) {
    // 移除现有消息
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const formMessage = document.createElement('div');
    formMessage.className = `form-message form-message-${type}`;
    formMessage.textContent = message;

    const contactForm = document.getElementById('contactForm');
    contactForm.appendChild(formMessage);

    // 5秒后自动消失
    setTimeout(() => {
        if (formMessage.parentElement) {
            formMessage.style.opacity = '0';
            formMessage.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (formMessage.parentElement) {
                    formMessage.parentElement.removeChild(formMessage);
                }
            }, 300);
        }
    }, 5000);
}

// 移动端菜单
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');

        // 切换aria-expanded属性
        const expanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', expanded);
    });

    // 点击菜单链接关闭菜单
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// 窗口调整大小时重新初始化
window.addEventListener('resize', function() {
    // 如果窗口变大且移动菜单打开，则关闭它
    if (window.innerWidth > 768) {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// 控制台欢迎信息
console.log('%c⚡ 欢迎来到金子溢的作品集！', 'color: #00f3ff; font-size: 18px; font-weight: bold;');
console.log('%c探索我的项目与技术实践', 'color: #b0b0b0; font-size: 14px;');</script>
