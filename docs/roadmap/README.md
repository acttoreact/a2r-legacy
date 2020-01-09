# Roadmap <!-- omit in toc -->

> *Last Update: December 2019*

- [MVP](#mvp)
- [Backlog](#backlog)
  - [Small tasks](#small-tasks)
- [Wishlist, other ideas, etc](#wishlist-other-ideas-etc)

## MVP

This is the current MVP definition.

- Single command installation (—init).
- Single command run (—dev).
- Main libraries export and import from framework.
- Pages compilation on real time (Next.js).
- API compilation on runtime.
- Socket server generation with API methods integrated.
- Automatically generated client API.
- Isomorphic render model.
  - Subscriptions by route? Route determines needed data?

## Backlog

This is first approach a list of every desired functionality:

- Automatic test generation tool (record mode)
- Generic authentication method and permissions system
- Email send via mailgun with templated email (I will recomend using https://www.npmjs.com/package/email-templates)
- LiveObject: option to subscribe to an object. Reactive object model.
- LiveQuery: option to subscribe to a query. Reactive query model.
- Centralized built and deploy (CI/CD)
- Horizontal scalability
- Services status check model (/health or /status)
- Micro-services and external tasks model
- Project middlewares, automatic setup
- SEO and routes (basic automatic robots.txt and sitemap)
- Localization and localized routes
- Expo and multiple proxies
- Generic hooks
- Generic components?

### Small tasks

- [x] Review `patch` and similar tools and use proper path functions instead of string manipulation.
- [ ] Use more extended [chalk](https://www.npmjs.com/package/chalk) instead of `colors`.

## Wishlist, other ideas, etc

For any other idea or wish, we can use [a not very clean doc](./think-tank.md) where we can write down everything that crosses our minds. We'll have time to pick the good ideas and add them to the official roadmap.
