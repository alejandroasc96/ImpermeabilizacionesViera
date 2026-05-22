        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');

            if (menu.classList.contains('max-h-0')) {
                menu.classList.remove('max-h-0');
                menu.classList.add('max-h-[400px]');

                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                menu.classList.remove('max-h-[400px]');
                menu.classList.add('max-h-0');

                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }

        // Variable global para controlar si el usuario expandió manualmente la sección en móvil
        let mobileExpanded = false;

        function filterGallery(category, isExpandingCall = false) {
            const items = document.querySelectorAll('.gallery-item');
            const buttons = document.querySelectorAll('.filter-btn');

            // 1. Gestionar estados visuales de los botones de filtrado
            buttons.forEach(btn => {
                if (btn.getAttribute('onclick').includes(category)) {
                    btn.classList.add('active', 'bg-blue-600', 'text-white');
                    btn.classList.remove('bg-white/5', 'text-slate-300');
                } else {
                    btn.classList.remove('active', 'bg-blue-600', 'text-white');
                    btn.classList.add('bg-white/5', 'text-slate-300');
                }
            });

            if (!isExpandingCall) {
                mobileExpanded = false;
                const btnText = document.getElementById('btn-text');
                const btnIcon = document.getElementById('btn-icon');
                if (btnText && btnIcon) {
                    btnText.innerText = "Ver más proyectos";
                    btnIcon.className = "fa-solid fa-chevron-down text-xs";
                }
            }

            let visibleCount = 0;
            const isMobile = window.innerWidth < 768;

            items.forEach(item => {
                const matchCondition = category === 'todos' || item.classList.contains(category);

                if (matchCondition) {
                    visibleCount++;

                    if (isMobile && visibleCount > 3 && !mobileExpanded) {
                        item.classList.add('hidden');
                    } else {
                        item.classList.remove('hidden');
                    }
                } else {
                    item.classList.add('hidden');
                }
                
                item.style.display = ''; 
            });

            const loadMoreContainer = document.getElementById('load-more-container');
            if (loadMoreContainer) {
                if (isMobile && visibleCount > 3) {
                    loadMoreContainer.classList.remove('hidden');

                    if (mobileExpanded) {
                        loadMoreContainer.classList.remove('bg-gradient-to-t', 'from-slate-900', 'via-slate-900/95');
                        loadMoreContainer.classList.add('absolute', 'bottom-[-70px]');
                        document.getElementById('proyectos').classList.add('pb-20');
                    } else {
                        loadMoreContainer.classList.add('bg-gradient-to-t', 'from-slate-900', 'via-slate-900/95');
                        loadMoreContainer.classList.remove('absolute', 'bottom-[-70px]');
                    }
                } else {
                    loadMoreContainer.classList.add('hidden');
                }
            }
        }

        function toggleMobileItems() {
            const btnText = document.getElementById('btn-text');
            const btnIcon = document.getElementById('btn-icon');

            mobileExpanded = !mobileExpanded;

            if (mobileExpanded) {
                if (btnText) btnText.innerText = "Ver menos";
                if (btnIcon) btnIcon.classList.add('rotate-180');
            } else {
                if (btnText) btnText.innerText = "Ver más";
                if (btnIcon) btnIcon.classList.remove('rotate-180');

                document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
            }

            const activeBtn = document.querySelector('.filter-btn.active');
            const currentCategory = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'todos';

            filterGallery(currentCategory, true);
        }

        document.addEventListener("DOMContentLoaded", () => {
            filterGallery('todos');
        });

        window.addEventListener('resize', () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            const currentCategory = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'todos';
            filterGallery(currentCategory);
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