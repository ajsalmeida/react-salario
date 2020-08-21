import React, { Component } from 'react';

export default class ReadOnlyInput extends Component {
    render() {
        const { label, value, color } = this.props;
        return (
            <div style={{
                color: color,
                fontWeight: "bold",
                textarea: color,
                fontDecorationColor: color

            }}>
                <label>
                    <span>{label}</span>
                    <input type='text' readOnly disabled value={value} />
                </label>
            </div>
        );
    }
}