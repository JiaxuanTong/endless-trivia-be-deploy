import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import css from './Question.module.css';
import Option from './Option/Option.js';

const Question = (props) => {
    return (
        <Fragment>
            <div className={css.Question}>
                {props.question.question}
            </div>
            <div className={css.OptionsContainer}>
                {props.question.options.map((option, index) => {
                    return <Option
                        key={index}
                        order={index}
                        disable={props.selected != null}
                        selected={props.selected != null && props.selected === index}
                        correctOption={props.correctOption}
                        clicked={() => props.optionSelectedHandler(index)}
                    >
                        {option}
                    </Option>
                })}
            </div>
        </Fragment>
    );
};

Question.propTypes = {
    question: PropTypes.object.isRequired,
    selected: PropTypes.number,
    correctOption: PropTypes.string,
    optionSelectedHandler: PropTypes.func.isRequired
};

export default Question;