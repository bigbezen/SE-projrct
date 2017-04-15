var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var monthAnalysisReport = new Schema({
    'year': Number,
    'monthData': [{
        'month': Number,
        'salesmanCost':{
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'totalHours': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'shiftsCount': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'uniqueCount': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'saleBottlesCount': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'openedCount': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'saleAverage': {
            'traditionalHot': Number,
            'traditionalOrganized': Number,
            'organized': Number
        },
        'monthlyEncoragement': [{
            'encouragemant':{type: mongoose.Schema.Types.ObjectId, ref: 'encouragement'},
            'amount': Number}]
    }]
});

var monthAnalysisReport = mongoose.model('monthAnalysisReport', monthAnalysisReport);
module.exports = monthAnalysisReport;
