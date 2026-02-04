'''coderadi &bull; Main file of the project.'''

# ? IMPORTING LIBRARIES
from flask import Flask

# ? IMPORTING EXTENSIONS
from routes import bind_routers

# ! BUILDING SERVER
server = Flask(__name__)

# & BINDING EXTENSIONS WITH THE SERVER
bind_routers(server)