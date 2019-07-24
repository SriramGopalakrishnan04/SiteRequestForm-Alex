import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'SharePointSiteRequestFormWebPartStrings';
import SharePointSiteRequestForm from './components/SharePointSiteRequestForm';
import { ISharePointSiteRequestFormProps } from './components/ISharePointSiteRequestFormProps';

export interface ISharePointSiteRequestFormWebPartProps {
  description: string;
}

// const build = require("@microsoft/sp-build-web");

export default class SharePointSiteRequestFormWebPart extends BaseClientSideWebPart<ISharePointSiteRequestFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISharePointSiteRequestFormProps > = React.createElement(
      SharePointSiteRequestForm,
      {
        description: this.properties.description,
        webpartContext: this.context
      }
    );
    // alert("BUILD")
    //   window['build'] = build;
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
