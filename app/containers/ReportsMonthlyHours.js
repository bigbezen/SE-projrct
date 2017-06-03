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

    onClickExportReport: function() {
        var notificationSystem = this.refs.notificationSystem;
        var datepickerVal = this.refs.datepicker.value.split('-');
        managerServices.exportMonthlyHoursReport(datepickerVal[0], datepickerVal[1] - 1)
            .then(function(data){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
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
            });
    },

    onClickGetReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var datepickerVal = this.refs.datepicker.value.split('-');
        managerServices.getMonthlyHoursReportData(parseInt(datepickerVal[0]), parseInt(datepickerVal[1] - 1))
            .then(function(data){
                self.setState({
                    report: data
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
                    report: undefined
                })
            })
    },

    onClickEditReport: function(){
        var notificationSystem = this.refs.notificationSystem;
        if(this.state.report != undefined) {
            managerServices.updateMonthlyHoursReport(this.state.report.year, this.state.report.month, this.state.report)
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

    onChangeValue: function(index, refName){
        var newVal = this.refs[index + refName].value;
        var report = this.state.report;
        report.salesmansData[index][refName] = newVal;
    },

    renderSalesmanData: function(salesman, index){
        return (
            <div className="col-sm-offset-1 col-sm-8 w3-card-4 w3-round">
                <p className="col-sm-3">{salesman.user.personal.firstName + " " + salesman.user.personal.lastName}</p>
                <input type="number" ref={index + "numOfHours"} min="0" style={{marginTop: '3px'}}
                       className="col-sm-2 w3-round w3-text-black" defaultValue={salesman.numOfHours}
                        onChange={() => this.onChangeValue(index, "numOfHours")} />
                <input type="number" ref={index + "sales"} min="0" style={{marginTop: '3px'}}
                       className="col-sm-2 w3-round w3-text-black" defaultValue={salesman.sales}
                       onChange={() => this.onChangeValue(index, "sales")} />
                <input type="number" ref={index + "opened"} min="0" style={{marginTop: '3px'}}
                       className="col-sm-2 w3-round w3-text-black" defaultValue={salesman.opened}
                       onChange={() => this.onChangeValue(index, "opened")} />

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
                <div className="w3-container" style={styles.marginTop}>
                    <div className="col-sm-offset-1 col-sm-8 w3-card-4 w3-round" style={styles.reportRowStyle}>
                        <p className="col-sm-3"><b>{constantStrings.fullName_string}</b></p>
                        <p className="col-sm-2"><b>{constantStrings.totalSalesmanHours_string}</b></p>
                        <p className="col-sm-2"><b>{constantStrings.reportsNumberOfProductsSold_string}</b></p>
                        <p className="col-sm-2"><b>{constantStrings.reportsNumberOfProductsOpened_string}</b></p>
                    </div>
                    {report.salesmansData.map(this.renderSalesmanData)}
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
                        <input className="col-sm-2 w3-card-4 w3-round" ref="datepicker" type="month"/>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickGetReport}>{constantStrings.reportsShowReport_string}</button>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickEditReport}>{constantStrings.editReport_string}</button>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>

                    </div>
                    {this.renderReport()}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ReportsMonthlyHours;
