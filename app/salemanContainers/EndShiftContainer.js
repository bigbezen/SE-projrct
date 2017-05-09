/**
 * Created by lihiverchik on 11/01/2017.
 */

var React                   = require('react');
var constantsStrings        = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var paths                   = require('../utils/Paths');
var startShiftStyles        = require('../styles/salesmanStyles/startShiftStyles');
var styles                  = require('../styles/salesmanStyles/startShiftStyles');
var StartShiftIcon          = require('react-icons/lib/fa/angle-double-left');
var WineGlassIcon           = require('react-icons/lib/fa/glass');
var BackButtonIcon          = require('react-icons/lib/md/arrow-forward');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');


var EndShiftContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState()
    {
        this.setSessionId();
        this.setUserType();
        return{
            shift:null,
            ShiftId:this.props.location.state.newShift._id
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
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (n) {
            var currShift = n;
            for (var product of currShift.salesReport) {
                product.stockEndShift = product.stockStartShift
            }
            self.setState({shift: currShift});
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

    handleSubmitReport: function (e) {
        e.preventDefault();
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.finishShift(this.state.shift).then(function (n) {
                self.context.router.push({
                    pathname: paths.salesman_home_path,
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

    onReturn:function(event) {
        this.context.router.push({
            pathname: paths.salesman_sale_path,
            state: {newShift: this.state.shift}
        })
    },

    onUpdateProduct:function(event) {
        var currProductId = event.target.value;
        var isSelected = event.target.checked;
        var currShift = this.state.shift;
        for (var productIndex in currShift.salesReport) {
            if (currProductId == currShift.salesReport[productIndex].productId) {
                if (isSelected) {
                    currShift.salesReport[productIndex].stockEndShift = 1;
                } else {
                    currShift.salesReport[productIndex].stockEndShift = 0;
                }
            }
        }
        this.setState({shift:currShift});
    },

    renderEachProduct: function(product, i){
        return (
            <li style={styles.product} key={i}>
                <div style={styles.checkbox__detail} className="col-sm-2">
                    <input type="checkbox" onChange={this.onUpdateProduct} checked={product.stockEndShift == 1} style={styles.product__selector} value={product.productId}/>
                </div>
                <div style={styles.product__detail} className="col-sm-10">
                    <h1 className="w3-xxxlarge col-sm-12"><b> {product.name} </b></h1>
                    <h1 className="w3-xxlarge col-sm-12">{product.subCategory}</h1>
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
            return this.renderEndShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = EndShiftContainer;