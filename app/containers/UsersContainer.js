var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var helpers = require('../utils/Helpers');
var managementServices = require('../communication/managementServices');
var managerServices = require('../communication/managerServices');
var userServices = require('../communication/userServices');
var flatten = require('flat');
var moment = require('moment');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var NotificationSystem = require('react-notification-system');
var TrashIcon = require('react-icons/lib/fa/trash-o');
var EditIcon = require('react-icons/lib/md/edit');
var userServices = require('../communication/userServices');

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
        this.setSessionId();
        this.setUserType();
        return{
            users: null,
            username: null
        }
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    componentWillMount() {
        this.updateUsers();
        this.updateUsername();
    },
    updateUsername(){
        var name = userServices.getUsername();
        this.setState({
            username : name
        })
    },
    updateUsers() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllUsers().then(function (n) {
            if (n) {
                var flatUsers = flatList(n);
                self.setState({
                    users: flatUsers
                });
            } else {
                console.log("error in userContainers: " + n);
            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
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
        if(row.username==this.state.username){
            notificationSystem.addNotification({
                message: constantStrings.cannotDeleteSelf_string,
                level: 'info',
                autoDismiss: 0,
                position: 'tc',
                action: {
                    label: constantStrings.close_string
                }
            });
        }else{
            notificationSystem.addNotification({
                message: constantStrings.areYouSure_string,
                level: 'info',
                autoDismiss: 0,
                position: 'tc',
                action: {
                    label: constantStrings.yes_string,
                    callback:
                        function(){
                            self.handleDeleteUser(row)
                        }
                }
            });
        }
    },
    handleDeleteUser: function(row){
        this.setState({
            users: null
        });
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteUser(row).then(function (n) {
            if (n) {
                self.updateUsers();
            } else {
                console.log("error in deleteUser: " + n);
            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_userDetails_path
        })
    },
    onClickGetReportButton: function(cell, row, rowIndex){
        var notificationSystem = this.refs.notificationSystem;
        managerServices.getSalesmanListXL().then(function (n) {
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 3,
                    position: 'tc'
                });
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="w3-card-2"
                type="button"
                onClick={() =>
                    this.onClickEditButton(cell, row, rowIndex)}>
                <EditIcon/>
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
                <TrashIcon/>
            </button>
        )
    },
    renderTable: function () {
        return (
            <div className="col-xs-12" style={styles.marginBottom}>
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle " onClick={this.onClickAddButton}> + </button>
                <span className="pull-left">
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-round" style={styles.getReportButtonStyle} onClick={this.onClickGetReportButton}> הורד דוח </button>
                </span>
                    <BootstrapTable data={this.state.users} options={options} bordered={false} hover search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'personal.id'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterID_string} }
                        isKey = {true}>
                        {constantStrings.userID_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'username'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterUsername_string} }>
                        {constantStrings.username_string}
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
                        width="4%"
                        dataFormat = {this.editButton}>
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width="4%"
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