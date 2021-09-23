import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export function SwaggerUi(): JSX.Element
{
    return (
        <SwaggerUI spec={require("@miniskylab/oas/__dist__/fusion-api.json")}/>
    );
}