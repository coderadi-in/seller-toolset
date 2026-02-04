'''coderadi &bull; Routers initializer file for the Project.'''

# ? IMPORTING ROUTE-MANAGERS
from routes.app import app

# * FUNCTION TO BIND ROUTERS WITH THE SERVER
def bind_routers(server):
    server.register_blueprint(app)