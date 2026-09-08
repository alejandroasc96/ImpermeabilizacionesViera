        const aiToggle = document.getElementById('ai-toggle');
        const aiChat = document.getElementById('ai-chat-window');
        const aiClose = document.getElementById('ai-close');
        const aiMessages = document.getElementById('ai-messages');
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');

        aiToggle.onclick = () => aiChat.classList.toggle('hidden');
        aiClose.onclick = () => aiChat.classList.add('hidden');

        async function callGemini(prompt) {
            const systemPrompt = `
                Eres el Asistente Técnico Oficial de IMPERVIERA, expertos en impermeabilización en Gran Canaria desde hace más de 25 años.
                
                CONOCIMIENTO ESPECÍFICO DE LA EMPRESA:
                1. SERVICIOS: 
                    - PISCINAS: Especialistas en aplicación de resinas, gelcoat y topcoat de poliéster isoftálicas. Reparamos fugas y grietas.
                    - TECHOS: Cubiertas, azoteas, terrazas y naves industriales. Usamos fibra de vidrio mat emulsión con pinturas transitables.
                    - ALJIBES: Depósitos de agua potable. Usamos morteros cementosos certificados (Weber, Sika, Kerakoll).
                2. MATERIALES: Solo usamos marcas de primera calidad (Weber-Sika-Kerakoll).
                3. UBICACIÓN: Estamos en San Gregorio, Telde (Gran Canaria). Operamos en toda la isla.
                4. CONTACTO: Teléfono +34 650 841 541. Email: imperviera@gmail.com.
                5. GARANTÍA: Ofrecemos garantía de estanqueidad total en todos nuestros trabajos.
                
                REGLAS DE COMPORTAMIENTO:
                - Sé profesional, servicial y directo.
                - Si el cliente describe una humedad grave, insiste en que pida una visita técnica GRATUITA.
                - No inventes precios. Di que el presupuesto depende de los metros cuadrados y el estado de la superficie.
                - Si te preguntan algo fuera de la construcción o impermeabilización, reconduce la charla amablemente: "Como experto en impermeabilización, solo puedo ayudarte con temas de filtraciones y humedades".
                - Responde siempre en español.
            `;

            const apiKey = "AIzaSyBWUPXxYysYLsFnX2glP_OwCTuzOpN47Nw";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                return result.candidates[0].content.parts[0].text;
            } catch (error) {
                return "Lo siento, tengo problemas de conexión. Por favor, llámanos directamente al +34 650 841 541.";
            }
        }

        async function handleSend() {
            const text = aiInput.value.trim();
            if (!text) return;

            appendMessage(text, 'user');
            aiInput.value = '';

            const loadingId = 'loading-' + Date.now();
            appendMessage("Analizando...", 'bot', loadingId);

            const response = await callGemini(text);
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.innerHTML = `<p class="font-bold mb-1 text-blue-600">Imperviera Bot</p>${response}`;
        }

        function appendMessage(text, side, id = null) {
            const div = document.createElement('div');
            if (id) div.id = id;

            if (side === 'user') {
                div.className = 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none self-end ml-auto max-w-[85%] shadow-lg shadow-blue-100 font-medium';
                div.innerText = text;
            } else {
                div.className = 'bg-white p-4 rounded-2xl rounded-tl-none text-slate-700 shadow-sm border border-slate-100 max-w-[85%]';
                div.innerText = text;
            }

            aiMessages.appendChild(div);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }

        aiSend.onclick = handleSend;
        aiInput.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };