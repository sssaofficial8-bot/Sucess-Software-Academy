const isMobile = window.matchMedia('(max-width: 768px)').matches;

// 1. PRELOADER & TEXT ASSEMBLY
const initPreloader = () => {
    const canvas = document.getElementById('preloader-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width; const h = canvas.height;
    let particles = [];
    
    ctx.font = '800 80px "Bricolage Grotesque"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SSA', w/2, h/2);
    
    const data = ctx.getImageData(0, 0, w, h).data;
    ctx.clearRect(0, 0, w, h);
    
    for(let y = 0; y < h; y += 4) {
        for(let x = 0; x < w; x += 4) {
            if(data[(y*w+x)*4+3] > 128) {
                particles.push({
                    x: Math.random()*w, y: Math.random()*h,
                    tx: x, ty: y,
                    vx: 0, vy: 0
                });
            }
        }
    }
    
    let frame = 0;
    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#f0a500';
        particles.forEach(p => {
            p.x += (p.tx - p.x) * 0.1;
            p.y += (p.ty - p.y) * 0.1;
            ctx.fillRect(p.x, p.y, 2, 2);
        });
        frame++;
        if(frame < 120) requestAnimationFrame(draw);
    };
    draw();

    // Increment percentage counter
    const pctEl = document.querySelector('.pre-pct');
    let pct = 0;
    const pctInterval = setInterval(() => {
        pct += 2;
        if (pctEl) pctEl.innerText = pct + '%';
        if (pct >= 100) {
            clearInterval(pctInterval);
            if (pctEl) pctEl.innerText = '100%';
        }
    }, 40);
    
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('split');
        initHeroAnimations();
    }, 2500);
};

// 2. CURSOR TRAIL
const initCursor = () => {
    if(isMobile) return;
    const cursor = document.getElementById('cursorDot');
    if (!cursor) return;
    const dots = [];
    for(let i = 0; i < 20; i++) {
        let d = document.createElement('div');
        d.className = 'cursor-trail';
        document.body.appendChild(d);
        dots.push({el: d, x: 0, y: 0});
    }
    let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};
    
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        cursor.style.left = mouse.x + 'px';
        cursor.style.top = mouse.y + 'px';
    });
    
    document.querySelectorAll('a, button, .magnetic, .course-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.8)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });

    const animateDots = () => {
        let px = mouse.x, py = mouse.y;
        dots.forEach((dot, index) => {
            let nextDot = dots[index+1] || dots[0];
            dot.x = px; dot.y = py;
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
            dot.el.style.opacity = (1 - (index/20)) * 0.6;
            dot.el.style.transform = `translate(-50%, -50%) scale(${1 - index/20})`;
            px += (nextDot.x - dot.x) * 0.5;
            py += (nextDot.y - dot.y) * 0.5;
        });
        requestAnimationFrame(animateDots);
    }
    animateDots();
};

// 3. HERO CANVAS BACKGROUND
class ParticleEngine {
    constructor() {
        if(isMobile) return;
        this.bg = document.getElementById('hero-bg');
        this.fg = document.getElementById('hero-fg');
        if (!this.bg || !this.fg) return;
        this.ctxBg = this.bg.getContext('2d');
        this.ctxFg = this.fg.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.stars = Array(200).fill().map(() => ({
            x: Math.random()*this.w, y: Math.random()*this.h, s: Math.random()*2
        }));
        
        this.nodes = Array(120).fill().map(() => ({
            x: Math.random()*this.w, y: Math.random()*this.h,
            vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
            phase: Math.random()*Math.PI*2
        }));
        this.mouse = {x:-1000, y:-1000};
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX; this.mouse.y = e.clientY;
        });
        this.time = 0;
        this.animate();
    }
    resize() {
        this.w = this.bg.width = this.fg.width = window.innerWidth;
        this.h = this.bg.height = this.fg.height = window.innerHeight;
    }
    drawBg() {
        this.ctxBg.clearRect(0, 0, this.w, this.h);
        // Stars
        this.ctxBg.fillStyle = 'rgba(255,255,255,0.8)';
        this.stars.forEach(s => {
            s.y -= 0.2; if(s.y < 0) s.y = this.h;
            this.ctxBg.fillRect(s.x, s.y, s.s, s.s);
        });
        // Nebulas
        const rad1 = 400 + Math.sin(this.time*0.01)*50;
        const g1 = this.ctxBg.createRadialGradient(this.w*0.2, this.h*0.3, 0, this.w*0.2, this.h*0.3, rad1);
        g1.addColorStop(0, 'rgba(10, 15, 46, 0.8)'); g1.addColorStop(1, 'transparent');
        this.ctxBg.fillStyle = g1; this.ctxBg.fillRect(0, 0, this.w, this.h);
        
        const rad2 = 500 + Math.cos(this.time*0.01)*50;
        const g2 = this.ctxBg.createRadialGradient(this.w*0.8, this.h*0.7, 0, this.w*0.8, this.h*0.7, rad2);
        g2.addColorStop(0, 'rgba(240, 165, 0, 0.05)'); g2.addColorStop(1, 'transparent');
        this.ctxBg.fillStyle = g2; this.ctxBg.fillRect(0, 0, this.w, this.h);
    }
    drawFg() {
        this.ctxFg.clearRect(0, 0, this.w, this.h);
        this.ctxFg.fillStyle = '#f0a500';
        this.ctxFg.strokeStyle = 'rgba(240,165,0,0.15)';
        
        this.nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy; n.phase += 0.02;
            if(n.x<0||n.x>this.w) n.vx*=-1; if(n.y<0||n.y>this.h) n.vy*=-1;
            
            let dx = this.mouse.x - n.x, dy = this.mouse.y - n.y;
            let dist = Math.sqrt(dx*dx+dy*dy);
            if(dist < 100) { n.x -= dx*0.02; n.y -= dy*0.02; }
            
            let r = 1.5 + Math.sin(n.phase);
            this.ctxFg.beginPath(); this.ctxFg.arc(n.x, n.y, Math.max(0.1, r), 0, Math.PI*2); this.ctxFg.fill();
        });
        
        for(let i = 0; i < this.nodes.length; i++) {
            for(let j = i + 1; j < this.nodes.length; j++) {
                let dx = this.nodes[i].x - this.nodes[j].x, dy = this.nodes[i].y - this.nodes[j].y;
                let dist = Math.sqrt(dx*dx+dy*dy);
                if(dist < 140) {
                    this.ctxFg.globalAlpha = 1 - (dist/140);
                    this.ctxFg.beginPath();
                    this.ctxFg.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctxFg.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctxFg.stroke();
                }
            }
        }
        this.ctxFg.globalAlpha = 1;
    }
    animate() {
        this.time++;
        this.drawBg(); this.drawFg();
        requestAnimationFrame(() => this.animate());
    }
}

// 4. HERO TEXT ANIMATIONS
const initHeroAnimations = () => {
    setTimeout(() => {
        const badge = document.getElementById('hero-badge');
        if (badge) {
            badge.style.transition = 'all 0.8s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
        }
    }, 500);

    // Title Split
    setTimeout(() => {
        const title = document.getElementById('heroTitle');
        if (!title) return;
        const text = title.innerText;
        title.innerHTML = '';
        let delay = 0;
        text.split(', ').forEach((part, i) => {
            const span = document.createElement('span');
            span.className = 'line';
            part.split('').forEach(char => {
                const c = document.createElement('span');
                c.className = 'ch';
                c.innerText = char === ' ' ? '\u00A0' : char;
                c.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s, filter 0.8s';
                c.style.transitionDelay = `${delay}ms`;
                span.appendChild(c);
                delay += 40;
            });
            if(i==0) {
                const comma = document.createElement('span');
                comma.className = 'ch'; comma.innerText = ',';
                comma.style.transition = `all 0.8s ${delay}ms`;
                span.appendChild(comma); delay+=40;
            }
            title.appendChild(span);
        });
        
        setTimeout(() => {
            document.querySelectorAll('.hero h1 .ch').forEach(c => {
                c.classList.add('show');
            });
        }, 50);
    }, 800);

    // Typewriter
    setTimeout(() => {
        const sub = document.getElementById('tw');
        if (!sub) return;
        const text = "Professional IT Training for Real-World Careers";
        let i = 0;
        sub.innerHTML = '';
        const type = setInterval(() => {
            sub.innerHTML = text.substring(0, i);
            i++;
            if(i > text.length) clearInterval(type);
        }, 40);
    }, 1500);

    // Actions
    setTimeout(() => {
        const actions = document.getElementById('hero-actions');
        if (actions) {
            actions.style.transition = 'all 0.8s ease';
            actions.style.opacity = '1';
            actions.style.transform = 'translateY(0)';
        }
    }, 2000);
};

// 5. SCROLL REVEAL & NAV TRACKER
const initScrollObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                e.target.classList.add('in');
                
                // Stats Counter
                if(e.target.id === 'stats-trigger') {
                    document.querySelectorAll('.stat-num').forEach(c => {
                        const target = parseFloat(c.getAttribute('data-target'));
                        const decimals = c.getAttribute('data-decimal') ? 1 : 0;
                        const suffix = c.getAttribute('data-suffix') || '';
                        let val = 0;
                        const inc = target / 60;
                        const update = () => {
                            val += inc;
                            if(val >= target) {
                                c.innerText = target.toFixed(decimals) + suffix;
                            } else {
                                c.innerText = val.toFixed(decimals) + suffix;
                                requestAnimationFrame(update);
                            }
                        };
                        update();
                    });
                    
                    // Activate stat rings
                    document.querySelectorAll('.stat-ring').forEach(ring => {
                        ring.classList.add('go');
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    const statsTrig = document.getElementById('stats-trigger');
    if (statsTrig) observer.observe(statsTrig);
    
    // About reveal-clip paragraph
    const pObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                e.target.classList.add('in');
                pObs.unobserve(e.target);
            }
        });
    }, {threshold: 0.2});
    document.querySelectorAll('.reveal-clip').forEach((p, i) => {
        p.style.transitionDelay = `${i*200}ms`;
        pObs.observe(p);
    });

    // Nav tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if(window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if(l.getAttribute('href') === `#${current}`) l.classList.add('active');
        });
        
        // Navbar style on scroll
        const nav = document.getElementById('nav');
        if (nav) {
            if(window.scrollY > 80) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });
};

// 6. MAGNETIC BUTTONS & TILT CARDS
const initInteractions = () => {
    if(isMobile) return;
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            btn.style.transform = `translate(${x*0.3}px, ${y*0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            card.style.transform = `perspective(1000px) rotateX(${-y*0.05}deg) rotateY(${x*0.05}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });
    
    const hero = document.getElementById('heroContent');
    const heroSection = document.getElementById('home');
    if (hero && heroSection) {
        heroSection.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 16;
            const y = (e.clientY / window.innerHeight - 0.5) * -16;
            hero.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            hero.style.transform = `rotateY(0) rotateX(0)`;
        });
    }
};

// 7. REVIEWS SLIDER
const initReviewsSlider = () => {
    const wrap = document.getElementById('testiWrap');
    if (!wrap) return;
    const slides = wrap.querySelectorAll('.testi');
    const dotsContainer = document.getElementById('testiDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];
    const prevBtn = document.getElementById('prevT');
    const nextBtn = document.getElementById('nextT');
    
    let curSlide = 1;
    
    const updateSlides = () => {
        slides.forEach((s, i) => {
            s.classList.remove('active');
            if(i === curSlide) s.classList.add('active');
        });
        dots.forEach((d, i) => {
            d.classList.remove('active');
            if(i === curSlide) d.classList.add('active');
        });
    };
    
    const nextSlide = () => {
        curSlide = (curSlide + 1) % slides.length;
        updateSlides();
    };
    
    const prevSlide = () => {
        curSlide = (curSlide - 1 + slides.length) % slides.length;
        updateSlides();
    };
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((d, i) => {
        d.addEventListener('click', () => {
            curSlide = i;
            updateSlides();
        });
    });
    
    let auto = setInterval(nextSlide, 5000);
    wrap.addEventListener('mouseenter', () => clearInterval(auto));
    wrap.addEventListener('mouseleave', () => auto = setInterval(nextSlide, 5000));
};

// 8. COURSE CLICK SELECTOR Helper
const initCourseSelector = () => {
    document.querySelectorAll('.course-card').forEach(card => {
        const enrollBtn = card.querySelector('.course-enroll');
        const courseNameEl = card.querySelector('.course-name');
        if (enrollBtn && courseNameEl) {
            const name = courseNameEl.innerText.trim();
            enrollBtn.addEventListener('click', (e) => {
                const select = document.getElementById('cCourse');
                if (select) {
                    select.value = name;
                    select.classList.add('has-value');
                }
            });
        }
    });
};

// 9. MOBILE MENU
const initMobileMenu = () => {
    const burger = document.getElementById('burger');
    const links = document.getElementById('navLinks');
    if (!burger || !links) return;
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(l => {
        l.addEventListener('click', () => {
            burger.classList.remove('open');
            links.classList.remove('open');
        });
    });
};

// 10. FORM SUBMISSION API BINDING
const initFormSubmission = () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.classList.add('loading');
            
            const payload = {
                name: document.getElementById('cName').value,
                phone: document.getElementById('cPhone').value,
                course: document.getElementById('cCourse').value,
                message: document.getElementById('cMsg').value
            };
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                submitBtn.classList.remove('loading');
                if (response.ok) {
                    submitBtn.innerHTML = '';
                    submitBtn.classList.add('success');
                    contactForm.reset();
                    document.getElementById('cCourse').classList.remove('has-value');
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.classList.remove('success');
                    }, 3000);
                } else {
                    submitBtn.innerHTML = 'Error! Try Again';
                    setTimeout(() => submitBtn.innerHTML = originalText, 3000);
                }
            } catch (err) {
                console.error(err);
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = 'Connection Failed';
                setTimeout(() => submitBtn.innerHTML = originalText, 3000);
            }
        });
    }
};

// BOOT
window.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    new ParticleEngine();
    initScrollObserver();
    initInteractions();
    initReviewsSlider();
    initCourseSelector();
    initMobileMenu();
    initFormSubmission();
});
