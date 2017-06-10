/**
 * Created by lihiverchik on 17/01/2017.
 */

var React               = require('react');
var ReactBsTable        = require("react-bootstrap-table");
var BootstrapTable      = ReactBsTable.BootstrapTable;
var TableHeaderColumn   = ReactBsTable.TableHeaderColumn;
var constantStrings     = require('../utils/ConstantStrings');
var managementServices  = require('../communication/managementServices');
var managerServices     = require('../communication/managerServices');
var paths               = require('../utils/Paths');
var moment              = require('moment');
var flatten             = require('flat');
var styles              = require('../styles/managerStyles/styles');
var TrashIcon           = require('react-icons/lib/fa/trash-o');
var EditIcon            = require('react-icons/lib/md/edit');
var DownloadIcon        = require('react-icons/lib/md/email');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');
var sorting             = require('../utils/SortingMethods');

import 'react-date-picker/index.css';
import { DateField, DatePicker } from 'react-date-picker';

var options = {
    noDataText: constantStrings.NoDataText_string,
    defaultSortName: 'startTime',  // default sort column name
    defaultSortOrder: 'desc'  // default sort order
};

function flatList(shifts) {
    var output = [];
    for(var i = 0; i < shifts.length; i++)
        output.push(flatten(shifts[i]));
    return output;
}

function dateFormatter(cell, row) {
    return moment(cell).format('DD/MM/YYYY');
}

function timeFormatter(cell, row) {
    return moment(cell).format('H:mm');
}

var ShiftsFinishedContainer = React.createClass({

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
        var currentDate = moment().format('YYYY-MM-DD');
        return{
            shifts: null,
            startDate: currentDate,
            endDate:currentDate
        }
    },

    componentDidMount: function() {
        let month = (new Date()).getMonth();
        let year = (new Date()).getFullYear();
        let beginningOfMonth = moment(new Date(year, month, 1)).format('YYYY-MM-DD');
        let endOfMonth = moment(new Date(year, month + 1, 0)).format('YYYY-MM-DD');
        this.updateShifts(beginningOfMonth, endOfMonth);
    },

    updateShifts(startDate, endDate) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getShiftsOfRange(startDate,endDate).then(function (result) {
            result = result.filter((shift) => shift.status == "FINISHED" && !(shift.type.includes(constantStrings.shiftType_event)));
            let areas = new Set(result.map((shift) => shift.storeId.area));
            let areaToShifts = {};
            for(let area of areas){
                areaToShifts[area] = result.filter((shift) => shift.storeId.area == area)
                    .sort(sorting.shiftSortingByAgent);
                areaToShifts[area] = flatList(areaToShifts[area]);
            }
            //var flatShifts = flatList(result);
            self.setState({
                shifts: areaToShifts,
                startDate: startDate,
                endDate: endDate
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    onClickEditButton: function(cell, row, rowIndex){
        this.context.router.push({
            pathname: paths.manager_shiftDetails_path,
            query: row
        })
    },

    onClickGetReportButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;

        managerServices.getSaleReportXl(row).then(function (n) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: constantStrings.mailSentSuccess_string,
                level: 'success',
                autoDismiss: 1,
                position: 'tc'
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    onClickDeleteButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;

        var self = this;
        notificationSystem.clearNotifications();
        notificationSystem.addNotification({
            message: constantStrings.areYouSure_string,
            level: 'info',
            autoDismiss: 0,
            position: 'tc',
            action: {
                label: constantStrings.yes_string,
                callback:
                    function(){
                        self.handleDeleteShift(row)
                    }
            }
        });
    },

    handleDeleteShift: function(row){
        this.setState({
            shifts: null
        });
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteShift(row).then(function (n) {
            self.updateShifts(self.state.startDate, self.state.endDate);
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },
    handleFinishShift: function(row){
        this.setState({
            shifts: null
        });
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managerServices.managerFinishShift(row._id).then(function (n) {
            self.updateShifts(self.state.startDate, self.state.endDate);
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },
    onClickAddShift: function(){
        this.context.router.push({
            pathname: paths.manager_shiftDetails_path
        })
    },

    onClickAddShiftsButton: function(){
        this.context.router.push({
            pathname: paths.manager_createShifts_path
        })
    },
    onClickFinishShift(cell, row, rowIndex) {
        var notificationSystem = this.refs.notificationSystem;

        var self = this;
        notificationSystem.clearNotifications();
        notificationSystem.addNotification({
            message: constantStrings.areYouSureFinishShift_string,
            level: 'info',
            autoDismiss: 0,
            position: 'tc',
            action: {
                label: constantStrings.yes_string,
                callback:
                    function(){
                        self.handleFinishShift(row)
                    }
            }
        });
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        var isFinished = (row.status == 'FINISHED');
        var isStarted = (row.status == 'STARTED');
        if (isFinished) {
            return (
                <button
                    className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                    style={styles.buttonStyle}
                    type="button"
                    onClick={() =>
                        this.onClickGetReportButton(cell, row, rowIndex)}>
                    <DownloadIcon style={styles.iconStyle}/>
                </button>
            )
        } else if (!isStarted) {
            return (
                <button
                    className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                    style={styles.buttonStyle}
                    type="button"
                    onClick={() =>
                        this.onClickEditButton(cell, row, rowIndex)}>
                    <EditIcon style={styles.iconStyle}/>
                </button>
            )
        } else {
            return (
                <button
                    className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                    style={styles.buttonStyle}
                    type="button"
                    onClick={() =>
                        this.onClickFinishShift(cell, row, rowIndex)}>
                    סיים
                </button>
            )
        }
    },

    deleteButton: function(cell, row, enumObject, rowIndex) {
        var isFinished = (row.status == 'FINISHED');
        var isStarted = (row.status == 'STARTED');
        if (!isFinished && !isStarted) {
            return (
                <button
                    className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                    style={styles.buttonStyle}
                    type="button"
                    disabled= {isFinished}
                    onClick={() =>
                        this.onClickDeleteButton(cell, row, rowIndex)}>
                    <TrashIcon style={styles.iconStyle}/>
                </button>
            )
        }
    },

    changeStartDate: function (date) {
        var startDateValue = moment(date).toDate();
        var endDateValue = moment(this.refs.endDateBox.state.value).toDate();
        this.updateShifts(startDateValue,endDateValue);
    },
    changeEndDate: function (date) {
        var startDateValue = moment(this.refs.startDateBox.state.value).toDate();
        var endDateValue = moment(date).toDate();
        this.updateShifts(startDateValue,endDateValue);
    },

    renderAreaTable: function(area){
        let shiftsOfArea = this.state.shifts[area];
        return (
            <div className="w3-round w3-card-2" style={styles.shiftTableStyle}>
                <h1>{area}</h1>
                <BootstrapTable data={shiftsOfArea} options={options} bordered={false} hover search
                                searchPlaceholder={constantStrings.search_string}
                                containerStyle={{border: '2px solid rgba(0, 0, 0, 0.28)'}}
                >
                    <TableHeaderColumn
                        dataField = 'storeId.managerName'
                        dataAlign = 'right'
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterAgentName_string} }>
                        {constantStrings.managerName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'storeId.name'
                        dataAlign = 'right'
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        dataAlign = 'right'
                        dataSort = {true}
                        dataFormat={ dateFormatter }>
                        {constantStrings.date_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        dataAlign = 'right'
                        dataFormat={ timeFormatter }>
                        {constantStrings.startTime_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'endTime'
                        dataAlign = 'right'
                        dataFormat={ timeFormatter }>
                        {constantStrings.endTime_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'status'
                        dataAlign = 'right'
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterStatus_string} }>
                        {constantStrings.status_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'type'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterType_string} }>
                        {constantStrings.type_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'salesmanId.username'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterSalesmanName_string} }>
                        {constantStrings.salesman_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width = '50'
                        dataFormat = {this.editButton}/>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width = '50'
                        dataFormat = {this.deleteButton}/>
                </BootstrapTable>
            </div>
        )
    },

    renderTable: function () {
        return (
            <div className="col-xs-12" style={styles.marginBottom}>
                <div className="col-sm-12">
                    <div>
                        <p className="col-xs-2" style={styles.dateLabel}>{constantStrings.startDate_string}:</p>
                        <DateField
                            dateFormat="DD-MM-YYYY"
                            forceValidDate={true}
                            defaultValue={(new Date(this.state.startDate)).getTime()}
                            ref="startDateBox"
                            updateOnDateClick={true}
                            collapseOnDateClick={true}
                            onChange={(dateString, { dateMoment, timestamp }) => this.changeStartDate(dateMoment)}>
                        </DateField>
                    </div>
                    <div>
                        <p className="col-xs-2" style={styles.dateLabel}>{constantStrings.endDate_string}:</p>
                        <DateField
                            dateFormat="DD-MM-YYYY"
                            forceValidDate={true}
                            defaultValue={(new Date(this.state.endDate)).getTime()}
                            ref="endDateBox"
                            updateOnDateClick={true}
                            collapseOnDateClick={true}
                            onChange={(dateString, { dateMoment, timestamp }) => this.changeEndDate(dateMoment)}>
                        </DateField>
                    </div>
                </div>
                {Object.keys(this.state.shifts).map(this.renderAreaTable)}
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.shifts != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftsFinishedContainer;