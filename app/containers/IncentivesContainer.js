/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var NotificationSystem  = require('react-notification-system');
var TrashIcon           = require('react-icons/lib/fa/trash-o');
var styles              = require('../styles/managerStyles/styles');
var paths               = require('../utils/Paths');
var managementServices  = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var userServices        = require('../communication/userServices');
var moment              = require('moment');

var IncentivesContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path
        })
    },
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
    },
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return{
            incentives: []
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
    setShiftsEndDate: function() {
        var shiftEndDate = localStorage.getItem('shiftEndDate');
        if (!shiftEndDate) {
            shiftEndDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftEndDate', shiftEndDate);
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
        this.updateIncentives();
    },

    updateIncentives() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllIncentives().then(function (result) {
            result.sort(function(a, b){
                return a.products.length - b.products.length;
            });
            self.setState({
                incentives: result
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
    onClickEdit: function(incentive){
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path,
            query: JSON.stringify(incentive)
        })
    },
    onClickDelete: function(incentive, index){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
        notificationSystem.clearNotifications();
        notificationSystem.addNotification({
            message: constantsStrings.areYouSure_string,
            level: 'info',
            autoDismiss: 0,
            position: 'tc',
            action: {
                label: constantsStrings.yes_string,
                callback:
                    function(){
                        self.handleDelete(incentive, index)
                    }
            }
        });
    },
    handleDelete: function(incentive, index){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteIncentive(incentive)
            .then(function(result){
                var newIncentives = self.state.incentives;
                newIncentives.splice(index, 1);
                self.setState({
                    incentives: newIncentives
                });
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.deleteMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc'
                });
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
            })
    },

    renderProductRow: function(product, i) {
        return (
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{product.name + " - " + product.subCategory}</p>
        )
    },
    renderCard: function(incentive, i){
        return (
            <div className="w3-card-2 col-xs-3" style={styles.incentiveCard} key={i}>
                <header className="w3-container" style={styles.incentiveHeaderStyle}>
                    <h3 className="w3-right">
                        {incentive.name}
                    </h3>
                    <h4 className="w3-left">
                        <a onClick={() => this.onClickDelete(incentive, i)}>
                            <TrashIcon/>
                        </a>
                    </h4>
                </header>

                <div className="w3-container" style={styles.incentiveCardDivider}>
                    <p><b>{constantsStrings.incentiveProducts_string}</b></p>
                    {incentive.products.map(this.renderProductRow)}
                    <p><b>{constantsStrings.incentiveNumOfProducts_string}</b>: {incentive.numOfProducts}</p>
                    <p><b>{constantsStrings.incentiveRate_string}</b>: {incentive.rate}</p>
                </div>

                <button className="w3-button w3-block" style={styles.editStyle} onClick={() => this.onClickEdit(incentive)}>
                    + Edit
                </button>
            </div>
        )
    },

    render: function () {
        return (
            <div className="col-xs-12">
                <button className="w3-card-4 w3-button w3-circle w3-xlarge w3-ripple" style={styles.addButtonStyle} onClick={this.onClickAddButton}>+</button>
                <div className="row" style={styles.incentiveRow}>
                    {this.state.incentives.map(this.renderCard)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = IncentivesContainer;