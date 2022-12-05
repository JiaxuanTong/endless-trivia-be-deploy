import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PublishIcon from '@material-ui/icons/Publish';

import css from './QuestionList.module.css';
import FlowerSpinner from '../../../../components/UI/Spinner/BaseSpinners/FlowerSpinner/FlowerSpinner.js';
import Question from '../../../../components/Admin/Question/Question.js';
import EditingBoard from './EditingBoard/EditingBoard.js';

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.topRef = React.createRef();
    }

    state = {
        loading: true,
        questions: [],
        isBoardOpened: false,
        editingQuestionIndex: null,
        editingQuestionId: null,
        shouldUpdateList: false
    }

    retrieveQuestions = () => {
        this.setState({loading: true});

        this.props.firebase.getDatabase().ref("questions").once("value")
        .then(snapshot => {
            const questions = snapshot.val();
            if (questions) {
                let questionsState = [];
                for (const category in questions) {
                    for (const questionId in questions[category]) {
                        questionsState.push({
                            questionId: questionId,
                            category: category,
                            question: questions[category][questionId].question,
                            correctAnswer: questions[category][questionId].correct_answer,
                            incorrectAnswers: questions[category][questionId].incorrect_answers,
                            difficulty: questions[category][questionId].difficulty
                        });
                    }
                }

                this.setState({questions: questionsState});
            }
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    componentDidMount() {
        this.retrieveQuestions();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.shouldUpdateList && this.state.shouldUpdateList) {
            this.retrieveQuestions();
            this.setState({shouldUpdateList: false});
        }
    }

    openEditingBoardHandler = (index) => {
        if (index != null) {
            this.setState({
                isBoardOpened: true,
                editingQuestionIndex: index,
                editingQuestionId: this.state.questions[index].questionId
            });
        }
        else {
            this.setState({
                isBoardOpened: true,
                editingQuestionIndex: null,
                editingQuestionId: null
            });
        }
    }

    closeEditingBoardHandler = () => {
        this.setState({isBoardOpened: false, editingQuestionIndex: null});
    }

    listShouldUpdatedHandler = () => {
        this.setState({shouldUpdateList: true});
    }

    deleteQuestionHandler = (index) => {
        const question = this.state.questions[index];

        this.props.firebase.getDatabase().ref(`questions/${question.category}/${question.questionId}`).remove()
        .then(() => {
            const newQuestions = _.cloneDeep(this.state.questions);
            newQuestions.splice(index, 1);
            this.setState({questions: newQuestions});
        });
    }

    scrollToTopHandler = () => {
        this.topRef.current.scrollIntoView({behavior: "smooth"});
    }

    render() {
        return (
            <div className={css.Container}>
                {this.state.loading
                ? (
                    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <FlowerSpinner />
                    </div>
                )
                : (
                    <div className={css.QuestionList}>
                        <div ref={this.topRef}></div>
                        <IconButton className={css.Button} onClick={() => this.openEditingBoardHandler(null)}>
                            <AddCircleIcon fontSize="inherit" />
                        </IconButton>
                        {this.state.questions.map((question, index) => {
                            return <Question
                                key={index}
                                category={question.category}
                                longCategory={question.longCategory}
                                question={question.question}
                                correctAnswer={question.correctAnswer}
                                incorrectAnswers={question.incorrectAnswers}
                                difficulty={question.difficulty}
                                editingHandler={() => this.openEditingBoardHandler(index)}
                                deleteHandler={() => this.deleteQuestionHandler(index)} />
                        })}
                    </div>
                )}
                <IconButton className={css.UpwardButton} onClick={this.scrollToTopHandler} color="primary">
                    <PublishIcon fontSize="inherit" />
                </IconButton>
                {this.state.isBoardOpened
                ? <EditingBoard
                    editingQuestionId={this.state.editingQuestionId}
                    isEditing={this.state.editingQuestionIndex != null}
                    isOpened={this.state.isBoardOpened}
                    closedHandler={this.closeEditingBoardHandler}
                    updatedHandler={this.listShouldUpdatedHandler}
                    index={this.state.editingQuestionIndex}
                    category={this.state.editingQuestionIndex != null ? this.state.questions[this.state.editingQuestionIndex].category : ""}
                    question={this.state.editingQuestionIndex != null ? this.state.questions[this.state.editingQuestionIndex].question : ""}
                    correctAnswer={this.state.editingQuestionIndex != null ? this.state.questions[this.state.editingQuestionIndex].correctAnswer : ""}
                    incorrectAnswers={this.state.editingQuestionIndex != null ? this.state.questions[this.state.editingQuestionIndex].incorrectAnswers : [""]}
                    difficulty={this.state.editingQuestionIndex != null ? this.state.questions[this.state.editingQuestionIndex].difficulty : "easy"} />
                : null}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        firebase: state.misc.firebase
    }
}

export default connect(mapStateToProps)(QuestionList);