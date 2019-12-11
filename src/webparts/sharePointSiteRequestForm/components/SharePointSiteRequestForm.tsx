import * as React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
// import blue from '@material-ui/core/colors/blue';
// import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';

import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';


import TextFieldTemplate from './field-templates/text-field';
import PeoplePickerTemplate from './field-templates/people-picker-template';
import SingleSelectTemplate from './field-templates/single-select';
import MultiSelectTemplate from './field-templates/multi-select';
import MultilineTextTemplate from './field-templates/multi-line-text-field';

import FullFormLoader from './loading-animations/full-form-loader';

import styles from './SharePointSiteRequestForm.module.scss';
import { ISharePointSiteRequestFormProps } from './ISharePointSiteRequestFormProps';

import { createSiteRequest, getListItemEntityTypeName } from '../services/sp-rest';

const blueTheme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: grey,
    type: "dark"
  },
});

const getItemDataForPost = (formData: any) => {
  let itemData = {
    Title: formData["TeamName"],
    PrimaryOwner: formData["PrimaryOwner"],
    SecondaryOwner: formData["SecondaryOwner"],
    AdditionalOwners: formData["AdditionalOwners"],
    Members: formData["Members"],
    ...formData
  };

  return itemData;
};

const containerCss = {
  display: 'flex',
  flexWrap: 'wrap'
} as React.CSSProperties;

const buttonWrapperCss = {
  margin: 8,
  position: 'relative',
} as React.CSSProperties;

const buttonProgressCss = {
  color: green[500],
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -12,
  marginLeft: -12,
} as React.CSSProperties;

const buttonSuccessCss = {
  backgroundColor: green[500],
  margin: 8
};

const buttonBaseCss = {
  margin: 8
};

const successMessageCss = {
  color: green[500]
};

const initialState = {
  isSubmitted: false,
  isValidForm: false,
  dirtyFields: [],
  errorMessage: "Please provide a value for all required fields.",
  formState: "missingData",
  formData: {
    "TeamName": "",
    "PrimaryOwner": [],
    "SecondaryOwner": [],
    "AdditionalOwners": [],
    "Members": [],
    "SitePurpose": "",
    "SiteAccess": "",
    "SiteLife": "",
    "DocumentTypes": "",
    "CurrentContent": "",
    "RequireMigration": "",
    "TrainingComplete": "",
    "FirmDivision": ""
  },
  loading: false,
  isConfigured: false
};

type State = Readonly<typeof initialState>;

export default class SharePointSiteRequestForm extends React.Component<ISharePointSiteRequestFormProps, {}> {
  public readonly state: State = initialState;

  private getButtonCss = () => {
    if (this.state.isSubmitted) {
      return buttonSuccessCss;
    } else {
      return buttonBaseCss;
    }
  }

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

  public handleAddFieldError = (fieldName: string) => {
    let index = this.state.dirtyFields.indexOf(fieldName);
    if (index === -1) {
      this.setState({
        dirtyFields: [...this.state.dirtyFields, fieldName]
      });
    }
  }

  public handlerRemoveFieldError = (fieldName: string) => {
    let index = this.state.dirtyFields.indexOf(fieldName);
    if (index > -1) {
      let tempArray = [...this.state.dirtyFields];

      tempArray.splice(index, 1);
      this.setState({
        dirtyFields: tempArray
      });
    }


  }

  // // Handle some setup after the component mounts
  public componentDidMount() {
    const listName = this.props.listName;

    if (listName && listName.trim()) {
      this.setState({
        isConfigured: true
      });
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    const listName = this.props.listName;

    if (listName && listName.trim() && !this.state.isConfigured) {
      this.setState({
        isConfigured: true
      });
    } else if (this.state.isConfigured && !(listName && listName.trim())) {
      this.setState({
        isConfigured: false
      });
    }
  }

  private setOwnerConflictErrorMessage() {
    this.setState({
      errorMessage: "Primary Owner cannot be the same as Secondary Owner",
      formState: "ownersMatch"
    });
  }

  private setMissingDataMessage() {
    this.setState({
      errorMessage: "Please provide a value for all required fields.",
      formState: "missingData"
    });
  }

  private clearErrorState() {
    this.setState({
      errorMessage: "",
      formState: "clean"
    });

  }

  private validateFormData() {
    const isMissingRequiredData = this.state.formData["TeamName"].length === 0 || this.state.formData["PrimaryOwner"].length !== 1 || this.state.formData["SecondaryOwner"].length !== 1 || this.state.formData.CurrentContent.length === 0 || this.state.formData.DocumentTypes.length === 0 || this.state.formData.FirmDivision.length === 0 || this.state.formData.RequireMigration.length === 0 || this.state.formData.SiteAccess.length === 0 || this.state.formData.SiteLife.length === 0 || this.state.formData.SitePurpose.length === 0 || this.state.formData.TrainingComplete.length === 0;
    const hasMatchingPrimarySecondary = (this.state.formData["PrimaryOwner"].length && this.state.formData["SecondaryOwner"].length && (this.state.formData["PrimaryOwner"][0]["Key"] === this.state.formData["SecondaryOwner"][0]["Key"]));
    if (isMissingRequiredData) {
      if (this.state.formState !== "missingData") {
        this.setMissingDataMessage();
      }
    } else if (hasMatchingPrimarySecondary) {
      if (this.state.formState !== "ownersMatch") {
        this.setOwnerConflictErrorMessage();
      }
    } else if (this.state.formState !== "clean") {
      this.clearErrorState();
    }
  }

  private handleRequestButtonClick() {
    // Set the state as loading before trying to create the request.

    if (this.state.formState === "clean") {
      this.setState({
        loading: true
      });

      let itemData = getItemDataForPost(this.state.formData);
      // Try to create the request.
      createSiteRequest(this.props.webpartContext, itemData, this.props.listName).then((result) => {
        this.setState({
          loading: false,
          isSubmitted: true
        });
      }).catch(err => {
        this.setState({
          loading: false,
          didError: true
        });
      });
    }
  }

  private renderFormBody() {
    return (

      <form style={containerCss} noValidate autoComplete="off">
        {this.state.isSubmitted && <div style={successMessageCss}>Your site request has been submitted.</div>}
        {!this.state.isSubmitted && <br />}
        <React.Fragment>
          <TextFieldTemplate name="TeamName" label="Desired Site Name" placeHolder="E.G. IS Web Content Management" onChangeHandler={this.handleTextChange} required />

          <PeoplePickerTemplate helpText="Search by 'LastName,FirstName' or J/P Number." name="PrimaryOwner" label={"Primary Owner"} wpContext={this.props.webpartContext} addFieldError={this.handleAddFieldError} removeFieldError={this.handlerRemoveFieldError} onChangeHandler={this.handleUserFieldChange} required singleValue error={this.state.formState === "ownersMatch"} />

          <PeoplePickerTemplate helpText="Search by 'LastName,FirstName' or J/P Number." name="SecondaryOwner" label={"Secondary Owner"} wpContext={this.props.webpartContext} addFieldError={this.handleAddFieldError} removeFieldError={this.handlerRemoveFieldError} onChangeHandler={this.handleUserFieldChange} required singleValue error={this.state.formState === "ownersMatch"} />

          <PeoplePickerTemplate helpText="Search by 'LastName,FirstName' or J/P Number. Optional: Owners can add new owners after the site is created." name="AdditionalOwners" label={"Additional Owners"} wpContext={this.props.webpartContext} addFieldError={this.handleAddFieldError} removeFieldError={this.handlerRemoveFieldError} onChangeHandler={this.handleUserFieldChange} />

          <PeoplePickerTemplate helpText="Search by 'LastName,FirstName' or J/P Number. Optional: Owners can add new members after the site is created." name="Members" label={"Members"} wpContext={this.props.webpartContext} addFieldError={this.handleAddFieldError} removeFieldError={this.handlerRemoveFieldError} onChangeHandler={this.handleUserFieldChange} />

          <MultilineTextTemplate name="SitePurpose" label="What is the purpose of the site?" onChangeHandler={this.handleTextChange} required error={this.state.formData.SitePurpose.length === 0} />

          <MultiSelectTemplate required options={
            [
              { value: "Public", placeHolder: "Public Content" },
              { value: "Division", placeHolder: "Firm Division" },
              { value: "Department", placeHolder: "My Department" },
              { value: "Team", placeHolder: "My Team" },
              { value: "Project", placeHolder: "My Project Team" },
              { value: "Community", placeHolder: "My Community Group" },
              { value: "Other", placeHolder: "Other" },
            ]
          }
            name="SiteAccess" label={"Access"} placeHolder={"Who will access your site and it's associated content?"} error={this.state.formData.SiteAccess.length === 0} onChangeHandler={this.handleTextChange}
          />

          <SingleSelectTemplate name="SiteLife" label={"Site Life"} placeHolder={"How long will you be using the site?"} required error={this.state.formData.SiteLife.length === 0} onChangeHandler={this.handleTextChange} >
            <MenuItem value="0-6">0-6 Months</MenuItem>
            <MenuItem value="6-12">6-12 Months</MenuItem>
            <MenuItem value="12-18">12-18 Months</MenuItem>
            <MenuItem value="indefinite">Indefinite</MenuItem>
          </SingleSelectTemplate>

          <MultiSelectTemplate
            options={
              [
                { value: "Web Content", placeHolder: "Web Content" },
                { value: "XDrive", placeHolder: "X: Drive" },
                { value: "Other", placeHolder: "Other" }
              ]
            }
            name="DocumentTypes" label={"Document Types"} placeHolder={"What type of content or documents will you be working on?"} required error={this.state.formData.DocumentTypes.length === 0} onChangeHandler={this.handleTextChange} />

          <MultilineTextTemplate name="CurrentContent" label="Where does your content currently reside and how is it organized?" required error={this.state.formData.CurrentContent.length === 0} onChangeHandler={this.handleTextChange} />

          <SingleSelectTemplate name="RequireMigration" label={"Require Migration"} placeHolder={"Will you require content be migrated?"} required error={this.state.formData.RequireMigration.length === 0} onChangeHandler={this.handleTextChange} >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </SingleSelectTemplate>

          <SingleSelectTemplate name="TrainingComplete" label={"Training Complete"} placeHolder={"Is owner training completed?"} required error={this.state.formData.TrainingComplete.length === 0} helpText='Have the Primary and Secondary Owners attended the mandatory "Introduction to SharePoint at Jones" training?' onChangeHandler={this.handleTextChange} >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </SingleSelectTemplate>

          <SingleSelectTemplate name="FirmDivision" placeHolder="What Firm Division will your site be associated with?" label="" required error={this.state.formData.FirmDivision.length === 0} onChangeHandler={this.handleTextChange} >
            <MenuItem value="BOA Talent Acquisition Performance">BOA Talent Acquisition & Performance</MenuItem>
            <MenuItem value="Branch Administration">Branch Administration</MenuItem>
            <MenuItem value="Branch Region Development">Branch & Region Development</MenuItem>
            <MenuItem value="Branch Training">Branch Training</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="Compliance">Compliance</MenuItem>
            <MenuItem value="FA Talent Acquisition">FA Talent Acquisition</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="HR">Human Resources</MenuItem>
            <MenuItem value="Internal Audit">Internal Audit</MenuItem>
            <MenuItem value="IS">Information Systems</MenuItem>
            <MenuItem value="Legal">Legal</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Operations">Operations</MenuItem>
            <MenuItem value="Product Review">Product Review</MenuItem>
            <MenuItem value="Products Services">Products & Services</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Solutions">Solutions</MenuItem>
          </SingleSelectTemplate>
        </React.Fragment>


        <br />
        <div style={buttonWrapperCss}>
          <Button style={this.getButtonCss()} disabled={(!(this.state.formState === "clean") || this.state.loading || this.state.isSubmitted) || this.state.dirtyFields.length !== 0} variant="outlined" color="primary" onClick={() => { this.handleRequestButtonClick(); }}>Submit</Button>
          {/* {this.state.loading && <CircularProgress size={24} style={buttonProgressCss} />} */}
        </div>
        {/* {this.state.loading && <FullFormLoader size={24} style={buttonProgressCss} />} */}

      </form>
    );
  }

  public render(): React.ReactElement<ISharePointSiteRequestFormProps> {
    this.validateFormData();
    // if (this.state.isLoadingTypeName) {
    return (
      <MuiThemeProvider theme={blueTheme}>

        {/* <div> */}
        <div className={styles.oneDriveForm} style={this.state.isSubmitted ? {height: 600, overflow: 'hidden'} : {}}>
          <Paper>
            <FullFormLoader active={this.state.loading} complete={this.state.isSubmitted} warning={!this.state.isConfigured} successMessage={this.props.successMessage} fullScreen warningMessage="The webpart is not configured" />

            {/* <div> */}
            {/* <div> */}
            <div className={styles.row}>
              {/* <div> */}
              <div className={styles.column}>
                <span className={styles.title}>SharePoint Team Site Request</span>

                <p className={styles.description}>{this.state.errorMessage}&nbsp;</p>


                {this.renderFormBody()}

              </div>
            </div>
          </Paper>

        </div>
      </MuiThemeProvider>
    );

  }
}
