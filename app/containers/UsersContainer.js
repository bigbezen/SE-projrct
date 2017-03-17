var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var helpers = require('../utils/Helpers');
var managementServices = require('../communication/managementServices');
var flatten = require('flat');
var moment = require('moment');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var NotificationSystem = require('react-notification-system');


function dateFormatter(cell, row) {
    return moment(cell).format('YYYY-MM-DD');
}

function flatList(users) {
    var output = [];
    for(var i = 0; i < users.length; i++)
        output.push(flatten(users[i]));
    return output;
}

var options = {
    noDataText: constantStrings.NoDataText_string
};

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
        var self = this;
        managementServices.getAllUsers().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    var flatUsers = flatList(result.info);
                    self.setState({
                        users: flatUsers
                    });
                    console.log("works!!");
                } else {
                    console.log("error in getAllUsers: " + result.info);
                    alert("Error while retrieving all users from the server: "+ result.info);
                }
            } else {
                console.log("error in userContainers: " + n);
            }
        })
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('User #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: paths.manager_userDetails_path,
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
        notificationSystem.addNotification({
            message: "are you sure?",
            level: 'info',
            autoDismiss: 0,
            position: 'tc',
            action: {
                label: 'Yes',
                callback:
                    function(){
                        self.handleDeleteUser(row)
                    }
            }
        });

    },
    handleDeleteUser: function(row){
        this.setState({
            users: null
        });
        var self = this;
        managementServices.deleteUser(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateUsers();
                    console.log("works!!");
                } else {
                    console.log("error in deleteUser: " + result.info);
                    alert("Error while deleting user from the server: "+ result.info);
                }
            } else {
                console.log("error in deleteUser: " + n);
            }
        })
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_userDetails_path
        })
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="w3-card-2"
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
                className="w3-card-2"
                type="button"
                onClick={() =>
                    this.onClickDeleteButton(cell, row, rowIndex)}>
                {constantStrings.delete_string}
            </button>
        )
    },
    renderTable: function () {
        return (
            <div className="col-sm-offset-1 col-sm-10" style={styles.marginBottom}>
                <button className="w3-card-2 w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddButton}> + </button>
                <BootstrapTable data={this.state.users} options={options} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'personal.id'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterID_string} }
                        isKey = {true}>
                        {constantStrings.userID_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'personal.firstName'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterFirstName_string} }>
                        {constantStrings.firstName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'personal.lastName'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterLastName_string} }>
                        {constantStrings.lastName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'personal.sex'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.user_gender }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectGender_string, options: constantStrings.user_gender } }>
                    {constantStrings.gender_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'jobDetails.userType'
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
                        dataFormat = {this.editButton}>
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        dataFormat = {this.deleteButton}>
                    </TableHeaderColumn>
                </BootstrapTable>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },
    /*
     <TableHeaderColumn
     dataField = 'startDate'
     dataAlign = 'right'
     dataFormat={ dateFormatter }
     filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
     {constantStrings.startDate_string}
     </TableHeaderColumn>
   * */

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