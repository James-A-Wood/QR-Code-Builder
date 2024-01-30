// import "./libraries/qrious.js";
import "./libraries/jquery.js";
import "./libraries/popper.js";
import "./libraries/bootstrap.js";


const log = console.log;
const localStorageKey = "qr_code_use_japanese_language";
localStorage[localStorageKey] && setMode("japan");

window.addEventListener("beforeinstallprompt", () => {
    // log("beforeinstallprompt triggered!");
});

function setMode(language) {
    $("body").toggleClass("japan", language === "japan");
    localStorage.removeItem(localStorageKey);
    if (language === "japan") localStorage[localStorageKey] = "true;"
}

$("#english-selector").on("click", () => setMode("english"));
$("#japanese-selector").on("click", () => setMode("japan"));
$("#qrcode-input").on("input paste", generateCode);

const canvas = (function () {

    const canvas = document.getElementById("output-canvas");
    const $holder = $("#canvas-holder");

    let canvasHasContent = false;

    function clear() {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        $holder.addClass("empty").removeClass("downloaded");
        canvasHasContent = false;
        return this;
    }

    return {
        displayQR: function (text) {
            clear();
            if (!text) return;
            const qr = new QRious({
                element: canvas,
                value: text,
                size: qrSize.getSize(),
            });
            canvasHasContent = true;
            $holder.removeClass("empty");
        },
        download: function () {
            if (!canvasHasContent) return false;
            const link = document.createElement("a");
            link.download = "qr_code.png";
            link.href = canvas.toDataURL();
            link.click();
            $holder.addClass("downloaded");
        },
    };
}());

$("#download-button").on("click", canvas.download);

function generateCode() {
    const text = $("#qrcode-input").val();
    canvas.displayQR(text);
}

const qrSize = (function () {

    const $holder = $("#size-radios-holder");
    const $radios = $("input[name='size-radio']");
    $radios.on("change", generateCode);

    return {
        getSize: () => $("input[name='size-radio']:checked").val(),
        show: () => $holder.css("visibility", "visible"),
        hide: () => $holder.css("visibility", "hidden"),
    };
}());


