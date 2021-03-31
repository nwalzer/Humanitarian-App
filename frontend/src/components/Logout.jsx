import React from 'react'
import { Router, withRouter } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const WhiteTextTypography = withStyles({
    root: {
        color: "#FFFFFF"
    }
})(Typography);


class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userStatus: null
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let res = false;
            if (user) {
                res = true;
            } else {
                res = false;
            }
            this.setState({ userStatus: res }, () => {
                console.log(this.state);
            });
        })
    }

    handleLogout() {
        firebase.auth().signOut();
    }
    handleClick(e) {
        this.handleLogout();
    }

    handleClickUserMap(e) {
        this.props.history.push("/userhome");
    }

    handleClickHeatMap(e) {
        this.props.history.push("/heatmap");
    }

    handleClickHome(e) {
        this.props.history.push("/");
    }

    handleClickProj(e) {
        this.props.history.push("/aboutus");
    }



    render() {
        if (this.state != null) {
            if (this.state.userStatus == null) {
                return <div></div>;
            } else if (this.state.userStatus) {
                return (
                    <div>
                        <Button color="primary" onClick={this.handleClickHome.bind(this)}>
                            <WhiteTextTypography noWrap> Home </WhiteTextTypography>
                        </Button>
                        <br />
                        <Button color="primary" onClick={this.handleClickProj.bind(this)}>
                            <WhiteTextTypography noWrap> About the Project </WhiteTextTypography>
                        </Button>
                        <br />
                        <Button color="primary" onClick={this.handleClickUserMap.bind(this)}>
                            <WhiteTextTypography noWrap> User Map </WhiteTextTypography>
                        </Button>
                        <br />
                        <Button color="primary" onClick={this.handleClickHeatMap.bind(this)}>
                            <WhiteTextTypography noWrap> Resource Heatmap </WhiteTextTypography>
                        </Button>
                        <br />
                        <Button color="primary" onClick={this.handleClick.bind(this)}>
                            <WhiteTextTypography noWrap> Logout </WhiteTextTypography>
                        </Button>



                    </div>
                );
            }
            else {
                return <div></div>;
            }
        }
        else {
            return <div></div>;
        }


    }
}

export default withRouter(Logout);



