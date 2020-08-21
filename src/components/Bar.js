import React, { Component } from 'react'

export default class Bar extends Component {
    render() {
        const { value, color } = this.props;
        return (
            <div
                style={
                    {
                        marginTop: "40px",
                        width: value + "%",
                        height: "20px",
                        backgroundColor: color,
                        boxShadow: "1px"
                    }
                }
            >

            </div>
        );
    }
}
