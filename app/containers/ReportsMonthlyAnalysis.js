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
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            report: undefined
        }
    },
    componentWillMount() {
    },

    onClickGetReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        managerServices.getMonthlyAnalysisReportData(chosenYear)
            .then(function(data){
                var report = data.info;
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

    renderMonthSections: function(sectionData, index){
        return (
            <div style={styles.col} className="w3-theme-l5 w3-round-large">
                <p>{sectionData['section']}</p>
                <input type="number" className="w3-round-large" style={{width: '100px'}} />
            </div>
        )
    },

    renderMonthData: function(monthData, index){
        var dataAsArray = [];
        for(var key in monthData){
            if(key != 'month' && key != '_id' && key != 'monthlyEncoragement') {
                var value = monthData[key];
                value['section'] = key;
                dataAsArray.push(value)
            }
        }
        return (
            <div className="w3-container w3-theme-d5 w3-round-large" style={{marginTop: '20px'}}>
                <h3 className="col-sm-1">{constantStrings.numberToMonth[monthData.month]}</h3>
                <div className="row">
                    {dataAsArray.map(this.renderMonthSections)}
                </div>
                <div className="row col-sm-offset-1">
                    {dataAsArray.map(this.renderMonthSections)}
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

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col-sm-offset-1 col=sm-10">
                    <div className="row">
                        <input className="col-sm-1 w3-card-4 w3-round-xlarge" ref="datepicker" type="number" min="2000" max="2099"
                               defaultValue={year}/>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickGetReport}>דוח הפק</button>
                    </div>
                    {this.renderReport()}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }

});

module.exports = ReportsMonthlyAnalysis;
