import React from 'react'
import Avatar from "@material-ui/core/Avatar";


function Post({username,caption,imageUrl,price}) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                className="post__avatar"
                alt={username}
                src=""
                />
                <h3>{username}</h3>

            </div>
            {/* image */}
            <img className="post__image" src={imageUrl} alt=""/>

            {/* username caption and price */}
            <h4 className="post__text">
                <strong>{username}:</strong> {caption}
            </h4>
            <h4>
                <strong>Price:</strong> {price}
            </h4>

            
        </div>
    )
}

export default Post
