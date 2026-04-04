/*************************
  INIT ON EVERY PAGE LOAD
*************************/
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem("theme") || "light");
    applyLanguage(localStorage.getItem("language") || "en");
});

/*************************
  THEME SYSTEM
*************************/
function changeTheme(theme) {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    let isDark = false;
    if (theme === "dark") isDark = true;
    else if (theme === "system") isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");

    if (isDark) {
        // ===== DARK MODE =====
        document.body.style.cssText += ";background-color:#121212 !important;color:#e6edf3 !important";

        // All white/light backgrounds → dark
        document.querySelectorAll([
            ".card",".login-box",".tab-card",".chatbox",
            ".navbar",".topbar",".side-menu",".login-wrapper",
            ".section",".farmer-card",".table-box",".stat",
            ".module",".box",".detail-box",".order",
            "header","nav",".modal","table","thead","tbody"
        ].join(",")).forEach(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            // Only darken white/near-white backgrounds
            if (isLightColor(bg)) {
                el.style.backgroundColor = "#1e1e2e";
                el.style.color = "#e6edf3";
            }
        });

        document.querySelectorAll("input,select,textarea").forEach(el => {
            el.style.backgroundColor = "#2a2a3a";
            el.style.color = "#e6edf3";
            el.style.borderColor = "#444";
        });

        document.querySelectorAll("th").forEach(el => {
            el.style.backgroundColor = "#21262d";
            el.style.color = "#e6edf3";
        });

        document.querySelectorAll("td").forEach(el => {
            el.style.borderColor = "#30363d";
            el.style.color = "#e6edf3";
        });

        document.querySelectorAll("tr:hover").forEach(el => {
            el.style.backgroundColor = "#2a2a3a";
        });

        document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,span,label,a").forEach(el => {
            const c = window.getComputedStyle(el).color;
            if (isLightOnLight(c)) el.style.color = "#e6edf3";
        });

        document.querySelectorAll(".side-menu a,.menu-item").forEach(el => {
            el.style.backgroundColor = "#2a2a3a";
            el.style.color = "#e6edf3";
        });

    } else {
        // ===== LIGHT MODE =====
        document.body.style.cssText = document.body.style.cssText
            .replace(/background-color:[^;]+;?/gi, "")
            .replace(/color:[^;]+;?/gi, "");

        document.querySelectorAll([
            ".card",".login-box",".tab-card",".chatbox",
            ".navbar",".topbar",".side-menu",".login-wrapper",
            ".section",".farmer-card",".table-box",".stat",
            ".module",".box",".detail-box",".order",
            "header","nav","table","thead","tbody",
            "input,select,textarea","th","td",
            ".side-menu a,.menu-item","p,h1,h2,h3,h4,h5,h6,span,label"
        ].join(",")).forEach(el => {
            el.style.backgroundColor = "";
            el.style.color = "";
            el.style.borderColor = "";
        });
    }
}

function isLightColor(rgb) {
    if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return false;
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return false;
    const brightness = (parseInt(m[0]) * 299 + parseInt(m[1]) * 587 + parseInt(m[2]) * 114) / 1000;
    return brightness > 180;
}

function isLightOnLight(rgb) {
    if (!rgb) return false;
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return false;
    const brightness = (parseInt(m[0]) * 299 + parseInt(m[1]) * 587 + parseInt(m[2]) * 114) / 1000;
    return brightness < 50; // near black text
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") applyTheme("system");
});

/*************************
  LANGUAGE SYSTEM
*************************/
function changeLanguage(lang) {
    localStorage.setItem("language", lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const dict = {
        hi: {
            "Dashboard": "डैशबोर्ड",
            "Orders": "ऑर्डर",
            "Payments": "भुगतान",
            "Login": "लॉगिन",
            "Logout": "लॉगआउट",
            "Farmers": "किसान",
            "Buyers": "खरीदार",
            "Products": "उत्पाद",
            "Upload": "अपलोड",
            "Sales": "बिक्री",
            "Health": "स्वास्थ्य",
            "Schemes": "योजनाएँ",
            "Announcements": "घोषणाएँ",
            "Reports": "रिपोर्ट",
            "Settings": "सेटिंग्स",
            "Register": "पंजीकरण",
            "Approve": "स्वीकृत करें",
            "Reject": "अस्वीकार करें",
            "Buy Fresh Produce": "ताज़ी उपज खरीदें",
            "Sell Your Crops": "अपनी फसल बेचें",
            "Empowering Farmers": "किसानों को सशक्त बनाना",
            "Connecting Farmers & Buyers": "किसानों और खरीदारों को जोड़ना",
            "Fresh Products": "ताज़े उत्पाद",
            "Add to Cart": "कार्ट में जोड़ें",
            "Farmer Portal": "किसान पोर्टल",
            "Buyer Portal": "खरीदार पोर्टल",
            "Upload Produce": "उत्पाद अपलोड करें",
            "My Sales": "मेरी बिक्री",
            "Healthcare": "स्वास्थ्य सेवाएँ",
            "Govt Schemes": "सरकारी योजनाएँ",
            "AI Crop Prediction": "AI फसल भविष्यवाणी",
            "Fresh from the Farm": "खेत से ताज़ा",
            "Search": "खोजें",
            "Cart": "कार्ट",
            "Store": "दुकान",
            "More": "अधिक",
            "Profile": "प्रोफ़ाइल",
        },
        sa: {
            "Dashboard": "पटलः",
            "Orders": "आदेशाः",
            "Payments": "भुगतानम्",
            "Login": "प्रवेशः",
            "Logout": "निर्गमनम्",
            "Farmers": "कृषकाः",
            "Buyers": "क्रेतारः",
            "Products": "उत्पादाः",
            "Upload": "आरोपणम्",
            "Sales": "विक्रयः",
            "Health": "स्वास्थ्यम्",
            "Schemes": "योजनाः",
            "Empowering Farmers": "कृषकान् सशक्तीकर्तुम्",
            "Farmer Portal": "कृषक द्वारम्",
            "Buyer Portal": "क्रेतृ द्वारम्",
        }
    };

    const map = lang === "en" ? {} : (dict[lang] || {});

    // Translate leaf text nodes only (no children)
    document.querySelectorAll(
        "h1,h2,h3,h4,h5,h6,p,span,a,button,label," +
        ".cat-label,.stat-label,.bnav-item,.nav-item"
    ).forEach(el => {
        if (el.children.length > 0) return;
        const text = el.innerText?.trim();
        if (!text || text.includes("FarmConnect")) return;
        if (map[text]) el.innerText = map[text];
    });

    // Handle hero-specific elements
    const heroTitle  = document.querySelector(".hero-text h1, .hero-content h1");
    const dashTitle  = document.getElementById("dash-title");
    const logoutText = document.getElementById("logout-text");

    const heroMap   = { en:"Empowering Farmers",  hi:"किसानों को सशक्त बनाना", sa:"कृषकान् सशक्तीकर्तुम्" };
    const dashMap   = { en:"👨‍🌾 Farmer Dashboard", hi:"👨‍🌾 किसान डैशबोर्ड",       sa:"👨‍🌾 कृषक पटलः" };
    const logoutMap = { en:"🚪 Logout",            hi:"🚪 लॉगआउट",               sa:"🚪 निर्गमनम्" };

    if (heroTitle)  heroTitle.innerText  = heroMap[lang]   || heroMap.en;
    if (dashTitle)  dashTitle.innerText  = dashMap[lang]   || dashMap.en;
    if (logoutText) logoutText.innerText = logoutMap[lang] || logoutMap.en;

    document.documentElement.lang = lang === "hi" ? "hi" : lang === "sa" ? "sa" : "en";
}

/*************************
  NAVIGATION
*************************/
function go(page) { window.location.href = page; }

function logout() {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("farmerPhone");
    localStorage.removeItem("buyerId");
    localStorage.removeItem("buyerName");
    window.location.href = "index.html";
}

function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "index.html";
}

/*************************
  CHATBOT
*************************/
function sendMessage() {
    const input = document.getElementById("userInput");
    const chat  = document.getElementById("chatArea");
    if (!input || !chat || !input.value.trim()) return;

    const msg = input.value.toLowerCase();
    chat.innerHTML += `<p class="user">${input.value}</p>`;

    let reply = "Sorry, I didn't understand that.";
    if (msg.includes("price"))  reply = "AI predicts better prices next month 📈";
    if (msg.includes("scheme")) reply = "You may be eligible for PM-KISAN (₹6,000/year).";
    if (msg.includes("help"))   reply = "Contact support@farmconnect.com";
    if (msg.includes("hello") || msg.includes("hi")) reply = "Hello! How can I help you? 🌾";

    chat.innerHTML += `<p class="bot">${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;
    input.value = "";
}

/*************************
  AI PRICE PREDICTION
*************************/
function predictPrice() {
    const crop   = document.getElementById("crop");
    const result = document.getElementById("result");
    if (!crop || !result) return;
    const prices = { Wheat:"₹2200/quintal", Rice:"₹3000/quintal", Maize:"₹1800/quintal" };
    result.innerText = "Predicted Price: " + (prices[crop.value] || "N/A");
}
