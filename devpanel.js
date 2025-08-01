

// devpanel.js - revised and cleaned up
(function() {
    // Floating dev panel button
    const devBtn = document.createElement('button');
    devBtn.id = 'devpanel-activate-btn';
    devBtn.innerHTML = '🛠';
    devBtn.title = 'Open Developer Panel';
    Object.assign(devBtn.style, {
        position: 'fixed', bottom: '24px', right: '24px', width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #4f8cff 60%, #3461b8 100%)', color: '#fff', border: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: '9998', fontSize: '1.7em', cursor: 'pointer', display: 'block',
        transition: 'background 0.2s, box-shadow 0.2s', outline: 'none'
    });
    devBtn.onmouseover = () => devBtn.style.boxShadow = '0 6px 24px rgba(79,140,255,0.25)';
    devBtn.onmouseout = () => devBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
    document.body.appendChild(devBtn);

    // Fetch codes.txt and cache
    let validCodes = null;
    async function getCodes() {
        if (validCodes) return validCodes;
        try {
            const res = await fetch('codes.txt');
            const text = await res.text();
            validCodes = text.split(/\r?\n/).map(c => c.trim()).filter(Boolean);
        } catch {
            validCodes = ['0816']; // fallback
        }
        return validCodes;
    }

    // Button click: prompt for code if needed, then open panel
    devBtn.addEventListener('click', async () => {
        const CODE_KEY = 'sleepcoinc-dev-access';
        let codes = await getCodes();
        let stored = localStorage.getItem(CODE_KEY);
        if (!codes.includes(stored)) {
            const entered = prompt('Enter developer access code:');
            if (!codes.includes(entered)) return;
            localStorage.setItem(CODE_KEY, entered);
            alert('Correct! Opening developer panel.');
        }
        openPanel();
    });

    // Open the dev panel
    function openPanel() {
        let panel = document.getElementById('dev-panel');
        if (panel) {
            panel.style.display = 'block';
            devBtn.style.display = 'none';
            return;
        }
        panel = document.createElement('div');
        panel.id = 'dev-panel';
        Object.assign(panel.style, {
            position: 'fixed', bottom: '32px', right: '88px', background: 'rgba(255,255,255,0.98)', border: 'none',
            borderRadius: '18px', boxShadow: '0 8px 32px rgba(79,140,255,0.18)', padding: '28px 32px 22px 32px', zIndex: '9999',
            minWidth: '290px', fontFamily: 'Segoe UI, Arial, sans-serif', transition: 'box-shadow 0.2s, background 0.2s',
            maxWidth: '96vw', maxHeight: '90vh', overflowY: 'auto'
        });
        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                <h3 style="margin:0;color:#3461b8;font-size:1.25em;letter-spacing:0.5px;">Developer Panel</h3>
                <button id="close-panel-btn" style="background:none;border:none;font-size:1.4em;line-height:1;color:#888;cursor:pointer;padding:0 0 2px 8px;">&times;</button>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:10px 8px;justify-content:center;margin-bottom:10px;">
                <button id="refresh-btn" class="button" style="min-width:120px;">Refresh</button>
                <button id="clear-cache-btn" class="button" style="min-width:120px;">Clear Storage</button>
                <button id="toggle-dark-btn" class="button" style="min-width:120px;">Dark Mode</button>
                <button id="goto-devpanel-btn" class="button" style="min-width:120px;">devpanel.html</button>
            </div>
            <hr style="margin:12px 0 10px 0;opacity:0.18;">
            <div id="dev-info" style="font-size:0.98em;color:#222;margin-top:6px;text-align:center;"></div>
        `;
        document.body.appendChild(panel);
        devBtn.style.display = 'none';

        // Panel button actions
        document.getElementById('close-panel-btn').onclick = () => {
            panel.style.display = 'none';
            devBtn.style.display = 'block';
        };
        document.getElementById('refresh-btn').onclick = () => location.reload();
        document.getElementById('clear-cache-btn').onclick = () => {
            localStorage.setItem('sleepcoinc-darkmode', JSON.stringify(false));
            localStorage.clear();
            alert('Local storage cleared!');
            location.reload();
        };
        document.getElementById('toggle-dark-btn').onclick = () => {
            const isDark = !document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode', isDark);
            panel.classList.toggle('dark-mode', isDark);
            localStorage.setItem('sleepcoinc-darkmode', JSON.stringify(isDark));
        };
        document.getElementById('goto-devpanel-btn').onclick = () => {
            window.open('devpanel.html', '_blank');
        };

        // Apply dark mode if set
        const darkPref = localStorage.getItem('sleepcoinc-darkmode');
        if (darkPref && JSON.parse(darkPref)) {
            document.body.classList.add('dark-mode');
            panel.classList.add('dark-mode');
        }

        // Dark mode styles (only add once)
        if (!document.getElementById('devpanel-darkmode-style')) {
            const style = document.createElement('style');
            style.id = 'devpanel-darkmode-style';
            style.innerHTML = `
                .dark-mode { background: #222 !important; color: #fff !important; }
                .dark-mode, .dark-mode * { color: #fff !important; }
                .dark-mode .button { background: #3461b8 !important; color: #fff !important; }
                .dark-mode .product-box, .dark-mode .product-box * { color: #222 !important; background: #fff !important; }
            `;
            document.head.appendChild(style);
        }
    }
})();
