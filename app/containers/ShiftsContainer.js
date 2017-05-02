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

var options = {
    noDataText: constantStrings.NoDataText_string
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

var ShiftsContainer = React.createClass({

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
        var currentDate = moment().format('YYYY-MM-DD');
        this.updateShifts(currentDate, currentDate);
    },

    updateShifts(startDate, endDate) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getShiftsOfRange(startDate,endDate).then(function (result) {
            var flatShifts = flatList(result);
            self.setState({
                shifts: flatShifts,
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
            self.updateShifts();
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

    editButton: function(cell, row, enumObject, rowIndex) {
        var isFinished = (row.status == 'FINISHED');
        var isStarted = (row.status == 'STARTED');
        if (isFinished) {
            return (
                <button
                    className="w3-card-2"
                    type="button"
                    onClick={() =>
                        this.onClickGetReportButton(cell, row, rowIndex)}>
                    <DownloadIcon/>
                </button>
            )
        } else if (!isStarted) {
            return (
                <button
                    className="w3-card-2"
                    type="button"
                    onClick={() =>
                        this.onClickEditButton(cell, row, rowIndex)}>
                    <EditIcon/>
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
                    className="w3-card-2"
                    type="button"
                    disabled= {isFinished}
                    onClick={() =>
                        this.onClickDeleteButton(cell, row, rowIndex)}>
                    <TrashIcon/>
                </button>
            )
        }
    },

    changeDate: function () {
        var startDateValue = this.refs.startDateBox.value;
        var endDateValue = this.refs.endDateBox.value;
        this.updateShifts(startDateValue,endDateValue);
    },

    renderTable: function () {
        return (
            <div className="col-xs-12" style={styles.marginBottom}>
                <div className="col-sm-12">
                    <button style={styles.addButton} className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddShift}> + </button>
                    <button style={styles.addButton} className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-round-xlarge" onClick={this.onClickAddShiftsButton}>{constantStrings.addMultipleShifts_string}</button>
                    <p style={styles.dateLabel}>{constantStrings.startDate_string}:</p><input style={styles.dateInput} type="date" value={this.state.startDate} ref="startDateBox" onChange= {this.changeDate} />
                    <p style={styles.dateLabel}>{constantStrings.endDate_string}:</p><input style={styles.dateInput} type="date" value={this.state.endDate} ref="endDateBox" onChange={this.changeDate} />
                </div>
                    <BootstrapTable data={this.state.shifts} options={options} bordered={false} hover search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'storeId.name'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        dataAlign = 'right'
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
                        dataSort = {true}
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
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
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

module.exports = ShiftsContainer;