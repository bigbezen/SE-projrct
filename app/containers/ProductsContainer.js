/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var communication = require('../communication/managementServices');

/*
var products =
    [{
        name :'אג\'וני ווקר blue',
        retailPrice: 500,
        salePrice: 600,
        category: 'ספיריט',
        subCategory: 'וויסקי',
        minRequiredAmount: 3,
        notifyManager: true
    }, {
        name :'ג\'וני ווקר blue',
        retailPrice: 400,
        salePrice: 600,
        category: 'ספיריט',
        subCategory: 'וויסקי',
        minRequiredAmount: 3,
        notifyManager: true
}];
*/

var products = communication.getAllProducts();

const category = {
    'ספיריט': 'ספיריט',
    'בלהה': 'בלהה',
};

const subCategory = {
    'וויסקי': 'וויסקי',
    'בלהה': 'בלהה',
};

function enumFormatter(cell, row, enumObject) {
    return enumObject[cell];
}

var ProductsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Product #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: '/LoggedIn/Product',
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        console.log('Product #', rowIndex);
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
            <BootstrapTable data={products} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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
                    type: 'TextFilter',
                    placeholder:constantStrings.enterPrice_string
                } }>
                    {constantStrings.retailPrice_string}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField = 'salePrice'
                    dataAlign = 'right'
                    filter = { { type: 'TextFilter', placeholder:constantStrings.enterPrice_string} }>
                    {constantStrings.salePrice_string}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField = 'category'
                    dataAlign = 'right'
                    filterFormatted dataFormat={ enumFormatter } formatExtraData={ category }
                    filter={ { type: 'SelectFilter', placeholder:constantStrings.selectCategory_string, options: category } }>
                    {constantStrings.category_string}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField = 'subCategory'
                    dataAlign = 'right'
                    filterFormatted dataFormat={ enumFormatter } formatExtraData={ subCategory }
                    filter={ { type: 'SelectFilter', placeholder:constantStrings.selectSubCategory_string,options: subCategory } }>
                    {constantStrings.subCategory_string}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField = 'minRequiredAmount'
                    dataAlign = 'right'>
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
    }
});

module.exports = ProductsContainer;