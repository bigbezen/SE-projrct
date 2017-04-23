/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var managerServices = require('../communication/managerServices');

var moment = require('moment');
var NotificationSystem = require('react-notification-system');
var userServices = require('../communication/userServices');



var options = {
    noDataText: constantStrings.NoDataText_string
};

var ReportsMonthlyHours = React.createClass({
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
            report: undefined
        }
    },
    componentWillMount() {
    },

    onClickExportReport: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        managerServices.exportMonthlyAnalysisReport(chosenYear)
            .then(function(data){
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc',
                });
            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            });
    },

    onClickGetReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var datepickerVal = this.refs.datepicker.value.split('-');
        managerServices.getMonthlyHoursReportData(datepickerVal[0], datepickerVal[1])
            .then(function(data){
                var report = data;
                self.setState({
                    report: report
                })
            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
                self.setState({
                    report: undefined
                })
            })

    },

    onClickEditReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        if(this.state.report != undefined) {
            managerServices.updateMonthlyAnalysisReport(this.state.report.year, this.state.report)
                .then(function (data) {
                    notificationSystem.addNotification({
                        message: constantStrings.editSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                    });
                })
                .catch(function (err) {
                    notificationSystem.addNotification({
                        message: err,
                        level: 'error',
                        autoDismiss: 1,
                        position: 'tc',
                    });
                });
        }
    },



    renderReport: function(){
        if(this.state.report == undefined){
            return (
                <div></div>
            )
        }
        else {
            var report = this.state.report;
            return (
                <div className="w3-container">

                </div>
            )
        }
    },

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col=sm-12">
                    <div className="row text-center">
                        <h2>{constantStrings.reportsMonthlyUserHoursReportTitle_string}</h2>
                    </div>
                    <div className="row">
                        <input className="col-sm-1 w3-card-4 w3-round-xlarge" ref="datepicker" type="month"/>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickGetReport}>{constantStrings.reportsShowReport_string}</button>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickEditReport}>{constantStrings.editReport_string}</button>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>

                    </div>
                    {this.renderReport()}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }

});

module.exports = ReportsMonthlyHours;
