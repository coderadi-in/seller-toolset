'''coderadi &bull; Run file for the Project.'''

# ? IMPORTING OBJECTS
from main import server

# ! RUNNING THE SERVER
if (__name__ == "__main__"):
    server.run(
        debug=True,
        host='0.0.0.0'
    )