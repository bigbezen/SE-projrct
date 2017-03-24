var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var MounthlyUserHoursReport = new Schema({
    'month': Number,
    'year': Number,
    'salesmansData': [{
        'user': [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        'numOfHours': Number,
        'monthlyEncoragement': [{
            'encouragemant':{type: mongoose.Schema.Types.ObjectId, ref: 'encouragement'},
            'amount': Number}]
    }]
});

var MounthlyUserHoursReport = mongoose.model('MounthlyUserHoursReport', MounthlyUserHoursReport);

module.exports = MounthlyUserHoursReport;