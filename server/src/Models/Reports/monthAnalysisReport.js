var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var monthAnalysisReport = new Schema({
    'year': Number,
    'monthData': [{
        'month': Number,
        'totalHours': {
            'traditional': Number,
            'organized': Number
        },
        'salesmanCount': {
            'traditional': Number,
            'organized': Number
        },
        'saleBattlesCount': {
            'traditional': Number,
            'organized': Number
        },
        'monthlyEncoragement': [{
            'encouragemant':{type: mongoose.Schema.Types.ObjectId, ref: 'encouragement'},
            'amount': Number}]
    }]
});

var monthAnalysisReport = mongoose.model('monthAnalysisReport', monthAnalysisReport);
module.exports = monthAnalysisReport;
