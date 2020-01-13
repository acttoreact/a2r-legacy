# Node Version Manager <!-- omit in toc -->

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

A2R Framework needs at least Node.js version 10.10.
If you have a lower version, it might mean you need that version to run other (older) projects.
If that's your case, we recommend you to use [nvm](http://nvm.sh/). This way, you can have multiple versions on your machine and switch between them depending on the project you are working with.

## Installation

There are multiple options, check [nvm docs](https://github.com/nvm-sh/nvm#installation-and-update).

## Usage

You can list installed versions on your machine:

```bash
nvm ls
```

You can also list available Node.js versions:

```bash
nvm ls-remote
```

If you need any specific version you can install it:

```bash
nvm install 10.10.0
```

You can switch your node version:

```bash
nvm use 10.10.0
```

Or maybe you just want to execute a singular project with a different version. You can do it:

```bash
nvm exec 8.0 npm run dev
```

If you have any question, you can check the original [usage docs](https://github.com/nvm-sh/nvm#usage).
