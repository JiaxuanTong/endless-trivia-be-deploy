import React from 'react';

import css from './GlitchedTitle.module.css';

const GlitchedTitle = (props) => {
    return (
        <h1 className={css.GlitchedTitle} data-text={props.children}>{props.children}</h1>
    );
};

export default React.memo(GlitchedTitle);