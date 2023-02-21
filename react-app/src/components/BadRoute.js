import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function BadRoute() {
    const history = useHistory();

    useEffect(() => {
        const redirectTimeout = setTimeout(() => history.push('/'), 3000);

        return () => { clearTimeout(redirectTimeout) }
    }, [history])

    return (
        <>
            <h2>404</h2>
            <div>Sorry, there's nothing here. You will be redirected...</div>
        </>
    )
}
