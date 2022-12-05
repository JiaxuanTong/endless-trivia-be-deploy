import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import css from './EditingBoard.module.css';
import Spinner from '../../../../../components/UI/Spinner/Fullscreen/Spinner.js';

class EditingBoard extends Component {
    state = {
        category: {
            value: this.props.category,
            error: false
        },
        question: {
            value: this.props.question,
            error: false
        },
        correctAnswer: {
            value: this.props.correctAnswer,
            error: false
        },
        incorrectAnswers: {
            value: this.props.incorrectAnswers,
            error: false
        },
        difficulty: {
            value: this.props.difficulty,
            error: false
        },
        submitting: false
    };

    textChangedHandler = (event, field) => {
        const state = _.cloneDeep(this.state);
        state[field].value = event.target.value;

        this.setState(state);
    }

    incorrectAnswersChangedHandler = (event, index) => {
        const incorrectAnswers = _.cloneDeep(this.state.incorrectAnswers);
        incorrectAnswers.value[index] = event.target.value;

        this.setState({incorrectAnswers: incorrectAnswers});
    }

    incorrectAnswersRemovedHandler = (index) => {
        if (this.state.incorrectAnswers.value.length > 1) {
            const incorrectAnswers = _.cloneDeep(this.state.incorrectAnswers);
            incorrectAnswers.value.splice(index, 1);

            this.setState({incorrectAnswers: incorrectAnswers});
        }
    }

    incorrectAnswersAddedHandler = () => {
        if (this.state.incorrectAnswers.value.length < 3) {
            const incorrectAnswers = _.cloneDeep(this.state.incorrectAnswers);
            incorrectAnswers.value.push("");

            this.setState({incorrectAnswers: incorrectAnswers});
        }
    }

    difficultySelectedHandler = (event) => {
        const difficulty = _.cloneDeep(this.state.difficulty);
        difficulty.value = event.target.value;

        this.setState({difficulty: difficulty});
    }

    validateCategory = () => {
        if (!this.state.category.value || this.state.category.value.length === 0) {
            const category = _.cloneDeep(this.state.category);
            category.error = true;

            this.setState({category: category});
            return false;
        }
        else {
            const category = _.cloneDeep(this.state.category);
            category.error = false;

            this.setState({category: category});
            return true;
        }
    }

    validateQuestion = () => {
        if (!this.state.question.value || this.state.question.value.length === 0) {
            const question = _.cloneDeep(this.state.question);
            question.error = true;

            this.setState({question: question});
            return false;
        }
        else {
            const question = _.cloneDeep(this.state.question);
            question.error = false;

            this.setState({question: question});
            return true;
        }
    }

    validateCorrectAnswer = () => {
        if (!this.state.correctAnswer.value || this.state.correctAnswer.value.length === 0) {
            const correctAnswer = _.cloneDeep(this.state.correctAnswer);
            correctAnswer.error = true;

            this.setState({correctAnswer: correctAnswer});
            return false;
        }
        else {
            const correctAnswer = _.cloneDeep(this.state.correctAnswer);
            correctAnswer.error = false;

            this.setState({correctAnswer: correctAnswer});
            return true;
        }
    }

    validateIncorrectAnswers = () => {
        let valid = true;
        if (!this.state.incorrectAnswers.value || this.state.incorrectAnswers.value.length === 0)   valid = false;
        if (valid) {
            for (let i = 0; i < this.state.incorrectAnswers.value.length; i++) {
                if (this.state.incorrectAnswers.value[i] === "") {
                    valid = false;
                    break;
                }
            }
        }

        if (!valid) {
            const incorrectAnswers = _.cloneDeep(this.state.incorrectAnswers);
            incorrectAnswers.error = true;

            this.setState({incorrectAnswers: incorrectAnswers});
        }
        else {
            const incorrectAnswers = _.cloneDeep(this.state.incorrectAnswers);
            incorrectAnswers.error = false;

            this.setState({incorrectAnswers: incorrectAnswers});
        }

        return valid;
    }

    validateDifficulty = () => {
        if (!this.state.difficulty.value || this.state.difficulty.value.length === 0) {
            const difficulty = _.cloneDeep(this.state.difficulty);
            difficulty.error = true;

            this.setState({difficulty: difficulty});
            return false;
        }
        else {
            const difficulty = _.cloneDeep(this.state.difficulty);
            difficulty.error = false;

            this.setState({difficulty: difficulty});
            return true;
        }
    }

    validateInputs = () => {
        let valid = true;
        valid &= this.validateCategory();
        valid &= this.validateQuestion();
        valid &= this.validateCorrectAnswer();
        valid &= this.validateIncorrectAnswers();
        valid &= this.validateDifficulty();

        return valid;
    }

    submitHandler = () => {
        this.setState({submitting: true});
        if (this.validateInputs()) {
            if (this.props.editingQuestionId != null) {
                this.props.firebase.getDatabase().ref(`questions/${this.state.category.value}/${this.props.editingQuestionId}`).update({
                    category: this.state.category.value,
                    question: this.state.question.value,
                    correct_answer: this.state.correctAnswer.value,
                    incorrect_answers: this.state.incorrectAnswers.value,
                    difficulty: this.state.difficulty.value,
                    type: "multiple",
                })
                .then(() => this.props.updatedHandler())
                .finally(() => this.props.closedHandler());
            }
            else {
                this.props.firebase.getDatabase().ref(`questions/${this.state.category.value}`).once("value")
                .then(snapshot => {
                    const questions = snapshot.val();
                    let lastIndex = null;

                    if (questions) {
                        for (const questionId in questions) {
                            lastIndex = questionId;
                        }
                    }

                    const ref = lastIndex ? `questions/${this.state.category.value}/${parseInt(lastIndex) + 1}` : `questions/${this.state.category.value}/0`;
                    this.props.firebase.getDatabase().ref(ref).set({
                        category: this.state.category.value,
                        question: this.state.question.value,
                        correct_answer: this.state.correctAnswer.value,
                        incorrect_answers: this.state.incorrectAnswers.value,
                        difficulty: this.state.difficulty.value,
                        type: "multiple",
                    })
                    .then(() => this.props.updatedHandler())
                    .finally(() => this.props.closedHandler());
                })
                .catch(() => this.props.closedHandler());
            }
        }
        else {
            this.setState({submitting: false});
        }
    }

    render() {
        return (
            <Modal
                open={this.props.isOpened}
                onClose={this.props.closedHandler}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div className={css.EditingBoard}>
                    <TextField
                        className={css.Input}
                        label="Category"
                        variant="outlined"
                        error={this.state.category.error}
                        value={this.state.category.value}
                        onChange={(event) => this.textChangedHandler(event, "category")} />
                    <TextField
                        className={css.Input}
                        label="Question"
                        variant="outlined"
                        multiline
                        rows={4}
                        error={this.state.question.error}
                        value={this.state.question.value}
                        onChange={(event) => this.textChangedHandler(event, "question")} />
                    <TextField
                        className={css.Input}
                        label="Correct Option"
                        variant="outlined"
                        error={this.state.correctAnswer.error}
                        value={this.state.correctAnswer.value}
                        onChange={(event) => this.textChangedHandler(event, "correctAnswer")} />
                    {this.state.incorrectAnswers.value.map((answer, index) => {
                        return (
                            <div key={index} style={{display: "flex", alignItems: "center"}}>
                                {index === this.state.incorrectAnswers.value.length - 1
                                ? (
                                    <IconButton
                                        className={css.AddButton}
                                        disabled={this.state.incorrectAnswers.value.length >= 3}
                                        onClick={this.incorrectAnswersAddedHandler}
                                    >
                                        <AddIcon fontSize="inherit" />
                                    </IconButton>
                                )
                                : <div className={css.AddButtonPlaceholder}></div>}
                                <TextField
                                    className={[css.Input, css.ShorterInput].join(" ")}
                                    label="Wrong Option"
                                    variant="outlined"
                                    error={this.state.incorrectAnswers.error}
                                    value={this.state.incorrectAnswers.value[index]}
                                    onChange={(event) => this.incorrectAnswersChangedHandler(event, index)} />
                                <IconButton
                                    className={css.RemoveButton}
                                    disabled={this.state.incorrectAnswers.value.length <= 1}
                                    onClick={() => this.incorrectAnswersRemovedHandler(index)}
                                >
                                    <RemoveIcon fontSize="inherit" />
                                </IconButton>
                            </div>
                        );
                    })}
                    <Select
                        className={css.Input}
                        variant="outlined"
                        error={this.state.difficulty.error}
                        value={this.state.difficulty.value}
                        onChange={this.difficultySelectedHandler}
                    >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                    <div className={css.Buttons}>
                        <Button variant="contained" color="secondary" onClick={this.props.closedHandler}>
                            CANCEL
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.submitHandler}>
                            {this.props.isEditing ? "EDIT" : "ADD"}
                        </Button>
                    </div>
                    {this.state.submitting ? <Spinner /> : null}
                </div>
            </Modal>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        firebase: state.misc.firebase
    }
}

EditingBoard.propTypes = {
    editingQuestionId: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    isOpened: PropTypes.bool.isRequired,
    closedHandler: PropTypes.func.isRequired,
    updatedHandler: PropTypes.func.isRequired,
    category: PropTypes.string,
    question: PropTypes.string,
    correctAnswer: PropTypes.string,
    incorrectAnswers: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string,
};

export default connect(mapStateToProps)(EditingBoard);