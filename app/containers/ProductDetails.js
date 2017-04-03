/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var productInfo = require('../models/product');
var paths = require('../utils/Paths');
var NotificationSystem = require('react-notification-system');
var styles = require('../styles/managerStyles/styles');

var ProductDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
            category:'',
            subCategory:''
        }
    },

    componentDidMount() {
        console.log('check props');
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        this.state.editing = isEmptyVar;
        console.log(this.state.editing);
        if (this.state.editing) {
            this.setFields();
        }
    },

    checkDropDowns: function() {
        return (this.state.subCategory!='' && this.state.category!='');
    },

    isEmpty: function(obj) {
            for(var i in obj) { return false; }
            return true;
    },

    handleCategoryChange(event) {
        this.setState({category: event.target.value});
    },

    handleSubCategoryChange(event) {
        this.setState({subCategory: event.target.value});
    },

    getOptions: function(arrayOfObjects) {
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            optionsForDropDown.push(<option value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    handleSubmitUser: function (e) {
        e.preventDefault();
        /*if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }*/
        //                        parseInt("the string you want to parse to int")
        var newProduct = new productInfo();
        newProduct.name = this.refs.nameBox.value;
        newProduct.retailPrice =  parseInt(this.refs.retailBox.value);
        //newProduct.salePrice =  parseInt(this.refs.saleBox.value);
        newProduct.category = this.state.category;
        newProduct.subCategory = this.state.subCategory;
        newProduct.minRequiredAmount =  parseInt(this.refs.minAmountBox.value);
        newProduct.notifyManager = this.refs.notifyBox.checked;
        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newProduct._id = this.props.location.query._id;
            managementServices.editProduct(newProduct).then(function (n) {
                if(n){
                        var val = n;
                        if (val.success) {
                            notificationSystem.addNotification({
                                message: constantsStrings.editSuccessMessage_string,
                                level: 'success',
                                autoDismiss: 2,
                                position: 'tc',
                                onRemove: function (notification) {
                                    context.router.push({
                                        pathname: paths.manager_products_path
                                    })
                                }
                            });
                        } else {
                            notificationSystem.addNotification({
                                message: constantsStrings.editFailMessage_string,
                                level: 'error',
                                autoDismiss: 5,
                                position: 'tc'
                            });
                        }
                }
                else{
                    notificationSystem.addNotification({
                        message: constantsStrings.editFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            })
        }else {
            managementServices.addProduct(newProduct).then(function (n) {
                if(n){
                        var val = n;
                        if (val.success) {
                            notificationSystem.addNotification({
                                message: constantsStrings.addSuccessMessage_string,
                                level: 'success',
                                autoDismiss: 2,
                                position: 'tc',
                                onRemove: function (notification) {
                                    context.router.push({
                                        pathname: paths.manager_products_path
                                    })
                                }
                            });
                        } else {
                            notificationSystem.addNotification({
                                message: constantsStrings.addFailMessage_string,
                                level: 'error',
                                autoDismiss: 5,
                                position: 'tc'
                            });
                        }
                }
                else{
                    notificationSystem.addNotification({
                        message: constantsStrings.addFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            })
        }
    },
    getTitle: function() {
      if (this.state.editing) {
          return constantsStrings.editProduct_string;
      }
      return constantsStrings.addProduct_string;
    },
    getButtonString: function() {
        if (this.state.editing) {
            return constantsStrings.edit_string;
        }
        return constantsStrings.add_string;
    },
    addNewProduct: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-d4 w3-card-8">
                <form onSubmit={this.handleSubmitUser} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{this.getTitle()}</b>
                        </h1>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.productName_string}:</label>

                    </div>
                    <div className="form-group">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="nameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.retailPrice_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="retailBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.category_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleCategoryChange} ref="categoryBox" data="" >
                            {this.getOptions(constantsStrings.categoryForDropdown)}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.subCategory_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleSubCategoryChange} ref="subCategoryBox" data="" >
                            {this.getOptions(constantsStrings.subCategoryForDropdown)}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.minRequiredAmount_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="minAmountBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-3 col-xs-offset-2">{constantsStrings.notifyManager_string}:</label>
                        <input type="checkbox"
                               className="col-xs-1"
                               ref="notifyBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-button w3-card-4 btn w3-theme-d5 col-xs-4 col-xs-offset-2"
                            type="submit">
                            {this.getButtonString()}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    setFields: function () {
        this.currProduct = this.props.location.query;
        this.state.category = this.currProduct.category;
        this.state.subCategory = this.currProduct.subCategory;
        this.refs.nameBox.value = this.currProduct.name;
        this.refs.retailBox.value = this.currProduct.retailPrice;
        //this.refs.saleBox.value = this.currProduct.salePrice;
        this.refs.categoryBox.value = this.currProduct.category;
        this.refs.subCategoryBox.value = this.currProduct.subCategory;
        this.refs.minAmountBox.value = this.currProduct.minRequiredAmount;
        this.refs.notifyBox.checked = this.currProduct.notifyManager;
    },
    render: function () {
        return this.addNewProduct();
    }
});

module.exports = ProductDetails;