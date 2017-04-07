/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var helpers = require('../utils/Helpers');
var managementServices = require('../communication/managementServices');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var TrashIcon = require('react-icons/lib/fa/trash-o');
var EditIcon = require('react-icons/lib/md/edit');
var NotificationSystem = require('react-notification-system');

var options = {
    noDataText: constantStrings.NoDataText_string
};

var ProductsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            products: null
        }
    },
    componentWillMount() {
        this.updateProducts();
    },
    updateProducts() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllProducts().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        products: result.info
                    });
                } else {
                    console.log("error in getAllProducts: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in storesContainers: " + n);
            }
        })
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Product #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: paths.manager_productDetails_path,
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
                        self.handleDeleteProduct(row)
                    }
            }
        });
    },
    handleDeleteProduct:function(row){
        this.setState({
            products: null
        });
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteProduct(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateProducts();
                    console.log("works!!");
                } else {
                    console.log("error in deleteProduct: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.deleteFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in deleteProduct: " + n);
            }
        })
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_productDetails_path
        })
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="w3-card-2 col-xs-offset-2"
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
            <div className="col-xs-12">
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddButton}> + </button>
                <div style={styles.marginBottom}>
                    <BootstrapTable data={this.state.products} options={options} bordered={false} hover search searchPlaceholder={constantStrings.search_string}>
                        <TableHeaderColumn
                            dataField = 'name'
                            dataAlign = 'right'
                            dataSort = {true}
                            filter = { {type: 'TextFilter', placeholder:constantStrings.enterProductName_string} }
                            isKey = {true}>
                            {constantStrings.productName_string}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'retailPrice'
                            dataAlign = 'right'
                            dataSort = {true}
                            filter={ {
                            type: 'NumberFilter',
                            placeholder:constantStrings.enterPrice_string
                        } }>
                            {constantStrings.retailPrice_string}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'category'
                            dataAlign = 'right'
                            filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.product_category }
                            filter={ { type: 'SelectFilter', placeholder:constantStrings.selectCategory_string, options: constantStrings.product_category } }>
                            {constantStrings.category_string}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'subCategory'
                            dataAlign = 'right'
                            filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.product_subCategory }
                            filter={ { type: 'SelectFilter', placeholder:constantStrings.selectSubCategory_string,options: constantStrings.product_subCategory } }>
                            {constantStrings.subCategory_string}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'minRequiredAmount'
                            dataAlign = 'right'
                            filter = { { type: 'NumberFilter', placeholder:constantStrings.enterQuantity_string} }>
                            {constantStrings.minRequiredAmount_string}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'notifyManager'
                            dataAlign = 'right'>
                            {constantStrings.notifyManager_string}
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
            </div>
        )
    },
    render: function () {
        if(this.state.products != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ProductsContainer;