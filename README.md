[![Build](https://github.com/konfer-be/nodemailer-sendinblue-v3-transport/actions/workflows/release.yml/badge.svg)](https://github.com/konfer-be/nodemailer-sendinblue-v3-transport/actions/workflows/release.yml)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/nodemailer-sendinblue-v3-transport/badge.svg?branch=master)](https://coveralls.io/github/konfer-be/nodemailer-sendinblue-v3-transport?branch=master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/nodemailer-sendinblue-v3-transport/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/nodemailer-sendinblue-v3-transport)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

# Sendinblue V2/3 transport module for Nodemailer

This module applies for [Nodemailer](http://www.nodemailer.com/) v2+ and provides a transport for [Sendinblue](https://www.sendinblue.com).

Dirty and quickly forked from the [amazing but not maintened job](https://github.com/gotschmarcel/nodemailer-sendinblue-transport) of my guy Marcel :sunglasses:.

Pull requests welcome.

## Usage

Install with npm

```shell
$ npm i nodemailer-sendinblue-v3-transport
```

Require the module

```javascript
const nodemailer = require('nodemailer');
const sendinBlue = require('nodemailer-sendinblue-v3-transport');
```

Create a Nodemailer transporter

### V2

```javascript
const transporter = nodemailer.createTransport(sendinBlue(options))
```

### V3

```javascript
const transporter = nodemailer.createTransport(sendinBlue({ ...options, ...{ apiUrl: 'https://api.sendinblue.com/v3/smtp' }}))
```

### Available Options

* **apiKey** - API key (required)
* **apiUrl** - API url, default <https://api.sendinblue.com/v2.0>

## License

**MIT**
