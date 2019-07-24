import * as React from 'react';
import * as PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles, WithStyles, createStyles, withTheme } from '@material-ui/core/styles';
// import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const styles = theme => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "80%",
    minWidth: 200
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

export interface Props extends WithStyles<typeof styles> { }

// function TextFields(props: Props) {
class TextFields extends React.Component {
  // class TextFields extends React.Component<{changeHandler: Function}> {
  // state = {
  //   name: 'Cat in the Hat',
  //   age: '',
  //   multiline: 'Controlled',
  //   currency: 'EUR',
  // };

  // handleChange = name => event => {
  //   this.setState({ [name]: event.target.value });
  // };
  public static propTypes: { classes: PropTypes.Validator<object>; };

  public render() {
    // const { classes } = this.props;
    const classes = this.props['classes'];

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          required
          multiline
          color="primary"
          id="team-name"
          label="Team Name"
          className={classes.textField}
          placeholder={"E.G. IS Web Content Management"}
          margin="normal"
          variant="outlined"
        />

        <TextField
          required
          multiline
          id="primary-owner"
          label="Primary Owner"
          // defaultValue=""
          className={classes.textField}
          placeholder="E.G. p123456 or Smith,John"
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          id="secondary-owner"
          label="Secondary Owner"
          className={classes.textField}
          placeholder="E.G. p123456 or Smith,John"
          margin="normal"
          variant="outlined"
          multiline
        />
        <TextField
          id="other-owners"
          label="Additional Owners (Optional)"
          className={classes.textField}
          placeholder="E.G. p123456 or Smith,John"
          multiline
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="team-members"
          label="Members (Optional)"
          className={classes.textField}
          placeholder="E.G. p123456 or Smith,John"
          multiline
          margin="normal"
          variant="outlined"
        />
      </form>
    );

    // return (
    //   <form noValidate autoComplete="off">
    //     <TextField
    //       color="primary"
    //       id="standard-name"
    //       label="Name"
    //       value={"test name"}
    //       variant="outlined"
    //       // value={this.state.name}
    //       onChange={() => console.log("test")}
    //       // onChange={this.handleChange('name')}
    //       margin="normal"
    //     />

    //     <TextField
    //       required
    //       id="standard-required"
    //       label="Required"
    //       defaultValue="Hello World"
    //       margin="normal"
    //     />

    //     <TextField
    //       id="standard-with-placeholder"
    //       label="With placeholder"
    //       placeholder="Placeholder"
    //       margin="normal"
    //     />

    //     <TextField
    //       id="standard-textarea"
    //       label="With placeholder multiline"
    //       placeholder="Placeholder"
    //       multiline
    //       margin="normal"
    //     />
    //   </form>
    // );
  }
}


TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

const decoratedField = withStyles(styles)(TextFields);
export default decoratedField;
// export default TextFields;
// export default withTheme()(TextFields);