# Setup

Copy client project into client folder. Rename it to `project`.

From hosted root, run `docker compose up`. First run will take a while to build the images.

This will expose the client as `localhost:8000` and server as `localhost:8001`. These will automatically talk to each other if the 2 ports are exposed on the machine.

# Note

The server will have access to client's files through a shared volume. It can read and write through the volume as well and the file will hot-reload.

There are different compose overrides for building from local vs from remote images. Remote images would be how we will deploy hosted containers.
