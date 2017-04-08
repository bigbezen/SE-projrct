/**
 * Created by lihiverchik on 25/03/2017.
 */

var React = require('react');
var salesmanServices = require('../communication/salesmanServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/shiftCommentsStyles');
var userServices = require('../communication/userServices');

var ShiftComments = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        this.setSessionId();
        return{
            shift: null,
            viewMode: true
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
        this.updateShift();
    },
    updateShift(){
        var self = this;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    self.setState({shift: currShift});
                }
                else {
                }
            }
            else {
            }
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
        salesmanServices.addShiftComment(this.state.shift._id,content).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    self.updateShift()
                    self.changeStateToViewMode()
                }
                else {
                }
            }
            else {
            }
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