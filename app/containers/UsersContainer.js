var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var helpers = require('../utils/Helpers');
var managementServices = require('../communication/managementServices');

function dateFormatter(cell, row) {
    return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
}

var UsersContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            users: null
        }
    },
    componentWillMount() {
        this.updateUsers();
    },
    updateUsers() {
        /*this.setState({
            users: managementServices.getAllUsers()
        }); */
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
        managementServices.deleteUser(row);
        this.updateUsers();
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: '/LoggedIn/User'
        })
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
    renderTable: function () {
        return (
            <div className="col-sm-offset-1 col-sm-10">
                <button className="w3-btn-floating" onClick={this.onClickAddButton}> + </button>
                <BootstrapTable data={this.state.users} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.user_gender }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectGender_string, options: constantStrings.user_gender } }>
                    {constantStrings.gender_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'userType'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.user_role }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectRole_string, options: constantStrings.user_role } }>
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
    },
    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
            </div>
        )
    },
    render: function () {
        if(this.state.users != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = UsersContainer;