# Local Firebase setup

Login with firebase. Use account that has access to the project.

```
gcloud auth application-default login
```

You should see something like this printed out

```
Credentials saved to file: [/path/to/.config/gcloud/application_default_credentials.json]
```

Run this with the path to set the env variable

```
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/.config/gcloud/application_default_credentials.json"

```

Restart terminal to apply env variable

# Deploy

Deploy test

```
firebase use default
bun run deploy
```

Deploy prod

```
firebase use prod
bun run deploy
```

# Setting env variables

Environment variables need to be set for certain functions to use (For example Github secrets).

1. Fill them out from the `.env.example`
2. Set them in Firebase

To set them in Firebase, you can run `bun run config` which will print out the Firebase commands you need to run to set your env variables.
Copy and run those to set local Firebase env variables.

# Github Secret Key

To authenticate Github requests on cloud functions, we need to generate a secret key on the Github App. This downloads a `.pem` file that we can base64 decode and add to the `.env` file. For example:

```bash
base64 -i path/to/key.pem
```

Then follow the steps above to set the env variable.
