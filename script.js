const eventDate = new Date("February 26, 2027 00:00:00").getTime();

function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!(daysEl && hoursEl && minutesEl && secondsEl)) {
        return;
    }

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerHTML = days;
        hoursEl.innerHTML = hours;
        minutesEl.innerHTML = minutes;
        secondsEl.innerHTML = seconds;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initCommitteeAccordion() {
    const committeeCards = document.querySelectorAll(".committee-accordion");
    if (!committeeCards.length) return;

    committeeCards.forEach(card => {
        const header = card.querySelector(".committee-header");
        if (!header) return;

        header.addEventListener("click", () => {
            committeeCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove("active");
                }
            });
            card.classList.toggle("active");
        });
    });
}

function initExploreCarousel() {
    const track = document.querySelector(".ribbon-track");
    const slides = [...document.querySelectorAll(".ribbon-card")];
    const pins = [
        document.querySelector(".pin.charminar"),
        document.querySelector(".pin.golconda"),
        document.querySelector(".pin.salarjung"),
        document.querySelector(".pin.chowmahalla"),
        document.querySelector(".pin.tankbund"),
        document.querySelector(".pin.ramoji")
    ];
    const prevBtn = document.querySelector(".carousel-nav.left");
    const nextBtn = document.querySelector(".carousel-nav.right");

    if (!track || !slides.length || !prevBtn || !nextBtn || pins.some(pin => !pin)) {
        return;
    }

    let currentSlide = 0;

    const showSlide = index => {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        pins.forEach(pin => pin.classList.remove("active"));
        pins[currentSlide].classList.add("active");
    };

    nextBtn.addEventListener("click", () => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    });

    prevBtn.addEventListener("click", () => {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    });

    setInterval(() => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 5000);

    showSlide(0);
    slides[0].classList.add("active");
}

function initAdvisoryAccordion() {
    document.querySelectorAll(".advisory-card").forEach(card => {
        const header = card.querySelector(".advisory-header");
        if (header) {
            header.onclick = () => {
                card.classList.toggle("active");
            };
        }
    });
}

initCountdown();
initCommitteeAccordion();
initExploreCarousel();
initAdvisoryAccordion();

/* In-place expand/collapse for About cards */
(function(){
	function init(){
		document.addEventListener('click', e =>{
			const btn = e.target.closest && e.target.closest('.read-more');
			if(!btn) return;
			e.preventDefault();
			const card = btn.closest('.about-card');
			if(!card) return;
			const isOpen = card.classList.contains('is-open');
			if(isOpen){
				// close overlay or inline
				closeCardOverlay(card, btn);
			} else {
				// open overlay: create placeholder and position overlay
				openCardOverlay(card, btn);
			}
		});

		// Escape closes any open card
		document.addEventListener('keydown', e=>{
			if(e.key === 'Escape'){
				document.querySelectorAll('.about-card.is-open-overlay').forEach(card=>{
					const btn = card.querySelector('.read-more');
					closeCardOverlay(card, btn);
				});
			}
		});
	}

	if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();

// -- helper functions for overlay behavior
function openCardOverlay(card, btn){
	const grid = card.closest('.about-grid');
	if(!grid) return;
	// create placeholder to preserve layout
	const placeholder = document.createElement('div');
	placeholder.className = 'card-placeholder fill';
	// set placeholder height to card's current height
	const rect = card.getBoundingClientRect();
	placeholder.style.height = rect.height + 'px';
	// insert placeholder where card was
	card.parentNode.insertBefore(placeholder, card);
	// mark siblings behind
	document.querySelectorAll('.about-card').forEach(c=>{ if(c!==card) c.classList.add('behind'); });
	// mark open states
	card.classList.add('is-open');
	card.classList.add('is-open-overlay');
	card.setAttribute('aria-expanded','true');
	btn.textContent = 'Read Less ←';
	document.body.style.overflow = 'hidden';
	// move card to be last child of grid to ensure overlay sits on top
	grid.appendChild(card);
	// small delay to allow CSS to apply
	requestAnimationFrame(()=>{
		card.style.top = '0px';
		card.style.left = '0px';
	});
	// scroll into view
	try{ card.scrollIntoView({behavior:'smooth', block:'center'}); }catch(e){}
}

function closeCardOverlay(card, btn){
	// find placeholder (previous sibling or any .card-placeholder)
	const placeholder = document.querySelector('.card-placeholder.fill');
	if(placeholder){
		// move card back before placeholder
		placeholder.parentNode.insertBefore(card, placeholder);
		// remove placeholder
		placeholder.parentNode.removeChild(placeholder);
	}
	card.classList.remove('is-open');
	card.classList.remove('is-open-overlay');
	card.setAttribute('aria-expanded','false');
	if(btn) btn.textContent = 'Read More →';
	document.body.style.overflow = '';
	document.querySelectorAll('.about-card.behind').forEach(c=> c.classList.remove('behind'));
	// clear any inline positioning
	try{ card.style.top=''; card.style.left=''; card.style.width=''; card.style.height=''; }catch(e){}
}

/* ===========================================
   Committee Cards
=========================================== */

const committeeCards = document.querySelectorAll(".committee-accordion");

function initializeNavbar() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const isOpen = navLinks.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    document.querySelectorAll(".dropdown").forEach((dropdown) => {
        let timer;

        dropdown.addEventListener("mouseenter", () => {
            clearTimeout(timer);
            dropdown.classList.add("open");
        });

        dropdown.addEventListener("mouseleave", () => {
            timer = setTimeout(() => {
                dropdown.classList.remove("open");
            }, 250);
        });

        dropdown.addEventListener("click", (event) => {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                dropdown.classList.toggle("open");
            }
        });
    });
}

const navbarHost = document.getElementById("navbar");

if (navbarHost) {
    fetch("navbar.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load navbar");
            return response.text();
        })
        .then((html) => {
            navbarHost.innerHTML = html;
            initializeNavbar();
        })
        .catch((error) => {
            console.error("Navbar load failed:", error);
        });
} else {
    initializeNavbar();
}
