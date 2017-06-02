/**
 * Created by lihiverchik on 05/01/2017.
 */

var React = require('react');

class Helpers extends React.Component {

    enumFormatter = function (cell, row, enumObject) {
        return enumObject[cell];
    };

}

module.exports = Helpers;