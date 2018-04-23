import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { clone, cloneDeep, isEqual } from 'lodash';
import { isEmail, isEmpty } from 'validator';

class AbstractForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                firstName: '',
                lastName: '',
                email: '',
                notes: '',
                source: '',
                test: '',
            },
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                notes: '',
                source: '',
                test: '',
            }
        }
    }
    validate(name, value) {
        switch (name) {
            case 'firstName':
                if (isEmpty(value)) {
                    return 'First name is Required';
                } else {
                    return '';
                }
            case 'lastName':
                if (isEmpty(value)) {
                    return 'Last name is Required';
                } else {
                    return '';
                }
            case 'email':
                if (isEmpty(value)) {
                    return 'Email is Required';
                } else if (!isEmail(value)) {
                    return 'Email is invalid';
                } else {
                    return '';
                }
            case 'source':
                if (isEmpty(value)) {
                    return 'Source Field is Required';
                } else {
                    return '';
                }
            case 'test':
                if (isEmpty(value)) {
                    return 'Test Field is Required';
                } else {
                    return '';
                }
            default: {
                return ''
            }

        }
    }

    handleChange = ({ target: { value, name } }) => {
        let newState = cloneDeep(this.state);
        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };
    handleSubmit = (ev) => {
        ev.preventDefault();
        const fields = clone(this.state.fields);
        let validationErrors = {};
        Object.keys(fields).map(name => {
            const error = this.validate(name, fields[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            this.setState({ errors: validationErrors });
            return;
        }
    };

    render() {
        return (
            <div className="form-horizontal" >
                    <div className="header">
                        <h2 style={{marginTop: "unset"}}>{this.props.label}</h2>
                    </div>
                    <hr/>
                    <div className="form">

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">First Name</label>
                            <div className="col-sm-10">
                                <input type="text"
                                        name="firstName"
                                       className="form-control" value={this.state.fields.firstName}
                                       onChange={this.handleChange}/>
                                <small className="error">{this.state.errors.firstName}</small>
                            </div>
                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label ">Last Name</label>
                            <div className="col-sm-10">
                                <input type="text"
                                       name="lastName"
                                       className="form-control" value={this.state.fields.lastName}
                                       onChange={this.handleChange}/>
                                <small className="error">{this.state.errors.lastName}</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="text"
                                       name="email"
                                       className="form-control" value={this.state.fields.email}
                                       onChange={this.handleChange}/>
                                    <small className="error">{this.state.errors.email}</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Notes</label>
                            <div className="col-sm-10">
                                <textarea className="form-control"
                                          name="notes"
                                          value={this.state.fields.notes}
                                          onChange={this.handleChange}/>
                            </div>
                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Source</label>
                            <div className="col-sm-10">
                                <select className="form-control"
                                        name="source"
                                        value={this.state.fields.source}
                                        onChange={this.handleChange}>
                                    <option value="">--Select--</option>
                                    <option value="Upwork">Upwork</option>
                                    <option value="Referral">Referral</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Other">Other</option>
                                </select>
                                    <small className="error">{this.state.errors.source}</small>
                            </div>
                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Test</label>
                            <div className="col-sm-10">
                                <select className="form-control"
                                        name="test"
                                        value={this.state.fields.test}
                                        onChange={this.handleChange}>
                                    <option value="">--Select--</option>
                                    <option value="UI Test">Postfix mathematical expression</option>
                                    <option value="UI Test">UI Test</option>
                                    <option value="Basic Performance of a Program">Basic Performance of a Program
                                    </option>
                                </select>
                                    <small className="error">{this.state.errors.test}</small>
                            </div>
                        </div>


                        <div className="form-group row">
                            <div className="col-md-2"/>
                            <div className="col-md-2">
                                <Link className="form-control btn btn-primary" to={'/'}>Back To List</Link>
                            </div>
                            <div className="col-md-2">
                                <button className="form-control btn btn-success" onClick={this.handleSubmit}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default AbstractForm;