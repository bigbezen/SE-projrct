/**
 * Created by lihiverchik on 11/01/2017.
 */

var React                   = require('react');
var constantsStrings        = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var paths                   = require('../utils/Paths');
var styles                  = require('../styles/salesmanStyles/startShiftStyles');
var WineGlassIcon           = require('react-icons/lib/fa/glass');
var StartShiftIcon          = require('react-icons/lib/fa/angle-double-left');
var BackButtonIcon          = require('react-icons/lib/md/arrow-forward');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');
var utils                   = require('../utils/Helpers');

var StartShiftContainer = React.createClass({

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

    getInitialState()
    {
        this.setSessionId();
        this.setUserType();
        var shift = this.props.location.state.newShift;
        shift.salesReport = shift.salesReport.sort(this.productSortingMethod);
        var productsDict = this.getProductsDict(shift.salesReport);
        for(var index in shift.salesReport){
            shift.salesReport[index].stockStartShift = 1;
        }
        return{
            shift: shift,
            productDictionary: productsDict
        }
    },
    getProductsDict(products)
    {
        var productsDict = [];
        var subCategories = [];
        products.forEach(function(prod) {
            if (subCategories.indexOf(prod.subCategory)==-1) {
                subCategories.push(prod.subCategory)
            }
        });
        subCategories.forEach(function(subCategory) {
            var productsArray = [];
            for(var i=0; i<products.length; i++) {
                 if(products[i].subCategory===subCategory) {
                     productsArray.push(products[i])
                 }
             }
             productsDict.push(
                 { subCategory:subCategory,
                      products:productsArray })
        });
        return productsDict;
    },
    productSortingMethod: function(a, b){
        if(a.category != b.category){
            if(a.category == constantsStrings['ספיריט'])
                return 1;
            else
                return -1;
        }

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

    componentWillMount() {
        setTimeout(() => {
            window.history.forward()
        }, 0)
        window.onunload=function(){null};
    },

    handleSubmitReport: function (e) {
        e.preventDefault();
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.startShift(this.state.shift).then(function (n) {
                self.context.router.push({
                    pathname: paths.salesman_sale_path,
                    state: {newShift: self.state.shift}
                })
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

    onReturn:function(event) { //TODO: relate this method to return button
        this.context.router.push({
            pathname: paths.salesman_home_path,
            state: {newShift: this.state.shift}
        })
    },

    onUpdateProduct:function(event) {
        var currProductId = event.target.value;
        var isSelected = event.target.checked;
        var shift = this.state.shift;
        for (var productIndex in shift.salesReport) {
            if (currProductId == shift.salesReport[productIndex].productId) {
                if (isSelected) {
                    shift.salesReport[productIndex].stockStartShift = 1;
                } else {
                    shift.salesReport[productIndex].stockStartShift = 0;
                }
            }
        }
        this.setState({
            shift: shift
        });
    },

    renderEachProduct: function(product, i){
        return (
                <li style={styles.product} key={i}>
                    <div style={styles.checkbox__detail} className="col-sm-2">
                        <input type="checkbox" onChange={this.onUpdateProduct} checked={product.stockStartShift == 1} style={styles.product__selector} value={product.productId}/>
                    </div>
                    <div style={styles.product__detail} className="col-sm-10">
                        <h1 className="w3-xxxlarge col-sm-12"><b> {product.name} </b></h1>
                    </div>
                </li>
        );
    },
    renderEachSubCategory: function(productsBySub, i) {
        return (
            <ul className="w3-card-4" style={styles.subCategory}>
                <h1>{productsBySub.subCategory}</h1>
                {productsBySub.products.map(this.renderEachProduct)}
            </ul>
        );
    },
    renderStartShift: function () {
        return (
            <div>
                <div className="w3-theme-d5 col-xs-12" style={styles.top__title}>
                    <h1 className="w3-xxxlarge">{constantsStrings.storeStatus_string}</h1>
                    <div style={styles.start__button}>
                        <span className="w3-xxxlarge"
                              onClick={this.onReturn}>
                            <BackButtonIcon/>
                        </span>
                        <button className="col-xs-offset-7 w3-theme-d4 w3-card-4 w3-xxxlarge btn"
                                onClick={this.handleSubmitReport} type="submit">
                            {constantsStrings.startShift_string}
                            <StartShiftIcon/>
                        </button>
                    </div>
                </div>
                <div style={styles.space} className="w3-theme-l5">
                </div>
                <div className="w3-container text-center" style={{'paddingBottom': '80px'}}>
                    {this.state.productDictionary.map(this.renderEachSubCategory)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
           </div>
        )
    },

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.shift != null)
        {
            return this.renderStartShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = StartShiftContainer;