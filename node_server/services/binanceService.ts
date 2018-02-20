// Cannot use "import"  for importing library
// Cannot use "public" for methods
// Cannot use "export class"
// because node does not support ES6, it supports CommomJs module.exports.

const https = require('https');
class BinanceService {

    getPriceAllSymbols(req, res) {
        const binanceApiUrl = 'https://api.binance.com';
        const url = binanceApiUrl + '/api/v3/ticker/price';

        https.get(url, response => {

            response.setEncoding('utf8');
            let body = '';
            response.on('data', data => {
                body += data;
            });
            response.on('end', () => {
                body = JSON.parse(body);
                res.send(body);
            });


        }).on('error', err => {
            console.log('---- Network connection issue --------');
            console.log(err)
            res.send({ 'statusCode': 'NET_ERR' });
        });
    }
}

module.exports = BinanceService;

