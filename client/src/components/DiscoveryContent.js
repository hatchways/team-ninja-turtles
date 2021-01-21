import React from "react";
import "./DiscoveryContent.css";

const DiscoveryContent = (props) => {
    return (
        <div class="container">
            <img
                src={props.img_src} 
                alt="Avatar" 
                class="image"
            />
            <div class="overlay">
                <div>
                    <div class="title">{props.contest_name}</div>
                    <div class="creator">{props.creator_name}</div>
                    <div class="prize">{props.prize.toLocaleString('en-US', {style:'currency', currency:'USD'})}</div>
                    <div class="date">{props.date}</div>
                    <div class="description">{props.desc}</div>
                </div>
            </div>
        </div>
    
    )
}

export default DiscoveryContent;