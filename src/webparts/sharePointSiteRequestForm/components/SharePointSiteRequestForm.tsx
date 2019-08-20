import * as React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import indigo from '@material-ui/core/colors/indigo';
// import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
// import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';


import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import TextFieldTemplate from './field-templates/text-field';

import PeoplePickerTemplate from './field-templates/people-picker-template';

import styles from './SharePointSiteRequestForm.module.scss';
import { ISharePointSiteRequestFormProps } from './ISharePointSiteRequestFormProps';

import { createSiteRequest, getListItemEntityTypeName } from '../services/sp-rest';

const blueTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: yellow,
    type: "dark"
  },
});

const getItemDataForPost = (formData: any) => {
  let itemData = {
    Title: formData["Team Name"],
    PrimaryOwner: formData["Primary Owner"],
    SecondaryOwner: formData["Secondary Owner"],
    AdditionalOwners: formData["Additional Owners"],
    Members: formData["Members"]
  };

  return itemData;
};

const containerCss = {
  display: 'flex',
  flexWrap: 'wrap'
} as React.CSSProperties;

const initialState = {
  userId: null,
  isSubmitted: false,
  buttonDisabled: true,
  isLoadingTypeName: true,
  typeName: '',
  isValidForm: false,
  errorMessage: "Please provide a value for all required fields.",
  formData: {
    "Team Name": "",
    "Primary Owner": [],
    "Secondary Owner": [],
    "Additional Owners": [],
    Members: []
  }
};

type State = Readonly<typeof initialState>;

export default class SharePointSiteRequestForm extends React.Component<ISharePointSiteRequestFormProps, {}> {
  public readonly state: State = initialState;
  private listItemEntityTypeName: string;

  public handleTextChange = (fieldName: string, fieldValue: string) => {
    this.setState({
      formData: { ...this.state.formData, [fieldName]: fieldValue }
    });
  }

  public handleUserFieldChange = (fieldName: string, fieldValue: any[]) => {
    this.setState({
      formData: { ...this.state.formData, [fieldName]: fieldValue }
    });
  }

  // Handle some setup after the component mounts
  public componentDidMount() {
    // getListItemEntityTypeName(this.props.webpartContext.pageContext.site.absoluteUrl, this.props.webpartContext.spHttpClient, "Team Site Requests")
    //   .then(response => {

    //     if (response.ok) {
    //       response.json().then(rJson => {
    //         this.setState({
    //           isLoadingTypeName: false,
    //           isLoading: false,
    //           typeName: rJson.ListItemEntityTypeFullName
    //         });
    //       });
    //     } else {
    //       this.setState({
    //         didError: true
    //       });
    //     }
    //   });
  }

  private setMissingDataMessage() {
    this.setState({
      errorMessage: "Please provide a value for all required fields.",
      isValidForm: false
    });
  }

  private clearErrorState() {
    this.setState({
      errorMessage: "",
      isValidForm: true
    });
  }

  private validateFormData() {


    // Ensure something is in the title
    if (this.state.isValidForm && (this.state.formData["Team Name"].length === 0 || this.state.formData["Primary Owner"].length !== 1 || this.state.formData["Secondary Owner"].length !== 1)) {
      this.setMissingDataMessage();
    } else if (!this.state.isValidForm && !(this.state.formData["Team Name"].length === 0 || this.state.formData["Primary Owner"].length !== 1 || this.state.formData["Secondary Owner"].length !== 1)) {
      this.clearErrorState();
    }
  }

  private handleRequestButtonClick() {
    // Set the state as loading before trying to create the request.

    if (this.state.isValidForm) {
      this.setState({
        isLoading: true
      });
  
      let itemData = getItemDataForPost(this.state.formData);
      // Try to create the request.
      createSiteRequest(this.props.webpartContext, itemData, this.props.listName, this.state.typeName).then((result) => {
        this.setState({
          isLoading: false,
          isSubmitted: true
        });
      }).catch(err => {
        this.setState({
          isLoading: false,
          didError: true
        });
      });
    }
  }

  private renderFormBody() {
    if (this.state.isSubmitted) {
      return (
        <div>
          Your site request has been submitted.
        </div>
      );
    } else {
      return (
        <form style={containerCss} noValidate autoComplete="off">
          <TextFieldTemplate label="Team Name" placeHolder="E.G. IS Web Content Management" onChangeHandler={this.handleTextChange} required />
  
          <PeoplePickerTemplate label={"Primary Owner"} wpContext={this.props.webpartContext} onChangeHandler={this.handleUserFieldChange} required singleValue />
          <PeoplePickerTemplate label={"Secondary Owner"} wpContext={this.props.webpartContext} onChangeHandler={this.handleUserFieldChange} required singleValue />
  
          <PeoplePickerTemplate label={"Additional Owners"} wpContext={this.props.webpartContext} onChangeHandler={this.handleUserFieldChange} />
  
          <PeoplePickerTemplate label={"Members"} wpContext={this.props.webpartContext} onChangeHandler={this.handleUserFieldChange} />
  
          <br />
          <Button style={{ marginLeft: 8 } as React.CSSProperties} disabled={!this.state.isValidForm} variant="outlined" color="primary" onClick={() => { this.handleRequestButtonClick(); }}>Submit</Button>
        </form>
      );
    }
  }

  public render(): React.ReactElement<ISharePointSiteRequestFormProps> {
    this.validateFormData();
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

                <p className={styles.description}>{this.state.errorMessage}</p>

                
                  {this.renderFormBody()}
                
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );

  }
}
