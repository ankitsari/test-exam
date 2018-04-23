import React, {Component} from 'react';
import AbstractForm from './AbstractForm';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
        }
    }

    componentWillMount() {
        const match = this.props;
        const id = (match && match.params && match.params) || "";
    }

    render() {
        const {formData} = this.state;
        return <AbstractForm label={'Edit'} formData={formData} />;
    }
}

export default Edit;