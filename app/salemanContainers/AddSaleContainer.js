/**
 * Created by lihiverchik on 19/01/2017.
 */

var React = require('react');
var constantStrings = require('../utils/ConstantStrings');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var addSaleStyles = require('../styles/addSaleStyles');
var salesmanServices = require('../communication/salesmanServices');
var paths = require('../utils/Paths');


var AddSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: this.props.location.state.newShift,
            products: this.props.location.state.newShift.salesReport,
            soldProducts: []
        }
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
                <span className="input-group-btn">
                    <button type="button" className="btn btn-default btn-number" disabled={row.sold == 0}  onClick={() =>
                        this.decreaseNum(cell, row, enumObject, rowIndex)}> - </button>
                </span>
                <input type="text" className="form-control input-number" value={row.sold} min="0" ref={rowIndex}/>
                <span className="input-group-btn">
                    <button type="button" className="btn btn-default btn-number" onClick={() =>
                        this.increaseNum(cell, row, enumObject, rowIndex)}> + </button>
                </span>
            </div>
        )
    },
    handleAddSale(){
        var shiftId = this.state.shift._id;
        this.state.soldProducts.forEach(function(prod){
            salesmanServices.reportSale(shiftId, prod.productId,prod.sold); //TODO: add wait
            }
        );
        this.setState({products: this.state.shift.salesReport, soldProducts: []})
    },
    handleOpenBottle(){
    },
    handleFinishShift: function(){
        this.context.router.push({
            pathname: paths.salesman_endShift_path,
            state:{newShift:this.state.shift}
        });
    },
    renderStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(
            <div className='main-container'>
                <div className="w3-theme-l2">
                    <div style={addSaleStyles.reportTopContainer}>
                        <div style={addSaleStyles.reportButtonsContainer}>
                            <button onClick={this.handleAddSale} className="w3-btn-floating" style={addSaleStyles.reportButtons}> {constantStrings.reportSale_string}</button>
                        </div>
                        <div style={addSaleStyles.reportButtonsContainer}>
                        <button onClick={this.handleOpenBottle} className="w3-btn-floating " style={addSaleStyles.reportButtons}>{constantStrings.reportOpen_string}</button>
                        </div>
                    </div>
                        <BootstrapTable data={this.state.soldProducts} bordered={false}>
                        <TableHeaderColumn
                            dataField = 'name'
                            dataAlign = 'right'
                            isKey = {true}>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataAlign = 'right'
                            dataField = 'button'
                            width = '50'
                            dataFormat = {this.setAmountButton}/>
                    </BootstrapTable>
                </div>

                <h1> select products: </h1>
                <BootstrapTable data={this.state.products} options={selectRowProp} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'name'
                        dataAlign = 'right'
                        isKey = {true}>
                    </TableHeaderColumn>

                </BootstrapTable>
                <button onClick={this.handleFinishShift}> {constantStrings.endShift_string} </button>
            </div>
            )

    },
    renderNotStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(
            <div className="col-sm-10">
                <h1> select product: </h1>
                <BootstrapTable data={this.state.products} options={selectRowProp} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'name'
                        dataAlign = 'right'
                        isKey = {true}>
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width = '50'/>
                </BootstrapTable>
                <button onClick={this.handleFinishShift}> {constantStrings.endShift_string} </button>
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