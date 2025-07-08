document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    }

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        }
    });

    // --- FOOTER YEAR ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- GOOGLE CONNECT (MOCK) ---
    const connectGoogleBtn = document.getElementById('connect-google-btn');
    const accountInfo = document.getElementById('account-info');
    
    connectGoogleBtn.addEventListener('click', () => {
        connectGoogleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        connectGoogleBtn.disabled = true;
        
        setTimeout(() => {
            connectGoogleBtn.style.display = 'none';
            accountInfo.classList.remove('hidden');
        }, 1500);
    });

    // --- CUSTOMIZATION & PREVIEW ---
    const bannerStyle = document.getElementById('banner-style');
    const bannerPosition = document.getElementById('banner-position');
    const bannerColor = document.getElementById('banner-color');
    const preview = document.getElementById('cookie-consent-preview');
    const acceptBtnPreview = document.getElementById('accept-btn-preview');

    // --- LIVE WEBSITE PREVIEW ---
    const websiteUrl = document.getElementById('website-url');
    const loadWebsiteBtn = document.getElementById('load-website-btn');
    const demoPreviewBtn = document.getElementById('demo-preview-btn');
    const websiteIframe = document.getElementById('website-iframe');
    const demoPreview = document.getElementById('demo-preview');
    const previewError = document.getElementById('preview-error');
    const previewModeIndicator = document.getElementById('preview-mode-indicator');

    let isLivePreview = false;

    loadWebsiteBtn.addEventListener('click', () => {
        const url = websiteUrl.value.trim();
        if (!url) return;

        // Add protocol if missing
        const fullUrl = url.startsWith('http') ? url : 'https://' + url;
        
        loadWebsiteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadWebsiteBtn.disabled = true;

        // Hide other elements
        demoPreview.style.display = 'none';
        previewError.style.display = 'none';
        
        // Try to load the website
        websiteIframe.src = fullUrl;
        websiteIframe.style.display = 'block';
        
        // Update indicator
        previewModeIndicator.innerHTML = '<i class="fas fa-globe"></i><span>Live Preview</span>';
        isLivePreview = true;

        // Handle load events
        const handleLoad = () => {
            loadWebsiteBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Load Site';
            loadWebsiteBtn.disabled = false;
        };

        const handleError = () => {
            websiteIframe.style.display = 'none';
            previewError.style.display = 'block';
            previewModeIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Error</span>';
            loadWebsiteBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Load Site';
            loadWebsiteBtn.disabled = false;
            isLivePreview = false;
        };

        // Set up event listeners
        websiteIframe.onload = handleLoad;
        websiteIframe.onerror = handleError;
        
        // Fallback timeout for sites that block iframes
        setTimeout(() => {
            if (loadWebsiteBtn.disabled) {
                handleError();
            }
        }, 10000);
    });

    demoPreviewBtn.addEventListener('click', () => {
        // Switch back to demo mode
        websiteIframe.style.display = 'none';
        previewError.style.display = 'none';
        demoPreview.style.display = 'block';
        previewModeIndicator.innerHTML = '<i class="fas fa-desktop"></i><span>Demo Preview</span>';
        isLivePreview = false;
    });

    // Handle enter key in URL input
    websiteUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadWebsiteBtn.click();
        }
    });

    function updatePreview() {
        // Reset classes
        preview.className = 'cookie-preview';
        preview.classList.add(`style-${bannerStyle.value}`);

        // Position
        if (bannerStyle.value === 'header') {
            preview.classList.add('pos-top-left');
        } else if (bannerStyle.value === 'footer') {
            preview.classList.add('pos-bottom-left');
        } else {
            preview.classList.add(`pos-${bannerPosition.value}`);
        }

        // Disable position for header/footer
        bannerPosition.disabled = (bannerStyle.value === 'header' || bannerStyle.value === 'footer');

        // Color
        preview.style.backgroundColor = bannerColor.value;
        acceptBtnPreview.style.backgroundColor = lightenDarkenColor(bannerColor.value, 40);

        generateCode();
    }

    bannerStyle.addEventListener('change', updatePreview);
    bannerPosition.addEventListener('change', updatePreview);
    bannerColor.addEventListener('input', updatePreview);

    // --- CODE GENERATION ---
    const codeOutput = document.getElementById('generated-code-output');
    const copyCodeBtn = document.getElementById('copy-code-btn');

    function generateCode() {
        const style = bannerStyle.value;
        const position = bannerPosition.value;
        const color = bannerColor.value;
        const acceptColor = lightenDarkenColor(color, 40);

        const css = `#cookie-hero-banner{position:fixed;z-index:9999;background-color:${color};color:#ffffff;padding:15px;font-family:sans-serif;font-size:14px;box-shadow:0 -2px 10px rgba(0,0,0,0.2);transition:transform 0.5s ease;transform:translateY(200%)}#cookie-hero-banner.show{transform:translateY(0)}#cookie-hero-banner a{color:#ffffff;text-decoration:underline}.cookie-hero-buttons{margin-top:10px}.cookie-hero-btn{border:none;padding:8px 12px;border-radius:4px;cursor:pointer;margin-right:10px}#cookie-hero-accept{background-color:${acceptColor};color:#ffffff}#cookie-hero-decline{background-color:#f1f1f1;color:#333}${getStyleCss(style, position)}`;

        const html = `<div id="cookie-hero-banner"><p>We use cookies to enhance your experience. By continuing to visit this site you agree to our <a href="/privacy-policy">use of cookies</a>.</p><div class="cookie-hero-buttons"><button class="cookie-hero-btn" id="cookie-hero-accept">Accept</button><button class="cookie-hero-btn" id="cookie-hero-decline">Decline</button></div></div>`;

        const js = `<script>document.addEventListener('DOMContentLoaded',function(){const banner=document.getElementById('cookie-hero-banner');const acceptBtn=document.getElementById('cookie-hero-accept');const declineBtn=document.getElementById('cookie-hero-decline');const cookieName='cookie_hero_consent';if(!getCookie(cookieName)){setTimeout(()=>{banner.classList.add('show');},500);}acceptBtn.addEventListener('click',function(){setCookie(cookieName,'accepted',365);banner.classList.remove('show');});declineBtn.addEventListener('click',function(){setCookie(cookieName,'declined',7);banner.classList.remove('show');});function setCookie(name,value,days){let expires="";if(days){const date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toUTCString();}document.cookie=name+"="+(value||"")+expires+"; path=/";}function getCookie(name){const nameEQ=name+"=";const ca=document.cookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}return null;}});<\/script>`;

        const fullCode = `<style>${css}</style>${html}${js}`;
        codeOutput.textContent = fullCode;
    }

    function getStyleCss(style, position) {
        let positionCss = "";
        switch (position) {
            case "bottom-left":
                positionCss = "bottom:20px;left:20px;";
                break;
            case "top-right":
                positionCss = "top:20px;right:20px;transform:translateY(-200%);";
                break;
            case "top-left":
                positionCss = "top:20px;left:20px;transform:translateY(-200%);";
                break;
            case "center":
                positionCss = "top:50%;left:50%;transform:translate(-50%,-50%) scale(0.8);opacity:0;";
                break;
            default:
                positionCss = "bottom:20px;right:20px;";
                break;
        }

        if (position === "center") {
            positionCss += "#cookie-hero-banner.show{transform:translate(-50%,-50%) scale(1);opacity:1;}";
        }

        switch (style) {
            case "header":
                return `#cookie-hero-banner{top:0;left:0;right:0;border-radius:0;display:flex;align-items:center;justify-content:space-between;transform:translateY(-200%)}#cookie-hero-banner p{margin:0}.cookie-hero-buttons{margin:0 0 0 20px}`;
            case "footer":
                return `#cookie-hero-banner{bottom:0;left:0;right:0;border-radius:0;display:flex;align-items:center;justify-content:space-between}#cookie-hero-banner p{margin:0}.cookie-hero-buttons{margin:0 0 0 20px}`;
            case "bubble":
                return `#cookie-hero-banner{${positionCss}width:60px;height:60px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer}#cookie-hero-banner::before{content:'🍪';font-size:24px}#cookie-hero-banner p,.cookie-hero-buttons{display:none}`;
            default:
                return `#cookie-hero-banner{${positionCss}border-radius:8px;max-width:350px;text-align:center}`;
        }
    }

    copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeOutput.textContent).then(() => {
            const originalIcon = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalIcon;
            }, 1500);
        });
    });

    // --- UTILITY ---
    function lightenDarkenColor(col, amt) {
        let usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        const num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00ff) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        let g = (num & 0x0000ff) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
    }

    // Initial setup
    updatePreview();
});
