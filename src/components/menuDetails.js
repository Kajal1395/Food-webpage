import React from 'react';
import { Card, CardBody, CardImg, CardText, CardTitle, BreadcrumbItem, Breadcrumb, Button, Col, Modal, ModalHeader, ModalBody, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components'


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);

const minLength = (len) => (val) => val && (val.length >= len);



function RenderDish({ dish }) {
    return (<div className="col-12 col-md-5 m-1">

        <FadeTransform in
            transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>
    </div>);


}

function RenderComments(props) {

    if (props.comments != null)
        return (
            <div className="col-12 col-md-5 m-1">
                <h1>Comments</h1>
                <ul className="list-unstyled">
                    <Stagger in>
                        {props.comments.map((comment) => {
                            return (
                                <Fade in><li key={comment.id}>
                                    <blockquote>{comment.comment}
                                        <footer>
                                            <cite>--{comment.author},  </cite>
                                            {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                        </footer>
                                    </blockquote>
                                </li>
                                </Fade>)
                        })}
                    </Stagger>
                </ul>
                <CommentForm dishId={props.dishId} postComment={props.postComment} />
            </div>);
    else
        return (<div></div>)
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return (
            <div>
                <Button outline onClick={this.toggleModal}><i className="fa fa-pencil fa-lg"></i>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <label htmlFor="rating" md={2}>Rating</label>
                                <Col md={10}>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </Control.select>
                                </Col>
                                <label htmlFor="author" md={2}>Your Name</label>
                                <Col md={10}>
                                    <Control.text model=".author" id="author" name="author" placeholder="Name"
                                        className="form-control"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 3 characters',
                                            maxLength: 'Must be less than 15 characters'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <label htmlFor="comment" md={2}>comment</label>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" name="comment" rows="12" className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">

                                <Col md={{ size: 10, offset: 2 }}>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>

                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }

}

const MenuDetails = (props) => {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        )
    }
    else if (props.dish != null) {
        return (
            <div className="container">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id} />

                </div>
            </div>
        )
    }
    else
        return (<div></div>);

}
export default MenuDetails
