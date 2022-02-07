
import React from "react";

const CurrentUser = React.createContext(
    {
        name: "Alberto", 
        lastName: "Aldana", 
        age: 18
    }
);

export default CurrentUser;

