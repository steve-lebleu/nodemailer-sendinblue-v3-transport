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
