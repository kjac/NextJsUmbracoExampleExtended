# Next.js + Umbraco Delivery API - extended version

This repo contains an extended version of the official Next.js example for the Umbraco Delivery API.

Read all about it on [my blog](https://kjac.dev/posts/uncovering-the-nextjs-example-for-umbraco/).

## Running the demo

The demo consists of a server and a client project - `src/Site` and `src/umbraco-app` respectively.

The server is an Umbraco 13 site, which means you’ll need .NET 8 to run it. To start the server, open a terminal window in `src/Site` and run:

```bash
dotnet run
```

The client is a React app. The server must be running for the client to work. To start the client, open a terminal window in `src/umbraco-app` and run:

```bash
npm install
npm run dev
```

## Umbraco

The Umbraco database is bundled up as part of the GitHub repo. The administrator login for Umbraco is:

- Username: admin@localhost
- Password: SuperSecret123
