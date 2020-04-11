import React, {Component} from 'react';

import Task from './Task.js';
import {Container} from 'react-bootstrap';

// App component - represents the whole app
export default class App extends Component {

    constructor(props) {
        super(props);

        this.getTasks = this.getTasks.bind(this);
    }
    getTasks() {
        return [
            {
                _id: 1,
                text: 'This is task 1'
            }, {
                _id: 2,
                text: 'This is task 2'
            }, {
                _id: 3,
                text: 'This is task 3'
            }
        ];
    }

    renderTasks() {
        return this
            .getTasks()
            .map((task) => (<Task key={task._id} task={task}/>));
    }

    render() {
        return (
            <Container>
                <div className="container">
                    <header>
                        <h1>Todo List</h1>
                    </header>

                    <ul>
                        {this.renderTasks()}
                    </ul>
                </div>
            </Container>

        );
    }
}