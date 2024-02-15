## To Run

```bash
bun install

# if you haven't logged in to stripe
stripe login

# to listen for stripe webhooks, run
bun stripe:listen
# then copy the stripe webhook secret to .env

# finally run
bun run dev
```

## Getting Github private keys

The Github private keys need to be in `pkcs8`. Github gives it to you in `pkcs1` format. Run this command on MacOS to convert it.

```
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in old.pem -out new.pem
```
