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
    return moment(cell).format('YYYY-MM-DD hh:mm');
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
                    alert("Error while retrieving all shifts from the server: "+ result.info);
                }
            } else {
                console.log("error in shiftsContainer: " + n);
            }
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
        managerServices.getSaleReportXl(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    console.log("works!!");
                } else {
                    alert("Error while creating excel file: "+ result.info);
                }
            } else {
                console.log("error in getSaleReportXl: " + n);
            }
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        this.setState({
            shifts: null
        });
        var self = this;
        managementServices.deleteShift(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateShifts();
                    console.log("works!!");
                } else {
                    console.log("error in deleteShift: " + result.info);
                    alert("Error while deleting shift from the server: "+ result.info);
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
        var isFinished = (row.status == 'FINISHED'); //TODO: is this ok?
        if (isFinished) {
            return (
                <button
                    type="button"
                    onClick={() =>
                        this.onClickGetReportButton(cell, row, rowIndex)}>
                    {constantStrings.getReport_string}
                </button>
            )
        } else {
            return (
                <button
                    type="button"
                    onClick={() =>
                        this.onClickEditButton(cell, row, rowIndex)}>
                    {constantStrings.edit_string}
                </button>
            )
        }
    },
    deleteButton: function(cell, row, enumObject, rowIndex) {
        var isFinished = (row.status == 'FINISHED'); //TODO: is this ok?
        if (!isFinished) {
            return (
                <button
                    type="button"
                    disabled= {isFinished}
                    onClick={() =>
                        this.onClickDeleteButton(cell, row, rowIndex)}>
                    {constantStrings.delete_string}
                </button>
            )
        }
    },
    renderTable: function () {
        return (
            <div className="col-sm-offset-1 col-sm-10">
                <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddButton}> + </button>
                <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddShiftsButton}> +++ </button>
                <BootstrapTable data={this.state.shifts} options={options} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterManagerName_string} }>
                        {constantStrings.status_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'type'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterPhone_string} }>
                        {constantStrings.type_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'salesman.username'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterCity_string} }>
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