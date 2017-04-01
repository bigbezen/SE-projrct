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
            shifts: []
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

        var salesman = this.state.salesmen[event.target.selectedIndex - 1];
        console.log('fetching shifts of ' + salesman.username);
        managementServices.getSalesmanFinishedShifts(salesman._id)
            .then(function(result) {
                if(result.info.length == 0){
                    notificationSystem.addNotification({
                        message: constantsStrings.noShifts_string,
                        level: 'error',
                        autoDismiss: 1,
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
                    message: constantsStrings.errorMessage_string,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
    },

    shiftChanged: function(event) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        var chosenShift = this.state.shifts[event.target.selectedIndex - 1];
        var chartData = chosenShift.salesReport;
        chartData = chartData
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
                    caption: "Sales Report",
                    subCaption: "Sales Report from " + moment(chosenShift.startTime).format('YYYY-MM-DD'),
                    theme: "zune"
                },
                data: chartData
            };

            var revenueChartConfigs = {
                id: "revenue-chart",
                type: "column2d",
                width: "80%",
                height: 400,
                dataFormat: "json",
                dataSource: myDataSource
            };

            ReactDOM.render( < ReactFC {...revenueChartConfigs }/>,
                document.getElementById('chart-container')
            );
        });



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
            <div id="chart-container"></div>
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
                    <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                </div>
            )
        }
    }
});

module.exports = ReportsContainer;