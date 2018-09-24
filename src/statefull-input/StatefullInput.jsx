import React, { Component, Fragment } from 'react';
import {ItemBody} from '../item-body/ItemBody';
import './StatefullInput.css';

export class StatefullInput extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            newTodo: '',
            count: 0,
            itemsLeft: 'items',
            opacity: 0,
            display: 'all',
        }
    }

    checkTodoValue = ({target: {value}}) => this.setState({newTodo: value});
    addTodo = (e) => {
        e = e || window.event;
        var charCode = e.charCode || e.keyCode;
        if (charCode === 13 && e.target.value) {
            this.setState({
                items: [...this.state.items,{id: this.setId(), name: this.state.newTodo, status:'active'}]
            },
            function() {
                this.setStorage();
            });
            e.target.value = this.state.newTodo = '';
            this.refreshCount();
        }
    }

    deleteTodo = (i) => {
        this.setState({
            items: this.state.items.filter(({id}) => 
                id !== i
            )
        },
        function() {
            this.setStorage();
        });
        this.refreshCount();
    }

    selectTodo = (id) => {
        this.setState({
            items: this.state.items.map((todo) =>
                (todo.id === id) ? ({...todo, status: todo.status === 'active' ? 'done' : 'active'}) : ({...todo})
            )
        },
        function() {
            this.setStorage();
        });
        this.refreshCount();
    }

    selectAll = (e) => {
        e = e || window.event;
        let status = e.target.checked === true ? 'done' : 'active';

        this.setState({
            items: this.state.items.map((todo) => 
                ({...todo, status: status})
            )
        },
        function() {
            this.setStorage();
        });
        this.refreshCount();
    };

    setId = () => Date.now().toString().slice(6);
    displayForm = (id) => {this.setState({opacity: id});}
    editTodo = (e, id) => {
        e = e || window.event;
        var charCode = e.charCode || e.keyCode;

        if (charCode === 13 && e.target.value) {
            this.setNewValue.call(this, e, id);
        }
    }
    setNewValue = (e, id) => {
        e = e || window.event;

        if (e.target.value) {
            this.setState({
                items: this.state.items.map((todo) =>
                    todo.id === id ? ({...todo, name: e.target.value}) : ({...todo})
                ),
                opacity: 0
            },
            function() {
                this.setStorage();
            });

            e.target.value = ''
        } else this.setState({ opacity: 0 });
    }
    setAll = () => {
        this.setState({display: 'all'})
    }
    setActive = () => {
        this.setState({display: 'active'})
    }
    setCompleted = () => {
        this.setState({display: 'done'})
    }
    clearCompleted = () => {
        this.setState({
            items: this.state.items.filter(({status}) =>
                status !== 'done'
            )
        });
    }
    refreshCount = () => this.state.items.filter(({status}) => status === 'active').length

    refreshItemsLeft = () => this.refreshCount() === 1 ? 'item left' : 'items left'

    setStorage = () => localStorage.setItem('items', JSON.stringify(this.state.items));


    componentDidMount = () => {
        if (localStorage.getItem('items')) {
            this.setState({items: JSON.parse(localStorage.getItem('items'))})
        }

        // fetch('example.json')
        //     .then((res) => res.json())
        //     .then((parsedRes) => this.setState({parsedRes}));
    }

    render() {
        const {items, itemID, newTodo, count, itemsLeft, opacity, display} = this.state;

        return (
            <Fragment>
                <h2>ToDo List</h2>
                <div className="addTodo">
                    <input type="checkbox" className="selectAll" onClick={this.selectAll} disabled={Object.keys(items).length === 0 ? true : ''} />
                    <input type="text" className="todoText" placeholder="Add new ToDo here..." onKeyDown={this.addTodo} onChange={this.checkTodoValue}/>
                </div>
                <div className="todoList">
                    {items.map(({id, name, status}) => {
                        return <ItemBody
                                    key={id}
                                    id={id}
                                    name={name}
                                    status={status}
                                    deleteTodo={this.deleteTodo}
                                    selectTodo={this.selectTodo}
                                    opacity={opacity}
                                    displayForm={this.displayForm}
                                    editTodo={this.editTodo}
                                    display={this.state.display}
                                    setNewValue={this.setNewValue}
                                />
                    })}
                </div>
                <div className="todoState">
                    <div className="todoCount">
                        <div className="count">{this.refreshCount()}</div>
                        <div className="items">{this.refreshItemsLeft()}</div>
                    </div>
                    <ul className="filters">
                        <li><a href={null} className={display === 'all' ? 'active' : ''} onClick={this.setAll}>All</a></li>
                        <li><a href={null} className={display === 'active' ? 'active' : ''} onClick={this.setActive}>Active</a></li>
                        <li><a href={null} className={display === 'done' ? 'active' : ''} onClick={this.setCompleted}>Complete</a></li>
                        <li className="clearCompleted"><a href={null} id="clear" onClick={this.clearCompleted}>Clear Completed</a></li>
                    </ul>
                </div>
            </Fragment>
        );
    }
}
