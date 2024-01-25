![Github action workflow status](https://github.com/steve-lebleu/nodemailer-sendinblue-v3-transport/actions/workflows/build.yml/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/nodemailer-sendinblue-v3-transport/badge.svg?branch=master)](https://coveralls.io/github/steve-lebleu/nodemailer-sendinblue-v3-transport?tag=v1.0.1)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/nodemailer-sendinblue-v3-transport/badge)](https://www.codefactor.io/repository/github/steve-lebleu/nodemailer-sendinblue-v3-transport)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/nodemailer-sendinblue-v3-transport?logo=Github)
![Known Vulnerabilities](https://snyk.io/test/github/steve-lebleu/nodemailer-sendinblue-v3-transport/badge.svg)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

# Sendinblue V2/3 transport module for Nodemailer

:warning: This repository has been archived since Sendinblue is now Brevo, and Marcel is back on track.

This module applies for [Nodemailer](http://www.nodemailer.com/) v2+ and provides a transport for [Sendinblue](https://www.sendinblue.com).

Dirty and quickly forked from the [amazing but not longer maintened job](https://github.com/gotschmarcel/nodemailer-sendinblue-transport) of my guy Marcel :sunglasses:.

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
