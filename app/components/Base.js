/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var PropTypes = React.PropTypes;

function Base(props) {
    return (
        <div className='main-container'>
            <div className="col-sm-1 col-sm-offset-11">
                <button
                    className="btn btn-block btn-link">
                    התנתק
                </button>
            </div>
            {props.children}
        </div>
    )
}

Base.propTypes = {
    //onLogoutUser: PropTypes.func.isRequired,
    children: PropTypes.isRequired
}
module.exports = Base;