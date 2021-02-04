import React from "react";
import "./DiscoveryContent.css";

const DiscoveryContent = (props) => {
    return (
        <div className="container" id={props.id}>
            <img
                src={props.img_src} 
                alt="Avatar" 
                className="image"
                id={props.id}
            />
            <div className="overlay" id={props.id}>
                <div id={props.id}>
                    <div className="title" id={props.id}>{props.contest_name}</div>
                    <div className="creator" id={props.id}>{props.creator_name}</div>
                    <div className="prize" id={props.id}>{props.prize.toLocaleString('en-US', {style:'currency', currency:'USD'})}</div>
                    <div className="date" id={props.id}>{props.date}</div>
                    <div className="description" id={props.id}>{props.desc}</div>
                </div>
            </div>
        </div>
    
    )
}

export default DiscoveryContent;