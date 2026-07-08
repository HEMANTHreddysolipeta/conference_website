const eventDate = new Date("February 26, 2027 00:00:00").getTime();

setInterval(()=>{

const now = new Date().getTime();

const distance = eventDate-now;

const days=Math.floor(distance/(1000*60*60*24));

const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));

const minutes=Math.floor((distance%(1000*60*60))/(1000*60));

const seconds=Math.floor((distance%(1000*60))/1000);

document.getElementById("days").innerHTML=days;

document.getElementById("hours").innerHTML=hours;

document.getElementById("minutes").innerHTML=minutes;

document.getElementById("seconds").innerHTML=seconds;

},1000);

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