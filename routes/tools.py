'''coderadi &bull; Tools routing for the project.'''

# ? IMPORTING LIBRARIES
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZING TOOLS ROUTER
tools = Blueprint('tools', __name__, url_prefix='/tools')

# & PDF CROPPER ROUTE
@tools.route('/pdf-cropper/')
def pdf_cropper():
    return render_template('pages/pdf_cropper.html')

# & CR CALCULATOR ROUTE
@tools.route('/cr-calculator/')
def cr_calculator():
    return render_template('pages/cr_calculator.html')