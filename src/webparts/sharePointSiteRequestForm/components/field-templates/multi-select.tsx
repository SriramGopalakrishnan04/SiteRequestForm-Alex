import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import MultilineTextField from './multi-line-text-field';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
    // maxWidth: 300,
  },
  inputWithSelection: {
    paddingTop: 10,
    paddingBottom: 10
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.value.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

export interface Option {
  value: string;
  placeHolder: string;
}

export interface Props extends WithStyles<typeof styles> {
  label: string;
  name: string;
  placeHolder: string;
  options: Option[];
  error?: boolean;
  required?: boolean;

  onChangeHandler: (fieldName: string, fieldValue: string) => void;
}

export interface State {
  value: string[];
  labelWidth: number;
  otherText: string;
}

class MultipleSelect extends React.Component<Props, State> {
  public state: State = {
    value: [],
    labelWidth: 0,
    otherText: ''
  };

  public componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this['InputLabelRef'])['offsetWidth'],
    });
  }

  public handleOtherTextChange = (name, value) => {
    let stateVal = [...this.state.value];
    // Check for the other option

    if (stateVal.indexOf("Other") !== -1) {
      stateVal[stateVal.indexOf("Other")] = `Other-${value}`;
    }

    this.setState({
      otherText: value
    }, () => {
      this.props.onChangeHandler(this.props.name, stateVal.toString());
    });
  }

  public handleChange = event => {
    this.setState({ value: event.target.value });

    let stateVal = [...event.target.value];
    // Check for the other option
    if (stateVal.indexOf("Other") !== -1) {
      stateVal[stateVal.indexOf("Other")] = `Other-${this.state.otherText}`;
    }

    this.props.onChangeHandler(this.props.name, stateVal.toString());
  }

  public handleChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      value: value,
    });
  }

  public render() {
    const showTextField = this.state.value.indexOf("Other") !== -1 ? true : false;

    const { classes } = this.props;

    return (
      <React.Fragment>
        <FormControl fullWidth error={this.props.error} required={this.props.required} variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this['InputLabelRef'] = ref; //this is needed for the label when it moves into the border area
            }}
            htmlFor="select-multiple-checkbox">{this.props.placeHolder}</InputLabel>
          <Select
            multiple
            value={this.state.value}
            onChange={this.handleChange}
            SelectDisplayProps={{ style: (this.state.value.length !== 0 ? { paddingTop: 10, paddingBottom: 10 } : {}) }} // This is a hack so that the height matches the other selects after a value is selected
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name={this.props.label}
              />
            }
            renderValue={(selected: string[]) => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            <MenuItem disabled value="">
              <em><b>{this.props.placeHolder}</b></em>
            </MenuItem>
            <Divider />
            {this.props.options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={this.state.value.indexOf(option.value) > -1} />
                <ListItemText primary={option.placeHolder} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {showTextField && <MultilineTextField onChangeHandler={this.handleOtherTextChange} name="Other" label={`Other:`} />}
      </React.Fragment>
    );
  }
}

(MultipleSelect as React.ComponentClass<Props>).propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

// export default withStyles(styles)(MultipleSelect);
export default withStyles(styles, { withTheme: true })(MultipleSelect);