/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var ReactBsTable            = require("react-bootstrap-table");
var ReactBootstrap          = require('react-bootstrap');
var Collapse                = ReactBootstrap.Collapse;
var constantStrings         = require('../utils/ConstantStrings');
var paths                   = require('../utils/Paths');
var styles                  = require('../styles/salesmanStyles/addSaleStyles');
var salesmanServices        = require('../communication/salesmanServices');
var StartShiftIcon          = require('react-icons/lib/fa/angle-double-left');
var PlusIcon                = require('react-icons/lib/fa/plus');
var MinusIcon               = require('react-icons/lib/fa/minus');
var DownArrow               = require('react-icons/lib/fa/angle-double-down');
var UpArrow                 = require('react-icons/lib/fa/angle-double-up');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');

var ShiftMakeSalesContainer = React.createClass({

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

    getInitialState(){
        this.setSessionId();
        this.setUserType();
        return{
            shift: null,
            subCategory_to_productList: [],
            soldProducts: {},
            subCategoriesOpen: {}
        }
    },

    componentDidMount() {
        this.updateShift();
    },

    updateShift(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (currShift) {
            let subCategories = new Set(currShift.salesReport
                .map((product) => product.subCategory));
            let subCategory_to_productList = {};
            let subCategoriesOpen = {}; // uses for collapse of subCategories
            for(let subCategory of subCategories){
                subCategoriesOpen[subCategory] = false;
                let productList = currShift.salesReport
                    .filter((product) => product.subCategory == subCategory)
                    .sort(self.productSortingMethod);
                subCategory_to_productList[subCategory] = {
                    subCategory: subCategory,
                    products: productList
                };
            }

            self.setState(
                {
                    shift: currShift,
                    subCategory_to_productList: subCategory_to_productList,
                    subCategoriesOpen: subCategoriesOpen
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

    productSortingMethod: function(a, b){
        if(a.name < b.name)
            return -1;
        else if(a.name > b.name)
            return 1;
        return 0;
    },

    stringSortingMethod: function(a, b){
        if(a < b)
            return -1;
        else if(a > b)
            return 1;
        return 0;
    },

    handleFinishShift: function(){
        this.context.router.push({
            pathname: paths.salesman_endShift_path,
            state:{newShift:this.state.shift}
        });
    },

    onClickPlus: function(productId){
        let soldProducts = this.state.soldProducts;
        soldProducts[productId]["quantity"] += 1;
        this.setState({
            soldProducts: soldProducts
        });
    },

    onClickMinus: function(productId){
        let soldProducts = this.state.soldProducts;
        soldProducts[productId]["quantity"] -= 1;
        if(soldProducts[productId]["quantity"] == 0){
            delete soldProducts[productId]
        }
        this.setState({
            soldProducts: soldProducts
        });
    },


    onClickProduct: function(product){
        let soldProducts = this.state.soldProducts;
        soldProducts[product.productId] = {
            product: product,
            quantity: 1
        };
        let subCategory_to_products = this.state.subCategory_to_productList;
        subCategory_to_products[product.subCategory].products = subCategory_to_products[product.subCategory].products
            .filter((prod) => prod.productId != product.productId);

        this.setState({
            soldProducts: soldProducts,
            subCategory_to_productsList: subCategory_to_products
        });
    },

    onClickAddSale: function(){
        let self = this;
        let notificationSystem = this.refs.notificationSystem;
        let shiftId = this.state.shift._id;
        let soldProducts = this.state.soldProducts;
        let salesList = Object.keys(this.state.soldProducts)
            .map(function(id){
                return  {
                    productId: id,
                    quantity: soldProducts[id].quantity
                }
            });
        salesmanServices.reportSale(shiftId, salesList)
            .then(function(result){
                let subCategory_to_productList = self.state.subCategory_to_productList;
                for(let index in soldProducts){
                    subCategory_to_productList[soldProducts[index].product.subCategory]
                        .products
                        .push(soldProducts[index].product);
                }
                self.setState({
                    soldProducts: {},
                    subCategory_to_productList: subCategory_to_productList
                })
            }).catch(function(errMsg){
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMsg,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    onClickOpenBottle: function() {
        let self = this;
        let notificationSystem = this.refs.notificationSystem;
        let shiftId = this.state.shift._id;
        let soldProducts = this.state.soldProducts;
        let openList = Object.keys(this.state.soldProducts)
            .map(function(id){
                return  {
                    productId: id,
                    quantity: soldProducts[id].quantity
                }
            });
        salesmanServices.reportOpen(shiftId, openList)
            .then(function(result){
                let subCategory_to_productList = self.state.subCategory_to_productList;
                for(let index in soldProducts){
                    subCategory_to_productList[soldProducts[index].product.subCategory]
                        .products
                        .push(soldProducts[index].product);
                }
                self.setState({
                    soldProducts: {},
                    subCategory_to_productList: subCategory_to_productList
                })
            }).catch(function(errMsg){
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMsg,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    renderStartedSale(){
        if(Object.keys(this.state.soldProducts).length > 0){
            let soldProducts = Object.keys(this.state.soldProducts).map((id) => this.state.soldProducts[id]);
            return(
                <div>
                    <div style={styles.reportTopContainer}>
                        <div style={styles.reportButtonsContainer}>
                            <button onClick={this.onClickAddSale} className="w3-round-xxlarge w3-theme-d5 w3-xxxlarge w3-card-8" > {constantStrings.reportSale_string}</button>
                        </div>
                        <div style={styles.reportButtonsContainer}>
                            <button onClick={this.onClickOpenBottle} className="w3-round-xxlarge w3-theme-d5 w3-xxxlarge w3-card-8">{constantStrings.reportOpen_string}</button>
                        </div>
                    </div>
                    <div className="col-sm-10 col-sm-offset-1" style={{marginTop: '20px'}}>
                        <h1 className="text-center"><b>{constantStrings.selectedProducts_string}</b></h1>
                        {soldProducts.map(this.renderEachSoldProduct)}
                    </div>
                </div>
            )
        }
        else{
            return <div></div>
        }

    },

    renderEachSoldProduct: function(productAndQuantity){
        return (
            <div className="col-sm-12 w3-round-xlarge w3-theme-l4 w3-xxxlarge"
                style={styles.productSaleRow}>
                <span style={{float: 'right', marginTop: '15px'}}>{productAndQuantity.product.name}</span>
                <span style={{float: 'left', marginTop: '15px'}}>
                    <span onClick={() => this.onClickPlus(productAndQuantity.product.productId)}><PlusIcon/></span>
                    <span style={{marginLeft: '20px', marginRight: '20px'}}>{productAndQuantity.quantity}</span>
                    <span onClick={() => this.onClickMinus(productAndQuantity.product.productId)}><MinusIcon/></span>
                </span>
            </div>
        )
    },

    renderEachProduct: function(product){
        return (
            <div className="col-sm-12 w3-round-xlarge w3-theme-l4 w3-xxxlarge"
                 style={styles.productSaleRow}  onClick={() => this.onClickProduct(product)}>
                <span style={{float: 'right', marginTop: '15px'}}>{product.name}</span>
                <span style={{float: 'left', marginTop: '15px'}} className="w3-xxxlarge"><PlusIcon /></span>
            </div>
        )
    },

    renderArrow: function(isOpen){
        if(isOpen){
            return (
                <span className="w3-jumbo">
                    <UpArrow/>
                </span>
            )
        }
        else{
            return (
                <span className="w3-jumbo">
                    <DownArrow/>
                </span>
            )
        }
    },

    renderProductsForSubCategory: function(category){
        let self = this;
        let productsAndCategory = this.state.subCategory_to_productList[category];
        return (
            <div className="col-sm-12" key={category} style={{marginTop: '15px'}}>
                <button className="w3-btn w3-round-xlarge w3-theme-d3 col-sm-12 text-center" style={{marginBottom: '10px'}} onClick={function(){
                    let subCategoriesOpen = self.state.subCategoriesOpen;
                    subCategoriesOpen[category] = !subCategoriesOpen[category];
                    self.setState({subCategoriesOpen: subCategoriesOpen});
                }}>
                    <h1 className="w3-xxxlarge"><b style={{fontSize: '55px'}}>{productsAndCategory.subCategory}</b></h1>
                    {this.renderArrow(self.state.subCategoriesOpen[category])}
                </button>
                <Collapse in={this.state.subCategoriesOpen[category]}>
                    <div className="col-sm-10">
                        {productsAndCategory.products.map(this.renderEachProduct)}
                    </div>
                </Collapse>
            </div>
        )
    },

    renderProducts(){
        let self = this;
        let categories = Object.keys(this.state.subCategory_to_productList).sort();
        return(
            <div>
                <div className="w3-theme-d5 col-xs-12">
                    <button className="col-xs-offset-7 w3-theme-d5 w3-xxxlarge btn"
                            onClick={this.handleFinishShift} type="submit">
                        {constantStrings.endShift_string}
                        <StartShiftIcon/>
                    </button>
                </div>
                {this.renderStartedSale()}
                <div>
                    {categories.map(this.renderProductsForSubCategory)}
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
            return this.renderProducts();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftMakeSalesContainer;