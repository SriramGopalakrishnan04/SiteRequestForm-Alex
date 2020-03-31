import * as React from 'react';

interface ReadOnlyFieldTemplateProps {    
    name: string;
    value: string;
}

const initialState = {
    inputValue: ''
};

type State = Readonly<typeof initialState>;

class ReadOnlyFieldTemplate extends React.Component<ReadOnlyFieldTemplateProps> {
    public readonly state: State = initialState;
    
  updateContent = () => {
      this.setState({ inputValue: "Updated Content!"});
  }
    public render() {
        return (
           <div>{this.state.inputValue}</div>
        );
    }
}

export default ReadOnlyFieldTemplate;