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

var ShiftsCreationContainer = React.createClass({

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
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
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
        this.setShiftsEndDate();
        this.setShiftsStartDate();
        var currentDate = moment().format('YYYY-MM-DD');
        return{
            shifts: null,
            startDate: currentDate,
            endDate:currentDate,
            shiftsToDelete: []
        }
    },

    componentDidMount: function() {
        let month = (new Date()).getMonth();
        let year = (new Date()).getFullYear();
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment(new Date(year, month, 1)).format('YYYY-MM-DD');
        }
        let endOfMonth = localStorage.getItem('shiftEndDate');
        if (!endOfMonth) {
            endOfMonth = moment(new Date(year, month + 1, 0)).format('YYYY-MM-DD');
        }
        this.updateShifts(shiftStartDate, endOfMonth);
    },

    updateShifts(startDate, endDate) {
        localStorage.setItem('shiftStartDate', startDate);
        localStorage.setItem('shiftEndDate', endDate);
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getShiftsOfRange(startDate,endDate).then(function (result) {
            result = result.filter((shift) => shift.status == "CREATED");
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
                endDate: endDate,
                shiftsToDelete: []
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

    onClickMoveToSetSalesmen: function(){
        this.context.router.push({
            pathname: paths.manager_createMultipleShifts_path
        })
    },

    onClickDeleteShifts: function() {
        let notificationSystem = this.refs.notificationSystem;
        let self = this;
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
                        self.handleDeleteShifts()
                    }
            }
        });
    },

    handleDeleteShifts: function() {
        let notificationSystem = this.refs.notificationSystem;
        let self = this;
        managementServices.deleteCreatedShifts(this.state.shiftsToDelete)
            .then(function(result) {
                self.updateShifts(self.state.startDate, self.state.endDate);
            })
            .catch(function(errMsg) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMsg,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
                self.updateShifts(self.state.startDate, self.state.endDate);
            })
    },

    editButton: function(cell, row, enumObject, rowIndex) {
        var isFinished = (row.status == 'FINISHED');
        var isStarted = (row.status == 'STARTED');
        if (isFinished) {
            return (
                <button
                    className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                    style={styles.buttonStyle}
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
                    onClick={() =>
                        this.onClickEditButton(cell, row, rowIndex)}>
                    <EditIcon style={styles.iconStyle}/>
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

    onRowSelect: function(shift, isSelected, e){
        let newShifts = this.state.shiftsToDelete;
        if (isSelected) {
            newShifts.push(shift._id);
        }
        else {
            newShifts = this.state.shiftsToDelete.filter((id) => id != shift._id);
        }
        this.setState({
            shiftsToDelete: newShifts
        })
    },

    onSelectAll: function(isSelected, shifts){
        let newShifts = this.state.shiftsToDelete;
        if (isSelected) {
            let newIds = shifts.map((shift) => shift._id);
            newShifts = this.state.shiftsToDelete.concat(newIds);
        }
        else {
            for(let shift of shifts) {
                newShifts = newShifts.filter((id) => id != shift._id);
            }
        }
        this.setState({
            shiftsToDelete: newShifts
        });
    },

    selectRowProp:function() {
        return {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        }
    },

    renderAreaTable: function(area){
        let shiftsOfArea = this.state.shifts[area];
        return (
            <div style={styles.shiftTableStyle} className="w3-round w3-card-2">
                <h1>{area}</h1>
                <BootstrapTable selectRow={this.selectRowProp()}
                                data={shiftsOfArea} options={options} bordered={false} hover search
                                searchPlaceholder={constantStrings.search_string}
                                containerStyle={{border: '2px solid rgba(0, 0, 0, 0.28)'}}>
                    <TableHeaderColumn
                        dataField = 'storeId.managerName'
                        dataAlign = 'right'
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterAgentName_string} }>
                        {constantStrings.managerName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'storeId.name'
                        dataAlign = 'right'
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        sort = {true}
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
                    <TableHeaderColumn
                        dataField = '_id'
                        dataAlign = 'right'
                        width = '0'
                        isKey = {true}
                    />
                </BootstrapTable>
            </div>
        )
    },

    renderDeletebutton: function() {
        if(this.state.shiftsToDelete.length > 0)
            return (
                <button style={styles.deleteButton} className="w3-card-4 w3-button w3-ripple w3-margin-top w3-round" onClick={this.onClickDeleteShifts}>{constantStrings.deleteSelectedShifts_string}</button>
            );
        else
            return (
                <button disabled style={styles.deleteButton} className="w3-card-4 w3-button w3-ripple w3-margin-top w3-round" onClick={this.onClickDeleteShifts}>{constantStrings.deleteSelectedShifts_string}</button>
            );
    },

    renderTable: function () {
        return (
            <div className="col-xs-12">
                <div className="col-sm-12">
                    <button style={styles.addButton} className="w3-card-4 w3-button w3-ripple w3-margin-top w3-circle" onClick={this.onClickAddShift}> + </button>
                    <button style={styles.addButton} className="w3-card-4 w3-button w3-ripple w3-margin-top w3-round" onClick={this.onClickMoveToSetSalesmen}>{constantStrings.setSalesmanAndPublish_string}</button>
                    <button style={styles.addButton} className="w3-card-4 w3-button w3-ripple w3-margin-top w3-round" onClick={this.onClickAddShiftsButton}>{constantStrings.addMultipleShifts_string}</button>
                    {this.renderDeletebutton()}
                    <div>
                        <p className="col-sm-2" style={styles.dateLabel}>{constantStrings.startDate_string}:</p>
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
                        <p className="col-sm-2" style={styles.dateLabel}>{constantStrings.endDate_string}:</p>
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

module.exports = ShiftsCreationContainer;