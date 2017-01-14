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
        managementServices.getAllProducts().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        products: result.info
                    });
                    console.log("works!!");
                } else {
                    console.log("error in getAllProducts: " + result.info);
                    alert("Error while retrieving all products from the server: "+ result.info);
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
        this.setState({
            products: null
        });
        var self = this;
        managementServices.deleteProduct(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateProducts();
                    console.log("works!!");
                } else {
                    console.log("error in deleteProduct: " + result.info);
                    alert("Error while deleting product from the server: "+ result.info);
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
                <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddButton}> + </button>
            <BootstrapTable data={this.state.products} options={options} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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
                    dataField = 'salePrice'
                    dataAlign = 'right'
                    filter = { { type: 'NumberFilter', placeholder:constantStrings.enterPrice_string} }>
                    {constantStrings.salePrice_string}
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