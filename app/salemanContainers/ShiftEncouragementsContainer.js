/**
 * Created by lihiverchik on 31/03/2017.
 */

var React                   = require('react');
var salesmanServices        = require('../communication/salesmanServices');
var userServices            = require('../communication/userServices');
var managementServices      = require('../communication/managementServices');
var NotificationSystem      = require('react-notification-system');
var styles                  = require('../styles/salesmanStyles/encouragementsStyles');
var constantsStrings        = require('../utils/ConstantStrings');
var underscore              = require('underscore');

var ShiftEncouragementsContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState(){
        this.setSessionId();
        this.setUserType();
        return{
            encouragementsStatus: null,
            totalEncouragementsStatus: null
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
            self.updateEncouragements(n);
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

    updateEncouragements(shift) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllIncentives().then(function (n) {
            self.updateEncouragementsStatus2(shift, n);
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

    updateEncouragementsStatus2(shift, encouragements) {
        var encouragementsStatus = [];
        var totalEncouragementsStatus = 0;
        var salesReport = shift.salesReport;
        var soldProducts = {};
        var i;
        for(i=0; i<salesReport.length; i++) {
            var product = salesReport[i];
            soldProducts[product.productId] = product.sold;
        }

        encouragements = encouragements.sort((enc1, enc2) => enc2.numOfProducts - enc1.numOfProducts);
        let allEncs = [];
        let totalEarnedSoFar = 0;
        for(let enc of encouragements) {
            let encProductsIds = enc.products.map((prod) => prod._id);
            let prodsInEnc = salesReport.filter(function(product){
                return (underscore.contains(encProductsIds, product.productId.toString()));
            });
            let totalSold = prodsInEnc
                .map((product) => product.sold)
                .reduce((sold1, sold2) => sold1+sold2, 0);

            let numOfAchievedEnc = parseInt(totalSold / enc.numOfProducts);
            allEncs.push({
                'encouragement': enc,
                'amountSold': numOfAchievedEnc > 0 ? totalSold : 0
            });
            totalEarnedSoFar += enc.rate * numOfAchievedEnc;

            let numOfProductsToReduce = numOfAchievedEnc * enc.numOfProducts;
            for(let prod of prodsInEnc) {
                if(numOfProductsToReduce > 0 && prod.sold > 0) {
                    let amountToReduce = (numOfProductsToReduce > prod.sold) ? prod.sold : numOfProductsToReduce;
                    prod.sold -= amountToReduce;
                    numOfProductsToReduce -= amountToReduce;
                }
            }
        }
        allEncs = allEncs.sort(function(enc1, enc2) {
            if (enc1.encouragement.name < enc2.encouragement.name)
                return -1;
            else if(enc1.encouragement.name > enc2.encouragement.name)
                return 1;
            else
                return enc1.encouragement.numOfProducts - enc2.encouragement.numOfProducts;
        });
        this.setState({
            encouragementsStatus : allEncs,
            totalEncouragementsStatus : totalEarnedSoFar
        });
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
        this.setState({encouragementsStatus : encouragementsStatus,
                  totalEncouragementsStatus : totalEncouragementsStatus})

    },

    renderProductRow: function(product, i) {
        return (
            <p>&nbsp;&nbsp;<label style={{fontSize:'30px'}}>{product.subCategory}</label>{" - " + product.name}</p>
        )
    },

    renderEachEncouragement: function(encouragementStatus, i) {
        return (
            <div key={i} className="row w3-card-4 w3-round-large" style={styles.encouragementStyle}>
                <header className="w3-container w3-round-large" style={styles.headerStyle}>
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
                <div className="row w3-card-4 w3-xxxlarge w3-round-large" style={styles.encouragementTopStyle}>
                    <p> {constantsStrings.encouragementsStatus_string} : {this.state.totalEncouragementsStatus} {constantsStrings.ils_string} </p>
                </div>
                <div className="w3-container" style={styles.bodyStyle}>
                    {this.state.encouragementsStatus.map(this.renderEachEncouragement)}
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