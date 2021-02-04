import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import React from 'react'

export default function ContactCard(props) {
    return (
        <ListItem button onClick={props.onClick}>
            <ListItemAvatar>
                <Avatar src={props.icon == null ? process.env.PUBLIC_URL + '/images/avatar-1.png': props.icon}/>
            </ListItemAvatar>
            <ListItemText
                primary={props.username}
            />
        </ListItem>
    )
}