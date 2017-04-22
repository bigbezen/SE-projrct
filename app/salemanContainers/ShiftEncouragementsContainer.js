/**
 * Created by lihiverchik on 31/03/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var userServices            = require('../communication/userServices');
var managementServices      = require('../communication/managementServices');
var NotificationSystem      = require('react-notification-system');
var styles                  = require('../styles/salesmanStyles/encouragementsStyles');
var constantsStrings        = require('../utils/ConstantStrings');

var ShiftEncouragementsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        this.setSessionId();
        return{
            encouragementsStatus: null,
            totalEncouragementsStatus: null
        }
    },
    componentDidMount() {
        this.updateShift();
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    updateShift(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    self.updateEncouragements(val.info);
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
    updateEncouragements(shift) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllIncentives().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    self.updateEncouragementsStatus(shift, val.info);
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
    updateEncouragementsStatus(shift, encouragements){
        var encouragementsStatus = [];
        var totalEncouragementsStatus = 0;
        var salesReport = shift.salesReport;
        var soldProducts = {};
        var i;
        for(i=0; i<salesReport.length; i++) {
            var product = salesReport[i];
            soldProducts[product.productId] = product.sold;
        }
        var j;
        for (j=0; j<encouragements.length; j++) {
            var count = 0;
            var encouragement = encouragements[j];
            encouragement.products.forEach(function(prod) {
                if(encouragement.active){
                    count+=soldProducts[prod._id];
                }
            });
            var numberOfEnc = Math.floor(count/encouragement.numOfProducts);
            var totalRate = numberOfEnc*encouragement.rate;
            totalEncouragementsStatus+=totalRate;
            encouragementsStatus[j] = {encouragement: encouragement,
                                        amountSold: count};
        }

        console.log("sold products:");
        console.log(soldProducts);
        console.log("encouragments:");
        console.log(encouragements);
        console.log("status:");
        console.log(encouragementsStatus);
        this.setState({encouragementsStatus : encouragementsStatus,
                  totalEncouragementsStatus : totalEncouragementsStatus})

    },
    renderProductRow: function(product, i) {
        return (
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{product.name}</p>
        )
    },
    renderEachEncouragement: function(encouragementStatus, i) {
        return (
            <div key={i} className="row w3-card-4 w3-round-large" style={styles.encouragementStyle}>
                <header className="w3-container w3-theme-d3 w3-round-large">
                    <p className="w3-xxxlarge" style={styles.encName}>{encouragementStatus.encouragement.name} :</p>
                    <p className="w3-xxxlarge" style={styles.encStatus}> {encouragementStatus.amountSold}/{encouragementStatus.encouragement.numOfProducts}</p>
                </header>

                <div className="w3-container">
                    <p><b>{constantsStrings.products_string} :</b></p>
                    {encouragementStatus.encouragement.products.map(this.renderProductRow)}
                    <p><b>{constantsStrings.incentiveRateSalesman_string}</b>: {encouragementStatus.encouragement.rate} {constantsStrings.ils_string}</p>
                </div>
            </div>
        )
    },
    renderList:function () {
        return(
            <div className='main-container'>
                <div className="row w3-card-4 w3-theme-d5 w3-xxxlarge w3-round-large" style={styles.encouragementTopStyle}>
                    <p> {constantsStrings.encouragementsStatus_string} : {this.state.totalEncouragementsStatus} {constantsStrings.ils_string} </p>
                </div>
                <div className="w3-container" style={styles.bodyStyle}>
                    {this.state.encouragementsStatus.map(this.renderEachEncouragement)}
                </div>
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
        if(this.state.encouragementsStatus != null)
        {
            return this.renderList();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftEncouragementsContainer;