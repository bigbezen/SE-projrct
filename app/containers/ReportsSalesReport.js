/**
 * Created by lihiverchik on 17/12/2016.
 */
var React               = require('react');
var constantStrings     = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/styles');
var managementServices  = require('../communication/managementServices');
var managerServices     = require('../communication/managerServices');
var moment              = require('moment');
var NotificationSystem  = require('react-notification-system');
var EditIcon            = require('react-icons/lib/md/edit');
var salesChart          = undefined;
var userServices        = require('../communication/userServices');
var sorting             = require('../utils/SortingMethods');

var ReportsSalesReport = React.createClass({

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

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },

    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            salesmen: undefined,
            stores: undefined,
            shifts: [],
            chosenShift: undefined
        }
    },

    componentDidMount() {
        this.updateSalesmen();
    },

    updateSalesmen: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllUsers()
            .then(function(result) {
                var salesmen = result.filter(function(user){
                    return user.jobDetails.userType == 'salesman'
                }).sort(sorting.salesmenSortingMethod);

                managementServices.getAllStores()
                    .then(function(stores){
                        self.setState({
                            salesmen: salesmen,
                            stores: stores.sort(sorting.storeSortingMethod)
                        })
                    });

            })
            .catch(function(err) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
            });
    },

    storeChanged: function(event) {
        if(event.target.selectedIndex == 0)
            return;
        var self = this;
        var notificationSystem = this.refs.notificationSystem
        this.setState({
            chosenShift: undefined,
            shifts: []
        });

        this.refs.selectSalesman.selectedIndex = 0;
        var store = this.state.stores[event.target.selectedIndex - 1];

        managementServices.getStoreShiftsByStatus(store._id, 'FINISHED')
            .then(function(result){
                if(result.length == 0){
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantStrings.noShifts_string,
                        level: 'error',
                        autoDismiss: 0,
                        position: 'tc',
                    });
                }
                else{
                    self.setState({
                        shifts: result
                    });
                }
            })
            .catch(function (errMess) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMess,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
            });
    },

    salesmanChanged: function(event) {
        if(event.target.selectedIndex == 0)
            return;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        this.setState({
            chosenShift: undefined,
            shifts: []
        });

        this.refs.selectStore.selectedIndex = 0;

        var salesman = this.state.salesmen[event.target.selectedIndex - 1];
        managementServices.getSalesmanFinishedShifts(salesman._id)
            .then(function(result) {
                if(result.length == 0){
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantStrings.noShifts_string,
                        level: 'error',
                        autoDismiss: 0,
                        position: 'tc',
                    });
                }
                else{
                    self.setState({
                        shifts: result
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

    shiftChanged: function(event) {
        var selectedIndex = event.target.selectedIndex;
        this.setState({
            chosenShift: undefined
        });
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

    renderComment: function(comment){
        return (
            <p className="col-sm-10 col-sm-offset-1 w3-round w3-large" style={styles.commentStyle}>{comment}</p>
        )
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
                    <div className="text-center">
                        <h1 className="w3-xxlarge">{constantStrings.reportsSalesReportTitle_string}</h1>
                        <button className="w3-button w3-round w3-card-4 w3-ripple" style={styles.editStyle} onClick={this.onClickExportReport}>
                            {constantStrings.getReport_string}
                        </button>
                    </div>
                    <div style={styles.marginBottom} className="col-sm-10 col-sm-offset-1 w3-card-2 w3-round">
                        <div className="text-center col-sm-12">
                            <h4>{constantStrings.commentsFromShift_string}</h4>
                        </div>
                        {this.state.chosenShift.shiftComments.map(this.renderComment)}
                    </div>
                    <div className="col-sm-12">
                        {productsByCategory.map(this.renderCategoriesProducts)}
                    </div>
                </div>
            )

        }
    },

    renderCategoriesProducts: function(productsOfOneCategory){
        return (
            <div className="w3-container col-sm-6">
                <h1 className="col-sm-offset-1">{productsOfOneCategory.cat}</h1>
                <div className="row col-sm-10 col-sm-offset-1 w3-round w3-card-2 w3-text-black" style={styles.headerStyle}>
                    <p className="col-sm-4" style={styles.listHeader}><b>{constantStrings.subCategory_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.productName_string}</b></p>
                    <p className="col-sm-2" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsSold_string}</b></p>
                    <p className="col-sm-2" style={styles.listHeader}><b>{constantStrings.reportsNumberOfProductsOpened_string}</b></p>
                </div>
                {productsOfOneCategory.products.map(this.renderSalesProducts)}
            </div>
        )
    },

    renderSalesProducts: function(product, i){
        return (
            <div className="row col-sm-10 col-sm-offset-1 w3-round w3-card-2 w3-text-black "
                 style={(product.sold || product.opened) > 0 ? styles.soldProdRowStyle : styles.prodRowStyle }>
                <p className="col-sm-4"><b>{product.subCategory}</b></p>
                <p className="col-sm-3">{product.name}</p>
                <input className="col-sm-2 w3-text-black" type="number" min="0" style={{marginTop: '3px'}} ref={product._id + "editSold" + i} value={product.sold} />
                <input className="col-sm-2 w3-text-black" type="number" min="0" style={{marginTop: '3px'}} ref={product._id + "editOpened" + i} value={product.opened} />
                <p className="w3-card-2 w3-button w3-small w3-round w3-ripple"
                   style={styles.buttonStyle} onClick={() => this.onClickEditButton(product, i)}><EditIcon style={styles.iconStyle}/></p>
            </div>
        )
    },

    onClickExportReport: function(){
        var notificationSystem = this.refs.notificationSystem;
        managerServices.getSaleReportXl(this.state.chosenShift)
            .then(function(data) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc',
                });
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            });
    },

    onClickEditButton: function(product, index){
        var newSold = this.refs[product._id + "editSold" + index].value;
        var newOpened = this.refs[product._id + "editOpened" + index].value;
        var productId = product.productId;
        var shiftId = this.state.chosenShift._id;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.updateSalesReport(shiftId, productId, newSold, newOpened)
            .then(function(result) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.editSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
            .catch(function(err) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.editFailMessage_string,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
    },

    getSalesmenOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option className="w3-round" key="defaultSalesman">{constantStrings.defaultSalesmanDropDown_string}</option>);
        var salesmen = this.state.salesmen;
        for(var i=0; i<salesmen.length; i++){
            optionsForDropdown.push(<option className="w3-round" key={"salesman" + i}>{salesmen[i].personal.firstName + " " + salesmen[i].personal.lastName}</option>)
        }
        return optionsForDropdown;
    },

    getStoresOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option className="w3-round" key="defaultSalesman">{constantStrings.defaultStoreDropDown_string}</option>);
        var stores = this.state.stores;
        for(var i=0; i<stores.length; i++){
            optionsForDropdown.push(<option className="w3-round" key={"store" + i}>{stores[i].area + " - " + stores[i].city + " - " + stores[i].name + " - " + stores[i].address}</option>)
        }
        return optionsForDropdown;
    },

    getShiftsOptions: function() {
        var optionsForDropdown = [];
        optionsForDropdown.push(<option className="w3-round" key="defaultShift">{constantStrings.defaultDateDropDown_string}</option>);
        var shifts = this.state.shifts;
        for(var i=0; i<shifts.length; i++){
            optionsForDropdown.push(<option className="w3-round" key={"shift" + i}>{moment(shifts[i].startTime).format('YYYY-MM-DD')}</option>)
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
                    <div className="col-sm-6">
                        <div className="col-sm-offset-1">
                            <div className="row">
                                <select onChange={this.salesmanChanged} ref="selectSalesman" className="col-sm-8 w3-large w3-card-4 w3-round">
                                    {this.getSalesmenOptions()}
                                </select>
                            </div>
                            <div className="row" style={{marginTop: '10px', marginBottom: '20px'}}>
                                <select onChange={this.shiftChanged} ref="selectShiftSalesman" className="col-sm-8 w3-large w3-card-4 w3-round">
                                    {this.getShiftsOptions()}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="col-sm-offset-1">
                            <div className="row">
                                <select onChange={this.storeChanged} ref="selectStore" className="col-sm-8 w3-large w3-card-4 w3-round">
                                    {this.getStoresOptions()}
                                </select>
                            </div>
                            <div className="row" style={{marginTop: '10px', marginBottom: '20px'}}>
                                <select onChange={this.shiftChanged} ref="selectShiftStore" className="col-sm-8 w3-large w3-card-4 w3-round">
                                    {this.getShiftsOptions()}
                                </select>
                            </div>
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

module.exports = ReportsSalesReport;