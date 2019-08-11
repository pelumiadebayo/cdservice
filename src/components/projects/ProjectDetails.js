import React, { Component } from 'react';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {Redirect} from 'react-router-dom';
import moment from 'moment'
import PreviewPicture from './PreviewPicture';
import { addLike, removeLike } from "../../store/actions/projectAction";

class ProjectDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }
   increment=(e)=>{
     e.preventDefault()
     console.log(this.props.match.params.id);
     
    this.props.addLike(this.props.match.params.id);
    this.setState({
      clicked:!this.state.clicked
    })
    console.log(this.state.clicked);
    
  }
   decrement=(e)=>{
    e.preventDefault()
    this.props.removeLike(this.props.match.params.id);
    this.setState({
      clicked:!this.state.clicked
    })
    console.log(this.state.clicked);
  }
render(){
  const {project, auth}= this.props;
  if (!auth.uid) return <Redirect to='/signIn'/>
  
  if (project) {
    return(
    <div className="container">
      <div className="card z-depth-0">
        <div className="card-content">
          <div className="card-title advertizer">{project.title}</div>
          <div className="border">
          {project.picture?<PreviewPicture pictureUrl={project.picture}  height="auto" />:null}
          </div>
            <div className="card-action grey lighten-4 grey-text">
            <h5 className="black-text detail">{project.content}</h5>
              <div><strong>Posted By {project.authorFullName} {project.stateCode}</strong></div>
              <div>{moment(project.createdAt.toDate()).calendar()}</div>
              <h5>{project.likeCount>1?project.likeCount + " likes":project.likeCount + " like"}</h5>
              {this.state.clicked?
              <i className="material-icons waves-effect btn-flat " onClick={this.decrement}>thumb_down</i>:
              <i className="material-icons waves-effect btn-flat pink-text"  onClick={this.increment}>thumb_up</i>}
            </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
    )
  }else{
 return (
    <div className="container center">
    <p>Loading Projects...</p>
    </div>
  )
  }
}
}
const mapStateToProps=(state, ownProps)=>{
  // console.log(state);
  
  const id = ownProps.match.params.id;
  const projects = state.firestore.data.projects;
  const project = projects ? projects[id]: null;
  return{
      project: project,
      auth: state.firebase.auth
   }
}
const mapDispatchToProps=(dispatch)=>{
  return{
      addLike: (id) =>dispatch(addLike(id)), 
      removeLike: (id) =>dispatch(removeLike(id))
    }
}
export default compose(
  connect(mapStateToProps,mapDispatchToProps),
firestoreConnect([
  {collection: 'projects'}
])
)(ProjectDetail);
