/* ============================================
   모바일 청첩장 JavaScript
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // 벚꽃잎 파티클
    // ============================================
    function initPetals() {
        var canvas = document.getElementById('petals');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        var PETAL_COUNT = 27;
        var petals = [];

        function createPetal() {
            return {
                x: Math.random() * canvas.width,
                y: -10 - Math.random() * canvas.height,
                size: 10 + Math.random() * 12,
                speedY: 0.3 + Math.random() * 0.6,
                speedX: -0.15 + Math.random() * 0.3,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: 0.008 + Math.random() * 0.02,
                flipAngle: Math.random() * Math.PI * 2,
                flipSpeed: 0.02 + Math.random() * 0.03,
                swingAmp: 30 + Math.random() * 50,
                swingSpeed: 0.008 + Math.random() * 0.015,
                swingOffset: Math.random() * Math.PI * 2,
                opacity: 0.5 + Math.random() * 0.35,
                tint: Math.floor(Math.random() * 3)
            };
        }

        for (var i = 0; i < PETAL_COUNT; i++) {
            var p = createPetal();
            p.y = Math.random() * canvas.height;
            petals.push(p);
        }

        var tints = [
            { base: [255, 182, 193], tip: [255, 220, 230], vein: [240, 150, 170] },
            { base: [255, 192, 203], tip: [255, 230, 238], vein: [245, 160, 180] },
            { base: [252, 165, 183], tip: [255, 210, 220], vein: [235, 140, 165] }
        ];

        function drawPetal(p) {
            ctx.save();
            var swingX = Math.sin(p.swingOffset) * p.swingAmp * 0.3;
            ctx.translate(p.x + swingX, p.y);
            ctx.rotate(p.angle);

            // 3D 뒤집힘: scaleX를 cos으로 변화시켜 앞뒤로 뒤집히는 느낌
            var flipScale = Math.cos(p.flipAngle);
            ctx.scale(flipScale, 1);
            ctx.globalAlpha = p.opacity;

            var s = p.size;
            var t = tints[p.tint];

            // 꽃잎 패스: 부드럽고 둥근 벚꽃잎 + 얕은 홈
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // 오른쪽 곡선 (둥글게)
            ctx.bezierCurveTo(s * 0.45, -s * 0.25, s * 0.5, -s * 0.6, s * 0.2, -s * 0.9);
            // 끝부분 얕고 둥근 홈
            ctx.quadraticCurveTo(s * 0.08, -s * 0.82, 0, -s * 0.85);
            ctx.quadraticCurveTo(-s * 0.08, -s * 0.82, -s * 0.2, -s * 0.9);
            // 왼쪽 곡선 (둥글게)
            ctx.bezierCurveTo(-s * 0.5, -s * 0.6, -s * 0.45, -s * 0.25, 0, 0);
            ctx.closePath();

            // 그라데이션: 꼭지(아래)에서 끝(위)으로 진한 → 연한
            var grad = ctx.createLinearGradient(0, 0, 0, -s);
            grad.addColorStop(0, 'rgb(' + t.base[0] + ',' + t.base[1] + ',' + t.base[2] + ')');
            grad.addColorStop(0.6, 'rgb(' + t.tip[0] + ',' + t.tip[1] + ',' + t.tip[2] + ')');
            grad.addColorStop(1, 'rgba(' + t.tip[0] + ',' + t.tip[1] + ',' + t.tip[2] + ',0.7)');
            ctx.fillStyle = grad;
            ctx.fill();

            // 잎맥 (중심 라인)
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.1);
            ctx.quadraticCurveTo(s * 0.02, -s * 0.55, 0, -s * 0.85);
            ctx.strokeStyle = 'rgba(' + t.vein[0] + ',' + t.vein[1] + ',' + t.vein[2] + ',0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.restore();
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < petals.length; i++) {
                var p = petals[i];
                p.y += p.speedY;
                p.x += p.speedX;
                p.angle += p.angleSpeed;
                p.flipAngle += p.flipSpeed;
                p.swingOffset += p.swingSpeed;

                if (p.y > canvas.height + 20) {
                    petals[i] = createPetal();
                    petals[i].y = -10 - Math.random() * 20;
                }

                drawPetal(p);
            }
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // D-day 카운트다운
    // ============================================
    function initCountdown() {
        var weddingDate = new Date(WEDDING_CONFIG.date + 'T' + WEDDING_CONFIG.time + ':00');

        function update() {
            var now = new Date();
            var diff = weddingDate - now;

            if (diff <= 0) {
                document.getElementById('countdown-days').textContent = '00';
                document.getElementById('countdown-hours').textContent = '00';
                document.getElementById('countdown-minutes').textContent = '00';
                document.getElementById('countdown-seconds').textContent = '00';
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            var daysEl = document.getElementById('countdown-days');
            var hoursEl = document.getElementById('countdown-hours');
            var minutesEl = document.getElementById('countdown-minutes');
            var secondsEl = document.getElementById('countdown-seconds');

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');

        }

        update();
        setInterval(update, 1000);
    }

    // ============================================
    // 달력 생성
    // ============================================
    function initCalendar() {
        var container = document.getElementById('calendarGrid');
        if (!container) return;

        var dateParts = WEDDING_CONFIG.date.split('-');
        var year = parseInt(dateParts[0]);
        var month = parseInt(dateParts[1]);
        var weddingDay = parseInt(dateParts[2]);

        var monthNames = ['1월', '2월', '3월', '4월', '5월', '6월',
                          '7월', '8월', '9월', '10월', '11월', '12월'];

        // 월 타이틀
        var titleEl = document.createElement('div');
        titleEl.className = 'calendar-month-title';
        titleEl.textContent = year + '년 ' + monthNames[month - 1];
        container.appendChild(titleEl);

        // 요일 헤더
        var headerEl = document.createElement('div');
        headerEl.className = 'calendar-header';
        var dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        for (var i = 0; i < 7; i++) {
            var span = document.createElement('span');
            span.textContent = dayNames[i];
            headerEl.appendChild(span);
        }
        container.appendChild(headerEl);

        // 달력 본문
        var bodyEl = document.createElement('div');
        bodyEl.className = 'calendar-body';

        var firstDay = new Date(year, month - 1, 1).getDay();
        var daysInMonth = new Date(year, month, 0).getDate();

        // 빈 칸
        for (var j = 0; j < firstDay; j++) {
            var emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            bodyEl.appendChild(emptyEl);
        }

        // 날짜
        for (var d = 1; d <= daysInMonth; d++) {
            var dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = d;

            var dayOfWeek = (firstDay + d - 1) % 7;
            if (dayOfWeek === 0) dayEl.classList.add('sunday');
            if (dayOfWeek === 6) dayEl.classList.add('saturday');
            if (year === 2026 && month === 5 && d === 25) dayEl.classList.add('sunday');
            if (d === weddingDay) dayEl.classList.add('wedding-day');

            bodyEl.appendChild(dayEl);
        }

        container.appendChild(bodyEl);
    }

    // ============================================
    // 갤러리 슬라이드쇼
    // ============================================
    function initGallery() {
        var slideshow = document.querySelector('.slideshow');
        if (!slideshow) return;

        var slides = slideshow.querySelectorAll('.slide');
        var dots = slideshow.querySelectorAll('.dot');
        var prevBtn = slideshow.querySelector('.slide-prev');
        var nextBtn = slideshow.querySelector('.slide-next');
        var currentIndex = 0;
        var autoTimer = null;
        var AUTO_INTERVAL = 4500;

        if (!slides.length) return;

        function goTo(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = index;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        function next() {
            goTo(currentIndex + 1);
        }

        function prev() {
            goTo(currentIndex - 1);
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, AUTO_INTERVAL);
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        function resetAuto() {
            stopAuto();
            startAuto();
        }

        // 좌우 버튼
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                prev();
                resetAuto();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                next();
                resetAuto();
            });
        }

        // 도트 클릭
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-index'), 10);
                goTo(idx);
                resetAuto();
            });
        });

        // 터치 스와이프
        var touchStartX = 0;
        var touchEndX = 0;
        slideshow.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        slideshow.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    next();
                } else {
                    prev();
                }
                resetAuto();
            }
        }, { passive: true });

        // 키보드 네비게이션
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
            if (e.key === 'ArrowRight') { next(); resetAuto(); }
        });

        // 자동 재생 시작
        startAuto();
    }

    // ============================================
    // 계좌번호 토글 & 복사
    // ============================================
    function initAccounts() {
        // 토글
        var toggleBtns = document.querySelectorAll('.account-toggle');
        toggleBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = this.getAttribute('data-target');
                var target = document.getElementById(targetId);
                var isOpen = target.style.display !== 'none';

                target.style.display = isOpen ? 'none' : 'block';
                this.classList.toggle('active', !isOpen);
            });
        });

        // 복사
        var copyBtns = document.querySelectorAll('.copy-btn');
        copyBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var account = this.getAttribute('data-account');
                copyToClipboard(account);
                var originalText = this.textContent;
                this.textContent = '완료';
                this.classList.add('copied');
                var self = this;
                setTimeout(function () {
                    self.textContent = originalText;
                    self.classList.remove('copied');
                }, 2000);
            });
        });
    }

    // ============================================
    // 클립보드 복사
    // ============================================
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showToast('계좌번호가 복사되었습니다');
            }).catch(function () {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('계좌번호가 복사되었습니다');
        } catch (e) {
            showToast('복사에 실패했습니다');
        }
        document.body.removeChild(textarea);
    }

    // ============================================
    // 토스트 메시지
    // ============================================
    function showToast(message) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // ============================================
    // 공유 기능
    // ============================================
    function initShare() {
        // 카카오톡 공유
        if (WEDDING_CONFIG.kakaoJsKey) {
            try {
                Kakao.init(WEDDING_CONFIG.kakaoJsKey);
            } catch (e) {
                // 이미 초기화된 경우
            }

            var kakaoBtn = document.getElementById('kakao-share-btn');
            if (kakaoBtn) {
                kakaoBtn.addEventListener('click', function () {
                    Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: WEDDING_CONFIG.groomName + ' ♥ ' + WEDDING_CONFIG.brideName + ' 결혼합니다',
                            description: WEDDING_CONFIG.venueName,
                            imageUrl: '',
                            link: {
                                mobileWebUrl: window.location.href,
                                webUrl: window.location.href
                            }
                        },
                        buttons: [{
                            title: '청첩장 보기',
                            link: {
                                mobileWebUrl: window.location.href,
                                webUrl: window.location.href
                            }
                        }]
                    });
                });
            }
        }

        // 링크 복사
        var linkBtn = document.getElementById('link-copy-btn');
        if (linkBtn) {
            linkBtn.addEventListener('click', function () {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(window.location.href).then(function () {
                        showToast('링크가 복사되었습니다');
                    });
                } else {
                    fallbackCopy(window.location.href);
                    showToast('링크가 복사되었습니다');
                }
            });
        }
    }

    // ============================================
    // 스크롤 애니메이션
    // ============================================
    function initScrollAnimation() {
        var elements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // IntersectionObserver 미지원 브라우저 대응
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    // ============================================
    // 자동 스크롤 + 화살표 유도
    // ============================================
    function initAutoScroll() {
        var greeting = document.getElementById('greeting');
        var indicator = document.getElementById('scrollIndicator');
        if (!greeting) return;

        var userScrolled = false;
        var autoScrollTimer = null;

        function onUserScroll() {
            if (window.scrollY > 10) {
                userScrolled = true;
                if (autoScrollTimer) {
                    clearTimeout(autoScrollTimer);
                    autoScrollTimer = null;
                }
                window.removeEventListener('scroll', onUserScroll);
            }
        }

        window.addEventListener('scroll', onUserScroll, { passive: true });

        // 화살표 클릭 시 바로 스크롤
        if (indicator) {
            indicator.addEventListener('click', function () {
                userScrolled = true;
                if (autoScrollTimer) {
                    clearTimeout(autoScrollTimer);
                    autoScrollTimer = null;
                }
                greeting.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // 4초 후 자동 스크롤
        autoScrollTimer = setTimeout(function () {
            if (!userScrolled) {
                greeting.scrollIntoView({ behavior: 'smooth' });
            }
        }, 4000);
    }

    // ============================================
    // 배경음악
    // ============================================
    function initMusic() {
        var toggleBtn = document.getElementById('music-toggle');
        var iconOn = toggleBtn ? toggleBtn.querySelector('.music-icon-on') : null;
        var iconOff = toggleBtn ? toggleBtn.querySelector('.music-icon-off') : null;
        var youtubeId = WEDDING_CONFIG.musicYoutubeId;
        var musicFile = WEDDING_CONFIG.musicFile;
        var isMuted = false;
        var ytPlayer = null;
        var audioEl = document.getElementById('bg-audio');

        if (!youtubeId && !musicFile) {
            // 음악 소스 없음 — 버튼 숨기고 종료
            return;
        }

        // 버튼 표시
        if (toggleBtn) toggleBtn.style.display = 'flex';

        function updateIcon() {
            if (!iconOn || !iconOff) return;
            if (isMuted) {
                iconOn.style.display = 'none';
                iconOff.style.display = 'inline';
                toggleBtn.classList.add('muted');
            } else {
                iconOn.style.display = 'inline';
                iconOff.style.display = 'none';
                toggleBtn.classList.remove('muted');
            }
        }

        // --- YouTube 재생 ---
        if (youtubeId) {
            var ytReady = false;
            var isPlaying = false;
            var userWantsPlay = true;

            function createPlayer() {
                var params = {
                    autoplay: 1,
                    loop: 1,
                    playlist: youtubeId,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1
                };
                // file:// 에서는 origin 생략
                if (window.location.protocol !== 'file:') {
                    params.origin = window.location.origin;
                }
                ytPlayer = new YT.Player('yt-player', {
                    height: '100',
                    width: '100',
                    videoId: youtubeId,
                    playerVars: params,
                    events: {
                        onReady: function (event) {
                            ytReady = true;
                            event.target.setVolume(50);
                            tryPlay();
                        },
                        onStateChange: function (event) {
                            if (event.data === 1) {
                                isPlaying = true;
                            } else if (event.data === 2 || event.data === 0) {
                                isPlaying = false;
                                // 일시정지(2)되면 재생 재시도, 종료(0)시에도
                                if (userWantsPlay && ytReady) {
                                    try { ytPlayer.playVideo(); } catch (e) {}
                                }
                            }
                        },
                        onError: function () {
                            if (toggleBtn) toggleBtn.style.display = 'none';
                        }
                    }
                });
            }

            function tryPlay() {
                if (!ytReady || !ytPlayer) return;
                try {
                    ytPlayer.playVideo();
                } catch (e) { /* ignore */ }
            }

            // 제스처 리스너를 즉시 등록 (onReady 전에 발생한 제스처도 캡처)
            addUserGestureListeners(function () {
                if (ytPlayer && ytReady) {
                    tryPlay();
                } else {
                    // 아직 준비 안됨 — onReady에서 자동 재생 시도
                    userWantsPlay = true;
                }
            });

            window.onYouTubeIframeAPIReady = function () {
                createPlayer();
            };

            // YouTube IFrame API가 이미 로드된 경우
            if (window.YT && window.YT.Player) {
                createPlayer();
            }

            if (toggleBtn) {
                toggleBtn.addEventListener('click', function () {
                    // 아직 재생 안 됐으면 재생 시도
                    if (ytPlayer && ytReady && !isPlaying) {
                        try { ytPlayer.playVideo(); } catch (e) {}
                    }
                    if (!ytPlayer || !ytReady) return;
                    isMuted = !isMuted;
                    if (isMuted) {
                        ytPlayer.mute();
                    } else {
                        ytPlayer.unMute();
                    }
                    updateIcon();
                });
            }

            return;
        }

        // --- 로컬 파일 재생 ---
        if (musicFile && audioEl) {
            audioEl.src = musicFile;
            audioEl.volume = 0.5;

            function tryAudioAutoplay() {
                var playPromise = audioEl.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function () {
                        // 자동재생 차단 — 사용자 제스처 대기
                        addUserGestureListeners(function () {
                            audioEl.play();
                        });
                    });
                }
            }

            tryAudioAutoplay();

            if (toggleBtn) {
                toggleBtn.addEventListener('click', function () {
                    isMuted = !isMuted;
                    audioEl.muted = isMuted;
                    updateIcon();
                });
            }
        }

        // --- 사용자 제스처로 재생 시작 ---
        function addUserGestureListeners(playFn) {
            var events = ['click', 'touchstart', 'scroll'];
            var triggered = false;

            function handler() {
                if (triggered) return;
                triggered = true;
                playFn();
                events.forEach(function (evt) {
                    document.removeEventListener(evt, handler, true);
                });
            }

            events.forEach(function (evt) {
                document.addEventListener(evt, handler, { capture: true, passive: true, once: false });
            });
        }
    }

    // ============================================
    // 엔드 크레딧
    // ============================================
    function initCredits() {
        var credits = document.getElementById('endCredits');
        if (!credits) return;

        var viewport = credits.querySelector('.credits-viewport');
        var roll = credits.querySelector('.credits-roll');
        var endEl = roll.querySelector('.credits-end');
        var finalEl = document.getElementById('creditsFinal');
        if (!viewport || !roll || !endEl) return;

        var speed = 0.8; // px per frame
        var offset = 0;
        var running = false;

        function getStopOffset() {
            var viewportH = viewport.offsetHeight;
            var endTop = endEl.offsetTop + endEl.offsetHeight / 2;
            return endTop - viewportH / 2;
        }

        function animate() {
            if (!running) return;
            var stopAt = getStopOffset();
            offset += speed;
            if (offset >= stopAt) {
                offset = stopAt;
                running = false;
                setTimeout(function () {
                    viewport.classList.add('fade-out');
                    if (finalEl) {
                        setTimeout(function () {
                            finalEl.classList.add('visible');
                        }, 1200);
                    }
                }, 1500);
            }
            roll.style.transform = 'translateY(' + (-offset) + 'px)';
            if (running) {
                requestAnimationFrame(animate);
            }
        }

        function start() {
            if (running) return;
            running = true;
            requestAnimationFrame(animate);
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        start();
                        observer.unobserve(credits);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(credits);
        } else {
            start();
        }
    }

    // ============================================
    // 라이트박스
    // ============================================
    function initLightbox() {
        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxCurrent = document.getElementById('lightbox-current');
        var lightboxTotal = document.getElementById('lightbox-total');
        var closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
        var prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
        var nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;
        var backdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;
        var gallery = WEDDING_CONFIG.gallery;
        var currentIdx = 0;

        if (!lightbox || !gallery || !gallery.length) return;

        lightboxTotal.textContent = gallery.length;

        function open(index) {
            currentIdx = index;
            lightboxImg.src = gallery[currentIdx].image;
            lightboxCurrent.textContent = currentIdx + 1;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function goTo(index) {
            if (index < 0) index = gallery.length - 1;
            if (index >= gallery.length) index = 0;
            currentIdx = index;
            lightboxImg.style.opacity = '0';
            setTimeout(function () {
                lightboxImg.src = gallery[currentIdx].image;
                lightboxCurrent.textContent = currentIdx + 1;
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        // 슬라이드 이미지 클릭 + 이미지 보호
        var slides = document.querySelectorAll('.slide img');
        slides.forEach(function (img, i) {
            img.addEventListener('click', function (e) {
                e.stopPropagation();
                open(i);
            });
            img.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            img.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        });

        // 닫기
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }
        if (backdrop) {
            backdrop.addEventListener('click', close);
        }

        // 이전/다음
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goTo(currentIdx - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goTo(currentIdx + 1);
            });
        }

        // 키보드
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') goTo(currentIdx - 1);
            if (e.key === 'ArrowRight') goTo(currentIdx + 1);
        });

        // 이미지 보호: 우클릭 방지
        lightbox.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

        // 이미지 보호: 드래그 방지
        lightboxImg.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });

        // 터치 스와이프 + 롱프레스 방지
        var touchStartX = 0;
        var longPressTimer = null;
        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            // 롱프레스(길게 눌러 저장) 방지
            longPressTimer = setTimeout(function () {
                longPressTimer = null;
            }, 500);
        }, { passive: false });
        lightbox.addEventListener('touchend', function (e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goTo(currentIdx + 1);
                } else {
                    goTo(currentIdx - 1);
                }
            }
        }, { passive: true });
    }

    // ============================================
    // 초기화
    // ============================================
    function initImageProtection() {
        var mainImg = document.querySelector('.main-photo img');
        if (mainImg) {
            mainImg.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            mainImg.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        }
    }

    function init() {
        initPetals();
        initAutoScroll();
        initCountdown();
        initCalendar();
        initGallery();
        initLightbox();
        initAccounts();
        initShare();
        initScrollAnimation();
        initCredits();
        initMusic();
        initImageProtection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
