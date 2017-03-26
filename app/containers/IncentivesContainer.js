/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var NotificationSystem = require('react-notification-system');

var styles = require('../styles/managerStyles/styles');
var encs = require('../utils/encouragmentsMock');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');



var IncentivesContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    onClickAddButton: function(){
        alert('moving to add incentive');
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path
        })
    },
    getInitialState() {
        return{
            incentives: null
        }
    },
    componentWillMount() {
        this.updateIncentives();
    },
    updateIncentives() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        console.log('fetching incentives');
        managementServices.getAllIncentives().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        incentives: result.info
                    });
                } else {
                    console.log("error in getAllIncentives: " + result.info);
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
    renderProductRow: function(productList, numOfProducts) {
        if (productList.length == 1){
            return (
                <p>{productList[0]} - {numOfProducts}</p>
            )
        }
        else{
            return productList.map(function(productName, i){
                return (
                    <p key={i}>{productName} - 1</p>
                )
            })
        }
    },
    renderCard: function(encouragement, i){
        return (
            <div className="w3-card-4 col-xs-3" style={styles.incentiveCard} key={i}>
                <header className="w3-container w3-theme-d3">
                    <h3>{encouragement.name}</h3>
                </header>

                <div className="w3-container" style={styles.incentiveCardDivider}>
                    {this.renderProductRow(encouragement.products, encouragement.numOfProducts)}
                </div>
                <button className="w3-button w3-block w3-theme-l1">
                    + Edit
                </button>
            </div>
        )
    },

    render: function () {
        return (
            <div className="col-xs-12">
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddButton}>+</button>
                <div className="row" style={styles.incentiveRow}>
                    {encs.encouragementList.map(this.renderCard)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = IncentivesContainer;