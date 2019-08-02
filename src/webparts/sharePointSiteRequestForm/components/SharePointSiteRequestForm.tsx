import * as React from 'react';

import { MuiThemeProvider, createMuiTheme, withStyles, WithStyles, createStyles, createGenerateClassName } from '@material-ui/core/styles';
// import indigo from '@material-ui/core/colors/indigo';
// import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
// import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';


import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import TextFieldsTemplate from './field-templates/text-fields';
import PeoplePickerControl from './field-templates/people-picker';

import styles from './SharePointSiteRequestForm.module.scss';
import { ISharePointSiteRequestFormProps } from './ISharePointSiteRequestFormProps';

import { getCurrentUserLookupId, getListItemsByUserId, createOneDriveMigrationRequest, getListItemEntityTypeName } from '../services/sp-rest';

import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';  



const blueTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: yellow,
    type: "dark"
  },
});



const muiStyles = theme => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    // width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

window["muiStyles"] = muiStyles;
window["blueTheme"] = blueTheme;
window["CreateGenerateClassName"] = createGenerateClassName;


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

export interface Props extends WithStyles<typeof muiStyles> { }

const initialState = {
  userId: null,
  finishedSubmitting: false,
  buttonDisabled: true,
  isLoadingTypeName: true,
  typeName: '',
  didError: false,
  formData: {}
};

type State = Readonly<typeof initialState>;

export default class SharePointSiteRequestForm extends React.Component<ISharePointSiteRequestFormProps, {}> {
  public readonly state: State = initialState;
  private listItemEntityTypeName: string;

  private _getPeoplePickerItems(items: any[]) {
    console.log('Items:', items);
  }

  // private StyledTextFieldsTemplate = withStyles(muiStyles)(React.createElement(TextFieldsTemplate, {context: this.props.webpartContext}))

  public handleTextChange(fieldName: string, fieldValue: string) {
    this.setState({
      formData: { ...this.state.formData, [fieldName]: fieldValue }
    });
  }

  // Handle some setup after the component mounts
  public componentDidMount() {

    window['spfx-site-request-context'] = this.props.webpartContext;
    window['spfx-httpContext'] = SPHttpClient;

    getListItemEntityTypeName(this.props.webpartContext.pageContext.site.absoluteUrl, this.props.webpartContext.spHttpClient)
      .then(response => {

        if (response.ok) {
          response.json().then(rJson => {
            this.setState({
              isLoadingTypeName: false,
              isLoading: false,
              typeName: rJson.ListItemEntityTypeFullName
            });
          });
        } else {
          this.setState({
            didError: true
          });
        }
      });
  }


  private handleRequestButtonClick() {
    // Set the state as loading before trying to create the request.
    this.setState({
      isLoading: true
    });

    // Try to create the request.
    createOneDriveMigrationRequest(this.props.webpartContext, this.state.userId, this.state.typeName).then((result) => {
      this.setState({
        isLoading: false,
        finishedSubmitting: true
      });
    }).catch(err => {
      this.setState({
        isLoading: false,
        didError: true
      });
    });
  }

  public render(): React.ReactElement<ISharePointSiteRequestFormProps> {
    // if (this.state.isLoadingTypeName) {
      return (
        <MuiThemeProvider theme={blueTheme}>
          {/* <div> */}
          <div className={styles.oneDriveForm}>
            {/* <div> */}
            <div className={styles.container}>
              {/* <div> */}
              <div className={styles.row}>
                {/* <div> */}
                <div className={styles.column}>
                  <span className={styles.title}>SharePoint Team Site Request</span>

                  <p className={styles.description}>This is some info about sharepoint team sites.</p>


                  {/* <StyledTextFieldsTemplate /> */}
                  <TextFieldsTemplate context={this.props.webpartContext} />
                  {/* <TextFieldsTemplate changeHandler={this.handleTextChange} /> */}
                  <PeoplePickerControl />
                  {/* <PeoplePickerControl context={this.props.webpartContext} /> */}
                  <br/>
                  <Button variant="outlined" color="primary">Submit</Button>
                  <Button color="secondary">Submit Request</Button>
                </div>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      );
    
  }
}
