
// devpanel.js - revised for reliability
(function() {
    // Floating button
    const devBtn = document.createElement('button');
    devBtn.id = 'devpanel-activate-btn';
    devBtn.innerHTML = '🛠';
    devBtn.title = 'Open Developer Panel';
    Object.assign(devBtn.style, {
        position: 'fixed', bottom: '24px', right: '24px', width: '44px', height: '44px', borderRadius: '50%',
        background: '#3461b8', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        zIndex: '9998', fontSize: '1.5em', cursor: 'pointer', display: 'block'
    });
    document.body.appendChild(devBtn);

    devBtn.addEventListener('click', () => {
        const ACCESS_CODE = '0816'; // Developer access code
        // Check local storage for access code
        const CODE_KEY = 'sleepcoinc-dev-access';
        if (localStorage.getItem(CODE_KEY) !== ACCESS_CODE) {
            const entered = prompt('Enter developer access code:');
            if (entered !== ACCESS_CODE) return;
            localStorage.setItem(CODE_KEY, ACCESS_CODE);
            alert('Correct! Opening developer panel.');
        }
        openPanel();
    });

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
            position: 'fixed', bottom: '24px', right: '80px', background: '#fff', border: '2px solid #4f8cff',
            borderRadius: '10px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: '18px 24px', zIndex: '9999',
            minWidth: '260px', fontFamily: 'Segoe UI, Arial, sans-serif'
        });
        panel.innerHTML = `
            <h3 style="margin-top:0; color:#3461b8;">Developer Panel</h3>
            <button id="refresh-btn" style="margin-bottom:12px;" class="button">Refresh Page</button><br>
            <button id="clear-cache-btn" style="margin-bottom:12px;" class="button">Clear Local Storage</button><br>
            <button id="toggle-dark-btn" class="button">Toggle Dark Mode</button>
            <button id="close-panel-btn" class="button">Close Panel</button>
            <hr>
            <div id="dev-info" style="font-size:0.95em; color:#222; margin-top:10px;"></div>
        `;
        document.body.appendChild(panel);
        devBtn.style.display = 'none';

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
        // Apply dark mode if set
        const darkPref = localStorage.getItem('sleepcoinc-darkmode');
        if (darkPref && JSON.parse(darkPref)) {
            document.body.classList.add('dark-mode');
            panel.classList.add('dark-mode');
        }
        // Info
        const info = document.getElementById('dev-info');
        info.innerHTML = `
            <strong>Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>User Agent:</strong> ${navigator.userAgent}<br>
            <strong>Location:</strong> ${window.location.href}
        `;
        // Dark mode styles
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
