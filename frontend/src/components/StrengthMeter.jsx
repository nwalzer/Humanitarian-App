import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import zxcvbn from 'zxcvbn';
import '../App.css'


class StrengthMeter extends Component {
    createPasswordLabel = (result) => {
        switch (result.score) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return 'Weak';
        }
    }

    createStrengthColor = (result) => {
        switch (result.score) {
            case 0:
            case 1:
                return '#F25F5C';
            case 2:
                return '#FFE066';
            case 3:
                return '#247BA0';
            case 4:
                return '#70C1B3';
            default:
                return '#F25F5C';
        }
    }

    render() {
        const { password } = this.props;
        var testedResult = zxcvbn(password);
        return (
            <div className="password-strength-meter">
                <progress
                    className={`password-strength-meter-progress strength-${this.createPasswordLabel(testedResult)}`}
                    value={testedResult.score}
                    max="4"
                />
                <br />
                <label className="password-strength-meter-label">
                    <strong>Password strength:</strong> {this.createPasswordLabel(testedResult)}
                    <Tooltip title={testedResult.feedback.warning.length ? testedResult.feedback.warning : "Sorry, we cannot provide any additional feedback at this time"}>
                        <IconButton aria-label="More Info">
                            <InfoIcon/>
                        </IconButton>
                    </Tooltip>
                </label>
            </div>
        );
    }
}

export default StrengthMeter;