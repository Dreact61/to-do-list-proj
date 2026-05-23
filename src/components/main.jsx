import classes from './main.module.css'
import { useState, useEffect } from 'react'

export function Main() {
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isMainVisible, setIsMainVisible] = useState(true)
    const [isSectionVisible, setIsSectionVisible] = useState(false)
    const TASK_PREFIX = 'task-'

    function readTasksFromStorage() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(TASK_PREFIX))
            .map(key => {
                try {
                    return JSON.parse(localStorage.getItem(key))
                } catch {
                    console.error('Error!')
                    return null
                }
            })
            .filter(Boolean)
            .sort((a,b) => a.id - b.id)
    }

    const [tasks, setTasks] = useState([])
    const [draftTasks, setDraftTasks] = useState([])
    
    useEffect(() => {
        setTasks(readTasksFromStorage())
    }, [])

    useEffect(() => {
        if (isSectionVisible) {
            setDraftTasks(tasks.map((task) => ({ ...task })))
        }
    }, [isSectionVisible, tasks])

    function handleSubmit(e) {
        e.preventDefault()
        const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1
        const task = { id: nextId, name: form.name, desc: form.desc, removeThisTask: false}

        localStorage.setItem(`task-${nextId}`, JSON.stringify(task))
        setTasks(prev => [...prev, task])
        handleCancel()
        form.name = ''
        form.desc = ''
    }

    function handleApplyChanges() {
        tasks.forEach(t => {
            if (t.removeThisTask) {
                localStorage.removeItem(`task-${t.id}`)
            }
        })
        draftTasks.forEach(t => localStorage.setItem(`task-${t.id}`, JSON.stringify(t)))
        checkForRemove()
        setTasks(draftTasks.map((task) => ({ ...task })))
        handleDiscard()
    }

    function checkForRemove() {
        draftTasks.map(t => {
            if (t.removeThisTask) {
                localStorage.removeItem(`task-${t.id}`)
            }
        })
    }
    /*------------------------------------------------------- */

    const [form, setForm] = useState({
        name: '',
        inputError: false,
        desc: ''
    })
    
    function handleFormVision() {
        setIsFormVisible(prev => !prev)
        setIsMainVisible(prev => !prev)
    }

    function handleCancel() {
        setIsFormVisible(prev => !prev)
        setIsMainVisible(prev => !prev)
    }
    
    function handleDiscard() {
        setIsSectionVisible(prev => !prev)
        setIsMainVisible(prev => !prev)
    }

    function handleName(e) {
        setForm(prev => ({...prev, name: e.target.value, inputError: e.target.value.trim().length === 0}))
    }
    function handleDesc(e) {
        setForm(prev => ({...prev, desc: e.target.value}))
    }
    
    return (
       <>
        <main className={classes.todomain} style={{display: isMainVisible ? 'flex' : 'none'}}>
            <h2>Your current tasks:</h2>
            <div className={classes.tasktab}>
                {tasks.length === 0 && <p>No tasks yet.</p>}
                {tasks.map((task) => (
                    <div key={task.id}>
                        <b>{task.name}</b>
                        {task.desc && <p>{task.desc}</p>}
                    </div>
                ))}
            </div>
            <div className={classes.actionsRow}>
                <button className={classes.btn} onClick={handleDiscard} type="button">Edit</button>
                <button className={classes.btn} onClick={handleFormVision} type="button">Add</button>
            </div>
       </main>

       <form onSubmit={handleSubmit}  className={classes.addSection} style={{display: isFormVisible ? 'flex' : 'none'}}>
            <h2>Add new task</h2>
            <label htmlFor={classes.nameInp}>Task name:</label>
            <input style = {{
                border: form.inputError ? '1px solid red' : null
            }} type="text" id={classes.nameInp} required value={form.name} onChange={handleName} />

            <label htmlFor={classes.descInp}>Task description (optional):</label>
            <input type="text" id={classes.descInp} value={form.desc} onChange={handleDesc} />

            <div className={classes.actionsRow}>
                <button className={classes.btn} disabled={form.inputError} type="submit">Add</button>
                <button className={classes.btn} onClick={handleCancel} type='button'>Cancel</button>
            </div>
       </form>

       <form className={classes.editSection} style={{display: isSectionVisible ? 'flex' : "none"}} onSubmit={handleApplyChanges}>
            <h2>Task Editor</h2>
            <div className={classes.editTab}>
                {draftTasks.length === 0 && <p>No tasks to edit.</p>}
                {draftTasks.map(task => (
                    <div key={task.id}>
                        <label htmlFor={`taskname-${task.id}`}>Task name:</label>
                        <input 
                        id={`taskname-${task.id}`}
                        value={task.name}
                        onChange={(e) => setDraftTasks(prev => 
                            prev.map(t => t.id === task.id ? {...t, name: e.target.value} : t)
                        )} />
                        <label htmlFor={`taskdesc-${task.id}`}>Task description:</label>
                        <input 
                        id={`taskdesc-${task.id}`}
                        value={task.desc}
                        onChange={(e) => setDraftTasks(prev => 
                            prev.map(t => t.id === task.id ? {...t, desc: e.target.value} : t)
                        )} />
                        <label htmlFor={`remove-${task.id}`}>remove this task</label>
                        <input type="checkbox" 
                        onChange={(e) => setDraftTasks(prev => 
                            prev.map(t => 
                                t.id === task.id ? {...t, removeThisTask: e.target.checked} : t
                            )
                        )}
                        id={`remove-${task.id}`} />
                    </div>
                ))}
            </div>
            <div className={classes.actionsRow}>
                <button onClick={handleApplyChanges} className={classes.btn} type="submit">Apply</button>
                <button className={classes.btn} type="button" onClick={handleDiscard}>Discard</button>
            </div>
       </form>
       </>
    )
}