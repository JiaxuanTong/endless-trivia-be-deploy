import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import avatar1 from '../../../assets/images/avatars/avatar1.jpg';
import avatar2 from '../../../assets/images/avatars/avatar2.jpg';
import avatar3 from '../../../assets/images/avatars/avatar3.jpg';
import avatar4 from '../../../assets/images/avatars/avatar4.jpg';
import avatar5 from '../../../assets/images/avatars/avatar5.png';
import avatar6 from '../../../assets/images/avatars/avatar6.jpg';
import avatar7 from '../../../assets/images/avatars/avatar7.jpg';
import avatar8 from '../../../assets/images/avatars/avatar8.png';
import avatar9 from '../../../assets/images/avatars/avatar9.png';
import avatar10 from '../../../assets/images/avatars/avatar10.jpg';
import css from './UserProfile.module.css';
import FlowerSpinner from '../../UI/Spinner/BaseSpinners/FlowerSpinner/FlowerSpinner';

const getRandomAvatar = () => {
    const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
    return avatars[Math.floor(Math.random() * avatars.length)];
};
const avatar = getRandomAvatar();

const UserProfile = (props) => {
    return (
        <div className={css.UserProfile}>
            <div className={css.Profile}>
                <div className={css.Avatar}>
                    <img src={avatar} alt="avatar" />
                </div>
                <div className={css.DisplayName}>{props.displayName}</div>
                <div className={css.Buttons}>
                    <button className={css.Button} onClick={props.startNameChangingHandler}>Change Name</button>
                    <button className={css.Button} onClick={props.startPasswordChangingHandler}>Change Password</button>
                </div>
            </div>
            <div className={css.Stats}>
                {props.fetchingStats
                ? (
                    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <FlowerSpinner />
                    </div>
                )
                : (
                    <Fragment>
                        <div className={css.Stat}>
                            {props.totalGames}<i className="fas fa-gamepad"></i>
                        </div>
                        <div className={css.VeriticalLine}></div>
                        <div className={css.Stat}>
                            {props.totalWins}<i className="fas fa-trophy"></i>
                        </div>
                        <div className={css.VeriticalLine}></div>
                        <div className={css.Stat}>
                            {props.totalQuestionsAnswered}<i className="fas fa-question-circle"></i>
                        </div>
                        <div className={css.VeriticalLine}></div>
                        <div className={css.Stat}>
                            {props.totalCorrectQuestions}<i className="fas fa-check-double"></i>
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

UserProfile.propTypes = {
    displayName: PropTypes.string.isRequired,
    fetchingStats: PropTypes.bool,
    totalGames: PropTypes.number,
    totalWins: PropTypes.number,
    totalQuestionsAnswered: PropTypes.number,
    totalCorrectQuestions: PropTypes.number,
    startNameChangingHandler: PropTypes.func.isRequired,
    startPasswordChangingHandler: PropTypes.func.isRequired
}

export default React.memo(UserProfile);