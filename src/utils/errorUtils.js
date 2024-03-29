import React, { Component } from 'react';
import { Problem } from '../common/Problem';

export const getApiError = (res, err, dispatch) => {
    dispatch({type: 'setIsFailed', data: true});
    if(res !== null){
        let error = new Error("Error: "
            + res.status + ":"
            + res.statusText);
        error.response = res;
        return error;
    }
    if(err && err !== null && err !== undefined && err !== 'undefined'){
        let error = new Error(err);
        return error;
    }
}

export class ErrorBoudary extends Component {
    constructor(props){
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error){
        console.dir("HERE", error);
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.debug(error, errorInfo);
        console.error("Unexpected Error");
    }

    render() {
        if(this.state.hasError){
            return <Problem message={"Unexpected Error..."} />
        }
        return this.props.children;
    }
}