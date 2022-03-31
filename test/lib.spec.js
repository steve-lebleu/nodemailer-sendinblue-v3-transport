const assert = require('assert');
const fs = require('fs');
const nodemailer = require('nodemailer');
const sendinblue = require('../lib/nodemailer-sendinblue-v3-transport');

function MockTransport(sb) {
  assert(sb);
  this.sb = sb;
}

MockTransport.prototype.send = function (mail, cb) {
  this.sb.buildBody(mail)
    .then(function (body) {
      cb(undefined, body);
    })
    .catch(e => e);
};

MockTransport.prototype.reset = function () {
  this.data = undefined;
};

describe('Sendinblue transporter V2 API', function() {
  let mock, transport;

  beforeEach(() => {
    mock = new MockTransport(sendinblue({
      apiKey: 'dummy',
      apiUrl: 'dummy'
    }));
    transport = nodemailer.createTransport(mock);
  });
  
  describe('#buildBody', function () {
    it('should parse plain "from" address', function (done) {
      transport.sendMail({ from: 'example@test.net'}, function (err, body) {
        assert.deepStrictEqual(body.from, ['example@test.net', '']);
        done();
      });
    });

    it('should parse "from" address with name', function (done) {
      transport.sendMail({ from: '"Doe, Jon" <example@test.net>'}, function (err, body) {
        assert.deepStrictEqual(body.from, ['example@test.net', 'Doe, Jon']);
        done();
      });
    });

    it('should parse "from" address object', function (done) {
      transport.sendMail({ from: { name: 'Doe, Jon', address: 'example@test.net' }}, function (err, body) {
        assert.deepStrictEqual(body.from, ['example@test.net', 'Doe, Jon']);
        done();
      });
    });

    it('should parse plain "to" address', function (done) {
      transport.sendMail({ to: 'example@test.net, example2@test.net' }, function (err, body) {
        assert.deepStrictEqual(body.to, {
          'example@test.net': '',
          'example2@test.net': ''
        });
        done();
      });
    });

    it('should parse plain or named "to" address', function (done) {
      transport.sendMail({ to: ['example@test.net', '"Don, Joe" <example2@test.net>']}, function (err, body) {
        assert.deepStrictEqual(body.to, {
          'example@test.net': '',
          'example2@test.net': 'Don, Joe'
        });
        done();
      });
    });

    it('should parse object "to" address', function (done) {
      transport.sendMail({ to: { address: 'example@test.net', name: 'Don Joe' }}, function (err, body) {
        assert.deepStrictEqual(body.to, { 'example@test.net': 'Don Joe' });
        done();
      });
    });

    it('should flatten address groups', function (done) {
      transport.sendMail({ to: 'AGroup: example@test.net, example2@test.net' }, function (err, body) {
        assert.deepStrictEqual(body.to, {
          'example@test.net': '',
          'example2@test.net': ''
        });
        done();
      });
    });

    it('should fill out all address fields', function (done) {
      transport.sendMail({
        from: 'example@test.net',
        to: 'example@test.net',
        cc: 'example@test.net',
        bcc: 'example@test.net',
        replyTo: 'example@test.net'
      }, function (err, body) {
        assert.deepStrictEqual(body.from, ['example@test.net', '']);
        assert.deepStrictEqual(body.to, { 'example@test.net': '' });
        assert.deepStrictEqual(body.cc, { 'example@test.net': '' });
        assert.deepStrictEqual(body.bcc, { 'example@test.net': '' });
        assert.deepStrictEqual(body.replyTo, ['example@test.net', '']);
        done();
      });
    });

    it('should handle url attachements', function (done) {
      transport.sendMail({
        attachments: [{
          path: 'http://domain.do/file.suffix'
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, ['http://domain.do/file.suffix']);
        done();
      });
    });

    it('should handle generated plain content attachements', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: 'Hello World'
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': 'SGVsbG8gV29ybGQ='
        });
        done();
      });
    });

    it('should handle generated plain content attachements with encoding', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: '\xff\xfa\xc3\x4e',
          encoding: 'binary'
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': '//rDTg=='
        });
        done();
      });
    });

    it('should handle generated Buffer attachements', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: new Buffer('Hello World')
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': 'SGVsbG8gV29ybGQ='
        });
        done();
      });
    });

    it('should handle generated Readable attachements', function (done) {
      var testFile = __dirname + '/lib.spec.js';

      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: fs.createReadStream(testFile)
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': fs.readFileSync(testFile).toString('base64')
        });
        done();
      });
    });

    it('should handle generated file attachements', function (done) {
      var testFile = __dirname + '/lib.spec.js';

      transport.sendMail({
        attachments: [{
          filename: 'a',
          path: testFile
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': fs.readFileSync(testFile).toString('base64')
        });
        done();
      });
    });
  });
});

describe('Sendinblue transporter V3 API', function() {
  let mock, transport;

  beforeEach(() => {
    mock = new MockTransport(sendinblue({
      apiKey: 'dummy',
      apiUrl: 'dummy/v3'
    }));
    transport = nodemailer.createTransport(mock);
  });

  describe('#buildBody', function () {
    it('should parse plain "from" address', function (done) {
      transport.sendMail({ from: 'example@test.net'}, function (err, body) {
        assert.deepStrictEqual(body.sender, { email: 'example@test.net' });
        done();
      });
    });

    it('should parse "from" address with name', function (done) {
      transport.sendMail({ from: '"Doe, Jon" <example@test.net>'}, function (err, body) {
        assert.deepStrictEqual(body.sender, { email: '"Doe, Jon" <example@test.net>' });
        done();
      });
    });

    it('should parse "from" address object', function (done) {
      transport.sendMail({ from: { name: 'Doe, Jon', address: 'example@test.net' }}, function (err, body) {
        assert.deepStrictEqual(body.sender, { name: 'Doe, Jon', address: 'example@test.net' });
        done();
      });
    });

    it('should parse plain "to" address', function (done) {
      transport.sendMail({ to: ['example@test.net', 'example2@test.net'] }, function (err, body) {
        assert.deepStrictEqual(body.to, [{ email: 'example@test.net' }, { email: 'example2@test.net' }]);
        done();
      });
    });

    it('should parse plain or named "to" address', function (done) {
      transport.sendMail({ to: ['example@test.net', '"Don, Joe" <example2@test.net>']}, function (err, body) {
        assert.deepStrictEqual(body.to, [{ email: 'example@test.net' }, { email: '"Don, Joe" <example2@test.net>' }]);
        done();
      });
    });

    it('should parse object "to" address', function (done) {
      transport.sendMail({ to: { address: 'example@test.net', name: 'Don Joe' }}, function (err, body) {
        assert.deepStrictEqual(body.to, { name: 'Don Joe', address: 'example@test.net' });
        done();
      });
    });

    it('should fill out all address fields', function (done) {
      transport.sendMail({
        from: 'example@test.net',
        to: 'example@test.net',
        cc: 'example@test.net',
        bcc: 'example@test.net',
        replyTo: 'example@test.net'
      }, function (err, body) {
        assert.deepStrictEqual(body.sender, { email: 'example@test.net' });
        assert.deepStrictEqual(body.to, { email: 'example@test.net' });
        assert.deepStrictEqual(body.cc, { email: 'example@test.net' });
        assert.deepStrictEqual(body.bcc, { email: 'example@test.net' });
        assert.deepStrictEqual(body.replyTo, { email: 'example@test.net' });
        done();
      });
    });

    it('should handle url attachements', function (done) {
      transport.sendMail({
        attachments: [
          {
            href: 'http://domain.do/file.suffix',
            filename: 'file.suffix'
          }
        ]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, [ { url: 'http://domain.do/file.suffix', name: 'file.suffix' } ]);
        done();
      });
    });

    it('should handle generated plain content attachements', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: 'Hello World'
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, [ { content: 'Hello World', name: 'a' } ]);
        done();
      });
    });

    xit('should handle generated plain content attachements with encoding', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: '\xff\xfa\xc3\x4e',
          encoding: 'binary'
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': '//rDTg=='
        });
        done();
      });
    });

    xit('should handle generated Buffer attachements', function (done) {
      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: new Buffer('Hello World')
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, {
          'a': 'SGVsbG8gV29ybGQ='
        });
        done();
      });
    });

    xit('should handle generated Readable attachements', function (done) {
      const testFile = __dirname + '/lib.spec.js';

      transport.sendMail({
        attachments: [{
          filename: 'a',
          content: fs.createReadStream(testFile)
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, [{ name: 'a', content: fs.readFileSync(testFile).toString('base64') }]);
        done();
      });
    });

    it('should handle generated file attachements', function (done) {
      const testFile = __dirname + '/lib.spec.js';

      transport.sendMail({
        attachments: [{
          filename: 'a',
          path: testFile
        }]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, [{ name: 'a', content: fs.readFileSync(testFile).toString('base64') }]);
        done();
      });
    });

    it('should handle softly throwed errors when attachment is not valid', function (done) {
      transport.sendMail({
        attachments: [
          {
            sad: 'a',
          }
        ]
      }, function (err, body) {
        assert.deepStrictEqual(body.attachment, undefined);
        done();
      });
    });

    it('should handle softly throwed error when attachment is not an array', function (done) {
      transport.sendMail({ attachments: {} }, function (err, body) {
        assert.deepStrictEqual(body.attachment, undefined);
        done();
      });
    });

    it('should handle params of dynamic templates', function (done) {
      transport.sendMail({
        params: {
          name: 'Yoda',
          language: 'en',
        }
      }, function (err, body) {
        assert.deepStrictEqual(body.params, {
          name: 'Yoda',
          language: 'en',
        });
        done();
      });
    });

    it('should handle template of dynamic templates', function (done) {
      transport.sendMail({ templateId: '2564fdsfsdfzeretfrdg' }, function (err, body) {
        assert.deepStrictEqual(body.templateId, '2564fdsfsdfzeretfrdg');
        done();
      });
    });

  });
});
