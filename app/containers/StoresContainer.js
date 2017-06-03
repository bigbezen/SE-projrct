var React               = require('react');
var ReactBsTable        = require("react-bootstrap-table");
var BootstrapTable      = ReactBsTable.BootstrapTable;
var TableHeaderColumn   = ReactBsTable.TableHeaderColumn;
var constantStrings     = require('../utils/ConstantStrings');
var managementServices  = require('../communication/managementServices');
var helpers             = require('../utils/Helpers');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/styles');
var TrashIcon           = require('react-icons/lib/fa/trash-o');
var EditIcon            = require('react-icons/lib/md/edit');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var options = {
    noDataText: constantStrings.NoDataText_string
};

var StoresContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            stores: null
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

    componentDidMount() {
        this.updateStores();
    },

    updateStores() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllStores().then(function (n) {
            self.setState({
                stores: n
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
            pathname: paths.manager_storeDetails_path,
            query: row
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
                        self.handleDeleteStore(row)
                    }
            }
        });
    },

    handleDeleteStore: function(row){
        this.setState({
            products: null
        });
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteStore(row).then(function (n) {
            self.updateStores();
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

    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_storeDetails_path
        })
    },

    editButton: function(cell, row, enumObject, rowIndex) {
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
    },

    deleteButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                style={styles.buttonStyle}
                type="button"
                onClick={() =>
                    this.onClickDeleteButton(cell, row, rowIndex)}>
                <TrashIcon style={styles.iconStyle}/>
            </button>
        )
    },

    renderTable: function () {
        return (
            <div className="col-xs-12" style={styles.marginBottom}>
                <button className="w3-card-4 w3-button w3-xlarge w3-circle w3-ripple" style={styles.addButtonStyle} onClick={this.onClickAddButton}> + </button>
                <div className="w3-round" style={styles.tableStyle}>
                <BootstrapTable data={this.state.stores} options={options} bordered={false} hover search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'name'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'managerName'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterManagerName_string} }>
                        {constantStrings.managerName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'phone'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterPhone_string} }>
                        {constantStrings.phone_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'city'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterCity_string} }>
                        {constantStrings.city_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'address'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterAddress_string} }>
                        {constantStrings.address_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'area'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.store_area }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectArea_string, options: constantStrings.store_area } }>
                        {constantStrings.area_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'channel'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.store_channel }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectChannel_string, options: constantStrings.store_channel } }>
                    {constantStrings.channel_string}
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
        if(this.state.stores != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = StoresContainer;