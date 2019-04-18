import React, {Component} from 'react';
import {connect} from 'react-redux';
import { isMobile } from "react-device-detect";
import SearchField from "react-search-field";
import { withRouter } from "react-router-dom";
import {updatedURLParamString} from "../utils/url";
import {searchByQuery} from "../actions";

class Search extends Component {
    state = {
        active: false,
        classString: 'search-bar',
        searchString: ''
    }

    // Control visibility of search field
    classString = () => {
        return `search-bar ${(this.state.active) ? 'active' : 'hidden'}`;
    }

    // Handle input typing
    updateSearch = (value) => {
        this.setState({...this.state, searchString: value});
    }

    isActive = () => {
        // Web is always active, mobile toggles
        if(!isMobile){ return true; }
        else{ return this.state.active; }
    }

    // On click of the search icon
    onSearchClick = (value) => {
        if(this.state.active){
            if(this.state.searchString) this.submit();

            // Toggle search field visibility off for mobile after submit
            if(isMobile) this.setState({...this.state, active: false});
        }
        else{
            // Toggle search field visibility for mobile
            this.setState({
                ...this.state,
                active: true
            }, () => {document.getElementsByClassName('react-search-field-input')[0].focus()});
        }
    }

    // Preserve the active path and then update the query param
    preservePathUpdateParams = () => {
        this.props.match.url = this.props.location.pathname;
        this.props.history.push(updatedURLParamString(this.props, 'q', this.state.searchString));
    }

    submit = () => {
        this.preservePathUpdateParams();

        // Clear field and toggle search bar
        this.setState({
            ...this.state,
            searchString: '',
            active: (isMobile) ? false : true
        }, () => {
            // Wait for URL to update then make the API call
            this.props.searchByQuery(this.props.brands.activeBrand, this.props.location.search);
        });
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            active: this.isActive()
        }, this.setState({
            ...this.state,
            classString: this.classString()
        }));
    }

    render(){
        return(
            <SearchField
              placeholder="Search..."
              onChange={(value, event) => { this.updateSearch(value) }}
              onEnter={(value, event) => { this.submit() }}
              onSearchClick={(value, event) => { this.onSearchClick(value) }}
              searchText={this.state.searchString}
              classNames={this.classString()}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        meta: state.meta,
        brands: state.brands
    };
}

export default connect(mapStateToProps, { searchByQuery })(withRouter(Search));
