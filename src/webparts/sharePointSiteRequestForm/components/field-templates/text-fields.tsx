import * as React from 'react';
import * as PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles, WithStyles, createStyles, withTheme, StyledComponentProps, createGenerateClassName } from '@material-ui/core/styles';
// import { makeStyles, createStyles } from "@material-ui/styles";
// import { Theme } from "@material-ui/core";
import { createStyles as createStyles2 } from '@material-ui/core/styles'
// import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';  

const containerCss = {
  display: 'flex',
  flexWrap: 'wrap'
} as React.CSSProperties;

const textFieldCss = {
  // width: '80%',
  minWidth: '200px',
  marginLeft: '8px',
  marginRight: '8px'
};

// const styles = theme => createStyles({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap'
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: "80%",
//     minWidth: 200
//   },
//   dense: {
//     marginTop: 19,
//   },
//   menu: {
//     width: 200,
//   },
// });


class TextFields extends React.Component<{context: WebPartContext}> {


  private _onChange(targetSelector) {
    let currentElem = document.querySelector(targetSelector) as HTMLInputElement;

    this.props.context.spHttpClient.post("https://appliancedirectclan.sharepoint.com/sites/ts1-o365/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser", 
    SPHttpClient.configurations.v1, 
    {
      credentials: 'same-origin',
        // headers: {
        //   'Accept': `application/json; odata=verbose`,
        //   'Content-Type': `application/json; odata=verbose`,
        //   'X-RequestDigest':" document.getElementById('__REQUESTDIGEST').value"
        // },
        body: JSON.stringify({
          queryParams: {
            AllowEmailAddresses: true,
            AllowMultipleEntities: false,
            AllUrlZones: false,
            MaximumEntitySuggestions: 50,
            PrincipalSource: 15,
            PrincipalType: 15,
            QueryString: currentElem.value
          }
        })
    }
    ).then(res => {
      res.json().then(jres => {
        console.log(jres);
      })
    });

    console.log("value", currentElem.value);

  }

  public render() {

    return (
      <form style={containerCss} noValidate autoComplete="off">
        <TextField
          required
          // multiline
          fullWidth
          color="primary"
          id="team-name"
          label="Team Name"
          style={textFieldCss}
          placeholder={"E.G. IS Web Content Management"}
          margin="normal"
          variant="outlined"
        />

        <TextField
          required
          // multiline
          fullWidth
          id="primary-owner"
          label="Primary Owner"
          style={textFieldCss}
          placeholder="E.G. p123456 or Smith,John"
          margin="normal"
          variant="outlined"
          onChange={() => { this._onChange("#primary-owner") }}

        />
        <TextField
          required
          fullWidth
          id="secondary-owner"
          label="Secondary Owner"
          style={textFieldCss}
          placeholder="E.G. p123456 or Smith,John"
          margin="normal"
          variant="outlined"
          multiline
          onChange={() => { this._onChange("#secondary-owner") }}

        />
        <TextField
          fullWidth
          id="other-owners"
          label="Additional Owners (Optional)"
          style={textFieldCss}
          placeholder="E.G. p123456 or Smith,John"
          multiline
          margin="normal"
          variant="outlined"
        />

        <TextField
          fullWidth
          id="team-members"
          label="Members (Optional)"
          style={textFieldCss}
          placeholder="E.G. p123456 or Smith,John"
          multiline
          margin="normal"
          variant="outlined"
        />
      </form>
    );
  }
}

export default TextFields;