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
    componentWillMount() {
      this.updateProducts();
    },
    getInitialState: function () {
        return {
            productsForIncentive: [1],
            products: []
        }
    },
    updateProducts: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getAllProducts().then(function (result) {
            if (result) {
                if (result.success) {
                    result.info = result.info.map((x) => x.name);
                    self.setState({
                        products: result.info
                    });
                } else {
                    console.log("error in getAllProducts: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in storesContainers: " + n);
            }
        })
    },
    getOptions: function(arrayOfObjects, index) {
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            optionsForDropDown.push(<option key={i + (index*10)} value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    addProduct: function(){
        var newProducts = this.state.productsForIncentive;
        newProducts.push(1);
        this.setState({
            productsForIncentive: newProducts
        })
    },

    deleteProduct: function(){
        var newProducts = this.state.productsForIncentive;
        newProducts.splice(-1);
        this.setState({
            productsForIncentive: newProducts
        });
    },

    renderProductChoice: function(product, i){
        return (
            <div className="row" style={styles.productSelect}>
                <select key={i} className="col-xs-4 col-xs-offset-2" onChange={this.handleSubCategoryChange}
                    ref={"product" + i} data="" >
                    {this.getOptions(this.state.products, i)}
                </select>
            </div>
        )
    },

    handleSubmitIncentive: function () {
        var incentiveName = this.refs.nameBox.value;

        var numOfProducts = this.state.productsForIncentive.length;
        var selectedProducts = [];
        for(var i=0; i<numOfProducts; i++) {
            var chosenProduct = this.refs["product" + i].value;
            if(chosenProduct != constantsStrings.dropDownChooseString)
                selectedProducts.push(chosenProduct);
        }

        var numOfProducts = this.refs.numOfProductsBox.value;
        var rate = this.refs.rateBox.value;

        var newIncentive = {
            name: incentiveName,
            products: selectedProducts,
            numOfProducts: numOfProducts,
            rate: rate,
            active: true
        };

        managementServices.addIncentive(newIncentive)
            .then(function(result) {
                alert(result)
            })
            .catch(function (err) {
                alert(err);
            });


        /**/
    },
    addNewIncentive: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-d4 w3-card-8">
                <form className="form-horizontal text-right w3-text-black" onSubmit={function(e){
                    e.preventDefault();
                }}>
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
                        {this.state.productsForIncentive.map(this.renderProductChoice)}
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <button className="w3-card-4 w3-circle w3-button col-xs-offset-2" onClick={this.addProduct}>+</button>
                            <button className="w3-card-4 w3-circle w3-button" onClick={this.deleteProduct}>-</button>
                        </div>
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
                            type="submit"
                        onClick={this.handleSubmitIncentive}>
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