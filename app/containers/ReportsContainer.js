/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var managementServices = require('../communication/managementServices');

var moment = require('moment');
var NotificationSystem = require('react-notification-system');
var EditIcon = require('react-icons/lib/md/edit');
var salesChart = undefined;

import ReactDOM from 'react-dom';
import fusioncharts from 'fusioncharts';
// Load the charts module
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC  from 'react-fusioncharts';



// Pass fusioncharts as a dependency of charts
charts(FusionCharts);


var options = {
    noDataText: constantStrings.NoDataText_string
};

var ReportsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return{
            salesmen: [],
            shifts: [],
            chosenShift: undefined
        }
    },
    componentWillMount() {
        this.updateSalesmen();
    },

    updateSalesmen: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        console.log('fetching salesmen');
        managementServices.getAllUsers()
            .then(function(result) {
                if(result.success){
                    var salesmen = result.info.filter(function(user){
                        return user.jobDetails.userType == 'salesman'
                    });
                    self.setState({
                            salesmen: salesmen
                        });
                }
            })
            .catch(function(err) {

            });
    },

    salesmanChanged: function(event) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var salesChart = FusionCharts('sales_report_chart');
        if(salesChart){
            salesChart.dispose();
        }
        this.setState({
            chosenShift: undefined,
            shifts: []
        });

        var salesman = this.state.salesmen[event.target.selectedIndex - 1];
        console.log('fetching shifts of ' + salesman.username);
        managementServices.getSalesmanFinishedShifts(salesman._id)
            .then(function(result) {
                if(result.info.length == 0){
                    notificationSystem.addNotification({
                        message: constantStrings.noShifts_string,
                        level: 'error',
                        autoDismiss: 2,
                        position: 'tc',
                    });

                }
                else{
                    self.setState({
                        shifts: result.info
                    });
                }
            }).catch(function (err) {
                notificationSystem.addNotification({
                    message: constantStrings.errorMessage_string,
                    level: 'error',
                    autoDismiss: 2,
                    position: 'tc',
                });
            })
    },

    shiftChanged: function(event) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        var chosenShift = this.state.shifts[event.target.selectedIndex - 1];

        this.renderChart(chosenShift);

        this.setState({
            chosenShift: chosenShift
        });

    },

    renderChart: function(shift) {
        var chartData = shift.salesReport
            .filter(function(product) {
                return product.sold > 0;
            })
            .map(function(product,i) {
                return {
                    label: product.name,
                    value: product.sold
                }});

        FusionCharts.ready(function () {

            var myDataSource = {
                chart: {
                    caption: constantStrings.reportsSalesReportTitle_string,
                    subCaption: constantStrings.reportsSalesReportSubTitle_string + moment(shift.startTime).format('YYYY-MM-DD'),
                    theme: "zune"
                },
                data: chartData
            };

            salesChart = {
                id: "sales_report_chart",
                type: "column2d",
                width: "80%",
                height: 400,
                dataFormat: "json",
                dataSource: myDataSource
            };

            ReactDOM.render( < ReactFC {...salesChart }/>,
                document.getElementById('chart-container')
            );
        });
    },

    renderSalesReportList: function(){
        if(this.state.chosenShift != undefined){
            var report = this.state.chosenShift.salesReport.sort(function(a, b){
                if(a.name < b.name)
                    return -1;
                else if(a.name > b.name)
                    return 1;
                return 0;
            });
            return (
                <div className="w3-container">
                    <h1>{constantStrings.editReport_string}</h1>
                    <div className="row col-sm-8 w3-theme-l4 w3-round-large w3-card-4 w3-text-black">
                        <p className="col-sm-3" style={styles.listHeader}>{constantStrings.productName_string}</p>
                        <p className="col-sm-3" style={styles.listHeader}>{constantStrings.reportsNumberOfProductsSold_string}</p>
                        <p className="col-sm-3" style={styles.listHeader}>{constantStrings.reportsNumberOfProductsOpened_string}</p>
                        <p className="col-sm-1"></p>
                    </div>
                    {report.map(this.renderSalesProducts)}
                </div>
            )
        }
    },


    renderSalesProducts: function(product, i){
        return (
            <div className="row col-sm-8 w3-theme-l4 w3-round-large w3-card-4 w3-text-black"
                 style={{marginTop: '10px', height: '40px'}}>
                <p className="col-sm-3">{product.name}</p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"editSold" + i} defaultValue={product.sold} />
                <p className="col-sm-1"></p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"editOpened" + i} defaultValue={product.opened} />
                <p className="col-sm-1"></p>
                <p className="w3-xlarge" onClick={() => this.onClickEditButton(product, i)}><EditIcon/></p>
            </div>
        )
    },

    onClickEditButton: function(product, index){
        var newSold = this.refs["editSold" + index].value;
        var newOpened = this.refs["editOpened" + index].value;
        var productId = product.productId;
        var shiftId = this.state.chosenShift._id;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.updateSalesReport(shiftId, productId, newSold, newOpened)
            .then(function(result) {
                console.log('updated sales report');

            })
            .catch(function(err) {
                console.log('error');
                notificationSystem.addNotification({
                    message: constantsStrings.editFailMessage_string,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
    },

    getSalesmenOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option disabled selected key="defaultSalesman">{constantStrings.defaultSalesmanDropDown_string}</option>);
        var salesmen = this.state.salesmen;
        for(var i=0; i<salesmen.length; i++){
            optionsForDropdown.push(<option key={"salesman" + i}>{salesmen[i].personal.firstName + " " + salesmen[i].personal.lastName}</option>)
        }
        return optionsForDropdown;
    },

    getShiftsOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option disabled selected key="defaultShift">{constantStrings.defaultShiftDropDown_string}</option>);
        var shifts = this.state.shifts;
        for(var i=0; i<shifts.length; i++){
            optionsForDropdown.push(<option key={"shift" + i}>{moment(shifts[i].startTime).format('YYYY-MM-DD')}</option>)
        }
        return optionsForDropdown;
    },

    renderSalesGraph: function() {
        return (

            <div>
                <div style={{fontSize: '40px'}} id="chart-container"></div>
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
        if(this.state.salesmen.length == 0){
            return this.renderLoading();
        }
        else {
            return (
                <div className="w3-container">
                    <div className="col-sm-offset-1">
                        <div className="row">
                            <select onChange={this.salesmanChanged} ref="selectSalesman" className="col-sm-3 w3-large w3-card-4 w3-round-large">
                                {this.getSalesmenOptions()}
                            </select>
                        </div>
                        <div className="row" style={{marginTop: '10px', marginBottom: '20px'}}>
                            <select onChange={this.shiftChanged} ref="selectShift" className="col-sm-3 w3-large w3-card-4 w3-round-large">
                                {this.getShiftsOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="">
                        {this.renderSalesGraph()}
                    </div>
                    <div style={{marginBottom: '30px'}}>
                        {this.renderSalesReportList()}
                    </div>
                    <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                </div>
            )
        }
    }
});

module.exports = ReportsContainer;