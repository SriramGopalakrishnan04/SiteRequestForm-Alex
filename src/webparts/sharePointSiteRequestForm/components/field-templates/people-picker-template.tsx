import * as React from 'react';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import PeopleSearchService from '../services/people-search-svc';

const styles = {
    root: {
        flexGrow: 1,
        width: '100%',
        marginLeft: 8,
        marginRight: 8
    } as React.CSSProperties,
    container: {
        flexGrow: 1,
        position: 'relative',
    } as React.CSSProperties,
    paper: {
        position: 'absolute',
        zIndex: 2,
        marginTop: 4,
        left: 0,
        right: 0,
    } as React.CSSProperties,
    chip: {
        margin: `${12 / 2}px ${8 / 4}px`,
    } as React.CSSProperties,
    inputRoot: {
        flexWrap: 'wrap',
        flex: 1,
        minWidth: 150,
        color: 'inherit',
        'background-color': 'inherit',
        'border-color': 'inherit'
    } as React.CSSProperties,
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    } as React.CSSProperties,
    divider: {
        height: 8 * 2,
    } as React.CSSProperties,
    selectBox: {
        width: 'calc(100% - 14px)',
        flexWrap: 'wrap'
    } as React.CSSProperties
};

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;
    // if (InputProps.disabled) {
    //     return (<div></div>);
    // } else {
        return (
            <TextField
                // fullWidth
                margin="normal"
                variant='outlined'
                required={InputProps.required}
                InputProps={{
                    inputRef: ref,
                    style: classes.selectBox,
                    // classes: {
                    //     root: classes.inputRoot,
                    //     input: classes.inputInput,
                    // },
                    ...InputProps,
                }}
                inputProps={{style: classes.inputRoot}}
                {...other}
            />
        );
    // }
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.DisplayText}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.DisplayText}
        </MenuItem>
    );
}




const initialState = {
    inputValue: '',
    selectedItem: [],
    peopleSuggestions: [],
    disabled: false
};

type State = Readonly<typeof initialState>;

    class DownshiftMultiple extends React.Component<{required?: boolean; singleValue?: boolean; peoplePickerService: PeopleSearchService; label: string; onChangeHandler: (fieldName: string, fieldValue: string[]) => void}> {
    public readonly state: State = initialState;

    private getSuggestions = (pplSvc: PeopleSearchService, value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
    
        pplSvc.getSuggestions(inputValue).then(res => {
            let pplResults = JSON.parse(res.value);
            this.setState({
                peopleSuggestions: pplResults
            });
        });

        return inputLength === 0
            ? []
            : this.state.peopleSuggestions.filter(suggestion => {
                
                const keep = count < 5 && (suggestion.Description.slice(0, inputLength).toLowerCase() === inputValue || suggestion.DisplayText.slice(0, inputLength).toLowerCase() === inputValue || suggestion.Key.slice(0, inputLength).toLowerCase() === inputValue);
    
                if (keep) {
                    count += 1;
                }
    
                return keep;
            });
    }

    private handleKeyDown = event => {
        const { inputValue, selectedItem } = this.state;
        if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
            let item = selectedItem[selectedItem.length - 1];
            this.handleDelete(item)();
        }
    }

    private handleInputChange = event => {
        this.setState({ inputValue: event.target.value });
    }

    private handleChange = item => {
        let { selectedItem } = this.state;

        if (selectedItem.indexOf(item) === -1) {
            selectedItem = [...selectedItem, item];
        }

        this.props.onChangeHandler(this.props.label, selectedItem);

        this.setState({
            inputValue: '',
            selectedItem,
        });
    }

    private handleDelete = item => () => {
        const selectedItem = [...this.state.selectedItem];

        selectedItem.splice(selectedItem.indexOf(item), 1);

        this.props.onChangeHandler(this.props.label, selectedItem);

        this.setState(state => {
            const selectedItems = [...this.state.selectedItem];
            selectedItems.splice(selectedItems.indexOf(item), 1);
            return { selectedItems };
        });
    }

    public render() {
        const classes = styles;
        
        const { inputValue, selectedItem } = this.state;

        let errorState = false;
        let inputDisabled = false;

        let placeholderVal = "Select multiple users";
        if (this.props.required && this.state.selectedItem.length === 0) {
            errorState = true;
        }

        if (this.props.singleValue) {
            placeholderVal = "Select one user";

            if (this.state.selectedItem.length !== 0) {
                inputDisabled = true;
            }
        }

        return (
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={this.handleChange}
                selectedItem={selectedItem}
            >
                {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue: inputValue2,
                    selectedItem: selectedItem2,
                    highlightedIndex,
                }) => (
                        <div style={classes.container}>
                            {/* <div className={classes.container}> */}
                            {renderInput({
                                fullWidth: true,
                                classes,

                                InputProps: getInputProps({
                                    error:errorState,
                                    disabled: inputDisabled,
                                    required: this.props.required,
                                    startAdornment: selectedItem.map(item => {
                                        return (
                                            <Chip
                                                key={item.Description}
                                                tabIndex={-1}
                                                label={item.DisplayText}
                                                style={classes.chip}
                                                // className={classes.chip}
                                                onDelete={this.handleDelete(item)}
                                            />
                                        );
                                    }),
                                    onChange: this.handleInputChange,
                                    onKeyDown: this.handleKeyDown,
                                    placeholder: placeholderVal
                                }),
                                label: this.props.label,
                            })}
                            {isOpen ? (
                                <Paper style={classes.paper} square>
                                    {/* <Paper className={classes.paper} square> */}
                                    {this.getSuggestions(this.props.peoplePickerService, inputValue2).map((suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({ item: suggestion }),
                                            highlightedIndex,
                                            selectedItem: selectedItem2,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    )}
            </Downshift>
        );
    }
}


function PeoplePickerTemplate(props) {
    const classes = styles;
    const peopleSearchSvc = new PeopleSearchService(props.wpContext);

    let singleValue = false;

    if (props.singleValue) {
        singleValue = true;
    }

    return (
        <div style={classes.root}>
            <DownshiftMultiple required={props.required} singleValue={singleValue} label={props.label} peoplePickerService={peopleSearchSvc} onChangeHandler={props.onChangeHandler}/>
        </div>
    );
}

export default PeoplePickerTemplate;