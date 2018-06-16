import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Toaster extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: props.message,
            type: props.type
        }
    }

    createNotification = (type, message) => {
        const { toastComplete } = this.props;
        return () => {
            switch (type) {
                case 'info':
                    NotificationManager.info(message,'', 3000);
                    toastComplete();
                    break;
                case 'success':
                    NotificationManager.success(message,'', 3000);
                    toastComplete();
                    break;
                case 'warning':
                    NotificationManager.warning(message, '', 3000);
                    toastComplete();
                    break;
                case 'error':
                    NotificationManager.error(message, '', 3000);
                    toastComplete();
                    break;
            }
        };
    };

    componentWillReceiveProps(nextProps){
        this.setState({message:nextProps.message,type:nextProps.type});
    }


    render(){
        const {message,type} = this.state;
        const isToasterDisplay = !!message;
        isToasterDisplay && this.createNotification(type,message);
        return(
            <NotificationContainer/>
        )
    }
}