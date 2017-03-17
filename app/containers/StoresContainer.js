var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var helpers = require('../utils/Helpers');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var TrashIcon = require('react-icons/lib/fa/trash-o');
var EditIcon = require('react-icons/lib/md/edit');
var NotificationSystem = require('react-notification-system');

var options = {
    noDataText: constantStrings.NoDataText_string
};

var StoresContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            stores: null
        }
    },
    componentWillMount() {
        this.updateStores();
    },
    updateStores() {
        var self = this;
        managementServices.getAllStores().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        stores: result.info
                    });
                    console.log("works!!");
                } else {
                    console.log("error in getAllStores: " + result.info);
                    alert("Error while retrieving all stores from the server: "+ result.info);
                }
            } else {
                console.log("error in storesContainers: " + n);
            }
        })
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Store #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: paths.manager_storeDetails_path,
            query: row
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
        managementServices.deleteStore(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateStores();
                    console.log("works!!");
                } else {
                    console.log("error in deleteStore: " + result.info);
                    alert("Error while deleting store from the server: "+ result.info);
                }
            } else {
                console.log("error in deleteStore: " + n);
            }
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
                className="w3-card-2 col-sm-offset-2"
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
                className="w3-card-2 "
                type="button"
                onClick={() =>
                    this.onClickDeleteButton(cell, row, rowIndex)}>
                <TrashIcon/>
            </button>
        )
    },
    renderTable: function () {
        return (
            <div className="col-sm-12" style={styles.marginBottom}>
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddButton}> + </button>
                <BootstrapTable data={this.state.stores} options={options} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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