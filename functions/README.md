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
