module.exports = {
  appname: 'Dazer',
  view: {
    need: true,
    folder_name: 'views',
    engine: 'ejs',
  },
  database: {
    need: true,
    username: '',
    password: '',
    url: 'localhost',
    port: 27017,
  },
  nodemailerConfig: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'user@gmail.com',
      pass: 'pass',
    },
  },
  emailAddress: 'noreply@bhanu.io',
  domainName: 'http://localhost:3000',
};
