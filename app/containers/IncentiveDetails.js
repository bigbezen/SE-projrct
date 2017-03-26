/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var NotificationSystem = require('react-notification-system');

var constantsStrings = require('../utils/ConstantStrings');
var styles = require('../styles/managerStyles/styles');
var encs = require('../utils/encouragmentsMock');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');



var IncentiveDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
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

    addProduct: function(){

    },

    handleSubmitIncentive: function (e) {
        e.preventDefault();
        /*if (!this.checkDropDowns()) {
         alert('Invalid values. please make sure that you filled all of the fields');
         return;
         }*/
        //                        parseInt("the string you want to parse to int")
        var newProduct = new productInfo();
        newProduct.name = this.refs.nameBox.value;
        newProduct.retailPrice =  parseInt(this.refs.retailBox.value);
        newProduct.salePrice =  parseInt(this.refs.saleBox.value);
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
    addNewIncentive: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-d4 w3-card-8">
                <form onSubmit={this.handleSubmitIncentive} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{constantsStrings.addIncentive_string}</b>
                        </h1>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveName_string}:</label>
                    </div>
                    <div className="form-group">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="nameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveProducts_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleSubCategoryChange}
                                ref="productsBox" data="" >
                            {this.getOptions(constantsStrings.subCategoryForDropdown)}
                        </select>
                    </div>

                    <div className="form-group">
                        <button className="w3-card-4 w3-button col-xs-1 col-xs-offset-2" onClick={this.addProduct}>+</button>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveNumOfProducts_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="numOfProductsBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveRate_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="rateBox"
                        />
                    </div>


                    <div className="form-group">
                        <button
                            className="w3-button w3-card-4 btn w3-theme-d5 col-xs-4 col-xs-offset-2"
                            type="submit">
                            {constantsStrings.add_string}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },
    render: function () {
        return this.addNewIncentive();
    }
});

module.exports = IncentiveDetails;