import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import css from './QuestionBoard.module.css';
import Timer from '../Timer/Timer.js';
import Question from './Question/Question.js';

const QuestionBoard = (props) => {
    return (
        <div className={css.Container}>
            {props.startCountdown != null
            ? (
                <div className={css.CountdownContainer}>
                    <div className={css.Countdown}>{props.startCountdown}</div>
                </div>
            )
            : (
                <Fragment>
                    <Timer time={props.timeLeft} />
                    <div className={css.QuestionContainer}>
                        <Question
                            question={props.question}
                            selected={props.selected}
                            correctOption={props.correctOption}
                            optionSelectedHandler={props.optionSelectedHandler} />
                    </div>
                    <div className={css.QuestionCount}>{props.questionCount} / {props.totalQuestions}</div>
                </Fragment>
            )}
        </div>
    );
};

QuestionBoard.propTypes = {
    startCountdown: PropTypes.number,
    question: PropTypes.object,
    selected: PropTypes.number,
    correctOption: PropTypes.string,
    timeLeft: PropTypes.number.isRequired,
    questionCount: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    optionSelectedHandler: PropTypes.func.isRequired
};

export default QuestionBoard;