import * as React from 'react';
import TextField from '@material-ui/core/TextField';

const textFieldCss = {
    // width: '80%',
    minWidth: '200px',
    marginLeft: '8px',
    marginRight: '8px'
};

interface TextFieldTemplateProps {
    label: string;
    placeHolder: string;
    required?: boolean;
    multiline?: boolean;
    onChangeHandler: (fieldName: string, fieldValue: string) => void;
}

type DefaultProps = {
    required: boolean,
    multiline: boolean
};


const initialState = {
    inputValue: ''
};

type State = Readonly<typeof initialState>;

class TextFieldTemplate extends React.Component<TextFieldTemplateProps> {
    public readonly state: State = initialState;

    public static defaultProps: DefaultProps = {
        required: false,
        multiline: false
    };

    public render() {
        let errorState = false;

        if (this.props.required && this.state.inputValue.length === 0) {
            errorState = true;
        }

        return (
            <TextField
                error={errorState}
                required={this.props.required}
                multiline={this.props.multiline}
                fullWidth
                color="primary"
                //   id="team-name"
                onChange={(evt) => {
                        this.props.onChangeHandler(this.props.label, evt.target.value);
                        this.setState({inputValue: evt.target.value});
                    }
                }
                label={this.props.label}
                style={textFieldCss}
                placeholder={this.props.placeHolder}
                margin="normal"
                variant="outlined"
            />
        );
    }
}

export default TextFieldTemplate;