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
var userServices = require('../communication/userServices');





// Pass fusioncharts as a dependency of charts
charts(FusionCharts);


var options = {
    noDataText: constantStrings.NoDataText_string
};

var ReportsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    getInitialState() {
        this.setSessionId();
        return{
            salesmen: undefined,
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
        var selectedIndex = event.target.selectedIndex;
        if(selectedIndex > 0) {
            var chosenShift = this.state.shifts[selectedIndex - 1];


            this.setState({
                chosenShift: chosenShift
            });
        }
        else{
            this.setState({
                chosenShift: undefined
            })
        }

    },
    productSortingMethod: function(a, b){
        if(a.subCategory < b.subCategory)
            return -1;
        else if(a.subCategory > b.subCategory)
            return 1;
        else{
            if(a.name < b.name)
                return -1;
            else if(a.name > b.name)
                return 1;
            return 0;
        }
    },




    renderSalesReportList: function(){
        if(this.state.chosenShift != undefined){
            var productsByCategory = [];
            var categories = new Set(this.state.chosenShift.salesReport.map((x) => x.category));
            for(var cat of categories) {
                productsByCategory.push({
                    cat: cat,
                    products: this.state.chosenShift.salesReport.filter((x) => x.category == cat).sort(this.productSortingMethod)
                });
            }

            return (
                <div>
                    <h1 className="w3-xxlarge text-center">{constantStrings.reportsSalesReportTitle_string}</h1>
                    {productsByCategory.map(this.renderCategoriesProducts)}
                </div>
            )

        }
    },

    renderCategoriesProducts: function(productsOfOneCategory){

        return (
            <div className="w3-container col-sm-6">
                <h1 className="col-sm-offset-1">{productsOfOneCategory.cat}</h1>
                <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black">
                    <p className="col-sm-2" style={styles.listHeader}><b>{constantStrings.subCategory_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.productName_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsSold_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsOpened_string}</b></p>
                    <p className="col-sm-1"></p>
                </div>
                {productsOfOneCategory.products.map(this.renderSalesProducts)}
            </div>
        )
    },

    renderSalesProducts: function(product, i){
        return (
            <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black"
                 style={{marginTop: '10px', height: '45px'}}>
                <p className="col-sm-2"><b>{product.subCategory}</b></p>
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
        optionsForDropdown.push(<option className="w3-round-large" key="defaultSalesman">{constantStrings.defaultSalesmanDropDown_string}</option>);
        var salesmen = this.state.salesmen;
        for(var i=0; i<salesmen.length; i++){
            optionsForDropdown.push(<option className="w3-round-large" key={"salesman" + i}>{salesmen[i].personal.firstName + " " + salesmen[i].personal.lastName}</option>)
        }
        return optionsForDropdown;
    },

    getShiftsOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option className="w3-round-large" key="defaultShift">{constantStrings.defaultShiftDropDown_string}</option>);
        var shifts = this.state.shifts;
        for(var i=0; i<shifts.length; i++){
            optionsForDropdown.push(<option className="w3-round-large" key={"shift" + i}>{moment(shifts[i].startTime).format('YYYY-MM-DD')}</option>)
        }
        return optionsForDropdown;
    },


    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
            </div>
        )
    },
    render: function () {
        if(this.state.salesmen == undefined){
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