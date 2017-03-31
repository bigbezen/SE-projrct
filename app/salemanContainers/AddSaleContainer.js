/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var ReactBsTable            = require("react-bootstrap-table");
var BootstrapTable          = ReactBsTable.BootstrapTable;
var TableHeaderColumn       = ReactBsTable.TableHeaderColumn;

var constantStrings         = require('../utils/ConstantStrings');
var paths                   = require('../utils/Paths');
var styles                  = require('../styles/salesmanStyles/addSaleStyles');

var salesmanServices        = require('../communication/salesmanServices');
var StartShiftIcon          = require('react-icons/lib/fa/angle-double-left');
var PlusIcon                = require('react-icons/lib/fa/plus');


var AddSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: null,
            products: [],
            soldProducts: []
        }
    },
    componentDidMount() {
        this.updateShift();
    },
    updateShift(){
        var self = this;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    self.setState(
                        {shift: currShift,
                         products: currShift.salesReport
                    });
                }
                else {
                }
            }
            else {
            }
        })
    },
    onRowClick(row){
        var sold = this.state.soldProducts;
        var p2 = row;
        p2.sold =1;
        sold.push(p2);
        var prods = this.state.products;
        var newProds =[];
        prods.forEach(function(prod) {
            if (!(prod.productId == row.productId)) {
                newProds.push(prod);
            }
        });
        this.setState({soldProducts:sold, saleStarted:true, products:newProds})
    },
    onRowClickRevert(row){
        var prods = this.state.products;
        var p2 = row;
        prods.push(p2);
        var soldProds = this.state.soldProducts;
        var newSoldProds =[];
        soldProds.forEach(function(prod) {
            if (!(prod.productId == row.productId)) {
                newSoldProds.push(prod);
            }
        });
        this.setState({soldProducts:newSoldProds, saleStarted:true, products:prods})
    },
    increaseNum(cell, row, enumObject, rowIndex){
        var newSoldProds =[];
        this.state.soldProducts.forEach(function(prod) {
            if (prod.productId == row.productId) {
                var p2 = prod;
                p2.sold = p2.sold + 1;
                newSoldProds.push(p2);
            } else {
                newSoldProds.push(prod);
            }
        });
        this.setState({soldProducts:newSoldProds})
   },
    decreaseNum(cell, row, enumObject, rowIndex){
        var isZero = false;
        var newSoldProds =[];
        this.state.soldProducts.forEach(function(prod) {
            if (prod.productId == row.productId) {
                var p2 = prod;
                p2.sold = p2.sold - 1;
                if(p2.sold==0){
                    isZero = true;
                }
                newSoldProds.push(p2);
            } else {
                newSoldProds.push(prod);
            }
        });
        if (isZero) {
            this.onRowClickRevert(row);
        } else {
            this.setState({soldProducts:newSoldProds})
        }
    },
    setAmountButton: function(cell, row, enumObject, rowIndex) {
        return (
            <div>
                <table>
                    <tr>
                        <td>
                            <span className="input-group-btn ">
                                <button type="button" className="w3-xxlarge btn btn-default btn-number" disabled={row.sold == 0}  onClick={() =>
                                    this.decreaseNum(cell, row, enumObject, rowIndex)}> - </button>
                            </span>
                        </td>
                        <td>
                            <input type="text" className="form-control w3-xxlarge input-number"
                                   style={styles.inputMinHeight}
                                   value={row.sold} min="0" ref={rowIndex}/>
                        </td>
                        <td>
                            <span className="input-group-btn">
                                <button type="button" className="btn w3-xxlarge btn-default btn-number" onClick={() =>
                                    this.increaseNum(cell, row, enumObject, rowIndex)}> + </button>
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        )
    },
    handleAddSale(){
        var shiftId = this.state.shift._id;
        var salesList = [];
        this.state.soldProducts.forEach(function(prod){
            salesList.push({'productId': prod.productId, 'quantity':prod.sold});
            }
        );
        salesmanServices.reportSale(shiftId, salesList); //TODO: add wait
        this.setState({products: this.state.shift.salesReport, soldProducts: []})
    },
    handleOpenBottle(){
        var shiftId = this.state.shift._id;
        var salesList = [];
        this.state.soldProducts.forEach(function(prod){
            salesList.push({'productId': prod.productId, 'quantity':prod.sold});
            }
        );
        salesmanServices.reportOpen(shiftId,salesList); //TODO: add wait
        this.setState({products: this.state.shift.salesReport, soldProducts: []})
    },
    handleFinishShift: function(){
        this.context.router.push({
            pathname: paths.salesman_endShift_path,
            state:{newShift:this.state.shift}
        });
    },
    tablePlusIcon: function(cell, row, enumObject, rowIndex){
        return (
            <div className="w3-jumbo">
                <PlusIcon/>
            </div>
        )
    },
    generateSearchField: function(onKeyUp){
        return (
            <input type="text" className="w3-xxxlarge"/>
        )
    },
    renderStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(
            <div className='main-container'>
                <div className="w3-theme-d5 col-xs-12" style={styles.endShiftButton}>
                    <div className="col-xs-offset-7">
                        <button className="w3-theme-d5 w3-xxxlarge btn"
                                onClick={this.handleFinishShift} type="submit">
                            {constantStrings.endShift_string}
                            <StartShiftIcon/>
                        </button>
                    </div>
                </div>

                <div style={styles.reportTopContainer}>
                    <div style={styles.reportButtonsContainer}>
                        <button onClick={this.handleAddSale} className="w3-round-xxlarge w3-theme-d5 w3-xxxlarge w3-card-8" > {constantStrings.reportSale_string}</button>
                    </div>
                    <div style={styles.reportButtonsContainer}>
                        <button onClick={this.handleOpenBottle} className="w3-round-xxlarge w3-theme-d5 w3-xxxlarge w3-card-8">{constantStrings.reportOpen_string}</button>
                    </div>
                </div>
                <div className="w3-card-8 col-xs-offset-1 col-xs-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.soldProducts} hover bordered={false}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                isKey = {true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign = 'right'
                                dataField = 'button'
                                width = '180'
                                dataFormat = {this.setAmountButton}/>
                        </BootstrapTable>
                    </div>
                </div>

                <div style={styles.space}></div>

                <div className="w3-card-8 col-xs-offset-1 col-xs-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.products} options={selectRowProp}
                                        bordered={false} hover search
                                        searchPlaceholder={constantStrings.search_string}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                dataSort
                                isKey = {true}>
                                <h1><b>{constantStrings.select_product_for_sale}</b></h1>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField = 'button'
                                dataAlign = 'left'
                                dataFormat = {this.tablePlusIcon}>
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
            )

    },
    renderNotStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(

            <div>
                <div className="w3-theme-d5 col-xs-12">
                    <div className="col-xs-offset-7">
                        <button className="w3-theme-d5 w3-xxxlarge btn"
                                onClick={this.handleFinishShift} type="submit">
                            {constantStrings.endShift_string}
                            <StartShiftIcon/>
                        </button>
                    </div>
                </div>
                <div className="w3-card-8 col-xs-offset-1 col-xs-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.products} options={selectRowProp}
                                        bordered={false} hover search
                                        searchPlaceholder={constantStrings.search_string}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                dataSort
                                isKey = {true}>
                                <h1><b>{constantStrings.select_product_for_sale}</b></h1>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField = 'button'
                                dataAlign = 'left'
                                className = "col-xs-2"
                                dataFormat = {this.tablePlusIcon}>
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>

            </div>
            )

    },
    render: function () {
            if(this.state.soldProducts.length!=0){
                return this.renderStartedSale();
            }
            else
                {
                return this.renderNotStartedSale();
            }
    }
});

module.exports = AddSaleContainer;