import React, { Component } from 'react';

class SearchField extends Component {

    constructor(){
        super();
        this.textInput = React.createRef();
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.onSubmit && this.props.onSubmit(this.textInput.current.value);
    }

    onChange = _e => {
        this.props.onChange && this.props.onChange(this.textInput.current.value);
    }

    render() {
        const submitButton = this.props.onSubmit ? <input type="submit" value="search"/> : undefined;

        return(
            <form onSubmit={this.onSubmit}>
                <input type="text" onChange={this.onChange} placeholder={this.props.placeholder} ref={this.textInput}/>
                {submitButton}
            </form>
        );
    }
}

export default SearchField;