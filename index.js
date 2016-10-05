const rp = require('request-promise-native');
const cheerio = require('cheerio');
const _ = require('lodash');

const listUrl = 'https://havarot.justice.gov.il/CompaniesList.aspx';

const createOptions = (opts) => {
  return initSession()
    .then((session) => {
      let form = _.clone(session.headers);
      if (opts.name) {
        form['ctl00$CPHCenter$txtCompanyName'] = opts.name;
      } else {
        form['ctl00$CPHCenter$txtCompanyNumber'] = opts.number;
      }
      return {
        method: 'POST',
        uri: listUrl,
        transform: (body) => cheerio.load(body),
        headers: {
          'cookie': session.cookie
        },
        form: form
      }
    });
};

let sessionData;

const initSession = () => {
  if (sessionData) {
    return Promise.resolve(sessionData);
  }
  return rp({
    method: 'GET',
    uri: listUrl,
    resolveWithFullResponse: true
  }).then((response) => {
    sessionData = {
      cookie: response.headers['set-cookie'],
      headers: {}
    };
    let $ = cheerio.load(response.body);
    $('#aspnetForm').find('input[name]')
      .each((i, elem) => {
        jq = $(elem);
        sessionData.headers[jq.attr('name')] = jq.attr('value');
      });
    sessionData.headers['ctl00$CPHCenter$hidDivCapcha'] = 'hide'
    return sessionData;
  });
};

const search = (options) => {
  return createOptions(options)
    .then((opts) => rp(opts))
    .then(($) => {
      const grid = $('#CPHCenter_GridBlock');
      var companies = []
      grid.find('.RowStyle, .AltRowStyle')
        .each((i, elem) => {
          let data = $(elem).find('td');
          companies.push({
            id: $(data[0]).text(),
            name: $(data[1]).text(),
            engName: $(data[2]).text()
          });
        });
      return companies;
    });
};

module.exports = search;