import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import css from './Title.module.css';

const Title = (props) => {
    const userTitleCss = [css.Title];
    const questionTitleCss = [css.Title];
    if (props.onUser) {
        userTitleCss.push(css.Selected);
    }
    else {
        questionTitleCss.push(css.Selected);
    }
    
    return (
        <div className={css.Container}>
            <h1 className={userTitleCss.join(" ")} onClick={() => props.clickedHandler("Users")}>Users</h1>
            <Switch
                checked={!props.onUser}
                onChange={props.switchedHandler}
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }} />
            <h1 className={questionTitleCss.join(" ")} onClick={() => props.clickedHandler("Questions")}>Questions</h1>
        </div>
    );
};

Title.propTypes = {
    onUser: PropTypes.bool.isRequired,
    switchedHandler: PropTypes.func.isRequired,
    clickedHandler: PropTypes.func.isRequired
}

export default Title;