import { Link } from "react-router-dom";


function Header() {

    return (

        <header>

            <h1>
                Daily Habits & Goal Tracker
            </h1>

            <nav>

                <Link to="/">
                    Home
                </Link>

                <Link to="/habits">
                    Habits
                </Link>

                <Link to="/goals">
                    Goals
                </Link>

                <Link to="/progress">
                    Progress
                </Link>

            </nav>

        </header>

    );

}


export default Header;