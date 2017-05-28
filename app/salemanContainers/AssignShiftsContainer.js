/**
 * Created by shahafstein on 26/5/2017.
 */
var React               = require('react');
var constantsStrings    = require('../utils/ConstantStrings');
var styles              = require('../styles/salesmanStyles/salesmanShiftSchedule');
var userServices        = require('../communication/userServices');
var NotificationSystem  = require('react-notification-system');
var managementService   = require('../communication/managementServices');
var salesmanServices    = require('../communication/salesmanServices');
var moment              = require('moment');
var paths               = require('../utils/Paths');

var SalesmanAssignShiftsContainer = React.createClass({

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

    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return {
            shifts: null,
            availability: {}
        }
    },

    componentDidMount() {
        this.updateShifts();
    },

    sortShifts: function(a, b){
        var dateA = new Date(a.startTime);
        var dateB = new Date(b.startTime);
        if(dateA < dateB)
            return -1;
        else if(dateA > dateB)
            return 1;
        else{
            return 0;
        }
    },

    updateShifts: function() {
        var currentDate = moment().format('YYYY-MM-DD');
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementService.getShiftsByStatus(constantsStrings.SHIFT_STATUS.CREATED)
            .then(function (result) {
                let availability = {};
                let dates = new Set(result.map((shift) => shift.startTime));
                for(let date of dates){
                    availability[date] = {};
                    let areas = new Set(result.filter((shift) =>
                        (new Date(shift.startTime)).getTime() - (new Date(date)).getTime() == 0)
                        .map((shift) => shift.storeId.area));
                    for(let area of areas){
                        availability[date][area] = {
                            isAvailable: false,
                            comment: ""
                        };
                    }
                }
                self.setState({
                    shifts: result,
                    availability: availability
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

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    onClickSubmit: function(){
        let availability = this.state.availability;
        let notificationSystem = this.refs.notificationSystem;
        let self = this;
        salesmanServices.submitConstraints(availability)
            .then(function(result){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.goodActionMessage_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc'
                });

            })
            .catch(function(errMsg){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMess,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
            });
    },

    onClickArea: function(event){
        let area = event.target.value.split('_')[0];
        let date = event.target.value.split('_')[1];
        let availability = this.state.availability;
        availability[date][area]["isAvailable"] = event.target.checked;
        this.setState({
            availability: availability
        });
    },

    onChangeComment: function(area, date){
        this.state.availability[date][area]["comment"] = this.refs[area+date].value;
    },

    renderArea: function(area, date) {
        return (
            <div className="col-sm-12">
                <div className="col-sm-12" key={area+date}>
                    <p className="w3-right" style={{fontSize:'50px'}}>{area}</p>
                    <input type="checkbox" className="w3-left" ref={area + date}
                           onClick={this.onClickArea} checked={this.state.availability[date][area]["isAvailable"]}
                            style={{width:'50px', height:'50px', marginTop:'10px'}}
                           value={area+"_"+date} />
                </div>
                <div className="col-sm-12">
                    <input ref={area+date} onChange={() => this.onChangeComment(area, date)} className="col-xs-10 col-offset-xs-1 w3-input w3-xxlarge"  type="text"/>
                </div>
            </div>
        )
    },

    renderByDate: function(date){
        let shiftsOfDate = this.state.shifts.filter((shift) =>
            (new Date(shift.startTime)).getTime() - (new Date(date)).getTime() == 0);
        let areas = Array.from(new Set(shiftsOfDate.map((shift) => shift.storeId.area)));

        let shownDate = moment(date).format('YYYY-MM-DD');
        return (
            <div key={date} className="row w3-card-4 w3-round-large"
                 style={Object.assign(styles.shiftStyle, {paddingBottom: '30px'})}>
                <header className="w3-container w3-theme-d3 w3-round-large text-center">
                    <p className="w3-xxxlarge">{shownDate}</p>
                </header>
                {areas.map((area) => this.renderArea(area, date))}
            </div>
        )
    },

    renderTable: function() {
        let dates = Array.from(
            new Set(this.state.shifts.map((shift) => shift.startTime))
        ).sort(function(shift1, shift2){
            return (new Date(shift1)).getTime() - (new Date(shift2)).getTime();
        });

        return (
            <div className='main-container' style={styles.bodyStyle}>
                {dates.map(this.renderByDate)}
                <div className="col-sm-12 text-center">
                    <button className="w3-ripple w3-theme-d3 w3-round-xlarge w3-xxlarge w3-card-4" style={styles.buttonStyle} onClick={this.onClickSubmit}>
                        {constantsStrings.submitConstraints_string}
                    </button>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.shifts != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanAssignShiftsContainer;