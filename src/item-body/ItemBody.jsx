import React, { Component, Fragment } from 'react';
import './ItemBody.css'

export class ItemBody extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    
    render() {
        const {
            id,
            name,
            status,
            deleteTodo,
            selectTodo,
            editTodo,
            opacity,
            displayForm,
            display,
            refreshStatus,
            setNewValue
        } = this.props;

        const visible = (display === 'all') || (display === 'active' && status === 'active') || (display === 'done' && status === 'done');

        return (
        <Fragment>
            <div className="item" id={id} style={visible ? {display: 'block'} : {display: 'none'}}>
                <input type="checkbox" className="check" onChange={() => {}} checked={status==='done' ? true : ''}/>
                <label onClick={() => selectTodo(id)}>{name}</label>
                <input type="text" className={opacity === id ? 'editTodo editable' : 'editTodo'} onBlur={opacity === id ? (event) => setNewValue(event, id) : null} onDoubleClick={() => displayForm(id)} onKeyDown={(event) => editTodo(event, id)}/>
                <button className="delete" onClick={() => deleteTodo(id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </Fragment>
        )
    }
}