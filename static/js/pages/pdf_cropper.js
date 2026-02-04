// ================================
// ELEMENTS
// ================================
const pdfInput = document.getElementById("pdfUpload");
const applyBtn = document.getElementById("applyCrop");
const downloadBtn = document.getElementById("downloadCrop");
const resetBtn = document.getElementById("resetCrop");
const aspectSelect = document.getElementById("aspectRatio");
const pageSelect = document.getElementById("pageSelect");

let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");


// ================================
// STATE
// ================================
let pdfDoc = null;
let currentPage = 1;
let cropper = null;

// 🔥 KEY IDEA: store crop per page
let pageCrops = {};


// ================================
// LOAD PDF
// ================================
pdfInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bytes = new Uint8Array(await file.arrayBuffer());

    pdfDoc = await pdfjsLib.getDocument(bytes).promise;

    buildPageSelector(pdfDoc.numPages);

    renderPage(1);
});


// ================================
// BUILD PAGE DROPDOWN
// ================================
function buildPageSelector(total) {
    pageSelect.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `Page ${i}`;
        pageSelect.appendChild(opt);
    }
}

pageSelect.addEventListener("change", () => {
    currentPage = Number(pageSelect.value);
    renderPage(currentPage);
});


// ================================
// RENDER PAGE
// ================================
async function renderPage(num) {

    if (cropper) cropper.destroy();

    const panel = document.querySelector(".left-panel");
    panel.innerHTML = "";

    canvas = document.createElement("canvas");
    panel.appendChild(canvas);

    ctx = canvas.getContext("2d");

    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: 1.0 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport
    }).promise;

    initCropper();
}

// ================================
// CROPPER
// ================================
function initCropper() {

    if (cropper) cropper.destroy();

    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.style.maxWidth = "100%";

    const panel = document.querySelector(".left-panel");
    panel.innerHTML = "";
    panel.appendChild(img);

    cropper = new Cropper(img, {
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true
    });

    // restore previous crop
    if (pageCrops[currentPage]) {
        cropper.setData(pageCrops[currentPage]);
    }
}

// ================================
// SAVE CROP FOR CURRENT PAGE
// ================================
applyBtn.addEventListener("click", () => {

    if (!cropper) return;

    const crop = cropper.getData(true);

    pageCrops[currentPage] = {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height
    };

    alert(`Crop saved for Page ${currentPage}`);
});


// ================================
// ASPECT RATIO
// ================================
aspectSelect.addEventListener("change", function () {
    if (!cropper) return;

    const v = this.value;

    if (v === "free") cropper.setAspectRatio(NaN);
    if (v === "sq") cropper.setAspectRatio(1);
    if (v === "a4") cropper.setAspectRatio(210 / 297);
    if (v === "letter") cropper.setAspectRatio(8.5 / 11);
});


// ================================
// RESET PAGE
// ================================
resetBtn.addEventListener("click", () => {

    delete pageCrops[currentPage];

    renderPage(currentPage);
});


// ================================
// MULTI PAGE EXPORT
// ================================
downloadBtn.addEventListener("click", async () => {

    if (!pdfDoc) return alert("Upload PDF first");

    const originalBytes = await pdfDoc.getData();

    const pdfLibDoc = await PDFLib.PDFDocument.load(originalBytes);

    for (let i = 0; i < pdfLibDoc.getPageCount(); i++) {

        const crop = pageCrops[i + 1];
        if (!crop) continue;

        const page = pdfLibDoc.getPage(i);

        const { width, height } = page.getSize();

        const imgW = cropper.imageData.naturalWidth;
        const imgH = cropper.imageData.naturalHeight;

        const scaleX = width / imgW;
        const scaleY = height / imgH;

        const x = crop.x * scaleX;
        const w = crop.width * scaleX;
        const h = crop.height * scaleY;

        const y = height - (crop.y + crop.height) * scaleY;

        page.setCropBox(x, y, w, h);
    }

    const newBytes = await pdfLibDoc.save();

    const blob = new Blob([newBytes], { type: "application/pdf" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cropped_pages.pdf";
    a.click();
});
