/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var salesmanServices = require('../communication/salesmanServices');
var paths = require('../utils/Paths');
var startShiftStyles = require('../styles/salesmanStyles/startShiftStyles');
var styles = require('../styles/salesmanStyles/startShiftStyles');
var StartShiftIcon = require('react-icons/lib/fa/angle-double-left');
var WineGlassIcon = require('react-icons/lib/fa/glass');
var BackButtonIcon = require('react-icons/lib/md/arrow-forward');
var userServices = require('../communication/userServices');


var EndShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState()
    {
        this.setSessionId();
        return{
            shift:null,
            ShiftId:this.props.location.state.newShift._id
        }
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
        var self = this;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    for (var product of currShift.salesReport) {
                        product.stockEndShift = product.stockStartShift
                    }
                    self.setState({shift: currShift});
                }
                else {
                }
            }
            else {
            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        var self = this;
        salesmanServices.finishShift(this.state.shift).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    self.context.router.push({
                        pathname: '/salesman/Home',
                        state: {newShift: self.state.shift}
                    })
                }
                else {
                   // alert('edit failed');
                }
            }
            else {
             //   alert('edit failed');
            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onReturn:function(event) { //TODO: relate this method to return button
        this.context.router.push({
            pathname: paths.salesman_sale_path,
            state: {newShift: this.state.shift}
        })
    },
    onUpdateProduct:function(event) {
        var currProductId = event.target.value;
        var isSelected = event.target.checked;
        var currShift = this.state.shift;
        for (var product of currShift.salesReport) {
            if (currProductId == product.productId) {
                if (isSelected) {
                    product.stockEndShift = 1;
                } else {
                    product.stockEndShift = 0;
                }
            }
        }
        this.setState({shift:currShift});
    },
    renderEachProduct: function(product, i){
        return (
            <li style={styles.product} key={i}>
                <div style={styles.checkbox__detail}>
                    <input type="checkbox" onChange={this.onUpdateProduct} checked={product.stockEndShift} style={styles.product__selector} value={product.productId}/>
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
    renderEndShift: function () {
        return (
            <div>
                <div className="w3-theme-d5 col-xs-12" style={styles.top__title}>
                    <h1 className="w3-xxxlarge">{constantsStrings.storeStatus_string}</h1>
                    <div style={styles.start__button}>
                        <span className="w3-xxxlarge"
                              onClick={this.onReturn}>
                            <BackButtonIcon/>
                        </span>

                        <button className="col-xs-offset-7 w3-theme-d4 w3-xxxlarge btn"
                                onClick={this.handleSubmitReport} type="submit">
                            {constantsStrings.endShift_string}
                            <StartShiftIcon/>
                        </button>

                    </div>
                </div>
                <div style={styles.space} className="w3-theme-l5">
                </div>

                <div>
                    <ul className="col-xs-10 col-xs-offset-1 w3-card-4" style={styles.products__list}>
                        {this.state.shift.salesReport.map(this.renderEachProduct)}
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
            return this.renderEndShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = EndShiftContainer;