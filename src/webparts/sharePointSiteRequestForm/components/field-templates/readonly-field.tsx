import * as React from 'react';

interface ReadOnlyFieldTemplateProps {    
    name: string;
    value: string;
}

const initialState = {
    URLPreview: 'default'
};
const previewUrlCss = {
  // width: '80%',
  // minWidth: '200px',
  marginLeft: '12px',
  marginRight: '12px'
};
type State = Readonly<typeof initialState>;

class ReadOnlyFieldTemplate extends React.Component<ReadOnlyFieldTemplateProps> {
    public readonly state: State = initialState;
    public render() {
      //let previewUrl: string;
      // if(this.props.value.length>0){
      //   previewUrl="Preview of the URL: https://ejprod.sharepoint.com/sites/"+this.props.value.replace(/[^a-zA-Z0-9]/g, '');
      // }
        return (
           <div style={previewUrlCss}>{this.props.value}</div>
        );
    }
}

export default ReadOnlyFieldTemplate;