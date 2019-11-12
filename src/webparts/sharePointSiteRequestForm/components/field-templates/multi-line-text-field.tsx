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
}

export interface State {
  name: string;
  age: string;
  multiline: string;
  currency: string;
}

class TextFields extends React.Component<Props, State> {
  state: State = {
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
  };

  handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.target.value } as Pick<State, keyof State>);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <TextField
          id="standard-textarea"
          label={this.props.label}
          placeholder=""
          multiline
          fullWidth
          variant="outlined"
          className={classes.textField}
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