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
var BackButtonIcon = require('react-icons/lib/md/arrow-forward');
var userServices = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');

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
        for(var index in shift.salesReport){
            shift.salesReport[index].stockStartShift = 1;
        }
        return{
            shift: shift
        }
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
                    <div style={styles.checkbox__detail}>
                        <input type="checkbox" onChange={this.onUpdateProduct} checked={product.stockStartShift == 1} style={styles.product__selector} value={product.productId}/>
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

                <div>
                    <ul className="col-xs-10 col-xs-offset-1 w3-card-4" style={styles.products__list}>
                            {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
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
            return this.renderStartShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = StartShiftContainer;