import React,{useEffect} from 'react'

function Home() {
    useEffect(() => {
        console.log("home page works")
    }, [])

    return (
        <div>
            <h1>Home Page</h1>
            <p>
                this is all of the things that i would really like to say to you if you do not mind
            </p>
            
        </div>
    )
}

export default Home
