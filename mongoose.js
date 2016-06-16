/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
var mongoose = require('mongoose')
module.exports.db = mongoose.connection
module.exports = mongoose.createConnection('mongodb://localhost/szuSignName')
module.exports.Schema = mongoose.Schema
// module.exports.model = mongoose.model.bind(mongoose)
