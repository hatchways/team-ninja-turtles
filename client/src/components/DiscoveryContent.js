import React from "react";
import "./DiscoveryContent.css";

const DiscoveryContent = (props) => {
    return (
        <div className="container">
            <img
                src={props.img_src} 
                alt="Avatar" 
                className="image"
            />
            <div className="overlay">
                <div>
                    <div className="title">{props.contest_name}</div>
                    <div className="creator">{props.creator_name}</div>
                    <div className="prize">{props.prize.toLocaleString('en-US', {style:'currency', currency:'USD'})}</div>
                    <div className="date">{props.date}</div>
                    <div className="description">{props.desc}</div>
                </div>
            </div>
        </div>
    
    )
}

export default DiscoveryContent;