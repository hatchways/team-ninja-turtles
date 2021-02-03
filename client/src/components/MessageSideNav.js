import React, { useState } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import ContactPane from './ContactPane'
import SearchPane from './SearchPane'
import 'bootstrap/dist/css/bootstrap.min.css';
import { makeStyles } from '@material-ui/core';

const CONTACT_KEY = "contact"
const SEARCH_KEY = "search"

const useStyle = makeStyles((theme) => ({
    tab: {
        width: "50%"
    }
}))

export default function MessageSideNav() {
    const [activeKey, setActiveKey] = useState(CONTACT_KEY)
    const classes = useStyle()

    return (
        <div style={{width:'350px'}} className="d-flex flex-column">
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item className={classes.tab}>
                        <Nav.Link eventKey={CONTACT_KEY}>Contacts</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className={classes.tab}>
                        <Nav.Link eventKey={SEARCH_KEY}>Search</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content className="border-right overflow-auto flex-grow-1">
                    <Tab.Pane eventKey={CONTACT_KEY}>
                        <ContactPane/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={SEARCH_KEY}>
                        <SearchPane/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}