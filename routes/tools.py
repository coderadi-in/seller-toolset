'''coderadi &bull; Tools routing for the project.'''

# ? IMPORTING LIBRARIES
from flask import Blueprint, render_template, redirect, url_for, flash, request, send_file
import pdfplumber
from pypdf import PdfReader, PdfWriter
from io import BytesIO
from data import KEYWORDS

# ! INITIALIZING TOOLS ROUTER
tools = Blueprint('tools', __name__, url_prefix='/tools')

# & PDF CROPPER ROUTE
@tools.route('/pdf-cropper/')
def pdf_cropper():
    return render_template('pages/pdf_cropper.html')

# | PDF CROPPER PROCESSING ROUTE
@tools.route('/pdf-cropper/crop', methods=['POST'])
def crop_pdf():
    # ACCESSING FORM DATA
    pdf_file = request.files.get('fileUpload')
    platform = request.form.get('platformSelect')

    data_platform = KEYWORDS.get(platform) # ACCESS RELATED PLATFORM
    related_keywords = data_platform.get('words') # ACCESS PLATFORM RELATED KEYWORDS
    related_margin = data_platform.get('margin') # ACCESS PLATFORM RELATED MARGIN
    related_cutout = data_platform.get('cutout') # ACCESS PLATFORM RELATED CUTOUT
    lower_bounding_box = [] # STORES LOWER CORDS OF ALL FILES

    # DETECTING MAIN BOUNDING BOX
    with pdfplumber.open(pdf_file) as pdf:
        lower_cord = None # INITIALIZE LOWER CORD

        for page in pdf.pages:
            # EXTRACT DATA FROM PDF
            words = page.extract_words(
                keep_blank_chars=True,
                use_text_flow=True,
            )

            # EXTRACT THE LOWER CORD TO CROP
            for i, word in enumerate(words):
                if (word.get('text') == related_keywords[0]):
                    if (words[i+1].get('text') == related_keywords[1]):
                        lower_cord = word.get('top') + related_margin
                        lower_bounding_box.append(lower_cord)
                        break

            # CONDITIONAL IF LOWER CORD CAN'T BE EXTRACTED
            if (lower_cord == None):
                lower_bounding_box.append(page.height * related_cutout)
        
    # CROP THE PDF
    pdf_file.seek(0)
    reader = PdfReader(pdf_file)
    writer = PdfWriter()

    # PREPARE OUTPUT PAGE
    for i, page in enumerate(reader.pages):
        page.mediabox.lower_left = (0, lower_bounding_box[i])
        writer.add_page(page)

    # PREPARE OUTPUT FILE
    output = BytesIO()
    writer.write(output)
    output.seek(0)

    # RETURN THE OUTPUT
    return send_file(
        output,
        as_attachment=True,
        download_name="cropped_label.pdf",
        mimetype='application/pdf'
    )

# & CR CALCULATOR ROUTE
@tools.route('/cr-calculator/')
def cr_calculator():
    return render_template('pages/cr_calculator.html')

# & PRICE CALCULATOR ROUTE
@tools.route('/price-calculator/')
def price_calculator():
    return render_template('pages/price_calculator.html')