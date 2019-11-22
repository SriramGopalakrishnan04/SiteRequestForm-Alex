import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Check from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

let isDismissed = false;

const buttonWrapperCss = {
    margin: 8,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
} as React.CSSProperties;


const buttonBaseCss = {
    margin: 8
} as React.CSSProperties;

const fullScreenContainerCompleteCss = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    background: green[500],
    opacity: 1,
    transition: 'opacity 0.3s ease 0s, background 0.3s ease 0s',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 99
} as React.CSSProperties;


const fullScreenContainerVisibleCss = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99,
    display: 'flex',
    background: 'rgba(51,51,51,0.5)',
    opacity: 1,
    transition: 'opacity 0.3s ease 0s',
    flexDirection: 'column',
    justifyContent: 'center'
} as React.CSSProperties;

const fullFormContainerHiddenCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
    opacity: 0,
    transition: 'opacity 0.3s ease 0s',
    flexDirection: 'column',
    pointerEvents: 'none',
    justifyContent: 'center'
} as React.CSSProperties;

const fullFormContainerVisibleCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
    background: 'rgba(51,51,51,0.5)',
    opacity: 1,
    transition: 'opacity 0.3s ease 0s',
    flexDirection: 'column',
    justifyContent: 'center'
} as React.CSSProperties;

const fullFormContainerCompleteCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
    background: green[500],
    opacity: 1,
    transition: 'opacity 0.3s ease 0s, background 0.3s ease 0s',
    flexDirection: 'column',
    justifyContent: 'center'
} as React.CSSProperties;

const fullFormContainerWarningCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
    background: red[500],
    opacity: 1,
    transition: 'opacity 0.3s ease 0s, background 0.3s ease 0s',
    flexDirection: 'column',
    justifyContent: 'center'
} as React.CSSProperties;

const spinnerCss = {
    // margin: 'auto',
    // zIndex: 101,
    margin: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 200,
    // flex: 3,
    zIndex: 101
} as React.CSSProperties;

const checkCss = {
    margin: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 200,
    // flex: 3,
    zIndex: 101
} as React.CSSProperties;

const messageCss = {
    flex: 1,
    textAlign: 'center',
    zIndex: 101
} as React.CSSProperties;

const getCssProps = (props, state) => {
    if (state.isDismissed) {
        return fullFormContainerCompleteCss;
    } else if (props.warning) {
        return fullFormContainerWarningCss;
    } else if (props.complete) {
        if (props.fullScreen) {
            return fullScreenContainerCompleteCss;
        } else {
            return fullFormContainerCompleteCss;
        }
    } else if (props.active) {
        if (props.fullScreen) {
            return fullScreenContainerVisibleCss;
        } else {
            return fullFormContainerVisibleCss;
        }
    } else {
        return fullFormContainerHiddenCss;
    }
};

export interface Props {
    complete: boolean;
    active: boolean;
    warning: boolean;
    warningMessage?: string;
    successMessage?: string;
    fullScreen?: boolean;
}

export interface State {
    isDismissed: boolean;
}


class FullFormLoader extends React.Component<Props, State> {
    public state: State = {
        isDismissed: false
    };

    private dismissNotification = () => {
        this.setState({
            isDismissed: true
        });
    }

    private addStylesheetRules() {
        var styleEl = document.createElement('style');

        // Append <style> element to <head>
        document.head.appendChild(styleEl);

        styleEl.id = "spfx-full-form-loader-hack";
        // Grab style element's sheet
        var styleSheet = styleEl.sheet;

        // console.log(styleSheet.insertRule)
        // Insert CSS Rule
        styleSheet["insertRule"]('.Canvas-slideUpIn {opacity: 1 !important; animation-fill-mode: unset !important}', 0);

    }

    public componentDidMount() {
        this.addStylesheetRules();
    }

    public render() {
        const currentCssProps = getCssProps(this.props, this.state);
        return (
            <div>
                <Fade in={!this.props.complete && this.props.active} mountOnEnter={true} unmountOnExit={true}>
                    <div style={currentCssProps}>
                        <Fade in={!this.props.complete && this.props.active}>
                            <CircularProgress style={spinnerCss} size={100} />
                        </Fade>
                    </div>
                </Fade>
                <Fade in={this.props.complete} mountOnEnter={true} unmountOnExit={true}>
                    <div style={currentCssProps}>
                        <Zoom in={this.props.complete}>
                            <Check color="primary" style={checkCss} />
                        </Zoom>
                        <Fade in={this.props.complete}>
                            <div style={{ textAlign: 'center', paddingLeft: 20, paddingRight: 20 }}>
                                {this.props.successMessage}
                            </div>
                        </Fade>
                        {this.props.fullScreen && !this.state.isDismissed && <div style={buttonWrapperCss}>
                            <Button style={buttonBaseCss} variant="outlined" color="primary" onClick={() => { this.dismissNotification(); }}>Dismiss</Button>
                        </div>}
                    </div>
                </Fade>
                <Fade in={this.props.warning} mountOnEnter={true} unmountOnExit={true}>
                    <div style={currentCssProps}>
                        <Zoom in={this.props.warning}>
                            <Warning color="primary" style={{ width: 200, height: 200, marginLeft: 'auto', marginRight: 'auto' }} />
                        </Zoom>
                        <Fade in={this.props.warning}>
                            <div style={{ textAlign: 'center' }}>
                                {this.props.warningMessage}
                            </div>
                        </Fade>
                    </div>
                </Fade>

            </div>
        );
    }
}

export default FullFormLoader;