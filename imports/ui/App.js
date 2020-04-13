import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';


import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,               //state dass die sachen verschwunden sind
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();            //finde textInput und nimm Value

        /* Tasks.insert({                      //insert text und date in mongodb
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username,  // username of logged in user
        }); */
        Meteor.call('tasks.insert', text);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';       //lösche textinput value
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,               //änder hideCompleted state
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;               //filtertedTask sind alle Tasks in api/tasks

        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);       //wenn hideCompleted == true dann filtern takss nach nicht gecheckt
        }

        /* return filteredTasks.map((task) => (        //nimm alle gefilteret und zeig nach einander
            <Task key={task._id} task={task} />
        )); */
        return filteredTasks.map((task) => {            //nimm alle gefilteret und zeig nach einander

            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return (
                <Task
                    key={task._id}
                    task={task}
                    showPrivateButton={showPrivateButton}
                />
            );
        });
    }
    

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}          //wenn gecheckt dann hideCompleted is true
                            onClick={this.toggleHideCompleted.bind(this)}       //wenn gecklcikt dann function soll laufen 
                        />
                        Hide Completed Tasks
                    </label>
                    <AccountsUIWrapper />
                    {this.props.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new tasks"
                            />
                        </form> : ''
                    }
                </header>

                <ul>
                    {this.renderTasks()}
                    {console.log(this.props)}
                </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');    //subscribe to the publication when the App component is created
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(), //die neuste kommt oben
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(), //anzahl der nicht checked wird aufgezählt
        currentUser: Meteor.user(),

    };
})(App);