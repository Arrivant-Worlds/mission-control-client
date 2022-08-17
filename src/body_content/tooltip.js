import React, { useState, useEffect } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function TOOLTIP(props) {
  //take in a component for a key.
  // console.log(props, "??? tooltip props?");
  return (
    <Tooltip
      title={`${props.text}`}
    >
      {props.wrapped_component}
    </Tooltip>
  );
}
