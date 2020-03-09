import React from 'react';
//import {Navbar,NavbarBrand} from 'reactstrap'
import '../App.css';
import MenuComponent from './menucomponent';
import MenuDetails from './menuDetails';
import Header from './headercomponent';
import Footer from './footercomponent';
import Home from './homecomponent';
import Contact from './contactcomponent';
import About from './aboutus'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchPromos, fetchComments } from '../redux/ActionCreators';
import { actions } from 'react-redux-form'
import { actionTypes } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const mapDispatchToProps = (dispatch) => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => { dispatch(fetchDishes()) },
    fetchComments: () => { dispatch(fetchComments()) },
    fetchPromos: () => { dispatch(fetchPromos()) },
    resetFeedbackForm: () => {
        dispatch(actions.reset('feedback'))
    }
});
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}


class MainComponent extends React.Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
    }

    render() {
        const HomePage = () => {
            return (
                <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promotion) => promotion.featured)[0]}
                    promosLoading={this.props.promotions.isLoading}
                    promosErrMess={this.props.promotions.errMess}
                    leader={this.props.leaders.filter((leader) => leader.featured)[0]} />
            );
        }
        const DishWithId = ({ match }) => {
            console.log(this.props.dishes.dishes)
            return (
                <MenuDetails dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}

                    CommentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment} />

            )
        }

        const AboutUs = () => {
            return (
                <About leaders={this.props.leaders} />
            );
        }
        return (
            <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch>
                            <Route path='/home' component={HomePage} />
                            <Route exact path='/menu' component={() => <MenuComponent dishes={this.props.dishes} />} />
                            <Route path='/menu/:dishId' component={DishWithId} />
                            <Route exact path='/aboutus' component={AboutUs} />
                            <Route path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                            <Redirect to="/home" />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>


                <Footer />

            </div>
        );
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainComponent));
