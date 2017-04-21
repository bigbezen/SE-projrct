
var React = require('react');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var managementServices = require('../communication/managementServices');
var managerServices = require('../communication/managerServices');

var moment = require('moment');
var NotificationSystem = require('react-notification-system');
var EditIcon = require('react-icons/lib/md/edit');
var userServices = require('../communication/userServices');



var options = {
    noDataText: constantStrings.NoDataText_string
};

var ReportsBase = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{

        }
    },
    componentDidMount() {
    },

    onClickSalesReport: function(){
        this.context.router.push({
            pathname: paths.manager_salesReport_path
        })
    },

    onClickMonthlyAnalysisReport: function() {
        this.context.router.push({
            pathname: paths.manager_monthlyAnalysisReport_path
        })
    },

    render: function () {
        return (
            <div className="w3-container">
                <button className="w3-card-4 w3-btn w3-theme-d5 col-sm-3 col-sm-offset-1 w3-round-xlarge w3-xxlarge"
                style={{marginRight: '13%'}}
                onClick={this.onClickSalesReport}>
                    {constantStrings.reportsSalesReportTitle_string}
                </button>
                <button className="w3-card-4 w3-btn w3-theme-d5 col-sm-3 w3-round-xlarge w3-xxlarge">
                    {constantStrings.reportsMonthlyUserHoursReportTitle}
                </button>
                <button className="w3-card-4 w3-btn w3-theme-d5 col-sm-3 w3-round-xlarge w3-xxlarge"
                        onClick={this.onClickMonthlyAnalysisReport}>
                    {constantStrings.reportsMonthlyAnalysisReportTitle_string}
                </button>
            </div>
        )
    }

});

module.exports = ReportsBase;