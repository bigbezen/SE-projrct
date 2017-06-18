/**
 * Created by lihiverchik on 17/12/2016.
 */
var React               = require('react');
var constantStrings     = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/styles');
var managerServices     = require('../communication/managerServices');
var moment              = require('moment');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var ReportsMonthlyAnalysis = React.createClass({

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
    setShiftsEndDate: function() {
        var shiftEndDate = localStorage.getItem('shiftEndDate');
        if (!shiftEndDate) {
            shiftEndDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftEndDate', shiftEndDate);
    },
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return{
            report: undefined,
            showLoader: false
        }
    },
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
    },
    onClickExportReport: function() {
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        var self = this;
        this.setState({
            showLoader: true
        });
        managerServices.exportMonthlyAnalysisReport(chosenYear)
            .then(function(data){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                });
                self.setState({
                    showLoader: false
                });
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
                self.setState({
                    showLoader: false
                });
            });
    },

    onClickGetReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        self.setState({
            showLoader: true
        });
        managerServices.getMonthlyAnalysisReportData(chosenYear)
            .then(function(data){
                var report = data;
                self.setState({
                    report: report,
                    showLoader: false
                })
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
                self.setState({
                    report: undefined,
                    showLoader: false
                })
            })
    },

    onClickEditReport: function(){
        var notificationSystem = this.refs.notificationSystem;
        if(this.state.report != undefined) {
            managerServices.updateMonthlyAnalysisReport(this.state.report.year, this.state.report)
                .then(function (data) {
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantStrings.editSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                    });
                })
                .catch(function (err) {
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: err,
                        level: 'error',
                        autoDismiss: 0,
                        position: 'tc',
                    });
                });
        }
    },

    onChangeValue: function(month, section, channel) {
        var report = this.state.report;
        var newVal = this.refs[month + "#" + section + "#" + channel].value;
        report.monthData[month-1][section][channel] = newVal;
    },

    onChangeEncValue: function(month, index){
        var report = this.state.report;
        var newVal = this.refs[month + "#" + index].value;
        report.monthData[month-1]["monthlyEncoragement"][index]["amount"] = newVal;
        console.log(this.state.report.monthData[month-1]["monthlyEncoragement"][index]["amount"] = newVal);
    },

    renderMonthSections: function(sectionData, index){
        return (
            <div style={styles.col} className="w3-round">
                <p><b>{constantStrings.dictionary[sectionData['section']]}</b></p>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-12">{constantStrings.dictionary["traditionalHot"]}</p>
                    <b className="w3-round col-sm-12">
                        {(sectionData.traditionalHot).toFixed(2)}
                    </b>
                </div>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-12">{constantStrings.dictionary["traditionalOrganized"]}</p>
                    <b className="w3-round col-sm-12">
                        {(sectionData.traditionalOrganized).toFixed(2)}
                    </b>
                </div>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-12">{constantStrings.dictionary["organized"]}</p>
                    <b className="w3-round col-sm-12">
                        {(sectionData.organized).toFixed(2)}
                    </b>
                </div>

            </div>
        )
    },

    renderEncouragements: function(encouragement, index){
        return (
            <div style={styles.col} className="w3-round">
                <u className="col-sm-12">{encouragement.encouragement.name}</u>
                <b className="w3-round col-sm-12">
                    {(encouragement.amount).toFixed(2)}
                </b>

            </div>
        )
    },

    renderMonthData: function(monthData, index){
        var dataAsArray = [];
        for(var key in monthData){
            if(key != 'month' && key != '_id' && key != 'monthlyEncoragement') {
                var value = monthData[key];
                value['section'] = key;
                value['month'] = monthData.month;
                dataAsArray.push(value)
            }
        }
        for(var i in monthData.monthlyEncoragement){
            monthData.monthlyEncoragement[i]["month"] = monthData.month;
        }
        return (
            <div className="w3-container w3-round w3-card-4" style={styles.marginTop}>
                <div className="row">
                    <h3 className="col-sm-1">{constantStrings.numberToMonth[monthData.month]}</h3>
                </div>
                <div className="row" style={{borderBottom: '1px solid'}}>
                    {dataAsArray.map(this.renderMonthSections)}
                </div>
                <div className="row">
                    {monthData.monthlyEncoragement.map(this.renderEncouragements)}
                </div>
            </div>
        )
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
                    {report.monthData.map(this.renderMonthData)}
                </div>
            )
        }
    },

    loader: function() {
        if(this.state.showLoader) {
            return (
                <div className="text-center">
                    <h1>...Loading</h1>
                </div>
            );
        }
        else {
            return (
                <span></span>
            )
        }
    },

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col=sm-12">
                    <div className="row text-center">
                        <h2>{constantStrings.reportsMonthlyAnalysisReportTitle_string}</h2>
                    </div>
                    <div className="row">
                        <input className="col-sm-1 w3-card-4 w3-round" ref="datepicker" type="number" min="2000" max="2099"
                               defaultValue={year}/>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickGetReport}>{constantStrings.reportsShowReport_string}</button>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>

                    </div>
                    {this.loader()}
                    {this.renderReport()}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ReportsMonthlyAnalysis;
