/**
 * Bandwidth Usage Widget
 */
import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

class BandwidthUsageWidget extends Component {

  

    render() {
        return (
            <div className="card">
                <ReactSpeedometer
                    value={this.state.bandwidthUsage}
                    startColor="red"
                    endColor="green"
                    needleColor="steelblue"
                    height={200}
                    ringWidth={40}
                    needleColor="#895DFF"
                    currentValueText="Bandwidth Usage: ${value} Kb"
                />
            </div>
        );
    }
}

export default BandwidthUsageWidget;
