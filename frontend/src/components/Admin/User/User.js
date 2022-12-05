import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

import css from './User.module.css';

const User = (props) => {
    return (
        <div className={css.User}>
            {!props.banned
            ? (
                <Chip
                    icon={<FaceIcon />}
                    label={props.email}
                    color="primary"
                    onDelete={() => props.clickedHandler(props.userId)} />
            )
            : (
                <Chip
                    icon={<FaceIcon />}
                    label={props.email}
                    onDelete={() => props.clickedHandler(props.userId)}
                    deleteIcon={<DoneIcon />} />
            )}
        </div>
    );
};

User.propTypes = {
    userId: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    banned: PropTypes.bool,
    clickedHandler: PropTypes.func.isRequired
};

export default User;