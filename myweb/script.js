function initPage() {
    if (window.__jinzPageReady) return;
    window.__jinzPageReady = true;

    const body = document.body;
    const page = body.dataset.page || "home";
    const header = document.querySelector(".studio-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const toast = document.querySelector(".toast");
    const copyWechat = document.querySelector(".copy-wechat");
    const qrButton = document.querySelector(".qr-button");
    const qrDialog = document.querySelector(".qr-dialog");
    const dialogClose = document.querySelector(".dialog-close");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
            toast.classList.remove("visible");
        }, 2200);
    }

    function setHeaderState() {
        if (!header) return;
        const lightHero = document.querySelector(".spade-hero");
        const threshold = page === "home" && lightHero ? Math.max(24, lightHero.offsetHeight - 120) : 24;
        header.dataset.elevated = String(window.scrollY > threshold);
    }

    function closeNav() {
        body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
    }

    function getLocalAnchor(href) {
        if (!href || !href.includes("#")) return null;
        const url = new URL(href, window.location.href);
        const samePath = url.pathname === window.location.pathname;
        if (!samePath || !url.hash) return null;
        return document.querySelector(url.hash);
    }

    function markActiveNav() {
        navLinks.forEach((link) => {
            const navPage = link.dataset.navPage;
            if (!navPage) return;
            link.classList.toggle("active", navPage === page);
        });
    }

    function initReveal() {
        const revealTargets = Array.from(document.querySelectorAll(".reveal"));

        revealTargets.forEach((element) => {
            if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
                element.classList.add("is-visible");
            }
        });

        if (!("IntersectionObserver" in window)) {
            revealTargets.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        revealTargets.forEach((element) => revealObserver.observe(element));
    }

    function initSectionSpy() {
        if (page !== "home" || !("IntersectionObserver" in window)) return;
        const anchorLinks = navLinks.filter((link) => {
            try {
                return Boolean(getLocalAnchor(link.getAttribute("href")));
            } catch {
                return false;
            }
        });
        if (!anchorLinks.length) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!visible) return;

                anchorLinks.forEach((link) => {
                    const hash = new URL(link.href, window.location.href).hash;
                    link.classList.toggle("active", hash === `#${visible.target.id}`);
                });
            },
            { rootMargin: "-35% 0px -50% 0px", threshold: [0.08, 0.25, 0.5] }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    function initRepoFilters() {
        const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
        const repoCards = Array.from(document.querySelectorAll(".repo-card"));
        if (!filterButtons.length || !repoCards.length) return;

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";
                filterButtons.forEach((item) => item.classList.toggle("active", item === button));
                repoCards.forEach((card) => {
                    const visible = filter === "all" || card.dataset.category === filter;
                    card.hidden = !visible;
                    card.classList.toggle("filtered-out", !visible);
                });
                showToast(filter === "all" ? "已显示全部项目" : `已切换到 ${button.textContent.trim()}`);
            });
        });
    }

    function initPracticeTabs() {
        const tabButtons = Array.from(document.querySelectorAll(".lab-tab"));
        const panels = Array.from(document.querySelectorAll(".lab-panel"));
        const toastButtons = Array.from(document.querySelectorAll("[data-toast]"));

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const tab = button.dataset.tab;
                tabButtons.forEach((item) => {
                    const active = item === button;
                    item.classList.toggle("active", active);
                    item.setAttribute("aria-selected", String(active));
                });
                panels.forEach((panel) => {
                    const active = panel.dataset.panel === tab;
                    panel.classList.toggle("active", active);
                    panel.hidden = !active;
                });
            });
        });

        toastButtons.forEach((button) => {
            button.addEventListener("click", () => {
                showToast(button.dataset.toast || "交互已触发");
            });
        });
    }

    function initFadingVideos() {
        const videos = Array.from(document.querySelectorAll(".fading-video[data-fading-video]"));
        const FADE_MS = 500;
        const FADE_OUT_LEAD = 0.55;

        videos.forEach((video) => {
            let rafId = 0;
            let fadingOut = false;
            let restartTimer = 0;

            const getOpacity = () => {
                const value = Number.parseFloat(video.style.opacity || "0");
                return Number.isFinite(value) ? value : 0;
            };

            const fadeTo = (target, duration = FADE_MS) => {
                window.cancelAnimationFrame(rafId);
                const start = getOpacity();
                const startTime = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    video.style.opacity = String(start + (target - start) * eased);
                    if (progress < 1) {
                        rafId = window.requestAnimationFrame(tick);
                    }
                };

                rafId = window.requestAnimationFrame(tick);
            };

            const playVideo = async () => {
                try {
                    await video.play();
                } catch {
                    video.style.opacity = "1";
                }
            };

            const handleLoaded = () => {
                video.style.opacity = "0";
                playVideo();
                fadeTo(1);
            };

            const handleTimeUpdate = () => {
                const remaining = video.duration - video.currentTime;
                if (!fadingOut && Number.isFinite(remaining) && remaining > 0 && remaining <= FADE_OUT_LEAD) {
                    fadingOut = true;
                    fadeTo(0);
                }
            };

            const handleEnded = () => {
                window.clearTimeout(restartTimer);
                window.cancelAnimationFrame(rafId);
                video.style.opacity = "0";
                restartTimer = window.setTimeout(() => {
                    try {
                        video.currentTime = 0;
                    } catch {
                        return;
                    }
                    fadingOut = false;
                    playVideo();
                    fadeTo(1);
                }, 100);
            };

            video.loop = false;
            video.addEventListener("loadeddata", handleLoaded);
            video.addEventListener("timeupdate", handleTimeUpdate);
            video.addEventListener("ended", handleEnded);

            if (video.readyState >= 2) {
                handleLoaded();
            } else {
                video.load();
            }

            window.addEventListener("pagehide", () => {
                window.clearTimeout(restartTimer);
                window.cancelAnimationFrame(rafId);
            }, { once: true });
        });
    }

    function initStoryCards() {
        const cards = Array.from(document.querySelectorAll(".story-card"));
        if (!cards.length) return;

        const updateCards = () => {
            const viewportMid = window.innerHeight * 0.62;
            cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const distance = Math.abs(rect.top + rect.height * 0.35 - viewportMid);
                const range = Math.max(window.innerHeight * 0.6, 1);
                const progress = Math.max(0, Math.min(1, 1 - distance / range));
                card.style.setProperty("--story-progress", progress.toFixed(3));
            });
        };

        updateCards();
        window.addEventListener("scroll", updateCards, { passive: true });
        window.addEventListener("resize", updateCards);
    }

    function initTypewriter() {
        const title = document.querySelector("[data-typewriter]");
        const output = document.querySelector("[data-typewriter-output]");
        const cursor = document.querySelector(".type-cursor");
        if (!title || !output || prefersReducedMotion) {
            cursor?.classList.add("is-done");
            return;
        }

        const text = title.dataset.typewriter || "";
        let index = 0;
        output.textContent = "";

        window.setTimeout(() => {
            const timer = window.setInterval(() => {
                index += 1;
                output.textContent = text.slice(0, index);
                if (index >= text.length) {
                    window.clearInterval(timer);
                    cursor?.classList.add("is-done");
                }
            }, 38);
        }, 420);
    }

    function initServicePicker() {
        const buttons = Array.from(document.querySelectorAll(".service-pill"));
        const status = document.querySelector("[data-service-status]");
        if (!buttons.length || !status) return;

        const selected = new Set();

        const render = () => {
            const values = Array.from(selected);
            if (!values.length) {
                status.classList.remove("is-active");
                status.textContent = "Please click to select services above.";
                return;
            }

            status.classList.add("is-active");
            status.innerHTML = `<span>Ready to inquire about: ${values.join(", ")}</span><a href="#contact">Let's Go</a>`;
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const service = button.dataset.service || button.textContent.trim();
                if (selected.has(service)) {
                    selected.delete(service);
                } else {
                    selected.add(service);
                }
                button.classList.toggle("is-active", selected.has(service));
                button.setAttribute("aria-pressed", String(selected.has(service)));
                render();
            });
        });

        render();
    }

    function initScrubVideo() {
        const video = document.querySelector("[data-scrub-video]");
        if (!video) return;

        const panel = video.closest(".spade-video-panel");
        let rafId = 0;
        let targetTime = 0;
        let smoothTime = 0;
        let pendingSeek = false;
        let lastSeekAt = 0;
        let pointerX = 0.58;
        let pointerY = 0.34;
        let smoothX = pointerX;
        let smoothY = pointerY;

        const isDesktop = () => window.innerWidth >= 1024;

        const playMobile = async () => {
            if (isDesktop()) return;
            video.autoplay = true;
            try {
                await video.play();
            } catch {
                // Poster remains visible when autoplay is blocked.
            }
        };

        const handleMouseMove = (event) => {
            if (!isDesktop() || !video.duration || !Number.isFinite(video.duration)) return;
            pointerX = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
            pointerY = Math.max(0, Math.min(1, event.clientY / window.innerHeight));
            const lookRange = 0.62;
            const start = video.duration * 0.18;
            targetTime = start + pointerX * video.duration * lookRange;
            targetTime = Math.max(0, Math.min(video.duration - 0.08, targetTime));
        };

        const tick = (now) => {
            if (isDesktop() && video.duration && Number.isFinite(video.duration)) {
                smoothX += (pointerX - smoothX) * 0.08;
                smoothY += (pointerY - smoothY) * 0.08;
                smoothTime += (targetTime - smoothTime) * 0.12;

                panel?.style.setProperty("--look-x", `${(0.5 - smoothX) * 18}px`);
                panel?.style.setProperty("--look-y", `${(0.42 - smoothY) * 12}px`);
                panel?.style.setProperty("--look-glow-x", `${42 + smoothX * 38}%`);
                panel?.style.setProperty("--look-glow-y", `${18 + smoothY * 40}%`);

                if (!pendingSeek && now - lastSeekAt > 90 && Math.abs(video.currentTime - smoothTime) > 0.045) {
                    pendingSeek = true;
                    lastSeekAt = now;
                    try {
                        video.currentTime = smoothTime;
                    } catch {
                        pendingSeek = false;
                    }
                }
            }

            rafId = window.requestAnimationFrame(tick);
        };

        video.addEventListener("loadedmetadata", () => {
            targetTime = Math.min(video.duration || 0, (video.duration || 0) * 0.22);
            smoothTime = targetTime;
            if (isDesktop()) {
                video.currentTime = targetTime;
            } else {
                playMobile();
            }
        });

        video.addEventListener("seeked", () => {
            pendingSeek = false;
        });

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("resize", playMobile);
        window.addEventListener("pagehide", () => window.cancelAnimationFrame(rafId), { once: true });
        rafId = window.requestAnimationFrame(tick);
        playMobile();
    }

    navToggle?.addEventListener("click", () => {
        const isOpen = body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            let target = null;
            try {
                target = getLocalAnchor(href);
            } catch {
                target = null;
            }
            if (!target) {
                closeNav();
                return;
            }

            event.preventDefault();
            closeNav();
            target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
            history.replaceState(null, "", new URL(href, window.location.href).hash);
        });
    });

    copyWechat?.addEventListener("click", async () => {
        const value = copyWechat.dataset.copy || "Jinzy0416";
        try {
            await navigator.clipboard.writeText(value);
            showToast(`已复制微信号：${value}`);
        } catch {
            showToast(`微信号：${value}`);
        }
    });

    qrButton?.addEventListener("click", () => {
        if (typeof qrDialog?.showModal === "function") {
            qrDialog.showModal();
        } else {
            showToast("当前浏览器不支持弹窗预览，请直接长按或右键保存二维码。");
        }
    });

    dialogClose?.addEventListener("click", () => qrDialog?.close());
    qrDialog?.addEventListener("click", (event) => {
        if (event.target === qrDialog) qrDialog.close();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
            if (qrDialog?.open) qrDialog.close();
        }
    });

    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.closest(".qr-card")?.classList.add("asset-error");
            showToast(`图片加载失败：${image.getAttribute("src")}`);
        });
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    markActiveNav();
    setHeaderState();
    initReveal();
    initSectionSpy();
    initRepoFilters();
    initPracticeTabs();
    initStoryCards();
    initTypewriter();
    initServicePicker();
    initScrubVideo();
    initFadingVideos();
}

if (document.body) {
    initPage();
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage, { once: true });
} else {
    initPage();
}
