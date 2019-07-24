import * as React from 'react';

import Loader from 'react-loader-spinner';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";


import { MuiThemeProvider, createMuiTheme, withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
// import indigo from '@material-ui/core/colors/indigo';
// import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
// import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import TextFieldsTemplate from './field-templates/text-fields';

import styles from './SharePointSiteRequestForm.module.scss';
import { ISharePointSiteRequestFormProps } from './ISharePointSiteRequestFormProps';

import { getCurrentUserLookupId, getListItemsByUserId, createOneDriveMigrationRequest, getListItemEntityTypeName } from '../services/sp-rest';


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

  public handleTextChange(fieldName: string, fieldValue: string) {
    this.setState({
      formData: { ...this.state.formData, [fieldName]: fieldValue }
    });
  }

  // Handle some setup after the component mounts
  public componentDidMount() {



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
    if (false) {
      return (
        <div className={styles.oneDriveForm}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <span className={styles.title}>SharePoint Team Site Request</span>
                {/* <p className={styles.subTitle}>Subtitle goes here.</p> */}
                <p className={styles.description}></p>
              </div>
              <div className={styles.loader}>
                <Loader className={styles.loader}
                  type="Oval"
                  color="#00BFFF"
                  height="100"
                  width="100"
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      console.log(blueTheme);
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


                  <TextFieldsTemplate />
                  {/* <TextFieldsTemplate changeHandler={this.handleTextChange} /> */}
                  <PeoplePicker
                    context={this.props.webpartContext}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    // groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    isRequired={true}
                    disabled={false}
                    selectedItems={this._getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />
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
}
