/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var paths               = require('../utils/Paths');
var managementServices  = require('../communication/managementServices');
var userServices        = require('../communication/userServices');
var constantStrings     = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/homeStyles');
var NotificationSystem  = require('react-notification-system');

var HomeContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            salesmenNum: 0,
            productsNum: 0,
            storesNum: 0,
            salesmen: undefined,
            chosenShift: undefined
        }
    },

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    componentDidMount() {
        this.updateStatistics();
    },

    updateStatistics() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllProducts().then(function (result) {
            self.setState({
                productsNum: result.length
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        });
        managementServices.getAllUsers().then(function (result) {
            result = result.filter((user) => user.jobDetails.userType == 'salesman');
            self.setState({
                salesmenNum: result.length,
                salesmen: result
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        });
        managementServices.getAllStores().then(function (result) {
            self.setState({
                storesNum: result.length
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    salesmanChanged: function(event){
        if(event.target.selectedIndex == 0) {
            this.setState({
                chosenShift: undefined
            });
            return;
        }
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        this.setState({
            chosenShift: undefined
        });

        var salesman = this.state.salesmen[event.target.selectedIndex - 1];
        managementServices.getSalesmanLiveShift(salesman._id)
            .then(function(result) {
                if(result === ""){
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantStrings.noShifts_string,
                        level: 'error',
                        autoDismiss: 2,
                        position: 'tc',
                    });
                }
                else{
                    self.setState({
                        chosenShift: result
                    });
                }
            }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    getSalesmenOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option className="w3-round-large" key="defaultSalesman">{constantStrings.defaultSalesmanDropDown_string}</option>);
        var salesmen = this.state.salesmen;
        for(var i=0; i<salesmen.length; i++){
            optionsForDropdown.push(<option className="w3-round-large" key={"salesman" + i}>
                                        {salesmen[i].personal.firstName + " " + salesmen[i].personal.lastName}
                                    </option>)
        }
        return optionsForDropdown;
    },

    productSortingMethod: function(a, b){
        if(a.productId.subCategory < b.productId.subCategory)
            return -1;
        else if(a.productId.subCategory > b.productId.subCategory)
            return 1;
        else{
            if(a.productId.name < b.productId.name)
                return -1;
            else if(a.productId.name > b.productId.name)
                return 1;
            return 0;
        }
    },


    renderStatistics: function() {
        return (
            <div className="col-sm-10 col-sm-offset-1 " style={styles.bottom_border}>
                <div className="w3-card-2 w3-theme-l4 col-sm-3 col-sm-offset-1"
                     style={{marginLeft: '20px', marginTop: '20px', marginBottom: '20px'}}>
                    <h5> {constantStrings.numberOfUUsers}</h5>
                    <h1>{this.state.salesmenNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-3" style={{marginLeft: '20px', marginTop: '20px'}}>
                    <h5> {constantStrings.numberOfProducts}</h5>
                    <h1>{this.state.productsNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-3"  style={{marginTop: '20px'}}>
                    <h5> {constantStrings.numberOfStores}</h5>
                    <h1>{this.state.storesNum}</h1>
                </div>
            </div>
        )
    },

    renderComment: function(comment){
        return (
            <p className="col-sm-10 col-sm-offset-1 w3-round-xlarge w3-theme-l4 w3-large">{comment}</p>
        )
    },

    renderSalesProducts: function(product, i){
        return (
            <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black"
                 style={{marginTop: '10px', height: '45px'}}>
                <p className="col-sm-3"><b>{product.productId.subCategory}</b></p>
                <p className="col-sm-3">{product.productId.name}</p>
                <p className="col-sm-2">{product.sold}</p>
                <p className="col-sm-1"></p>
                <p className="col-sm-2">{product.opened}</p>
            </div>
        )
    },

    renderCategoriesProducts: function(productsOfOneCategory){
        return (
            <div className="w3-container col-sm-6">
                <h1 className="col-sm-offset-1">{productsOfOneCategory.cat}</h1>
                <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black">
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.subCategory_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.productName_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsSold_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsOpened_string}</b></p>
                </div>
                {productsOfOneCategory.products.map(this.renderSalesProducts)}
            </div>
        )
    },

    renderSalesReportList: function() {
        if(this.state.chosenShift != undefined){
            var productsByCategory = [];
            var categories = new Set(this.state.chosenShift.salesReport.map((x) => x.productId.category));
            for(var cat of categories) {
                productsByCategory.push({
                    cat: cat,
                    products: this.state.chosenShift.salesReport.filter((x) => x.productId.category == cat).sort(this.productSortingMethod)
                });
            }

            return (
                <div>
                    <div className="col-sm-12 text-center">
                        <h1>{this.state.chosenShift.storeId.name} - {this.state.chosenShift.storeId.city}</h1>
                    </div>
                    <div className="col-sm-12">
                        {productsByCategory.map(this.renderCategoriesProducts)}
                    </div>
                    <div style={styles.marginTop} className="col-sm-12">
                        <div className="text-center col-sm-12">
                            <h1>
                                {this.state.chosenShift.shiftComments.length > 0 ?
                                    constantStrings.commentsFromShift_string : constantStrings.noCommentsFromShift_string}
                            </h1>
                        </div>
                        {this.state.chosenShift.shiftComments.map(this.renderComment)}
                    </div>
                </div>
            )

        }
    },

    renderLiveSalesReport: function(){
        if(this.state.salesmen == undefined){
            return (
                <div>

                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="col-sm-12" >
                        <div className="text-center">
                            <h1>{constantStrings.liveSalesReport_string}</h1>
                        </div>
                        <select onChange={this.salesmanChanged} ref="selectSalesman" style={{marginTop: '30px'}}
                                className="col-sm-4 col-sm-offset-4 w3-large w3-card-4 w3-round-large">
                            {this.getSalesmenOptions()}
                        </select>
                    </div>
                    <div style={{marginBottom: '30px'}}>
                        {this.renderSalesReportList()}
                    </div>
                </div>
            )
        }
    },

    render: function () {
        return (
            <div className="w3-theme-l5" style={styles.cardsRow}>
                {this.renderStatistics()}
                {this.renderLiveSalesReport()}
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = HomeContainer;