/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var PropTypes = React.PropTypes;
var constantStrings = require("../Utils/constantStrings");

function Base(props) {
    return (
        <div col-sm-offset-12 col-sm-1>
            <button
                className="btn btn-block btn-link"
                onClick={props.OnLogoutUser}>
                {constantStrings}/logoutString
            </button>
        </div>
    )
}

Base.propTypes = {
    OnLogoutUser: PropTypes.func.isRequired,
}
module.exports = Base;
