import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import MultilineTextField from './multi-line-text-field';

const singleSelectStyles = {
    // width: '80%',
    // minWidth: '200px',
    marginLeft: '8px',
    marginRight: '8px',
    marginTop: '16px',
    marginBottom: '8px'
};

// This is necessary due to some other styles that are loaded into SharePoint pages causing the backgrounds of the fields to turn white.
const singleSelectInputStyles = {
    'color': 'inherit',
    'backgroundColor': 'rgba(0,0,0,0)',
    'borderColor': 'inherit'
} as React.CSSProperties;

interface SingleSelectTemplateProps {
    label: string;
    placeHolder: string;
    required?: boolean;
    helpText?: string;
    // multiline?: boolean;
    onChangeHandler: (fieldName: string, fieldValue: string) => void;
}

type DefaultProps = {
    required: boolean,
    multiline: boolean
};


const initialState = {
    inputValue: '',
    labelWidth: 0
};

type State = Readonly<typeof initialState>;

class SingleSelectTemplate extends React.Component<SingleSelectTemplateProps> {
    public readonly state: State = initialState;

    public static defaultProps: DefaultProps = {
        required: false,
        multiline: false
    };

    public componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this['InputLabelRef'])['offsetWidth'],
        });
    }

    public handleChange = event => {
        this.setState({ inputValue: event.target.value });
        this.props.onChangeHandler(this.props.label, event.target.value);
    }

    public render() {
        const showTextField = this.state.inputValue === "Other" ? true : false;

        const classes = {
            root:"nnn",
            formControl: 'nnn',
            selectEmpty: 'nnn',

        };

        return (
            <React.Fragment>
                
                
                <FormControl fullWidth variant="outlined" className={classes.formControl} style={singleSelectStyles}>
                    <InputLabel
                        ref={ref => {
                            this['InputLabelRef'] = ref; //this is needed for the label when it moves into the border area
                        }}
                        htmlFor={`field-${this.props.label}`}
                    >
                        {this.props.placeHolder}
                    </InputLabel>
                    <Select
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name={this.props.label}
                            />
                        }
                    >
                        {this.props.children}
                    </Select>
                    {this.props.helpText && <FormHelperText>{this.props.helpText}</FormHelperText>}
                </FormControl>
                {showTextField && <MultilineTextField label={`Please elaborate  `} />}
            </React.Fragment>
        );
    }
}

export default SingleSelectTemplate;