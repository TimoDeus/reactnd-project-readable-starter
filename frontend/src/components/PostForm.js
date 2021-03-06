import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Form} from 'semantic-ui-react';
import {postPropTypes} from '../utils/propTypes';
import uuid from 'uuid'
import {addPost, editPost} from '../actions/posts';

class PostForm extends Component {

	constructor(props) {
		super(props);
		const {post, selectedCategory} = props;
		this.state = {
			formAuthor: post ? post.author : '',
			formTitle: post ? post.title : '',
			formCategory: (post ? post.category : selectedCategory) || '',
			formBody: post ? post.body : '',
		}
	}

	handleChange = (e, {name, value}) => {
		const newEntry = {[name]: value};
		this.setState(prevState => ({...prevState, ...newEntry}));
	};

	handleSubmit = () => {
		const isEditMode = !!this.props.postId;
		isEditMode ? this.editPost() : this.addPost()
	};

	addPost() {
		const {formAuthor, formCategory, formBody, formTitle} = this.state;
		if (formAuthor && formCategory && formBody && formTitle) {
			const post = {
				id: uuid(),
				title: formTitle,
				body: formBody,
				author: formAuthor,
				timestamp: Date.now(),
				category: formCategory
			};
			return this.props.dispatchAddComment(post);
		}
	}

	editPost() {
		const {postId} = this.props;
		const {formBody, formTitle} = this.state;
		if (formBody && formTitle) {
			const post = {
				id: postId,
				title: formTitle,
				body: formBody,
			};
			return this.props.dispatchEditComment(post);
		}
	}

	render() {
		const {categories} = this.props;
		const {formAuthor, formCategory, formBody, formTitle} = this.state;
		const isEditMode = !!this.props.postId;
		return (
			<Form onSubmit={this.handleSubmit}>
				<Form.Group widths='equal'>
					<Form.Input
						label='Author' name='formAuthor' placeholder='Author' value={formAuthor}
						required disabled={isEditMode} onChange={this.handleChange}
					/>
					<Form.Select
						label='Category' placeholder='Category' name='formCategory' required value={formCategory}
						onChange={this.handleChange} disabled={isEditMode}
						options={categories.map(cat => ({key: cat, value: cat, text: cat}))}
					/>
				</Form.Group>
				<Form.Input
					label='Title' name='formTitle' placeholder='Title' value={formTitle}
					required onChange={this.handleChange}
				/>
				<Form.TextArea
					label='Post' name='formBody' value={formBody}
					required onChange={this.handleChange}
				/>
				<Button type='submit'>Submit</Button>
			</Form>
		);
	}
}

PostForm.propTypes = {
	dispatchAddComment: PropTypes.func.isRequired,
	dispatchEditComment: PropTypes.func.isRequired,
	categories: PropTypes.array.isRequired,
	selectedCategory: PropTypes.string,
	postId: PropTypes.string,
	post: PropTypes.shape(postPropTypes),
};

const mapDispatchToProps = dispatch => ({
	dispatchAddComment: post => dispatch(addPost(post)),
	dispatchEditComment: post => dispatch(editPost(post))
});

const mapStateToProps = (state, ownProps) => ({
	categories: state.categories.data.map(cat => cat.name),
	post: (ownProps.postId && state.posts.data ? state.posts.data.find(post => post.id === ownProps.postId) : undefined),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
