        const ITEMS_VISIBLE_DEFAULT = 3;
        let galleryExpanded = false;

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            const btn = document.getElementById('menu-btn');
            const isOpen = menu.classList.contains('max-h-[400px]');

            if (isOpen) {
                menu.classList.remove('max-h-[400px]');
                menu.classList.add('max-h-0');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-label', 'Abrir menú');
            } else {
                menu.classList.remove('max-h-0');
                menu.classList.add('max-h-[400px]');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('aria-label', 'Cerrar menú');
            }
        }

        function getActiveCategory() {
            const activeBtn = document.querySelector('.filter-btn.active');
            return activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'todos';
        }

        function filterGallery(category) {
            const items = document.querySelectorAll('.gallery-item');
            const buttons = document.querySelectorAll('.filter-btn');

            buttons.forEach(btn => {
                if (btn.getAttribute('onclick').includes(category)) {
                    btn.classList.add('active', 'bg-blue-600', 'text-white');
                    btn.classList.remove('bg-white/5', 'text-slate-300');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active', 'bg-blue-600', 'text-white');
                    btn.classList.add('bg-white/5', 'text-slate-300');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            let matchCount = 0;
            items.forEach(item => {
                const matchCondition = category === 'todos' || item.classList.contains(category);

                if (matchCondition) {
                    matchCount++;
                    if (!galleryExpanded && matchCount > ITEMS_VISIBLE_DEFAULT) {
                        item.classList.add('hidden');
                    } else {
                        item.classList.remove('hidden');
                    }
                } else {
                    item.classList.add('hidden');
                }
            });

            updateToggleBtn(matchCount);
        }

        function updateToggleBtn(totalVisible) {
            const btn = document.getElementById('btn-toggle-gallery');
            const btnText = document.getElementById('gallery-btn-text');
            const btnIcon = document.getElementById('gallery-btn-icon');

            if (!btn) return;

            if (totalVisible <= ITEMS_VISIBLE_DEFAULT) {
                btn.classList.add('hidden');
            } else {
                btn.classList.remove('hidden');
                if (galleryExpanded) {
                    btnText.innerText = 'Ver menos';
                    btnIcon.classList.add('rotate-180');
                } else {
                    btnText.innerText = 'Ver todas las fotos';
                    btnIcon.classList.remove('rotate-180');
                }
            }
        }

        function toggleGallery() {
            galleryExpanded = !galleryExpanded;
            filterGallery(getActiveCategory());

            if (!galleryExpanded) {
                document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            filterGallery('todos');
        });

        window.addEventListener('resize', () => {
            filterGallery(getActiveCategory());
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const notification = document.createElement('div');
                notification.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-2xl shadow-2xl z-[200] font-black tracking-widest text-xs flex items-center gap-4 animate-bounce';
                notification.innerHTML = '<i class="fa-solid fa-circle-check text-green-400 text-xl"></i> ¡SOLICITUD RECIBIDA CON ÉXITO!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 4000);
                this.reset();
            });
        }

        function openLightbox(element) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');

            const imgSrc = element.querySelector('img').src;
            const titleText = element.querySelector('h4').innerText;

            lightboxImg.src = imgSrc;
            lightboxCaption.innerText = titleText;

            lightbox.classList.remove('opacity-0', 'pointer-events-none');
            document.body.classList.add('overflow-hidden');
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');

            lightbox.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('overflow-hidden');
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeLightbox();
            }
        });
