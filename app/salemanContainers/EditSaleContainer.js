/**
 * Created by lihiverchik on 31/03/2017.
 */
/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var styles                  = require('../styles/salesmanStyles/editSaleStyles');
var moment                  = require('moment');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');
var CloseIcon               = require('react-icons/lib/fa/close');

var EditSaleContainer = React.createClass({

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
            sales: []
        }
    },

    componentDidMount() {
        this.updateShift();
    },

    updateShift(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (currShift) {
            self.setState({
                shift: currShift,
                sales: currShift.sales
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
    onUpdateAmount: function (row, i) {
        var quantity = this.refs["quantity" + i].value;
        this.updateAmount(row,quantity);
    },
    updateAmount:function (sale,quantity){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.editSale(this.state.shift._id, sale.productId, sale.timeOfSale, quantity)
            .then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.editSuccessMessage_string,
                    level: 'info',
                    autoDismiss: 1,
                    position: 'tc'
                });
                self.updateShift();
            }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        });
    },

    renderEachSale: function(sale, i){
        var saleTime = new Date(sale.timeOfSale) ;
        var saleTimeFormated = saleTime.toLocaleTimeString('en-GB');
        return (

            <div key={i} className="row w3-card-4 w3-round" style={styles.saleContStyle}>
                <header className="w3-container w3-round" style={styles.headerStyle}>
                    <div className="w3-xxlarge">
                        <a href="javascript:void(0)" onClick={() => this.updateAmount(sale, "0")}>
                            <CloseIcon/>
                        </a>
                    </div>
                    <p className="w3-xxxlarge" style={styles.storeStyle}>{sale.name}</p>
                    <p className="w3-xxxlarge" style={styles.dateStyle}> {saleTimeFormated}</p>
                </header>
                <div className="w3-xxlarge text-center" style={styles.expContainerStyle}>
                    <p><b>{constantStrings.quantity_string}</b>:&nbsp;
                        <input type="number" min="0" style={styles.inputStyle}  ref={"quantity" + i} defaultValue={sale.quantity} />
                    </p>
                </div>
                <div className="text-center">
                    <button className="w3-xxlarge w3-btn w3-card-4 w3-round w3-ripple" style={styles.buttonStyle} onClick={() => this.onUpdateAmount(sale, i)}>
                        {constantStrings.save_string}
                    </button>
                </div>

            </div>
        )
    },

    renderList: function(){
        return (
            <div className="w3-container col-sm-10 col-sm-offset-1" style={styles.bodyStyle}>
                {this.state.sales.map(this.renderEachSale)}
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
            return this.renderList();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = EditSaleContainer;