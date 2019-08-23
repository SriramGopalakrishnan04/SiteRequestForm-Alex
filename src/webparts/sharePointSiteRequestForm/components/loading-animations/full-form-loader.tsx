import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Check from '@material-ui/icons/Check';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import green from '@material-ui/core/colors/green';

const fullFormContainerHiddenCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
    display: 'flex',
    opacity: 0,
    transition: 'opacity 0.3s ease 0s',
    pointerEvents: 'none'
} as React.CSSProperties;

const fullFormContainerVisibleCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
    display: 'flex',
    background: 'rgba(51,51,51,0.5)',
    opacity: 1,
    transition: 'opacity 0.3s ease 0s'
} as React.CSSProperties;

const fullFormContainerCompleteCss = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
    display: 'flex',
    background: green[500],
    opacity: 1,
    transition: 'opacity 0.3s ease 0s, background 0.3s ease 0s'
} as React.CSSProperties;

const spinnerCss = {
    margin: 'auto'
} as React.CSSProperties;

const checkCss = {
    margin: 'auto',
    width: '50%',
    height: '50%'
};

const getCssProps = (props) => {
    if (props.complete) {
        return fullFormContainerCompleteCss;
    } else if (props.active) {
        return fullFormContainerVisibleCss;
    } else {
        return fullFormContainerHiddenCss;
    }
};

const FullFormLoader = (props) => {
    const currentCssProps = getCssProps(props);
    return (
        <div>
            <div style={currentCssProps}>
                <Fade in={!props.complete && props.active}>
                    <CircularProgress style={spinnerCss} size={100} />
                </Fade>
            </div>
            <div style={currentCssProps}>
                <Zoom in={props.complete}>
                    <Check color="primary" style={checkCss} />
                </Zoom>
            </div>
        </div>
    );
};

export default FullFormLoader;