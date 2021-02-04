import { List } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import ContactCard from './ContactCard'
import {getAllSessions} from "../apiCalls"
import { CurrentSessionContext, SessionsContext } from '../pages/SocketioConnection';

export default function ContactPane(props) {
    const {sessions, setSessions} = useContext(SessionsContext);
    const {room, setRoom} = useContext(CurrentSessionContext)

    useEffect(() => {
        getAllSessions((data) => {
            setSessions(data)

            if (room.session < 0 && data.length > 0) {
                    setRoom(data[0])
            }
        }, (error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            <List>
                {sessions.map((value, index) => (
                    <ContactCard
                        key={index}
                        icon={value.user.icon}
                        username={value.user.username}
                        onClick={() => {
                            setRoom(value)
                        }}
                    />
                ))}
            </List>
        </div>
    )
}