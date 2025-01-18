import {useRouteError} from "react-router-dom";

import React from "react";

export function ErrorBoundary() {
    let error = useRouteError();
    console.log(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang! router error!</div>;
}
