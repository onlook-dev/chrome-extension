# Setup

Copy client project into client folder. Rename it to `project`.

From hosted root, run `docker compose up`. First run will take a while to build the images.

This will expose the client as `localhost:8000` and server as `localhost:8001`

# Note

The server will have access to client's files through a shared volume. It can read and write through the volume as well and the file will hot-reload.

Docker compose override file is for building locally without using image
