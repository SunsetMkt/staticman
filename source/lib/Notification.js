import config from '../config';

export default class Notification {
  constructor(mailAgent) {
    this.mailAgent = mailAgent;
  }

  _buildMessage(fields, options, data) {
    return `
    <html>
      <body>
        Dear human,<br>
        <br>
        Someone replied to a comment you subscribed to${
          data.siteName ? ` on <strong>${data.siteName}</strong>` : ''
        }.<br>
        <br>
        ${
          options.origin ? `<a href="${options.origin}">Click here</a> to see it.` : ''
        } If you do not wish to receive any further notifications for this thread, <a href="%mailing_list_unsubscribe_url%">click here</a>.<br>
        <br>
        #ftw,<br>
        -- <a href="https://staticman.net">Staticman</a>
      </body>
    </html>
    `;
  }

  send(to, fields, options, data) {
    const subject = data.siteName ? `New reply on "${data.siteName}"` : 'New reply';

    return new Promise((resolve, reject) => {
      this.mailAgent.messages().send(
        {
          from: `${config.get('email.fromName')} <${config.get('email.fromAddress')}>`,
          to,
          subject,
          html: this._buildMessage(fields, options, data),
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res);
        }
      );
    });
  }
}
