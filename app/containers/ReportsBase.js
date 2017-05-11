
var React               = require('react');
var constantStrings     = require('../utils/ConstantStrings');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/styles');
var userServices        = require('../communication/userServices');
var Chart1              = require('react-icons/lib/ti/chart-bar-outline');
var Chart2              = require('react-icons/lib/ti/chart-area-outline');
var Chart3              = require('react-icons/lib/ti/chart-pie-outline');
var NotificationSystem  = require('react-notification-system');

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
        return{}
    },

    onClickSalesReport: function(){
        this.context.router.push({
            pathname: paths.manager_salesReport_path
        })
    },

    onClickMonthlyAnalysisReport: function() {
        this.context.router.push({
            pathname: paths.manager_monthlyAnalysisReport_path
        });
    },

    onClickMonthlyHoursReport: function() {
        this.context.router.push({
            pathname: paths.manager_monthlyHoursReport_path
        });
    },

    onClickHumanResourcesReport: function() {
        this.context.router.push({
            pathname: paths.manager_humanResourcesReport_path
        });
    },

    render: function () {
        return (
            <div className="w3-container" style={styles.marginTop}>

                <div className="col-sm-12" style={{marginBottom: '20px'}}>
                    <button className="w3-card-4 w3-btn w3-theme-d5 w3-circle w3-xlarge"
                    style={{marginRight: '13%', display: 'inline'}}
                    onClick={this.onClickSalesReport}>
                        <Chart1/>
                    </button>
                    <h1 style={{display: 'inline'}}>{constantStrings.reportsSalesReportTitle_string}</h1>
                </div>
                <div className="col-sm-12" style={{marginBottom: '20px'}}>
                    <button className="w3-card-4 w3-btn w3-theme-d5 w3-circle w3-xlarge"
                            style={{marginRight: '13%', display: 'inline'}}
                            onClick={this.onClickMonthlyHoursReport}>
                        <Chart2/>
                    </button>
                    <h1 style={{display: 'inline'}}>{constantStrings.reportsMonthlyUserHoursReportTitle_string}</h1>
                </div>
                <div className="col-sm-12" style={{marginBottom: '20px'}}>
                    <button className="w3-card-4 w3-btn w3-theme-d5 w3-circle w3-xlarge"
                            style={{marginRight: '13%', display: 'inline'}}
                            onClick={this.onClickMonthlyAnalysisReport}>
                        <Chart3/>
                    </button>
                    <h1 style={{display: 'inline'}}>{constantStrings.reportsMonthlyAnalysisReportTitle_string}</h1>
                </div>
                <div className="col-sm-12" style={{marginBottom: '20px'}}>
                    <button className="w3-card-4 w3-btn w3-theme-d5 w3-circle w3-xlarge"
                            onClick={this.onClickHumanResourcesReport}
                            style={{marginRight: '13%', display: 'inline'}}>
                        <Chart3/>
                    </button>
                    <h1 style={{display: 'inline'}}>{constantStrings.reportsHumanResourcesReportTitle_string}</h1>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ReportsBase;