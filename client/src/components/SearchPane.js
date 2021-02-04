import { Button, List, makeStyles, TextField } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { SessionsContext, CurrentSessionContext } from '../pages/SocketioConnection'
import ContactCard from "./ContactCard"
import { searchUserInfo, createRoom, getAllSessions } from "../apiCalls"
import "./SearchPane.css"

const useStyle = makeStyles((theme) => ({
    textField: {
        width: "70%",
        [`& fieldset`]: {
            borderRadius: 0,
        }
    }, 
    button: {
        width: "30%",
        height: "33px", 
        borderRadius: 0
    }
}))

export default function SearchPane() {
    const classes = useStyle()
    const [searchString, setSearchString] = useState("")
    const [searchReuslt, setSearchResult] = useState([])
    const {sessions, setSessions} = useContext(SessionsContext)
    const {room, setRoom} = useContext(CurrentSessionContext)

    const searchUser = () => {
        searchUserInfo(searchString, (data) => {
            console.log(data)
            setSearchResult(data)
        }, (error) => {
            console.log("unexpected error")
        })
    }

    return (
        <div>
            <TextField 
                value={searchString}
                onChange={(event) => setSearchString(event.target.value)}
                variant="outlined" 
                className={`${classes.textField} without-padding`}
            />
            
            <Button variant="outlined" className={classes.button} onClick={searchUser}>Search</Button>

            <List>
                {searchReuslt.map((value, index) => (
                    <ContactCard 
                        key={index}
                        icon={value.icon}
                        username={value.username}
                        onClick={() => {
                            createRoom(value.username, (data) => {
                                console.log(data)
                                
                                // set session
                                setRoom(data)

                                // update sessions list
                                getAllSessions((data) => {
                                    setSessions(data)
                                }, (error) => {
                                    console.log(error)
                                })
                                
                            }, (error) => {
                                console.log(error)
                            })
                        }}
                    />
                ))}
            </List>
        </div>
    )
}