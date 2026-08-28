import routes from './routes.js';
export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) ?? true,
    darkSet: localStorage.getItem('darkSet') ?? true,
    darker: JSON.parse(localStorage.getItem('darker')) ?? false,
    custom: doColors() ?? false,
    toggleDark() {
        if (this.dark == true && this.darker == false) {
            this.darker = true;
        } else {
            this.darker = false;
            this.darkSet = !this.darkSet;
            this.dark = !this.dark;
        }
        this.custom = false;
        localStorage.setItem('dark', JSON.stringify(this.dark));
        localStorage.setItem('darker', JSON.stringify(this.darker));
    },
    showSettings() {
        // hey there, it's @ballgoballing.
        // good luck understanding what i had in mind
        // this and the index.html are interesting
        // :)
        console.error("setting");
        var settings = document.getElementById("settingsPanel");
        if (settings.style.display === "none") {
            settings.style.display = "flex";
            var bgColor = document.getElementById("bgColor");
            var textColor = document.getElementById("textColor");
            var primaryColor = document.getElementById("primaryColor");
            var onPrimaryColor = document.getElementById("onPrimaryColor");
            var inputCustomCSS = document.getElementById("inputCustomCSS");
            bgColor.value = JSON.parse(localStorage.getItem('bgColor'));
            textColor.value = JSON.parse(localStorage.getItem('textColor'));
            primaryColor.value = JSON.parse(localStorage.getItem('primaryColor'));
            onPrimaryColor.value = JSON.parse(localStorage.getItem('onPrimaryColor'));
            inputCustomCSS.value = JSON.parse(localStorage.getItem('customCSS'));
        } else {
            settings.style.display = "none";
        }
    },
    applyColor() {
        var bgColor = document.getElementById("bgColor");
        var textColor = document.getElementById("textColor");
        var primaryColor = document.getElementById("primaryColor");
        var onPrimaryColor = document.getElementById("onPrimaryColor");
        var inputCustomCSS = document.getElementById("inputCustomCSS");
        var customCSS = document.getElementById("customCSS");
        customCSS.innerHTML = inputCustomCSS.value || "*";
        var r = document.querySelector('main');
        r.style.setProperty('--color-background', bgColor.value || "#1c1b1f");
        r.style.setProperty('--color-on-background', textColor.value || "white");
        var h = document.querySelector('header');
        h.style.setProperty('--color-primary', primaryColor.value || "#2e2e2e");
        h.style.setProperty('--color-on-primary', onPrimaryColor.value || "white");
        var theme = document.getElementById("theme");
        this.custom = true;
        console.error(theme.value);
        this.darkSet = theme.value;
        localStorage.setItem('darkSet', theme.value);
        localStorage.setItem('custom', JSON.stringify(this.custom));
        console.error("apply color");
        localStorage.setItem('bgColor', JSON.stringify(bgColor.value));
        localStorage.setItem('textColor', JSON.stringify(textColor.value));
        localStorage.setItem('primaryColor', JSON.stringify(primaryColor.value));
        localStorage.setItem('onPrimaryColor', JSON.stringify(onPrimaryColor.value));
        localStorage.setItem('customCSS', JSON.stringify(inputCustomCSS.value));
        bgColor.value = JSON.parse(localStorage.getItem('bgColor'));
        textColor.value = JSON.parse(localStorage.getItem('textColor'));
        primaryColor.value = JSON.parse(localStorage.getItem('primaryColor'));
        onPrimaryColor.value = JSON.parse(localStorage.getItem('onPrimaryColor'));
        inputCustomCSS.value = JSON.parse(localStorage.getItem('customCSS'));
        theme.value = JSON.parse(localStorage.getItem('darkSet'));
        console.error("set colors");
    },
    resetColor() {
        localStorage.setItem('custom', false);
        localStorage.setItem('bgColor', null);
        localStorage.setItem('textColor', null);
        localStorage.setItem('primaryColor', null);
        localStorage.setItem('onPrimaryColor', null);
        localStorage.setItem('customCSS', null);
        localStorage.setItem('levelThumbnailColor', null);
        localStorage.setItem('buttonIconColor', null);
        reload();
        alert("Refresh the page to reset it!");
    },
});

const app = Vue.createApp({
    data: () => ({ store, bgColor: '', customCSS: '' }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

app.use(router);

app.mount('#app');
export function doColors() {    
        if (JSON.parse(localStorage.getItem('custom'))) {
            console.error("BANG BANG");
            console.error(localStorage.getItem('darkSet'));
            var customCSS = document.getElementById("customCSS");
            customCSS.innerHTML = JSON.parse(localStorage.getItem('customCSS')) || "*";
            var r = document.querySelector(':root');
            r.style.setProperty('--color-background', JSON.parse(localStorage.getItem('bgColor')) || "#1c1b1f");
            r.style.setProperty('--color-on-background', JSON.parse(localStorage.getItem('textColor')) || "white");
            r.style.setProperty('--color-primary', JSON.parse(localStorage.getItem('primaryColor')) || "#2e2e2e");
            r.style.setProperty('--color-on-primary', JSON.parse(localStorage.getItem('onPrimaryColor')) || "white");
            if (localStorage.getItem('darkSet')) {
                r.style.setProperty('--level-button', "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))");
                r.style.setProperty('--the-button-on-top', "brightness(100%)");
            }
            console.error("mrrp");
            return true;
        }
        return false;
}