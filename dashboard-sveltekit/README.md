## To Run

```bash
bun install

# if you haven't logged in to stripe
stripe login

# to listen for stripe webhooks, run
bun stripe:listen
# then copy the stripe webhook secret to .env

# finally run
bun dev
```
