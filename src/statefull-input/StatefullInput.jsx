import React, { Fragment, useState, useEffect } from 'react';
import {ItemBody} from '../item-body/ItemBody';
import './StatefullInput.css';

export const StatefullInput = () => {
    const initialItems = () => JSON.parse(window.localStorage.getItem('items')) || [];
    const [items, setItems] = useState(initialItems);
    const [newTodo, setNewTodo] = useState('');
    const [count, setCount] = useState(0);
    const [itemsLeft, setItemsLeft] = useState('items left');
    const [opacity, setOpacity] = useState(0);
    const [display, setDisplay] = useState('all');

    const setAll = () => setDisplay('all')
    const setActive = () => setDisplay('active')
    const setCompleted = () => setDisplay('done')
    const clearCompleted = () => {
        setItems(items.filter(({status}) => status !== 'done'));
    };
    let refreshCount = () => items.filter(({status}) => status === 'active').length;
    let refreshItemsLeft = (count) => setItemsLeft(count === 1 ? 'item left' : 'items left');
    const checkTodoValue = ({target: {value}}) => setNewTodo(value);

    const addTodo = (e) => {
        e = e || window.event;
        var charCode = e.charCode || e.keyCode;
        if (charCode === 13 && e.target.value) {
            setItems([...items, { id: setId(), name: newTodo, status:'active'}]);
            setNewTodo('');
            e.target.value = '';
        }
    }

    const deleteTodo = (i) => {
        setItems(items.filter(({id}) => id !== i));
    }

    const selectTodo = (id) => {
        setItems(items.map((todo) =>
            (todo.id === id) ? ({...todo, status: todo.status === 'active' ? 'done' : 'active'}) : ({...todo})
        ));
    }

    const selectAll = (e) => {
        e = e || window.event;
        let status = e.target.checked === true ? 'done' : 'active';
        setItems(items.map((todo) => ({...todo, status: status})));
    }

    const setId = () => Date.now().toString().slice(6);
    const displayForm = (e, id, el) => {
        setOpacity(id);
        el.current.focus();
    }

    const editTodo = (e, id) => {
        e = e || window.event;
        var charCode = e.charCode || e.keyCode;

        if (charCode === 13 && e.target.value) {
            setNewValue(e, id);
        }
    };

    const setNewValue = (e, id) => {
        e = e || window.event;

        if (e.target.value) {
            setItems(items.map((todo) =>
                todo.id === id ? ({...todo, name: e.target.value}) : ({...todo})
            ));

            e.target.value = '';
        }

        setOpacity(0);
    };

    const setStorage = () => window.localStorage.setItem('items', JSON.stringify(items));

    useEffect(() => {
        const countNow = refreshCount();
        setCount(countNow);
        refreshItemsLeft(countNow);
        setStorage();

    }, [items]);

    return (
        <Fragment>
            <h2>ToDo List</h2>
            <div className="addTodo">
                <input type="checkbox" className="selectAll" onClick={selectAll} disabled={Object.keys(items).length === 0 ? true : ''} />
                <input type="text" className="todoText" placeholder="Add new ToDo here..." onKeyDown={addTodo} onChange={checkTodoValue}/>
            </div>
            <div className="todoList">
                {items.map(({id, name, status}) => {
                    return <ItemBody
                                key={id}
                                id={id}
                                name={name}
                                status={status}
                                deleteTodo={deleteTodo}
                                selectTodo={selectTodo}
                                opacity={opacity}
                                displayForm={displayForm}
                                editTodo={editTodo}
                                display={display}
                                setNewValue={setNewValue}
                            />
                })}
            </div>
            <div className="todoState">
                <div className="todoCount">
                    <div className="count">{count}</div>
                    <div className="items">{itemsLeft}</div>
                </div>
                <ul className="filters">
                    <li><span className={display === 'all' ? 'active' : ''} onClick={setAll}>All</span></li>
                    <li><span className={display === 'active' ? 'active' : ''} onClick={setActive}>Active</span></li>
                    <li><span className={display === 'done' ? 'active' : ''} onClick={setCompleted}>Complete</span></li>
                    <li className="clearCompleted"><span id="clear" onClick={clearCompleted}>Clear Completed</span></li>
                </ul>
            </div>
        </Fragment>
    );
}
