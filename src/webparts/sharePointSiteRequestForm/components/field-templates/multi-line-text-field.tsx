import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  });

export interface Props extends WithStyles<typeof styles> {
  label: string;
  name: string;
  error?: boolean;
  required?: boolean;
  onChangeHandler: (fieldName: string, fieldValue: string) => void;
}

// export interface State {
//   name: string;
//   age: string;
//   multiline: string;
//   currency: string;
// }

class TextFields extends React.Component<Props> {
  // class TextFields extends React.Component<Props, State> {
  // public state: State = {
  //   name: 'Cat in the Hat',
  //   age: '',
  //   multiline: 'Controlled',
  //   currency: 'EUR',
  // };

  // public handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({ [name]: event.target.value } as Pick<State, keyof State>);
  // }

  public render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <TextField
          id="standard-textarea"
          defaultValue=""
          error={this.props.error}
          required={this.props.required}
          label={this.props.label}
          placeholder=""
          multiline
          fullWidth
          variant="outlined"
          className={classes.textField}
          onChange={(evt) => {
            this.props.onChangeHandler(this.props.name, evt.target.value);
            // this.setState({inputValue: evt.target.value});
          }
          }
          margin="normal"
        />
      </React.Fragment>
    );
  }
}

(TextFields as React.ComponentClass<Props>).propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(TextFields);