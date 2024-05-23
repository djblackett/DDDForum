import './App.css'
import {Link, Outlet, useLocation} from "react-router-dom";
import {useState} from "react";

// type User = {
//     id: number,
//     email: string,
//     username: string,
//     firstName: string,
//     lastName: string
// }


function App() {
    const [user, setUser] = useState("Mr. Dude");
    const route = useLocation();

    const logout = () => {
        setUser("")
    }

    return (
      <>
          <div id="root">
              <header id="header" className="flex align-center">
                  <div id="app-logo">
                      <img src="dddforumlogo.png" alt={"DDD Forum Logo"}/>
                  </div>
                  <div id="title-container">
                      <h1>Domain-Driven Designers</h1>
                      <h3>Where awesome domain driven designers are made</h3>
                      <button className={"button"}>submit</button>
                  </div>
                  {route.pathname !== "/register" && !user && <div id="header-action-button">
                      <Link to={"register"}><button className={"button"}>Join</button></Link>
                  </div>}
                  {user && <div id="logout-button">
                      <label>{user}</label>
                      <button className={"button"} onClick={logout}>logout</button>
                  </div>}
              </header>

              <Outlet />
          </div>
      </>
  )
}

export default App
