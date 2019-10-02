import React, { Fragment, useRef } from 'react';
import './ItemBody.css'

export const ItemBody = (props) => {
    const visible = (props.display === 'all') || 
        (props.display === 'active' && props.status === 'active') || 
        (props.display === 'done' && props.status === 'done');
    const focusedEl = useRef(null);

    return (
        <Fragment>
            <div 
                className="item" 
                id={props.id} 
                style={visible ? {display: 'block'} : {display: 'none'}}
            >
                <input 
                    type="checkbox" 
                    className="check" 
                    checked={props.status==='done' ? true : ''}
                    readOnly
                />
                <label onClick={() => props.selectTodo(props.id)}>{props.name}</label>
                <input
                    type="text" 
                    ref={focusedEl} 
                    className={props.opacity === props.id ? 'editTodo editable' : 'editTodo'} 
                    onBlur={props.opacity === props.id ? e => props.setNewValue(e, props.id) : null} 
                    onDoubleClick={e => props.displayForm(e, props.id, focusedEl)} 
                    onKeyDown={e => props.editTodo(e, props.id)}
                />
                <button className="icon" onClick={e => props.displayForm(e, props.id, focusedEl)}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button className="icon" onClick={() => props.deleteTodo(props.id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </Fragment>
    );
}
