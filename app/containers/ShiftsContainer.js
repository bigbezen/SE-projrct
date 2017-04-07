/**
 * Created by lihiverchik on 17/01/2017.
 */
var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var managerServices = require('../communication/managerServices');
var helpers = require('../utils/Helpers');
var paths = require('../utils/Paths');
var moment = require('moment');
var flatten = require('flat');
var styles = require('../styles/managerStyles/styles');
var TrashIcon = require('react-icons/lib/fa/trash-o');
var EditIcon = require('react-icons/lib/md/edit');
var DownloadIcon = require('react-icons/lib/md/file-download');
var NotificationSystem = require('react-notification-system');

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
    return moment(cell).format('YYYY-MM-DD H:mm');
}

var ShiftsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            shifts: null
        }
    },
    componentWillMount() {
        this.updateShifts();
    },
    updateShifts() {
        var self = this;
        var currentDate = new Date();
        var notificationSystem = this.refs.notificationSystem;
        currentDate.setDate(currentDate.getDate()-30);
        managementServices.getShiftsFromDate(currentDate).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    var flatShifts = flatList(result.info);
                    self.setState({
                        shifts: flatShifts
                    });
                    console.log("works!!");
                } else {
                    console.log("error in getAllShifts: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });                }
            } else {
                notificationSystem.addNotification({
                    message: constantStrings.errorMessage_string,
                    level: 'error',
                    autoDismiss: 5,
                    position: 'tc'
                });            }
        })
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Shift #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: paths.manager_shiftDetails_path,
            query: row
        })
    },
    onClickGetReportButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;
        managerServices.getSaleReportXl(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    console.log("works!!");
                    notificationSystem.addNotification({
                        message: constantStrings.mailSentSuccess_string,
                        level: 'success',
                        autoDismiss: 3,
                        position: 'tc'
                    });
                } else {
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in getSaleReportXl: " + n);
            }
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
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
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateShifts();
                    console.log("works!!");
                } else {
                    console.log("error in deleteShift: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in deleteShift: " + n);
            }
        })
    },
    onClickAddButton: function(){
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
    renderTable: function () {
        return (
            <div className="col-xs-12" style={styles.marginBottom}>
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddButton}> + </button>
                <BootstrapTable data={this.state.shifts} options={options} bordered={false} hover search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'store.name'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        dataAlign = 'right'
                        dataFormat={ dateFormatter }
                        filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
                        {constantStrings.startDate_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'endTime'
                        dataAlign = 'right'
                        dataFormat={ dateFormatter }
                        filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
                        {constantStrings.endDate_string}
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
                        dataField = 'salesman.username'
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