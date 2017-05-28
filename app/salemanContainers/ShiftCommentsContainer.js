/**
 * Created by lihiverchik on 25/03/2017.
 */

var React                   = require('react');
var salesmanServices        = require('../communication/salesmanServices');
var constantsStrings        = require('../utils/ConstantStrings');
var styles                  = require('../styles/salesmanStyles/shiftCommentsStyles');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');

var ShiftComments = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState(){
        this.setSessionId();
        this.setUserType();
        return{
            shift: null,
            viewMode: true
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
        this.updateShift();
    },

    updateShift(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (currShift) {
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

    changeStateToAddMode: function(){
        this.setState({viewMode: false})
    },

    changeStateToViewMode: function(){
        this.setState({viewMode: true})
    },

    handleAddComment(){
        var content = this.refs.commentContent.value;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.addShiftComment(this.state.shift._id,content).then(function (n) {
            self.updateShift()
            self.changeStateToViewMode()
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

    renderEachComment: function(comment, i) {
        return (
                <div key={i} className="row col-xs-10 col-xs-offset-1 w3-card-4" style={styles.commentsStyle}>
                    <p className="w3-xxlarge"><b> {comment} </b></p>
                </div>
        )
    },

    renderAddMode: function(){
        return(
            <div className='main-container' >
                <div className="w3-container" style={styles.containerStyle}>
                    <div className="row col-xs-10 col-xs-offset-1 w3-card-4 col-offset-xs-2" style={styles.commentsStyle}>
                        <h1>{constantsStrings.addCommentContent_string}</h1>
                        <input ref="commentContent" className="col-xs-10 col-offset-xs-2 w3-input w3-xxlarge"  type="text"/>
                        <div className="text-center">
                            <button className="w3-theme-d5 w3-xxlarge btn w3-card-8" style={styles.CommentsButtons} onClick={this.handleAddComment}> {constantsStrings.add_string}</button>
                            <button className="w3-theme-d5 w3-xxlarge btn w3-card-8" style={styles.CommentsButtons} onClick={this.changeStateToViewMode}> {constantsStrings.close_string}</button>
                        </div>
                    </div>
                    {this.state.shift.shiftComments.map(this.renderEachComment)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderViewMode: function(){
        return (
            <div className='main-container'>
                <div className="w3-container" style={styles.containerStyle}>
                    <div className="text-center">
                        <button className="w3-theme-d5 w3-xxlarge btn w3-card-8" style={styles.CommentsButtons} onClick={this.changeStateToAddMode}> {constantsStrings.addComment_string}</button>
                    </div>
                    {this.state.shift.shiftComments.map(this.renderEachComment)}
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
        if(this.state.shift != null && this.state.viewMode)
        {
            return this.renderViewMode();
        }
        else if(this.state.shift != null && !(this.state.viewMode))
        {
            return this.renderAddMode();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftComments;