'''coderadi &bull; App routing for the project.'''

# ? IMPORTING LIBRARIES
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZING APP ROUTER
app = Blueprint('app', __name__)

# & HOME ROUTE
@app.route('/')
def home():
    return render_template('pages/home.html')
