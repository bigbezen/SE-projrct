var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');

var stores =
    [{
        name : 'דרינק אנד קו',
        managerName : 'מירי מסיקה',
        phone : '052222222',
        city : 'באר שבע',
        address : 'האורגים 12',
        area : 'דרום',
        channel : 'מסחרי'
    },
        {
            name : 'דרינק אנד קו2',
            managerName : 'אביב גפן',
            phone : '052333333',
            city : 'תל אביב',
            address : 'האורגים 12',
            area : 'מרכז',
            channel : 'מסחרי'
        }];

var StoresContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Store #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: '/LoggedIn/Store',
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        console.log('Store #', rowIndex);
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
                <BootstrapTable data={stores} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
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
                        filter={ { type: 'TextFilter' ,placeholder:constantStrings.selectArea_string} }>
                        {constantStrings.area_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'channel'
                        dataAlign = 'right'
                        filter={ { type: 'TextFilter' ,placeholder:constantStrings.selectChannel_string} }>
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
        )
    }
});

module.exports = StoresContainer;