import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import css from './Question.module.css';

const Question = (props) => {
    return (
        <Card className={css.Card}>
            <CardContent className={css.Content}>
                <Typography variant="h5" component="h2">{props.category}</Typography>
                <Typography className={css.Question} variant="body2" component="p">{props.question}</Typography>
            </CardContent>
            <CardActions className={css.Actions}>
                <Button size="small" onClick={props.editingHandler}>Details</Button>
                <Button size="small" onClick={props.deleteHandler}>Delete</Button>
            </CardActions>
        </Card>
    );
};

Question.propTypes = {
    category: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    incorrectAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
    difficulty: PropTypes.string.isRequired,
    editingHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired
};

export default React.memo(Question);