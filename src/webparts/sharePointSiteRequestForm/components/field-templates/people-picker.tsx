import * as React from 'react';
import * as PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles, WithStyles, createStyles, withTheme } from '@material-ui/core/styles';
// import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


// function TextFields(props: Props) {
class TextFields extends React.Component {
    
  static propTypes: { classes: PropTypes.Validator<object>; };

  render() {
    // const { classes } = this.props;
    const classes = this.props['classes'];

    return (
      <form className={classes.container} noValidate autoComplete="off">
        
        <PeoplePicker
          context={this.props.context}
          titleText="People Picker"
          personSelectionLimit={3}
          groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
          showtooltip={true}
          isRequired={true}
          disabled={true}
          selectedItems={this._getPeoplePickerItems}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000} />
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