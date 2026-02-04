// ? GETTING DOC ELEMENTS
const pdfInput = document.getElementById("pdfUpload")
const applyCropBtn = document.getElementById("applyCrop");
const aspectRatioSelect = document.getElementById("aspectRatio");
const downloadCroppedBtn = document.getElementById("downloadCrop");

// ? VARIABLES
let pdfDoc = null;
let currentPage = 1;
let cropper = null;
let croppedImageData = null;

// ? SETTING UP CANVAS
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

// & PDF FETCHING FUNCTIONALITY
pdfInput.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        // Load PDF
        pdfDoc = await pdfjsLib.getDocument(typedarray).promise;

        renderPage(currentPage);
    };

    fileReader.readAsArrayBuffer(file);
});

// * FUNCTION TO RENDER PDF PAGE
async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);

    const viewport = page.getViewport({ scale: 1.5 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;

    initCropper();
}

// * FUNCTION TO INITIALIZE CROPPER.JS
function initCropper() {
    if (cropper) {
        cropper.destroy();
    }

    // Convert canvas to image for Cropper
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");

    canvas.replaceWith(img);
    img.id = "pdfCanvas";

    cropper = new Cropper(img, {
        viewMode: 1,
        dragMode: "crop",
        autoCropArea: 0.7,
        responsive: true,
    });
}

// & Apply Crop Button FUNCTIONALITY
applyCropBtn.addEventListener("click", function () {
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();

    // Replace preview with cropped result
    croppedImageData = croppedCanvas.toDataURL("image/png");
    cropper.destroy();

    const newImg = document.createElement("img");
    newImg.src = croppedCanvas.toDataURL("image/png");
    newImg.style.maxWidth = "100%";

    document.querySelector(".left-panel").innerHTML = "";
    document.querySelector(".left-panel").appendChild(newImg);
});

// & CUSTOM ASPECT RATIO FUNCTIONALITY
aspectRatioSelect.addEventListener("change", function () {
    if (!cropper) {return};

    const value = this.value;

    if (value === "free") {cropper.setAspectRatio(NaN)};
    if (value === "sq") {cropper.setAspectRatio(1)};
    if (value === "a4") {cropper.setAspectRatio(210 / 297)};
    if (value === "letter") {cropper.setAspectRatio(8.5 / 11)};
});

// & DOWNLOAD CROPPED PDF FUNCTIONALITY
downloadCroppedBtn.addEventListener("click", async function () {

    // CONDITIONAL STATEMENTS
    if (!pdfDoc) {
        alert("Please upload a PDF first!");
        return;
    }

    if (!croppedImageData) {
        alert("Please crop before exporting!");
        return;
    }

    // LOAD IMAGE DATA
    const pdfBytes = await pdfDoc.getData();
    const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const page = pdfLibDoc.getPage(currentPage - 1);
    const pngImage = await pdfLibDoc.embedPng(croppedImageData);
    const { width, height } = page.getSize();

    // SETUP BACKGROUND
    page.drawRectangle({
        x: 0,
        y: 0,
        width: 2480,
        height: 3508,
        color: PDFLib.rgb(1, 1, 1),
    });

    // RENDERING CROPPED IMAGE
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
    });

    const newPdfBytes = await pdfLibDoc.save();

    // Download file
    const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "cropped.pdf";
    link.click();
});