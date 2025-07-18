# go-crypto-ui
Simple React app that displays live crypto prices using the [go-crypto-api](https://github.com/Ve6om/go-crypto-api) backend.

## Live Demo

Try out a live demo of the frontend here:

[https://react-crypto-ui.up.railway.app/](https://react-crypto-ui.up.railway.app/)

## How to Run

1. Clone the repository and enter the directory.

2. Create a `.env` file in the root of the project to customize settings:

```env
# Backend API URL to send requests to.
# This should point to your deployed instance of the go-crypto-api:
# https://github.com/Ve6om/go-crypto-api
VITE_GO_CRYPTO_API_URL=http://localhost:8080
```

3. (Optional) Test the app locally
```bash
npm run dev
```

4. Build the app and deploy it to your own server or a platform like [Railway](https://railway.com/):
```bash
npm run build
```
