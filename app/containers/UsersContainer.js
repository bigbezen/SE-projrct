var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');

var users =
    [{
        startDate : new Date('12/12/16'),
        id : '543564365',
        firstName : 'שחף',
        lastName : 'שטיין',
        sex : 'זכר',
        userType: 'סוכן שטח',
    },
        {
            startDate : new Date('12/4/16'),
            id : '123456789',
            firstName : 'ליהיא',
            lastName : 'ורצ׳יק',
            sex : 'נקבה',
            userType: 'דייל',
    }];

function dateFormatter(cell, row) {
    return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
}

var UsersContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('User #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: '/LoggedIn/User',
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        console.log('User #', rowIndex);
        console.log(row);
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                onClick={() =>
                    this.onClickEditButton(cell, row, rowIndex)}>
                {constantStrings.edit_string}
            </button>
        )
    },
    deleteButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                onClick={() =>
                    this.onClickDeleteButton(cell, row, rowIndex)}>
                {constantStrings.delete_string}
            </button>
        )
    },
    render: function () {
        return (
            <div className="col-sm-offset-1 col-sm-10">
                <BootstrapTable data={users} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'id'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterID_string} }
                        isKey = {true}>
                        {constantStrings.userID_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'firstName'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterFirstName_string} }>
                        {constantStrings.firstName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'lastName'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterLastName_string} }>
                        {constantStrings.lastName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'sex'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.selectGender_string} }>
                        {constantStrings.gender_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'userType'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.selectRole_string} }>
                        {constantStrings.role_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startDate'
                        dataAlign = 'right'
                        dataFormat={ dateFormatter }
                        filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
                        {constantStrings.startDate_string}
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
    }
});

module.exports = UsersContainer;