
const path = require('path');

module.exports = [
    {packagePath: './config', 'config-path': [path.join(__dirname, '../../config/config.json')]},
    './commutils',
    './dataaccessor',
    './login',
    './express'
];

