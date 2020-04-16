import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISharePointSiteRequestFormProps {
  listName: string;
  successMessage: string;
  webpartContext: WebPartContext;
}