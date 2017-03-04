/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var salesmanServices = require('../communication/salesmanServices');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/startShiftStyles');
var WineGlassIcon = require('react-icons/lib/fa/glass');
var StartShiftIcon = require('react-icons/lib/fa/angle-double-left');

var StartShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState()
    {
        return{
            shift:this.props.location.state.newShift
        }
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        var self = this;
        salesmanServices.startShift(this.state.shift).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    alert('edit succeed');
                    self.context.router.push({
                        pathname: paths.salesman_sale_path,
                        state: {newShift: self.state.shift}
                    })
                }
                else {
                    alert('edit failed');
                }
            }
            else {
                alert('edit failed');
            }
        })
    },
    onUpdateProduct:function(event) {
        var currProductId = event.target.value;
        var isSelected = event.target.checked;
        for (var product of this.state.shift.salesReport) {
            if (currProductId == product.productId) {
                if (isSelected) {
                    product.stockStartShift = 1;
                } else {
                    product.stockStartShift = 0;
                }
            }
        }
    },
    renderEachProduct: function(product, i){
        return (
                <li style={styles.product} key={i}>
                    <div style={styles.checkbox__detail}>
                        <input type="checkbox" onChange={this.onUpdateProduct} style={styles.product__selector} value={product.productId}/>
                    </div>
                    <div style={styles.product__detail}>
                        <h1 className="w3-xxxlarge"><b> {product.name} </b></h1>
                    </div>
                    <div style={styles.image__detail} className="image-rounded">
                        <div className="w3-theme-d5" style={styles.product__image}><WineGlassIcon/></div>
                    </div>
                </li>
        );
    },
    renderStartShift: function () {

        return (

            <div>
                <div className="w3-theme-d5 col-sm-12" style={styles.top__title}>
                    <h1 className="w3-xxxlarge">{constantsStrings.storeStatus_string}</h1>
                    <div className="container col-sm-offset-7" style={styles.start__button}>
                        <button className="w3-theme-d5 w3-xxxlarge btn"
                                onClick={this.handleSubmitReport} type="submit">
                            <StartShiftIcon/>
                            {constantsStrings.startShift_string}
                        </button>
                    </div>
                </div>
                <div style={styles.space} className="w3-theme-l5">
                </div>

                <div>
                    <ul className="col-sm-10 col-sm-offset-1 w3-card-4" style={styles.products__list}>
                            {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                    </ul>
                </div>



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